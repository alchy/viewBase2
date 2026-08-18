"""Odemykání zabezpečených oken (`secured=True`): TOTP z autentikátoru.

Model (spec 2026-08-18 §Zabezpečená okna): okno s `secured=True` se divákovi
pošle jen jako prázdný rám s výzvou na kód; obsah (HTML, hodnoty polí,
scrollback, PTY) dostane až po ověření. Ověřuje se **TOTP** (Google
Authenticator, 1Password, …) proti tajemství uloženému u uživatele:

    ~/.viewbase/users.json                       (0600) tajemství všech
    ~/.viewbase/user-<jméno>/totp-<jméno>.svg     (0600) QR jako obrázek
    ~/.viewbase/user-<jméno>/totp-<jméno>.txt     (0600) tentýž QR v ASCII

Databáze uživatelů je JEDNA (server ji čte při každém ověření), ale artefakty
KAŽDÉHO uživatele mají vlastní adresář `user-<jméno>/` (0700): QR se dá poslat
jeho majiteli, aniž by šlo omylem přiložit cizí. Všechno je v DOMOVSKÉM
adresáři, ne v projektu – nemůže odejít do gitu ani s kopií repa. Cestu
přesměruje `VIEWBASE_HOME` (testy, kontejnery).

Uživatele instance zvolí vývojář: `vb.Project(user="jindrich")`; bez toho je
to `workbench`. Registrace (tajemství + QR) proběhne při PRVNÍM spuštění
instance, ne až u prvního zamčeného okna – vývojář dostane QR na jednom
očekávatelném místě, hned po startu.

REGISTRACE probíhá v procesu při prvním startu, ne přes HTTP: kdo uvidí QR
kód, může si zaregistrovat vlastní autentikátor, takže se ukazuje jedině
tomu, kdo už na stroj vidí – vytiskne se do KONZOLE SERVERU (ASCII QR) a
uloží jako SVG s právy 0600. Žádný `/api/mfa/setup` endpoint tedy neexistuje;
ověření jde přes existující WS událost `window_unlock` (REST `/api/event`
`window_*`/`shell_*` události odmítá).

Bez balíčků `pyotp`/`qrcode` (extra `pip install viewbase[mfa]`) knihovna
funguje dál: použije se jednorázový kód vypsaný do konzole serveru při
otevření okna – slabší (statický po dobu běhu), ale bez závislostí.

Proti hrubé síle: 6 číslic = milion možností, proto RATE LIMIT (nejvýš
`MAX_ATTEMPTS` pokusů v okně `WINDOW_S`) a ochrana proti opakovanému použití
už spotřebovaného kódu (pyotp ji sám nemá).
"""
from __future__ import annotations

import json
import os
import stat
import threading
import time
from pathlib import Path
from typing import Any, Callable

DEFAULT_USER = "workbench"
ISSUER = "viewbase"
MAX_ATTEMPTS = 5          # pokusů…
WINDOW_S = 30.0           # …za tolik sekund (pak se čeká)
TOTP_VALID_WINDOW = 1     # ±30 s kvůli rozjetým hodinám


def available() -> bool:
    """Je k dispozici TOTP (nainstalovaný extra `viewbase[mfa]`)?"""
    try:
        import pyotp  # noqa: F401
    except ImportError:
        return False
    return True


_active_user = DEFAULT_USER


def active_user() -> str:
    """Uživatel TÉTO instance viewbase (`vb.Project(user=…)`)."""
    return _active_user


def set_active_user(user: str) -> str:
    """Nastav uživatele instance (volá `Project.__init__`)."""
    global _active_user
    _active_user = _safe_user(user)
    return _active_user


def _safe_user(user: str) -> str:
    """Jméno uživatele je součástí NÁZVU ADRESÁŘE, takže se hlídá: prázdné,
    `..` ani lomítka neprojdou (jinak by `user="../.."` psal mimo domov)."""
    name = str(user).strip()
    if not name or name in {".", ".."} or set(name) & set("/\\\0"):
        raise ValueError(f"neplatné jméno uživatele: {user!r}")
    return name


def home() -> Path:
    """Adresář se stavem viewbase (`VIEWBASE_HOME`, jinak `~/.viewbase`)."""
    override = os.environ.get("VIEWBASE_HOME")
    return Path(override) if override else Path.home() / ".viewbase"


def store_path() -> Path:
    return home() / "users.json"


def user_dir(user: str | None = None) -> Path:
    """Adresář artefaktů jednoho uživatele: `~/.viewbase/user-<jméno>/`."""
    return home() / f"user-{_safe_user(user or active_user())}"


def qr_path(user: str | None = None) -> Path:
    """Kam patří jeho QR: `~/.viewbase/user-<jméno>/totp-<jméno>.svg`."""
    name = _safe_user(user or active_user())
    return user_dir(name) / f"totp-{name}.svg"


def qr_text_path(user: str | None = None) -> Path:
    """Tentýž QR v ASCII: `…/totp-<jméno>.txt`. Konzole registraci vypíše jen
    JEDNOU (při prvním startu) a pak je pryč – tohle je ta samá věc k
    naskenování kdykoli později, `cat` stačí. Bez obrázkové prohlížečky a
    přes SSH je to jediná varianta, která funguje vždycky."""
    name = _safe_user(user or active_user())
    return user_dir(name) / f"totp-{name}.txt"


# ---- databáze uživatelů (JSON) ------------------------------------------

_lock = threading.RLock()


def load_users() -> dict[str, dict[str, Any]]:
    """Uživatelé ze souboru; chybí/vadný → prázdno (nikdy nespadne)."""
    path = store_path()
    try:
        data = json.loads(path.read_text("utf-8"))
    except (OSError, ValueError):
        return {}
    return data if isinstance(data, dict) else {}


def save_users(users: dict[str, dict[str, Any]]) -> None:
    """Ulož s právy 0600 (adresář 0700) – tajemství nemá číst nikdo jiný."""
    path = store_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    os.chmod(path.parent, stat.S_IRWXU)
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(users, indent=2, ensure_ascii=False), "utf-8")
    os.chmod(tmp, stat.S_IRUSR | stat.S_IWUSR)
    tmp.replace(path)


def provisioning_uri(user: str, secret: str) -> str:
    """`otpauth://` URI pro autentikátor (QR i ruční zadání)."""
    import pyotp

    return pyotp.TOTP(secret).provisioning_uri(name=user, issuer_name=ISSUER)


def ensure_user(user: str | None = None, *,
                announce: Callable[[str], None] | None = None) -> dict[str, Any]:
    """Vrať záznam uživatele; chybí-li tajemství, vygeneruj ho a ukaž QR.

    QR jde do KONZOLE SERVERU (ASCII) a do `~/.viewbase/user-<jméno>/
    totp-<jméno>.svg` (0600) – tedy jen tomu, kdo na stroj už vidí. Volá se
    při startu instance; bez `pyotp` je to no-op (jednorázové kódy)."""
    if not available():
        return {}
    import pyotp

    user = _safe_user(user or active_user())
    with _lock:
        _migrate_legacy_qr(user)
        users = load_users()
        rec = users.get(user) or {}
        if not rec.get("totp_secret"):
            rec = {
                "totp_secret": pyotp.random_base32(),
                "is_mfa_enabled": True,
                "created": time.strftime("%Y-%m-%dT%H:%M:%S"),
            }
            users[user] = rec
            save_users(users)
            _announce_enrollment(user, rec["totp_secret"], announce)
        return rec


def _migrate_legacy_qr(user: str) -> None:
    """QR z dřívějšího plochého rozvržení (`~/.viewbase/<user>-totp.svg`)
    přesuň do jeho adresáře – ať po aktualizaci nezůstane ležet vedle."""
    legacy = home() / f"{user}-totp.svg"
    target = qr_path(user)
    if not legacy.exists() or target.exists():
        return
    try:
        target.parent.mkdir(parents=True, exist_ok=True)
        os.chmod(target.parent, stat.S_IRWXU)
        legacy.replace(target)
    except OSError:                                     # noqa: BLE001
        pass                                            # QR je bonus


def _announce_enrollment(user: str, secret: str,
                         announce: Callable[[str], None] | None) -> None:
    """Vypiš QR + URI do konzole a ulož SVG (Pillow netřeba)."""
    out = announce or (lambda text: print(text, flush=True))
    uri = provisioning_uri(user, secret)
    lines = [f"viewbase: nový TOTP pro uživatele '{user}' – naskenuj v autentikátoru:"]
    try:
        import io

        import qrcode

        qr = qrcode.QRCode(border=1)
        qr.add_data(uri)
        buf = io.StringIO()
        qr.print_ascii(out=buf, invert=True)
        ascii_qr = buf.getvalue()
        lines.append(ascii_qr)
        folder = user_dir(user)
        folder.mkdir(parents=True, exist_ok=True)
        os.chmod(folder, stat.S_IRWXU)                  # 0700, jen majitel
        svg = qr_path(user)
        img = qrcode.make(uri, image_factory=_svg_factory())
        img.save(str(svg))
        os.chmod(svg, stat.S_IRUSR | stat.S_IWUSR)
        # tentýž QR v ASCII: konzole ho ukáže jen teď, tohle zůstane
        txt = qr_text_path(user)
        txt.write_text(f"{ascii_qr}\nruční zadání: {secret}\n{uri}\n", "utf-8")
        os.chmod(txt, stat.S_IRUSR | stat.S_IWUSR)
        lines.append(f"(QR taky v {svg}\n a ke skenu z konzole: cat {txt})")
    except Exception:                                   # noqa: BLE001
        pass                                            # QR je bonus, URI stačí
    lines.append(f"ruční zadání: {secret}")
    lines.append(uri)
    out("\n".join(lines))


def _svg_factory():
    from qrcode.image.svg import SvgImage

    return SvgImage


# ---- ověření -------------------------------------------------------------

_attempts: dict[str, list[float]] = {}
_used: dict[str, set[str]] = {}


def _throttled(user: str, now: float) -> bool:
    """Rate limit: nejvýš MAX_ATTEMPTS pokusů za WINDOW_S (brute force 6 číslic)."""
    tries = [t for t in _attempts.get(user, []) if now - t < WINDOW_S]
    _attempts[user] = tries
    if len(tries) >= MAX_ATTEMPTS:
        return True
    tries.append(now)
    return False


def verify(code: Any, *, user: str | None = None, now: float | None = None) -> bool:
    """Ověř TOTP kód uživatele. False i při zahlcení pokusy nebo když je kód
    použitý podruhé (jinak by šel v rámci platnosti přehrát)."""
    if not isinstance(code, str) or not code.strip():
        return False
    code = code.strip().replace(" ", "")
    if not available():
        return False
    import pyotp

    user = user or active_user()
    rec = load_users().get(user) or {}
    secret = rec.get("totp_secret")
    if not secret or not rec.get("is_mfa_enabled", True):
        return False
    moment = time.time() if now is None else now
    with _lock:
        if _throttled(user, moment):
            return False
        if code in _used.get(user, set()):              # anti-replay
            return False
        ok = pyotp.TOTP(secret).verify(code, for_time=moment,
                                       valid_window=TOTP_VALID_WINDOW)
        if ok:
            _used.setdefault(user, set()).add(code)
            _attempts[user] = []                        # úspěch limit resetuje
        return ok


def reset_state() -> None:
    """Zapomeň rate limit, použité kódy i uživatele instance (testy, nový
    běh serveru)."""
    global _active_user
    with _lock:
        _attempts.clear()
        _used.clear()
        _active_user = DEFAULT_USER

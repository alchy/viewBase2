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
tomu, kdo už na stroj vidí. Žádný `/api/mfa/setup` endpoint tedy neexistuje;
ověření jde přes existující WS událost `window_unlock` (REST `/api/event`
`window_*`/`shell_*` události odmítá).

DO LOGU NEJDE ŽÁDNÉ TAJEMSTVÍ (uživatelské rozhodnutí): QR, `otpauth://` URI
ani ruční kód se netisknou – jsou jedině v souborech v `~/.viewbase/` s právy
0600. Log říká jen SYSTÉMOVÉ věci: kdo jsou uživatelé, že vznikla registrace
(a kde si ji vyzvednout) a že byl použit token. Jinak by tajemství skončilo v
`docker logs`, v CI artefaktu nebo na sdílené obrazovce.

`pyotp`/`qrcode` jsou STANDARDNÍ závislosti (pyproject). Když přesto chybí –
instance běží v prostředí, kde se nenainstalovaly – knihovna funguje dál a
použije jednorázový kód uložený do souboru; kód z autentikátoru ale nemá kdo
ověřit, tak se to hlásí jako varování (`SecuredMixin.announce_lock`).

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


def _log(level: str, message: str) -> None:
    """Systémová hláška do log okna i do logu serveru – NIKDY s tajemstvím."""
    from .log import bus

    bus.publish(level, "backend_program", message, component="server")


def registered(user: str | None = None) -> bool:
    """Má uživatel zapnuté TOTP tajemství? (Nezávisle na tom, jestli ho má
    tenhle proces čím ověřit – právě ten rozdíl je zajímavý, viz
    `SecuredMixin.announce_lock`.)"""
    rec = load_users().get(user or active_user()) or {}
    return bool(rec.get("totp_secret")) and bool(rec.get("is_mfa_enabled", True))


def describe_users() -> list[str]:
    """Uživatelé pro startovní log: `["jindrich (TOTP)", "hana (bez TOTP)"]`.
    Jen jména a způsob ověření – žádná tajemství."""
    out = []
    for name, rec in sorted(load_users().items()):
        ok = bool(rec.get("totp_secret")) and rec.get("is_mfa_enabled", True)
        out.append(f"{name} ({'TOTP' if ok else 'bez TOTP'})")
    return out


def available() -> bool:
    """Je v TOMHLE prostředí `pyotp`? (Standardní závislost – False znamená
    neúplnou instalaci, ne volbu, viz varování v announce_lock/Project.)"""
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


def onetime_path(window_id: str, user: str | None = None) -> Path:
    """Jednorázový kód okna (fallback bez `pyotp`) – taky do souboru, ne do
    logu: `~/.viewbase/user-<jméno>/onetime-<okno>.txt`."""
    return user_dir(user) / f"onetime-{_safe_user(window_id)}.txt"


def write_secret_file(path: Path, content: str) -> Path:
    """Zapiš tajemství do souboru s právy 0600 (adresář 0700)."""
    path.parent.mkdir(parents=True, exist_ok=True)
    os.chmod(path.parent, stat.S_IRWXU)
    path.write_text(content, "utf-8")
    os.chmod(path, stat.S_IRUSR | stat.S_IWUSR)
    return path


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
        elif not qr_text_path(user).exists():
            # Uživatel z dřívější verze (nebo si soubory smazal): tajemství se
            # NEMĚNÍ, jen se z něj znovu vyrobí QR – jinak by si ho nešlo
            # naskenovat na druhé zařízení, aniž by se musel registrovat znovu.
            _write_artifacts(user, rec["totp_secret"])
            _log("info", f"QR uživatele '{user}' obnoven ze stávajícího "
                         f"tajemství: cat {qr_text_path(user)}")
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
    txt, svg = _write_artifacts(user, secret)
    # Do logu jen UKAZATEL, kde si registraci vyzvednout – žádné tajemství.
    message = (f"nová TOTP registrace pro uživatele '{user}' – naskenuj: "
               f"cat {txt}" + (f" (nebo otevři {svg})" if svg else ""))
    _log("info", message)
    (announce or (lambda text: print(f"viewbase: {text}", flush=True)))(message)


def _write_artifacts(user: str, secret: str) -> tuple[Path, Path | None]:
    """Vyrob QR ze známého tajemství: `.txt` (ASCII QR ke `cat`, funguje i
    přes SSH) a `.svg` (obrázek). Obojí 0600 v adresáři uživatele – nic z toho
    nejde do logu."""
    uri = provisioning_uri(user, secret)
    txt = qr_text_path(user)
    svg: Path | None = qr_path(user)
    write_secret_file(txt, f"ruční zadání: {secret}\n{uri}\n")   # aspoň URI vždy
    try:
        import io

        import qrcode

        qr = qrcode.QRCode(border=1)
        qr.add_data(uri)
        buf = io.StringIO()
        qr.print_ascii(out=buf, invert=True)
        write_secret_file(txt, f"{buf.getvalue()}\nruční zadání: {secret}\n{uri}\n")
        img = qrcode.make(uri, image_factory=_svg_factory())
        img.save(str(svg))
        os.chmod(svg, stat.S_IRUSR | stat.S_IWUSR)
    except Exception:                                   # noqa: BLE001
        svg = None                                      # QR je bonus, URI stačí
    return txt, svg


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

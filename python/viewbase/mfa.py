"""Odemykání zabezpečených oken (`secured=True`): TOTP z autentikátoru.

Model (spec 2026-08-18 §Zabezpečená okna): okno s `secured=True` se divákovi
pošle jen jako prázdný rám s výzvou na kód; obsah (HTML, hodnoty polí,
scrollback, PTY) dostane až po ověření. Ověřuje se **TOTP** (Google
Authenticator, 1Password, …) proti tajemství uloženému u uživatele:

    ~/.viewbase/users.json     {"workbench": {"totp_secret": …,
                                              "is_mfa_enabled": true}}

Práva 0600 (adresář 0700). Soubor je v DOMOVSKÉM adresáři, ne v projektu –
nemůže omylem odejít do gitu ani s kopií repa. Cestu lze přesměrovat
proměnnou `VIEWBASE_HOME` (testy, kontejnery).

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


def home() -> Path:
    """Adresář se stavem viewbase (`VIEWBASE_HOME`, jinak `~/.viewbase`)."""
    override = os.environ.get("VIEWBASE_HOME")
    return Path(override) if override else Path.home() / ".viewbase"


def store_path() -> Path:
    return home() / "users.json"


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


def ensure_user(user: str = DEFAULT_USER, *,
                announce: Callable[[str], None] | None = None) -> dict[str, Any]:
    """Vrať záznam uživatele; chybí-li tajemství, vygeneruj ho a ukaž QR.

    QR jde do KONZOLE SERVERU (ASCII) a do `~/.viewbase/<user>-totp.svg`
    (0600) – tedy jen tomu, kdo na stroj už vidí. Volá se při startu serveru;
    bez `pyotp` je to no-op (padne se na jednorázové kódy)."""
    if not available():
        return {}
    import pyotp

    with _lock:
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
        lines.append(buf.getvalue())
        svg = home() / f"{user}-totp.svg"
        img = qrcode.make(uri, image_factory=_svg_factory())
        img.save(str(svg))
        os.chmod(svg, stat.S_IRUSR | stat.S_IWUSR)
        lines.append(f"(QR taky v {svg})")
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


def verify(code: Any, *, user: str = DEFAULT_USER, now: float | None = None) -> bool:
    """Ověř TOTP kód uživatele. False i při zahlcení pokusy nebo když je kód
    použitý podruhé (jinak by šel v rámci platnosti přehrát)."""
    if not isinstance(code, str) or not code.strip():
        return False
    code = code.strip().replace(" ", "")
    if not available():
        return False
    import pyotp

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
    """Zapomeň rate limit i použité kódy (testy, nový běh serveru)."""
    with _lock:
        _attempts.clear()
        _used.clear()

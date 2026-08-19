"""Odemykání zabezpečených oken (`private=True`): TOTP z autentikátoru.

Model (spec 2026-08-18 §Zabezpečená okna): okno s `private=True` se divákovi
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
ověřit, tak se to hlásí jako varování (`PrivateMixin.announce_lock`).

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
#: Vydavatel v `otpauth://` URI – to, co autentikátor ukáže jako název
#: služby. Velké B schválně: v seznamu na telefonu se „viewBase" pozná na
#: první pohled od čehokoli staršího.
ISSUER = "viewBase"
MAX_ATTEMPTS = 5          # pokusů…
WINDOW_S = 30.0           # …za tolik sekund (pak se čeká)
TOTP_VALID_WINDOW = 1     # ±30 s kvůli rozjetým hodinám


def system_log(level: str, message: str) -> None:
    """Systémová hláška do log okna i do logu serveru – NIKDY s tajemstvím.

    Veřejná schválně: volá ji i `controls.PrivateMixin` (jedna cesta, jak se
    o zámcích hlásí, místo dvou různých)."""
    from .log import bus

    bus.publish(level, "backend_program", message, component="server")


def registered(user: str | None = None) -> bool:
    """Má uživatel zapnuté TOTP tajemství? (Nezávisle na tom, jestli ho má
    tenhle proces čím ověřit – právě ten rozdíl je zajímavý, viz
    `PrivateMixin.announce_lock`.)"""
    rec = load_users().get(user or active_user()) or {}
    return bool(rec.get("totp_secret")) and bool(rec.get("is_mfa_enabled", True))


def describe_users() -> list[str]:
    """Uživatelé pro startovní log: `["jindrich (TOTP)", "hana (bez TOTP)"]`.
    Jen jména a způsob ověření – žádná tajemství."""
    out = []
    for name, rec in sorted(load_users().items()):
        ok = bool(rec.get("totp_secret")) and rec.get("is_mfa_enabled", True)
        out.append(f"{name} ({'TOTP' if ok else 'no TOTP'})")
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


#: Cesta k souboru s politikou (uživatelé, skupiny, práva). `None` = výchozí
#: `~/.viewbase/users.json`; přepíše `vb.Project(users_file=…)`.
_store_override: Path | None = None


def configure_store(path: "str | Path | None") -> Path:
    """Nastav, kde leží soubor s politikou instance (volá `Project`).

    Řízení i zápis práv se dějí v JEDNOM souboru, na který ukazuje
    konfigurace – ne v proměnných prostředí roztroušených po systému.
    Umožní to držet politiku mimo domovský adresář (`/etc/viewbase/…`,
    připojený svazek kontejneru) a zálohovat ji jako jeden objekt."""
    global _store_override
    if path is not None:
        _store_override = Path(path).expanduser()
    return store_path()


def store_path() -> Path:
    return _store_override if _store_override is not None else home() / "users.json"


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


#: Verze formátu souboru politiky.
USERS_VERSION = 2

#: Sekce, ze kterých se soubor politiky skládá. Každou vlastní někdo jiný
#: (`users` tenhle modul, `groups` identity.LocalProvider, `access`
#: identity.LocalPolicy), ale SOUBOR JE JEDEN a jeho jediná autorita je
#: tenhle modul: čte a zapisuje se celý dokument, mění se v něm jen jedna
#: sekce a celé to drží zámek. Kdyby si soubor přepisoval každý vlastník
#: sám, poslední zápis by ostatním sekce smazal – a bez zámku by se dva
#: souběžné zápisy přepsaly i tak, jen vzácněji a hůř dohledatelně.
SECTIONS = ("users", "groups", "access")


def load_store() -> dict[str, Any]:
    """Celý soubor politiky; chybí nebo je vadný → prázdný dokument.

    Nikdy nespadne: bez souboru se instance musí umět rozběhnout a založit
    prvního uživatele."""
    try:
        data = json.loads(store_path().read_text("utf-8"))
    except (OSError, ValueError):
        return {}
    return data if isinstance(data, dict) else {}


def save_store(data: dict[str, Any]) -> None:
    """Zapiš celý soubor politiky s právy 0600 (adresář 0700).

    Atomicky přes `.tmp` + `replace`, aby přerušený zápis nenechal na disku
    půlku souboru s uživateli."""
    path = store_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    os.chmod(path.parent, stat.S_IRWXU)
    data["version"] = USERS_VERSION
    tmp = path.with_suffix(".tmp")
    with _lock:
        tmp.write_text(json.dumps(data, indent=2, ensure_ascii=False), "utf-8")
        os.chmod(tmp, stat.S_IRUSR | stat.S_IWUSR)
        tmp.replace(path)


def update_section(name: str, value: Any) -> None:
    """Přepiš JEDNU sekci souboru a ostatní nech být.

    Čtení a zápis pod jedním zámkem: mezi „načti" a „ulož" se nesmí vejít
    cizí zápis, jinak by si dvě souběžné změny sekce navzájem smazaly."""
    if name not in SECTIONS:
        raise ValueError(f"neznámá sekce souboru politiky: {name!r}")
    with _lock:
        data = load_store()
        data[name] = value
        save_store(data)


def load_users() -> dict[str, dict[str, Any]]:
    """Uživatelé: mapa jméno → záznam (sekce `users`)."""
    users = load_store().get("users")
    return {k: v for k, v in users.items() if isinstance(v, dict)} \
        if isinstance(users, dict) else {}


def save_users(users: dict[str, dict[str, Any]]) -> None:
    """Ulož uživatele; `groups` ani `access` se přitom nedotkne."""
    update_section("users", users)


def account_label(user: str) -> str:
    """Jak se účet jmenuje v autentikátoru: `user:<jméno>`.

    Celý štítek pak vyjde `viewBase:user:jindra` – stejná syntaxe jako
    principál v ACL (`user:jindra`), takže se v telefonu i v konfiguraci
    čte totéž. Odlišuje to taky nové registrace od starších, které měly
    v seznamu jen holé jméno."""
    return f"user:{user}"


def provisioning_uri(user: str, secret: str) -> str:
    """`otpauth://` URI pro autentikátor (QR i ruční zadání)."""
    import pyotp

    return pyotp.TOTP(secret).provisioning_uri(name=account_label(user),
                                               issuer_name=ISSUER)


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
            from .access import ADMINISTRATOR, USERS

            # PRVNÍ uživatel je správce (obdoba root); další dostanou
            # základní skupinu. Vlastní skupinu `group:<jméno>` má každý
            # implicitně, do souboru se nepíše (viz access.user_principals).
            first = not users
            rec = {
                "totp_secret": pyotp.random_base32(),
                "is_mfa_enabled": True,
                # čím je účet podepsaný v autentikátoru; podle toho se pozná,
                # že se štítek změnil a QR se má vyrobit znovu
                "label": account_label(user),
                "groups": [ADMINISTRATOR if first else USERS],
                "created": time.strftime("%Y-%m-%dT%H:%M:%S"),
            }
            users[user] = rec
            save_users(users)
            _announce_enrollment(user, rec["totp_secret"], announce)
        elif (not qr_text_path(user).exists()
                or rec.get("label") != account_label(user)):
            # Uživatel z dřívější verze (nebo si soubory smazal): tajemství se
            # NEMĚNÍ, jen se z něj znovu vyrobí QR – jinak by si ho nešlo
            # naskenovat na druhé zařízení, aniž by se musel registrovat znovu.
            # Totéž při ZMĚNĚ ŠTÍTKU: naskenováním nového QR vznikne v
            # autentikátoru další položka se stejnými kódy, takže se stará dá
            # v klidu smazat a nic se přitom nezneplatní.
            _write_artifacts(user, rec["totp_secret"])
            rec["label"] = account_label(user)
            users[user] = rec
            save_users(users)
            system_log("info", f"QR for user '{user}' regenerated from the existing "
                         f"secret as '{ISSUER}:{account_label(user)}': "
                         f"cat {qr_text_path(user)}")
        return rec


def provision(spec: "list | tuple | dict | None",
              instance_user: str | None = None) -> list[str]:
    """Založ uživatele instance a vyrob jim TOTP + QR. Idempotentní.

    `spec` je seznam jmen (`["jindra", "demo"]`) nebo mapa jméno → skupiny
    (`{"jindra": ["ucetni"], "demo": []}`). Uživatel instance jde na řadu
    PRVNÍ, aby na čisté instalaci dostal `group:administrator` (obdoba
    roota – viz ensure_user).

    Existující uživatel se NEPŘEPISUJE: tajemství zůstane, takže restart
    aplikace nikomu nezneplatní autentikátor. Skupiny se doplní jen tomu,
    kdo teď vzniká – kdo je jednou založený, ten patří konfiguraci
    (`python -m viewbase.admin`), ne kódu aplikace."""
    if isinstance(spec, dict):
        wanted: dict[str, Any] = dict(spec)
    else:
        wanted = {str(j): None for j in (spec or ())}
    if instance_user:
        wanted = {instance_user: wanted.pop(instance_user, None),
                     **wanted}

    created: list[str] = []
    for name, groups in wanted.items():
        name = _safe_user(name)
        is_new = name not in load_users()
        ensure_user(name)
        if is_new:
            created.append(name)
            if groups:
                from .access import principal

                users = load_users()
                users[name]["groups"] = [principal(g) for g in groups]
                save_users(users)
    return created


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
    message = (f"new TOTP enrollment for user '{user}' – scan it: "
               f"cat {txt}" + (f" (or open {svg})" if svg else ""))
    system_log("info", message)
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
#: Použité kódy: (uživatel, účel) → {kód: kdy}. Účel je tam schválně, viz
#: `check()`; časy proto, aby se dalo prořezávat – bez toho by kód zůstal
#: „použitý" navždycky a šestimístná hodnota se časem vrátí.
_used: dict[tuple[str, str], dict[str, float]] = {}

#: Jak dlouho se použitý kód pamatuje: celé okno platnosti i s tolerancí.
_REPLAY_MEMORY = 30.0 * (2 * TOTP_VALID_WINDOW + 1)

#: Výsledky ověření – do logu i do hlášky v prohlížeči. Dřív bylo všechno
#: „invalid code", takže se nedalo poznat spotřebovaný kód od zahlcení
#: pokusy a hledalo se to podle logu naslepo (nalezeno v provozu).
OK = "ok"
BAD_CODE = "bad_code"
REPLAY = "replay"
THROTTLED = "throttled"
NO_SECRET = "no_secret"

#: Co se o tom řekne divákovi (anglicky, jako zbytek hlášek v GUI).
REASONS = {
    BAD_CODE: "Invalid code",
    REPLAY: "That code was already used – wait for the next one",
    THROTTLED: "Too many attempts – wait a moment and try again",
    NO_SECRET: "No authenticator is registered for this user",
}


def _throttled(user: str, now: float) -> bool:
    """Rate limit: nejvýš MAX_ATTEMPTS pokusů za WINDOW_S (brute force 6 číslic)."""
    tries = [t for t in _attempts.get(user, []) if now - t < WINDOW_S]
    _attempts[user] = tries
    if len(tries) >= MAX_ATTEMPTS:
        return True
    tries.append(now)
    return False


def check(code: Any, *, user: str | None = None, purpose: str = "login",
          now: float | None = None) -> str:
    """Ověř TOTP kód a vrať DŮVOD (`OK`, `BAD_CODE`, `REPLAY`, …).

    ÚČEL (`purpose`) rozděluje anti-replay. Jeden a tentýž kód je dnes
    potřeba dvakrát během třiceti sekund – jednou na přihlášení a hned nato
    jako krok navíc u privátního okna – a autentikátor mezitím žádný nový
    nevydá. S jedním společným seznamem použitých kódů druhé ověření vždycky
    selhalo a vypadalo to jako špatný kód (nalezeno v provozu na shell
    okně). Ochrana zůstává tam, kde na ní záleží: TÝŽ kód nejde použít
    dvakrát na TOTÉŽ – přihlásit se dvakrát ani odemknout dvakrát totéž okno.

    Rate limit je naopak společný pro uživatele: je to obrana proti hádání
    šesti číslic a rozdělit ho po účelech by ji zředilo."""
    if not isinstance(code, str) or not code.strip():
        return BAD_CODE
    code = code.strip().replace(" ", "")
    if not available():
        return NO_SECRET
    import pyotp

    user = user or active_user()
    rec = load_users().get(user) or {}
    secret = rec.get("totp_secret")
    if not secret or not rec.get("is_mfa_enabled", True):
        return NO_SECRET
    moment = time.time() if now is None else now
    key = (user, str(purpose))
    with _lock:
        if _throttled(user, moment):
            return THROTTLED
        used_now = {c: t for c, t in _used.get(key, {}).items()
                   if moment - t < _REPLAY_MEMORY}       # prořež, ať neroste
        _used[key] = used_now
        if code in used_now:
            return REPLAY
        ok = pyotp.TOTP(secret).verify(code, for_time=moment,
                                       valid_window=TOTP_VALID_WINDOW)
        if not ok:
            return BAD_CODE
        used_now[code] = moment
        _attempts[user] = []                            # úspěch limit resetuje
        return OK


def verify(code: Any, *, user: str | None = None, purpose: str = "login",
           now: float | None = None) -> bool:
    """Prošel kód? (Zkratka nad `check()`, když důvod nikoho nezajímá.)"""
    return check(code, user=user, purpose=purpose, now=now) == OK


def reset_state() -> None:
    """Zapomeň rate limit, použité kódy, uživatele instance i cestu k souboru
    politiky (testy, nový běh serveru).

    Cesta sem patří taky: je to globální nastavení a nechat ji za sebou
    znamená, že další instance (nebo další test) zapisuje jinam, než čeká –
    nalezeno přesně takhle, po nástroji správce s `--file`."""
    global _active_user, _store_override
    with _lock:
        _attempts.clear()
        _used.clear()
        _active_user = DEFAULT_USER
        _store_override = None

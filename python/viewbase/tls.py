"""TLS pro viewbase: `vb.Tls(cert=…, key=…)` a pravidla, kdy je povinné.

Proč vlastní typ místo dvou stringů v `Project(...)`: certifikát a klíč patří
k sobě a chceme je ověřit HNED při vytvoření projektu (čitelný soubor,
správná práva u klíče), ne až uvnitř uvicornu ve chvíli, kdy uživatel čeká na
otevřený prohlížeč.

KDY JE TLS POVINNÉ (`require_tls`): jakmile server poslouchá jinde než na
loopbacku A na screenech je zabezpečené okno. Odemykací kód i session id
(`vb_sid`, viz sessions.py) jedou po témže spojení jako obsah okna – bez TLS
je odposlechne kdokoli na cestě a zámek okna je pak divadlo. Loopback
zůstává bez TLS schválně: `127.0.0.1` je vývojářský režim, kde certifikát
akorát překáží.

VLASTNÍ CERTIFIKÁT SI VIEWBASE UMÍ VYROBIT SÁM (`tls=True`), stejně jako
vyrábí TOTP a QR při první instanciaci: uloží ho do `~/.viewbase/tls/`
(0600) a při dalších startech ho jen použije, dokud nevyprší. Vygenerovaný
certifikát je **self-signed**, takže ho prohlížeč napoprvé neuzná – buď ho
jednou potvrdíte („Advanced → Proceed"), nebo importujete do důvěryhodných
(macOS: `security add-trusted-cert`). To za vás JavaScript udělat nemůže:
o důvěře rozhoduje prohlížeč a OS, ne stránka. Otisk se proto vypíše do
konzole serveru, aby šlo ověřit, že potvrzujete opravdu náš certifikát.

Do produkce patří certifikát od CA (Let's Encrypt) nebo reverzní proxy;
self-signed je pro vývoj, LAN a uzavřené prostředí.
"""
from __future__ import annotations

import hashlib
import ipaddress
import os
import shutil
import socket
import stat
import subprocess
import time
from dataclasses import dataclass
from pathlib import Path

#: Adresy, kde se TLS nevynucuje (vývoj na vlastním stroji).
LOOPBACK = {"127.0.0.1", "::1", "localhost", ""}


@dataclass(frozen=True)
class Tls:
    """Certifikát a privátní klíč serveru (PEM).

    `vb.Project(host="0.0.0.0", port=8443, tls=vb.Tls("cert.pem", "key.pem"))`
    """

    cert: str | Path
    key: str | Path
    #: volitelná CA pro ověřování KLIENTSKÝCH certifikátů (mTLS); None = vypnuto
    ca: str | Path | None = None

    def __post_init__(self) -> None:
        for description, path in (("cert", self.cert), ("key", self.key),
                             ("ca", self.ca)):
            if path is None:
                continue
            path = Path(path)
            if not path.is_file():
                raise ValueError(f"Tls: {description} soubor neexistuje: {path}")
            if not path.stat().st_size:
                raise ValueError(f"Tls: {description} soubor je prázdný: {path}")
        key_mode = stat.S_IMODE(Path(self.key).stat().st_mode)
        if key_mode & (stat.S_IRWXG | stat.S_IRWXO):
            # Privátní klíč čitelný pro skupinu/ostatní je klasická chyba při
            # kopírování certifikátů; radši hlasitě než tiše.
            raise ValueError(
                f"Tls: privátní klíč {self.key} je čitelný i pro ostatní "
                f"(práva {key_mode:o}) – oprav: chmod 600 {self.key}")

    def uvicorn_kwargs(self) -> dict[str, str]:
        """Parametry pro `uvicorn.Config` (jediné místo, kde se to překládá)."""
        kwargs = {"ssl_certfile": str(self.cert), "ssl_keyfile": str(self.key)}
        if self.ca is not None:
            kwargs["ssl_ca_certs"] = str(self.ca)
        return kwargs

    @property
    def scheme(self) -> str:
        return "https"


def is_loopback(host: str) -> bool:
    """Poslouchá server jen na tomhle stroji?"""
    name = (host or "").strip()
    if name in LOOPBACK:
        return True
    try:
        return ipaddress.ip_address(name).is_loopback
    except ValueError:
        return False


def require_tls(host: str, tls: Tls | None, *, private_windows: bool) -> None:
    """Zkontroluj, že vzdálený přístup k zabezpečeným oknům jede po TLS.

    Vyhodí `ValueError` s návodem – tichý fallback na plaintext by znamenal,
    že kód z autentikátoru i session id jedou po drátě čitelně."""
    if tls is not None or is_loopback(host) or not private_windows:
        return
    raise ValueError(
        f"viewbase: server poslouchá na '{host}' (mimo loopback) a má "
        "zabezpečené okno (private=True), ale běží bez TLS – odemykací kód a "
        "session id by šly po síti čitelně.\n"
        "Buď přidej certifikát:\n"
        "    vb.Project(host=…, port=8443, tls=vb.Tls('cert.pem', 'key.pem'))\n"
        "nebo poslouchej jen lokálně (host='127.0.0.1') a ven to pusť přes "
        "reverzní proxy, která TLS ukončí.")


def scheme_for(tls: Tls | None) -> str:
    return "https" if tls is not None else "http"


# ---- vlastnoručně podepsaný certifikát -----------------------------------

CERT_DAYS = 825            # maximum, které prohlížeče u nových certů berou
RENEW_BEFORE_S = 7 * 86400  # obnov, když zbývá míň než týden


def tls_dir() -> Path:
    """`~/.viewbase/tls/` (respektuje VIEWBASE_HOME jako zbytek stavu)."""
    from . import mfa

    return mfa.home() / "tls"


def fingerprint(cert: Path) -> str:
    """SHA-256 otisk certifikátu ve tvaru, jaký ukazuje prohlížeč."""
    pem = cert.read_bytes()
    start = pem.find(b"-----BEGIN CERTIFICATE-----")
    end = pem.find(b"-----END CERTIFICATE-----")
    if start < 0 or end < 0:
        return "?"
    import base64

    der = base64.b64decode(pem[start + 27:end])
    raw = hashlib.sha256(der).hexdigest().upper()
    return ":".join(raw[i:i + 2] for i in range(0, len(raw), 2))


def _hosts(host: str, extra: "list[str] | tuple[str, ...] | None" = None) -> list[str]:
    """SAN položky certifikátu: loopback + jméno stroje + adresa, na které
    posloucháme + co si vývojář přidá (`tls_hosts=[...]`).

    Bez SAN dnešní prohlížeče certifikát neuznají ani po potvrzení, a co v SAN
    není, to nepokrývá – proto jde seznam rozšířit: `vb.Project(host="0.0.0.0",
    tls=True, tls_hosts=["vb.firma.cz", "10.0.0.5"])`."""
    names = ["localhost", "127.0.0.1", "::1", socket.gethostname()]
    if host and host not in {"0.0.0.0", "::"}:
        names.append(host)
    names.extend(str(h).strip() for h in (extra or ()))
    visited, out = set(), []
    for j in names:
        if j and j not in visited:
            visited.add(j)
            out.append(j)
    return out


def _expires_soon(cert: Path) -> bool:
    """Vyprší certifikát dřív než za týden? (Neplatný soubor = ano.)"""
    openssl = shutil.which("openssl")
    if openssl is None:
        return False                       # neumíme zjistit → nevyhazuj funkční
    done = subprocess.run(
        [openssl, "x509", "-checkend", str(RENEW_BEFORE_S), "-noout",
         "-in", str(cert)], capture_output=True, check=False)
    return done.returncode != 0


def san_names(cert: Path) -> set[str]:
    """Jména a adresy, které certifikát pokrývá (z jeho SAN rozšíření)."""
    openssl = shutil.which("openssl")
    if openssl is None:
        return set()
    done = subprocess.run(
        [openssl, "x509", "-in", str(cert), "-noout", "-ext", "subjectAltName"],
        capture_output=True, check=False, text=True)
    out: set[str] = set()
    for chunk in done.stdout.replace("\n", ",").split(","):
        chunk = chunk.strip()
        for prefix in ("DNS:", "IP Address:", "IP:"):
            if chunk.startswith(prefix):
                out.add(_normalize_host(chunk[len(prefix):].strip()))
    return out


def _normalize_host(host: str) -> str:
    """`0:0:0:0:0:0:0:1` a `::1` je totéž – porovnávej adresy jako adresy."""
    try:
        return str(ipaddress.ip_address(host))
    except ValueError:
        return host.lower()


def self_signed(host: str = "127.0.0.1", *,
                hosts: "list[str] | tuple[str, ...] | None" = None,
                force: bool = False) -> "Tls":
    """Vrať certifikát z `~/.viewbase/tls/`; chybí-li, vyprší nebo NEPOKRÝVÁ
    žádané jméno, vyrob ho znovu.

    Volá se z `Project(tls=True, tls_hosts=[...])`. Stejný model jako u TOTP:
    stav instance vzniká sám při prvním spuštění, do gitu se nedostane (leží
    v domově, 0600) a podruhé se jen použije."""
    folder = tls_dir()
    cert, key = folder / "cert.pem", folder / "key.pem"
    wanted = _hosts(host, hosts)
    if not force and cert.is_file() and key.is_file() and not _expires_soon(cert):
        covered = san_names(cert)
        # Prázdný výsledek = neumíme přečíst (chybí openssl) → nepřegenerovávej
        # funkční certifikát jen proto, že o něm nic nevíme.
        if not covered or {_normalize_host(h) for h in wanted} <= covered:
            return Tls(cert, key)
    _generate(cert, key, wanted)
    from .log import bus

    message = (f"self-signed TLS certificate generated: {cert} "
              f"(SHA-256 {fingerprint(cert)}; covers {', '.join(wanted)})")
    print(f"viewbase: {message}", flush=True)
    bus.publish("info", "backend_program", message, component="server")
    return Tls(cert, key)


def _generate(cert: Path, key: Path, hosts: list[str]) -> None:
    """Vyrob dvojici cert/klíč. `cryptography` (když je), jinak `openssl`."""
    cert.parent.mkdir(parents=True, exist_ok=True)
    os.chmod(cert.parent, stat.S_IRWXU)
    try:
        import cryptography       # noqa: F401  (jen zjišťujeme dostupnost)
    except ImportError:
        # `cryptography` je VOLITELNÁ závislost – bez ní se použije binárka
        # openssl. Kdyby se importovalo až uvnitř generátoru, spolkl by tenhle
        # except i ImportError z jiné příčiny.
        _generate_openssl(cert, key, hosts)
    else:
        _generate_cryptography(cert, key, hosts)
    os.chmod(key, stat.S_IRUSR | stat.S_IWUSR)
    os.chmod(cert, stat.S_IRUSR | stat.S_IWUSR)


def _generate_cryptography(cert: Path, key: Path, hosts: list[str]) -> None:
    from cryptography import x509
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import rsa
    from cryptography.x509.oid import NameOID

    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, hosts[0])])
    san = []
    for h in hosts:
        try:
            san.append(x509.IPAddress(ipaddress.ip_address(h)))
        except ValueError:
            san.append(x509.DNSName(h))
    moment = time.time()
    crt = (x509.CertificateBuilder()
           .subject_name(name).issuer_name(name)
           .public_key(key.public_key())
           .serial_number(x509.random_serial_number())
           .not_valid_before(_utc(moment - 300))
           .not_valid_after(_utc(moment + CERT_DAYS * 86400))
           .add_extension(x509.SubjectAlternativeName(san), critical=False)
           .add_extension(x509.BasicConstraints(ca=False, path_length=None),
                          critical=True)
           .sign(key, hashes.SHA256()))
    key.write_bytes(key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()))
    cert.write_bytes(crt.public_bytes(serialization.Encoding.PEM))


def _utc(ts: float):
    from datetime import datetime, timezone

    return datetime.fromtimestamp(ts, tz=timezone.utc).replace(tzinfo=None)


def _generate_openssl(cert: Path, key: Path, hosts: list[str]) -> None:
    """Fallback bez `cryptography`: binárka openssl (macOS i Linux ji mají)."""
    openssl = shutil.which("openssl")
    if openssl is None:
        raise RuntimeError(
            "viewbase: certifikát nejde vyrobit – chybí `cryptography` i "
            "binárka `openssl`. Buď `pip install cryptography`, nebo předej "
            "vlastní: vb.Project(tls=vb.Tls('cert.pem', 'key.pem'))")
    san = ",".join(
        (f"IP:{h}" if _is_ip(h) else f"DNS:{h}") for h in hosts)
    done = subprocess.run(
        [openssl, "req", "-x509", "-newkey", "rsa:2048", "-nodes",
         "-days", str(CERT_DAYS), "-keyout", str(key), "-out", str(cert),
         "-subj", f"/CN={hosts[0]}", "-addext", f"subjectAltName={san}"],
        capture_output=True, check=False, text=True)
    if done.returncode != 0 or not cert.is_file():
        raise RuntimeError(f"viewbase: openssl selhal: {done.stderr.strip()}")


def _is_ip(host: str) -> bool:
    try:
        ipaddress.ip_address(host)
    except ValueError:
        return False
    return True

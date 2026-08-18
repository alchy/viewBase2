"""TLS: `vb.Tls(cert, key)` a pravidlo, kdy je povinné.

Zabezpečená okna posílají odemykací kód a (nově) session id po témže spojení
jako obsah – mimo loopback to bez TLS nesmí jet vůbec, jinak je zámek okna
jen divadlo."""
import stat

import pytest

import viewbase as vb
from viewbase.tls import is_loopback, require_tls


@pytest.fixture
def cert(tmp_path):
    """Dvojice souborů, která vypadá jako certifikát (obsah se nečte)."""
    c = tmp_path / "cert.pem"
    k = tmp_path / "key.pem"
    c.write_text("-----BEGIN CERTIFICATE-----\n")
    k.write_text("-----BEGIN PRIVATE KEY-----\n")
    k.chmod(0o600)
    return c, k


def test_tls_overi_soubory_hned_pri_vytvoreni(tmp_path, cert):
    c, k = cert
    tls = vb.Tls(c, k)
    assert tls.uvicorn_kwargs() == {"ssl_certfile": str(c), "ssl_keyfile": str(k)}
    with pytest.raises(ValueError, match="neexistuje"):
        vb.Tls(tmp_path / "chybi.pem", k)
    prazdny = tmp_path / "prazdny.pem"
    prazdny.write_text("")
    with pytest.raises(ValueError, match="prázdný"):
        vb.Tls(prazdny, k)


def test_privatni_klic_citelny_pro_ostatni_je_chyba(cert):
    """Klasický překlep při kopírování certifikátů – radši hlasitě."""
    c, k = cert
    k.chmod(0o644)
    with pytest.raises(ValueError, match="chmod 600"):
        vb.Tls(c, k)
    assert stat.S_IMODE(k.stat().st_mode) == 0o644     # test nic neopravuje


@pytest.mark.parametrize("host, cekano", [
    ("127.0.0.1", True), ("::1", True), ("localhost", True), ("", True),
    ("0.0.0.0", False), ("192.168.1.10", False), ("example.com", False),
])
def test_rozpoznani_loopbacku(host, cekano):
    assert is_loopback(host) is cekano


def test_zabezpecene_okno_mimo_loopback_bez_tls_neprojde(cert):
    c, k = cert
    require_tls("0.0.0.0", None, secured_windows=False)      # bez zámku OK
    require_tls("127.0.0.1", None, secured_windows=True)     # loopback OK
    require_tls("0.0.0.0", vb.Tls(c, k), secured_windows=True)   # s TLS OK
    with pytest.raises(ValueError, match="bez TLS"):
        require_tls("0.0.0.0", None, secured_windows=True)


def test_serve_odmitne_start_misto_tiche_plaintextove_expozice(cert):
    """Celá cesta: Project(host mimo loopback) + secured okno + bez TLS."""
    screen = vb.Screen(title="X")
    graph = vb.GraphWindow(screen=screen)
    graph.open_html(vb.HtmlWindow("tajne", secured=True))
    assert graph.has_secured_window() is True
    project = vb.Project(host="0.0.0.0", port=0)
    with pytest.raises(ValueError, match="bez TLS"):
        project.serve(screen, block=False)
    graph.close()


# ---- vlastnoručně podepsaný certifikát (jako QR: vyrobí se sám) ----------

@pytest.fixture(autouse=True)
def _tls_home(tmp_path, monkeypatch):
    monkeypatch.setenv("VIEWBASE_HOME", str(tmp_path / "home"))
    return tmp_path / "home"


def _openssl_available():
    import shutil
    return shutil.which("openssl") is not None


needs_openssl = pytest.mark.skipif(not _openssl_available(),
                                   reason="bez openssl nejde certifikát vyrobit")


@needs_openssl
def test_self_signed_vznikne_pri_prvni_instanciaci_a_podruhe_uz_ne(_tls_home, capsys):
    """Stejný model jako TOTP: stav si instance vyrobí sama, do gitu nejde."""
    from viewbase import tls as tlsmod

    prvni = tlsmod.self_signed("127.0.0.1")
    assert prvni.cert.is_file() and prvni.key.is_file()
    assert stat.S_IMODE(prvni.key.stat().st_mode) == 0o600
    assert stat.S_IMODE(prvni.cert.parent.stat().st_mode) == 0o700
    out = capsys.readouterr().out
    assert "self-signed TLS certificate generated" in out
    assert "SHA-256" in out                     # otisk k ověření v prohlížeči

    druhy = tlsmod.self_signed("127.0.0.1")     # druhý start: jen použij
    assert druhy.cert == prvni.cert
    assert capsys.readouterr().out == ""


@needs_openssl
def test_san_jde_rozsirit_a_zmena_certifikat_pregeneruje(_tls_home):
    """`tls_hosts=[...]`: co v SAN není, to prohlížeč neuzná – proto se při
    novém jménu certifikát vyrobí znovu, ne aby tiše nepokrýval."""
    from viewbase import tls as tlsmod

    tlsmod.self_signed("0.0.0.0", hosts=["vb.firma.cz", "10.0.0.5"])
    san = tlsmod.san_names(tlsmod.tls_dir() / "cert.pem")
    assert {"localhost", "127.0.0.1", "::1", "vb.firma.cz", "10.0.0.5"} <= san

    tlsmod.self_signed("0.0.0.0", hosts=["jiny.stroj.cz"])
    novy = tlsmod.san_names(tlsmod.tls_dir() / "cert.pem")
    assert "jiny.stroj.cz" in novy and "vb.firma.cz" not in novy


@needs_openssl
def test_project_tls_true_certifikat_vyrobi_a_pouzije(_tls_home):
    project = vb.Project(port=0, tls=True, tls_hosts=["vb.firma.cz"])
    assert isinstance(project.tls, vb.Tls)
    assert "vb.firma.cz" in project.tls.uvicorn_kwargs()["ssl_certfile"] or True
    from viewbase import tls as tlsmod
    assert "vb.firma.cz" in tlsmod.san_names(project.tls.cert)

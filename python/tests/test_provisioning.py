"""Zakládání uživatelů při vzniku instance a jejich štítek v autentikátoru.

Dvě věci, které se v provozu poznají hned: že restart aplikace nikomu
nezneplatní autentikátor, a že se nová registrace v telefonu pozná od
starých (`viewBase:user:jindra`, ne holé jméno)."""
import pytest

import viewbase as vb
from viewbase import identity, mfa, sessions

pyotp = pytest.importorskip("pyotp")


@pytest.fixture(autouse=True)
def _domov(tmp_path, monkeypatch):
    monkeypatch.setenv("VIEWBASE_HOME", str(tmp_path))
    mfa.reset_state()
    identity.reset()
    sessions.reset()
    yield tmp_path
    mfa.reset_state()
    identity.reset()


# ---- štítek v autentikátoru ----------------------------------------------

def test_ucet_se_v_autentikatoru_jmenuje_user_jmeno(_domov):
    """`viewBase:user:jindra` – stejná syntaxe jako principál v ACL."""
    zaznam = mfa.ensure_user("jindra")
    uri = mfa.provisioning_uri("jindra", zaznam["totp_secret"])
    assert mfa.ISSUER == "viewBase"
    assert mfa.account_label("jindra") == "user:jindra"
    assert "issuer=viewBase" in uri
    assert "viewBase:user%3Ajindra" in uri          # dvojtečka je zakódovaná


def test_zmena_stitku_vyrobi_nove_QR_ale_NEZMENI_tajemstvi(_domov):
    """Naskenováním nového QR vznikne v telefonu další položka se stejnými
    kódy – stará se dá smazat a nic se přitom nezneplatní."""
    zaznam = mfa.ensure_user("jindra")
    tajemstvi = zaznam["totp_secret"]

    users = mfa.load_users()                        # uživatel ze starší verze
    users["jindra"].pop("label", None)
    mfa.save_users(users)
    mfa.qr_text_path("jindra").unlink()

    znovu = mfa.ensure_user("jindra")
    assert znovu["totp_secret"] == tajemstvi        # autentikátor platí dál
    assert mfa.load_users()["jindra"]["label"] == "user:jindra"
    assert "viewBase:user%3Ajindra" in mfa.qr_text_path("jindra").read_text()


# ---- uživatelé instance ---------------------------------------------------

def test_instance_zalozi_vsechny_uzivatele_a_prvni_je_spravce(_domov, capsys):
    vb.Project(port=0, users=["jindra", "demo"])
    users = mfa.load_users()
    assert set(users) == {"workbench", "jindra", "demo"}
    assert users["workbench"]["groups"] == ["group:administrator"]
    assert users["jindra"]["groups"] == ["group:users"]
    for jmeno in ("workbench", "jindra", "demo"):
        assert mfa.qr_text_path(jmeno).exists()
        assert mfa.qr_path(jmeno).exists()
    out = capsys.readouterr().out
    assert all(j in out for j in ("workbench", "jindra", "demo"))
    assert users["jindra"]["totp_secret"] not in out       # nikdy do konzole


def test_uzivatele_lze_zalozit_rovnou_do_skupin(_domov):
    vb.Project(port=0, users={"jindra": ["ucetni"], "demo": ["hoste"]})
    users = mfa.load_users()
    assert users["jindra"]["groups"] == ["group:ucetni"]
    assert users["demo"]["groups"] == ["group:hoste"]


def test_druhy_start_nikomu_nezmeni_tajemstvi_ani_skupiny(_domov):
    """Restart aplikace nesmí nikoho odregistrovat z autentikátoru."""
    vb.Project(port=0, users=["jindra"])
    users = mfa.load_users()
    users["jindra"]["groups"] = ["group:ucetni"]     # správce to mezitím změnil
    mfa.save_users(users)
    tajemstvi = users["jindra"]["totp_secret"]

    vb.Project(port=0, users={"jindra": ["nesmysl"]})
    znovu = mfa.load_users()["jindra"]
    assert znovu["totp_secret"] == tajemstvi
    assert znovu["groups"] == ["group:ucetni"]       # konfiguraci kód nepřebíjí


def test_uzivatel_instance_vznikne_i_bez_seznamu(_domov):
    vb.Project(port=0)
    assert list(mfa.load_users()) == ["workbench"]

"""TOTP odemykání zabezpečených oken: registrace, ověření, replay, rate limit."""
import json
import os
import stat

import pytest

from viewbase import mfa

pyotp = pytest.importorskip("pyotp")


@pytest.fixture(autouse=True)
def domov(tmp_path, monkeypatch):
    """Každý test má vlastní ~/.viewbase (VIEWBASE_HOME) a čistý rate limit."""
    monkeypatch.setenv("VIEWBASE_HOME", str(tmp_path))
    mfa.reset_state()
    yield tmp_path
    mfa.reset_state()


def test_ensure_user_vytvori_secret_s_pravy_0600_a_je_idempotentni(domov, capsys):
    rec = mfa.ensure_user()
    assert len(rec["totp_secret"]) >= 16 and rec["is_mfa_enabled"] is True
    soubor = domov / "users.json"
    assert stat.S_IMODE(soubor.stat().st_mode) == 0o600
    assert stat.S_IMODE(domov.stat().st_mode) == 0o700
    out = capsys.readouterr().out
    assert "otpauth://totp/viewbase:workbench" in out       # URI pro autentikátor
    assert rec["totp_secret"] in out                        # i ruční zadání
    assert (domov / "workbench-totp.svg").exists()          # QR jako obrázek

    znovu = mfa.ensure_user()                               # druhý start nic nemění
    assert znovu["totp_secret"] == rec["totp_secret"]
    assert capsys.readouterr().out == ""                    # a nic znovu netiskne
    assert json.loads(soubor.read_text())["workbench"]["totp_secret"] == rec["totp_secret"]


def test_spravny_kod_projde_spatny_ne(domov):
    rec = mfa.ensure_user()
    totp = pyotp.TOTP(rec["totp_secret"])
    assert mfa.verify(totp.now()) is True
    mfa.reset_state()
    assert mfa.verify("000000") is False
    assert mfa.verify("") is False and mfa.verify(None) is False


def test_kod_nejde_pouzit_dvakrat(domov):
    rec = mfa.ensure_user()
    kod = pyotp.TOTP(rec["totp_secret"]).now()
    assert mfa.verify(kod) is True
    assert mfa.verify(kod) is False              # replay v rámci platnosti = ne


def test_rate_limit_utne_hrubou_silu(domov):
    rec = mfa.ensure_user()
    for _ in range(mfa.MAX_ATTEMPTS):
        assert mfa.verify("123456") is False
    # i SPRÁVNÝ kód teď neprojde – limit je limit
    assert mfa.verify(pyotp.TOTP(rec["totp_secret"]).now()) is False
    mfa.reset_state()                            # po vypršení okna zase ano
    assert mfa.verify(pyotp.TOTP(rec["totp_secret"]).now()) is True


def test_tolerance_hodin_plus_minus_jedno_okno(domov):
    rec = mfa.ensure_user()
    totp = pyotp.TOTP(rec["totp_secret"])
    ted = 1_700_000_000
    assert mfa.verify(totp.at(ted - 30), now=ted) is True     # server o 30 s napřed
    mfa.reset_state()
    assert mfa.verify(totp.at(ted + 30), now=ted) is True     # a naopak
    mfa.reset_state()
    assert mfa.verify(totp.at(ted + 120), now=ted) is False   # 2 min už ne


def test_vypnuta_mfa_neoveruje(domov):
    mfa.ensure_user()
    users = mfa.load_users()
    kod = pyotp.TOTP(users["workbench"]["totp_secret"]).now()
    users["workbench"]["is_mfa_enabled"] = False
    mfa.save_users(users)
    assert mfa.verify(kod) is False


def test_bez_pyotp_se_mfa_neuplatni(domov, monkeypatch):
    """Bez extra `viewbase[mfa]` knihovna běží dál – padne se na jednorázový
    kód z konzole (verify vrací False, volající použije fallback)."""
    monkeypatch.setattr(mfa, "available", lambda: False)
    assert mfa.verify("123456") is False
    assert mfa.ensure_user() == {}

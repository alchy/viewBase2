"""`secured=True` na JAKÉMKOLI okně: klient dostane jen prázdný rám s výzvou
na kód, obsah až po ověření (TOTP, jinak jednorázový kód z konzole)."""
import time

import pytest

from viewbase import (ControlWindow, GraphWindow, HtmlWindow, ShellWindow,
                      TerminalWindow, mfa)

pyotp = pytest.importorskip("pyotp")


@pytest.fixture(autouse=True)
def domov(tmp_path, monkeypatch):
    monkeypatch.setenv("VIEWBASE_HOME", str(tmp_path))
    mfa.reset_state()
    yield
    mfa.reset_state()


def _kod():
    return pyotp.TOTP(mfa.ensure_user()["totp_secret"]).now()


def _wait(fn, timeout=5.0):
    konec = time.time() + timeout
    while time.time() < konec:
        if fn():
            return True
        time.sleep(0.02)
    return False


def _html():
    w = HtmlWindow("panel", title="Panel", secured=True)
    w.label("tajný text")
    return w


def _control():
    w = ControlWindow("form", title="Form", secured=True)
    w.string("heslo", "Heslo", value="tajne", maxlength=20)
    return w


def _terminal():
    return TerminalWindow("konzole", title="Konzole", secured=True)


@pytest.mark.parametrize("make, otevri, tajemstvi", [
    (_html, "open_html", "tajný text"),
    (_control, "open_window", "tajne"),
    (_terminal, "open_terminal", None),
])
def test_zamcene_okno_neposle_obsah_dokud_se_neodemkne(make, otevri, tajemstvi):
    c = GraphWindow()
    w = make()
    getattr(c, otevri)(w)
    (a,) = c.drain_actions()
    assert a["action"] == "open_window"
    assert a["secured"] is True and a["state"] == "locked"
    assert a["kind"] == "locked"                 # placeholder, ne skutečný typ
    text = repr(a)
    if tajemstvi:
        assert tajemstvi not in text             # obsah v akci NENÍ
    assert "fields" not in a and "html" not in a
    # ve snapshotu (init po reconnectu) taky ne
    (snap,) = [x for x in c.snapshot()["windows"] if x["window_id"] == w.window_id]
    assert snap["kind"] == "locked" and (not tajemstvi or tajemstvi not in repr(snap))

    c.dispatch_event("window_unlock", {"window_id": w.window_id, "code": _kod(),
                                       "client_id": "x"})
    assert _wait(lambda: any(x.get("action") == "open_window" and x.get("kind") != "locked"
                             for x in c.peek_actions()))
    plny = [x for x in c.drain_actions() if x["action"] == "open_window"][-1]
    assert plny["state"] == "open" and plny["kind"] != "locked"
    if tajemstvi:
        assert tajemstvi in repr(plny)           # teď už obsah dorazí
    assert w.state == "open"
    c.close()


def test_spatny_kod_okno_nechá_zamčené():
    c = GraphWindow()
    w = _html()
    c.open_html(w)
    c.drain_actions()
    c.dispatch_event("window_unlock", {"window_id": "panel", "code": "000000",
                                       "client_id": "x"})
    assert _wait(lambda: any(x.get("action") == "window_state" for x in c.peek_actions()))
    a = [x for x in c.drain_actions() if x["action"] == "window_state"][-1]
    assert a["state"] == "locked" and a.get("error")
    assert w.state == "locked"
    c.close()


def test_nezabezpecene_okno_se_otevre_rovnou():
    c = GraphWindow()
    w = HtmlWindow("panel")                       # secured=False (výchozí)
    w.label("běžný obsah")
    c.open_html(w)
    (a,) = c.drain_actions()
    assert a["kind"] == "html" and "běžný obsah" in a["html"]
    assert a.get("secured") is False
    c.close()


def test_shell_je_secured_ve_vychozim_stavu_a_pty_ceka_na_odemceni():
    c = GraphWindow()
    w = ShellWindow("sh", command=["/bin/sh", "-i"])
    c.open_shell(w)
    (a,) = c.drain_actions()
    assert a["kind"] == "locked" and a["secured"] is True
    assert w.pty is None
    c.dispatch_event("window_unlock", {"window_id": "sh", "code": _kod(), "client_id": "x"})
    assert _wait(lambda: w.pty is not None and w.pty.alive)
    c.close_window("sh")
    c.close()


def test_bez_mfa_se_pouzije_jednorazovy_kod_z_konzole(monkeypatch, capsys):
    """Bez `viewbase[mfa]` (nebo bez registrace) okno vypíše jednorázový kód
    do konzole serveru – slabší, ale funkční fallback."""
    monkeypatch.setattr(mfa, "available", lambda: False)
    c = GraphWindow()
    w = _html()
    c.open_html(w)
    c.drain_actions()
    out = capsys.readouterr().out
    assert w.fallback_code and w.fallback_code in out
    c.dispatch_event("window_unlock", {"window_id": "panel", "code": "spatny",
                                       "client_id": "x"})
    time.sleep(0.2)
    assert w.state == "locked"
    c.dispatch_event("window_unlock", {"window_id": "panel", "code": w.fallback_code,
                                       "client_id": "x"})
    assert _wait(lambda: w.state == "open")
    c.close()

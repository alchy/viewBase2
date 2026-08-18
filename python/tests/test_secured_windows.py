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


def test_bez_mfa_se_pouzije_jednorazovy_kod_ze_souboru(monkeypatch, capsys, tmp_path):
    """Bez `viewbase[mfa]` (nebo bez registrace) dostane okno jednorázový kód.
    Je to tajemství jako QR: leží v souboru v `~/.viewbase/` (0600), do logu
    jde jen cesta k němu."""
    monkeypatch.setattr(mfa, "available", lambda: False)
    c = GraphWindow()
    w = _html()
    c.open_html(w)
    c.drain_actions()
    out = capsys.readouterr().out
    soubor = mfa.onetime_path("panel")
    assert w.fallback_code and w.fallback_code not in out    # kód NE do logu
    assert str(soubor) in out                                # jen ukazatel
    assert soubor.read_text().strip() == w.fallback_code
    c.dispatch_event("window_unlock", {"window_id": "panel", "code": "spatny",
                                       "client_id": "x"})
    time.sleep(0.2)
    assert w.state == "locked"
    c.dispatch_event("window_unlock", {"window_id": "panel", "code": w.fallback_code,
                                       "client_id": "x"})
    assert _wait(lambda: w.state == "open")
    c.close()


def test_lock_window_zamkne_odemcene_okno_zpatky(monkeypatch, capsys):
    """Options → „Lock Window": obsah se klientům zase schová (prázdný rám) a
    okno si příště znovu řekne o kód.

    Jede na jednorázovém kódu z konzole (bez TOTP), aby šlo odemknout dvakrát
    po sobě – TOTP kód se v témže třicetisekundovém okně podruhé použít nedá
    (ochrana proti opakovanému použití, viz mfa.verify)."""
    monkeypatch.setattr(mfa, "available", lambda: False)
    c = GraphWindow()
    w = _html()
    c.open_html(w)
    c.drain_actions()
    kod = w.fallback_code
    c.dispatch_event("window_unlock", {"window_id": "panel", "code": kod,
                                       "client_id": "x"})
    assert _wait(lambda: w.state == "open")
    c.drain_actions()
    capsys.readouterr()

    c.dispatch_event("window_lock", {"window_id": "panel", "client_id": "x"})
    assert _wait(lambda: w.state == "locked")
    a = [x for x in c.drain_actions() if x["action"] == "open_window"][-1]
    assert a["kind"] == "locked" and a["state"] == "locked"
    assert "tajný text" not in repr(a)            # obsah zase neputuje
    assert w.locked
    assert str(mfa.onetime_path("panel")) in capsys.readouterr().out   # jen ukazatel

    # a znovu odemknout jde
    c.dispatch_event("window_unlock", {"window_id": "panel", "code": kod,
                                       "client_id": "x"})
    assert _wait(lambda: w.state == "open")
    plny = [x for x in c.drain_actions() if x["action"] == "open_window"][-1]
    assert "tajný text" in repr(plny)             # obsah je zpátky
    c.close()


def test_lock_window_nezabezpecene_okno_ignoruje():
    """Zamknout jde jen okno se `secured=True` – jinak by šlo tichým eventem
    znepřístupnit kterékoli okno (a nebylo by čím ho odemknout)."""
    c = GraphWindow()
    w = HtmlWindow("panel")                       # secured=False
    w.label("běžný obsah")
    c.open_html(w)
    c.drain_actions()
    c.dispatch_event("window_lock", {"window_id": "panel", "client_id": "x"})
    time.sleep(0.2)
    assert w.state == "open" and not w.locked
    assert c.peek_actions() == []
    c.close()


def test_lock_window_shellu_nechá_proces_bezet():
    """Zámek je jako zamčená obrazovka, ne zabití sezení: PTY běží dál, jen
    výstup ke klientům přestane chodit."""
    c = GraphWindow()
    w = ShellWindow("sh", command=["/bin/sh", "-i"])
    c.open_shell(w)
    c.dispatch_event("window_unlock", {"window_id": "sh", "code": _kod(), "client_id": "x"})
    assert _wait(lambda: w.pty is not None and w.pty.alive)
    c.drain_actions()
    c.dispatch_event("window_lock", {"window_id": "sh", "client_id": "x"})
    assert _wait(lambda: w.state == "locked")
    assert w.pty.alive                            # proces žije dál
    w.pty.write("echo zamceno\n")
    time.sleep(0.4)
    assert not [x for x in c.peek_actions() if x.get("action") == "shell_data"]
    c.close_window("sh")
    c.close()


def test_audit_stopa_zamku_je_bez_tajemstvi():
    """Log říká, ŽE byl token použit (a k jakému oknu), ne ČÍM se odemykalo:
    kód ani tajemství se do něj nikdy nedostanou."""
    from viewbase.log import bus

    zaznamy = []
    bus.subscribe(zaznamy.append)
    c = GraphWindow()
    try:
        w = _html()
        c.open_html(w)
        c.drain_actions()
        kod = _kod()
        c.dispatch_event("window_unlock", {"window_id": "panel", "code": "000000",
                                           "client_id": "x"})
        assert _wait(lambda: any("neplatný" in z.message for z in zaznamy))
        c.dispatch_event("window_unlock", {"window_id": "panel", "code": kod,
                                           "client_id": "x"})
        assert _wait(lambda: w.state == "open")
        c.dispatch_event("window_lock", {"window_id": "panel", "client_id": "x"})
        assert _wait(lambda: w.state == "locked")
    finally:
        bus.unsubscribe(zaznamy.append)
        c.close()
    texty = "\n".join(z.message for z in zaznamy)
    assert "neplatný kód k oknu 'panel'" in texty          # odmítnutý pokus
    assert "okno 'panel' odemčeno – token uživatele 'workbench'" in texty
    assert "okno 'panel' zamčeno uživatelem" in texty
    assert kod not in texty and "tajný text" not in texty  # nic tajného
    assert {z.component for z in zaznamy if z.source == "backend_program"} <= {
        "windows", "server"}

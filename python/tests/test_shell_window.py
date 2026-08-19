"""ShellWindow + protokol: zámek (odemykací kód), PTY, scrollback, bezpečnost."""
import sys
import threading
import time

import pytest

from viewbase import GraphWindow, ShellWindow, mfa

pytestmark = pytest.mark.skipif(sys.platform == "win32", reason="POSIX PTY")


#: Relace „prohlížeče" pro testy: grant k zabezpečenému oknu patří RELACI
#: (sessions.py), ne oknu – odemykat se proto musí jménem konkrétního sid,
#: přesně jak to dělá server podle `vb_sid` z prohlížeče.
SID = ""


@pytest.fixture(autouse=True)
def _relace():
    from viewbase import sessions

    global SID
    sessions.reset()
    SID = sessions.store.touch(None)
    yield
    sessions.reset()



@pytest.fixture(autouse=True)
def bez_totp(monkeypatch):
    """Tyhle testy jedou na jednorázovém kódu z konzole (fallback bez TOTP);
    TOTP cestu pokrývá tests/test_private_windows.py."""
    monkeypatch.setattr(mfa, "available", lambda: False)
    mfa.reset_state()


def _wait(fn, timeout=5.0):
    konec = time.time() + timeout
    while time.time() < konec:
        if fn():
            return True
        time.sleep(0.02)
    return False


def test_spec_nese_kind_rozmery_a_zamek():
    w = ShellWindow("sh", title="Shell", cols=100, rows=30, width=800, height=500)
    spec = w.spec()
    assert spec["kind"] == "shell"
    assert (spec["cols"], spec["rows"]) == (100, 30)
    assert (spec["width"], spec["height"]) == (800, 500)
    # co jde ven, když je okno zamčené: prázdný rám, žádný obsah ani kód
    pub = w.public_spec()
    assert pub["kind"] == "locked" and pub["state"] == "locked"
    assert pub["private"] is True
    assert "scrollback" not in pub and "code" not in repr(pub)


def test_open_shell_nespousti_proces_a_ulozi_kod(capsys):
    c = GraphWindow()
    w = ShellWindow("sh")
    c.open_shell(w)
    (a,) = c.drain_actions()
    assert a["action"] == "open_window" and a["kind"] == "locked"
    assert a["state"] == "locked"
    assert w.pty is None                                  # PTY až po odemčení
    out = capsys.readouterr().out
    from viewbase import mfa
    soubor = mfa.onetime_path("sh")
    assert "sh" in out and w.fallback_code not in out     # tajemství ne do logu
    assert str(soubor) in out                             # jen cesta k souboru
    assert soubor.read_text().strip() == w.fallback_code
    assert len(w.fallback_code) >= 6


def test_spatny_kod_neodemkne_spravny_spusti_shell():
    c = GraphWindow()
    w = ShellWindow("sh", command=["/bin/sh", "-i"])
    c.open_shell(w)
    c.drain_actions()

    c.dispatch_event("window_unlock", {"window_id": "sh", "code": "spatny", "client_id": "x", "sid": SID})
    assert _wait(lambda: any(a.get("action") == "window_state" for a in c.peek_actions()), 2.0)
    a = [x for x in c.drain_actions() if x["action"] == "window_state"][-1]
    assert a["state"] == "locked" and a.get("error")
    assert w.pty is None

    c.dispatch_event("window_unlock", {"window_id": "sh", "code": w.fallback_code, "client_id": "x", "sid": SID})
    assert _wait(lambda: w.pty is not None and w.pty.alive)
    assert _wait(lambda: any(x.get("action") == "shell_state" and x.get("state") == "running"
                             for x in c.peek_actions()))
    c.close_window("sh")
    c.close()


def test_vstup_vystup_a_resize_projdou_do_procesu():
    c = GraphWindow()
    w = ShellWindow("sh", command=["/bin/sh", "-i"], cols=80, rows=24)
    c.open_shell(w)
    c.dispatch_event("window_unlock", {"window_id": "sh", "code": w.fallback_code, "client_id": "x", "sid": SID})
    assert _wait(lambda: w.pty is not None and w.pty.alive)

    c.dispatch_event("shell_input", {"window_id": "sh", "data": "echo zdravim-shell\n",
                                     "client_id": "x", "sid": SID})
    assert _wait(lambda: "zdravim-shell" in "".join(
        a.get("data", "") for a in c.peek_actions() if a.get("action") == "shell_data"))

    c.dispatch_event("shell_resize", {"window_id": "sh", "cols": 120, "rows": 40,
                                      "client_id": "x", "sid": SID})
    assert _wait(lambda: (w.pty.cols, w.pty.rows) == (120, 40))
    c.close_window("sh")
    c.close()


def test_scrollback_je_v_init_replay_a_ma_strop():
    c = GraphWindow()
    w = ShellWindow("sh", command=["/bin/sh", "-i"])
    w.MAX_SCROLLBACK = 200
    c.open_shell(w)
    c.dispatch_event("window_unlock", {"window_id": "sh", "code": w.fallback_code, "client_id": "x", "sid": SID})
    assert _wait(lambda: w.pty is not None and w.pty.alive)
    c.dispatch_event("shell_input", {"window_id": "sh",
                                     "data": "printf 'x%.0s' $(seq 1 500); echo KONEC\n",
                                     "client_id": "x", "sid": SID})
    assert _wait(lambda: "KONEC" in w.scrollback)
    assert len(w.scrollback) <= 200                       # ořez zepředu
    # snapshot je PER RELACI: historii dostane ta, která okno odemkla…
    (spec,) = [x for x in c.snapshot(SID)["windows"] if x["kind"] == "shell"]
    assert spec["state"] == "open" and spec["running"] is True
    assert spec["scrollback"].endswith(w.scrollback[-20:])
    # …a cizí relace jen prázdný rám, žádný scrollback
    (cizi,) = [x for x in c.snapshot("jina-relace")["windows"]
               if x["window_id"] == "sh"]
    assert cizi["kind"] == "locked" and "scrollback" not in cizi
    c.close_window("sh")
    c.close()


def test_zavreni_okna_i_grafu_zabije_proces():
    c = GraphWindow()
    w = ShellWindow("sh", command=["/bin/sh", "-c", "sleep 30"])
    c.open_shell(w)
    c.dispatch_event("window_unlock", {"window_id": "sh", "code": w.fallback_code, "client_id": "x", "sid": SID})
    assert _wait(lambda: w.pty is not None and w.pty.alive)
    c.close_window("sh")
    assert _wait(lambda: not w.pty.alive)

    c2 = GraphWindow()
    w2 = ShellWindow("sh2", command=["/bin/sh", "-c", "sleep 30"])
    c2.open_shell(w2)
    c2.dispatch_event("window_unlock", {"window_id": "sh2", "code": w2.fallback_code,
                                       "client_id": "x", "sid": SID})
    assert _wait(lambda: w2.pty is not None and w2.pty.alive)
    c2.close()                                            # konec programu/serveru
    assert _wait(lambda: not w2.pty.alive)


def test_konec_procesu_ohlasi_stav_exited():
    c = GraphWindow()
    w = ShellWindow("sh", command=["/bin/sh", "-c", "exit 7"])
    c.open_shell(w)
    c.dispatch_event("window_unlock", {"window_id": "sh", "code": w.fallback_code, "client_id": "x", "sid": SID})
    assert _wait(lambda: any(a.get("action") == "shell_state" and a.get("state") == "exited"
                             for a in c.peek_actions()))
    assert w.pty is not None and not w.pty.alive     # proces skončil
    c.close()


def test_private_false_spusti_shell_rovnou():
    c = GraphWindow()
    w = ShellWindow("sh", command=["/bin/sh", "-i"], private=False)
    assert w.public_spec()["state"] == "open"
    c.open_shell(w)
    assert _wait(lambda: w.pty is not None and w.pty.alive)
    c.close_window("sh")
    c.close()


def test_rest_api_event_neprijme_shell_eventy():
    """BEZPEČNOST: `/api/event` je bez autentizace – klávesy do shellu smí
    posílat JEN prohlížeč přes WS. Jinak by stačil curl na RCE."""
    from fastapi.testclient import TestClient

    from viewbase import create_app

    c = GraphWindow()
    w = ShellWindow("sh", command=["/bin/sh", "-i"])
    c.open_shell(w)
    c.dispatch_event("window_unlock", {"window_id": "sh", "code": w.fallback_code, "client_id": "x", "sid": SID})
    assert _wait(lambda: w.pty is not None and w.pty.alive)
    with TestClient(create_app(c)) as client:
        for event, payload in [
            ("shell_input", {"window_id": "sh", "data": "echo utok\n"}),
            ("shell_new", {}),
            ("window_unlock", {"window_id": "sh", "code": w.fallback_code}),
            ("window_lock", {"window_id": "sh"}),
            ("shell_resize", {"window_id": "sh", "cols": 10, "rows": 5}),
        ]:
            r = client.post("/api/event", json={"event": event, "payload": payload})
            assert r.status_code == 403, (event, r.status_code)
            assert "rest" in r.json().get("error", "").lower()
    time.sleep(0.4)
    assert "utok" not in w.scrollback                  # nic se do procesu nedostalo
    assert (w.pty.cols, w.pty.rows) == (80, 24)        # ani resize
    c.close_window("sh")
    c.close()


def test_shell_cli_z_gui_otevre_zamcene_okno(capsys):
    """System → Shell CLI: klient si řekne o shell okno; vznikne ZAMČENÉ a
    kód se vypíše do konzole serveru (jako u okna z Pythonu)."""
    c = GraphWindow()
    assert c.config["shell_cli"] is True                  # volba je dostupná vždy
    c.drain_actions()
    c.dispatch_event("shell_new", {"client_id": "x", "sid": SID})
    assert _wait(lambda: any(a.get("action") == "open_window" and a.get("kind") == "locked"
                             for a in c.peek_actions()))
    a = [x for x in c.drain_actions() if x.get("kind") == "locked"][0]
    assert a["state"] == "locked" and a["window_id"] == "cli-1"
    assert a["kind"] == "locked" and a["real_kind"] == "shell"
    # kód jde do konzole serveru (tiskne se v handlerovém vlákně, chvíli počkej)
    assert _wait(lambda: "cli-1" in capsys.readouterr().out)

    c.dispatch_event("shell_new", {"client_id": "x", "sid": SID})     # druhé okno = jiné id
    assert _wait(lambda: any(x.get("window_id") == "cli-2" for x in c.peek_actions()))
    for wid in ("cli-1", "cli-2"):
        c.close_window(wid)
    c.close()


def test_shell_cli_lze_vypnout():
    c = GraphWindow(shell_cli=False)
    assert c.config["shell_cli"] is False
    c.drain_actions()
    c.dispatch_event("shell_new", {"client_id": "x", "sid": SID})
    time.sleep(0.3)
    assert not any(a.get("action") == "open_window" for a in c.peek_actions())
    c.close()

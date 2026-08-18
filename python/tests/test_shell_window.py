"""ShellWindow + protokol: zámek (odemykací kód), PTY, scrollback, bezpečnost."""
import sys
import threading
import time

import pytest

from viewbase import GraphWindow, ShellWindow

pytestmark = pytest.mark.skipif(sys.platform == "win32", reason="POSIX PTY")


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
    assert spec["state"] == "locked"
    assert "code" not in spec and "unlock_code" not in spec   # kód NIKDY klientovi


def test_open_shell_nespousti_proces_a_vypise_kod(capsys):
    c = GraphWindow()
    w = ShellWindow("sh")
    c.open_shell(w)
    (a,) = c.drain_actions()
    assert a["action"] == "open_window" and a["kind"] == "shell"
    assert a["state"] == "locked"
    assert w.pty is None                                  # PTY až po odemčení
    out = capsys.readouterr().out
    assert "sh" in out and w.unlock_code in out           # kód jen do konzole serveru
    assert len(w.unlock_code) >= 6


def test_spatny_kod_neodemkne_spravny_spusti_shell():
    c = GraphWindow()
    w = ShellWindow("sh", command=["/bin/sh", "-i"])
    c.open_shell(w)
    c.drain_actions()

    c.dispatch_event("shell_unlock", {"window_id": "sh", "code": "spatny", "client_id": "x"})
    assert _wait(lambda: any(a.get("action") == "shell_state" for a in c.peek_actions()), 2.0)
    a = [x for x in c.drain_actions() if x["action"] == "shell_state"][-1]
    assert a["state"] == "locked" and a.get("error")
    assert w.pty is None

    c.dispatch_event("shell_unlock", {"window_id": "sh", "code": w.unlock_code, "client_id": "x"})
    assert _wait(lambda: w.pty is not None and w.pty.alive)
    assert _wait(lambda: any(x.get("action") == "shell_state" and x.get("state") == "running"
                             for x in c.peek_actions()))
    c.close_window("sh")
    c.close()


def test_vstup_vystup_a_resize_projdou_do_procesu():
    c = GraphWindow()
    w = ShellWindow("sh", command=["/bin/sh", "-i"], cols=80, rows=24)
    c.open_shell(w)
    c.dispatch_event("shell_unlock", {"window_id": "sh", "code": w.unlock_code, "client_id": "x"})
    assert _wait(lambda: w.pty is not None and w.pty.alive)

    c.dispatch_event("shell_input", {"window_id": "sh", "data": "echo zdravim-shell\n",
                                     "client_id": "x"})
    assert _wait(lambda: "zdravim-shell" in "".join(
        a.get("data", "") for a in c.peek_actions() if a.get("action") == "shell_data"))

    c.dispatch_event("shell_resize", {"window_id": "sh", "cols": 120, "rows": 40,
                                      "client_id": "x"})
    assert _wait(lambda: (w.pty.cols, w.pty.rows) == (120, 40))
    c.close_window("sh")
    c.close()


def test_scrollback_je_v_init_replay_a_ma_strop():
    c = GraphWindow()
    w = ShellWindow("sh", command=["/bin/sh", "-i"])
    w.MAX_SCROLLBACK = 200
    c.open_shell(w)
    c.dispatch_event("shell_unlock", {"window_id": "sh", "code": w.unlock_code, "client_id": "x"})
    assert _wait(lambda: w.pty is not None and w.pty.alive)
    c.dispatch_event("shell_input", {"window_id": "sh",
                                     "data": "printf 'x%.0s' $(seq 1 500); echo KONEC\n",
                                     "client_id": "x"})
    assert _wait(lambda: "KONEC" in w.scrollback)
    assert len(w.scrollback) <= 200                       # ořez zepředu
    (spec,) = [x for x in c.snapshot()["windows"] if x["kind"] == "shell"]
    assert spec["state"] == "running"
    assert spec["scrollback"].endswith(w.scrollback[-20:])
    c.close_window("sh")
    c.close()


def test_zavreni_okna_i_grafu_zabije_proces():
    c = GraphWindow()
    w = ShellWindow("sh", command=["/bin/sh", "-c", "sleep 30"])
    c.open_shell(w)
    c.dispatch_event("shell_unlock", {"window_id": "sh", "code": w.unlock_code, "client_id": "x"})
    assert _wait(lambda: w.pty is not None and w.pty.alive)
    c.close_window("sh")
    assert _wait(lambda: not w.pty.alive)

    c2 = GraphWindow()
    w2 = ShellWindow("sh2", command=["/bin/sh", "-c", "sleep 30"])
    c2.open_shell(w2)
    c2.dispatch_event("shell_unlock", {"window_id": "sh2", "code": w2.unlock_code,
                                       "client_id": "x"})
    assert _wait(lambda: w2.pty is not None and w2.pty.alive)
    c2.close()                                            # konec programu/serveru
    assert _wait(lambda: not w2.pty.alive)


def test_konec_procesu_ohlasi_stav_exited():
    c = GraphWindow()
    w = ShellWindow("sh", command=["/bin/sh", "-c", "exit 7"])
    c.open_shell(w)
    c.dispatch_event("shell_unlock", {"window_id": "sh", "code": w.unlock_code, "client_id": "x"})
    assert _wait(lambda: any(a.get("action") == "shell_state" and a.get("state") == "exited"
                             for a in c.peek_actions()))
    assert w.state == "exited"
    c.close()


def test_unlock_none_spusti_shell_rovnou():
    c = GraphWindow()
    w = ShellWindow("sh", command=["/bin/sh", "-i"], unlock=None)
    assert w.spec()["state"] == "running"
    c.open_shell(w)
    assert _wait(lambda: w.pty is not None and w.pty.alive)
    c.close_window("sh")
    c.close()

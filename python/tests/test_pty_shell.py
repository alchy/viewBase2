"""PtyShell – systémová vrstva shell okna (bez znalosti protokolu).

Testy pouštějí skutečné procesy přes PTY; jsou POSIX-only (na Windows se
přeskočí, tam je ConPTY a jiná implementace)."""
import os
import sys
import threading
import time

import pytest

from viewbase.pty_shell import PtyShell

pytestmark = pytest.mark.skipif(sys.platform == "win32", reason="POSIX PTY")


class Sink:
    """Sbírá výstup z PTY a umí počkat, až v něm něco bude."""

    def __init__(self):
        self.text = ""
        self.exited = threading.Event()
        self.code = None
        self._lock = threading.Lock()

    def on_data(self, chunk):
        with self._lock:
            self.text += chunk

    def on_exit(self, code):
        self.code = code
        self.exited.set()

    def wait_for(self, needle, timeout=5.0):
        konec = time.time() + timeout
        while time.time() < konec:
            with self._lock:
                if needle in self.text:
                    return True
            time.sleep(0.02)
        return False


def test_echo_projde_pty_a_proces_skonci():
    s = Sink()
    sh = PtyShell(["/bin/sh", "-c", "echo ahoj-pty"], on_data=s.on_data, on_exit=s.on_exit)
    sh.start()
    assert s.wait_for("ahoj-pty"), s.text
    assert s.exited.wait(5.0)
    assert s.code == 0
    assert not sh.alive


def test_write_posila_klavesy_do_shellu():
    s = Sink()
    sh = PtyShell(["/bin/sh", "-i"], on_data=s.on_data, on_exit=s.on_exit)
    sh.start()
    sh.write("echo z-klavesnice\n")
    assert s.wait_for("z-klavesnice"), s.text
    sh.terminate()
    assert s.exited.wait(5.0)


def test_program_vidi_terminal_a_jeho_rozmery():
    """PTY = program si myslí, že má terminál (jinak by `tty` řekl 'not a tty')
    a vidí zadané cols/rows; resize pošle SIGWINCH → nové rozměry."""
    s = Sink()
    sh = PtyShell(["/bin/sh", "-i"], cols=100, rows=30, on_data=s.on_data, on_exit=s.on_exit)
    sh.start()
    sh.write("tty; stty size\n")
    assert s.wait_for("100"), s.text          # `stty size` → "30 100"
    assert "not a tty" not in s.text
    sh.resize(120, 40)
    time.sleep(0.2)
    sh.write("stty size\n")
    assert s.wait_for("120"), s.text
    sh.terminate()


def test_cwd_a_env_se_predaji():
    s = Sink()
    sh = PtyShell(["/bin/sh", "-c", "pwd; echo $VB_TEST"], cwd="/tmp",
                  env={**os.environ, "VB_TEST": "hodnota-42"},
                  on_data=s.on_data, on_exit=s.on_exit)
    sh.start()
    assert s.wait_for("hodnota-42"), s.text
    assert "/tmp" in s.text or "/private/tmp" in s.text     # macOS symlink
    assert s.exited.wait(5.0)


def test_terminate_zabije_i_dlouhy_proces():
    s = Sink()
    sh = PtyShell(["/bin/sh", "-c", "sleep 30"], on_data=s.on_data, on_exit=s.on_exit)
    sh.start()
    assert sh.alive
    sh.terminate()
    assert s.exited.wait(5.0)
    assert not sh.alive


def test_utf8_rozseknute_mezi_chunky_se_nerozbije():
    """Dekodér drží stav mezi čteními – vícebajtový znak na hranici chunku
    nesmí skončit jako 'replacement character'."""
    s = Sink()
    text = "ěščřžýáíé" * 500                       # jistě přeteče jeden read()
    sh = PtyShell(["/bin/sh", "-c", f"printf '%s' '{text}'"],
                  on_data=s.on_data, on_exit=s.on_exit)
    sh.start()
    assert s.exited.wait(5.0)
    time.sleep(0.2)
    assert "�" not in s.text
    assert s.text.count("ě") == 500


def test_start_dvakrat_je_chyba_a_write_pred_startem_taky():
    s = Sink()
    sh = PtyShell(["/bin/sh", "-c", "sleep 1"], on_data=s.on_data, on_exit=s.on_exit)
    with pytest.raises(RuntimeError):
        sh.write("x")
    sh.start()
    with pytest.raises(RuntimeError):
        sh.start()
    sh.terminate()

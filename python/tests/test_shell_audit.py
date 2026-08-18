"""Auditní stopa příkazů v shell okně.

Co se loguje: řádek, který divák do okna napsal, spolu s DVĚMA identitami –
uživatelem viewbase (kdo okno odemkl) a uživatelem OS (pod kým proces
skutečně běží). To druhé odemčení ve workbenchi nemění."""
import time

import pytest

from viewbase import GraphWindow, ShellWindow, mfa, sessions
from viewbase.log import bus
from viewbase.pty_shell import PtyShell


@pytest.fixture(autouse=True)
def _bez_totp(monkeypatch, tmp_path):
    monkeypatch.setenv("VIEWBASE_HOME", str(tmp_path))
    monkeypatch.setattr(mfa, "available", lambda: False)
    sessions.reset()
    yield
    sessions.reset()


@pytest.fixture
def zaznamy():
    sebrane = []
    bus.subscribe(sebrane.append)
    yield sebrane
    bus.unsubscribe(sebrane.append)


def _prikazy(zaznamy):
    """Příkazy z auditní stopy; v logu jsou ohraničené `command='…'`, aby
    šlo poznat, kde sekvence končí (parser i člověk)."""
    import re

    return [m.group(1) for z in zaznamy
            if (m := re.search(r"command='(.*)'$", z.message))]


def _wait(fn, timeout=6.0):
    konec = time.time() + timeout
    while time.time() < konec:
        if fn():
            return True
        time.sleep(0.05)
    return False


# ---- skládání řádku (bez PTY) --------------------------------------------

def test_radek_se_sklada_az_do_enteru():
    videno = []
    sh = PtyShell.__new__(PtyShell)          # bez startu procesu
    sh.on_command, sh._radek = videno.append, []
    sh._audit("ls -la")
    assert videno == []                       # bez Enteru se nehlásí nic
    sh._audit("\n")
    assert videno == ["ls -la"]


def test_backspace_maze_a_ctrl_c_zahodi():
    videno = []
    sh = PtyShell.__new__(PtyShell)
    sh.on_command, sh._radek = videno.append, []
    sh._audit("rm -rf /tmpX\x7f\n")           # překlep smazaný Backspacem
    sh._audit("tajny zacatek\x03echo ok\n")   # Ctrl-C zahodí rozepsané
    assert videno == ["rm -rf /tmp", "echo ok"]


def test_ridici_sekvence_se_do_prikazu_nedostanou():
    videno = []
    sh = PtyShell.__new__(PtyShell)
    sh.on_command, sh._radek = videno.append, []
    sh._audit("echo \x1b[2J utok\n")          # ESC by přepsal terminál čtenáře
    assert videno == ["echo [2J utok"]
    assert "\x1b" not in videno[0]


# ---- celá cesta se skutečným shellem -------------------------------------

def test_prikaz_se_zaloguje_s_obema_identitami(zaznamy):
    import getpass

    c = GraphWindow()
    w = ShellWindow("sh", command=["/bin/bash", "--norc", "-i"])
    c.open_shell(w)
    sid = sessions.store.touch(None)
    c.dispatch_event("window_unlock", {"window_id": "sh", "code": w.fallback_code,
                                       "sid": sid, "remote_ip": "89.24.1.2"})
    assert _wait(lambda: w.pty is not None and w.pty.alive)
    c.dispatch_event("shell_input", {"window_id": "sh", "data": "whoami\n",
                                     "sid": sid, "remote_ip": "89.24.1.2"})
    assert _wait(lambda: _prikazy(zaznamy) == ["whoami"])

    (radek,) = [z for z in zaznamy if "' command by " in z.message]
    assert radek.component == "security"          # audit, ne diagnostika
    assert "by 'workbench'" in radek.message      # uživatel viewbase
    assert f"os user '{getpass.getuser()}'" in radek.message   # uživatel OS
    assert "89.24.1.2" in radek.message           # odkud
    c.close_window("sh")
    c.close()


def test_audit_jde_vypnout(zaznamy):
    c = GraphWindow()
    w = ShellWindow("sh", command=["/bin/bash", "--norc", "-i"],
                    audit_commands=False)
    c.open_shell(w)
    sid = sessions.store.touch(None)
    c.dispatch_event("window_unlock", {"window_id": "sh", "code": w.fallback_code,
                                       "sid": sid})
    assert _wait(lambda: w.pty is not None and w.pty.alive)
    c.dispatch_event("shell_input", {"window_id": "sh", "data": "whoami\n",
                                     "sid": sid})
    time.sleep(0.6)
    assert _prikazy(zaznamy) == []
    c.close_window("sh")
    c.close()


def test_apostrof_v_prikazu_nerozbije_ohraniceni(zaznamy):
    """`echo 'ahoj'` nesmí rozseknout `command='…'` v půlce."""
    c = GraphWindow()
    w = ShellWindow("sh", command=["/bin/bash", "--norc", "-i"])
    c.open_shell(w)
    sid = sessions.store.touch(None)
    c.dispatch_event("window_unlock", {"window_id": "sh", "code": w.fallback_code,
                                       "sid": sid})
    assert _wait(lambda: w.pty is not None and w.pty.alive)
    c.dispatch_event("shell_input", {"window_id": "sh", "data": "echo 'ahoj'\n",
                                     "sid": sid})
    assert _wait(lambda: _prikazy(zaznamy) == ["echo [quote]ahoj[quote]"])
    (radek,) = [z for z in zaznamy if "command=" in z.message]
    assert radek.message.count("command='") == 1
    assert radek.message.endswith("'")
    c.close_window("sh")
    c.close()

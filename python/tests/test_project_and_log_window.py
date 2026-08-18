"""Explicitní workflow (fopen→close analogie): Project drží službu/port,
Screen je plocha, okna jsou typované instance – LogWindow je systémové
okno umístěné na screen explicitně."""
import pytest

import viewbase as vb
from viewbase.screen import reset_allocator


@pytest.fixture(autouse=True)
def _reset():
    reset_allocator()
    yield
    reset_allocator()


# ---- LogWindow: systémové okno, umístění přes init snapshot ---------------

def test_log_window_before_graph_lands_in_snapshot_config():
    screen = vb.Screen(title="A")
    vb.LogWindow(screen=screen)               # dřív, než existuje graf
    graph = vb.GraphWindow(screen=screen)
    assert graph.snapshot()["config"]["log_window"] is True


def test_log_window_after_graph_lands_in_snapshot_config():
    screen = vb.Screen(title="A")
    graph = vb.GraphWindow(screen=screen)
    vb.LogWindow(screen=screen)
    assert graph.snapshot()["config"]["log_window"] is True


def test_without_log_window_config_has_no_flag():
    graph = vb.GraphWindow(screen=vb.Screen(title="A"))
    assert "log_window" not in graph.snapshot()["config"]


def test_log_window_requires_screen():
    with pytest.raises(ValueError):
        vb.LogWindow(screen="ne-screen")


# ---- Screen.graph + Project.serve mapování --------------------------------

def test_screen_graph_property():
    screen = vb.Screen(title="A")
    assert screen.graph is None
    graph = vb.GraphWindow(screen=screen)
    assert screen.graph is graph


def test_screen_without_graph_gets_hidden_host():
    """Graf je na screenu VOLITELNÝ: screen jen s log oknem se nese přes
    skrytého hostitele (config.graph_window=False) – frontend pro něj
    grafové okno nevytvoří."""
    screen = vb.Screen(title="Jen log")
    vb.LogWindow(screen=screen)
    with vb.Project(port=0) as project:
        handle = project.serve(screen, block=False)
        assert handle.port > 0
    host = screen.graph                     # založil ho Project.serve
    snapshot = host.snapshot()
    assert snapshot["config"]["graph_window"] is False
    assert snapshot["config"]["log_window"] is True
    assert snapshot["config"]["title"] == "Jen log"


def test_project_serve_rejects_non_screen():
    project = vb.Project(port=0)
    with pytest.raises(ValueError):
        project.serve("ne-screen")


def test_project_serves_screen_and_closes_port_like_a_file():
    """fopen→close: serve(screen) otevře listener, stop() ho zavře."""
    screen = vb.Screen(title="A")
    graph = vb.GraphWindow(screen=screen)
    graph.add_node("a")
    with vb.Project(port=0) as project:       # port=0: efemérní, bez kolizí
        handle = project.serve(screen, block=False)
        assert handle.port > 0
    # po with bloku je port zavřený a graf uklizený
    assert graph._closed is True


def test_project_zaregistruje_uzivatele_pri_prvnim_startu(tmp_path, monkeypatch, capsys):
    """`vb.Project(user=…)` = uživatel instance: tajemství a QR vzniknou při
    PRVNÍM startu (jedno očekávatelné místo), podruhé už se netisknou."""
    pytest.importorskip("pyotp")
    from viewbase import mfa

    monkeypatch.setenv("VIEWBASE_HOME", str(tmp_path))
    mfa.reset_state()
    try:
        screen = vb.Screen(title="Provoz")
        vb.GraphWindow(screen=screen)
        with vb.Project(port=0, user="hana") as project:
            project.serve(screen, block=False)
        assert (tmp_path / "user-hana" / "totp-hana.svg").exists()
        assert "otpauth://totp/viewbase:hana" in capsys.readouterr().out

        screen2 = vb.Screen(title="Provoz")
        vb.GraphWindow(screen=screen2)
        with vb.Project(port=0, user="hana") as project:
            project.serve(screen2, block=False)
        assert capsys.readouterr().out == ""          # druhý start mlčí
    finally:
        mfa.reset_state()

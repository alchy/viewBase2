"""Registr oken: jedna mapa `window_id → okno` místo čtyř podle typu.

Testuje se chování, které čtyři paralelní mapy buď nezvládaly, nebo u nich
záviselo na pořadí dotazů."""
import pytest

from viewbase import (ControlWindow, GraphWindow, HtmlWindow, ShellWindow,
                      TerminalWindow, sessions)
from viewbase.window_registry import WindowRegistry


@pytest.fixture(autouse=True)
def _cista_tabulka():
    sessions.reset()
    yield
    sessions.reset()


def test_registr_hlida_typ_pri_cteni():
    reg = WindowRegistry()
    reg.add(HtmlWindow("panel"))
    assert isinstance(reg.get("panel"), HtmlWindow)
    assert reg.get("panel", HtmlWindow) is not None
    assert reg.get("panel", ShellWindow) is None      # cizí typ = jako by nebylo
    assert reg.get("neexistuje") is None
    assert "panel" in reg and len(reg) == 1


def test_stejne_id_nemuze_zit_ve_dvou_typech():
    """Se čtyřmi mapami mohlo totéž id existovat dvakrát a která „platila",
    záviselo na pořadí dotazů."""
    reg = WindowRegistry()
    reg.add(HtmlWindow("okno"))
    reg.add(TerminalWindow("okno"))
    assert len(reg) == 1
    assert isinstance(reg.get("okno"), TerminalWindow)


def test_of_kind_a_all():
    reg = WindowRegistry()
    reg.add(HtmlWindow("a")); reg.add(TerminalWindow("b")); reg.add(HtmlWindow("c"))
    assert sorted(reg.of_kind(HtmlWindow)) == ["a", "c"]
    assert list(reg.all()) == ["a", "b", "c"]          # pořadí vzniku
    assert reg.remove("b") is not None and reg.remove("b") is None


def test_close_window_umi_i_terminal():
    """Dřív šel zavřít control, HTML a shell, ale terminál spadl na ValueError,
    přestože zavírací gadget má taky."""
    c = GraphWindow()
    c.open_terminal(TerminalWindow("konzole"))
    c.drain_actions()
    c.close_window("konzole")
    (akce,) = c.drain_actions()
    assert akce == {"action": "close_window", "window_id": "konzole"}
    with pytest.raises(ValueError):
        c.close_window("konzole")                      # podruhé už není co
    c.close()


def test_zavreni_okna_zrusi_granty_relaci():
    """Jinak by se nové okno se stejným `window_id` odemklo samo."""
    c = GraphWindow()
    w = HtmlWindow("mzdy", secured=True)
    w.label("tajné")
    c.open_html(w)
    sid = sessions.store.touch(None)
    sessions.store.grant(sid, "mzdy")
    assert sessions.store.has(sid, "mzdy") is True

    c.close_window("mzdy")
    assert sessions.store.has(sid, "mzdy") is False
    c.close()


def test_vsechny_typy_oken_sdileji_jeden_prostor_id():
    c = GraphWindow()
    c.open_window(ControlWindow("x"))
    c.open_html(HtmlWindow("y"))
    c.open_terminal(TerminalWindow("z"))
    assert sorted(c._secured_windows()) == ["x", "y", "z"]      # noqa: SLF001
    assert len(c.snapshot()["windows"]) == 3
    c.close()

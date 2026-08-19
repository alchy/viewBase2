"""Autorizace událostí je vlastnost REGISTRACE, ne disciplíny autora.

Pět z devíti událostí kdysi grant neověřovalo a nikdo si toho nevšiml,
protože se to řešilo v každém handleru zvlášť. Tenhle test hlídá, že to tak
znovu nedopadne: registr se dá přečíst a projít strojově."""
import time

import pytest

from viewbase import GraphWindow, HtmlWindow, ShellWindow, mfa, sessions
from viewbase.events_mixin import NEEDS, Needs
from viewbase.log import bus

#: Co která vestavěná událost potřebuje. Když někdo přidá desátou, test
#: spadne a donutí ho rozhodnout se – to je jeho smysl.
OCEKAVANE = {
    "window_submit": Needs.GRANT,
    "terminal_input": Needs.GRANT,
    "html_event": Needs.GRANT,
    "shell_input": Needs.GRANT,
    "shell_resize": Needs.GRANT,
    "window_lock": Needs.GRANT,
    "window_unlock": Needs.NONE,     # cesta, jak grant získat (kód + rate limit)
    "shell_new": Needs.NONE,         # okno vzniká zamčené, platí strop
    "menu_select": Needs.NONE,       # autorský callback, žádné tajemství
}


@pytest.fixture(autouse=True)
def _prostredi(monkeypatch, tmp_path):
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


def test_kazda_vestavena_udalost_ma_deklaraci():
    c = GraphWindow()
    try:
        registr = dict(c._event_needs)                    # noqa: SLF001
        for jmeno, needs in OCEKAVANE.items():
            assert registr.get(jmeno) == needs, f"{jmeno}: {registr.get(jmeno)}"
        assert set(registr.values()) <= NEEDS
    finally:
        c.close()


def test_registrace_bez_deklarace_neprojde():
    """Nová událost se nedá přidat, aniž by autor tu otázku zodpověděl."""
    c = GraphWindow()
    try:
        with pytest.raises(TypeError):                    # chybí keyword needs
            c._register("nova_udalost", lambda e: None)   # noqa: SLF001
        with pytest.raises(ValueError, match="needs musí být"):
            c._register("nova", lambda e: None, needs="mozna")   # noqa: SLF001
    finally:
        c.close()


def test_grant_se_vynucuje_v_dispatchi_ne_v_handleru(zaznamy):
    """Handler se k zabezpečenému oknu bez grantu vůbec nedostane."""
    videno = []
    c = GraphWindow()
    try:
        w = HtmlWindow("panel", private=True)
        w.label("tajné")
        c.open_html(w)
        c._register("html_event", lambda e: videno.append(e),   # noqa: SLF001
                    needs=Needs.GRANT)

        c.dispatch_event("html_event", {"window_id": "panel", "event": "klik",
                                        "sid": "cizi", "remote_ip": "89.24.1.2"})
        time.sleep(0.3)
        assert videno == []                                # handler se nespustil
        assert [z for z in zaznamy if "refused" in z.message]

        sid = sessions.store.touch(None)
        sessions.store.grant(sid, "panel")
        c.dispatch_event("html_event", {"window_id": "panel", "event": "klik",
                                        "sid": sid})
        time.sleep(0.3)
        assert len(videno) == 1                            # s grantem projde
    finally:
        c.close()


def test_nezabezpecene_okno_grant_nepotrebuje():
    videno = []
    c = GraphWindow()
    try:
        c.open_html(HtmlWindow("verejne"))
        c._register("html_event", lambda e: videno.append(e),   # noqa: SLF001
                    needs=Needs.GRANT)
        c.dispatch_event("html_event", {"window_id": "verejne", "event": "klik"})
        time.sleep(0.3)
        assert len(videno) == 1
    finally:
        c.close()


def test_uzivatelske_udalosti_grant_neresi():
    """`@graph.on(...)` si zavádí autor sám; knihovna nemá jak poznat, jestli
    sahají na okno."""
    c = GraphWindow()
    try:
        c.on("moje", lambda e: None)
        assert c._event_needs["moje"] == Needs.NONE        # noqa: SLF001
        c.on_click(lambda e: None)
        assert c._event_needs["node_click"] == Needs.NONE  # noqa: SLF001
    finally:
        c.close()

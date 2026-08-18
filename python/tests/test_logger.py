"""Logger knihovny: práh závažnosti, audit mimo práh a záznam zdroje.

Dvě věci se dřív pletly: filtr v log okně (co divák VIDÍ) a úroveň, od které
se vůbec něco zaznamená (co VZNIKNE). Tady se testuje ta druhá."""
import pytest

import viewbase as vb
from viewbase.log import bus
from viewbase.logger import DEFAULT_LEVEL, Logger


@pytest.fixture
def zaznamy():
    sebrane = []
    bus.subscribe(sebrane.append)
    yield sebrane
    bus.unsubscribe(sebrane.append)


@pytest.fixture(autouse=True)
def _puvodni_uroven():
    from viewbase.logger import logger
    puvodni = logger.level
    yield
    logger.level = puvodni


def test_vychozi_uroven_je_tichy_provoz():
    """Provozní server má mlčet o rutině a mluvit o problémech."""
    assert DEFAULT_LEVEL == "warning"
    log = Logger()
    assert log.enabled("error") and log.enabled("warning")
    assert not log.enabled("info") and not log.enabled("debug")


def test_prah_pousti_jen_dost_zavazne(zaznamy):
    log = Logger(level="info")
    log.debug("ladicí", component="server")
    log.info("informace", component="server")
    log.error("chyba", component="server")
    assert [z.message for z in zaznamy] == ["informace", "chyba"]


def test_audit_prahem_neprochazi(zaznamy):
    """Kdyby šel audit utišit nastavením, stačilo by na vystaveném stroji
    přehodit úroveň a zamést za sebou."""
    log = Logger(level="error")                 # nejpřísnější práh
    log.info("tohle se zahodí", component="server")
    log.audit("client 9.9.9.9 connected")
    log.audit("invalid code for window 'mzdy' from 9.9.9.9", level="warning")
    assert [z.message for z in zaznamy] == [
        "client 9.9.9.9 connected",
        "invalid code for window 'mzdy' from 9.9.9.9"]
    assert {z.component for z in zaznamy} == {"security"}   # ne pátá úroveň


def test_neznama_uroven_se_odmitne():
    with pytest.raises(ValueError, match="debug, info, warning, error"):
        Logger(level="trace")
    log = Logger()
    with pytest.raises(ValueError):
        log.level = "fatal"


def test_project_nastavi_uroven_konstruktorem_i_setterem():
    project = vb.Project(port=0, log_level="debug")
    assert project.log_level == "debug"
    project.log_level = "warning"
    assert project.log_level == "warning"
    assert vb.Project(port=0).log_level == "warning"      # výchozí


def test_uroven_je_pro_celou_instanci_ne_pro_okno():
    """Filtr v log okně je pohled (frontend); tohle je zdroj – jedna hodnota
    pro celou instanci."""
    from viewbase.logger import logger

    vb.Project(port=0, log_level="debug")
    assert logger.level == "debug"


# ---- co se do logu NESMÍ dostat ------------------------------------------

def test_citlive_hodnoty_se_do_logu_nedostanou():
    """Ladicí záznam každé události je na vystavené instanci k nezaplacení,
    ale payload nese i tajemství: odemykací kód a klávesy do shellu (tedy
    hesla, která tam někdo píše). Nalezeno při živém testu – kód se v
    `docker logs` objevil celý."""
    from viewbase.server import redacted

    text = redacted({"window_id": "mzdy", "code": "123456",
                     "data": "heslo123\n", "sid": "abcdef0123456789"})
    assert "mzdy" in text                       # co je potřeba k ladění, zůstává
    for tajemstvi in ("123456", "heslo123", "abcdef0123456789"):
        assert tajemstvi not in text
    assert "<6 znaků>" in text                  # délka ano, hodnota ne


def test_redakce_zvlada_prazdny_payload():
    from viewbase.server import redacted

    assert redacted({}) == "{}"
    assert redacted(None) == "{}"


def test_startovni_hlaska_ma_cele_razitko(capsys):
    """Log instance, která běží dny, se vyhodnocuje zpětně – bez data se
    nepozná, jestli řádek patří k dnešku, nebo k předevčírku."""
    import re

    from viewbase.logger import Logger

    Logger().system("listening on https://127.0.0.1:60000/")
    out = capsys.readouterr().out
    assert re.match(r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} viewbase: listening", out)


def test_handler_pro_kontejner_ma_cele_razitko(monkeypatch):
    """Bez handleru by Python zahodil všechno pod WARNING a v `docker logs`
    by audit nebyl vidět. (Pod pytestem má handler root logger, proto se
    testuje `_ensure_handler` přímo.)"""
    import logging

    from viewbase import logger as modul

    monkeypatch.setattr(modul._stdlib, "handlers", [])
    monkeypatch.setattr(logging.getLogger(), "handlers", [])
    modul._ensure_handler()
    (handler,) = modul._stdlib.handlers
    assert handler.formatter.datefmt == "%Y-%m-%d %H:%M:%S"
    assert "%(asctime)s" in handler.formatter._fmt


def test_knihovna_neprebiji_logovani_hostitelske_aplikace(monkeypatch):
    """Když si logování nastavuje aplikace sama, knihovna na to nesahá."""
    import logging

    from viewbase import logger as modul

    monkeypatch.setattr(modul._stdlib, "handlers", [])
    monkeypatch.setattr(logging.getLogger(), "handlers", [logging.NullHandler()])
    modul._ensure_handler()
    assert modul._stdlib.handlers == []


def test_forwarded_allow_ips_se_predava_serveru():
    """Za reverzní proxy je protistranou proxy – bez tohohle je v auditu její
    IP místo skutečného zdroje (docs/zabezpeceni.md)."""
    from viewbase.server import _make_server

    graph = vb.GraphWindow()
    graph.add_node("a")
    server = _make_server((graph,), "127.0.0.1", 0, None, "10.0.0.2")
    assert server.config.forwarded_allow_ips == "10.0.0.2"
    vychozi = _make_server((graph,), "127.0.0.1", 0)
    assert vychozi.config.forwarded_allow_ips == "127.0.0.1"     # uvicorn default
    graph.close()

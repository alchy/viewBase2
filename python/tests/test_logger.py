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

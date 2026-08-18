"""End-to-end v prohlížeči: to, co jednotkové testy nechytí.

PROČ TENHLE SOUBOR EXISTUJE. Chyby, které v provozu opravdu bolely, prošly
zelenou sadou 390+ jednotkových testů: Esc ve výzvě nefungoval (vstupní pole
zastavovalo klávesu dřív, než dorazila k posluchači), `secured` se na okno
zapisovalo až po jeho aktivaci (Options nabízel položku cizího okna), maska
gadgetů se roztahovala, klávesy se logovaly po jednom znaku. Všechno jsou to
chyby ve SPOJENÍ vrstev – Python, protokol, prohlížeč – a najde je jenom
skutečný prohlížeč.

Test je proto tenký a míří na řetěz, ne na detaily: stránka se načte, přes
WebSocket dorazí okna, zabezpečené okno je prázdný rám, `Options → Unlock
Window` otevře výzvu, kód z autentikátoru okno odemkne a jeho obsah dorazí.

Vyžaduje `pip install playwright && playwright install chromium`; bez toho se
přeskočí (v CI se doinstaluje, na cizím stroji nemá padat kvůli chybějícímu
prohlížeči)."""
import json
import threading

import pytest

import viewbase as vb
from viewbase import mfa, sessions

playwright_api = pytest.importorskip("playwright.sync_api",
                                     reason="pip install playwright")
pyotp = pytest.importorskip("pyotp")


@pytest.fixture
def instance(tmp_path, monkeypatch):
    """Skutečný server s veřejným i zabezpečeným oknem (bez TLS – prohlížeč
    by u self-signed certifikátu chtěl potvrzení výjimky)."""
    monkeypatch.setenv("VIEWBASE_HOME", str(tmp_path))
    mfa.reset_state()
    sessions.reset()

    screen = vb.Screen(title="E2E")
    graph = vb.GraphWindow(screen=screen, title="Síť")
    graph.add_node("a", name="Alfa")

    verejne = vb.HtmlWindow("verejne", title="Veřejné", width=320, height=140)
    graph.open_html(verejne)
    verejne.label("obsah pro každého")

    tajne = vb.HtmlWindow("tajne", title="Tajné", width=320, height=140, secured=True)
    graph.open_html(tajne)
    tajne.label("TAJNY-OBSAH-42")

    project = vb.Project(port=0)
    handle = project.serve(screen, block=False)
    yield f"http://127.0.0.1:{handle.port}/"
    project.stop()
    sessions.reset()
    mfa.reset_state()


@pytest.fixture
def stranka(instance):
    with playwright_api.sync_playwright() as pw:
        prohlizec = pw.chromium.launch()
        page = prohlizec.new_page()
        page.goto(instance)
        page.wait_for_selector('[data-window-id="verejne"]', timeout=15000)
        yield page
        prohlizec.close()


def test_okna_dorazi_a_zabezpecene_je_prazdny_ram(stranka):
    """Obsah zabezpečeného okna nesmí být v DOMu ani v paměti stránky."""
    assert stranka.locator('[data-window-id="verejne"]').count() == 1
    assert stranka.locator('[data-window-id="tajne"]').count() == 1
    assert stranka.locator('[data-window-id="tajne"] [data-role="locked-body"]'
                           ).inner_text().startswith("Private window")
    assert "TAJNY-OBSAH-42" not in stranka.content()


def test_odemceni_kodem_z_autentikatoru_prinese_obsah(stranka):
    """Celý řetěz: Options → Unlock Window → kód → obsah okna."""
    stranka.locator('[data-window-id="tajne"]').click()
    stranka.locator('[data-role="vb-menu-group"]', has_text="Options").click()
    stranka.locator('[data-role="vb-menu-item"]', has_text="Unlock Window").click()

    vyzva = stranka.locator('[data-role="vb-unlock"]')
    assert vyzva.is_visible()
    kod = pyotp.TOTP(mfa.ensure_user()["totp_secret"]).now()
    stranka.locator('[data-role="vb-unlock-input"]').fill(kod)
    stranka.keyboard.press("Enter")

    stranka.wait_for_selector('[data-window-id="tajne"] iframe', timeout=10000)
    ramecek = stranka.frame_locator('[data-window-id="tajne"] iframe')
    ramecek.locator("text=TAJNY-OBSAH-42").wait_for(timeout=10000)
    assert not vyzva.is_visible()                 # výzva po odemčení zmizí


def test_esc_zavre_vyzvu_a_okno_zustane(stranka):
    """Regrese: Esc nefungoval, protože vstupní pole zastavilo klávesu dřív,
    než dorazila k posluchači – jednotkový test to neodhalil, protože si
    událost posílal rovnou na `window`."""
    stranka.locator('[data-window-id="tajne"]').click()
    stranka.locator('[data-role="vb-menu-group"]', has_text="Options").click()
    stranka.locator('[data-role="vb-menu-item"]', has_text="Unlock Window").click()
    vyzva = stranka.locator('[data-role="vb-unlock"]')
    assert vyzva.is_visible()

    stranka.keyboard.press("Escape")
    assert not vyzva.is_visible()
    assert stranka.locator('[data-window-id="tajne"]').count() == 1


def test_relace_prezije_reload(stranka, instance):
    """`vb_sid` v localStorage: po F5 se kód znovu nechce."""
    stranka.locator('[data-window-id="tajne"]').click()
    stranka.locator('[data-role="vb-menu-group"]', has_text="Options").click()
    stranka.locator('[data-role="vb-menu-item"]', has_text="Unlock Window").click()
    kod = pyotp.TOTP(mfa.ensure_user()["totp_secret"]).now()
    stranka.locator('[data-role="vb-unlock-input"]').fill(kod)
    stranka.keyboard.press("Enter")
    stranka.wait_for_selector('[data-window-id="tajne"] iframe', timeout=10000)

    stranka.reload()
    stranka.wait_for_selector('[data-window-id="tajne"] iframe', timeout=15000)
    assert not stranka.locator('[data-role="vb-unlock"]').is_visible()

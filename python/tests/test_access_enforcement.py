"""Vynucení přístupu: plocha je brána, okno zúžení, privátní okno chce kód.

Tohle je etapa, kvůli které celý model vzniká – do teď se ACL dalo nastavit,
ale nikdo se jím neřídil. Testuje se to end-to-end přes WebSocket, protože
jediná otázka, na které záleží, je „CO SE OPRAVDU ODEŠLE po drátě": skrytí
v prohlížeči by obešla vývojářská konzole.
"""
import json

import pytest
from fastapi.testclient import TestClient

from viewbase import (GraphWindow, HtmlWindow, Screen, access, create_app,
                      identity, mfa, protocol, screen, sessions)

pyotp = pytest.importorskip("pyotp")


@pytest.fixture(autouse=True)
def _zavrena_instance(tmp_path, monkeypatch):
    """Výchozí hodnota knihovny, ne veřejná instance ze conftestu."""
    monkeypatch.setenv("VIEWBASE_HOME", str(tmp_path))
    mfa.reset_state()
    identity.reset()
    sessions.reset()
    screen.reset_allocator()
    access.reset_default()
    yield
    sessions.reset()
    mfa.reset_state()
    identity.reset()


def _uzivatel(jmeno, skupiny):
    """Založ uživatele s TOTP a skupinami; vrať funkci, co dá platný kód."""
    zaznam = mfa.ensure_user(jmeno)
    users = mfa.load_users()
    users[jmeno]["groups"] = list(skupiny)
    mfa.save_users(users)
    totp = pyotp.TOTP(zaznam["totp_secret"])
    return totp.now


def _hello(ws):
    ws.send_text(json.dumps({"type": "hello",
                             "protocol": protocol.PROTOCOL_VERSION}))
    return _do_session(ws)


def _do_session(ws):
    """Čti, dokud nepřijde rámec `session`; vrať (zprávy před ním, session)."""
    pred = []
    while True:
        msg = json.loads(ws.receive_text())
        if msg["type"] == "session":
            return pred, msg
        pred.append(msg)


def _prihlas(ws, jmeno, kod):
    ws.send_text(json.dumps({"type": "login", "user": jmeno, "code": kod}))
    return _do_session(ws)


def _plocha(access_list=None, window_access=None):
    s = Screen(title="Provoz", access=access_list)
    g = GraphWindow(screen=s)
    okno = HtmlWindow("mzdy", title="Mzdy", access=window_access)
    okno.label("tajný obsah")
    g.open_html(okno)
    return s, g


# ---- plocha jako brána ----------------------------------------------------

def test_anonymni_relace_zavrenou_plochu_vubec_nedostane():
    """Výchozí `group:users`: kdo se nepřihlásil, má jen `group:public`."""
    _, g = _plocha()
    with TestClient(create_app(g)) as client:
        with client.websocket_connect("/ws") as ws:
            pred, session = _hello(ws)
    assert [m["type"] for m in pred] == []          # ani init
    assert session["user"] is None
    assert session["visible"] == 0 and session["hidden"] == 1


def test_po_prihlaseni_plocha_dorazi():
    """`hidden > 0` je jediný signál, že se má o co přihlásit."""
    kod = _uzivatel("hana", ["group:users"])
    _, g = _plocha()
    with TestClient(create_app(g)) as client:
        with client.websocket_connect("/ws") as ws:
            _, prazdna = _hello(ws)
            assert prazdna["hidden"] == 1
            pred, session = _prihlas(ws, "hana", kod())
    assert [m["type"] for m in pred] == ["init"]
    assert session["user"] == "hana" and session["visible"] == 1
    assert [w["window_id"] for w in pred[0]["windows"]] == ["mzdy"]


def test_spatny_kod_neotevre_nic():
    _uzivatel("hana", ["group:users"])
    _, g = _plocha()
    with TestClient(create_app(g)) as client:
        with client.websocket_connect("/ws") as ws:
            _hello(ws)
            ws.send_text(json.dumps({"type": "login", "user": "hana",
                                     "code": "000000"}))
            assert json.loads(ws.receive_text())["type"] == "login_failed"


def test_clenstvi_v_jine_skupine_plochu_neotevre():
    """Účetní na plochu mezd nepatří, i když je přihlášená."""
    kod = _uzivatel("karel", ["group:sklad"])
    _, g = _plocha(access_list=["group:ucetni"])
    with TestClient(create_app(g)) as client:
        with client.websocket_connect("/ws") as ws:
            _hello(ws)
            pred, session = _prihlas(ws, "karel", kod())
    assert pred == [] and session["visible"] == 0


def test_nadrazena_skupina_dedi_pristup_podskupiny():
    """`group:ucetni` obsahuje `group:mzdy`: kdo je ve mzdách, je i účetní."""
    kod = _uzivatel("hana", ["group:mzdy"])
    mfa.update_section("groups", {"group:ucetni": {"members": ["group:mzdy"]}})
    _, g = _plocha(access_list=["group:ucetni"])
    with TestClient(create_app(g)) as client:
        with client.websocket_connect("/ws") as ws:
            _hello(ws)
            pred, session = _prihlas(ws, "hana", kod())
    assert session["visible"] == 1 and [m["type"] for m in pred] == ["init"]


# ---- okno jako zúžení -----------------------------------------------------

def test_okno_mimo_ACL_se_v_snapshotu_vubec_neobjevi():
    """Na plochu vidí, na okno ne – „nevidíš" znamená „neodešle se"."""
    kod = _uzivatel("karel", ["group:users"])
    s = Screen(title="Provoz")
    g = GraphWindow(screen=s)
    verejne = HtmlWindow("prehled", title="Přehled")
    verejne.label("běžný obsah")
    tajne = HtmlWindow("mzdy", title="Mzdy", access=["group:ucetni"])
    tajne.label("tajný obsah")
    g.open_html(verejne)
    g.open_html(tajne)
    with TestClient(create_app(g)) as client:
        with client.websocket_connect("/ws") as ws:
            _hello(ws)
            pred, _ = _prihlas(ws, "karel", kod())
    okna = [w["window_id"] for w in pred[0]["windows"]]
    assert okna == ["prehled"]
    assert "tajný obsah" not in json.dumps(pred, ensure_ascii=False)


def test_udalost_do_okna_mimo_ACL_se_zahodi_a_zaloguje():
    """Neprojde ani vstup: ACL platí u KAŽDÉ zprávy, ne jen při otevření."""
    from viewbase.log import bus

    prislo = []
    s = Screen(title="Provoz", access=["group:public"])
    g = GraphWindow(screen=s)
    okno = HtmlWindow("mzdy", title="Mzdy", access=["group:ucetni"])
    okno.label("tajný obsah")
    g.open_html(okno, on_event=lambda e: prislo.append(e))

    sebrane = []
    bus.subscribe(sebrane.append)
    try:
        with TestClient(create_app(g)) as client:
            with client.websocket_connect("/ws") as ws:
                _hello(ws)
                ws.send_text(json.dumps({
                    "type": "event", "event": "html_event",
                    "payload": {"window_id": "mzdy", "name": "klik"}}))
                ws.send_text(json.dumps({"type": "logout"}))
                _do_session(ws)                    # bariéra: server dozpracoval
    finally:
        bus.unsubscribe(sebrane.append)

    assert prislo == []
    assert any("access to window 'mzdy' refused" in z.message for z in sebrane)


def test_videt_a_zasahovat_jsou_dve_ruzne_veci():
    """Veřejný přehled, do kterého smí psát jen účtárna."""
    kod = _uzivatel("karel", ["group:users"])
    prislo = []
    s = Screen(title="Provoz")
    g = GraphWindow(screen=s)
    okno = HtmlWindow("prehled", title="Přehled", access=["group:users"])
    okno.access.write.set(["group:ucetni"])
    okno.label("běžný obsah")
    g.open_html(okno, on_event=lambda e: prislo.append(e))

    with TestClient(create_app(g)) as client:
        with client.websocket_connect("/ws") as ws:
            _hello(ws)
            pred, _ = _prihlas(ws, "karel", kod())
            assert [w["window_id"] for w in pred[0]["windows"]] == ["prehled"]
            ws.send_text(json.dumps({
                "type": "event", "event": "html_event",
                "payload": {"window_id": "prehled", "name": "klik"}}))
            ws.send_text(json.dumps({"type": "logout"}))
            _do_session(ws)
    assert prislo == []                       # vidí, ale nesmí


# ---- odhlášení ------------------------------------------------------------

def test_odhlaseni_plochu_zase_zavre():
    kod = _uzivatel("hana", ["group:users"])
    _, g = _plocha()
    with TestClient(create_app(g)) as client:
        with client.websocket_connect("/ws") as ws:
            _hello(ws)
            _prihlas(ws, "hana", kod())
            ws.send_text(json.dumps({"type": "logout"}))
            pred, session = _do_session(ws)
    assert session["user"] is None and session["visible"] == 0
    assert [m.get("action") for m in pred] == ["screen_remove"]

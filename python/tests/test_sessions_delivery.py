"""Doručování obsahu zabezpečených oken PO RELACÍCH (end-to-end přes WS).

Tohle je ta vlastnost, kvůli které relace vznikly: dřív se odemčení zapsalo
do okna a obsah se rozeslal všem připojeným – i tomu, kdo kód nikdy nezadal.
Test drží dvě WS spojení a hlídá, že druhý divák nedostane nic."""
import json

import pytest
from fastapi.testclient import TestClient

from viewbase import GraphWindow, HtmlWindow, create_app, protocol, sessions

pyotp = pytest.importorskip("pyotp")


@pytest.fixture(autouse=True)
def _cista_tabulka():
    sessions.reset()
    yield
    sessions.reset()


def _hello(ws, sid=None):
    ws.send_text(json.dumps({"type": "hello", "protocol": protocol.PROTOCOL_VERSION,
                             **({"sid": sid} if sid else {})}))
    return json.loads(ws.receive_text())


def _okno(secured=True):
    w = HtmlWindow("mzdy", title="Mzdy 2026", secured=secured)
    w.label("tajný obsah")
    return w


def _cti(ws, kolik):
    """Přečti PŘESNĚ tolik zpráv (TestClient na prázdné frontě blokuje, takže
    se nikdy nečeká na „nic" – nedoručení se dokazuje kontrolní veřejnou
    zprávou, viz `_dalsi_verejna`)."""
    return [json.loads(ws.receive_text()) for _ in range(kolik)]


def _dalsi_verejna(ws, znacka):
    """Přečti zprávy, dokud nepřijde ta kontrolní veřejná, a vrať všechno
    před ní. Kdyby server poslal i obsah zabezpečeného okna, objeví se tady."""
    pred = []
    for _ in range(20):
        msg = json.loads(ws.receive_text())
        if znacka in json.dumps(msg, ensure_ascii=False):
            return pred
        pred.append(msg)
    raise AssertionError("kontrolní veřejná zpráva nedorazila")


def test_odemceni_vidi_jen_relace_ktera_zadala_kod(monkeypatch):
    from viewbase import mfa

    monkeypatch.setattr(mfa, "available", lambda: False)   # jednorázový kód
    graph = GraphWindow()
    okno = _okno()
    graph.open_html(okno)
    app = create_app(graph)
    with TestClient(app) as client:
        with client.websocket_connect("/ws") as a, client.websocket_connect("/ws") as b:
            init_a = _hello(a)
            init_b = _hello(b)
            assert init_a["sid"] and init_b["sid"] != init_a["sid"]
            # oba vidí jen prázdný rám
            for init in (init_a, init_b):
                (spec,) = [w for w in init["windows"] if w["window_id"] == "mzdy"]
                assert spec["kind"] == "locked"
                assert "tajný obsah" not in json.dumps(spec, ensure_ascii=False)

            a.send_text(json.dumps({"type": "event", "event": "window_unlock",
                                    "payload": {"window_id": "mzdy",
                                                "code": okno.fallback_code}}))
            # ve frontě může ještě čekat placeholder z otevření okna, proto
            # se čte, dokud nepřijde skutečný obsah
            otevreno = None
            for _ in range(5):
                msg = json.loads(a.receive_text())
                if msg.get("action") == "open_window" and msg.get("kind") == "html":
                    otevreno = msg
                    break
            assert otevreno, "relace, která zadala kód, obsah nedostala"
            assert "tajný obsah" in json.dumps(otevreno, ensure_ascii=False)

            # obsah navíc + KONTROLNÍ VEŘEJNÁ zpráva; druhý divák musí dostat
            # jen tu veřejnou, mezi ní a předchozím stavem nic tajného
            graph.html_append("mzdy", "<b>další tajemství</b>")
            graph.add_node("kontrolni-uzel")
            pred_znackou = _dalsi_verejna(b, "kontrolni-uzel")
            text_b = json.dumps(pred_znackou, ensure_ascii=False)
            assert "tajný obsah" not in text_b and "další tajemství" not in text_b
    graph.close()


def test_nezabezpecene_okno_dostanou_oba():
    """Kontrolní vzorek: bez `secured=True` se nic nefiltruje."""
    graph = GraphWindow()
    graph.open_html(_okno(secured=False))
    with TestClient(create_app(graph)) as client:
        with client.websocket_connect("/ws") as a, client.websocket_connect("/ws") as b:
            for init in (_hello(a), _hello(b)):
                (spec,) = [w for w in init["windows"] if w["window_id"] == "mzdy"]
                assert spec["kind"] == "html" and "tajný obsah" in spec["html"]
    graph.close()


def test_relace_prezije_reconnect_a_neznama_dostane_novou(monkeypatch):
    """Reload stránky: prohlížeč pošle uložené sid a granty mu zůstanou.
    Vymyšlené/vypršelé sid se ale neoživí – dostane nové a prázdné."""
    from viewbase import mfa

    monkeypatch.setattr(mfa, "available", lambda: False)
    graph = GraphWindow()
    okno = _okno()
    graph.open_html(okno)
    with TestClient(create_app(graph)) as client:
        with client.websocket_connect("/ws") as a:
            sid = _hello(a)["sid"]
            a.send_text(json.dumps({"type": "event", "event": "window_unlock",
                                    "payload": {"window_id": "mzdy",
                                                "code": okno.fallback_code}}))
            for _ in range(5):
                if json.loads(a.receive_text()).get("kind") == "html":
                    break
        assert sessions.store.has(sid, "mzdy") is True

        with client.websocket_connect("/ws") as a2:      # „reload stránky"
            init = _hello(a2, sid)
            assert init["sid"] == sid
            (spec,) = [w for w in init["windows"] if w["window_id"] == "mzdy"]
            assert spec["kind"] == "html" and "tajný obsah" in spec["html"]

        with client.websocket_connect("/ws") as c:       # vymyšlené sid
            init = _hello(c, "vymyslene-sid")
            assert init["sid"] != "vymyslene-sid"
            (spec,) = [w for w in init["windows"] if w["window_id"] == "mzdy"]
            assert spec["kind"] == "locked"
    graph.close()


def test_lock_window_zamkne_jen_moji_relaci(monkeypatch):
    from viewbase import mfa

    monkeypatch.setattr(mfa, "available", lambda: False)
    graph = GraphWindow()
    okno = _okno()
    graph.open_html(okno)
    with TestClient(create_app(graph)) as client:
        with client.websocket_connect("/ws") as a, client.websocket_connect("/ws") as b:
            sid_a, sid_b = _hello(a)["sid"], _hello(b)["sid"]
            for ws in (a, b):
                ws.send_text(json.dumps({"type": "event", "event": "window_unlock",
                                         "payload": {"window_id": "mzdy",
                                                     "code": okno.fallback_code}}))
            for ws in (a, b):
                for _ in range(5):
                    if json.loads(ws.receive_text()).get("kind") == "html":
                        break
            assert sessions.store.has(sid_a, "mzdy")
            assert sessions.store.has(sid_b, "mzdy")

            a.send_text(json.dumps({"type": "event", "event": "window_lock",
                                    "payload": {"window_id": "mzdy"}}))
            zamceno = None
            for _ in range(5):
                msg = json.loads(a.receive_text())
                if msg.get("action") == "open_window":
                    zamceno = msg
                    break
            assert zamceno and zamceno["kind"] == "locked"      # placeholder zpět
            assert sessions.store.has(sid_a, "mzdy") is False   # já zamčeno
            assert sessions.store.has(sid_b, "mzdy") is True    # kolega ne
    graph.close()

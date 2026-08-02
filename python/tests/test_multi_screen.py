"""Fáze 2: víc Canvasů na jednom serveru (screen_id routing) + log relay."""
import threading
import time

import pytest
from fastapi.testclient import TestClient

from viewbase import GraphWindow, Screen, create_app, log, protocol
from viewbase.log import bus as log_bus
from viewbase.screen import reset_allocator


@pytest.fixture(autouse=True)
def _reset_screens():
    reset_allocator()
    yield
    reset_allocator()


def hello() -> str:
    return protocol.encode({"type": "hello", "protocol": protocol.PROTOCOL_VERSION})


def test_create_app_without_canvas_raises():
    with pytest.raises(ValueError):
        create_app()


def test_create_app_multi_canvas_without_screen_raises():
    with pytest.raises(ValueError):
        create_app(GraphWindow(), GraphWindow())


def test_create_app_duplicate_screen_raises():
    screen = Screen(title="A")
    with pytest.raises(ValueError):
        create_app(GraphWindow(screen=screen), GraphWindow(screen=screen))


def test_canvas_stores_screen_id():
    screen = Screen(title="Síť")
    canvas = GraphWindow(screen=screen)
    assert canvas.screen_id == screen.id
    assert GraphWindow().screen_id is None


def test_two_canvases_each_get_own_init():
    screen_a = Screen(title="A")
    screen_b = Screen(title="B")
    canvas_a = GraphWindow(screen=screen_a)
    canvas_a.add_node("a1")
    canvas_b = GraphWindow(screen=screen_b)
    canvas_b.add_node("b1")
    with TestClient(create_app(canvas_a, canvas_b)) as client:
        with client.websocket_connect("/ws") as ws:
            ws.send_text(hello())
            first = protocol.decode(ws.receive_text())
            second = protocol.decode(ws.receive_text())
    inits = {first["screen_id"]: first, second["screen_id"]: second}
    assert set(inits) == {screen_a.id, screen_b.id}
    assert [n["id"] for n in inits[screen_a.id]["nodes"]] == ["a1"]
    assert [n["id"] for n in inits[screen_b.id]["nodes"]] == ["b1"]


def test_event_routes_to_correct_canvas_by_screen_id():
    screen_a = Screen(title="A")
    screen_b = Screen(title="B")
    canvas_a = GraphWindow(screen=screen_a)
    canvas_a.add_node("x")
    canvas_b = GraphWindow(screen=screen_b)
    canvas_b.add_node("x")   # stejné id uzlu, jiný canvas – nesmí kolidovat

    seen = {"a": None, "b": None}
    done_a = threading.Event()
    done_b = threading.Event()

    @canvas_a.on_click
    def on_a(event):
        seen["a"] = event.node_id
        done_a.set()

    @canvas_b.on_click
    def on_b(event):
        seen["b"] = event.node_id
        done_b.set()

    with TestClient(create_app(canvas_a, canvas_b)) as client:
        with client.websocket_connect("/ws") as ws:
            ws.send_text(hello())
            protocol.decode(ws.receive_text())
            protocol.decode(ws.receive_text())
            ws.send_text(protocol.encode(
                {"type": "event", "screen_id": screen_b.id,
                 "event": "node_click", "payload": {"node_id": "x"}}))
            assert done_b.wait(timeout=2)
    assert seen["b"] == "x"
    assert seen["a"] is None


def test_event_with_unresolvable_screen_id_is_dropped_not_crashed():
    screen_a = Screen(title="A")
    screen_b = Screen(title="B")
    canvas_a = GraphWindow(screen=screen_a)
    canvas_a.add_node("x")
    canvas_b = GraphWindow(screen=screen_b)

    done = threading.Event()

    @canvas_a.on_click
    def on_a(event):
        done.set()

    with TestClient(create_app(canvas_a, canvas_b)) as client:
        with client.websocket_connect("/ws") as ws:
            ws.send_text(hello())
            protocol.decode(ws.receive_text())
            protocol.decode(ws.receive_text())
            ws.send_text(protocol.encode(
                {"type": "event", "screen_id": 999,
                 "event": "node_click", "payload": {"node_id": "x"}}))
            ws.send_text(protocol.encode(
                {"type": "event", "screen_id": screen_a.id,
                 "event": "node_click", "payload": {"node_id": "x"}}))
            assert done.wait(timeout=2)   # spojení přežilo neplatný screen_id


def test_log_record_relayed_over_ws():
    canvas = GraphWindow()
    with TestClient(create_app(canvas)) as client:
        with client.websocket_connect("/ws") as ws:
            ws.send_text(hello())
            protocol.decode(ws.receive_text())   # init
            log_bus.publish("warning", "backend_program", "reconnect klienta",
                            component="server")
            msg = None
            for _ in range(5):
                msg = protocol.decode(ws.receive_text())
                if msg["type"] == "log":
                    break
            assert msg == {"type": "log", "level": "warning",
                           "source": "backend_program",
                           "message": "reconnect klienta",
                           "component": "server"}


def test_vb_log_relayed_over_ws():
    canvas = GraphWindow()
    with TestClient(create_app(canvas)) as client:
        with client.websocket_connect("/ws") as ws:
            ws.send_text(hello())
            protocol.decode(ws.receive_text())
            log("ahoj z uzivatelskeho kodu")
            msg = None
            for _ in range(5):
                msg = protocol.decode(ws.receive_text())
                if msg["type"] == "log":
                    break
            assert msg["source"] == "backend_user"
            assert msg["message"] == "ahoj z uzivatelskeho kodu"


def test_rest_event_logs_as_backend_api_json():
    canvas = GraphWindow()
    canvas.add_node("a")

    @canvas.on_click
    def _(event):
        pass

    client = TestClient(create_app(canvas))
    got = []
    log_bus.subscribe(got.append)
    try:
        resp = client.post("/api/event", json={
            "event": "node_click", "payload": {"node_id": "a"}})
        assert resp.json() == {"ok": True}
    finally:
        log_bus.unsubscribe(got.append)
    api_records = [r for r in got if r.source == "backend_api"]
    assert len(api_records) == 1
    assert api_records[0].component == "rest"
    assert "node_click" in api_records[0].message


def test_rest_event_unresolvable_screen_returns_error():
    screen_a = Screen(title="A")
    screen_b = Screen(title="B")
    canvas_a = GraphWindow(screen=screen_a)
    canvas_b = GraphWindow(screen=screen_b)
    client = TestClient(create_app(canvas_a, canvas_b))
    resp = client.post("/api/event", json={"event": "x", "payload": {}})
    assert resp.json()["ok"] is False


# ---- destroy s NIKÝM připojeným v okamžiku zavření (§ „create/destroy jsou
# explicitní páry") – reálně nalezený bug: broadcast smyčka draina akce na
# KAŽDÝ tik bez ohledu na klienty, takže jednorázová screen_remove akce bez
# odběratele zmizela navždy a nově připojený klient dostal init i pro už
# zavřený canvas. Oprava: zavřený canvas se po posledním odvysílání odebere
# z routovacích tabulek, ať nový klient o něm vůbec neuslyší. ------------

def test_canvas_closed_with_no_clients_is_removed_before_next_connect(
        monkeypatch):
    from viewbase import server as server_module
    monkeypatch.setattr(server_module, "PATCH_INTERVAL", 0.001)
    screen_a = Screen(title="A")
    canvas_a = GraphWindow(screen=screen_a)
    screen_b = Screen(title="B")
    canvas_b = GraphWindow(screen=screen_b)
    with TestClient(create_app(canvas_a, canvas_b)) as client:
        canvas_b.close()                    # nikdo zatím není připojený
        time.sleep(0.05)                    # ať broadcast smyčka stihne uklidit
        with client.websocket_connect("/ws") as ws:
            ws.send_text(hello())
            init = protocol.decode(ws.receive_text())
            assert init["screen_id"] == screen_a.id
            # kdyby bug přetrval, druhá zpráva ze serveru by byla init pro
            # screen_b; místo čekání na timeout ověř přímo přes routing níž


def test_canvas_closed_with_no_clients_screen_remove_not_lost_forever(
        monkeypatch):
    """I bez nikoho připojeného destroy nesmí nechat canvas napůl živý –
    ověř přes REST, že screen_b už neexistuje (routing ho nenajde)."""
    from viewbase import server as server_module
    monkeypatch.setattr(server_module, "PATCH_INTERVAL", 0.001)
    screen_a = Screen(title="A")
    canvas_a = GraphWindow(screen=screen_a)
    screen_b = Screen(title="B")
    canvas_b = GraphWindow(screen=screen_b)
    with TestClient(create_app(canvas_a, canvas_b)) as client:
        canvas_b.close()
        time.sleep(0.05)
        resp = client.post("/api/event", json={
            "event": "x", "payload": {}, "screen_id": screen_b.id})
        assert resp.json() == {
            "ok": False, "error": f"neznámý screen_id {screen_b.id!r}"}

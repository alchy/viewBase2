"""Origin při WS handshaku.

WebSocket NEPROCHÁZÍ CORS: cizí stránka otevřená v prohlížeči diváka se může
připojit a prohlížeč jí v tom nezabrání. Grant tím nezíská (session id je
v localStorage, na který nedosáhne), ale obsah nezabezpečených oken uvidí."""
import json

import pytest
from fastapi.testclient import TestClient

from viewbase import GraphWindow, create_app, protocol
from viewbase.log import bus


@pytest.fixture
def zaznamy():
    sebrane = []
    bus.subscribe(sebrane.append)
    yield sebrane
    bus.unsubscribe(sebrane.append)


def _graf():
    c = GraphWindow()
    c.add_node("a")
    return c


def _hello(ws):
    ws.send_text(json.dumps({"type": "hello",
                             "protocol": protocol.PROTOCOL_VERSION}))
    return json.loads(ws.receive_text())


def test_stranka_z_teto_instance_projde():
    c = _graf()
    with TestClient(create_app(c)) as client:
        with client.websocket_connect(
                "/ws", headers={"origin": "https://testserver",
                                "host": "testserver"}) as ws:
            assert _hello(ws)["type"] == "init"
    c.close()


def test_cizi_stranka_se_odmitne(zaznamy):
    c = _graf()
    with TestClient(create_app(c)) as client:
        with client.websocket_connect(
                "/ws", headers={"origin": "https://utocnik.example",
                                "host": "testserver"}) as ws:
            ws.send_text(json.dumps({"type": "hello",
                                     "protocol": protocol.PROTOCOL_VERSION}))
            odpoved = json.loads(ws.receive_text())
    assert odpoved == {"type": "error", "error": "origin_not_allowed"}
    odmitnuti = [z for z in zaznamy if "origin" in z.message]
    assert odmitnuti and odmitnuti[0].component == "security"
    c.close()


def test_klient_bez_originu_projde():
    """curl, vlastní klienti a testy nejsou prohlížeč – cizí stránka je
    zneužít nemůže, takže hlavička chybí právem."""
    c = _graf()
    with TestClient(create_app(c)) as client:
        with client.websocket_connect("/ws") as ws:
            assert _hello(ws)["type"] == "init"
    c.close()


def test_jmenovity_seznam_prebije_kontrolu_hostu():
    """Za reverzní proxy nebo při vývoji sedí Origin na jiné jméno."""
    c = _graf()
    app = create_app(c, allowed_origins=["https://workbench.firma.cz"])
    with TestClient(app) as client:
        with client.websocket_connect(
                "/ws", headers={"origin": "https://workbench.firma.cz",
                                "host": "vnitrni:8443"}) as ws:
            assert _hello(ws)["type"] == "init"
        with client.websocket_connect(
                "/ws", headers={"origin": "https://testserver",
                                "host": "testserver"}) as ws:   # jinak by prošel
            ws.send_text(json.dumps({"type": "hello",
                                     "protocol": protocol.PROTOCOL_VERSION}))
            assert json.loads(ws.receive_text())["error"] == "origin_not_allowed"
    c.close()

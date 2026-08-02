"""ScreenMenu (§8 designu) zapojené do Canvasu: pin_menu, menu_select
dispatch, snapshot/init persistence, explicitní adopce Screenu."""
import threading

import pytest
from fastapi.testclient import TestClient

from viewbase import Canvas, Screen, ScreenMenu, create_app, protocol
from viewbase.screen import reset_allocator


@pytest.fixture(autouse=True)
def _reset():
    reset_allocator()
    yield
    reset_allocator()


def _menu():
    m = ScreenMenu()
    m.item("Graf", "Přidat uzel")
    m.item("Zobrazení", "Motiv: cyber")
    return m


def test_pin_menu_queues_action():
    c = Canvas()
    c.pin_menu(_menu())
    (a,) = c.drain_actions()
    assert a["action"] == "open_menu"
    assert [g["name"] for g in a["groups"]] == ["Graf", "Zobrazení"]


def test_pin_menu_stored_in_snapshot():
    c = Canvas()
    assert c.snapshot()["menu"] is None
    c.pin_menu(_menu())
    assert c.snapshot()["menu"]["groups"][0]["name"] == "Graf"


def test_pin_menu_replace_updates_snapshot():
    c = Canvas()
    c.pin_menu(_menu())
    m2 = ScreenMenu()
    m2.item("Jine", "X")
    c.pin_menu(m2)
    assert [g["name"] for g in c.snapshot()["menu"]["groups"]] == ["Jine"]


def test_menu_select_dispatches_to_on_select_handler():
    c = Canvas()
    calls = []
    done = threading.Event()

    def on_select(event):
        calls.append(event.item_id)
        done.set()

    menu = ScreenMenu()
    menu.item("Graf", "Přidat uzel", on_select=on_select)
    c.pin_menu(menu)
    item_id = menu.spec()["groups"][0]["items"][0]["id"]
    c.dispatch_event("menu_select", {"item_id": item_id, "client_id": "x"})
    assert done.wait(2.0)
    assert calls == [item_id]
    c.close()


def test_menu_select_unknown_item_does_not_raise():
    c = Canvas()
    c.pin_menu(_menu())
    c.dispatch_event("menu_select", {"item_id": "ghost", "client_id": "x"})
    c.close()


def test_menu_select_without_pinned_menu_does_not_raise():
    c = Canvas()
    c.dispatch_event("menu_select", {"item_id": "x", "client_id": "y"})
    c.close()


def test_init_message_carries_menu_key():
    msg = protocol.init_message(
        seq=0, config={}, node_types={}, nodes=[], edges=[],
        flow_types={}, flows=[], windows=[], menu={"groups": []})
    assert msg["menu"] == {"groups": []}


def test_init_over_ws_carries_pinned_menu():
    c = Canvas()
    c.pin_menu(_menu())
    with TestClient(create_app(c)) as client:
        with client.websocket_connect("/ws") as ws:
            ws.send_text(protocol.encode(
                {"type": "hello", "protocol": protocol.PROTOCOL_VERSION}))
            init = protocol.decode(ws.receive_text())
    assert init["type"] == "init"
    assert [g["name"] for g in init["menu"]["groups"]] == ["Graf", "Zobrazení"]


# ---- explicitní adopce Screenu (vytvoření screenu a přiřazení grafu jsou
# nezávislé atomární operace, jen pořadí je volné) --------------------------

def test_canvas_adopts_menu_pinned_before_it_existed():
    screen = Screen(title="Síť")
    screen.pin_menu(_menu())          # Canvas ještě neexistuje
    canvas = Canvas(screen=screen)    # explicitní adopce v konstruktoru
    assert [g["name"] for g in canvas.snapshot()["menu"]["groups"]] == [
        "Graf", "Zobrazení"]


def test_adopted_menu_action_delivered_exactly_once():
    screen = Screen(title="Síť")
    screen.pin_menu(_menu())
    canvas = Canvas(screen=screen)
    actions = canvas.drain_actions()
    open_menu_actions = [a for a in actions if a["action"] == "open_menu"]
    assert len(open_menu_actions) == 1   # ne zdvojené (screen fronta + pin_menu)


def test_adopted_menu_select_still_dispatches():
    screen = Screen(title="Síť")
    calls = []
    done = threading.Event()

    def on_select(event):
        calls.append(event.item_id)
        done.set()

    menu = ScreenMenu()
    menu.item("Graf", "Přidat uzel", on_select=on_select)
    screen.pin_menu(menu)
    canvas = Canvas(screen=screen)
    item_id = menu.spec()["groups"][0]["items"][0]["id"]
    canvas.dispatch_event("menu_select", {"item_id": item_id, "client_id": "x"})
    assert done.wait(2.0)
    assert calls == [item_id]
    canvas.close()


def test_canvas_without_screen_close_does_not_queue_screen_remove():
    c = Canvas()
    c.close()
    assert c.drain_actions() == []


def test_canvas_with_screen_close_queues_screen_remove():
    screen = Screen(title="Síť")
    canvas = Canvas(screen=screen)
    canvas.close()
    actions = canvas.drain_actions()
    assert {"action": "screen_remove", "screen_id": screen.id} in actions

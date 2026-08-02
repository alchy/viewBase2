from viewbase.menu import ScreenMenu


def test_item_groups_in_first_seen_order():
    menu = ScreenMenu()
    menu.item("Zobrazení", "Motiv: cyber")
    menu.item("Graf", "Přidat uzel")
    menu.item("Zobrazení", "Motiv: workbench")
    spec = menu.spec()
    assert [g["name"] for g in spec["groups"]] == ["Zobrazení", "Graf"]
    assert [i["label"] for i in spec["groups"][0]["items"]] == [
        "Motiv: cyber", "Motiv: workbench"]


def test_item_returns_self_for_chaining():
    menu = ScreenMenu()
    result = menu.item("Graf", "A").item("Graf", "B")
    assert result is menu
    assert len(menu.spec()["groups"][0]["items"]) == 2


def test_items_get_unique_ids():
    menu = ScreenMenu()
    menu.item("Graf", "A")
    menu.item("Graf", "B")
    ids = [i["id"] for i in menu.spec()["groups"][0]["items"]]
    assert len(set(ids)) == 2


def test_spec_is_a_copy():
    menu = ScreenMenu()
    menu.item("Graf", "A")
    spec = menu.spec()
    spec["groups"][0]["items"][0]["label"] = "zmeneno"
    assert menu.spec()["groups"][0]["items"][0]["label"] == "A"


def test_dispatch_calls_on_select_of_matching_item():
    calls = []
    menu = ScreenMenu()
    menu.item("Graf", "Přidat uzel", on_select=lambda e: calls.append(e))
    item_id = menu.spec()["groups"][0]["items"][0]["id"]
    menu.dispatch(item_id, "event-payload")
    assert calls == ["event-payload"]


def test_dispatch_unknown_item_is_noop():
    menu = ScreenMenu()
    menu.item("Graf", "A", on_select=lambda e: (_ for _ in ()).throw(AssertionError))
    menu.dispatch("ghost-id", "x")   # nesmí spadnout ani zavolat handler


def test_item_without_on_select_dispatch_is_noop():
    menu = ScreenMenu()
    menu.item("Graf", "A")
    item_id = menu.spec()["groups"][0]["items"][0]["id"]
    menu.dispatch(item_id, "x")   # nesmí spadnout


def test_empty_menu_spec():
    assert ScreenMenu().spec() == {"groups": []}

import pytest

from viewbase.screen import MAX_USER_SCREENS, Screen, reset_allocator


@pytest.fixture(autouse=True)
def _reset():
    reset_allocator()
    yield
    reset_allocator()


def test_ids_assigned_in_creation_order():
    a = Screen(title="A")
    b = Screen(title="B")
    c = Screen(title="C")
    assert (a.id, b.id, c.id) == (1, 2, 3)


def test_zero_is_never_assigned():
    screens = [Screen() for _ in range(MAX_USER_SCREENS)]
    assert min(s.id for s in screens) == 1


def test_ninth_screen_raises():
    for _ in range(MAX_USER_SCREENS):
        Screen()
    with pytest.raises(ValueError):
        Screen()


def test_defaults():
    s = Screen()
    assert s.title == "viewbase"
    assert s.theme == "modern"
    assert s.quality == "auto"


def test_invalid_quality_raises():
    with pytest.raises(ValueError):
        Screen(quality="ultra")


def test_invalid_theme_raises():
    with pytest.raises(ValueError):
        Screen(theme="nonexistent")


def test_dict_theme_accepted():
    s = Screen(theme={"background": "#000000"})
    assert s.theme == {"background": "#000000"}


def test_workbench_theme_accepted():
    assert Screen(theme="workbench-gray").theme == "workbench-gray"


# ---- lifecycle: Screen funguje i bez přiřazeného GraphWindow -----------------

def test_pin_menu_before_canvas_queues_action():
    from viewbase.menu import ScreenMenu
    screen = Screen(title="Síť")
    menu = ScreenMenu()
    menu.item("Graf", "Přidat uzel")
    screen.pin_menu(menu)
    (action,) = screen.drain_actions()
    assert action["action"] == "open_menu"
    assert action["groups"][0]["name"] == "Graf"
    assert screen.drain_actions() == []   # jednou vydrénováno, fronta prázdná


def test_pin_menu_after_canvas_delegates_directly():
    from viewbase import GraphWindow
    from viewbase.menu import ScreenMenu
    screen = Screen(title="Síť")
    canvas = GraphWindow(screen=screen)
    menu = ScreenMenu()
    menu.item("Graf", "Přidat uzel")
    screen.pin_menu(menu)
    # deleguje rovnou na canvas.pin_menu – screen vlastní frontu nepoužije
    assert screen.drain_actions() == []
    assert canvas.snapshot()["menu"]["groups"][0]["name"] == "Graf"


def test_destroy_without_canvas_just_clears_queue():
    from viewbase.menu import ScreenMenu
    screen = Screen(title="Síť")
    menu = ScreenMenu()
    menu.item("Graf", "A")
    screen.pin_menu(menu)
    screen.destroy()
    assert screen.drain_actions() == []


def test_destroy_with_canvas_closes_it():
    from viewbase import GraphWindow
    screen = Screen(title="Síť")
    canvas = GraphWindow(screen=screen)
    screen.destroy()
    assert canvas._closed is True

import pytest

from viewbase.screen import MAX_USER_SCREENS, Screen, reset_allocator


@pytest.fixture(autouse=True)
def _reset():
    reset_allocator()
    yield
    reset_allocator()


def test_poradi_na_liste_jde_podle_vzniku():
    """`index` je POŘADÍ, ne adresa – lišta podle něj řadí plochy."""
    a = Screen(title="A")
    b = Screen(title="B")
    c = Screen(title="C")
    assert (a.index, b.index, c.index) == (1, 2, 3)


def test_adresa_plochy_je_stabilni_a_neprumyslova():
    """Procesní čítač jako adresa je rozbitý: dva procesy vyrobí `1` pro dvě
    různé plochy a klient netrefí. Id je proto náhodné a jedinečné."""
    screens = [Screen() for _ in range(MAX_USER_SCREENS)]
    ids = [s.id for s in screens]
    assert len(set(ids)) == MAX_USER_SCREENS
    assert all(isinstance(i, str) and len(i) >= 8 for i in ids)


def test_plochu_lze_pojmenovat_a_jmeno_se_kontroluje():
    """`vb.Screen(id="provoz")` – pod tímhle jménem ji zná i soubor politiky,
    takže práva přežijí restart."""
    assert Screen(id="provoz").id == "provoz"
    with pytest.raises(ValueError):
        Screen(id="má mezeru")
    with pytest.raises(ValueError):
        Screen(id="screen:provoz")          # dvojtečka patří principálům


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

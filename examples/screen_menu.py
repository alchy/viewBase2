"""ScreenMenu: pull-down menu, které si vývojář sám naplní (na rozdíl od
vestavěného Options je autorské – Python zakládá skupiny i položky).
`Screen.pin_menu(menu)` funguje i PŘED vytvořením Canvasu – Screen a Canvas
jsou nezávislé objekty, spojí je až `Canvas(screen=...)`. Menu se ale musí
naplnit CELÉ před `pin_menu()` – ten pošle neměnný snapshot (`menu.spec()`),
pozdější `menu.item(...)` by se do už odeslaného menu nepromítlo."""
import viewbase as vb

screen = vb.Screen(title="Menu demo")


def pridej_uzel(event):
    n = len(canvas.nodes)          # `canvas` se přiřadí až níž – closure
    novy = f"extra-{n}"            # se vyhodnotí až při kliku, ne teď
    canvas.ensure_node(novy, type="server", name=f"Extra {n}")
    canvas.ensure_edge("web-1", novy)


menu = vb.ScreenMenu()
menu.item("Graf", "Přidat uzel", on_select=pridej_uzel)
menu.item("Zobrazení", "Motiv: cyber", on_select=lambda e: canvas.set_theme("cyber"))
menu.item("Zobrazení", "Motiv: workbench",
          on_select=lambda e: canvas.set_theme("workbench"))
screen.pin_menu(menu)

canvas = vb.Canvas(screen=screen, title="Menu demo", theme="cyber")
canvas.define_type("server", shape="box", color="#28d7fe", size=1.4)
canvas.add_node("web-1", type="server", name="Web 01")
canvas.node_label("{name}")

vb.serve(canvas, port=8080, open_browser=True)

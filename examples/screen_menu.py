"""ScreenMenu: pull-down menu, které si vývojář sám naplní (na rozdíl od
vestavěného Options je autorské – Python zakládá skupiny i položky).
`Screen.pin_menu(menu)` funguje i PŘED vytvořením GraphWindow – Screen a GraphWindow
jsou nezávislé objekty, spojí je až `GraphWindow(screen=...)`. Menu se ale musí
naplnit CELÉ před `pin_menu()` – ten pošle neměnný snapshot (`menu.spec()`),
pozdější `menu.item(...)` by se do už odeslaného menu nepromítlo."""
import viewbase as vb

screen = vb.Screen(title="Menu demo")


def pridej_uzel(event):
    n = len(graph.nodes)          # `graph` se přiřadí až níž – closure
    novy = f"extra-{n}"            # se vyhodnotí až při kliku, ne teď
    graph.ensure_node(novy, type="server", name=f"Extra {n}")
    graph.ensure_edge("web-1", novy)


menu = vb.ScreenMenu()
menu.item("Graf", "Přidat uzel", on_select=pridej_uzel)
menu.item("Zobrazení", "Motiv: cyber", on_select=lambda e: graph.set_theme("cyber"))
menu.item("Zobrazení", "Motiv: workbench-amiga",
          on_select=lambda e: graph.set_theme("workbench-amiga"))
screen.pin_menu(menu)

graph = vb.GraphWindow(screen=screen, title="Menu demo", theme="cyber")
graph.define_type("server", shape="box", color="#28d7fe", size=1.4)
graph.add_node("web-1", type="server", name="Web 01")
graph.node_label("{name}")

vb.serve(graph, port=8080, open_browser=True)

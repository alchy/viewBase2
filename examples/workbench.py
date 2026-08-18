"""Workbench: všechny typy oken v jednom Amiga tématu.

    python examples/workbench.py                  # workbench-amiga (WB 1.3, modrá)
    python examples/workbench.py workbench-gray   # workbench-gray  (WB 3.x, šedá)

Na jednom screenu: grafové okno (podklad), formulářové okno (ControlWindow),
konzole (TerminalWindow – jedna plocha jako AmigaShell, prompt inline),
panel z prvků (HtmlWindow: heading/label/bar/input/select/slider/checkbox/
radio/kv/button) a systémové Log okno. Téma řídí lišty, rámy, sizing
gadget v rohu, barvy klíčů i podklad konzole – Python kód je stejný pro
všechna témata (`theme=` je jediný rozdíl)."""
import random, sys
import viewbase as vb

THEME = sys.argv[1] if len(sys.argv) > 1 else "workbench-amiga"
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8080

project = vb.Project(port=PORT)
screen = vb.Screen(title="Workbench")
graph = vb.GraphWindow(screen=screen, title="Síť", theme=THEME, dimensions=3, highlight_neighbors=1)
graph.define_type("server", shape="box", color="#28d7fe", size=1.4)
graph.define_type("db", shape="octahedron", color="#ff2a6d", size=1.6)
random.seed(1)
with graph.batch():
    for i in range(12):
        graph.add_node(f"srv-{i}", type="server", label="{name}", name=f"Server {i}", load=random.randint(5, 95))
    graph.add_node("db-0", type="db", label="{name}", name="Hlavní DB", load=37)
    for i in range(12):
        graph.add_edge(f"srv-{i}", f"srv-{random.randrange(i)}" if i and random.random() < .5 else "db-0")

vb.LogWindow(screen=screen)

# formulářové okno
form = vb.ControlWindow("render", title="Vykreslování")
form.enum("style", "Hrany", options=[("line", "Čáry"), ("spline", "Splajny")], value="line")
form.number("elasticity", "Elasticita", min=0.0, max=1.0, value=0.3)
form.boolean("labels", "Popisky", value=True)
graph.open_window(form, on_submit=lambda e: graph.set_edge_style(e.values["style"], elasticity=e.values["elasticity"]), live=True)

# terminál
term = vb.TerminalWindow("konzole", title="Konzole", prompt="1> ", width=420)
graph.open_terminal(term, on_input=lambda e: graph.terminal_write("konzole", f"echo: {e.line}"))
graph.terminal_write("konzole", "Workbench Screen 1.3  262K")
graph.terminal_write("konzole", "1> dir df0:")
graph.terminal_write("konzole", "  Utilities (dir)   System (dir)   Trashcan (dir)")

# panel z prvků
panel = vb.HtmlWindow("panel", title="Ovládání", width=420, height=330)
graph.open_html(panel)
panel.grid(cols=2)
titul = panel.heading("Server 0", row=0, col=0, colspan=2)
stav = panel.label("stav: v pořádku", row=1, col=0)
zatezb = panel.bar(63, row=1, col=1)
jmeno = panel.input("Název uzlu", value="srv-12", name="jmeno", row=2, col=0)
typ = panel.select("Typ", ["server", ("db", "databáze")], name="typ", row=2, col=1)
zatez = panel.slider("Zátěž (%)", value=50, name="zatez", row=3, col=0)
sleduj = panel.checkbox("Zvýraznit sousedy", value=True, name="sleduj", row=3, col=1)
rezim = panel.radio("Po přidání", ["nic", ("focus", "zaostřit")], value="focus", name="rezim", row=4, col=0, colspan=2)
panel.kv({"uptime": "41 d", "verze": vb.Ui.tag("1.3")}, row=5, col=0)
pridat = panel.button("Přidat uzel", name="pridat", row=5, col=1)

@pridat.on_click
def _(event):
    graph.ensure_node(jmeno.value, type=typ.value, label="{name}", name=jmeno.value, load=zatez.value)
    graph.ensure_edge(jmeno.value, "db-0")
    stav.text = f"přidán {jmeno.value}"
    titul.text = jmeno.value
    zatezb.value = zatez.value

@graph.every(2.0)
def tik():
    vb.log(f"tik: {len(graph.nodes)} uzlů", level="info")

vb.log("Workbench ukázka připravena", level="info")
project.serve(screen, open_browser=True)

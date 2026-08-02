"""Malý prototyp: typované uzly, klik na uzel otevře detail a zapíše do
logu (`TerminalWindow(input=False)`), a `ControlWindow` jako formulářový
dialog – přidání uzlu podle zadaných polí (id/jméno/typ/napojení), ne jen
live-apply přepínač vzhledu jako v `showcase.py`."""
import viewbase as vb

canvas = vb.Canvas(title="Prototyp", dimensions=3, theme="cyber", highlight_neighbors=1)

canvas.define_type("server", shape="box", color="#28d7fe", size=1.4)
canvas.define_type("db", shape="sphere", color="#ffd166", size=1.6)
canvas.define_type("client", shape="tetrahedron", color="#ff2a6d", size=1.0)

with canvas.batch():
    canvas.add_node("web-1", type="server", name="Web 01", ip="10.0.0.5")
    canvas.add_node("web-2", type="server", name="Web 02", ip="10.0.0.6")
    canvas.add_node("db-1", type="db", name="Primary DB", ip="10.0.0.10")
    canvas.add_node("cache-1", type="db", name="Redis", ip="10.0.0.11")
    canvas.add_node("client-1", type="client", name="Uživatel A", ip="192.168.1.20")
    canvas.add_node("client-2", type="client", name="Uživatel B", ip="192.168.1.21")

    canvas.add_edge("client-1", "web-1")
    canvas.add_edge("client-2", "web-1")
    canvas.add_edge("client-2", "web-2")
    canvas.add_edge("web-1", "db-1")
    canvas.add_edge("web-2", "db-1")
    canvas.add_edge("web-1", "cache-1")
    canvas.add_edge("web-2", "cache-1")

canvas.node_label("{name} ({ip})")

log = vb.TerminalWindow("log", title="Log", input=False, width=420)
canvas.open_terminal(log)


def zapis(text: str) -> None:
    canvas.terminal_write("log", text)


@canvas.on_click
def po_kliku(event):
    canvas.show_detail(event.node_id)
    zapis(f"klik: {event.node_id}")


# dialogové okno: přidání uzlu za běhu, napojeného na zvolený existující uzel
_add_win = vb.ControlWindow("add_node", title="Přidat uzel")
_add_win.string("id", "ID uzlu", maxlength=20)
_add_win.string("name", "Jméno", maxlength=40)
_add_win.enum("type", "Typ",
              options=[("server", "Server"), ("db", "DB"), ("client", "Klient")],
              value="server")
_add_win.string("connect_to", "Napojit na", value="web-1", maxlength=20)


def pridej_uzel(event):
    values = event.values
    node_id = values["id"].strip()
    if not node_id:
        zapis("chyba: ID uzlu nesmí být prázdné")
        return
    try:
        canvas.ensure_node(node_id, type=values["type"], name=values["name"] or node_id,
                           ip="—")
        if canvas.has_node(values["connect_to"]):
            canvas.ensure_edge(node_id, values["connect_to"])
        zapis(f"přidán uzel {node_id} ({values['type']}) → {values['connect_to']}")
    except ValueError as chyba:
        zapis(f"chyba: {chyba}")


canvas.open_window(_add_win, on_submit=pridej_uzel)

zapis("prototyp nastartoval")

vb.serve(canvas, port=8080, open_browser=True)

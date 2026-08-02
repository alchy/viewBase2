"""vb.log(): backend zprávy tečou do vestavěného okna "Log" v prohlížeči.
Klik na uzel loguje jako info, pravidelný tik jako debug – v Options
(skupina na liště nahoře) jde filtrovat podle úrovně/zdroje."""
import viewbase as vb

canvas = vb.Canvas(title="Log demo", theme="cyber", highlight_neighbors=1)
canvas.define_type("server", shape="box", color="#28d7fe", size=1.4)

with canvas.batch():
    canvas.add_node("web-1", type="server", name="Web 01")
    canvas.add_node("web-2", type="server", name="Web 02")
    canvas.add_edge("web-1", "web-2")

canvas.node_label("{name}")


@canvas.on_click
def po_kliku(event):
    canvas.show_detail(event.node_id)
    vb.log(f"klik na uzel {event.node_id}", level="info")


@canvas.every(3.0)
def heartbeat():
    vb.log("heartbeat: server žije", level="debug")


vb.serve(canvas, port=8080, open_browser=True)

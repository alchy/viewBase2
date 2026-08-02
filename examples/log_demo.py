"""vb.log() + interakce: klik na uzel loguje jako info, pravidelný tik
jako debug – v Options (lišta screenu, když je log okno aktivní) jde
filtrovat podle úrovně/zdroje. Log okno je tady umístěné EXPLICITNĚ
(vb.LogWindow(screen=…)); bez toho by se otevřelo samo až s prvním
záznamem."""
import viewbase as vb

project = vb.Project(port=8080)
screen = vb.Screen(title="Log demo")
graph = vb.GraphWindow(screen=screen, title="Log demo", theme="cyber",
                       highlight_neighbors=1)
vb.LogWindow(screen=screen)

graph.define_type("server", shape="box", color="#28d7fe", size=1.4)
with graph.batch():
    graph.add_node("web-1", type="server", name="Web 01")
    graph.add_node("web-2", type="server", name="Web 02")
    graph.add_edge("web-1", "web-2")
graph.node_label("{name}")


@graph.on_click
def po_kliku(event):
    graph.show_detail(event.node_id)
    vb.log(f"klik na uzel {event.node_id}", level="info")


@graph.every(3.0)
def heartbeat():
    vb.log("heartbeat: server žije", level="debug")


project.serve(screen, open_browser=True)

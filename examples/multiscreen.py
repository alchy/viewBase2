"""Víc živých screenů na jednom serveru (Amiga-style): každý screen má
vlastní lištu (Options, titulek, depth gadget vpravo), vlastní graf v okně
i téma. Depth gadget prohodí přední/zadní screen; tahem myší za lištu jde
přední screen stáhnout dolů a odkrýt ten pod ním (drag-reveal, předěl
zůstává, kam ho dotáhneš). Screen B navíc jde explicitně zavřít –
`Screen.destroy()` – přes REST trigger. U víc screenů je `screen_id`
v REST payloadu POVINNÝ (jinak server neví, kam event routovat):

    curl -s localhost:8080/api/event -H 'content-type: application/json' \\
         -d '{"event":"close_b","payload":{},"screen_id":1}'

Zavře screen Infra, frontend uklidí všechny jeho objekty (WebGL,
physics worker, DOM)."""
import viewbase as vb

project = vb.Project(port=8080)

screen_a = vb.Screen(title="Síť")
graph_a = vb.GraphWindow(screen=screen_a, title="Síť", theme="cyber")
graph_a.define_type("server", shape="box", color="#28d7fe", size=1.4)
with graph_a.batch():
    graph_a.add_node("web-1", type="server", name="Web 01")
    graph_a.add_node("web-2", type="server", name="Web 02")
    graph_a.add_edge("web-1", "web-2")
graph_a.node_label("{name}")

screen_b = vb.Screen(title="Infra")
graph_b = vb.GraphWindow(screen=screen_b, title="Infra", theme="workbench-gray")
graph_b.define_type("db", shape="sphere", color="#ffd166", size=1.6)
with graph_b.batch():
    graph_b.add_node("db-1", type="db", name="Primary DB")
    graph_b.add_node("db-2", type="db", name="Replica DB")
    graph_b.add_edge("db-1", "db-2")
graph_b.node_label("{name}")


def zavri_b(event):
    vb.log("zavírám screen Infra", level="warning")
    screen_b.destroy()


graph_a.on("close_b", zavri_b)


@graph_a.every(5.0)
def stav():
    vb.log("stav: oba screeny běží", level="info")


# explicitně umístěné systémové log okno (tail -f, AmigaShell styl)
vb.LogWindow(screen=screen_a)

project.serve(screen_a, screen_b, open_browser=True)

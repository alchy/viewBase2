"""Víc živých screenů na jednom serveru (Amiga-style): každý screen má
vlastní lištu (Options, titulek, depth gadget vpravo), vlastní graf v okně
i téma. Depth gadget prohodí přední/zadní screen; tahem myší za lištu jde
přední screen stáhnout dolů a odkrýt ten pod ním (drag-reveal, předěl
zůstává, kam ho dotáhneš). Screen B navíc jde explicitně zavřít –
`Screen.destroy()` – přes REST trigger. Víc canvasů =
`screen_id` v REST payloadu je POVINNÝ (jinak server neví, na který canvas
event routovat):

    curl -s localhost:8080/api/event -H 'content-type: application/json' \\
         -d '{"event":"close_b","payload":{},"screen_id":1}'

Zavře canvas_b, frontend odstraní jeho tab i všechny objekty (WebGL,
physics worker, DOM)."""
import viewbase as vb

screen_a = vb.Screen(title="Síť")
canvas_a = vb.Canvas(screen=screen_a, title="Síť", theme="cyber")
canvas_a.define_type("server", shape="box", color="#28d7fe", size=1.4)
with canvas_a.batch():
    canvas_a.add_node("web-1", type="server", name="Web 01")
    canvas_a.add_node("web-2", type="server", name="Web 02")
    canvas_a.add_edge("web-1", "web-2")
canvas_a.node_label("{name}")

screen_b = vb.Screen(title="Infra")
canvas_b = vb.Canvas(screen=screen_b, title="Infra", theme="workbench")
canvas_b.define_type("db", shape="sphere", color="#ffd166", size=1.6)
with canvas_b.batch():
    canvas_b.add_node("db-1", type="db", name="Primary DB")
    canvas_b.add_node("db-2", type="db", name="Replica DB")
    canvas_b.add_edge("db-1", "db-2")
canvas_b.node_label("{name}")


def zavri_b(event):
    vb.log("zavírám screen Infra", level="warning")
    screen_b.destroy()


canvas_a.on("close_b", zavri_b)


@canvas_a.every(5.0)
def stav():
    # tail -f demo: log okno (AmigaShell styl, bez close gadgetu) se samo
    # otevře na předním screenu při prvním záznamu
    vb.log("stav: oba screeny běží", level="info")

vb.serve(canvas_a, canvas_b, port=8080, open_browser=True)

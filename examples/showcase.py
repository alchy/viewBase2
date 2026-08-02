"""Showcase estetiky a toků: téma cyber, typy uzlů s tvary a barvami,
živá změna vzhledu za běhu (update_node color/type, define_type),
highlight_neighbors=2, typy toků a:
 - trvalý tok na pozadí (klient → server),
 - fire-and-forget tok při kliku na uzel (uzel → DB, cíl z meta uzlu),
 - live control okno (hrany čára/splajn + elasticita bez tlačítka Použít).
Žádný threading – periodický provoz řeší @graph.every()."""
import random

import viewbase as vb

graph = vb.GraphWindow(title="Showcase", theme="cyber", highlight_neighbors=2)
graph.define_type("server", shape="box", color="#28d7fe", size=1.4)
graph.define_type("db", shape="octahedron", color="#ff2a6d", size=1.6)
graph.define_type("client", shape="sphere", color="#05ffa1", size=0.9)

graph.define_flow_type("query", color="#ffd166", speed=1.3)   # klik → DB
graph.define_flow_type("heartbeat")                            # bez barvy → paleta

with graph.batch():
    for i in range(3):
        graph.add_node(f"srv-{i}", type="server", label="{name}",
                        name=f"Server {i}", os="Debian")
    graph.add_node("db-0", type="db", label="{name}", name="Hlavní DB")
    for i in range(12):
        graph.add_node(f"cl-{i}", type="client", label="{name}",
                        name=f"Klient {i}", status="idle",
                        server=f"srv-{i % 3}")
        graph.add_edge(f"cl-{i}", f"srv-{i % 3}")
    for i in range(3):
        graph.add_edge(f"srv-{i}", "db-0")

# trvalé toky na pozadí: každý server tepe heartbeaty do DB
for i in range(3):
    graph.flow(f"srv-{i}", "db-0", type="heartbeat", count=None, interval=0.8)


@graph.on_click
def on_click(event):
    """Klik na klienta → tok dotazu přes jeho server do DB (multi-hop).
    Cíl se čte z metadat uzlu (čtecí API), žádné parsování id."""
    node = graph.node(event.node_id)
    if node and node["type"] == "client":
        graph.flow(path=[node["id"], node["meta"]["server"], "db-0"],
                    type="query", count=4, interval=0.15)


_busy: list[str] = []


@graph.every(1.5)
def provoz() -> None:
    """Náhodný klient se rozsvítí dožluta, další tik ho zhasne – živá data.
    Barva jde přes meta (meta > typ > téma); `color=None` ji zase sundá,
    takže uzel spadne zpátky na barvu svého typu."""
    while _busy:
        graph.update_node(_busy.pop(), color=None, status="idle")
    cl = f"cl-{random.randrange(12)}"
    graph.update_node(cl, color="#ffd166", status="busy")
    _busy.append(cl)


_zaloha = [False]


@graph.every(6.0)
def prepni_zalohu() -> None:
    """Živá změna vzhledu bez odebírání uzlů:
     - `update_node(type=...)` přepne jeden uzel na jiný typ (tvar i barva),
     - `define_type` za běhu přebarví rovnou celý typ (tady všechny servery)."""
    _zaloha[0] = not _zaloha[0]
    graph.update_node("srv-2", type="db" if _zaloha[0] else "server")
    graph.define_type("server", shape="box", size=1.4,
                       color="#ff9f1c" if _zaloha[0] else "#28d7fe")


# control okno: styl hran (čára/splajn) + elasticita; live = změny se
# aplikují rovnou při tažení slideru, bez tlačítka Použít
_render_win = vb.ControlWindow("render", title="Vykreslování")
_render_win.enum("style", "Hrany",
                 options=[("line", "Čáry"), ("spline", "Splajny")],
                 value="line")
_render_win.number("elasticity", "Elasticita", min=0.0, max=1.0,
                   value=0.3, step=0.05)


def _apply_render(event):
    graph.set_edge_style(event.values["style"],
                          elasticity=event.values["elasticity"])


graph.open_window(_render_win, on_submit=_apply_render, live=True)

vb.serve(graph, port=8080, open_browser=True)

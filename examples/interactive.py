"""Interaktivní demo: klik na uzel zobrazí detail a přidá mu 3 sousedy."""
import itertools
import random

import viewbase as vb

graph = vb.GraphWindow(title="Interaktivní graf", dimensions=3,
                   highlight_neighbors=1)

with graph.batch():
    for i in range(12):
        graph.add_node(f"n{i}", value=i)
    for i in range(1, 12):
        graph.add_edge(f"n{i}", f"n{random.randrange(i)}")

_counter = itertools.count()


@graph.on_click
def expand(event):                       # event.node_id, .client_id
    graph.show_detail(event.node_id)    # akce na uzel, který klient už zná
    with graph.batch():
        for _ in range(3):
            new_id = f"x{next(_counter)}"
            graph.add_node(new_id, parent=event.node_id)
            graph.add_edge(event.node_id, new_id)


@graph.on_hover
def hover(event):
    print(f"hover: {event.node_id} (klient {event.client_id})")


@graph.on_view_change
def view(event):
    print(f"view_change: zoom={event.zoom}")


vb.serve(graph, port=8080, open_browser=True)

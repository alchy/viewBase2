"""Quickstart 2D: stejný živý graf v rovině (ortografická kamera, pan/zoom)."""
import random

import viewbase as vb

graph = vb.GraphWindow(title="Quickstart 2D", dimensions=2)

with graph.batch():
    for i in range(30):
        graph.add_node(f"n{i}", value=i)
    for i in range(1, 30):
        graph.add_edge(f"n{i}", f"n{random.randrange(i)}")


@graph.every(2.0)
def zivy_graf() -> None:
    i = len(graph.nodes)
    with graph.batch():
        graph.add_node(f"n{i}", value=i)
        graph.add_edge(f"n{i}", f"n{random.randrange(i)}")


vb.serve(graph, port=8080, open_browser=True)

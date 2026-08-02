"""Quickstart – kanonický workflow (explicitní, jako fopen → close):
1. Project (služba, port) → 2. Screen (plocha) → 3. okna na screenu →
4. data přes instance oken → 5. project.serve(screen). Do grafu každé
2 s přibude uzel."""
import random

import viewbase as vb

project = vb.Project(port=8080)              # 1. služba: port před vším
screen = vb.Screen(title="Quickstart")       # 2. plocha → dostane id
graph = vb.GraphWindow(screen=screen,        # 3. grafové okno na screenu
                       title="Quickstart", dimensions=3)

with graph.batch():                          # 4. data přes instanci okna
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


project.serve(screen, open_browser=True)     # 5. start služby (blokuje)

"""ensure_node/ensure_edge (idempotentní zápis) a čtecí API canvasu."""
import pytest

from viewbase import Canvas


def test_ensure_node_creates_then_upserts_meta():
    c = Canvas()
    c.ensure_node("a", status="new")
    assert c.has_node("a")
    seq, deltas = c.drain()
    assert deltas["add_nodes"][0]["meta"] == {"status": "new"}
    c.ensure_node("a", status="new")             # beze změny → žádný patch
    assert c.drain() is None
    c.ensure_node("a", status="busy", ip="1.2.3.4")
    seq, deltas = c.drain()
    assert deltas["update_nodes"][0]["meta"] == {"status": "busy",
                                                 "ip": "1.2.3.4"}


def test_ensure_node_switches_type():
    c = Canvas()
    c.define_type("server")
    c.define_type("db")
    c.ensure_node("a", type="server")
    c.drain()
    c.ensure_node("a", type="server")            # shodný typ = idempotentní
    c.ensure_node("a")                           # nezadaný typ = no-op
    assert c.drain() is None
    c.ensure_node("a", type="db")                # změna typu = patch
    seq, deltas = c.drain()
    assert deltas["update_nodes"][0]["type"] == "db"
    with pytest.raises(ValueError):
        c.ensure_node("a", type="ghost")         # nedefinovaný typ
    assert c.node("a")["type"] == "db"


def test_ensure_node_switches_label_template():
    c = Canvas()
    c.ensure_node("a", label="{x}", x="X", y="Y")
    c.drain()
    c.ensure_node("a", label="{x}")
    assert c.drain() is None
    c.ensure_node("a", label="{y}")
    seq, deltas = c.drain()
    assert deltas["update_nodes"][0]["label"] == "Y"


def test_ensure_edge_creates_then_merges_meta():
    c = Canvas()
    c.ensure_node("a")
    c.ensure_node("b")
    c.ensure_edge("a", "b", kind="lan")
    assert c.has_edge("b", "a")                  # neorientovaně
    c.drain()
    c.ensure_edge("b", "a", kind="lan")          # beze změny → žádný patch
    assert c.drain() is None
    c.ensure_edge("a", "b", kind="wan")
    seq, deltas = c.drain()
    assert deltas["add_edges"][0]["meta"] == {"kind": "wan"}


def test_ensure_edge_requires_nodes():
    c = Canvas()
    with pytest.raises(ValueError):
        c.ensure_edge("x", "y")


def test_node_and_edge_read_return_copies():
    c = Canvas()
    c.add_node("a", label="{name}", name="Alfa")
    c.add_node("b")
    c.add_edge("a", "b", w=1)
    n = c.node("a")
    assert n == {"id": "a", "type": None, "label": "Alfa",
                 "meta": {"name": "Alfa"}}
    n["meta"]["name"] = "Hacked"
    assert c.node("a")["meta"]["name"] == "Alfa"   # kopie, ne odkaz
    assert c.node("ghost") is None
    e = c.edge("b", "a")
    assert e["meta"] == {"w": 1}
    e["meta"]["w"] = 9
    assert c.edge("a", "b")["meta"] == {"w": 1}
    assert c.edge("a", "ghost") is None


def test_nodes_edges_listing():
    c = Canvas()
    c.add_node("a")
    c.add_node("b")
    c.add_edge("a", "b")
    assert [n["id"] for n in c.nodes] == ["a", "b"]
    assert [(e["source"], e["target"]) for e in c.edges] == [("a", "b")]
    assert not c.has_node("ghost")
    assert not c.has_edge("a", "ghost")

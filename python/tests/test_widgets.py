"""Prvky (widgets) na instanci HtmlWindow – primární API pro začátečníka:
katalog prvků, id, grid, .text/.value, handlery, html_patch, values s typy."""
import threading

import pytest

from viewbase import GraphWindow, HtmlWindow


def _open():
    g = GraphWindow()
    w = HtmlWindow("panel", title="Ovládání")
    g.open_html(w)
    g.drain_actions()
    return g, w


def test_elements_get_stable_ids_and_render_in_flow():
    w = HtmlWindow("panel")
    h = w.heading("Server 0")
    lab = w.label("stav: běží")
    btn = w.button("Přidat")
    assert (h.id, lab.id, btn.id) == ("panel-1", "panel-2", "panel-3")
    assert btn.name == "panel-3"                 # bez name = id
    html = w.html
    assert '<div class="vb-el" id="panel-1"><h2>Server 0</h2></div>' in html
    assert '<div class="vb-el" id="panel-2"><p>stav: běží</p></div>' in html
    assert ('<div class="vb-el" id="panel-3"><button data-vb-event="panel-3" '
            'data-vb-id="panel-3">Přidat</button></div>') in html
    assert w.spec()["html"] == html              # init replay = celé okno


def test_grid_places_elements_by_row_col():
    w = HtmlWindow("panel")
    w.grid(cols=2)
    w.heading("Titul", row=0, col=0, colspan=2)
    w.button("A", row=1, col=0)
    w.button("B", row=1, col=1)
    html = w.html
    assert '<div class="vb-grid" style="grid-template-columns:repeat(2,1fr)">' in html
    assert 'style="grid-row:1;grid-column:1/span 2"' in html
    assert 'style="grid-row:2;grid-column:2"' in html


def test_fields_render_with_name_label_and_value():
    w = HtmlWindow("panel")
    jmeno = w.input("Název", value="srv-9", name="jmeno", placeholder="id")
    zatez = w.slider("Zátěž", value=50, min=0, max=100, name="zatez")
    sleduj = w.checkbox("Sledovat", value=True, name="sleduj")
    zivy = w.slider("Živě", value=1, min=0, max=5, live=True)
    html = w.html
    assert '<label for="panel-1">Název</label>' in html
    assert ('<input type="text" id="panel-1" name="jmeno" value="srv-9" '
            'placeholder="id" data-vb-id="panel-1">') in html
    assert ('<input type="range" id="panel-2" name="zatez" value="50" min="0" max="100" '
            'step="1" data-vb-id="panel-2"> <output for="zatez">50</output>') in html
    assert '<input type="checkbox" id="panel-3" name="sleduj" checked data-vb-id="panel-3">' in html
    assert 'data-vb-live' in html and zivy.live is True
    assert (jmeno.value, zatez.value, sleduj.value) == ("srv-9", 50, True)


def test_adding_element_to_open_window_sends_html_set():
    g, w = _open()
    w.label("ahoj")
    (a,) = g.drain_actions()
    assert a["action"] == "html_set" and a["window_id"] == "panel"
    assert '<p>ahoj</p>' in a["html"]


def test_setting_text_or_value_sends_html_patch_of_that_element_only():
    g, w = _open()
    stav = w.label("stav: ?")
    zatez = w.slider("Zátěž", value=10, name="zatez")
    g.drain_actions()
    stav.text = "stav: běží"
    zatez.value = 40
    a, b = g.drain_actions()
    assert a == {"action": "html_patch", "window_id": "panel", "id": "panel-1",
                 "html": '<div class="vb-el" id="panel-1"><p>stav: běží</p></div>'}
    assert b["action"] == "html_patch" and b["id"] == "panel-2" and 'value="40"' in b["html"]
    assert 'stav: běží' in w.html                # replay má nový stav


def test_click_event_updates_values_first_then_calls_handlers():
    g, w = _open()
    jmeno = w.input("Název", name="jmeno")
    zatez = w.slider("Zátěž", value=1, name="zatez")
    sleduj = w.checkbox("Sledovat", name="sleduj")
    btn = w.button("Přidat", name="pridat")
    seen = {}
    done = threading.Event()

    @btn.on_click
    def _(event):
        seen.update(element=event.element, kind=event.kind, name=event.name,
                    value=event.value, values=event.values,
                    jmeno=jmeno.value, zatez=zatez.value, sleduj=sleduj.value)
        done.set()

    g.dispatch_event("html_event", {
        "window_id": "panel", "event": "pridat", "kind": "click", "id": "panel-4",
        "value": None,
        "values": {"jmeno": "srv-9", "zatez": 42, "sleduj": True}, "client_id": "x"})
    assert done.wait(2.0)
    assert seen["element"] is btn and seen["kind"] == "click" and seen["name"] == "pridat"
    assert seen["value"] is None
    assert seen["values"] == {"jmeno": "srv-9", "zatez": 42, "sleduj": True}
    assert (seen["jmeno"], seen["zatez"], seen["sleduj"]) == ("srv-9", 42, True)   # už aktuální
    g.close()


def test_change_and_submit_handlers_and_window_on_event():
    g, w = _open()
    zatez = w.slider("Zátěž", value=1, name="zatez")
    jmeno = w.input("Název", name="jmeno")
    got = []
    done = threading.Event()
    zatez.on_change(lambda e: got.append(("change", e.value)))
    jmeno.on_submit(lambda e: got.append(("submit", e.value)))
    w.on_event(lambda e: (got.append(("win", e.kind, e.element.id)),
                          done.set() if len(got) >= 4 else None))
    g.dispatch_event("html_event", {"window_id": "panel", "event": "zatez", "kind": "change",
                                    "id": "panel-1", "value": 77, "values": {"zatez": 77},
                                    "client_id": "x"})
    g.dispatch_event("html_event", {"window_id": "panel", "event": "jmeno", "kind": "submit",
                                    "id": "panel-2", "value": "srv-1",
                                    "values": {"jmeno": "srv-1"}, "client_id": "x"})
    assert done.wait(2.0)
    assert ("change", 77) in got and ("submit", "srv-1") in got
    assert ("win", "change", "panel-1") in got and ("win", "submit", "panel-2") in got
    assert zatez.value == 77 and jmeno.value == "srv-1"
    g.close()


def test_raw_html_set_still_works_alongside_elements():
    g, w = _open()
    g.html_set("panel", "<i>raw</i>")
    w.label("prvek")
    assert w.html.startswith("<i>raw</i>")
    assert '<p>prvek</p>' in w.html

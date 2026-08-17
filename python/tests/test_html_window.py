import threading

import pytest

from viewbase import GraphWindow, HtmlWindow


def test_spec_has_html_kind_size_and_content():
    w = HtmlWindow("uzel", title="Uzel", width=420, height=260, closable=False)
    assert w.spec() == {
        "window_id": "uzel", "title": "Uzel", "kind": "html",
        "width": 420, "height": 260, "closable": False, "html": "",
    }


def test_defaults():
    w = HtmlWindow("p")
    assert (w.width, w.height, w.closable, w.html) == (560, 320, True, "")


def test_invalid_size_raises():
    with pytest.raises(ValueError):
        HtmlWindow("p", width=0)
    with pytest.raises(ValueError):
        HtmlWindow("p", height=-1)


def test_set_and_append_keep_content():
    w = HtmlWindow("p")
    w.set_html("<h1>A</h1>")
    w.append_html("<p>b</p>")
    assert w.html == "<h1>A</h1><p>b</p>"
    w.set_html("<i>x</i>")               # set nahradí vše
    assert w.html == "<i>x</i>"


def test_append_trims_from_front_on_tag_boundary():
    w = HtmlWindow("p")
    w.MAX_HTML = 40                      # instanční přepis stropu pro test
    for i in range(10):
        w.append_html(f"<div>řádek {i}</div>")   # 18 znaků každý
    assert len(w.html) <= 40
    assert w.html.startswith("<div>")    # ořez na hranici tagu, ne uprostřed
    assert w.html.endswith("<div>řádek 9</div>")


def test_open_html_queues_action_and_snapshot():
    c = GraphWindow()
    c.open_html(HtmlWindow("uzel", title="Uzel"))
    (a,) = c.drain_actions()
    assert a["action"] == "open_window"    # sdílí render cestu s control/terminál
    assert a["kind"] == "html"
    assert a["window_id"] == "uzel"
    windows = c.snapshot()["windows"]
    assert [(w["window_id"], w["kind"]) for w in windows] == [("uzel", "html")]


def test_html_set_and_append_queue_actions_and_update_replay():
    c = GraphWindow()
    c.open_html(HtmlWindow("uzel"))
    c.drain_actions()
    c.html_set("uzel", "<h1>A</h1>")
    c.html_append("uzel", "<p>b</p>")
    assert c.drain_actions() == [
        {"action": "html_set", "window_id": "uzel", "html": "<h1>A</h1>"},
        {"action": "html_append", "window_id": "uzel", "html": "<p>b</p>"},
    ]
    (w,) = c.snapshot()["windows"]
    assert w["html"] == "<h1>A</h1><p>b</p>"   # replay po reconnectu nese vše


def test_html_set_unknown_raises():
    with pytest.raises(ValueError):
        GraphWindow().html_set("ghost", "x")
    with pytest.raises(ValueError):
        GraphWindow().html_append("ghost", "x")


def test_html_event_calls_on_event_with_event_and_value():
    c = GraphWindow()
    done = threading.Event()
    got = {}

    def on_event(event):
        got.update(window_id=event.window_id, event=event.event, value=event.value)
        done.set()

    c.open_html(HtmlWindow("uzel"), on_event=on_event)
    c.dispatch_event("html_event", {"window_id": "uzel", "event": "focus",
                                    "value": "srv-0", "client_id": "x"})
    assert done.wait(2.0)
    assert got == {"window_id": "uzel", "event": "focus", "value": "srv-0"}
    c.close()


def test_html_event_without_value_gives_none():
    c = GraphWindow()
    done = threading.Event()
    got = {}

    def on_event(event):
        got["value"] = event.value
        done.set()

    c.open_html(HtmlWindow("uzel"), on_event=on_event)
    c.dispatch_event("html_event", {"window_id": "uzel", "event": "ping",
                                    "client_id": "x"})
    assert done.wait(2.0)
    assert got == {"value": None}
    c.close()


def test_replace_html_window_without_on_event_clears_callback():
    c = GraphWindow()
    calls = []
    c.open_html(HtmlWindow("uzel"), on_event=lambda e: calls.append(e))
    c.open_html(HtmlWindow("uzel"))            # nahrazení bez on_event
    c.dispatch_event("html_event", {"window_id": "uzel", "event": "x",
                                    "client_id": "x"})
    c.close()
    assert calls == []


def test_close_window_works_for_html():
    c = GraphWindow()
    c.open_html(HtmlWindow("uzel"))
    c.drain_actions()
    c.close_window("uzel")
    (a,) = c.drain_actions()
    assert a == {"action": "close_window", "window_id": "uzel"}
    assert c.snapshot()["windows"] == []

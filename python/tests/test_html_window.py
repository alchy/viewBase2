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

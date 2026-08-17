"""vb.Ui – builder obsahu HTML okna: vývojář nepíše HTML, jen skládá prvky.
Testy kontrolují generované HTML (třídy boilerplate, escapování, formuláře)."""
import pytest

from viewbase import GraphWindow, HtmlWindow, Ui


def test_heading_text_escaped_and_tag():
    ui = Ui().heading("A <b> & B", tag="server")
    assert str(ui) == '<h2>A &lt;b&gt; &amp; B <span class="vb-tag">server</span></h2>'


def test_kv_table_with_inline_helpers():
    ui = Ui()
    ui.kv({"id": "srv-0", "stav": ui.ok("běží"), "zátěž": ui.bar(63)})
    html = str(ui)
    assert html.startswith('<table class="kv">')
    assert '<tr><td>id</td><td>srv-0</td></tr>' in html
    assert '<span class="vb-ok">běží</span>' in html
    assert '<span class="vb-bar" style="width:160px"><i style="width:63%"></i></span> 63 %' in html


def test_inline_helpers_escape_but_are_not_double_escaped():
    ui = Ui()
    warn = ui.warn("<x>")
    ui.text("stav: ", warn)
    assert str(ui) == '<p>stav: <span class="vb-warn">&lt;x&gt;</span></p>'


def test_buttons_and_link_carry_event_and_value():
    ui = Ui().buttons(("Zaostřit", "focus", "srv-0"), ("Ping", "ping"))
    assert str(ui) == ('<div class="vb-actions">'
                       '<button data-vb-event="focus" data-vb-value="srv-0">Zaostřit</button>'
                       '<button data-vb-event="ping">Ping</button></div>')
    assert str(Ui().link("srv-3", "focus", "srv-3")) == \
        '<a href="#" data-vb-event="focus" data-vb-value="srv-3">srv-3</a>'


def test_table_right_aligns_numbers():
    ui = Ui().table(["uzel", "stupeň"], [["srv-0", 1284], ["db-0", 640]])
    html = str(ui)
    assert '<th>uzel</th><th class="num">stupeň</th>' in html
    assert '<td>srv-0</td><td class="num">1284</td>' in html


def test_form_fields_render_names_labels_and_submit():
    ui = Ui()
    f = ui.form("pridat", submit="Přidat")
    f.text("jmeno", "Název", value="srv-9", placeholder="id uzlu")
    f.number("zatez", "Zátěž", value=50, min=0, max=100)
    f.slider("prio", "Priorita", value=3, min=1, max=5)
    f.checkbox("sledovat", "Sledovat", value=True)
    f.select("typ", "Typ", ["server", ("db", "Databáze")], value="db")
    f.textarea("pozn", "Poznámka", value="a<b", rows=2)
    f.button("Zrušit", "zrusit")
    html = str(ui)
    assert html.startswith('<form data-vb-event="pridat">')
    assert '<input type="text" id="pridat-jmeno" name="jmeno" value="srv-9" placeholder="id uzlu">' in html
    assert '<input type="number" id="pridat-zatez" name="zatez" value="50" min="0" max="100">' in html
    assert '<input type="range" id="pridat-prio" name="prio" value="3" min="1" max="5" step="1">' in html
    assert '<output for="prio">3</output>' in html
    assert '<input type="checkbox" id="pridat-sledovat" name="sledovat" checked>' in html
    assert '<option value="server">server</option><option value="db" selected>Databáze</option>' in html
    assert '<textarea id="pridat-pozn" name="pozn" rows="2">a&lt;b</textarea>' in html
    assert '<button type="button" data-vb-event="zrusit">Zrušit</button>' in html
    assert html.rstrip().endswith('<button type="submit">Přidat</button></div></form>')
    # popisky polí v tabulce klíč/hodnota jako control okno
    assert '<td><label for="pridat-jmeno">Název</label></td>' in html


def test_grid_cells_and_list_and_misc():
    ui = Ui()
    g = ui.grid(cols=2)
    g.cell(Ui().kv({"uptime": "41 d"}))
    g.cell(Ui().list(["a", "b"]))
    ui.hr().note("malé písmo").pre("x < y")            # fluent: každá metoda vrací ui
    html = str(ui)
    assert '<div class="vb-grid" style="grid-template-columns:repeat(2,1fr)">' in html
    assert '<div class="vb-cell"><table class="kv">' in html
    assert '<ul><li>a</li><li>b</li></ul>' in html
    assert '<hr>' in html and '<p class="small">malé písmo</p>' in html
    assert '<pre>x &lt; y</pre>' in html


def test_row_muted_code_and_raw():
    ui = Ui()
    ui.row(ui.muted("09:41"), ui.code("srv-3"), "zátěž 92 %", ui.raw("<b>!</b>"))
    assert str(ui) == ('<div class="vb-row"><span class="vb-key">09:41</span> '
                       '<code>srv-3</code> zátěž 92 % <b>!</b></div>')


def test_html_set_and_append_accept_ui():
    c = GraphWindow()
    c.open_html(HtmlWindow("k"))
    c.drain_actions()
    c.html_set("k", Ui().heading("A"))
    c.html_append("k", Ui().text("b"))
    assert c.drain_actions() == [
        {"action": "html_set", "window_id": "k", "html": "<h2>A</h2>"},
        {"action": "html_append", "window_id": "k", "html": "<p>b</p>"},
    ]
    assert c.snapshot()["windows"][0]["html"] == "<h2>A</h2><p>b</p>"

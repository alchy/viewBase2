"""HTML okno: ovládací panel poskládaný z PRVKŮ – bez psaní HTML.

Vzor pro začátečníka (čtyři kroky):
 1. instance okna       okno = vb.HtmlWindow(...); graph.open_html(okno)
 2. mřížka (volitelně)  okno.grid(cols=2)  → prvky dostanou row=/col=
 3. prvky z katalogu    okno.heading/label (výstup), okno.button/input/
                        slider/checkbox (interakce); každý má .id, .name,
                        .text nebo .value – čtení i zápis
 4. události            @prvek.on_click / on_change / on_submit – event
                        říká, KTERÝ prvek (event.element, event.name), co
                        se stalo (event.kind) a hodnoty všech polí
                        (event.values); .value polí jsou v handleru už
                        aktuální, netřeba nic parsovat

Změna prvku z Pythonu (stav.text = ..., zatez.value = 40) překreslí jen
ten prvek – rozepsaný text v jiných polích zůstane. Co v okně NEJDE:
vlastní HTML/CSS/JS (záměrně – jednoduchost a jednotný vzhled; pokročilí
mají graph.html_set(...) s raw HTML, viz README).
"""
import random

import viewbase as vb

graph = vb.GraphWindow(title="HTML okno", theme="cyber", highlight_neighbors=1)
graph.define_type("server", shape="box", color="#28d7fe", size=1.4)
graph.define_type("db", shape="octahedron", color="#ff2a6d", size=1.6)

with graph.batch():
    for i in range(3):
        graph.add_node(f"srv-{i}", type="server", label="{name}", name=f"Server {i}",
                       load=random.randint(10, 95))
    graph.add_node("db-0", type="db", label="{name}", name="Hlavní DB", load=37)
    for i in range(3):
        graph.add_edge(f"srv-{i}", "db-0")

# 1) instance okna – od téhle chvíle na ni věšíme prvky i kód
panel = vb.HtmlWindow("panel", title="Ovládání", width=440, height=300)
graph.open_html(panel)

# 2) mřížka 2 sloupce; row/col jsou od nuly, colspan roztáhne přes sloupce
panel.grid(cols=2)

# 3) prvky – každý dostane id (panel-1, panel-2, …); name je klíč do event.values
titul  = panel.heading("Server 0", row=0, col=0, colspan=2)
stav   = panel.label("stav: v pořádku", row=1, col=0, colspan=2)
jmeno  = panel.input("Název nového uzlu", value="srv-3", name="jmeno",
                     placeholder="např. srv-9", row=2, col=0)
zatez  = panel.slider("Zátěž nového uzlu (%)", value=50, min=0, max=100,
                      name="zatez", row=2, col=1)
sleduj = panel.checkbox("Zvýraznit sousedy po přidání", value=True,
                        name="sleduj", row=3, col=0, colspan=2)
pridat = panel.button("Přidat uzel", name="pridat", row=4, col=0)
reset  = panel.button("Reset zátěže", name="reset", row=4, col=1)


# 4) události – handler dostane event s .element / .name / .kind / .value / .values
@pridat.on_click
def pridej_uzel(event) -> None:
    """Klik na tlačítko: hodnoty polí čteme rovnou z prvků (už jsou aktuální)."""
    node = jmeno.value.strip()
    if not node:
        stav.text = vb.Ui.warn("zadej název uzlu")      # bohatý text = vb.Ui pomocník
        return
    graph.ensure_node(node, type="server", label="{name}", name=node, load=zatez.value)
    graph.ensure_edge(node, "db-0")
    if sleduj.value:
        graph.highlight(node, depth=1)
    stav.text = f"přidán {node} (zátěž {zatez.value} %)"
    titul.text = node
    jmeno.value = f"srv-{len(graph.nodes)}"           # zápis do pole → jen to pole se překreslí


@reset.on_click
def reset_zateze(event) -> None:
    zatez.value = 0                                    # posuvník se přesune
    stav.text = "zátěž vynulována"


@zatez.on_change
def zatez_zmenena(event) -> None:
    """Slider po puštění (slider(..., live=True) by hlásil i při tažení)."""
    stav.text = f"zátěž nastavena na {event.value} %"  # event.value je číslo


@jmeno.on_submit
def enter_v_poli(event) -> None:
    """Enter v textovém poli: zaostři uzel toho jména, když existuje."""
    if graph.node(event.value):
        graph.focus(event.value)
        stav.text = f"zaostřeno na {event.value}"
    else:
        stav.text = vb.Ui.err(f"uzel {event.value} neexistuje")


@panel.on_event
def vsechny_udalosti(event) -> None:
    """Jeden handler na vše – hodí se na logování; event.kind = click/change/submit."""
    vb.log(f"panel: {event.kind} {event.name} value={event.value!r}", level="debug")


@graph.on_click
def klik_do_grafu(event) -> None:
    """Klik na uzel v grafu → panel ukáže jeho jméno a zátěž."""
    uzel = graph.node(event.node_id) or {}
    titul.text = uzel.get("meta", {}).get("name", event.node_id)
    stav.text = f"zátěž {uzel.get('meta', {}).get('load', '?')} %"


vb.serve(graph, port=8080, open_browser=True)

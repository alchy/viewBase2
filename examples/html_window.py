"""HTML okno: formátovaný obsah z Pythonu v okně prohlížeče.

Ukazuje, co `HtmlWindow` umí a jak s ním pracovat:
 - `open_html(win, on_event=…)` – okno s HTML obsahem; klik na prvek s
   `data-vb-event` přijde do handleru jako `event.event` (+ `event.value`),
 - `html_set` – nahradí celý obsah (karta uzlu po kliku do grafu),
 - `html_append` – připíše fragment na konec (živý výpis, drží konec),
 - boilerplate: obsah je vysázený stylem ostatních oken (barvy z tématu),
   utility třídy `.vb-tag`, `.vb-ok/.vb-warn/.vb-err`, `.vb-bar`,
   `table.kv`, `.vb-actions`; vlastní `<style>` má poslední slovo,
 - co NEJDE (záměrně): JS v posílaném HTML se odstraní, odkazy nenavigují –
   „prohlížeč v prohlížeči" interpretuje jen to, co mu pošle server.

Spusť a klikni na uzel v grafu (karta), nebo na tlačítka v kartě.
"""
import random

import viewbase as vb

graph = vb.GraphWindow(title="HTML okno", theme="cyber", highlight_neighbors=1)
graph.define_type("server", shape="box", color="#28d7fe", size=1.4)
graph.define_type("db", shape="octahedron", color="#ff2a6d", size=1.6)

with graph.batch():
    for i in range(6):
        graph.add_node(f"srv-{i}", type="server", label="{name}", name=f"Server {i}",
                       load=random.randint(10, 95))
    graph.add_node("db-0", type="db", label="{name}", name="Hlavní DB", load=37)
    for i in range(6):
        graph.add_edge(f"srv-{i}", "db-0")

# 1) Karta uzlu – obsah se NAHRAZUJE (html_set) při každém kliku do grafu.
karta = vb.HtmlWindow("karta", title="Uzel", width=420, height=250)
# 2) Živý výpis – obsah se PŘIPISUJE (html_append), okno drží konec.
udalosti = vb.HtmlWindow("udalosti", title="Události", width=520, height=220)


def karta_html(node_id: str) -> str:
    """HTML karty: `table.kv` vypadá jako detail okno (klíče v barvě klíčů
    tématu), tlačítka jako control okno; `data-vb-event`/`data-vb-value`
    se vrátí v eventu html_event jako `.event`/`.value`."""
    uzel = graph.node(node_id) or {}
    meta = uzel.get("meta", {})
    zatez = int(meta.get("load", 0))
    stav = ('<span class="vb-ok">● v pořádku</span>' if zatez < 80
            else '<span class="vb-warn">▲ přetížený</span>')
    return f"""
    <h2>{meta.get('name', node_id)} <span class="vb-tag">{uzel.get('type') or 'uzel'}</span></h2>
    <table class="kv">
      <tr><td>id</td><td><code>{node_id}</code></td></tr>
      <tr><td>stav</td><td>{stav}</td></tr>
      <tr><td>zátěž</td><td><div class="vb-bar" style="width:160px"><i style="width:{zatez}%"></i></div> {zatez} %</td></tr>
    </table>
    <div class="vb-actions">
      <button data-vb-event="focus" data-vb-value="{node_id}">Zaostřit</button>
      <button data-vb-event="sousede" data-vb-value="{node_id}">Sousedé</button>
      <button data-vb-event="restart" data-vb-value="{node_id}">Restart</button>
    </div>
    """


def na_klik_v_karte(event) -> None:
    """Handler html_event: `event.event` je hodnota data-vb-event,
    `event.value` hodnota data-vb-value (nebo None, když prvek žádnou nemá)."""
    if event.event == "focus":
        graph.focus(event.value)                       # kamera najede na uzel
    elif event.event == "sousede":
        graph.highlight(event.value, depth=1)          # zvýrazní okolí v grafu
    elif event.event == "restart":
        graph.update_node(event.value, load=random.randint(5, 30))
        graph.html_set("karta", karta_html(event.value))   # karta se překreslí
        graph.html_append("udalosti",
                          f'<div><span class="vb-key">restart</span> <code>{event.value}</code> '
                          f'<span class="vb-ok">✓</span></div>')


graph.open_html(karta, on_event=na_klik_v_karte)
graph.open_html(udalosti)                        # bez on_event – jen výpis
graph.html_set("karta", karta_html("srv-0"))
# Vlastní <style> je povolený a má poslední slovo – tady podbarví řádky
# výpisu se třídou "w" (přetížení). <script> by naopak frontend odstranil.
graph.html_set("udalosti", '<style>.w{background:rgba(232,160,47,.12)}</style>'
                           '<h3>Živý výpis</h3>')


@graph.on_click
def klik_do_grafu(event) -> None:
    """Klik na uzel v grafu → karta se přepíše na tenhle uzel (html_set)."""
    graph.html_set("karta", karta_html(event.node_id))


@graph.every(1.5)
def tik() -> None:
    """Každou 1,5 s jeden řádek do výpisu (html_append). Odkaz na uzel je
    obyčejné <a href="#"> s data-vb-event – nenaviguje, jen pošle event."""
    node = random.choice([f"srv-{i}" for i in range(6)])
    zatez = random.randint(5, 99)
    graph.update_node(node, load=zatez)
    trida = ' class="w"' if zatez > 80 else ''
    level = ('<span class="vb-warn">warn</span>' if zatez > 80
             else '<span class="vb-key">info</span>')
    graph.html_append("udalosti", f'<div{trida}>{level} <a href="#" data-vb-event="focus" '
                                  f'data-vb-value="{node}">{node}</a> zátěž {zatez} %</div>')


vb.serve(graph, port=8080, open_browser=True)

# Model: projekt → screeny → okna

*Typy oken, jejich API a stylování – hlavní referenční text pro vývojáře.*

[← zpět na přehled](../README.md)

---

# Model: projekt → screeny → okna

- **`Project`** — služba. Drží host/port a životní cyklus jako soubor:
  vytvoří se **před vším ostatním** (`fopen`), `project.serve(screen, …)`
  otevře listener, `project.stop()` / konec `with` bloku / Ctrl-C ho zavře
  (`close`). `serve(block=False)` vrací handle pro REPL/Jupyter.
- **`Screen`** — plocha (Amiga screen). Vytvořením dostane auto `id`;
  nese titulek, téma a quality. Mezi screeny se přepíná depth gadgetem,
  tahem za lištu se přední screen stáhne a odkryje ten pod ním.
- **Okna** — typované instance na screenu. Grafové okno je jen speciální
  instance okna; každý typ má vlastní ukázku níže:

| Typ okna | Co to je | Ukázka |
|---|---|---|
| `LogWindow` | **systémové** okno — obsah dodává knihovna (proces-wide log, `tail -f`) | `examples/log_window.py` |
| `TerminalWindow` | **textové/dialogové** okno — píše se do něj a umí poslat string od uživatele | `examples/terminal.py` |
| `ShellWindow` | **skutečný terminál** — na PTY běží shell systému (vim/htop/barvy), okno zamčené na kód | `examples/secured_windows.py` | **zabezpečená okna**: `secured=True`, TOTP z autentikátoru, zelená výzva ve stylu Guru Meditation |
| `examples/shell.py` |
| `HtmlWindow` | **panel z prvků** — heading/label/kv/table/list/bar/image/hr, button/input/number/slider/checkbox/radio/select/textarea skládané z Pythonu bez HTML; události s hodnotami se vrací do Pythonu | `examples/html_window.py` |
| `ControlWindow` | **formulářové** okno — typovaná pole, hodnoty tečou zpět do Pythonu | `examples/prototype.py` |
| `GraphWindow` | **grafové** okno — živý 2D/3D graf, fyzika, eventy, toky | `examples/quickstart.py` |
| detailní okno | **systémové** okno s metadaty uzlu — otevírá klik do grafu | `examples/log_demo.py` |

### Log okno (základ)

Nejjednodušší okno vůbec — jen se umístí, obsah teče sám:

```python
project = vb.Project(port=8080)
screen = vb.Screen(title="Log základ")
vb.LogWindow(screen=screen)     # grafové okno NENÍ potřeba – screen je plocha
project.serve(screen)
# kdykoli za běhu (event handlery, every() úlohy, REST):
#   vb.log("zpráva", level="info")   → objeví se v okně s timestampem
```

Řádky se tisknou dolů s autoscrollem (`tail -f`, styl AmigaShell), okno
nemá zavírací gadget (jde jen minimalizovat do doku, takže se neztratí)
a jeho Options na liště filtrují úrovně (debug/info/warning/error) i
zdroje. Bez explicitního `LogWindow` se okno otevře samo na předním
screenu při prvním záznamu.

### Textové (dialogové) okno

`TerminalWindow` — píše se do něj z Pythonu a umí poslat string, co
zapíše uživatel:

```python
term = vb.TerminalWindow("konzole", title="Konzole", prompt="> ")

def on_input(event):                     # event.line = string od uživatele
    graph.terminal_write("konzole", f"řekl jsi: {event.line}")

graph.open_terminal(term, on_input=on_input)
graph.terminal_write("konzole", "vítej!")   # zápis textové části
```

`TerminalWindow(…, input=False)` je jen výstupní panel (živý textový
feed bez vstupního řádku). Kompletní ukázka včetně REST pushování:
`examples/terminal.py`.

### HTML okno

`HtmlWindow` — ovládací/informační panel poskládaný z **prvků** přímo
v Pythonu, **bez psaní HTML** (záměr: jednoduchost a jednotný vzhled i za
cenu menší volnosti). Čtyři kroky:

```python
panel = vb.HtmlWindow("panel", title="Ovládání", width=440, height=300)   # 1) okno
graph.open_html(panel)
panel.grid(cols=2)                                                        # 2) mřížka (volitelně)

stav   = panel.label("stav: v pořádku", row=0, col=0, colspan=2)         # 3) prvky z katalogu
jmeno  = panel.input("Název uzlu", value="srv-3", name="jmeno", row=1, col=0)
zatez  = panel.slider("Zátěž (%)", value=50, min=0, max=100, name="zatez", row=1, col=1)
sleduj = panel.checkbox("Zvýraznit sousedy", value=True, name="sleduj", row=2, col=0)
pridat = panel.button("Přidat uzel", row=3, col=0)

@pridat.on_click                                                          # 4) události
def _(event):
    graph.add_node(jmeno.value, load=zatez.value)     # .value polí je v handleru už aktuální
    if sleduj.value:
        graph.highlight(jmeno.value, depth=1)
    stav.text = f"přidán {jmeno.value}"               # zápis → překreslí se JEN tenhle prvek

@zatez.on_change                                      # slider po puštění (live=True i při tažení)
def _(event):
    stav.text = f"zátěž {event.value} %"              # event.value je číslo, ne text

@jmeno.on_submit                                      # Enter v textovém poli
def _(event):
    graph.focus(event.value)
```

**Katalog prvků** (roste postupně): výstup `heading`, `label`, `kv` (tabulka
klíč/hodnota, `.rows`), `table` (hlavička + řádky, `.rows`), `list`
(`.items`), `bar` (progress, `.value`), `image` (`.src`), `hr`; interakce
`button`, `input`, `number`, `slider`, `checkbox`, `radio`, `select`,
`textarea`. Každý prvek má stabilní `.id`, volitelné `name=` (klíč do
`event.values`), `.text` nebo `.value` pro čtení i zápis a společné
`.enabled` (False = zakázaný) a `.visible` (False = schovaný). Bez `grid()`
se prvky řadí pod sebe.

**Události:** `prvek.on_click / on_change / on_submit(fn)` (dekorátor i
volání), nebo `panel.on_event(fn)` pro vše. `event` nese `.element`,
`.name`, `.kind` (`click`/`change`/`submit`), `.value` (hodnota prvku, u
tlačítka `None`) a `.values` (hodnoty **všech** polí okna podle `name`,
s typy: číslo/slider → číslo, checkbox → `True`/`False`). Server nejdřív
aktualizuje `.value` prvků, teprve pak volá handlery — takže v handleru
tlačítka čteš rovnou `jmeno.value`. Bohatý text uvnitř prvku:
`stav.text = vb.Ui.ok("běží")`. Inline pomocníci `vb.Ui` vrací hotový
fragment, který se dá vložit do `.text` kteréhokoli prvku:

| volání | k čemu |
|---|---|
| `Ui.ok(text)` / `Ui.warn(text)` / `Ui.err(text)` | stavová barva podle tématu |
| `Ui.tag(text)` | štítek (badge) |
| `Ui.code(text)` | monospace úsek |
| `Ui.bar(value, max=100)` | vodorovný ukazatel |
| `Ui.muted(text)` | tlumený text v barvě klíčů |
| `Ui.link_inline(text, event, value=None)` | odkaz, který pošle `on_click` |
| `Ui.button_inline(label, event, value=None)` | tlačítko uvnitř textu |
| `Ui.raw(html)` | vlastní HTML, když nic z výše uvedeného nestačí |

Styl je **sjednocený s ostatními okny**: prvky se vysází stylem z proměnných
tématu (popisky v barvě klíčů jako detail okno, tlačítka jako control okno),
změna tématu je přebarví. Kompletní ukázka: `examples/html_window.py`.

<details>
<summary>Pro pokročilé: vlastní HTML (<code>html_set</code> / <code>html_append</code>)</summary>

`graph.html_set("id", "<h2>…</h2>")` nahradí raw část obsahu (vysází se
před prvky), `graph.html_append("id", "<div>…</div>")` připíše na konec (živý
výpis, okno drží konec). Klik na prvek s `data-vb-event` (+ `data-vb-value`)
a odeslání `<form data-vb-event="…">` přijdou do `graph.open_html(win,
on_event=…)` jako `event.event` / `event.value` / `event.values`. Utility
třídy boilerplate: `table.kv`, `.vb-key`, `.vb-tag`, `.vb-ok/.vb-warn/.vb-err`,
`.vb-bar > i`, `.vb-actions`, `.num`, `.small`; vlastní `<style>` má poslední
slovo. **Hranice:** JS v HTML se odstraní (`<script>`, `on*`, `javascript:`),
odkazy nenavigují. Okno si pamatuje obsah pro replay po reconnectu (strop
`HtmlWindow.MAX_HTML`). Builder `vb.Ui` umí totéž bez ručního HTML.

</details>

### Shell okno (skutečný terminál)

`ShellWindow` — v okně běží **opravdový shell operačního systému** na PTY
(vykresluje ho vendorovaný xterm.js), takže fungují barvy, kurzor, Ctrl-C
i celoobrazovkové programy (`vim`, `htop`, `mc`). Na rozdíl od dialogového
`TerminalWindow` (aplikační konzole s řádky textu) jde o emulaci terminálu
nad procesem systému.

```python
sh = vb.ShellWindow("sh", title="Shell", cols=100, rows=28)   # bez command → $SHELL
graph.open_shell(sh)          # okno se otevře ZAMČENÉ, kód se vypíše do konzole serveru

# místo shellu libovolný příkaz (jiný uživatel, kontejner, sledování logu):
vb.ShellWindow("logs", command=["journalctl", "-f"])
vb.ShellWindow("web",  command=["docker", "exec", "-it", "web", "bash"])
```

**Bezpečnost** (shell = spuštění čehokoli na stroji, proto ve výchozím stavu
nejde zneužít): okno startuje **zamčené** a proces se spustí až po zadání
**odemykacího kódu**, který server vypíše do své konzole; server poslouchá
jen na `127.0.0.1`; REST `/api/event` **shell události odmítá** (403) — smí
jen prohlížeč přes WebSocket; proces se zabíjí při zavření okna i konci
programu. Systémový `login` se nepoužívá: bez rootu stejně nepřepne
uživatele (na Linuxu selže, na macOS jen znovu přihlásí téhož, na Windows
neexistuje) — kdo chce jiného uživatele, řekne si o něj přes `command=`.

Shell okno si divák může otevřít i **sám z GUI**: na liště screenu je vedle
`Options` vestavěná skupina **`System` → `Shell CLI`** (dostupná vždy, nezávisle
na tom, jestli aplikace nějaké shell okno definovala). Vzniklé okno je stejně
**zamčené** a kód se vypíše do konzole serveru; volbu lze schovat přes
`vb.GraphWindow(..., shell_cli=False)`.

Terminál bere **paletu z tématu** (pozadí = tělo okna, ANSI barvy z palety),
takže `ls --color` ladí se zbytkem workbenche. xterm.js leží zdrojově v repu
(`frontend/src/vendor/xterm/`, MIT) a načítá se **až s prvním shell oknem** —
kdo shell nepoužívá, nestahuje ani bajt navíc. Zatím **POSIX** (macOS/Linux);
Windows/ConPTY je TODO. Ukázka: `examples/shell.py`.

### Formulářové okno

`ControlWindow` — typovaná pole (`integer`/`number`/`string`/`enum`/
`boolean`), hodnoty tečou zpět tlačítkem *Použít*, nebo průběžně
(`live=True`, slider bez tlačítka):

```python
win = vb.ControlWindow("render", title="Vykreslování")
win.enum("style", "Hrany", options=[("line", "Čáry"), ("spline", "Splajny")],
         value="line")
win.number("elasticity", "Elasticita", min=0.0, max=1.0, value=0.3)

def apply(event):
    graph.set_edge_style(event.values["style"],
                         elasticity=event.values["elasticity"])

graph.open_window(win, on_submit=apply, live=True)
```

### Grafové okno

Vlajková loď — živý graf s lokální fyzikou. Data i chování jdou přes
instanci okna:

```python
graph = vb.GraphWindow(screen=screen, title="Infrastruktura", dimensions=3,
                       theme="cyber", highlight_neighbors=1, quality="auto")

# uzly a hrany (+ libovolná metadata; živé změny kdykoli za běhu)
graph.add_node("srv-1", type="server", name="Web 01", ip="10.0.0.5")
graph.add_edge("srv-1", "db-1")
graph.update_node("srv-1", status="down")     # popisek se přepočte
graph.update_node("srv-1", color="#ff2a6d")   # živá barva jednoho uzlu
graph.update_node("srv-1", type="db")         # živá změna typu (barva/tvar/velikost)
graph.ensure_node("srv-1", status="up")       # upsert: založ, nebo slouč meta
graph.remove_edge("srv-1", "db-1")            # mazání za běhu
graph.remove_node("srv-1")                    # uzel + jeho hrany (kaskáda)
with graph.batch():                            # hromadné delty = jedna zpráva
    ...

graph.node_label("{name} ({ip})")              # šablona popisku z meta klíčů
graph.define_type("server", shape="box", color="#28d7fe", size=1.4)

graph.node("srv-1")["meta"]["ip"]              # čtení stavu (i v handlerech)

@graph.every(2.0)                              # periodická úloha knihovny
def tick():
    graph.ensure_node("beat", ts="now")
```

---

[← zpět na přehled](../README.md)

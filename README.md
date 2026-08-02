# viewbase

**Pracovní prostředí ve stylu Amiga Workbench v prohlížeči, ovládané
z Pythonu — screeny, okna a živá 2D/3D vizualizace grafů.**

Knihovna, kterou i junior v Pythonu postaví celé interaktivní prostředí:
**screeny** (plochy, mezi kterými se přepíná a které jdou po amigovsku
stáhnout a odkrýt ten pod nimi) a na nich **okna** — živý graf vztahů,
log konzole (`tail -f` ve stylu AmigaShell), formulářové dialogy,
terminály, detailní okna nad uzly. Bez psaní JavaScriptu, bez npm, bez
znalosti Three.js. Python je zdroj pravdy pro *data, vzhled a chování*.

Frontend je architektonicky **window manager, jehož schopnosti jsou
pluginy** — a zobrazení grafu je ta nejsilnější z nich: prohlížeč počítá
*rozmístění* lokálně (fyzika ve Web Workeru) a vykresluje instancovaně,
takže obraz je plynulý a zvládá tisíce až desítky tisíc uzlů.

![viewbase – okno grafu a control okno na screenu, téma cyber](docs/images/hero.png)

Workflow je **explicitní** — jako práce se souborem (`fopen` → práce →
`close`):

```python
import viewbase as vb

project = vb.Project(port=8080)          # 1. služba: port se nastaví PŘED vším
screen = vb.Screen(title="Ahoj graf")    # 2. plocha: vytvořením dostane id
graph = vb.GraphWindow(screen=screen,    # 3. okna: typované instance na screenu
                       title="Síť", dimensions=3)
vb.LogWindow(screen=screen)              #    systémové log okno (tail -f)

graph.add_node("a", name="Alfa")         # 4. data: přes instanci okna
graph.add_node("b", name="Beta")
graph.add_edge("a", "b")

project.serve(screen, open_browser=True) # 5. start; stop()/Ctrl-C zavře port
```

---

## Proč to takhle

Klasická úskalí force-graph vizualizací (škubání, strop pár stovek uzlů) plynou
z toho, že fyzika běží na serveru a klient dostává snapshoty po síti. viewbase to
obrací:

- **Fyzika běží v prohlížeči** ve Web Workeru (d3-force-3d, Barnes-Hut
  *O(n log n)*) — obraz je plynulý na 60 fps, pozice uzlů po síti vůbec
  necestují.
- **Instancovaný rendering** (Three.js `InstancedMesh`) — počet draw callů
  nezávisí na počtu uzlů; popisky jsou SDF text ve WebGL s LOD rozpočtem.
- **Server posílá jen delty** (přidej/změň/odeber uzel·hranu, akce) přes
  WebSocket; graf se může za běhu průběžně přestavovat.

Naměřeno (Apple M4 Pro, headless Chromium): **3 000 uzlů ~120 fps**,
**10 000 uzlů ~86 fps**.

---

## Instalace a spuštění

**Z PyPI** (po prvním release; balíček nese už sestavený frontend —
Node.js není potřeba):

```bash
pip install viewbase
python examples/quickstart.py     # otevře http://127.0.0.1:8080
```

**Z repa** (doporučený postup dnes):

```bash
git clone https://github.com/alchy/viewBase2 && cd viewBase2
python -m venv .venv
source .venv/bin/activate         # Windows: .venv\Scripts\activate
pip install -r requirements.txt   # editable install z ./python + dev nástroje
python examples/quickstart.py     # otevře http://127.0.0.1:8080
```

Frontend je v repu už sestavený (`python/viewbase/static`) — Node.js je
potřeba jen při vývoji frontendu. **Požadavky:** Python ≥ 3.10.

<details>
<summary>Vývoj frontendu (vyžaduje Node.js ≥ 20)</summary>

```bash
cd frontend && npm install
npm run build      # sestaví do python/viewbase/static
npx vitest run     # jednotkové testy frontendu
```

</details>

---

## Ukázky

Spustitelné příklady jsou živá dokumentace — viz tabulka v sekci
[Dokumentace](#dokumentace). Pár výřezů:

### Control okno: vzhled grafu řízený z backendu

Backend definuje **parametrické okno** (typovaná pole int/number/string/enum/
bool); hodnoty tečou zpět tlačítkem *Použít*, nebo průběžně při každé změně
(`live=True`), a backend podle nich řídí graf.
Tady přepíná hrany mezi **čarami** a **splajny** (bezier) a jejich elasticitu —
týž graf, jen přepnutý přepínač:

| Čáry | Splajny |
|---|---|
| ![Hrany jako čáry](docs/images/edges-lines.png) | ![Hrany jako splajny](docs/images/edges-splines.png) |

### 2D ortografický režim

`GraphWindow(dimensions=2)` přepne na 2D s pan/zoom:

![2D režim](docs/images/mode-2d.png)

---

## Model: projekt → screeny → okna

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
| `ControlWindow` | **formulářové** okno — typovaná pole, hodnoty tečou zpět do Pythonu | `examples/prototype.py` |
| `GraphWindow` | **grafové** okno — živý 2D/3D graf, fyzika, eventy, toky | `examples/quickstart.py` |
| detailní okno | **systémové** okno s metadaty uzlu — otevírá klik do grafu | `examples/log_demo.py` |

### Log okno (základ)

Nejjednodušší okno vůbec — jen se umístí, obsah teče sám:

```python
project = vb.Project(port=8080)
screen = vb.Screen(title="Log základ")
graph = vb.GraphWindow(screen=screen)   # v1: screen potřebuje i grafové okno
vb.LogWindow(screen=screen)             # explicitní umístění systémového okna

vb.log("služba startuje", level="info")  # objeví se v okně s timestampem
project.serve(screen)
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

### Stylování oken (témata)

Vzhled chrome — lišty oken, gadgety, rám, dok, plocha screenu — řídí
**téma**. Nastavuje se při vytvoření okna (`theme=`), za běhu ho přepne
`graph.set_theme(…)`; témata jsou **per screen** (dva screeny s různými
tématy si okna nepřebarvují navzájem).

**Vestavěná témata:** `modern` (výchozí, světlé), `cyber` (tmavé
neonové) a dvě Amiga varianty — `workbench-gray` (šedý Workbench 3.x:
světlá plocha, bílé pruhované lišty, modrá těla oken, černé rámy) a
`workbench-amiga` (modrý **Workbench 1.3** — barvy vzorkované přímo
z referenčního screenshotu: plocha `#0057af`, bílé lišty s modrým
textem a pruhováním, bílé rámy oken, oranžové akcenty). Bitmapové
gadgety se barví paletou tématu v obou:

```python
graph = vb.GraphWindow(screen=screen, theme="workbench-amiga")
```

**Vlastní téma** je dict — deep-merge přes `modern`, takže stačí zadat jen
to, co měníš. Klíče pro okna:

```python
graph = vb.GraphWindow(screen=screen, theme={
    "background": "#0055aa",          # plocha screenu (desktop) + pozadí grafu
    "window": {
        "headerBg": "#ffffff",        # titulková lišta okna
        "headerFg": "#000000",        #   … a její text
        "headerStripe": True,         # jemné vodorovné pruhování lišty
        "bodyBg": "#0055aa",          # tělo okna
        "bodyFg": "#ffffff",          #   … a jeho text
        "gadget": "#000000",          # barva gadgetů (zavřít/minimalizovat/…)
        "border": "#000000",          # rám okna po celém obvodu
        "key": "#ff8800",             # zvýrazněné klíče (detail, formuláře)
        "dockBg": "#b8c6e8",          # proužek minimalizovaného okna v doku
        "shadow": "0 2px 0 rgba(0,0,0,0.35)",   # stín okna (CSS box-shadow)
    },
})
```

Pruhovaná textura lišty (`headerStripe`) se počítá z `headerFg`, takže
ladí s barvou textu. Barvy uzlů a hran grafu témata neřídí — ty patří
vývojáři přes `define_type`/`update_node`.

- **Typy uzlů a témata** — `define_type` (tvary `sphere`/`box`/`octahedron`/
  `tetrahedron`); vestavěná témata `modern`/`cyber`/`workbench-gray`/
`workbench-amiga` (viz sekce
  „Ve vývoji" níže) nebo vlastní dict.
- **Živá změna vzhledu uzlu** (uzel se kvůli ní neodebírá ani nezakládá – drží
  si pozici i hrany): priorita **meta > typ > téma**.
  `update_node(id, color="#ff2a6d")` přebarví jeden uzel (`size=` totéž),
  `color=None` ho vrátí na typ/téma; `update_node(id, type="db")` přepne typ
  (barva, tvar i velikost), `type=None` typ zruší, nezadaný `type` ho nechá být;
  `define_type("db", color="#ffd166", …)` za běhu přebarví **všechny** uzly
  toho typu (styl se nahrazuje celý).
- **Eventy** (prohlížeč → Python) — `@graph.on_click` / `on_hover` /
  `on_background_click` / `on_view_change`; běží v thread-poolu. Vlastní event
  registruje `graph.on("jmeno", handler)` a poslat ho jde i zvenčí přes REST
  `POST /api/event` (`{"event": …, "payload": {…}}`) — most pro cron, jiný
  proces nebo `curl`.
- **Akce** (Python → prohlížeč) — `focus`, `highlight`, `show_detail`,
  `set_theme`, `set_edge_style("line"|"spline", elasticity=…)`.
- **Detailní okno** — `detail_window(rows=…)`; klik na uzel otevře tažitelné
  okno s metadaty (styl Amiga Workbench, dok, z-order).
- **Okna se dají zvětšovat** — každé okno (detail, control i terminál) má
  úchyt v pravém a levém dolním rohu: najetím myší se objeví mírně průhledný
  čtvereček, tažením za něj se okno zvětší nebo zmenší (levý roh hýbe levou
  hranou, pravá stojí). Pozice **i velikost** oken se pamatují v prohlížeči
  (localStorage, klíč `vb-pos:<window_id>`), takže přežijí obnovení stránky.
- **Toky** — `define_flow_type` + `flow(src, dst | path=[…], type=…)`: světelné
  částice po hranách (pakety, zprávy, provoz); `count=None` je trvalý tok
  (vrací `flow_id`, zastaví ho `stop_flow(flow_id)`; smazání hrany na cestě
  ho zruší samo).
- **Control okna** — `ControlWindow` (pole `integer`/`number`/`string`/`enum`/
  `boolean`) + `open_window(win, on_submit=…, live=…)`: backendem řízený
  parametrický dialog; `live=True` posílá hodnoty při každé změně (slider bez
  tlačítka *Použít*). Zavírá `close_window(window_id)`.
- **Terminálová okna** — `TerminalWindow` + `open_terminal(win, on_input=…)`:
  konzole v prohlížeči, kterou obsluhuje Python. Řádek od uživatele přijde do
  handleru jako `event.line`, server píše zpátky `terminal_write(window_id,
  text)`; `TerminalWindow(…, input=False)` je jen výstupní panel (živý log).
- **Idempotentní zápis a čtení** — `ensure_node`/`ensure_edge` (upsert pro živé
  zdroje dat), `has_node`/`has_edge`, `node()`/`edge()`, `graph.nodes`/`edges`.
- **Import grafů** — `GraphWindow.from_networkx(G)` / `graph.add_graph(G,
  type_attr=…)` (duck-typing, networkx není závislost), `add_edges(pairs)`.
- **Periodické úlohy a REPL** — `@graph.every(sekundy)` místo vlastních
  vláken; `project.serve(screen, block=False)` vrací `ServerHandle`
  (`.port`, `.stop()`, context manager) a prompt zůstane volný.

Detaily API a chování viz návrhové dokumenty a příklady níže.

### Multi-screen Workbench

Nosná část knihovny: Amiga-style **`Screen`** — kontejner nad `GraphWindow`
(víc živých grafů najednou, hloubkový stack, drag-reveal, vestavěné log
okno, Options menu řízené divákem):

```python
project = vb.Project(port=8080)
screen_a = vb.Screen(title="Síť")       # id se přidělí samo (1, 2, …)
graph_a = vb.GraphWindow(screen=screen_a)
screen_b = vb.Screen(title="Infra")
graph_b = vb.GraphWindow(screen=screen_b)
project.serve(screen_a, screen_b, open_browser=True)   # jeden server, dva screeny
```

Server multiplexuje `init`/patch/akce podle `screen_id` na jednom WS
spojení a `vb.log(message, level=…)` teče do prohlížeče jako zpráva `log`.

Frontend je architektonicky **window manager s pluginy**: jádro
(`frontend/src/wm/`) umí screeny, okna, lištu a Options — a vůbec neví, co
okna zobrazují. Každá schopnost je **plugin** (`frontend/src/plugins/`):
vlastní typ okna + vlastní Options + vlastní server akce. **Zobrazení
grafu je jen jedna z těchto schopností** (`plugins/graph/` — WebGL
pipeline, fyzika, picking), stejné váhy jako log konzole, detailní okna
uzlů, formulářová (control) a terminálová okna. Přidání nové schopnosti =
nový plugin, žádný zásah do jádra. Detaily v
[architektonické revizi](docs/superpowers/specs/2026-08-02-wm-plugin-architecture.md).

Screen je prázdný desktop a všechno na něm jsou okna. **Graf žije v okně**
(velké, s odsazením od krajů; jde přesouvat, zmenšovat za rohové úchyty,
minimalizovat do doku i **maximalizovat dvojklikem na lištu** — geometrie
se pamatuje v `localStorage`; v liště okna běží živé info o síti
„2D/3D · N uzlů · M fps") a **log je taky okno**: na první `log` zprávu se
samo otevře okno **„Log"** na předním screenu — `tail -f` v okně ve stylu
AmigaShell (nové řádky dolů, autoscroll na poslední, každý řádek s
timestampem). Jako AmigaShell nemá zavírací gadget (`closable: false`) —
jde jen minimalizovat do doku, takže se divákovi nikdy neztratí.

Na liště každého screenu je vestavěná skupina **„Options"** (view-only,
žádné Python volání ji nezakládá; je vždy první skupina, `ScreenMenu`
skupiny za ní) a její obsah řídí **aktivní okno** — stejný model jako macOS
menu bar, kde menu patří aktivní aplikaci: klik na okno grafu → „Fyzika
běží", „Křivkové hrany (splajn)", **„3D pohled"** (živé přepnutí kamery i
fyzikální simulace 2D/3D za běhu; volba se pamatuje v `localStorage` napříč
reconnecty); klik na okno logu → filtry úrovní (debug/info/warning/error)
a zdrojů. Okna bez vlastních Options (detail, control, terminál) skupinu
nemění; volba položky (i checkbox) dropdown hned zavře. A pokud něco na
frontendu spadne (neodchycená JS chyba), spojení vypadne, nebo backend
zaloguje `level="error"`, objeví se **Guru Meditation** — homage na Amiga
crash obrazovku (červeně orámovaný blikající box, zavírá se libovolným
tlačítkem myši nebo Esc — ne jen levým, na Macu nedává smysl), ne tichý
`console.error`. Místo původního hex kódu nese box **skutečný důvod
chyby**, anglicky a stručně („Connection Lost", text výjimky) — je to
vývojářský nástroj, důvod je užitečnější než hash.

Nová jsou i vestavěná Amiga témata **`workbench-gray`** (šedý Workbench
3.x) a **`workbench-amiga`** (modrý Workbench 1.3 přesně podle reference)
— detaily a vlastní témata viz sekce „Stylování oken" výše (chrome only;
barvy uzlů/hran zůstávají `modern`, to řídí vývojář přes `define_type`,
ne téma). Gadgety oken (zavřít/minimalizovat/obnovit) i přepínač screenů
na liště jsou **bitmapy vyříznuté z originálních Workbench screenshotů**
(`docs/images/workbench-ref/`), ne unicode glyfy.
Témata jsou per-screen (CSS proměnné na kontejneru screenu, ne globální) —
dva screeny s různými tématy si okna nepřebarvují navzájem.

A taky vestavěné **`ScreenMenu`** (§8 designu) — pull-down menu, co si
vývojář sám naplní. `Screen.pin_menu(menu)` funguje nezávisle na tom, jestli
`GraphWindow` už existuje — Screen a GraphWindow jsou explicitně nezávislé, atomické
objekty, ne implicitně provázaná dvojice. V prohlížeči se objeví lišta se
skupinami nahoře na screenu (`Options` je na ní vždy první skupina); klik
na skupinu rozbalí dropdown (světle šedý, tvrdý okraj — podle Workbench
reference), klik na položku zavolá `on_select` na serveru a menu přežije
reconnect. Kompletní příklad (menu naplněné před vznikem GraphWindow):
`examples/screen_menu.py`.

Frontend teď víc `GraphWindow` instancí (`screen=` na obou) i **vizuálně**
zvládá — každý screen má **právě jednu lištu** od kraje ke kraji (Options +
`ScreenMenu` skupiny vlevo, vystředěný titulek, vpravo jediný depth
gadget, přesně podle Workbench reference; info o síti nese lišta okna
grafu, ne lišta screenu) a
vlastní graf, téma i okna. Depth gadget prohodí přední/zadní screen; navíc
jde přední screen **tahem myší za lištu** stáhnout dolů a odkrýt ten pod
ním — přesně jako na Amize (mapování bitmapa→scanline: celý screen se
posouvá jako jeden blok, obsah se nemění). Tažení je perzistentní jako u
oken: kam lištu dotáhneš, tam předěl zůstane (žádný snap-back), druhé
tažení navazuje, gadget vrací čistý stav. Každý screen má vlastní trvalý
offset. Screeny mimo první dvě pozice v hloubkovém pořadí se úplně
pozastaví — **nejen vykreslování, i fyzika** — aby nežraly prostředky na
pozadí. `Screen.destroy()` je explicitní protějšek k vytvoření — zavře
přidružený `GraphWindow` a frontend uklidí kompletně (WebGL kontext, physics
worker, DOM), žádné přízraky po smazaném screenu. Kompletní příklad (dva
screeny, drag-reveal, `destroy()` přes REST): `examples/multiscreen.py`.

(`title=` je zatím potřeba nastavit na obou — `Screen.title` je titulek
lišty screenu, `GraphWindow.title` titulek okna grafu.)

Zkratka bez explicitního screenu (`vb.GraphWindow(dimensions=…)` +
`vb.serve(graph)`) dál funguje — okno dostane implicitní screen;
kanonický (doporučený) tok je ale `Project → Screen → okna`. Návrhové
dokumenty:
[design](docs/superpowers/specs/2026-08-02-multi-screen-workbench-design.md),
[implementační plán](docs/superpowers/plans/2026-08-02-multi-screen-workbench-plan.md)
a [architektura WM + pluginy](docs/superpowers/specs/2026-08-02-wm-plugin-architecture.md).

---

## Dokumentace

**Spustitelné příklady** (`examples/`) — nejlepší živá reference:

| Soubor | Co ukazuje |
|---|---|
| `examples/quickstart.py` | **kanonický workflow**: `Project` → `Screen` → `GraphWindow` → data → `serve` (živý 3D graf) |
| `examples/log_window.py` | **základ — systémové log okno**: `vb.LogWindow(screen=…)` + `vb.log()` (tail -f, filtry) |
| `examples/quickstart2d.py` | 2D ortografický režim |
| `examples/interactive.py` | klik → rozbalení sousedů (eventy/akce) |
| `examples/prototype.py` | `ControlWindow` jako **formulářový dialog** (přidání uzlu podle zadaných polí), `TerminalWindow` jako log |
| `examples/showcase.py` | téma cyber, typy uzlů, **živá změna barvy/typu za běhu**, toky, **control okno** (čáry/splajny) |
| `examples/terminal.py` | **konzole v prohlížeči**: `TerminalWindow`, `on_input`, `terminal_write`, výstupní panel a REST push (`/api/event`) |
| `examples/words.py` | mapa slov z Wikipedie (crawl odkazů) |
| `examples/stress.py` | zátěžový test (tisíce uzlů) |
| `examples/log_demo.py` | **multi-screen Workbench**: `vb.log()` → vestavěné okno „Log" (`tail -f` styl AmigaShell, timestampy), Options aktivního okna na liště (graf: fyzika/splajn/3D; log: filtry úrovní a zdrojů) |
| `examples/screen_menu.py` | **multi-screen Workbench**: `ScreenMenu` (autorské pull-down menu), `Screen.pin_menu()` volané před vznikem GraphWindow |
| `examples/multiscreen.py` | **multi-screen Workbench**: dva `Screen`/`GraphWindow` s tab přepínačem a drag-reveal, explicitní `Screen.destroy()` přes REST |
| [`examples/wireshark/`](examples/wireshark/README.md) | **síťové toky**: přehrání pcap, živý odposlech a cesta paketu (traceroute) |

**Návrhové dokumenty** (`docs/superpowers/specs/`) — architektura a rozhodnutí:

- [Návrh knihovny (architektura, protokol, fyzika, rendering)](docs/superpowers/specs/2026-06-10-viewbase-library-design.md)
- [Detailní okno](docs/superpowers/specs/2026-06-14-detail-window-design.md)
- [Traceroute toky (routery jako uzly, multi-hop)](docs/superpowers/specs/2026-06-16-traceroute-toky-design.md)
- [Control okna (parametrické GUI) + křivkové hrany](docs/superpowers/specs/2026-06-17-control-okna-design.md)
- [Multi-screen Workbench (Amiga-style, ve vývoji)](docs/superpowers/specs/2026-08-02-multi-screen-workbench-design.md)

Implementační plány (krok za krokem) jsou v
[`docs/superpowers/plans/`](docs/superpowers/plans/).

---

## Architektura

```
Python skript (GraphWindow API)
        │  data + metadata + vzhled + chování
viewbase (pip balíček: GraphModel, FastAPI + WebSocket, zabalený frontend)
        │  ↓ delty + akce          ↑ eventy (klik, hover, kamera, control okna)
Browser (viewbase.js)
        ├─ GraphStore  – jediné zrcadlo stavu
        ├─ PhysicsWorker – d3-force-3d (Barnes-Hut, 2D/3D)
        └─ Renderer – Three.js instancing, témata, SDF labely, toky, okna
```

### Struktura repozitáře

```
python/viewbase/      pip balíček (graph_window, screen, log, controls, server, protocol, static/)
frontend/             zdrojáky JS (Vite) – build → static/
examples/             spustitelné ukázky = živá dokumentace
docs/superpowers/     návrhové specifikace a plány
docs/images/          screenshoty pro README
legacy/               původní prototyp (referenční)
```

---

## Vývoj

```bash
pip install -e "python[dev]"
cd python && python -m pytest -q          # backend testy
cd frontend && npm install && npm test    # frontend testy (vitest)
cd frontend && npm run build              # sestaví static/ pro balíček
```

Frontend se vyvíjí s Vite/npm, ale výstup buildu se zabalí do Python balíčku —
koncový uživatel npm nepotřebuje.

---

## Stav

Funkční jádro: živý 2D/3D graf, typy uzlů, témata (modern/cyber), SDF popisky,
bloom, quality=auto, eventy/akce, zvýraznění sousedů, detailní okno, toky a typy
toků, wireshark příklady (pcap, živý odposlech, traceroute), control okna
(parametrické GUI), terminálová okna (konzole + REST push) a křivkové hrany
(čáry/splajny + elasticita), **živá změna vzhledu uzlu za běhu (barva/velikost
přes meta, přepnutí typu, redefinice typu)**. Rozpracováno: multi-screen
Workbench — backend (`Screen`, `vb.log`, multi-window `serve()`/protokol
routing podle `screen_id`) hotový a otestovaný, frontend (vizuální
přepínač, compositor, `workbench` chrome) zatím ne — viz sekce výše.
Plánováno dále: GLB modely uzlů, distribuce přes wheel + CI, IPv6 v živém
odposlechu.

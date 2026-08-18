# Témata a chrome oken

*Vestavěná témata, CSS proměnné a prvky oken – gadgety, dok, scrollbary, výběr textu.*

[← zpět na přehled](../README.md)

---

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
        "htmlAccent": "#ffffff",      # odkazy/tlačítka v HTML okně (default = gadget)
        "outputBg": "rgba(0,0,0,0.18)",  # výstupní plocha terminálu a <pre>/<code> HTML okna
    },
})
```

Pruhovaná textura lišty (`headerStripe`) se počítá z `headerFg`, takže
ladí s barvou textu. Každé okno má **rám jako na WB 1.3** — ve všech
tématech, liší se jen paleta (`window.frameLine` linky/šipky, `frameKnob`
knob, `frameGlow` neon u cyber; `frame: false` rám vypne): vpravo svislý pruh
s knobem synchronizovaným se scrollem obsahu (u HTML okna i s obsahem
iframu), dole vodorovný, v rohu sizing gadget (u workbench neprůhledná
krabička v barvě lišty) — bez šipek a bez vnitřních linek („airy": ovládá se
kolečkem, klikem do dráhy a tažením knobu); aktivní plocha okna je o tyto
pruhy menší, takže scroll prvky nezasahují do obsahu; bez přesahu je dráha
prázdná. Každé okno má vedle
minimalizace **depth gadget** (stejná ikona i funkce jako na liště screenu):
klik pošle okno za ostatní. Konzole je ve všech tématech jedna plocha jako
AmigaShell (prompt inline, bez odděleného vstupního řádku). Barvy uzlů a hran grafu témata neřídí — ty patří
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
  Tažením za lištu jde okno **částečně vytáhnout mimo plátno** (doleva,
  doprava i dolů — jako u běžných window managerů), ale vždy zůstane
  uchopitelný kus lišty, za který se okno vrátí; nahoru se lišta okna nikdy
  nedostane pod lištu obrazovky s Options.

- **Výběr textu** — text v těle okna jde **označit a zkopírovat** (log,
  konzole, detail, HTML panel); chrome okna (lišta, gadgety, scrollbary) se
  neoznačuje, takže tažení za lištu nikdy neoznačí text. Shell okno má vlastní
  výběr xtermu (myš + ⌘C), a jeho vnitřní scrollbary jsou schované — posun
  kreslí rám okna, dva pruhy vedle sebe by se bily.
- **Indikátor fokusu** — v liště hned **za textem titulku** svítí drobná
  plná značka na okně, které je aktivní (patří mu Options i klávesnice).
  Je to jediný vyplněný prvek v jinak linkovém chrome, takže se neplete s
  gadgety; barvu bere z textu lišty, u `cyber` má neonový glow.
- **Minimalizace** — gadget minimalizace okno jen **zmenší** na proužek s
  celým titulkem (šířka podle textu + odstup 10 znaků před gadgety) vlevo
  dole; jinak se chová jako každé jiné okno: má **všechny gadgety**
  (zavřít, depth, zvětšit zpět), klik ho vytáhne dopředu, depth pošle za
  ostatní. Proužky se řadí vedle sebe s 4px mezerou, po zaplnění řady do
  řady nad ní, jdou tahat (po plátně, nikdy pod lištu screenu), do sebe
  „narazí" (nikdy se nepřekryjí) a pamatují si pozici (localStorage).
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

---

[← zpět na přehled](../README.md)

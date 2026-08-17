# HTML okno (`HtmlWindow`) — Design

> Třetí „obsahový" typ okna vedle control a terminálového: okno, které vykreslí
> HTML poslané z Pythonu — „prohlížeč v prohlížeči", ale jen pro interpretaci
> kódu, který mu server pošle. Umožní formátovaný výpis (nadpisy, tabulky,
> štítky, odkazy, tlačítka) tam, kde terminál nabízí jen prostý text.
> Náhledy obsahu ve třech tématech odsouhlaseny (modern, cyber, workbench-amiga).

## Cíl

1. **Nový typ okna `html`** po vyšlapané cestě terminálu: Python třída se
   `spec()`, akce protokolu, frontend plugin s `BaseWindow` podtřídou,
   registrace přes `windowManager.registerType`. Jádro WM se nemění.
2. **Styl sjednocený s ostatními okny bez ručního ladění**: obsah se vysází
   boilerplate CSS, které bere barvy z týchž CSS proměnných tématu
   (`--vb-window-*`), jimiž se dnes barví detail, control, terminál a log okno.
   Změna tématu přebarví HTML okno stejně jako ostatní.
3. **Kliky zpět do Pythonu**: prvek s `data-vb-event` po kliku pošle event
   `html_event` — tlačítka a odkazy v HTML řídí graf (`focus`, cokoli aplikace
   chce).

## Rozhodnutí (potvrzeno uživatelem)

- **Statické HTML + CSS, bez JS uživatele.** iframe má
  `sandbox="allow-scripts"` výhradně kvůli našemu drobnému mostu (viz níže);
  `<script>` prvky a `on*` atributy z HTML uživatele se před vložením odstraní.
  Navigace odkazů je zablokovaná (odkaz bez `data-vb-event` nic nedělá).
- **Aktualizace obsahu: `html_set` + `html_append`.** `set` nahradí celý obsah,
  `append` připíše fragment na konec (streamový výpis, autoscroll na konec jako
  terminál). Server drží aktuální HTML pro replay po reconnectu.
- **Vlastní `<style>` v posílaném HTML je povolený** a má poslední slovo —
  boilerplate je výchozí vzhled, ne omezení.
- **Options okno nemá** (`getOptionsItems()` → `null`); aktivace tedy nemění
  skupinu Options na liště.

## Nezavádíme nový transport

Stejně jako u control/terminál oken: backend → frontend **akce**
(`open_window` s `kind:"html"`, nové `html_set`, `html_append`, existující
`close_window`), frontend → backend **event** (`html_event`). `server.py` se
nemění.

## Python API

```python
panel = vb.HtmlWindow("uzel", title="Uzel srv-0", width=420, height=260,
                      closable=True)
graph.open_html(panel, on_event=akce)   # akce(event): event.window_id, .event, .value
graph.html_set("uzel", "<h2>Server 0</h2><table class=kv>…</table>")
graph.html_append("udalosti", "<div>09:41 <span class=vb-warn>warn</span> fps 48</div>")
graph.close_window("uzel")              # stávající close_window funguje i pro html
```

- `HtmlWindow(window_id, *, title="", width=560, height=320, closable=True)`
  v `controls.py`; `spec()` → `{window_id, title, kind:"html", width, height,
  closable, html}` (`html` = aktuální obsah, pro init replay).
- `GraphWindow.open_html(window, *, on_event=None)` — uloží do `_html_windows`,
  callback do `_html_callbacks` (nahrazení bez `on_event` callback zruší —
  stejná sémantika jako `open_terminal`), zařadí akci `open_window`.
- `GraphWindow.html_set(window_id, html)` / `html_append(window_id, html)` —
  `ValueError` pro neznámé okno; aktualizuje `window.html` (append zřetězí) a
  zařadí akci `html_set` / `html_append` `{window_id, html}`.
- **Strop replay bufferu**: `HtmlWindow.MAX_HTML = 512 * 1024` znaků; při
  překročení se obsah ořízne zepředu na hranici prvního `<` po limitu (append
  do nekonečna nesmí nafouknout init). Ořez je věc serveru, klient dostává
  vždy jen delty.
- `snapshot()["windows"]` obsahuje i `spec()` html oken (init replay).
- Event `html_event` `{window_id, event, value}` → `_on_html_event` zavolá
  `on_event` okna s objektem, který má `.window_id`, `.event`, `.value`
  (`value` je string nebo `None`). Registrace v konstruktoru vedle
  `terminal_input`.
- Export `HtmlWindow` v `viewbase/__init__.py` + `__all__`.

## Frontend

### Routing podle `kind` (jádro, malá úprava)

`desktop.js` dnes routuje `open_window` ternárem `kind === 'terminal' ?
'terminal' : 'control'` (v akci i v init replay). Změna na
`windowManager.open(msg.kind ?? 'control', msg)` — registr typů je právě od
toho, aby jádro nevědělo o konkrétních typech (open/closed). Stejná změna v
init replay smyčce.

### Plugin `frontend/src/plugins/html.js`

- `createHtmlPlugin({ container, windowManager, sendEvent })`
  registruje typ `'html'` (stejné window_id nahradí existující okno — jako
  terminál) a akce `html_set`, `html_append`.
- `HtmlWindow extends BaseWindow`: tělo = `<iframe data-role="html-frame"
  sandbox="allow-scripts">` o `width × height` px (`_applySize` → iframe
  100 % těla, resize přes stávající úchyty). `getOptionsItems()` → `null`.
- **Dokument iframu** (`srcdoc`) skládá čistá funkce
  `buildSrcdoc({ themeVars, html })` = `<!doctype html><html><head><meta
  charset=utf-8><style>BOILERPLATE</style></head><body>` + sanitizované HTML +
  `<script>MOST</script></body></html>`. `themeVars` jsou aktuální hodnoty
  `--vb-window-*` (čtou se z `document.documentElement` přes
  `getComputedStyle` v okamžiku stavby), do srcdoc jdou jako `:root{…}`.
- `setHtml(html)` → nový srcdoc. `appendHtml(html)` → `postMessage({type:
  'vb-html-append', html})` do iframu; most připíše sanitizovaný fragment na
  konec `<body>` a odscrolluje na konec, pokud byl konec vidět (stejná
  „tail" logika jako terminál). Než je iframe načtený, appendy se frontují a
  po `load` doručí. Obsah se drží i v okně (`this.html`), aby změna tématu
  mohla postavit nový srcdoc se stejným obsahem.
- **Téma**: plugin se přihlásí k `onThemeChange` (jako graf) a všem svým
  oknům zavolá `applyTheme()` → nový srcdoc.
- **Sanitizace** (čistá funkce `sanitizeHtml(html)`, testovaná): odstraní
  `<script>…</script>`, atributy `on*=` a `href="javascript:…"`. Není to
  úplný HTML sanitizer — obsah posílá vlastní backend, jde o to, aby v okně
  neběžel cizí JS a aby nešlo omylem odnavigovat iframe. Provádí se na
  straně rodiče před vložením (set) i před postMessage (append).
- **Most** (skript v srcdoc, náš): `document.addEventListener('click', …)`
  — nejbližší `[data-vb-event]` → `parent.postMessage({type:'vb-html-event',
  event, value: dataset.vbValue ?? null}, '*')` a `preventDefault()`; každý
  klik na `<a>` dostane `preventDefault()` (žádná navigace). Poslouchá
  `message` `vb-html-append`. Rodič (plugin) přijímá `message` jen když
  `event.source === iframe.contentWindow` a `data.type === 'vb-html-event'`,
  pak `sendEvent({type:'event', event:'html_event', payload:{window_id,
  event, value}})`.
- **Boilerplate CSS** (odsouhlasený náhled): `html,body` 13px/1.5 `system-ui`,
  barva `--vb-window-body-fg`, pozadí transparentní (tělo okna prosvítá);
  `h1` 17px, `h2` 15px, `h3` 11px uppercase v `--vb-window-key`; `a`,
  `button`, `blockquote` linka, `.vb-bar > i` v `--vb-html-accent`
  (= `--vb-window-gadget`, téma smí přebít — `workbench-amiga` → `#ffffff`,
  protože jeho gadget splývá s tělem); `table` collapse, `th` v barvě klíčů s
  linkou, `.num` vpravo, `table.kv td:first-child` v barvě klíčů (= detail
  okno); `code/pre/kbd` 12px `ui-monospace` na `--vb-window-output-bg`
  (= terminál); `button` = rámeček 1px `--vb-html-accent`, radius 4px,
  transparentní pozadí (= control „Použít"); utility třídy `.vb-key`,
  `.vb-tag`, `.vb-ok/.vb-warn/.vb-err` (#2fa84f/#e8a02f/#e8553a — mimo téma,
  čitelné na světlém i tmavém), `.vb-bar`, `.vb-actions`, `.small`.
- **Téma → proměnné**: `themes/manager.js` nově zapisuje i
  `--vb-html-accent` (z `theme.window.htmlAccent`, default = gadget) a
  `--vb-window-output-bg` (dosud jen fallback v terminálu; default
  `rgba(0,0,0,0.06)`, cyber `rgba(255,255,255,0.05)`, amiga
  `rgba(0,0,0,0.18)`). Terminál tím dostane stejné pozadí výstupu.
  `workbench_amiga.json` dostane `"htmlAccent": "#ffffff"`.

### Registrace

`main.js`/desktop staví plugin vedle terminálu:
`createHtmlPlugin({...})` do seznamu pluginů (akce se hledají dynamicky).

## Dokumentace (závazná součást, ne dodatek)

Je to knihovna — komentované ukázky jsou pro vývojáře nejlepší vysvětlení
(požadavek uživatele). Hotovo je až s tímhle:

- **`examples/html_window.py`** — spustitelná, hustě komentovaná ukázka ve
  stylu `examples/terminal.py` (docstring nahoře: co ukazuje a proč): karta
  uzlu (`html_set`) s tlačítky `focus`/`sousedé` přes `data-vb-event`,
  streamovaný výpis událostí (`html_append` z `graph.every`), reakce na
  `html_event` (focus/highlight v grafu), ukázka vlastního `<style>` a všech
  utility tříd boilerplate. Komentáře vysvětlují i to, co NEJDE (JS, navigace).
- **README**:
  - řádek `HtmlWindow` v tabulce typů oken (sekce „Model: projekt → screeny
    → okna") s odkazem na ukázku;
  - nová podsekce **„HTML okno"** vedle „Textové (dialogové) okno" — krátký
    kód (`open_html`, `html_set`, `html_append`, `on_event`), co boilerplate
    sjednocuje s ostatními okny, seznam utility tříd, `data-vb-event`,
    bezpečnostní hranice (bez JS uživatele, bez navigace);
  - řádek `examples/html_window.py` v tabulce „Spustitelné příklady";
  - odkaz na tento spec v seznamu návrhových dokumentů;
  - zmínka v „Stylování oken (témata)": `window.htmlAccent`,
    `window.outputBg`.
- **Python docstringy** (`HtmlWindow`, `open_html`, `html_set`,
  `html_append`, `_on_html_event`) ve stejné hloubce jako u terminálu —
  včetně limitu replay bufferu a sémantiky nahrazení okna.
- **Frontend komentáře**: hlavička `plugins/html.js` (proč iframe + sandbox,
  proč vlastní most, proč sanitizace jen „proti nehodě"), komentář u každé
  čisté funkce; boilerplate CSS s poznámkami „= detail okno", „= terminál",
  „= control tlačítko", ať je vidět, odkud se styl bere.

## Testy

- **Frontend (vitest)**: `buildSrcdoc` (proměnné tématu se propíšou, HTML je
  uvnitř body, most přítomen), `sanitizeHtml` (script/on*/javascript: pryč,
  ostatní beze změny, vlastní `<style>` zůstane), happy-dom test
  `HtmlWindow` (iframe existuje, `setHtml` mění srcdoc, `getOptionsItems()`
  null, `appendHtml` před `load` frontuje), zpráva `vb-html-event` z cizího
  `source` se ignoruje.
- **Python (pytest)**: `HtmlWindow.spec()`; `open_html` zařadí `open_window`
  s `kind:"html"` a okno je ve `snapshot()["windows"]` včetně `html`;
  `html_set/append` mění obsah a řadí akce; neznámé okno → `ValueError`;
  strop replay bufferu ořízne zepředu; `html_event` doručí `on_event` s
  `.event/.value`; nahrazení okna bez `on_event` callback zruší.

## Prvky (widgets) — primární API pro vývojáře (doplněno 2026-08-17)

Rozhodnutí uživatele: **vývojáře odstínit od HTML**; cílem je přehlednost a
jednoduchost i za cenu omezení funkcionality a svobody stylování. Vrstvy:

1. **Prvky na instanci okna** (primární, pro začátečníka):
   `okno = vb.HtmlWindow(...)`; `okno.heading/label/kv/table/bar/hr` (obsah) a
   `okno.button/input/number/slider/checkbox/select/textarea` (interakce).
   Každý prvek dostane stabilní `id` (`<window_id>-<n>`) a volitelné `name`
   (klíč do `values`); má `.text` / `.value` pro čtení i zápis a handlery
   `on_click` / `on_change` / `on_submit` (dekorátor i volání). Rozložení:
   bez `grid()` prvky pod sebou; `okno.grid(cols=2)` + `row=/col=/colspan=`
   u prvku (Tkinter model). Okno má `on_event(fn)` pro jeden handler na vše.
2. `vb.Ui` — pomocník pro bohatý text uvnitř prvku (`stav.text =
   vb.Ui.ok("běží")`) a builder pro pokročilé.
3. `html_set(str)` / `html_append(str)` — úniková cesta (raw HTML), pokročilí.

**Události:** každý event z okna nese `kind` (`click`/`change`/`submit`),
`id`, `event` (= name prvku), `value` (aktuální hodnota prvku, u tlačítka
None) a **`values` = hodnoty všech polí okna podle `name` s typy** (číslo/
slider → číslo, checkbox → bool, select multiple → seznam). Server nejdřív
aktualizuje `.value` prvků, teprve pak volá handlery — `jmeno.value` je
v handleru tlačítka vždy aktuální. Slider: `on_change` po puštění; `live=True`
posílá při tažení (škrceno ~10×/s). Enter v textovém poli → `on_submit`.

**Překreslování:** změna prvku (`stav.text = …`, `zatez.value = 40`) →
akce **`html_patch {window_id, id, html}`**, most nahradí jen ten element
(rozepsaný text a fokus jiných polí přežijí). Přidání prvku → `html_set`
celého okna (typicky při startu; `with graph.batch()` sloučí). Init replay
nese `spec()["html"]` = celé vykreslené okno.

**Záměrně mimo:** viditelnost/zakázání prvků, mazání prvků, obrázky,
odkazy jako prvek, vlastní layout mimo grid, klávesové zkratky — až bude
potřeba (jde přidat stejným mechanismem).

## Poznámka k tématu workbench-amiga (reference do budoucna)

Uživatel dodal ilustraci WB 1.x **Preferences** (bílé tělo okna, černý text,
gadgety = modré obdélníky s bílým textem a černým 1px rámem, oranžové
zvýraznění vybraných stavů, Topaz font). Rozhodnutí: pro HTML okno teď
**nechat jak je** (bílý akcent podle odsouhlaseného náhledu); ilustrace je
podklad pro pozdější doladění celého tématu (bitmapový font a vzhled
gadgetů jsou v multi-screen workbench specu stále TODO). Kdyby se k tomu
šlo, cesta je stejná jako `htmlAccent`: proměnné `--vb-html-btn-bg/fg/
border` a `--vb-html-highlight` z `theme.window`, boilerplate je jen čte.

## Mimo rozsah (YAGNI)

- JS uživatele v okně, `postMessage` API pro aplikace, formuláře s odesláním
  hodnot (na to je control okno), obrázky jinak než `data:` URI / `/static`,
  Options pro HTML okno, plný HTML sanitizer.

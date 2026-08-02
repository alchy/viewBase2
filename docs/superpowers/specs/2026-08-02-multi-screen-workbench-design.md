# Multi-screen Workbench (Amiga-style) — Design

> Amiga custom chipset (Agnus) uměl za běhu, řádek po řádku, přepnout, ze
> které bitmapy DMA čte obraz — z toho vzešel koncept **Screen**: samostatná
> raster plocha (vlastní rozlišení/paleta), ne okno. Screeny se řadí do
> hloubkového stacku, dají se tahem myši zajíždět dolů a odkrývat ten pod
> nimi — bez překreslování, oba bitmapy žijí dál. Cíl tohoto dokumentu:
> přenést tenhle model do viewbase — víc nezávislých živých grafů (screenů)
> najednou, vizuálně stylizovaných do dobového Workbenche.

Datum: 2026-08-02
Stav: návrh, čeká na review

## 1. Cíl

Rozšířit viewbase o **Screen** — kontejner nad dnešním jedním grafem
(`Canvas`), kterých může běžet víc najednou (limit 8), každý se svým ID,
vlastní fyzikou, tématem a quality. Screeny se v prohlížeči řadí do
hloubkového stacku a dají se tahem myši částečně odkrývat — s živým GPU
split-line, ne přepínáním. Vizuální chrome (title bary, gadgety, pozadí,
menu) je stylizovaný do dobového AmigaOS Workbenche, viz referenční
screenshoty níže.

**Druhá, průřezová změna:** Python (backendový vývojář) nově posílá do
viewbase **jen data grafu** (uzly, hrany, metadata, typy) — programově už
neřídí *jak* se graf zobrazuje (2D/3D, čáry/splajny, běží/neběží fyzika).
Tohle je od teď výhradně **volba koncového diváka grafu**, přes vestavěné
menu **„Options"** na liště screenu (§8a) — ne přes Python API. Souvisí to
přímo s multi-screen modelem: jakmile má jeden Python skript víc screenů se
společnými daty, ale různí diváci je můžou chtít prohlížet jinak, dává
smysl, aby si každý screen pamatoval svoje zobrazovací preference lokálně
(prohlížeč), ne aby je diktoval server.

## 2. Reference a rozhodnutí z brainstormingu

| Otázka | Rozhodnutí |
|---|---|
| Kolik screenů | až 8 souběžně |
| Běží zakryté screeny dál | **ano, naplno** — vlastní fyzika i render i když nejsou vidět |
| Věrnost reveal efektu | **plný drag s live split-line** (GPU shader), ne jen přepínač |
| Nezávislost nastavení | **plná** — každý screen vlastní `theme`/`quality`/zobrazovací volby |
| Vizuální chrome | stylizovat podle referenčních screenshotů (viz §7) |
| Menu | screeny mají připínatelné pull-down menu jako Workbench (§8) |
| Řízení zobrazení grafu (2D/3D, čára/splajn, fyzika on/off) | **jen z prohlížeče**, přes vestavěné menu Options (§8a) — Python to už neřídí |

### Referenční vzhled — tři zdrojové screenshoty

Máme tři referenční obrázky, každý pokrývá jinou vrstvu chrome; všechny
uložené v `docs/images/workbench-ref/` (viz §7a pro seznam vyříznutých
bitmap):

**A) ReAction Preferences dialog** (`reference-full-reaction.png`) — detail
formulářových gadgetů a bevelů:

- **Window title bar**: světle šedá u neaktivního okna, **modrá** u
  aktivního — jediný barevný akcent v chrome. Bitmapový (pixelový,
  neantialiasovaný) font všude.
- **3D bevel všude**: tvrdé 1px hranice, světlá horní/levá hrana + tmavá
  dolní/pravá = vyvýšené (tlačítka, gadgety); obrácené pořadí = zapuštěné
  (skupinové rámečky, textová pole). Žádné zaoblení, žádné gradienty, blur.
- **Gadgety uvnitř oken**: chooser (ikona + text), integer se spinner
  šipkami, scroller s hatch výplní a šipkami na koncích, checkbox (prázdný
  čtverec), tlačítko (vyvýšený obdélník s vystředěným textem), list browser
  se svislým scrollbarem.

**B) AmigaOS 3.2 plocha** (`reference-full-os32.png`) — **cílový koncept
grafiky** pro celkový vzhled screenu, potvrzeno jako hlavní vizuální cíl:

- **Screen bar** (úplně nahoře, přes celou šířku) — **téměř bílá, ne čistě
  bílá** (naměřeno přímo z obrázku: `#cfe1fb`, bledě modrošedý nádech — v
  tématu se použije tahle naměřená hodnota, ne `#ffffff`, viz §7). Nese
  systémové info (název, paměť, čas) — a je to **stejná plocha, na kterou
  se připíná menu** aktivního screenu (§8), přesně jako na originále.
- **Window title bar**: modro-šedý gradient-flat pruh (`~#6688eb`), vlevo
  **close gadget** (malý čtvercový box), vpravo dvojice **zoom** a **depth
  arrange** gadgetů — obě strany viz extrahované bitmapy níže.
  Tělo okna bílé/velmi světlé, okraje modro-šedé.
- **Ikony**: barevné, ploché s jemným pseudo-3D stínováním (disk, šuplík/
  drawer, koš, nástroje) — výrazně živější a rozpoznatelnější než
  monochromní ReAction ikony z referenceA. Tohle je styl, který chceme pro
  ikony oken a screenů ve viewbase (viz §7).
- **Plocha screenu**: plochá světle šedá (`~#dadada`), bez hatch vzoru v
  tomto konkrétním screenshotu (starší Workbench má hatch, tahle verze ne —
  necháme hatch jako volitelnou texturu tématu, ne povinnou).
- **Scrollbary**: bílo-modré s trojúhelníkovými šipkami nahoře/dole a po
  stranách, tenký track.

**C) Pull-down menu v akci** (`reference-menu-pulldown.png`) — přesný vzor
pro menu Options (§8a):

- **Menu bar row**: vodorovná řada položek (`Workbench | Window | Icons |
  Tools`) na světle šedé liště; rozkliknutá položka má **modré pozadí,
  bílý text** — jediný barevný akcent na liště.
- **Dropdown box**: světle šedý, 1px tvrdý černý okraj, bez zaoblení.
  Položky mají vlevo popisek, vpravo indikátor (v originále klávesová
  zkratka `Ⓐ`+písmeno); nedostupné položky jsou vyšedlé (`Put away`, `Open
  parent`, `Format disk...`, `Empty trash` v příkladu).

## 3. Pojmenování — kolize s dnešním `Canvas`

Dnešní `vb.Canvas` je *graf* (uzly/hrany/typy/téma) — to, co v Amiga analogii
odpovídá spíš obsahu jedné bitmapy. Amiga "screen" zavádíme jako **nový,
nadřazený objekt**:

```python
screen = vb.Screen(title="Síť", theme="cyber")   # id se přidělí samo (1, viz §3a)
canvas = vb.Canvas(screen=screen)                 # graf se váže na screen
```

**Zpětná kompatibilita se záměrně nezachovává** — tahle přestavba mění tvar
Python API (§1: posílají se jen data, ne prezentace), takže staré volání
`vb.Canvas(dimensions=..., theme=...)` bez screenu přestává dávat smysl.
`screen=` je proto **povinný** parametr `vb.Canvas`, ne opt-in nadstavba, a
`examples/*.py` se v rámci tohoto rozsahu **přepíšou** na nové API, ne
zachovávají běžící vedle sebe s kompat vrstvou.

**ID screenu se nezadává, přiděluje se samo** v pořadí vytvoření: první
`vb.Screen(...)` v uživatelském skriptu dostane `1`, druhý `2`, atd. —
`title=` je jen popisek pro chrome (screen bar, menu), ne identita. `id=0`
uživatel nikdy nedostane — je natrvalo rezervované pro vestavěný log screen,
viz §3a.

**`dimensions=` a `canvas.set_edge_style(...)` se z Python API odstraňují
úplně** — nejde o zachovaný „initial hint", ale o čistý řez: co je
*zobrazení* grafu (dimenze, čára/splajn, běh fyziky), řídí výhradně divák
přes vestavěné menu Options (§8a), voleb persistovaných v prohlížeči
(`localStorage`, stejně jako dnešní pozice/velikost oken). Python skript
touhle informací vůbec nedisponuje — nemá ji jak nastavit ani přečíst.
Dosavadní `ControlWindow` use-case pro čáru/splajn (viz
[2026-06-17-control-okna-design.md](2026-06-17-control-okna-design.md)) se
tímhle návrhem nahrazuje, ten dokument je tak touto přestavbou překonaný
(ne zrušený coby mechanismus `ControlWindow` obecně — jen jeho vlajkový
konzument).

Okna (`ControlWindow`, `TerminalWindow`, detail box) se dnes otevírají přes
`canvas.open_window(...)` — zůstává tak, okno tím pádem patří screenu, na
kterém jeho `Canvas` žije.

## 3a. Screen 0 — vestavěný log screen

**Screen `0` existuje vždy, i když ho Python skript vůbec nezmíní** — server
ho založí sám při startu (`vb.serve(...)`), stejně jako mívala Amiga vždycky
po bootu svůj systémový screen ještě předtím, než uživatel otevřel první
aplikaci. Je to jediný screen, který **nikdy nenese `Canvas`/graf** —
slouží výhradně jako **výstupní log konzole knihovny**:

- Vzhledově drží stejný Workbench chrome (bílá lišta, gadgety, téma — §7),
  ale místo 3D/2D scény má na celé ploše `TerminalWindow`-styl výstup
  (`input=False`, jako dnešní vzor `log` v `examples/terminal.py`) — čistě
  append-only log, žádný prompt.
- **Nepočítá se do limitu 8** uživatelských screenů (§9) — je nad rámec,
  systémový. Celkem tedy může běžet až 9 screenů najednou (0 + 1..8).
- Je to screen jako každý jiný v z-stacku (dá se zatáhnout/odkrýt tažením,
  §6) — jen se na něj neváže žádný `Canvas` a Python ho nemůže odebrat ani
  přejmenovat (je to log provozu knihovny, ne uživatelský obsah).
- **Bez historie — čistý live tail.** Server si log nikam neukládá (žádný
  ring buffer, žádný replay v `init`, na rozdíl od trvalých toků nebo
  control oken). Nově připojený/obnovený prohlížeč vidí jen záznamy, co
  vzniknou *od* připojení dál — refresh stránky = čistý štít. Nejjednodušší
  varianta, vědomě přijatý kompromis (ztráta historie při F5).
- **`vb.log(message, level="info")` — v rozsahu v1.** Explicitní zápis z
  libovolného místa uživatelského Python kódu (handler, `@canvas.every`,
  cokoli) do Screen 0, `source="backend_user"`. Bez týhle metody by
  kategorie `backend_user` (§ níže) obsahovala jen automaticky zachycené
  výjimky s tracebackem — s ní si vývojář může sám logovat běžné
  diagnostické hlášky, ne jen čekat na pád.

### Zdroje logu — čtyři kategorie, refaktor stávajícího kódu (rozsah v1)

Zdroj záznamu není binární backend/frontend, ale **čtyři kategorie** —
rozlišují, jestli hláška vznikla v prohlížeči, v REST vrstvě, v interním
provozu knihovny, nebo v kódu, který napsal uživatel knihovny (Python
vývojář, co ji používá):

| `source` | Co do něj spadá | Dnešní stav (co refaktor mění) |
|---|---|---|
| `frontend` | JS chyby/warningy prohlížeče (např. neznámé téma v `themes/manager.js:resolveTheme`, chyby patchů v `GraphStore`) | dnes jen `console.error`/`console.warn`, vidí jen dev konzole — **nová práce:** logovací helper, co vedle `console.*` zapisuje i do Screen 0 lokálně |
| `backend_api` | REST vrstva — každý příchozí request na `/api/event` (i budoucí REST endpointy) | dnes nezalogováno vůbec — **nová práce:** log requestu jako **pretty-printed JSON blok** (tělo requestu), ne jednořádkově |
| `backend_program` | interní provoz serveru/knihovny — reconnect/odpojení klientů, validace protokolu, systémové warningy (§9 v [2026-06-10-viewbase-library-design.md](2026-06-10-viewbase-library-design.md)) | dnes roztroušené `print`/`logging` v `server.py` — **refaktor:** přes jeden interní logovací helper |
| `backend_user` | kód, který napsal **uživatel knihovny** — výjimky s tracebackem z `@canvas.on_click`/`on_hover`/`@canvas.every()` handlerů a podobně (dnes: *„výjimka v handleru se zaloguje s tracebackem, server běží dál"*) | dnes jen Python `logging` na serveru — **refaktor:** stejný helper, ale s `source="backend_user"`, aby šlo v Options oddělit „chyba v mém kódu" od „chyba v knihovně" |

Každý log záznam nese `{ level, source, message, timestamp, component }`.
**`component`** říká, který ze čtyř modulů z §4a (`graph`/`gui`/`windows`/
`rest`/`server`) hlášku vyprodukoval — u `backend_api`/`backend_program` je
**povinný** (bez něj log knihovny splyne do jedné nerozlišitelné hromady a
modularita §4a se z venku vůbec neověří — *z logu musí jít poznat
komponenta*). `backend_user`/`frontend` component nemají (uživatelský kód
ani prohlížeč nejsou jeden z těch modulů). Záznamy `backend_api`/
`backend_program`/`backend_user` putují k prohlížeči novou protokolovou
zprávou `log` (↓, viz §5); `frontend` vzniká a zapisuje se přímo lokálně
(žádný round-trip).

### Options pro Screen 0 (jiné než u grafových screenů)

Screen 0 nemá graf, takže jeho **Options menu nese jiné položky** než
graf-Options z §8a (žádné 2D/3D, fyzika, čára/splajn — nedávají smysl bez
grafu):

| Skupina | Položka | Typ | Efekt |
|---|---|---|---|
| Závažnost | „Debug" / „Info" / „Warning" / „Error" | checkboxy (víc naráz) | filtruje zobrazené řádky podle úrovně |
| Zdroj | „Frontend" | checkbox | zobrazit/skrýt `source: "frontend"` |
| Zdroj | „Backend – API" | checkbox | zobrazit/skrýt `source: "backend_api"` (JSON bloky z REST requestů) |
| Zdroj | „Backend – program" | checkbox | zobrazit/skrýt `source: "backend_program"` (interní provoz knihovny) |
| Zdroj | „Backend – uživatelský kód" | checkbox | zobrazit/skrýt `source: "backend_user"` (handlery/`@canvas.every` z Python skriptu) |

Filtrování je **čistě klientské** (stejný princip jako graf-Options v §8a —
žádný round-trip, log si vede prohlížeč, jen se filtruje zobrazení) —
uloží se do `localStorage` (`vb-options:0`).

## 4. Architektura

```
Python:
  screen_a = vb.Screen(title="Síť", theme="cyber")     # id=1 (přiděleno automaticky)
  canvas_a = vb.Canvas(screen=screen_a); canvas_a.add_node(...)
  screen_b = vb.Screen(title="Infra", theme="modern")  # id=2
  canvas_b = vb.Canvas(screen=screen_b); canvas_b.add_node(...)

  vb.serve(screen_a, screen_b, ...)   # Workbench = víc screenů, 1 server, 1 WS

Browser (jedna stránka, jedno WS spojení, multiplexed po screen_id):
  ScreenManager
    ├─ ScreenInstance(0)  → jen log konzole, bez grafu (auto-init, §3a)
    ├─ ScreenInstance(1)  → GraphStore + PhysicsWorker + Renderer → WebGLRenderTarget (textura)
    ├─ ScreenInstance(2)  → GraphStore + PhysicsWorker + Renderer → WebGLRenderTarget (textura)
    └─ ...
  Compositor  – fullscreen shader pass: skládá textury screenů podle
                z-order + per-screen dragOffset (viz §6), kreslí chrome
                (screen bar, menu, depth gadgety) přes WindowManager (DOM/CSS,
                jako dnes u control/terminal oken)
```

Klíčový bod: **fyzika zůstává v browseru** (dnešní rozhodnutí se nemění),
jen teď běží N nezávislých instancí `PhysicsWorker` + `Renderer` paralelně —
každý screen je dnešní jednoscreenová pipeline, jen vykreslená do offscreen
textury místo přímo na canvas element.

**Vztah grafu a oken se nemění.** Dnes se graf (Three.js scéna) vykresluje
přímo na plátno a control/terminál/detail okna nad ním plují jako HTML/CSS
overlay (viz `render/` vs. `render/control_window.js`, `base_window.js`).
V multi-screen modelu je to stejné, jen násobené na úrovni screenu: každý
`ScreenInstance` má vlastní Three.js scénu, která se promítá **přímo na
plochu toho screenu** (přes Compositor do viditelné oblasti), a jeho okna
dál plují nad touhle plochou jako dnes — jen navíc jsou vizuálně svázaná s
konkrétním screenem (zmizí/schovají se, když je jejich screen zatažený pryč
nebo zakrytý; viz §6).

## 4a. Modularita — preferovaný přístup k refaktoringu

**Tvrdé pravidlo, ne jen preference: nesmíme dospět k monolitu.** Rozsah
týhle přestavby (multi-screen, log subsystém, Options menu, nové téma) je
zdaleka největší zásah do viewbase dosud — bez záměrného dělení do modulů
skončí `canvas.py`/`server.py` jako soubory, kam se nabalí všechno. Log s
povinným `component` (výše) je jeden z mechanismů, jak si to hlídat za
běhu: pokud log neumí říct, který modul mluvil, je to signál, že se hranice
mezi moduly rozmazala. Preference pro
implementaci: **rozdělit kód do víc, menších modulů/komponent podle
odpovědnosti**, ne nabalovat další odpovědnosti na dnešní hrstku souborů —
viewbase jako komponentní systém, ne pár velkých monolitů. Čtyři jasně
oddělené oblasti (backend i frontend zvlášť dodržují stejné dělení):

1. **Graf** — model dat: uzly, hrany, typy, toky, fyzika/rendering scény.
   Nic o oknech, menu ani REST.
2. **GUI/chrome** — `Screen`, `ScreenMenu`, Options stav, screen bar,
   compositor/drag-reveal, téma `workbench`. Nic o tom, jak se serializuje
   graf ani jak se přijímají REST požadavky.
3. **Okna** — `ControlWindow`/`TerminalWindow`/`DetailWindow` (typované
   pole, validace, chrome jednotlivého okna). Oddělené od GUI/chrome
   screenu samotného (okno je *obsah plovoucí nad* screenem, ne screen).
4. **REST** — `/api/event` a budoucí REST endpointy, včetně logování
   příchozích requestů jako `backend_api` (§3a). Oddělené od WS transportu
   v `server.py` i od `backend_program`/`backend_user` zdrojů logu.

Návrh rozvržení (backend, `python/viewbase/`):

```
graph.py          # dnešní jádro canvas.py: Node/Edge/typy/toky/batch/delty
gui/
  screen.py       # Screen (dnes screen.py, sem se přesune)
  menu.py         # ScreenMenu + Options stav
windows/
  controls.py     # ControlWindow (dnešní controls.py, přesunuto)
  terminal.py     # TerminalWindow
rest.py           # /api/event + budoucí REST endpointy, log source backend_api
log.py            # LogBus, vb.log() (dnes screen.py/log.py, log.py zůstává)
server.py         # jen WS transport + skládání app (tenčí než dnes)
protocol.py        # beze změny v roli
canvas.py         # tenký fasádní `Canvas` skládající graph.py + windows/ (veřejné API beze změny)
```

Frontend zrcadlí totéž dělení: `physics/`+`render/` = graf, `screens/`
(`manager.js`, `compositor.js`, `options.js`) = GUI/chrome, `render/
control_window.js`+`base_window.js`+`windows.js` = okna (beze změny
umístění, jen potvrzeno jako vlastní vrstva) — REST se frontendu netýká
(je to čistě backendová hranice, frontend REST nevolá, jen přijímá WS).

Přesné rozdělení modulů (přesuny/rozseknutí `canvas.py`) patří do
implementačního plánu jako samostatný refaktoringový krok, ne do tohoto
návrhu — tady se zaznamenává princip a cílové čtyři oblasti, aby je plán
respektoval.

## 5. Protokol

Zprávy protokolu už dnes nesou `canvas_id` (viz
[2026-06-10-viewbase-library-design.md](2026-06-10-viewbase-library-design.md)
§6, poznámka *"v1 obsluhuje jeden server jeden canvas, ale protokol je
připraven na víc"*) — aktivujeme to pole, přejmenujeme sémanticky na
`screen_id` (jeden `Canvas` = jeden `Screen`, 1:1, takže žádná nová
identita, jen ostré využití pole, které tam čekalo).

Nové zprávy:

| Směr | Zpráva | Obsah |
|---|---|---|
| ↓ | `screen_add` | screen_id, config (theme, quality, title), z-index |
| ↓ | `screen_remove` | screen_id |
| ↕ | `screen_reorder` | screen_id, nová pozice v z-stacku (drag přivede screen dopředu) |
| ↑ | `screen_drag` | screen_id, dragOffset (0–1, jen lokální UI stav, **neposílá se** — viz níže) |
| ↓ | `log` | level, source (`backend_api`/`backend_program`/`backend_user`), message, timestamp — vždy míří na Screen 0 (§3a) |

`init` nese pole všech screenů (config + kompletní graf každého) místo
jednoho. `patch`/`action`/`event` dostávají navíc `screen_id`, aby klient
věděl, do které `ScreenInstance` je routovat.

`screen_drag` (pozice rozhraní během tažení) je **čistě klientský UI stav** —
nejede na server, protože je to jen kompoziční detail vykreslení, ne data.
Server o tom nemusí vědět (žádný round-trip lag při tažení).

## 6. Reveal efekt (drag-to-uncover)

- Každý screen má **drag bar** (horní pruh, jako screen bar na Amize) —
  pointerdown na něm zahájí tažení, které mění `dragOffset` (0 = screen plně
  nahoře/kryje ostatní, 1 = plně stažený, screen pod ním plně odkrytý).
- Compositor je fullscreen quad se shaderem, který pro dva sousední screeny
  v z-stacku (aktuálně tažený `front` a nejbližší `back`) vybírá per-pixel
  texturu podle `step(dragOffset * screenHeight, pixelY)` — nad split-line
  `back`, pod split-line `front` (nebo obráceně, podle směru tažení) — to je
  přesně ten Amiga "napůl stažený screen" pohled, jen řešený fragment
  shaderem místo řádkového DMA switche.
- Screeny hlouběji v stacku (3.+ pozice) jsou úplně neviditelné, dokud se
  nedostanou do top-2 (odpovídá originálu — real Amiga taky ukazoval max
  2 bitmapy najednou na jedné scanline).
- Klik na screen bar bez tažení = **přehodí screen na vršek stacku** (rychlý
  ekvivalent "click to front", jako v okenních manažerech).

**Implementováno (viz plán, Fáze 6) jako CSS `clip-path: inset()` na DOM
kontejneru předního screenu, ne jako WebGL shader/WebGLRenderTarget.**
Vizuálně identické — `step()` v shaderu i `clip-path` jsou oba tvrdý,
neblendovaný přechod, jen na jiné vrstvě (GPU shader vs. DOM/prohlížeč).
Cena za jednodušší implementaci: nejde (bez dalšího shaderu) udělat měkký
blend na hranici a každý screen má dál vlastní `THREE.WebGLRenderer`/GL
kontext (žádné sdílení textur mezi screeny) — pro čistý hard-edge split,
který spec popisuje, to nevadí.

## 7. Vizuální téma `"workbench"`

Nové vestavěné téma (vedle `modern`/`cyber`) — **opraveno oproti dřívější
verzi tohoto dokumentu: `workbench` barví jen chrome, ne graf.** Barvy uzlů,
hran, labelů i font popisků v samotné 3D/2D scéně **zůstávají plně v rukou
Python vývojáře** — přes `define_type`/`update_node` meta jako dnes (§7 v
[2026-06-10-viewbase-library-design.md](2026-06-10-viewbase-library-design.md),
priorita meta > typ > téma), nezávisle na tom, jaké chrome si divák zvolí.
`workbench` paleta pokrývá výhradně: **okna, pozadí (backdrop screenu),
menu** — přesně tři věci, ne víc.

**Definice je jeden JSON objekt, nesoucí definici pro všechny tyhle prvky
najednou** — screen bar, window chrome, gadgety, ikony, backdrop, font
chrome textu — v jedné ploché datové struktuře, ne JS kód s vlastní
logikou. Autoritativní formát pro `workbench` (a do budoucna i pro
`modern`/`cyber`, které dnes žijí jako JS literály v `themes.js`) je tenhle
JSON, ne handrolled JS objekt — sedí to i s tím, jak `resolveTheme`/
`deepMerge` (`frontend/src/themes/manager.js`) už dnes umí sloučit
libovolný dict/JSON theme přes `modern` základ, takže se nezavádí nový
mechanismus, jen se JSON stává primárním zdrojem pravdy místo JS. Protože
`workbench` nedefinuje `node`/`edge`/`label`/`bloom` klíče vůbec, graf pod
tímhle chrome zůstává vizuálně `modern` (nebo cokoli vývojář nastaví přes
`define_type`) — merge přes `modern` základ mu ty sekce prostě nechá být:

```json
{
  "background": "#dadada",
  "screenBar": { "bg": "#cfe1fb", "fg": "#000000", "menuAttach": true },
  "window": {
    "headerBg": "#c8d4f0", "headerBgActive": "#6688eb",
    "headerFg": "#000000", "headerFgActive": "#ffffff",
    "gadget": "#000000", "bevel": "hard",
    "bodyBg": "#f4f6fb", "bodyFg": "#000000",
    "backdropPattern": "flat",
    "iconSet": "workbench-classic",
    "font": "topaz-8"
  }
}
```

Vysvětlivky k netriviálním hodnotám (JSON komentáře nepodporuje, proto
tady):

- `background` — barva plochy screenu (backdrop), ne grafu — graf se
  vykresluje nad ní stejně jako dnes, jeho vlastní pozadí/mlha řeší
  `node`/`edge` sekce zděděná z `modern` (viz výše).
- `window.bevel: "hard"` — 1px tvrdý bevel, ne shadow/blur (§2).
- `window.backdropPattern: "flat"` — plochá výplň (`background` výše), ne
  `diagonal-hatch` (starší Workbench styl z referenceA, volitelná varianta).
- `window.iconSet: "workbench-classic"` — odkaz na sadu z §7a, ne dnešní
  materiálové ikony `control_window.js`/`base_window.js`.
- `window.font: "topaz-8"` — bitmapový pixel font, ale **jen pro chrome
  text** (title bary, menu, gadgety, screen bar) — popisky uzlů v grafu mají
  svůj vlastní font podle grafového tématu (`modern`/`cyber`/vlastní), ne
  podle `workbench` chrome.

- **Lišta screenu je téměř bílá** (`#cfe1fb`, naměřeno přímo z reference —
  ne zaokrouhleno na čistou `#ffffff`) — nejsvětlejší plocha v celém chrome,
  s jemným modravým nádechem; nese systémové info i pull-down menu (§8),
  přesně jako `Amiga Workbench Release 3.2 …` pruh v referenceB.
- **Gadgety a ikony oken** (close/zoom/depth) se kreslí podle skutečných
  bitmap vyříznutých z referenčních screenshotů — viz §7a. Nejde o
  redraw-podle-oka SVG, ale o trasování/použití reálných pixelových tvarů,
  aby seděly „co nejvěrněji" (zadání).
- **Ikony oken/screenů** (drawer, disk, koš…) se stylizují podle
  `icon-ramdisk.png` / `icon-trashcan.png` / `icon-prefs-circle.png` z §7a —
  barevný plochý pseudo-3D styl referenceB, ne monochromní ikony
  referenceA. Sdílená sada mezi screen barem a window chrome, aby vizuálně
  souhlasily (žádné míchání s dnešními materiálovými ikonami).
- **Backdrop pattern**: výchozí `'flat'` (plochá `#dadada`, jako v
  referenceB) s volitelnou variantou `'diagonal-hatch'` (starší Workbench
  styl z referenceA) přepínatelnou v `ScreenMenu` (§8) — obě autentické,
  jen z různých verzí OS.
- **Bitmapový font**: vestavěný pixelový font (např. licenčně volná
  Topaz-like náhrada) pro title bary, labely gadgetů a screen bar —
  **výhradně chrome text**, ne popisky uzlů (ty řídí grafové téma, viz výše).
- Téma `workbench` je nezávislé na `dimensions` (2D i 3D) a je jen jedna z
  voleb per-screen `theme=` — screeny tak mohou libovolně mixovat `cyber` a
  `workbench` vzhled najednou (věrné Amize, kde měl každý screen i jiné
  rozlišení/hloubku barev).

### Úprava vestavěného tématu z Pythonu

Vývojář nemusí psát celý JSON od nuly, aby si téma jen mírně přizpůsobil —
vestavěné téma si **vyzvedne, upraví pár klíčů a pošle zpět**:

```python
paleta = vb.get_theme("workbench")          # kopie JSON objektu z §7 jako dict
paleta["window"]["headerBgActive"] = "#2f9fae"   # uprav, co potřebuješ (jen chrome klíče)
screen = vb.Screen(title="Síť", theme=paleta)
```

`vb.get_theme(name)` vrací **hlubokou kopii** vestavěného JSONu (`modern`/
`cyber`/`workbench`) — mutace návratové hodnoty neovlivní vestavěné téma pro
ostatní screeny. `Screen(theme=paleta)` dál funguje jako dnes (deep-merge
přes `modern` v `resolveTheme`, §7) — knihovna **na základě zaslaného
požadavku upraví paletu** (sloučí dodané klíče přes základ), stejný
mechanismus, jen doplněný o pohodlný způsob, jak si vzít startovní bod.

## 7a. Extrahované bitmapové masky (asset zdroj)

Z obou referenčních screenshotů vyříznuté pixelové bloky, uložené v
`docs/images/workbench-ref/` — slouží jako přesný zdroj tvarů pro gadgety a
ikony (ne jako finální assety pod licencí, ale jako referenční sprite sheet
pro trasování/nový redraw v odpovídajícím rozlišení):

| Soubor | Co je na něm |
|---|---|
| `reference-full-os32.png` | celý cílový screenshot (AmigaOS 3.2), hlavní vizuální reference |
| `reference-full-reaction.png` | celý ReAction dialog screenshot, reference pro gadgety formulářů |
| `screenbar.png` | bílý screen bar přes celou šířku (systémové info) |
| `window-titlebar-os32.png` | celý title bar okna „OS3.2" i s gadgety |
| `window-titlebar-system.png` | title bar okna „System" — potvrzuje konzistenci gadgetů napříč okny |
| `gadget-depth-left.png` | close gadget (levý roh title baru) |
| `gadget-right-pair.png` | zoom + depth-arrange gadgety (pravý roh title baru) |
| `icon-ramdisk.png` | ikona Ram Disk — referenční styl „disk/zásuvka" ikon |
| `icon-trashcan.png` | ikona koše — referenční styl barevných ikon s popiskem |
| `icon-prefs-circle.png` | kulatá ikona Prefs — referenční styl akčních ikon |
| `scrollbar-arrows.png` | scrollbar se šipkami nahoru/dolů |
| `reference-menu-pulldown.png` | celý screenshot rozklikutého pull-down menu (zdroj pro §8a) |
| `menu-bar-row.png` | vodorovná řada položek menu baru s aktivní (modrou) položkou |
| `menu-dropdown.png` | rozbalený dropdown se seznamem položek a zkratkami |

Až se přejde do implementace, tyhle bitmapy se buď přímo nakrájí na
sprite-sheet (nejrychlejší cesta k „co nejvěrnější" shodě), nebo poslouží
jako přesná předloha pro redraw ve vyšším rozlišení (ostřejší na HiDPI, ale
pracnější) — volba mezi tím patří do implementačního plánu, ne do tohoto
dokumentu.

## 7b. Systémové info na liště — živé metriky grafu (auto)

Přesně jako originál nese bílá lišta (`Amiga Workbench Release 3.2 …
Chip-RAM … CPU 68040 … Samstag 24-Okt-20 11:20:33`, referenceB v §2)
systémové stavové info, dá **grafový screen (1..8) automaticky** totéž, jen
o svém grafu — frontend si to spočítá sám z `GraphStore`/render smyčky, žádné
Python volání to nezakládá (stejný duch jako Options v §8a):

- **počet uzlů** a **počet hran** (živě, přepočte se při každém patchi),
- **typ grafu** — aktuální stav z Options (§8a): dimenze (2D/3D) a styl hran
  (čára/splajn), tak jak si je divák nastavil,
- **FPS** — běžící průměr z render smyčky toho konkrétního screenu.

Je to čistě informativní a čistě klientské (žádný protokolový round-trip,
podobně jako `screen_drag`/Options) — Screen 0 (§3a) tuhle metrickou sadu
nemá (nemá graf), jeho lišta nese jiný obsah (název/log stav).

## 8. Screen menu (pull-down, Amiga-style)

Na Workbenchi se menu neukazuje jako samostatný pruh — **sdílí plochu s
bílým screen barem** (§2/§7/§7b): normálně tam běží systémové info (u
grafových screenů živé metriky výše), podržením pravého tlačítka myši se
stejná plocha překreslí na pull-down menu aktivní aplikace. Je vždy vázané
na **aktivní screen** (ne na okno). Přenášíme stejný princip — v1
zjednodušeně jako pinned variantu (viz níže), ale na **téže bílé liště**,
ne na nové ploše pod ní:

```python
menu = vb.ScreenMenu()
menu.item("Graf", "Přidat uzel", on_select=pridej_uzel_handler)
menu.item("Graf", "Reset layoutu", on_select=reset_handler)
menu.item("Zobrazení", "Motiv: cyber", on_select=lambda e: screen.set_theme("cyber"))
menu.item("Zobrazení", "Motiv: workbench", on_select=lambda e: screen.set_theme("workbench"))
screen.pin_menu(menu)
```

- `ScreenMenu` = pojmenované skupiny (`"Graf"`, `"Zobrazení"`, …) s
  položkami; stejný vzor jako `ControlWindow` (typovaný popis na backendu,
  frontend jen vykresluje a posílá zpět event).
- **Pin** (`pin_menu`) = řádek s názvy skupin zůstává trvale zobrazený jako
  pruh (pro tuhle knihovnu praktičtější než originální right-click popup —
  junior vývojářovo GUI má být objevitelné bez tajných gest).
- **Interakce v1: klik, ne podržení pravého tlačítka** — Amiga
  right-click-and-hold nemá rozumný ekvivalent na Macu (jednotlačítkový
  trackpad/myš), takže v1 používá běžný cross-platformní vzor: **klik na
  název skupiny rozbalí dropdown, klik na tu samou skupinu ho zabalí, klik
  mimo menu (kamkoli jinam) ho taky zabalí.** Funguje stejně na Windows,
  macOS i Linuxu, žádné speciální gesto. Věrné right-click-and-hold zůstává
  volitelné rozšíření pro v2+ (`screen.pin_menu(menu, mode="hold")`), není v
  v1 nutné.
- Výběr položky → event `menu_select` (screen_id, group, item) → handler na
  backendu, stejný mechanismus jako `on_click`/`window_submit`.
- Vizuálně je to **táž lišta** co systémové info (§7), ne nový pruh —
  `pin_menu` v1 ji buď rozšíří o menu skupiny vedle info textu, nebo (když
  je připnuté) plochu s info textem nahradí. Věrné right-click-and-hold,
  které info a menu časově střídá na stejném místě, je v2+ (viz §10).

## 8a. Vestavěné menu „Options" (view-only, klient-side)

Zásadní rozdíl oproti §8: **`ScreenMenu` je volitelný a autorský (Python ho
definuje)**, kdežto **„Options" existuje vždy, automaticky, na každém
screenu** — vykresluje ho frontend sám, žádné Python volání ho nezakládá.
Realizuje princip z §1: co se týče *zobrazení* grafu (ne jeho *dat*),
poslední slovo má divák v prohlížeči.

Vzor přebíráme přímo z referenčního screenshotu
(`docs/images/workbench-ref/reference-menu-pulldown.png`, crops
`menu-bar-row.png` + `menu-dropdown.png`):

- **Menu bar row** — vodorovná řada položek na bílé liště (§7/§8): pokud má
  screen vlastní `ScreenMenu` skupiny (`"Graf"`, `"Zobrazení"`, …), řadí se
  vedle sebe stejně jako `Workbench | Window | Icons | Tools` v originále;
  **„Options" je vždy poslední položka vpravo**, bez ohledu na to, co Python
  nadefinoval (nebo jediná položka, když Python žádné vlastní menu nemá).
- Rozkliknutá položka menu baru: **modré pozadí, bílý text** — stejný
  akcent jako u aktivního title baru okna (§7), sjednocuje vzhled. Stejná
  klik-přepínací interakce jako u `ScreenMenu` (§8) — klik rozbalí, klik na
  totéž nebo mimo menu zabalí, cross-platformně (žádné right-click-hold).
- **Dropdown box**: světle šedý, tvrdý 1px černý okraj, bez zaoblení —
  otevírá se přímo pod „Options". Položky mají vlevo popisek, vpravo
  **checkbox indikátor** (✓/prázdné) místo klávesové zkratky z originálu —
  smysl (stavový přepínač) je stejný, jen jiný typ indikátoru.
- Položka, která by v aktuálním stavu grafu neměla efekt, je **vyšedlá**
  (stejný vzor jako `Put away`/`Format disk...` v referenci) — např.
  „Fyzika běží" je vyšedlá, pokud graf nemá žádné uzly.

Konkrétní položky **v1**:

| Položka | Efekt |
|---|---|
| „3D pohled" | přepne dimenzi renderu (2D ortho / 3D perspektiva) |
| „Fyzika běží" | pozastaví/obnoví tikání `PhysicsWorker` (zamrzne pozice uzlů, render běží dál) |
| „Křivkové hrany (splajn)" | přepne vykreslení hran čára/splajn — nahrazuje dnešní `canvas.set_edge_style(...)` volané z Pythonu |

- **Žádný protokolový round-trip.** Stejně jako `screen_drag` (§5) je tohle
  čistě klientský stav — server o volbě diváka neví. Ukládá se do
  `localStorage`, klíčováno **podle `title=` screenu** (slug/hash textu), ne
  podle číselného id — id se přiděluje znovu od 1 při každém běhu skriptu,
  takže by „Screen 1" včerejšího skriptu a „Screen 1" dnešního nechtěně
  sdílely nastavení. Klíč podle title (`vb-options:<slug(title)>`) je
  stabilnější napříč běhy, za cenu, že dva různé skripty se screenem stejně
  pojmenovaným (např. oba `title="Síť"`) si nastavení sdílet *budou* — přijatý
  kompromis, po vzoru dnešního `vb-pos:<window_id>`. Python nemá způsob, jak
  volbu diváka přebít nebo si ji přečíst zpátky (viz §1 — je to záměrně
  jednosměrné: Python dodává data, divák si volí prezentaci).
- **Riziko/implementační poznámka:** přepnutí 2D↔3D za běhu vyžaduje, aby
  `D3ForceEngine` uměl změnit `numDimensions` za běhu, nebo aby se
  `PhysicsWorker` restartoval s aktuálními pozicemi uzlů jako vstupem
  (třetí osa se jen doplní/zahodí) — detail pro implementační plán, ne
  blokace tohoto návrhu.
- **Motiv (`workbench`/`cyber`/`modern`)** zůstává primárně Python volbou
  (§2 — `Screen(theme=...)`); zda ho smí Options lokálně přebít, je
  otevřená otázka v §11, ne rozhodnuté chování v1.

## 9. Výkon a limity

- 8 screenů × vlastní `PhysicsWorker` (Web Worker) + vlastní
  `WebGLRenderTarget` je reálná zátěž — každý screen defaultně startuje na
  `quality="auto"` a při N > 2 živých screenech `auto` agresivněji sníží
  pixel ratio/bloom (rozšíření dnešní auto-quality logiky o globální rozpočet
  přes všechny screeny, ne jen jeden).
- Validace v Pythonu: 9. a další uživatelský `Screen` (nad limit 8, nepočítaje
  systémový `0` — viz §3a) → `ValueError`, hlasitě a hned, stejný vzor jako
  ostatní validace v `Canvas`. Protože se id přiděluje automaticky, duplicitní
  id není situace, která může nastat.
- Screeny hlouběji než pozice 2 v z-stacku se nemusí renderovat do textury
  každý frame (nejsou vidět ani částečně) — fyzika běží dál (dohodnuto
  „naplno“), ale render pass se pro ně smí přeskočit, dokud se nedostanou do
  top-2. Šetří GPU, neporušuje „graf žije na pozadí“.

## 10. Rozsah v1 / mimo rozsah

**Uvnitř:** `Screen` objekt s auto-přiděleným id (config, limit 8
uživatelských + systémový `0`), `Canvas(screen=...)` vazba, **Screen 0**
jako vestavěná log konzole (auto-init, bez grafu — §3a) **včetně refaktoru
stávajícího backend logování** (`canvas.py`/`server.py`) a **nové
frontendové logovací vrstvy** tak, aby obě defaultně tekly na Screen 0,
**log REST requestů** na `/api/event` jako pretty-printed JSON (§3a),
protokol rozšířený o `screen_id` na všech zprávách + `screen_add/remove/
reorder` + novou zprávu `log`, frontend `ScreenManager` + Compositor s
drag-reveal shaderem, téma `workbench` (chrome + backdrop pattern + ikony +
bitmapový font), `ScreenMenu` s pinned pull-down menu, vestavěné menu
**Options** — obsahově odlišné podle typu screenu: view-only přepínače
2D/3D, fyzika on/off, čára/splajn u grafových screenů (§8a), severity +
čtyři zdrojové filtry (frontend/backend_api/backend_program/backend_user) u
Screen 0 (§3a) — vždy jako čistě klientský stav; `vb.log(message,
level=...)` jako explicitní zápis z uživatelského kódu (§3a).

**Mimo rozsah (v2+):** texturové zdroje mimo vlastní render (`<img>`/
`<video>` jako screen), plná ReAction paleta gadgetů (dnešní `ControlWindow`
pole stačí, jen se přebarví do tématu), right-click-and-hold menu chování,
CRT/scanline post-processing filtr, historie/ring buffer logu na Screen 0
(v1 je čistý live tail, §3a), zvuk (Amiga bootovací "bong" 😄 — mimo i jako
vtip).

## 11. Otevřené otázky pro review

1. ~~Má `vb.serve()` přijímat i samostatný `Canvas`...~~ — vyřešeno: **žádná
   zpětná kompatibilita**, `screen=` je povinný, `examples/*.py` se přepíšou
   (viz §3). `vb.serve()` bere jen `Screen` objekt(y).
2. ~~`ScreenMenu` — right-click-hold vs. pinned...~~ — vyřešeno: **v1 je
   klik-přepínací** (klik rozbalí/zabalí, klik mimo zabalí) — Amiga
   right-click-and-hold nemá rozumný ekvivalent na Macu (jednotlačítková
   myš/trackpad), viz §8.
3. Bitmapový font — potřeba vybrat/zabalit konkrétní font (licenčně volnou
   Topaz-like náhradu); bez námitek proti návrhu, výběr konkrétního fontu
   se řeší při implementaci, ne v tomto dokumentu.
4. ~~`canvas.set_edge_style(...)` a `dimensions=`...~~ — vyřešeno: odstraňují
   se z Python API úplně, nejde o zachovaný hint (viz §3).
5. ~~Smí Options (§8a) lokálně přebít i `theme=`...~~ — vyřešeno: **ne**,
   motiv zůstává výhradně Python volbou (§2), Options řeší jen 2D/3D,
   fyziku a čáru/splajn.
6. ~~`vb.log(text)` zkratka...~~ — vyřešeno: **patří do v1** (viz §3a).
7. ~~Musí plně zakrytý screen (3.+ v z-orderu) šetřit prostředky...~~ —
   vyřešeno: **ano, vykreslování i fyzika se pozastaví** pro cokoli mimo
   top-2 pozice v z-orderu (jedna scanline = max 2 bitmapy, §9), s výjimkou
   **Screen 0 (log, §3a)**, který teče vždy. Implementace: viz plán, Fáze 8.
8. ~~Jsou `Screen` a `Canvas` nezávislé, atomické objekty...~~ — vyřešeno:
   **ano.** `Screen` lze vytvořit a naplnit (`pin_menu`) bez existujícího
   `Canvas`u; `Canvas(screen=...)` je explicitní adopční krok
   (`_adopt_screen`), ne implicitní vedlejší efekt. `Screen.destroy()` je
   symetrický explicitní protějšek — zavře přidružený `Canvas` (pokud
   existuje) a frontend uklidí VŠECHNY přidružené objekty (WebGL kontext,
   physics worker, DOM). Implementace: viz plán, Fáze 8.

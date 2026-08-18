# Multi-screen Workbench

*Víc screenů na jednom serveru, přepínání a drag-reveal.*

[← zpět na přehled](../README.md)

---

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
[architektonické revizi](superpowers/specs/2026-08-02-wm-plugin-architecture.md).

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
skupiny za ní) a vedle ní vestavěná skupina **„System"** (příkazy workbenche samotného,
dnes `Shell CLI` – otevře shell okno); obsah Options řídí **aktivní okno** — stejný model jako macOS
menu bar, kde menu patří aktivní aplikaci: klik na okno grafu → „Fyzika
běží", „Křivkové hrany (splajn)", **„3D pohled"** (živé přepnutí kamery i
fyzikální simulace 2D/3D za běhu), **„Clusters (regions)"** (zapnuto = komunity
mají ve fyzice vlastní gravitační centra a graf se rozpadá na oddělené
oblasti; vypnuto = volné rozložení jen pružinami a odpuzováním – u grafů s
velkými huby bez rovných „plachet" hran mezi oblastmi); všechny volby se
pamatují v `localStorage` napříč reconnecty; klik na okno logu → filtry úrovní (debug/info/warning/error)
a zdrojů; klik na terminálové okno → **„Word Wrap"** (zalamovat dlouhé
řádky výstupu, nebo je nechat celé a scrollovat do strany). Mechanismus je
pro všechny typy oken týž (`BaseWindow.getOptionsItems`) — nový typ okna
si Options přidá jednou metodou. Okna bez vlastních Options (detail,
control) skupinu nemění; volba položky (i checkbox) dropdown hned zavře. A pokud něco na
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
[design](superpowers/specs/2026-08-02-multi-screen-workbench-design.md),
[implementační plán](superpowers/plans/2026-08-02-multi-screen-workbench-plan.md)
a [architektura WM + pluginy](superpowers/specs/2026-08-02-wm-plugin-architecture.md).

---

---

[← zpět na přehled](../README.md)

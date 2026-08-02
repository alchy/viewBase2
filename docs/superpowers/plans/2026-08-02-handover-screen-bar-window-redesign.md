# Handover: Screen bar / drag-reveal / window redesign

> **STAV (2026-08-02, navazující instance): HOTOVO.** §4 krok 1 (ověření) dokončen
> — timestamp v `main.js#onLog` v kódu chyběl (handover ho popisoval, změna se
> ztratila), doplněn. §3a implementováno celé: log i graf jsou okna
> (`render/log_window.js`, `render/graph_window.js`), `LOG_SCREEN_ID`/
> `ensureLogScreen` smazány (frontend i `python/viewbase/screen.py`),
> `log_screen_instance.js` zanikl. Aktivní okno řídí Options přes
> `BaseWindow.getOptionsItems()` + `WindowManager._setActive/refreshOptions`
> (macOS model; okna bez Options skupinu nemění, prázdný zdroj = skupina
> skrytá — rozhodnutí uživatele). Log: auto-open na předním screenu při prvním
> záznamu, filtry úrovní I zdrojů (§3b); model = AmigaShell (pozdější kolo
> oprav, ruší §3b prepend: „když budeme mít okno jako Amiga Shell, pak můžeme
> přidávat zespodu… jako tail -f") — nové řádky dolů + autoscroll, bez close
> gadgetu (`closable: false`), jde jen minimalizovat. Gadgety = binární
> bitmapy (CSS mask) barvené `--vb-window-gadget` z palety per screen; okna
> mají rám `--vb-window-border` (workbench černý).
>
> **NAVAZUJÍCÍ VELKÝ REFAKTOR (stejný den):** celý frontend přestavěn na
> **window manager + pluginy** (zadání: „zobrazení grafu je jen jedna z jeho
> funkcí") – jádro `frontend/src/wm/` (drag.js se sticky pojistkami,
> base_window, window_manager s registrem typů, screen_bar, screen_manager,
> desktop, options_store), schopnosti `frontend/src/plugins/` (graph/, log,
> detail, control, terminal). Kompletní revize a mapa přesunů:
> `docs/superpowers/specs/2026-08-02-wm-plugin-architecture.md`. Další
> změny chování z live testování: Options dropdown se zavírá hned po volbě;
> metriky sítě (2D/3D · uzly · fps) v liště okna grafu, lišta screenu jen
> titulek; Guru Meditation nese důvod přímo v boxu místo hex kódu
> (guru_code.js smazán); dvojklik na lištu okna maximalizuje/vrací.
> Bitmapové gadgety vyříznuty z referencí do `frontend/src/assets/gadgets/`
> (§3b). Navíc: CSS proměnné témat jdou na kontejner screenu, ne :root —
> témata jsou per-screen. Vše ověřeno živě Playwrightem (auto-open, prepend,
> filtry, přepínání Options, resize grafu, multiscreen drag-reveal,
> minimalizace/obnova). Testy: 177 frontend + 208 python, build OK.

**Pro:** další instance Claude, co tohle přebírá bez kontextu předchozí konverzace.
**Navazuje na:** [Multi-screen Workbench plán](2026-08-02-multi-screen-workbench-plan.md) (Fáze 1–9) a
[design spec](../specs/2026-08-02-multi-screen-workbench-design.md). Fáze 9 v plánu popisuje
předchozí kolo oprav (Screen 0 do z-stacku, Guru Meditation, živé 2D/3D). **Tenhle dokument
popisuje DALŠÍ kolo** — vzniklo z živého testování uživatelem v reálném prohlížeči (ne
Playwright), který postupně poslal desítky krátkých oprav a 4 referenční screenshoty
Amiga Workbench/AmigaDOS. Kód je aktuální, ale konverzace byla přerušena uprostřed
ověřování + před dvěma velkými nedokončenými rozhodnutími (viz §3).

**Stav testů v okamžiku handoveru:** `python -m pytest python/tests -q` → **208 passed**.
`npx vitest run` (`frontend/`) → **177 passed**. `npm run build` prochází. Žádný rozbitý test.

---

## 1. Co je HOTOVO a ověřeno živě (Playwright, screenshoty v konverzaci)

### 1a. Screen bar — kompletní přestavba
Uživatel opravil architekturu vícekrát za sebou, finální stav:

- **Jedna lišta na screen, ne dvě.** Dřív existoval samostatný root-level "screen bar"
  (`ScreenManager`) NAD per-screen `ScreenMenuBar` (Options/ScreenMenu) — uživatel to opravil:
  „máš na screenu mít vždy jen jednu lištu… i menu je v rámci screen lišty". `ScreenMenuBar`
  (`frontend/src/screens/screen_menu.js`) teď nese VŠECHNO: titulek, ScreenMenu skupiny,
  Options skupinu, depth gadget, i samotné tažení. `ScreenManager` (`manager.js`) žádnou
  vlastní lištu nemá.
- **Edge-to-edge, ne plovoucí s mezerou.** První pokus dal liště mezeru (`margin: 6px`) podle
  jednoho referenčního screenshotu — uživatel to opravil poté, co poslal PŘESNĚJŠÍ referenci
  (`docs/images/workbench-ref/screenbar-single-gadget-edge-to-edge.png`, stažený z
  `https://downofiles392.weebly.com/uploads/1/1/8/7/118770645/491447813.png`): lišta jde
  OD KRAJE KE KRAJI (`top:0;left:0;right:0`, žádný margin).
- **PRÁVĚ JEDEN gadget vpravo, ne pár.** Stejná reference to potvrzuje explicitně ("vidíš, že
  má vpravo jen jeden přepínač"). `ScreenManager.cycleNext()` je jediná akce (prohodí
  `zOrder[0]`/`zOrder[1]`); `sendActiveToBack()` byl SMAZANÝ (existoval jen krátce, dokud
  uživatel neposlal opravu). Gadget: `addGadget('vb-screen-switch', '▤', ...)`.
- **Options je VŽDY první skupina zleva** (`ScreenMenuBar._allGroups()` vrací
  `[optionsGroup, ...remoteGroups]`, ne naopak).
- **Titulek je vystředěný** přes CSS grid (`grid-template-columns:1fr auto 1fr`) — ne flexbox
  s `margin-left:auto`, protože to necentrovalo spolehlivě při nesymetrické šířce menu skupin
  vs. gadgetu.
- **Živé metriky vedle titulku** (§7b design spec, dřív odloženo, teď implementováno):
  `ScreenMenuBar.setMetrics(text)` vypisuje `"N uzlů · M fps"` vedle titulku.
  `screen_instance.js` má vlastní FPS tracker (`trackFps`/`updateMetrics`, throttled 500ms),
  nezávislý na `FpsWatchdogu` (ten běží jen při `quality=auto`, metriky vždy).

**Ověřeno živě:** `examples/multiscreen.py` — screenshot ukazuje `Options · Síť · 2 uzlů · 6 fps`
na jedné liště, edge-to-edge, jeden gadget vpravo. Viz `fv2-01-initial.png` v konverzaci
(soubor byl ve scratchpadu, ne v repu — screenshoty NEJSOU commitnuté, jen ověřovací artefakty).

### 1b. Drag-reveal — kompletně jiný model (3. verze v rámci téhle konverzace)
Uživatel postupně upřesnil model přes několik zpráv, dokud nebyl přesný:

1. **NE clip-path** (odshora mizící ořez, obsah pod ním se pixelově nehýbe) — to byla PŮVODNÍ
   implementace z předchozí fáze (Fáze 6/8 v plánu).
2. **JE `transform: translateY()`** — celý blok (canvas i jeho vlastní lišta, protože lišta je
   teď SOUČÁST kontejneru) se posune dolů jako jedna bitmapa. Uživatelovo zdůvodnění (citace):
   „posouvám, odkud se mi to zobrazuje vertikálně – nic se nemění, screen je konzistentní, jen
   posouvám, kde začínám zobrazovat" — přesně to, co dělal reálný Agnus (mapování
   bitmapa→scanline se posune, obsah bitmapy zůstává netknutý).
3. **KAŽDÝ screen má VLASTNÍ, PERZISTENTNÍ offset** (uživatel: „dvojitý buffer, buffer 0 má Y
   offset, buffer 1 taky, můžu offsety měnit") — NE jedna sdílená `dragOffset` hodnota jen pro
   "přední" screen, jak to bylo předtím. `ScreenManager.offsets` je `Map<screenId, number>`.
4. **ŽÁDNÝ auto-commit/snap-back.** Uživatel: „tam kam dotáhnu lištu, tam zůstává obraz
   rozdělen" a „žádný skok na celou obrazovku, lišta se screen může klidně zůstat v polovině".
   Puštění tažítka NEDĚLÁ nic — offset zůstane přesně tam, kam ho tažení dotáhlo. Depth gadget
   (`cycleNext`) je JEDINÝ způsob, jak se dostat na čistý stav (resetuje oba zúčastněné screeny
   na offset 0).
5. **Tažení je kumulativní** k offsetu, kde screen byl na začátku gesta (`offsetAfterDrag`), ne
   vždy od nuly — druhé tažení pokračuje odtud, kde první skončilo. Funguje i obráceně (tažení
   nahoru offset sníží, screen se dá "zasunout" zpátky).
6. **Chování = stejné jako přesouvání okna** (uživatel: „chování - drag lišty - to je stejný
   pattern jako pro okno. Držím - táhnu - pustím - zůstává").

Implementace: `frontend/src/screens/drag_reveal.js` (čisté funkce: `offsetAfterDrag`,
`translateYForOffset`, `swapFrontWithNext`, `clampDragOffset` — `shouldCommitDrag`/
`dragOffsetFromDelta` byly SMAZÁNY, nahrazeny `offsetAfterDrag`), `manager.js#_wireDrag`
(pointer wiring, per-screen).

**Bezpečnostní pojistka přidaná NAKONEC** (uživatel nahlásil „kliknu a drží se to myši" — bug
NEŠLO reprodukovat přes Playwright syntetické eventy, takže zůstává NEPOTVRZENÝ, ale opraveno
defenzivně): `ScreenManager` konstruktor teď má `window.addEventListener('pointerup'/
'pointercancel', () => { this.dragState = null; })` jako globální pojistku + `barEl` má navíc
`lostpointercapture` listener. **TOHLE JE MÍSTO, KTERÉ POTŘEBUJE OVĚŘIT ŽIVĚ uživatelem na jeho
reálném zařízení** — automatizované testy to nezachytily.

**Ověřeno živě** (`final_verify2.js` v konverzaci): drag → release uprostřed → transform
persistuje (`translateY(300px)`) → hover pohyb BEZ drženého tlačítka nic nezmění → druhé tažení
je kumulativní (300+100=400px) → gadget klik resetuje na 0 a přepne titulek. Nula console
chyb.

### 1c. Screen 0 (log) — nativně vždy existuje
- **Eager vytvoření** (uživatel: „Screen 0 by měl být nativně vždy" — dřív se zakládal lazy až
  na první `vb.log()` zprávu). `main.js#bootstrap()`: `screenManager.ensureLogScreen()` voláno
  SYNCHRONNĚ hned po `new ScreenManager(...)`, PŘED `connection.connect()`.
- **Nikdy nekrade focus, ALE první skutečný screen ho nahradí vpředu.** `ScreenManager._register()`:
  Screen 0 vždy jde na konec `zOrder` (vzadu). Když je Screen 0 aktuálně JEDINÝ (tedy `zOrder[0]
  === LOG_SCREEN_ID`), první SKUTEČNÝ screen, co se zaregistruje, se dá dopředu (`unshift`), ať
  uživatel po startu nekouká na prázdný log.
- **`ScreenMenuBar` sdílená se screeny s grafem** (`log_screen_instance.js` teď používá STEJNOU
  třídu `ScreenMenuBar`, ne vlastní hardcoded padding jako dřív).
- **Options pro Screen 0 = filtr úrovně logu** (§3a design spec, dřív odloženo): checkboxy
  debug/info/warning/error (`LOG_LEVELS` z `log_panel.js`). Filtr se aplikuje jen na NOVĚ
  příchozí řádky (v1 je čistý live tail, žádná historie/ring buffer — starší explicitní
  rozhodnutí z designu, respektováno).
- **`append(record)` bere teď RAW record**, ne předformátovaný string (`main.js` dřív volal
  `formatLogLine()` samo a poslalo hotový text — změněno, ať `matchesFilters`/timestamp mají
  přístup ke strukturovaným datům).
- **Timestamp vždy** (uživatel: „log má vždy timestamp"): `main.js#onLog` razítkuje
  `record.timestamp = new Date()` PŘED předáním dál (do `append()` i do Guru Meditation
  detailu). `formatLogLine()` (`log_panel.js`) přidá `HH:MM:SS` prefix, když `record.timestamp`
  existuje — bez něj (přímé volání v testech) beze změny, zpětně kompatibilní.

**Ověřeno živě:** eager existence potvrzena (`data-screen-id="0"` v DOM hned po loadu, i bez
`vb.log()` volání), front-stealing potvrzeno (`examples/log_demo.py`: aktivní titulek je "Log
demo", ne "Log"). **NEOVĚŘENO živě po posledních změnách** (timestamp, level filtry) — test
skript (`log_screen_check.js`) byl rozdělaný, když přišel handover požadavek. **Doporučení pro
další instanci: dokončit tenhle test jako první krok** (viz §4).

### 1d. Guru Meditation, 2D/3D toggle, connection wording — z PŘEDCHOZÍHO kola (Fáze 9), stále platí
Nezměněno touto fází, jen pro úplnost (detaily v plánu, Fáze 9):
- Guru Meditation vizuál opraven na červeně orámovaný box (ne plná červená lišta) podle
  reference; dismiss = libovolné tlačítko myši NEBO **Esc** (uživatel zpřesnil ze "space" na
  "Esc" v jedné zprávě, pak zpátky potvrdil — finální stav je **Esc**, zkontroluj
  `frontend/src/core/guru_meditation.js` `_onKeydown`).
- `connect_failed` vs. `close` texty rozlišené („nezdařilo" vs. „vypadlo").
- 2D/3D live toggle, bloom/composer rebuild fix — funguje, testováno.

### 1e. Window theming — infrastruktura hotová, VIZUÁLNĚ NEOVĚŘENO
Uživatel poslal 2 další reference (`docs/images/workbench-ref/screen-with-windows-calculator.jpg`
ze `https://www.valoroso.it/...`, a jeden přímo vložený screenshot AmigaDOS okna – NENÍ uložený
jako soubor, jen popsaný níže) a řekl: „zkus stylizovat okna podle obrazkových ukázek… včetně
barevné palety… poté všechny objekty budou používat layout a styl toho okna."

**Popis AmigaDOS reference (vložený obrázek, žádná URL):** bílá titulková lišta s JEMNÝM
VODOROVNÝM PRUHOVÁNÍM (ne plná barva), tmavý text "AmigaDOS", DVA gadgety vpravo nahoře (malé
tmavé čtverečky). Tělo okna: syté modré pozadí (~`#0055AA`), bílý monospace text, oranžový
blok kurzoru.

**Implementováno** (infrastruktura CSS proměnných JIŽ EXISTOVALA z dřívějška, jen se dolily
správné hodnoty + přidal pruhovaný vzor):
- `frontend/src/themes/workbench.json` → `window.headerBg: "#ffffff"`, `window.bodyBg:
  "#0055aa"`, `window.bodyFg: "#ffffff"`, `window.key: "#ff8800"` (oranžová), nové pole
  `window.headerStripe: true`.
- `frontend/src/themes/manager.js#applyCssVars` — nová CSS proměnná
  `--vb-window-header-pattern`, počítaná z `repeating-linear-gradient(...)` když
  `theme.window.headerStripe` je pravda, jinak `'none'`.
- `frontend/src/render/base_window.js` — titulková lišta (`_buildHeader`) teď má
  `background-image:var(--vb-window-header-pattern, none)` navíc k `background-color`.
- Testy upraveny (`themes.test.js` — asertuje `bodyBg`/`headerStripe` místo staré
  `headerBgActive` hodnoty). **177 testů zelených, včetně těchhle.**

**NEOVĚŘENO ŽIVĚ.** Playwright skript (`window_style_check.js`) na to čekal, když přišel
handover požadavek — narazil na test-harness problém (čekání na `canvas` element „visible" přes
Playwright actionability check timeoutovalo; NENÍ jasné, jestli je to reálný bug v appce, nebo
jen špatně napsaný test — `canvas` element může být legitimně `display:none` kvůli
`ScreenInstance.setActive()` logice, pokud test klikl na gadget dřív, než se `_layout()`
stihnul aplikovat). **Tohle je první věc k doladění** (§4).

---

## 2. Referenční obrázky (pro orientaci, ne pro slepé kopírování)

Všechny v `docs/images/workbench-ref/`:

| Soubor | Co ukazuje | Zdroj |
|---|---|---|
| `screenbar-single-gadget-edge-to-edge.png` | **Screen bar** — "Amiga Workbench 1,457,160 graphics mem 3,204,712 other mem", edge-to-edge, JEDEN gadget vpravo nahoře | `downofiles392.weebly.com` (uživatel poslal URL) |
| `screen-with-windows-calculator.jpg` | Screen bar ("AMIGA CALCULATOR") + více oken uvnitř (Workbench1.3, Utilities, Calc V1.3) — ukazuje vztah screen/window, NE zdroj pro počet gadgetů na screen baru (na oknech uvnitř jsou 2 gadgety, na SCREEN baru nahoře jen náznak, nepočítáno explicitně uživatelem) | `valoroso.it` (uživatel poslal URL) |
| `workbench-desktop-icons-and-windows.jpg` | "Workbench release 1.2. 372568 free memory" screen bar (edge-to-edge) + 3 okna (Workbench1.2/Utilities/System, pruhovaná lišta, 2 gadgety každé) + IKONY (RAM Disk, Workbench1.2) přímo NA modrém desktop pozadí, mimo okna – potvrzuje §3a model (screen = viditelné pozadí za/mimo okny, ne jen prázdný černý kontejner) | Bing/DuckDuckGo image (uživatel poslal URL) |
| (starší, z Fáze 5/9) `screenbar.png`, `gadget-right-pair.png`, `gadget-depth-left.png`, `reference-full-reaction.png`, `reference-full-os32.png`, `reference-menu-pulldown.png`, `menu-bar-row.png`, `window-titlebar-*.png`, ikony | Starší reference z původního designu (§2 spec) | Hyperion Entertainment press kit, viz design spec §2 |
| `workbench13-desktop-toastytech.png` | Workbench 1.3 desktop — modrá plocha, „typické okno" (Workbench1.3/Utilities/Prefs) se všemi gadgety, ikony na ploše; ilustrace cílového vizuálu prostředí (posláno v navazujícím kole 2026-08-02) | `toastytech.com/guis/amiga1wb13.png` |
| `guru-meditation-toastytech.png` | Guru Meditation — červeně orámovaný box nahoře, černá plocha („Software Failure. Press left mouse button to continue.") | `toastytech.com/guis/amiga1guru.png` |
| `workbench1-default-toastytech.png` | Workbench 1.0 — zdroj bitmapy SIZING GADGETU (pravý dolní roh okna, dva čtverečky; vyříznuto do `frontend/src/assets/gadgets/resize.png`) a barev `workbench-amiga` | `toastytech.com/guis/amiga1default.png` |

**Chybí v repu:** AmigaDOS okno (bílá pruhovaná lišta, modré tělo, oranžový kurzor) — uživatel
ho vložil přímo do konverzace (ne URL), takže není stažitelný. Popis viz §1e výše. Pokud bude
potřeba přesnou referenci znovu, zeptej se uživatele, jestli ji může poslat znovu jako URL nebo
soubor.

---

## 3. NEDOKONČENO — cílová architektura je již rozhodnutá

Uživatel ji upřesnil těsně před handoverem, v rychlém sledu krátkých zpráv. **Tohle NENÍ
otevřená otázka, je to zadání k implementaci.**

### 3a. Cílový model: „Window-first" — graf i log jsou OKNA, ne speciální screeny

Uživatelovy zprávy (doslovně, v pořadí, jak přišly):

1. „rovnou to udělej tak, že refaktor bude: okno s grafem / graf může být připojen k vybrané
   screeně / knihovna umožní vytvořit screen nebo víc screenů"
2. „žádný speciální screen s logem nemusí existovat, ale existuje okno s funkcionalitou log"
3. „při aktivaci okna – v programu bude focus na okna nejen hover, ale klikem na okně – se
   options změní podle toho, co definuje okno"
4. „v případě log okna to jsou options úrovně zobrazení logu"
5. „jde vlastně o stejnou funkcionalitu, jako má macOS – aktivní aplikace otvírá svoje menu na
   hlavní liště"
6. „důraz kladen na refaktor pro srozumitelnost, DRY"
7. „bitmapy pro okna si vezmi z obrázků přidaných do repa"
8. „při vytvoření screeny uživatel zadá jméno screeny. Dostane id." (potvrzuje SOUČASNÉ API,
   `vb.Screen(title=...)` → `.id` auto-přidělené, beze změny)
9. „po obdržení id teprve lepí okna na screen podle id" (potvrzuje pořadí: screen nejdřív,
   pak se k němu podle jeho `.id` připojují okna – graf i log)

**Syntéza do konkrétního zadání:**

- **ZRUŠIT „Screen 0 = speciální log screen".** Smaž `LOG_SCREEN_ID`/`ensureLogScreen()`
  koncept ze `ScreenManager`u. Log není screen, je to OKNO s log funkcionalitou (append,
  Options = filtr úrovně).
- **Graf je taky okno** („okno s grafem"), ne screen vyplněný na celou plochu. `Canvas(screen=
  screen_a)` (pythonovské API) zůstává stejné – graf se pořád "připojuje k vybrané screeně" –
  ale na FRONTENDU se teď renderuje DOVNITŘ okna na tom screenu, ne přes celý kontejner
  screenu.
- **Screen = prázdný desktop/kontejner**, co hostí N oken (graf, log, control, terminal,
  detail…). Uživatel v Pythonu vytvoří `Screen`, dostane `.id`, a POTOM k němu (podle `.id`)
  připojuje okna – `Canvas(screen=...)` je první/hlavní příklad takového okna (graf), ale
  koncepčně by log/control/terminal okna měla jít stejnou cestou (i když log dnes nemá žádné
  Python API pro "otevři na screenu X" – ověř/navrhni, jestli má vzniknout, nebo log zůstává
  auto-globální/per-screen bez explicitního Python volání).
- **Aktivní okno řídí Options na screen baru** (macOS menu bar model, uživatel to explicitně
  přirovnal: „aktivní aplikace otvírá svoje menu na hlavní liště"). Klik na okno (ne jen hover)
  ho aktivuje/fokusuje; `ScreenMenuBar`'s Options skupina se PŘEKRESLÍ podle toho, co right teď
  aktivní okno definuje:
  - Graf okno aktivní → Options = fyzika/2D-3D/edge-style (přesně to, co dnes dělá
    `screen_instance.js#renderOptionsGroup`, ale muselo by se to přesunout na
    "je tohle konkrétní okno aktivní" podmínku, ne "je tohle screen aktivní").
  - Log okno aktivní → Options = filtr úrovně logu (LOG_LEVELS checkboxy, už implementováno v
    `log_screen_instance.js`, jen se musí přesunout do log OKNA, ne log SCREENU).
  - Žádné okno aktivní (prázdný screen) → Options group prázdná/skrytá, nebo fallback?
    (needěláno, nutno navrhnout).
- **DRY / srozumitelnost** – explicitní požadavek uživatele. Návrh: společné rozhraní, co
  každý typ okna implementuje, např. `getOptionsGroup()` (vrátí `items` pole ve stejném tvaru,
  co dnes bere `ScreenMenuBar.setOptionsGroup`), volané `ScreenManager`em/`WindowManager`em při
  změně aktivního okna. Vyhni se kopírování `renderOptionsGroup`-stylu kódu do každého typu
  okna zvlášť – jedna sdílená cesta pro "tohle okno se stalo aktivním, přerenderuj Options".
- **Bitmapové gadgety z obrázků v repu** – `docs/images/workbench-ref/` už má vystřižené
  ikony (`icon-prefs-circle.png`, `icon-ramdisk.png`, `icon-trashcan.png`,
  `scrollbar-arrows.png`, `gadget-depth-left.png`, `gadget-right-pair.png` – zkontroluj celý
  adresář, možná jich je víc). Nahraď unicode glyfy (×/–/▢ v `base_window.js`, ▤ switch gadget
  v `manager.js`) skutečnými obrázky odsud. Řeš i mechaniku (`<img>`/CSS `background-image`
  na gadget tlačítkách místo `textContent`).

**Rozsah je srovnatelný s celou touhle fází dohromady – je to zadání, ne otázka, ale POŘÁD
velký kus práce.** Doporučený postup: navrhni napřed rozhraní (`getOptionsGroup()` apod.) a
přesný list souborů/tříd, co se mění, než se pustíš do plošné úpravy – hodně z toho se dotýká
`screen_instance.js`, `log_screen_instance.js` (možná úplně zaniká jako samostatný soubor),
`manager.js`, `screen_menu.js`, `windows.js`/`base_window.js`.

### 3b. Menší nedodělky zmíněné, ale nerozpracované
- **Zdroj logu (`LOG_SOURCES`) filtr chybí** — jen ÚROVEŇ (debug/info/warning/error) má
  checkboxy, `frontend/backend_api/backend_program/backend_user` ne. `defaultLogFilters()` už
  `sources` počítá, jen UI to nevystavuje.
- **Bitmapové ikony/gadgety** — pořád unicode glyfy (×/–/▢, ▤ pro switch gadget), reference
  ukazuje malé tmavé obdélníkové ikonky. Odloženo od začátku designu (§7 spec), pořád platí.
- **Prepend vs. append pro log řádky** — uživatel řekl „log se tiskne vždy do okna... na horní
  řádek a všechny řádky se posunou dolů... pokud je screen jen částečně zobrazen, je vždy vidět
  poslední log nahoře." **TOHLE JE FUNKČNÍ POŽADAVEK, CO NENÍ IMPLEMENTOVANÝ** — aktuální
  `log_screen_instance.js#append()` pořád dělá `container.appendChild(row)` (nové řádky DOLŮ),
  ne `container.prepend(row)` (nové řádky NAHORU). Souvisí s §3a (log jako okno) — řeš rovnou
  jako součást přesunu logu do okna, ne zvlášť.

---

## 4. Doporučené první kroky pro další instanci

1. **Dokonči rozdělané ověření SOUČASNÉHO stavu PŘED refaktorem** (bylo přerušeno handover
   požadavkem, ne bugem — chceš vědět, že to, na čem stavíš, je funkční základ):
   - `log_screen_check.js` styl skriptu — potvrď, že log řádky se objevují, timestamp je vidět,
     level checkboxy filtrují správně (vypni "debug", ověř, že heartbeat zmizí z NOVÝCH řádků).
   - `window_style_check.js` styl skriptu — oprav test (nečekej na `canvas` "visible", spíš
     zkontroluj `data-screen-id` container `display` stav napřímo, nebo klikni po delším
     `waitForTimeout`), ověř `--vb-window-header-bg`/`--vb-window-body-bg` CSS proměnné a
     VIZUÁLNĚ screenshotem, že titulková lišta má opravdu pruhovaný vzor a tělo okna modré
     pozadí s bílým textem.
2. **Naplánuj §3a rozhraní PŘED plošnou úpravou** — konkrétně: jak vypadá `getOptionsGroup()`
   (nebo ekvivalent) na typu okna, kdo volá přerenderování Options při změně aktivního okna
   (`WindowManager`? `ScreenManager`? nový `ActiveWindowTracker`?), jak se aktivace okna
   propaguje (klik = `bringToFront()` už existuje v `base_window.js`, jen dnes nic neříká
   "tohle okno je teď aktivní" ven z třídy).
3. **Implementuj §3a po krocích, s živým ověřením po každém:**
   a. Log jako okno (menší, samostatně ověřitelný kus) – zahrnuje i prepend-pořadí (§3b).
   b. Graf jako okno – větší, dotýká se `Renderer`/`Picker`/`screen_instance.js` sizing.
   c. Aktivní-okno-řídí-Options (macOS menu bar model) – poslední, protože potřebuje OBA typy
      oken už fungovat jako okna, aby bylo na čem přepínat.
   d. Bitmapové gadgety z `docs/images/workbench-ref/`.
4. Po každé netriviální změně: `npx vitest run` + `python -m pytest python/tests -q` + `npm run
   build`, a ŽIVÉ ověření přes Playwright (ne jen jednotkové testy) — `ScreenManager`,
   `ScreenMenuBar`, `BaseWindow` jsou DOM-heavy třídy bez jednotkových testů (established
   konvence v týhle repo), ověřují se jen živě.
5. Pokud během implementace narazíš na NEJASNOST, co uživatelovy zprávy v §3a nepokrývají
   (např. přesné chování prázdného screenu bez aktivního okna) – zeptej se přímo, ne dohaduj.
   Zbytek zadání byl přesný a rychlý, další upřesnění pravděpodobně přijde stejně stručně.

---

*Za otázky/nejasnosti v tomhle dokumentu: celá konverzace, ze které vznikl, byla extrémně
rychlá – uživatel posílal krátké, husté opravy (často jednu větu, občas jen obrázek/URL) v
rychlém sledu, mnohdy dřív, než předchozí ověření doběhlo. Zápisy výše jsou syntézou, ne
doslovným přepisem – pokud něco nesedí s tím, co uživatel MYSLEL, zeptej se radši znovu, než
abys stavěl na špatném předpokladu.*

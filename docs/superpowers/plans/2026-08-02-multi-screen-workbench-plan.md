# Multi-screen Workbench — Implementation Plan

**Spec:** `docs/superpowers/specs/2026-08-02-multi-screen-workbench-design.md`
**Goal:** Amiga-style multi-screen model (`Screen` kontejner nad `Canvas`, limit 8 + rezervovaný log Screen 0), Options/`ScreenMenu` pull-down menu, `workbench` chrome téma, drag-reveal compositor. Python API se zúží na data grafu; zobrazovací volby (2D/3D, fyzika, čára/splajn) řídí výhradně divák v prohlížeči.

**Sequencing principle:** Návrh (§3 spec) říká „žádná zpětná kompatibilita, `screen=` je povinný" — to platí pro **koncový stav**, ne pro pořadí práce. Frontend dnes o screenech nic neví; udělat `screen=` povinným dřív, než existuje frontend, co ho umí vykreslit, by knihovnu rozbilo na několik commitů. Fáze 1–2 proto přidávají nové, samostatně testovatelné moduly (aditivně, nic nerozbíjí). Fáze 3 je **cutover** (Canvas vyžaduje screen, `dimensions=`/`set_edge_style` mizí, `examples/*.py` se přepíšou) — dělá se až frontend fázi 4 zvládá vykreslit, jinak `python examples/*.py` přestane fungovat vizuálně.

---

## Fáze 1 — Backend: `Screen` + log subsystém (aditivní, nic nemění na `Canvas`)

- [x] `python/viewbase/screen.py` — `Screen` třída: auto-přidělené `id` (proces-wide čítač od 1), `title`/`theme`/`quality`, validace limitu 8 (`ValueError` na 9.), `id=0` natrvalo rezervované (konstanta `LOG_SCREEN_ID = 0`, nikdy se nepřidělí uživatelské instanci).
- [x] `python/viewbase/log.py` — `LOG_LEVELS` (`debug`/`info`/`warning`/`error`), `LOG_SOURCES` (`frontend`/`backend_api`/`backend_program`/`backend_user`), `COMPONENTS` (`graph`/`gui`/`windows`/`rest`/`server` — §4a čtyřdílné rozdělení), `LogRecord` (`level`/`source`/`message`/`component`), `LogBus.publish` vyžaduje `component` u interních zdrojů (`backend_api`/`backend_program` – bez něj `ValueError`, „z logu musí jít poznat komponenta"), `vb.log(message, level="info")` zapisující se `source="backend_user"` (component `None`, uživatelský kód není jeden z modulů) do procesního log busu (pub/sub, bez perzistence, „čistý live tail" z §3a).
- [x] Testy: `python/tests/test_screen.py`, `python/tests/test_log.py` (169 testů celkem, vše zelené).
- [x] Export v `python/viewbase/__init__.py`: `Screen`, `log`.
- [x] `python -m pytest python/tests -q` zelené (nic stávajícího se nerozbilo).
- [x] README aktualizován (sekce „🚧 Ve vývoji", odkaz na design/plán, „Stav").

## Fáze 2 — Backend: protokol + Canvas volitelně nese `screen` ✅

- [x] `protocol.py`: `log_message(record)`; `init_message`/`patch_message` dostaly nepovinný `screen_id` (default `None` = dnešní chování, jeden implicitní screen).
- [x] `canvas.py`: `Canvas(..., screen: Screen | None = None)` — **nepovinné**, zpětně kompatibilní; když je zadané, `canvas.screen_id` se použije v protokolových zprávách. Duck-typed (žádný cyklický import se `screen.py`, typ jen přes `TYPE_CHECKING`).
- [x] `server.py`: `create_app(*canvases)` přijímá jeden i víc `Canvas` instancí (routuje podle `screen_id`, `_resolve_canvas` řeší i legacy klienty bez `screen_id`), `/ws` posílá `init` pro každý canvas zvlášť. Screen 0 (log) nepotřebuje vlastní `Canvas` – server jen releuje `LogBus` (`_make_log_relay`, thread-safe přes `call_soon_threadsafe`) všem klientům jako zprávy `log`, vždy dostupné bez ohledu na to, kolik uživatelských screenů běží.
- [x] Interní hlášky (vadná/nečekaná zpráva klienta, chyba ve vysílací smyčce, nerozpoznatelný `screen_id`) publikují i na `log.bus` s `component="server"`, vedle stávajícího `logger.warning`/`logger.exception` (ten zůstal – užitečný i bez prohlížeče). `/api/event` loguje každý request jako `backend_api`/`component="rest"`, pretty-printed JSON.
- [x] `serve(*canvases, ...)` a `ServerHandle` přepsané na víc canvasů (zpětně kompatibilní – `serve(canvas)` funguje jako dřív).
- [x] Testy: `python/tests/test_multi_screen.py` (11 nových) + 2 stávající testy opravené (nová `screen_id` klíč v action zprávách). 180 testů celkem, vše zelené. Smoke-test `examples/prototype.py` (legacy single-canvas) ověřen živě (HTTP 200).

## Fáze 3 — Frontend: log panel + Options základ (částečně hotovo, bez multi-screen switcheru)

Rozsah oproti původnímu zadání zúžen — `ScreenManager`/N paralelních
`GraphStore`+`PhysicsWorker`+`Renderer` instancí (vizuální přepínač mezi
víc screeny) je samostatně velký kus práce, který navíc potřebuje
`workbench` chrome (Fáze 5) na to, aby vůbec dávalo smysl ho ukazovat
uživateli. Co se dá udělat bezpečně a hned užitečně bez toho čekání:

- [x] `frontend/src/core/connection.js` — `onLog` callback, routuje `type:
  "log"` zprávy (Fáze 2 je posílá, frontend je dosud tiše zahazoval).
- [x] `frontend/src/screens/log_panel.js` — čisté funkce: `defaultLogFilters`,
  `matchesFilters`, `filterRecords`, `formatLogLine`. Otestováno (7 testů).
- [x] Log okno (`examples/*.py` beze změny): `main.js` na první `log`
  zprávu otevře `TerminalWindow` („Log", `input:false`, dnešní
  append-only vzor) a připisuje naformátované řádky. **Chybí:**
  interaktivní checkboxy pro filtry (§3a Options pro Screen 0) — čisté
  funkce existují a jsou otestované, UI navazuje v dalším kroku.
- [x] `frontend/src/screens/options.js` — `slugTitle`/`optionsKey`/
  `loadOptions`/`saveOptions`, klíčováno podle `title` (§8a spec), s
  injektovatelným `storage` i `defaults` (seed z aktuálního
  `store.config.edge_style`, aby Options na prvním připojení nepřebily to,
  co poslal Python – viz `main.js`). Otestováno (10 testů).
- [x] `frontend/src/screens/options_window.js` — `OptionsWindow extends
  BaseWindow`, dvě položky v1: „Fyzika běží" (`PhysicsEngine.setPaused` →
  nová `pause`/`resume` zpráva do `worker.js`, tiknutí se přeskočí),
  „Křivkové hrany (splajn)" (`renderer.setEdgeStyle`, mechanismus už
  existoval z control-okna feature). **2D/3D přepínač vynechán** – design
  §8a ho sám označuje jako riziko (vyžaduje reinit `D3ForceEngine`), není
  součástí v1 wiringu.
- [x] `WindowManager.registerCustom(id, win)` — malé rozšíření pro okna
  vytvořená mimo `openFor`/`openControl`/`openTerminal` (OptionsWindow).
- [x] `frontend/src/screens/manager.js` (`ScreenManager`) + `screen_instance.js`
  — **dokončeno** (viz Fáze 3b níže, dodělané po Fázi 5).
- [x] `npx vitest run` 144/144 zelených (19 souborů), `npm run build` prochází
  (43 modulů). **Ověřeno živě v headless Chromiu** (Playwright,
  `examples/workbench_demo.py`): graf se vykreslí, okna „Options"/„Log" se
  otevřou, `vb.log()`/`@canvas.every()` heartbeat teče do Log okna živě,
  detail okno po kliku funguje, oba Options přepínače (fyzika, čára/splajn)
  reálně mění chování (viz screenshoty v konverzaci), nula console erroru.
- [x] **Nalezen a opraven bug při živém testu:** `BaseWindow`má v levém
  dolním rohu neviditelný (`opacity:0`, ale ne `pointer-events:none`)
  úchyt pro zvětšení okna (28px + 2px) — u krátkého okna jako `OptionsWindow`
  zakrýval poslední checkbox a blokoval klik. Opraveno přidáním
  `padding-bottom`/`padding-left` v `options_window.js`, ať obsah do zóny
  úchytu nezasahuje. Obecnější riziko (jakékoli budoucí krátké okno v tom
  rohu) zůstává – zaznamenáno pro `ScreenMenu`/další krátká okna ve Fázi 5.
- [x] Nalezena a opravena i kolize výchozích pozic: Options a Log (obě
  „vždy dostupná" okna) se otevíraly téměř na stejném místě (24px kaskáda
  nestačí) — teď mají explicitní výchozí pozice vedle sebe, pokud si je
  divák sám nepřesunul (`_loadPos()` respektováno).
- [x] `examples/workbench_demo.py` — nový příklad specificky pro tenhle
  subsystém (graf + `vb.log()` + `@canvas.every` heartbeat), přidán do
  README tabulky příkladů.

## Fáze 4 — Cutover: `screen=` povinný, staré API pryč, examples přepsané

- [ ] `Canvas(screen=...)` povinný, `dimensions=`/`set_edge_style` odstraněny.
- [ ] `examples/*.py` přepsané na nové API (`vb.Screen(...)` + `vb.Canvas(screen=...)`).
- [ ] README + `docs/superpowers/specs/2026-06-10-viewbase-library-design.md` (a jeho API sekce) aktualizované na nový tvar.
- [ ] Plná regrese: `pytest` + `vitest` + `npm run build` + manuální kontrola quickstart/showcase/terminal příkladů v prohlížeči.

## Fáze 5 — Vizuál: `workbench` téma, `ScreenMenu`, drag-reveal compositor (částečně hotovo)

- [x] `workbench` téma jako JSON (§7 spec) — `frontend/src/themes/workbench.json`,
  registrováno v `themes.js` jako `deepMerge(modern, workbenchChrome)`
  (merge se počítá při registraci, ne za běhu – `resolveTheme('workbench')`
  vrací hotový objekt stejně jako `modern`/`cyber`). `deepMerge`/
  `isPlainObject` vytažené do nového `themes/merge.js`, aby `themes.js`
  mohl importovat `manager.js`-ovskou logiku bez cyklické závislosti.
  `python/viewbase/canvas.py` — `"workbench"` přidáno do `BUILTIN_THEMES`
  (validace `Canvas(theme=...)`/`Screen(theme=...)` prochází).
  **Ověřeno živě** (Playwright): `--vb-window-header-bg` CSS proměnná i
  vzhled oken/pozadí se reálně změní, graf zůstává barevně `modern` (chrome
  only, přesně dle opravy v designu §7). 8 nových frontend testů + 2
  backend testy, `npm run build` prochází (45 modulů).
- [x] **Co je v JSONu jako data, ale ještě nemá spotřebitele** (zapsáno i
  v komentáři nad `export const workbench` v `themes.js`, ať to neztratíme):
  `screenBar` (screen bar UI neexistuje), `window.headerBgActive`/
  `headerFgActive` (chybí koncept aktivního/neaktivního okna – dnešní
  `BaseWindow` title bar barvu nepřepíná podle focusu), `backdropPattern`,
  `iconSet`, `font` (bitmapový font/ikony nejsou napojené). Bez fungujícího
  ScreenManageru (Fáze 3 dokončení) by aktivní/neaktivní rozlišení stejně
  nedávalo velký smysl (jeden viditelný screen = triviálně vždy aktivní).
- [ ] Bitmapové masky z `docs/images/workbench-ref/` → sprite assety /
  redraw — **nezapočato** (vyžaduje i změnu `BaseWindow` gadgetů z
  unicode glyphů ×/–/▢ na obrázkové ikony).
- [x] `ScreenMenu` (§8) — **dokončeno**, viz Fáze 7 níže. „Options" sdílející
  TÝŽ menu bar (§8a spec) zůstává **nedokončené** — Options je dál
  samostatné plovoucí okno (viz Fáze 3b), ne položka na liště vedle
  `ScreenMenu` skupin. Sjednocení je navazující krok (viz Fáze 7).
- [x] Compositor pro drag-reveal (§6) — **dokončeno ve Fázi 6**, jako CSS
  `clip-path` místo WebGL shaderu (viz poznámka v designu §6 i plánu).
- [ ] Systémové info na liště — živé metriky grafu (§7b) — **nezapočato**,
  vyžaduje screen bar DOM element, který zatím neexistuje (menu bar z Fáze 7
  je jen lišta skupin/dropdown, ne plnohodnotný screen bar s info textem).
- [ ] Aktivní/neaktivní rozlišení title baru (`headerBgActive`/
  `headerFgActive`) — **nezapočato**, drobné rozšíření `WindowManager`
  (sledovat "poslední aktivní okno", přepínat CSS třídu/proměnnou) – dává
  smysl řešit spolu s `ScreenManager`, ne izolovaně.

## Fáze 3b — `ScreenManager` (dokončeno, po Fázi 5)

Vizuální multi-screen přepínač, dodělaná chybějící část Fáze 3 — teď má na
co navazovat (workbench téma z Fáze 5 dokazuje, že dva screeny můžou mít
i různý vzhled).

- [x] `frontend/src/screens/screen_instance.js` — `createScreenInstance({
  container, screenId, connection })`: přesně dnešní `main.js#bootstrap()`
  pipeline (GraphStore, PhysicsEngine, Renderer, WindowManager, Options
  okno, picking/klávesnice, téma, quality watchdog, akce) přetažená 1:1 do
  factory funkce, parametrizovaná containerem a `screenId` – žádná
  behaviorální změna pro jediný (legacy) screen, jen zabalení. Options okno
  je teď **per screen** (dřív jediné globální) – přirozeně vyplynulo z
  toho, že žije uvnitř `container`, který se celý schová/ukáže s taby.
- [x] `frontend/src/screens/manager.js` — `ScreenManager`: `Map<screenId,
  instance>`, `ensure(screenId)` (lazy vytvoření), `bringToFront(screenId)`
  (klik na tab), plovoucí tab bar (viditelný až od 2. screenu). Drag-reveal
  compositor viz Fáze 6 níže (dodělaný v navazujícím kroku, ne shaderem).
- [x] `frontend/src/core/connection.js` — nový `resolveStore(screenId)`
  callback (nepovinný; bez něj beze změny chování jediného store).
  `_storeFor(screen_id)` routuje `init`/`patch` na správnou instanci.
  `onAction`/`main.js` routují přes `screenManager.routeAction(msg)`.
  Odchozí eventy (klik, hover, view_change, window submit) nesou
  `screen_id` z instance, co je poslala (`sendEvent` v `screen_instance.js`).
- [x] `python/viewbase/canvas.py` — beze změny (multi-canvas `screen_id`
  routing už hotový z Fáze 2, frontend teď konečně umí, co backend nabízel).
- [x] Testy: `frontend/tests/connection.test.js` +2 (`resolveStore` routing,
  legacy fallback bez něj) — 148 frontend testů celkem. `ScreenManager`/
  `ScreenInstance` samy jednotkově netestované (DOM+WebGL třídy, stejná
  konvence jako `ControlWindow`/`TerminalWindow` – ověřují se buildem a
  živě).
- [x] **Ověřeno živě** (Playwright, dva `Canvas` s vlastním `Screen`, jedno
  `theme="cyber"`, druhé `theme="workbench"`): tab bar se dvěma tlačítky,
  klik přepíná aktivní screen, každý má **vlastní** Options okno a vlastní
  detail okna (schovají se s neaktivním screenem), témata se drží nezávisle
  (cyber i workbench vedle sebe). Nula console erroru.
- [x] **Regrese ověřena živě**: jednoscreenové použití (bez `screen=`,
  `examples/workbench_demo.py`) — beze změny chování, žádný tab bar
  (schovaný do 2. screenu).
- [x] **Dva bugy nalezené a opravené při živém testu** (build+vitest je
  nezachytily, protože Renderer/WebGL se v jsdomu nekonstruuje):
  1. Nový screen kontejner se vytvářel rovnou `display:none` → `Renderer`
     uvnitř `createScreenInstance` změřil `container.clientWidth/Height`
     jako 0×0 (WebGL canvas natrvalo špatně nasetovaný, `setActive(true)`
     to nepřepočítává). Oprava: kontejner se měří **viditelný**, schová se
     (`setActive(false)`) až POTOM, pokud nemá být rovnou aktivní.
  2. Popisek tabu se vykresloval dřív, než pro daný screen doběhla `init`
     zpráva (`store.config.title` byl ještě prázdný → fallback `Screen N`
     místo skutečného titulku). Oprava: `ScreenManager` se přihlásí na
     `store`ův `init` event a při něm taby překreslí znovu.
- [x] **Zjištěná mezera v datech (ne bug, důsledek nedokončené Fáze 4):**
  popisek tabu čte `Canvas`ovo vlastní `title` (`store.config.title`), ne
  `Screen.title` – dokud Fáze 4 nesjednotí konfiguraci Screenu a Canvasu,
  musí se `title=` nastavit na OBOU (`vb.Screen(title=…)` i
  `vb.Canvas(screen=…, title=…)`), jinak tab ukáže defaultní „viewbase".

**Co v `ScreenManager` zůstávalo nehotové (i po Fázi 6 níže):**
`ScreenMenu`/sdílení menu baru s taby (§8/§8a) a odebírání screenu za běhu
(`remove`) — obojí dodělané ve Fázi 8. Vizuální styl tab baru podle
`workbench` tématu (dnes pevné barvy, nečte `theme.screenBar`) a přesné
umístění taby vs. `workbench.json` `screenBar` data (§7b živé metriky)
zůstávají nezapočaté.

## Fáze 6 — Drag-reveal (§6 designu, dokončeno — CSS clip-path místo WebGL shaderu)

**Technická odchylka od §6 specifikace, vědomá:** spec navrhuje
WebGLRenderTarget per screen + fullscreen mix shader (`step()` funkce podle
Y pozice). Implementováno místo toho jako **CSS `clip-path: inset()`** na
DOM kontejneru předního screenu. Proč je to stejná věrnost, ne zjednodušení:
`step()` je tvrdý přechod (buď/nebo podle Y), přesně to, co `clip-path`
taky dělá — žádný blend/smoothstep. Rozdíl je jen ve VRSTVĚ, kde se skládání
řeší (DOM/prohlížeč vs. GPU shader), ne ve výsledném vzhledu (ověřeno živě,
viz screenshoty v konverzaci — ostrá vodorovná hranice, přesně jako
originál). Cena: nejde (bez další práce) udělat měkký blend na hranici,
kdyby to byl někdy budoucí požadavek — to by vyžadovalo skutečný shader
pass a sdílený WebGL kontext napříč screeny (dnes má každý `ScreenInstance`
vlastní `THREE.WebGLRenderer`/canvas/GL kontext, což CSS přístup obchází
beze změny).

- [x] `frontend/src/screens/drag_reveal.js` — čisté funkce:
  `clampDragOffset`, `dragOffsetFromDelta` (px posun → 0..1 podle výšky
  kontejneru), `clipPathForOffset` (0..1 → CSS `inset()` string),
  `shouldCommitDrag` (práh 0.5), `swapFrontWithNext` (commit = prohození
  prvních dvou v z-stacku, zbytek beze změny). 13 testů.
- [x] `ScreenManager` rozšířen o `zOrder` (hloubkový stack, oddělený od
  `order` = pořadí tabů) a `dragOffset`. `_layout()` renderuje/zobrazuje jen
  **top-2** pozice v `zOrder` (přední + bezprostředně za ním) — hlubší jsou
  úplně schované (`setActive(false)`), přesně jako originál (jedna
  scanline = max 2 bitmapy, §9 designu). Přední dostává `clip-path` podle
  `dragOffset`, zadní žádný (prosvítá skrz mezeru v předním).
- [x] Tažítko (`[data-role="vb-drag-handle"]`) — tenký pruh nahoře přes
  celou šířku (placeholder za budoucí plnohodnotný screen bar z §7b/Fáze 5,
  jasně okomentováno jako dočasné), `pointerdown`/`move`/`up` s pointer
  capture. Tažení živě (per-frame) mění clip předního screenu; puštění pod
  půlkou = snap zpět na 0, nad půlkou = commit (`swapFrontWithNext`).
- [x] Klik na tab (`bringToFront`) teď manipuluje týmž `zOrder`, ne
  samostatným `activeId` polem — `activeId` je getter (`zOrder[0]`), jedna
  pravda pro "kdo je vpředu", žádná duplicitní synchronizace.
- [x] **Ověřeno živě** (Playwright, dva Canvasy jako ve Fázi 3b): tah myší
  za tažítko o 200px → nahoře se objeví `workbench` (Infra) přesně na
  hranici tahu, dole zůstává `cyber` (Sit) — ostrá vodorovná čára, přesně
  Amiga vzhled. Puštění pod polovinou → snap zpět na plný `cyber`. Tah přes
  polovinu + puštění → commit, `workbench`/Infra teď plní celou obrazovku
  a jeho tab je zvýrazněný jako aktivní; graf uvnitř je opravdu jiná data
  (žluté `db` uzly), ne jen barevná záměna. Nula console erroru.
- [x] Regrese: jednoscreenové použití (`examples/workbench_demo.py`) beze
  změny — tažítko/tab bar se objeví až od 2. screenu, stejně jako dřív.
  181 backend testů beze změny, 161 frontend testů (13 nových), `npm run
  build` prochází (48 modulů).

## Fáze 7 — `ScreenMenu` (§8 designu, dokončeno)

Autorsky definované pull-down menu (na rozdíl od vestavěného Options,
§8a, které existuje vždy samo a je čistě klientské) — vývojář ho zakládá
a naplňuje v Pythonu, frontend jen vykresluje a posílá zpět, co bylo
vybráno.

- [x] `python/viewbase/menu.py` — `ScreenMenu`: `item(group, label,
  on_select=...)` (skupina se založí v pořadí prvního výskytu), `spec()`
  (kopie pro frontend/init), `dispatch(item_id, event)` (zavolá `on_select`
  matoucí položky, no-op pro neznámé id nebo položku bez callbacku). 8 testů.
- [x] `Canvas.pin_menu(menu)` — uloží menu do stavu (přežije reconnect,
  `snapshot()["menu"]`) a zařadí akci `open_menu`. Interní handler
  `_on_menu_select` (registrovaný na event `menu_select`) najde položku
  podle `item_id` a zavolá její `on_select` — stejný vzor jako
  `_on_window_submit`/`_on_terminal_input`. `protocol.init_message`/
  `patch_message` nesou `menu` klíč (`None`, pokud nic připnuté). 8 testů
  (Canvas integrace + WS init). `ScreenMenu` exportované z `viewbase/__init__.py`.
- [x] Frontend `frontend/src/screens/screen_menu.js` — `ScreenMenuBar`:
  vodorovná lišta skupin (placeholder pozice nahoře v kontejneru screenu —
  **není** to plnohodnotný screen bar z §7b, jen menu samo) + rozbalovací
  dropdown. **Interakce v1: klik-přepínací** (§8 spec — Amiga
  right-click-hold nemá rozumný ekvivalent na Macu, stejné zdůvodnění jako
  u `ScreenMenu`/Options interakce z dřívějška): klik na skupinu
  rozbalí, klik na tu samou skupinu nebo mimo menu zabalí. Vizuál podle
  reference (§2 designu): světle šedý dropdown, tvrdý černý okraj, aktivní
  skupina modré pozadí/bílý text.
  `GraphStore.applyInit` ukládá `msg.menu`; `screen_instance.js` má novou
  akci `open_menu` a menu se restauruje z `store.menu` na initu (přežije
  reconnect). 1 nový store test.
- [x] **Ověřeno živě** (Playwright): menu bar s „Graf"/„Zobrazení" se
  objeví, klik na skupinu otevře dropdown se správnými položkami, klik na
  položku pošle `menu_select`, zavolá se Python `on_select` (ověřeno přes
  `vb.log()` v handleru — vidět v Log okně), skutečně přidá uzel do grafu
  (detail okno nového uzlu otevřeno přes debug API) a skutečně přepne téma
  na `workbench` (vizuálně potvrzeno). Nula console erroru. Položka bez
  `on_select` (no-op) i klik mimo menu (zavření dropdownu) taky vyzkoušeny.
- [x] Regrese: jednoscreenové použití beze změny (menu bar se sám schová,
  když `store.menu` je `null` — žádný pinned menu = žádná lišta). 197
  backend testů (16 nových), 162 frontend testů (2 nové), `npm run build`
  prochází (49 modulů).

**Co zůstávalo nedokončené po Fázi 7 — vyřešeno ve Fázi 8 níže:** sjednocení
s Options do JEDNÉ lišty a kolize v layoutu mezi menu barem a tab
barem/tažítkem. Skutečný screen bar se systémovými metrikami (§7b) a
bitmapové ikony/font zůstávají nezapočaté (viz Fáze 5 výše).

## Fáze 8 — Vyřešení nedokončeného: explicitní Screen/Canvas lifecycle, sjednocení Options, dva reálné bugy

Uživatelský požadavek „nejdřív vyřeš nedokončené" cílil na čtyři konkrétní
architektonické mezery zjištěné při review Fází 1–7: `Screen` a `Canvas`
nebyly nezávislé atomické objekty (`pin_menu()` před vytvořením `Canvas`
nefungoval), adopce menu do canvasu byla implicitní, plně zakryté screeny
(3+ v hloubce z-orderu) nešetřily prostředky, a `Screen` neměl explicitní
`destroy()` životní cyklus.

- [x] `python/viewbase/screen.py` — `Screen` dostal vlastní frontu akcí
  (`self._actions`, `threading.Lock`) a `pin_menu(menu)` funguje NEZÁVISLE
  na tom, jestli `Canvas` už existuje: pokud ještě není adoptovaný, menu se
  jen uloží (`self._menu`) a `open_menu` akce se zařadí do fronty Screenu;
  pokud adoptovaný už je, akce jde rovnou do `Canvas`u. `drain_actions()`
  vyprázdní frontu (stejný vzor jako `Canvas.drain()`). `destroy()` je
  explicitní — zavolá `canvas.close()`, pokud je Canvas adoptovaný, jinak
  jen vyčistí vlastní frontu (Screen bez Canvasu nemá co zavírat).
- [x] `python/viewbase/canvas.py` — `_adopt_screen(screen)`: **explicitně
  pojmenovaná** metoda (ne skrytá magie v `__init__`), volaná na konci
  `Canvas.__init__`, když je `screen=` zadané. Převezme `screen._menu`
  (pokud tam nějaké čeká) a odvysílá `screen.drain_actions()` do vlastní
  fronty — menu připnuté před vytvořením Canvasu se tak dostane k divákovi
  přesně jednou, ne nula- nebo dvakrát. `Canvas.close()` rozšířen: pokud má
  `screen_id`, zařadí do fronty akci `{"action": "screen_remove",
  "screen_id": ...}` — frontend se tak dozví, že má screen (tab, kontejner,
  WebGL kontext) odstranit.
- [x] Testy: `test_screen.py`, `test_screen_menu_canvas.py` rozšířené o
  adopční scénáře (`pin_menu` před/po adopci, přesně-jednou doručení,
  `close()` s/bez `screen_id`).
- [x] **Frontend — plně zakryté screeny (3.+ v z-orderu) pozastavují
  vykreslování I fyziku**, ne jen vykreslování jako dřív. `ScreenManager
  _layout()` volá `setFullyHidden(hidden)` na každé instanci mimo top-2
  `zOrder` pozice. `screen_instance.js` kombinuje DVA nezávislé důvody
  pauzy přes OR (`userWantsPhysics` z Options checkboxu, `systemHidden` ze
  `ScreenManager`u) přes `syncPhysicsPaused()` — vypnutí fyziky v Options
  a zakrytí screenem jsou nezávislé přepínače, ani jeden nesmí tiše
  přepsat ten druhý. **Screen 0 (log) je z tohoto pravidla vyňatý** (log
  tok nesmí nikdy zamrznout, i když je log okno vizuálně schované) —
  log relay běží mimo `ScreenManager` instance, není to `ScreenInstance`,
  takže se ho `setFullyHidden` netýká strukturálně, ne jen podmínkou.
- [x] **Explicitní destroy životní cyklus** — `ScreenManager.remove(screenId)`:
  najde instanci, zavolá `instance.destroy()`, odebere ji z `instances`
  Map, `order` i `zOrder`, překreslí tab bar. `ScreenInstance.destroy()`
  nově uklízí VŠECHNY přidružené objekty: `PhysicsEngine.terminate()`
  (nová metoda — `worker.terminate()` + `store.subscribe` unsubscribe,
  dřív fyzika běžela na pozadí donekonečna i po smazání screenu),
  `Renderer.dispose()` (nová metoda — `setAnimationLoop(null)`, `resize`
  listener odregistrován přes uloženou referenci `this._onResizeBound`
  (dřív anonymní, neederegistrovatelná), geometrie/materiály/textury všech
  meshů, `composer`/`bloomPass`, `webgl.dispose()` a odebrání DOM canvasu),
  `menuBar.destroy()`, a nakonec `container.remove()`. `main.js` na
  `screen_remove` akci volá `screenManager.remove(msg.screen_id)`.
- [x] **Options sjednocené do STEJNÉ lišty jako `ScreenMenu`** (§8a spec —
  Options je vždy poslední skupina sdíleného menu baru, ne samostatné
  plovoucí okno). `screens/screen_menu.js#ScreenMenuBar` rozšířen o
  `setOptionsGroup(items)` — lokální skupina (`local: true`), na rozdíl od
  vzdálených `ScreenMenu` skupin se po kliku na položku dropdown NEZAVÍRÁ
  (checkbox chování, ne akce-a-zavři). Smazáno: `screens/options_window.js`
  (samostatné plovoucí okno), `WindowManager.registerCustom` (byl
  vytvořený jen pro `OptionsWindow`, jinde nepoužitý — mrtvý kód po
  smazání).
- [x] **Reálný bug #1 nalezený a opravený (broadcast smyčka zahazovala
  akce bez klientů, zombie screeny):** `server.py#_broadcast_step` drainoval
  `canvas.drain_actions()`/`canvas.drain()` na KAŽDÝ tik bez ohledu na to,
  jestli je někdo připojený, a zprávy zahazoval AŽ PAK (`if not messages or
  not clients: return` bylo za drainem, ne před ním). Důsledek: (a)
  jednorázová akce jako `screen_remove` zařazená do fronty, když nikdo
  neposlouchal, zmizela navždy — na rozdíl od grafových delt, které je
  bezpečné zahodit (`snapshot()` nový klient stejně dostane aktuální stav);
  (b) zavřené canvasy se NIKDY neodstranily z `canvases`/`canvases_by_screen`,
  takže nově připojený klient dostal `init` i pro už zavřený screen (zombie).
  Nalezeno syrovým WebSocket trace skriptem (`websocket-client`), potvrzeno
  živě v prohlížeči (screen B po `destroy()` beze změny na tab baru, dokud
  se nový klient nepřipojil — pak se objevil znovu jako duch). Opraveno
  přepsáním `_broadcast_step`/`_broadcast_loop`: po zpracování každého
  canvasu se zkontroluje `canvas._closed` a rovnou se odstraní z obou
  routovacích struktur (mutace na místě, vidí to okamžitě jak WS handshake
  kód, tak příští tik smyčky). Regresní testy:
  `test_canvas_closed_with_no_clients_is_removed_before_next_connect`,
  `test_canvas_closed_with_no_clients_screen_remove_not_lost_forever`
  (obě přes `monkeypatch.setattr(server_module, "PATCH_INTERVAL", 0.001)`
  pro deterministické časování bez `time.sleep()` hazardu).
- [x] **Reálný bug #2 nalezený a opravený (kolize menu baru s root
  chrome, podruhé):** po sjednocení Options do menu baru se ukázalo, že
  offset `topOffset` v `ScreenMenuBar` (dřív jen `DRAG_HANDLE_HEIGHT`)
  nestačí — tab bar (`ScreenManager`, root-level) ZAROVEŇ zabírá tu
  vertikální zónu, takže `<button data-role="vb-screen-tab">` blokoval
  kliky do menu baru pod ním (zjištěno Playwrightem: „element intercepts
  pointer events"). Opraveno zavedením `ROOT_CHROME_HEIGHT` (48px = tažítko
  + tab bar + okraje) v `drag_reveal.js` jako sdílené konstanty, kterou
  teď `ScreenMenuBar` i `ScreenManager._layout()` používají shodně — jedna
  pravda o výšce root chrome, ne dvě nezávisle laděná čísla.
- [x] **Ověřeno živě** (Playwright, REST-triggerovaný destroy kvůli
  přesnému časování — `time.sleep()`-based trigger byl nespolehlivý, viz
  níže): dva screeny A/B, menu připnuté na A PŘED vytvořením jeho Canvasu
  funguje po adopci (`Graf → Ahoj` handler zavolán), Options je vidět jako
  skupina na stejné liště jako `Graf` (`["Graf","Options"]`), nula
  samostatných plovoucích Options oken. REST trigger zavolá
  `screen_b.destroy()` → tab B zmizí, DOM kontejner screenu B má po
  destroy nulový počet, nula console errorů.
- [x] **Diagnostická poznámka k metodice:** časování destroy přes
  `time.sleep()` na pozadí threadu bylo nespolehlivé (reálný čas mezi
  tool-cally — spuštění serveru, čekání na curl, spuštění Playwrightu —
  se nedal predikovat, takže sleep buď proběhl moc brzo, nebo v
  netestovatelném okně). Nahrazeno REST-triggerovaným destroy
  (`canvas_a.on("destroy_b", ...)` zavolaný přes `fetch('/api/event', ...)`
  přesně v okamžiku, kdy to Playwright skript chce) — deterministické,
  žádný hazard s časem.
- [x] Regrese: `python -m pytest python/tests -q` → 208 testů zelených,
  `npx vitest run` → 162 testů zelených (20 souborů), `npm run build`
  prochází (48 modulů).

**Co zůstává nedokončené (nezměněno touto fází, jen potvrzeno):**
bitmapové ikony/font (§7 zbytek), skutečný screen bar s živými metrikami
(§7b), `ScreenMenu`/Options vizuální styl podle `theme.screenBar` (dnes
pevné barvy v JS), Fáze 4 cutover (`screen=` povinný, `dimensions=`/
`set_edge_style` pryč, `examples/*.py` přepsané), fyzická modularita
(rozdělení `canvas.py` na `graph.py`/`gui/`/`windows/`/`rest.py` — §4a
záměr, zatím ploché soubory).

## Fáze 9 — Živý průzkum reálného použití: Screen 0 do z-stacku, Guru Meditation, živé 2D/3D, layout bug

Uživatel spustil `examples/*.py` sám naživo (ne přes Playwright) a nahlásil
věci, co ve Fázi 8 review nezachytilo – navazuje přímo na „nejdřív vyřeš
nedokončené", jen tentokrát zdroj nálezů byl reálný prohlížeč uživatele,
ne moje vlastní testy.

- [x] **Screen 0 (log) je teď PRAVÝ člen z-stacku, ne floating okno.**
  Uživatel nahlásil: „táhnutí lišty dolů nefunguje – měl by za ní být
  screen logu", a design spec (§4 architektura) skutečně od začátku
  počítal s `ScreenInstance(0)` jako součástí compositor stacku – realita
  (`main.js` dřív zakládal log jako samostatné `WindowManager`/
  `TerminalWindow` NAD vším, mimo `ScreenManager`) se od návrhu odchýlila.
  Opraveno: nový `frontend/src/screens/log_screen_instance.js`
  (`createLogScreenInstance` – lehká instance bez GraphStore/Physics/
  Renderer, jen append-only konzole v kontejneru), `ScreenManager.
  ensureLogScreen()` ho lazy registruje do `instances`/`order`/`zOrder`
  (na první `log` WS zprávu, stejným sdíleným `_register()` jako grafové
  screeny – nový screen jde vždy VZADU, nekrade focus). `setFullyHidden()`
  je u něj záměrně no-op (log teče i schovaný, §3a/§11 bod 7). `main.js`
  zjednodušen – smazán celý `ensureLogWindow`/`logManager` kód.
  **Ověřeno živě** (Playwright, `log_demo.py`): tah za tažítko o 300px (pod
  50 % výšky) odkryje Log screen s živým heartbeat řádkem, ostrá hranice,
  puštění před polovinou snapne zpět (`Log demo` zůstane vpředu) – přesně
  Amiga chování. Nový tab „Log" nekradl focus při vzniku. Nula console
  errorů.
- [x] **Reálný layout bug (nalezen uživatelem, screenshot s červenou
  šipkou):** `ScreenMenuBar` měla natvrdo `topOffset = ROOT_CHROME_HEIGHT`
  (48px) i pro **jednoscreenové** aplikace (`showcase.py` a další příklady
  bez `screen=`), kde root chrome (tažítko + tab bar) vůbec NEVZNIKÁ (ten
  se zakládá až od 2. screenu) – lišta si tak rezervovala prázdný prostor
  nahoře pro chrome, co neexistuje. Opraveno: `ScreenMenuBar` teď defaultně
  sedí na `top:0`, novou metodou `setTopOffset(px)`; `ScreenManager.
  _register()` ji zavolá (na VŠECHNY instance, i tu novou) přesně v
  okamžiku, kdy chrome reálně vznikne (přechod z 1 na 2+ screeny), ne
  natvrdo od začátku. **Ověřeno živě**: `showcase.py` (1 screen, nikdy
  žádný tab bar) – menu bar teď `top: 0`, žádná mezera. `multiscreen.py`
  (2 screeny) – oba menu bary `top: 48`, chrome pořád klikatelný (regrese
  na dřívější kolizní bug ověřena, dropdown se otevře).
- [x] **Guru Meditation** – uživatelský požadavek na Amiga-style „systém
  spadl" obrazovku, škálovaný přes `AskUserQuestion` (spouštěče:
  neodchycená JS chyba, ztráta WS spojení/`protocol_mismatch`, backend log
  `level="error"`; věrná replika vzhledu; blokuje celý screen do kliknutí).
  Nové moduly: `core/guru_code.js` (čisté funkce – FNV-1a hash zprávy →
  `#AAAAAAAA.BBBBBBBB` kód, deterministický pro stejnou chybu; 7 testů),
  `core/guru_meditation.js` (DOM overlay). **Vizuál opraven podle
  uživatelovy reference** (screenshot skutečné Amiga obrazovky): NE bílý
  text na plné červené liště (první, míň přesný pokus), ale červený
  monospace text v červeně orámovaném boxu na černém pozadí – obě hlášky
  („Software Failure…" i „Guru Meditation #kód") pohromadě v jednom boxu,
  blikání přes CSS keyframes na celém boxu. `main.js`: `window.
  addEventListener('error'/'unhandledrejection', ...)`, `onStatus('close'
  /'protocol_mismatch')`, `onLog` s `record.level === 'error'` – všechny tři
  spouštěče vedou do stejného `guru.show(kind, message)`. Auto-dismiss JEN
  pro `connection_lost` důvod při úspěšném reconnectu (`onStatus('init')`)
  – JS/backend chybu musí odkliknout uživatel (žádný „je to spravené"
  signál pro tyhle dva, přesně jako originál). **Ověřeno živě** (Playwright,
  `log_demo.py`): všechny tři spouštěče vyvolají vizuál se správným kódem
  a detailem, klik zavře, `connection_lost` se sám zavře po `init`,
  `backend_error` PŘEŽIJE nesouvisející `init` (nezavře se omylem).
  Finální vzhled potvrzen uživatelem porovnáním se screenshotem reálné
  Amiga Guru Meditation obrazovky.
- [x] **Živé přepínání 2D/3D v Options** – design §8a to původně vynechal
  jako riziko („vyžaduje reinit D3ForceEngine"); uživatel chtěl přepínač
  reálně. Ukázalo se, že riziko bylo širší než jen fyzika:
  - `PhysicsCore.setDimensions()` – d3-force-3d peče dimenzionalitu do
    `forceSimulation()` při konstrukci, nejde jen přidat/odebrat `gz` sílu
    (charge/link by dál počítaly ve staré dimenzi) – celá `sim` se
    přestaví, uzly/hrany/pozice se zachovají (`forceSimulation(this.nodes,
    …)` je převezme), nové z (2D→3D) dostane náhodný rozptyl (jinak by
    symetrická odpudivá síla v ose Z nikdy nerozjela z=0 uzly). `.stop()`
    nutné i po přestavbě – jinak nová `sim` spustí vlastní d3-timer navíc
    k ručnímu tick() z workeru (dvojité tikání). 3 nové testy.
  - `worker.js`/`engine.js` – nová zpráva `set_dimensions`.
  - `Renderer._buildCamera`/`setDimensions()` – živá výměna
    Orthographic↔Perspective kamery + `OrbitControls.dispose()` (starý
    controls objekt jinak poslouchá na canvasu navždy vedle nového).
    **Reálný bug nalezený při review, opravený předem (ne live testem):**
    `EffectComposer`/`RenderPass` drží kameru za referenci a `_syncBloom`
    ho jinak přestaví jen při zapnutí/vypnutí bloomu – po výměně kamery by
    bloomované téma renderovalo navždy přes zahozenou kameru. Oprava:
    `setDimensions` composer i bloomPass zahodí, příští snímek ho
    `_syncBloom` postaví znovu, svázaný na novou kameru.
  - `KeyboardControls.setCameraControls()` – NOVÁ metoda místo
    reinstance: `keydown` listener na `window` nejde odregistrovat, druhá
    instance by ho přidala navíc natrvalo. `Picker` naopak reinstanci
    vůbec nepotřebuje – čte `renderer.camera` vždy živě přes
    `renderer.pick()`.
  - `screen_instance.js` – `ensureOptions`/`applyDimensions` (persistuje
    do `localStorage` přes `options.js`, zapisuje i do
    `store.config.dimensions` pro reconnect), třetí checkbox „3D pohled".
  - **Ověřeno živě** (Playwright, `showcase.py`, téma `cyber` s bloomem):
    3D→2D→3D round-trip, kamera se správně mění
    (`Perspective`↔`Orthographic`), `RenderPass` uvnitř composeru
    ukazuje po přestavbě na NOVOU kameru (cíleně forsírováno přes
    `bloomDisabled=false`, protože FPS watchdog bloom v headless Chromiu
    sám vypnul), klik na uzel po dvou přepnutích pořád funguje (Picker
    nerozbitý), nula console errorů.
- [x] Regrese: `python -m pytest python/tests -q` → 208 zelených, `npx
  vitest run` → 173 zelených (21 souborů, +11 nových), `npm run build`
  prochází (49 modulů).

---

*Zbytek Fáze 5 (bitmapové ikony/font, §7b metriky) a Fáze 4 (cutover) jsou
další práce – plánují se podrobněji (task-by-task, TDD) až budou na řadě,
po vzoru `docs/superpowers/plans/2026-06-17-control-okna.md`.*

# Kritická revize a refaktor: window manager jako jádro, schopnosti jako pluginy

**Zadání uživatele:** „kód byl původně psán pro směr zobrazení grafu – nyní zobrazení
grafu je jen jedna z jeho funkcí – proto hodně refaktoruj směrem k window manageru
a pro něj jsou pluginy různé schopnosti, jako jsou okna, graf…" + kritická revize
skladby modulů, čitelnost, DRY, refaktor dokumentace.

## 1. Kritická revize výchozího stavu (před refaktorem)

1. **Adresářová skladba lže o architektuře.** `render/` obsahovalo WebGL vykreslování
   grafu I celý okenní systém (`base_window`, `windows` = WindowManager + DetailWindow,
   `control_window`, `terminal_window`, `log_window`, `graph_window`). Okenní systém je
   přitom jádro aplikace; graf jen jedna schopnost. Kdo hledal „window manager", hledal
   ho v adresáři pojmenovaném po vykreslování grafu.
2. **`screens/screen_instance.js` byl god-object.** Jeden ~330řádkový closure skládal
   GraphStore, PhysicsEngine, Renderer, Picker, KeyboardControls, FpsWatchdog, metriky
   lišty, Options grafu, WindowManager i mapu VŠECH server akcí. Screen bez grafu nešel
   postavit — přesně proto dřív existoval paralelní `log_screen_instance.js`.
3. **Server akce centralizované v grafovém kódu.** Mapa `actions` míchala grafové akce
   (`focus`, `highlight`, `flow`, `set_edge_style`, `define_type`…) s okenními
   (`open_window`, `terminal_append`) a menu (`open_menu`). Nová schopnost = zásah do
   cizího souboru.
4. **WindowManager znal konkrétní typy oken.** `openFor`/`openControl`/`openTerminal`/
   `openLog`/`openGraph` — přidání typu okna vyžadovalo editovat manager (porušení
   open/closed). Navíc držel `store` a `getTheme` jen kvůli detailním oknům.
5. **Pointer-drag chování opsané 3×** (tažení okna za lištu, resize za roh, drag-reveal
   lišty screenu) — pojistky proti „sticky" oknům (ztracený pointerup, `buttons === 0`
   guard, `lostpointercapture`) se musely dopisovat na každé místo zvlášť; přesně tak
   sticky bug vznikl (lišta je měla, okna ne).
6. **Matoucí názvy.** Tři soubory `manager.js` (screens, themes + třída WindowManager ve
   `windows.js`); `screen_menu.js` byla ve skutečnosti celá lišta screenu (titulek,
   metriky, gadgety, drag povrch), ne jen menu.
7. **Pozůstatky log screenu.** `log_panel.js` ležel ve `screens/`, ale používalo ho
   okno v `render/`. `options.js` pojmenované podle screenu, ač jde o obecnou
   perzistenci divákových voleb.
8. **Duplicitní konstanty.** Výška screen baru ve dvou souborech
   (`SCREEN_BAR_HEIGHT` v drag_reveal, `SCREEN_BAR_H` v base_window).

## 2. Cílová architektura

**Jádro = window manager. Schopnost = plugin: typ okna + jeho Options + jeho server
akce.** Graf je od teď jen jeden z pluginů.

```
frontend/src/
  main.js        bootstrap: Connection + ScreenManager
  core/          transport a chyby: connection, store (model grafu na drátě), status,
                 guru_meditation (+guru_code)
  wm/            JÁDRO – okenní systém a screeny
    drag.js            sdílené pointer-drag chování; JEDINÉ místo s pojistkami
                       proti sticky tažení (buttons===0, lostpointercapture)
    base_window.js     chrome okna: rám, lišta, bitmapové gadgety, drag/resize,
                       minimalizace do doku, maximalizace dvojklikem, perzistence
    window_manager.js  registr typů oken (registerType/open), z-order, dok,
                       zdroj Options (aktivní okno -> lišta)
    screen_bar.js      lišta screenu: Options + ScreenMenu skupiny, titulek,
                       živé metriky, gadgety, drag-reveal povrch
    screen_manager.js  z-stack screenů, drag-reveal wiring, routing log záznamů
    drag_reveal.js     čisté funkce drag-revealu (offsety, transform, swap)
    desktop.js         jeden screen = desktop: kontejner + lišta + WindowManager
                       + instalace pluginů + routing akcí NA pluginy
    options_store.js   perzistence divákových voleb (localStorage, per titul)
  plugins/       SCHOPNOSTI
    graph/index.js     graf: pipeline (PhysicsEngine, Renderer, Picker, Keyboard,
                       FpsWatchdog, metriky), Options (fyzika/splajn/2D-3D),
                       akce focus/highlight/flow/stop_flow/set_theme/
                       set_edge_style/define_type, hospodaření se zdroji
    graph/window.js    okno hostující WebGL canvas (lícování na pixel)
    log.js             log okno (AmigaShell: tail -f, bez close) + čisté funkce
                       filtrování/formátování + Options (úrovně, zdroje)
    detail.js          detailní okno uzlu + buildRows/windowsToRefresh + akce
                       show_detail + reakce na patch (refresh/close)
    control.js         formulářové okno (clampValue/readValues) + akce
                       open_window/close_window
    terminal.js        konzolové okno + akce terminal_append
  render/        WebGL vykreslování grafu (interní knihovna graph pluginu):
                 renderer, labels, flow, edges, style, quality
  physics/       fyzikální simulace (interní knihovna graph pluginu)
  interact/      picking, keyboard, highlight, throttle (interní knihovna
                 graph pluginu; throttle používá i control plugin)
  themes/        témata, CSS proměnné (aplikované na kontejner screenu)
  assets/        binární bitmapy gadgetů (CSS masky)
```

### Kontrakty

**Plugin** (instaluje ho `desktop.js`, jeden objekt na desktop):

```js
{
  name,                       // pro čitelnost/ladění
  actions?: { akce: fn },     // server akce, které plugin obsluhuje
  optionsFallback?: () => items|null,  // Options, když žádné okno není zdrojem (graf)
  onInit?: () => void,        // po store 'init' (graf přestavuje scénu, otvírá okna)
  setVisible?: (v) => void,   // screen v top-2 / schovaný (render smyčka)
  setResourcesPaused?: (p) => void,  // screen mimo top-2 (fyzika)
  destroy?: () => void,
}
```

**Typ okna:** plugin volá `windowManager.registerType(kind, factory)`;
`windowManager.open(kind, spec)` deleguje na factory. Sémantiku „nahraď okno se
stejným id" / „fokusni existující" si řeší factory (různé typy ji mají různou).

**Options aktivního okna:** beze změny – `BaseWindow.getOptionsItems()` +
`WindowManager._setActive`/`refreshOptions`; fallback řeší desktop přes
`plugin.optionsFallback` (dnes jen graf).

**Model (`GraphStore`)** vzniká v desktopu (Connection do něj lije init/patch přes
`resolveStore(screenId)`), pluginům se předává v ctx — vlastníkem obsahu je graf,
ale detail okna z něj čtou konfiguraci a uzly.

### Chování změněné při tomto kole (požadavky uživatele)

- Dropdown Options se zavírá HNED po volbě položky (i checkbox) – dřív zůstával
  otevřený pro vícenásobné přepínání a zavíral se až klikem mimo.

## 3. Co se vědomě NEmění

- `core/store.js` zůstává v core: je to protokolový model (Connection na něj sahá
  dřív, než existují pluginy), ne vnitřnost grafu.
- `render/`, `physics/`, `interact/` zůstávají jako knihovny — jsou to detaily
  implementace graf pluginu, ne samostatné schopnosti; jejich přesun by byl churn
  bez přínosu pro čitelnost.
- Python strana beze změny (server je already schopnost-agnostický: multiplexuje
  canvasy podle screen_id a releuje LogBus).
- DOM-heavy třídy se dál testují živě (Playwright), čisté funkce jednotkově —
  založená konvence repa.

## 4. Mapa přesunů (pro archeologii git history)

| Původně | Nově |
|---|---|
| `render/base_window.js` | `wm/base_window.js` (drag přes `wm/drag.js`) |
| `render/windows.js` (WindowManager) | `wm/window_manager.js` (registr typů) |
| `render/windows.js` (DetailWindow, buildRows, windowsToRefresh) | `plugins/detail.js` |
| `render/control_window.js` | `plugins/control.js` |
| `render/terminal_window.js` | `plugins/terminal.js` |
| `render/log_window.js` + `screens/log_panel.js` | `plugins/log.js` |
| `render/graph_window.js` | `plugins/graph/window.js` |
| `screens/screen_instance.js` (pipeline grafu) | `plugins/graph/index.js` |
| `screens/screen_instance.js` (skořápka screenu) | `wm/desktop.js` |
| `screens/screen_menu.js` | `wm/screen_bar.js` |
| `screens/manager.js` | `wm/screen_manager.js` |
| `screens/drag_reveal.js` | `wm/drag_reveal.js` |
| `screens/options.js` | `wm/options_store.js` |

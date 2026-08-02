/** Jedna screen pipeline: GraphStore + PhysicsEngine + Renderer +
 *  WindowManager + menu bar (ScreenMenu §8 + vestavěné Options §8a), nad
 *  vlastním DOM kontejnerem. Přesně to, co dřív dělal main.js#bootstrap()
 *  pro jediný (implicitní) screen – teď parametrizované `screenId`/
 *  `container`, aby jich ScreenManager (manager.js) mohl držet víc najednou.
 *  Log je obyčejné OKNO na screenu (`render/log_window.js`, window-first
 *  model §3a handoveru) – otevírá ho `ScreenManager.appendLog`, žádný
 *  speciální log screen neexistuje. */
import { GraphStore } from '../core/store.js';
import { WindowManager } from '../render/windows.js';
import { neighborhood } from '../interact/highlight.js';
import { KeyboardControls } from '../interact/keyboard.js';
import { Picker, buildEvent } from '../interact/picking.js';
import { throttle } from '../interact/throttle.js';
import { PhysicsEngine } from '../physics/engine.js';
import { FpsWatchdog } from '../render/quality.js';
import { Renderer } from '../render/renderer.js';
import { applyCssVars, resolveTheme } from '../themes/manager.js';
import { loadOptions, saveOptions } from './options.js';
import { ScreenMenuBar } from './screen_menu.js';

export function createScreenInstance({ container, screenId, connection }) {
  const store = new GraphStore();
  const engine = new PhysicsEngine(store);
  let activeTheme = null;            // poslední rozpuštěné téma (pro WindowManager)
  let graphOptionsItems = null;      // Options grafu (optionsProvider graf. okna)
  let renderer = null;               // přiřazen níže; onResize closure ho čte líně
  const windowManager = new WindowManager(container, store, () => activeTheme,
    // Aktivní okno řídí Options na screen baru (macOS menu bar model, §3a
    // handoveru). Dokud žádné okno není aktivní (start před initem), je
    // zdrojem null → fallback na Options grafu (základní „aplikace"
    // screenu); null i tam (před initem) skupinu schová úplně.
    (items) => menuBar.setOptionsGroup(items ?? graphOptionsItems));

  // Graf je OKNO na screenu (window-first model §3a handoveru), ne výplň
  // celého kontejneru – kontejner je prázdný desktop (pozadí dle tématu,
  // viz applyTheme). Musí vzniknout PŘED Rendererem: ten čte rozměry
  // z graphWindow.body synchronně v konstruktoru.
  const graphWindow = windowManager.openGraph({
    screenId,
    optionsProvider: () => graphOptionsItems,
    onResize: () => renderer?.resize(),
  });

  /** Každá odchozí zpráva tohohle screenu nese jeho screen_id (§5 designu –
   *  server multiplexuje jeden WS podle screen_id; legacy/výchozí screen
   *  má screenId `null`, stejně jako dnes posílá backend). */
  const sendEvent = (message) => connection.send({ ...message, screen_id: screenId });

  // Menu bar (§8 + §8a designu): jedna lišta, dva druhy skupin – vzdálené
  // ze ScreenMenu (Python, pin_menu) a vestavěná Options (vždy poslední,
  // klientská, existuje bez ohledu na to, co Python poslal).
  const menuBar = new ScreenMenuBar({ container, sendEvent });

  // Fyzika se pauzuje ze dvou NEZÁVISLÝCH důvodů, které se kombinují (OR):
  // 1) divák to sám vypnul v Options (§8a, persistuje se),
  // 2) screen je úplně zakrytý (3.+ pozice v z-stacku ScreenManageru) –
  //    zdroje jdou na screen vepředu, viz §9 designu. Screen 0 (log) sem
  //    nepatří vůbec – log teče pořád, nemá vlastní ScreenInstance/fyziku.
  let userWantsPhysics = true;
  let systemHidden = false;
  function syncPhysicsPaused() {
    engine.setPaused(systemHidden || !userWantsPhysics);
  }

  // Options (§8a designu): view-only volby diváka, per screen – klientský
  // stav bez Python autorství, existuje vždy jako poslední skupina menu
  // baru, ne jen když ho backend pošle.
  function ensureOptions(title) {
    // Seed defaultů z AKTUÁLNÍHO server-řízeného edge_style/dimensions – na
    // úplně prvním připojení (bez uložených Options) tak divákova volba
    // nepřebije to, co Python právě poslal; jakmile jednou uloží vlastní
    // volbu, ta vítězí (i napříč reconnecty, viz applyDimensions níže).
    const liveDefaults = {
      physicsRunning: true,
      edgeStyle: store.config.edge_style?.style ?? 'line',
      edgeElasticity: store.config.edge_style?.elasticity ?? 0.3,
      dimensions: store.config.dimensions ?? 3,
    };
    const options = loadOptions(title, undefined, liveDefaults);
    userWantsPhysics = options.physicsRunning;
    syncPhysicsPaused();
    renderer.setEdgeStyle({ style: options.edgeStyle,
      elasticity: options.edgeElasticity });
    applyDimensions(options.dimensions);
    renderOptionsGroup(title, options);
  }

  /** Options „2D/3D": renderer (kamera/controls) i physics worker (celá
   *  simulace, viz PhysicsCore.setDimensions) se přestaví spolu. Zapíše se
   *  i do `store.config.dimensions`, ať reconnect pošle workeru rovnou
   *  správnou dimenzi (stejný vzor jako `set_theme` akce). */
  function applyDimensions(dimensions) {
    renderer.setDimensions(dimensions);
    engine.setDimensions(dimensions);
    store.config.dimensions = dimensions;
  }

  function renderOptionsGroup(title, options) {
    graphOptionsItems = [
      {
        key: 'physics-running', label: 'Fyzika běží',
        checked: options.physicsRunning,
        onToggle: (checked) => {
          options.physicsRunning = checked;
          userWantsPhysics = checked;
          syncPhysicsPaused();
          saveOptions(title, options);
          renderOptionsGroup(title, options);
        },
      },
      {
        key: 'edge-spline', label: 'Křivkové hrany (splajn)',
        checked: options.edgeStyle === 'spline',
        onToggle: (checked) => {
          options.edgeStyle = checked ? 'spline' : 'line';
          renderer.setEdgeStyle({ style: options.edgeStyle,
            elasticity: options.edgeElasticity });
          saveOptions(title, options);
          renderOptionsGroup(title, options);
        },
      },
      {
        key: 'dimensions-3d', label: '3D pohled',
        checked: options.dimensions === 3,
        onToggle: (checked) => {
          options.dimensions = checked ? 3 : 2;
          applyDimensions(options.dimensions);
          saveOptions(title, options);
          renderOptionsGroup(title, options);
        },
      },
    ];
    // refreshOptions respektuje aktivní okno s vlastními Options (např. log
    // okno) – graf mu rebuild svých položek nesmí přepsat skupinu pod rukama.
    windowManager.refreshOptions();
  }

  function applyHighlight(nodeId, depth) {
    const levels = depth ?? store.config.highlight_neighbors ?? 1;
    const ids = neighborhood(store, nodeId, levels);
    // Neznámý uzel = prázdná množina: radši nic nezvýraznit než ztlumit vše
    renderer.setHighlight(ids.size > 0 ? ids : null);
  }

  // Picker čte `renderer.camera` vždy živě (přes renderer.pick()), takže
  // canvas-vázané pointer listenery se stačí zaregistrovat JEDNOU – ani
  // živé přepnutí dimenzí (setDimensions) je nepotřebuje znovu. Picker
  // navíc dispose nemá, opakovaná registrace by kliky/hover posílala
  // vícenásobně. KeyboardControls naopak drží kameru/controls přímo,
  // proto se při každém volání jen aktualizuje (setCameraControls), ne
  // znovu vytváří (jeho `keydown` listener na window taky nejde odregistrovat).
  let keyboardControls = null;
  renderer = new Renderer(graphWindow.body, store, engine, {
    onCameraReady: () => {
      const is2d = renderer.camera.isOrthographicCamera;
      if (!keyboardControls) {
        new Picker(renderer.webgl.domElement,
          (x, y) => renderer.pick(x, y),
          sendEvent, {
            onNodeClick: (id) => {              // okamžitá lokální odezva
              const levels = store.config.highlight_neighbors ?? 1;
              if (levels > 0) applyHighlight(id, levels);
              renderer.focusOn(id);
              if (store.config.detail_window?.open_on_click) {
                windowManager.openFor(id);
              }
            },
            onBackgroundClick: () => {
              renderer.setHighlight(null);
            },
          });
        keyboardControls = new KeyboardControls(renderer.camera, renderer.controls, { is2d });
      } else {
        keyboardControls.setCameraControls(renderer.camera, renderer.controls, is2d);
      }
      const sendViewChange = throttle(() => {
        const state = renderer.viewState();
        if (state) sendEvent(buildEvent('view_change', state));
      }, 100);
      renderer.controls.addEventListener('change', sendViewChange);
    },
  });

  function applyTheme(nameOrDict) {
    const theme = resolveTheme(nameOrDict);
    activeTheme = theme;
    renderer.applyTheme(theme);
    // CSS proměnné na KONTEJNER screenu, ne na :root – custom properties
    // dědí, takže okna uvnitř je vidí, a dva screeny s různými tématy si
    // je nepřepisují navzájem (poslední init by jinak přebarvil všechna
    // okna všech screenů).
    applyCssVars(theme, container);
    windowManager.applyTheme();
    // desktop (kontejner screenu) – dřív ho celý zakrýval canvas grafu,
    // teď je graf okno a okolo je vidět pozadí screenu (§2 reference
    // workbench-desktop: plocha s okny, ne černá díra)
    container.style.background = theme.background ?? '#000';
  }

  const degrade = (step) => {
    if (step === 1) renderer.disableBloom();
    if (step === 2) renderer.setPixelRatio(1);
  };
  const watchdog = new FpsWatchdog(degrade);

  // Živé metriky na liště (§7b designu – "vedle názvu info o počtu objektů
  // a fps") – nezávislé na FpsWatchdogu (ten běží jen při quality=auto),
  // tenhle běží vždycky. Throttled na 500ms, ne každý snímek – DOM zápis
  // na každý frame by byl zbytečná práce navíc.
  let fpsAvg = null;
  function trackFps(dt) {
    if (dt <= 0) return;
    fpsAvg = fpsAvg === null ? 1 / dt : fpsAvg + (1 / dt - fpsAvg) * Math.min(1, dt * 2);
  }
  const updateMetrics = throttle(() => {
    const fps = fpsAvg === null ? '–' : Math.round(fpsAvg);
    menuBar.setMetrics(`${store.nodes.size} uzlů · ${fps} fps`);
  }, 500);

  store.subscribe((event) => {
    if (event.kind !== 'patch') return;
    windowManager.onPatch(event.patch);
  });

  store.subscribe((event) => {
    if (event.kind !== 'init') return;
    graphWindow.setTitle(store.config.title || 'Graf');
    renderer.flowController.replayInit(store.flows ?? []);
    applyTheme(store.config.theme);   // téma (i CSS proměnné oken) nastav dřív
    renderer.setEdgeStyle(store.config.edge_style ?? { style: 'line', elasticity: 0 });
    // Options (§8a) se aplikuje AŽ PO server-řízeném edge_style výše – jakmile
    // se divák jednou rozhodne (uloží se do localStorage), jeho volba na
    // reconnectu vítězí; při úplně prvním připojení bez uložené volby
    // ensureOptions jen zrcadlí to, co právě nastavil řádek nad ním.
    ensureOptions(store.config.title);
    menuBar.setSpec(store.menu);   // připnuté ScreenMenu přežívá reconnect (§8)
    for (const spec of store.windows ?? []) {
      if (spec.kind === 'terminal') windowManager.openTerminal(spec, submitTerminal);
      else windowManager.openControl(spec, submitWindow);
    }
    if (store.config.title) {
      document.title = `${store.config.title} – viewbase`;
    }
    const quality = store.config.quality ?? 'auto';
    if (quality === 'low') {
      degrade(1);                                  // hned a natrvalo
      degrade(2);
    }
    // watchdog (degradace kvality) běží jen při quality=auto; metriky na
    // liště (trackFps/updateMetrics) běží vždy, nezávisle na tom.
    renderer.onFrame = (dt) => {
      trackFps(dt);
      updateMetrics();
      if (quality === 'auto') watchdog.frame(dt);
    };
  });

  function submitWindow(payload) {
    sendEvent(buildEvent('window_submit', payload));
  }

  function submitTerminal(payload) {
    sendEvent(buildEvent('terminal_input', payload));
  }

  const actions = {
    show_detail: (msg) => windowManager.openFor(msg.node_id),
    focus: (msg) => renderer.focusOn(msg.node_id),
    highlight: (msg) => applyHighlight(msg.node_id, msg.depth),
    flow: (msg) => renderer.flowController.applyFlow(msg),
    stop_flow: (msg) => renderer.flowController.stopFlow(msg.flow_id),
    set_theme: (msg) => {
      store.config.theme = msg.theme;     // reconnect → init už ponese nové téma
      applyTheme(msg.theme);
    },
    open_window: (msg) => (msg.kind === 'terminal'
      ? windowManager.openTerminal(msg, submitTerminal)
      : windowManager.openControl(msg, submitWindow)),
    close_window: (msg) => windowManager.closeControl(msg.window_id),
    terminal_append: (msg) => windowManager.terminalAppend(msg.window_id, msg.text),
    set_edge_style: (msg) => renderer.setEdgeStyle(msg),
    define_type: (msg) => store.applyNodeType(msg.name, msg.style),
    open_menu: (msg) => {
      store.menu = { groups: msg.groups };
      menuBar.setSpec(store.menu);
    },
  };

  renderer.start();

  return {
    screenId,
    store,
    engine,
    renderer,
    windowManager,
    menuBar,
    container,
    handleAction(msg) {
      const handler = actions[msg.action];
      if (handler) handler(msg);
      else console.warn('viewbase: neznámá akce', msg.action);
    },
    /** Zakryté screeny běží dál naplno (fyzika i store) – jen se přestane
     *  vykreslovat (§9 designu: „Screeny hlouběji než pozice 2 v z-stacku
     *  se nemusí renderovat každý frame"). Volá ScreenManager – z-order/
     *  clip-path pro drag-reveal (§6) řeší on, tady je jen show/hide +
     *  pauza/běh render smyčky. */
    setActive(active) {
      container.style.display = active ? 'block' : 'none';
      if (active) renderer.start();
      else renderer.webgl.setAnimationLoop(null);
    },
    /** Screen úplně zakrytý (3.+ pozice v z-stacku, mimo top-2) – zdroje
     *  jdou na screen vepředu (uživatelovo upřesnění designu §9): fyzika se
     *  navíc pauzuje, nezávisle na divákově Options volbě (kombinují se OR
     *  přes syncPhysicsPaused). Netýká se Screen 0 (log) – ten
     *  ScreenInstance vůbec nemá. */
    setFullyHidden(hidden) {
      systemHidden = hidden;
      syncPhysicsPaused();
    },
    /** Screen zaniká (create/destroy jsou explicitní páry, viz
     *  ScreenManager.remove): ukonči fyzikální worker, uvolni WebGL/GPU
     *  zdroje rendereru, odregistruj menu bar listener a smaž DOM
     *  kontejner (smaže i všechna plovoucí okna uvnitř). Po zavolání je
     *  instance nepoužitelná. */
    destroy() {
      engine.terminate();
      renderer.dispose();
      menuBar.destroy();
      container.remove();
    },
  };
}

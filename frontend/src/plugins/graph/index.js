/** Graf plugin: ZOBRAZENÍ GRAFU JE JEDNA ZE SCHOPNOSTÍ, ne jádro aplikace
 *  (zadání uživatele: „kód byl původně psán pro směr zobrazení grafu –
 *  nyní zobrazení grafu je jen jedna z jeho funkcí"). Plugin vlastní
 *  celou grafovou pipeline: PhysicsEngine (worker), Renderer (WebGL do
 *  těla grafového okna), Picker + KeyboardControls, FpsWatchdog, živé
 *  metriky na liště – a přispívá desktopu svými server akcemi (focus/
 *  highlight/flow/…), Options (fyzika/splajn/2D-3D, perzistované přes
 *  wm/options_store) a typem okna 'graph'.
 *
 *  Model (`GraphStore`) dodává desktop (Connection do něj lije init/patch
 *  dřív, než pluginy vzniknou) – graf je vlastníkem jeho obsahu, detail
 *  plugin jeho čtenářem. */
import { neighborhood } from '../../interact/highlight.js';
import { KeyboardControls } from '../../interact/keyboard.js';
import { Picker, buildEvent } from '../../interact/picking.js';
import { throttle } from '../../interact/throttle.js';
import { PhysicsEngine } from '../../physics/engine.js';
import { FpsWatchdog } from '../../render/quality.js';
import { Renderer } from '../../render/renderer.js';
import { loadOptions, saveOptions } from '../../wm/options_store.js';
import { GraphWindow } from './window.js';

export function createGraphPlugin(ctx) {
  const {
    screenId, store, sendEvent, windowManager,
    setOptionsFallback, onThemeChange, applyTheme,
  } = ctx;

  const engine = new PhysicsEngine(store);
  let graphOptionsItems = null;   // postaví renderOptionsGroup po initu

  // Fyzika se pauzuje ze dvou NEZÁVISLÝCH důvodů, které se kombinují (OR):
  // 1) divák to sám vypnul v Options (§8a, persistuje se),
  // 2) screen je úplně zakrytý (3.+ pozice v z-stacku) – zdroje jdou na
  //    screen vepředu (§9 designu).
  let userWantsPhysics = true;
  let systemHidden = false;
  function syncPhysicsPaused() {
    engine.setPaused(systemHidden || !userWantsPhysics);
  }

  // Grafové okno musí vzniknout PŘED Rendererem (ten čte rozměry z
  // graphWindow.body synchronně v konstruktoru). Registruje se jako typ
  // 'graph', i když ho nikdo jiný neotevírá – jednotná cesta.
  let renderer = null;
  windowManager.registerType('graph', () => windowManager.adopt(new GraphWindow({
    screenId,
    container: ctx.container,
    manager: windowManager,
    optionsProvider: () => graphOptionsItems,
    onResize: () => renderer?.resize(),
  })));
  const graphWindow = windowManager.open('graph');
  setOptionsFallback(() => graphOptionsItems);

  function applyHighlight(nodeId, depth) {
    const levels = depth ?? store.config.highlight_neighbors ?? 1;
    const ids = neighborhood(store, nodeId, levels);
    // Neznámý uzel = prázdná množina: radši nic nezvýraznit než ztlumit vše
    renderer.setHighlight(ids.size > 0 ? ids : null);
  }

  // Picker čte `renderer.camera` vždy živě (přes renderer.pick()), takže
  // canvas-vázané pointer listenery se stačí zaregistrovat JEDNOU – ani
  // živé přepnutí dimenzí (setDimensions) je nepotřebuje znovu.
  // KeyboardControls drží kameru/controls přímo, proto se při každém
  // volání jen aktualizuje (setCameraControls), ne znovu vytváří.
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
                windowManager.open('detail', { nodeId: id });
              }
            },
            onBackgroundClick: () => {
              renderer.setHighlight(null);
            },
          });
        keyboardControls = new KeyboardControls(
          renderer.camera, renderer.controls, {
            is2d,
            // klávesy patří grafu jen když je jeho okno aktivní A jeho screen
            // je zrovna vidět (skryté screeny mají display:none → offsetParent
            // null); jinak by jeden stisk hýbal grafy na všech screenech
            hasFocus: () => windowManager.hasKeyboard(graphWindow)
              && graphWindow.body.offsetParent !== null,
            onCenter: () => renderer.centerOnGraph(),
          });
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
  onThemeChange((theme) => renderer.applyTheme(theme));

  /** Options „2D/3D": renderer (kamera/controls) i physics worker (celá
   *  simulace) se přestaví spolu. Zapíše se i do `store.config.dimensions`,
   *  ať reconnect pošle workeru rovnou správnou dimenzi. */
  function applyDimensions(dimensions) {
    renderer.setDimensions(dimensions);
    engine.setDimensions(dimensions);
    store.config.dimensions = dimensions;
  }

  function renderOptionsGroup(title, options) {
    graphOptionsItems = [
      {
        key: 'physics-running', label: 'Physics running',
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
        key: 'edge-spline', label: 'Curved edges (spline)',
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
        key: 'dimensions-3d', label: '3D view',
        checked: options.dimensions === 3,
        onToggle: (checked) => {
          options.dimensions = checked ? 3 : 2;
          applyDimensions(options.dimensions);
          saveOptions(title, options);
          renderOptionsGroup(title, options);
        },
      },
      {
        // Shluky (komunity) jako oddělené oblasti (koheze + odpuzování center
        // ve fyzice); vypnuto = volné „gravitační" rozložení jen pružinami a
        // odpuzováním – u hub-heavy grafů bez rovných plachet mezi oblastmi.
        key: 'clusters', label: 'Clusters (regions)',
        checked: options.clusters !== false,
        onToggle: (checked) => {
          options.clusters = checked;
          engine.setClusters(checked);
          saveOptions(title, options);
          renderOptionsGroup(title, options);
        },
      },
    ];
    // refreshOptions respektuje aktivní okno s vlastními Options (např. log
    // okno) – graf mu rebuild svých položek nesmí přepsat skupinu pod rukama.
    windowManager.refreshOptions();
  }

  /** Options (§8a designu): view-only volby diváka, per screen. Seed
   *  defaultů z AKTUÁLNÍHO server-řízeného edge_style/dimensions – na
   *  úplně prvním připojení (bez uložených Options) divákova volba
   *  nepřebije to, co Python právě poslal; jakmile jednou uloží vlastní
   *  volbu, ta vítězí (i napříč reconnecty). */
  function ensureOptions(title) {
    const liveDefaults = {
      physicsRunning: true,
      edgeStyle: store.config.edge_style?.style ?? 'line',
      edgeElasticity: store.config.edge_style?.elasticity ?? 0.3,
      dimensions: store.config.dimensions ?? 3,
      clusters: true,
    };
    const options = loadOptions(title, undefined, liveDefaults);
    userWantsPhysics = options.physicsRunning;
    syncPhysicsPaused();
    renderer.setEdgeStyle({ style: options.edgeStyle,
      elasticity: options.edgeElasticity });
    applyDimensions(options.dimensions);
    engine.setClusters(options.clusters !== false);
    renderOptionsGroup(title, options);
  }

  const degrade = (step) => {
    if (step === 1) renderer.disableBloom();
    if (step === 2) renderer.setPixelRatio(1);
  };
  const watchdog = new FpsWatchdog(degrade);

  // Živé informace o síti v LIŠTĚ GRAFOVÉHO OKNA (uživatelská oprava:
  // okno sítě nese typ sítě 2D/3D + počty uzlů, lišta screenu má jen
  // titulek). Nezávislé na FpsWatchdogu (ten běží jen při quality=auto).
  // Throttled na 500ms, ne každý snímek.
  let fpsAvg = null;
  function trackFps(dt) {
    if (dt <= 0) return;
    fpsAvg = fpsAvg === null ? 1 / dt : fpsAvg + (1 / dt - fpsAvg) * Math.min(1, dt * 2);
  }
  const updateMetrics = throttle(() => {
    const fps = fpsAvg === null ? '–' : Math.round(fpsAvg);
    const dims = (store.config.dimensions ?? 3) === 3 ? '3D' : '2D';
    graphWindow.setMetrics(`${dims} · ${store.nodes.size} uzlů · ${fps} fps`);
  }, 500);

  renderer.start();

  return {
    name: 'graph',

    /** Po `init` ze serveru (volá desktop po svém core zpracování – téma a
     *  CSS proměnné už jsou aplikované). */
    onInit() {
      renderer.ensureCamera();   // plugin mohl vzniknout až během initu
      graphWindow.setTitle(store.config.title || 'Graf');
      renderer.flowController.replayInit(store.flows ?? []);
      renderer.setEdgeStyle(store.config.edge_style ?? { style: 'line', elasticity: 0 });
      // Options (§8a) AŽ PO server-řízeném edge_style výše – divákova
      // uložená volba na reconnectu vítězí.
      ensureOptions(store.config.title);
      const quality = store.config.quality ?? 'auto';
      if (quality === 'low') {
        degrade(1);                                  // hned a natrvalo
        degrade(2);
      }
      // watchdog (degradace kvality) běží jen při quality=auto; metriky
      // na liště běží vždy, nezávisle na tom.
      renderer.onFrame = (dt) => {
        trackFps(dt);
        updateMetrics();
        if (quality === 'auto') watchdog.frame(dt);
      };
    },

    actions: {
      focus: (msg) => renderer.focusOn(msg.node_id),
      highlight: (msg) => applyHighlight(msg.node_id, msg.depth),
      flow: (msg) => renderer.flowController.applyFlow(msg),
      stop_flow: (msg) => renderer.flowController.stopFlow(msg.flow_id),
      set_theme: (msg) => {
        store.config.theme = msg.theme;     // reconnect → init už ponese nové téma
        applyTheme(msg.theme);
      },
      set_edge_style: (msg) => renderer.setEdgeStyle(msg),
      define_type: (msg) => store.applyNodeType(msg.name, msg.style),
    },

    /** Screen v top-2 → vykresluj; schovaný → zastav render smyčku
     *  (fyzika běží dál, řeší ji setResourcesPaused). */
    setVisible(active) {
      if (active) renderer.start();
      else renderer.webgl.setAnimationLoop(null);
    },

    /** Screen úplně zakrytý (3.+ pozice) – pauzni fyziku, nezávisle na
     *  divákově Options volbě (kombinují se OR přes syncPhysicsPaused). */
    setResourcesPaused(paused) {
      systemHidden = paused;
      syncPhysicsPaused();
    },

    /** Uvolni worker fyziky a WebGL/GPU zdroje – DOM boří desktop. */
    destroy() {
      engine.terminate();
      renderer.dispose();
    },
  };
}

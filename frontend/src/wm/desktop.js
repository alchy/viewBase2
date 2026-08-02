/** Desktop (WM jádro): jeden screen = prázdná plocha + lišta (ScreenBar) +
 *  WindowManager + nainstalované pluginy. Tohle je nástupce dřívějšího
 *  `screen_instance.js`, který byl god-objectem: skládal graf, fyziku,
 *  picker, okna i VŠECHNY server akce v jednom closure. Teď je desktop
 *  schopnost-agnostický – graf je jen jeden z pluginů (plugins/graph),
 *  stejné váhy jako log, detail, control nebo terminal.
 *
 *  Kontrakt pluginu (viz docs/superpowers/specs/2026-08-02-wm-plugin-
 *  architecture.md): { name, actions?, onInit?, setVisible?,
 *  setResourcesPaused?, destroy? }. Typy oken si pluginy registrují u
 *  WindowManageru samy (`registerType`), server akce dodají v `actions`.
 *
 *  Model (`GraphStore`) vzniká Tady – Connection do něj lije init/patch
 *  přes `resolveStore(screenId)` dřív, než se pluginy k čemukoli dostanou;
 *  vlastníkem obsahu je graf plugin, ale detail okna z něj čtou uzly a
 *  konfiguraci. */
import { GraphStore } from '../core/store.js';
import { createControlPlugin } from '../plugins/control.js';
import { createDetailPlugin } from '../plugins/detail.js';
import { createGraphPlugin } from '../plugins/graph/index.js';
import { LOG_WINDOW_ID, createLogPlugin } from '../plugins/log.js';
import { createTerminalPlugin } from '../plugins/terminal.js';
import { applyCssVars, resolveTheme } from '../themes/manager.js';
import { ScreenBar } from './screen_bar.js';
import { WindowManager } from './window_manager.js';

export function createDesktop({ container, screenId, connection }) {
  const store = new GraphStore();

  /** Každá odchozí zpráva tohohle screenu nese jeho screen_id (§5 designu –
   *  server multiplexuje jeden WS podle screen_id; legacy/výchozí screen
   *  má screenId `null`). */
  const sendEvent = (message) => connection.send({ ...message, screen_id: screenId });

  const bar = new ScreenBar({ container, sendEvent });

  // Options na liště řídí aktivní okno (macOS menu bar model). Fallback,
  // když žádné okno není zdrojem, dodává plugin (dnes graf – „základní
  // aplikace" screenu); null i tam = skupina schovaná (prázdný screen).
  let optionsFallback = () => null;
  const windowManager = new WindowManager(container,
    (items) => bar.setOptionsGroup(items ?? optionsFallback()));

  // Téma: desktop barví chrome (CSS proměnné NA KONTEJNER screenu – dva
  // screeny s různými tématy si okna nepřepisují – plus pozadí desktopu);
  // pluginy se přihlašují o notifikaci (graf přebarvuje WebGL scénu).
  let activeTheme = null;
  const themeListeners = [];
  function applyTheme(nameOrDict) {
    const theme = resolveTheme(nameOrDict);
    activeTheme = theme;
    applyCssVars(theme, container);
    windowManager.applyTheme();
    container.style.background = theme.background ?? '#000';
    for (const listener of themeListeners) listener(theme);
  }

  const ctx = {
    container, screenId, store, sendEvent, windowManager, bar,
    getTheme: () => activeTheme,
    onThemeChange: (listener) => themeListeners.push(listener),
    setOptionsFallback: (provider) => { optionsFallback = provider; },
    applyTheme,   // set_theme akce grafu mění téma celého screenu
  };

  const plugins = [
    createGraphPlugin(ctx),
    createLogPlugin(ctx),
    createDetailPlugin(ctx),
    createControlPlugin(ctx),
    createTerminalPlugin(ctx),
  ];

  // Akce jádra: okna z protokolu (open_window routuje podle `kind` přes
  // registr typů) a ScreenMenu. Všechno ostatní dodávají pluginy.
  const coreActions = {
    open_window: (msg) => windowManager.open(
      msg.kind === 'terminal' ? 'terminal' : 'control', msg),
    close_window: (msg) => windowManager.close(msg.window_id),
    open_menu: (msg) => {
      store.menu = { groups: msg.groups };
      bar.setSpec(store.menu);
    },
  };
  const actions = Object.assign({}, coreActions,
    ...plugins.map((plugin) => plugin.actions ?? {}));

  store.subscribe((event) => {
    if (event.kind !== 'init') return;
    applyTheme(store.config.theme);   // téma (i CSS proměnné oken) nastav dřív
    bar.setSpec(store.menu);          // připnuté ScreenMenu přežívá reconnect (§8)
    for (const spec of store.windows ?? []) {
      windowManager.open(spec.kind === 'terminal' ? 'terminal' : 'control', spec);
    }
    if (store.config.title) {
      document.title = `${store.config.title} – viewbase`;
    }
    for (const plugin of plugins) plugin.onInit?.();
  });

  return {
    screenId,
    container,
    store,
    bar,
    windowManager,

    handleAction(msg) {
      const handler = actions[msg.action];
      if (handler) handler(msg);
      else console.warn('viewbase: neznámá akce', msg.action);
    },

    /** Log okno je průřezová věc (ScreenManager routuje záznamy napříč
     *  screeny) – desktop mu dává pohodlný přístup bez znalosti registru. */
    openLog: () => windowManager.open('log'),
    logWindow: () => windowManager.get(LOG_WINDOW_ID),

    /** Screen v top-2 z-stacku → viditelný (render smyčky běží); hlouběji
     *  → schovaný. Z-order/transform řeší ScreenManager, tady jen
     *  show/hide + delegace pluginům (graf pauzuje vykreslování). */
    setActive(active) {
      container.style.display = active ? 'block' : 'none';
      for (const plugin of plugins) plugin.setVisible?.(active);
    },

    /** Screen úplně zakrytý (3.+ pozice) – zdroje jdou na screen vepředu:
     *  pluginy pauzují, co žere výkon (graf fyziku). */
    setFullyHidden(hidden) {
      for (const plugin of plugins) plugin.setResourcesPaused?.(hidden);
    },

    /** Screen zaniká (create/destroy jsou explicitní páry, viz
     *  ScreenManager.remove): pluginy uvolní zdroje (worker, WebGL), pak
     *  spadne lišta a celý kontejner (i s okny uvnitř). */
    destroy() {
      for (const plugin of plugins) plugin.destroy?.();
      bar.destroy();
      container.remove();
    },
  };
}

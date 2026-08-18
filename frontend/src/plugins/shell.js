/** Shell plugin (spec 2026-08-18): v okně běží SKUTEČNÝ shell na PTY –
 *  vykresluje ho xterm.js, takže fungují barvy, kurzor, Ctrl-C i
 *  celoobrazovkové programy (vim, htop, mc).
 *
 *  Zámek řeší JÁDRO WM, ne tenhle plugin: dokud je okno zamčené, server ho
 *  posílá jako prázdný rám `kind:"locked"` (wm/locked_window.js + zelená
 *  výzva core/unlock_prompt.js) a shell plugin ho vůbec nevidí. Sem dorazí
 *  až odemčené okno – to hned donačte xterm.js (DYNAMICKY, vlastní chunk
 *  ~84 kB gzip), přehraje scrollback z initu a od té chvíle chodí klávesy
 *  (shell_input) a výstup (akce shell_data) obousměrně.
 *
 *  Chrome (lišta, gadgety, rám se scrollbary, indikátor fokusu) dodává
 *  BaseWindow; xterm si vlastní scrollbar nekreslí (viewport přebíráme
 *  rámem okna, aby okno nemělo dva). */
import { BaseWindow } from '../wm/base_window.js';
// xterm.js leží ZDROJOVĚ v repu (src/vendor/xterm/, MIT) – žádná npm
// závislost, viz vendor/xterm/README.md. Načítá se dynamicky až s prvním
// shell oknem, takže kdo shell nepoužívá, chunk vůbec nestáhne.

const PX_PER_CH = 8;

const ANSI_NAMES = [
  'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white',
  'brightBlack', 'brightRed', 'brightGreen', 'brightYellow',
  'brightBlue', 'brightMagenta', 'brightCyan', 'brightWhite',
];

/** Paleta terminálu z proměnných tématu (themes/manager.js): pozadí = tělo
 *  okna, text a kurzor z lišty/klíčů, ANSI 0–15 z palety tématu. Terminál tak
 *  mluví barvami workbenche místo výchozích xtermových. Volá se při startu
 *  i po každé změně tématu. */
export function termTheme(el) {
  const cs = getComputedStyle(el);
  const v = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
  const fg = v('--vb-window-body-fg', '#d7f4ff');
  const theme = {
    background: v('--vb-term-bg', v('--vb-window-body-bg', '#101418')),
    foreground: fg,
    cursor: v('--vb-window-key', fg),
    cursorAccent: v('--vb-term-bg', '#000'),
    selectionBackground: v('--vb-frame-knob', '#8884'),
  };
  ANSI_NAMES.forEach((name, i) => {
    const color = cs.getPropertyValue(`--vb-term-ansi-${i}`).trim();
    if (color) theme[name] = color;
  });
  return theme;
}

/** Scroll „cíl" pro rám okna (wm/frame.js) nad terminálem. xterm 6 nemá
 *  scrollovatelný DOM viewport (historii drží renderer), takže se počítá
 *  v ŘÁDCÍCH: pozice = `viewportY`, celek = délka bufferu, okno = `rows`.
 *  Rám s tím pracuje jen v poměrech, takže jednotka je jedno – a klik do
 *  dráhy o „stránku" (clientHeight) tak vyjde přesně na obrazovku textu. */
class XtermScrollProxy {
  constructor(term) {
    this.term = term;
  }

  subscribe(cb) {
    const scroll = this.term.onScroll(cb);
    const render = this.term.onRender?.(cb);      // nový výstup mění délku bufferu
    return () => { scroll.dispose(); render?.dispose(); };
  }

  setFrame() { /* vlastní scrollbar xtermu schovává CSS v _buildBody */ }

  get scrollTop() { return this.term.buffer.active.viewportY; }

  set scrollTop(v) { this.term.scrollToLine(Math.max(0, Math.round(v))); }

  get scrollHeight() { return this.term.buffer.active.length; }

  get clientHeight() { return this.term.rows; }

  // vodorovně se v terminálu nescrolluje (text se zalamuje) – prázdná dráha
  get scrollLeft() { return 0; }

  set scrollLeft(_v) { /* no-op */ }

  get scrollWidth() { return 1; }

  get clientWidth() { return 1; }
}

export class ShellWindow extends BaseWindow {
  constructor({ id, title, cols, rows, width, height, running, scrollback,
    closable, container, manager, sendEvent }) {
    super({
      id, title, widthChars: Math.max(20, Math.round((Number(width) || 720) / PX_PER_CH)),
      container, manager, kind: 'shell', closable,
    });
    this.height = Number(height) > 0 ? Number(height) : 420;
    this.cols = Number(cols) || 80;
    this.rows = Number(rows) || 24;
    this.state = running === false ? 'starting' : 'running';
    this.pending = String(scrollback ?? '');   // historie z initu, dokud není terminál
    this.sendEvent = sendEvent;
    this.term = null;
    this.fit = null;
    this._buildBody();
    this._mount();
    this.ready = this._startTerminal();        // okno sem chodí už odemčené
  }

  _buildBody() {
    const body = document.createElement('div');
    body.dataset.role = 'shell-body';
    body.style.cssText = [
      `width:${this.widthChars}ch`, `height:${this.height}px`, 'max-width:92vw',
      'display:flex', 'flex-direction:column', 'padding:6px 8px',
      'font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace',
    ].join(';');

    const term = document.createElement('div');
    term.dataset.role = 'shell-term';
    term.style.cssText = 'flex:1 1 auto;min-height:0';
    this.termEl = term;
    // VNITŘNÍ SCROLLBAR XTERMU PRYČ – posun kreslí rám okna (wm/frame.js),
    // dva pruhy vedle sebe jsou rušivé (uživatelská poznámka). Xterm 6 jich
    // má dva druhy: nativní scrollbar `.xterm-viewport` (scrollbar-width
    // nezná starší WebKit, proto i ::-webkit-scrollbar) a VLASTNÍ, kreslený
    // divem `.scrollbar.vertical > .slider` (převzatý scrollable element z
    // VS Code) – ten `scrollbar-width` neřeší a byl pořád vidět.
    const hide = document.createElement('style');
    hide.textContent = [
      '[data-role="shell-term"] .xterm-viewport{scrollbar-width:none}',
      '[data-role="shell-term"] .xterm-viewport::-webkit-scrollbar{width:0;height:0}',
      '[data-role="shell-term"] .xterm-scrollable-element>.scrollbar{display:none}',
    ].join('');
    term.appendChild(hide);

    body.append(term);
    this.body = body;
    this.el.appendChild(body);
  }

  _send(event, payload) {
    this.sendEvent?.({ type: 'event', event, payload: { window_id: this.id, ...payload } });
  }

  /** Akce shell_state: proces běží / skončil / se nepodařilo spustit. */
  setState(state, extra = {}) {
    if (state === 'running') {
      this.state = 'running';
      return;
    }
    if (state === 'exited') {
      this.state = 'exited';
      const code = extra.code == null ? '' : ` (exit ${extra.code})`;
      this.write(`\r\n\x1b[2m[process finished${code}]\x1b[0m\r\n`);
      return;
    }
    if (state === 'failed') {
      this.state = 'failed';
      this.write(`\r\n\x1b[31m[${extra.error || 'failed to start'}]\x1b[0m\r\n`);
    }
  }

  /** Akce shell_data: výstup PTY (než je terminál, drží se ve frontě). */
  write(data) {
    const text = String(data ?? '');
    if (this.term) this.term.write(text);
    else this.pending += text;
  }

  /** Donačti xterm.js (vlastní chunk – kdo shell nepoužívá, nestahuje ho)
   *  a připoj terminál. */
  async _startTerminal() {
    if (this.term) return;
    const [{ Terminal }, { FitAddon }] = await Promise.all([
      import('../vendor/xterm/xterm.mjs'),
      import('../vendor/xterm/addon-fit.mjs'),
    ]);
    await import('../vendor/xterm/xterm.css');       // styly .xterm* (inline v bundlu)
    const term = new Terminal({
      cols: this.cols,
      rows: this.rows,
      convertEol: false,
      cursorBlink: true,
      scrollback: 5000,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 13,
      theme: termTheme(this.container),
      allowTransparency: true,       // témata s průsvitným tělem (cyber rgba)
      // vlastní scrollbar xtermu nechceme – viewport řídí rám okna
      scrollOnUserInput: true,
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(this.termEl);
    term.onData((data) => {
      if (this.state === 'running') this._send('shell_input', { data });
    });
    term.onResize(({ cols, rows }) => {
      this.cols = cols;
      this.rows = rows;
      this._send('shell_resize', { cols, rows });
    });
    this.term = term;
    this.fit = fit;
    this.scroll = new XtermScrollProxy(term);
    if (this.pending) {
      term.write(this.pending);          // historie z initu (reconnect/F5)
      this.pending = '';
    }
    this._fit();
    // Scrollbar: xterm scrolluje ve vlastním viewportu – navážeme na něj RÁM
    // okna (wm/frame.js), aby okno nemělo dva scrollbary a WB pruh ukazoval
    // skutečnou pozici v historii. Rám se váže líně (`_scrollTarget`), takže
    // po vzniku terminálu mu to musíme říct.
    this.wframe?.rebind();
    term.focus();
  }

  _fit() {
    try { this.fit?.fit(); } catch { /* okno ještě nemá layout */ }
  }

  _applySize(w, h) {
    super._applySize(w, h);
    this._fit();                         // nové rozměry → cols/rows → SIGWINCH
  }

  applyTheme() {
    super.applyTheme();
    if (this.term) this.term.options.theme = termTheme(this.container);
  }

  /** Scroll rámu okna sleduje terminál až po jeho vzniku (do té doby tělo). */
  _scrollTarget() {
    return this.scroll ?? this.body;
  }

  close() {
    this.term?.dispose();
    this.term = null;
    super.close();
  }

  _renderBody() {
    // xterm si obsah drží sám; téma řeší applyTheme
  }
}

/** Instalace do desktopu: typ okna 'shell' + akce shell_data/shell_state. */
export function createShellPlugin({ container, windowManager, sendEvent, onThemeChange }) {
  const windows = new Set();
  windowManager.registerType('shell', (spec) => {
    windowManager.get(spec.window_id)?.close();
    const win = windowManager.adopt(new ShellWindow({
      id: spec.window_id, title: spec.title, cols: spec.cols, rows: spec.rows,
      width: spec.width, height: spec.height, running: spec.running,
      scrollback: spec.scrollback, closable: spec.closable,
      container, manager: windowManager, sendEvent,
    }));
    windows.add(win);
    win.bringToFront();
    return win;
  });
  onThemeChange?.(() => {
    for (const win of windows) {
      if (windowManager.get(win.id) === win) win.applyTheme();
      else windows.delete(win);
    }
  });
  const target = (msg) => {
    const win = windowManager.get(msg.window_id);
    return win && win.kind === 'shell' ? win : null;
  };
  return {
    name: 'shell',
    actions: {
      shell_data: (msg) => target(msg)?.write(msg.data),
      shell_state: (msg) => target(msg)?.setState(msg.state, msg),
    },
  };
}

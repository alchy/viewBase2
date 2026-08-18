// @vitest-environment happy-dom
/** Shell okno: zamčený stav s kódem, po odemčení terminál (xterm.js se
 *  načítá dynamicky – v testu ho mockujeme), vstup/výstup, resize a úklid.
 *  Ověřuje i to, že se do PTY nic nepošle, dokud okno není odemčené. */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const term = {
  opened: null, written: [], disposed: false, cols: 80, rows: 24,
  open(el) { this.opened = el; },
  write(d) { this.written.push(d); },
  onData(cb) { this._data = cb; return { dispose() {} }; },
  onResize(cb) { this._resize = cb; return { dispose() {} }; },
  onScroll(cb) { this._scroll = cb; return { dispose() {} }; },
  onRender(cb) { this._render = cb; return { dispose() {} }; },
  scrollToLine(n) { this.buffer.active.viewportY = n; },
  resize(c, r) { this.cols = c; this.rows = r; },
  loadAddon() {},
  focus() {},
  dispose() { this.disposed = true; },
  buffer: { active: { viewportY: 0, baseY: 0, length: 24 } },
  rows: 24,
  options: {},
};
const fit = { fit: vi.fn(), dispose() {} };

vi.mock('../src/vendor/xterm/xterm.mjs', () => ({ Terminal: vi.fn(() => term) }));
vi.mock('../src/vendor/xterm/addon-fit.mjs', () => ({ FitAddon: vi.fn(() => fit) }));
vi.mock('../src/vendor/xterm/xterm.css', () => ({}));

const { ShellWindow, createShellPlugin } = await import('../src/plugins/shell.js');
const { WindowManager } = await import('../src/wm/window_manager.js');

const fakeStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

function setup() {
  const container = document.createElement('div');
  Object.defineProperty(container, 'clientWidth', { value: 900 });
  Object.defineProperty(container, 'clientHeight', { value: 600 });
  document.body.appendChild(container);
  const windowManager = new WindowManager(container, () => {});
  const sendEvent = vi.fn();
  const plugin = createShellPlugin({ container, windowManager, sendEvent, onThemeChange: () => {} });
  return { container, windowManager, sendEvent, plugin };
}

const open = (wm, spec = {}) => wm.open('shell', {
  window_id: 'sh', title: 'Shell', cols: 80, rows: 24, width: 640, height: 400,
  running: true, scrollback: '', ...spec,
});

describe('ShellWindow – běžící terminál', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', fakeStorage);
    term.written = []; term.opened = null; term.disposed = false;
  });

  it('odemčené okno nasadí xterm a přehraje scrollback z initu', async () => {
    const { windowManager, plugin } = setup();
    const win = open(windowManager, { scrollback: 'stará historie\r\n' });
    await win.ready;
    expect(term.opened).toBe(win.termEl);
    expect(term.written.join('')).toContain('stará historie');
  });

  it('shell_data píše do terminálu, klávesy jdou zpět jako shell_input', async () => {
    const { windowManager, plugin, sendEvent } = setup();
    const win = open(windowManager);
    await win.ready;
    plugin.actions.shell_data({ window_id: 'sh', data: 'ahoj\r\n' });
    expect(term.written.join('')).toContain('ahoj');
    term._data('l');                                    // uživatel zmáčkl klávesu
    expect(sendEvent).toHaveBeenLastCalledWith({
      type: 'event', event: 'shell_input', payload: { window_id: 'sh', data: 'l' },
    });
  });

  it('změna velikosti okna pošle shell_resize s novými cols/rows', async () => {
    const { windowManager, sendEvent } = setup();
    const win = open(windowManager);
    await win.ready;
    term._resize({ cols: 120, rows: 40 });
    expect(sendEvent).toHaveBeenLastCalledWith({
      type: 'event', event: 'shell_resize', payload: { window_id: 'sh', cols: 120, rows: 40 },
    });
    win._applySize(700, 420);                            // úchyt okna → fit
    expect(fit.fit).toHaveBeenCalled();
  });

  it('konec procesu (exited) napíše hlášku a další klávesy už neposílá', async () => {
    const { windowManager, plugin, sendEvent } = setup();
    const win = open(windowManager);
    await win.ready;
    plugin.actions.shell_state({ window_id: 'sh', state: 'exited', code: 7 });
    expect(term.written.join('')).toMatch(/7/);
    sendEvent.mockClear();
    term._data('x');
    expect(sendEvent).not.toHaveBeenCalled();
  });

  it('scrollbar rámu okna jede po historii terminálu (xterm nemá DOM viewport)', async () => {
    const { windowManager } = setup();
    const win = open(windowManager);
    await win.ready;
    const proxy = win._scrollTarget();
    term.buffer.active.length = 500;                      // historie 500 řádků
    term.buffer.active.viewportY = 100;
    expect([proxy.scrollTop, proxy.scrollHeight, proxy.clientHeight]).toEqual([100, 500, 24]);
    proxy.scrollTop = 250;                                // tažení knobu rámu
    expect(term.buffer.active.viewportY).toBe(250);
    expect(proxy.scrollWidth).toBe(proxy.clientWidth);     // vodorovně nic = prázdná dráha
    let volano = 0;
    const off = proxy.subscribe(() => { volano += 1; });
    term._scroll(); term._render();                       // scroll i nový výstup
    expect(volano).toBe(2);
    off();
  });

  it('vlastní scrollbary xtermu jsou schované (kreslí je rám okna)', () => {
    // xterm 6 kreslí DVA: nativní na `.xterm-viewport` a vlastní div
    // `.scrollbar` (scrollable element z VS Code). Ten druhý `scrollbar-width`
    // neřeší a byl v okně vidět vedle scrollbaru rámu (uživatelská poznámka).
    const { windowManager } = setup();
    const win = open(windowManager);
    const css = [...win.termEl.querySelectorAll('style')].map((s) => s.textContent).join('');
    expect(css).toContain('.xterm-viewport{scrollbar-width:none}');
    expect(css).toContain('.xterm-viewport::-webkit-scrollbar{width:0;height:0}');
    expect(css).toContain('.xterm-scrollable-element>.scrollbar{display:none}');
  });

  it('zavření okna terminál uklidí', async () => {
    const { windowManager } = setup();
    const win = open(windowManager);
    await win.ready;
    win.close();
    expect(term.disposed).toBe(true);
  });
});

// @vitest-environment happy-dom
/** Depth gadget okna (jako na liště screenu): klik pošle okno ZA ostatní –
 *  každé okno má své Z, WindowManager.sendToBack ho přeuspořádá. */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BaseWindow } from '../src/wm/base_window.js';
import { WindowManager } from '../src/wm/window_manager.js';

const fakeStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

function setup() {
  const container = document.createElement('div');
  Object.defineProperty(container, 'clientWidth', { value: 1600 });
  Object.defineProperty(container, 'clientHeight', { value: 900 });
  document.body.appendChild(container);
  const wm = new WindowManager(container, () => {});
  const make = (id) => {
    const win = new BaseWindow({ id, title: id, widthChars: 30, container, manager: wm, kind: 'control' });
    win.body = document.createElement('div');
    win.el.appendChild(win.body);
    win._mount();
    wm.adopt(win);
    win.bringToFront();
    return win;
  };
  return { wm, a: make('a'), b: make('b'), c: make('c') };
}

const z = (w) => Number(w.el.style.zIndex);

describe('depth gadget okna', () => {
  beforeEach(() => vi.stubGlobal('localStorage', fakeStorage));

  it('okno má depth gadget vedle minimalizace (stejná role jako na liště screenu)', () => {
    const { a } = setup();
    const gadgets = [...a.bar.querySelectorAll('[data-gadget]')].map((g) => g.dataset.gadget);
    expect(gadgets).toEqual(['close', 'minimize', 'depth', 'restore']);
    expect(a.depthGadget.style.display).not.toBe('none');
  });

  it('klik pošle okno za ostatní; ostatní pořadí zůstane', () => {
    const { a, b, c } = setup();
    expect(z(c)).toBeGreaterThan(z(b));
    expect(z(b)).toBeGreaterThan(z(a));
    c.depthGadget.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(z(c)).toBeLessThan(z(a));            // c je úplně vzadu
    expect(z(b)).toBeGreaterThan(z(a));         // a < b zachováno
    a.sendToBack();
    expect(z(a)).toBeLessThan(z(c));            // teď je vzadu a, pak c, pak b
    expect(z(c)).toBeLessThan(z(b));
  });

  it('po sendToBack dostane další bringToFront zase nejvyšší Z', () => {
    const { a, b, c } = setup();
    c.sendToBack();
    c.bringToFront();
    expect(z(c)).toBeGreaterThan(z(b));
    expect(z(c)).toBeGreaterThan(z(a));
  });

  it('v doku (minimalizované) je depth gadget schovaný, po obnově zpět', () => {
    const { a } = setup();
    a.minimize();
    expect(a.depthGadget.style.display).toBe('none');
    a.restore();
    expect(a.depthGadget.style.display).toBe('');
  });
});

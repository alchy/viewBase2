// @vitest-environment happy-dom
/** Dok minimalizovaných oken v DOM: proužky vedle sebe s mezerou, vždy pod
 *  okny (Z), gadget obnovy = minimalizace, pamatovaná pozice (localStorage),
 *  tažení proužku s kolizí. happy-dom neměří layout → šířka/výška proužku
 *  spadne na fallback 160×28. */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BaseWindow } from '../src/wm/base_window.js';
import { DOCK_GAP } from '../src/wm/dock.js';
import { MINIMIZE_ICON } from '../src/wm/gadget_icons.js';
import { WindowManager } from '../src/wm/window_manager.js';

const store = new Map();
const fakeStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};

function setup() {
  const container = document.createElement('div');
  Object.defineProperty(container, 'clientWidth', { value: 800 });
  Object.defineProperty(container, 'clientHeight', { value: 600 });
  document.body.appendChild(container);
  const wm = new WindowManager(container, () => {});
  const make = (id, title) => {
    const win = new BaseWindow({ id, title, widthChars: 30, container, manager: wm, kind: 'control' });
    win.body = document.createElement('div');
    win.el.appendChild(win.body);
    win._mount();
    wm.adopt(win);
    win.bringToFront();
    return win;
  };
  return { wm, make };
}
const z = (w) => Number(w.el.style.zIndex);

describe('dok minimalizovaných oken', () => {
  beforeEach(() => { store.clear(); vi.stubGlobal('localStorage', fakeStorage); });

  it('proužky se řadí vlevo dole vedle sebe s mezerou a jsou pod všemi okny', () => {
    const { make } = setup();
    const a = make('a', 'Krátký'); const b = make('b', 'Veliké okno s dlouhým popisem'); const c = make('c', 'C');
    a.minimize(); b.minimize();
    expect([a.x, a.y]).toEqual([DOCK_GAP, 600 - 28 - DOCK_GAP]);
    expect([b.x, b.y]).toEqual([DOCK_GAP + 160 + DOCK_GAP, 600 - 28 - DOCK_GAP]);
    expect(z(a)).toBeLessThan(900); expect(z(b)).toBeLessThan(900);
    expect(z(c)).toBeGreaterThan(900);
    expect(a.el.dataset.role).toBe('vb-dock-strip');
    expect(a.titleEl.style.paddingRight).toBe('10ch');          // odstup titulku od gadgetu
    // v doku svítí gadget minimalizace (obnovit), ne depth
    expect(a.restoreGadget.style.display).toBe('');
    expect(a.restoreGadget.style.cssText).toContain(MINIMIZE_ICON.slice(0, 40));
    expect(a.depthGadget.style.display).toBe('none');
  });

  it('klik do proužku ho nezvedne nad okna (bringToFront proužek nechává vzadu)', () => {
    const { make } = setup();
    const a = make('a', 'A'); const b = make('b', 'B');
    a.minimize();
    a.bringToFront();
    expect(z(a)).toBeLessThan(z(b));
    b.sendToBack();                                             // depth okna: proužky pořád vzadu
    expect(z(a)).toBeLessThan(z(b));
  });

  it('proužek si pamatuje pozici (i přes reload) a po obnově/minimalizaci se tam vrátí', () => {
    const { make } = setup();
    const a = make('a', 'A');
    a.minimize();
    a._place(300, 500); a.dockPos = { x: 300, y: 500 }; a._savePos();   // = konec tažení proužku
    a.restore();
    expect([a.x, a.y]).toEqual([40, 40]);                       // okno zpět, kam patřilo
    a.minimize();
    expect([a.x, a.y]).toEqual([300, 500]);
    const rec = JSON.parse(store.get('vb-pos:a'));
    expect([rec.dx, rec.dy]).toEqual([300, 500]);
    expect([rec.x, rec.y]).toEqual([40, 40]);                   // pozice okna se nepřepsala pozicí proužku
  });

  it('pamatovaná pozice obsazená jiným proužkem → první volné místo', () => {
    const { make } = setup();
    const a = make('a', 'A'); const b = make('b', 'B');
    a.dockPos = { x: DOCK_GAP, y: 600 - 28 - DOCK_GAP };
    b.minimize();                                               // b sedí vlevo dole
    a.minimize();                                               // a chce totéž → vedle
    expect(a.x).toBe(DOCK_GAP + 160 + DOCK_GAP);
  });
});

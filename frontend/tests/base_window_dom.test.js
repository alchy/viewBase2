// @vitest-environment happy-dom
/** DOM integrace BaseWindow: perzistence pozice (localStorage) a closable.
 *  localStorage stubujeme (Map) — happy-dom má Storage neúplný; prohlížeče
 *  reálné Storage API mají. */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BaseWindow } from '../src/wm/base_window.js';

const store = new Map();
const fakeStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};

function makeWindow(id, { closable } = {}) {
  const container = document.createElement('div');
  Object.defineProperty(container, 'clientWidth', { value: 1600 });
  Object.defineProperty(container, 'clientHeight', { value: 900 });
  document.body.appendChild(container);
  // stub WindowManager kontraktu: _setActive hlásí aktivaci okna
  // (bringToFront) pro Options na screen baru – tady stačí no-op
  const manager = { windows: new Map(), _nextZ: () => 1000, _setActive: () => {} };
  const win = new BaseWindow({
    id, title: 'Aktivační okno', widthChars: 40,
    container, manager, kind: 'control', closable,
  });
  win.body = document.createElement('div');   // podtřídy staví tělo samy
  win.el.appendChild(win.body);
  win._mount();
  return win;
}

describe('BaseWindow — perzistence pozice', () => {
  beforeEach(() => {
    store.clear();
    vi.stubGlobal('localStorage', fakeStorage);
  });

  it('uložená pozice přežije znovuvytvoření okna (reload stránky)', () => {
    const first = makeWindow('aktivace');
    first._place(321, 111);
    first._savePos();                       // = konec tažení myší
    const reborn = makeWindow('aktivace');  // po reloadu se okno staví znovu
    expect(reborn.x).toBe(321);
    expect(reborn.y).toBe(111);
  });

  it('bez uloženého záznamu platí výchozí kaskáda', () => {
    const win = makeWindow('nove-okno');
    expect(win.x).toBe(40);
    expect(win.y).toBe(40);
  });

  it('pozice mimo plátno se přichytí (menší okno prohlížeče)', () => {
    fakeStorage.setItem('vb-pos:aktivace',
      JSON.stringify({ x: 5000, y: 5000 }));
    const win = makeWindow('aktivace');
    expect(win.x).toBeLessThanOrEqual(1600);
    expect(win.y).toBeLessThanOrEqual(900);
  });

  it('drag konec ukládá do localStorage (pointer eventy)', () => {
    const win = makeWindow('aktivace');
    win.bar.setPointerCapture = () => {};
    win.bar.releasePointerCapture = () => {};
    win.bar.dispatchEvent(new PointerEvent('pointerdown',
      { clientX: 50, clientY: 50, pointerId: 1, bubbles: true, buttons: 1 }));
    win.bar.dispatchEvent(new PointerEvent('pointermove',
      { clientX: 250, clientY: 180, pointerId: 1, bubbles: true, buttons: 1 }));
    win.bar.dispatchEvent(new PointerEvent('pointerup',
      { pointerId: 1, bubbles: true }));
    const saved = JSON.parse(fakeStorage.getItem('vb-pos:aktivace'));
    expect(saved.x).toBe(win.x);
    expect(saved.y).toBe(win.y);
    expect(saved.x).not.toBe(40);           // opravdu se hnulo z kaskády
  });

  it('pohyb bez drženého tlačítka okno nevleče (sticky fix)', () => {
    const win = makeWindow('sticky');
    win.bar.setPointerCapture = () => {};
    win.bar.releasePointerCapture = () => {};
    win.bar.dispatchEvent(new PointerEvent('pointerdown',
      { clientX: 50, clientY: 50, pointerId: 1, bubbles: true, buttons: 1 }));
    // pointerup se ztratil (capture glitch na reálném HW) – další pohyb už
    // jde bez tlačítka a tažení musí skončit, ne vléct okno za myší
    const before = { x: win.x, y: win.y };
    win.bar.dispatchEvent(new PointerEvent('pointermove',
      { clientX: 400, clientY: 400, pointerId: 1, bubbles: true, buttons: 0 }));
    expect({ x: win.x, y: win.y }).toEqual(before);
    expect(win.dragOffset).toBeNull();
    // a další pohyb (pořád bez tlačítka) taky nic nedělá
    win.bar.dispatchEvent(new PointerEvent('pointermove',
      { clientX: 600, clientY: 500, pointerId: 1, bubbles: true, buttons: 0 }));
    expect({ x: win.x, y: win.y }).toEqual(before);
  });
});

describe('BaseWindow — změna velikosti za rohový úchyt', () => {
  beforeEach(() => {
    store.clear();
    vi.stubGlobal('localStorage', fakeStorage);
  });

  const grip = (win, corner) =>
    win.el.querySelector(`[data-role="vb-resize-${corner}"]`);

  function drag(win, corner, from, to) {
    const g = grip(win, corner);
    g.setPointerCapture = () => {};
    g.releasePointerCapture = () => {};
    // rozměry z getBoundingClientRect happy-dom nezná → stav si nastavíme sami
    win.el.getBoundingClientRect = () => ({ width: 300, height: 200 });
    g.dispatchEvent(new PointerEvent('pointerdown',
      { clientX: from.x, clientY: from.y, pointerId: 1, bubbles: true, buttons: 1 }));
    g.dispatchEvent(new PointerEvent('pointermove',
      { clientX: to.x, clientY: to.y, pointerId: 1, bubbles: true, buttons: 1 }));
    g.dispatchEvent(new PointerEvent('pointerup',
      { pointerId: 1, bubbles: true }));
    return g;
  }

  it('okno má úchyt v obou dolních rozích a jsou skryté', () => {
    const win = makeWindow('aktivace');
    expect(grip(win, 'se')).not.toBeNull();
    expect(grip(win, 'sw')).not.toBeNull();
    expect(grip(win, 'se').style.opacity).toBe('0');
  });

  it('najetí na roh čtvereček zobrazí (transluentně), odjetí ho schová', () => {
    const win = makeWindow('aktivace');
    const g = grip(win, 'se');
    g.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
    expect(Number(g.style.opacity)).toBeGreaterThan(0);
    expect(Number(g.style.opacity)).toBeLessThan(1);
    g.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
    expect(g.style.opacity).toBe('0');
  });

  it('tažení za pravý dolní roh mění velikost okna, pozice stojí', () => {
    const win = makeWindow('aktivace');
    const { x, y } = win;
    drag(win, 'se', { x: 340, y: 240 }, { x: 440, y: 300 });
    expect(win.size).toEqual({ w: 400, h: 260 });
    expect(win.el.style.width).toBe('400px');
    expect([win.x, win.y]).toEqual([x, y]);
  });

  it('tažení za levý dolní roh posune okno, pravá hrana drží', () => {
    const win = makeWindow('aktivace');
    const right = win.x + 300;
    drag(win, 'sw', { x: 44, y: 240 }, { x: 4, y: 260 });
    expect(win.size.w).toBe(340);
    expect(win.x + win.size.w).toBe(right);
  });

  it('velikost se ukládá vedle pozice a přežije reload', () => {
    const win = makeWindow('aktivace');
    drag(win, 'se', { x: 340, y: 240 }, { x: 500, y: 400 });
    const saved = JSON.parse(fakeStorage.getItem('vb-pos:aktivace'));
    expect(saved).toEqual({ x: win.x, y: win.y, w: 460, h: 360 });
    const reborn = makeWindow('aktivace');
    expect(reborn.size).toEqual({ w: 460, h: 360 });
    expect(reborn.el.style.height).toBe('360px');
  });

  it('minimalizované okno úchyty schová a po obnově má svou velikost', () => {
    const win = makeWindow('aktivace');
    win.manager._assignDockSlot = () => 0;
    win.manager._releaseDockSlot = () => {};
    drag(win, 'se', { x: 340, y: 240 }, { x: 440, y: 300 });
    win.minimize();
    expect(grip(win, 'se').style.display).toBe('none');
    expect(win.el.style.height).toBe('');
    win.restore();
    expect(grip(win, 'se').style.display).toBe('');
    expect(win.el.style.height).toBe('260px');
  });
});

describe('BaseWindow — closable', () => {
  it('closable=false nemá gadget [x]', () => {
    const win = makeWindow('aktivace', { closable: false });
    expect(win.el.querySelector('[data-gadget="close"]')).toBeNull();
  });

  it('výchozí okno gadget [x] má', () => {
    const win = makeWindow('detail');
    expect(win.el.querySelector('[data-gadget="close"]')).not.toBeNull();
  });
});

describe('BaseWindow — maximalizace dvojklikem na lištu', () => {
  beforeEach(() => {
    store.clear();
    vi.stubGlobal('localStorage', fakeStorage);
  });

  it('dvojklik maximalizuje pod screen bar, další dvojklik vrátí geometrii', () => {
    const win = makeWindow('max-okno');
    win._applySize(300, 200);
    win._place(50, 60);
    win.bar.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    expect(win.size).toEqual({ w: 1600, h: 900 - 26 });   // 26 = screen bar
    expect([win.x, win.y]).toEqual([0, 26]);
    win.bar.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    expect(win.size).toEqual({ w: 300, h: 200 });
    expect([win.x, win.y]).toEqual([50, 60]);
  });

  it('dvojklik na gadget okno nemaximalizuje', () => {
    const win = makeWindow('max-gadget');
    win._applySize(300, 200);
    win.minGadget.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    expect(win.size).toEqual({ w: 300, h: 200 });
    expect(win.maximizedFrom).toBeNull();
  });
});

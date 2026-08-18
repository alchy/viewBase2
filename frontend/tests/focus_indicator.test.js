// @vitest-environment happy-dom
/** Indikátor fokusu okna: drobná značka hned ZA textem titulku, svítí jen na
 *  aktivním okně (to, do kterého uživatel naposled klikl a kterému patří
 *  Options i klávesnice). */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BaseWindow } from '../src/wm/base_window.js';
import { WindowManager } from '../src/wm/window_manager.js';

const fakeStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

function setup() {
  const container = document.createElement('div');
  Object.defineProperty(container, 'clientWidth', { value: 800 });
  Object.defineProperty(container, 'clientHeight', { value: 600 });
  document.body.appendChild(container);
  const wm = new WindowManager(container, () => {});
  const make = (id, title = id) => {
    const win = new BaseWindow({ id, title, widthChars: 30, container, manager: wm, kind: 'control' });
    win.body = document.createElement('div');
    win.el.appendChild(win.body);
    win._mount();
    wm.adopt(win);
    return win;
  };
  return { wm, make };
}
const focused = (w) => w.focusEl.style.display !== 'none';

describe('indikátor fokusu okna', () => {
  beforeEach(() => vi.stubGlobal('localStorage', fakeStorage));

  it('značka sedí hned za textem titulku (uvnitř lišty, před gadgety)', () => {
    const { make } = setup();
    const a = make('a', 'Konzole');
    expect(a.titleEl.textContent).toBe('Konzole');           // text titulku beze změny
    expect(a.focusEl.parentElement).toBe(a.titleEl);         // uvnitř titulku = hned za textem
    expect(a.titleEl.firstElementChild).toBe(a.titleTextEl);
    expect(a.titleTextEl.nextElementSibling).toBe(a.focusEl);
    expect(a.focusEl.dataset.role).toBe('vb-focus');
  });

  it('svítí jen na aktivním okně; aktivace přepne značku', () => {
    const { make } = setup();
    const a = make('a'); const b = make('b');
    expect(focused(a)).toBe(false);
    expect(focused(b)).toBe(false);
    a.bringToFront();
    expect(focused(a)).toBe(true);
    expect(focused(b)).toBe(false);
    b.bringToFront();
    expect(focused(a)).toBe(false);
    expect(focused(b)).toBe(true);
  });

  it('zmenšené (minimalizované) okno indikátor má taky', () => {
    const { make } = setup();
    const a = make('a', 'Konzole');
    a.bringToFront();
    a.minimize();
    expect(focused(a)).toBe(true);
    expect(a.titleTextEl.textContent).toBe('Konzole');
  });

  it('zavření aktivního okna značku nikde nenechá', () => {
    const { make } = setup();
    const a = make('a'); const b = make('b');
    a.bringToFront();
    a.close();
    expect(focused(b)).toBe(false);
  });

  it('setTitle přepíše text, ale ne indikátor', () => {
    const { make } = setup();
    const a = make('a', 'Staré');
    a.bringToFront();
    a.setTitle('Nové jméno');
    expect(a.titleTextEl.textContent).toBe('Nové jméno');
    expect(a.focusEl.parentElement).toBe(a.titleEl);
    expect(focused(a)).toBe(true);
  });
});

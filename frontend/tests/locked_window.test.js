// @vitest-environment happy-dom
/** Zamčené okno (`secured=True` na kterémkoli typu): server pošle jen prázdný
 *  rám, obsah až po odemčení. Kód se zadává v zelené výzvě ve stylu Guru
 *  Meditation (core/unlock_prompt.js) – jádro WM to řeší JEDNÍM typem okna,
 *  pluginy o zámku nevědí. */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnlockPrompt } from '../src/core/unlock_prompt.js';
import { LockedWindow, createLockedPlugin } from '../src/wm/locked_window.js';
import { WindowManager } from '../src/wm/window_manager.js';

const fakeStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

function setup() {
  const container = document.createElement('div');
  Object.defineProperty(container, 'clientWidth', { value: 900 });
  Object.defineProperty(container, 'clientHeight', { value: 600 });
  document.body.appendChild(container);
  const windowManager = new WindowManager(container, () => {});
  const sendEvent = vi.fn();
  const unlockPrompt = new UnlockPrompt(container, sendEvent);
  const plugin = createLockedPlugin({ container, windowManager, sendEvent, unlockPrompt });
  return { container, windowManager, sendEvent, plugin, unlockPrompt };
}
const open = (wm, spec = {}) => wm.open('locked', {
  window_id: 'panel', title: 'Panel', kind: 'locked', real_kind: 'html',
  secured: true, state: 'locked', width: 420, height: 260, ...spec,
});

describe('zamčené okno', () => {
  beforeEach(() => vi.stubGlobal('localStorage', fakeStorage));

  it('je jen prázdný rám bez obsahu a bez Options', () => {
    const { windowManager } = setup();
    const win = open(windowManager);
    expect(win).toBeInstanceOf(LockedWindow);
    expect(win.kind).toBe('locked');
    expect(win.realKind).toBe('html');
    expect(win.body.textContent).toBe('Locked — click to unlock');
    expect(win.getOptionsItems()).toBeNull();
    expect(win.title).toBe('Panel');
    expect(win.height).toBe(260);
  });

  it('otevření okna rovnou vyvolá zelenou výzvu (styl Guru, bez blikání)', () => {
    const { windowManager, unlockPrompt } = setup();
    open(windowManager, { title: 'Tajné' });
    expect(unlockPrompt.visible).toBe(true);
    expect(unlockPrompt.what.textContent).toContain('Tajné');
    expect(unlockPrompt.box.style.font).toContain('ui-monospace');   // písmo workbenche
    expect(unlockPrompt.box.style.border).toContain('4px solid');   // tlustý rám jako Guru
    expect(unlockPrompt.box.style.left).toBe('0px');                 // přes celou šířku
    expect(unlockPrompt.box.style.top).toBe('0px');                  // nahoře jako Guru
    expect(unlockPrompt.box.style.animation).toBe('');      // NEbliká
    expect(unlockPrompt.box.style.color.toLowerCase()).toBe('#3bf28a');   // zelená
  });

  it('Enter ve výzvě pošle window_unlock (jediná cesta ven)', () => {
    const { windowManager, sendEvent, unlockPrompt } = setup();
    open(windowManager);
    unlockPrompt.input.value = ' 123 456 ';
    unlockPrompt.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(sendEvent).toHaveBeenCalledWith({
      type: 'event', event: 'window_unlock', payload: { window_id: 'panel', code: '123456' },
    });
  });

  it('odmítnutý kód: hláška, prázdné pole, výzva zůstane', () => {
    const { windowManager, plugin, unlockPrompt } = setup();
    open(windowManager);
    unlockPrompt.input.value = '000000';
    plugin.actions.window_state({ window_id: 'panel', state: 'locked', error: 'Neplatný kód' });
    expect(unlockPrompt.err.textContent).toContain('Neplatný kód');
    expect(unlockPrompt.input.value).toBe('');
    expect(unlockPrompt.visible).toBe(true);
  });

  it('Esc výzvu zruší a okno se neotevře (zmizí i placeholder)', () => {
    const { windowManager, unlockPrompt } = setup();
    open(windowManager);
    expect(windowManager.get('panel')).toBeTruthy();
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
    expect(unlockPrompt.visible).toBe(false);
    expect(windowManager.get('panel')).toBeNull();      // okno se neotevřelo
  });

  it('klik do zamčeného okna výzvu vrátí (když ji divák jen odklikl jinam)', () => {
    const { windowManager, unlockPrompt } = setup();
    const win = open(windowManager);
    unlockPrompt.hide();                                 // bez zrušení okna
    win.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(unlockPrompt.visible).toBe(true);
  });

  it('po odemčení skutečné okno placeholder nahradí a výzva zmizí', () => {
    const { windowManager, unlockPrompt, container } = setup();
    open(windowManager);
    // plugin daného typu si okno se stejným window_id převezme (jako vždy)
    windowManager.registerType('html', (spec) => {
      const el = document.createElement('div');
      el.dataset.role = 'vb-window';
      container.appendChild(el);
      const fake = { id: spec.window_id, kind: 'html', el, isMinimized: false,
        close() { el.remove(); windowManager._forget(this.id); },
        getOptionsItems: () => null, applyTheme() {}, setFocused() {} };
      windowManager.get(spec.window_id)?.close();
      return windowManager.adopt(fake);
    });
    windowManager.open('html', { window_id: 'panel', html: '<b>obsah</b>' });
    unlockPrompt.resolve('panel');
    expect(unlockPrompt.visible).toBe(false);
    expect(windowManager.get('panel').kind).toBe('html');
  });
});

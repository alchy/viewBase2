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
  const optionsSeen = [];
  const sendEvent = vi.fn();
  const windowManager = new WindowManager(container, (items) => optionsSeen.push(items),
    { onLockWindow: (win) => sendEvent({ type: 'event', event: 'window_lock',
      payload: { window_id: win.id } }) });
  const unlockPrompt = new UnlockPrompt(container, sendEvent);
  const plugin = createLockedPlugin({ container, windowManager, sendEvent, unlockPrompt });
  return { container, windowManager, sendEvent, plugin, unlockPrompt, optionsSeen };
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
    expect(win.body.textContent)
      .toBe('Private window. Unlock this window via the Options menu.');
    expect(win.getOptionsItems()).toBeNull();     // vlastní Options nemá
    expect(win.title).toBe('Panel');
    expect(win.height).toBe(260);
  });

  it('otevření zamčeného okna NIC nevyskočí (o kód si divák řekne sám)', () => {
    const { windowManager, unlockPrompt } = setup();
    const win = open(windowManager, { title: 'Tajné' });
    expect(unlockPrompt.visible).toBe(false);
    // ...a klik do okna taky ne – okno se jen aktivuje jako každé jiné
    win.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(unlockPrompt.visible).toBe(false);
  });

  it('výzva má styl Guru Meditation, ale zelená a bez blikání', () => {
    const { windowManager, unlockPrompt } = setup();
    open(windowManager, { title: 'Tajné' }).requestUnlock();
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
    open(windowManager).requestUnlock();
    unlockPrompt.input.value = ' 123 456 ';
    unlockPrompt.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(sendEvent).toHaveBeenCalledWith({
      type: 'event', event: 'window_unlock', payload: { window_id: 'panel', code: '123456' },
    });
  });

  it('odmítnutý kód: hláška, prázdné pole, výzva zůstane', () => {
    const { windowManager, plugin, unlockPrompt } = setup();
    open(windowManager).requestUnlock();
    unlockPrompt.input.value = '000000';
    plugin.actions.window_state({ window_id: 'panel', state: 'locked', error: 'Neplatný kód' });
    expect(unlockPrompt.err.textContent).toContain('Neplatný kód');
    expect(unlockPrompt.input.value).toBe('');
    expect(unlockPrompt.visible).toBe(true);
  });

  it('Esc zruší jen výzvu – okno zůstane jako zamčený rám', () => {
    const { windowManager, unlockPrompt } = setup();
    open(windowManager).requestUnlock();
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
    expect(unlockPrompt.visible).toBe(false);
    // okno tu musí zůstat, jinak by nešlo označit a odemknout z Options
    expect(windowManager.get('panel')).toBeTruthy();
  });

  it('Esc funguje i z fokusnutého pole pro kód (capture fáze)', () => {
    // regrese ze živého testu: pole si klávesy zastavuje stopPropagation,
    // takže posluchač v bublací fázi Esc nikdy neviděl a výzva nešla zrušit
    const { windowManager, unlockPrompt } = setup();
    open(windowManager).requestUnlock();
    unlockPrompt.input.dispatchEvent(
      new KeyboardEvent('keydown', { code: 'Escape', bubbles: true }));
    expect(unlockPrompt.visible).toBe(false);
  });

  it('Options aktivního zamčeného okna nabídne Unlock Window', () => {
    const { windowManager, unlockPrompt, optionsSeen } = setup();
    const win = open(windowManager);
    win.el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    const items = optionsSeen.at(-1);
    expect(items.map((i) => i.key)).toEqual(['unlock-window']);
    expect(items[0].label).toBe('Unlock Window');
    expect(items[0].command).toBe(true);           // příkaz, ne přepínač (bez ✓)
    items[0].onToggle();
    expect(unlockPrompt.visible).toBe(true);       // zelená výzva na kód
    expect(unlockPrompt.windowId).toBe('panel');
  });

  it('Options odemčeného zabezpečeného okna nabídne Lock Window', () => {
    const { windowManager, sendEvent, optionsSeen, container } = setup();
    windowManager.registerType('html', (spec) => {
      const el = document.createElement('div');
      container.appendChild(el);
      return windowManager.adopt({
        id: spec.window_id, kind: 'html', el, isMinimized: false,
        close() { el.remove(); windowManager._forget(this.id); },
        getOptionsItems: () => [{ key: 'word-wrap', label: 'Word Wrap', checked: true,
          onToggle: () => {} }],
        applyTheme() {}, setFocused() {},
      });
    });
    const win = windowManager.open('html', { window_id: 'panel', secured: true,
      state: 'open', html: '<b>obsah</b>' });
    windowManager._setActive(win);
    const items = optionsSeen.at(-1);
    // vlastní položky okna zůstávají, zámek se přidá na konec (jádro WM, DRY)
    expect(items.map((i) => i.key)).toEqual(['word-wrap', 'lock-window']);
    items.at(-1).onToggle();
    expect(sendEvent).toHaveBeenCalledWith({
      type: 'event', event: 'window_lock', payload: { window_id: 'panel' },
    });
  });

  it('okno aktivované už ve factory má Lock Window hned (pořadí adopt/aktivace)', () => {
    // regrese ze živého testu: `secured` se dřív zapsalo až z návratové
    // hodnoty factory, takže aktivace uvnitř ní viděla okno jako nezamčené
    const { windowManager, optionsSeen, container } = setup();
    windowManager.registerType('html', (spec) => {
      const el = document.createElement('div');
      container.appendChild(el);
      const win = windowManager.adopt({
        id: spec.window_id, kind: 'html', el, isMinimized: false,
        close() { el.remove(); windowManager._forget(this.id); },
        getOptionsItems: () => null, applyTheme() {}, setFocused() {},
      });
      windowManager._setActive(win);          // factory si okno rovnou aktivuje
      return win;
    });
    windowManager.open('html', { window_id: 'panel', secured: true, state: 'open' });
    expect(optionsSeen.at(-1).map((i) => i.key)).toEqual(['lock-window']);
  });

  it('nezabezpečené okno žádnou položku zámku nedostane', () => {
    const { windowManager, optionsSeen, container } = setup();
    windowManager.registerType('html', (spec) => {
      const el = document.createElement('div');
      container.appendChild(el);
      return windowManager.adopt({
        id: spec.window_id, kind: 'html', el, isMinimized: false,
        close() { el.remove(); windowManager._forget(this.id); },
        getOptionsItems: () => null, applyTheme() {}, setFocused() {},
      });
    });
    const win = windowManager.open('html', { window_id: 'volne', html: '<b>x</b>' });
    windowManager._setActive(win);
    expect(optionsSeen.at(-1)).toBeNull();      // skupina se nepřepíná
  });

  it('po odemčení skutečné okno placeholder nahradí a výzva zmizí', () => {
    const { windowManager, unlockPrompt, container } = setup();
    open(windowManager).requestUnlock();
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

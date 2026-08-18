// @vitest-environment happy-dom
/** Vestavěná skupina „System" na liště screenu (vedle Options): položka
 *  „Shell CLI" spustí shell okno přímo z GUI (event shell_new). Volba je
 *  dostupná vždy, pokud ji server nevypne (`config.shell_cli === false`). */
import { describe, expect, it, vi } from 'vitest';
import { ScreenBar } from '../src/wm/screen_bar.js';

function bar() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const sendEvent = vi.fn();
  return { bar: new ScreenBar({ container, sendEvent }), sendEvent, container };
}
const groups = (b) => [...b.container.querySelectorAll('[data-role="vb-menu-group"]')]
  .map((g) => g.textContent);
const openGroup = (b, name) => [...b.container.querySelectorAll('[data-role="vb-menu-group"]')]
  .find((g) => g.textContent === name).click();
const items = (b) => [...b.container.querySelectorAll('[data-role="vb-menu-item"]')]
  .map((i) => i.textContent.trim());

describe('lišta screenu – skupina System', () => {
  it('System je hned za Options a nabízí Shell CLI', () => {
    const b = bar();
    b.bar.setOptionsGroup([{ key: 'x', label: 'Physics running', checked: true, onToggle() {} }]);
    b.bar.setSystemGroup();
    expect(groups(b)).toEqual(['Options', 'System']);
    openGroup(b, 'System');
    expect(items(b)).toEqual(['Shell CLI']);
  });

  it('System je i bez Options (screen bez grafu)', () => {
    const b = bar();
    b.bar.setSystemGroup();
    expect(groups(b)).toEqual(['System']);
  });

  it('klik na Shell CLI pošle event shell_new a zavře menu', () => {
    const b = bar();
    b.bar.setSystemGroup();
    openGroup(b, 'System');
    b.container.querySelector('[data-role="vb-menu-item"]').click();
    expect(b.sendEvent).toHaveBeenCalledWith({ type: 'event', event: 'shell_new', payload: {} });
    expect(b.container.querySelector('[data-role="vb-screen-menu-dropdown"]').style.display)
      .toBe('none');
  });

  it('server může System vypnout (shell_cli: false)', () => {
    const b = bar();
    b.bar.setSystemGroup(false);
    expect(groups(b)).toEqual([]);
  });
});

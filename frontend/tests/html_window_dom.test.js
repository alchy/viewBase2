// @vitest-environment happy-dom
/** DOM integrace HtmlWindow: iframe se srcdoc, set/append, most zpráv,
 *  žádné Options. happy-dom iframe nenačítá dokument, proto se append
 *  ověřuje přes frontu a přes ručně simulovaný `load`. */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HtmlWindow, createHtmlPlugin } from '../src/plugins/html.js';
import { WindowManager } from '../src/wm/window_manager.js';

const fakeStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

function setup() {
  const container = document.createElement('div');
  Object.defineProperty(container, 'clientWidth', { value: 1600 });
  Object.defineProperty(container, 'clientHeight', { value: 900 });
  container.style.setProperty('--vb-window-key', '#667788');
  document.body.appendChild(container);
  const windowManager = new WindowManager(container, () => {});
  const sendEvent = vi.fn();
  const themeListeners = [];
  const plugin = createHtmlPlugin({
    container, windowManager, sendEvent,
    onThemeChange: (l) => themeListeners.push(l),
  });
  return { container, windowManager, sendEvent, plugin, themeListeners };
}

const srcdocOf = (win) => win.frame.getAttribute('srcdoc');

describe('HtmlWindow', () => {
  beforeEach(() => vi.stubGlobal('localStorage', fakeStorage));

  it('open_window kind html vytvoří okno s iframem (sandbox jen allow-scripts) a obsahem', () => {
    const { windowManager } = setup();
    const win = windowManager.open('html', {
      window_id: 'uzel', title: 'Uzel', width: 420, height: 260, html: '<h1>A</h1>',
    });
    expect(win).toBeInstanceOf(HtmlWindow);
    expect(win.kind).toBe('html');
    expect(win.frame.tagName).toBe('IFRAME');
    // allow-forms jen kvůli události submit (most ji vždy preventDefault-uje)
    expect(win.frame.getAttribute('sandbox')).toBe('allow-scripts allow-forms');
    expect(srcdocOf(win)).toContain('<body><h1>A</h1></body>');
    expect(win.getOptionsItems()).toBeNull();          // žádné Options
  });

  it('html_set nahradí obsah (nový srcdoc), stejné window_id nahradí okno', () => {
    const { windowManager, plugin } = setup();
    const first = windowManager.open('html', { window_id: 'uzel', html: '<i>1</i>' });
    plugin.actions.html_set({ window_id: 'uzel', html: '<b onclick="x">2</b>' });
    expect(srcdocOf(first)).toContain('<body><b>2</b></body>');   // sanitizováno
    const second = windowManager.open('html', { window_id: 'uzel', html: '<u>3</u>' });
    expect(second).not.toBe(first);
    expect(windowManager.get('uzel')).toBe(second);
  });

  it('html_append před načtením iframu frontuje a po load doručí postMessage', () => {
    const { windowManager, plugin } = setup();
    const win = windowManager.open('html', { window_id: 'log', html: '' });
    const posted = [];
    Object.defineProperty(win.frame, 'contentWindow', {
      value: { postMessage: (m) => posted.push(m) }, configurable: true,
    });
    plugin.actions.html_append({ window_id: 'log', html: '<div>a</div>' });
    expect(posted).toEqual([]);                          // ještě nenačteno
    win.frame.dispatchEvent(new Event('load'));
    expect(posted).toEqual([{ type: 'vb-html-append', html: '<div>a</div>' }]);
    plugin.actions.html_append({ window_id: 'log', html: '<div>b</div>' });
    expect(posted).toHaveLength(2);                      // po load rovnou
    expect(win.html).toBe('<div>a</div><div>b</div>');   // obsah pro applyTheme
  });

  it('zpráva vb-html-event z iframu → sendEvent html_event; cizí zdroj se ignoruje', () => {
    const { windowManager, sendEvent } = setup();
    const win = windowManager.open('html', { window_id: 'uzel', html: '' });
    const cw = {};
    Object.defineProperty(win.frame, 'contentWindow', { value: cw, configurable: true });
    window.dispatchEvent(new MessageEvent('message', {
      data: { type: 'vb-html-event', event: 'focus', value: 'srv-0' }, source: cw,
    }));
    expect(sendEvent).toHaveBeenCalledWith({
      type: 'event', event: 'html_event',
      payload: { window_id: 'uzel', event: 'focus', kind: 'click', id: null,
        value: 'srv-0', values: {} },
    });
    // submit formuláře: values = JSON objekt s klíči = name polí
    window.dispatchEvent(new MessageEvent('message', {
      data: { type: 'vb-html-event', kind: 'submit', event: 'ulozit', id: 'uzel-3', value: null,
        values: { jmeno: 'srv-9', typ: 'server', tagy: ['a', 'b'] } },
      source: cw,
    }));
    expect(sendEvent).toHaveBeenLastCalledWith({
      type: 'event', event: 'html_event',
      payload: { window_id: 'uzel', event: 'ulozit', kind: 'submit', id: 'uzel-3', value: null,
        values: { jmeno: 'srv-9', typ: 'server', tagy: ['a', 'b'] } },
    });
    // změna slideru: value zůstane číslo (nepřevádí se na string)
    window.dispatchEvent(new MessageEvent('message', {
      data: { type: 'vb-html-event', kind: 'change', event: 'zatez', id: 'uzel-2', value: 42,
        values: { zatez: 42 } },
      source: cw,
    }));
    expect(sendEvent).toHaveBeenLastCalledWith({
      type: 'event', event: 'html_event',
      payload: { window_id: 'uzel', event: 'zatez', kind: 'change', id: 'uzel-2', value: 42,
        values: { zatez: 42 } },
    });
    window.dispatchEvent(new MessageEvent('message', {
      data: { type: 'vb-html-event', event: 'evil' }, source: {},
    }));
    expect(sendEvent).toHaveBeenCalledTimes(3);
  });

  it('html_patch po načtení iframu pošle vb-html-patch (před load se zahodí)', () => {
    const { windowManager, plugin } = setup();
    const win = windowManager.open('html', { window_id: 'p', html: '' });
    const posted = [];
    Object.defineProperty(win.frame, 'contentWindow', {
      value: { postMessage: (m) => posted.push(m) }, configurable: true,
    });
    plugin.actions.html_patch({ window_id: 'p', id: 'p-1', html: '<div id="p-1">x</div>' });
    expect(posted).toEqual([]);                          // před load: fronta
    win.frame.dispatchEvent(new Event('load'));
    expect(posted).toEqual([{ type: 'vb-html-patch', id: 'p-1', html: '<div id="p-1">x</div>' }]);
    plugin.actions.html_patch({ window_id: 'p', id: 'p-1', html: '<div id="p-1"><b onclick="z">y</b></div>' });
    expect(posted[1]).toEqual({ type: 'vb-html-patch', id: 'p-1', html: '<div id="p-1"><b>y</b></div>' });
  });

  it('nový srcdoc (html_set) zahodí frontu – nový dokument už vše nese', () => {
    const { windowManager, plugin } = setup();
    const win = windowManager.open('html', { window_id: 'p', html: '' });
    const posted = [];
    Object.defineProperty(win.frame, 'contentWindow', {
      value: { postMessage: (m) => posted.push(m) }, configurable: true,
    });
    plugin.actions.html_append({ window_id: 'p', html: '<div>a</div>' });
    plugin.actions.html_set({ window_id: 'p', html: '<div>a</div>' });   // server: celý obsah vč. a
    win.frame.dispatchEvent(new Event('load'));
    expect(posted).toEqual([]);                          // žádný duplicitní append
  });

  it('změna tématu přestaví srcdoc se stejným obsahem', () => {
    const { windowManager, themeListeners } = setup();
    const win = windowManager.open('html', { window_id: 'uzel', html: '<h1>A</h1>' });
    const before = srcdocOf(win);
    win.container.style.setProperty('--vb-window-key', '#ff8800');
    for (const l of themeListeners) l({});
    expect(srcdocOf(win)).not.toBe(before);
    expect(srcdocOf(win)).toContain('<body><h1>A</h1></body>');
  });
});

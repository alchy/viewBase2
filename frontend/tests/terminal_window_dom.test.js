// @vitest-environment happy-dom
/** DOM integrace TerminalWindow: Options „Word Wrap" (stejný mechanismus
 *  jako graf/log – getOptionsItems → WindowManager.optionsSource) a tail
 *  výstupu přišpendlený při změně velikosti okna. */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TerminalWindow } from '../src/plugins/terminal.js';

const fakeStorage = {
  getItem: () => null, setItem: () => {}, removeItem: () => {},
};

function makeTerminal() {
  const container = document.createElement('div');
  Object.defineProperty(container, 'clientWidth', { value: 1600 });
  Object.defineProperty(container, 'clientHeight', { value: 900 });
  document.body.appendChild(container);
  const manager = {
    windows: new Map(), _nextZ: () => 1000, _setActive: () => {},
    refreshOptions: vi.fn(),
  };
  const win = new TerminalWindow({
    id: 'dialog', title: 'Dialog', prompt: '» ', width: 640,
    container, manager, onInput: () => {},
  });
  return { win, manager };
}

/** Výstupní plocha bez layoutu (happy-dom nepočítá geometrii): scrollHeight
 *  se po prvním čtení „přezalomí" na větší hodnotu, jako po reálném resize. */
function stubScroll(output, { scrollTop, clientHeight, before, after }) {
  let reads = 0;
  Object.defineProperty(output, 'clientHeight', { value: clientHeight });
  Object.defineProperty(output, 'scrollHeight', {
    get: () => { reads += 1; return reads === 1 ? before : after; },
  });
  output.scrollTop = scrollTop;
}

describe('TerminalWindow — Options Word Wrap', () => {
  beforeEach(() => vi.stubGlobal('localStorage', fakeStorage));

  it('definuje Options (aktivace okna přepne skupinu na liště)', () => {
    const { win } = makeTerminal();
    const items = win.getOptionsItems();
    expect(items).not.toBeNull();
    const wrap = items.find((i) => i.key === 'word-wrap');
    expect(wrap.label).toBe('Word Wrap');
    expect(wrap.checked).toBe(true);           // výchozí: zalamovat
  });

  it('vypnutí zalamování → řádky se nezalamují a výstup scrolluje do strany', () => {
    const { win, manager } = makeTerminal();
    win.getOptionsItems().find((i) => i.key === 'word-wrap').onToggle(false);
    expect(win.output.style.whiteSpace).toBe('pre');
    expect(win.output.style.overflowX).toBe('auto');
    expect(win.getOptionsItems().find((i) => i.key === 'word-wrap').checked).toBe(false);
    expect(manager.refreshOptions).toHaveBeenCalled();   // checkmark se překreslí
    win.getOptionsItems().find((i) => i.key === 'word-wrap').onToggle(true);
    expect(win.output.style.whiteSpace).toBe('pre-wrap');
  });
});

describe('TerminalWindow — jedna plocha jako AmigaShell', () => {
  beforeEach(() => vi.stubGlobal('localStorage', fakeStorage));

  it('prompt + vstup je poslední řádek výstupní plochy; append vkládá před něj', () => {
    const { win } = makeTerminal();
    expect(win.inputRow.parentElement).toBe(win.output);
    win.append('řádek 1');
    win.append('řádek 2');
    const kids = [...win.output.children];
    expect(kids.slice(0, 2).map((k) => k.textContent)).toEqual(['řádek 1', 'řádek 2']);
    expect(kids[kids.length - 1]).toBe(win.inputRow);       // prompt zůstává poslední
  });

  it('vstup bez rámečku a pozadí, kurzor v barvě klíčů z tématu', () => {
    const { win } = makeTerminal();
    expect(win.input.style.background).toBe('transparent');
    expect(win.input.style.border).toMatch(/^0(px)?$/);
    expect(win.input.style.caretColor).toContain('--vb-terminal-caret');
  });
});

describe('TerminalWindow — tail při změně velikosti', () => {
  beforeEach(() => vi.stubGlobal('localStorage', fakeStorage));

  it('výstup odscrollovaný na konec zůstane na konci i po resize (přezalomení)', () => {
    const { win } = makeTerminal();
    stubScroll(win.output, { scrollTop: 800, clientHeight: 200, before: 1000, after: 1300 });
    win._applySize(500, 400);
    expect(win.output.scrollTop).toBe(1300);
  });

  it('výstup odscrollovaný nahoru (čtení historie) resize nechá být', () => {
    const { win } = makeTerminal();
    stubScroll(win.output, { scrollTop: 300, clientHeight: 200, before: 1000, after: 1300 });
    win._applySize(500, 400);
    expect(win.output.scrollTop).toBe(300);
  });
});

// @vitest-environment happy-dom
/** Most uvnitř iframu HTML okna (BRIDGE_JS) spuštěný nad happy-dom
 *  dokumentem: klik/změna/Enter posílají rodiči vb-html-event s id, kind,
 *  value a values (s typy); vb-html-patch nahradí prvek podle id. */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BRIDGE_JS } from '../src/plugins/html_doc.js';

let posted;
let bridged = false;

function mount(html) {
  document.body.innerHTML = html;
  posted = [];
  Object.defineProperty(window, 'parent', {
    value: { postMessage: (m) => posted.push(m) }, configurable: true,
  });
  // most se registruje na document/window – jen jednou (listenery by se
  // jinak mezi testy kumulovaly); `parent` čte při každém volání živě
  if (!bridged) { new Function(BRIDGE_JS)(); bridged = true; }
}

const FORM_HTML = `
  <div class="vb-el vb-field" id="p-1"><label for="p-1">Název</label>
    <input type="text" id="p-1" name="jmeno" value="srv-9" data-vb-id="p-1"></div>
  <div class="vb-el vb-field" id="p-2"><label for="p-2">Zátěž</label>
    <input type="range" id="p-2" name="zatez" value="50" min="0" max="100" data-vb-id="p-2">
    <output for="zatez">50</output></div>
  <div class="vb-el vb-field vb-check" id="p-3">
    <input type="checkbox" id="p-3" name="sleduj" checked data-vb-id="p-3"> <label>Sledovat</label></div>
  <div class="vb-el" id="p-4"><button data-vb-event="pridat" data-vb-id="p-4">Přidat</button></div>`;

describe('BRIDGE_JS – události prvků', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('klik na tlačítko: kind click, id, event a values všech polí s typy', () => {
    mount(FORM_HTML);
    document.querySelector('button').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(posted).toEqual([{
      type: 'vb-html-event', kind: 'click', event: 'pridat', id: 'p-4', value: null,
      values: { jmeno: 'srv-9', zatez: 50, sleduj: true },
    }]);
  });

  it('změna slideru: kind change, value číslo; output se aktualizuje', () => {
    mount(FORM_HTML);
    const range = document.querySelector('input[type=range]');
    range.value = '77';
    range.dispatchEvent(new Event('input', { bubbles: true }));     // živý output
    expect(document.querySelector('output').textContent).toBe('77');
    expect(posted).toEqual([]);                                       // bez data-vb-live nic
    range.dispatchEvent(new Event('change', { bubbles: true }));     // po puštění
    expect(posted).toHaveLength(1);
    expect(posted[0]).toMatchObject({ kind: 'change', event: 'zatez', id: 'p-2', value: 77 });
    expect(posted[0].values.zatez).toBe(77);
  });

  it('checkbox change → value boolean', () => {
    mount(FORM_HTML);
    const cb = document.querySelector('input[type=checkbox]');
    cb.checked = false;
    cb.dispatchEvent(new Event('change', { bubbles: true }));
    expect(posted[0]).toMatchObject({ kind: 'change', event: 'sleduj', id: 'p-3', value: false });
  });

  it('Enter v textovém poli → kind submit s hodnotou (bez navigace)', () => {
    mount(FORM_HTML);
    const inp = document.querySelector('input[type=text]');
    inp.value = 'srv-1';
    const ev = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    inp.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    expect(posted[0]).toMatchObject({ kind: 'submit', event: 'jmeno', id: 'p-1', value: 'srv-1' });
  });

  it('vb-html-patch nahradí prvek podle id, ostatní pole si drží stav', () => {
    mount(FORM_HTML);
    document.querySelector('input[type=text]').value = 'rozepsáno';
    window.dispatchEvent(new MessageEvent('message', {
      data: { type: 'vb-html-patch', id: 'p-4', html: '<div class="vb-el" id="p-4"><button data-vb-event="pridat" data-vb-id="p-4">Hotovo</button></div>' },
    }));
    expect(document.querySelector('#p-4 button').textContent).toBe('Hotovo');
    expect(document.querySelector('input[type=text]').value).toBe('rozepsáno');
  });

  it('radio change → value = zvolená hodnota, values.rezim totéž', () => {
    mount('<div class="vb-el vb-field vb-radios" id="p-1"><label>Režim</label>'
      + '<label class="vb-radio"><input type="radio" name="rezim" value="auto" checked data-vb-id="p-1"> auto</label>'
      + '<label class="vb-radio"><input type="radio" name="rezim" value="man" data-vb-id="p-1"> ruční</label></div>');
    const man = document.querySelectorAll('input[type=radio]')[1];
    man.checked = true;
    man.dispatchEvent(new Event('change', { bubbles: true }));
    expect(posted[0]).toMatchObject({ kind: 'change', event: 'rezim', id: 'p-1', value: 'man' });
    expect(posted[0].values).toEqual({ rezim: 'man' });
  });

  it('klik na odkaz bez data-vb-event nenaviguje a nic neposílá', () => {
    mount('<a href="https://example.com" id="a">x</a>');
    const ev = new MouseEvent('click', { bubbles: true, cancelable: true });
    document.getElementById('a').dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    expect(posted).toEqual([]);
  });
});

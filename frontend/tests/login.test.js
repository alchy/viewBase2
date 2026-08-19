// @vitest-environment happy-dom
/** Přihlášení k instanci: výzva na jméno a kód + skupina „User" na liště.
 *
 *  Klíčová vlastnost, kterou testy hlídají: výzva se ukáže JEN tehdy, když
 *  je opravdu o co přijít (server hlásí skryté plochy). Na veřejné instanci
 *  by přihlašovací obrazovka přes celý workbench byla čirá otrava. */
import { describe, expect, it, vi } from 'vitest';
import { LoginPrompt } from '../src/core/login_prompt.js';
import { ScreenBar } from '../src/wm/screen_bar.js';

// happy-dom v téhle konfiguraci localStorage nemá; prompt s ním počítá
// (try/catch – v privátním režimu prohlížeče chybí taky), takže si ho testy
// dosadí a rovnou tím ověří, že se jméno opravdu ukládá.
const ulozene = new Map();
window.localStorage = {
  getItem: (k) => (ulozene.has(k) ? ulozene.get(k) : null),
  setItem: (k, v) => ulozene.set(k, String(v)),
};

function prompt() {
  const send = vi.fn();
  const container = document.createElement('div');
  document.body.appendChild(container);
  return { p: new LoginPrompt(container, send), send };
}

const enter = (input) => input.dispatchEvent(
  new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

describe('přihlašovací výzva', () => {
  it('je opravdu ve stránce, ne jen v paměti', () => {
    // Nalezeno v prohlížeči: výzva se postavila, ale nikdo ji nepřipojil do
    // DOMu – jednotkové testy sahaly na `p.el` přímo, takže o tom nevěděly.
    const { p } = prompt();
    p.ask();
    expect(document.querySelector('[data-role="vb-login"]')).toBe(p.el);
    expect(p.visible).toBe(true);
  });

  it('pošle jméno i kód a jméno si zapamatuje', () => {
    const { p, send } = prompt();
    p.ask();
    p.user.value = 'hana';
    p.code.value = '123 456';
    enter(p.code);
    expect(send).toHaveBeenCalledWith({ type: 'login', user: 'hana', code: '123456' });
    expect(window.localStorage.getItem('vb_user')).toBe('hana');
  });

  it('Enter ve jménu jen přeskočí na kód, nic neposílá', () => {
    const { p, send } = prompt();
    p.ask();
    p.user.value = 'hana';
    enter(p.user);
    expect(send).not.toHaveBeenCalled();
  });

  it('bez jména nebo bez kódu neposílá nic', () => {
    const { p, send } = prompt();
    p.ask();
    p.user.value = '';                 // zapamatované jméno smazané
    p.code.value = '123456';
    enter(p.code);
    p.user.value = 'hana';
    p.code.value = '';
    enter(p.code);
    expect(send).not.toHaveBeenCalled();
  });

  it('zapamatované jméno se předvyplní a rovnou se čeká na kód', () => {
    const { p } = prompt();                        // předchozí test uložil 'hana'
    p.ask();
    expect(p.user.value).toBe('hana');
    expect(p.code.value).toBe('');
  });

  it('odmítnutí smaže kód, jméno nechá', () => {
    const { p } = prompt();
    p.ask();
    p.user.value = 'hana';
    p.code.value = '000000';
    p.reject('Sign-in failed');
    expect(p.code.value).toBe('');
    expect(p.user.value).toBe('hana');
    expect(p.el.textContent).toContain('Sign-in failed');
  });

  it('klávesy z výzvy nejdou do grafu', () => {
    const { p } = prompt();
    const vGrafu = vi.fn();
    document.addEventListener('keydown', vGrafu);
    p.ask();
    enter(p.code);
    document.removeEventListener('keydown', vGrafu);
    expect(vGrafu).not.toHaveBeenCalled();
  });
});

describe('lišta screenu – skupina User', () => {
  const bar = () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const sendEvent = vi.fn();
    return { bar: new ScreenBar({ container, sendEvent }), sendEvent, container };
  };
  const groups = (b) => [...b.container.querySelectorAll('[data-role="vb-menu-group"]')]
    .map((g) => g.textContent);
  const openGroup = (b, name) => [...b.container.querySelectorAll('[data-role="vb-menu-group"]')]
    .find((g) => g.textContent === name).click();
  const items = (b) => [...b.container.querySelectorAll('[data-role="vb-menu-item"]')]
    .map((i) => i.textContent.trim());

  it('anonymní relace žádnou skupinu User nemá', () => {
    const b = bar();
    b.bar.setSystemGroup();
    b.bar.setUserGroup(null);
    expect(groups(b)).toEqual(['System']);
  });

  it('přihlášený vidí své jméno, zamčení oken i odhlášení', () => {
    const b = bar();
    b.bar.setUserGroup('hana');
    expect(groups(b)).toEqual(['User: hana']);
    openGroup(b, 'User: hana');
    expect(items(b)).toEqual(['Lock All Windows', 'Log Out']);
  });

  it('Log Out pošle odhlášení serveru', () => {
    const b = bar();
    b.bar.setUserGroup('hana');
    openGroup(b, 'User: hana');
    [...b.container.querySelectorAll('[data-role="vb-menu-item"]')]
      .find((i) => i.textContent.includes('Log Out')).click();
    expect(b.sendEvent).toHaveBeenCalledWith({ type: 'logout' });
  });
});

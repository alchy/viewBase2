import { describe, expect, it } from 'vitest';
import {
  BOILERPLATE_CSS, BRIDGE_JS, THEME_VAR_NAMES, buildSrcdoc, sanitizeHtml,
} from '../src/plugins/html_doc.js';

describe('sanitizeHtml – bez JS uživatele, bez navigace', () => {
  it('odstraní <script> včetně obsahu (i velká písmena, i víc kusů)', () => {
    expect(sanitizeHtml('<p>a</p><script>alert(1)</script><b>b</b><SCRIPT src=x></SCRIPT>'))
      .toBe('<p>a</p><b>b</b>');
  });
  it('odstraní on* atributy (různé uvozovky, bez uvozovek)', () => {
    expect(sanitizeHtml('<a onclick="x()" href="#">a</a><div onMouseOver=\'y\' class="c" onload=z>d</div>'))
      .toBe('<a href="#">a</a><div class="c">d</div>');
  });
  it('zneškodní javascript: v href/src', () => {
    expect(sanitizeHtml('<a href="javascript:evil()">a</a><a href=" JavaScript:x">b</a>'))
      .toBe('<a href="#">a</a><a href="#">b</a>');
  });
  it('nechá vlastní <style>, data-vb-event, běžné HTML beze změny', () => {
    const html = '<style>b{color:red}</style><button data-vb-event="focus" data-vb-value="srv-0">Z</button>';
    expect(sanitizeHtml(html)).toBe(html);
  });
  it('slovo „on" v textu ani atribut bez „on" prefixu nesežere', () => {
    const html = '<p>zapnuto: on</p><i title="button on">x</i><b class="one">y</b>';
    expect(sanitizeHtml(html)).toBe(html);
  });
});

describe('BRIDGE_JS – submit formuláře', () => {
  it('most chytá submit, sbírá FormData do values a posílá vb-html-event', () => {
    expect(BRIDGE_JS).toContain('"submit"');
    expect(BRIDGE_JS).toContain('collect(f)');      // hodnoty polí formuláře
    expect(BRIDGE_JS).toContain('vb-html-patch');   // patch prvku podle id
    expect(BRIDGE_JS).toContain('preventDefault');   // nikdy nenaviguje
  });
  it('boilerplate stylizuje input/select/textarea (= pole control okna)', () => {
    expect(BOILERPLATE_CSS).toContain('input,select,textarea');
  });
});

describe('buildSrcdoc', () => {
  const themeVars = {
    '--vb-window-body-fg': '#111', '--vb-window-key': '#667788',
    '--vb-html-accent': '#5a6573', '--vb-window-output-bg': 'rgba(0,0,0,0.06)',
  };
  it('proměnné tématu se propíšou do :root, boilerplate i most jsou v dokumentu', () => {
    const doc = buildSrcdoc({ themeVars, html: '<h1>A</h1>' });
    expect(doc.startsWith('<!doctype html>')).toBe(true);
    expect(doc).toContain('--vb-window-key:#667788');
    expect(doc).toContain(BOILERPLATE_CSS);
    expect(doc).toContain('vb-html-event');            // most
    expect(doc).toContain('<body><h1>A</h1></body>');
  });
  it('HTML uživatele projde sanitizací', () => {
    const doc = buildSrcdoc({ themeVars, html: '<b onclick="x">B</b><script>1</script>' });
    expect(doc).toContain('<body><b>B</b></body>');
  });
  it('THEME_VAR_NAMES obsahuje vše, co boilerplate používá', () => {
    for (const name of THEME_VAR_NAMES) expect(BOILERPLATE_CSS.includes(name)).toBe(true);
  });
});

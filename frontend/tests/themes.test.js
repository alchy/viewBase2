import { describe, expect, it, vi } from 'vitest';
import { applyCssVars, deepMerge, resolveTheme } from '../src/themes/manager.js';
import { THEMES } from '../src/themes/themes.js';

describe('resolveTheme', () => {
  it('vrátí vestavěné téma podle jména', () => {
    expect(resolveTheme('modern')).toBe(THEMES.modern);
  });

  it('neznámé jméno → console.error + fallback na modern', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(resolveTheme('vaporwave')).toBe(THEMES.modern);
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });

  it('dict se deep-merguje přes modern', () => {
    const theme = resolveTheme({ background: '#000000', node: { size: 2 } });
    expect(theme.background).toBe('#000000');
    expect(theme.node.size).toBe(2);
    expect(theme.node.color).toBe(THEMES.modern.node.color);  // ze základu
    expect(theme.edge).toEqual(THEMES.modern.edge);
  });

  it('merge nemutuje vestavěný základ', () => {
    resolveTheme({ node: { size: 9 } });
    expect(THEMES.modern.node.size).toBe(1.0);
  });

  it('pole (paleta) se přepisuje celé, nemerguje po prvcích', () => {
    const theme = deepMerge(THEMES.modern, { palette: ['#111111'] });
    expect(theme.palette).toEqual(['#111111']);
  });

  it('cyber je vestavěné: tmavé pozadí a zapnutý bloom', () => {
    const theme = resolveTheme('cyber');
    expect(theme.background).toBe('#0a0e1a');
    expect(theme.bloom.enabled).toBe(true);
    expect(theme.palette.length).toBeGreaterThanOrEqual(8);
  });

  it('workbench-gray je vestavěné: chrome z JSON, graf zděděný z modern', () => {
    const theme = resolveTheme('workbench-gray');
    expect(theme.window.bodyBg).toBe('#0055aa');
    expect(theme.window.headerStripe).toBe(true);
    expect(theme.screenBar.bg).toBe('#cfe1fb');
    // graf (node/edge/label/bloom) NENÍ ve workbench JSON definovaný –
    // zůstává zděděný z modern (design §7: paleta grafu řídí vývojář)
    expect(theme.node).toEqual(THEMES.modern.node);
    expect(theme.edge).toEqual(THEMES.modern.edge);
    expect(theme.bloom).toEqual(THEMES.modern.bloom);
  });

  it('workbench-amiga: modrý WB 1.3 vzhled z reference', () => {
    const theme = resolveTheme('workbench-amiga');
    expect(theme.background).toBe('#0057af');       // modrá plocha
    expect(theme.window.headerBg).toBe('#ffffff');  // bílá lišta…
    expect(theme.window.headerFg).toBe('#0057af');  // …s modrým textem/pruhy
    expect(theme.window.headerStripe).toBe(true);
    expect(theme.window.border).toBe('#ffffff');    // bílé rámy oken
    expect(theme.screenBar).toEqual({ bg: '#ffffff', fg: '#0057af', menuAttach: true });
    expect(theme.node).toEqual(THEMES.modern.node); // graf zděděný z modern
  });

  it('workbench merge nemutuje modern', () => {
    resolveTheme('workbench-amiga');
    expect(THEMES.modern.window.headerBg).toBe('#d8dde6');
  });
});

function fakeRoot() {
  const vars = new Map();
  return { vars, style: { setProperty: (k, v) => vars.set(k, v) } };
}

describe('HTML okno – proměnné tématu', () => {
  it('modern: --vb-html-accent = gadget, output-bg default', () => {
    const root = fakeRoot();
    applyCssVars(resolveTheme('modern'), root);
    expect(root.vars.get('--vb-html-accent')).toBe('#5a6573');
    expect(root.vars.get('--vb-window-output-bg')).toBe('rgba(0,0,0,0.06)');
  });

  it('cyber: vlastní output-bg', () => {
    const root = fakeRoot();
    applyCssVars(resolveTheme('cyber'), root);
    expect(root.vars.get('--vb-html-accent')).toBe('#28d7fe');
    expect(root.vars.get('--vb-window-output-bg')).toBe('rgba(255,255,255,0.05)');
  });

  it('terminál: workbench bez podkladu plochy (holé tělo), modern jemný podklad; kurzor = klíče', () => {
    const wb = fakeRoot(); applyCssVars(resolveTheme('workbench-amiga'), wb);
    expect(wb.vars.get('--vb-terminal-bg')).toBe('transparent');
    expect(wb.vars.get('--vb-terminal-caret')).toBe('#ff8800');
    const mo = fakeRoot(); applyCssVars(resolveTheme('modern'), mo);
    expect(mo.vars.get('--vb-terminal-bg')).toBe('rgba(0,0,0,0.06)');
    expect(mo.vars.get('--vb-terminal-caret')).toBe('#667788');
  });

  it('sizing gadget: workbench neprůhledná krabička v barvě lišty, modern průhledný glyf', () => {
    const wb = fakeRoot(); applyCssVars(resolveTheme('workbench-amiga'), wb);
    expect(wb.vars.get('--vb-window-grip-bg')).toBe('#ffffff');
    expect(wb.vars.get('--vb-window-grip-fg')).toBe('#0057af');
    expect(wb.vars.get('--vb-window-grip-border')).toBe('#0057af');
    const mo = fakeRoot(); applyCssVars(resolveTheme('modern'), mo);
    expect(mo.vars.get('--vb-window-grip-bg')).toBe('transparent');
    expect(mo.vars.get('--vb-window-grip-fg')).toBe('#1f2430');
  });

  it('workbench-amiga: htmlAccent bílá (gadget splývá s modrým tělem)', () => {
    const root = fakeRoot();
    applyCssVars(resolveTheme('workbench-amiga'), root);
    expect(root.vars.get('--vb-html-accent')).toBe('#ffffff');
    expect(root.vars.get('--vb-window-output-bg')).toBe('rgba(0,0,0,0.18)');
  });
});

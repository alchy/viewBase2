import { THEMES } from './themes.js';
import { deepMerge, isPlainObject } from './merge.js';

export { deepMerge };

/** Název vestavěného tématu, nebo dict (deep merge přes `modern`).
 *  Neznámé jméno → console.error + fallback na modern (klient nesmí
 *  spadnout; Python validuje vestavěná jména už v Canvasu). */
export function resolveTheme(nameOrDict) {
  if (typeof nameOrDict === 'string') {
    if (THEMES[nameOrDict]) return THEMES[nameOrDict];
    console.error(`viewbase: neznámé téma '${nameOrDict}' – používám 'modern'`);
    return THEMES.modern;
  }
  if (isPlainObject(nameOrDict)) return deepMerge(THEMES.modern, nameOrDict);
  if (nameOrDict != null) {
    console.error('viewbase: theme musí být string nebo objekt – používám modern');
  }
  return THEMES.modern;
}

/** Zapíše CSS custom properties tématu (--vb-*) na :root. */
export function applyCssVars(theme, root = document.documentElement) {
  for (const [name, value] of Object.entries(theme.detailBox)) {
    root.style.setProperty(name, value);
  }
  const w = theme.window;
  if (w) {
    const map = {
      '--vb-window-header-bg': w.headerBg,
      '--vb-window-header-fg': w.headerFg,
      '--vb-window-gadget': w.gadget,
      '--vb-window-body-bg': w.bodyBg,
      '--vb-window-body-fg': w.bodyFg,
      '--vb-window-key': w.key,
      '--vb-window-dock-bg': w.dockBg,
      '--vb-window-shadow': w.shadow,
      '--vb-window-border': w.border,
      // HTML okno (spec 2026-08-17): akcent odkazů/tlačítek = gadget, ale
      // téma smí přebít (workbench-amiga má gadget = barva těla); pozadí
      // výstupní plochy sdílí terminál i <pre>/<code> v HTML okně.
      '--vb-html-accent': w.htmlAccent ?? w.gadget,
      '--vb-window-output-bg': w.outputBg ?? 'rgba(0,0,0,0.06)',
      // Terminál je vždy jedna plocha jako AmigaShell (docs/images/workbench-
      // ref/amigashell-hamurabi.png): výstup i prompt bez odděleného vstupního
      // řádku; téma řídí jen barvy – podklad plochy (`terminalBg`, workbench
      // transparent = holé tělo okna) a kurzor (barva klíčů).
      '--vb-terminal-bg': w.terminalBg ?? w.outputBg ?? 'rgba(0,0,0,0.06)',
      '--vb-terminal-caret': w.key ?? w.gadget ?? 'auto',
      // Sizing gadget v pravém dolním rohu: Workbench (`bevel: "hard"`) ho
      // kreslí jako NEPRŮHLEDNOU krabičku v rámu (bílý čtverec s glyfem v
      // barvě lišty – docs/images/workbench-ref/amigashell-hamurabi.png),
      // obsah okna pod ním neprosvítá; ostatní témata jen glyf na těle okna.
      '--vb-window-grip-bg': w.bevel === 'hard' ? (w.headerBg ?? '#ffffff') : 'transparent',
      '--vb-window-grip-fg': w.bevel === 'hard' ? (w.headerFg ?? w.gadget) : (w.bodyFg ?? '#8a93a3'),
      '--vb-window-grip-border': w.bevel === 'hard' ? (w.headerFg ?? w.gadget) : 'transparent',
    };
    for (const [name, value] of Object.entries(map)) {
      if (value != null) root.style.setProperty(name, value);
    }
    // Pruhovaný titulek (§2 designu reference – AmigaDOS okno) – jen když
    // ho téma explicitně chce (`headerStripe: true`), jinak zpátky na
    // 'none' (jiná témata nesmí zdědit pruh od dřívějšího workbench tématu).
    root.style.setProperty('--vb-window-header-pattern', w.headerStripe
      ? `repeating-linear-gradient(0deg, ${w.headerFg}22 0px, ${w.headerFg}22 1px, transparent 1px, transparent 4px)`
      : 'none');
  }
  // Lišta screenu podle tématu (workbench-amiga: bílá lišta s modrým
  // textem jako na WB 1.3 referenci) – fallbacky drží dnešní světle
  // šedý vzhled pro témata bez `screenBar`.
  const bar = theme.screenBar;
  if (bar) {
    if (bar.bg != null) root.style.setProperty('--vb-screenbar-bg', bar.bg);
    if (bar.fg != null) root.style.setProperty('--vb-screenbar-fg', bar.fg);
  }
}

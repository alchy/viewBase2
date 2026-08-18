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

/** 16 ANSI barev z palety tématu: 0–7 základní (černá + 6 z palety + šedá),
 *  8–15 jasné (opakují paletu, poslední bílá z textu okna). Terminál tak
 *  používá barvy workbenche místo výchozích xtermových. */
function ansiFromPalette(theme, w) {
  const p = theme.palette ?? [];
  const pick = (i, fallback) => p[i] ?? fallback;
  const black = w.bodyBg && !String(w.bodyBg).startsWith('rgba') ? w.bodyBg : '#101418';
  const white = w.bodyFg ?? '#e8eef6';
  const base = [
    black,                       // 0 černá = tělo okna
    pick(1, '#e8553a'),          // 1 červená
    pick(2, '#2fa84f'),          // 2 zelená
    pick(4, '#e8a02f'),          // 3 žlutá
    pick(0, '#2f7fe8'),          // 4 modrá
    pick(3, '#8a4fe8'),          // 5 purpurová
    pick(5, '#1fb3c4'),          // 6 tyrkysová
    white,                       // 7 bílá = text okna
  ];
  return [...base, ...base];     // 8–15 jasné varianty (stejné odstíny)
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
      // Rám okna (wm/frame.js) – scrollbary vpravo/dole + sizing gadget v
      // rohu, aktivní plocha o pruhy menší (WB 1.3 reference docs/images/
      // workbench-ref/window-corner-scrollbars-wb13.jpg). Stejný look ve
      // VŠECH tématech, liší se jen paleta: `frameLine` (linky, šipky, dráha),
      // `frameKnob` (knob), `frameGlow` (box-shadow knobu – cyber neon).
      // Default: workbench bílá lišta na modrém těle, jinak barva gadgetů.
      '--vb-window-frame': w.frame === false ? '0' : '1',
      // Shell okno (xterm.js): pozadí i ANSI barvy z tématu, ať terminál
      // ladí se zbytkem workbenche (`ls --color` nesvítí cizími barvami).
      // Pozor: xterm kreslí do canvasu a `transparent` neumí – proto tady
      // vždy KONKRÉTNÍ barva: `terminalBg` jen když je skutečná (workbench
      // ji má „transparent" kvůli dialogovému terminálu), jinak tělo okna.
      // ANSI se odvodí z palety grafu; téma smí přebít `window.ansi`.
      '--vb-term-bg': (w.terminalBg && w.terminalBg !== 'transparent')
        ? w.terminalBg : (w.bodyBg ?? '#101418'),
      '--vb-frame-line': w.frameLine ?? (w.bevel === 'hard' ? (w.headerBg ?? '#ffffff') : (w.gadget ?? '#8a93a3')),
      '--vb-frame-knob': w.frameKnob ?? w.frameLine ?? (w.bevel === 'hard' ? (w.headerBg ?? '#ffffff') : (w.gadget ?? '#8a93a3')),
      '--vb-frame-glow': w.frameGlow ?? 'none',
      // Sizing gadget v rohu rámu: Workbench neprůhledná krabička v barvě lišty
      // s glyfem v barvě jejího textu (amigashell-hamurabi.png); ostatní témata
      // průhledný roh (leží v rámu, ne na obsahu) s glyfem v barvě knobu.
      '--vb-window-grip-bg': w.bevel === 'hard' ? (w.headerBg ?? '#ffffff') : 'transparent',
      '--vb-window-grip-fg': w.bevel === 'hard' ? (w.headerFg ?? w.gadget) : (w.frameKnob ?? w.gadget ?? '#8a93a3'),
      '--vb-window-grip-border': w.bevel === 'hard' ? (w.headerFg ?? w.gadget) : (w.frameLine ?? w.gadget ?? '#8a93a3'),
    };
    for (const [name, value] of Object.entries(map)) {
      if (value != null) root.style.setProperty(name, value);
    }
    // ANSI 0–15 pro terminál: `window.ansi` (16 barev), jinak paleta grafu
    // doplněná o černou/bílou z těla okna – terminál tak mluví barvami tématu.
    const ansi = Array.isArray(w.ansi) && w.ansi.length >= 16
      ? w.ansi : ansiFromPalette(theme, w);
    ansi.forEach((color, i) => root.style.setProperty(`--vb-term-ansi-${i}`, color));
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

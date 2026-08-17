/** Dokument HTML okna (spec 2026-08-17): čisté funkce bez DOM, aby se daly
 *  testovat – skládají `srcdoc` sandboxovaného iframu z boilerplate CSS
 *  (barvy z proměnných tématu → okno vypadá jako detail/control/terminál),
 *  sanitizovaného HTML od serveru a našeho mostu (kliky → rodič).
 *
 *  Proč iframe a ne innerHTML do těla okna: vlastní dokument = vlastní CSS
 *  (HTML od aplikace nerozbije workbench a naopak) a `sandbox` drží obsah
 *  na uzdě (žádná navigace, žádný cizí JS). Sanitizace tu není „proti
 *  útočníkovi" – obsah posílá vlastní backend – ale proti nehodě: aby v
 *  okně neběžel omylem vložený skript a odkaz neodnavigoval iframe pryč. */

/** Proměnné tématu, které boilerplate čte (zapisuje themes/manager.js na
 *  kontejner screenu – témata jsou per screen, ne globální). */
export const THEME_VAR_NAMES = [
  '--vb-window-body-fg', '--vb-window-key', '--vb-html-accent',
  '--vb-window-output-bg',
];

/** Výchozí vzhled obsahu – každé pravidlo má poznámku, ČEMU v ostatních
 *  oknech odpovídá, ať je vidět, odkud se sjednocení bere. Vlastní <style>
 *  v HTML od aplikace přijde až za tímhle, takže má poslední slovo. */
export const BOILERPLATE_CSS = [
  // = BaseWindow: 13px/1.5 system-ui, barva těla; pozadí je tělo okna
  'html,body{margin:0;background:transparent;color:var(--vb-window-body-fg);font:13px/1.5 system-ui,-apple-system,sans-serif}',
  'body{padding:8px 10px}',
  'h1,h2,h3{margin:0 0 6px;font-weight:600;line-height:1.25;text-wrap:balance}',
  'h1{font-size:17px}h2{font-size:15px}',
  // h3 = tlumený popisek v barvě klíčů (detail/control levý sloupec)
  'h3{font-size:11px;color:var(--vb-window-key);text-transform:uppercase;letter-spacing:.05em;margin-top:10px}',
  'p,ul,ol,pre,blockquote{margin:0 0 8px}ul,ol{padding-left:20px}',
  // odkazy/tlačítka/linky v akcentu (= gadget, téma smí přebít)
  'a{color:var(--vb-html-accent)}',
  'hr{border:0;border-top:1px solid color-mix(in srgb,var(--vb-window-key) 45%,transparent);margin:8px 0}',
  // tabulka = detail okno: hlavičky a první sloupec .kv v barvě klíčů
  'table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums}',
  'th{text-align:left;font-weight:500;color:var(--vb-window-key);padding:3px 10px 3px 0;border-bottom:1px solid color-mix(in srgb,var(--vb-window-key) 45%,transparent);white-space:nowrap}',
  'td{padding:2px 10px 2px 0;vertical-align:top}.num{text-align:right}',
  'table.kv td:first-child{color:var(--vb-window-key);white-space:nowrap;padding-right:12px}',
  // code/pre = výstupní plocha terminálu
  'code,pre,kbd{font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace}',
  'code{background:var(--vb-window-output-bg);padding:0 4px;border-radius:3px}',
  'pre{background:var(--vb-window-output-bg);border-radius:4px;padding:6px 8px;overflow:auto;white-space:pre-wrap;word-break:break-word}',
  'pre code{background:none;padding:0}',
  'blockquote{padding:2px 10px;border-left:3px solid var(--vb-html-accent);color:var(--vb-window-key)}',
  // button = tlačítko „Použít" control okna (rámeček v akcentu, průhledné)
  'button,.vb-btn{cursor:pointer;padding:3px 12px;border:1px solid var(--vb-html-accent);border-radius:4px;background:transparent;color:inherit;font:inherit}',
  '[data-vb-event]{cursor:pointer}',
  '.vb-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}',
  '.vb-key,.small{color:var(--vb-window-key)}.small{font-size:11.5px}',
  '.vb-tag{display:inline-block;padding:0 7px;border:1px solid var(--vb-window-key);border-radius:9px;font-size:11px;line-height:16px;margin-right:4px}',
  // sémantické barvy záměrně MIMO téma – čitelné na světlém i tmavém
  '.vb-ok{color:#2fa84f}.vb-warn{color:#e8a02f}.vb-err{color:#e8553a}',
  '.vb-bar{height:6px;background:var(--vb-window-output-bg);border-radius:3px;overflow:hidden}',
  '.vb-bar>i{display:block;height:100%;background:var(--vb-html-accent)}',
].join('\n');

/** Most uvnitř iframu – jediný JS, který v okně běží (proto
 *  sandbox="allow-scripts"). Klik na [data-vb-event] → zpráva rodiči;
 *  každý klik na <a> je preventDefault (žádná navigace); zpráva
 *  vb-html-append připíše fragment a drží konec, když byl vidět (stejná
 *  „tail" logika jako terminál). */
export const BRIDGE_JS = [
  '(function(){',
  'document.addEventListener("click",function(e){',
  ' var el=e.target&&e.target.closest?e.target.closest("[data-vb-event]"):null;',
  ' if(el){e.preventDefault();parent.postMessage({type:"vb-html-event",event:el.getAttribute("data-vb-event"),value:el.hasAttribute("data-vb-value")?el.getAttribute("data-vb-value"):null},"*");return;}',
  ' if(e.target&&e.target.closest&&e.target.closest("a"))e.preventDefault();',
  '});',
  'window.addEventListener("message",function(e){',
  ' if(!e.data||e.data.type!=="vb-html-append")return;',
  ' var d=document.scrollingElement||document.documentElement;',
  ' var pinned=d.scrollTop+d.clientHeight>=d.scrollHeight-4;',
  ' document.body.insertAdjacentHTML("beforeend",e.data.html);',
  ' if(pinned)d.scrollTop=d.scrollHeight;',
  '});',
  '})();',
].join('');

/** Odstraň <script>, on* atributy a javascript: URL. Regexy stačí – cíl je
 *  „nehoda", ne obrana; složitější sanitizer by tu byl přes míru. Atribut
 *  se pozná podle mezery před `on…=`, takže slovo „on" v textu nebo
 *  `class="one"` (bez `=` hned za písmeny) zůstanou. */
export function sanitizeHtml(html) {
  return String(html ?? '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(\s(?:href|src)\s*=\s*)(["']?)\s*javascript:[^"'\s>]*\2/gi, '$1"#"');
}

/** Aktuální hodnoty proměnných tématu z prvku (kontejner screenu). */
export function readThemeVars(el) {
  const cs = getComputedStyle(el);
  const vars = {};
  for (const name of THEME_VAR_NAMES) {
    const value = cs.getPropertyValue(name).trim();
    if (value) vars[name] = value;
  }
  return vars;
}

/** Celý dokument iframu: téma → :root, boilerplate, sanitizované HTML, most. */
export function buildSrcdoc({ themeVars = {}, html = '' } = {}) {
  const rootVars = Object.entries(themeVars)
    .map(([k, v]) => `${k}:${v}`).join(';');
  return '<!doctype html><html><head><meta charset="utf-8">'
    + `<style>:root{${rootVars}}\n${BOILERPLATE_CSS}</style></head>`
    + `<body>${sanitizeHtml(html)}</body>`
    + `<script>${BRIDGE_JS}</script></html>`;
}

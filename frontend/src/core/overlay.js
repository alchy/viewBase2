/** Celoobrazovková hláška v Amiga stylu – JEDNA funkce pro všechny (DRY).
 *
 *  Věrně podle reference (docs/images/workbench-ref/guru-meditation-
 *  toastytech.png): černá plocha přes celou aplikaci a NAHOŘE box **přes
 *  celou šířku obrazovky** s tlustým rámem, vystředěným textem v JEDNÉ
 *  velikosti monospace písma. Volby:
 *
 *  - `color`  – barva rámu i textu (červená = něco se rozbilo, zelená =
 *               systém čeká na tebe),
 *  - `flash`  – originální amiga blikání (jen Guru; výzva k odemčení ne),
 *  - `input`  – textové pole ve stejném stylu (výzva k odemčení).
 *
 *  Řádky se přidávají `line(text)`, aby měly všechny stejnou velikost –
 *  žádné „malé písmo pod tím". */

const STYLE_ID = 'vb-overlay-style';
const BORDER_PX = 4;          // tlustý rám jako na referenci
// stejný mono stack jako terminál a HTML okno – „Courier New" vypadal proti
// zbytku workbenche cize (uživatelská poznámka)
const FONT = '600 16px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace';

function ensureKeyframes() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent =
    '@keyframes vb-guru-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0.15; } }';
  document.head.appendChild(style);
}

export function createOverlay({ color, flash = false, role = 'vb-overlay',
  input = false } = {}) {
  ensureKeyframes();

  const el = document.createElement('div');
  el.dataset.role = role;
  el.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:9999', 'display:none',
    'background:#000000', 'user-select:none',
  ].join(';');

  const box = document.createElement('div');
  box.dataset.role = `${role}-box`;
  box.style.cssText = [
    // nahoře a přes CELOU šířku (reference), ne plovoucí box uprostřed
    'position:absolute', 'top:0', 'left:0', 'right:0',
    `border:${BORDER_PX}px solid ${color}`, 'padding:10px 16px', `color:${color}`,
    'text-align:center', `font:${FONT}`, 'letter-spacing:0.5px',
    'white-space:pre-wrap', 'word-break:break-word', 'box-sizing:border-box',
    flash ? 'animation:vb-guru-blink 1s step-start infinite' : '',
  ].filter(Boolean).join(';');
  el.append(box);

  /** Další řádek boxu – stejné písmo jako ostatní (jedna velikost). */
  const line = (text = '', lineRole = null) => {
    const div = document.createElement('div');
    if (lineRole) div.dataset.role = lineRole;
    div.textContent = text;
    box.appendChild(div);
    return div;
  };

  /** Pole ve stejném stylu jako zbytek boxu. Výzva k odemčení má jedno
   *  (kód), přihlášení dvě (jméno a kód) – proto továrnička, ne jeden pevný
   *  input: jinak by se stylování rozešlo hned u druhého pole. */
  const field = ({ name = 'input', width = '10ch', spacing = '3px' } = {}) => {
    const el2 = document.createElement('input');
    el2.type = 'text';
    el2.dataset.role = `${role}-${name}`;
    el2.style.cssText = [
      'font:inherit', `color:${color}`, 'background:transparent',
      `border:2px solid ${color}`, 'padding:2px 10px', `width:${width}`,
      'text-align:center', `letter-spacing:${spacing}`, 'outline:none',
      'margin:8px 0',
    ].join(';');
    return el2;
  };

  return { el, box, line, field, input: input ? field() : null };
}

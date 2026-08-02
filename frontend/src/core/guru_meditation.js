const STYLE_ID = 'vb-guru-style';

function ensureBlinkKeyframes() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes vb-guru-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0.15; } }
  `;
  document.head.appendChild(style);
}

/** Guru Meditation – Amiga-style "systém spadl" obrazovka (uživatelský
 * požadavek: neodchycená JS chyba na frontendu, ztráta WS spojení /
 * protocol_mismatch, a backend log úrovně error mají všechny stejný,
 * věrně replikovaný vizuál – ne tichý console.error). Blokuje CELOU
 * aplikaci (nejvyšší z-index, pointer-events), dokud uživatel nezareaguje
 * – originál chtěl konkrétně levé tlačítko myši, ale to na Macu (trackpad/
 * jednotlačítková myš) nedává smysl, proto libovolné tlačítko myši NEBO
 * Esc zavírají stejně. */
export class GuruMeditation {
  constructor(container = document.body) {
    ensureBlinkKeyframes();
    this.reason = null;         // 'connection' se dá auto-dismissnout, jiné ne
    this.el = document.createElement('div');
    this.el.dataset.role = 'vb-guru-meditation';
    this.el.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:9999', 'display:none',
      'background:#000000', 'cursor:pointer', 'font-family:"Courier New",monospace',
      'user-select:none',
    ].join(';');

    // Věrná replika – červený text v červeně orámovaném boxu na černém
    // pozadí (ne bílý text na plné červené liště, což byl první, míň
    // přesný pokus – opraveno podle referenčního screenshotu od uživatele).
    this.box = document.createElement('div');
    this.box.dataset.role = 'vb-guru-box';
    this.box.style.cssText = [
      'position:absolute', 'top:50%', 'left:50%', 'transform:translate(-50%,-50%)',
      'border:3px solid #ff0000', 'padding:18px 28px', 'color:#ff0000',
      'text-align:center', 'font-size:18px', 'font-weight:bold',
      'letter-spacing:0.5px', 'white-space:pre-wrap', 'word-break:break-word',
      'max-width:80%', 'box-sizing:border-box',
      'animation:vb-guru-blink 1s step-start infinite',
    ].join(';');

    this.bar = document.createElement('div');
    this.bar.dataset.role = 'vb-guru-bar';
    // NE "left mouse button" – Mac nemá rozlišitelné levé/pravé tlačítko
    // (trackpad, jednotlačítková myš), viz dismiss handler níže.
    this.bar.textContent = 'Software Failure.  Press mouse button or Esc to continue.';

    // Druhý řádek boxu: SKUTEČNÝ důvod chyby (uživatelská oprava: „původní
    // amiga hash kód je nahrazen reálným důvodem – například connection
    // lost"). Žádný zvláštní text pod boxem – všechno je v boxu.
    this.code = document.createElement('div');
    this.code.dataset.role = 'vb-guru-code';
    this.code.style.cssText = 'margin-top:6px';

    this.box.append(this.bar, this.code);
    this.el.append(this.box);
    // Libovolné tlačítko myši (ne jen levé – Mac) i Esc zavírají.
    this.el.addEventListener('mousedown', () => this.hide());
    this._onKeydown = (e) => {
      if (e.code === 'Escape' && this.visible) {
        e.preventDefault();
        this.hide();
      }
    };
    window.addEventListener('keydown', this._onKeydown);
    container.appendChild(this.el);
  }

  /** `kind`: 'frontend_error' | 'connection_lost' | 'backend_error'.
   * `message`: skutečný důvod – jde PŘÍMO do boxu místo Amiga hash kódu
   * (tohle je vývojářský nástroj, důvod je užitečnější než hex). */
  show(kind, message) {
    this.reason = kind;
    this.code.textContent = `Guru Meditation: ${message ?? kind}`;
    this.el.style.display = 'block';
  }

  hide() {
    this.el.style.display = 'none';
    this.reason = null;
  }

  get visible() {
    return this.el.style.display !== 'none';
  }

  /** Voláno při úspěšném reconnectu – zmizí to samo JEN pokud spadlo kvůli
   * ztrátě spojení (na skutečnou JS/backend chybu žádný signál "je to
   * spravené" neexistuje, tam musí kliknout uživatel, přesně jako
   * originál). */
  dismissIfConnectionRecovered() {
    if (this.reason === 'connection_lost') this.hide();
  }
}

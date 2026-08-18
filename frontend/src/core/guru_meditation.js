import { createOverlay } from './overlay.js';

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
    this.reason = null;         // 'connection' se dá auto-dismissnout, jiné ne
    // Věrná replika – červený text v červeně orámovaném boxu na černém
    // pozadí (ne bílý text na plné červené liště, což byl první, míň
    // přesný pokus – opraveno podle referenčního screenshotu od uživatele).
    // Rám i plocha jsou sdílené s výzvou k odemčení okna (core/overlay.js),
    // liší se barvou a blikáním.
    const { el, box, line } = createOverlay({
      color: '#ff0000', flash: true, role: 'vb-guru-meditation',
    });
    this.el = el;
    this.el.style.cursor = 'pointer';
    this.box = box;
    this.box.dataset.role = 'vb-guru-box';

    // NE "left mouse button" – Mac nemá rozlišitelné levé/pravé tlačítko
    // (trackpad, jednotlačítková myš), viz dismiss handler níže.
    this.bar = line('Software Failure.  Press mouse button or Esc to continue.',
      'vb-guru-bar');
    // Druhý řádek boxu: SKUTEČNÝ důvod chyby (uživatelská oprava: „původní
    // amiga hash kód je nahrazen reálným důvodem – například connection
    // lost"). Žádný zvláštní text pod boxem – všechno je v boxu.
    this.code = line('', 'vb-guru-code');
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
   * `message`: skutečný důvod, ANGLICKY a stručně („Connection Lost",
   * text výjimky) – jde PŘÍMO do boxu, bez „Guru Meditation" prefixu
   * i bez Amiga hash kódu (uživatelská oprava: stačí důvod, zachovat
   * jen styl). */
  show(kind, message) {
    this.reason = kind;
    this.code.textContent = message ?? kind;
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

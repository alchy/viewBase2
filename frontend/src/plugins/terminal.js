/** Terminal plugin: konzolové okno – scrollovatelný append-only výstup +
 *  řádek se vstupem. Enter pošle event terminal_input; server připisuje
 *  výstup akcí terminal_append (obsluhuje ji tenhle plugin). Chrome dědí
 *  z BaseWindow (wm/). Vstup je <input>, takže KeyboardControls
 *  (isEditableFocused) při psaní neovládá kameru.
 *
 *  Options (přes getOptionsItems – TÝŽ mechanismus jako graf a log okno:
 *  aktivní okno přepne skupinu Options na liště screenu do svého kontextu):
 *  „Word Wrap" – zalamovat dlouhé řádky výstupu (výchozí), nebo je nechat
 *  v jednom řádku a scrollovat do strany. Stav žije v okně (jako filtry
 *  log okna), nepersistuje se. */
import { BaseWindow } from '../wm/base_window.js';

const PX_PER_CH = 8;            // hrubý převod šířky v px na znaky (BaseWindow._width)
const OUTPUT_HEIGHT_PX = 220;   // výška výstupní plochy

/** px šířku ze spec.width přepočti na znaky pro BaseWindow layout. */
export function widthToChars(width) {
  const px = Number(width);
  if (!Number.isFinite(px) || px <= 0) return 60;
  return Math.max(20, Math.round(px / PX_PER_CH));
}

export class TerminalWindow extends BaseWindow {
  constructor({ id, title, prompt, width, onInput, container, manager,
    closable, input }) {
    super({
      id, title, widthChars: widthToChars(width),
      container, manager, kind: 'terminal', closable,
    });
    this.prompt = prompt ?? '> ';
    this.hasInput = input !== false;   // false = jen výstup (živý panel)
    this.onInput = onInput;
    this.wordWrap = true;
    this._buildBody();
    this._mount();
  }

  /** Options aktivního terminálu (viz BaseWindow.getOptionsItems). */
  getOptionsItems() {
    return [
      {
        key: 'word-wrap', label: 'Word Wrap',
        checked: this.wordWrap,
        onToggle: (checked) => {
          this.setWordWrap(checked);
          this.manager.refreshOptions();
        },
      },
    ];
  }

  /** Zalamování řádků výstupu: pre-wrap (zalamuj), nebo pre + vodorovný
   *  scroll (řádek zůstane celý). Tail se drží i po přezalomení. */
  setWordWrap(on) {
    this.wordWrap = Boolean(on);
    const pinned = this._isTailPinned();
    this.output.style.whiteSpace = this.wordWrap ? 'pre-wrap' : 'pre';
    this.output.style.wordBreak = this.wordWrap ? 'break-word' : 'normal';
    this.output.style.overflowX = this.wordWrap ? 'hidden' : 'auto';
    if (pinned) this._scrollToEnd();
  }

  /** Je výstup odscrollovaný na konec (uživatel sleduje tail)? Tolerance
   *  pár px kvůli subpixelovému layoutu. */
  _isTailPinned() {
    const o = this.output;
    return o.scrollTop + o.clientHeight >= o.scrollHeight - 4;
  }

  _scrollToEnd() {
    this.output.scrollTop = this.output.scrollHeight;
  }

  /** Změna velikosti okna (úchyt, maximalizace, obnova z localStorage):
   *  jiná šířka přezalomí řádky a jiná výška posune okno výstupu – tail,
   *  který byl vidět, by se ztratil. Když byl výstup na konci, zůstane
   *  na konci; kdo si odscrolloval nahoru číst historii, tomu se nehýbe. */
  _applySize(w, h) {
    const pinned = this._isTailPinned();
    super._applySize(w, h);
    if (pinned) this._scrollToEnd();
  }

  _buildBody() {
    const body = document.createElement('div');
    body.dataset.role = 'terminal-body';
    body.style.cssText = [
      'padding:6px 8px', `width:${this.widthChars}ch`, 'max-width:92vw',
      'font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace',
      'display:flex', 'flex-direction:column',
    ].join(';');

    // JEDNA plocha jako AmigaShell (docs/images/workbench-ref/amigashell-
    // hamurabi.png): řádky výstupu a pod nimi prompt + vstup ve stejné ploše
    // (sdílí podklad, scrollují spolu, žádný oddělený vstupní řádek/rámeček).
    // Téma řídí jen barvy: podklad `--vb-terminal-bg` (workbench transparent
    // = holé tělo okna), kurzor `--vb-terminal-caret` (barva klíčů).
    const output = document.createElement('div');
    output.dataset.role = 'terminal-output';
    output.style.cssText = [
      // výchozí výška; po ruční změně velikosti okna plocha dorovná zbytek
      // těla (flex), takže konzole roste s oknem
      `height:${OUTPUT_HEIGHT_PX}px`, 'flex:1 1 auto', 'min-height:0',
      'overflow-y:auto', 'overflow-x:hidden',
      'white-space:pre-wrap', 'word-break:break-word',   // viz setWordWrap
      'background:var(--vb-terminal-bg, var(--vb-window-output-bg, rgba(0,0,0,0.06)))',
      'border-radius:4px', 'padding:6px 8px',
    ].join(';');
    this.output = output;
    body.append(output);

    // input=false: čistě výstupní panel (živé okno bez dialogu) — žádný
    // prompt ani vstupní řádek
    if (this.hasInput) {
      const inputRow = document.createElement('div');
      inputRow.dataset.role = 'terminal-input-row';
      inputRow.style.cssText = 'display:flex;align-items:baseline;gap:0';
      const promptEl = document.createElement('span');
      promptEl.textContent = this.prompt;
      promptEl.style.cssText = 'color:var(--vb-window-key, #667788);flex:0 0 auto;white-space:pre';
      // Vstup splyne s výstupem: bez rámečku a pozadí, písmo i barva okna,
      // kurzor v barvě klíčů (oranžový blok AmigaShellu aproximuje caret).
      // Je to pořád <input>, takže KeyboardControls (isEditableFocused) při
      // psaní neovládá kameru a klik do řádku ho nativně zafokusuje.
      const input = document.createElement('input');
      input.type = 'text';
      input.dataset.role = 'terminal-input';
      input.style.cssText = [
        'flex:1 1 auto', 'min-width:0', 'font:inherit', 'color:inherit',
        'background:transparent', 'border:0', 'outline:none', 'padding:0',
        'margin:0', 'caret-color:var(--vb-terminal-caret, auto)',
      ].join(';');
      input.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.stopPropagation();
        const line = input.value.trim();
        input.value = '';
        if (line) this._submit(line);
      });
      this.input = input;
      inputRow.append(promptEl, input);
      output.append(inputRow);        // prompt je poslední řádek plochy
      this.inputRow = inputRow;
      // klik kamkoli do prázdné plochy = fokus do řádku (jako v shellu)
      output.addEventListener('click', (e) => {
        if (e.target === output) input.focus();
      });
    }

    this.body = body;
    this.el.appendChild(body);
  }

  _submit(line) {
    if (this.onInput) this.onInput({ window_id: this.id, line });
  }

  /** Připiš řádek výstupu (z akce terminal_append) a odscrolluj dolů. */
  append(text) {
    const line = document.createElement('div');
    line.textContent = String(text ?? '');
    if (this.inputRow) this.output.insertBefore(line, this.inputRow);   // prompt zůstává poslední
    else this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  }

  _renderBody() {
    // výstup i vstup persistují v DOM; téma řeší CSS proměnné, rebuild není potřeba
  }
}

/** Instalace do desktopu: typ okna 'terminal' + akce `terminal_append`.
 *  Stejné window_id nahrazuje existující okno (nová definice ze serveru). */
export function createTerminalPlugin({ container, windowManager, sendEvent }) {
  windowManager.registerType('terminal', (spec) => {
    windowManager.get(spec.window_id)?.close();   // nahrazení stejného window_id
    const win = windowManager.adopt(new TerminalWindow({
      id: spec.window_id,
      title: spec.title,
      prompt: spec.prompt,
      width: spec.width,
      closable: spec.closable,
      input: spec.input,
      onInput: (payload) => sendEvent({
        type: 'event', event: 'terminal_input', payload,
      }),
      container,
      manager: windowManager,
    }));
    win.bringToFront();
    return win;
  });
  return {
    name: 'terminal',
    actions: {
      terminal_append: (msg) => {
        const win = windowManager.get(msg.window_id);
        if (win && win.kind === 'terminal') win.append(msg.text);
      },
    },
  };
}

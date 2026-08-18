/** Rám okna ve stylu Workbench 1.3 (docs/images/workbench-ref/window-corner-
 *  scrollbars-wb13.jpg): vpravo svislý scrollbar (šipky ↑↓ + knob), dole
 *  vodorovný (šipky ←→ + knob) a v průsečíku sizing gadget. Aktivní plocha
 *  okna je o tyto pruhy MENŠÍ (padding okna), takže scroll prvky nikdy
 *  nezasahují do obsahu – to je celý smysl (uživatelské rozhodnutí).
 *
 *  Zapíná ho téma (`--vb-window-frame: 1`, workbench témata s `bevel:
 *  "hard"`); modern/cyber rám nemají a scrollují nativně. Svislý knob je
 *  synchronizovaný se skutečným scroll kontejnerem okna (BaseWindow.
 *  _scrollTarget – tělo, u terminálu výstupní plocha); nativní scrollbar
 *  toho kontejneru se schová. Vodorovný pruh sleduje scrollLeft téhož cíle
 *  (např. terminál s vypnutým Word Wrap); bez přesahu se knob nekreslí –
 *  dráha zůstane prázdná (barva těla) = „nic k posunu". HTML okno (obsah v iframu) dodává PROXY cíl:
 *  metriky chodí zprávami z mostu a zápis scrollTop/Left posílá posun zpět.
 *
 *  Čisté funkce geometrie (knobGeometry/scrollFromKnob) jsou oddělené kvůli
 *  testům bez DOM. */

export const FRAME_PX = 20;        // šířka pravého / výška spodního pruhu
export const ARROW_PX = 16;        // šipka na konci pruhu
export const MIN_KNOB_PX = 12;
export const ARROW_STEP_PX = 24;   // klik na šipku posune o řádek

/** Poloha a velikost knobu na dráze `trackLen` pro obsah
 *  (scrollTop, scrollHeight, clientHeight). Bez přesahu = žádný knob
 *  (size 0): dráha zůstane „prázdná" v barvě těla, jako na WB 1.3. */
export function knobGeometry(scrollTop, scrollHeight, clientHeight, trackLen,
                             minKnob = MIN_KNOB_PX) {
  if (!(scrollHeight > clientHeight) || trackLen <= 0) {
    return { offset: 0, size: 0 };
  }
  const size = Math.max(minKnob, Math.min(trackLen, trackLen * clientHeight / scrollHeight));
  const maxScroll = scrollHeight - clientHeight;
  const offset = (trackLen - size) * Math.max(0, Math.min(1, scrollTop / maxScroll));
  return { offset, size };
}

/** Inverze: z posunu knobu na dráze spočti scrollTop. */
export function scrollFromKnob(offset, trackLen, knobSize, scrollHeight, clientHeight) {
  const room = trackLen - knobSize;
  if (room <= 0) return 0;
  const ratio = Math.max(0, Math.min(1, offset / room));
  return ratio * (scrollHeight - clientHeight);
}

function arrowSvg(dir) {
  // jednoduché šipky jako na WB 1.3 (kreslí se barvou rámu přes currentColor)
  const paths = {
    up: 'M8 3 L13 9 L10 9 L10 13 L6 13 L6 9 L3 9 Z',
    down: 'M8 13 L3 7 L6 7 L6 3 L10 3 L10 7 L13 7 Z',
    left: 'M3 8 L9 3 L9 6 L13 6 L13 10 L9 10 L9 13 Z',
    right: 'M13 8 L7 3 L7 6 L3 6 L3 10 L7 10 L7 13 Z',
  };
  return `<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">`
    + `<path d="${paths[dir]}" fill="currentColor"/></svg>`;
}

/** DOM rámu jednoho okna. `getTarget()` vrací aktuální scroll kontejner
 *  (může se měnit – terminál ho staví později než BaseWindow rám). */
export class WindowFrame {
  constructor(win, getTarget) {
    this.win = win;
    this.getTarget = getTarget;
    this.enabled = false;
    this._bound = null;          // element, na kterém visí scroll listener
    this._onScroll = () => this.update();
    this._observer = null;
    this._build();
  }

  _build() {
    // Barvy jako WB 1.3: prázdná dráha = tělo okna (modrá), knob, linky a
    // šipky = barva rámu (bílá = --vb-window-grip-bg, tj. lišta okna).
    const color = 'var(--vb-window-grip-bg, var(--vb-window-header-bg, #fff))';
    const bg = 'transparent';
    // svislý pruh: [↑][ dráha s knobem ][↓]
    this.vbar = document.createElement('div');
    this.vbar.dataset.role = 'vb-frame-v';
    // svislý pruh začíná AŽ POD LIŠTOU okna (lišta jde přes celou šířku,
    // gadgety minimalizace/depth sedí nad pruhem – WB 1.3 reference) a končí
    // nad rohovým sizing gadgetem; `top` doplní setEnabled podle výšky lišty
    this.vbar.style.cssText = [
      'position:absolute', 'top:0', 'right:0', `width:${FRAME_PX}px`, `bottom:${FRAME_PX}px`,
      `background:${bg}`, `color:${color}`, 'display:none', 'box-sizing:border-box',
      `border-left:1px solid ${color}`, 'user-select:none',
    ].join(';');
    this.vtrack = document.createElement('div');
    this.vtrack.dataset.role = 'vb-frame-vtrack';
    this.vtrack.style.cssText = [
      'position:absolute', 'left:3px', 'right:3px', `top:${ARROW_PX + 2}px`,
      `bottom:${ARROW_PX + 2}px`, `border:1px solid ${color}`, 'box-sizing:border-box',
      'cursor:pointer',
    ].join(';');
    this.vknob = document.createElement('div');
    this.vknob.dataset.role = 'vb-frame-vknob';
    this.vknob.style.cssText = [
      'position:absolute', 'left:1px', 'right:1px', 'top:0', 'height:100%',
      `background:${color}`, 'opacity:0.85', 'cursor:grab', 'touch-action:none',
    ].join(';');
    this.vtrack.appendChild(this.vknob);
    this.vup = this._arrow('up', 'top:1px;left:1px');
    this.vdown = this._arrow('down', 'bottom:1px;left:1px');
    this.vbar.append(this.vup, this.vtrack, this.vdown);

    // vodorovný pruh: [←][ dráha (knob přes celou) ][→]
    this.hbar = document.createElement('div');
    this.hbar.dataset.role = 'vb-frame-h';
    this.hbar.style.cssText = [
      'position:absolute', 'left:0', 'bottom:0', `height:${FRAME_PX}px`, `right:${FRAME_PX}px`,
      `background:${bg}`, `color:${color}`, 'display:none', 'box-sizing:border-box',
      `border-top:1px solid ${color}`, 'user-select:none',
    ].join(';');
    this.htrack = document.createElement('div');
    this.htrack.dataset.role = 'vb-frame-htrack';
    this.htrack.style.cssText = [
      'position:absolute', 'top:3px', 'bottom:3px', `left:${ARROW_PX + 2}px`,
      `right:${ARROW_PX + 2}px`, `border:1px solid ${color}`, 'box-sizing:border-box',
      'cursor:pointer',
    ].join(';');
    this.hknob = document.createElement('div');
    this.hknob.dataset.role = 'vb-frame-hknob';
    this.hknob.style.cssText = [
      'position:absolute', 'top:1px', 'bottom:1px', 'left:0', 'width:100%',
      `background:${color}`, 'opacity:0.85', 'cursor:grab', 'touch-action:none',
    ].join(';');
    this.htrack.appendChild(this.hknob);
    this.hleft = this._arrow('left', 'top:1px;left:1px');
    this.hright = this._arrow('right', 'top:1px;right:1px');
    this.hbar.append(this.hleft, this.htrack, this.hright);

    this.vup.addEventListener('click', () => this.scrollBy(0, -ARROW_STEP_PX));
    this.vdown.addEventListener('click', () => this.scrollBy(0, ARROW_STEP_PX));
    this.hleft.addEventListener('click', () => this.scrollBy(-ARROW_STEP_PX, 0));
    this.hright.addEventListener('click', () => this.scrollBy(ARROW_STEP_PX, 0));
    this.vtrack.addEventListener('pointerdown', (e) => {
      if (e.target === this.vknob) return;
      const t = this.getTarget();
      if (!t) return;
      const above = e.clientY < this.vtrack.getBoundingClientRect().top + this.vknob.offsetTop;
      this.scrollBy(0, above ? -t.clientHeight : t.clientHeight);   // stránka
    });
    this.htrack.addEventListener('pointerdown', (e) => {
      if (e.target === this.hknob) return;
      const t = this.getTarget();
      if (!t) return;
      const before = e.clientX < this.htrack.getBoundingClientRect().left + this.hknob.offsetLeft;
      this.scrollBy(before ? -t.clientWidth : t.clientWidth, 0);
    });
    this._wireKnobDrag(this.vknob, 'v');
    this._wireKnobDrag(this.hknob, 'h');
    this.win.el.append(this.vbar, this.hbar);
  }

  _arrow(dir, pos) {
    const a = document.createElement('div');
    a.dataset.role = `vb-frame-arrow-${dir}`;
    a.style.cssText = `position:absolute;${pos};width:${ARROW_PX}px;height:${ARROW_PX}px;cursor:pointer;line-height:0`;
    a.innerHTML = arrowSvg(dir);
    a.addEventListener('pointerdown', (e) => e.stopPropagation());
    return a;
  }

  /** Tažení knobu: svisle (`axis` 'v') nebo vodorovně ('h'). */
  _wireKnobDrag(knob, axis) {
    let drag = null;
    const track = axis === 'v' ? this.vtrack : this.htrack;
    knob.addEventListener('pointerdown', (e) => {
      const t = this.getTarget();
      if (!t) return;
      e.stopPropagation();
      e.preventDefault();
      drag = { pos: axis === 'v' ? e.clientY : e.clientX,
        start: axis === 'v' ? knob.offsetTop : knob.offsetLeft, target: t };
      knob.setPointerCapture?.(e.pointerId);
    });
    knob.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const t = drag.target;
      if (axis === 'v') {
        const trackLen = track.clientHeight - 2;
        const offset = drag.start + (e.clientY - drag.pos);
        t.scrollTop = scrollFromKnob(offset, trackLen, knob.offsetHeight, t.scrollHeight, t.clientHeight);
      } else {
        const trackLen = track.clientWidth - 2;
        const offset = drag.start + (e.clientX - drag.pos);
        t.scrollLeft = scrollFromKnob(offset, trackLen, knob.offsetWidth, t.scrollWidth, t.clientWidth);
      }
    });
    const end = () => { drag = null; };
    knob.addEventListener('pointerup', end);
    knob.addEventListener('pointercancel', end);
  }

  scrollBy(dx, dy) {
    const t = this.getTarget();
    if (!t) return;
    if (dy) t.scrollTop += dy;
    if (dx) t.scrollLeft += dx;
  }

  /** Zapni/vypni rám (téma). Zapnutý: okno má padding vpravo/dole = pruhy,
   *  nativní scrollbar cíle schovaný, knob se synchronizuje. */
  setEnabled(on) {
    this.enabled = Boolean(on);
    this.vbar.style.display = this.enabled ? 'block' : 'none';
    this.hbar.style.display = this.enabled ? 'block' : 'none';
    this.win.el.style.paddingRight = this.enabled ? `${FRAME_PX}px` : '';
    this.win.el.style.paddingBottom = this.enabled ? `${FRAME_PX}px` : '';
    // lišta okna přes celou šířku (i nad sloupcem scrollbaru), pruh pod ní
    if (this.win.bar) {
      this.win.bar.style.marginRight = this.enabled ? `-${FRAME_PX}px` : '';
      this.vbar.style.top = this.enabled ? `${this.win._headerH()}px` : '0';
    }
    this.rebind();
  }

  /** Přivaž se k aktuálnímu scroll kontejneru (může se změnit / vzniknout
   *  později) a schovej mu nativní scrollbar, dokud je rám zapnutý. */
  rebind() {
    const t = this.enabled ? this.getTarget() : null;
    if (this._bound && this._bound !== t) this._unbind();
    if (t && this._bound !== t) {
      if (typeof t.addEventListener === 'function') {
        // DOM element: nativní scrollbar schovat (pruh kreslíme sami), sledovat
        // scroll i změny obsahu
        t.addEventListener('scroll', this._onScroll);
        if (t.style) t.style.scrollbarWidth = 'none';
        if (typeof MutationObserver !== 'undefined') {
          this._observer = new MutationObserver(() => this.update());
          this._observer.observe(t, { childList: true, subtree: true, characterData: true });
        }
      } else if (typeof t.subscribe === 'function') {
        // proxy (HTML okno): metriky chodí zprávami z iframu, scrollTop/Left
        // zápis posílá posun zpět; setFrame(true) schová scrollbar uvnitř
        this._unsubscribe = t.subscribe(this._onScroll);
        t.setFrame?.(true);
      }
      this._bound = t;
    }
    this.update();
  }

  _unbind() {
    const b = this._bound;
    if (!b) return;
    if (typeof b.removeEventListener === 'function') {
      b.removeEventListener('scroll', this._onScroll);
      if (b.style) b.style.scrollbarWidth = '';
    } else {
      this._unsubscribe?.();
      this._unsubscribe = null;
      b.setFrame?.(false);
    }
    this._observer?.disconnect();
    this._observer = null;
    this._bound = null;
  }

  /** Přepočti knob podle scrollu cíle (volá scroll/mutace/resize). */
  update() {
    if (!this.enabled) return;
    const t = this.getTarget();
    const vLen = Math.max(0, this.vtrack.clientHeight - 2);
    const v = t ? knobGeometry(t.scrollTop, t.scrollHeight, t.clientHeight, vLen)
      : { offset: 0, size: 0 };
    this.vknob.style.display = v.size > 0 ? 'block' : 'none';   // nic k posunu = prázdná dráha
    this.vknob.style.top = `${v.offset}px`;
    this.vknob.style.height = `${v.size}px`;
    const hLen = Math.max(0, this.htrack.clientWidth - 2);
    const h = t ? knobGeometry(t.scrollLeft, t.scrollWidth, t.clientWidth, hLen)
      : { offset: 0, size: 0 };
    this.hknob.style.display = h.size > 0 ? 'block' : 'none';
    this.hknob.style.left = `${h.offset}px`;
    this.hknob.style.width = `${h.size}px`;
  }
}

/** Chrome okna (WM jádro, Amiga Workbench styl): rám, záhlaví s bitmapovými
 *  gadgety (zavřít/minimalizovat/obnovit), tažení za záhlaví, změna
 *  velikosti za rohové úchyty, minimalizace do doku, maximalizace
 *  dvojklikem, perzistence geometrie (localStorage), z-order.
 *  Tělo dodává typ okna (plugin): nastaví this.body v _buildBody() a
 *  (volitelně) překresluje v _renderBody(). Podtřída v konstruktoru po
 *  super() nastaví svá pole, pak zavolá this._buildBody() a this._mount().
 *  Pointer wiring jde přes sdílené `wirePointerDrag` (drag.js) – pojistky
 *  proti sticky tažení jsou tam, ne tady. */
// Bitmapové gadgety (§3a handoveru: „bitmapy pro okna si vezmi z obrázků
// přidaných do repa") – výřezy z docs/images/workbench-ref/, Vite je
// zabalí do bundlu. Mapování na naši funkcionalitu: zavřít = obrysový
// čtverec (vlevo na referenční liště), minimalizovat = zoom gadget
// (čtverec s menším obdélníkem), obnovit = depth gadget (dva překryté
// obdélníky – „vytáhni okno zpátky nahoru").
import closeIcon from '../assets/gadgets/close.png';
import depthIcon from '../assets/gadgets/depth.png';
import resizeIcon from '../assets/gadgets/resize.png';
import zoomIcon from '../assets/gadgets/zoom.png';
import { wirePointerDrag } from './drag.js';
import { SCREEN_BAR_HEIGHT } from './drag_reveal.js';

export function clampToCanvas(x, y, w, h, bounds) {
  const maxX = Math.max(0, bounds.width - w);
  const maxY = Math.max(0, bounds.height - h);
  return {
    x: Math.min(Math.max(0, x), maxX),
    y: Math.min(Math.max(0, y), maxY),
  };
}

/** Kolik px lišty okna musí zůstat vidět, když se okno vytáhne mimo plátno
 *  do stran – aby šlo za lištu chytit a vrátit (uživatelský požadavek:
 *  okno smí ven z plátna jako u běžných WM, ale nikdy nenávratně). */
export const DRAG_KEEP_PX = 64;

/** Tažení okna za lištu: kam smí okno na plátně `bounds` (šířka `w`,
 *  výška lišty `headerH`). Nahoru NIKDY pod lištu obrazovky (tam sedí
 *  Options; okna mají nižší z-index a lišta by zmizela pod ní). Do stran
 *  smí okno částečně ven, ale DRAG_KEEP_PX lišty zůstane vidět; dolů smí
 *  tělo ven, ale celá lišta zůstane na plátně – to je to, za co se okno
 *  vrací zpět. Okno užší než DRAG_KEEP_PX zůstává celé uvnitř. */
export function clampDragPosition(x, y, w, headerH, bounds) {
  const keep = Math.min(DRAG_KEEP_PX, w);
  const minX = keep - w;
  const maxX = bounds.width - keep;
  const minY = SCREEN_BAR_HEIGHT;
  const maxY = Math.max(minY, bounds.height - headerH);
  return {
    x: Math.min(Math.max(minX, x), maxX),
    y: Math.min(Math.max(minY, y), maxY),
  };
}

export function dockLayout(index, slotWidth, gap, canvasHeight, slotHeight) {
  return { x: index * (slotWidth + gap), y: canvasHeight - slotHeight };
}

const DOCK_SLOT_WIDTH = 160;
const DOCK_GAP = 8;
const DOCK_SLOT_HEIGHT = 28;

const POS_PREFIX = 'vb-pos:';   // localStorage klíč perzistence pozic/velikostí

export const MIN_WINDOW_W = 180;   // px – pod tím už je okno nepoužitelné
export const MIN_WINDOW_H = 90;
const GRIP_PX = 28;                // strana úchytu v rohu (ať se dobře chytá)
const GRIP_OPACITY = '0.35';       // „mírně transluentní" čtvereček

/** Klíč perzistence pozice: id okna; bez id poslouží název okna
 *  („Aktivační okno"). Bez obojího se pozice neukládá (null). */
export function posKey(id, title) {
  const key = id ?? title;
  return key ? POS_PREFIX + String(key) : null;
}

/** Čistá geometrie tažení za rohový úchyt. `start` je stav okna při stisku
 *  {x, y, w, h}, `dx`/`dy` posun ukazatele od stisku. Roh `se` (vpravo dole)
 *  hýbe pravou a spodní hranou, roh `sw` (vlevo dole) spodní a *levou* – to
 *  znamená, že se mění i x, zatímco pravá hrana stojí. Výsledek je oříznutý
 *  na minimální velikost a na plochu plátna. */
export function resizeGeometry(start, corner, dx, dy, min, bounds) {
  const minW = Math.max(1, min?.w ?? MIN_WINDOW_W);
  const minH = Math.max(1, min?.h ?? MIN_WINDOW_H);
  const h = Math.max(minH, Math.min(start.h + dy, bounds.height - start.y));
  if (corner === 'sw') {
    const right = start.x + start.w;          // pravá hrana zůstává na místě
    const w = Math.max(minW, Math.min(start.w - dx, right));
    return { x: right - w, y: start.y, w, h };
  }
  const w = Math.max(minW, Math.min(start.w + dx, bounds.width - start.x));
  return { x: start.x, y: start.y, w, h };
}

export class BaseWindow {
  constructor({ id, title, widthChars, container, manager, kind,
    closable = true, optionsProvider = null }) {
    this.id = id;
    this.title = title;
    this.widthChars = widthChars;
    this.container = container;
    this.manager = manager;
    this.kind = kind;            // 'detail' | 'control' | 'terminal' | 'log' | 'graph'
    this.closable = closable !== false;  // false = bez gadgetu [x]
    this.optionsProvider = optionsProvider;  // () => items | null (viz getOptionsItems)
    this.isMinimized = false;
    this.saved = null;
    this.maximizedFrom = null;   // != null = maximalizováno; nese předchozí geometrii
    this.dragOffset = null;
    this.resizeState = null;     // != null během tažení za úchyt
    this.size = null;            // {w, h} po ruční změně velikosti; null = auto
    this.grips = [];
    this.body = null;            // nastaví _buildBody podtřídy

    this.el = document.createElement('div');
    this.el.dataset.role = 'vb-window';
    this.el.dataset.windowId = String(id);
    this.el.style.cssText = [
      'position:absolute', 'left:0', 'top:0', 'box-sizing:border-box',
      'background:var(--vb-window-body-bg, rgba(255,255,255,0.97))',
      'color:var(--vb-window-body-fg, #1f2430)',
      'box-shadow:var(--vb-window-shadow, 0 6px 20px rgba(0,0,0,0.22))',
      // rám po CELÉM obvodu (uživatelská oprava: workbench stín kreslí jen
      // spodní hranu, kraje okna nebyly vidět) – barvu dodá téma, témata
      // bez `window.border` mají transparent a vizuálně se nemění
      'border:1px solid var(--vb-window-border, transparent)',
      'border-radius:6px', 'overflow:hidden', 'user-select:none',
      'font:13px/1.5 system-ui,sans-serif', 'z-index:900',
    ].join(';');
    this._buildHeader();
  }

  // -- hooky podtřídy --
  // Pozn.: konstruktor BaseWindow _buildBody NEVOLÁ – podtřída ho zavolá sama
  // až po nastavení svých polí (jinak by četl pole před super()).
  _buildBody() { /* podtřída: vytvoř this.body a připoj do this.el */ }
  _renderBody() { /* podtřída: refresh při tématu / obnově */ }

  // -- po nastavení polí podtřídy --
  _mount() {
    this.container.appendChild(this.el);
    this._buildGrips();
    // perzistence: uložený záznam (localStorage) má přednost před kaskádou
    const saved = this._loadPos();
    if (saved && Number.isFinite(saved.w) && Number.isFinite(saved.h)) {
      this._applySize(saved.w, saved.h);
    }
    const bounds = this._bounds();
    const offset = (this.manager.windows.size % 8) * 24;
    const start = clampToCanvas(40 + offset, 40 + offset,
      this._boxW(), this._boxH(), bounds);
    // uložená pozice smí být částečně mimo plátno (uživatel si ji tam
    // odtáhl) – jen stejná pojistka jako při tažení, ať je lišta uchopitelná
    // i po reloadu / na menším okně prohlížeče
    const pos = saved
      ? clampDragPosition(saved.x, saved.y, this._boxW(), this._headerH(), bounds)
      : start;
    this._place(pos.x, pos.y);
    this.el.addEventListener('pointerdown', () => this.bringToFront());
  }

  _posKey() { return posKey(this.id, this.title); }

  _loadPos() {
    const key = this._posKey();
    if (!key) return null;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const pos = JSON.parse(raw);
      if (Number.isFinite(pos?.x) && Number.isFinite(pos?.y)) return pos;
    } catch { /* privátní režim / vadný záznam → kaskáda */ }
    return null;
  }

  /** Ulož pozici i (ruční) velikost – obojí přežije reload stránky. */
  _savePos() {
    const key = this._posKey();
    if (!key) return;
    const record = { x: this.x, y: this.y };
    if (this.size) { record.w = this.size.w; record.h = this.size.h; }
    try {
      localStorage.setItem(key, JSON.stringify(record));
    } catch { /* localStorage nedostupný → záznam se prostě neuloží */ }
  }

  _width() { return this.widthChars * 8 + 24; }

  /** Skutečné rozměry okna: po ruční změně velikosti platí this.size,
   *  jinak odhad z šířky těla (výška je do té doby daná obsahem). */
  _boxW() { return this.size ? this.size.w : this._width(); }

  _boxH() { return this.size ? this.size.h : 200; }

  _bounds() {
    return {
      width: this.container.clientWidth || 800,
      height: this.container.clientHeight || 600,
    };
  }

  _buildHeader() {
    const bar = document.createElement('div');
    bar.dataset.role = 'vb-titlebar';
    bar.style.cssText = [
      'display:flex', 'align-items:center', 'gap:6px',
      'padding:4px 6px', 'cursor:move',
      'background:var(--vb-window-header-bg, #d8dde6)',
      'background-image:var(--vb-window-header-pattern, none)',
      'color:var(--vb-window-header-fg, #1f2430)',
    ].join(';');

    // closable=false: okno bez [x] — po zavření by bylo neobnovitelné
    // (programové close() zůstává, řeší náhradu okna se stejným id)
    this.closeGadget = null;
    if (this.closable) {
      this.closeGadget = this._gadget('close', closeIcon);
      this.closeGadget.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
      });
    }

    // Titulek ZLEVA jako na Amiga Workbench (uživatelská oprava: „text
    // názvu okna řadí zleva… necentruje se"), hned za close gadgetem,
    // pokud okno nějaký má. flex:1 tlačí metriky/gadgety doprava.
    this.titleEl = document.createElement('div');
    this.titleEl.textContent = this.title;
    this.titleEl.style.cssText = [
      'flex:1', 'text-align:left', 'font-weight:600',
      'white-space:nowrap', 'overflow:hidden', 'text-overflow:ellipsis',
    ].join(';');

    this.minGadget = this._gadget('minimize', zoomIcon);
    this.minGadget.addEventListener('click', (e) => {
      e.stopPropagation();
      this.minimize();
    });

    this.restoreGadget = this._gadget('restore', depthIcon);
    this.restoreGadget.addEventListener('click', (e) => {
      e.stopPropagation();
      this.restore();
    });
    this.restoreGadget.style.display = 'none';

    if (this.closeGadget) bar.append(this.closeGadget);
    bar.append(this.titleEl, this.minGadget, this.restoreGadget);
    this._dragFromHeader(bar);
    // dvojklik na lištu = maximalizace / návrat předchozí velikosti
    // (uživatelský požadavek: „stejně jako u některých OS")
    bar.addEventListener('dblclick', (e) => {
      if (e.target.dataset.gadget) return;
      this.toggleMaximize();
    });
    this.bar = bar;
    this.el.appendChild(bar);
  }

  /** Gadget = BINÁRNÍ bitmapa z referenčních obrázků (viz importy nahoře)
   *  použitá jako CSS maska – barvu dodává `--vb-window-gadget` z palety
   *  tématu (uživatelská oprava: surový barevný výřez vypadal na jinak
   *  barevné liště jako cizí cutout; binární maska se přebarví sama a
   *  díky per-screen CSS proměnným i per screen). */
  _gadget(name, icon) {
    const g = document.createElement('button');
    g.dataset.gadget = name;
    g.style.cssText = [
      'flex:0 0 auto', 'width:18px', 'height:18px', 'padding:0',
      'border:none', 'cursor:pointer',
      'background:var(--vb-window-gadget, #5a6573)',
      `-webkit-mask:url("${icon}") center/100% 100% no-repeat`,
      `mask:url("${icon}") center/100% 100% no-repeat`,
    ].join(';');
    return g;
  }

  /** Tažení okna za záhlaví. `this.dragOffset` zrcadlí stav tažení jen
   *  kvůli introspekci v testech; wiring (capture, sticky pojistky) řeší
   *  sdílené `wirePointerDrag`. */
  _dragFromHeader(bar) {
    wirePointerDrag(bar, {
      onStart: (e) => {
        if (e.target.dataset.gadget) return null;
        this.bringToFront();
        const rect = this.el.getBoundingClientRect();
        const cont = this.container.getBoundingClientRect();
        this.dragOffset = {
          x: e.clientX - rect.left, y: e.clientY - rect.top,
          contLeft: cont.left, contTop: cont.top,
        };
        return this.dragOffset;
      },
      onMove: (e, drag) => {
        if (this.isMinimized) return;
        const x = e.clientX - drag.contLeft - drag.x;
        const y = e.clientY - drag.contTop - drag.y;
        const pos = clampDragPosition(x, y, this._boxW(), this._headerH(),
          this._bounds());
        this._place(pos.x, pos.y);
      },
      onEnd: () => {
        this.dragOffset = null;
        if (!this.isMinimized) this._savePos();   // pozice přežije reload
      },
    });
  }

  _headerH() { return this.bar.offsetHeight || DOCK_SLOT_HEIGHT; }

  /** Úchyty pro změnu velikosti. Pravý dolní roh je VIDITELNÝ Amiga sizing
   *  gadget (uživatelská oprava: hover-zvýraznění čtverečku „nefunguje
   *  vždy" – proto se kreslí natrvalo, jako na referenci
   *  workbench1-default-toastytech.png; binární bitmapa barvená
   *  `--vb-window-gadget`, stejný vzor jako gadgety lišty). Levý dolní roh
   *  zůstává jako neviditelný hover úchyt navíc (bonus nad rámec originálu
   *  – Amiga měla jen pravý). Staví se v _mount, kdy už tělo okna existuje. */
  _buildGrips() {
    this.grips = ['se', 'sw'].map((corner) => {
      const grip = document.createElement('div');
      grip.dataset.role = `vb-resize-${corner}`;
      if (corner === 'se') {
        // Krabička v rohu (Workbench: neprůhledná v barvě lišty s rámečkem,
        // obsah pod ní neprosvítá – docs/images/workbench-ref/amigashell-
        // hamurabi.png; jiná témata: průhledná, zůstává jen glyf). Barvy
        // dodá téma přes --vb-window-grip-* (themes/manager.js).
        grip.style.cssText = [
          'position:absolute', 'bottom:0', 'right:0',
          `width:${GRIP_PX}px`, `height:${GRIP_PX}px`,   // hit-area > vizuál
          'box-sizing:border-box', 'touch-action:none', 'cursor:nwse-resize',
          'background:var(--vb-window-grip-bg, transparent)',
          'border-left:1px solid var(--vb-window-grip-border, transparent)',
          'border-top:1px solid var(--vb-window-grip-border, transparent)',
          'border-bottom-right-radius:5px',
        ].join(';');
        const glyph = document.createElement('div');
        glyph.dataset.role = 'vb-resize-glyph';
        glyph.style.cssText = [
          'position:absolute', 'right:4px', 'bottom:5px', 'width:16px', 'height:16px',
          // glyf: v barvě lišty na krabičce (workbench), jinak barva textu
          // těla – ne --vb-window-gadget, ta by na modrém těle splynula
          'background:var(--vb-window-grip-fg, var(--vb-window-body-fg, #8a93a3))',
          `-webkit-mask:url("${resizeIcon}") center/16px 16px no-repeat`,
          `mask:url("${resizeIcon}") center/16px 16px no-repeat`,
          'pointer-events:none',
        ].join(';');
        grip.appendChild(glyph);
      } else {
        grip.style.cssText = [
          'position:absolute', 'bottom:2px', 'left:2px',
          `width:${GRIP_PX}px`, `height:${GRIP_PX}px`,
          'box-sizing:border-box', 'border-radius:3px',
          'background:var(--vb-window-gadget, #8a93a3)',
          'border:1px solid var(--vb-window-gadget, #8a93a3)',
          'opacity:0', 'transition:opacity 0.12s', 'touch-action:none',
          'cursor:nesw-resize',
        ].join(';');
        grip.addEventListener('pointerenter', () => this._showGrip(grip, true));
        grip.addEventListener('pointerleave', () => this._showGrip(grip, false));
      }
      this._resizeFromGrip(grip, corner);
      this.el.appendChild(grip);
      return grip;
    });
  }

  _showGrip(grip, visible) {
    // SE je trvale viditelný Amiga gadget – hover neřeší (viz _buildGrips)
    if (grip.dataset.role === 'vb-resize-se') return;
    // během tažení zůstává vidět, i když ukazatel roh opustí
    if (!visible && this.resizeState) return;
    grip.style.opacity = visible && !this.isMinimized ? GRIP_OPACITY : '0';
  }

  /** Změna velikosti za rohový úchyt – stejný sdílený wiring jako tažení
   *  (`wirePointerDrag`), jen jiná geometrie (`resizeGeometry`). */
  _resizeFromGrip(grip, corner) {
    wirePointerDrag(grip, {
      onStart: (e) => {
        if (this.isMinimized) return null;
        e.stopPropagation();            // ne, tohle není tažení okna
        this.bringToFront();
        const rect = this.el.getBoundingClientRect();
        this.resizeState = {
          corner, pointerX: e.clientX, pointerY: e.clientY,
          start: {
            x: this.x, y: this.y,
            w: rect.width || this._boxW(), h: rect.height || this._boxH(),
          },
        };
        this._showGrip(grip, true);
        return this.resizeState;
      },
      onMove: (e, state) => {
        if (this.isMinimized) return;
        const geo = resizeGeometry(state.start, state.corner,
          e.clientX - state.pointerX, e.clientY - state.pointerY,
          { w: MIN_WINDOW_W, h: MIN_WINDOW_H }, this._bounds());
        this._place(geo.x, geo.y);
        this._applySize(geo.w, geo.h);
      },
      onEnd: () => {
        this.resizeState = null;
        this._showGrip(grip, false);
        this._savePos();               // velikost i pozice přežijí reload
      },
    });
  }

  /** Nastav okno na pevné rozměry: tělo dostane zbytek výšky a scrolluje,
   *  takže se obsah nikdy nevyleje mimo rám. */
  _applySize(w, h) {
    this.size = { w: Math.round(w), h: Math.round(h) };
    this.el.style.width = `${this.size.w}px`;
    this.el.style.height = `${this.size.h}px`;
    if (!this.body) return;
    this.body.style.boxSizing = 'border-box';
    this.body.style.width = '100%';
    this.body.style.maxWidth = 'none';
    this.body.style.height = `${Math.max(0, this.size.h - this._headerH())}px`;
    this.body.style.overflow = 'auto';
  }

  _place(x, y) {
    this.x = x;
    this.y = y;
    this.el.style.left = `${x}px`;
    this.el.style.top = `${y}px`;
  }

  /** Dvojklik na lištu: maximalizace přes celý screen (pod screen barem),
   *  další dvojklik vrátí geometrii, jakou okno mělo před maximalizací.
   *  Ruční resize za roh maximalizaci neruší – příští dvojklik pořád vrací
   *  zapamatovanou geometrii (stejně se chová většina OS). */
  toggleMaximize() {
    if (this.isMinimized) return;
    const bounds = this._bounds();
    if (!this.maximizedFrom) {
      const rect = this.el.getBoundingClientRect();
      this.maximizedFrom = {
        x: this.x, y: this.y,
        w: rect.width || this._boxW(), h: rect.height || this._boxH(),
      };
      this._place(0, SCREEN_BAR_HEIGHT);
      this._applySize(bounds.width, bounds.height - SCREEN_BAR_HEIGHT);
    } else {
      const prev = this.maximizedFrom;
      this.maximizedFrom = null;
      this._applySize(prev.w, prev.h);
      this._place(prev.x, prev.y);
    }
    this._savePos();   // i maximalizovaný stav přežije reload
  }

  minimize() {
    if (this.isMinimized) return;
    this.isMinimized = true;
    this.saved = { x: this.x, y: this.y };
    this.body.style.display = 'none';
    this.minGadget.style.display = 'none';
    this.restoreGadget.style.display = '';
    this.el.dataset.role = 'vb-dock-strip';
    this.el.style.background = 'var(--vb-window-dock-bg, #c2c9d4)';
    this.el.style.width = `${DOCK_SLOT_WIDTH}px`;
    this.el.style.height = '';                  // proužek v doku má výšku dle obsahu
    for (const grip of this.grips) grip.style.display = 'none';
    this.titleEl.style.fontSize = '11px';
    const slot = this.manager._assignDockSlot(this);
    const bounds = this._bounds();
    const pos = dockLayout(slot, DOCK_SLOT_WIDTH, DOCK_GAP,
      bounds.height, DOCK_SLOT_HEIGHT);
    this._place(pos.x, pos.y);
  }

  restore() {
    if (!this.isMinimized) return;
    this.isMinimized = false;
    this.manager._releaseDockSlot(this);
    this.el.dataset.role = 'vb-window';
    this.el.style.background = 'var(--vb-window-body-bg, rgba(255,255,255,0.97))';
    this.el.style.width = '';
    this.titleEl.style.fontSize = '';
    this.body.style.display = '';
    this.minGadget.style.display = '';
    this.restoreGadget.style.display = 'none';
    for (const grip of this.grips) grip.style.display = '';
    if (this.size) this._applySize(this.size.w, this.size.h);   // ruční velikost
    this._renderBody();
    const pos = this.saved ?? { x: 40, y: 40 };
    this._place(pos.x, pos.y);
    this.bringToFront();
  }

  /** Options aktivního okna pro screen bar (macOS menu bar model, §3a
   *  handoveru): pole položek ve tvaru pro `ScreenMenuBar.setOptionsGroup`,
   *  nebo `null` = tenhle typ okna žádné Options nedefinuje (detail/control)
   *  a aktivace NEMÁ přepnout skupinu na liště. Podtřída buď přepíše metodu
   *  (LogWindow, TerminalWindow), nebo dodá `optionsProvider` v konstruktoru
   *  (GraphWindow – položky staví closure ve screen_instance, které má
   *  přístup k engine/renderer/store). Jedno sdílené rozhraní, žádné
   *  kopírování render-options kódu do každého typu okna (DRY). */
  getOptionsItems() {
    return this.optionsProvider ? this.optionsProvider() : null;
  }

  /** Klik kamkoli do okna (pointerdown v _mount) = přenes dopředu A aktivuj
   *  (aktivní okno řídí Options skupinu na screen baru, viz getOptionsItems). */
  bringToFront() {
    this.setZ(this.manager._nextZ());
    this.manager._setActive(this);
  }

  setZ(z) { this.el.style.zIndex = String(z); }

  applyTheme() {
    if (!this.isMinimized) this._renderBody();
  }

  close() {
    if (this.isMinimized) this.manager._releaseDockSlot(this);
    this.el.remove();
    this.manager._forget(this.id);
  }
}

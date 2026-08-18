/** WindowManager (WM jádro): drží okna jednoho desktopu/screenu a jejich
 *  průřezové chování – z-order, dok minimalizovaných, zdroj Options pro
 *  lištu screenu. O KONKRÉTNÍCH typech oken neví nic: schopnosti (pluginy)
 *  si typ registrují přes `registerType(kind, factory)` a otevírá se
 *  generickým `open(kind, spec)` – přidání nové schopnosti nevyžaduje
 *  editovat tenhle soubor (open/closed; dřív tu byla openFor/openControl/
 *  openTerminal/… metoda na každý typ).
 *
 *  Sémantiku „co udělat, když okno s tímhle id už existuje" (nahradit /
 *  fokusnout / vrátit) si řeší factory daného typu – různé typy ji mají
 *  různou a manager ji nemá co diktovat. */
import { findFreeSlot, overlaps } from './dock.js';

export class WindowManager {
  constructor(container, onOptionsChange = () => {}, hooks = {}) {
    this.container = container;
    this.onOptionsChange = onOptionsChange;  // items|null → ScreenBar.setOptionsGroup
    // Zámek okna je průřezová věc (jako z-order): `onLockWindow(win)` pošle
    // serveru `window_lock` – jádro nemusí znát protokol a desktop nemusí
    // sahat do žádného typu okna.
    this.onLockWindow = hooks.onLockWindow ?? null;
    this.types = new Map();          // kind -> factory(spec) => BaseWindow
    this.windows = new Map();        // id -> BaseWindow
    this.optionsSource = null;       // poslední AKTIVNÍ okno, co definuje Options
    // Okno, kterému patří klávesnice. Na rozdíl od `optionsSource` se mění
    // při KAŽDÉ aktivaci (i u oken bez Options): klávesy musí patřit tomu,
    // do čeho uživatel naposled klikl, jinak by WASD otáčelo grafem, i když
    // píše do terminálu vedle.
    this.activeWindow = null;
    this.z = 900;
  }

  /** Plugin registruje typ okna. `factory(spec)` okno vytvoří (nebo vrátí
   *  existující – její věc) a MUSÍ ho zavést přes `adopt()`. */
  registerType(kind, factory) {
    this.types.set(kind, factory);
  }

  open(kind, spec) {
    const factory = this.types.get(kind);
    if (!factory) {
      console.warn(`viewbase: unknown window kind '${kind}'`);
      return null;
    }
    // Spec otevíraného okna musí být k mání UŽ V adopt(): factory si okno
    // typicky rovnou aktivuje (bringToFront) a aktivace čte `secured` kvůli
    // Options. Kdyby se flag nastavil až z návratové hodnoty, měla by lišta
    // po odemčení položku cizího okna (odchyceno živým testem).
    this._openingSpec = spec ?? null;
    let win;
    try {
      win = factory(spec);
    } finally {
      this._openingSpec = null;
    }
    if (win && spec) win.secured = !!spec.secured;
    return win;
  }

  /** Zaveď okno do evidence (volá factory typu po konstrukci). `secured`
   *  (ze `public_spec()` na serveru) drží JÁDRO, ne plugin: podle něj se do
   *  Options přidá Lock/Unlock Window pro KTERÝKOLI typ okna, takže plugin
   *  o zámku neví nic (viz lockItemFor). */
  adopt(win) {
    if (this._openingSpec) win.secured = !!this._openingSpec.secured;
    this.windows.set(win.id, win);
    return win;
  }

  get(id) {
    return this.windows.get(id) ?? null;
  }

  close(id) {
    this.windows.get(id)?.close();
  }

  /** Aktivace okna (klik/bringToFront, viz BaseWindow): okno S vlastními
   *  Options (graf, log, terminál) se stává zdrojem skupiny na screen baru
   *  – lišta přepne kontext na aktivní okno (graf: fyzika/splajn/2D-3D,
   *  terminál: Word Wrap, log: filtry); okno BEZ nich (detail/control)
   *  skupinu NEMĚNÍ – chová se jako další okno
   *  téže „aplikace", přesně jako na macOS menu pořád patří aplikaci
   *  (rozhodnutí uživatele: nemění se + skrýt na prázdném screenu). */
  _setActive(win) {
    if (this.activeWindow !== win) this.activeWindow?.setFocused?.(false);
    this.activeWindow = win;
    win.setFocused?.(true);          // indikátor fokusu v liště (za titulkem)
    if (this.optionsItemsFor(win) != null) this.optionsSource = win;
    this.refreshOptions();
  }

  /** Patří klávesnice tomuhle oknu? Dokud uživatel nikam neklikl, ano —
   *  aby ovládání fungovalo hned po otevření, ne až po prvním kliknutí. */
  hasKeyboard(win) {
    return this.activeWindow === null || this.activeWindow === win;
  }

  /** Přerenderuj Options skupinu podle aktuálního zdroje – volají to i
   *  onToggle handlery položek (checkbox po kliku musí ukázat nový stav;
   *  jedna sdílená cesta místo per-okno kopií render smyčky). */
  refreshOptions() {
    this.onOptionsChange(this.optionsItemsFor(this.optionsSource));
  }

  /** Options aktivního okna VČETNĚ průřezových položek jádra. Dnes jediná:
   *  zámek okna (`secured=True`). Zamčené („private") okno nabídne `Unlock
   *  Window`, odemčené zabezpečené `Lock Window` – uživatelský požadavek
   *  („označí private window, klikne do Options a je mu nabídnuto Unlock
   *  Window"), takže výzva na kód není závislá jen na kliknutí do okna.
   *  `null` = tenhle typ okna Options nedefinuje A zámek nemá (aktivace
   *  skupinu na liště nepřepíná, viz _setActive). */
  optionsItemsFor(win) {
    if (!win) return null;
    const own = win.getOptionsItems();
    const lock = this.lockItemFor(win);
    if (!lock) return own;
    return [...(own ?? []), lock];
  }

  /** Položka zámku pro dané okno (příkaz, ne přepínač – jako System → Shell
   *  CLI). Nezabezpečená okna zamknout nejdou: neměl by je co odemknout. */
  lockItemFor(win) {
    if (!win?.secured) return null;
    if (win.kind === 'locked') {
      return {
        key: 'unlock-window',
        label: 'Unlock Window',
        command: true,
        onToggle: () => win.requestUnlock?.(),
      };
    }
    if (!this.onLockWindow) return null;
    return {
      key: 'lock-window',
      label: 'Lock Window',
      command: true,
      onToggle: () => this.onLockWindow(win),
    };
  }

  applyTheme() {
    for (const win of this.windows.values()) win.applyTheme();
  }

  _nextZ() {
    this.z += 1;
    return this.z;
  }

  /** Depth gadget okna: `win` ZA všechna ostatní. Z se přeuspořádá od
   *  základu (900), pořadí ostatních zůstane – žádné klesání do záporu ani
   *  nekonečný růst; další bringToFront dostane zase nejvyšší Z. */
  sendToBack(win) {
    const others = [...this.windows.values()].filter((w) => w !== win)
      .sort((a, b) => Number(a.el.style.zIndex) - Number(b.el.style.zIndex));
    let z = 900;
    win.setZ(z);
    for (const w of others) { z += 1; w.setZ(z); }
    this.z = z;
  }

  /** Obdélníky proužků ostatních minimalizovaných oken (kolize v doku). */
  dockRects(exclude) {
    const rects = [];
    for (const w of this.windows.values()) {
      if (w === exclude || !w.isMinimized) continue;
      rects.push({ x: w.x, y: w.y, w: w.el.offsetWidth || 160, h: w.el.offsetHeight || 28 });
    }
    return rects;
  }

  /** Kam s proužkem minimalizovaného okna: pamatovaná pozice, je-li celá na
   *  plátně a nekoliduje s ostatními proužky; jinak první volné místo v
   *  řadách odspodu (wm/dock.js). */
  dockPlace(win, w, h) {
    const bounds = win._dockBounds();          // plátno pod lištou screenu
    const others = this.dockRects(win);
    const p = win.dockPos;
    if (p && p.x >= 0 && p.y >= (bounds.top ?? 0)
        && p.x + w <= bounds.width && p.y + h <= bounds.height
        && !others.some((o) => overlaps({ x: p.x, y: p.y, w, h }, o))) {
      return { x: p.x, y: p.y };
    }
    return findFreeSlot(others, w, h, bounds);
  }

  _forget(id) {
    const win = this.windows.get(id);
    this.windows.delete(id);
    // zavřené okno nesmí dál držet klávesnici – jinak by po jeho zavření
    // nereagovalo žádné (activeWindow by ukazovalo na neexistující okno)
    if (this.activeWindow === win) this.activeWindow = null;
    if (win !== this.optionsSource) return;
    // Zdroj Options zmizel – převezme ho nejvrchnější zbylé okno, co nějaké
    // Options definuje; bez takového se skupina schová (setOptionsGroup(null)).
    let next = null;
    for (const candidate of this.windows.values()) {
      if (this.optionsItemsFor(candidate) == null) continue;
      if (!next || Number(candidate.el.style.zIndex) > Number(next.el.style.zIndex)) {
        next = candidate;
      }
    }
    this.optionsSource = next;
    this.refreshOptions();
  }
}

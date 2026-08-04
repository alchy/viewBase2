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
export class WindowManager {
  constructor(container, onOptionsChange = () => {}) {
    this.container = container;
    this.onOptionsChange = onOptionsChange;  // items|null → ScreenBar.setOptionsGroup
    this.types = new Map();          // kind -> factory(spec) => BaseWindow
    this.windows = new Map();        // id -> BaseWindow
    this.optionsSource = null;       // poslední AKTIVNÍ okno, co definuje Options
    // Okno, kterému patří klávesnice. Na rozdíl od `optionsSource` se mění
    // při KAŽDÉ aktivaci (i u oken bez Options): klávesy musí patřit tomu,
    // do čeho uživatel naposled klikl, jinak by WASD otáčelo grafem, i když
    // píše do terminálu vedle.
    this.activeWindow = null;
    this.z = 900;
    this.dockSlots = [];
  }

  /** Plugin registruje typ okna. `factory(spec)` okno vytvoří (nebo vrátí
   *  existující – její věc) a MUSÍ ho zavést přes `adopt()`. */
  registerType(kind, factory) {
    this.types.set(kind, factory);
  }

  open(kind, spec) {
    const factory = this.types.get(kind);
    if (!factory) {
      console.warn(`viewbase: neznámý typ okna '${kind}'`);
      return null;
    }
    return factory(spec);
  }

  /** Zaveď okno do evidence (volá factory typu po konstrukci). */
  adopt(win) {
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
   *  Options se stává zdrojem skupiny na screen baru; okno BEZ nich
   *  (detail/control/terminal) skupinu NEMĚNÍ – chová se jako další okno
   *  téže „aplikace", přesně jako na macOS menu pořád patří aplikaci
   *  (rozhodnutí uživatele: nemění se + skrýt na prázdném screenu). */
  _setActive(win) {
    this.activeWindow = win;
    if (win.getOptionsItems() != null) this.optionsSource = win;
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
    this.onOptionsChange(this.optionsSource?.getOptionsItems() ?? null);
  }

  applyTheme() {
    for (const win of this.windows.values()) win.applyTheme();
  }

  _nextZ() {
    this.z += 1;
    return this.z;
  }

  _assignDockSlot(win) {
    let i = this.dockSlots.indexOf(null);
    if (i === -1) { i = this.dockSlots.length; this.dockSlots.push(win); }
    else this.dockSlots[i] = win;
    win._dockSlot = i;
    return i;
  }

  _releaseDockSlot(win) {
    const i = win._dockSlot;
    if (i != null && this.dockSlots[i] === win) this.dockSlots[i] = null;
    win._dockSlot = null;
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
      if (candidate.getOptionsItems() == null) continue;
      if (!next || Number(candidate.el.style.zIndex) > Number(next.el.style.zIndex)) {
        next = candidate;
      }
    }
    this.optionsSource = next;
    this.refreshOptions();
  }
}

/** Grafové okno (window-first model, §3a handoveru: „okno s grafem / graf
 *  může být připojen k vybrané screeně"). Graf se nerenderuje přes celý
 *  kontejner screenu, ale DOVNITŘ obyčejného okna – screen je prázdný
 *  desktop, co hostí N oken (graf, log, detail, control, terminal…).
 *  Tělo okna je jen prázdný hostitel: Renderer si do něj připojí svůj
 *  WebGL canvas sám (graf plugin mu předá `graphWindow.body` místo
 *  celého kontejneru screenu) – proto se tady žádný obsah nestaví.
 *
 *  Bez gadgetu [x] (`closable: false`): zavřený graf by neměl jak se
 *  vrátit (žádné UI ani Python API na znovuotevření) – minimalizace do
 *  doku stačí. Options grafu (fyzika/splajn/2D-3D) dodává
 *  `optionsProvider` z graf pluginu (closure s přístupem k engine/
 *  renderer/store) přes sdílené rozhraní BaseWindow.getOptionsItems. */
import { BaseWindow, MIN_WINDOW_H, MIN_WINDOW_W } from '../../wm/base_window.js';

const INSET_X = 24;       // výchozí odsazení od krajů desktopu (rozhodnutí
const INSET_TOP = 40;     // uživatele: „velké okno přes většinu screenu",
const INSET_BOTTOM = 24;  // vidět pozadí okolo; top počítá se screen barem)

export class GraphWindow extends BaseWindow {
  constructor({ screenId, container, manager, optionsProvider, onResize }) {
    super({
      // id per screen – localStorage perzistence pozice/velikosti (posKey)
      // nesmí kolidovat mezi grafy dvou screenů
      id: `__graph@${screenId ?? 'default'}`, title: 'Graf', widthChars: 80,
      container, manager, kind: 'graph', closable: false, optionsProvider,
    });
    this.onResize = onResize;   // → Renderer._onResize (kamera/composer sizing)
    this._buildBody();
    this._mount();
    if (!this.size) {
      // první otevření bez uloženého záznamu: velké okno s odsazením –
      // _mount by jinak nechal kaskádovou pozici a auto výšku dle obsahu
      // (tělo je prázdné, canvas si velikost bere Z těla, ne naopak)
      const bounds = this._bounds();
      this._applySize(
        Math.max(MIN_WINDOW_W, bounds.width - 2 * INSET_X),
        Math.max(MIN_WINDOW_H, bounds.height - INSET_TOP - INSET_BOTTOM));
      this._place(INSET_X, INSET_TOP);
    }
  }

  _buildBody() {
    const body = document.createElement('div');
    body.dataset.role = 'graph-body';
    // canvas Rendereru čte clientWidth/Height těla – výšku/šířku mu dá
    // _applySize (v konstruktoru výše, nebo uložený záznam v _mount)
    body.style.cssText = 'position:relative;overflow:hidden';
    this.body = body;
    this.el.appendChild(body);
  }

  /** Změna velikosti okna = změna velikosti WebGL plochy: po každém
   *  _applySize (roh, restore, výchozí geometrie) musí Renderer přepočítat
   *  canvas + kameru + composer. Scroll na WebGL ploše nedává smysl –
   *  overflow zpátky na hidden (super ho nastavuje na auto). */
  _applySize(w, h) {
    super._applySize(w, h);
    this.body.style.overflow = 'hidden';
    this.onResize?.();
  }

  /** Titulek grafu = titulek canvasu (dorazí až s `init`, může se změnit
   *  reconnectem) – volá graf plugin z onInit. */
  setTitle(text) {
    this.title = text;
    this.titleEl.textContent = text;
  }

  /** Živé informace o síti v LIŠTĚ GRAFOVÉHO OKNA (uživatelská oprava:
   *  „speciální okno pro síť nese informace o typu sítě (2D/3D atp.) a
   *  informace o uzlech, lišta [screenu] už to nepotřebuje") – lazy
   *  vytvoření elementu vedle gadgetů, formátovaný text dodává graf
   *  plugin (`"3D · N uzlů · M fps"`). */
  setMetrics(text) {
    if (!this.metricsEl) {
      this.metricsEl = document.createElement('span');
      this.metricsEl.dataset.role = 'graph-metrics';
      this.metricsEl.style.cssText = [
        'font-weight:400', 'font-size:11px', 'opacity:0.8',
        'white-space:nowrap', 'flex:0 0 auto',
      ].join(';');
      this.bar.insertBefore(this.metricsEl, this.minGadget);
    }
    this.metricsEl.textContent = text;
  }

  _renderBody() {
    // canvas persistuje v DOM, témata řeší Renderer.applyTheme – no-op
  }
}

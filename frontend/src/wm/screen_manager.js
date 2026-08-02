/** ScreenManager (WM jádro): z-stack desktopů (screen_id -> desktop.js
 *  instance) a drag-reveal (§6 designu, viz drag_reveal.js pro čisté
 *  funkce – každý screen má svůj vlastní perzistentní offset, tažení se
 *  neresetuje/nekomituje). Lišta (titulek + menu + depth gadget) je
 *  SOUČÁST každého screenu (`ScreenBar` uvnitř desktopu) – žádná druhá,
 *  sdílená root lišta navíc. Jen top-2 (přední a bezprostředně za ním)
 *  jsou vidět/renderované, přesně jako na originále (jedna scanline =
 *  max 2 bitmapy); hlubší pozice pauzují i zdroje (desktop deleguje na
 *  pluginy). Navíc routuje proces-wide log záznamy do log oken. */
import screenDepthIcon from '../assets/gadgets/screen-depth.png';
import { createDesktop } from './desktop.js';
import { wirePointerDrag } from './drag.js';
import { offsetAfterDrag, swapFrontWithNext, translateYForOffset } from './drag_reveal.js';

const MAX_PENDING_LOGS = 200;   // záznamy před prvním screenem – strop proti růstu

export class ScreenManager {
  constructor(rootContainer, connection) {
    this.rootContainer = rootContainer;
    this.connection = connection;
    this.instances = new Map();   // screenId (i null pro legacy) -> instance
    this.order = [];              // pořadí vytvoření (evidence, UI ho nepoužívá)
    this.zOrder = [];             // hloubkový stack, index 0 = přední (viz §6)
    this.offsets = new Map();     // screenId -> vlastní perzistentní Y offset (0..1)
    this.dragState = null;        // {screenId, startY, startOffset} během tažení
    this.pendingLogs = [];        // log záznamy došlé dřív, než existuje screen
    this.logAutoOpened = false;   // auto-open proběhl (zavření uživatelem se respektuje)
    // Poslední záchrana pro tažení lišty: puštění tlačítka KDEKOLI na
    // stránce tažení ukončí (primární pojistky – buttons===0 guard,
    // lostpointercapture – jsou ve sdíleném wirePointerDrag, drag.js).
    window.addEventListener('pointerup', () => { this.dragState = null; });
    window.addEventListener('pointercancel', () => { this.dragState = null; });
  }

  get activeId() {
    return this.zOrder[0];
  }

  _createContainer(screenId) {
    const container = document.createElement('div');
    container.dataset.role = 'vb-screen';
    container.dataset.screenId = String(screenId);
    // POZOR: container musí být při vytvoření VIDITELNÝ (žádné display:none) –
    // Renderer uvnitř graf pluginu čte container.clientWidth/Height
    // synchronně při konstrukci (WebGLRenderer.setSize); display:none by v tu
    // chvíli změřilo 0×0 a canvas by zůstal nesprávně nasetovaný navždy (later
    // setActive(true) sizing nepřepočítává, jen togluje display). Schová se
    // (pokud nemá být rovnou vidět) až POTOM přes _layout().
    container.style.cssText = 'position:absolute;inset:0';
    this.rootContainer.appendChild(container);
    return container;
  }

  /** Zaregistruje novou instanci do zOrder/order/instances, zadrátuje její
   *  vlastní lištu (titulek, depth gadgety, drag) a přeloží stav. Nový
   *  screen jde vždy VZADU (`zOrder.push`), nikdy nekrade focus – první
   *  vytvořený je vpředu prostě proto, že byl první. Logy došlé před
   *  úplně prvním screenem (neměly kde bydlet – log je OKNO na screenu,
   *  §3a handoveru) se tady doručí dodatečně. */
  _register(screenId, instance) {
    this.instances.set(screenId, instance);
    this.order.push(screenId);
    this.offsets.set(screenId, 0);
    this.zOrder.push(screenId);
    this._wireScreenChrome(screenId, instance);
    this._layout();
    if (this.pendingLogs.length > 0) {
      const pending = this.pendingLogs;
      this.pendingLogs = [];
      for (const record of pending) this.appendLog(record);
    }
  }

  /** Vrať existující instanci, nebo ji založ (nový DOM kontejner + pipeline).
   *  Volá Connection přes resolveStore při první `init` zprávě daného
   *  screen_id – proto vrací rovnou `.store`, ne instanci samotnou. */
  ensure(screenId) {
    let instance = this.instances.get(screenId);
    if (instance) return instance;
    instance = createDesktop({
      container: this._createContainer(screenId), screenId, connection: this.connection,
    });
    // Titulek čte store.config.title – v okamžiku vytvoření instance ještě
    // není `init` zpracovaný (ensure() běží PŘED store.applyInit, viz
    // resolveStore), takže bez tohohle by první render čítal prázdný
    // config a spadl na fallback `Screen N`. Přerenderuj i při každém
    // dalším initu (reconnect s jiným titulkem apod.).
    instance.store.subscribe((event) => {
      if (event.kind === 'init') this._renderTitle(screenId);
    });
    this._register(screenId, instance);
    return instance;
  }

  resolveStore(screenId) {
    return this.ensure(screenId).store;
  }

  /** Příchozí log záznam (window-first model §3a handoveru): log je OKNO,
   *  ne screen – `tail -f` na log v okně jako AmigaShell. Auto-open na
   *  PŘEDNÍM screenu při prvním záznamu (rozhodnutí uživatele); zprávy pak
   *  tečou do VŠECH otevřených log oken napříč screeny (každé má vlastní
   *  filtr). Log okno nemá close gadget (closable:false, jako AmigaShell) –
   *  jde jen minimalizovat, takže se neztratí; error navíc ukáže Guru
   *  Meditation (main.js). Záznamy před prvním screenem se frontují. */
  appendLog(record) {
    const logWindows = [...this.instances.values()]
      .map((instance) => instance.logWindow())
      .filter(Boolean);
    if (logWindows.length === 0) {
      if (this.logAutoOpened) return;   // divák zavřel – respektuje se
      const front = this.instances.get(this.zOrder[0]);
      if (!front) {
        // ještě není kde okno otevřít – zafrontuj (doručí _register)
        if (this.pendingLogs.length < MAX_PENDING_LOGS) this.pendingLogs.push(record);
        return;
      }
      this.logAutoOpened = true;
      logWindows.push(front.openLog());
    }
    for (const win of logWindows) win.append(record);
  }

  routeAction(msg) {
    this.instances.get(msg.screen_id ?? null)?.handleAction(msg);
  }

  /** JEDINÝ switch gadget (§2 designu reference – referenční screenshot má
   *  na liště jen jednu ikonu vpravo, ne pár): okamžitá plná výměna
   *  popředí/pozadí (na rozdíl od tažení, které je jemné a perzistentní,
   *  viz drag_reveal.js) – oba zúčastněné screeny se vrátí na svůj vlastní
   *  offset 0 (čistý, plně zobrazený stav). Přehled/přepínání NENÍ seznam
   *  tabů – originál taky nemá tab bar. */
  cycleNext() {
    if (this.zOrder.length < 2) return;
    this.zOrder = swapFrontWithNext(this.zOrder);
    this.offsets.set(this.zOrder[0], 0);
    this.offsets.set(this.zOrder[1], 0);
    this._layout();
  }

  /** Přerozdělí viditelnost/z-index/transform podle aktuálního `zOrder` a
   *  KAŽDÉHO screenu vlastního offsetu. Jen top-2 (přední + bezprostředně
   *  za ním) se vykreslují – hlubší pozice jsou úplně schované (§9 designu). */
  _layout() {
    this.zOrder.forEach((id, index) => {
      const instance = this.instances.get(id);
      const offset = this.offsets.get(id) ?? 0;
      if (index === 0) {
        instance.setActive(true);
        instance.container.style.zIndex = '20';
        instance.container.style.transform = translateYForOffset(
          offset, instance.container.clientHeight || 0);
      } else if (index === 1) {
        instance.setActive(true);
        instance.container.style.zIndex = '10';
        instance.container.style.transform = translateYForOffset(
          offset, instance.container.clientHeight || 0);
      } else {
        instance.setActive(false);
        instance.container.style.zIndex = '0';
        instance.container.style.transform = '';
      }
      // Fyzika navíc: top-2 běží naplno (mohly by se objevit přes drag),
      // hlubší pozice se plně pauzují – zdroje jdou na screen vepředu
      // (§9 designu, upřesnění: "prostředky jsou na screenu co je vepředu").
      instance.setFullyHidden(index >= 2);
    });
  }

  /** Screen zaniká (create/destroy jsou explicitní páry) – ukonči jeho
   *  pipeline (`ScreenInstance.destroy`), smaž ho ze všech evidencí
   *  (`instances`/`order`/`zOrder`/`offsets`) a přelož zbytek. */
  remove(screenId) {
    const instance = this.instances.get(screenId);
    if (!instance) return;
    // Log okno zaniklé SE screenem nezavřel divák – příští log záznam ho
    // smí auto-otevřít znovu (na novém předním screenu). Ruční zavření
    // okna (gadgetem) naopak logAutoOpened nechává, viz appendLog.
    if (instance.logWindow()) this.logAutoOpened = false;
    instance.destroy();
    this.instances.delete(screenId);
    this.order = this.order.filter((id) => id !== screenId);
    this.zOrder = this.zOrder.filter((id) => id !== screenId);
    this.offsets.delete(screenId);
    if (this.zOrder.length > 0) this._layout();
  }

  _renderTitle(screenId) {
    const instance = this.instances.get(screenId);
    if (!instance) return;
    instance.bar?.setTitle(instance.store?.config?.title || `Screen ${screenId}`);
  }

  /** Zadrátuje screenovu VLASTNÍ lištu (`ScreenBar` – titulek, menu,
   *  depth gadget, drag) – volá se jednou při registraci. Lišta je
   *  SOUČÁST screenu (jeho kontejneru), takže se s ním posouvá jako jeden
   *  blok (uživatelská oprava: „i menu je v rámci screen lišty", „musí se
   *  posouvat celý blok canvasu/screeny"). */
  _wireScreenChrome(screenId, instance) {
    const bar = instance.bar;
    if (!bar) return;
    this._renderTitle(screenId);
    bar.addGadget('vb-screen-switch', screenDepthIcon,
      'Přepnout na další screen', () => this.cycleNext());
    this._wireDrag(screenId, bar.bar);
  }

  /** Tažení JE součástí lišty samotné (celá plocha mimo interaktivní děti
   *  – menu skupiny a gadgety mají vlastní `pointerdown` stopPropagation,
   *  viz screen_menu.js) – jen přední screen (`zOrder[0]`) se dá takhle
   *  odtáhnout, klik na odkrytou lištu screenu POD ním (zatím) nic nedělá.
   *  Kumulativní k offsetu, kde screen byl na začátku gesta
   *  (`offsetAfterDrag`) – a na puštění se ZÁMĚRNĚ nic neresetuje ani
   *  neprohazuje (uživatelská oprava: „tam kam dotáhnu lištu, tam zůstává
   *  obraz rozdělen" – žádný snap-back/auto-commit). */
  _wireDrag(screenId, barEl) {
    wirePointerDrag(barEl, {
      onStart: (e) => {
        if (this.zOrder[0] !== screenId) return null;
        this.dragState = {
          screenId, startY: e.clientY, startOffset: this.offsets.get(screenId) ?? 0,
        };
        return this.dragState;
      },
      onMove: (e, drag) => {
        const instance = this.instances.get(screenId);
        if (!instance) return;
        const delta = e.clientY - drag.startY;
        const next = offsetAfterDrag(
          drag.startOffset, delta, instance.container.clientHeight || 0);
        this.offsets.set(screenId, next);
        this._layout();
      },
      onEnd: () => {
        this.dragState = null;
        // ŽÁDNÝ _layout()/reset tady – offset zůstal, kam ho tažení dotáhlo.
      },
    });
  }
}

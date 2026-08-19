/** Zamčené okno (`private=True` na kterémkoli typu okna).
 *
 *  Server posílá zamčené okno jako PRÁZDNÝ RÁM (`kind:"locked"`): titulek a
 *  rozměry ano, obsah ne – po drátě neputuje ani HTML, ani hodnoty polí, ani
 *  scrollback. Tady se vykreslí jen rám s poznámkou; o kód si divák řekne sám
 *  přes `Options → Unlock Window` (zelená výzva, core/unlock_prompt.js ve
 *  stylu Guru Meditation) – nic mu nevyskakuje samo. Po odemčení pošle
 *  server skutečné `open_window` s obsahem a plugin daného typu placeholder
 *  nahradí – stejnou cestou jako každé jiné okno se stejným `window_id`.
 *
 *  Díky tomu o zámku neví ANI JEDEN plugin: jeden typ okna, jedna výzva. */
import { BaseWindow } from './base_window.js';

const PX_PER_CH = 8;

export class LockedWindow extends BaseWindow {
  constructor({ id, title, realKind, width, height, closable, container, manager,
    onUnlockRequest }) {
    super({
      id, title, widthChars: Math.max(20, Math.round((Number(width) || 420) / PX_PER_CH)),
      container, manager, kind: 'locked', closable,
    });
    this.realKind = realKind ?? 'window';
    this.height = Number(height) > 0 ? Number(height) : 200;
    this.onUnlockRequest = onUnlockRequest;
    this.private = true;              // Options → Unlock Window (window_manager)
    this._buildBody();
    this._mount();
  }

  _buildBody() {
    const body = document.createElement('div');
    body.dataset.role = 'locked-body';
    body.style.cssText = [
      `width:${this.widthChars}ch`, `height:${this.height}px`, 'max-width:92vw',
      'display:flex', 'align-items:center', 'justify-content:center',
      'padding:8px 10px', 'text-align:center',
      'font:13px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace',
      'color:var(--vb-window-key, #667788)',
    ].join(';');
    // Klik do okna výzvu NEVYVOLÁ (uživatelské rozhodnutí): okno se jen
    // aktivuje jako každé jiné a o kód si divák řekne z lišty, až bude
    // chtít – jediná cesta k výzvě je `Options → Unlock Window`.
    body.textContent = 'Private window. Unlock this window via the Options menu.';
    this.body = body;
    this.el.appendChild(body);
  }

  /** Vyvolej zelenou výzvu na kód (klik do okna i Options → Unlock Window). */
  requestUnlock() {
    this.onUnlockRequest?.(this);
  }

  /** Zamčené okno vlastní Options nemá (a nesmí nic prozradit) – `Unlock
   *  Window` do skupiny přidá jádro WM podle `private`, stejně jako `Lock
   *  Window` u odemčených oken (wm/window_manager.js, DRY). */
  getOptionsItems() {
    return null;
  }

  _renderBody() { /* statický rám, téma řeší CSS proměnné */ }
}

/** Instalace do desktopu: typ okna 'locked' + akce `window_state` (odmítnutý
 *  kód). `unlockPrompt` je sdílená zelená výzva (core/unlock_prompt.js). */
export function createLockedPlugin({ container, windowManager, sendEvent, unlockPrompt }) {
  const prompt = unlockPrompt;
  const ask = (win) => prompt?.ask(win.id, win.title);   // Options → Unlock Window
  // Esc ve výzvě = „teď ne": zmizí VÝZVA, okno zůstane jako zamčený rám.
  // (Dřív se okno zavíralo. Uživatelský požadavek „označí private window a
  // v Options dostane Unlock Window" ale předpokládá, že tam okno pořád je –
  // zavřený placeholder by nešlo označit. Aktivace navíc rovnou přepne
  // Options na tohle okno, takže je odemčení na jeden klik.)
  if (prompt) prompt.onCancel = (id) => windowManager.get(id)?.bringToFront();

  windowManager.registerType('locked', (spec) => {
    windowManager.get(spec.window_id)?.close();
    const win = windowManager.adopt(new LockedWindow({
      id: spec.window_id, title: spec.title, realKind: spec.real_kind,
      width: spec.width, height: spec.height, closable: spec.closable,
      container, manager: windowManager,
      onUnlockRequest: ask,
    }));
    win.bringToFront();       // žádná výzva: vyvolá ji až Options → Unlock Window
    return win;
  });

  return {
    name: 'locked',
    actions: {
      window_state: (msg) => {
        const win = windowManager.get(msg.window_id);
        if (msg.state === 'locked') {
          if (win && win.kind === 'locked') prompt?.ask(win.id, win.title);
          prompt?.reject(msg.error || 'Invalid code');
        } else {
          prompt?.resolve(msg.window_id);
        }
      },
    },
  };
}

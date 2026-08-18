/** Výzva k odemčení okna – ve stylu Guru Meditation, ale ZELENÁ a KLIDNÁ
 *  (bez blikání): červená znamená „něco se rozbilo", zelená „systém čeká na
 *  tebe" (uživatelské rozhodnutí; sdílený vzhled je v core/overlay.js).
 *
 *  Ukáže se, když divák otevře nebo aktivuje okno se `secured=True`. Kód je
 *  šestimístný TOTP z autentikátoru (nebo jednorázový kód z konzole serveru,
 *  když TOTP není nastavené) – jde ven jedinou cestou: událost
 *  `window_unlock` po WebSocketu. Esc zavře výzvu, okno zůstane zamčené. */
import { createOverlay } from './overlay.js';

const GREEN = '#3bf28a';

export class UnlockPrompt {
  constructor(container = document.body, sendEvent = () => {}) {
    this.sendEvent = sendEvent;
    this.windowId = null;
    // Esc = „teď ne" → zmizí výzva, zamčené okno zůstane (znovu se odemyká
    // klikem do něj nebo přes Options → Unlock Window); co přesně s oknem,
    // ví jádro WM, proto callback (nastaví locked_window.js).
    this.onCancel = null;
    const { el, box, line, input } = createOverlay({
      color: GREEN, flash: false, role: 'vb-unlock', input: true,
    });
    this.el = el;
    this.box = box;
    this.input = input;

    this.bar = line('Window Locked.  Enter the code to continue.', 'vb-unlock-bar');
    this.what = line('', 'vb-unlock-what');          // které okno se odemyká
    this.box.append(this.input);
    this.err = line('', 'vb-unlock-error');
    this.hint = line('Authenticator code, or the one-time code from the server console.'
      + '  Esc keeps the window locked (Options → Unlock Window).');

    this.input.inputMode = 'numeric';
    this.input.autocomplete = 'one-time-code';
    this.input.placeholder = '------';
    this.input.addEventListener('keydown', (e) => {
      e.stopPropagation();                            // klávesy nepatří grafu
      if (e.key !== 'Enter') return;
      const code = this.input.value.replace(/\s+/g, '');
      if (code) this.sendEvent({ type: 'event', event: 'window_unlock',
        payload: { window_id: this.windowId, code } });
    });
    this._onKeydown = (e) => {
      if (e.code === 'Escape' && this.visible) {
        e.preventDefault();
        this.cancel();
      }
    };
    // CAPTURE fáze: vstupní pole si klávesy zastavuje (`stopPropagation`
    // níž, aby nešly do grafu) a výzva má vždycky fokus PRÁVĚ v něm – v
    // bublací fázi by sem Esc nikdy nedorazil a nešla by zrušit (živý test).
    window.addEventListener('keydown', this._onKeydown, true);
    container.appendChild(this.el);
  }

  /** Zeptej se na kód pro dané okno (`title` je jen popisek do boxu). */
  ask(windowId, title = '') {
    this.windowId = windowId;
    this.what.textContent = title ? `“${title}”` : '';
    this.err.textContent = '';
    this.input.value = '';
    this.el.style.display = 'block';
    this.input.focus();
  }

  /** Odmítnutý kód: hláška a prázdné pole (server má rate limit i anti-replay). */
  reject(message = 'Invalid code') {
    if (!this.visible) return;
    this.err.textContent = message;
    this.input.value = '';
    this.input.focus();
  }

  /** Divák teď kód zadat nechce: zavři výzvu, okno nech zamčené. */
  cancel() {
    const id = this.windowId;
    this.hide();
    if (id) this.onCancel?.(id);
  }

  /** Okno se odemklo (nebo zmizelo) – výzvu schovej, pokud patřila jemu. */
  resolve(windowId) {
    if (this.windowId === windowId) this.hide();
  }

  hide() {
    this.el.style.display = 'none';
    this.windowId = null;
  }

  get visible() {
    return this.el.style.display !== 'none';
  }
}

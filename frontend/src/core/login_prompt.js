/** Přihlášení k instanci – jméno a kód z autentikátoru.
 *
 *  Ukáže se jen tehdy, když má relace opravdu o co přihlásit: server v rámci
 *  `session` hlásí `hidden > 0` (existují plochy, které anonymní relace
 *  nevidí). Veřejná instance tedy výzvu nikdy neukáže, zavřená ji ukáže
 *  hned – a nikdy se neprozradí, CO je skryté.
 *
 *  Jméno se pamatuje v localStorage, kód nikdy: cachované jméno šetří psaní,
 *  ne důkaz. Stejný vzhled jako výzva k odemčení okna (zelená = systém čeká
 *  na tebe), protože je to tatáž otázka položená o úroveň výš. */
import { createOverlay } from './overlay.js';

const GREEN = '#3bf28a';
const USER_KEY = 'vb_user';

export class LoginPrompt {
  constructor(container = document.body, send = () => {}) {
    this.send = send;
    const { el, box, line, field } = createOverlay({
      color: GREEN, flash: false, role: 'vb-login',
    });
    this.el = el;
    this.box = box;

    this.bar = line('viewBase.  Sign in to continue.', 'vb-login-bar');
    this.user = field({ name: 'user', width: '16ch', spacing: '1px' });
    this.code = field({ name: 'code', width: '10ch' });
    this.user.placeholder = 'user';
    this.code.placeholder = '------';
    this.code.inputMode = 'numeric';
    this.code.autocomplete = 'one-time-code';
    box.append(this.user, this.code);
    this.err = line('', 'vb-login-error');
    this.hint = line('Authenticator code for your user.  '
      + 'Ask the administrator if you do not have one.');

    try {
      this.user.value = window.localStorage.getItem(USER_KEY) ?? '';
    } catch { /* privátní režim: jméno se prostě nepamatuje */ }

    container.appendChild(this.el);

    for (const input of [this.user, this.code]) {
      input.addEventListener('keydown', (e) => {
        e.stopPropagation();                     // klávesy nepatří grafu
        if (e.key !== 'Enter') return;
        if (input === this.user && !this.code.value) { this.code.focus(); return; }
        this._submit();
      });
    }
  }

  _submit() {
    const user = this.user.value.trim();
    const code = this.code.value.replace(/\s+/g, '');
    if (!user || !code) return;
    try {
      window.localStorage.setItem(USER_KEY, user);
    } catch { /* viz výše */ }
    this.send({ type: 'login', user, code });
  }

  /** Zeptej se na jméno a kód (server hlásí skryté plochy). */
  ask() {
    if (this.visible) return;
    this.err.textContent = '';
    this.code.value = '';
    this.el.style.display = 'block';
    (this.user.value ? this.code : this.user).focus();
  }

  /** Odmítnuto: hláška a prázdný kód (rate limit i anti-replay má server). */
  reject(message = 'Sign-in failed') {
    if (!this.visible) return;
    this.err.textContent = message;
    this.code.value = '';
    this.code.focus();
  }

  hide() {
    this.el.style.display = 'none';
  }

  get visible() {
    return this.el.style.display !== 'none';
  }
}

/** HTML plugin (spec 2026-08-17): okno, které vykreslí HTML poslané z
 *  Pythonu – „prohlížeč v prohlížeči" jen pro kód, který mu server pošle.
 *  Chrome dědí z BaseWindow (wm/), tělo je sandboxovaný <iframe srcdoc>:
 *  vlastní dokument = vlastní CSS (nerozbije workbench a naopak),
 *  `sandbox="allow-scripts allow-forms"` výhradně kvůli našemu mostu (klik
 *  na [data-vb-event] i submit <form data-vb-event> → event html_event
 *  s `values`; každý klik na <a> a každý submit je zablokovaný). JS
 *  uživatele neběží (sanitizace v html_doc.js).
 *
 *  Styl obsahu = boilerplate CSS z proměnných tématu (html_doc.js), takže
 *  okno vypadá jako detail/control/terminál a změna tématu ho přebarví
 *  stejně (plugin se hlásí přes onThemeChange a přestaví srcdoc).
 *
 *  Options okno nemá (getOptionsItems → null z BaseWindow) – aktivace
 *  nemění skupinu na liště. */
import { BaseWindow } from '../wm/base_window.js';
import { buildSrcdoc, readThemeVars, sanitizeHtml } from './html_doc.js';

const PX_PER_CH = 8;   // BaseWindow layout počítá šířku ve znacích (jako terminál)

export class HtmlWindow extends BaseWindow {
  constructor({ id, title, width, height, html, closable, container, manager,
    onEvent }) {
    super({
      id, title, widthChars: Math.max(20, Math.round((Number(width) || 560) / PX_PER_CH)),
      container, manager, kind: 'html', closable,
    });
    this.height = Number(height) > 0 ? Number(height) : 320;
    this.html = String(html ?? '');
    this.onEvent = onEvent;
    this._loaded = false;
    this._queue = [];          // zprávy mostu (append/patch) před načtením iframu
    this._buildBody();
    this._mount();
  }

  _buildBody() {
    const body = document.createElement('div');
    body.dataset.role = 'html-body';
    body.style.cssText = [
      `width:${this.widthChars}ch`, `height:${this.height}px`, 'max-width:92vw',
      'display:flex', 'padding:0',
    ].join(';');
    const frame = document.createElement('iframe');
    frame.dataset.role = 'html-frame';
    // allow-scripts = náš most; allow-forms JEN proto, aby ve formuláři
    // vznikla událost submit (most ji vždy preventDefault-uje a pošle
    // values rodiči) – bez ní by sandbox submit zahodil dřív, než ho
    // skript uvidí. Žádné allow-same-origin/popups: dokument je opaque
    // origin, nedosáhne na rodiče ani na localStorage.
    frame.setAttribute('sandbox', 'allow-scripts allow-forms');
    frame.style.cssText = 'flex:1 1 auto;border:0;width:100%;height:100%;background:transparent';
    frame.addEventListener('load', () => {
      this._loaded = true;
      for (const msg of this._queue) this._post(msg);
      this._queue.length = 0;
    });
    this.frame = frame;
    body.appendChild(frame);
    this.body = body;
    this.el.appendChild(body);
    this._render();
  }

  /** Postav srcdoc z aktuálního tématu (proměnné na kontejneru screenu) a
   *  obsahu. Každý nový srcdoc = nový dokument → čeká se znovu na load;
   *  fronta zpráv se zahodí – nový dokument už nese vše, co server poslal
   *  (html_set od serveru je vždy CELÝ aktuální obsah), starší append/patch
   *  by se po load aplikoval podruhé. */
  _render() {
    this._loaded = false;
    this._queue.length = 0;
    this.frame.setAttribute('srcdoc', buildSrcdoc({
      themeVars: readThemeVars(this.container), html: this.html,
    }));
  }

  /** Akce html_set: nahraď obsah. */
  setHtml(html) {
    this.html = String(html ?? '');
    this._render();
  }

  /** Akce html_append: připiš fragment. Než je iframe načtený, frontuje se
   *  (po load se doručí v pořadí); jinak rovnou postMessage mostu, který
   *  drží konec jako terminál. Obsah se skládá i tady kvůli applyTheme
   *  (nový srcdoc musí nést vše, co v okně je). */
  appendHtml(html) {
    const clean = sanitizeHtml(html);
    this.html += clean;
    this._send({ type: 'vb-html-append', html: clean });
  }

  /** Akce html_patch: nahraď jeden prvek (podle id) – rozepsaný text a fokus
   *  ostatních polí přežijí. `this.html` (obsah pro applyTheme) se tím
   *  nemění: po změně tématu server stejně drží pravdu a další html_set
   *  ji přinese; do té doby by nový srcdoc ukázal stav před patchem. */
  patchHtml(id, html) {
    this._send({ type: 'vb-html-patch', id: String(id), html: sanitizeHtml(html) });
  }

  /** Zpráva mostu: po načtení iframu rovnou, jinak do fronty (v pořadí). */
  _send(msg) {
    if (this._loaded) this._post(msg);
    else this._queue.push(msg);
  }

  _post(msg) {
    this.frame.contentWindow?.postMessage(msg, '*');
  }

  /** Zpráva z iframu (plugin ověřil source): klik / změna pole / Enter /
   *  submit formuláře. `values` = hodnoty všech polí okna s typy, `kind` =
   *  click|change|submit, `id` = data-vb-id prvku (null u raw HTML). */
  handleBridgeEvent(data) {
    if (!this.onEvent) return;
    const values = data.values && typeof data.values === 'object' ? data.values : {};
    const kind = ['click', 'change', 'submit'].includes(data.kind) ? data.kind : 'click';
    this.onEvent({ window_id: this.id, event: String(data.event ?? ''), kind,
      id: data.id == null ? null : String(data.id),
      value: data.value === undefined ? null : data.value, values });
  }

  applyTheme() {
    super.applyTheme();
    if (!this.isMinimized) this._render();
  }

  _renderBody() {
    // iframe persistuje; téma řeší applyTheme (nový srcdoc)
  }
}

/** Instalace do desktopu: typ okna 'html' + akce html_set/html_append.
 *  Stejné window_id nahrazuje existující okno (nová definice ze serveru). */
export function createHtmlPlugin({ container, windowManager, sendEvent, onThemeChange }) {
  const windows = new Set();
  windowManager.registerType('html', (spec) => {
    windowManager.get(spec.window_id)?.close();
    const win = windowManager.adopt(new HtmlWindow({
      id: spec.window_id, title: spec.title, width: spec.width,
      height: spec.height, html: spec.html, closable: spec.closable,
      container, manager: windowManager,
      onEvent: (payload) => sendEvent({ type: 'event', event: 'html_event', payload }),
    }));
    windows.add(win);
    win.bringToFront();
    return win;
  });
  // Most: zprávy z iframů. Přijímá se jen zpráva, jejíž source je
  // contentWindow NAŠEHO okna – cizí okna/iframy na stránce se ignorují.
  window.addEventListener('message', (e) => {
    if (!e.data || e.data.type !== 'vb-html-event') return;
    for (const win of windows) {
      if (win.frame.contentWindow === e.source) { win.handleBridgeEvent(e.data); return; }
    }
  });
  onThemeChange?.(() => {
    for (const win of windows) {
      if (windowManager.get(win.id) === win) win.applyTheme();
      else windows.delete(win);              // zavřené okno – úklid
    }
  });
  const target = (msg) => {
    const win = windowManager.get(msg.window_id);
    return win && win.kind === 'html' ? win : null;
  };
  return {
    name: 'html',
    actions: {
      html_set: (msg) => target(msg)?.setHtml(msg.html),
      html_append: (msg) => target(msg)?.appendHtml(msg.html),
      html_patch: (msg) => target(msg)?.patchHtml(msg.id, msg.html),
    },
  };
}

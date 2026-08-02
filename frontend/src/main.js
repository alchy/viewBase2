import { Connection } from './core/connection.js';
import { GuruMeditation } from './core/guru_meditation.js';
import { StatusOverlay } from './core/status.js';
import { formatLogLine } from './plugins/log.js';
import { ScreenManager } from './wm/screen_manager.js';

const status = new StatusOverlay();
const guru = new GuruMeditation();

// Neodchycená chyba/rejection na frontendu = "systém spadl" (uživatelský
// požadavek) – ne jen tiché console.error, které si nikdo nevšimne.
window.addEventListener('error', (e) => {
  guru.show('frontend_error', `${e.message}\n${e.filename}:${e.lineno}:${e.colno}`);
});
window.addEventListener('unhandledrejection', (e) => {
  guru.show('frontend_error', String(e.reason?.stack ?? e.reason));
});

function webglAvailable() {
  try {
    const probe = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext
      && (probe.getContext('webgl2') || probe.getContext('webgl')));
  } catch {
    return false;
  }
}

function bootstrap() {
  const root = document.getElementById('app');

  // screenManager/connection na sobě závisí navzájem (ScreenInstance eventy
  // jdou přes connection.send, connection routuje init/patch/action přes
  // screenManager) – `let` + přiřazení až po obou konstruktorech, closure
  // (resolveStore/onAction) čte proměnnou až při první zprávě ze serveru,
  // tou dobou je `screenManager` už přiřazený.
  let screenManager;
  const wsScheme = location.protocol === 'https:' ? 'wss' : 'ws';
  const connection = new Connection(`${wsScheme}://${location.host}/ws`, null, {
    resolveStore: (screenId) => screenManager.resolveStore(screenId),
    onStatus: (state) => {
      if (state === 'init') {
        status.hide();
        // Jen ztráta spojení se dá "sama spravit" (reconnect proběhl) –
        // JS/backend chybu musí odkliknout uživatel, přesně jako originál.
        guru.dismissIfConnectionRecovered();
      } else if (state === 'close') {
        guru.show('connection_lost',
          'Spojení se serverem vypadlo – zkouším se znovu připojit…');
      } else if (state === 'connect_failed') {
        guru.show('connection_lost',
          'Spojení se serverem se nezdařilo – zkouším se znovu připojit…');
      } else if (state === 'protocol_mismatch') {
        guru.show('connection_lost',
          'Server běží s jinou verzí protokolu – obnovte stránku (F5).');
      }
    },
    onAction: (msg) => {
      // screen_remove (create/destroy jsou explicitní páry, Canvas.close()
      // v Pythonu) boří celou ScreenInstance – řeší ScreenManager sám,
      // ne přeposílat konkrétní instanci (ta zrovna zaniká).
      if (msg.action === 'screen_remove') screenManager.remove(msg.screen_id);
      else screenManager.routeAction(msg);
    },
    onLog: (record) => {
      // „Log má vždy timestamp" (uživatelský požadavek): razítkuje se čas
      // PŘÍJMU na frontendu – jednotné hodiny pro všechny zdroje, backend
      // žádný čas neposílá. Musí proběhnout před append() i guru.show(),
      // ať oba výstupy nesou stejný čas.
      record.timestamp = new Date();
      // Log je OKNO na screenu (window-first model, §3a handoveru), žádný
      // speciální Screen 0 – ScreenManager ho auto-otevře na předním
      // screenu při prvním záznamu a routuje do všech otevřených log oken
      // (filtry si drží každé okno samo).
      screenManager.appendLog(record);
      // error z backendu (výjimka v @canvas.on_click/@canvas.every apod.,
      // nebo explicitní vb.log(level="error")) je taky "systém spadl" –
      // log samotný zůstává navíc v log okně.
      if (record.level === 'error') guru.show('backend_error', formatLogLine(record));
    },
  });
  screenManager = new ScreenManager(root, connection);
  connection.connect();
  window.__viewbase = { screenManager, connection };
}

if (webglAvailable()) {
  bootstrap();
} else {
  status.show('Tento prohlížeč nemá dostupné WebGL – vizualizaci nelze spustit. '
    + 'Zkus jiný prohlížeč nebo zapni hardwarovou akceleraci.');
}

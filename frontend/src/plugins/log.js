/** Log plugin: okno s funkcionalitou log (window-first model §3a handoveru,
 *  „žádný speciální screen s logem nemusí existovat"). Chová se jako
 *  AmigaShell z reference – `tail -f` (nové řádky dolů + autoscroll),
 *  BEZ zavíracího gadgetu (jde jen minimalizovat do doku, takže se
 *  divákovi neztratí). Otevírá ho ScreenManager.appendLog při prvním log
 *  záznamu (auto-open na předním screenu, rozhodnutí uživatele); záznamy
 *  pak tečou do všech otevřených log oken napříč screeny.
 *
 *  Options (přes getOptionsItems, macOS menu bar model): filtr ÚROVNĚ
 *  (debug/info/warning/error) i ZDROJE (frontend/backend_*). Filtr platí
 *  jen pro NOVĚ příchozí řádky (v1 = čistý live tail bez historie,
 *  vědomé rozhodnutí designu).
 *
 *  Čisté funkce filtrování/formátování jsou tady (dřív `log_panel.js` u
 *  zaniklého log screenu) – žádný DOM, testují se jednotkově. */
import { BaseWindow } from '../wm/base_window.js';

export const LOG_LEVELS = ['debug', 'info', 'warning', 'error'];
export const LOG_SOURCES = ['frontend', 'backend_api', 'backend_program', 'backend_user'];

export function defaultLogFilters() {
  return {
    levels: Object.fromEntries(LOG_LEVELS.map((l) => [l, true])),
    sources: Object.fromEntries(LOG_SOURCES.map((s) => [s, true])),
  };
}

/** Projde záznam přes aktuální filtry (checkboxy Options log okna). */
export function matchesFilters(record, filters) {
  if (filters.levels[record.level] === false) return false;
  if (filters.sources[record.source] === false) return false;
  return true;
}

export function filterRecords(records, filters) {
  return records.filter((r) => matchesFilters(r, filters));
}

function formatTime(value) {
  const d = value instanceof Date ? value : new Date(value);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** Jeden řádek do log okna: `HH:MM:SS [level] source/component: message`.
 *  component chybí u frontend/backend_user – nejsou jeden ze čtyř modulů.
 *  `record.timestamp` (Date/ISO string) je nepovinný – main.js ho razítkuje
 *  při příjmu (uživatelský požadavek: „log má vždy timestamp"); bez něj
 *  (např. přímé volání v testech) se čas prostě vynechá. */
export function formatLogLine(record) {
  const tag = record.component ? `${record.source}/${record.component}` : record.source;
  const time = record.timestamp ? `${formatTime(record.timestamp)} ` : '';
  return `${time}[${record.level}] ${tag}: ${record.message}`;
}

const MAX_ROWS = 1000;   // živý tail nesmí růst do nekonečna – nejstarší (nahoře) odpadají

/** Pevné id: log okno je na screenu nejvýš jedno a nesmí se srazit s
 *  window_id z Pythonu (ta jsou uživatelská, tohle je vyhrazený prefix). */
export const LOG_WINDOW_ID = '__log';

export class LogWindow extends BaseWindow {
  constructor({ container, manager }) {
    super({
      id: LOG_WINDOW_ID, title: 'Log', widthChars: 64,
      container, manager, kind: 'log',
      // Jako AmigaShell na referenci (uživatel: „pro nás je to okno bez
      // close – tedy s atributem closable False").
      closable: false,
    });
    this.filters = defaultLogFilters();
    this._buildBody();
    this._mount();
  }

  _buildBody() {
    const body = document.createElement('div');
    body.dataset.role = 'log-body';
    body.style.cssText = [
      'padding:6px 8px', `width:${this.widthChars}ch`, 'max-width:92vw',
      'height:240px', 'overflow-y:auto',
      'font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace',
      'white-space:pre-wrap', 'word-break:break-word',
    ].join(';');
    this.body = body;
    this.el.appendChild(body);
  }

  /** Nový log záznam (razítkovaný timestampem v main.js#onLog) – tail -f:
   *  append dolů, autoscroll na poslední řádek. Filtr se vyhodnocuje při
   *  příjmu – přepnutí checkboxu mění, co se objeví DÁL. */
  append(record) {
    if (!matchesFilters(record, this.filters)) return;
    const row = document.createElement('div');
    row.dataset.role = 'log-row';
    row.textContent = formatLogLine(record);
    this.body.appendChild(row);
    while (this.body.childElementCount > MAX_ROWS) {
      this.body.firstElementChild.remove();
    }
    this.body.scrollTop = this.body.scrollHeight;   // tail drží poslední řádek
  }

  /** Options aktivního log okna (viz BaseWindow.getOptionsItems): dvě sady
   *  checkboxů – úrovně a zdroje. refreshOptions() po přepnutí překreslí
   *  checkmarky. */
  getOptionsItems() {
    const toggle = (kind, key) => (checked) => {
      this.filters[kind][key] = checked;
      this.manager.refreshOptions();
    };
    return [
      ...LOG_LEVELS.map((level) => ({
        key: `level-${level}`, label: level,
        checked: this.filters.levels[level] !== false,
        onToggle: toggle('levels', level),
      })),
      ...LOG_SOURCES.map((source) => ({
        key: `source-${source}`, label: source,
        checked: this.filters.sources[source] !== false,
        onToggle: toggle('sources', source),
      })),
    ];
  }

  _renderBody() {
    // řádky persistují v DOM; téma řeší CSS proměnné, rebuild není potřeba
  }
}

/** Instalace do desktopu: typ okna 'log'. Factory vrací existující okno
 *  (obnovené z doku), nebo založí nové – log okno je na screenu nejvýš
 *  jedno. Žádný bringToFront při auto-open: otevření je pasivní událost
 *  (přišel log záznam), nesmí ukrást aktivaci/Options rozdělané práci. */
export function createLogPlugin({ container, windowManager }) {
  windowManager.registerType('log', () => {
    const existing = windowManager.get(LOG_WINDOW_ID);
    if (existing) {
      if (existing.isMinimized) existing.restore();
      return existing;
    }
    return windowManager.adopt(new LogWindow({ container, manager: windowManager }));
  });
  return { name: 'log' };
}

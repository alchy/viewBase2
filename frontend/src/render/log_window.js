/** Log okno (window-first model, §3a handoveru: „žádný speciální screen s
 *  logem nemusí existovat, ale existuje okno s funkcionalitou log").
 *  Nahrazuje bývalý Screen 0 (log_screen_instance.js) – log je obyčejné
 *  okno na screenu, otevírá ho ScreenManager.appendLog při prvním log
 *  záznamu (auto-open na předním screenu, rozhodnutí uživatele).
 *
 *  Chová se jako AmigaShell z reference (uživatelovo přehodnocení: dřívější
 *  „nové řádky nahoru" platilo pro log SCREEN, kde z částečně odkrytého
 *  screenu koukal jen vršek – „když budeme mít okno jako Amiga Shell, pak
 *  můžeme přidávat zespodu"): klasická konzole, nové řádky DOLŮ +
 *  autoscroll na poslední řádek.
 *
 *  Options (přes getOptionsItems, macOS menu bar model): filtr ÚROVNĚ
 *  (debug/info/warning/error) i ZDROJE (frontend/backend_*) – zdroje jsou
 *  doplněný nedodělek §3b handoveru (defaultLogFilters je počítal vždy,
 *  jen UI je nevystavovalo). Filtr platí jen pro NOVĚ příchozí řádky
 *  (v1 = čistý live tail bez historie, vědomé rozhodnutí designu). */
import {
  LOG_LEVELS, LOG_SOURCES, defaultLogFilters, formatLogLine, matchesFilters,
} from '../screens/log_panel.js';
import { BaseWindow } from './base_window.js';

const MAX_ROWS = 1000;   // živý tail nesmí růst do nekonečna – nejstarší (nahoře) odpadají

export class LogWindow extends BaseWindow {
  /** Pevné id: log okno je na screenu nejvýš jedno a nesmí se srazit s
   *  window_id z Pythonu (ta jsou uživatelská, tohle je vyhrazený prefix). */
  static ID = '__log';

  constructor({ container, manager }) {
    super({
      id: LogWindow.ID, title: 'Log', widthChars: 64,
      container, manager, kind: 'log',
      // Jako AmigaShell na referenci (uživatel: „pro nás je to okno bez
      // close – tedy s atributem closable False"): textové okno bez
      // zavíracího gadgetu – jde jen minimalizovat do doku, takže se
      // divákovi nemůže ztratit a logy vždycky mají kam téct.
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

  /** Nový log záznam (razítkovaný timestampem v main.js#onLog). Filtr se
   *  vyhodnocuje při příjmu – přepnutí checkboxu mění, co se objeví DÁL,
   *  ne co už je vypsané (live tail bez historie). */
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
   *  checkboxů – úrovně a zdroje. refreshOptions() po každém přepnutí
   *  překreslí checkmarky (dropdown zůstává otevřený, přepínač ne příkaz). */
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

/** Log Screen 0 (§3a designu): čisté filtrování a formátování log záznamů.
 *  UI (log_window.js) na tyhle funkce navazuje – žádný DOM tady. */

export const LOG_LEVELS = ['debug', 'info', 'warning', 'error'];
export const LOG_SOURCES = ['frontend', 'backend_api', 'backend_program', 'backend_user'];

export function defaultLogFilters() {
  return {
    levels: Object.fromEntries(LOG_LEVELS.map((l) => [l, true])),
    sources: Object.fromEntries(LOG_SOURCES.map((s) => [s, true])),
  };
}

/** Projde záznam přes aktuální filtry (checkboxy Options pro Screen 0). */
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

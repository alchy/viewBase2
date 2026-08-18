import { describe, expect, it } from 'vitest';
import {
  LOG_LEVELS, LOG_SOURCES, defaultLogFilters, filterRecords,
  formatLogLine, matchesFilters,
} from '../src/plugins/log.js';

const rec = (overrides) => ({
  level: 'info', source: 'backend_program', message: 'x', component: null,
  ...overrides,
});

describe('defaultLogFilters', () => {
  it('všechny úrovně a zdroje zapnuté', () => {
    const filters = defaultLogFilters();
    for (const level of LOG_LEVELS) expect(filters.levels[level]).toBe(true);
    for (const source of LOG_SOURCES) expect(filters.sources[source]).toBe(true);
  });
});

describe('matchesFilters', () => {
  it('projde defaultními filtry', () => {
    expect(matchesFilters(rec({}), defaultLogFilters())).toBe(true);
  });

  it('vypnutá úroveň záznam vyfiltruje', () => {
    const filters = defaultLogFilters();
    filters.levels.info = false;
    expect(matchesFilters(rec({ level: 'info' }), filters)).toBe(false);
    expect(matchesFilters(rec({ level: 'error' }), filters)).toBe(true);
  });

  it('vypnutý zdroj záznam vyfiltruje', () => {
    const filters = defaultLogFilters();
    filters.sources.frontend = false;
    expect(matchesFilters(rec({ source: 'frontend' }), filters)).toBe(false);
    expect(matchesFilters(rec({ source: 'backend_api' }), filters)).toBe(true);
  });
});

describe('filterRecords', () => {
  it('vrátí jen ty, co projdou filtry', () => {
    const filters = defaultLogFilters();
    filters.levels.debug = false;
    const records = [rec({ level: 'debug' }), rec({ level: 'info' })];
    expect(filterRecords(records, filters)).toEqual([rec({ level: 'info' })]);
  });
});

describe('formatLogLine', () => {
  it('s component: source/component', () => {
    const line = formatLogLine(rec({
      level: 'warning', source: 'backend_program', component: 'server',
      message: 'reconnect klienta',
    }));
    expect(line).toBe('[warning] backend_program/server: reconnect klienta');
  });

  it('bez component (frontend/backend_user): jen source', () => {
    const line = formatLogLine(rec({
      level: 'error', source: 'frontend', component: null, message: 'boom',
    }));
    expect(line).toBe('[error] frontend: boom');
  });

  it('s timestampem: CELÉ razítko YYYY-MM-DD HH:MM:SS', () => {
    // instance běží dny a log se vyhodnocuje zpětně – bez data se nepozná,
    // jestli „09:05:03 invalid code" bylo dnes, nebo předevčírem
    const line = formatLogLine(rec({
      level: 'info', source: 'backend_user', component: null, message: 'ahoj',
      timestamp: new Date(2026, 0, 1, 9, 5, 3),
    }));
    expect(line).toBe('2026-01-01 09:05:03 [info] backend_user: ahoj');
  });

  it('bez timestampu (přímé volání, testy) beze změny – žádný čas navíc', () => {
    const line = formatLogLine(rec({ level: 'info', source: 'backend_user', message: 'ahoj' }));
    expect(line).toBe('[info] backend_user: ahoj');
  });
});

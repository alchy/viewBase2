/** Čisté sloučení témat, oddělené od manager.js/themes.js aby se dalo
 *  importovat z obou (themes.js potřebuje deepMerge pro workbench = merge
 *  přes modern už při registraci – viz komentář u workbench v themes.js). */
export function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Rekurzivní merge: objekty se slévají, pole a skaláry přepisují celé. */
export function deepMerge(base, override) {
  const out = { ...base };
  for (const [key, value] of Object.entries(override)) {
    out[key] = (isPlainObject(out[key]) && isPlainObject(value))
      ? deepMerge(out[key], value)
      : value;
  }
  return out;
}

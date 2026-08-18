/** Session id prohlížeče (`vb_sid`).
 *
 *  Odemčení zabezpečeného okna nepatří OKNU, ale RELACI: server si drží
 *  granty dvojice (relace, okno) a podle nich rozhoduje, komu pošle obsah a
 *  od koho přijme vstup (python/viewbase/sessions.py). Prohlížeč k tomu drží
 *  jedinou hodnotu — neprůhledné id, které mu server přidělil v `init`.
 *
 *  `localStorage` (uživatelské rozhodnutí): F5 ani restart prohlížeče
 *  neodhlásí, dokud běží klouzavá platnost relace. Konec řeší expirace,
 *  `Lock Window` a `Logout`.
 *
 *  Není to tajemství chráněné šifrou — po drátě ho chrání TLS, které je mimo
 *  loopback povinné. Sandboxovaná HTML okna (opaque origin) na `localStorage`
 *  rodiče nedosáhnou. */

const KEY = 'vb_sid';

/** Uložené id, nebo `null` (první návštěva / vyčištěné úložiště). */
export function loadSid() {
  try {
    return localStorage.getItem(KEY) || null;
  } catch {
    return null;                 // privátní režim / zakázané úložiště
  }
}

/** Ulož id přidělené serverem (přijde v `init`). */
export function saveSid(sid) {
  if (!sid) return;
  try {
    localStorage.setItem(KEY, sid);
  } catch { /* bez úložiště relace přežije jen do reloadu – funkční, jen míň pohodlné */ }
}

/** Zapomeň relaci (logout). Server si ji zahodí sám podle expirace. */
export function clearSid() {
  try {
    localStorage.removeItem(KEY);
  } catch { /* nic k mazání */ }
}

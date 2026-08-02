/** Guru Meditation (Amiga crash screen homage) – čisté funkce pro
 * "#AAAAAAAA.BBBBBBBB" kód. Reálná Amiga tam měla alert number.task
 * pointer; tady místo skutečné paměti hashujeme zprávu, ať je kód
 * stabilní pro stejnou chybu (reprodukovatelné hlášení), ne náhodný. */

const ALERT_NUMBERS = {
  frontend_error: '81000004',    // DSERR-ish rozsah, neodchycená JS chyba
  connection_lost: '8100000B',   // ztráta spojení / protocol_mismatch
  backend_error: '81000003',     // backend_program/backend_user error log
};

/** Deterministický 32bit hash (FNV-1a) – stejný text => stejný kód napříč
 * pády, ať jde chybu poznat z historie beze čtení detailu. */
export function hashHex(text) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
}

export function guruCode(kind, detail) {
  const alert = ALERT_NUMBERS[kind] ?? ALERT_NUMBERS.frontend_error;
  return `${alert}.${hashHex(detail ?? '')}`;
}

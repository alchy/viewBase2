/** Dok minimalizovaných oken – čistá geometrie (bez DOM), testovaná.
 *
 *  Minimalizované okno je proužek s titulkem (šířka podle textu) vlevo dole;
 *  další se řadí vedle něj, po zaplnění řady se „stosují" do řady nad ní.
 *  Proužky jdou tahat (uvnitř plátna), pamatují si pozici a nikdy se
 *  nepřekryjí: mezi sebou drží DOCK_GAP px ze všech stran – při tažení do
 *  souseda „narazí" (uživatelské rozhodnutí). Z-order řeší WindowManager
 *  (proužky jsou vždy za všemi okny). */

export const DOCK_GAP = 4;   // px mezera mezi proužky ze všech stran

/** Překrývají se dva obdélníky, když mezi nimi má být mezera `gap`? */
export function overlaps(a, b, gap = DOCK_GAP) {
  return a.x < b.x + b.w + gap && a.x + a.w + gap > b.x
    && a.y < b.y + b.h + gap && a.y + a.h + gap > b.y;
}

/** Přichyť obdélník celý na plátno (proužek nesmí ven). */
export function clampRect(rect, bounds) {
  return {
    x: Math.max(0, Math.min(rect.x, bounds.width - rect.w)),
    y: Math.max(0, Math.min(rect.y, bounds.height - rect.h)),
  };
}

/** První volné místo pro proužek w×h: řady odspodu, v řadě zleva; kandidát
 *  je vždy hned za pravým okrajem některého proužku téže řady (nebo levý
 *  kraj), aby se různě široké proužky skládaly těsně s mezerou. */
export function findFreeSlot(others, w, h, bounds, gap = DOCK_GAP) {
  const rowH = h + gap;
  for (let y = bounds.height - h - gap; y >= 0; y -= rowH) {
    const inRow = others.filter((o) => o.y < y + h + gap && o.y + o.h + gap > y);
    const starts = [gap, ...inRow.map((o) => o.x + o.w + gap)].sort((a, b) => a - b);
    for (const x of starts) {
      if (x + w > bounds.width) continue;
      const cand = { x, y, w, h };
      if (!inRow.some((o) => overlaps(cand, o, gap))) return { x, y };
    }
  }
  return { x: gap, y: 0 };   // plátno plné – aspoň levý horní roh
}

/** Tažení proužku: cíl přichycený na plátno; koliduje-li se sousedem, zkus
 *  posun jen v x, jen v y, jinak zůstaň – proužek do souseda „narazí". */
export function resolveDockDrag(prev, target, others, bounds, gap = DOCK_GAP) {
  const t = clampRect({ x: target.x, y: target.y, w: prev.w, h: prev.h }, bounds);
  const free = (x, y) => !others.some((o) => overlaps({ x, y, w: prev.w, h: prev.h }, o, gap));
  if (free(t.x, t.y)) return { x: t.x, y: t.y };
  if (free(t.x, prev.y)) return { x: t.x, y: prev.y };
  if (free(prev.x, t.y)) return { x: prev.x, y: t.y };
  return { x: prev.x, y: prev.y };
}

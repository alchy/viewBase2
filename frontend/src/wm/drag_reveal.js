/** Drag-reveal (§6 designu): Amiga "napůl stažený screen" – posun CELÉHO
 *  bufferu screenu jako jednoho bloku (`transform: translateY`), NE
 *  odshora mizející clip (uživatelská oprava: „posouvám, odkud se mi to
 *  zobrazuje vertikálně – nic se nemění, screen je konzistentní, jen
 *  posouvám, kde začínám zobrazovat" – přesně to, co dělal reálný Agnus:
 *  mapování bitmapa→scanline se posune, obsah bitmapy zůstává netknutý).
 *
 *  Model (uživatelská oprava – „double buffer, buffer 0 má Y offset,
 *  buffer 1 taky, můžu offsety měnit"): KAŽDÝ screen má svůj vlastní,
 *  PERZISTENTNÍ offset (0..1), ne jednu sdílenou hodnotu jen pro
 *  „přední" screen. Tažení je KUMULATIVNÍ k offsetu, kde screen byl na
 *  začátku gesta (`offsetAfterDrag`) – druhé tažení pokračuje odtud, ne
 *  od nuly. Na puštění se ZÁMĚRNĚ nic neresetuje ani neprohazuje pořadí
 *  (žádný snap-back/auto-commit) – „tam kam dotáhnu lištu, tam zůstává
 *  obraz rozdělen". Pořadí (`zOrder`) mění jen depth gadgety
 *  (`ScreenManager.cycleNext`/`sendActiveToBack`), ne tažení samotné.
 *
 *  Čisté funkce tady, DOM/pointer wiring je v manager.js. */
export const SCREEN_BAR_MARGIN = 6;   // mezera nahoře i po stranách (plovoucí lišta)
export const SCREEN_BAR_HEIGHT = 26;

export function clampDragOffset(value) {
  return Math.max(0, Math.min(1, value));
}

/** Nový offset po tažení – kumulativní k `startOffset` (kde byl screen na
 *  začátku gesta), NE od nuly. Kladné `deltaY` (tažení dolů) offset
 *  zvyšuje (víc odkrývá screen POD); záporné (tažení nahoru) ho snižuje
 *  zpátky (screen se dá i "zasunout" nazpátek, ne jen odkrývat). */
export function offsetAfterDrag(startOffset, deltaY, containerHeight) {
  if (!containerHeight || containerHeight <= 0) return startOffset;
  return clampDragOffset(startOffset + deltaY / containerHeight);
}

/** CSS transform pro screen s daným offsetem. offset 0 -> žádný posun
 *  (screen na svém místě); jinak posune CELÝ blok (canvas i jeho menu bar
 *  – všechno uvnitř kontejneru) dolů o `offset * containerHeight` px. */
export function translateYForOffset(offset, containerHeight) {
  if (offset <= 0) return '';
  const px = Math.round(clampDragOffset(offset) * containerHeight);
  return `translateY(${px}px)`;
}

/** Depth gadget (§2 designu reference): prohodí prvního (předního) se
 *  druhým (bezprostředně za ním) – zbytek stacku (3.+ pozice) se nemění.
 *  Kratší než 2 prvky -> není co prohodit, vrať kopii beze změny. */
export function swapFrontWithNext(zOrder) {
  if (zOrder.length < 2) return zOrder.slice();
  const [front, next, ...rest] = zOrder;
  return [next, front, ...rest];
}

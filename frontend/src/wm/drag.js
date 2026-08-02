/** Sdílené pointer-drag chování (WM jádro). Jediné místo, kde žijí
 *  pojistky proti „drží se to myši" (uživatelský bug, občasný – ztracený
 *  pointerup při capture glitchi na reálném HW):
 *  1. pohyb BEZ drženého tlačítka (`e.buttons === 0`) tažení okamžitě
 *     ukončí – bez tlačítka žádné legitimní tažení není,
 *  2. `lostpointercapture` ukončí tažení, i když žádný pointerup/cancel
 *     nikdy nedorazí.
 *  Dřív bylo tohle wiring opsané třikrát (okno za lištu, resize za roh,
 *  drag-reveal lišty screenu) a pojistky se dopisovaly na každé místo
 *  zvlášť – přesně tak sticky bug vznikl.
 *
 *  Kontrakt:
 *  - `onStart(e)` vrací stav tažení, nebo null/undefined = tažení nezačne
 *    (např. klik na gadget, screen není vpředu).
 *  - `onMove(e, state)` dostává živý stav při každém pohybu.
 *  - `onEnd(e, state)` se volá PRÁVĚ jednou na konec (up/cancel/ztráta
 *    capture/guard) – vhodné pro perzistenci pozice.
 *  Capture na `el` zařizuje utilita sama. */
export function wirePointerDrag(el, { onStart, onMove, onEnd = () => {} }) {
  let state = null;

  const end = (e) => {
    if (state === null) return;
    const finished = state;
    state = null;
    try { el.releasePointerCapture(e.pointerId); } catch { /* noop */ }
    onEnd(e, finished);
  };

  el.addEventListener('pointerdown', (e) => {
    const started = onStart(e);
    if (started === null || started === undefined) return;
    state = started;
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener('pointermove', (e) => {
    if (state === null) return;
    if (e.buttons === 0) { end(e); return; }   // pojistka 1: sticky guard
    onMove(e, state);
  });
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
  el.addEventListener('lostpointercapture', end);   // pojistka 2
}

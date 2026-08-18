// @vitest-environment happy-dom
/** Pointer capture je jen optimalizace (držet události, když ukazatel opustí
 *  prvek) – když ho prohlížeč odmítne (`NotFoundError: No active pointer…`,
 *  reálně u syntetických/asistivních vstupů), tažení musí běžet dál a hlavně
 *  NESMÍ vyletět výjimka: neodchycená chyba v handleru = Guru Meditation
 *  divákovi na obrazovce. */
import { describe, expect, it, vi } from 'vitest';
import { wirePointerDrag } from '../src/wm/drag.js';

function ev(type, extra = {}) {
  return new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 7,
    isPrimary: true, button: 0, buttons: 1, clientX: 0, clientY: 0, ...extra });
}

describe('wirePointerDrag – selhání pointer capture', () => {
  it('setPointerCapture, který hodí výjimku, tažení nerozbije ani nepropustí chybu', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    el.setPointerCapture = () => { throw new DOMException('No active pointer', 'NotFoundError'); };
    el.releasePointerCapture = () => { throw new DOMException('No active pointer', 'NotFoundError'); };
    const onMove = vi.fn();
    const onEnd = vi.fn();
    wirePointerDrag(el, { onStart: () => ({ ok: true }), onMove, onEnd });

    expect(() => el.dispatchEvent(ev('pointerdown'))).not.toThrow();
    el.dispatchEvent(ev('pointermove', { clientX: 20, clientY: 10 }));
    expect(onMove).toHaveBeenCalledTimes(1);                  // tažení běží dál
    expect(() => el.dispatchEvent(ev('pointerup', { buttons: 0 }))).not.toThrow();
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it('prvek bez pointer capture API (starší/omezené prostředí) tažení taky zvládne', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    el.setPointerCapture = undefined;
    el.releasePointerCapture = undefined;
    const onEnd = vi.fn();
    wirePointerDrag(el, { onStart: () => ({}), onMove: () => {}, onEnd });
    expect(() => el.dispatchEvent(ev('pointerdown'))).not.toThrow();
    expect(() => el.dispatchEvent(ev('pointerup', { buttons: 0 }))).not.toThrow();
    expect(onEnd).toHaveBeenCalledTimes(1);
  });
});

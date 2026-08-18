import { describe, expect, it } from 'vitest';
import { knobGeometry, scrollFromKnob } from '../src/wm/frame.js';

describe('rám okna – geometrie svislého knobu (WB scrollbar)', () => {
  it('bez přesahu obsahu je knob přes celou dráhu', () => {
    expect(knobGeometry(0, 100, 200, 150)).toEqual({ offset: 0, size: 150 });
  });

  it('knob je úměrný viditelné části a posouvá se se scrollem', () => {
    const top = knobGeometry(0, 400, 100, 200);
    expect(top).toEqual({ offset: 0, size: 50 });
    const half = knobGeometry(150, 400, 100, 200);          // scroll v půli (150/300)
    expect(half.size).toBe(50);
    expect(half.offset).toBeCloseTo(75, 5);
    const end = knobGeometry(300, 400, 100, 200);
    expect(end.offset).toBeCloseTo(150, 5);                 // dole = trackLen - size
  });

  it('knob nikdy nepodleze minimum', () => {
    expect(knobGeometry(0, 100000, 100, 200).size).toBe(12);
  });

  it('scrollFromKnob je inverzí knobGeometry', () => {
    const geo = knobGeometry(120, 400, 100, 200);
    expect(scrollFromKnob(geo.offset, 200, geo.size, 400, 100)).toBeCloseTo(120, 5);
    expect(scrollFromKnob(-50, 200, 50, 400, 100)).toBe(0);         // ořez
    expect(scrollFromKnob(999, 200, 50, 400, 100)).toBe(300);
  });
});

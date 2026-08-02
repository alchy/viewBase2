import { describe, expect, it } from 'vitest';
import {
  clampDragOffset, offsetAfterDrag, swapFrontWithNext, translateYForOffset,
} from '../src/wm/drag_reveal.js';

describe('clampDragOffset', () => {
  it('ořízne do 0..1', () => {
    expect(clampDragOffset(-0.5)).toBe(0);
    expect(clampDragOffset(1.5)).toBe(1);
    expect(clampDragOffset(0.4)).toBe(0.4);
  });
});

describe('offsetAfterDrag', () => {
  it('od nuly: poměr posunu k výšce kontejneru', () => {
    expect(offsetAfterDrag(0, 0, 400)).toBe(0);
    expect(offsetAfterDrag(0, 200, 400)).toBe(0.5);
    expect(offsetAfterDrag(0, 400, 400)).toBe(1);
  });

  it('kumulativní k počátečnímu offsetu (druhé tažení pokračuje odtud)', () => {
    expect(offsetAfterDrag(0.5, 100, 400)).toBe(0.75);
  });

  it('záporné deltaY (tažení nahoru) offset snižuje zpátky', () => {
    expect(offsetAfterDrag(0.5, -200, 400)).toBe(0);
  });

  it('ořízne přes plnou výšku i pod nulu', () => {
    expect(offsetAfterDrag(0, 800, 400)).toBe(1);
    expect(offsetAfterDrag(0, -100, 400)).toBe(0);
  });

  it('nulová/neplatná výška kontejneru -> vrátí startOffset beze změny', () => {
    expect(offsetAfterDrag(0.3, 100, 0)).toBe(0.3);
    expect(offsetAfterDrag(0.3, 100, null)).toBe(0.3);
  });
});

describe('translateYForOffset', () => {
  it('offset 0 -> žádný posun', () => {
    expect(translateYForOffset(0, 400)).toBe('');
  });

  it('offset > 0 -> translateY podle offset * výška (celý blok dolů)', () => {
    expect(translateYForOffset(0.5, 400)).toBe('translateY(200px)');
    expect(translateYForOffset(1, 400)).toBe('translateY(400px)');
  });

  it('zaokrouhlí na celé px', () => {
    expect(translateYForOffset(1 / 3, 100)).toBe('translateY(33px)');
  });
});

describe('swapFrontWithNext', () => {
  it('prohodí první dva, zbytek nechá být', () => {
    expect(swapFrontWithNext([1, 2, 3])).toEqual([2, 1, 3]);
  });

  it('dva prvky', () => {
    expect(swapFrontWithNext([1, 2])).toEqual([2, 1]);
  });

  it('míň než dva prvky -> kopie beze změny', () => {
    expect(swapFrontWithNext([1])).toEqual([1]);
    expect(swapFrontWithNext([])).toEqual([]);
  });

  it('nemutuje vstup', () => {
    const input = [1, 2, 3];
    swapFrontWithNext(input);
    expect(input).toEqual([1, 2, 3]);
  });
});

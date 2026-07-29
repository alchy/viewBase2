import { describe, expect, it } from 'vitest';
import {
  MIN_WINDOW_H, MIN_WINDOW_W, posKey, resizeGeometry,
} from '../src/render/base_window.js';

describe('posKey (perzistence pozic oken)', () => {
  it('klíč z id okna', () => {
    expect(posKey('konzole', 'Dotaz')).toBe('vb-pos:konzole');
  });

  it('bez id poslouží název okna', () => {
    expect(posKey(undefined, 'Aktivační okno')).toBe('vb-pos:Aktivační okno');
  });

  it('bez id i názvu se neukládá (null)', () => {
    expect(posKey(undefined, '')).toBe(null);
    expect(posKey(null, undefined)).toBe(null);
  });
});

describe('resizeGeometry (tažení za rohový úchyt)', () => {
  const start = { x: 100, y: 80, w: 300, h: 200 };
  const bounds = { width: 1600, height: 900 };
  const min = { w: MIN_WINDOW_W, h: MIN_WINDOW_H };

  it('roh vpravo dole zvětšuje šířku i výšku, pozice stojí', () => {
    expect(resizeGeometry(start, 'se', 120, 60, min, bounds))
      .toEqual({ x: 100, y: 80, w: 420, h: 260 });
  });

  it('roh vlevo dole hýbe levou hranou – pravá zůstává na místě', () => {
    const geo = resizeGeometry(start, 'sw', -50, 40, min, bounds);
    expect(geo).toEqual({ x: 50, y: 80, w: 350, h: 240 });
    expect(geo.x + geo.w).toBe(start.x + start.w);
  });

  it('zmenšování se zastaví na minimu (obě strany)', () => {
    expect(resizeGeometry(start, 'se', -999, -999, min, bounds))
      .toEqual({ x: 100, y: 80, w: MIN_WINDOW_W, h: MIN_WINDOW_H });
    const sw = resizeGeometry(start, 'sw', 999, -999, min, bounds);
    expect(sw.w).toBe(MIN_WINDOW_W);
    expect(sw.x + sw.w).toBe(start.x + start.w);   // pravá hrana drží
  });

  it('okno se nezvětší mimo plátno', () => {
    const geo = resizeGeometry(start, 'se', 9000, 9000, min, bounds);
    expect(geo.x + geo.w).toBe(bounds.width);
    expect(geo.y + geo.h).toBe(bounds.height);
  });

  it('levá hrana se nedostane za okraj plátna', () => {
    const geo = resizeGeometry(start, 'sw', -9000, 0, min, bounds);
    expect(geo.x).toBe(0);
    expect(geo.w).toBe(start.x + start.w);
  });
});

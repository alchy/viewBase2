import { describe, expect, it } from 'vitest';
import {
  DRAG_KEEP_PX, MIN_WINDOW_H, MIN_WINDOW_W, clampDragPosition, posKey,
  resizeGeometry,
} from '../src/wm/base_window.js';
import { SCREEN_BAR_HEIGHT } from '../src/wm/drag_reveal.js';

describe('clampDragPosition (tažení okna za lištu)', () => {
  const bounds = { width: 800, height: 600 };
  const w = 300;
  const headerH = 28;

  it('uvnitř plátna beze změny', () => {
    expect(clampDragPosition(100, 120, w, headerH, bounds)).toEqual({ x: 100, y: 120 });
  });

  it('lišta okna nikdy nezajede pod lištu obrazovky (y >= SCREEN_BAR_HEIGHT)', () => {
    expect(clampDragPosition(100, 0, w, headerH, bounds).y).toBe(SCREEN_BAR_HEIGHT);
    expect(clampDragPosition(100, -500, w, headerH, bounds).y).toBe(SCREEN_BAR_HEIGHT);
    expect(clampDragPosition(100, SCREEN_BAR_HEIGHT, w, headerH, bounds).y)
      .toBe(SCREEN_BAR_HEIGHT);
  });

  it('doleva smí okno ven, ale DRAG_KEEP_PX lišty zůstane vidět', () => {
    expect(clampDragPosition(-100, 120, w, headerH, bounds).x).toBe(-100);
    expect(clampDragPosition(-5000, 120, w, headerH, bounds).x).toBe(DRAG_KEEP_PX - w);
  });

  it('doprava smí okno ven, ale DRAG_KEEP_PX lišty zůstane vidět', () => {
    expect(clampDragPosition(700, 120, w, headerH, bounds).x).toBe(700);
    expect(clampDragPosition(5000, 120, w, headerH, bounds).x)
      .toBe(bounds.width - DRAG_KEEP_PX);
  });

  it('dolů smí okno ven, ale celá lišta zůstane vidět (uchopitelná)', () => {
    expect(clampDragPosition(100, 590, w, headerH, bounds).y).toBe(bounds.height - headerH);
    expect(clampDragPosition(100, 400, w, headerH, bounds).y).toBe(400);
  });

  it('okno užší než DRAG_KEEP_PX se nikdy nedostane mimo plátno', () => {
    const tiny = DRAG_KEEP_PX / 2;
    expect(clampDragPosition(-50, 120, tiny, headerH, bounds).x).toBe(0);
    expect(clampDragPosition(5000, 120, tiny, headerH, bounds).x).toBe(bounds.width - tiny);
  });
});

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

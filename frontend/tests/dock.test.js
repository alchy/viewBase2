import { describe, expect, it } from 'vitest';
import {
  DOCK_GAP, clampRect, findFreeSlot, overlaps, resolveDockDrag,
} from '../src/wm/dock.js';

const B = { width: 800, height: 600 };
const r = (x, y, w = 100, h = 28) => ({ x, y, w, h });

describe('dok minimalizovaných oken – geometrie', () => {
  it('overlaps respektuje 4px mezeru ze všech stran', () => {
    expect(overlaps(r(0, 0), r(104, 0))).toBe(false);          // přesně mezera 4
    expect(overlaps(r(0, 0), r(103, 0))).toBe(true);           // o 1px blíž = kolize
    expect(overlaps(r(0, 0), r(0, 32))).toBe(false);           // pod sebou s mezerou
    expect(overlaps(r(0, 0), r(0, 31))).toBe(true);
    expect(DOCK_GAP).toBe(4);
  });

  it('první proužek sedí vlevo dole, další vedle něj v řadě', () => {
    expect(findFreeSlot([], 100, 28, B)).toEqual({ x: DOCK_GAP, y: 600 - 28 - DOCK_GAP });
    const a = r(DOCK_GAP, 568, 100);
    expect(findFreeSlot([a], 120, 28, B)).toEqual({ x: DOCK_GAP + 100 + DOCK_GAP, y: 568 });
  });

  it('plná spodní řada → další proužek se „stosuje" nad původními', () => {
    const row = [];
    let x = DOCK_GAP;
    while (x + 150 <= B.width) { row.push(r(x, 568, 150)); x += 150 + DOCK_GAP; }
    const slot = findFreeSlot(row, 150, 28, B);
    expect(slot).toEqual({ x: DOCK_GAP, y: 568 - 28 - DOCK_GAP });
  });

  it('proužky různé šířky (podle textu) se skládají bez překryvu', () => {
    const a = r(4, 568, 60);
    const b = findFreeSlot([a], 200, 28, B);
    const c = findFreeSlot([a, r(b.x, b.y, 200)], 90, 28, B);
    expect(overlaps(a, r(b.x, b.y, 200))).toBe(false);
    expect(overlaps(r(b.x, b.y, 200), r(c.x, c.y, 90))).toBe(false);
    expect(c.x).toBe(4 + 60 + 4 + 200 + 4);
  });

  it('clampRect drží proužek celý na plátně', () => {
    expect(clampRect(r(-50, -20, 100, 28), B)).toEqual({ x: 0, y: 0 });
    expect(clampRect(r(790, 590, 100, 28), B)).toEqual({ x: 700, y: 572 });
  });

  it('bounds.top (lišta screenu) je horní mez – proužek pod ni nezajede', () => {
    const T = { ...B, top: 26 };
    expect(clampRect(r(100, 0, 100, 28), T)).toEqual({ x: 100, y: 26 });
    expect(clampRect(r(100, -50, 100, 28), T)).toEqual({ x: 100, y: 26 });
    expect(clampRect(r(100, 40, 100, 28), T)).toEqual({ x: 100, y: 40 });
  });

  it('tažení nahoru se zastaví o lištu screenu, ne o okraj plátna', () => {
    const T = { ...B, top: 26 };
    expect(resolveDockDrag(r(4, 568, 100), { x: 4, y: -100 }, [], T)).toEqual({ x: 4, y: 26 });
  });

  it('řady se stosují jen nad lištu screenu (níž se nové místo nehledá)', () => {
    const T = { width: 300, height: 200, top: 26 };
    const taken = [];
    let slot = findFreeSlot(taken, 300 - 2 * DOCK_GAP, 28, T);
    const seen = [];
    for (let i = 0; i < 10; i += 1) {
      seen.push(slot.y);
      taken.push({ ...slot, w: 300 - 2 * DOCK_GAP, h: 28 });
      slot = findFreeSlot(taken, 300 - 2 * DOCK_GAP, 28, T);
    }
    expect(Math.min(...seen)).toBeGreaterThanOrEqual(26);      // nikdy pod lištu
  });

  it('tažení: volný cíl projde; kolize → náraz (zkusí jen x, jen y, jinak stojí)', () => {
    const others = [r(300, 568, 100)];
    const prev = r(4, 568, 100);
    expect(resolveDockDrag(prev, { x: 100, y: 568 }, others, B)).toEqual({ x: 100, y: 568 });
    // přímo do souseda: x se zastaví, y beze změny
    expect(resolveDockDrag(prev, { x: 250, y: 568 }, others, B)).toEqual({ x: 4, y: 568 });
    // nad souseda s mezerou (y 500..528 vs 568) je volno
    expect(resolveDockDrag(prev, { x: 250, y: 500 }, others, B)).toEqual({ x: 250, y: 500 });
    // šikmo do souseda: x se nedá (kolize), y ano (jen-y varianta)
    expect(resolveDockDrag(prev, { x: 250, y: 550 }, others, B)).toEqual({ x: 4, y: 550 });
    // těsně vedle souseda s mezerou 4 je v pořádku
    expect(resolveDockDrag(prev, { x: 196, y: 568 }, others, B)).toEqual({ x: 196, y: 568 });
    // mimo plátno → přichytí
    expect(resolveDockDrag(prev, { x: -80, y: 900 }, others, B)).toEqual({ x: 0, y: 572 });
  });
});

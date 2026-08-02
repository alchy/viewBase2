import { describe, expect, it } from 'vitest';
import {
  DEFAULT_OPTIONS, loadOptions, optionsKey, saveOptions, slugTitle,
} from '../src/wm/options_store.js';

class FakeStorage {
  constructor() { this.map = new Map(); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
}

describe('slugTitle', () => {
  it('lowercase + pomlčky místo nealfanumerických znaků', () => {
    expect(slugTitle('Síť infrastruktura')).toBe('s-infrastruktura');
    expect(slugTitle('Prototyp')).toBe('prototyp');
  });

  it('ořízne okrajové pomlčky', () => {
    expect(slugTitle('  --Hello--  ')).toBe('hello');
  });

  it('prázdný/chybějící titulek -> viewbase', () => {
    expect(slugTitle('')).toBe('viewbase');
    expect(slugTitle(undefined)).toBe('viewbase');
  });
});

describe('optionsKey', () => {
  it('prefixuje vb-options:', () => {
    expect(optionsKey('Síť')).toBe('vb-options:s');
  });
});

describe('loadOptions/saveOptions', () => {
  it('bez uloženého záznamu vrátí defaulty', () => {
    const storage = new FakeStorage();
    expect(loadOptions('Síť', storage)).toEqual(DEFAULT_OPTIONS);
  });

  it('uloží a znovu načte', () => {
    const storage = new FakeStorage();
    saveOptions('Síť', { physicsRunning: false, edgeStyle: 'spline',
      edgeElasticity: 0.6, dimensions: 2 }, storage);
    expect(loadOptions('Síť', storage)).toEqual(
      { physicsRunning: false, edgeStyle: 'spline', edgeElasticity: 0.6, dimensions: 2 });
  });

  it('starý záznam bez dimensions doplní default (2D/3D přidáno později)', () => {
    const storage = new FakeStorage();
    saveOptions('Síť', { physicsRunning: false, edgeStyle: 'line',
      edgeElasticity: 0.3 }, storage);
    expect(loadOptions('Síť', storage).dimensions).toBe(3);
  });

  it('vadný JSON v úložišti spadne zpátky na defaulty', () => {
    const storage = new FakeStorage();
    storage.setItem(optionsKey('X'), 'not json');
    expect(loadOptions('X', storage)).toEqual(DEFAULT_OPTIONS);
  });

  it('vlastní defaults (seed z aktuálního server stavu) se použijí místo DEFAULT_OPTIONS', () => {
    const storage = new FakeStorage();
    const liveDefaults = { physicsRunning: true, edgeStyle: 'spline', edgeElasticity: 0.8 };
    expect(loadOptions('Nový', storage, liveDefaults)).toEqual(liveDefaults);
  });

  it('bez storage (SSR/test bez localStorage) nespadne', () => {
    expect(loadOptions('X', null)).toEqual(DEFAULT_OPTIONS);
    expect(() => saveOptions('X', DEFAULT_OPTIONS, null)).not.toThrow();
  });

  it('dva různé titulky mají nezávislé klíče', () => {
    const storage = new FakeStorage();
    saveOptions('A', { physicsRunning: false, edgeStyle: 'line', edgeElasticity: 0 }, storage);
    expect(loadOptions('B', storage)).toEqual(DEFAULT_OPTIONS);
  });
});

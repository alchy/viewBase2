import { describe, expect, it } from 'vitest';
import { guruCode, hashHex } from '../src/core/guru_code.js';

describe('hashHex', () => {
  it('je deterministický pro stejný text', () => {
    expect(hashHex('boom')).toBe(hashHex('boom'));
  });

  it('různý text dá (skoro jistě) různý hash', () => {
    expect(hashHex('boom')).not.toBe(hashHex('bang'));
  });

  it('vrací 8 hex znaků, velkými písmeny', () => {
    expect(hashHex('x')).toMatch(/^[0-9A-F]{8}$/);
  });

  it('prázdný text nespadne', () => {
    expect(hashHex('')).toMatch(/^[0-9A-F]{8}$/);
  });
});

describe('guruCode', () => {
  it('má tvar AAAAAAAA.BBBBBBBB', () => {
    expect(guruCode('frontend_error', 'TypeError: x is not a function'))
      .toMatch(/^[0-9A-F]{8}\.[0-9A-F]{8}$/);
  });

  it('různé druhy pádu mají různé alert číslo (první polovinu)', () => {
    const a = guruCode('frontend_error', 'stejná zpráva');
    const b = guruCode('connection_lost', 'stejná zpráva');
    const c = guruCode('backend_error', 'stejná zpráva');
    expect(a.split('.')[0]).not.toBe(b.split('.')[0]);
    expect(b.split('.')[0]).not.toBe(c.split('.')[0]);
    // stejná zpráva => stejný hash napříč druhy
    expect(a.split('.')[1]).toBe(b.split('.')[1]);
    expect(b.split('.')[1]).toBe(c.split('.')[1]);
  });

  it('neznámý druh spadne na frontend_error alert', () => {
    expect(guruCode('neco-neznameho', 'x').split('.')[0])
      .toBe(guruCode('frontend_error', 'x').split('.')[0]);
  });
});

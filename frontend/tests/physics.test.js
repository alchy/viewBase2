import { describe, expect, it } from 'vitest';
import { PhysicsCore } from '../src/physics/core.js';

describe('PhysicsCore', () => {
  it('init rozmístí uzly a tick vrací Float32Array pozic', () => {
    const core = new PhysicsCore({ dimensions: 3 });
    core.applyInit({
      nodes: [{ id: 'a' }, { id: 'b' }],
      links: [{ source: 'a', target: 'b' }],
    });
    const buf = core.tick();
    expect(core.ids()).toEqual(['a', 'b']);
    expect(buf).toBeInstanceOf(Float32Array);
    expect(buf).toHaveLength(6);
  });

  it('patch přidá uzel u souseda a odebere uzel i s hranami', () => {
    const core = new PhysicsCore({ dimensions: 3 });
    core.applyInit({ nodes: [{ id: 'a' }, { id: 'b' }], links: [] });
    const a = core.nodes.find((n) => n.id === 'a');
    core.applyPatch({
      addNodes: [{ id: 'c' }],
      addLinks: [{ source: 'c', target: 'a' }],
    });
    const c = core.nodes.find((n) => n.id === 'c');
    const dist = Math.hypot(c.x - a.x, c.y - a.y, c.z - a.z);
    expect(dist).toBeLessThan(30);          // zrodil se poblíž souseda

    core.applyPatch({ removeNodes: ['a'] });
    expect(core.ids()).toEqual(['b', 'c']);
    expect(core.links).toHaveLength(0);     // kaskáda hran
  });

  it('simulace po vychladnutí přestane tikat a patch ji ohřeje', () => {
    const core = new PhysicsCore({ dimensions: 3 });
    core.applyInit({ nodes: [{ id: 'a' }], links: [] });
    let last = null;
    for (let i = 0; i < 2000 && (last = core.tick()) !== null; i += 1);
    expect(last).toBeNull();                // vychladla
    core.applyPatch({ addNodes: [{ id: 'b' }] });
    expect(core.tick()).not.toBeNull();     // ohřátá
  });

  it('ve 2D drží z = 0', () => {
    const core = new PhysicsCore({ dimensions: 2 });
    core.applyInit({
      nodes: [{ id: 'a' }, { id: 'b' }],
      links: [{ source: 'a', target: 'b' }],
    });
    const buf = core.tick();
    expect(buf[2]).toBe(0);
    expect(buf[5]).toBe(0);
  });

  it('duplicitní addLink se ignoruje (reconnect s pending deltami)', () => {
    const core = new PhysicsCore({ dimensions: 3 });
    core.applyInit({
      nodes: [{ id: 'a' }, { id: 'b' }],
      links: [{ source: 'a', target: 'b' }],
    });
    core.applyPatch({ addLinks: [{ source: 'a', target: 'b' }] });
    expect(core.links).toHaveLength(1);
    core.applyPatch({ addLinks: [{ source: 'b', target: 'a' }] });  // opačné pořadí
    expect(core.links).toHaveLength(1);
  });

  it('setDimensions 2D->3D zachová uzly/hrany a rozjede z', () => {
    const core = new PhysicsCore({ dimensions: 2 });
    core.applyInit({
      nodes: [{ id: 'a' }, { id: 'b' }],
      links: [{ source: 'a', target: 'b' }],
    });
    core.tick();
    expect(core.ids()).toEqual(['a', 'b']);
    core.setDimensions(3);
    expect(core.dimensions).toBe(3);
    expect(core.ids()).toEqual(['a', 'b']);      // uzly přežily přestavbu simulace
    expect(core.links).toHaveLength(1);          // hrany taky
    const buf = core.tick();
    expect(buf).not.toBeNull();                  // ohřátá, není vychladlá
  });

  it('setDimensions 3D->2D nutí výstupní z = 0', () => {
    const core = new PhysicsCore({ dimensions: 3 });
    core.applyInit({ nodes: [{ id: 'a' }], links: [] });
    core.setDimensions(2);
    const buf = core.tick();
    expect(buf[2]).toBe(0);
  });

  it('setDimensions na stejnou hodnotu je no-op (nepřestaví sim zbytečně)', () => {
    const core = new PhysicsCore({ dimensions: 3 });
    core.applyInit({ nodes: [{ id: 'a' }], links: [] });
    const simBefore = core.sim;
    core.setDimensions(3);
    expect(core.sim).toBe(simBefore);
  });

  it('linkKey nekoliduje pro id s mezerami', () => {
    const core = new PhysicsCore({ dimensions: 3 });
    core.applyInit({
      nodes: [{ id: 'a b' }, { id: 'c' }],
      links: [{ source: 'a b', target: 'c' }],
    });
    core.applyPatch({ removeLinks: [['a', 'b c']] });   // jiná (neexistující) hrana
    expect(core.links).toHaveLength(1);                  // původní hrana přežila
  });
});

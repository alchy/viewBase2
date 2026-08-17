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

  it('shluky si najde sám z topologie, průběžně během tikání', () => {
    // dvě husté kliky spojené jediným mostem – zřetelná struktura
    const nodes = []; const links = [];
    for (let k = 0; k < 2; k += 1) {
      for (let i = 0; i < 20; i += 1) nodes.push({ id: `${k}_${i}` });
      for (let i = 0; i < 20; i += 1) {
        for (let j = i + 1; j < 20; j += 1) {
          links.push({ source: `${k}_${i}`, target: `${k}_${j}` });
        }
      }
    }
    links.push({ source: '0_0', target: '1_0' });
    const core = new PhysicsCore({ dimensions: 3 });
    core.applyInit({ nodes, links });
    expect(core.groups.size).toBe(0);        // hned po initu ještě nic
    for (let i = 0; i < 200 && core.groups.size === 0; i += 1) core.tick();
    expect(core.groups.size).toBe(2);        // dopočítáno během tikání
    const g = (id) => core.nodes.find((n) => n.id === id).group;
    expect(g('0_5')).toBe(g('0_9'));         // klika drží pohromadě
    expect(g('0_5')).not.toBe(g('1_5'));     // a je oddělená od druhé
  });

  it('bez skupin je síla skupin no-op (pozice zůstanou konečné)', () => {
    const core = new PhysicsCore({ dimensions: 3 });
    core.applyInit({
      nodes: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
      links: [{ source: 'a', target: 'b' }],
    });
    for (let i = 0; i < 50; i += 1) core.tick();
    expect(core.groups.size).toBe(0);
    expect(core.nodes.every((n) => Number.isFinite(n.x) && Number.isFinite(n.y)
      && Number.isFinite(n.z))).toBe(true);
  });

  it('skupiny se od sebe odtáhnou: členové blíž k sobě než k cizí skupině', () => {
    const core = new PhysicsCore({ dimensions: 3 });
    const nodes = [];
    const links = [];
    for (let i = 0; i < 6; i += 1) {
      nodes.push({ id: `x${i}`, group: 'X' }, { id: `y${i}`, group: 'Y' });
    }
    // uvnitř skupin řetízek, mezi skupinami jediný most
    for (let i = 1; i < 6; i += 1) {
      links.push({ source: `x${i - 1}`, target: `x${i}` },
        { source: `y${i - 1}`, target: `y${i}` });
    }
    links.push({ source: 'x0', target: 'y0' });
    core.applyInit({ nodes, links });
    expect(core.groups.size).toBe(2);
    for (let i = 0; i < 400; i += 1) core.tick();
    const stred = (p) => {
      const cl = core.nodes.filter((n) => n.id.startsWith(p));
      return cl.reduce((a, n) => [a[0] + n.x / cl.length, a[1] + n.y / cl.length,
        a[2] + n.z / cl.length], [0, 0, 0]);
    };
    const [ax, ay, az] = stred('x');
    const [bx, by, bz] = stred('y');
    const mezi = Math.hypot(ax - bx, ay - by, az - bz);
    const uvnitr = core.nodes.filter((n) => n.group === 'X')
      .reduce((s, n) => s + Math.hypot(n.x - ax, n.y - ay, n.z - az), 0) / 6;
    expect(mezi).toBeGreaterThan(uvnitr);
  });

  it('setClusters(false) vypne sílu skupin (rychlosti nechá být), zapnutí ji vrátí', () => {
    const core = new PhysicsCore({ dimensions: 3 });
    core.applyInit({
      nodes: [{ id: 'a', group: 'X' }, { id: 'b', group: 'X' },
        { id: 'c', group: 'Y' }, { id: 'd', group: 'Y' }],
      links: [{ source: 'a', target: 'c' }],
    });
    core.tick();                              // skupiny zaindexované, pozice živé
    expect(core.groups.size).toBe(2);
    const groupForce = core.sim.force('groups');
    const reset = () => core.nodes.forEach((n) => { n.vx = 0; n.vy = 0; n.vz = 0; });
    const hnuto = () => core.nodes.some((n) => n.vx !== 0 || n.vy !== 0 || n.vz !== 0);

    reset(); groupForce(1);
    expect(hnuto()).toBe(true);               // zapnuto: síla táhne

    core.setClusters(false);
    reset(); groupForce(1);
    expect(hnuto()).toBe(false);              // vypnuto: no-op
    expect(core.groups.size).toBe(2);         // dělení se dál zná, jen netahá

    core.setClusters(true);
    reset(); groupForce(1);
    expect(hnuto()).toBe(true);               // zpět zapnuto
  });

  it('setClusters ohřeje vychladlou simulaci, ať se graf přeskládá', () => {
    const core = new PhysicsCore({ dimensions: 3 });
    core.applyInit({
      nodes: [{ id: 'a', group: 'X' }, { id: 'b', group: 'Y' }],
      links: [{ source: 'a', target: 'b' }],
    });
    let last = null;
    for (let i = 0; i < 2000 && (last = core.tick()) !== null; i += 1);
    expect(last).toBeNull();
    core.setClusters(false);
    expect(core.tick()).not.toBeNull();
    for (let i = 0; i < 2000 && core.tick() !== null; i += 1);
    core.setClusters(true);
    expect(core.tick()).not.toBeNull();
    core.setClusters(true);                  // stejná hodnota = no-op
    for (let i = 0; i < 2000 && (last = core.tick()) !== null; i += 1);
    expect(last).toBeNull();
  });

  it('síla skupin drží ve 2D z = 0', () => {
    const core = new PhysicsCore({ dimensions: 2 });
    core.applyInit({
      nodes: [{ id: 'a', group: 'X' }, { id: 'b', group: 'X' },
        { id: 'c', group: 'Y' }, { id: 'd', group: 'Y' }],
      links: [{ source: 'a', target: 'c' }],
    });
    let buf = null;
    for (let i = 0; i < 100; i += 1) buf = core.tick() || buf;
    expect(buf[2]).toBe(0);
    expect(buf[11]).toBe(0);
    expect(core.nodes.every((n) => Number.isFinite(n.x))).toBe(true);
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

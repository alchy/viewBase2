import { describe, expect, it, vi } from 'vitest';
import { GraphStore } from '../src/core/store.js';

const initMsg = (over = {}) => ({
  type: 'init', protocol: 1, seq: 0,
  config: { dimensions: 3 }, node_types: {},
  nodes: [{ id: 'a', label: 'a', meta: {} }, { id: 'b', label: 'b', meta: {} }],
  edges: [{ source: 'a', target: 'b', meta: {} }],
  ...over,
});

const patchMsg = (seq, over = {}) => ({
  type: 'patch', seq,
  add_nodes: [], update_nodes: [], remove_nodes: [],
  add_edges: [], remove_edges: [],
  ...over,
});

describe('GraphStore', () => {
  it('applyInit naplní stav a nastaví seq', () => {
    const store = new GraphStore();
    store.applyInit(initMsg());
    expect(store.nodes.size).toBe(2);
    expect(store.edges.size).toBe(1);
    expect(store.seq).toBe(0);
    expect(store.config.dimensions).toBe(3);
    expect(store.menu).toBeNull();
  });

  it('applyInit uloží menu spec (§8 designu), pokud je připnuté', () => {
    const store = new GraphStore();
    const menu = { groups: [{ name: 'Graf', items: [{ id: 'item-0', label: 'A' }] }] };
    store.applyInit(initMsg({ menu }));
    expect(store.menu).toEqual(menu);
  });

  it('patch přidá uzel s hranou a odebere uzel kaskádově', () => {
    const store = new GraphStore();
    store.applyInit(initMsg());
    const ok = store.applyPatch(patchMsg(1, {
      add_nodes: [{ id: 'c', label: 'c', meta: {} }],
      add_edges: [{ source: 'b', target: 'c', meta: {} }],
      remove_nodes: ['a'],
    }));
    expect(ok).toBe(true);
    expect(store.nodes.has('a')).toBe(false);
    expect(store.edges.has(GraphStore.edgeKey('a', 'b'))).toBe(false); // kaskáda
    expect(store.edges.has(GraphStore.edgeKey('b', 'c'))).toBe(true);
    expect(store.seq).toBe(1);
  });

  it('mezera v seq vrátí false a nic nezmění', () => {
    const store = new GraphStore();
    store.applyInit(initMsg());
    const ok = store.applyPatch(patchMsg(5, { remove_nodes: ['a'] }));
    expect(ok).toBe(false);
    expect(store.nodes.has('a')).toBe(true);
    expect(store.seq).toBe(0);
  });

  it('add existujícího uzlu je upsert, remove neznámého je no-op', () => {
    const store = new GraphStore();
    store.applyInit(initMsg());
    const ok = store.applyPatch(patchMsg(1, {
      add_nodes: [{ id: 'a', label: 'Nové A', meta: { x: 1 } }],
      remove_nodes: ['ghost'],
    }));
    expect(ok).toBe(true);
    expect(store.nodes.get('a').label).toBe('Nové A');
  });

  it('notifikuje odběratele o init i patchi', () => {
    const store = new GraphStore();
    const events = [];
    store.subscribe((e) => events.push(e.kind));
    store.applyInit(initMsg());
    store.applyPatch(patchMsg(1));
    expect(events).toEqual(['init', 'patch']);
  });

  it('applyNodeType přidá i přepíše typ (živá změna barvy celého typu)', () => {
    const store = new GraphStore();
    store.applyInit(initMsg({ node_types: { server: { color: '#28d7fe' } } }));
    store.applyNodeType('server', { color: '#ff2a6d', shape: 'box' });
    store.applyNodeType('db', undefined);
    expect(store.nodeTypes.server).toEqual({ color: '#ff2a6d', shape: 'box' });
    expect(store.nodeTypes.db).toEqual({});     // typ bez stylu = styl tématu
  });

  it('patch s jiným typem uzlu přepíše celý záznam uzlu', () => {
    const store = new GraphStore();
    store.applyInit(initMsg());
    store.applyPatch(patchMsg(1, {
      update_nodes: [{ id: 'a', type: 'db', label: 'a', meta: { color: '#f00' } }],
    }));
    expect(store.nodes.get('a').type).toBe('db');
    expect(store.nodes.get('a').meta.color).toBe('#f00');
  });

  it('add_edge s chybějícím koncem se přeskočí s console.warn', () => {
    const store = new GraphStore();
    store.applyInit(initMsg());
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    store.applyPatch(patchMsg(1, {
      add_edges: [{ source: 'a', target: 'ghost', meta: {} }],
    }));
    expect(store.edges.size).toBe(1);    // jen původní a–b
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });
});

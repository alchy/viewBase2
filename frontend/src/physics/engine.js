/** Skupina uzlu pro fyziku – meta `skupina` (např. komunita spočtená
 *  aplikací). Chybí → undefined a síla skupin uzel ignoruje. Klíč se bere
 *  jako řetězec, ať se čísla i názvy chovají stejně. */
function groupOf(n) {
  const g = n.meta && n.meta.skupina;
  return g === undefined || g === null ? undefined : String(g);
}

/** Most mezi GraphStore a fyzikálním workerem. Drží poslední ids + pozice
 *  pro renderer (ids a buffer se mohou krátce lišit délkou – renderer bere
 *  min(ids.length, positions.length / 3)). */
export class PhysicsEngine {
  constructor(store) {
    this.ids = [];
    this.positions = new Float32Array(0);
    this.worker = new Worker(new URL('./worker.js', import.meta.url),
      { type: 'module' });
    this.worker.onmessage = ({ data }) => {
      if (data.type === 'index') this.ids = data.ids;
      else if (data.type === 'tick') this.positions = data.positions;
    };
    this._unsubscribe = store.subscribe((event) => this._onStoreEvent(store, event));
  }

  /** Options „Fyzika běží" (§8a designu) – pauza/obnova tikání ve workeru,
   *  poslední pozice v `this.positions` zůstávají (render dál kreslí, jen
   *  zamrzlý stav). */
  setPaused(paused) {
    this.worker.postMessage({ type: paused ? 'pause' : 'resume' });
  }

  /** Options „2D/3D" (§8a designu): worker přestaví celou simulaci (viz
   *  `PhysicsCore.setDimensions` – d3-force-3d peče dimenzionalitu do sim
   *  při konstrukci), pozice uzlů/hran se zachovají. */
  setDimensions(dimensions) {
    this.worker.postMessage({ type: 'set_dimensions', dimensions });
  }

  /** Options „Shluky (oblasti)": zapni/vypni sílu skupin ve workeru (viz
   *  `PhysicsCore.setClusters`); pozice se zachovají, simulace se jen ohřeje. */
  setClusters(clusters) {
    this.worker.postMessage({ type: 'set_clusters', clusters: Boolean(clusters) });
  }

  /** Ukonči worker a odhlas se ze store (screen destroy – viz manager.js).
   *  Po zavolání je instance nepoužitelná. */
  terminate() {
    this._unsubscribe();
    this.worker.terminate();
  }

  _onStoreEvent(store, event) {
    if (event.kind === 'init') {
      this.worker.postMessage({
        type: 'init',
        dimensions: store.config.dimensions,
        nodes: [...store.nodes.values()].map((n) => ({
          id: n.id, mass: Number(n.meta && n.meta.mass), group: groupOf(n) })),
        links: [...store.edges.values()]
          .map((e) => ({ source: e.source, target: e.target,
            weight: Number(e.meta && e.meta.weight) })),
      });
    } else if (event.kind === 'patch') {
      const p = event.patch;
      this.worker.postMessage({
        type: 'patch',
        addNodes: p.add_nodes.map((n) => ({
          id: n.id, mass: Number(n.meta && n.meta.mass), group: groupOf(n) })),
        removeNodes: p.remove_nodes,
        addLinks: p.add_edges.map(
          (e) => ({ source: e.source, target: e.target,
            weight: Number(e.meta && e.meta.weight) })),
        removeLinks: p.remove_edges,
      });
    }
  }
}

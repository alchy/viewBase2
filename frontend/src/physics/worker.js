import { PhysicsCore } from './core.js';

const TICK_MS = 16;
let core = null;
let paused = false;   // Options „Fyzika běží" (§8a designu) – tiknutí se přeskočí

setInterval(() => {
  if (!core || paused) return;
  const positions = core.tick();
  if (positions) self.postMessage({ type: 'tick', positions }, [positions.buffer]);
}, TICK_MS);

self.onmessage = ({ data }) => {
  if (data.type === 'init') {
    core = new PhysicsCore({ dimensions: data.dimensions });
    core.applyInit(data);
  } else if (data.type === 'patch' && core) {
    core.applyPatch(data);
  } else if (data.type === 'set_dimensions' && core) {
    core.setDimensions(data.dimensions);
  } else if (data.type === 'set_clusters' && core) {
    core.setClusters(data.clusters);
  } else if (data.type === 'pause') {
    paused = true;
    return;
  } else if (data.type === 'resume') {
    paused = false;
    return;
  } else {
    return;
  }
  self.postMessage({ type: 'index', ids: core.ids() });
  const positions = core.positions();
  self.postMessage({ type: 'tick', positions }, [positions.buffer]);
};

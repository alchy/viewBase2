/** Rozpoznání shluků přímo z topologie grafu (Louvain) – PRŮBĚŽNÁ ÚLOHA.
 *
 *  Běží ve fyzikálním workeru nad uzly a hranami, které tam už jsou, takže se
 *  graf segmentuje sám, bez jediného údaje navíc od aplikace.
 *
 *  Proč úloha po dávkách a ne jedno volání: graf se v čase mění a přepočet
 *  celého dělení je O(hran). Naráz by to zaseklo tikání (u velkého grafu na
 *  desetiny sekundy), a při každé deltě by se to opakovalo. Úloha proto
 *  ukusuje práci po kouscích v rozpočtu na tik – mezitím dál platí PŘEDCHOZÍ
 *  dělení, takže se obraz nikdy nerozpadne, jen se s odstupem doladí.
 *
 *  Všechny prahy jsou ODVOZENÉ OD VELIKOSTI GRAFU, ne zadané absolutně –
 *  jinak by nastavení vyladěné na deseti tisících uzlů dávalo nesmysly na
 *  stovce nebo na milionu.
 */

/** Podíl grafu, přes který už skupina není segment, ale moloch. */
const MAX_SHARE = 0.12;
/** Rozlišení od hrubého k jemnému; vyhraje první bez molocha. */
const RESOLUTIONS = [1, 2, 3];
/** Kol Louvainu na jedno rozlišení. */
const MOVE_ROUNDS = 12;
/** Kol rozšiřování skupin na periferii. */
const SPREAD_ROUNDS = 2;
/** Po kolika uzlech se kontroluje rozpočet (kontrola času něco stojí). */
const CHUNK = 1024;

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Sousedství v CSR (offsety + plochý seznam) – rychlejší než pole polí. */
function buildAdjacency(count, edges) {
  const deg = new Int32Array(count);
  for (let e = 0; e < edges.length; e += 2) {
    deg[edges[e]] += 1;
    deg[edges[e + 1]] += 1;
  }
  const offset = new Int32Array(count + 1);
  for (let i = 0; i < count; i += 1) offset[i + 1] = offset[i] + deg[i];
  const cursor = offset.slice(0, count);
  const neighbor = new Int32Array(offset[count]);
  for (let e = 0; e < edges.length; e += 2) {
    const a = edges[e]; const b = edges[e + 1];
    neighbor[cursor[a]] = b; cursor[a] += 1;
    neighbor[cursor[b]] = a; cursor[b] += 1;
  }
  return { offset, neighbor, deg };
}

/** Úloha hledající shluky. `step(ms)` ukousne kus práce a vrátí true, až je
 *  hotovo; výsledek je pak v `.group` (Int32Array, -1 = bez skupiny). */
export function createGroupingJob(count, edges) {
  if (count < 8 || edges.length < 4) return null;
  const adj = buildAdjacency(count, edges);
  const { offset, neighbor, deg } = adj;
  const m2 = offset[count] || 1;
  const coreMin = Math.max(4, Math.round(Math.sqrt(count) / 4));
  const cap = MAX_SHARE * count;

  const order = new Int32Array(count);
  for (let i = 0; i < count; i += 1) order[i] = i;
  const random = rng(0x9e3779b9);
  for (let i = count - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const t = order[i]; order[i] = order[j]; order[j] = t;
  }

  const comm = new Int32Array(count);
  const ctot = new Float64Array(count);
  const weight = new Float64Array(count);
  const touched = new Int32Array(count);
  let group = null;
  let votes = null;
  let cores = null;
  let bestComm = null;      // nejlepší dosud viděné dělení (viz evaluate)
  let bestCores = null;
  let bestScore = -1;

  let phase = 'move';
  let gammaIdx = 0;
  let round = 0;
  let cursor = 0;
  let moved = 0;
  let spread = 0;

  function resetLouvain() {
    for (let i = 0; i < count; i += 1) { comm[i] = i; ctot[i] = deg[i]; }
    round = 0; cursor = 0; moved = 0;
  }
  resetLouvain();

  /** Kus jednoho kola Louvainu: přesun uzlů order[cursor .. cursor+n). */
  function moveChunk(gamma, n) {
    const end = Math.min(cursor + n, count);
    for (; cursor < end; cursor += 1) {
      const node = order[cursor];
      const own = comm[node];
      const kn = deg[node];
      let used = 0;
      for (let p = offset[node]; p < offset[node + 1]; p += 1) {
        const c = comm[neighbor[p]];
        if (weight[c] === 0) { touched[used] = c; used += 1; }
        weight[c] += 1;
      }
      ctot[own] -= kn;
      let best = own;
      let bestGain = weight[own] - (gamma * ctot[own] * kn) / m2;
      for (let t = 0; t < used; t += 1) {
        const c = touched[t];
        const gain = weight[c] - (gamma * ctot[c] * kn) / m2;
        if (gain > bestGain) { bestGain = gain; best = c; }
      }
      ctot[best] += kn;
      if (best !== own) { comm[node] = best; moved += 1; }
      for (let t = 0; t < used; t += 1) weight[touched[t]] = 0;
    }
  }

  /** Vyhodnoť dělení: vyhovuje, nebo zkusit jemnější rozlišení?
   *
   *  Jemnější rozlišení umí strukturu i ZABÍT – nad určitou hodnotou se i
   *  klika rozpadne na samostatné uzly, protože připojit se k ní přestane
   *  být výhodné. Proto se pamatuje nejlepší dosud viděné dělení a když
   *  eskalace nikam nevede, couvne se k němu. Pořadí kritérií: vejít se do
   *  stropu (žádný moloch), a při shodě pokrýt skupinami co nejvíc uzlů. */
  function evaluate() {
    const sizes = new Map();
    for (let i = 0; i < count; i += 1) sizes.set(comm[i], (sizes.get(comm[i]) || 0) + 1);
    const found = [...sizes.entries()].filter(([, v]) => v >= coreMin)
      .sort((a, b) => b[1] - a[1]);
    const pokryti = found.reduce((s, [, v]) => s + v, 0);
    const vejdeSe = found.length > 0 && found[0][1] <= cap;
    const skore = (vejdeSe ? count * 10 : 0) + pokryti;
    if (skore > bestScore) {
      bestScore = skore;
      bestComm = comm.slice();
      bestCores = found;
    }
    if (!vejdeSe && gammaIdx < RESOLUTIONS.length - 1) {
      gammaIdx += 1;
      resetLouvain();
      phase = 'move';
      return;
    }
    cores = bestCores;
    if (!cores || !cores.length) { phase = 'done'; group = null; return; }
    const label = new Map(cores.map(([c], i) => [c, i]));
    group = new Int32Array(count).fill(-1);
    for (let i = 0; i < count; i += 1) {
      const g = label.get(bestComm[i]);
      if (g !== undefined) group[i] = g;
    }
    votes = new Int32Array(cores.length);
    spread = 0; cursor = 0;
    phase = 'spread';
  }

  /** Periferie: uzel mimo jádra převezme skupinu, odkud k němu vede nejvíc
   *  hran. Hlasuje se SOUČASNĚ (výsledky se zapíšou až po kole) – kdyby se
   *  skupina šířila vlnou, přes huby by se jedna rozlila po celém grafu. */
  const pending = [];
  function spreadChunk(n) {
    const end = Math.min(cursor + n, count);
    for (; cursor < end; cursor += 1) {
      if (group[cursor] >= 0) continue;
      votes.fill(0);
      let any = false;
      for (let p = offset[cursor]; p < offset[cursor + 1]; p += 1) {
        const g = group[neighbor[p]];
        if (g >= 0) { votes[g] += 1; any = true; }
      }
      if (!any) continue;
      let best = 0;
      for (let g = 1; g < votes.length; g += 1) if (votes[g] > votes[best]) best = g;
      pending.push(cursor, best);
    }
  }

  return {
    get group() { return group; },
    /** Ukousni práci nejvýš na `budgetMs`; true = hotovo. */
    step(budgetMs) {
      const until = Date.now() + budgetMs;
      while (phase !== 'done') {
        if (Date.now() >= until) return false;
        if (phase === 'move') {
          moveChunk(RESOLUTIONS[gammaIdx], CHUNK);
          if (cursor >= count) {
            round += 1;
            if (moved === 0 || round >= MOVE_ROUNDS) phase = 'evaluate';
            else { cursor = 0; moved = 0; }
          }
        } else if (phase === 'evaluate') {
          evaluate();
        } else if (phase === 'spread') {
          spreadChunk(CHUNK);
          if (cursor >= count) {
            for (let k = 0; k < pending.length; k += 2) group[pending[k]] = pending[k + 1];
            pending.length = 0;
            spread += 1;
            cursor = 0;
            if (spread >= SPREAD_ROUNDS) phase = 'done';
          }
        }
      }
      return true;
    },
  };
}

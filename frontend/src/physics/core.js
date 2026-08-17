import {
  forceCenter, forceLink, forceManyBody, forceSimulation, forceX, forceY, forceZ,
} from 'd3-force-3d';
import { createGroupingJob } from './communities.js';

const SPAWN_JITTER = 10;
// ---- ladicí konstanty fyziky (uspořádání grafu) --------------------------
const GRAVITY_BASE = 0.05;     // gravitace VŠECH uzlů ke středu (drží graf pohromadě)
const GRAVITY_MASS = 0.3;      // navýšení gravitace ∝ mass (četná slova víc do středu)
const CHARGE_BASE = -150;      // základ odpuzování (rozestup uzlů)
const CHARGE_MASS = 2;         // navýšení odpuzování ∝ mass (velké uzly víc vzduchu)
const LINK_DIST_MIN = 40;      // délka SILNÉ hrany (uzly těsně u sebe)
const LINK_DIST_MAX = 120;     // délka SLABÉ hrany (daleko od sebe)
// Skupiny (uzel s meta `skupina`): gravitační centrum, které k sobě táhne své
// členy a odtahuje se od center ostatních skupin. Vypnuté, dokud skupiny
// nikdo nepošle. Hodnoty naměřené na exportu conBond3 – silnější koheze už
// separaci kupuje za věrnost topologii (sousedi přestávají být u sebe).
const GROUP_COHESION = 0.1;    // tah člena ke svému těžišti
const GROUP_SPACING = 1.5;     // odstup center v NÁSOBCÍCH vlastních poloměrů
const GROUP_DRIFT = 0.1;       // přepočítej, až se graf změní o desetinu hran
// Rozpočet na hledání shluků se NEZADÁVÁ napevno – odvozuje se z toho, kolik
// ze snímku zbylo po fyzice. Malý graf dopočítá skoro hned, velký si ukrajuje
// po troškách přes víc snímků, ale v obou případech zůstane ovládání plynulé.
const FRAME_MS = 16;           // cílový snímek (worker tiká po 16 ms)
const GROUP_BUDGET_SHARE = 0.5;   // jak velký díl volného času si smí vzít
const GROUP_BUDGET_MIN = 0.5;  // i zahlcený graf musí jednou dopočítat
const GROUP_BUDGET_MAX = 8;

/** Gravitační hmota uzlu = četnost dle vzorce (tf·idf emise); chybí → 0. */
function nodeMass(d) {
  const m = Number(d.mass);
  return Number.isFinite(m) ? Math.max(0, m) : 0;
}

/** Podíl váhy hrany v 0..1 (těžší hrana = pevnější tah); chybí → 1. */
function linkWeight01(l) {
  const w = Number(l.weight);
  return Number.isFinite(w) ? Math.max(0.03, Math.min(1, w / 3)) : 1;
}

/** Délka hrany ∝ opak váhy: silná hrana krátká (uzly blíž) → shluky dle vah. */
function linkDistance(l) {
  return LINK_DIST_MAX - (LINK_DIST_MAX - LINK_DIST_MIN) * linkWeight01(l);
}

/** Gravitace ke středu: báze pro VŠECHNY uzly + navýšení ∝ mass (četnost). */
function gravityStrength(d) {
  return GRAVITY_BASE + GRAVITY_MASS * nodeMass(d);
}

function endId(end) {
  return typeof end === 'object' && end !== null ? end.id : end;
}

function linkKey(s, t) {
  return s <= t ? `${s}\u0000${t}` : `${t}\u0000${s}`;
}

/** Fyzikální jádro – čistá logika bez Workeru (testovatelné ve vitestu). */
export class PhysicsCore {
  constructor({ dimensions = 3 } = {}) {
    this.dimensions = dimensions;
    this.nodes = [];
    this.links = [];
    this.byId = new Map();
    this.degree = new Map();
    this.groups = new Map();
    this.clusters = true;   // Options „Shluky (oblasti)" – síla skupin zap/vyp
    this.sim = forceSimulation([], dimensions)
      .force('link', forceLink([]).id((d) => d.id)
        .distance(linkDistance).strength((l) => this.linkStrength(l)))
      // ODPUZOVÁNÍ ∝ mass: větší (četnější) uzly odpuzují víc → mají kolem sebe
      // vzduch a jsou líp vidět (předpoklad uživatele)
      .force('charge', forceManyBody()
        .strength((d) => CHARGE_BASE * (1 + CHARGE_MASS * nodeMass(d))).theta(0.9))
      .force('center', forceCenter())
      // GRAVITACE ∝ mass: četnost (tf·idf) táhne uzel ke středu — těžká slova
      // se sesednou do centra, okrajová vyplavou ven → graf se uspořádá vahami
      .force('gx', forceX(0).strength(gravityStrength))
      .force('gy', forceY(0).strength(gravityStrength))
      .force('groups', this._groupForce());
    if (dimensions === 3) {
      this.sim.force('gz', forceZ(0).strength(gravityStrength));
    }
    this.sim.stop();
  }

  /** Živá 2D/3D změna (Options §8a): d3-force-3d peče dimenzionalitu do
   *  simulace při konstrukci (`forceSimulation(nodes, dimensions)`), proto
   *  se přestavuje celý `sim` – ne jen přidání/odebrání `gz` síly, to by
   *  charge/link síly dál počítaly ve staré dimenzi. Uzly/hrany (a jejich
   *  x/y/z) se zachovají – `forceSimulation(this.nodes, …)` je převezme,
   *  jen nové/chybějící z (2D→3D) dostane náhodný rozptyl (jinak by na
   *  z=0 zůstaly navždy – symetrická odpudivá síla je v ose Z nulová). */
  setDimensions(dimensions) {
    if (this.dimensions === dimensions) return;
    this.dimensions = dimensions;
    if (dimensions === 3) {
      for (const n of this.nodes) {
        if (!Number.isFinite(n.z) || n.z === 0) {
          n.z = (Math.random() - 0.5) * 2 * SPAWN_JITTER;
        }
      }
    }
    this.sim = forceSimulation(this.nodes, dimensions)
      .force('link', forceLink(this.links).id((d) => d.id)
        .distance(linkDistance).strength((l) => this.linkStrength(l)))
      .force('charge', forceManyBody()
        .strength((d) => CHARGE_BASE * (1 + CHARGE_MASS * nodeMass(d))).theta(0.9))
      .force('center', forceCenter())
      .force('gx', forceX(0).strength(gravityStrength))
      .force('gy', forceY(0).strength(gravityStrength))
      .force('groups', this._groupForce());
    if (dimensions === 3) {
      this.sim.force('gz', forceZ(0).strength(gravityStrength));
    }
    // stejně jako v konstruktoru: bez stop() by nová forceSimulation spustila
    // svůj vlastní d3-timer navíc k ručnímu tick() z workeru (dvojité tikání).
    this.sim.stop();
    this.sim.alpha(1);
  }

  /** Options „Shluky (oblasti)": zapnuto = komunity mají gravitační centra
   *  (koheze + odpuzování center, viz _groupForce) a graf se rozpadá na
   *  oblasti; vypnuto = síla skupin je no-op a graf drží jen pružinami a
   *  odpuzováním (normalizace pružin stupněm zůstává – bez ní by se huby
   *  slily do středu). Dělení na skupiny se počítá dál, jen netahá – po
   *  zapnutí se tak uplatní hned. Změna simulaci ohřeje, ať se graf
   *  přeskládá; stejná hodnota je no-op. */
  setClusters(on) {
    const want = Boolean(on);
    if (this.clusters === want) return;
    this.clusters = want;
    this.sim.alpha(Math.max(this.sim.alpha(), 0.3));
  }

  applyInit({ nodes, links }) {
    this.nodes = nodes.map(
      (n) => ({ id: n.id, mass: n.mass, groupMeta: n.group }));
    this.byId = new Map(this.nodes.map((n) => [n.id, n]));
    this.links = links.map(
      (l) => ({ source: l.source, target: l.target, weight: l.weight }));
    this._rebuild();
    this.sim.alpha(1);
  }

  applyPatch({ addNodes = [], removeNodes = [], addLinks = [], removeLinks = [] }) {
    const removed = new Set(removeNodes);
    if (removed.size) {
      this.nodes = this.nodes.filter((n) => !removed.has(n.id));
      this.links = this.links.filter(
        (l) => !removed.has(endId(l.source)) && !removed.has(endId(l.target)));
      for (const id of removed) this.byId.delete(id);
    }
    const removedLinks = new Set(removeLinks.map(([s, t]) => linkKey(s, t)));
    if (removedLinks.size) {
      this.links = this.links.filter(
        (l) => !removedLinks.has(linkKey(endId(l.source), endId(l.target))));
    }
    const neighborOf = new Map();
    for (const { source, target } of addLinks) {
      if (!neighborOf.has(source)) neighborOf.set(source, target);
      if (!neighborOf.has(target)) neighborOf.set(target, source);
    }
    for (const n of addNodes) {
      if (this.byId.has(n.id)) continue;                    // idempotence
      const node = { id: n.id, mass: n.mass, groupMeta: n.group,
        ...this._spawnPosition(neighborOf.get(n.id)) };
      this.nodes.push(node);
      this.byId.set(n.id, node);
    }
    // Idempotence i pro linky: po (re)connectu s pending deltami přijdou
    // add_edges, které init už obsahoval – duplicitní pružina by hranu
    // tahala dvojnásobnou silou.
    const known = new Set(
      this.links.map((l) => linkKey(endId(l.source), endId(l.target))));
    for (const { source, target, weight } of addLinks) {
      const key = linkKey(source, target);
      if (known.has(key)) continue;
      if (this.byId.has(source) && this.byId.has(target)) {
        known.add(key);
        this.links.push({ source, target, weight });
      }
    }
    this._rebuild();
    this.sim.alpha(Math.max(this.sim.alpha(), 0.5));        // lokální ohřátí
  }

  /** Nový uzel se rodí poblíž prvního existujícího souseda, ne náhodně. */
  _spawnPosition(neighborId) {
    const near = neighborId ? this.byId.get(neighborId) : null;
    if (!near || near.x === undefined) return {};           // d3 rozmístí samo
    const jitter = () => (Math.random() - 0.5) * 2 * SPAWN_JITTER;
    return {
      x: near.x + jitter(),
      y: near.y + jitter(),
      z: this.dimensions === 3 ? near.z + jitter() : 0,
    };
  }

  /** Síla pružiny = váha hrany DĚLENÁ stupněm méně propojeného konce.
   *
   *  Bez toho dělení dostane uzel s tisícem hran tisíc pružin plné síly a
   *  stáhne si všechny sousedy na jedno místo — graf se pak slije do
   *  středové koule místo aby se rozpadl na segmenty (naměřeno na exportu
   *  conBond3: 20 nejpropojenějších uzlů leželo na 0,17 mediánového
   *  poloměru, po normalizaci 0,70). Je to zároveň výchozí chování
   *  d3-force, které se tu dřív přebíjelo konstantou.
   *
   *  Dělí se MENŠÍM ze stupňů: hrana k listu si tak drží plný tah (list
   *  patří ke svému uzlu), zatímco hrana mezi dvěma huby povolí. */
  linkStrength(l) {
    const ends = Math.min(this.degreeOf(endId(l.source)),
      this.degreeOf(endId(l.target)));
    return linkWeight01(l) / Math.max(1, ends);
  }

  /** Počet hran uzlu podle aktuálního stavu (0 pro neznámý uzel). */
  degreeOf(id) {
    return this.degree.get(id) || 0;
  }

  /** Rozděl uzly do skupin pro gravitační centra.
   *
   *  Když aplikace pošle vlastní rozdělení (meta `skupina` u kteréhokoli
   *  uzlu), má přednost — ta ví nejlíp, co je shluk (slovní druh, korpus,
   *  cokoli). Jinak si shluky spočítá knihovna sama z topologie, takže
   *  segmentace funguje na libovolném grafu bez jediného údaje navíc.
   *
   *  Detekce je drahá (Louvain), proto se nepouští při každé deltě: jen
   *  poprvé a pak až se počet hran změní o čtvrtinu. Mezitím nový uzel
   *  převezme skupinu souseda, u kterého se narodil. */
  _regroup() {
    if (this.nodes.some((n) => n.groupMeta !== undefined)) {
      for (const n of this.nodes) n.group = n.groupMeta;
      this._job = null;
    } else {
      const drift = Math.abs(this.links.length - (this._groupedLinks ?? 0));
      const prah = Math.max(8, (this._groupedLinks ?? 0) * GROUP_DRIFT);
      // Nová úloha jen když se graf od posledního dělení znatelně pohnul;
      // rozdělaná úloha se nezahazuje, aby se u tekoucího grafu vůbec někdy
      // dopočítala. Do té doby platí předchozí dělení.
      if (!this._job && drift > prah) {
        const index = new Map(this.nodes.map((n, i) => [n.id, i]));
        const edges = [];
        for (const l of this.links) {
          const a = index.get(endId(l.source));
          const b = index.get(endId(l.target));
          if (a !== undefined && b !== undefined) edges.push(a, b);
        }
        this._job = createGroupingJob(this.nodes.length, edges);
        this._jobIds = this.nodes.map((n) => n.id);
        this._jobLinks = this.links.length;
        if (!this._job) this._groupedLinks = this.links.length;
      }
    }
    this._indexGroups();
  }

  /** Popojdi s hledáním shluků a hotový výsledek nasaď. Volá se z tick(),
   *  takže je práce rozložená do snímků místo jednoho zádrhelu. Výsledek se
   *  přiřazuje podle id — během počítání mohly uzly přibýt i zmizet. */
  _stepGrouping() {
    if (!this._job) return;
    if (!this._job.step(this._groupingBudget())) return;
    const found = this._job.group;
    if (found) {
      const podle = new Map();
      this._jobIds.forEach((id, i) => {
        if (found[i] >= 0) podle.set(id, found[i]);
      });
      for (const n of this.nodes) n.group = podle.get(n.id);
      this._indexGroups();
    }
    this._groupedLinks = this._jobLinks;
    this._job = null;
  }

  /** Kolik času smí hledání shluků ukousnout z tohoto tiku – tolik, kolik
   *  ho po fyzice zbývá do snímku. Když fyzika sama snímek přetáhne (velký
   *  graf), zůstane jen minimum: dopočítá se za víc snímků, ale ovládání se
   *  kvůli tomu nezasekne. */
  _groupingBudget() {
    const volno = (FRAME_MS - (this._tickCost || 0)) * GROUP_BUDGET_SHARE;
    return Math.max(GROUP_BUDGET_MIN, Math.min(GROUP_BUDGET_MAX, volno));
  }

  /** Přerovnej uzly do seznamů podle skupiny (to čte síla skupin). */
  _indexGroups() {
    this.groups = new Map();
    for (const n of this.nodes) {
      if (n.group === undefined || n.group === null) continue;
      const cleny = this.groups.get(n.group);
      if (cleny) cleny.push(n); else this.groups.set(n.group, [n]);
    }
  }

  /** Gravitační centra skupin (uzly s `group`): každá skupina má těžiště,
   *  které k sobě táhne své členy a ODTAHUJE SE od těžišť ostatních skupin,
   *  takže se graf rozpadne na oddělené oblasti místo jedné koule.
   *
   *  Odstup se měří v NÁSOBCÍCH VLASTNÍCH POLOMĚRŮ skupin, ne v pixelech —
   *  díky tomu to platí stejně pro graf o stovce i o statisíci uzlů a nemusí
   *  se to přelaďovat, když se graf mezitím roztáhne.
   *
   *  Uzly bez `group` síla ignoruje; drží je na místě hrany k sousedům. Bez
   *  skupin (nebo s vypnutou volbou „Shluky", viz setClusters) je to no-op,
   *  takže výchozí chování zůstává nezměněné. */
  _groupForce() {
    const stred = new Map();
    const force = (alpha) => {
      if (!this.clusters || this.groups.size < 2) return;
      const prostor = this.dimensions === 3;
      for (const [g, cleny] of this.groups) {
        let x = 0; let y = 0; let z = 0;
        for (const n of cleny) { x += n.x; y += n.y; if (prostor) z += n.z; }
        x /= cleny.length; y /= cleny.length; z /= cleny.length;
        let v = 0;
        for (const n of cleny) {
          v += (n.x - x) ** 2 + (n.y - y) ** 2 + (prostor ? (n.z - z) ** 2 : 0);
        }
        stred.set(g, { x, y, z, r: Math.sqrt(v / cleny.length) });
      }
      for (const [g, cleny] of this.groups) {
        const c = stred.get(g);
        for (const n of cleny) {
          n.vx += (c.x - n.x) * GROUP_COHESION * alpha;
          n.vy += (c.y - n.y) * GROUP_COHESION * alpha;
          if (prostor) n.vz += (c.z - n.z) * GROUP_COHESION * alpha;
        }
      }
      // Posuny se nejdřív NASČÍTAJÍ na skupinu a teprve pak rozdají členům.
      // Rozdávat je uvnitř každé dvojice zvlášť by stálo O(dvojice × členy),
      // takhle je to O(dvojice) + O(uzly) – u tisíců uzlů rozdíl mezi
      // plynulým obrazem a trhanými deseti snímky.
      const klice = [...this.groups.keys()];
      const posun = new Map(klice.map((g) => [g, [0, 0, 0]]));
      for (let i = 0; i < klice.length; i += 1) {
        for (let j = i + 1; j < klice.length; j += 1) {
          const a = stred.get(klice[i]); const b = stred.get(klice[j]);
          let dx = b.x - a.x; let dy = b.y - a.y;
          let dz = prostor ? b.z - a.z : 0;
          let d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d < 1e-6) { dx = 1; dy = 0; dz = 0; d = 1; }
          const chce = (a.r + b.r) * GROUP_SPACING;
          if (d >= chce) continue;
          const sila = ((chce - d) / d) * 0.5 * alpha;
          const ca = this.groups.get(klice[i]); const cb = this.groups.get(klice[j]);
          // menší skupina uhne víc – velká jinak tahá celý graf za sebou
          const wa = cb.length / (ca.length + cb.length);
          const wb = 1 - wa;
          const pa = posun.get(klice[i]); const pb = posun.get(klice[j]);
          pa[0] -= dx * sila * wa; pa[1] -= dy * sila * wa; pa[2] -= dz * sila * wa;
          pb[0] += dx * sila * wb; pb[1] += dy * sila * wb; pb[2] += dz * sila * wb;
        }
      }
      for (const [g, cleny] of this.groups) {
        const [px, py, pz] = posun.get(g);
        if (px === 0 && py === 0 && pz === 0) continue;
        for (const n of cleny) {
          n.vx += px; n.vy += py;
          if (prostor) n.vz += pz;
        }
      }
    };
    force.initialize = () => {};
    return force;
  }

  _rebuild() {
    // stupně musí být hotové DŘÍV, než se hrany předají d3 – forceLink si
    // při `links()` rovnou zavolá accessor strength a zapeče si výsledek.
    this.degree = new Map();
    for (const l of this.links) {
      for (const end of [endId(l.source), endId(l.target)]) {
        this.degree.set(end, (this.degree.get(end) || 0) + 1);
      }
    }
    this._regroup();
    this.sim.nodes(this.nodes);
    this.sim.force('link').links(this.links);
  }

  /** Jeden krok simulace; null = vychladlá (není co počítat).
   *
   *  Hledání shluků popojde i u vychladlého grafu – jinak by se rozdělaná
   *  úloha po ustálení nikdy nedopočítala. Nové dělení pak simulaci lehce
   *  ohřeje, aby se uzly do svých oblastí stihly přesunout. */
  tick() {
    const melSkupiny = this.groups.size;
    this._stepGrouping();
    const zmena = this.clusters && this.groups.size !== melSkupiny;
    if (this.sim.alpha() < this.sim.alphaMin() && !zmena) return null;
    if (zmena) this.sim.alpha(Math.max(this.sim.alpha(), 0.3));
    const start = Date.now();
    this.sim.tick();
    const cena = Date.now() - start;
    // klouzavý průměr – jedno drahé tiknutí nemá rozhodovat o rozpočtu
    this._tickCost = this._tickCost === undefined
      ? cena : this._tickCost * 0.9 + cena * 0.1;
    return this.positions();
  }

  positions() {
    const buf = new Float32Array(this.nodes.length * 3);
    this.nodes.forEach((n, i) => {
      buf[i * 3] = n.x;
      buf[i * 3 + 1] = n.y;
      buf[i * 3 + 2] = this.dimensions === 3 ? n.z : 0;
    });
    return buf;
  }

  ids() {
    return this.nodes.map((n) => n.id);
  }
}

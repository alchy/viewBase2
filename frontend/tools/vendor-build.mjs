/** Předbalení npm závislostí do `src/vendor/` (jednorázově, ne při buildu).
 *
 *  Repo má obsahovat všechny artefakty a `npm install` nesmí být potřeba k
 *  sestavení frontendu (uživatelské rozhodnutí). Runtime závislosti proto
 *  neleží v node_modules, ale ZDROJOVĚ v repu – každá jako jeden soběstačný
 *  ESM soubor. `three` se NEBALÍ do ostatních (jinak by vzniklo víc kopií a
 *  `instanceof` by přestalo fungovat): addony i troika ji importují relativně
 *  z vendorované kopie.
 *
 *  Spouští se ručně po `npm install` (viz src/vendor/README.md):
 *      node tools/vendor-build.mjs
 */
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const root = path.dirname(fileURLToPath(import.meta.url));          // frontend/tools
const frontend = path.resolve(root, '..');
const vendor = path.join(frontend, 'src', 'vendor');
const modules = path.join(frontend, 'node_modules');

/** Balíčky do jednoho souboru; `three` je externí (sdílená kopie). */
const BUNDLES = [
  { out: 'd3-force-3d/d3-force-3d.mjs', entry: 'd3-force-3d', external: [] },
  { out: 'troika-three-text/troika-three-text.mjs', entry: 'troika-three-text',
    external: ['three'], threeFrom: '../three/three.module.js' },
  { out: 'three/addons/EffectComposer.js', external: ['three'], threeFrom: '../three.module.js',
    entry: 'three/examples/jsm/postprocessing/EffectComposer.js' },
  { out: 'three/addons/RenderPass.js', external: ['three'], threeFrom: '../three.module.js',
    entry: 'three/examples/jsm/postprocessing/RenderPass.js' },
  { out: 'three/addons/UnrealBloomPass.js', external: ['three'], threeFrom: '../three.module.js',
    entry: 'three/examples/jsm/postprocessing/UnrealBloomPass.js' },
  { out: 'three/addons/OrbitControls.js', external: ['three'], threeFrom: '../three.module.js',
    entry: 'three/examples/jsm/controls/OrbitControls.js' },
];

/** Soubory kopírované beze změny (už jsou soběstačné ESM). */
const COPIES = [
  ['three/build/three.module.js', 'three/three.module.js'],
  ['three/LICENSE', 'three/LICENSE'],
  ['d3-force-3d/LICENSE', 'd3-force-3d/LICENSE'],
  ['troika-three-text/LICENSE', 'troika-three-text/LICENSE'],
];

/** ESM vstup balíčku z jeho package.json (`module`/`exports`/`main`). */
async function packageEntry(name) {
  const dir = path.join(modules, name);
  const pkg = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8'));
  const exp = pkg.exports?.['.'] ?? pkg.exports;
  const cand = (typeof exp === 'string' ? exp : exp?.import?.default ?? exp?.import
    ?? exp?.default) ?? pkg.module ?? pkg.main;
  if (!cand) throw new Error(`nevím, čím začít u ${name}`);
  return path.join(dir, cand);
}

async function bundle({ out, entry, external, threeFrom }) {
  const outDir = path.join(vendor, path.dirname(out));
  const name = path.basename(out);
  // holé jméno balíčku → jeho ESM vstup z package.json (rollup potřebuje cestu)
  const resolved = entry.includes('/')
    ? path.join(modules, entry)
    : await packageEntry(entry);
  await build({
    configFile: false,
    logLevel: 'warn',
    build: {
      outDir, emptyOutDir: false, minify: false, target: 'es2020',
      lib: { entry: resolved, formats: ['es'], fileName: () => name },
      rollupOptions: { external },
    },
  });
  if (threeFrom) {                       // `from "three"` → relativní vendor cesta
    const file = path.join(outDir, name);
    const code = await readFile(file, 'utf8');
    await writeFile(file, code.replace(/(from\s*)["']three["']/g, `$1"${threeFrom}"`));
  }
  console.log('vendor:', out);
}

await mkdir(vendor, { recursive: true });
for (const [from, to] of COPIES) {
  await mkdir(path.join(vendor, path.dirname(to)), { recursive: true });
  await cp(path.join(modules, from), path.join(vendor, to));
  console.log('kopie: ', to);
}
for (const spec of BUNDLES) await bundle(spec);
console.log('hotovo – zkontroluj `npx vitest run` a `npm run build`');

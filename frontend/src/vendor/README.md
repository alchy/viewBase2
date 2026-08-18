# Vendorované knihovny (`src/vendor/`)

Runtime závislosti frontendu leží **zdrojově v repu**, ne v `node_modules`:
repo má obsahovat všechny artefakty a `npm install` nesmí být potřeba k tomu,
aby se dal frontend sestavit (uživatelské rozhodnutí; stejná logika jako u
sestaveného bundlu v `python/viewbase/static`). Zdrojové soubory je importují
**relativními cestami**, takže v kódu není žádná aliasová magie – co je
napsané, to se načte.

| adresář | knihovna | verze | licence | k čemu |
|---|---|---|---|---|
| `three/three.module.js` | three.js | **0.165.0** | MIT | WebGL renderer grafu |
| `three/addons/*.js` | three examples (OrbitControls, EffectComposer, RenderPass, UnrealBloomPass) | 0.165.0 | MIT | kamera a bloom |
| `d3-force-3d/d3-force-3d.mjs` | d3-force-3d | **3.0.6** (+ d3-binarytree/dispatch/octree/quadtree/timer) | ISC/BSD | fyzika grafu |
| `troika-three-text/troika-three-text.mjs` | troika-three-text | **0.52.4** (+ troika-worker-utils, troika-three-utils, bidi-js, webgl-sdf-generator) | MIT | popisky uzlů (SDF text) |
| `xterm/*` | xterm.js + addon-fit | **6.0.0** / **0.11.0** | MIT | terminál shell okna |

`three` je **jediná kopie** – addony i troika ji importují z
`../three.module.js`, aby v běhu neexistovaly dvě verze (jinak přestane
fungovat `instanceof` napříč knihovnami).

Balíčky s tranzitivními závislostmi (d3-force-3d, troika) jsou předbalené do
JEDNOHO souboru, `three` a `xterm` se kopírují tak, jak je vydávají autoři.

## Aktualizace verze

```bash
cd frontend
npm install three@<verze> d3-force-3d@<verze> troika-three-text@<verze>  # dočasně
node tools/vendor-build.mjs        # předbalí a nakopíruje do src/vendor/
npm remove three d3-force-3d troika-three-text                            # zase pryč
npx vitest run && npm run build    # ověř
```

xterm se aktualizuje ručně (viz `xterm/README.md`). Po aktualizaci přepiš
verze v tabulce výše a commitni i přebuildovaný bundle.

## Co ZŮSTÁVÁ v npm

Jen vývojářské nástroje, které se do výsledku nedostanou: `vite` (build),
`vitest` + `happy-dom` (testy). Bez nich se dá knihovna dál používat –
`pip install viewbase` Node.js nepotřebuje vůbec, protože `python/viewbase/
static` obsahuje hotový bundle.

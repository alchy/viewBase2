/** Options (§8a designu): view-only volby diváka (fyzika běží, čára/splajn,
 *  2D/3D, shluky) –
 *  čistě klientský stav, žádný round-trip na server. Persistuje se do
 *  localStorage klíčované podle `title` screenu (slug), ne podle číselného
 *  id – id se přiděluje znovu od 1 při každém běhu skriptu, takže by
 *  „Screen 1" včerejšího a dnešního běhu nechtěně sdílely nastavení. */

export const DEFAULT_OPTIONS = Object.freeze({
  physicsRunning: true,
  edgeStyle: 'line',        // 'line' | 'spline'
  edgeElasticity: 0.3,
  dimensions: 3,            // 2 | 3
  clusters: true,           // shluky (komunity) jako oblasti – síla skupin
});

/** Titulek screenu → stabilní klíč pro localStorage (lowercase, jen
 *  alfanumerika a pomlčky, bez opakovaných/okrajových pomlček). */
export function slugTitle(title) {
  const slug = String(title ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'viewbase';
}

export function optionsKey(title) {
  return `vb-options:${slugTitle(title)}`;
}

/** Načti Options pro daný titulek; chybějící/vadný záznam → `defaults`
 *  (DEFAULT_OPTIONS, nebo zavolatelem dodané – např. main.js seeduje
 *  edgeStyle/edgeElasticity z aktuálního `store.config.edge_style`, aby
 *  Options na úplně prvním připojení nepřebily to, co poslal Python).
 *  `storage` je injektovatelné (localStorage v prohlížeči, fake Map v testu). */
export function loadOptions(title, storage = globalThis.localStorage,
                            defaults = DEFAULT_OPTIONS) {
  if (!storage) return normalizeOptions({ ...defaults });
  try {
    const raw = storage.getItem(optionsKey(title));
    if (!raw) return normalizeOptions({ ...defaults });
    const parsed = JSON.parse(raw);
    return normalizeOptions({ ...defaults, ...parsed });
  } catch {
    return normalizeOptions({ ...defaults });
  }
}

/** Options nemají ovládání elasticity a splajn s elasticitou 0 je rovná
 *  úsečka (render/edges.js) – přepínač „Křivkové hrany" by tak nic
 *  neudělal. Server default pro 'line' je přitom elasticity 0.0 a seed
 *  přes `??` ho převezme (0 není nullish); do localStorage se pak uložila
 *  nula natrvalo. Neplatná (≤0, NaN, ne-číslo) elasticita proto při
 *  každém načtení spadne na DEFAULT_OPTIONS.edgeElasticity. */
function normalizeOptions(options) {
  const e = Number(options.edgeElasticity);
  if (!(e > 0)) options.edgeElasticity = DEFAULT_OPTIONS.edgeElasticity;
  return options;
}

export function saveOptions(title, options, storage = globalThis.localStorage) {
  if (!storage) return;
  storage.setItem(optionsKey(title), JSON.stringify(options));
}

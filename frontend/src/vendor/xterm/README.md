# xterm.js (vendorováno)

Terminálový emulátor pro **shell okno** (`src/plugins/shell.js`). Soubory tu
leží **zdrojově v repu**, ne jako npm závislost — repo má obsahovat všechny
artefakty a `npm install` nesmí být potřeba k tomu, aby se dalo sestavit
(uživatelské rozhodnutí, stejná logika jako u sestaveného bundlu v
`python/viewbase/static`).

| soubor | co to je | zdroj |
|---|---|---|
| `xterm.mjs` | jádro emulátoru (ESM build) | `@xterm/xterm` **6.0.0**, `lib/xterm.mjs` |
| `xterm.css` | styly terminálu (třídy `.xterm*`) | `@xterm/xterm` 6.0.0, `css/xterm.css` |
| `addon-fit.mjs` | dopočet cols/rows podle velikosti okna | `@xterm/addon-fit` **0.11.0**, `lib/addon-fit.mjs` |
| `LICENSE` | MIT (xterm.js authors) | tamtéž |

Licence: **MIT**, viz `LICENSE` — vendorování je v souladu s ní (ponechán
copyright i text licence).

## Aktualizace verze

```bash
npm pack @xterm/xterm@<verze> @xterm/addon-fit@<verze>   # nebo stažení z registry
tar xf xterm-<verze>.tgz && cp package/lib/xterm.mjs package/css/xterm.css package/LICENSE \
    frontend/src/vendor/xterm/
tar xf addon-fit-<verze>.tgz && cp package/lib/addon-fit.mjs frontend/src/vendor/xterm/
```

Pak přepiš verze v téhle tabulce, spusť `npx vitest run` a `npm run build`.
Mapy (`*.map`) se záměrně nekopírují (velké a k ničemu v produkci).

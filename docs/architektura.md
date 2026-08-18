# Architektura

*Jak to uvnitř drží pohromadě, struktura repozitáře, vývoj a stav.*

[← zpět na přehled](../README.md)

---

# Architektura

```
Python skript (GraphWindow API)
        │  data + metadata + vzhled + chování
viewbase (pip balíček: GraphModel, FastAPI + WebSocket, zabalený frontend)
        │  ↓ delty + akce          ↑ eventy (klik, hover, kamera, control okna)
Browser (viewbase.js)
        ├─ GraphStore  – jediné zrcadlo stavu
        ├─ PhysicsWorker – d3-force-3d (Barnes-Hut, 2D/3D)
        └─ Renderer – Three.js instancing, témata, SDF labely, toky, okna
```

### Struktura repozitáře

```
python/viewbase/      pip balíček (graph_window, screen, log, controls, server, protocol, static/)
frontend/             zdrojáky JS (Vite) – build → static/
examples/             spustitelné ukázky = živá dokumentace
docs/superpowers/     návrhové specifikace a plány
docs/images/          screenshoty pro README
legacy/               původní prototyp (referenční)
```

---

# Vývoj

```bash
pip install -e "python[dev]"
cd python && python -m pytest -q          # backend testy
cd frontend && npm install && npm test    # frontend testy (vitest)
cd frontend && npm run build              # sestaví static/ pro balíček
```

Frontend se vyvíjí s Vite/npm, ale výstup buildu se zabalí do Python balíčku —
koncový uživatel npm nepotřebuje.

---

# Stav

Funkční jádro: živý 2D/3D graf, typy uzlů, témata (modern/cyber), SDF popisky,
bloom, quality=auto, eventy/akce, zvýraznění sousedů, detailní okno, toky a typy
toků, wireshark příklady (pcap, živý odposlech, traceroute), control okna
(parametrické GUI), terminálová okna (konzole + REST push) a křivkové hrany
(čáry/splajny + elasticita), **živá změna vzhledu uzlu za běhu (barva/velikost
přes meta, přepnutí typu, redefinice typu)**. Rozpracováno: multi-screen
Workbench — backend (`Screen`, `vb.log`, multi-window `serve()`/protokol
routing podle `screen_id`) hotový a otestovaný, frontend (vizuální
přepínač, compositor, `workbench` chrome) zatím ne — viz sekce výše.
Plánováno dále: GLB modely uzlů, distribuce přes wheel + CI, IPv6 v živém
odposlechu.

---

[← zpět na přehled](../README.md)

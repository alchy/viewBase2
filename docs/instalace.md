# Instalace a spuštění

*Jak knihovnu přidat do projektu, co si s sebou nese a co vznikne při prvním spuštění.*

[← zpět na přehled](../README.md)

---

# Instalace a spuštění

**Z PyPI** (po prvním release; balíček nese už sestavený frontend —
Node.js není potřeba):

```bash
pip install viewbase
python examples/quickstart.py     # otevře http://127.0.0.1:8080
```

**Z repa** (doporučený postup dnes):

```bash
git clone https://github.com/alchy/viewBase2 && cd viewBase2
python -m venv .venv
source .venv/bin/activate         # Windows: .venv\Scripts\activate
pip install -r requirements.txt   # editable install z ./python + dev nástroje
python examples/quickstart.py     # otevře http://127.0.0.1:8080
```

Frontend je v repu už sestavený (`python/viewbase/static`) — Node.js je
potřeba jen při vývoji frontendu. **Požadavky:** Python ≥ 3.10.

### Do vlastního projektu

viewbase je **knihovna**: přidá se do existující aplikace, nespouští se jako
samostatná služba. Vlastní projekt si ji přidá jako závislost:

```bash
# z lokálního klonu (editable – změny v repu jsou hned vidět)
pip install -e /cesta/k/viewBase2/python

# nebo přímo z gitu
pip install "viewbase @ git+https://github.com/alchy/viewBase2#subdirectory=python"
```

…a v `pyproject.toml` vlastního projektu:

```toml
[project]
dependencies = ["viewbase @ git+https://github.com/alchy/viewBase2#subdirectory=python"]
```

**Co se tím doinstaluje** (řídí `python/pyproject.toml`, hlídá
`tests/test_requirements.py` — každý import musí mít svou závislost a žádná
nesmí zbýt):

| balíček | proč |
|---|---|
| `fastapi` ≥ 0.110 | HTTP server, WebSocket endpoint, REST `/api/event` |
| `uvicorn[standard]` ≥ 0.29 | ASGI runtime (`[standard]` přináší websockets a uvloop) |
| `pyotp` ≥ 2.9 | ověření kódu z autentikátoru pro zabezpečená okna |
| `qrcode` ≥ 7.4 | QR pro registraci autentikátoru (ASCII + SVG, **bez** Pillow) |
| `cryptography` *(volitelné)* | vygenerování self-signed certifikátu pro `tls=True`; když chybí, použije se binárka `openssl` |

Nic dalšího: **žádný Node.js** (frontend je v balíčku sestavený), žádná
databáze, žádný externí broker. Vývojové nástroje (`pytest`, `httpx`) jsou
v extra `[dev]`.

**Co knihovna potřebuje za běhu:** volný TCP port (`vb.Project(port=…)`) a
zapisovatelný domovský adresář — při prvním spuštění vznikne `~/.viewbase/`
s uživatelem, TOTP tajemstvím a (u `tls=True`) certifikátem; cestu přesměruje
proměnná `VIEWBASE_HOME` (kontejnery, CI). Zabezpečená okna mimo loopback
vyžadují TLS, viz [První spuštění](#první-spuštění).

Minimální integrace do cizí aplikace vypadá takhle — knihovna si nebere
kontrolu nad procesem, `serve(block=False)` vrátí handle a běží v vlákně:

```python
import viewbase as vb

project = vb.Project(port=8080)          # + user=, tls=, session_ttl=…
screen = vb.Screen(title="Moje appka")
graph = vb.GraphWindow(screen=screen, title="Data")
handle = project.serve(screen, block=False)   # neblokuje – appka běží dál
...                                            # graph.add_node(…) kdykoli
project.stop()                                 # úklid (zavře port i okna)
```

<details>
<summary>Vývoj frontendu (vyžaduje Node.js ≥ 20)</summary>

```bash
cd frontend && npm install   # jen vite + vitest (nástroje), knihovny jsou v repu
npm run build      # sestaví do python/viewbase/static
npx vitest run     # jednotkové testy frontendu
```

Runtime knihovny (three.js, d3-force-3d, troika-three-text, xterm.js) **nejsou
npm závislosti** — leží zdrojově v `frontend/src/vendor/` a importují se
relativně, takže repo obsahuje všechny artefakty a build je nepotřebuje
stahovat (viz `frontend/src/vendor/README.md`, aktualizace přes
`node tools/vendor-build.mjs`).

</details>

### První spuštění

První start si sám připraví domov v `~/.viewbase` — nic se nekonfiguruje
předem, a co je tajné, nikdy neopustí disk:

```
~/.viewbase/                                  adresář 0700
├── users.json                                (0600) uživatelé a jejich tajemství
├── user-workbench/                           adresář 0700
│   ├── totp-workbench.svg                    (0600) QR jako obrázek
│   └── totp-workbench.txt                    (0600) tentýž QR v ASCII + ruční kód
└── tls/                                      jen při `tls=True`
    ├── cert.pem                              (0600) vlastnoručně podepsaný certifikát
    └── key.pem                               (0600) privátní klíč
```

Do konzole i do log okna přitom jde jen systémový text — jméno a cesta, žádné
tajemství:

```
viewbase: nová TOTP registrace pro uživatele 'workbench' – naskenuj:
          cat ~/.viewbase/user-workbench/totp-workbench.txt
viewbase: uživatel instance: workbench; registrovaní: workbench (TOTP)
```

`cat` toho souboru vysype QR rovnou do terminálu (funguje i přes SSH, kde
obrázek neotevřete) — naskenujte ho do autentikátoru (MS Authenticator, Google
Authenticator, 1Password, Bitwarden…) a máte kód pro
[zabezpečená okna](zabezpeceni.md). Uživatele instance zvolíte
`vb.Project(port=8080, user="jindrich")`, jinak je to `workbench`. Další start
už mlčí; když soubory smažete, vyrobí se znovu ze stávajícího tajemství
(registrovat se podruhé nemusíte).

---

---

[← zpět na přehled](../README.md)

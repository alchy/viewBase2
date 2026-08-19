# viewbase

**Pracovní prostředí ve stylu Amiga Workbench v prohlížeči, ovládané
z Pythonu — screeny, okna a živá 2D/3D vizualizace grafů.**

Knihovna, kterou i junior v Pythonu postaví celé interaktivní prostředí:
**screeny** (plochy, mezi kterými se přepíná a které jdou po amigovsku
stáhnout a odkrýt ten pod nimi) a na nich **okna** — živý graf vztahů,
log konzole (`tail -f` ve stylu AmigaShell), formulářové dialogy,
terminály, detailní okna nad uzly. Bez psaní JavaScriptu, bez npm, bez
znalosti Three.js. Python je zdroj pravdy pro *data, vzhled a chování*.

Frontend je architektonicky **window manager, jehož schopnosti jsou
pluginy** — a zobrazení grafu je ta nejsilnější z nich: prohlížeč počítá
*rozmístění* lokálně (fyzika ve Web Workeru) a vykresluje instancovaně,
takže obraz je plynulý a zvládá tisíce až desítky tisíc uzlů.

![viewbase – okno grafu a control okno na screenu, téma cyber](docs/images/hero.png)

Workflow je **explicitní** — jako práce se souborem (`fopen` → práce →
`close`):

```python
import viewbase as vb

project = vb.Project(port=8080)          # 1. služba: port se nastaví PŘED vším
screen = vb.Screen(title="Ahoj graf")    # 2. plocha: vytvořením dostane id
graph = vb.GraphWindow(screen=screen,    # 3. okna: typované instance na screenu
                       title="Síť", dimensions=3)
vb.LogWindow(screen=screen)              #    systémové log okno (tail -f)

graph.add_node("a", name="Alfa")         # 4. data: přes instanci okna
graph.add_node("b", name="Beta")
graph.add_edge("a", "b")

project.serve(screen, open_browser=True) # 5. start; stop()/Ctrl-C zavře port
```

---

---

## Kudy dál

Tenhle soubor je **rozcestník**; podrobnosti jsou v `docs/` a každá stránka
odpovídá na jednu otázku:

| stránka | co se tam dozvíte |
|---|---|
| **[Instalace a spuštění](docs/instalace.md)** | jak knihovnu přidat do vlastního projektu, jaké má závislosti a co vznikne při prvním spuštění (`~/.viewbase`, uživatel, QR pro autentikátor) |
| **[Model: projekt → screeny → okna](docs/okna.md)** | hlavní referenční text: `Project`/`Screen` a všechny typy oken (log, konzole, HTML, shell, formulář, graf) i jejich API |
| **[Zabezpečení: okna, relace, autorizace, TLS](docs/zabezpeceni.md)** | `private=True` a kód z autentikátoru; relace s expirací; **autorizace jako vlastnost registrace události**; **kontrola `Origin`** (WebSocket neprochází CORS); TLS včetně self-signed certifikátu a reverzní proxy; co se loguje a co se do logu nikdy nedostane |
| **[Témata a chrome oken](docs/temata.md)** | vestavěná témata, CSS proměnné, gadgety, dok minimalizovaných oken, scrollbary, výběr textu |
| **[Multi-screen Workbench](docs/multiscreen.md)** | víc screenů na jednom serveru, přepínání, drag-reveal, `ScreenMenu` |
| **[Ukázky](docs/ukazky.md)** | screenshoty ze živého běhu |
| **[Veřejné API a příklady](docs/api.md)** | co je API pro vývojáře a co vnitřek knihovny; tabulka spustitelných příkladů v `examples/` |
| **[Architektura](docs/architektura.md)** | jak to uvnitř drží pohromadě, struktura repozitáře, vývoj a stav |

Než instanci vystavíte ven, přečtěte si
[Zabezpečení](docs/zabezpeceni.md) — hlavně dvě věci, které nejsou vidět:
**autorizace je vlastnost registrace události** (`_register(..., needs=…)`,
bez toho registrace skončí chybou) a **`Origin` se kontroluje při WebSocket
handshaku** (bez nastavení musí sedět na `Host`, jinak
`allowed_origins=[…]`), protože WebSocket neprochází CORS.

Návrhové dokumenty (proč je něco udělané právě takhle) jsou v
[`docs/superpowers/specs/`](docs/superpowers/specs/), implementační plány
v [`docs/superpowers/plans/`](docs/superpowers/plans/).

---

## Proč to takhle

Klasická úskalí force-graph vizualizací (škubání, strop pár stovek uzlů) plynou
z toho, že fyzika běží na serveru a klient dostává snapshoty po síti. viewbase to
obrací:

- **Fyzika běží v prohlížeči** ve Web Workeru (d3-force-3d, Barnes-Hut
  *O(n log n)*) — obraz je plynulý na 60 fps, pozice uzlů po síti vůbec
  necestují.
- **Instancovaný rendering** (Three.js `InstancedMesh`) — počet draw callů
  nezávisí na počtu uzlů; popisky jsou SDF text ve WebGL s LOD rozpočtem.
- **Server posílá jen delty** (přidej/změň/odeber uzel·hranu, akce) přes
  WebSocket; graf se může za běhu průběžně přestavovat.
- **Graf se sám rozpadne na oblasti** — knihovna si ve workeru najde shluky
  z topologie (Louvain) a dá každému gravitační centrum, které se odtahuje
  od ostatních; hustě propojené uzly tak drží pohromadě místo aby se všechno
  slilo doprostřed. Hledání běží jako průběžná úloha v rozpočtu zbylém ze
  snímku, takže ani na velkém grafu neseká ovládání, a graf se dělí znovu,
  když se za běhu dost změní. Vlastní rozdělení se dá vnutit metadatem
  `skupina` u uzlu (slovní druh, korpus, cokoli aplikace ví lépe).

**Ovládání:** `W`/`A`/`S`/`D` obíhá kolem grafu, **`Shift`+`WASD` veze plátno**
(prochází graf do stran, aniž by se pohled stáčel zpět ke středu), `Q`/`E`
přibližuje, **mezerník nacentruje na těžiště grafu** a odzoomuje na celý jeho
rozsah, `R` vrátí výchozí pohled. Klávesy patří vždy jen aktivnímu oknu na
viditelném screenu.

Naměřeno (Apple M4 Pro, headless Chromium): **3 000 uzlů ~120 fps**,
**10 000 uzlů ~86 fps**.

---

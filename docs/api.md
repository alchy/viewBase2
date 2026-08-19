# Veřejné API a příklady

*Co je pro vývojáře, co je vnitřek knihovny, a kde je to vidět v běžícím kódu.*

[← zpět na přehled](../README.md)

---

# Dokumentace

**Spustitelné příklady** (`examples/`) — nejlepší živá reference:

| Soubor | Co ukazuje |
|---|---|
| `examples/quickstart.py` | **kanonický workflow**: `Project` → `Screen` → `GraphWindow` → data → `serve` (živý 3D graf) |
| `examples/log_window.py` | **základ — systémové log okno**: `vb.LogWindow(screen=…)` + `vb.log()` (tail -f, filtry) |
| `examples/quickstart2d.py` | 2D ortografický režim |
| `examples/interactive.py` | klik → rozbalení sousedů (eventy/akce) |
| `examples/prototype.py` | `ControlWindow` jako **formulářový dialog** (přidání uzlu podle zadaných polí), `TerminalWindow` jako log |
| `examples/showcase.py` | téma cyber, typy uzlů, **živá změna barvy/typu za běhu**, toky, **control okno** (čáry/splajny) |
| `examples/terminal.py` | **konzole v prohlížeči**: `TerminalWindow`, `on_input`, `terminal_write`, výstupní panel a REST push (`/api/event`) |
| `examples/workbench.py` | **Workbench téma**: všechny typy oken (graf, formulář, konzole, panel z prvků, log) v `workbench-amiga` / `workbench-gray` – lišty, rohový sizing gadget, konzole jako jedna plocha (AmigaShell) |
| `examples/shell.py` | **shell okno**: skutečný terminál na PTY (xterm.js), zámek odemykacím kódem, druhé okno s `command=["top"]` |
| `examples/private_windows.py` | **zabezpečená okna**: `private=True` na HTML/formulářovém/konzolovém okně, `Options → Unlock/Lock Window`, TOTP z autentikátoru |
| `examples/access_groups.py` | **uživatelé, skupiny a přístup**: dvě plochy pro dvě skupiny, rekurzivní členství, okno „vidí víc lidí, než do něj smí psát", přihlášení jménem a kódem |
| `examples/html_window.py` | **HTML okno z prvků**: `HtmlWindow` + `grid`, `label`/`input`/`slider`/`checkbox`/`button`, `on_click`/`on_change`/`on_submit`, `.text`/`.value` za běhu, `panel.on_event` |
| `examples/words.py` | mapa slov z Wikipedie (crawl odkazů) |
| `examples/stress.py` | zátěžový test (tisíce uzlů) |
| `examples/log_demo.py` | **multi-screen Workbench**: `vb.log()` → vestavěné okno „Log" (`tail -f` styl AmigaShell, timestampy), Options aktivního okna na liště (graf: fyzika/splajn/3D; log: filtry úrovní a zdrojů) |
| `examples/screen_menu.py` | **multi-screen Workbench**: `ScreenMenu` (autorské pull-down menu), `Screen.pin_menu()` volané před vznikem GraphWindow |
| `examples/multiscreen.py` | **multi-screen Workbench**: dva `Screen`/`GraphWindow` s tab přepínačem a drag-reveal, explicitní `Screen.destroy()` přes REST |
| [`examples/wireshark/`](../examples/wireshark/README.md) | **síťové toky**: přehrání pcap, živý odposlech a cesta paketu (traceroute) |

## Parametry instance (`vb.Project`)

Všechno, co se u služby nastavuje, se nastavuje **tady** — jedno místo,
žádné proměnné prostředí roztroušené po systému.

```python
project = vb.Project(port=8080, tls=True, log_level="info")
```

| parametr | výchozí | k čemu |
|---|---|---|
| `host`, `port` | `127.0.0.1`, `8080` | kde služba poslouchá |
| `user` | `workbench` | uživatel instance; na čisté instalaci je to **první uživatel**, takže dostane `group:administrator` |
| `users` | — | další uživatelé, které má instance založit: `["jindra", "demo"]` nebo `{"jindra": ["ucetni"]}`. Zakládá se při **vzniku instance**, idempotentně (tajemství ani skupiny existujícím nemění) |
| `users_file` | `~/.viewbase/users.json` | **soubor politiky**: uživatelé, skupiny i práva objektů |
| `identity` | JSON soubor | zdroj identit (`exists`/`authenticate`/`groups_of`) — sem přijde LDAP |
| `policy` | sekce `access` téhož souboru | zdroj práv objektů (`load`/`save`) |
| `default_access` | `["group:users"]` | ACL, které dědí plochy bez vlastního; `["group:public"]` = veřejná instance |
| `allow_anonymous` | `True` | `False` = nejdřív se představ, i kdyby bylo všechno veřejné |
| `tls` | `None` | `True` = vlastnoručně podepsaný z `~/.viewbase/tls/`, nebo `vb.Tls(cert, key)` |
| `tls_hosts` | — | další jména/IP do SAN certifikátu |
| `http_redirect` | `False` | `True` = na portu+1 běží přesměrování plaintextu na TLS |
| `forwarded_allow_ips` | `127.0.0.1` | komu se věří `X-Forwarded-For` (adresa **vaší proxy**, ne klientů) |
| `allowed_origins` | Origin musí sedět na Host | odkud smí přijít stránka, která se připojí |
| `log_level` | `warning` | od jaké závažnosti se vůbec něco zaznamená (audit projde vždy) |
| `session_ttl` | `900` s | klouzavá platnost relace |
| `session_max_age` | `8 h` | absolutní strop; po něm zase kód z autentikátoru |

Přístup se pak jmenuje na jednotlivých prvcích a dědí se plocha → okno:

```python
screen = vb.Screen(title="Provoz", id="provoz", access=["group:ucetni"])
okno = vb.HtmlWindow("mzdy", title="Mzdy", private=True)
okno.access.add("group:mzdy")           # vidí navíc mzdová účtárna
okno.access.write.set(["user:hana"])    # …zasahovat smí jen hana
```

Uživatele a skupiny **zakládá správce**, ne aplikace:

```bash
python -m viewbase.admin adduser hana --groups ucetni,mzdy
python -m viewbase.admin group ucetni --add mzdy
python -m viewbase.admin access screen:provoz --see ucetni
```

Podrobnosti (skupiny, dědičnost, soubor politiky, přihlášení) jsou
v [Zabezpečení](zabezpeceni.md#přístup-uživatelé-skupiny-a-acl); běžící
ukázka je `examples/access_groups.py`.

**Veřejné API vs. vnitřek.** Pro vývojáře je to, co vyleze z `import viewbase as vb`:

| jméno | k čemu |
|---|---|
| `vb.Project` | služba: port, uživatel, TLS, relace; `serve()` / `stop()` |
| `vb.Screen` | plocha (screen) s titulkem, tématem, menu a přístupem (`id=`, `access=`) |
| `vb.GraphWindow` | grafové okno + API grafu (`add_node/add_edge/…`), otevírání ostatních oken |
| `vb.ControlWindow` | formulářové okno (typovaná pole) |
| `vb.TerminalWindow` | konzole (řádky textu, `on_input`) |
| `vb.HtmlWindow` + `vb.Ui` | okno z prvků (grid, inputy, tlačítka) a inline pomocníci |
| `vb.ShellWindow` | skutečný terminál na PTY |
| `vb.LogWindow`, `vb.log` | systémové log okno a zápis do něj |
| `vb.ScreenMenu` | autorské pull-down menu na liště screenu |
| `vb.Tls` | certifikát a klíč pro TLS |
| `vb.serve`, `vb.create_app`, `vb.ServerHandle` | nižší vrstva (vlastní hostování, REPL) |

Moduly `viewbase.mfa`, `viewbase.sessions`, `viewbase.tls` (kromě `Tls`),
`viewbase.protocol`, `viewbase.widgets` a metody jako `lock_spec()`,
`announce_lock()`, `peek_actions()` nebo `start_periodic_tasks()` jsou
**vnitřek knihovny** — používá je server a testy, ne aplikace, a můžou se
změnit bez ohlášení.

**Návrhové dokumenty** (`docs/superpowers/specs/`) — architektura a rozhodnutí:

- [Návrh knihovny (architektura, protokol, fyzika, rendering)](superpowers/specs/2026-06-10-viewbase-library-design.md)
- [Detailní okno](superpowers/specs/2026-06-14-detail-window-design.md)
- [Traceroute toky (routery jako uzly, multi-hop)](superpowers/specs/2026-06-16-traceroute-toky-design.md)
- [Control okna (parametrické GUI) + křivkové hrany](superpowers/specs/2026-06-17-control-okna-design.md)
- [Multi-screen Workbench (Amiga-style, ve vývoji)](superpowers/specs/2026-08-02-multi-screen-workbench-design.md)
- [HTML okno (HtmlWindow)](superpowers/specs/2026-08-17-html-okno-design.md)
- [Shell okno (ShellWindow) – PTY + xterm.js, zabezpečená okna a TOTP](superpowers/specs/2026-08-18-shell-okno-design.md)
- [Zjednodušení DX (explicitní workflow Project → Screen → okna)](superpowers/specs/2026-07-15-dx-zjednoduseni-design.md)
- [Multiuser a privátní okna (návrh, zatím neimplementováno)](superpowers/specs/2026-08-18-multiuser-privatni-okna-design.md)

Implementační plány (krok za krokem) jsou v
[`docs/superpowers/plans/`](superpowers/plans/).

---

---

[← zpět na přehled](../README.md)

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
| `examples/html_window.py` | **HTML okno z prvků**: `HtmlWindow` + `grid`, `label`/`input`/`slider`/`checkbox`/`button`, `on_click`/`on_change`/`on_submit`, `.text`/`.value` za běhu, `panel.on_event` |
| `examples/words.py` | mapa slov z Wikipedie (crawl odkazů) |
| `examples/stress.py` | zátěžový test (tisíce uzlů) |
| `examples/log_demo.py` | **multi-screen Workbench**: `vb.log()` → vestavěné okno „Log" (`tail -f` styl AmigaShell, timestampy), Options aktivního okna na liště (graf: fyzika/splajn/3D; log: filtry úrovní a zdrojů) |
| `examples/screen_menu.py` | **multi-screen Workbench**: `ScreenMenu` (autorské pull-down menu), `Screen.pin_menu()` volané před vznikem GraphWindow |
| `examples/multiscreen.py` | **multi-screen Workbench**: dva `Screen`/`GraphWindow` s tab přepínačem a drag-reveal, explicitní `Screen.destroy()` přes REST |
| [`examples/wireshark/`](../examples/wireshark/README.md) | **síťové toky**: přehrání pcap, živý odposlech a cesta paketu (traceroute) |

**Veřejné API vs. vnitřek.** Pro vývojáře je to, co vyleze z `import viewbase as vb`:

| jméno | k čemu |
|---|---|
| `vb.Project` | služba: port, uživatel, TLS, relace; `serve()` / `stop()` |
| `vb.Screen` | plocha (screen) s titulkem, tématem a menu |
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

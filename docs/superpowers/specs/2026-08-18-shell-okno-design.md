# Shell okno (`ShellWindow`) — Design

> Čtvrtý typ obsahového okna: **skutečný terminál** – v okně běží opravdový
> shell (bash/zsh, později PowerShell) přes PTY, takže fungují celoobrazovkové
> programy (vim, htop, mc), barvy, kurzor i Ctrl-C. Na rozdíl od dialogového
> `TerminalWindow` (aplikační konzole, řádky textu) je tohle emulace VT100
> nad procesem operačního systému.

## Rozhodnutí (potvrzená s uživatelem)

- **Varianta A**: PTY na serveru + **xterm.js** v prohlížeči. Vlastní ANSI
  parser nepíšeme (byl by to špatně napsaný xterm.js), řádkový režim
  (`subprocess` + řádky) nestačí – požadavek jsou i „curses" programy.
- **Žádný `login` proces.** PTY dítě může běžet jen pod uživatelem serveru
  (bez rootu), takže `login` na Linuxu bez rootu selže, na macOS jen znovu
  přihlásí téhož uživatele a na Windows neexistuje. Místo systémového loginu:
  1. shell běží **jako uživatel serveru** (`$SHELL`, fallback `/bin/sh`),
  2. okno startuje **ZAMČENÉ** – PTY se spustí až po zadání **odemykacího
     kódu**, který server vypíše do vlastní konzole (Jupyter model: důkaz, že
     má člověk přístup ke stroji, kde viewbase běží),
  3. `shell_*` eventy **nepřijme REST `/api/event`** (dnes bere cokoli bez
     autentizace – s shellem by to bylo RCE jedním curlem),
  4. kdo chce skutečné přepnutí uživatele, dá si ho jako příkaz:
     `ShellWindow(command=["su", "-", "jina"])`, `["login"]`, `["ssh",
     "localhost"]`, `["docker", "exec", "-it", …]` – knihovna do toho nemluví.
- **Samostatný typ okna** vedle dialogového terminálu; ten zůstává beze změny
  (jednodušší a bezpečný pro aplikační konzole).
- **xterm.js lazy-loaded** (dynamický import až při otevření shell okna), aby
  kdo shell nepoužívá, nezaplatil ~80 kB gzip navíc.

## Python API

```python
sh = vb.ShellWindow("sh", title="Shell", cols=100, rows=30)   # command=None → $SHELL
graph.open_shell(sh)          # okno se otevře ZAMČENÉ, kód se vypíše do konzole
# volitelně: vlastní příkaz místo shellu
vb.ShellWindow("logs", command=["journalctl", "-f"], unlock=None)   # bez zámku (jen pro loopback)
```

- `ShellWindow(window_id, *, title="", command=None, cwd=None, env=None,
  cols=80, rows=24, width=720, height=420, closable=True, unlock="code")`
  – `spec()` nese `kind:"shell"`, rozměry a `locked` (bez kódu už odemčeno).
- `GraphWindow.open_shell(window)` – uloží do stavu (init replay), zařadí
  `open_window`; vytiskne kód do stdout serveru (`viewbase: shell 'sh' –
  odemykací kód: 7f3c2a`). PTY se nespouští.
- Události od klienta (JEN přes WS):
  - `shell_unlock {window_id, code}` → ověří kód, spustí PTY, odpoví
    `shell_state {window_id, state:"running"}`,
  - `shell_input {window_id, data}` → zápis do PTY (klávesy, ne řádky),
  - `shell_resize {window_id, cols, rows}` → `TIOCSWINSZ` (SIGWINCH).
- Akce serveru: `shell_data {window_id, data}` (chunk výstupu, UTF-8 string),
  `shell_state {window_id, state, code?}` (`locked`/`running`/`exited`).
- **Scrollback pro reconnect**: server drží posledních `MAX_SCROLLBACK`
  (256 kB) výstupu; init replay je pošle, aby divák po F5 viděl historii
  (ořez zepředu jako u `HtmlWindow.MAX_HTML`).

## PTY vrstva (`viewbase/pty_shell.py`)

Čistě systémová část, bez znalosti protokolu – testovatelná zvlášť:

- `PtyShell(command, *, cwd=None, env=None, cols=80, rows=24, on_data, on_exit)`
  – `start()`, `write(text)`, `resize(cols, rows)`, `terminate()`, `alive`.
- POSIX: `pty.openpty()` + `subprocess.Popen(..., start_new_session=True,
  preexec_fn=TIOCSCTTY)` (dup2 na 0/1/2 proběhne před `preexec_fn`, takže fd 0
  už je slave a jsme v nové session), slave se v rodiči zavře.
- **Čtecí vlákno** (ne asyncio): `os.read(master, 65536)` → inkrementální
  UTF-8 dekodér (`errors="replace"`), aby se znak rozseknutý mezi chunky
  neztratil → `on_data(text)`. Vlákno je daemon, končí na EOF/EIO.
- Ukončení: `SIGHUP` celé procesní skupině, po 2 s `SIGKILL`; `on_exit(code)`.
- Windows: `winpty.PtyProcess` (pywinpty) ve stejném rozhraní – **není
  součástí prvního kroku**, na Windows `PtyShell` vyhodí `NotImplementedError`
  se srozumitelnou hláškou.

## Frontend (`plugins/shell.js`)

- `ShellWindow extends BaseWindow`, tělo = kontejner pro xterm.js.
- **Zamčený stav**: v těle formulář „Zadej kód z konzole serveru" (prvek
  jako u HTML okna), Enter → event `shell_unlock`. Po `shell_state:running`
  se teprve dynamicky importuje xterm.js a připojí terminál.
- Běh: `term.onData(d => sendEvent('shell_input', {data: d}))`,
  akce `shell_data` → `term.write(data)`; `FitAddon` po resize okna →
  `shell_resize` (a `term.resize`).
- **Téma**: paleta xtermu se skládá z CSS proměnných okna (`--vb-window-body-bg`,
  `--vb-window-body-fg`, `--vb-window-key` jako kurzor) + 16 ANSI barev z
  `theme.palette`; při změně tématu se `term.options.theme` přepíše.
- **Scrollbar**: xterm kreslí vlastní; vypneme (`scrollback` má, ale viewport
  scrollbar schováme) a náš WB rám navážeme na `term.onScroll`/`scrollLines`,
  aby okno nemělo dva scrollbary a drželo vzhled workbenche.
- Options okna: `getOptionsItems()` → „Kurzor bliká", „Vypnout scrollback"?
  **Mimo první krok** (null jako dnes u HTML okna).

## Bezpečnost (shrnutí)

| Riziko | Opatření |
|---|---|
| kdokoli na síti dostane shell | okno zamčené, kód jen v konzoli serveru; `serve(host=…)` mimo loopback vyžaduje `allow_remote_shell=True` |
| REST vstřik kláves | `/api/event` odmítne `shell_*` eventy |
| zapomenutý běžící proces | PTY se zabíjí při zavření okna, `close()` grafu i konci serveru |
| únik historie | scrollback v paměti procesu, strop 256 kB, nikdy na disk |

## Otevření z GUI: System → Shell CLI (doplněno)

Na liště screenu je vedle `Options` vestavěná skupina **`System`** (příkazy
workbenche samotného, ne aplikace) s položkou **`Shell CLI`**: klik pošle
event `shell_new`, server založí `ShellWindow` s id `cli-<n>` a otevře ho.
Volba je **dostupná vždy** (uživatelské rozhodnutí) – nezávisle na tom, jestli
aplikace nějaké shell okno definovala. Bezpečnost se nemění: okno vzniká
ZAMČENÉ a odemykací kód jde do konzole serveru; `shell_new` je `shell_*`, takže
ho REST `/api/event` odmítá. Aplikace volbu schová `GraphWindow(shell_cli=False)`
(propíše se do `config.shell_cli`, frontend skupinu nevykreslí).

## Mimo rozsah prvního kroku

Windows/ConPTY, víc vlastníků vstupu (dnes: kdo odemkne, ten píše; ostatní
vidí), přenos souborů, `Options` shell okna, bitmapový font, záznam session.

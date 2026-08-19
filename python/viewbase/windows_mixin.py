"""Okna na screenu: otevírání, obsah, zámky a jejich události.

Odděleno z `graph_window.py` (přerostl 1 270 řádků a držel tři nesouvisející
věci: model grafu, okna a událostní infrastrukturu). `GraphWindow` zůstává
jediným veřejným vstupem – tenhle mixin jen nese metody, které se týkají
OKEN, ne grafu.

Co mixin očekává od hostitelské třídy (kontrakt, ne magie):

- `self._lock` – zámek stavu; metody, které zapisují, ho drží,
- `self._actions` – fronta akcí ke klientům (`drain_actions`),
- `self._reg` – registr oken (`window_registry.WindowRegistry`) a mapy
  `self._window_live`, `self._window_callbacks`, `self._terminal_callbacks`,
  `self._html_callbacks`, `self._detail_spec`, `self._shell_origin`,
- `self._register(event, handler)` – zapojení handleru události.
"""
from __future__ import annotations

from typing import Any

from . import sessions
from .controls import (ControlWindow, HtmlWindow, ShellWindow, TerminalWindow,
                       validate_values)

from .keystrokes import quoted
from .logger import logger


class WindowsMixin:
    #: Kolik shell oken smí naráz existovat (System → Shell CLI je otevřená
    #: pro každého připojeného; bez stropu jde vyrobit libovolně mnoho).
    MAX_SHELL_WINDOWS = 8

    def detail_window(self, rows: list[tuple[str, str]] | None = None,
                      width_chars: int = 42, open_on_click: bool = True) -> None:
        """Nakonfiguruj detailní okno (Amiga Workbench). Uloží se do config a
        odejde klientovi v init. `rows` je seznam dvojic (popisek, meta_klíč),
        nebo None = okno zobrazí všechna meta. `width_chars` je šířka těla
        v monospace znacích. `open_on_click` zapíná otevření okna při kliknutí."""
        if not isinstance(width_chars, int) or isinstance(width_chars, bool) \
                or width_chars <= 0:
            raise ValueError("width_chars musí být kladné celé číslo")
        if not isinstance(open_on_click, bool):
            raise ValueError("open_on_click musí být bool")
        normalized: list[list[str]] | None
        if rows is None:
            normalized = None
        else:
            if not isinstance(rows, (list, tuple)):
                raise ValueError("rows musí být None nebo seznam dvojic (str, str)")
            normalized = []
            for pair in rows:
                if not isinstance(pair, (list, tuple)) or len(pair) != 2 \
                        or not all(isinstance(x, str) for x in pair):
                    raise ValueError(
                        "rows musí být None nebo seznam dvojic (str, str)")
                normalized.append([pair[0], pair[1]])
        with self._lock:
            self.config["detail_window"] = {
                "rows": normalized,
                "width_chars": width_chars,
                "open_on_click": open_on_click,
            }

    def open_window(self, window: ControlWindow, *, on_submit=None,
                    live: bool = False) -> str:
        """Otevři/nahraď parametrické okno: ulož do stavu (pro init replay) a
        zařaď akci open_window. on_submit dostane event s validovanými values.
        `live=True` posílá hodnoty při každé změně (bez tlačítka Použít).
        Pozor: při nahrazení okna stejného window_id bez on_submit se předchozí
        callback zruší – chceš-li ho zachovat, předej on_submit znovu."""
        with self._lock:
            self._reg.add(window)
            self._window_live[window.window_id] = bool(live)
            if on_submit is not None:
                self._window_callbacks[window.window_id] = on_submit
            else:
                self._window_callbacks.pop(window.window_id, None)
            self._emit_open(window, live=bool(live))
        if window.locked:
            window.announce_lock()
        return window.window_id

    def close_window(self, window_id: str) -> None:
        """Zavři okno KTERÉHOKOLI typu: odeber ze stavu a zařaď `close_window`.

        Se čtyřmi mapami tahle metoda uměla control, HTML a shell, ale na
        terminálu spadla na `ValueError`, přestože i terminálové okno má
        zavírací gadget – rozdíl, který nikdo nezamýšlel, jen ho nikdo
        nevyhrabal ze čtyř větví. S jedním registrem důvod pro něj mizí.

        Granty relací k oknu se ruší taky: kdyby zůstaly, nové okno se
        stejným `window_id` by se odemklo samo (viz sessions.py)."""
        with self._lock:
            window = self._reg.remove(window_id)
            if window is None:
                raise ValueError(f"Okno '{window_id}' neexistuje")
            for mapa in (self._window_callbacks, self._window_live,
                         self._terminal_callbacks, self._html_callbacks):
                mapa.pop(window_id, None)
            sessions.store.revoke_window(window_id)
            self._actions.append(
                {"action": "close_window", "window_id": window_id})
        if isinstance(window, ShellWindow):
            self._keys.flush(window_id)      # nedopsaná dávka kláves se nesmí ztratit
            self._shell_stop(window)         # proces nepřežije zavření okna

    def open_terminal(self, window: TerminalWindow, *, on_input=None) -> str:
        """Otevři/nahraď konzolové okno: ulož do stavu (init replay) a zařaď akci
        open_window (kind:"terminal"). `on_input` dostane event s .line (řádek,
        co uživatel napsal). Do okna se píše přes `terminal_write`."""
        with self._lock:
            self._reg.add(window)
            if on_input is not None:
                self._terminal_callbacks[window.window_id] = on_input
            else:
                self._terminal_callbacks.pop(window.window_id, None)
            self._emit_open(window)
        if window.locked:
            window.announce_lock()
        return window.window_id

    def terminal_write(self, window_id: str, text: str) -> None:
        """Připiš řádek do konzolového okna (delta terminal_append klientům)."""
        with self._lock:
            if self._reg.get(window_id, TerminalWindow) is None:
                raise ValueError(f"Terminál '{window_id}' neexistuje")
            self._actions.append({"action": "terminal_append",
                                  "window_id": window_id, "text": str(text)})

    def _on_terminal_input(self, event) -> None:
        """Interní handler eventu terminal_input: zavolej on_input okna s řádkem."""
        window_id = getattr(event, "window_id", None)
        line = getattr(event, "line", None)
        if not isinstance(line, str):
            return
        with self._lock:
            callback = self._terminal_callbacks.get(window_id)
        if callback is not None:
            callback(event)

    def open_html(self, window: HtmlWindow, *, on_event=None) -> str:
        """Otevři/nahraď HTML okno: ulož do stavu (init replay) a zařaď akci
        open_window (kind:"html"). `on_event` dostane event s `.event`
        (hodnota `data-vb-event` kliknutého prvku / odeslaného formuláře),
        `.value` (`data-vb-value`, nebo None), `.values` (u submitu
        <form data-vb-event="…"> dict hodnot polí podle `name` – JSON objekt,
        který sestavil prohlížeč; u kliku {}) a `.window_id`. Do okna se píše přes
        `html_set` / `html_append`. Nahrazení okna stejného window_id bez
        `on_event` předchozí callback zruší (stejně jako open_terminal)."""
        with self._lock:
            self._reg.add(window)
            window._owner = self             # prvky odteď posílají html_set/html_patch
            if on_event is not None:
                self._html_callbacks[window.window_id] = on_event
            else:
                self._html_callbacks.pop(window.window_id, None)
            self._emit_open(window)
        if window.locked:
            window.announce_lock()
        return window.window_id

    def _drop_if_locked(self, window: Any) -> bool:
        """Má obsah zabezpečeného okna vůbec komu jít?

        Zahazuje se jen tehdy, když okno NEMÁ ODEMČENÉ ŽÁDNÁ RELACE – jinak
        akce vznikne a doručí se právě těm relacím, které grant mají (značku
        `grant` doplní drain_actions, filtruje broadcast v server.py). Dřív
        se tady rozhodovalo podle globálního `window.locked`, takže po prvním
        odemčení tekl obsah všem."""
        if not getattr(window, "private", False):
            return False
        return not sessions.store.sids_with(window.window_id)

    def html_set(self, window_id: str, html: str) -> None:
        """Nahraď celý obsah HTML okna (akce html_set klientům; okno si
        obsah pamatuje pro replay po reconnectu, viz HtmlWindow.MAX_HTML)."""
        with self._lock:
            window = self._reg.get(window_id, HtmlWindow)
            if window is None:
                raise ValueError(f"HTML okno '{window_id}' neexistuje")
            window.set_html(html)
            self._actions.append({"action": "html_set",
                                  "window_id": window_id, "html": window.html})

    def html_append(self, window_id: str, html: str) -> None:
        """Připiš HTML fragment na konec okna (streamový výpis; klient drží
        konec jako terminál). Akce html_append klientům."""
        with self._lock:
            window = self._reg.get(window_id, HtmlWindow)
            if window is None:
                raise ValueError(f"HTML okno '{window_id}' neexistuje")
            window.append_html(html)
            self._actions.append({"action": "html_append",
                                  "window_id": window_id, "html": str(html)})

    def _emit_html(self, action: str, window_id: str, **fields: Any) -> None:
        """Akce k oknu (prvky HTML okna, výstup shellu, stavy zámku). Zamčenému
        oknu se obsah neposílá – dostane ho až po odemčení."""
        with self._lock:
            window = self._reg.get(window_id, (HtmlWindow, ShellWindow))
            if (window is not None and self._drop_if_locked(window)
                    and action != "window_state"):
                return
            self._actions.append({"action": action, "window_id": window_id, **fields})

    def _on_html_event(self, event) -> None:
        """Interní handler eventu html_event (klik na [data-vb-event] nebo
        submit <form data-vb-event> v HTML okně): doplň `.value` (None, když
        prvek data-vb-value nemá) a `.values` (dict hodnot polí okna podle
        `name`), předej oknu (prvky: aktualizace `.value`, handlery prvků a
        `okno.on_event`) a zavolej `on_event` z open_html."""
        window_id = getattr(event, "window_id", None)
        if not isinstance(getattr(event, "event", None), str):
            return
        if not hasattr(event, "value"):
            event.value = None
        if not isinstance(getattr(event, "values", None), dict):
            event.values = {}
        with self._lock:
            window = self._reg.get(window_id, HtmlWindow)
            callback = self._html_callbacks.get(window_id)
        if window is not None:
            window._dispatch(event)          # prvky: .value, on_click/on_change/on_submit
        if callback is not None:
            callback(event)

    def open_shell(self, window: ShellWindow) -> str:
        """Otevři shell okno: uloží do stavu (init replay), zařadí akci
        open_window. PTY se NESPOUŠTÍ – okno je zamčené a odemykací kód se
        vypíše do konzole serveru (`unlock=None` spustí shell rovnou)."""
        with self._lock:
            self._reg.add(window)
            window._owner = self
            self._emit_open(window)
        if window.locked:
            window.announce_lock()          # TOTP registrace / jednorázový kód
        else:
            self._shell_start(window)
        return window.window_id

    def _shell_start(self, window: ShellWindow) -> None:
        """Spusť PTY proces okna a nasměruj jeho výstup klientům."""
        from .pty_shell import PtyShell

        if window.pty is not None:
            return
        wid = window.window_id

        def on_data(text: str) -> None:
            window.append_scrollback(text)
            self._emit_html("shell_data", wid, data=text)   # sdílená cesta akcí

        def on_command(prikaz: str) -> None:
            self._log_shell_command(wid, prikaz)

        def on_exit(code: int | None) -> None:
            self._emit_html("shell_state", wid, state="exited", code=code)

        try:
            window.pty = PtyShell(window.command, cwd=window.cwd, env=window.env,
                                  cols=window.cols, rows=window.rows,
                                  on_data=on_data, on_exit=on_exit,
                                  on_command=(on_command
                                              if window.audit_commands else None))
            window.pty.start()
        except Exception as chyba:                       # noqa: BLE001
            window.pty = None
            self._emit_html("shell_state", wid, state="failed", error=str(chyba))
            logger.exception(f"shell window '{wid}' failed to start",
                             component="windows")
            return
        self._emit_html("shell_state", wid, state="running")

    def _shell_stop(self, window: ShellWindow) -> None:
        """Zabij proces okna (zavření okna, konec programu)."""
        pty = window.pty
        if pty is not None:
            pty.terminate()

    def _on_shell_new(self, event) -> None:
        """Položka „System → Shell CLI" na liště screenu: otevři NOVÉ shell
        okno. Okno je (jako každé jiné) ZAMČENÉ – odemykací kód se vypíše do
        konzole serveru, takže i tahle cesta vyžaduje přístup ke stroji.
        Aplikace může volbu vypnout: `GraphWindow(shell_cli=False)`.

        AUTORIZACE: kód se ověřuje až u okna, ne tady – nové okno je zamčené,
        takže se z něj bez kódu nedá nic spustit. Kdokoli připojený ale může
        okna VYRÁBĚT, a to je samo o sobě zneužitelné (každé si drží PTY slot
        a jednorázový kód), proto strop a záznam do auditu."""
        if not self.config.get("shell_cli", True):
            return
        bezici = len(self._reg.of_kind(ShellWindow))
        if bezici >= self.MAX_SHELL_WINDOWS:
            self._log_auth("warning",
                           f"shell_new refused – {bezici} shell windows already "
                           f"open (limit {self.MAX_SHELL_WINDOWS})",
                           **self._origin(event))
            return
        with self._lock:
            self._shell_seq = getattr(self, "_shell_seq", 0) + 1
            wid = f"cli-{self._shell_seq}"
        self._log_auth("info", f"shell window '{wid}' requested",
                       **self._origin(event))
        self.open_shell(ShellWindow(wid, title=f"Shell CLI {self._shell_seq}",
                                    cols=100, rows=28, width=820, height=440))

    def _emit_open(self, window: Any, **extra: Any) -> None:
        """Zařaď `open_window` a u zabezpečeného okna ohlas zámek.

        Čtyři `open_*` metody (control, terminál, HTML, shell) tenhle blok
        měly každá zvlášť – při každé změně zámku se musel opravit čtyřikrát.
        Volá se UVNITŘ `self._lock`, `announce_lock` až po něm (tiskne a
        registruje TOTP, což pod zámkem být nemusí)."""
        self._actions.append({**window.public_spec(), "action": "open_window",
                              **extra})

    def has_private_window(self) -> bool:
        """Je na screenu okno se `private=True`? (Rozhoduje o povinném TLS
        při poslechu mimo loopback, viz tls.require_tls.)"""
        return any(getattr(w, "private", False)
                   for w in self._private_windows().values())

    def _private_windows(self) -> dict[str, Any]:
        """Všechna okna se zámkem (jeden mechanismus napříč typy)."""
        with self._lock:
            return self._reg.all()

    def _on_window_unlock(self, event) -> None:
        """Klient poslal kód k zamčenému oknu (JAKÉHOKOLI typu). Při shodě se
        pošle skutečné `open_window` i s obsahem a zavolá hook okna (shell
        spustí PTY). Nesprávný kód se odmítne – TOTP má rate limit a ochranu
        proti opakovanému použití (viewbase.mfa)."""
        window = self._private_windows().get(getattr(event, "window_id", None))
        sid = getattr(event, "sid", None)
        if window is None or not getattr(window, "private", False):
            return
        if sessions.store.has(sid, window.window_id):
            return                              # tahle relace už grant má
        if not window.unlocks_with(getattr(event, "code", None)):
            # AUDIT: co se stalo, ne čím se to zkoušelo – kód do logu nepatří
            self._log_auth("warning",
                           f"invalid code for window '{window.window_id}'",
                           **self._origin(event))
            self._emit_html("window_state", window.window_id, state="locked",
                            error="Invalid code")
            return
        # GRANT PRO TUHLE RELACI, ne globální přepnutí okna: obsah dostane
        # jen ten, kdo kód zadal, a jen do vypršení relace (sessions.py).
        sessions.store.grant(sid, window.window_id)
        window.state = "open"                # souhrn pro log/introspekci
        self._log_auth("info", f"window '{window.window_id}' unlocked – "
                               f"{self._auth_kind(window)}",
                       **self._origin(event))
        with self._lock:
            live = self._window_live.get(window.window_id)
            spec = {**window.public_spec(True), "action": "open_window",
                    "only_sid": sid}         # obsah JEN téhle relaci
            if live is not None:
                spec["live"] = bool(live)
            self._actions.append(spec)
        window.on_unlocked()

    def _on_window_lock(self, event) -> None:
        """Divák si v Options → „Lock Window" řekl o zamčení zpátky (opak
        `window_unlock`). Okno se klientům pošle znovu jen jako prázdný rám –
        obsah se přestane posílat a příště si okno zase řekne o kód.

        Zamknout jde JEN okno se `private=True`: u ostatních není čím odemykat
        a tichý zámek by je udělal nepřístupnými."""
        window = self._private_windows().get(getattr(event, "window_id", None))
        sid = getattr(event, "sid", None)
        if window is None or not getattr(window, "private", False):
            return
        if not sessions.store.has(sid, window.window_id):
            return                          # tahle relace ho stejně nemá
        # Zamyká se RELACE, ne okno pro všechny: kdo si okno odemkl vedle,
        # o obsah nepřijde. („Lock all windows" zamkne všem – jiná akce.)
        sessions.store.revoke(sid, window.window_id)
        if not sessions.store.sids_with(window.window_id):
            window.state = "locked"         # souhrn: nikdo už ho odemčené nemá
        with self._lock:
            self._actions.append({**window.lock_spec(), "action": "open_window",
                                  "only_sid": sid})
        window.on_locked()
        self._log_auth("info", f"window '{window.window_id}' locked by the user",
                       **self._origin(event))

    @staticmethod
    def _auth_kind(window: Any) -> str:
        """Čím se okno odemklo – do auditní stopy (bez tajemství)."""
        from . import mfa

        if mfa.available() and mfa.load_users().get(mfa.active_user()):
            return f"token of user '{mfa.active_user()}'"
        return "one-time code"

    def _grant_ok(self, event: Any, window: Any) -> bool:
        """Smí tahle relace do okna psát?

        VOLÁ SE Z `dispatch_event` podle toho, co událost deklarovala při
        registraci (`needs=Needs.GRANT`) – handlery si na to nesmí
        vzpomínat samy, protože přesně to se dřív nestalo u pěti z devíti.

        NALEZENO PŘI KONTROLE: `shell_input` grant vůbec neověřoval – stačilo
        se připojit a psát do shellu, který odemkl někdo jiný, a po vypršení
        relace to platilo dál. Odemčení musí platit u KAŽDÉ zprávy, ne jen
        při otevírání okna; nezabezpečených oken se to netýká.

        Odmítnutí jde do auditu i s důvodem – vypršelá relace vypadá jinak
        než pokus psát do cizího okna."""
        if not getattr(window, "private", False):
            return True
        sid = getattr(event, "sid", None)
        wid = window.window_id
        if sessions.store.has(sid, wid):
            return True
        duvod = ("expired or unknown session" if not sessions.store.known(sid)
                 else "session has no grant for this window")
        self._log_auth("warning", f"input to window '{wid}' refused – {duvod}",
                       **self._origin(event))
        return False

    @staticmethod
    def _origin(event: Any) -> dict[str, str | None]:
        """Kdo a odkud – jako SLOUPCE logu, ne jako text ve zprávě.

        IP doplňuje SERVER (`remote_ip`, viz server.peer_of), ne klient;
        z relace jde do logu jen prefix (celé sid je přihlašovací údaj)."""
        return {"sid": getattr(event, "sid", None),
                "ip": getattr(event, "remote_ip", None)}

    @staticmethod
    def _log_auth(level: str, message: str, **kdo: Any) -> None:
        """Auditní stopa zámku okna – komponenta `security`, takže jde do
        log okna i na stdout serveru VŽDYCKY, bez ohledu na `log_level`
        (viz logger.Logger.audit). Systémový text, NIKDY tajemství."""
        logger.audit(message, level=level, **kdo)

    def _on_shell_input(self, event) -> None:
        """Klávesy z prohlížeče do procesu (jen běžícího a odemčeného okna)."""
        window = self._reg.get(getattr(event, "window_id", None), ShellWindow)
        data = getattr(event, "data", None)
        if window is None or window.pty is None or not isinstance(data, str):
            return
        # Odkud klávesy přišly – k příkazu, který z nich vznikne (audit).
        # Skládá se až v PtyShell (po Enteru), proto se původ pamatuje tady.
        self._shell_origin[window.window_id] = self._origin(event)
        # Ladicí stopa: klávesy chodí po jednom znaku, takže se sbírají do
        # dávky (keystrokes.py) místo řádku na stisk.
        self._keys.add(window.window_id, data)
        window.pty.write(data)

    def _log_keystrokes(self, window_id: str, text: str, sekundy: float,
                        znaku: int) -> None:
        """Hotová dávka kláves do ladicího logu (`log_level="debug"`)."""
        # `data='…'` – bez ohraničení nepozná parser, kde sekvence končí
        logger.debug(f"shell '{window_id}' keys "
                     f"({sekundy:.0f} s, {znaku} znaků): data={quoted(text)}",
                     component="windows", **self._shell_origin.get(window_id, {}))

    def _log_shell_command(self, window_id: str, prikaz: str) -> None:
        """Auditní stopa příkazu v shell okně.

        DVĚ IDENTITY, které se nesmí plést (uživatelský požadavek):

        - `by '<uživatel viewbase>'` – kdo okno odemkl kódem z autentikátoru,
        - `os user '<jméno>'` – pod kým proces SKUTEČNĚ běží, tedy uživatel,
          pod kterým jede server. Odemčení ve workbenchi na tom nic nemění;
          kdo chce jiného, řekne si o něj příkazem (`su`, `sudo`) – a to je
          pak v téhle stopě vidět jako příkaz.

        Hesla se sem nedostanou: skládá se jen to, co terminál echuje
        (PtyShell.echoing)."""
        import getpass

        from . import mfa

        try:
            os_user = getpass.getuser()
        except Exception:                                    # noqa: BLE001
            os_user = "?"
        logger.audit(f"shell '{window_id}' command by '{mfa.active_user()}' "
                     f"(os user '{os_user}'): command={quoted(prikaz)}",
                     **self._shell_origin.get(window_id, {}))

    def _on_shell_resize(self, event) -> None:
        """Nová velikost terminálu z prohlížeče → SIGWINCH procesu."""
        window = self._reg.get(getattr(event, "window_id", None), ShellWindow)
        if window is None:
            return
        try:
            cols = int(getattr(event, "cols", 0))
            rows = int(getattr(event, "rows", 0))
        except (TypeError, ValueError):
            return
        if cols <= 0 or rows <= 0:
            return
        window.cols, window.rows = cols, rows
        if window.pty is not None:
            window.pty.resize(cols, rows)

    def _on_window_submit(self, event) -> None:
        """Interní handler eventu window_submit: validuj values proti specu
        okna, ulož je (pro init replay) a zavolej callback okna."""
        window_id = getattr(event, "window_id", None)
        raw = getattr(event, "values", None)
        if not isinstance(raw, dict):
            return
        with self._lock:
            window = self._reg.get(window_id, ControlWindow)
            if window is None:
                return
            clean = validate_values(window.spec()["fields"], raw)
            window.apply(clean)
            callback = self._window_callbacks.get(window_id)
        if callback is not None:
            event.values = clean
            callback(event)

    def _window_specs(self, sid: str | None) -> list[dict[str, Any]]:
        """Specifikace VŠECH oken pro init snapshot jedné relace.

        Čtyři kolekce oken (control, terminál, HTML, shell) se tu dřív
        procházely čtyřmi skoro totožnými comprehension – jediný rozdíl je
        `live` u control oken. Volá se pod `self._lock` (viz snapshot)."""
        out = []
        for wid, w in self._reg:
            spec = w.public_spec(self._unlocked(sid, wid))
            if isinstance(w, ControlWindow):     # `live` má smysl jen u formuláře
                spec["live"] = self._window_live.get(wid, False)
            out.append(spec)
        return out

    def _unlocked(self, sid: str | None, window_id: str) -> bool:
        """Má tahle relace grant k tomuhle oknu? (Jediná otázka, podle které
        se rozhoduje, co uvidí – viz sessions.py.)"""
        return sessions.store.has(sid, window_id)

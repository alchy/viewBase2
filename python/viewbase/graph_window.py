"""GraphWindow – zdroj pravdy grafu a veřejné API knihovny."""
from __future__ import annotations

import logging
import re
import threading
import types
import uuid
from collections import deque
from concurrent.futures import ThreadPoolExecutor
from contextlib import contextmanager
from typing import TYPE_CHECKING, Any, Callable, Iterator

from .controls import ControlWindow, HtmlWindow, ShellWindow, TerminalWindow, validate_values
from . import sessions
from .log import bus as log_bus
from .menu import ScreenMenu

if TYPE_CHECKING:
    from .screen import Screen

logger = logging.getLogger("viewbase")

_LABEL_KEY = re.compile(r"\{([^{}]+)\}")

BUILTIN_THEMES = ("modern", "cyber", "workbench-gray", "workbench-amiga")
QUALITIES = ("low", "high", "auto")

# Sentinel „argument nezadán" – odlišuje `update_node(a)` (typ/label nech být)
# od `update_node(a, type=None)` (typ zruš, uzel spadne na styl tématu).
_KEEP: Any = object()


def _validated_theme(theme: Any) -> Any:
    """Název vestavěného tématu, nebo dict (klient ho merguje přes modern)."""
    if isinstance(theme, str):
        if theme not in BUILTIN_THEMES:
            raise ValueError(
                f"Neznámé téma '{theme}' – vestavěná: {', '.join(BUILTIN_THEMES)};"
                " vlastní téma předej jako dict")
        return theme
    if isinstance(theme, dict):
        return theme
    raise ValueError("theme musí být název vestavěného tématu nebo dict")


def _edge_key(source: str, target: str) -> tuple[str, str]:
    """Neorientovaná hrana má kanonický klíč: lexikograficky seřazenou dvojici."""
    return (source, target) if source <= target else (target, source)


class GraphWindow:
    """Grafové OKNO na screenu – speciální instance okna (window-first
    model: screen je plocha, všechno na ní jsou okna; graf je jen jeden
    z typů, vedle log/control/terminal oken). Zároveň thread-safe model
    grafu: uzly/hrany se přidávají PŘES INSTANCI OKNA a mutace se
    hromadí jako delty pro server."""

    def __init__(self, *, title: str = "viewbase", dimensions: int = 3,
                 theme: Any = "modern", highlight_neighbors: int = 1,
                 quality: str = "auto", screen: "Screen | None" = None,
                 shell_cli: bool = True):
        if dimensions not in (2, 3):
            raise ValueError("dimensions musí být 2 nebo 3")
        if quality not in QUALITIES:
            raise ValueError(f"quality musí být jedno z {QUALITIES}")
        if screen is not None and not hasattr(screen, "id"):
            raise ValueError("screen musí být instance vb.Screen")
        self.screen = screen
        self.screen_id: int | None = screen.id if screen is not None else None
        self.config = {
            "title": title,
            "dimensions": dimensions,
            "theme": _validated_theme(theme),
            "highlight_neighbors": highlight_neighbors,
            "quality": quality,
            "detail_window": {
                "rows": None, "width_chars": 42, "open_on_click": True},
            "edge_style": {"style": "line", "elasticity": 0.0},
            # Vestavěná nabídka „System → Shell CLI" na liště screenu: divák
            # si otevře shell okno sám (pořád zamčené odemykacím kódem z
            # konzole serveru). `shell_cli=False` volbu schová úplně.
            "shell_cli": bool(shell_cli),
        }
        self._lock = threading.RLock()
        self._nodes: dict[str, dict[str, Any]] = {}
        self._edges: dict[tuple[str, str], dict[str, Any]] = {}
        self._node_types: dict[str, dict[str, Any]] = {}
        self._flow_types: dict[str, dict[str, Any]] = {}
        self._flows: dict[str, dict[str, Any]] = {}   # flow_id -> trvalý tok (do init)
        self._windows: dict[str, ControlWindow] = {}
        self._window_callbacks: dict[str, Any] = {}
        self._window_live: dict[str, bool] = {}   # window_id -> live režim
        self._terminals: dict[str, TerminalWindow] = {}
        self._terminal_callbacks: dict[str, Any] = {}   # window_id -> on_input
        self._html_windows: dict[str, HtmlWindow] = {}
        self._html_callbacks: dict[str, Any] = {}       # window_id -> on_event
        self._shell_windows: dict[str, ShellWindow] = {}
        self._menu: ScreenMenu | None = None   # připnuté ScreenMenu (§8 designu)
        self._seq = 0
        self._batch_depth = 0
        self._pending = self._empty_pending()
        self._handlers: dict[str, list[Callable[[Any], None]]] = {}
        self._executor = ThreadPoolExecutor(
            max_workers=4, thread_name_prefix="viewbase-handler")
        self._actions: list[dict[str, Any]] = []
        self._closed = False
        self._node_label_template: str | None = None
        self._tasks: list[dict[str, Any]] = []      # every() úlohy
        self._tasks_stop: threading.Event | None = None   # None = neběží
        self._register("window_submit", self._on_window_submit)
        self._register("terminal_input", self._on_terminal_input)
        self._register("html_event", self._on_html_event)
        self._register("shell_new", self._on_shell_new)
        self._register("window_unlock", self._on_window_unlock)
        self._register("window_lock", self._on_window_lock)
        self._register("shell_input", self._on_shell_input)
        self._register("shell_resize", self._on_shell_resize)
        self._register("menu_select", self._on_menu_select)
        if screen is not None:
            self._adopt_screen(screen)

    def _adopt_screen(self, screen: "Screen") -> None:
        """Explicitně převezme stav nahromaděný na Screenu PŘED tím, než k
        němu byl přiřazený GraphWindow – vytvoření Screenu a přiřazení grafu
        jsou nezávislé atomární operace (jen pořadí je volné, vazba je pak
        trvalá 1:1, viz screen.py). Duck-typed vůči Screenu (žádný
        cyklický import, stejně jako type hint `screen` výše).

        Přenese `_menu` PŘÍMO (ne přes `self.pin_menu` – to by zdvojilo
        akci, protože `screen.drain_actions()` níž vrací tutéž `open_menu`
        akci, kterou `Screen.pin_menu` zařadil, když ještě neměl GraphWindow)."""
        screen._graph = self
        with self._lock:
            if screen._menu is not None:
                self._menu = screen._menu
            # Systémové log okno umístěné na screen PŘED grafem
            # (vb.LogWindow(screen=...) – viz log.py): flag jde do configu,
            # tedy do init snapshotu – přežije reconnect, na rozdíl od
            # jednorázové akce.
            if screen._log_window:
                self.config["log_window"] = True
            for action in screen.drain_actions():
                self._actions.append(action)

    @staticmethod
    def _empty_pending() -> dict[str, dict]:
        return {
            "add_nodes": {},      # id -> payload
            "update_nodes": {},   # id -> payload
            "remove_nodes": {},   # id -> True
            "add_edges": {},      # key -> payload
            "remove_edges": {},   # key -> True
        }

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

    # ---- typy ----------------------------------------------------------

    def node_label(self, template: str | None) -> None:
        """Nastav celocanvasovou šablonu popisku uzlu, sestavenou z meta klíčů –
        např. ``"{fqdn} [{ip}]"``. Použije se u uzlů bez explicitního ``label=``
        v ``add_node``; přepočítá se při každé změně metadat (``update_node``).
        Pořadí priorit popisku: per-node ``label`` > ``node_label`` > id uzlu.
        ``None`` vrátí výchozí chování (popisek = id)."""
        if template is not None and not isinstance(template, str):
            raise ValueError("node_label musí být řetězec nebo None")
        with self._lock:
            self._node_label_template = template

    def define_type(self, name: str, **style: Any) -> None:
        """Definuj (i předefinuj) typ uzlu – ``color``/``shape``/``size``.

        Volání za běhu propaguje styl klientům akcí ``define_type``: všechny
        uzly toho typu se hned přebarví/přetvarují (hromadná změna barvy).
        Styl se **nahrazuje celý**, nesloučí se s předchozím. Nově připojený
        klient dostane typy v ``init``."""
        with self._lock:
            self._node_types[name] = dict(style)
            self._actions.append({"action": "define_type", "name": name,
                                  "style": dict(style)})

    def define_flow_type(self, name: str, *, color: str | None = None,
                         size: float = 1.0, speed: float = 1.0) -> None:
        """Definuj typ toku (jako typ uzlu). Bez `color` dostane tok barvu
        z kategorické palety aktivního tématu (řeší klient podle indexu typu)."""
        with self._lock:
            self._flow_types[name] = {
                "color": color, "size": float(size), "speed": float(speed)}

    def _flow_type_index(self, name: str | None) -> int | None:
        """Index typu v pořadí registrace (pro výběr barvy z palety na klientu)."""
        if name is None:
            return None
        return list(self._flow_types).index(name)

    def _resolve_flow_path(self, source: str | None, target: str | None,
                           path: list[str] | None) -> list[str]:
        """Sestav cestu toku. `path=[...]` = přesná cesta (každá sousední dvojice
        musí být existující hrana). Jen `(source, target)` = knihovna **sama najde
        nejkratší cestu** po hranách (BFS) — stačí zadat konce A→C, mezikroky ne."""
        if path is not None:
            resolved = list(path)
            if len(resolved) < 2:
                raise ValueError("flow path musi mit aspon 2 uzly")
            for node_id in resolved:
                if node_id not in self._nodes:
                    raise ValueError(f"flow: uzel '{node_id}' neexistuje")
            for a, b in zip(resolved, resolved[1:]):
                if _edge_key(a, b) not in self._edges:
                    raise ValueError(
                        f"flow: hrana {a}-{b} neexistuje - tok jede jen po hranach")
            return resolved
        if source is not None and target is not None:
            return self._shortest_path(source, target)
        raise ValueError("flow vyzaduje bud (source, target), nebo path=[...]")

    def _shortest_path(self, source: str, target: str) -> list[str]:
        """BFS nejkratší cesta po hranách source→target (zadávají se jen konce).

        Hrany jsou neorientované. Vyhodí ValueError, když uzel neexistuje nebo
        cesta nevede."""
        for node_id in (source, target):
            if node_id not in self._nodes:
                raise ValueError(f"flow: uzel '{node_id}' neexistuje")
        if source == target:
            raise ValueError("flow: source a target musi byt ruzne")
        adjacency: dict[str, list[str]] = {}
        for a, b in self._edges:
            adjacency.setdefault(a, []).append(b)
            adjacency.setdefault(b, []).append(a)
        prev: dict[str, str | None] = {source: None}
        queue = deque([source])
        while queue:
            node = queue.popleft()
            if node == target:
                break
            for neighbor in adjacency.get(node, ()):
                if neighbor not in prev:
                    prev[neighbor] = node
                    queue.append(neighbor)
        if target not in prev:
            raise ValueError(
                f"flow: mezi '{source}' a '{target}' nevede cesta")
        route: list[str] = []
        node: str | None = target
        while node is not None:
            route.append(node)
            node = prev[node]
        route.reverse()
        return route

    def flow(self, source: str | None = None, target: str | None = None, *,
             path: list[str] | None = None, type: str | None = None,
             count: int | None = 1, interval: float = 0.2, speed: float = 1.0,
             color: str | None = None, size: float | None = None) -> str | None:
        """Vysli tok castic po hrane/ceste (source -> target nebo path=[...]).

        `count=N` je jednorazovy (fire-and-forget; server tok neudrzi, vraci
        None). `count=None` je trvaly: vraci `flow_id`, tok je v `init` a prezije
        reconnect; zastaves ho `stop_flow(flow_id)`. `interval` je rozestup castic
        v sekundach, `speed` nasobek vychozi rychlosti tematu."""
        with self._lock:
            if type is not None and type not in self._flow_types:
                raise ValueError(
                    f"Neznam typ toku '{type}' - nejdriv define_flow_type")
            resolved = self._resolve_flow_path(source, target, path)
            payload = {
                "action": "flow",
                "path": resolved,
                "flow_type": type,
                "type_index": self._flow_type_index(type),
                "count": count,
                "interval": float(interval),
                "speed": float(speed),
                "color": color,
                "size": size,
            }
            if count is None:
                flow_id = uuid.uuid4().hex[:8]
                payload["flow_id"] = flow_id
                self._flows[flow_id] = {k: v for k, v in payload.items()
                                        if k != "action"}
                self._actions.append(payload)
                return flow_id
            self._actions.append(payload)
            return None

    def stop_flow(self, flow_id: str) -> None:
        """Zastav trvaly tok: odeber ho ze stavu a zarad akci stop_flow."""
        with self._lock:
            if flow_id not in self._flows:
                raise ValueError(f"Trvaly tok '{flow_id}' neexistuje")
            del self._flows[flow_id]
            self._actions.append({"action": "stop_flow", "flow_id": flow_id})

    # ---- control okna -------------------------------------------------

    def open_window(self, window: ControlWindow, *, on_submit=None,
                    live: bool = False) -> str:
        """Otevři/nahraď parametrické okno: ulož do stavu (pro init replay) a
        zařaď akci open_window. on_submit dostane event s validovanými values.
        `live=True` posílá hodnoty při každé změně (bez tlačítka Použít).
        Pozor: při nahrazení okna stejného window_id bez on_submit se předchozí
        callback zruší – chceš-li ho zachovat, předej on_submit znovu."""
        with self._lock:
            self._windows[window.window_id] = window
            self._window_live[window.window_id] = bool(live)
            if on_submit is not None:
                self._window_callbacks[window.window_id] = on_submit
            else:
                self._window_callbacks.pop(window.window_id, None)
            self._actions.append(
                {**window.public_spec(), "action": "open_window", "live": bool(live)})
        if window.locked:
            window.announce_lock()
        return window.window_id

    def close_window(self, window_id: str) -> None:
        """Zavři okno (control i html): odeber ze stavu a zařaď akci close_window."""
        with self._lock:
            removed = self._windows.pop(window_id, None) is not None
            if self._html_windows.pop(window_id, None) is not None:
                removed = True
                self._html_callbacks.pop(window_id, None)
            shell = self._shell_windows.pop(window_id, None)
            if shell is not None:
                removed = True
            if not removed:
                raise ValueError(f"Okno '{window_id}' neexistuje")
            self._window_callbacks.pop(window_id, None)
            self._window_live.pop(window_id, None)
            self._actions.append(
                {"action": "close_window", "window_id": window_id})
        if shell is not None:
            self._shell_stop(shell)          # proces nepřežije zavření okna

    def open_terminal(self, window: TerminalWindow, *, on_input=None) -> str:
        """Otevři/nahraď konzolové okno: ulož do stavu (init replay) a zařaď akci
        open_window (kind:"terminal"). `on_input` dostane event s .line (řádek,
        co uživatel napsal). Do okna se píše přes `terminal_write`."""
        with self._lock:
            self._terminals[window.window_id] = window
            if on_input is not None:
                self._terminal_callbacks[window.window_id] = on_input
            else:
                self._terminal_callbacks.pop(window.window_id, None)
            self._actions.append({**window.public_spec(), "action": "open_window"})
        if window.locked:
            window.announce_lock()
        return window.window_id

    def terminal_write(self, window_id: str, text: str) -> None:
        """Připiš řádek do konzolového okna (delta terminal_append klientům)."""
        with self._lock:
            if window_id not in self._terminals:
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
            self._html_windows[window.window_id] = window
            window._owner = self             # prvky odteď posílají html_set/html_patch
            if on_event is not None:
                self._html_callbacks[window.window_id] = on_event
            else:
                self._html_callbacks.pop(window.window_id, None)
            self._actions.append({**window.public_spec(), "action": "open_window"})
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
        if not getattr(window, "secured", False):
            return False
        return not sessions.store.sids_with(window.window_id)

    def html_set(self, window_id: str, html: str) -> None:
        """Nahraď celý obsah HTML okna (akce html_set klientům; okno si
        obsah pamatuje pro replay po reconnectu, viz HtmlWindow.MAX_HTML)."""
        with self._lock:
            window = self._html_windows.get(window_id)
            if window is None:
                raise ValueError(f"HTML okno '{window_id}' neexistuje")
            window.set_html(html)
            self._actions.append({"action": "html_set",
                                  "window_id": window_id, "html": window.html})

    def html_append(self, window_id: str, html: str) -> None:
        """Připiš HTML fragment na konec okna (streamový výpis; klient drží
        konec jako terminál). Akce html_append klientům."""
        with self._lock:
            window = self._html_windows.get(window_id)
            if window is None:
                raise ValueError(f"HTML okno '{window_id}' neexistuje")
            window.append_html(html)
            self._actions.append({"action": "html_append",
                                  "window_id": window_id, "html": str(html)})

    def _emit_html(self, action: str, window_id: str, **fields: Any) -> None:
        """Akce k oknu (prvky HTML okna, výstup shellu, stavy zámku). Zamčenému
        oknu se obsah neposílá – dostane ho až po odemčení."""
        with self._lock:
            window = (self._html_windows.get(window_id)
                      or self._shell_windows.get(window_id))
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
            window = self._html_windows.get(window_id)
            callback = self._html_callbacks.get(window_id)
        if window is not None:
            window._dispatch(event)          # prvky: .value, on_click/on_change/on_submit
        if callback is not None:
            callback(event)

    # ---- shell okno (spec 2026-08-18) ------------------------------------

    def open_shell(self, window: ShellWindow) -> str:
        """Otevři shell okno: uloží do stavu (init replay), zařadí akci
        open_window. PTY se NESPOUŠTÍ – okno je zamčené a odemykací kód se
        vypíše do konzole serveru (`unlock=None` spustí shell rovnou)."""
        with self._lock:
            self._shell_windows[window.window_id] = window
            window._owner = self
            self._actions.append({**window.public_spec(), "action": "open_window"})
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

        def on_exit(code: int | None) -> None:
            self._emit_html("shell_state", wid, state="exited", code=code)

        try:
            window.pty = PtyShell(window.command, cwd=window.cwd, env=window.env,
                                  cols=window.cols, rows=window.rows,
                                  on_data=on_data, on_exit=on_exit)
            window.pty.start()
        except Exception as chyba:                       # noqa: BLE001
            window.pty = None
            self._emit_html("shell_state", wid, state="failed", error=str(chyba))
            logger.exception("Shell window '%s' failed to start", wid)
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
        Aplikace může volbu vypnout: `GraphWindow(shell_cli=False)`."""
        if not self.config.get("shell_cli", True):
            return
        with self._lock:
            self._shell_seq = getattr(self, "_shell_seq", 0) + 1
            wid = f"cli-{self._shell_seq}"
        self.open_shell(ShellWindow(wid, title=f"Shell CLI {self._shell_seq}",
                                    cols=100, rows=28, width=820, height=440))

    def has_secured_window(self) -> bool:
        """Je na screenu okno se `secured=True`? (Rozhoduje o povinném TLS
        při poslechu mimo loopback, viz tls.require_tls.)"""
        return any(getattr(w, "secured", False)
                   for w in self._secured_windows().values())

    def _secured_windows(self) -> dict[str, Any]:
        """Všechna okna se zámkem (jeden mechanismus napříč typy)."""
        with self._lock:
            return {**self._windows, **self._terminals,
                    **self._html_windows, **self._shell_windows}

    def _on_window_unlock(self, event) -> None:
        """Klient poslal kód k zamčenému oknu (JAKÉHOKOLI typu). Při shodě se
        pošle skutečné `open_window` i s obsahem a zavolá hook okna (shell
        spustí PTY). Nesprávný kód se odmítne – TOTP má rate limit a ochranu
        proti opakovanému použití (viewbase.mfa)."""
        window = self._secured_windows().get(getattr(event, "window_id", None))
        sid = getattr(event, "sid", None)
        if window is None or not getattr(window, "secured", False):
            return
        if sessions.store.has(sid, window.window_id):
            return                              # tahle relace už grant má
        if not window.unlocks_with(getattr(event, "code", None)):
            # AUDIT: co se stalo, ne čím se to zkoušelo – kód do logu nepatří
            self._log_auth("warning", f"invalid code for window '{window.window_id}'")
            self._emit_html("window_state", window.window_id, state="locked",
                            error="Invalid code")
            return
        # GRANT PRO TUHLE RELACI, ne globální přepnutí okna: obsah dostane
        # jen ten, kdo kód zadal, a jen do vypršení relace (sessions.py).
        sessions.store.grant(sid, window.window_id)
        window.state = "open"                # souhrn pro log/introspekci
        self._log_auth("info", f"window '{window.window_id}' unlocked – "
                               f"{self._auth_kind(window)}")
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

        Zamknout jde JEN okno se `secured=True`: u ostatních není čím odemykat
        a tichý zámek by je udělal nepřístupnými."""
        window = self._secured_windows().get(getattr(event, "window_id", None))
        sid = getattr(event, "sid", None)
        if window is None or not getattr(window, "secured", False):
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
        self._log_auth("info", f"window '{window.window_id}' locked by the user")

    @staticmethod
    def _auth_kind(window: Any) -> str:
        """Čím se okno odemklo – do auditní stopy (bez tajemství)."""
        from . import mfa

        if mfa.available() and mfa.load_users().get(mfa.active_user()):
            return f"token of user '{mfa.active_user()}'"
        return "one-time code"

    @staticmethod
    def _log_auth(level: str, message: str) -> None:
        """Auditní stopa zámku okna do log okna i logu serveru. Systémový
        text, NIKDY tajemství (kód, QR, URI) – uživatelské rozhodnutí."""
        log_bus.publish(level, "backend_program", message, component="windows")

    def _on_shell_input(self, event) -> None:
        """Klávesy z prohlížeče do procesu (jen běžícího a odemčeného okna)."""
        window = self._shell_windows.get(getattr(event, "window_id", None))
        data = getattr(event, "data", None)
        if window is None or window.pty is None or not isinstance(data, str):
            return
        window.pty.write(data)

    def _on_shell_resize(self, event) -> None:
        """Nová velikost terminálu z prohlížeče → SIGWINCH procesu."""
        window = self._shell_windows.get(getattr(event, "window_id", None))
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

    def pin_menu(self, menu: ScreenMenu) -> None:
        """Připni ScreenMenu na screen bar (§8 designu) – uloží se do stavu
        (init replay, přežije reconnect) a zařadí akci open_menu. Nahrazení
        dosud připnutého menu zruší staré on_select handlery (patří k
        nahrazenému objektu)."""
        with self._lock:
            self._menu = menu
            self._actions.append({"action": "open_menu", **menu.spec()})

    def _on_menu_select(self, event) -> None:
        """Interní handler eventu menu_select: najdi položku podle item_id
        v aktuálně připnutém menu a zavolej její on_select."""
        item_id = getattr(event, "item_id", None)
        if not isinstance(item_id, str):
            return
        with self._lock:
            menu = self._menu
        if menu is not None:
            menu.dispatch(item_id, event)

    def set_edge_style(self, style: str, elasticity: float = 0.0) -> None:
        """Nastav vykreslení hran: 'line' nebo 'spline', elasticity 0..1.
        Uloží do config (pro init) a zařadí akci set_edge_style."""
        if style not in ("line", "spline"):
            raise ValueError("style musí být 'line' nebo 'spline'")
        elasticity = max(0.0, min(1.0, float(elasticity)))
        with self._lock:
            self.config["edge_style"] = {"style": style,
                                         "elasticity": elasticity}
            self._actions.append({"action": "set_edge_style", "style": style,
                                  "elasticity": elasticity})

    def _on_window_submit(self, event) -> None:
        """Interní handler eventu window_submit: validuj values proti specu
        okna, ulož je (pro init replay) a zavolej callback okna."""
        window_id = getattr(event, "window_id", None)
        raw = getattr(event, "values", None)
        if not isinstance(raw, dict):
            return
        with self._lock:
            window = self._windows.get(window_id)
            if window is None:
                return
            clean = validate_values(window.spec()["fields"], raw)
            window.apply(clean)
            callback = self._window_callbacks.get(window_id)
        if callback is not None:
            event.values = clean
            callback(event)

    # ---- uzly ----------------------------------------------------------

    def add_node(self, node_id: str, *, type: str | None = None,
                 label: str | None = None, **meta: Any) -> None:
        """Založ uzel. `type` musí být předem definovaný (`define_type`),
        `label` je per-node šablona popisku (`"{name} [{ip}]"`), zbytek kwargs
        jsou volná metadata – čtou se v handlerech, v detailním okně i v
        šabloně popisku. Meta klíče `color`/`size` přebijí styl typu.
        Existující id je chyba (idempotentní zápis viz `ensure_node`)."""
        self._add_node(node_id, type, label, meta)

    def _add_node(self, node_id: str, type: str | None, label: str | None,
                  meta: dict[str, Any]) -> None:
        """Dict-based jádro add_node – import grafů tudy obchází kolizi
        atributů pojmenovaných 'type'/'label' s kwargs."""
        with self._lock:
            if node_id in self._nodes:
                raise ValueError(f"Uzel '{node_id}' už existuje")
            if type is not None and type not in self._node_types:
                raise ValueError(
                    f"Neznámý typ uzlu '{type}' – nejdřív zavolej define_type")
            node = {"id": node_id, "type": type,
                    "label_template": label, "meta": dict(meta)}
            self._nodes[node_id] = node
            self._pending["add_nodes"][node_id] = self._public_node(node)

    def ensure_node(self, node_id: str, *, type: str | None = None,
                    label: str | None = None, **meta: Any) -> None:
        """Idempotentní add_node: neexistující uzel založí, existujícímu
        sloučí meta a případně přepne typ/šablonu popisku (patch odejde jen
        při reálné změně). ``type=None``/``label=None`` znamená „nezadáno" =
        nech beze změny; zrušit typ jde přes ``update_node(id, type=None)``."""
        self._ensure_node(node_id, type, label, meta)

    def _ensure_node(self, node_id: str, type: str | None, label: str | None,
                     meta: dict[str, Any]) -> None:
        with self._lock:
            node = self._nodes.get(node_id)
            if node is None:
                self._add_node(node_id, type, label, meta)
                return
            changed = False
            if type is not None and type != node["type"]:
                self._set_node_type_locked(node, type)
                changed = True
            if label is not None and label != node["label_template"]:
                node["label_template"] = label
                changed = True
            merged = {**node["meta"], **meta}
            if merged != node["meta"]:
                node["meta"] = merged
                changed = True
            if not changed:
                return
            self._queue_node_payload_locked(node)

    def update_node(self, node_id: str, *, type: Any = _KEEP,
                    label: Any = _KEEP, **meta: Any) -> None:
        """Změň existující uzel za běhu – metadata, typ i šablonu popisku.

        Barva jednoho uzlu jde přes meta (priorita meta > typ > téma)::

            canvas.update_node("srv-1", color="#ff2a6d")   # přebarvi
            canvas.update_node("srv-1", color=None)        # zpět na typ/téma

        ``type="db"`` přepne uzel na jiný typ (barva, tvar i velikost se
        překreslí), ``type=None`` typ zruší, nezadaný ``type`` ho nechá být;
        stejně se chová ``label``. Hromadnou změnu barvy celého typu udělá
        ``define_type``. Odebírat a znovu zakládat uzel kvůli vzhledu není
        potřeba – uzel si drží pozici i hrany."""
        with self._lock:
            if node_id not in self._nodes:
                raise ValueError(f"Uzel '{node_id}' neexistuje")
            node = self._nodes[node_id]
            if type is not _KEEP:
                self._set_node_type_locked(node, type)
            if label is not _KEEP:
                if label is not None and not isinstance(label, str):
                    raise ValueError("label musí být řetězec nebo None")
                node["label_template"] = label
            node["meta"].update(meta)
            self._queue_node_payload_locked(node)

    def _set_node_type_locked(self, node: dict[str, Any],
                              node_type: str | None) -> None:
        """Přepni typ uzlu (None = bez typu); typ musí být definovaný."""
        if node_type is not None and node_type not in self._node_types:
            raise ValueError(
                f"Neznámý typ uzlu '{node_type}' – nejdřív zavolej define_type")
        node["type"] = node_type

    def _queue_node_payload_locked(self, node: dict[str, Any]) -> None:
        """Zařaď stav uzlu do delt – do add_nodes, dokud tam čeká založení
        (klient by jinak dostal update na uzel, který ještě nezná)."""
        node_id = node["id"]
        payload = self._public_node(node)
        if node_id in self._pending["add_nodes"]:
            self._pending["add_nodes"][node_id] = payload
        else:
            self._pending["update_nodes"][node_id] = payload

    def remove_node(self, node_id: str) -> None:
        """Odeber uzel i všechny jeho hrany (kaskáda) a zruš trvalé toky, které
        přes něj vedly. Kvůli změně vzhledu uzel odebírat nemusíš – barvu, typ
        i popisek mění `update_node` za běhu."""
        with self._lock:
            if node_id not in self._nodes:
                raise ValueError(f"Uzel '{node_id}' neexistuje")
            for key in [k for k in self._edges if node_id in k]:
                self._remove_edge_locked(key)
            del self._nodes[node_id]
            self._pending["update_nodes"].pop(node_id, None)
            if self._pending["add_nodes"].pop(node_id, None) is None:
                self._pending["remove_nodes"][node_id] = True

    # ---- hrany ---------------------------------------------------------

    def add_edge(self, source: str, target: str, **meta: Any) -> None:
        """Spoj dva existující uzly neorientovanou hranou (pořadí konců je
        jedno, `a–b` == `b–a`). Kwargs jsou metadata hrany; `color` obarví
        hranu napřímo, `brightness` (0..1) řídí její jas mezi barvou tématu
        a rozsvícenou. Duplicitní hrana i smyčka do sebe jsou chyba."""
        self._add_edge(source, target, meta)

    def _add_edge(self, source: str, target: str,
                  meta: dict[str, Any]) -> None:
        with self._lock:
            if source not in self._nodes or target not in self._nodes:
                raise ValueError(
                    f"Hrana {source}–{target}: oba uzly musí existovat")
            if source == target:
                raise ValueError("Hrana nesmí vést z uzlu do něj samého")
            key = _edge_key(source, target)
            if key in self._edges:
                raise ValueError(f"Hrana {key[0]}–{key[1]} už existuje")
            edge = {"source": key[0], "target": key[1], "meta": dict(meta)}
            self._edges[key] = edge
            self._pending["add_edges"][key] = self._public_edge(edge)

    def ensure_edge(self, source: str, target: str, **meta: Any) -> None:
        """Idempotentní add_edge: neexistující hranu založí, existující
        sloučí meta (patch jen při reálné změně; klient add_edges
        upsertuje)."""
        self._ensure_edge(source, target, meta)

    def _ensure_edge(self, source: str, target: str,
                     meta: dict[str, Any]) -> None:
        with self._lock:
            edge = self._edges.get(_edge_key(source, target))
            if edge is None:
                self._add_edge(source, target, meta)
                return
            merged = {**edge["meta"], **meta}
            if merged == edge["meta"]:
                return
            edge["meta"] = merged
            key = _edge_key(source, target)
            self._pending["add_edges"][key] = self._public_edge(edge)

    def remove_edge(self, source: str, target: str) -> None:
        """Odeber hranu (neorientovaně) a zruš trvalé toky, které přes ni
        vedly. Neexistující hrana je chyba."""
        with self._lock:
            key = _edge_key(source, target)
            if key not in self._edges:
                raise ValueError(f"Hrana {source}–{target} neexistuje")
            self._remove_edge_locked(key)

    def _remove_edge_locked(self, key: tuple[str, str]) -> None:
        del self._edges[key]
        if self._pending["add_edges"].pop(key, None) is None:
            self._pending["remove_edges"][key] = True
        self._invalidate_flows_locked(key)

    def _invalidate_flows_locked(self, edge_key: tuple[str, str]) -> None:
        """Zruš trvalé toky, jejichž cesta vede přes odstraněnou hranu.
        Pokrývá i remove_node – kaskáda maže všechny hrany uzlu a každá
        cesta přes uzel některou z nich používá. Bez invalidace by stale
        tok zůstal v initu navždy a klient by mu hromadil částice."""
        doomed = [fid for fid, f in self._flows.items()
                  if any(_edge_key(a, b) == edge_key
                         for a, b in zip(f["path"], f["path"][1:]))]
        for fid in doomed:
            del self._flows[fid]
            self._actions.append({"action": "stop_flow", "flow_id": fid})

    # ---- import grafů ---------------------------------------------------

    def add_edges(self, pairs) -> None:
        """Hromadné add_edge: iterovatelné dvojic (source, target)."""
        with self.batch():
            for source, target in pairs:
                self.add_edge(source, target)

    def add_graph(self, graph, *, type_attr: str | None = None,
                  label: str | None = None) -> None:
        """Importuj graf ve stylu networkx – duck-typing přes
        graph.nodes(data=True) a graph.edges(data=True), závislost na
        networkx nevzniká. Id uzlů se převádí str(), atributy jdou do meta.
        `type_attr` vybere meta klíč jako typ uzlu (neznámé typy se
        auto-registrují prázdným stylem), `label` je šablona popisku pro
        importované uzly. Self-loops se přeskočí s warningem; opakovaný
        import je díky ensure_* idempotentní."""
        with self._lock, self.batch():
            for node_id, data in graph.nodes(data=True):
                meta = dict(data)
                node_type = None
                if type_attr is not None and type_attr in meta:
                    node_type = str(meta.pop(type_attr))
                    if node_type not in self._node_types:
                        self.define_type(node_type)
                self._ensure_node(str(node_id), node_type, label, meta)
            for a, b, data in graph.edges(data=True):
                sa, sb = str(a), str(b)
                if sa == sb:
                    logger.warning("add_graph: self-loop '%s' skipped", sa)
                    continue
                self._ensure_edge(sa, sb, dict(data))

    @classmethod
    def from_networkx(cls, graph, *, type_attr: str | None = None,
                      label: str | None = None, **canvas_kwargs) -> "GraphWindow":
        """GraphWindow rovnou z (networkx-like) grafu:
        vb.serve(vb.GraphWindow.from_networkx(G), open_browser=True)."""
        canvas = cls(**canvas_kwargs)
        canvas.add_graph(graph, type_attr=type_attr, label=label)
        return canvas

    # ---- čtení ---------------------------------------------------------

    def has_node(self, node_id: str) -> bool:
        """Existuje uzel? (Bezpečné i z handlerů a every() úloh.)"""
        with self._lock:
            return node_id in self._nodes

    def has_edge(self, source: str, target: str) -> bool:
        """Existuje hrana mezi uzly? Neorientovaně – pořadí konců je jedno."""
        with self._lock:
            return _edge_key(source, target) in self._edges

    def node(self, node_id: str) -> dict[str, Any] | None:
        """Veřejná kopie uzlu {'id','type','label','meta'} s vyrenderovaným
        popiskem; None když neexistuje. Mutace návratu stav neovlivní."""
        with self._lock:
            node = self._nodes.get(node_id)
            return self._public_node(node) if node else None

    def edge(self, source: str, target: str) -> dict[str, Any] | None:
        """Veřejná kopie hrany {'source','target','meta'} (neorientovaně);
        None když neexistuje."""
        with self._lock:
            edge = self._edges.get(_edge_key(source, target))
            return self._public_edge(edge) if edge else None

    @property
    def nodes(self) -> list[dict[str, Any]]:
        """Kopie všech uzlů (jako v snapshot); pořadí = pořadí přidání."""
        with self._lock:
            return [self._public_node(n) for n in self._nodes.values()]

    @property
    def edges(self) -> list[dict[str, Any]]:
        """Kopie všech hran (jako v snapshot); pořadí = pořadí přidání."""
        with self._lock:
            return [self._public_edge(e) for e in self._edges.values()]

    # ---- labely --------------------------------------------------------

    def _render_label(self, node: dict[str, Any]) -> str:
        template = node["label_template"]
        if template is None:                       # bez per-node šablony
            template = self._node_label_template   # zkus celocanvasovou
        if template is None:
            return node["id"]

        def substitute(match: re.Match[str]) -> str:
            key = match.group(1)
            if key in node["meta"]:
                return str(node["meta"][key])
            logger.warning(
                "Node '%s': key '%s' from the label template is missing in metadata",
                node["id"], key)
            return ""

        return _LABEL_KEY.sub(substitute, template)

    def _public_node(self, node: dict[str, Any]) -> dict[str, Any]:
        return {"id": node["id"], "type": node["type"],
                "label": self._render_label(node), "meta": dict(node["meta"])}

    @staticmethod
    def _public_edge(edge: dict[str, Any]) -> dict[str, Any]:
        return {"source": edge["source"], "target": edge["target"],
                "meta": dict(edge["meta"])}

    # ---- snapshot ------------------------------------------------------

    def _unlocked(self, sid: str | None, window_id: str) -> bool:
        """Má tahle relace grant k tomuhle oknu? (Jediná otázka, podle které
        se rozhoduje, co uvidí – viz sessions.py.)"""
        return sessions.store.has(sid, window_id)

    def snapshot(self, sid: str | None = None) -> dict[str, Any]:
        """Úplný stav pro init zprávu KONKRÉTNÍ relace. Pozn.: pending delty
        jsou už součástí stavu – klient proto aplikuje adds jako upserty
        (idempotence).

        `sid` rozhoduje o zabezpečených oknech: bez grantu jde jen prázdný rám
        `[private window]`. Snapshot se proto staví pro každého klienta zvlášť
        (dřív byl jeden pro všechny, takže po odemčení viděl obsah i ten, kdo
        kód nikdy nezadal)."""
        with self._lock:
            return {
                "seq": self._seq,
                "config": dict(self.config),
                "node_types": {n: dict(s) for n, s in self._node_types.items()},
                "nodes": [self._public_node(n) for n in self._nodes.values()],
                "edges": [self._public_edge(e) for e in self._edges.values()],
                "flow_types": {n: dict(s) for n, s in self._flow_types.items()},
                "flows": [dict(f) for f in self._flows.values()],
                # public_spec(sid): zabezpečené okno jde klientovi jako
                # prázdný rám, dokud TAHLE RELACE nemá grant (sessions.py)
                "windows": [
                    {**w.public_spec(self._unlocked(sid, wid)),
                     "live": self._window_live.get(wid, False)}
                    for wid, w in self._windows.items()]
                + [t.public_spec(self._unlocked(sid, wid))
                   for wid, t in self._terminals.items()]
                + [h.public_spec(self._unlocked(sid, wid))
                   for wid, h in self._html_windows.items()]
                + [sh.public_spec(self._unlocked(sid, wid))
                   for wid, sh in self._shell_windows.items()],
                "menu": self._menu.spec() if self._menu is not None else None,
            }

    # ---- delty ---------------------------------------------------------

    @contextmanager
    def batch(self) -> Iterator[None]:
        """Podrž delty pohromadě – odejdou jako jeden patch po opuštění bloku."""
        with self._lock:
            self._batch_depth += 1
        try:
            yield
        finally:
            with self._lock:
                self._batch_depth -= 1

    def drain(self) -> tuple[int, dict[str, list]] | None:
        """Vrátí (seq, delty) k odeslání, nebo None když není co poslat."""
        with self._lock:
            if self._batch_depth > 0:
                return None
            if not any(self._pending.values()):
                return None
            deltas = {
                "remove_edges": [list(k) for k in self._pending["remove_edges"]],
                "remove_nodes": list(self._pending["remove_nodes"]),
                "add_nodes": list(self._pending["add_nodes"].values()),
                "update_nodes": list(self._pending["update_nodes"].values()),
                "add_edges": list(self._pending["add_edges"].values()),
            }
            self._pending = self._empty_pending()
            self._seq += 1
            return self._seq, deltas

    # ---- periodické úlohy ----------------------------------------------

    def every(self, seconds: float, *,
              name: str | None = None) -> Callable[[Callable], Callable]:
        """Dekorátor: registruj periodickou úlohu – knihovna ji po startu
        serveru spouští v daemon vlákně, žádný threading v uživatelském
        kódu. První tik po uplynutí intervalu. Výjimka se zaloguje a smyčka
        běží dál. Registruj před vb.serve(); pozdější registrace se jen
        zaloguje a ignoruje."""
        interval = float(seconds)
        if interval <= 0:
            raise ValueError("every: interval musí být kladný počet sekund")

        def register(func: Callable[[], None]) -> Callable[[], None]:
            task_name = name or getattr(func, "__name__", "úloha")
            with self._lock:
                if self._tasks_stop is not None:
                    logger.warning(
                        "every(): task '%s' registered after the server started"
                        " – ignored", task_name)
                    return func
                self._tasks.append(
                    {"interval": interval, "name": task_name, "func": func})
            return func
        return register

    def start_periodic_tasks(self) -> threading.Event:
        """Spusť every() úlohy (volá server v lifespanu). Vrátí stop event;
        idempotentní – opakované volání vrátí týž event."""
        with self._lock:
            if self._tasks_stop is not None:
                return self._tasks_stop
            stop = threading.Event()
            self._tasks_stop = stop
            tasks = list(self._tasks)
        for task in tasks:
            threading.Thread(
                target=self._run_periodic, args=(task, stop),
                name=f"viewbase-every-{task['name']}", daemon=True).start()
        return stop

    @staticmethod
    def _run_periodic(task: dict[str, Any], stop: threading.Event) -> None:
        while not stop.wait(task["interval"]):
            try:
                task["func"]()
            except Exception:
                logger.exception("Exception in every() task '%s'", task["name"])

    # ---- eventy ----------------------------------------------------------

    def on(self, event: str,
           func: Callable[[Any], None]) -> Callable[[Any], None]:
        """Obecná registrace handleru eventu — vlastní eventy zvenčí přes
        REST `/api/event` (např. „terminal_write" pushnutý časovačem)."""
        return self._register(event, func)

    def on_click(self, func: Callable[[Any], None]) -> Callable[[Any], None]:
        """Dekorátor: klik na uzel. Event nese `.node_id` a `.client_id`;
        handler běží v thread-poolu, takže smí blokovat i mutovat canvas."""
        return self._register("node_click", func)

    def on_hover(self, func: Callable[[Any], None]) -> Callable[[Any], None]:
        """Dekorátor: najetí myší na uzel (`.node_id`, throttlováno klientem)."""
        return self._register("node_hover", func)

    def on_background_click(
            self, func: Callable[[Any], None]) -> Callable[[Any], None]:
        """Dekorátor: klik mimo uzly – typicky zrušení výběru/zvýraznění."""
        return self._register("background_click", func)

    def on_view_change(
            self, func: Callable[[Any], None]) -> Callable[[Any], None]:
        """Dekorátor: pohyb kamery. Event nese `.position`, `.target`, `.zoom`
        (klient posílá throttlovaně, ~10×/s)."""
        return self._register("view_change", func)

    def _register(self, event: str,
                  func: Callable[[Any], None]) -> Callable[[Any], None]:
        with self._lock:
            self._handlers.setdefault(event, []).append(func)
        return func

    def dispatch_event(self, name: str, payload: dict[str, Any]) -> None:
        """Spustí handlery eventu ve sdíleném thread-poolu (smí blokovat).
        Neznámý event je no-op; výjimka handleru se zaloguje, server běží dál."""
        with self._lock:
            if self._closed:
                return
            handlers = list(self._handlers.get(name, ()))
        if not handlers:
            return
        event = types.SimpleNamespace(**payload)
        for handler in handlers:
            self._executor.submit(self._run_handler, handler, name, event)

    @staticmethod
    def _run_handler(handler: Callable[[Any], None], name: str,
                     event: types.SimpleNamespace) -> None:
        try:
            handler(event)
        except Exception:
            logger.exception("Exception in handler for event '%s'", name)

    def close(self) -> None:
        """Ukonči thread-pool handlerů i every() úlohy. Idempotentní; další
        dispatch_event je no-op. Nečeká na běžící handlery (wait=False)
        a zruší zařazené čekající úlohy (cancel_futures=True). Má-li canvas
        přiřazený Screen (`screen_id`), zařadí akci `screen_remove`, ať
        frontend zboří ScreenInstance a uvolní WebGL/fyzikální zdroje
        (create/destroy jsou explicitní páry, viz screen.py)."""
        with self._lock:
            if self._closed:
                return
            self._closed = True
            if self.screen_id is not None:
                self._actions.append(
                    {"action": "screen_remove", "screen_id": self.screen_id})
            if self._tasks_stop is not None:
                self._tasks_stop.set()
            shells = list(self._shell_windows.values())
        for shell in shells:
            self._shell_stop(shell)          # žádný osiřelý proces po konci programu
        self._executor.shutdown(wait=False, cancel_futures=True)

    # ---- akce server -> klient -------------------------------------------

    def show_detail(self, node_id: str) -> None:
        """Zobrazí na klientech detail box s metadaty uzlu."""
        self._queue_node_action("show_detail", node_id)

    def focus(self, node_id: str) -> None:
        """Plynulý dolet kamery na uzel."""
        self._queue_node_action("focus", node_id)

    def highlight(self, node_id: str, depth: int | None = None) -> None:
        """Zvýrazní uzel a sousedy do hloubky depth (None = config klienta)."""
        with self._lock:
            self._require_node(node_id)
            self._actions.append(
                {"action": "highlight", "node_id": node_id, "depth": depth})

    def set_theme(self, theme: Any) -> None:
        """Přepne téma za běhu (vestavěné jméno nebo dict) a pošle akci."""
        theme = _validated_theme(theme)
        with self._lock:
            self.config["theme"] = theme
            self._actions.append({"action": "set_theme", "theme": theme})

    def _queue_node_action(self, action: str, node_id: str) -> None:
        with self._lock:
            self._require_node(node_id)
            self._actions.append({"action": action, "node_id": node_id})

    def _require_node(self, node_id: str) -> None:
        if node_id not in self._nodes:
            raise ValueError(f"Uzel '{node_id}' neexistuje")

    def drain_actions(self) -> list[dict[str, Any]]:
        """Vrátí akce k odeslání (v pořadí volání) a frontu vyprázdní.

        Tady se akcím k ZABEZPEČENÝM oknům doplní adresát – jedno místo pro
        celou knihovnu, takže o relacích nemusí vědět žádný `open_*`/`html_*`
        volající (DRY):

        - `grant: <window_id>` … pošli jen relacím, které mají grant k oknu,
        - `only_sid: <sid>`    … pošli jen téhle jedné relaci (odemčení,
                                 zamčení zpátky – doplňuje volající),
        - placeholder (`kind: "locked"`) značku nedostane: prázdný rám
          `[private window]` má vidět každý.
        """
        with self._lock:
            actions, self._actions = self._actions, []
            secured = {wid for wid, w in self._secured_windows().items()
                       if getattr(w, "secured", False)}
            for action in actions:
                wid = action.get("window_id")
                if (wid in secured and action.get("kind") != "locked"
                        and "only_sid" not in action):
                    action["grant"] = wid
            return actions

    def peek_actions(self) -> list[dict[str, Any]]:
        """Kopie fronty akcí BEZ vyprázdnění (testy, ladění)."""
        with self._lock:
            return list(self._actions)

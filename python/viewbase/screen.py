"""Screen – Amiga-style kontejner nad GraphWindow (viz docs/superpowers/specs/
2026-08-02-multi-screen-workbench-design.md). Screen sám o sobě nenese graf –
to dál dělá GraphWindow; Screen mu jen dává id, titulek a vzhled/quality.

Vytvoření Screenu a přiřazení grafu (`GraphWindow(screen=...)`) jsou nezávislé
atomární operace – jen pořadí je volné, vazba je pak trvalá 1:1. Screen
proto může chvíli žít samostatně (a např. `pin_menu` na něm zavolat dřív,
než k němu GraphWindow dorazí) – má na to vlastní frontu akcí, stejný
mechanismus jako GraphWindow (`_actions`/`drain_actions`). Jakmile se GraphWindow
připojí, EXPLICITNĚ (viditelné volání `GraphWindow._adopt_screen`, ne skrytá
magie) frontu převezme.

Id se přiděluje automaticky v pořadí vytvoření (1, 2, 3, …) – nezadává se.
`0` se nikdy nepřidělí (historicky patřilo vestavěnému log screenu; log je
dnes obyčejné okno na screenu – window-first model, viz handover plán –
ale id se dál číslují od 1, ať se stará i nová sezení chovají stejně)."""
from __future__ import annotations

import threading
from typing import TYPE_CHECKING, Any

from .access import Access
from .graph_util import BUILTIN_THEMES, QUALITIES, _validated_theme

if TYPE_CHECKING:
    from .graph_window import GraphWindow
    from .menu import ScreenMenu

MAX_USER_SCREENS = 8

_lock = threading.Lock()
_next_id = 1


def _allocate_id() -> int:
    global _next_id
    with _lock:
        if _next_id > MAX_USER_SCREENS:
            raise ValueError(f"Překročen limit {MAX_USER_SCREENS} screenů")
        allocated = _next_id
        _next_id += 1
        return allocated


def reset_allocator() -> None:
    """Vrať čítač id na 1 – jen pro testy (izolace mezi testovacími případy)."""
    global _next_id
    with _lock:
        _next_id = 1


class Screen:
    """Amiga-style screen: id (auto), titulek, téma, quality. Váže se na
    GraphWindow (`GraphWindow(screen=...)`), nenese žádný stav grafu sám – ale umí
    fungovat i BEZ přiřazeného GraphWindow (viz modul docstring)."""

    def __init__(self, *, title: str = "viewbase", theme: Any = "modern",
                 quality: str = "auto",
                 access: "list[str] | None" = None) -> None:
        if quality not in QUALITIES:
            raise ValueError(f"quality musí být jedno z {QUALITIES}")
        self.id = _allocate_id()
        #: Kdo plochu vidí. BRÁNA PRO VŠECHNO NA NÍ: kdo se nedostane sem,
        #: nedostane žádné její okno ani zprávu. Nenastavené dědí výchozí
        #: hodnotu instance (`vb.Project(default_access=…)`).
        self.access = Access(see=access, object_id=f"screen:{self.id}")
        self.title = title
        self.theme = _validated_theme(theme)
        self.quality = quality
        self._lock = threading.Lock()
        self._actions: list[dict[str, Any]] = []
        self._menu: "ScreenMenu | None" = None
        self._graph: "GraphWindow | None" = None   # nastaví GraphWindow._adopt_screen
        self._log_window = False    # nastaví LogWindow(screen=...), viz log.py

    @property
    def graph(self) -> "GraphWindow | None":
        """Grafové okno připnuté na tenhle screen (`GraphWindow(screen=…)`),
        nebo None – `Project.serve(screen)` přes něj screen servíruje."""
        return self._graph

    def pin_menu(self, menu: "ScreenMenu") -> None:
        """Připni ScreenMenu (§8 designu) – funguje i bez přiřazeného
        GraphWindow (viz modul docstring). Bez GraphWindow se zařadí do vlastní
        fronty, kterou si GraphWindow při přiřazení explicitně převezme; s už
        přiřazeným GraphWindow deleguje rovnou na `GraphWindow.pin_menu`."""
        with self._lock:
            self._menu = menu
            if self._graph is not None:
                graph = self._graph
            else:
                self._actions.append({"action": "open_menu", **menu.spec()})
                return
        graph.pin_menu(menu)

    def drain_actions(self) -> list[dict[str, Any]]:
        """Vrať a vyprázdni frontu akcí nahromaděných PŘED přiřazením
        GraphWindow. Volá `GraphWindow._adopt_screen` při explicitním převzetí."""
        with self._lock:
            actions, self._actions = self._actions, []
            return actions

    def destroy(self) -> None:
        """Screen zaniká (create/destroy jsou explicitní páry). S
        přiřazeným GraphWindow zavře jeho server-side stav (`GraphWindow.close()`
        zařadí `screen_remove`, ať frontend zboří ScreenInstance a uvolní
        WebGL/fyzikální zdroje). Bez GraphWindow screen nikdy nebyl "naživu" na
        drátě – jen se zahodí nahromaděná fronta."""
        with self._lock:
            graph = self._graph
            self._actions = []
        if graph is not None:
            graph.close()

    def __repr__(self) -> str:
        return f"Screen(id={self.id}, title={self.title!r})"

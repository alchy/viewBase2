"""GraphWindow – zdroj pravdy grafu a veřejné API knihovny."""
from __future__ import annotations

import logging
import re
import threading
import types
from concurrent.futures import ThreadPoolExecutor
from contextlib import contextmanager
from typing import TYPE_CHECKING, Any, Callable, Iterator

from .controls import ControlWindow, HtmlWindow, ShellWindow, TerminalWindow
from .menu import ScreenMenu
from .events_mixin import EventsMixin
from .flows_mixin import FlowsMixin
from .graph_util import QUALITIES, _edge_key, _validated_theme
from .windows_mixin import WindowsMixin

if TYPE_CHECKING:
    from .screen import Screen

logger = logging.getLogger("viewbase")

_LABEL_KEY = re.compile(r"\{([^{}]+)\}")


# Sentinel „argument nezadán" – odlišuje `update_node(a)` (typ/label nech být)
# od `update_node(a, type=None)` (typ zruš, uzel spadne na styl tématu).
_KEEP: Any = object()






class GraphWindow(EventsMixin, FlowsMixin, WindowsMixin):
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







    # ---- control okna -------------------------------------------------












    # ---- shell okno (spec 2026-08-18) ------------------------------------














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
                "windows": self._window_specs(sid),
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




    # ---- eventy ----------------------------------------------------------









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

"""Toky (flows): animované částice po hranách grafu.

Odděleno z `graph_window.py` (viz windows_mixin.py – tentýž důvod). Tok je
vlastní podsystém: má svůj typový registr, hledá cestu grafem a udržuje
seznam běžících toků; s okny ani s událostmi nemá nic společného.

Kontrakt vůči hostitelské třídě: `self._lock`, `self._flow_types`,
`self._flows`, `self._pending`, `self._edges`, `self._nodes` a
`self._flow_seq`."""
from __future__ import annotations

import logging
import uuid
from collections import deque

from .graph_util import _edge_key

logger = logging.getLogger("viewbase")


class FlowsMixin:
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

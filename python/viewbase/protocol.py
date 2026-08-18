"""Zprávy protokolu viewbase (server <-> klient), verze 1."""
from __future__ import annotations

import json
from typing import Any

PROTOCOL_VERSION = 1


def init_message(*, seq: int, config: dict, node_types: dict,
                 nodes: list, edges: list,
                 flow_types: dict, flows: list,
                 windows: list, menu: dict | None = None,
                 screen_id: int | None = None,
                 sid: str | None = None) -> dict[str, Any]:
    return {
        "type": "init",
        "protocol": PROTOCOL_VERSION,
        "seq": seq,
        "screen_id": screen_id,
        # session id prohlížeče: server ho přidělí (nebo potvrdí to poslané
        # v hello) a klient si ho uloží do localStorage, viz sessions.py
        "sid": sid,
        "config": config,
        "node_types": node_types,
        "nodes": nodes,
        "edges": edges,
        "flow_types": flow_types,
        "flows": flows,
        "windows": windows,
        "menu": menu,
    }


def patch_message(seq: int, deltas: dict[str, list],
                  screen_id: int | None = None) -> dict[str, Any]:
    message: dict[str, Any] = {
        "type": "patch", "seq": seq, "screen_id": screen_id}
    message.update(deltas)
    return message


def log_message(record: dict[str, Any]) -> dict[str, Any]:
    """Zprávu `log` sestav z `LogRecord.as_dict()` (level/source/message/
    component) – viz §3a designu multi-screen Workbench. Nenese `screen_id`:
    log je proces-wide tok, frontend ho routuje do všech otevřených log
    oken (window-first model, viz handover plán)."""
    return {"type": "log", **record}


def encode(message: dict) -> str:
    return json.dumps(message, separators=(",", ":"))


def decode(raw: str) -> dict[str, Any]:
    message = json.loads(raw)
    if not isinstance(message, dict) or "type" not in message:
        raise ValueError("Zpráva musí být JSON objekt s polem 'type'")
    return message

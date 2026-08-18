"""Sdílené drobnosti modelu grafu: klíč hrany, témata, kvalita.

Vlastní modul proto, aby je mohl používat `graph_window.py` i mixiny
(`flows_mixin`, `windows_mixin`) BEZ cyklického importu – mixiny se importují
do GraphWindow, takže zpátky na něj sáhnout nemůžou."""
from __future__ import annotations

from typing import Any


BUILTIN_THEMES = ("modern", "cyber", "workbench-gray", "workbench-amiga")


QUALITIES = ("low", "high", "auto")


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

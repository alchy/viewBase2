"""Jeden registr oken screenu místo čtyř paralelních slovníků.

PROČ. Okna se dřív držela ve čtyřech mapách podle typu (`_windows`,
`_terminals`, `_html_windows`, `_shell_windows`). Každá otázka „mám okno
s tímhle id?" se pak musela ptát čtyřikrát a každá nová schopnost napříč
typy (zámek, relace, per-klient snapshot) přidala čtyři skoro stejné větve
– přesně to, co dělalo z `graph_window.py` 1 272řádkový monolit.

Registr drží okna v JEDNÉ mapě `window_id → okno` a typ řeší třídou:

    reg.add(window)                  # id si bere z okna
    reg.get("mzdy")                  # jakékoli okno
    reg.get("mzdy", HtmlWindow)      # …jen když je tenhle typ
    reg.of_kind(ShellWindow)         # všechna okna typu
    reg.all()                        # id → okno (pořadí vložení)

Id je napříč typy JEDINEČNÉ – dřív mohlo stejné `window_id` existovat ve
dvou mapách zároveň a která z nich „platila", záviselo na pořadí dotazů.
Registr to nedovolí: `add()` starý záznam nahradí, ať byl jakéhokoli typu."""
from __future__ import annotations

from typing import Any, Iterator


class WindowRegistry:
    """Okna jednoho GraphWindow: `window_id → okno`, bez ohledu na typ.

    Sám o sobě nezamyká – volající drží `self._lock` GraphWindow, protože
    zápis do registru je vždy součástí větší atomické operace (zařadit akci,
    zapsat callback…)."""

    def __init__(self) -> None:
        self._by_id: dict[str, Any] = {}

    # -- zápis -------------------------------------------------------------

    def add(self, window: Any) -> str:
        """Zaeviduj okno (nahradí okno téhož id, i jiného typu)."""
        self._by_id[window.window_id] = window
        return window.window_id

    def remove(self, window_id: str) -> Any | None:
        """Odeber okno a vrať ho (nebo `None`, když tam nebylo)."""
        return self._by_id.pop(window_id, None)

    # -- čtení -------------------------------------------------------------

    def get(self, window_id: Any, kind: type | tuple[type, ...] | None = None) -> Any | None:
        """Okno podle id; s `kind` jen tehdy, když je daného typu.

        `kind` je tu proto, že handler události ví, co obsluhuje: `shell_input`
        nemá co posílat do HTML okna, které si vzalo stejné id."""
        window = self._by_id.get(window_id)
        if window is None or (kind is not None and not isinstance(window, kind)):
            return None
        return window

    def of_kind(self, kind: type | tuple[type, ...]) -> dict[str, Any]:
        """Všechna okna daného typu (`window_id → okno`)."""
        return {wid: w for wid, w in self._by_id.items() if isinstance(w, kind)}

    def all(self) -> dict[str, Any]:
        """Všechna okna v pořadí, v jakém vznikla."""
        return dict(self._by_id)

    def __contains__(self, window_id: object) -> bool:
        return window_id in self._by_id

    def __iter__(self) -> Iterator[tuple[str, Any]]:
        return iter(self._by_id.items())

    def __len__(self) -> int:
        return len(self._by_id)

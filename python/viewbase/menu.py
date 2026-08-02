"""ScreenMenu: Amiga-style pull-down menu (§8 designu) – pojmenované
skupiny s položkami, autorsky definované v Pythonu. Na rozdíl od
vestavěného Options menu (§8a designu), které existuje vždy samo a je
čistě klientské, ScreenMenu zakládá a naplňuje vývojář – frontend jen
vykresluje spec a posílá zpět event `menu_select`."""
from __future__ import annotations

from typing import Any, Callable


class ScreenMenu:
    """Pull-down menu: pojmenované skupiny (`"Graf"`, `"Zobrazení"`, …)
    s položkami. Výběr položky pošle na server event `menu_select`
    (`item_id`) – zavolá se `on_select` handler té položky."""

    def __init__(self) -> None:
        self._groups: dict[str, list[dict[str, Any]]] = {}
        self._order: list[str] = []
        self._callbacks: dict[str, Callable[[Any], None]] = {}
        self._next_id = 0

    def item(self, group: str, label: str, *,
             on_select: Callable[[Any], None] | None = None) -> "ScreenMenu":
        """Přidej položku do skupiny (skupina se založí v pořadí prvního
        výskytu, pokud ještě neexistuje). Vrací self – volání jde řetězit."""
        if group not in self._groups:
            self._groups[group] = []
            self._order.append(group)
        item_id = f"item-{self._next_id}"
        self._next_id += 1
        self._groups[group].append({"id": item_id, "label": label})
        if on_select is not None:
            self._callbacks[item_id] = on_select
        return self

    def spec(self) -> dict[str, Any]:
        """Popis menu pro frontend (akce `open_menu` i `init`). Kopie –
        mutace návratu stav menu neovlivní."""
        return {
            "groups": [
                {"name": group, "items": [dict(i) for i in self._groups[group]]}
                for group in self._order
            ],
        }

    def dispatch(self, item_id: str, event: Any) -> None:
        """Zavolej `on_select` handler dané položky, pokud existuje a má
        callback (položky bez `on_select` jsou no-op, ne chyba)."""
        callback = self._callbacks.get(item_id)
        if callback is not None:
            callback(event)

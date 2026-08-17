"""Control okno: backendem definovaný parametrický dialog.

ControlWindow drží typovaná pole (int/string/enum). Spec jde na frontend (akce
open_window i init), frontend z něj postaví formulář a hodnoty pošle zpět
eventem window_submit. validate_values je čistá – clampuje příchozí hodnoty
podle field descriptorů (bezpečnost: klient může poslat cokoli)."""
from __future__ import annotations

import math
from typing import Any

from .widgets import (Button, Checkbox, Field, Input, Slider, TextElement,
                      render_elements)


def _normalize_options(options: list) -> list[dict]:
    """Seznam (value, label) dvojic nebo holých hodnot → [{value, label}]."""
    normalized = []
    for opt in options:
        if isinstance(opt, (list, tuple)) and len(opt) == 2:
            value, label = opt
        else:
            value, label = opt, str(opt)
        normalized.append({"value": value, "label": str(label)})
    return normalized


class ControlWindow:
    """Parametrické okno: uspořádaný seznam typovaných polí."""

    def __init__(self, window_id: str, *, title: str = "",
                 closable: bool = True) -> None:
        self.window_id = window_id
        self.title = title
        self.closable = bool(closable)  # False = bez gadgetu [x] (neobnovitelné)
        self._fields: list[dict[str, Any]] = []

    def integer(self, key: str, label: str, *, min: int, max: int,
                value: int, step: int = 1) -> "ControlWindow":
        """Celočíselné pole renderované jako slider (např. počet uzlů).
        Vrací self – pole jde řetězit."""
        if min > max:
            raise ValueError("integer: min nesmí být větší než max")
        self._fields.append({
            "key": key, "label": label, "type": "int",
            "value": int(value), "min": int(min), "max": int(max),
            "step": int(step),
        })
        return self

    def number(self, key: str, label: str, *, min: float, max: float,
               value: float, step: float | None = None) -> "ControlWindow":
        """Float pole renderované jako slider (např. elasticita 0.0–1.0)."""
        if min > max:
            raise ValueError("number: min nesmí být větší než max")
        field: dict[str, Any] = {
            "key": key, "label": label, "type": "number",
            "value": float(value), "min": float(min), "max": float(max),
        }
        if step is not None:
            field["step"] = float(step)
        self._fields.append(field)
        return self

    def boolean(self, key: str, label: str, *,
                value: bool = False) -> "ControlWindow":
        """Bool pole renderované jako checkbox."""
        if not isinstance(value, bool):
            raise ValueError("boolean: value musí být bool")
        self._fields.append({
            "key": key, "label": label, "type": "bool", "value": value,
        })
        return self

    def string(self, key: str, label: str, *, maxlength: int,
               value: str = "") -> "ControlWindow":
        """Textové pole; delší vstup z klienta se ořízne na `maxlength`."""
        if maxlength <= 0:
            raise ValueError("string: maxlength musí být kladné")
        self._fields.append({
            "key": key, "label": label, "type": "string",
            "value": str(value), "maxlength": int(maxlength),
        })
        return self

    def enum(self, key: str, label: str, *, options: list,
             value: Any) -> "ControlWindow":
        """Výběr z možností (rozbalovací seznam). `options` je seznam dvojic
        (hodnota, popisek), nebo holých hodnot; `value` musí být jedna z nich."""
        norm = _normalize_options(options)
        if not norm:
            raise ValueError("enum: options nesmí být prázdné")
        if value not in {opt["value"] for opt in norm}:
            raise ValueError("enum: value musí být jedna z options")
        self._fields.append({
            "key": key, "label": label, "type": "enum",
            "value": value, "options": norm,
        })
        return self

    def spec(self) -> dict[str, Any]:
        """Popis okna pro frontend (akce open_window i init). Kopie polí –
        mutace návratu stav okna neovlivní."""
        return {
            "window_id": self.window_id,
            "title": self.title,
            "closable": self.closable,
            "fields": [self._copy_field(f) for f in self._fields],
        }

    @staticmethod
    def _copy_field(field: dict) -> dict:
        """Nezávislá kopie pole (i vnořený seznam options u enum)."""
        copied = dict(field)
        if "options" in copied:
            copied["options"] = [dict(o) for o in copied["options"]]
        return copied

    def apply(self, values: dict[str, Any]) -> None:
        """Přepiš value u polí podle (už zvalidovaných) hodnot."""
        for field in self._fields:
            if field["key"] in values:
                field["value"] = values[field["key"]]


class TerminalWindow:
    """Konzolové okno: prompt + append-only výstup (REPL v prohlížeči).

    Na rozdíl od ControlWindow nemá typovaná pole — je to I/O konzole. Server
    do něj píše přes `GraphWindow.terminal_write`, uživatelův řádek přijde eventem
    `terminal_input`. Spec nese `kind:"terminal"`, aby ho frontend odlišil od
    formulářového okna."""

    def __init__(self, window_id: str, *, title: str = "",
                 prompt: str = "> ", width: int = 560,
                 closable: bool = True, input: bool = True) -> None:  # pylint: disable=redefined-builtin
        if width <= 0:
            raise ValueError("width musí být kladné")
        self.window_id = window_id
        self.title = title
        self.prompt = prompt
        self.width = int(width)
        self.closable = bool(closable)  # False = bez gadgetu [x] (neobnovitelné)
        self.input = bool(input)        # False = jen výstup (živý panel bez promptu)

    def spec(self) -> dict[str, Any]:
        """Popis okna pro frontend; `kind:"terminal"` ho odliší od
        formulářového ControlWindow."""
        return {
            "window_id": self.window_id,
            "title": self.title,
            "kind": "terminal",
            "prompt": self.prompt,
            "width": self.width,
            "closable": self.closable,
            "input": self.input,
        }


class HtmlWindow:
    """HTML okno: obsah skládaný z PRVKŮ (heading/label/button/input/slider/
    checkbox – viz `viewbase.widgets`) na instanci okna, bez psaní HTML.
    Vykreslí se v sandboxovaném iframu stylem ostatních oken (téma).

        okno = vb.HtmlWindow("panel", title="Ovládání")
        graph.open_html(okno)
        jmeno = okno.input("Název"); pridat = okno.button("Přidat")
        pridat.on_click(lambda e: graph.add_node(jmeno.value))

    Každý prvek má stabilní `id` a volitelné `name`, `.text`/`.value` pro
    čtení i zápis (zápis pošle klientům patch jen toho prvku) a handlery
    `on_click`/`on_change`/`on_submit`; `okno.on_event(fn)` dostane vše.
    Rozložení: bez `grid()` prvky pod sebou, `okno.grid(cols=2)` +
    `row=/col=/colspan=` u prvku.

    Pokročilí mohou poslat vlastní HTML přes `GraphWindow.html_set` /
    `html_append` (raw část se vysází PŘED prvky) – bez JS (frontend
    `<script>`/`on*` odstraní), odkazy nenavigují; klik na prvek s
    `data-vb-event` a submit `<form data-vb-event>` přijdou jako
    `html_event` (`.event`, `.value`, `.values`).

    Okno si drží aktuální obsah kvůli init replay po reconnectu – raw část má
    strop `MAX_HTML` (append do nekonečna nesmí nafouknout init; ořez zepředu
    na hranici tagu)."""

    MAX_HTML = 512 * 1024   # znaků raw části; přebije se i na instanci (testy)

    def __init__(self, window_id: str, *, title: str = "",
                 width: int = 560, height: int = 320,
                 closable: bool = True) -> None:
        if width <= 0 or height <= 0:
            raise ValueError("width i height musí být kladné")
        self.window_id = window_id
        self.title = title
        self.width = int(width)
        self.height = int(height)
        self.closable = bool(closable)
        self._raw = ""                       # html_set/html_append (pokročilí)
        self._elements: list[Any] = []       # prvky v pořadí přidání
        self._by_id: dict[str, Any] = {}
        self._grid_cols: int | None = None
        self._owner: Any = None              # GraphWindow po open_html (posílá akce)
        self._handlers: list[Any] = []       # okno.on_event

    # ---- protokol ---------------------------------------------------------

    @property
    def html(self) -> str:
        """Celý aktuální obsah (raw část + prvky) – init replay i html_set."""
        return self._raw + render_elements(self._elements, self._grid_cols)

    def spec(self) -> dict[str, Any]:
        """Popis okna pro frontend (akce open_window i init replay);
        `kind:"html"` ho routuje na html plugin, `html` je aktuální obsah."""
        return {
            "window_id": self.window_id,
            "title": self.title,
            "kind": "html",
            "width": self.width,
            "height": self.height,
            "closable": self.closable,
            "html": self.html,
        }

    def set_html(self, html: str) -> None:
        """Nahraď raw část obsahu (klient dostane akci html_set)."""
        self._raw = self._trim(str(html))

    def append_html(self, html: str) -> None:
        """Připiš fragment na konec raw části (klient dostane akci html_append)."""
        self._raw = self._trim(self._raw + str(html))

    def _trim(self, html: str) -> str:
        """Ořez zepředu na MAX_HTML: začátek se posune na první `<` za
        hranicí, ať replay nezačíná uprostřed tagu (klient dostává vždy jen
        delty, ořez ovlivní jen obnovu po reconnectu)."""
        limit = self.MAX_HTML
        if len(html) <= limit:
            return html
        cut = html.find("<", len(html) - limit)
        return html[cut:] if cut != -1 else html[len(html) - limit:]

    # ---- prvky (katalog) ---------------------------------------------------

    def grid(self, cols: int = 2) -> "HtmlWindow":
        """Mřížka: prvky pak dostávají `row=`/`col=`/`colspan=`; bez toho se
        řadí pod sebou (auto-flow i uvnitř mřížky)."""
        self._grid_cols = max(1, int(cols))
        self._sync_full()
        return self

    def heading(self, text: Any, *, level: int = 2, **kw: Any) -> TextElement:
        """Nadpis (h1–h3). `kw`: name, row, col, colspan."""
        return self._add(TextElement(self, text, tag=f"h{min(3, max(1, int(level)))}", **kw))

    def label(self, text: Any, **kw: Any) -> TextElement:
        """Text (odstavec); `.text` jde měnit za běhu (jen ten prvek se překreslí)."""
        return self._add(TextElement(self, text, tag="p", **kw))

    def button(self, text: Any, **kw: Any) -> Button:
        """Tlačítko → `on_click`."""
        return self._add(Button(self, text, **kw))

    def input(self, label: Any, *, value: Any = "", placeholder: str | None = None,  # noqa: A003
              **kw: Any) -> Input:
        """Textové pole → `on_change`, Enter → `on_submit`; `.value` je str."""
        return self._add(Input(self, label, value=value, placeholder=placeholder, **kw))

    def slider(self, label: Any, *, value: Any = 0, min: Any = 0, max: Any = 100,  # noqa: A002
               step: Any = 1, live: bool = False, **kw: Any) -> Slider:
        """Posuvník → `on_change` (po puštění; `live=True` i při tažení); `.value` číslo."""
        return self._add(Slider(self, label, value=value, min=min, max=max, step=step,
                                live=live, **kw))

    def checkbox(self, label: Any, *, value: bool = False, **kw: Any) -> Checkbox:
        """Zaškrtávátko → `on_change`; `.value` True/False."""
        return self._add(Checkbox(self, label, value=value, **kw))

    def on_event(self, fn: Any = None) -> Any:
        """Jeden handler na všechny události okna (`event.kind`, `.element`,
        `.name`, `.value`, `.values`). Dekorátor i volání."""
        if fn is None:
            return lambda f: self.on_event(f)
        self._handlers.append(fn)
        return fn

    def element(self, id_or_name: str) -> Any:
        """Prvek podle id nebo name (None, když není)."""
        if id_or_name in self._by_id:
            return self._by_id[id_or_name]
        for el in self._elements:
            if el.name == id_or_name:
                return el
        return None

    # ---- vnitřek: synchronizace s klienty ---------------------------------

    def _add(self, el: Any) -> Any:
        el.id = f"{self.window_id}-{len(self._elements) + 1}"
        self._elements.append(el)
        self._by_id[el.id] = el
        self._sync_full()
        return el

    def _sync_full(self) -> None:
        """Přidání prvku / změna mřížky → celé okno (html_set), typicky při
        startu; `with graph.batch()` sloučí. Bez owneru (před open_html) nic."""
        if self._owner is not None:
            self._owner._emit_html("html_set", self.window_id, html=self.html)

    def _patch(self, el: Any) -> None:
        """Změna `.text`/`.value` → jen ten prvek (html_patch)."""
        if self._owner is not None:
            self._owner._emit_html("html_patch", self.window_id, id=el.id, html=el.render())

    def _dispatch(self, event: Any) -> None:
        """Událost z klienta (viz GraphWindow._on_html_event): nejdřív
        aktualizuj `.value` polí z `event.values`, pak handlery prvku
        (`on_click`/`on_change`/`on_submit` podle `event.kind`) a okna."""
        values = getattr(event, "values", None) or {}
        for el in self._elements:
            if isinstance(el, Field) and el.name in values:
                el._set_from_client(values[el.name])
        el = self._by_id.get(getattr(event, "id", None) or "") \
            or self.element(getattr(event, "event", "") or "")
        event.element = el
        event.name = getattr(event, "event", None)
        if not getattr(event, "kind", None):
            event.kind = "click"
        if el is not None:
            if isinstance(el, Field) and event.kind in ("change", "submit") \
                    and hasattr(event, "value"):
                el._set_from_client(event.value)
            el._fire(event.kind, event)
        for fn in self._handlers:
            fn(event)


_DROP = object()   # sentinel: hodnotu zahodit (None je validní string/enum)


def _clamp_field(field: dict, raw: Any) -> Any:
    """Zvaliduj jednu hodnotu podle field descriptoru. Vrátí _DROP, když je
    hodnota nepoužitelná (volající ji vynechá)."""
    kind = field["type"]
    if kind == "int":
        try:
            value = int(raw)
        except (TypeError, ValueError):
            return _DROP
        return max(field["min"], min(field["max"], value))
    if kind == "number":
        try:
            value = float(raw)
        except (TypeError, ValueError):
            return _DROP
        if not math.isfinite(value):
            return _DROP
        return max(field["min"], min(field["max"], value))
    if kind == "bool":
        return raw if isinstance(raw, bool) else _DROP
    if kind == "string":
        if not isinstance(raw, str):
            return _DROP
        return raw[:field["maxlength"]]
    if kind == "enum":
        allowed = {opt["value"] for opt in field["options"]}
        return raw if raw in allowed else _DROP
    return _DROP


def validate_values(fields: list[dict], raw: dict) -> dict:
    """Čistá validace: vrať jen platné, oříznuté hodnoty podle field
    descriptorů. Neznámé klíče a nevalidní hodnoty se zahodí."""
    clean = {}
    for field in fields:
        key = field["key"]
        if key not in raw:
            continue
        value = _clamp_field(field, raw[key])
        if value is not _DROP:
            clean[key] = value
    return clean

"""Prvky HTML okna – primární API pro vývojáře (bez HTML).

    okno = vb.HtmlWindow("panel", title="Ovládání")     # 1) instance okna
    graph.open_html(okno)
    okno.grid(cols=2)                                    # 2) mřížka (volitelně)
    stav  = okno.label("stav: ?", row=0, col=0)          # 3) prvky z katalogu…
    jmeno = okno.input("Název uzlu", row=0, col=1)       #    …každý má id a .value/.text
    zatez = okno.slider("Zátěž", value=50, row=1, col=0)
    pridat = okno.button("Přidat", row=1, col=1)

    @pridat.on_click                                     # 4) událost = který prvek + hodnoty
    def _(event):
        graph.add_node(jmeno.value, load=zatez.value)   #    hodnoty polí už aktuální
        stav.text = f"přidán {jmeno.value}"             #    změna prvku → jen ten se překreslí

Model (spec 2026-08-17 §Prvky): každý prvek dostane stabilní `id`
(`<window_id>-<n>`) a volitelné `name` (klíč do `event.values`); zápis do
`.text`/`.value` pošle klientům `html_patch` jen toho prvku (rozepsaný text
a fokus jiných polí přežijí), přidání prvku pošle celé okno (`html_set`).
Událost nese `kind` (click/change/submit), `element`, `name`, `value` a
`values` všech polí okna s typy; server nejdřív aktualizuje `.value` prvků,
teprve pak volá handlery. Bohatý text uvnitř prvku: `stav.text =
vb.Ui.ok("běží")` (fragmenty Ui se neescapují, obyčejný text ano).

Katalog je záměrně malý (základ, další typy přibudou postupně): heading,
label, button, input, slider, checkbox.
"""
from __future__ import annotations

from typing import Any, Callable

from .ui import _attrs, _esc, _event_attrs

Handler = Callable[[Any], None]


class Element:
    """Společný základ: id, name, umístění v gridu, handlery, vykreslení.
    Podtřída dodá `inner()` (HTML uvnitř obalu) a případně `.text`/`.value`."""

    kind = "element"

    def __init__(self, window: Any, *, name: str | None = None, row: int | None = None,
                 col: int | None = None, colspan: int = 1) -> None:
        self.window = window
        self.id: str = ""                # přidělí okno při _add
        self._name = name
        self.row = row
        self.col = col
        self.colspan = max(1, int(colspan))
        self._handlers: dict[str, list[Handler]] = {"click": [], "change": [], "submit": []}

    # ---- identita -------------------------------------------------------

    @property
    def name(self) -> str:
        """Jméno prvku = klíč do `event.values`; bez zadání = id."""
        return self._name or self.id

    # ---- handlery -------------------------------------------------------

    def _on(self, kind: str, fn: Handler | None) -> Any:
        if fn is None:                                   # použití jako dekorátor s ()
            return lambda f: self._on(kind, f)
        self._handlers[kind].append(fn)
        return fn

    def on_click(self, fn: Handler | None = None) -> Any:
        """Klik na prvek (tlačítko). Dekorátor i obyčejné volání."""
        return self._on("click", fn)

    def on_change(self, fn: Handler | None = None) -> Any:
        """Změna hodnoty pole (po potvrzení; slider po puštění, `live=True` při tažení)."""
        return self._on("change", fn)

    def on_submit(self, fn: Handler | None = None) -> Any:
        """Enter v textovém poli."""
        return self._on("submit", fn)

    def _fire(self, kind: str, event: Any) -> None:
        for fn in self._handlers.get(kind, ()):
            fn(event)

    # ---- vykreslení -----------------------------------------------------

    def inner(self) -> str:
        raise NotImplementedError

    def wrapper_attrs(self) -> str:
        style = None
        if self.row is not None or self.col is not None:
            parts = []
            if self.row is not None:
                parts.append(f"grid-row:{int(self.row) + 1}")
            if self.col is not None:
                span = f"/span {self.colspan}" if self.colspan > 1 else ""
                parts.append(f"grid-column:{int(self.col) + 1}{span}")
            style = ";".join(parts)
        return _attrs(class_=self.css_class(), id=self.id, style=style)

    def css_class(self) -> str:
        return "vb-el"

    def render(self) -> str:
        """Obal prvku (`div.vb-el#id`) + vnitřek – tohle nahrazuje html_patch."""
        return f"<div{self.wrapper_attrs()}>{self.inner()}</div>"

    def _touch(self) -> None:
        """Změna stavu → patch tohoto prvku u klientů."""
        self.window._patch(self)


class TextElement(Element):
    """Prvek s textem (`heading`, `label`); `.text` čte i zapisuje."""

    def __init__(self, window: Any, text: Any, *, tag: str = "p", **kw: Any) -> None:
        super().__init__(window, **kw)
        self._text = text
        self._tag = tag

    @property
    def text(self) -> Any:
        return self._text

    @text.setter
    def text(self, value: Any) -> None:
        self._text = value
        self._touch()

    def inner(self) -> str:
        return f"<{self._tag}>{_esc(self._text)}</{self._tag}>"


class Button(Element):
    """Tlačítko: klik → `on_click` (event.kind == "click", event.value None)."""

    kind = "button"

    def __init__(self, window: Any, text: Any, **kw: Any) -> None:
        super().__init__(window, **kw)
        self._text = text

    @property
    def text(self) -> Any:
        return self._text

    @text.setter
    def text(self, value: Any) -> None:
        self._text = value
        self._touch()

    def inner(self) -> str:
        return (f"<button{_event_attrs(self.name)} data-vb-id=\"{_esc(self.id)}\">"
                f"{_esc(self._text)}</button>")


class Field(Element):
    """Pole s hodnotou (`input`, `slider`, `checkbox`): `.value` čte i zapisuje;
    hodnota od uživatele přijde v eventu (a server ji do `.value` zapíše dřív,
    než zavolá handlery)."""

    input_type = "text"

    def __init__(self, window: Any, label: Any, *, value: Any = "", **kw: Any) -> None:
        super().__init__(window, **kw)
        self.label = label
        self._value = value

    @property
    def value(self) -> Any:
        return self._value

    @value.setter
    def value(self, value: Any) -> None:
        self._value = self.coerce(value)
        self._touch()

    def coerce(self, value: Any) -> Any:
        """Hodnota z prohlížeče → typ pole (podtřídy přebijí)."""
        return value

    def _set_from_client(self, value: Any) -> None:
        self._value = self.coerce(value)     # bez patche – klient hodnotu už má

    def css_class(self) -> str:
        return "vb-el vb-field"

    def widget(self) -> str:
        raise NotImplementedError

    def inner(self) -> str:
        return f'<label for="{_esc(self.id)}">{_esc(self.label)}</label>{self.widget()}'


class Input(Field):
    """Jednořádkové textové pole; Enter → `on_submit`, změna → `on_change`."""

    kind = "input"

    def __init__(self, window: Any, label: Any, *, value: Any = "",
                 placeholder: str | None = None, **kw: Any) -> None:
        super().__init__(window, label, value=value, **kw)
        self.placeholder = placeholder

    def coerce(self, value: Any) -> Any:
        return "" if value is None else str(value)

    def widget(self) -> str:
        return (f'<input type="text"{_attrs(id=self.id, name=self.name, value=self._value, placeholder=self.placeholder)}'
                f' data-vb-id="{_esc(self.id)}">')


class Slider(Field):
    """Posuvník s živě zobrazenou hodnotou; `.value` je číslo. `on_change`
    po puštění, `live=True` posílá i při tažení (klient škrtí ~10×/s)."""

    kind = "slider"

    def __init__(self, window: Any, label: Any, *, value: Any = 0, min: Any = 0,  # noqa: A002
                 max: Any = 100, step: Any = 1, live: bool = False, **kw: Any) -> None:  # noqa: A002
        super().__init__(window, label, value=value, **kw)
        self.min, self.max, self.step, self.live = min, max, step, bool(live)
        self._value = self.coerce(value)

    def coerce(self, value: Any) -> Any:
        try:
            num = float(value)
        except (TypeError, ValueError):
            return self._value if hasattr(self, "_value") else 0
        return int(num) if num == int(num) else num

    def widget(self) -> str:
        return (f'<input type="range"{_attrs(id=self.id, name=self.name, value=self._value, min=self.min, max=self.max, step=self.step)}'
                f' data-vb-id="{_esc(self.id)}"{" data-vb-live" if self.live else ""}>'
                f' <output for="{_esc(self.name)}">{_esc(self._value)}</output>')


class Checkbox(Field):
    """Zaškrtávátko; `.value` je True/False."""

    kind = "checkbox"

    def __init__(self, window: Any, label: Any, *, value: bool = False, **kw: Any) -> None:
        super().__init__(window, label, value=bool(value), **kw)

    def coerce(self, value: Any) -> bool:
        if isinstance(value, str):
            return value.lower() in ("1", "true", "on", "yes")
        return bool(value)

    def css_class(self) -> str:
        return "vb-el vb-field vb-check"

    def widget(self) -> str:
        return (f'<input type="checkbox"{_attrs(id=self.id, name=self.name, checked=bool(self._value))}'
                f' data-vb-id="{_esc(self.id)}">')

    def inner(self) -> str:                      # u checkboxu je popisek za políčkem
        return f'{self.widget()} <label for="{_esc(self.id)}">{_esc(self.label)}</label>'


def render_elements(elements: list[Element], grid_cols: int | None) -> str:
    """Vykreslení všech prvků okna: pod sebou, nebo v mřížce (`grid(cols)`)."""
    body = "".join(el.render() for el in elements)
    if grid_cols is None:
        return body
    return (f'<div class="vb-grid" style="grid-template-columns:repeat({int(grid_cols)},1fr)">'
            f"{body}</div>")

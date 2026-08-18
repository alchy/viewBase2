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

Katalog roste postupně (přidání typu = pár řádků tady + test): výstup
heading, label, kv, table, list, bar, image, hr; interakce button, input,
number, slider, checkbox, radio, select, textarea. Každý prvek má navíc
`.enabled` (False = disabled) a `.visible` (False = schovaný).
"""
from __future__ import annotations

from typing import Any, Callable

from .ui import _attrs, _esc, _event_attrs

_NUM_CLASS = ' class="num"'   # v f-stringu nesmí být zpětné lomítko:
                                # PEP 701 to umí až od Pythonu 3.12, a
                                # knihovna slibuje 3.10+ (pyproject)


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
        self._enabled = True
        self._visible = True

    # ---- stav společný všem prvkům --------------------------------------

    @property
    def enabled(self) -> bool:
        """False = prvek je vidět, ale nereaguje (tlačítko/pole `disabled`)."""
        return self._enabled

    @enabled.setter
    def enabled(self, value: bool) -> None:
        self._enabled = bool(value)
        self._touch()

    @property
    def visible(self) -> bool:
        """False = prvek je schovaný (i s místem v mřížce)."""
        return self._visible

    @visible.setter
    def visible(self, value: bool) -> None:
        self._visible = bool(value)
        self._touch()

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
        return _attrs(class_=self.css_class(), id=self.id, style=style,
                      hidden=not self._visible)

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
        return (f"<button{_event_attrs(self.name)} data-vb-id=\"{_esc(self.id)}\""
                f"{' disabled' if not self._enabled else ''}>{_esc(self._text)}</button>")


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

    def _tail(self) -> str:
        """Konec atributů každého pole: identifikace pro most + disabled."""
        return f' data-vb-id="{_esc(self.id)}"{" disabled" if not self._enabled else ""}'

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
                f'{self._tail()}>')


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
                f'{self._tail()}{" data-vb-live" if self.live else ""}>'
                f' <output for="{_esc(self.name)}">{_esc(self._value)}</output>')


class Number(Field):
    """Číselné pole; `.value` je číslo (int, když jde)."""

    kind = "number"

    def __init__(self, window: Any, label: Any, *, value: Any = 0, min: Any = None,  # noqa: A002
                 max: Any = None, step: Any = None, **kw: Any) -> None:  # noqa: A002
        super().__init__(window, label, value=value, **kw)
        self.min, self.max, self.step = min, max, step
        self._value = self.coerce(value)

    def coerce(self, value: Any) -> Any:
        try:
            num = float(value)
        except (TypeError, ValueError):
            return self._value if hasattr(self, "_value") else 0
        return int(num) if num == int(num) else num

    def widget(self) -> str:
        return (f'<input type="number"{_attrs(id=self.id, name=self.name, value=self._value, min=self.min, max=self.max, step=self.step)}'
                f'{self._tail()}>')


class Select(Field):
    """Výběr z možností: položky jsou hodnoty, nebo dvojice (hodnota, popisek);
    `.value` je vybraná hodnota (str)."""

    kind = "select"

    def __init__(self, window: Any, label: Any, options: Any, *, value: Any = None,
                 **kw: Any) -> None:
        super().__init__(window, label, value=value, **kw)
        self.options = [(o if isinstance(o, tuple) else (o, o)) for o in options]
        if value is None and self.options:
            self._value = str(self.options[0][0])
        else:
            self._value = self.coerce(value)

    def coerce(self, value: Any) -> Any:
        return "" if value is None else str(value)

    def widget(self) -> str:
        opts = "".join(
            f'<option{_attrs(value=val, selected=(str(val) == str(self._value)))}>{_esc(text)}</option>'
            for val, text in self.options)
        return f'<select{_attrs(id=self.id, name=self.name)}{self._tail()}>{opts}</select>'


class Textarea(Field):
    """Víceřádkový text; změna → `on_change` (po opuštění pole)."""

    kind = "textarea"

    def __init__(self, window: Any, label: Any, *, value: Any = "", rows: int = 3,
                 **kw: Any) -> None:
        super().__init__(window, label, value=value, **kw)
        self.rows = int(rows)

    def coerce(self, value: Any) -> Any:
        return "" if value is None else str(value)

    def widget(self) -> str:
        return (f'<textarea{_attrs(id=self.id, name=self.name, rows=self.rows)}'
                f'{self._tail()}>{_esc(self._value)}</textarea>')


class Kv(Element):
    """Tabulka klíč/hodnota (jako detail okno); `.rows` (dict nebo dvojice)
    jde přepsat za běhu – překreslí se jen tabulka. Hodnoty mohou být
    fragmenty `vb.Ui.ok(...)` apod."""

    kind = "kv"

    def __init__(self, window: Any, rows: Any, **kw: Any) -> None:
        super().__init__(window, **kw)
        self._rows = rows

    @property
    def rows(self) -> Any:
        return self._rows

    @rows.setter
    def rows(self, rows: Any) -> None:
        self._rows = rows
        self._touch()

    def inner(self) -> str:
        items = self._rows.items() if isinstance(self._rows, dict) else self._rows
        body = "".join(f"<tr><td>{_esc(k)}</td><td>{_esc(v)}</td></tr>" for k, v in items)
        return f'<table class="kv">{body}</table>'


class Bar(Element):
    """Progress 0–100 % v barvě akcentu; `.value` (číslo) jde měnit za běhu.
    `label` připíše hodnotu za bar („63 %")."""

    kind = "bar"

    def __init__(self, window: Any, value: Any = 0, *, width: int = 160,
                 label: bool = True, **kw: Any) -> None:
        super().__init__(window, **kw)
        self.width, self.show_label = int(width), bool(label)
        self._value = self._clamp(value)

    @staticmethod
    def _clamp(value: Any) -> Any:
        try:
            pct = max(0.0, min(100.0, float(value)))
        except (TypeError, ValueError):
            pct = 0.0
        return int(pct) if pct == int(pct) else round(pct, 1)

    @property
    def value(self) -> Any:
        return self._value

    @value.setter
    def value(self, value: Any) -> None:
        self._value = self._clamp(value)
        self._touch()

    def inner(self) -> str:
        html = (f'<span class="vb-bar" style="width:{self.width}px">'
                f'<i style="width:{self._value}%"></i></span>')
        return html + (f" {self._value} %" if self.show_label else "")


class Radio(Field):
    """Přepínač – jedna z možností (hodnoty nebo dvojice (hodnota, popisek));
    `.value` je vybraná hodnota. Všechny volby sdílí `name`, změna → `on_change`."""

    kind = "radio"

    def __init__(self, window: Any, label: Any, options: Any, *, value: Any = None,
                 **kw: Any) -> None:
        super().__init__(window, label, value=value, **kw)
        self.options = [(o if isinstance(o, tuple) else (o, o)) for o in options]
        if value is None and self.options:
            self._value = str(self.options[0][0])
        else:
            self._value = self.coerce(value)

    def coerce(self, value: Any) -> Any:
        return "" if value is None else str(value)

    def css_class(self) -> str:
        return "vb-el vb-field vb-radios"

    def widget(self) -> str:
        return "".join(
            f'<label class="vb-radio"><input type="radio"'
            f'{_attrs(name=self.name, value=val, checked=(str(val) == str(self._value)))}'
            f'{self._tail()}> {_esc(text)}</label>'
            for val, text in self.options)

    def inner(self) -> str:                      # skupinový popisek bez `for`
        return f"<label>{_esc(self.label)}</label>{self.widget()}"


class Table(Element):
    """Tabulka s hlavičkou: `columns` + `rows` (seznam řádků); čísla se
    zarovnají vpravo. `.rows` jde přepsat za běhu (překreslí se tabulka)."""

    kind = "table"

    def __init__(self, window: Any, columns: Any, rows: Any, **kw: Any) -> None:
        super().__init__(window, **kw)
        self.columns = list(columns)
        self._rows = [list(r) for r in rows]

    @property
    def rows(self) -> Any:
        return self._rows

    @rows.setter
    def rows(self, rows: Any) -> None:
        self._rows = [list(r) for r in rows]
        self._touch()

    def inner(self) -> str:
        cols = self.columns
        rows = self._rows
        numeric = [bool(rows) and all(
            isinstance(r[i], (int, float)) and not isinstance(r[i], bool)
            for r in rows if i < len(r)) for i in range(len(cols))]
        head = "".join(f'<th{_NUM_CLASS if numeric[i] else ""}>{_esc(c)}</th>'
                       for i, c in enumerate(cols))
        body = "".join(
            "<tr>" + "".join(
                f'<td{_NUM_CLASS if i < len(numeric) and numeric[i] else ""}>{_esc(v)}</td>'
                for i, v in enumerate(r)) + "</tr>"
            for r in rows)
        return f"<table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>"


class Image(Element):
    """Obrázek: `src` je data: URI nebo URL (např. z `/static` serveru);
    `.src` jde měnit za běhu."""

    kind = "image"

    def __init__(self, window: Any, src: str, *, width: int | None = None,
                 alt: str = "", **kw: Any) -> None:
        super().__init__(window, **kw)
        self._src, self.width, self.alt = str(src), width, alt

    @property
    def src(self) -> str:
        return self._src

    @src.setter
    def src(self, value: str) -> None:
        self._src = str(value)
        self._touch()

    def inner(self) -> str:
        return f"<img{_attrs(src=self._src, alt=self.alt, width=self.width)}>"


class ListElement(Element):
    """Seznam položek (`.items`), odrážky nebo číslovaný (`.ordered`)."""

    kind = "list"

    def __init__(self, window: Any, items: Any, *, ordered: bool = False, **kw: Any) -> None:
        super().__init__(window, **kw)
        self._items = list(items)
        self._ordered = bool(ordered)

    @property
    def items(self) -> Any:
        return self._items

    @items.setter
    def items(self, items: Any) -> None:
        self._items = list(items)
        self._touch()

    @property
    def ordered(self) -> bool:
        return self._ordered

    @ordered.setter
    def ordered(self, value: bool) -> None:
        self._ordered = bool(value)
        self._touch()

    def inner(self) -> str:
        tag = "ol" if self._ordered else "ul"
        return f"<{tag}>{''.join(f'<li>{_esc(i)}</li>' for i in self._items)}</{tag}>"


class Rule(Element):
    """Vodorovná čára (oddělovač)."""

    kind = "hr"

    def inner(self) -> str:
        return "<hr>"


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
                f'{self._tail()}>')

    def inner(self) -> str:                      # u checkboxu je popisek za políčkem
        return f'{self.widget()} <label for="{_esc(self.id)}">{_esc(self.label)}</label>'


def render_elements(elements: list[Element], grid_cols: int | None) -> str:
    """Vykreslení všech prvků okna: pod sebou, nebo v mřížce (`grid(cols)`)."""
    body = "".join(el.render() for el in elements)
    if grid_cols is None:
        return body
    return (f'<div class="vb-grid" style="grid-template-columns:repeat({int(grid_cols)},1fr)">'
            f"{body}</div>")

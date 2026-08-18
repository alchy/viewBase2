"""vb.Ui – obsah HTML okna skládaný z Pythonu, bez psaní HTML.

Vývojář popisuje, CO v okně je (nadpis, tabulka klíč/hodnota, tlačítka,
formulář se sliderem…), knihovna z toho vygeneruje HTML nad boilerplate
stylem HTML okna (frontend/src/plugins/html_doc.js) – proto vše vypadá jako
ostatní okna a nic se nemusí stylovat. Veškerý text se escapuje, takže HTML
nikdy nevzniká „ručně"; úniková cesta je `ui.raw(...)` (inline) a
`ui.block(...)` (blok, např. vlastní `<style>`).

    ui = vb.Ui()
    ui.heading("Server 0", tag="server")
    ui.kv({"id": "srv-0", "stav": ui.ok("běží"), "zátěž": ui.bar(63)})
    ui.buttons(("Zaostřit", "focus", "srv-0"))
    f = ui.form("pridat", submit="Přidat")     # event "pridat" → event.values
    f.text("jmeno", "Název"); f.slider("prio", "Priorita", 3, min=1, max=5)
    graph.html_set("karta", ui)                # html_set/html_append berou Ui

Interakce zpět: tlačítko/odkaz → `event.event` + `event.value`; formulář →
`event.event` + `event.values` = {name: hodnota} s typy (slider/číslo →
číslo, checkbox → bool, select multiple → seznam) – prohlížeč je sestaví,
Python jen čte.

Dvě vrstvy metod:
- BLOKY (`heading`, `text`, `kv`, `table`, `list`, `buttons`, `form`, `grid`,
  `row`, `hr`, `pre`, `note`, `block`) se připojí do okna a vrací `self`
  (fluent řetězení).
- INLINE pomocníci (`ok`/`warn`/`err`, `tag`, `bar`, `code`, `link_inline`,
  `muted`, `button_inline`, `raw`) vrací hotový fragment (`Safe`), který se dá vložit do
  textu, buňky tabulky nebo řádku – a už se znovu neescapuje.
"""
from __future__ import annotations

from html import escape
from typing import Any, Iterable, Sequence

_NUM_CLASS = ' class="num"'   # v f-stringu nesmí být zpětné lomítko:
                                # PEP 701 to umí až od Pythonu 3.12, a
                                # knihovna slibuje 3.10+ (pyproject)



class Safe(str):
    """Už hotový HTML fragment – `_esc` ho nechá být. Vrací ho inline
    pomocníci a `raw`; jinde vzniká jen uvnitř téhle knihovny."""


def _esc(value: Any) -> str:
    if isinstance(value, Safe):
        return str(value)
    return escape(str(value), quote=True)


def _attrs(**kwargs: Any) -> str:
    """Atributy → ` a="b" c` (None/False se vynechá, True = holý atribut)."""
    parts = []
    for key, val in kwargs.items():
        if val is None or val is False:
            continue
        name = key.rstrip("_").replace("_", "-")   # class_ → class, data_x → data-x
        if val is True:
            parts.append(name)
        else:
            parts.append(f'{name}="{_esc(val)}"')
    return (" " + " ".join(parts)) if parts else ""


def _event_attrs(event: str | None, value: Any = None) -> str:
    return _attrs(data_vb_event=event, data_vb_value=None if value is None else str(value))


class Ui:
    """Builder obsahu HTML okna (viz docstring modulu)."""

    def __init__(self) -> None:
        self._blocks: list[str] = []

    # ---- výstup ---------------------------------------------------------

    def __str__(self) -> str:
        return "".join(str(b) for b in self._blocks)   # Grid/Form se vysází až teď

    def html(self) -> str:
        """Vygenerované HTML (totéž co `str(ui)`)."""
        return str(self)

    def _add(self, html: str) -> "Ui":
        self._blocks.append(html)
        return self

    # ---- bloky ----------------------------------------------------------

    def heading(self, text: Any, *, level: int = 2, tag: str | None = None) -> "Ui":
        """Nadpis (h1–h3); `tag` přidá štítek za text."""
        level = min(3, max(1, int(level)))
        suffix = f" {self.tag(tag)}" if tag else ""
        return self._add(f"<h{level}>{_esc(text)}{suffix}</h{level}>")

    def text(self, *parts: Any) -> "Ui":
        """Odstavec; části se spojí (text se escapuje, inline fragmenty ne)."""
        return self._add(f"<p>{''.join(_esc(p) for p in parts)}</p>")

    def note(self, *parts: Any) -> "Ui":
        """Drobný tlumený text (patička, poznámka)."""
        return self._add(f'<p class="small">{"".join(_esc(p) for p in parts)}</p>')

    def kv(self, rows: dict[Any, Any] | Iterable[tuple[Any, Any]]) -> "Ui":
        """Tabulka klíč/hodnota – vypadá jako detail okno (klíče v barvě klíčů)."""
        items = rows.items() if isinstance(rows, dict) else rows
        body = "".join(f"<tr><td>{_esc(k)}</td><td>{_esc(v)}</td></tr>" for k, v in items)
        return self._add(f'<table class="kv">{body}</table>')

    def table(self, columns: Sequence[Any], rows: Iterable[Sequence[Any]]) -> "Ui":
        """Tabulka s hlavičkou; číselné hodnoty (int/float) se zarovnají vpravo."""
        rows = [list(r) for r in rows]
        numeric = [all(isinstance(r[i], (int, float)) and not isinstance(r[i], bool)
                       for r in rows if i < len(r)) and bool(rows)
                   for i in range(len(columns))]
        head = "".join(f'<th{_NUM_CLASS if numeric[i] else ""}>{_esc(c)}</th>'
                       for i, c in enumerate(columns))
        body = "".join(
            "<tr>" + "".join(
                f'<td{_NUM_CLASS if i < len(numeric) and numeric[i] else ""}>{_esc(v)}</td>'
                for i, v in enumerate(r)) + "</tr>"
            for r in rows)
        return self._add(f"<table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>")

    def list(self, items: Iterable[Any], *, ordered: bool = False) -> "Ui":  # noqa: A003
        tag = "ol" if ordered else "ul"
        body = "".join(f"<li>{_esc(i)}</li>" for i in items)
        return self._add(f"<{tag}>{body}</{tag}>")

    def buttons(self, *specs: tuple) -> "Ui":
        """Řada tlačítek: každé jako (popisek, event) nebo (popisek, event, value)."""
        body = "".join(self.button_inline(*spec) for spec in specs)
        return self._add(f'<div class="vb-actions">{body}</div>')

    def button(self, label: Any, event: str, value: Any = None) -> "Ui":
        """Jedno tlačítko jako blok (klik → html_event)."""
        return self.buttons((label, event, value))

    def link(self, text: Any, event: str, value: Any = None) -> "Ui":
        """Odkaz jako blok; klik → html_event (nenaviguje)."""
        return self._add(self.link_inline(text, event, value))

    def row(self, *parts: Any) -> "Ui":
        """Jeden řádek (např. položka živého výpisu přes html_append):
        části oddělené mezerou; text se escapuje, fragmenty ne."""
        return self._add(f'<div class="vb-row">{" ".join(_esc(p) for p in parts)}</div>')

    def hr(self) -> "Ui":
        return self._add("<hr>")

    def pre(self, text: Any) -> "Ui":
        """Předformátovaný blok (výstup příkazu, JSON…) – jako terminál."""
        return self._add(f"<pre>{_esc(text)}</pre>")

    def block(self, html: str) -> "Ui":
        """Úniková cesta jako BLOK: vlastní HTML/CSS beze změny (frontend
        odstraní jen <script>/on*/javascript:), třeba `<style>` pro doladění."""
        return self._add(str(html))

    def grid(self, cols: int = 2) -> "Grid":
        """Jednoduchá mřížka: `g = ui.grid(cols=2); g.cell(...)`. Buňka bere
        Ui, fragment nebo text."""
        grid = Grid(cols)
        self._blocks.append(grid)   # Grid je str-podobný až při __str__ – držíme objekt
        return grid

    def form(self, event: str, *, submit: str | None = "Použít",
             value: Any = None) -> "Form":
        """Formulář: pole se přidávají na vrácený objekt; odeslání pošle
        html_event s `event` a `values` = {name: hodnota}. `submit` je
        popisek odesílacího tlačítka (None = bez něj, odešle Enter)."""
        form = Form(event, submit=submit, value=value)
        self._blocks.append(form)
        return form

    # ---- inline fragmenty ----------------------------------------------

    @staticmethod
    def raw(html: str) -> Safe:
        """Úniková cesta INLINE: fragment HTML, který se už neescapuje."""
        return Safe(str(html))

    @staticmethod
    def tag(text: Any) -> Safe:
        return Safe(f'<span class="vb-tag">{_esc(text)}</span>')

    @staticmethod
    def ok(text: Any) -> Safe:
        return Safe(f'<span class="vb-ok">{_esc(text)}</span>')

    @staticmethod
    def warn(text: Any) -> Safe:
        return Safe(f'<span class="vb-warn">{_esc(text)}</span>')

    @staticmethod
    def err(text: Any) -> Safe:
        return Safe(f'<span class="vb-err">{_esc(text)}</span>')

    @staticmethod
    def muted(text: Any) -> Safe:
        """Tlumený text (barva klíčů) – časy, popisky."""
        return Safe(f'<span class="vb-key">{_esc(text)}</span>')

    @staticmethod
    def code(text: Any) -> Safe:
        return Safe(f"<code>{_esc(text)}</code>")

    @staticmethod
    def bar(percent: float, *, width: int = 160, label: bool = True) -> Safe:
        """Progress bar 0–100 % v barvě akcentu; `label` připíše „63 %"."""
        pct = max(0, min(100, float(percent)))
        shown = int(pct) if pct == int(pct) else round(pct, 1)
        html = (f'<span class="vb-bar" style="width:{int(width)}px">'
                f'<i style="width:{shown}%"></i></span>')
        return Safe(html + (f" {shown} %" if label else ""))

    @staticmethod
    def link_inline(text: Any, event: str, value: Any = None) -> Safe:
        return Safe(f'<a href="#"{_event_attrs(event, value)}>{_esc(text)}</a>')

    @staticmethod
    def button_inline(label: Any, event: str, value: Any = None) -> Safe:
        return Safe(f"<button{_event_attrs(event, value)}>{_esc(label)}</button>")


class Grid:
    """Mřížka `ui.grid(cols)`; `cell(obsah)` přidá buňku (Ui, fragment, text)."""

    def __init__(self, cols: int) -> None:
        self.cols = max(1, int(cols))
        self._cells: list[str] = []

    def cell(self, *content: Any) -> "Grid":
        self._cells.append("".join(_esc(c) if not isinstance(c, (Ui, Grid, Form))
                                   else str(c) for c in content))
        return self

    def __str__(self) -> str:
        body = "".join(f'<div class="vb-cell">{c}</div>' for c in self._cells)
        return (f'<div class="vb-grid" style="grid-template-columns:repeat({self.cols},1fr)">'
                f"{body}</div>")


class Form:
    """Formulář `ui.form(event)`: pole = řádky tabulky klíč/hodnota (jako
    control okno). Hodnoty přijdou v `event.values` podle `name` s typy:
    text/textarea/select → str, number/slider → číslo, checkbox → bool."""

    def __init__(self, event: str, *, submit: str | None, value: Any) -> None:
        self.event = event
        self.submit_label = submit
        self.value = value
        self._rows: list[str] = []
        self._extra: list[str] = []   # tlačítka mimo tabulku

    def _field_id(self, name: str) -> str:
        return f"{self.event}-{name}"

    def _row(self, name: str, label: Any, widget: str) -> "Form":
        fid = self._field_id(name)
        self._rows.append(f'<tr><td><label for="{_esc(fid)}">{_esc(label)}</label></td>'
                          f"<td>{widget}</td></tr>")
        return self

    def text(self, name: str, label: Any, *, value: Any = "",
             placeholder: str | None = None) -> "Form":
        """Jednořádkové textové pole."""
        return self._row(name, label, f'<input type="text"{_attrs(id=self._field_id(name), name=name, value=value, placeholder=placeholder)}>')

    def number(self, name: str, label: Any, *, value: Any = 0, min: Any = None,  # noqa: A002
               max: Any = None, step: Any = None) -> "Form":  # noqa: A002
        """Číselné pole; v `event.values` přijde jako číslo."""
        return self._row(name, label, f'<input type="number"{_attrs(id=self._field_id(name), name=name, value=value, min=min, max=max, step=step)}>')

    def slider(self, name: str, label: Any, value: Any = 0, *, min: Any = 0,  # noqa: A002
               max: Any = 100, step: Any = 1) -> "Form":  # noqa: A002
        """Posuvník s živě zobrazenou hodnotou; v `event.values` číslo."""
        widget = (f'<input type="range"{_attrs(id=self._field_id(name), name=name, value=value, min=min, max=max, step=step)}>'
                  f' <output for="{_esc(name)}">{_esc(value)}</output>')
        return self._row(name, label, widget)

    def checkbox(self, name: str, label: Any, *, value: bool = False) -> "Form":
        """Zaškrtávátko; v `event.values` True/False."""
        return self._row(name, label, f'<input type="checkbox"{_attrs(id=self._field_id(name), name=name, checked=bool(value))}>')

    def select(self, name: str, label: Any, options: Iterable[Any], *,
               value: Any = None) -> "Form":
        """Výběr z možností: položky jsou hodnoty, nebo dvojice (hodnota, popisek)."""
        opts = []
        for opt in options:
            val, text = (opt if isinstance(opt, tuple) else (opt, opt))
            opts.append(f'<option{_attrs(value=val, selected=(value is not None and str(val) == str(value)))}>{_esc(text)}</option>')
        return self._row(name, label, f'<select{_attrs(id=self._field_id(name), name=name)}>{"".join(opts)}</select>')

    def textarea(self, name: str, label: Any, *, value: Any = "", rows: int = 3) -> "Form":
        return self._row(name, label, f'<textarea{_attrs(id=self._field_id(name), name=name, rows=int(rows))}>{_esc(value)}</textarea>')

    def button(self, label: Any, event: str, value: Any = None) -> "Form":
        """Tlačítko ve formuláři, které NEODESÍLÁ (klik → html_event)."""
        self._extra.append(f'<button type="button"{_event_attrs(event, value)}>{_esc(label)}</button>')
        return self

    def __str__(self) -> str:
        buttons = list(self._extra)
        if self.submit_label is not None:
            buttons.append(f'<button type="submit">{_esc(self.submit_label)}</button>')
        actions = f'<div class="vb-actions">{"".join(buttons)}</div>' if buttons else ""
        return (f"<form{_event_attrs(self.event, self.value)}>"
                f'<table class="kv">{"".join(self._rows)}</table>{actions}</form>')

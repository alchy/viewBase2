"""Klávesy do shellu jako jeden záznam, ne řádek na stisk.

Ladicí log každé události má smysl u všeho kromě `shell_input`: ten chodí po
JEDNOM ZNAKU, takže z něj vzniklo sto řádků `data: <1 znaků>` a mezi nimi
zapadlo všechno ostatní. Tady se znaky skládají per okno a ven jde jedna
dávka:

    [debug] shell 'sh' keys from 89.24.1.2 (14 s, 23 znaků):
            data='ls -la[arrow-up][ctrl-c][enter]'

KDY SE DÁVKA UZAVŘE (co nastane dřív):

- **plný buffer** (`max_chars`, výchozí 32 znaků) – stream kláves má být
  čitelný po řádcích, ne po odstavcích,
- **Enter** – co uživatel odeslal, patří k sobě; navíc to sedí na auditní
  stopu příkazů (`windows_mixin._log_shell_command`),
- **stáří** (`flush_after`) – kdo píše pomalu, nesmí zůstat viset v paměti;
  kontroluje se při každém vysílacím kroku (`GraphWindow.drain_actions`),
- **zavření okna** nebo konec relace – nedopsaná dávka se nesmí ztratit.

ZNAKY, KTERÉ NEJSOU TISKNUTELNÉ, se zapisují **popisem** – `[enter]`,
`[arrow-up]`, `[delete]`, `[ctrl-c]`. Hvězdička by řekla jen „něco tu bylo"
a stříškový zápis (`^[[A`) chce znalost ANSI. Do logu tak nejde žádný řídicí
znak, takže ESC sekvence nepřepíše terminál toho, kdo log čte (`log.sanitize`
je pojistka navíc).
"""
from __future__ import annotations

import time
from typing import Callable

#: Kolik znaků se nasbírá, než se dávka uzavře a začne nový řádek logu.
#: Malé schválně: stream kláves má být čitelný po řádcích, ne po odstavcích.
MAX_CHARS = 32
#: Jak dlouho smí dávka čekat na uzavření (s).
FLUSH_AFTER = 60.0

#: Víceznakové sekvence, které posílá terminál (šipky, Home/End, Delete…).
#: Zapisují se POPISEM, ne stříškou: `[arrow-up]` řekne, co se stalo,
#: `^[[A` chce znalost ANSI a hvězdička neřekne nic.
SEKVENCE = {
    "\x1b[A": "[arrow-up]", "\x1bOA": "[arrow-up]",
    "\x1b[B": "[arrow-down]", "\x1bOB": "[arrow-down]",
    "\x1b[C": "[arrow-right]", "\x1bOC": "[arrow-right]",
    "\x1b[D": "[arrow-left]", "\x1bOD": "[arrow-left]",
    "\x1b[H": "[home]", "\x1bOH": "[home]", "\x1b[1~": "[home]",
    "\x1b[F": "[end]", "\x1bOF": "[end]", "\x1b[4~": "[end]",
    "\x1b[2~": "[insert]",
    "\x1b[3~": "[delete]",
    "\x1b[5~": "[page-up]",
    "\x1b[6~": "[page-down]",
    "\x1b[Z": "[shift-tab]",
}

#: Jednotlivé řídicí znaky s vlastním jménem (zbytek dostane `[ctrl-x]`).
ZNAKY = {
    "\r": "[enter]", "\n": "[enter]", "\t": "[tab]",
    "\x7f": "[backspace]", "\x08": "[backspace]",
    "\x1b": "[esc]", "\x00": "[nul]",
}


def quoted(text: str) -> str:
    """Text do apostrofů – a apostrof uvnitř se nahradí popisem `[quote]`.

    Bez ohraničení nepozná parser (ani člověk), kde sekvence kláves končí a
    kde začíná zbytek řádku. A protože se apostrof uvnitř NEescapuje, ale
    pojmenuje, platí jednoduché pravidlo: mezi otevíracím a zavíracím
    apostrofem žádný další není. Escapování zpětným lomítkem by tuhle
    jistotu nedalo (`'it\\'s'` se dá přečíst dvěma způsoby podle toho,
    jestli parser escapy zná)."""
    return "'" + text.replace("'", "[quote]") + "'"


def describe(text: str) -> str:
    """Klávesy čitelně: `ls -la[enter]`, `[arrow-up][ctrl-c]`.

    Tisknutelné znaky zůstávají, ostatní dostanou JMÉNO. Do logu tak nejde
    žádný řídicí znak (ESC sekvence by přepsala terminál toho, kdo log čte)
    a přitom se neztratí informace – na rozdíl od hvězdiček."""
    out = []
    i = 0
    while i < len(text):
        for delka in (4, 3):                    # nejdřív delší sekvence
            usek = text[i:i + delka]
            if usek in SEKVENCE:
                out.append(SEKVENCE[usek])
                i += delka
                break
        else:
            znak = text[i]
            if znak in ZNAKY:
                out.append(ZNAKY[znak])
            elif ord(znak) < 0x20:              # 0x03 → [ctrl-c]
                out.append(f"[ctrl-{chr(ord(znak) + 0x60)}]")
            else:
                out.append(znak)
            i += 1
    return "".join(out)


class KeystrokeLog:
    """Nasbírané klávesy per okno; `emit(window_id, text, sekundy, znaků)`
    zavolá, až je dávka hotová.

    Nezamyká: volá se z handleru událostí jednoho okna a z vysílací smyčky,
    obojí pod zámkem GraphWindow."""

    def __init__(self, emit: Callable[[str, str, float, int], None], *,
                 max_chars: int = MAX_CHARS, flush_after: float = FLUSH_AFTER,
                 clock: Callable[[], float] = time.monotonic) -> None:
        self._emit = emit
        self.max_chars = int(max_chars)
        self.flush_after = float(flush_after)
        self._clock = clock
        self._buffer: dict[str, list[str]] = {}
        self._zacatek: dict[str, float] = {}

    def add(self, window_id: str, data: str) -> None:
        """Přidej klávesy okna; dávku uzavři po Enteru nebo po naplnění."""
        if not data:
            return
        buf = self._buffer.setdefault(window_id, [])
        if not buf:
            self._zacatek[window_id] = self._clock()
        buf.append(data)
        if any(z in data for z in "\r\n") or sum(map(len, buf)) >= self.max_chars:
            self.flush(window_id)

    def tick(self) -> None:
        """Uzavři dávky, které čekají dost dlouho (volá vysílací smyčka)."""
        ted = self._clock()
        for window_id in [w for w, t in self._zacatek.items()
                          if ted - t >= self.flush_after]:
            self.flush(window_id)

    def flush(self, window_id: str | None = None) -> None:
        """Uzavři dávku okna, nebo (bez argumentu) všechny."""
        for wid in ([window_id] if window_id is not None else list(self._buffer)):
            buf = self._buffer.pop(wid, None)
            zacatek = self._zacatek.pop(wid, None)
            if not buf:
                continue
            text = "".join(buf)
            self._emit(wid, describe(text),
                       (self._clock() - zacatek) if zacatek else 0.0, len(text))

    def __len__(self) -> int:
        return len(self._buffer)

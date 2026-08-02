"""ZÁKLAD: systémové LOG OKNO – nejjednodušší okno vůbec. Obsah dodává
knihovna sama (proces-wide log, `tail -f` ve stylu AmigaShell, bez close
gadgetu), vývojář ho jen EXPLICITNĚ umístí na screen: vb.LogWindow(screen=…).
Cokoli program zaloguje přes vb.log(), přiteče do něj s timestampem;
v Options (lišta screenu, když je log okno aktivní) jde filtrovat podle
úrovně i zdroje.

Pozn.: screen v1 potřebuje i grafové okno (frontend přes něj screen
materializuje) – tady je záměrně prázdné, hraje jen roli plochy."""
import itertools

import viewbase as vb

project = vb.Project(port=8080)          # 1. služba (fopen)
screen = vb.Screen(title="Log základ")   # 2. plocha
graph = vb.GraphWindow(screen=screen, title="Plocha",   # 3. okna…
                       theme="workbench-amiga")   # modrý WB 1.3 vzhled
vb.LogWindow(screen=screen)              #    …explicitní systémové log okno

_tik = itertools.count(1)


@graph.every(2.0)
def zapis() -> None:                     # 4. data: vb.log() teče do okna
    n = next(_tik)
    vb.log(f"tik {n}: běžím", level="debug" if n % 3 else "info")


project.serve(screen, open_browser=True)  # 5. start; Ctrl-C = close

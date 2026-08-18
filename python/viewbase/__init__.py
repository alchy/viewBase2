"""viewbase – pracovní prostředí ve stylu Amiga Workbench v prohlížeči,
ovládané z Pythonu: screeny (plochy) a na nich okna konkrétních typů.

Workflow (explicitní, jako práce se souborem – fopen … close):

    project = vb.Project(port=8080)        # 1. služba: porty před vším
    screen = vb.Screen(title="Moje síť")   # 2. plocha → dostane id
    graph = vb.GraphWindow(screen=screen)  # 3. okna: typované instance
    log = vb.LogWindow(screen=screen)      #    (log = systémové okno)
    graph.add_node("a", name="Alfa")       # 4. data přes instance oken
    project.serve(screen)                  # 5. start; stop() zavře port

Typy oken: GraphWindow (graf – speciální instance okna), LogWindow
(systémové, obsah dodává knihovna), TerminalWindow (textové, zapisuje se
do něj), ControlWindow (formulářové). ScreenMenu je pull-down menu lišty
screenu."""
from . import protocol
from .controls import ControlWindow, HtmlWindow, ShellWindow, TerminalWindow
from .graph_window import GraphWindow
from .log import LogWindow, log
from .menu import ScreenMenu
from .screen import Screen
from .tls import Tls
from .server import Project, ServerHandle, create_app, serve
from .ui import Ui

__all__ = ["Project", "Screen", "GraphWindow", "LogWindow", "ControlWindow", "HtmlWindow", "ShellWindow", "Ui", "Tls",
           "TerminalWindow", "ScreenMenu", "ServerHandle", "log",
           "create_app", "serve", "protocol"]
__version__ = "0.1.0"

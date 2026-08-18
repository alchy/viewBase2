"""Shell okno: skutečný terminál v prohlížeči (PTY + xterm.js).

V okně běží OPRAVDOVÝ shell operačního systému, ne aplikační konzole:
fungují barvy, kurzor, Ctrl-C i celoobrazovkové programy (`vim`, `htop`,
`mc`, `less`).

Bezpečnost (proto to nejde omylem vystavit ven):
 - okno se otevře ZAMČENÉ; proces se spustí až po zadání odemykacího kódu,
   který se vypíše sem do konzole serveru (důkaz, že máš přístup ke stroji,
   kde viewbase běží),
 - server poslouchá jen na 127.0.0.1 (výchozí `Project`/`serve`),
 - shell běží pod uživatelem, který spustil tenhle skript – systémový
   `login` se nepoužívá (bez rootu stejně nepřepne uživatele a na každém
   systému je jiný). Kdo chce jiného uživatele nebo kontejner, řekne si
   o něj příkazem:

       vb.ShellWindow("sh", command=["su", "-", "jina"])
       vb.ShellWindow("sh", command=["docker", "exec", "-it", "web", "bash"])
       vb.ShellWindow("logs", command=["journalctl", "-f"])

Spusť a v prohlížeči opiš kód z téhle konzole do okna „Shell".
"""
import viewbase as vb

project = vb.Project(port=8080)
screen = vb.Screen(title="Shell")
graph = vb.GraphWindow(screen=screen, title="Síť", theme="workbench-amiga")

with graph.batch():
    for i in range(6):
        graph.add_node(f"srv-{i}", label="{name}", name=f"Server {i}")
    for i in range(1, 6):
        graph.add_edge(f"srv-{i}", "srv-0")

# 1) interaktivní shell uživatele ($SHELL, jinak /bin/sh)
sh = vb.ShellWindow("sh", title="Shell", cols=100, rows=28, width=820, height=440)
graph.open_shell(sh)

# 2) druhé okno s konkrétním příkazem místo shellu – taky zamčené
top = vb.ShellWindow("top", title="Sledování procesů", command=["top"],
                     cols=100, rows=24, width=820, height=380)
graph.open_shell(top)

# log okno na screenu, ať je vidět, co se děje
vb.LogWindow(screen=screen)

project.serve(screen, open_browser=True)

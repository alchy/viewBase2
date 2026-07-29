"""Terminálové okno: konzole v prohlížeči, kterou obsluhuje Python.

Ukazuje čtyři věci, které spolu drží:
 - `TerminalWindow` + `open_terminal(on_input=…)` – okno s promptem; co
   uživatel napíše, přijde do handleru jako `event.line`,
 - `terminal_write` – zápis řádku do okna (server → prohlížeč),
 - druhé okno `input=False` jako živý log bez promptu,
 - `canvas.on("terminal_write", …)` + REST `/api/event` – push zvenčí:

     curl -s localhost:8080/api/event -H 'content-type: application/json' \\
          -d '{"event":"terminal_write","payload":{"text":"ahoj z curlu"}}'

Příkazy konzole: `pridej <id>`, `smaz <id>`, `barva <id> <#rrggbb>`,
`typ <id> server|db`, `kde <id>`, `pomoc`.
"""
import viewbase as vb

canvas = vb.Canvas(title="Terminál", theme="cyber", highlight_neighbors=1)
canvas.define_type("server", shape="box", color="#28d7fe", size=1.4)
canvas.define_type("db", shape="octahedron", color="#ff2a6d", size=1.6)

with canvas.batch():
    canvas.add_node("srv-0", type="server", label="{name}", name="Server 0")
    canvas.add_node("db-0", type="db", label="{name}", name="Hlavní DB")
    canvas.add_edge("srv-0", "db-0")

konzole = vb.TerminalWindow("konzole", title="Konzole grafu", prompt="graf> ")
log = vb.TerminalWindow("log", title="Log", input=False, width=420)

NAPOVEDA = ("pridej <id> | smaz <id> | barva <id> <#rrggbb> |"
            " typ <id> server|db | kde <id> | pomoc")


def zapis(text: str) -> None:
    """Odpověď do konzole i do logu (log je jen výstupní okno)."""
    canvas.terminal_write("konzole", text)
    canvas.terminal_write("log", text)


def prikaz(event) -> None:
    """Handler řádku z konzole – `event.line` je to, co uživatel odeslal."""
    slova = event.line.split()
    if not slova:
        return
    cmd, args = slova[0], slova[1:]
    try:
        if cmd == "pomoc":
            zapis(NAPOVEDA)
        elif cmd == "pridej" and args:
            canvas.ensure_node(args[0], label="{name}", name=args[0])
            canvas.ensure_edge(args[0], "srv-0")
            zapis(f"uzel {args[0]} připojen na srv-0")
        elif cmd == "smaz" and args:
            canvas.remove_node(args[0])          # kaskádou padnou i hrany
            zapis(f"uzel {args[0]} odebrán")
        elif cmd == "barva" and len(args) == 2:
            canvas.update_node(args[0], color=args[1])   # živá barva uzlu
            zapis(f"{args[0]} má barvu {args[1]}")
        elif cmd == "typ" and len(args) == 2:
            canvas.update_node(args[0], type=args[1])    # živá změna typu
            canvas.focus(args[0])
            zapis(f"{args[0]} je teď {args[1]}")
        elif cmd == "kde" and args:
            uzel = canvas.node(args[0])                  # čtení stavu
            zapis(f"{args[0]}: {uzel['meta'] if uzel else 'neexistuje'}")
        else:
            zapis(f"neznámý příkaz – {NAPOVEDA}")
    except ValueError as chyba:                  # chybné id, neznámý typ…
        zapis(f"chyba: {chyba}")


canvas.open_terminal(konzole, on_input=prikaz)
canvas.open_terminal(log)
zapis(NAPOVEDA)


def push_zvenku(event) -> None:
    """Vlastní event pro REST push: `/api/event` s event="terminal_write".
    Takhle do okna píše i něco, co o viewbase neví (cron, jiný proces)."""
    text = getattr(event, "text", None)
    if isinstance(text, str):
        canvas.terminal_write(getattr(event, "window_id", "log"), text)


# on() bere jméno eventu i handler (není dekorátor jako on_click)
canvas.on("terminal_write", push_zvenku)


vb.serve(canvas, port=8080, open_browser=True)

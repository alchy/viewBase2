"""Zabezpečená okna: `secured=True` na kterémkoli typu okna.

Zamčené okno se do prohlížeče pošle jen jako PRÁZDNÝ RÁM – obsah (HTML,
hodnoty polí, scrollback, shell) po drátě neputuje, dokud divák nezadá kód
v zelené výzvě ve stylu Guru Meditation.

Kód je TOTP z autentikátoru (Google Authenticator, MS Authenticator,
1Password…): při prvním spuštění se do KONZOLE SERVERU vypíše QR (ASCII) a
uloží se `~/.viewbase/workbench-totp.svg` – naskenuj a od té chvíle stačí
šestimístný kód z mobilu. Bez extra `pip install viewbase[mfa]` se použije
jednorázový kód, který se taky vypíše do konzole serveru.

Esc výzvu zruší a okno se neotevře; po obnovení stránky se nabídne znovu.
"""
import viewbase as vb

project = vb.Project(port=8080)
screen = vb.Screen(title="Secured")
graph = vb.GraphWindow(screen=screen, title="Síť", theme="workbench-amiga")
with graph.batch():
    for i in range(6):
        graph.add_node(f"srv-{i}", label="{name}", name=f"Server {i}")
    for i in range(1, 6):
        graph.add_edge(f"srv-{i}", "srv-0")

# zabezpečený panel z prvků (obsah po drátě neodejde, dokud se neodemkne)
panel = vb.HtmlWindow("panel", title="Tajný panel", width=420, height=220, secured=True)
graph.open_html(panel)
panel.heading("Přístupové údaje")
panel.kv({"účet": "workbench", "role": "admin", "token": "s3cr3t-42"})

# nezabezpečený panel pro srovnání
open_panel = vb.HtmlWindow("open", title="Veřejný panel", width=380, height=160)
graph.open_html(open_panel)
open_panel.label("Tenhle obsah je vidět hned.")

sh = vb.ShellWindow("sh", title="Shell", cols=90, rows=22, width=760, height=380)
graph.open_shell(sh)
vb.LogWindow(screen=screen)
project.serve(screen, open_browser=True)

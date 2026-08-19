"""Uživatelé, skupiny a přístup: kdo která plocha a okno se týkají.

Dvě plochy, každá pro jinou skupinu, a jedno okno, které vidí víc lidí, než
do něj smí psát. Než to spustíš, založ uživatele – aplikace to nedělá
(identity patří konfiguraci, ne kódu):

    python -m viewbase.admin adduser hana  --groups mzdy
    python -m viewbase.admin adduser karel --groups sklad
    python -m viewbase.admin group ucetni --add mzdy

`hana` je ve mzdách, tím pádem i účetní (členství se propaguje nahoru), a
uvidí plochu „Účtárna". `karel` uvidí jen „Sklad". Nikdo neuvidí to druhé –
a nedostane to ani po drátě, není to jen schované v prohlížeči.

Přihlašuje se jménem a kódem z autentikátoru; QR najdeš v `~/.viewbase/`.
"""
import viewbase as vb

# Pojmenované plochy: pod tímhle id je zná i soubor politiky, takže se práva
# dají opravit bez zásahu do programu (`python -m viewbase.admin access …`).
uctarna = vb.Screen(title="Účtárna", id="uctarna", access=["group:ucetni"])
sklad = vb.Screen(title="Sklad", id="sklad", access=["group:sklad"])

uc_graf = vb.GraphWindow(screen=uctarna, title="Faktury")
uc_graf.add_node("f1", name="FA 2026/001")
uc_graf.add_node("f2", name="FA 2026/002")
uc_graf.add_edge("f1", "f2")

# Okno bez vlastního ACL dědí z plochy – vidí ho celá účtárna.
prehled = vb.HtmlWindow("prehled", title="Přehled", width=380, height=180)
uc_graf.open_html(prehled)
prehled.label("Nezaplaceno: 3 faktury")

# Privátní okno chce navíc kód, i po členovi správné skupiny: členství říká
# „tohle tě smí zajímat", kód říká „a teď jsi to opravdu ty".
mzdy = vb.HtmlWindow("mzdy", title="Mzdy", width=380, height=180,
                     private=True, access=["group:mzdy"])
uc_graf.open_html(mzdy)
mzdy.label("Hrubá mzda: 42 000 Kč")

sk_graf = vb.GraphWindow(screen=sklad, title="Zásoby")
sk_graf.add_node("a", name="Regál A")

# Vidí celý sklad, zapisovat smí jen jeden člověk (nenastavené `write` by
# jinak znamenalo totéž co „vidět").
inventura = vb.HtmlWindow("inventura", title="Inventura", width=380, height=180)
sk_graf.open_html(inventura)
inventura.access.write.set(["user:karel"])
inventura.label("Poslední inventura: 2026-08-01")

vb.LogWindow(screen=uctarna)          # auditní stopa – jen pro účtárnu

if __name__ == "__main__":
    # Výchozí `default_access` je `group:users`, takže anonymní divák nevidí
    # nic a dostane přihlašovací výzvu.
    project = vb.Project(port=8080, log_level="info")
    project.serve(uctarna, sklad)

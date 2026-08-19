"""Uživatelé, skupiny a jejich rekurzivní členství.

Skupina deklaruje, co OBSAHUJE (`members`), a členství se propaguje nahoru:
kdo je ve `fakturaci`, je i `ucetni`. Rozbaluje to provider, takže jádro
vidí plochou množinu a autorizace zůstává jeden průnik."""
import json

import pytest

from viewbase import identity, mfa
from viewbase.access import ADMINISTRATOR, USERS
from viewbase.identity import LocalProvider, expand_groups

pyotp = pytest.importorskip("pyotp")


@pytest.fixture(autouse=True)
def _domov(tmp_path, monkeypatch):
    monkeypatch.setenv("VIEWBASE_HOME", str(tmp_path))
    mfa.reset_state()
    identity.reset()
    yield tmp_path
    mfa.reset_state()
    identity.reset()


CLENSTVI = {
    "group:ucetni": ["group:fakturace", "group:mzdy"],
    "group:mzdy": ["user:hana"],
    "group:vedeni": ["group:ucetni"],
}


# ---- rozbalení ------------------------------------------------------------

def test_clenstvi_se_propaguje_nahoru():
    """Kdo je v podskupině, je i v nadřazené – co povolím účetním, mají i
    fakturantky."""
    assert expand_groups(["group:fakturace"], CLENSTVI) == {
        "group:fakturace", "group:ucetni", "group:vedeni"}


def test_clovek_vypsany_primo_u_skupiny():
    """`"group:mzdy": ["user:hana"]` – bez sahání do jejího záznamu."""
    assert expand_groups(["user:hana"], CLENSTVI) == {
        "group:mzdy", "group:ucetni", "group:vedeni"}


def test_user_principal_neni_skupina():
    assert all(g.startswith("group:") for g in expand_groups(["user:hana"], CLENSTVI))


def test_cyklus_nezacykli():
    """`a` obsahuje `b`, `b` obsahuje `a` – běžná chyba v konfiguraci."""
    kruh = {"group:a": ["group:b"], "group:b": ["group:a"]}
    assert expand_groups(["group:a"], kruh) == {"group:a", "group:b"}


def test_bez_hierarchie_zustanou_skupiny_ploche():
    assert expand_groups(["group:users"], {}) == {"group:users"}


# ---- lokální provider -----------------------------------------------------

def _zapis(domov, users, groups=None):
    data = {"version": 2, "users": users}
    if groups is not None:
        data["groups"] = groups
    (domov / "users.json").write_text(json.dumps(data), "utf-8")


def test_provider_rozbali_skupiny_ze_souboru(_domov):
    _zapis(_domov,
           {"jana": {"totp_secret": "X", "groups": ["group:ucetni"]},
            "hana": {"totp_secret": "Y", "groups": ["group:users"]}},
           {"group:ucetni": {"members": ["group:fakturace", "group:mzdy"]},
            "group:mzdy": {"members": ["user:hana"]}})
    p = LocalProvider()
    assert p.groups_of("jana") == {"group:ucetni"}
    # hana je vypsaná u mezd → je i účetní, i když má v záznamu jen users
    assert p.groups_of("hana") == {"group:users", "group:mzdy", "group:ucetni"}


def test_kratky_zapis_bez_members(_domov):
    _zapis(_domov, {"jana": {"groups": ["group:fakturace"]}},
           {"group:ucetni": ["group:fakturace"]})
    assert LocalProvider().groups_of("jana") == {"group:fakturace", "group:ucetni"}


def test_uzivatel_bez_skupin_dostane_zakladni(_domov):
    _zapis(_domov, {"jana": {"totp_secret": "X"}})
    assert LocalProvider().groups_of("jana") == {USERS}


def test_prvni_uzivatel_je_spravce(_domov):
    """Instance musí mít někoho, kdo se dostane všude, jinak by se první
    zabezpečené okno nedalo otevřít vůbec."""
    mfa.ensure_user("workbench")
    mfa.ensure_user("hana")
    users = mfa.load_users()
    assert users["workbench"]["groups"] == [ADMINISTRATOR]
    assert users["hana"]["groups"] == [USERS]


# ---- přihlášení -----------------------------------------------------------

def test_login_overi_kod_a_vrati_skupiny(_domov):
    zaznam = mfa.ensure_user("workbench")
    kod = pyotp.TOTP(zaznam["totp_secret"]).now()
    assert identity.login("workbench", kod) == {ADMINISTRATOR}


def test_login_neprojde_se_spatnym_kodem_ani_neznamym_jmenem(_domov):
    mfa.ensure_user("workbench")
    assert identity.login("workbench", "000000") is None
    assert identity.login("neznamy", "123456") is None
    assert identity.login("", "") is None


def test_zapis_uzivatelu_nesmi_smazat_skupiny_ani_prava(_domov):
    """Tři vlastníci, jeden soubor: zápis jedné sekce nesmí přepsat zbytek.

    Naivní „ulož si svoje" by po prvním přihlášení smazalo hierarchii skupin
    i práva objektů – tichá ztráta celé politiky."""
    mfa.save_users({"hana": {"totp_secret": "X", "groups": ["group:mzdy"]}})
    mfa.update_section("groups", {"group:ucetni": {"members": ["group:mzdy"]}})
    identity.policy.save({"screen:provoz": {"see": ["group:ucetni"]}})

    mfa.save_users({**mfa.load_users(),                   # další zápis uživatelů
                    "karel": {"totp_secret": "Y", "groups": ["group:users"]}})

    data = json.loads((_domov / "users.json").read_text())
    assert data["version"] == 2
    assert set(data["users"]) == {"hana", "karel"}
    assert data["groups"] == {"group:ucetni": {"members": ["group:mzdy"]}}
    assert data["access"] == {"screen:provoz": {"see": ["group:ucetni"]}}
    assert LocalProvider().groups_of("hana") == {"group:mzdy", "group:ucetni"}


# ---- zásuvnost: dvě různé osy --------------------------------------------

def test_vlastni_provider_identit_staci_implementovat_tri_metody(_domov):
    """LDAP/OIDC se přidá bez zásahu do jádra – jádro se ptá jen takhle."""
    class FakeLdap:
        def exists(self, username):
            return username in {"jana", "karel"}

        def authenticate(self, username, secret):
            return self.exists(username) and secret == "z-adresare"

        def groups_of(self, username):
            return {"group:ucetni", "group:zamestnanci"}

    identity.configure(FakeLdap())
    assert identity.login("jana", "spatne") is None
    assert identity.login("jana", "z-adresare") == {"group:ucetni", "group:zamestnanci"}
    assert identity.login("nikdo", "z-adresare") is None


def test_prava_objektu_jsou_druha_osa_a_prebijeji_kod(_domov):
    """LDAP nikdy nebude vědět nic o našich oknech: identity se vymění,
    práva zůstávají naše doména – a soubor politiky přebije kód, aby se
    špatné ACL dalo opravit bez nasazení."""
    from viewbase import access

    mfa.ensure_user("workbench")
    identity.policy.save({"screen:provoz": {"see": ["group:ucetni"]}})
    identity.configure_policy(None)                  # načte ze souboru

    a = access.Access(see=["group:public"], object_id="screen:provoz")
    assert a.effective_see({USERS}) == {"group:ucetni"}
    b = access.Access(see=["group:public"], object_id="screen:jine")
    assert b.effective_see({USERS}) == {"group:public"}   # bez override platí kód
    access.reset_default()


def test_prava_se_zapisuji_do_tehoz_souboru(_domov):
    """Řízení i zápis v jednom JSON objektu, na který ukazuje konfigurace."""
    mfa.ensure_user("workbench")
    identity.policy.save({"screen:provoz": {"see": ["group:users"]}})
    data = json.loads((_domov / "users.json").read_text())
    assert data["version"] == 2                      # uživatelé nezmizeli
    assert "workbench" in data["users"]
    assert data["access"]["screen:provoz"]["see"] == ["group:users"]


def test_cesta_k_souboru_je_z_konfigurace(tmp_path, monkeypatch):
    """`vb.Project(users_file=…)` – politika může ležet mimo domov
    (/etc/viewbase, připojený svazek kontejneru)."""
    jinde = tmp_path / "politika" / "users.json"
    monkeypatch.setattr(mfa, "_store_override", None)
    try:
        assert mfa.configure_store(jinde) == jinde
        mfa.ensure_user("workbench")
        assert jinde.is_file()
        assert LocalProvider().exists("workbench")
    finally:
        mfa.configure_store(None)
        monkeypatch.setattr(mfa, "_store_override", None)


def test_soubezne_zapisy_si_sekce_neprepisou(_domov):
    """Jediná autorita nad souborem znamená i serializaci: čti-uprav-zapiš
    ze dvou vláken se nesmí prolnout tak, že jedna změna zmizí."""
    import threading

    mfa.save_users({"hana": {"totp_secret": "X"}})
    hotovo = threading.Barrier(3)

    def zapis(sekce, hodnota):
        hotovo.wait()
        for _ in range(20):
            mfa.update_section(sekce, hodnota)

    vlakna = [threading.Thread(target=zapis, args=a) for a in (
        ("groups", {"group:ucetni": {"members": ["group:mzdy"]}}),
        ("access", {"screen:provoz": {"see": ["group:ucetni"]}}))]
    for v in vlakna:
        v.start()
    hotovo.wait()
    for v in vlakna:
        v.join()

    data = json.loads((_domov / "users.json").read_text())
    assert set(data["users"]) == {"hana"}                 # nikdo nepřišel
    assert data["groups"] and data["access"]              # ani jedna sekce


def test_neznama_skupina_v_ACL_se_ohlasi_do_logu(_domov):
    """Aplikace jmenuje principály na svých prvcích; jestli existují, ví
    zdroj identit – a překlep musí být vidět."""
    from viewbase import access
    from viewbase.log import bus

    _zapis(_domov, {"jana": {"groups": ["group:ucetni"]}})
    identity.configure(LocalProvider())                   # dosadí ověřovač
    sebrane = []
    bus.subscribe(sebrane.append)
    try:
        okno = access.Access(object_id="window:mzdy")
        okno.see.add("group:ucetni")                      # existuje
        okno.see.add("user:jana")                         # existuje
        okno.see.add("group:ucetnii")                     # překlep
        okno.see.add("user:jarmila")                      # neexistující člověk
    finally:
        bus.unsubscribe(sebrane.append)
        access.set_validator(None)

    varovani = [z.message for z in sebrane if z.level == "warning"]
    assert len(varovani) == 2
    assert any("group:ucetnii" in t for t in varovani)
    assert any("user:jarmila" in t for t in varovani)

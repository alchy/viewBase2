"""Model přístupu: principálové, ACL, dvě slovesa, dědičnost.

Čistá logika bez serveru – celá autorizace stojí na těchhle funkcích, takže
se testují samy o sobě a ne přes okna."""
import pytest

from viewbase.access import (ADMINISTRATOR, PUBLIC, USERS, Access, Acl,
                             allowed, configure_default, principal,
                             reset_default, user_principals)


@pytest.fixture(autouse=True)
def _vychozi():
    reset_default()
    yield
    reset_default()


# ---- principálové ---------------------------------------------------------

def test_bez_prefixu_je_to_skupina():
    """API se píše ručně; tiché selhání kvůli chybějícímu prefixu by
    znamenalo omylem otevřené okno."""
    assert principal("users") == "group:users"
    assert principal("group:users") == "group:users"
    assert principal("user:jindrich") == "user:jindrich"


@pytest.mark.parametrize("spatny", ["", "  ", "user:", "group:", "user:a:b"])
def test_neplatny_principal_se_odmitne(spatny):
    with pytest.raises(ValueError):
        principal(spatny)


def test_uzivatel_ma_vzdy_vlastni_skupinu():
    p = user_principals("jindrich", ["group:operatori"])
    assert p == {"user:jindrich", "group:jindrich", "group:operatori", PUBLIC}


def test_anonymni_relace_ma_jen_public():
    assert user_principals(None) == {PUBLIC}
    assert user_principals("", ["group:admin"]) == {PUBLIC}


# ---- vyhodnocení ----------------------------------------------------------

def test_povoleni_je_prunik():
    p = user_principals("hana", ["group:users"])
    assert allowed(p, {USERS}) is True
    assert allowed(p, {"user:hana"}) is True
    assert allowed(p, {ADMINISTRATOR}) is False
    assert allowed(p, set()) is False          # nikdo


# ---- ACL ------------------------------------------------------------------

def test_acl_rozlisuje_nenastaveno_a_nikdo():
    dedi = Acl()
    assert not dedi.is_set and dedi.list() == []
    nikdo = Acl().clear()
    assert nikdo.is_set and nikdo.list() == []   # platné nastavení, ne dědění


def test_acl_add_remove_list():
    acl = Acl(["group:users"])
    acl.add("user:jindrich", "operatori")
    assert acl.list() == ["group:operatori", "group:users", "user:jindrich"]
    acl.remove("group:users")
    assert "group:users" not in acl and "user:jindrich" in acl
    assert len(acl) == 2


def test_remove_na_nenastavenem_nic_nedela():
    """Nenastavené ACL dědí – odebrání by z něj udělalo prázdné (= nikdo),
    což je něco úplně jiného."""
    acl = Acl()
    acl.remove("group:public")
    assert not acl.is_set


# ---- dědičnost a slovesa --------------------------------------------------

def test_bez_vlastniho_acl_se_dedi():
    a = Access()
    assert a.effective_see({USERS}) == {USERS}
    assert a.can_see(user_principals("hana", [USERS]), {USERS}) is True
    assert a.can_see(user_principals(None), {USERS}) is False   # anonym ne


def test_vlastni_acl_prebije_dedeni():
    a = Access(see=["group:mzdy"])
    assert a.effective_see({USERS}) == {"group:mzdy"}
    assert a.can_see(user_principals("hana", [USERS]), {USERS}) is False
    assert a.can_see(user_principals("hana", ["group:mzdy"]), {USERS}) is True


def test_write_bez_nastaveni_kopiruje_read_ne_rodice():
    """Kdyby se `write` dědil zvlášť, dalo by se zúžit „vidět" a přitom
    nechat „psát" široké – tichý rozpor, který by nikdo nečekal."""
    a = Access(see=["group:mzdy"])
    assert a.effective_write({USERS}) == {"group:mzdy"}
    assert a.can_use(user_principals("hana", [USERS]), {USERS}) is False


def test_verejny_log_ktery_meni_jen_admin():
    """Kvůli tomuhle jsou slovesa dvě."""
    a = Access(see=[PUBLIC], write=[ADMINISTRATOR])
    anonym = user_principals(None)
    admin = user_principals("workbench", [ADMINISTRATOR])
    assert a.can_see(anonym, {USERS}) and not a.can_use(anonym, {USERS})
    assert a.can_see(admin, {USERS}) and a.can_use(admin, {USERS})


# ---- výchozí hodnota instance --------------------------------------------

def test_vychozi_je_group_users_ne_public():
    """Default-open by vystavil log okno s auditní stopou dřív, než by si
    toho kdokoli všiml."""
    from viewbase import access

    assert access.DEFAULT_ACCESS == {USERS}


def test_instance_si_default_muze_prepsat():
    from viewbase import access

    assert configure_default([PUBLIC]) == {PUBLIC}
    assert access.DEFAULT_ACCESS == {PUBLIC}
    configure_default(None)                     # None = neměnit
    assert access.DEFAULT_ACCESS == {PUBLIC}

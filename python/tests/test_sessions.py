"""Relace a granty k zabezpečeným oknům (viewbase/sessions.py).

Čistá logika bez serveru: kdo co smí vidět, kdy to vyprší a co odvolání
udělá. Čas se vstřikuje, takže se testuje expirace bez čekání."""
import pytest

from viewbase.sessions import SessionStore, new_sid


class Hodiny:
    def __init__(self):
        self.t = 1000.0

    def __call__(self):
        return self.t

    def posun(self, o):
        self.t += o


@pytest.fixture
def hodiny():
    return Hodiny()


@pytest.fixture
def store(hodiny):
    return SessionStore(ttl=100, max_age=1000, clock=hodiny)


def test_sid_je_neuhodnutelne_a_pokazde_jine():
    a, b = new_sid(), new_sid()
    assert a != b and len(a) >= 32


def test_bez_grantu_relace_nevidi_nic(store):
    sid = store.touch(None)
    assert store.has(sid, "mzdy") is False
    assert store.has(None, "mzdy") is False


def test_grant_plati_jen_pro_svou_relaci_a_sve_okno(store):
    a = store.touch(None)
    b = store.touch(None)
    store.grant(a, "mzdy")
    assert store.has(a, "mzdy") is True
    assert store.has(b, "mzdy") is False        # druhý divák obsah nevidí
    assert store.has(a, "shell") is False       # ani jiné okno téže relace
    assert store.sids_with("mzdy") == [a]


def test_klouzava_platnost_vyprsi_bez_aktivity(store, hodiny):
    sid = store.touch(None)
    store.grant(sid, "mzdy")
    hodiny.posun(99)
    assert store.has(sid, "mzdy") is True
    hodiny.posun(2)                              # 101 s bez aktivity
    assert store.has(sid, "mzdy") is False
    assert store.known(sid) is False


def test_aktivita_platnost_posouva(store, hodiny):
    sid = store.touch(None)
    store.grant(sid, "mzdy")
    for _ in range(5):
        hodiny.posun(90)
        assert store.touch(sid) == sid           # provoz relaci drží naživu
    assert store.has(sid, "mzdy") is True


def test_absolutni_strop_plati_i_pri_stalem_provozu(store, hodiny):
    """Relace se nedá držet naživu donekonečna – po stropu zase autentikátor."""
    sid = store.touch(None)
    store.grant(sid, "mzdy")
    for _ in range(20):
        hodiny.posun(60)
        store.touch(sid)
    assert store.has(sid, "mzdy") is False       # 1200 s > max_age 1000
    assert store.touch(sid) != sid               # a dostane NOVOU prázdnou relaci


def test_vyprsene_sid_se_neozivi(store, hodiny):
    """Jinak by stačilo staré id schovat a po vypršení se vrátit ke grantům."""
    sid = store.touch(None)
    store.grant(sid, "mzdy")
    hodiny.posun(200)
    nove = store.touch(sid)
    assert nove != sid
    assert store.has(nove, "mzdy") is False


def test_odvolani_je_okamzite(store):
    a, b = store.touch(None), store.touch(None)
    store.grant(a, "mzdy"); store.grant(b, "mzdy"); store.grant(a, "shell")

    store.revoke(a, "mzdy")                      # Lock Window jedné relace
    assert store.has(a, "mzdy") is False
    assert store.has(b, "mzdy") is True          # druhého se to netýká
    assert store.has(a, "shell") is True

    store.revoke_window("mzdy")                  # zamčeno pro všechny
    assert store.sids_with("mzdy") == []

    store.forget(a)                              # logout
    assert store.known(a) is False and store.has(a, "shell") is False


def test_stats_pro_log(store):
    sid = store.touch(None)
    store.grant(sid, "a"); store.grant(sid, "b")
    assert store.stats() == {"sessions": 1, "grants": 2}


def test_neplatne_lhuty_se_odmitnou():
    with pytest.raises(ValueError):
        SessionStore(ttl=0)
    with pytest.raises(ValueError):
        SessionStore(max_age=-1)

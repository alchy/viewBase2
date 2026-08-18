"""Životní cyklus relace v logu a vynucení grantu u KAŽDÉ zprávy.

Dvě věci, které spolu souvisí: když relace vyprší, musí to jít z logu poznat
(jinak se nedá vysvětlit, proč si okno najednou zase řeklo o kód), a vypršení
musí být opravdu vidět i na tom, co server přijme."""
import time

import pytest

from viewbase import GraphWindow, HtmlWindow, ShellWindow, mfa, sessions
from viewbase.log import bus
from viewbase.logger import logger
from viewbase.sessions import SessionStore


@pytest.fixture(autouse=True)
def _prostredi(monkeypatch, tmp_path):
    monkeypatch.setenv("VIEWBASE_HOME", str(tmp_path))
    monkeypatch.setattr(mfa, "available", lambda: False)
    puvodni = logger.level
    logger.level = "debug"                     # ladicí stopa se testuje taky
    sessions.reset()
    yield
    logger.level = puvodni
    sessions.reset()


@pytest.fixture
def zaznamy():
    sebrane = []
    bus.subscribe(sebrane.append)
    yield sebrane
    bus.unsubscribe(sebrane.append)


def _texty(zaznamy):
    return "\n".join(z.message for z in zaznamy)


def test_vyprseni_relace_je_v_logu(zaznamy):
    cas = [1000.0]
    store = SessionStore(ttl=100, max_age=1000, clock=lambda: cas[0])
    sid = store.touch(None)
    store.grant(sid, "mzdy")
    cas[0] += 101
    store.touch(None)                          # cokoli spustí úklid
    vyprseni = [z for z in zaznamy if "session expired" in z.message]
    assert vyprseni, _texty(zaznamy)
    assert vyprseni[0].session == sid[:8]        # „kdo" je sloupec, ne text
    assert "idle" in vyprseni[0].message and "1 grants revoked" in vyprseni[0].message


def test_absolutni_strop_se_pozna_od_neaktivity(zaznamy):
    cas = [1000.0]
    store = SessionStore(ttl=100, max_age=200, clock=lambda: cas[0])
    sid = store.touch(None)
    for _ in range(4):                         # aktivita drží relaci naživu…
        cas[0] += 60                           # …ale po 240 s narazí na strop
        store.touch(sid)
    text = _texty(zaznamy)
    assert "max age" in text and "idle" not in text.split("max age")[0][-60:]


def test_predlozena_vyprsela_relace_jde_do_auditu(zaznamy):
    sessions.store.touch("uz-neexistuje", origin="89.24.1.2")   # origin = IP
    zaznam = [z for z in zaznamy if "stale session" in z.message]
    assert zaznam and zaznam[0].component == "security"
    assert zaznam[0].ip == "89.24.1.2"           # „odkud" je sloupec


def test_vstup_do_okna_bez_grantu_se_odmitne_a_zaloguje(zaznamy):
    """NALEZENO PŘI KONTROLE: `shell_input` grant neověřoval vůbec – stačilo
    se připojit a psát do shellu, který odemkl někdo jiný."""
    c = GraphWindow()
    w = ShellWindow("sh", command=["/bin/bash", "--norc", "-i"])
    c.open_shell(w)
    majitel = sessions.store.touch(None)
    c.dispatch_event("window_unlock", {"window_id": "sh", "code": w.fallback_code,
                                       "sid": majitel})
    konec = time.time() + 6
    while time.time() < konec and not (w.pty and w.pty.alive):
        time.sleep(0.05)
    assert w.pty and w.pty.alive

    cizi = sessions.store.touch(None)          # jiná relace, bez grantu
    c.dispatch_event("shell_input", {"window_id": "sh", "data": "whoami\n",
                                     "sid": cizi, "remote_ip": "89.24.1.2"})
    time.sleep(0.4)
    odmitnuti = [z for z in zaznamy if "refused" in z.message]
    assert odmitnuti, "vstup bez grantu prošel!"
    assert "no grant" in odmitnuti[0].message
    assert odmitnuti[0].ip == "89.24.1.2"
    assert "whoami" not in w.scrollback         # do procesu se nic nedostalo
    c.close_window("sh")
    c.close()


def test_vyprsela_relace_uz_do_okna_nepise(zaznamy):
    c = GraphWindow()
    w = HtmlWindow("panel", secured=True)
    w.label("tajné")
    c.open_html(w)
    sid = sessions.store.touch(None)
    c.dispatch_event("window_unlock", {"window_id": "panel", "code": w.fallback_code,
                                       "sid": sid})
    time.sleep(0.3)
    assert sessions.store.has(sid, "panel")

    sessions.reset()                            # jako by relace vypršela
    c.dispatch_event("html_event", {"window_id": "panel", "event": "klik",
                                    "sid": sid, "remote_ip": "89.24.1.2"})
    time.sleep(0.3)
    odmitnuti = [z for z in zaznamy if "refused" in z.message]
    assert odmitnuti and "expired or unknown session" in odmitnuti[-1].message
    c.close()


def test_shell_new_ma_strop_a_zaznam(zaznamy):
    """System → Shell CLI je otevřená každému připojenému: okno vzniká
    zamčené (bez kódu se z něj nic nespustí), ale vyrábět je donekonečna
    nesmí nikdo."""
    from viewbase.controls import ShellWindow as SW
    from viewbase.windows_mixin import WindowsMixin

    c = GraphWindow()
    for _ in range(WindowsMixin.MAX_SHELL_WINDOWS + 3):
        c.dispatch_event("shell_new", {"sid": "x", "remote_ip": "89.24.1.2"})
    time.sleep(0.6)
    assert len(c._reg.of_kind(SW)) == WindowsMixin.MAX_SHELL_WINDOWS  # noqa: SLF001
    odmitnuti = [z for z in zaznamy if "shell_new refused" in z.message]
    assert odmitnuti and odmitnuti[0].ip == "89.24.1.2"
    assert any("requested" in z.message for z in zaznamy)
    c.close()

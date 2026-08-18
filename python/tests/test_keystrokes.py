"""Klávesy do shellu se logují po dávkách, ne řádek na stisk."""
import pytest

from viewbase.keystrokes import KeystrokeLog, describe


class Hodiny:
    def __init__(self):
        self.t = 100.0

    def __call__(self):
        return self.t

    def posun(self, o):
        self.t += o


@pytest.fixture
def davky():
    return []


@pytest.fixture
def hodiny():
    return Hodiny()


@pytest.fixture
def log(davky, hodiny):
    return KeystrokeLog(lambda wid, text, sek, znaku: davky.append((wid, text, znaku)),
                        max_chars=10, flush_after=60, clock=hodiny)


def test_klavesy_se_popisuji_jmenem():
    """Hvězdička by řekla jen „něco tu bylo", `^[[A` chce znalost ANSI."""
    assert describe("ls -la\r") == "ls -la[enter]"
    assert describe("\x03") == "[ctrl-c]"
    assert describe("\x1b[A\x1b[B") == "[arrow-up][arrow-down]"
    assert describe("\x1b[3~") == "[delete]"
    assert describe("a\tb") == "a[tab]b"
    assert describe("x\x7f") == "x[backspace]"
    assert "\x1b" not in describe("\x1b[2J")      # do logu nejde řídicí znak


def test_znaky_se_sbiraji_a_enter_davku_uzavre(log, davky):
    for znak in "ls":                            # po jednom, jako z prohlížeče
        log.add("sh", znak)
    assert davky == []                           # nic se zatím nehlásí
    log.add("sh", "\r")
    assert davky == [("sh", "ls[enter]", 3)]


def test_plny_buffer_davku_uzavre(log, davky):
    log.add("sh", "x" * 12)                      # fixture má max_chars=10
    assert davky and davky[0][2] == 12


def test_stari_davku_uzavre_i_bez_enteru(log, davky, hodiny):
    """Kdo píše pomalu, nesmí zůstat viset v paměti."""
    log.add("sh", "po")
    hodiny.posun(30)
    log.tick()
    assert davky == []                           # ještě ne
    hodiny.posun(31)
    log.tick()
    assert davky == [("sh", "po", 2)]


def test_kazde_okno_ma_svou_davku(log, davky):
    log.add("sh", "ab")
    log.add("cli-1", "cd")
    log.flush()                                  # bez argumentu = všechna okna
    assert sorted(davky) == [("cli-1", "cd", 2), ("sh", "ab", 2)]


def test_flush_bez_obsahu_nic_nehlasi(log, davky):
    log.flush("sh")
    log.tick()
    assert davky == []

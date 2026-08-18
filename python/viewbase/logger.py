"""Logger knihovny: jedna třída, která rozhoduje, CO se vůbec zaznamená.

Dvě věci, které se pletly dohromady a teď jsou oddělené:

1. **Filtr v log okně** (frontend, `plugins/log.js`) je POHLED – divák si
   odškrtne úrovně a zdroje, které chce vidět. Nic tím nemění na tom, co
   aplikace zaznamenává; jiné okno na jiném screenu vidí dál všechno.
2. **Úroveň loggeru** (tady) je ZDROJ – co se vůbec vyrobí a rozešle.
   Nastavuje ji `vb.Project(log_level=…)` a dá se změnit za běhu
   (`project.log_level = "debug"`), typicky když se něco vyšetřuje.

AUDIT STOJÍ MIMO ÚROVEŇ. Bezpečnostní stopa – kdo se odkud připojil, kdo
odemkl okno, kdo hádal kód – se zaznamenává VŽDY, bez ohledu na `level`.
Kdyby ji šlo utišit nastavením, tak by na vystavené instanci stačilo
přehodit úroveň a zamést za sebou; a přesně kvůli téhle stopě se instance do
internetu vystavuje. Diagnostika (`debug`/`info`) se utišit dá – to je ta
upovídaná část, která na provozním serveru nikoho nezajímá.

    logger.debug("event 'shell_input' from 1.2.3.4")   # jen při log_level="debug"
    logger.warning("broadcast loop failed: …")         # od výchozí úrovně výš
    logger.audit("window 'mzdy' unlocked from 1.2.3.4")  # vždycky
"""
from __future__ import annotations

import logging
import time
from typing import Any

from .log import LOG_LEVELS, bus

#: Standardní Python logger – tudy tečou záznamy do stderr, tedy do
#: `docker logs`. Log okno v prohlížeči čte sběrnici (`log.bus`); tenhle
#: logger posílá TOTÉŽ i tam, aby se kontejner dal vyhodnocovat bez GUI.
_stdlib = logging.getLogger("viewbase")
_UROVNE_STDLIB = {"debug": logging.DEBUG, "info": logging.INFO,
                  "warning": logging.WARNING, "error": logging.ERROR}


def _ensure_handler() -> None:
    """Zajisti, že záznamy někam dotečou – v kontejneru na stdout.

    Bez handleru zahodí Python všechno pod WARNING a zbytek pošle přes
    „lastResort" bez formátu; v `docker logs` pak audit není vidět, což je
    přesně to, kvůli čemu se instance vystavuje a sleduje.

    Když si logování nastavuje aplikace sama (root logger má handler, nebo
    ho má přímo `viewbase`), NESAHÁME na to – knihovna nemá přebíjet
    konfiguraci hostitelské aplikace."""
    if _stdlib.handlers or logging.getLogger().handlers:
        return
    handler = logging.StreamHandler()          # stderr = stdout kontejneru
    # CELÉ razítko `YYYY-MM-DD HH:MM:SS` (uživatelský požadavek): log
    # instance, která běží dny, se vyhodnocuje zpětně – bez data se nepozná,
    # jestli „14:03:22 invalid code" bylo dnes, nebo předevčírem.
    handler.setFormatter(logging.Formatter(
        "%(asctime)s %(levelname)-7s viewbase %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"))
    _stdlib.addHandler(handler)
    # Prahem je NÁŠ `level` (audit ho obchází), stdlib proto pustí všechno.
    _stdlib.setLevel(logging.DEBUG)

#: Výchozí úroveň: provozní server má mlčet o rutině a mluvit o problémech.
#: Kdo vyšetřuje, přepne na `info`/`debug` (`vb.Project(log_level=…)`).
DEFAULT_LEVEL = "warning"

#: Pořadí pro porovnání (index = závažnost).
_PORADI = {uroven: i for i, uroven in enumerate(LOG_LEVELS)}


class Logger:
    """Zdroj záznamů knihovny s prahem závažnosti.

    Publikuje do sdíleného `log.bus`, odkud si je bere log okno v prohlížeči
    i server. Prahem prochází jen DIAGNOSTIKA; `audit()` jde vždycky."""

    def __init__(self, level: str = DEFAULT_LEVEL) -> None:
        _ensure_handler()
        self._level = DEFAULT_LEVEL
        self.level = level                      # projde validací v setteru

    # -- úroveň ------------------------------------------------------------

    @property
    def level(self) -> str:
        return self._level

    @level.setter
    def level(self, value: str) -> None:
        if value not in _PORADI:
            raise ValueError(
                f"neznámá úroveň logu '{value}' – povolené: {', '.join(LOG_LEVELS)}")
        self._level = value

    def enabled(self, level: str) -> bool:
        """Projde záznam téhle závažnosti prahem?"""
        return _PORADI.get(level, 99) >= _PORADI[self._level]

    # -- diagnostika (podléhá prahu) ---------------------------------------

    def log(self, level: str, message: str, *, source: str = "backend_program",
            component: str | None = None) -> None:
        """Záznam do OBOU cílů: sběrnice (log okno) i stderr (`docker logs`)."""
        if not self.enabled(level):
            return
        bus.publish(level, source, message, component=component)
        _stdlib.log(_UROVNE_STDLIB[level], "%s%s",
                    f"[{component}] " if component else "", message)

    def exception(self, message: str, *, component: str = "server") -> None:
        """Chyba i s tracebackem: traceback do stderr (patří do kontejnerového
        logu, ne do okna v prohlížeči), do okna jen text chyby."""
        _stdlib.exception(message)
        bus.publish("error", "backend_program", message, component=component)

    def debug(self, message: str, **kw: Any) -> None:
        self.log("debug", message, **kw)

    def info(self, message: str, **kw: Any) -> None:
        self.log("info", message, **kw)

    def warning(self, message: str, **kw: Any) -> None:
        self.log("warning", message, **kw)

    def error(self, message: str, **kw: Any) -> None:
        self.log("error", message, **kw)

    # -- audit (prahu NEpodléhá) -------------------------------------------

    def audit(self, message: str, *, level: str = "info") -> None:
        """Bezpečnostní stopa – zaznamená se VŽDY, s komponentou `security`.

        Úrovně zůstávají čtyři (debug/info/warning/error); audit není pátá,
        je to KOMPONENTA. Úspěšné odemčení je `info`, odmítnutý kód
        `warning` – závažnost říká, jak je to zlé, komponenta říká, že jde
        o bezpečnostní stopu, a ta se prahem neutiší.

        Patří sem to, co musí jít dohledat zpětně: připojení a odpojení
        klienta (odkud), odemčení a zamčení okna (kým a odkud), odmítnutý
        kód, odmítnutý REST pokus. Nikdy sem nepatří tajemství – kód, QR,
        session id celé (jen prefix), obsah okna."""
        bus.publish(level, "backend_program", message, component="security")
        _stdlib.log(_UROVNE_STDLIB[level], "[security] %s", message)

    # -- systémové hlášky při startu ---------------------------------------

    def system(self, message: str, level: str = "info") -> None:
        """Hláška při startu: do KONZOLE serveru i na log bus.

        Do konzole proto, že log bus nemá historii (čistý tail) – co padne
        před připojením prvního klienta, by jinak nikdo neviděl. Konzole
        prahem neprochází: kdo spustil instanci, má vidět, s čím naběhla.
        Razítko je i tady celé, ať jde startovní řádek srovnat s auditem."""
        print(f"{time.strftime('%Y-%m-%d %H:%M:%S')} viewbase: {message}",
              flush=True)
        bus.publish(level, "backend_program", message, component="server")


#: Proces-wide logger knihovny (jako `log.bus`, se kterým sdílí sběrnici).
logger = Logger()


def set_level(level: str) -> str:
    """Přenastav úroveň (volá `vb.Project(log_level=…)`); vrací nastavenou."""
    logger.level = level
    return logger.level

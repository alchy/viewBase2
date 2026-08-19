"""Log subsystém pro vestavěné log okno (window-first model, viz handover
plán – log je obyčejné okno na screenu, žádný speciální Screen 0).

Čistý live tail – žádná perzistence/ring buffer (vědomé rozhodnutí, viz
spec). `LogBus` je proces-wide pub/sub: `vb.log(...)` a interní hlášky
knihovny (`backend_program`/`backend_api`) publikují, server je při
broadcastu vyzobne a pošle přes protokol jako zprávu `log`.

`component` říká, KTERÝ z modulů (§4a designu: graph/gui/windows/rest/
server) hlášku vyprodukoval – u interních `backend_program`/`backend_api`
zdrojů je to POVINNÉ. Bez toho by log ze čtyř oddělených modulů splýval do
jedné nerozlišitelné hromady a modularita by se z venku nedala ověřit –
smyslem oddělených modulů (§4a) je i to, že log sám prozradí, který z nich
zrovna mluví. `backend_user`/`frontend` component nemají (uživatelský kód
ani prohlížeč nejsou jeden z těch čtyř modulů)."""
from __future__ import annotations

import re
import threading
from dataclasses import dataclass
from typing import Any, Callable

#: Nejdelší záznam; zbytek se ořízne (útočník nesmí zaplavit log jednou zprávou).
MAX_MESSAGE = 2000
#: Řídicí znaky, které se do logu nesmí dostat syrové: ESC (přebarví a přepíše
#: terminál toho, kdo čte `docker logs`), CR (přepíše řádek), NUL a spol.
_CONTROL_CHARS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")

LOG_LEVELS = ("debug", "info", "warning", "error")
LOG_SOURCES = ("frontend", "backend_api", "backend_program", "backend_user")
# Moduly podle §4a designu – interní log (backend_program/backend_api) musí
# uvést jeden z nich jako `component`, aby šlo z logu poznat, kdo mluví.
#: `security` je komponenta, ne úroveň: audit (kdo se odkud připojil, kdo
#: odemkl okno, kdo hádal kód) se pozná podle ní, ne podle závažnosti –
#: úspěšné odemčení není `warning` a odmítnutý kód není `error`.
COMPONENTS = ("graph", "gui", "windows", "rest", "server", "security")
_INTERNAL_SOURCES = ("backend_api", "backend_program")


def sanitize(message: object, limit: int = MAX_MESSAGE) -> str:
    """Očisti text, který jde do logu. JEDNO místo pro všechny cesty.

    Do logu tečou cizí vstupy – příkazy z shellu, payloady událostí, syrové
    zprávy od klienta. Nejde o log4j (Python logging nic nevyhodnocuje), ale
    o tři reálné věci:

    - **ESC sekvence**: `docker logs` se čte v terminálu; text s `\x1b[2J`
      smaže obrazovku, obarví cizí řádky nebo schová ty vlastní. Řídicí
      znaky se proto nahradí čitelným `\x1b`.
    - **Podvržení řádku**: `\n` v cizím textu vyrobí v logu nový záznam,
      který vypadá jako od serveru. Zalomení se proto escapuje.
    - **Zaplavení**: jedna zpráva nesmí utopit zbytek – ořízne se a připíše
      se, kolik znaků chybí.
    """
    text = str(message)
    text = _CONTROL_CHARS.sub(lambda m: f"\\x{ord(m.group()):02x}", text)
    text = text.replace("\r\n", "\\n").replace("\n", "\\n")
    if len(text) > limit:
        text = f"{text[:limit]}…(+{len(text) - limit} znaků)"
    return text


@dataclass(frozen=True)
class LogRecord:
    """Jeden záznam. Pořadí polí je zároveň pořadím ve výpisu: KDY (razítko
    doplní výpis), CO je to zač (level), KDO (session), ODKUD (ip) a teprve
    pak detail. Dřív bylo „kdo" a „odkud" nalepené v textu zprávy, takže se
    to špatně četlo i parsovalo."""

    level: str
    source: str
    message: str
    component: str | None = None
    #: prefix session id (celé je přihlašovací údaj, do logu nepatří)
    session: str | None = None
    #: IP protistrany; doplňuje ji server, ne klient
    ip: str | None = None

    def as_dict(self) -> dict[str, Any]:
        return {"level": self.level, "source": self.source,
                "message": self.message, "component": self.component,
                "session": self.session, "ip": self.ip}


class LogBus:
    """Proces-wide log bus: publish/subscribe, bez historie (čistý tail)."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._subscribers: list[Callable[[LogRecord], None]] = []

    def subscribe(self, callback: Callable[[LogRecord], None]) -> None:
        with self._lock:
            self._subscribers.append(callback)

    def unsubscribe(self, callback: Callable[[LogRecord], None]) -> None:
        with self._lock:
            if callback in self._subscribers:
                self._subscribers.remove(callback)

    def publish(self, level: str, source: str, message: str,
                component: str | None = None, session: str | None = None,
                ip: str | None = None) -> LogRecord:
        """Zveřejni záznam. Text se VŽDY sanuje – viz `sanitize`."""
        if level not in LOG_LEVELS:
            raise ValueError(f"level musí být jedno z {LOG_LEVELS}")
        if source not in LOG_SOURCES:
            raise ValueError(f"source musí být jedno z {LOG_SOURCES}")
        if source in _INTERNAL_SOURCES and component not in COMPONENTS:
            raise ValueError(
                f"source '{source}' vyžaduje component z {COMPONENTS}"
                " – z logu musí jít poznat, který modul mluví")
        record = LogRecord(level=level, source=source,
                            message=sanitize(message), component=component,
                            session=sanitize(session) if session else None,
                            ip=sanitize(ip) if ip else None)
        with self._lock:
            subscribers = list(self._subscribers)
        for callback in subscribers:
            callback(record)
        return record


bus = LogBus()


def log(message: str, level: str = "info") -> None:
    """Zapiš diagnostickou hlášku z uživatelského kódu do log okna
    (`source="backend_user"`) – viz `GraphWindow.on_click`/`@graph.every`
    handlery a §3a designu."""
    bus.publish(level, "backend_user", message)


class LogWindow:
    """SYSTÉMOVÉ log okno na screenu – speciální druh okna, jehož obsah
    dodává knihovna sama (proces-wide LogBus, `tail -f`), vývojář ho jen
    explicitně UMÍSTÍ: `vb.LogWindow(screen=screen)` ho otevře na daném
    screenu hned při startu. Bez explicitního umístění se log okno otevírá
    samo na předním screenu při prvním záznamu (auto-open).

    Umístění jde přes config grafového okna screenu (init snapshot), ne
    přes jednorázovou akci – přežije reconnect i klienty připojené později.
    Funguje i PŘED přiřazením grafu na screen (stejný vzor jako
    `Screen.pin_menu`).

    PŘÍSTUP SE NEDĚDÍ Z PLOCHY. Logem teče auditní stopa CELÉ instance –
    IP adresy, prefixy relací, příkazy ze shellu – a LogBus je jeden pro
    celý proces: co v něm je, není vlastnost plochy, na které okno leží.
    Kdyby se ACL dědilo, stačilo by log okno na veřejné ploše a stopa jde
    světu (nalezeno přesně takhle). Výchozí je proto `default_access`
    instance; zveřejnit ji jde jen výslovně:

        vb.LogWindow(screen=s, access=["group:public"])"""

    def __init__(self, *, screen, access: "list[str] | None" = None) -> None:
        if not hasattr(screen, "id"):
            raise ValueError("screen musí být instance vb.Screen")
        from .access import Acl

        self.screen = screen
        with screen._lock:
            screen._log_window = True
            screen._log_access = Acl(access, where=f"screen:{screen.id}/window:__log",
                                     verb="see")
            graph = screen._graph
        if graph is not None:
            with graph._lock:
                graph.config["log_window"] = True

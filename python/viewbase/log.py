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

import threading
from dataclasses import dataclass
from typing import Any, Callable

LOG_LEVELS = ("debug", "info", "warning", "error")
LOG_SOURCES = ("frontend", "backend_api", "backend_program", "backend_user")
# Moduly podle §4a designu – interní log (backend_program/backend_api) musí
# uvést jeden z nich jako `component`, aby šlo z logu poznat, kdo mluví.
COMPONENTS = ("graph", "gui", "windows", "rest", "server")
_INTERNAL_SOURCES = ("backend_api", "backend_program")


@dataclass(frozen=True)
class LogRecord:
    level: str
    source: str
    message: str
    component: str | None = None

    def as_dict(self) -> dict[str, Any]:
        return {"level": self.level, "source": self.source,
                "message": self.message, "component": self.component}


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
                component: str | None = None) -> LogRecord:
        if level not in LOG_LEVELS:
            raise ValueError(f"level musí být jedno z {LOG_LEVELS}")
        if source not in LOG_SOURCES:
            raise ValueError(f"source musí být jedno z {LOG_SOURCES}")
        if source in _INTERNAL_SOURCES and component not in COMPONENTS:
            raise ValueError(
                f"source '{source}' vyžaduje component z {COMPONENTS}"
                " – z logu musí jít poznat, který modul mluví")
        record = LogRecord(level=level, source=source, message=str(message),
                            component=component)
        with self._lock:
            subscribers = list(self._subscribers)
        for callback in subscribers:
            callback(record)
        return record


bus = LogBus()


def log(message: str, level: str = "info") -> None:
    """Zapiš diagnostickou hlášku z uživatelského kódu do log okna
    (`source="backend_user"`) – viz `Canvas.on_click`/`@canvas.every`
    handlery a §3a designu."""
    bus.publish(level, "backend_user", message)

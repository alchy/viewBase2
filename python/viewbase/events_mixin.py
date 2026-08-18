"""Události od klienta a periodické úlohy.

Odděleno z `graph_window.py` (viz windows_mixin.py – tentýž důvod).
Infrastruktura, ne obsah: registr handlerů, jejich spouštění v thread poolu
(aby blokující uživatelský kód nezmrazil vysílací smyčku) a `every()` úlohy.

Kontrakt vůči hostitelské třídě: `self._lock`, `self._handlers`,
`self._executor`, `self._tasks`, `self._tasks_stop`, `self._closed`."""
from __future__ import annotations

import threading
import types
from typing import Any, Callable

from .logger import logger


class EventsMixin:
    def every(self, seconds: float, *,
              name: str | None = None) -> Callable[[Callable], Callable]:
        """Dekorátor: registruj periodickou úlohu – knihovna ji po startu
        serveru spouští v daemon vlákně, žádný threading v uživatelském
        kódu. První tik po uplynutí intervalu. Výjimka se zaloguje a smyčka
        běží dál. Registruj před vb.serve(); pozdější registrace se jen
        zaloguje a ignoruje."""
        interval = float(seconds)
        if interval <= 0:
            raise ValueError("every: interval musí být kladný počet sekund")

        def register(func: Callable[[], None]) -> Callable[[], None]:
            task_name = name or getattr(func, "__name__", "úloha")
            with self._lock:
                if self._tasks_stop is not None:
                    logger.warning(
                        f"every(): task '{task_name}' registered after the "
                        "server started – ignored", component="server")
                    return func
                self._tasks.append(
                    {"interval": interval, "name": task_name, "func": func})
            return func
        return register

    def start_periodic_tasks(self) -> threading.Event:
        """Spusť every() úlohy (volá server v lifespanu). Vrátí stop event;
        idempotentní – opakované volání vrátí týž event."""
        with self._lock:
            if self._tasks_stop is not None:
                return self._tasks_stop
            stop = threading.Event()
            self._tasks_stop = stop
            tasks = list(self._tasks)
        for task in tasks:
            threading.Thread(
                target=self._run_periodic, args=(task, stop),
                name=f"viewbase-every-{task['name']}", daemon=True).start()
        return stop

    @staticmethod
    def _run_periodic(task: dict[str, Any], stop: threading.Event) -> None:
        while not stop.wait(task["interval"]):
            try:
                task["func"]()
            except Exception:
                logger.exception(f"exception in every() task '{task['name']}'",
                                 component="server")

    def on(self, event: str,
           func: Callable[[Any], None]) -> Callable[[Any], None]:
        """Obecná registrace handleru eventu — vlastní eventy zvenčí přes
        REST `/api/event` (např. „terminal_write" pushnutý časovačem)."""
        return self._register(event, func)

    def on_click(self, func: Callable[[Any], None]) -> Callable[[Any], None]:
        """Dekorátor: klik na uzel. Event nese `.node_id` a `.client_id`;
        handler běží v thread-poolu, takže smí blokovat i mutovat canvas."""
        return self._register("node_click", func)

    def on_hover(self, func: Callable[[Any], None]) -> Callable[[Any], None]:
        """Dekorátor: najetí myší na uzel (`.node_id`, throttlováno klientem)."""
        return self._register("node_hover", func)

    def on_background_click(
            self, func: Callable[[Any], None]) -> Callable[[Any], None]:
        """Dekorátor: klik mimo uzly – typicky zrušení výběru/zvýraznění."""
        return self._register("background_click", func)

    def on_view_change(
            self, func: Callable[[Any], None]) -> Callable[[Any], None]:
        """Dekorátor: pohyb kamery. Event nese `.position`, `.target`, `.zoom`
        (klient posílá throttlovaně, ~10×/s)."""
        return self._register("view_change", func)

    def _register(self, event: str,
                  func: Callable[[Any], None]) -> Callable[[Any], None]:
        with self._lock:
            self._handlers.setdefault(event, []).append(func)
        return func

    def dispatch_event(self, name: str, payload: dict[str, Any]) -> None:
        """Spustí handlery eventu ve sdíleném thread-poolu (smí blokovat).
        Neznámý event je no-op; výjimka handleru se zaloguje, server běží dál."""
        with self._lock:
            if self._closed:
                return
            handlers = list(self._handlers.get(name, ()))
        if not handlers:
            return
        event = types.SimpleNamespace(**payload)
        for handler in handlers:
            self._executor.submit(self._run_handler, handler, name, event)

    @staticmethod
    def _run_handler(handler: Callable[[Any], None], name: str,
                     event: types.SimpleNamespace) -> None:
        try:
            handler(event)
        except Exception:
            logger.exception(f"exception in handler for event '{name}'",
                             component="server")

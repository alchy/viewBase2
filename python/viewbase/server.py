"""FastAPI server: statické assety + WebSocket protokol + runner.

Multi-screen (viz docs/superpowers/specs/2026-08-02-multi-screen-workbench-
design.md): jeden server obsluhuje N Canvasů multiplexovaných na jednom WS
spojení podle `screen_id`. Fáze 2 návrhu – frontend ještě neumí víc screenů
vykreslit, ale protokol a routing na serveru už jsou reálné a otestované.
Log okno nepotřebuje vlastní Canvas – server jen releuje LogBus (viz
log.py) všem klientům jako zprávy `log`."""
from __future__ import annotations

import asyncio
import json
import logging
import threading
import time
import uuid
import webbrowser
from contextlib import asynccontextmanager
from pathlib import Path

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles

from . import protocol
from .canvas import Canvas
from .log import LogRecord, bus as log_bus

logger = logging.getLogger("viewbase")

STATIC_DIR = Path(__file__).parent / "static"
PATCH_INTERVAL = 1 / 30


def _resolve_canvas(canvases_by_screen: dict, screen_id) -> Canvas | None:
    """Najdi Canvas pro příchozí zprávu. Přesná shoda `screen_id` má
    přednost; klient bez `screen_id` (legacy, nebo jediný screen bez
    Screenu) se routuje na jediný canvas, pokud je jednoznačný."""
    if screen_id in canvases_by_screen:
        return canvases_by_screen[screen_id]
    if screen_id is None and len(canvases_by_screen) == 1:
        return next(iter(canvases_by_screen.values()))
    return None


async def _broadcast_step(canvases: list[Canvas], canvases_by_screen: dict,
                          clients: set[WebSocket],
                          pending_logs: list[dict]) -> None:
    """Jeden krok vysílání: pro každý canvas nejdřív patch (data), pak akce
    (odkazují na data) – viz komentář u _broadcast_loop níž – a nakonec
    nastřádané log záznamy (LogBus, čistý tail, žádný stav k drainování).

    POZOR na pořadí: `drain_actions()`/`drain()` se volají VŽDY, bez ohledu
    na to, jestli je někdo připojený – jinak zmizí naposled zařazená akce
    (typicky `screen_remove`), pokud v tu chvíli náhodou nikdo neposlouchal.
    Pro graf (`drain()`) je to neškodné (`snapshot()` novému klientovi vrátí
    aktuální stav tak jako tak), ale jednorázová akce jako `screen_remove` se
    jinak neopakuje – proto zavřený canvas hned po posledním odvysílání
    ODSTRANÍME z `canvases`/`canvases_by_screen`, ať nový klient vůbec
    nedostane `init` pro screen, který už neexistuje (create/destroy jsou
    explicitní páry, viz screen.py/Canvas.close)."""
    messages = []
    closed = []
    for canvas in canvases:
        actions = canvas.drain_actions()
        drained = canvas.drain()
        if drained is not None:
            seq, deltas = drained
            messages.append(protocol.encode(
                protocol.patch_message(seq, deltas, screen_id=canvas.screen_id)))
        messages.extend(
            protocol.encode({"type": "action", "screen_id": canvas.screen_id,
                             **action})
            for action in actions)
        if canvas._closed:
            closed.append(canvas)
    for canvas in closed:
        canvases.remove(canvas)
        canvases_by_screen.pop(canvas.screen_id, None)
    if pending_logs:
        messages.extend(
            protocol.encode(protocol.log_message(record))
            for record in pending_logs)
        pending_logs.clear()
    if not messages or not clients:
        return
    for ws in list(clients):
        try:
            for raw in messages:
                await ws.send_text(raw)
        except Exception:
            clients.discard(ws)


async def _broadcast_loop(canvases: list[Canvas], canvases_by_screen: dict,
                          clients: set[WebSocket], state_lock: asyncio.Lock,
                          pending_logs: list[dict]) -> None:
    while True:
        await asyncio.sleep(PATCH_INTERVAL)
        try:
            async with state_lock:
                await _broadcast_step(canvases, canvases_by_screen, clients,
                                      pending_logs)
        except Exception as exc:
            logger.exception("Chyba ve vysílací smyčce")
            log_bus.publish("error", "backend_program",
                            f"chyba ve vysílací smyčce: {exc}",
                            component="server")


def _make_log_relay(loop: asyncio.AbstractEventLoop):
    """LogBus.publish() volá subscribery synchronně, klidně z cizího vlákna
    (handler thread-pool, every() úloha). call_soon_threadsafe bezpečně
    předá záznam do event loopu, kde ho _broadcast_step vyzobne a pošle."""
    pending: list[dict] = []

    def _on_record(record: LogRecord) -> None:
        loop.call_soon_threadsafe(pending.append, record.as_dict())

    return pending, _on_record


def create_app(*canvases: Canvas) -> FastAPI:
    """Sestav FastAPI aplikaci nad jedním nebo víc Canvasy: statické assety,
    `/ws` (init + delty + akce + log, multiplexed po screen_id), `/api/event`
    (REST vstřik události). Víc canvasů vyžaduje, aby měl každý svůj
    `screen=` (jinak nejde spolehlivě routovat) – jeden canvas beze Screenu
    (legacy) funguje jako dřív. Běžný uživatel volá `serve()`; tohle je pro
    testy a vlastní hostování (uvicorn, mount)."""
    canvases_list = list(canvases)
    if not canvases_list:
        raise ValueError("create_app() vyžaduje aspoň jeden Canvas")
    if len(canvases_list) > 1:
        missing = [c for c in canvases_list if c.screen_id is None]
        if missing:
            raise ValueError(
                "víc canvasů najednou vyžaduje, aby měl každý svůj screen=")
        ids = [c.screen_id for c in canvases_list]
        if len(set(ids)) != len(ids):
            raise ValueError("dva canvasy nemůžou sdílet stejný screen")
    canvases_by_screen = {c.screen_id: c for c in canvases_list}

    clients: set[WebSocket] = set()
    state_lock = asyncio.Lock()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        loop = asyncio.get_running_loop()
        pending_logs, on_record = _make_log_relay(loop)
        log_bus.subscribe(on_record)
        task = asyncio.create_task(
            _broadcast_loop(canvases_list, canvases_by_screen, clients,
                            state_lock, pending_logs))
        stop_tasks = [c.start_periodic_tasks() for c in canvases_list]
        yield
        for stop in stop_tasks:
            stop.set()
        task.cancel()
        log_bus.unsubscribe(on_record)

    app = FastAPI(lifespan=lifespan)

    @app.websocket("/ws")
    async def ws_endpoint(ws: WebSocket) -> None:
        await ws.accept()
        client_id = uuid.uuid4().hex[:8]
        try:
            hello = protocol.decode(await ws.receive_text())
        except WebSocketDisconnect:
            return
        except ValueError:
            await ws.close()
            return
        try:
            if (hello.get("type") != "hello"
                    or hello.get("protocol") != protocol.PROTOCOL_VERSION):
                await ws.send_text(protocol.encode(
                    {"type": "error", "error": "protocol_mismatch"}))
                await ws.close()
                return
            # Sdílený zámek: snapshoty + zařazení mezi klienty je atomické
            # vůči broadcast kroku. Pending delty se NEzahazují – příští
            # broadcast je pošle všem (novému klientovi jako idempotentní
            # upsert), takže seq navazuje pro staré i nové klienty.
            async with state_lock:
                for canvas in canvases_list:
                    snap = canvas.snapshot()
                    await ws.send_text(protocol.encode(
                        protocol.init_message(**snap,
                                              screen_id=canvas.screen_id)))
                clients.add(ws)
        except WebSocketDisconnect:
            return
        try:
            while True:
                raw = await ws.receive_text()
                try:
                    msg = protocol.decode(raw)
                except ValueError:
                    logger.warning("Vadná zpráva od klienta %s: %r",
                                   client_id, raw[:200])
                    log_bus.publish(
                        "warning", "backend_program",
                        f"vadná zpráva od klienta {client_id}: {raw[:200]!r}",
                        component="server")
                    continue
                if msg.get("type") == "event" and isinstance(msg.get("event"), str):
                    payload = msg.get("payload")
                    if not isinstance(payload, dict):
                        payload = {}
                    target = _resolve_canvas(canvases_by_screen,
                                             msg.get("screen_id"))
                    if target is None:
                        logger.warning(
                            "Event bez rozpoznatelného screen_id od klienta"
                            " %s: %r", client_id, msg.get("screen_id"))
                        log_bus.publish(
                            "warning", "backend_program",
                            f"event bez rozpoznatelného screen_id od klienta"
                            f" {client_id}: {msg.get('screen_id')!r}",
                            component="server")
                        continue
                    target.dispatch_event(
                        msg["event"], {**payload, "client_id": client_id})
                else:
                    logger.warning("Nečekaná zpráva od klienta %s: %r",
                                   client_id, raw[:200])
                    log_bus.publish(
                        "warning", "backend_program",
                        f"nečekaná zpráva od klienta {client_id}: {raw[:200]!r}",
                        component="server")
        except WebSocketDisconnect:
            pass
        finally:
            clients.discard(ws)

    @app.post("/api/event")
    def inject_event(message: dict) -> dict:
        """REST vstřik události — totéž, co by poslal prohlížeč přes WS.

        `{"event": "terminal_input", "payload": {"window_id": "konzole",
        "line": "Kdo je Čapek?"}}` projde týmž `dispatch_event` jako zpráva
        z prohlížeče: handler (on_input) se zavolá a jeho výstup + mutace
        canvasu se rozešlou VŠEM připojeným klientům. Určeno pro demo/testy
        řízené zvenčí (curl) — konverzaci tak lze přehrát do otevřených oken.
        Sync endpoint (threadpool): blokující handler nezmrazí WS broadcast.
        Každý request se loguje jako `backend_api` (pretty-printed JSON,
        §3a designu) – vidí ho log okno v prohlížeči.
        """
        log_bus.publish("info", "backend_api",
                        json.dumps(message, indent=2, ensure_ascii=False),
                        component="rest")
        event = message.get("event")
        payload = message.get("payload") or {}
        if not isinstance(event, str) or not isinstance(payload, dict):
            return {"ok": False, "error": "čekám {event: str, payload: dict}"}
        target = _resolve_canvas(canvases_by_screen, message.get("screen_id"))
        if target is None:
            return {"ok": False,
                    "error": f"neznámý screen_id {message.get('screen_id')!r}"}
        target.dispatch_event(event, {**payload, "client_id": "rest"})
        return {"ok": True}

    @app.middleware("http")
    async def _no_html_cache(request, call_next):
        """index.html se nikdy necachuje — odkazuje na hashované bundly;
        zastaralé HTML by po deployi drželo starý frontend (a např.
        perzistence pozic by „nefungovala")."""
        response = await call_next(request)
        if request.url.path in ("/", "/index.html"):
            response.headers["Cache-Control"] = "no-cache"
        return response

    if STATIC_DIR.is_dir():
        app.mount("/", StaticFiles(directory=STATIC_DIR, html=True),
                  name="static")
    return app


class ServerHandle:
    """Server běžící na pozadí (serve(block=False)) – pro REPL a Jupyter.
    Kontext manager: `with vb.serve(c, block=False) as s:` ho po bloku
    zastaví."""

    def __init__(self, server: uvicorn.Server, thread: threading.Thread,
                 canvases: tuple[Canvas, ...]):
        self._server = server
        self._thread = thread
        self._canvases = canvases

    @property
    def port(self) -> int:
        """Skutečný port (i pro port=0, kde OS přidělí efemérní)."""
        return self._server.servers[0].sockets[0].getsockname()[1]

    def stop(self, timeout: float = 5.0) -> None:
        """Zastav server (graceful), počkej na doběh vlákna, zavři canvasy."""
        self._server.should_exit = True
        self._thread.join(timeout)
        for canvas in self._canvases:
            canvas.close()

    def __enter__(self) -> "ServerHandle":
        return self

    def __exit__(self, *exc) -> None:
        self.stop()


def _make_server(canvases: tuple[Canvas, ...], host: str,
                 port: int) -> uvicorn.Server:
    # ws_ping_interval=None vypíná serverový keepalive ping knihovny
    # websockets: jeho samostatná úloha jinak souběžně "draina" stejné
    # spojení jako náš broadcast a při velkém provozu spadne na interním
    # assertu. Mrtvá spojení odhalí selhání dalšího patche (klient se
    # reconnectne), keepalive proto nepotřebujeme.
    config = uvicorn.Config(create_app(*canvases), host=host, port=port,
                            log_level="warning",
                            ws_ping_interval=None, ws_ping_timeout=None)
    return uvicorn.Server(config)


def serve(*canvases: Canvas, host: str = "127.0.0.1", port: int = 8080,
          open_browser: bool = False,
          block: bool = True) -> ServerHandle | None:
    """Spustí server nad jedním nebo víc Canvasy (multi-screen – víc
    canvasů vyžaduje, aby měl každý svůj `screen=`, viz `create_app`).
    `block=True` (default) blokuje do Ctrl-C; mutace canvasu pak dělej
    z every() úloh nebo event handlerů. `block=False` server spustí
    v daemon vlákně a vrátí ServerHandle (REPL/Jupyter): prompt zůstane
    volný, `handle.stop()` server ukončí."""
    if not canvases:
        raise ValueError("serve() vyžaduje aspoň jeden Canvas")
    server = _make_server(canvases, host, port)
    if open_browser:
        threading.Timer(
            0.7, webbrowser.open, args=(f"http://{host}:{port}/",)).start()
    if block:
        try:
            server.run()
        finally:
            for canvas in canvases:
                canvas.close()   # i po KeyboardInterrupt – nenechat viset vlákna
        return None
    thread = threading.Thread(target=server.run, name="viewbase-server",
                              daemon=True)
    thread.start()
    deadline = time.monotonic() + 5.0
    while not server.started:          # čekej na bind (nebo pád)
        if not thread.is_alive():
            for canvas in canvases:
                canvas.close()
            raise RuntimeError(
                "viewbase server se nepodařilo spustit – viz log výše"
                f" (host={host}, port={port})")
        if time.monotonic() > deadline:
            server.should_exit = True
            for canvas in canvases:
                canvas.close()
            raise TimeoutError("viewbase server nenastartoval do 5 s")
        time.sleep(0.01)
    return ServerHandle(server, thread, canvases)

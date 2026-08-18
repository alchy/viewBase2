"""FastAPI server: statické assety + WebSocket protokol + runner.

Multi-screen (viz docs/superpowers/specs/2026-08-02-multi-screen-workbench-
design.md): jeden server obsluhuje N grafových oken multiplexovaných na jednom WS
spojení podle `screen_id`. Fáze 2 návrhu – frontend ještě neumí víc screenů
vykreslit, ale protokol a routing na serveru už jsou reálné a otestované.
Log okno nepotřebuje vlastní GraphWindow – server jen releuje LogBus (viz
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
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from . import mfa, protocol
from .graph_window import GraphWindow
from .log import LogRecord, bus as log_bus

logger = logging.getLogger("viewbase")

STATIC_DIR = Path(__file__).parent / "static"
PATCH_INTERVAL = 1 / 30


def _resolve_window(windows_by_screen: dict, screen_id) -> GraphWindow | None:
    """Najdi GraphWindow pro příchozí zprávu. Přesná shoda `screen_id` má
    přednost; klient bez `screen_id` (legacy, nebo jediný screen bez
    Screenu) se routuje na jediný window, pokud je jednoznačný."""
    if screen_id in windows_by_screen:
        return windows_by_screen[screen_id]
    if screen_id is None and len(windows_by_screen) == 1:
        return next(iter(windows_by_screen.values()))
    return None


async def _broadcast_step(windows: list[GraphWindow], windows_by_screen: dict,
                          clients: set[WebSocket],
                          pending_logs: list[dict]) -> None:
    """Jeden krok vysílání: pro každý window nejdřív patch (data), pak akce
    (odkazují na data) – viz komentář u _broadcast_loop níž – a nakonec
    nastřádané log záznamy (LogBus, čistý tail, žádný stav k drainování).

    POZOR na pořadí: `drain_actions()`/`drain()` se volají VŽDY, bez ohledu
    na to, jestli je někdo připojený – jinak zmizí naposled zařazená akce
    (typicky `screen_remove`), pokud v tu chvíli náhodou nikdo neposlouchal.
    Pro graf (`drain()`) je to neškodné (`snapshot()` novému klientovi vrátí
    aktuální stav tak jako tak), ale jednorázová akce jako `screen_remove` se
    jinak neopakuje – proto zavřený window hned po posledním odvysílání
    ODSTRANÍME z `windows`/`windows_by_screen`, ať nový klient vůbec
    nedostane `init` pro screen, který už neexistuje (create/destroy jsou
    explicitní páry, viz screen.py/GraphWindow.close)."""
    messages = []
    closed = []
    for window in windows:
        actions = window.drain_actions()
        drained = window.drain()
        if drained is not None:
            seq, deltas = drained
            messages.append(protocol.encode(
                protocol.patch_message(seq, deltas, screen_id=window.screen_id)))
        messages.extend(
            protocol.encode({"type": "action", "screen_id": window.screen_id,
                             **action})
            for action in actions)
        if window._closed:
            closed.append(window)
    for window in closed:
        windows.remove(window)
        windows_by_screen.pop(window.screen_id, None)
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


async def _broadcast_loop(windows: list[GraphWindow], windows_by_screen: dict,
                          clients: set[WebSocket], state_lock: asyncio.Lock,
                          pending_logs: list[dict]) -> None:
    while True:
        await asyncio.sleep(PATCH_INTERVAL)
        try:
            async with state_lock:
                await _broadcast_step(windows, windows_by_screen, clients,
                                      pending_logs)
        except Exception as exc:
            logger.exception("Broadcast loop failed")
            log_bus.publish("error", "backend_program",
                            f"broadcast loop failed: {exc}",
                            component="server")


def _make_log_relay(loop: asyncio.AbstractEventLoop):
    """LogBus.publish() volá subscribery synchronně, klidně z cizího vlákna
    (handler thread-pool, every() úloha). call_soon_threadsafe bezpečně
    předá záznam do event loopu, kde ho _broadcast_step vyzobne a pošle."""
    pending: list[dict] = []

    def _on_record(record: LogRecord) -> None:
        loop.call_soon_threadsafe(pending.append, record.as_dict())

    return pending, _on_record


def create_app(*windows: GraphWindow) -> FastAPI:
    """Sestav FastAPI aplikaci nad jedním nebo víc GraphWindow: statické assety,
    `/ws` (init + delty + akce + log, multiplexed po screen_id), `/api/event`
    (REST vstřik události). Víc grafových oken vyžaduje, aby mělo každé svůj
    `screen=` (jinak nejde spolehlivě routovat) – jeden window beze Screenu
    (legacy) funguje jako dřív. Běžný uživatel volá `serve()`; tohle je pro
    testy a vlastní hostování (uvicorn, mount)."""
    windows_list = list(windows)
    if not windows_list:
        raise ValueError("create_app() vyžaduje aspoň jeden GraphWindow")
    if len(windows_list) > 1:
        missing = [c for c in windows_list if c.screen_id is None]
        if missing:
            raise ValueError(
                "víc grafových oken najednou vyžaduje, aby mělo každé svůj screen=")
        ids = [c.screen_id for c in windows_list]
        if len(set(ids)) != len(ids):
            raise ValueError("dvě grafová okna nemůžou sdílet stejný screen")
    windows_by_screen = {c.screen_id: c for c in windows_list}

    clients: set[WebSocket] = set()
    state_lock = asyncio.Lock()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        loop = asyncio.get_running_loop()
        pending_logs, on_record = _make_log_relay(loop)
        log_bus.subscribe(on_record)
        task = asyncio.create_task(
            _broadcast_loop(windows_list, windows_by_screen, clients,
                            state_lock, pending_logs))
        stop_tasks = [c.start_periodic_tasks() for c in windows_list]
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
                for window in windows_list:
                    snap = window.snapshot()
                    await ws.send_text(protocol.encode(
                        protocol.init_message(**snap,
                                              screen_id=window.screen_id)))
                clients.add(ws)
        except WebSocketDisconnect:
            return
        try:
            while True:
                raw = await ws.receive_text()
                try:
                    msg = protocol.decode(raw)
                except ValueError:
                    logger.warning("Malformed message from client %s: %r",
                                   client_id, raw[:200])
                    log_bus.publish(
                        "warning", "backend_program",
                        f"malformed message from client {client_id}: {raw[:200]!r}",
                        component="server")
                    continue
                if msg.get("type") == "event" and isinstance(msg.get("event"), str):
                    payload = msg.get("payload")
                    if not isinstance(payload, dict):
                        payload = {}
                    target = _resolve_window(windows_by_screen,
                                             msg.get("screen_id"))
                    if target is None:
                        logger.warning(
                            "Event with unknown screen_id from client"
                            " %s: %r", client_id, msg.get("screen_id"))
                        log_bus.publish(
                            "warning", "backend_program",
                            f"event with unknown screen_id from client"
                            f" {client_id}: {msg.get('screen_id')!r}",
                            component="server")
                        continue
                    target.dispatch_event(
                        msg["event"], {**payload, "client_id": client_id})
                else:
                    logger.warning("Unexpected message from client %s: %r",
                                   client_id, raw[:200])
                    log_bus.publish(
                        "warning", "backend_program",
                        f"unexpected message from client {client_id}: {raw[:200]!r}",
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
        grafu se rozešlou VŠEM připojeným klientům. Určeno pro demo/testy
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
        # BEZPEČNOST (spec 2026-08-18 §Shell okno): tenhle endpoint je bez
        # autentizace, takže klávesy do shellu smí posílat JEN prohlížeč přes
        # WS – jinak by stačil jeden curl na spuštění čehokoli na stroji.
        if event.startswith(("shell_", "window_unlock", "window_lock")):
            return JSONResponse(status_code=403, content={
                "ok": False,
                "error": ("shell_*, window_unlock and window_lock are not "
                          "allowed over REST (browser WebSocket only)")})
        target = _resolve_window(windows_by_screen, message.get("screen_id"))
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


def first_run_setup() -> None:
    """Setup instance – po PRVNÍM spuštění nesmí nic chybět.

    Založí `~/.viewbase` (0700), `users.json` (0600) s uživatelem instance
    (výchozí `workbench`), vygeneruje mu TOTP tajemství a QR do jeho adresáře
    (`user-<jméno>/totp-<jméno>.svg|.txt`) a vypíše systémové texty. Podruhé
    je to no-op – tajemství i QR už existují (a chybějící QR se dorobí ze
    stávajícího tajemství, viz mfa.ensure_user).

    Sedí ve sdílené `serve()`, aby ho dostal KAŽDÝ vstupní bod: `vb.serve(...)`
    i `Project.serve(...)`. Kdyby byl jen v Projectu, uživatel staršího API by
    zabezpečená okna otevřel bez připraveného prostředí."""
    user = mfa.active_user()
    mfa.ensure_user(user)
    users = mfa.describe_users()
    _system_log(f"instance user: {user}"
                + (f"; registered: {', '.join(users)}" if users else ""))
    if not mfa.available():
        # Kdo má TOTP zaregistrované, ale spustí instanci v prostředí bez
        # `pyotp`, jinak jen kouká, proč mu autentikátor nefunguje.
        _system_log(
            "pyotp is missing in this environment – secured windows fall back "
            "to a one-time code in a file"
            + (f" (user '{user}' HAS TOTP registered, so the authenticator "
               "code will NOT work); "
               if mfa.registered(user) else "; ")
            + "enable TOTP: pip install pyotp qrcode "
              "(standard viewbase dependencies)", "warning")


def _system_log(message: str, level: str = "info") -> None:
    """Systémová hláška při startu: do KONZOLE serveru i na log bus.

    Do konzole proto, že log bus nemá historii (čistý tail, viz log.py) – co
    se stane před připojením prvního klienta, by jinak nikdo neviděl. Tyhle
    texty jsou systémové: kdo je uživatel instance a kdo je registrovaný,
    NIKDY tajemství (to zůstává v souborech v ~/.viewbase/, viz mfa.py)."""
    print(f"viewbase: {message}", flush=True)
    log_bus.publish(level, "backend_program", message, component="server")


class Project:
    """SLUŽBA projektu – vstupní bod workflow, analogie práce se souborem
    (uživatelské zadání: „stejně jako když je zvyklý pracovat se souborem,
    dělá nejdříve fopen … a po ukončení práce soubor zavírá close"):

        project = vb.Project(port=8080)      # 1. „fopen": porty PŘED vším
        screen = vb.Screen(title="…")        # 2. plocha → id
        graph = vb.GraphWindow(screen=screen)  # 3. okna na screenu
        graph.add_node(…)                    # 4. data přes instance oken
        project.serve(screen)                # 5. start služby (blokující)
        …                                    #    block=False → project.stop()
                                             #    zavře listener jako close()

    `serve()` bere SCREENY (plochy se vším, co na nich je) – grafová okna
    si z nich vezme sám (`screen.graph`); pro jednoduché případy přijme i
    přímo GraphWindow. Context manager: `with vb.Project(port=…) as p:`
    zavře port po bloku."""

    def __init__(self, *, host: str = "127.0.0.1", port: int = 8080,
                 user: str = mfa.DEFAULT_USER) -> None:
        self.host = host
        self.port = port
        # Uživatel TÉTO instance: proti jeho tajemství se ověřují zamčená okna
        # a do jeho adresáře (`~/.viewbase/user-<jméno>/`) jde QR.
        self.user = mfa.set_active_user(user)
        self._handle: ServerHandle | None = None

    def serve(self, *surfaces, open_browser: bool = False,
              block: bool = True) -> "ServerHandle | None":
        """Spusť službu nad screeny (nebo přímo grafovými okny). Grafové
        okno je na screenu VOLITELNÉ – screen jen s log/jinými okny se na
        drátě nese přes skrytého hostitele (interní GraphWindow s
        `config["graph_window"] = False`; frontend pro něj grafové okno
        ani pipeline vůbec nevytvoří)."""
        windows = []
        for surface in surfaces:
            if hasattr(surface, "snapshot"):     # přímo GraphWindow
                windows.append(surface)
                continue
            graph = getattr(surface, "graph", None)
            if graph is None:
                if not hasattr(surface, "id"):
                    raise ValueError(
                        "Project.serve() bere Screen nebo GraphWindow")
                # screen bez grafu: skrytý hostitel ponese titulek, téma a
                # okna screenu (např. log_window flag) v init snapshotu
                graph = GraphWindow(screen=surface, title=surface.title,
                                    theme=surface.theme)
                graph.config["graph_window"] = False
            windows.append(graph)
        handle = serve(*windows, host=self.host, port=self.port,
                       open_browser=open_browser, block=block)
        self._handle = handle
        return handle

    def stop(self, timeout: float = 5.0) -> None:
        """Zavři službu i listener port – „close()" projektu."""
        if self._handle is not None:
            self._handle.stop(timeout)
            self._handle = None

    def __enter__(self) -> "Project":
        return self

    def __exit__(self, *exc) -> None:
        self.stop()


class ServerHandle:
    """Server běžící na pozadí (serve(block=False)) – pro REPL a Jupyter.
    Kontext manager: `with vb.serve(c, block=False) as s:` ho po bloku
    zastaví."""

    def __init__(self, server: uvicorn.Server, thread: threading.Thread,
                 windows: tuple[GraphWindow, ...]):
        self._server = server
        self._thread = thread
        self._windows = windows

    @property
    def port(self) -> int:
        """Skutečný port (i pro port=0, kde OS přidělí efemérní)."""
        return self._server.servers[0].sockets[0].getsockname()[1]

    def stop(self, timeout: float = 5.0) -> None:
        """Zastav server (graceful), počkej na doběh vlákna, zavři grafová okna."""
        self._server.should_exit = True
        self._thread.join(timeout)
        for window in self._windows:
            window.close()

    def __enter__(self) -> "ServerHandle":
        return self

    def __exit__(self, *exc) -> None:
        self.stop()


def _make_server(windows: tuple[GraphWindow, ...], host: str,
                 port: int) -> uvicorn.Server:
    # ws_ping_interval=None vypíná serverový keepalive ping knihovny
    # websockets: jeho samostatná úloha jinak souběžně "draina" stejné
    # spojení jako náš broadcast a při velkém provozu spadne na interním
    # assertu. Mrtvá spojení odhalí selhání dalšího patche (klient se
    # reconnectne), keepalive proto nepotřebujeme.
    config = uvicorn.Config(create_app(*windows), host=host, port=port,
                            log_level="warning",
                            ws_ping_interval=None, ws_ping_timeout=None)
    return uvicorn.Server(config)


def serve(*windows: GraphWindow, host: str = "127.0.0.1", port: int = 8080,
          open_browser: bool = False,
          block: bool = True) -> ServerHandle | None:
    """Spustí server nad jedním nebo víc GraphWindow (multi-screen – víc
    grafových oken vyžaduje, aby mělo každé svůj `screen=`, viz `create_app`).
    `block=True` (default) blokuje do Ctrl-C; mutace grafu pak dělej
    z every() úloh nebo event handlerů. `block=False` server spustí
    v daemon vlákně a vrátí ServerHandle (REPL/Jupyter): prompt zůstane
    volný, `handle.stop()` server ukončí."""
    if not windows:
        raise ValueError("serve() vyžaduje aspoň jeden GraphWindow")
    first_run_setup()                    # ~/.viewbase, uživatel, TOTP + QR
    server = _make_server(windows, host, port)
    if open_browser:
        threading.Timer(
            0.7, webbrowser.open, args=(f"http://{host}:{port}/",)).start()
    if block:
        try:
            server.run()
        finally:
            for window in windows:
                window.close()   # i po KeyboardInterrupt – nenechat viset vlákna
        return None
    thread = threading.Thread(target=server.run, name="viewbase-server",
                              daemon=True)
    thread.start()
    deadline = time.monotonic() + 5.0
    while not server.started:          # čekej na bind (nebo pád)
        if not thread.is_alive():
            for window in windows:
                window.close()
            raise RuntimeError(
                "viewbase server se nepodařilo spustit – viz log výše"
                f" (host={host}, port={port})")
        if time.monotonic() > deadline:
            server.should_exit = True
            for window in windows:
                window.close()
            raise TimeoutError("viewbase server nenastartoval do 5 s")
        time.sleep(0.01)
    return ServerHandle(server, thread, windows)

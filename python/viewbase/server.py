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
import secrets
import threading
import time
import uuid
import webbrowser
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, Callable

import uvicorn
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

from . import access
from . import identity as identity_module
from . import mfa, protocol, sessions
from .logger import DEFAULT_LEVEL, logger
from .tls import Tls, require_tls, scheme_for, self_signed
from .version import build_id
from .graph_window import GraphWindow
from .log import LogRecord, bus as log_bus


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


def rest_principals(request, token: str | None,
                    granted: "list[str] | None") -> set[str]:
    """Kdo je REST volající. Bez tokenu ANONYM, tedy `group:public`.

    REST nemá relaci prohlížeče, takže dřív neměl identitu žádnou a
    obcházel tím celý model přístupu (`curl` bez ničeho spustil autorský
    handler na ploše, kterou nikdo neměl vidět). Programový klient se proto
    prokazuje tokenem – `Authorization: Bearer …` nebo `X-ViewBase-Token` –
    a dostane principály z `vb.Project(rest_access=[…])`.

    Porovnání je `compare_digest`: doba odpovědi nesmí prozradit, kolik
    znaků tokenu sedí."""
    from .access import PUBLIC, USERS, principal

    if not token:
        return {PUBLIC}
    hlavicka = (request.headers.get("x-viewbase-token")
                or request.headers.get("authorization", ""))
    predlozeny = hlavicka[7:] if hlavicka[:7].lower() == "bearer " else hlavicka
    if not predlozeny or not secrets.compare_digest(predlozeny, token):
        return {PUBLIC}
    return {principal(g) for g in (granted or [USERS])}


def _deliver_to(adresa: dict, sid: str | None) -> bool:
    """Smí tahle zpráva k téhle relaci? Tři nezávislé značky:

    - `acl` – principálové, kteří objekt VIDÍ (plocha, okno, log). Tohle je
      to, co dělá z „nevidíš" skutečné „neodešle se": obsah po drátě vůbec
      neputuje, místo aby se schovával v prohlížeči,
    - `only_sid` – přesně jedna relace (odemčení/zamčení),
    - `grant` – kdokoli, kdo má grant k danému privátnímu oknu.

    Musí projít VŠECHNY, které jsou uvedené."""
    acl = adresa.get("acl")
    if acl is not None and not access.allowed(sessions.store.principals(sid), acl):
        return False
    only = adresa.get("only_sid")
    if only is not None and sid != only:
        return False
    grant = adresa.get("grant")
    if grant is not None and not sessions.store.has(sid, grant):
        return False
    return True


def _wire_action(action: dict) -> dict:
    """Adresní značky jsou vnitřní věc serveru – klientovi po drátě nejdou."""
    if "only_sid" in action or "grant" in action:
        return {k: v for k, v in action.items() if k not in ("only_sid", "grant")}
    return action


async def _broadcast_step(windows: list[GraphWindow], windows_by_screen: dict,
                          clients: dict[WebSocket, str],
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
    # (zpráva, komu) – nic nejde všem automaticky, viz _deliver_to
    messages: list[tuple[str, dict | None]] = []
    log_acl: set[str] = set()
    closed = []
    for window in windows:
        actions = window.drain_actions()
        drained = window.drain()
        log_acl.update(window.acl_for_log())
        if drained is not None:
            seq, deltas = drained
            # Delty grafu patří PLOŠE: kdo ji nevidí, nedostane ani je.
            messages.append((protocol.encode(
                protocol.patch_message(seq, deltas, screen_id=window.screen_id)),
                {"acl": sorted(window._screen_acl())}))
        for action in actions:
            raw = protocol.encode({"type": "action", "screen_id": window.screen_id,
                                   **_wire_action(action)})
            adresa = {k: v for k, v in action.items()
                      if k in ("only_sid", "grant")}
            adresa["acl"] = window.acl_for_action(action)
            messages.append((raw, adresa))
        if window._closed:
            closed.append(window)
    for window in closed:
        windows.remove(window)
        windows_by_screen.pop(window.screen_id, None)
    if pending_logs:
        # Logem teče auditní stopa (IP, prefixy relací, příkazy ze shellu) –
        # nesmí odejít nikomu, kdo by log okno vůbec neviděl.
        adresa_logu = {"acl": sorted(log_acl)}
        messages.extend((protocol.encode(protocol.log_message(record)),
                         adresa_logu) for record in pending_logs)
        pending_logs.clear()
    if not messages or not clients:
        return
    for ws, sid in list(clients.items()):
        try:
            for raw, adresa in messages:
                if adresa is not None and not _deliver_to(adresa, sid):
                    continue
                await ws.send_text(raw)
        except Exception:
            clients.pop(ws, None)


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
            logger.exception(f"broadcast loop failed: {exc}", component="server")


async def _send_screens(ws: WebSocket, sid: str, windows: list,
                        videne: set, allow_anonymous: bool = True) -> None:
    """Pošli init ploch, které tahle relace VIDÍ a ještě nedostala.

    Volá se při připojení i po přihlášení – přihlášením se rozsah viditelného
    rozšíří a klient má dostat jen to nové, ne všechno znovu."""
    if not allow_anonymous and sessions.store.user(sid) is None:
        # Instance se nikomu neukazuje bez jména, ani kdyby bylo všechno
        # veřejné: `hidden` nenulové, aby klient poznal, že se má přihlásit.
        await ws.send_text(protocol.encode(protocol.session_message(
            user=None, visible=0, hidden=max(len(windows), 1))))
        return
    viditelnych = 0
    for window in windows:
        if not window._can_see_screen(sid):
            continue
        viditelnych += 1
        if window.screen_id in videne:
            continue
        # snapshot PER RELACI: privátní okna bez grantu jdou jen jako
        # prázdný rám, okna mimo ACL vůbec
        snap = window.snapshot(sid)
        await ws.send_text(protocol.encode(
            protocol.init_message(**snap, sid=sid,
                                  screen_id=window.screen_id)))
        videne.add(window.screen_id)
    await ws.send_text(protocol.encode(protocol.session_message(
        user=sessions.store.user(sid), visible=viditelnych,
        hidden=len(windows) - viditelnych)))


async def _zavri_neviditelne(ws: WebSocket, sid: str, windows: list,
                             videne: set) -> None:
    """Po odhlášení: plochy mimo dosah relace zmizí z klienta."""
    for window in windows:
        if window.screen_id in videne and not window._can_see_screen(sid):
            await ws.send_text(protocol.encode(
                {"type": "action", "screen_id": window.screen_id,
                 "action": "screen_remove"}))
            videne.discard(window.screen_id)
    await ws.send_text(protocol.encode(protocol.session_message(
        user=sessions.store.user(sid),
        visible=sum(1 for w in windows if w._can_see_screen(sid)),
        hidden=sum(1 for w in windows if not w._can_see_screen(sid)))))


def _make_log_relay(loop: asyncio.AbstractEventLoop):
    """LogBus.publish() volá subscribery synchronně, klidně z cizího vlákna
    (handler thread-pool, every() úloha). call_soon_threadsafe bezpečně
    předá záznam do event loopu, kde ho _broadcast_step vyzobne a pošle."""
    pending: list[dict] = []

    def _on_record(record: LogRecord) -> None:
        loop.call_soon_threadsafe(pending.append, record.as_dict())

    return pending, _on_record


def create_app(*windows: GraphWindow,
               allowed_origins: "list[str] | None" = None,
               allow_anonymous: bool = True,
               rest_token: str | None = None,
               rest_access: "list[str] | None" = None) -> FastAPI:
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

    # WebSocket -> session id prohlížeče (vb_sid). Dřív to byla množina bez
    # identity, takže se všechno rozesílalo všem; teď server ví, komu co smí.
    clients: dict[WebSocket, str] = {}
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
        peer = peer_of(ws)
        try:
            hello = protocol.decode(await ws.receive_text())
        except WebSocketDisconnect:
            return
        except ValueError:
            await ws.close()
            return
        try:
            if not origin_allowed(ws, allowed_origins):
                logger.audit(f"websocket refused – origin "
                             f"{ws.headers.get('origin')!r} not allowed",
                             level="warning", ip=peer)
                await ws.send_text(protocol.encode(
                    {"type": "error", "error": "origin_not_allowed"}))
                await ws.close()
                return
            if (hello.get("type") != "hello"
                    or hello.get("protocol") != protocol.PROTOCOL_VERSION):
                await ws.send_text(protocol.encode(
                    {"type": "error", "error": "protocol_mismatch"}))
                await ws.close()
                return
            # RELACE: prohlížeč si drží `vb_sid` v localStorage a posílá ho
            # v hello. Neznámé/vypršelé id se neoživuje – klient dostane nové
            # a prázdné (sessions.touch), takže granty nejdou „vzkřísit".
            sid = sessions.store.touch(hello.get("sid"), origin=peer)
            # Sdílený zámek: snapshoty + zařazení mezi klienty je atomické
            # vůči broadcast kroku. Pending delty se NEzahazují – příští
            # broadcast je pošle všem (novému klientovi jako idempotentní
            # upsert), takže seq navazuje pro staré i nové klienty.
            # AUDIT: kdo se odkud připojil. Jde do logu vždycky, i když je
            # `log_level` nastavená nahoru – jinak by šlo zamést za sebou.
            logger.audit(f"client {client_id} connected", sid=sid, ip=peer)
            videne: set[int | None] = set()
            async with state_lock:
                await _send_screens(ws, sid, windows_list, videne,
                                        allow_anonymous)
                clients[ws] = sid
        except WebSocketDisconnect:
            return
        try:
            while True:
                raw = await ws.receive_text()
                try:
                    msg = protocol.decode(raw)
                except ValueError:
                    # vadná zpráva je na vystavené instanci stopa, ne jen
                    # diagnostika – proto audit (prahem neprojde do ticha)
                    logger.audit(f"malformed message from client {client_id}: "
                                 f"{raw[:200]!r}", level="warning",
                                 sid=sid, ip=peer)
                    continue
                if msg.get("type") == "login":
                    jmeno = str(msg.get("user") or "").strip()
                    skupiny = identity_module.login(jmeno, msg.get("code") or "")
                    if skupiny is None:
                        # Neúspěch jde do auditu VŽDYCKY: zkoušení jmen a kódů
                        # je přesně to, co je na vystavené instanci vidět.
                        logger.audit(f"login failed for user '{jmeno}'",
                                     level="warning", sid=sid, ip=peer)
                        await ws.send_text(protocol.encode(
                            {"type": "login_failed"}))
                        continue
                    sessions.store.login(sid, jmeno, skupiny)
                    logger.audit(f"login: '{jmeno}' in "
                                 f"{sorted(skupiny)}", sid=sid, ip=peer)
                    async with state_lock:
                        await _send_screens(ws, sid, windows_list, videne,
                                        allow_anonymous)
                    continue
                if msg.get("type") == "lock_all":
                    kolik = sessions.store.revoke_all(sid)
                    logger.audit(f"all windows locked on request "
                                 f"({kolik} grants revoked)", sid=sid, ip=peer)
                    async with state_lock:
                        videne.clear()      # ať init dorazí znovu, už zamčený
                        await _send_screens(ws, sid, windows_list, videne,
                                        allow_anonymous)
                    continue
                if msg.get("type") == "logout":
                    kdo = sessions.store.logout(sid)
                    logger.audit(f"logout: '{kdo or 'anonymous'}'",
                                 sid=sid, ip=peer)
                    # Plochy, které relace po odhlášení nevidí, klient zavře
                    # sám na `screen_remove`; init už mu je znovu neposíláme.
                    async with state_lock:
                        await _zavri_neviditelne(ws, sid, windows_list, videne)
                    continue
                if msg.get("type") == "event" and isinstance(msg.get("event"), str):
                    payload = msg.get("payload")
                    if not isinstance(payload, dict):
                        payload = {}
                    target = _resolve_window(windows_by_screen,
                                             msg.get("screen_id"))
                    if target is None:
                        logger.warning(
                            f"event with unknown screen_id from client "
                            f"{client_id}: {msg.get('screen_id')!r}",
                            component="server", sid=sid, ip=peer)
                        continue
                    # `sid` do payloadu doplňuje SERVER, ne klient: jinak by
                    # si kdokoli mohl přiřknout cizí relaci a s ní její granty.
                    # KAŽDÁ událost na úrovni debug: na vystavené instanci
                    # tohle ukáže, co se kdo pokouší volat (log_level="debug").
                    # Výjimka: `shell_input` chodí po jednom znaku, takže by
                    # z něj byl řádek na stisk – ten se skládá do dávek ve
                    # windows_mixin (viz keystrokes.py).
                    if msg["event"] != "shell_input":
                        logger.debug(f"event '{msg['event']}' "
                                     f"(client {client_id}): {redacted(payload)}",
                                     component="server", sid=sid, ip=peer)
                    # `principals: None` schválně a vždycky: rozhoduje
                    # relace (`sid`), ne to, co si klient napsal do payloadu.
                    target.dispatch_event(
                        msg["event"],
                        {**payload, "client_id": client_id, "sid": sid,
                         "principals": None, "remote_ip": peer})
                else:
                    logger.audit(f"unexpected message from client {client_id}: "
                                 f"{raw[:200]!r}", level="warning",
                                 sid=sid, ip=peer)
        except WebSocketDisconnect:
            pass
        finally:
            clients.pop(ws, None)
            logger.audit(f"client {client_id} disconnected", sid=sid, ip=peer)

    @app.post("/api/event")
    def inject_event(message: dict, request: Request) -> dict:
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
        # Zdroj do KAŽDÉHO záznamu: REST je bez autentizace a na vystavené
        # instanci je právě IP to, podle čeho se pozná, kdo si hraje.
        # Tělo požadavku je DIAGNOSTIKA (log_level="debug"): na vystavené
        # instanci to ukáže, co kdo zkouší volat, ale běžný provoz aplikace
        # tím log nezaplaví. Odmítnuté pokusy jdou do auditu níž – ty musí
        # být vidět vždycky.
        logger.debug(f"event {message.get('event')!r} "
                     f"{redacted(message.get('payload'))}",
                     source="backend_api", component="rest", ip=peer_of(request))
        event = message.get("event")
        payload = message.get("payload") or {}
        if not isinstance(event, str) or not isinstance(payload, dict):
            return {"ok": False, "error": "čekám {event: str, payload: dict}"}
        # BEZPEČNOST (spec 2026-08-18 §Shell okno): tenhle endpoint je bez
        # autentizace, takže klávesy do shellu smí posílat JEN prohlížeč přes
        # WS – jinak by stačil jeden curl na spuštění čehokoli na stroji.
        if event.startswith(("shell_", "window_unlock", "window_lock")):
            logger.audit(f"REST attempt to call '{event}' – refused",
                         level="warning", ip=peer_of(request))
            return JSONResponse(status_code=403, content={
                "ok": False,
                "error": ("shell_*, window_unlock and window_lock are not "
                          "allowed over REST (browser WebSocket only)")})
        target = _resolve_window(windows_by_screen, message.get("screen_id"))
        if target is None:
            return {"ok": False,
                    "error": f"neznámý screen_id {message.get('screen_id')!r}"}
        # `principals` dosazuje SERVER a VŽDYCKY – kdyby se jen doplňovaly,
        # když v payloadu chybí, poslal by si je klient sám a byl by z toho
        # správce.
        kdo = rest_principals(request, rest_token, rest_access)
        target.dispatch_event(event, {**payload, "client_id": "rest",
                                      "principals": kdo,
                                      "remote_ip": peer_of(request)})
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
    # ČÍM to běží – první řádek v logu. U instance, jejíž log se vyhodnocuje
    # zpětně, je bez tohohle každý nález bezcenný: nedá se poznat, na které
    # verzi se stal (viz version.build_id).
    _system_log(f"viewbase {build_id()} starting")
    user = mfa.active_user()
    sessions.reset()          # nový běh serveru = všechno zase zamčené
    mfa.ensure_user(user)
    users = mfa.describe_users()
    _system_log(f"instance user: {user}"
                + (f"; registered: {', '.join(users)}" if users else ""))
    if not mfa.available():
        # Kdo má TOTP zaregistrované, ale spustí instanci v prostředí bez
        # `pyotp`, jinak jen kouká, proč mu autentikátor nefunguje.
        _system_log(
            "pyotp is missing in this environment – private windows fall back "
            "to a one-time code in a file"
            + (f" (user '{user}' HAS TOTP registered, so the authenticator "
               "code will NOT work); "
               if mfa.registered(user) else "; ")
            + "enable TOTP: pip install pyotp qrcode "
              "(standard viewbase dependencies)", "warning")


#: Klíče, jejichž HODNOTA se do logu nikdy nesmí dostat. `code` je odemykací
#: kód, `data` jsou klávesy do shellu (tedy i hesla, která tam někdo píše),
#: `sid` je přihlašovací údaj relace. Zbytek payloadu je pro ladění potřeba.
CITLIVE_KLICE = ("code", "data", "sid", "password", "secret", "token")


def redacted(payload: dict) -> str:
    """Payload pro log: citlivé hodnoty nahrazené délkou, zbytek zkrácený.

    Ladicí záznam každé události je na vystavené instanci k nezaplacení, ale
    payload nese i tajemství – bez tohohle by odemykací kód i klávesy ze
    shellu skončily v `docker logs` (nalezeno při živém testu)."""
    bezpecny = {
        klic: (f"<{len(str(hodnota))} znaků>" if klic in CITLIVE_KLICE
               else str(hodnota)[:80])
        for klic, hodnota in (payload or {}).items()}
    return str(bezpecny)[:300]


def origin_allowed(ws: WebSocket, allowed: "list[str] | None") -> bool:
    """Smí tenhle `Origin` otevřít WebSocket?

    WEBSOCKET NEPROCHÁZÍ CORS: cizí stránka otevřená v prohlížeči diváka se
    může připojit na náš server a prohlížeč jí v tom nezabrání. Grant tím
    nezíská (session id je v `localStorage`, na který nedosáhne, takže dostane
    prázdnou relaci), ale uvidí obsah NEZABEZPEČENÝCH oken a může posílat
    události. Kontrola originu tuhle celou třídu zavírá.

    Pravidla:

    - hlavička chybí → povolit (curl, testy, vlastní klienti; není to
      prohlížeč, takže se nedá zneužít cizí stránkou),
    - `allowed_origins` nastavené → musí být na seznamu,
    - jinak → musí sedět na `Host` požadavku (tedy stránka z téhle instance).
    """
    origin = ws.headers.get("origin")
    if not origin:
        return True
    if allowed is not None:
        return origin in allowed
    host = ws.headers.get("host", "")
    return origin.split("://")[-1] == host


def peer_of(scope_owner: Any) -> str:
    """IP protistrany (WebSocket i HTTP request), nebo `?`.

    ZÁZNAM ZDROJE JE POVINNÁ ČÁST AUDITU: instance vystavená do internetu
    musí u každé události říct, odkud přišla, jinak se z logu nedá poznat,
    jestli kód k oknu hádal jeden stroj, nebo tisíc.

    Za reverzní proxy je protistranou proxy; uvicorn respektuje
    `X-Forwarded-For` jen od důvěryhodných adres (`forwarded_allow_ips`,
    výchozí 127.0.0.1) – bez toho by si zdroj mohl kdokoli přepsat hlavičkou."""
    klient = getattr(scope_owner, "client", None)
    return getattr(klient, "host", None) or "?"


def _system_log(message: str, level: str = "info") -> None:
    """Systémová hláška při startu (viz logger.Logger.system)."""
    logger.system(message, level)


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
                 user: str = mfa.DEFAULT_USER,
                 users: "list[str] | dict[str, list[str]] | None" = None,
                 users_file: "str | None" = None,
                 identity: "Any | None" = None,
                 policy: "Any | None" = None,
                 default_access: "list[str] | None" = None,
                 allow_anonymous: bool = True,
                 rest_token: str | None = None,
                 rest_access: "list[str] | None" = None,
                 tls: "Tls | bool | None" = None,
                 tls_hosts: "list[str] | tuple[str, ...] | None" = None,
                 http_redirect: "bool | int" = False,
                 forwarded_allow_ips: str | None = None,
                 allowed_origins: "list[str] | None" = None,
                 log_level: str = DEFAULT_LEVEL,
                 session_ttl: float | None = None,
                 session_max_age: float | None = None) -> None:
        self.host = host
        self.port = port
        # TLS: `tls=vb.Tls(cert, key)` = vlastní certifikát (ověří se hned tady,
        # ne až při startu – o překlepu v cestě se vývojář dozví okamžitě);
        # `tls=True` = vlastnoručně podepsaný z `~/.viewbase/tls/`, vyrobí se
        # při první instanciaci stejně jako TOTP a QR.
        self.tls = (self_signed(host, hosts=tls_hosts) if tls is True
                    else (tls or None))
        # Přesměrování plaintextu na TLS: na TÉMŽE portu nejde (viz
        # _redirect_app), proto druhý listener – True = port+1, nebo číslo.
        self.http_redirect = http_redirect
        # Za reverzní proxy (nginx, Traefik) je protistranou proxy: bez
        # tohohle je v auditu její IP místo skutečného zdroje. Hodnota je
        # seznam adres, KTERÝM SE VĚŘÍ hlavička X-Forwarded-For – ne seznam
        # klientů. Věřit komukoli („*") znamená, že si zdroj v logu přepíše
        # kdokoli hlavičkou, takže sem patří jen adresa vaší proxy.
        self.forwarded_allow_ips = forwarded_allow_ips
        # Odkud smí přijít stránka, která otevře WebSocket. `None` = jen z
        # téhle instance (Origin musí sedět na Host); seznam = jmenovitě.
        self.allowed_origins = allowed_origins
        # CO aplikace loguje (ne co ukazuje log okno – to je pohledový filtr
        # v prohlížeči). Výchozí `warning`: provozní server mlčí o rutině.
        # Bezpečnostní audit tím utišit NEJDE, viz logger.Logger.audit.
        self.log_level = log_level
        # Relace prohlížeče: klouzavá platnost (bez aktivity vyprší) a
        # absolutní strop (po něm zase kód z autentikátoru), viz sessions.py.
        sessions.configure(ttl=session_ttl, max_age=session_max_age)
        # Uživatel TÉTO instance: proti jeho tajemství se ověřují zamčená okna
        # a do jeho adresáře (`~/.viewbase/user-<jméno>/`) jde QR.
        # POLITIKA INSTANCE – dvě nezávislé zásuvné osy (viz identity.py):
        # `identity` říká, KDO je kdo (výchozí JSON soubor, může být LDAP),
        # `policy` říká, co smí naše objekty (výchozí sekce `access` v témže
        # souboru). Cesta k souboru je z konfigurace, ne z proměnných
        # prostředí roztroušených po systému.
        # Anonymní relace: smí se vůbec někdo dívat bez přihlášení? Výchozí
        # ano – veřejné objekty (`group:public`) tak zůstanou veřejné.
        # `False` znamená „nejdřív se představ", i kdyby bylo všechno veřejné.
        self.allow_anonymous = bool(allow_anonymous)
        # REST je programový vstup bez relace prohlížeče: bez tokenu je to
        # anonym (`group:public`), s tokenem dostane `rest_access`.
        self.rest_token = rest_token
        self.rest_access = rest_access
        mfa.configure_store(users_file)
        identity_module.configure(identity)
        identity_module.configure_policy(policy)
        access.configure_default(default_access)
        self.user = mfa.set_active_user(user)
        # UŽIVATELÉ INSTANCE se zakládají TEĎ, při vzniku instance – ne až
        # při `serve()`. Vývojář tak dostane QR do konzole hned, jak si
        # instanci vyrobí, a může je rozdat dřív, než službu spustí.
        # Existující se nepřepisují (tajemství přežije restart aplikace).
        zalozeni = mfa.provision(users, self.user)
        if zalozeni:
            _system_log("new users provisioned: " + ", ".join(zalozeni)
                        + f" (authenticator label '{mfa.ISSUER}:"
                        + mfa.account_label(zalozeni[0]) + "' etc.)")
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
                       open_browser=open_browser, tls=self.tls,
                       http_redirect=self.http_redirect,
                       forwarded_allow_ips=self.forwarded_allow_ips,
                       allowed_origins=self.allowed_origins,
                       allow_anonymous=self.allow_anonymous,
                       rest_token=self.rest_token,
                       rest_access=self.rest_access, block=block)
        self._handle = handle
        return handle

    @property
    def log_level(self) -> str:
        """Úroveň, od které se DIAGNOSTIKA zaznamenává (výchozí `warning`).

        Filtr v log okně je něco jiného: ten jen vybírá, co divák VIDÍ.
        Tohle rozhoduje, co vůbec vznikne. Dá se měnit za běhu:
        `project.log_level = "debug"` zapne mimo jiné záznam každé příchozí
        události i těla REST požadavků – to, co chcete na instanci vystavené
        do internetu. Bezpečnostní audit jde do logu vždycky."""
        return logger.level

    @log_level.setter
    def log_level(self, value: str) -> None:
        logger.level = value

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


def _bound_port(server: uvicorn.Server, fallback: int) -> int:
    """Skutečný port běžícího serveru (u `port=0` ho přiděluje OS)."""
    for s in getattr(server, "servers", []):
        for sock in getattr(s, "sockets", []):
            try:
                return int(sock.getsockname()[1])
            except (OSError, IndexError, TypeError):
                pass
    return fallback


def _redirect_app(target: Callable[[], str]) -> FastAPI:
    """Malá aplikace, která všechno pošle na TLS adresu.

    Přesměrovat na TÉMŽE portu nejde: klient mluví plaintextem do socketu,
    který čeká TLS handshake, takže server nemá kam odpovědět (prohlížeč
    hlásí prázdnou odpověď). Proto druhý, plaintextový listener – přesně jak
    to dělá dvojice :80 → :443."""
    app = FastAPI()

    @app.get("/{cesta:path}")
    def redirect(cesta: str, request: Request):     # noqa: ARG001
        dotaz = request.url.query
        # cíl se zjišťuje AŽ PŘI POŽADAVKU: u `port=0` přiděluje port OS a
        # v době startu přesměrovače ho ještě nikdo nezná
        return RedirectResponse(
            f"{target()}{cesta}" + (f"?{dotaz}" if dotaz else ""), status_code=308)

    return app


def _start_redirect(host: str, port: int,
                    target: Callable[[], str]) -> uvicorn.Server:
    """Spusť přesměrovací listener v daemon vlákně a vrať jeho server."""
    config = uvicorn.Config(_redirect_app(target), host=host, port=port,
                            log_level="warning")
    server = uvicorn.Server(config)
    threading.Thread(target=server.run, name="viewbase-redirect",
                     daemon=True).start()
    return server


def _make_server(windows: tuple[GraphWindow, ...], host: str,
                 port: int, tls: Tls | None = None,
                 forwarded_allow_ips: str | None = None,
                 allowed_origins: "list[str] | None" = None,
                 allow_anonymous: bool = True,
                 rest_token: str | None = None,
                 rest_access: "list[str] | None" = None) -> uvicorn.Server:
    # ws_ping_interval=None vypíná serverový keepalive ping knihovny
    # websockets: jeho samostatná úloha jinak souběžně "draina" stejné
    # spojení jako náš broadcast a při velkém provozu spadne na interním
    # assertu. Mrtvá spojení odhalí selhání dalšího patche (klient se
    # reconnectne), keepalive proto nepotřebujeme.
    # `forwarded_allow_ips`: komu se věří hlavička `X-Forwarded-For`. Za
    # reverzní proxy je protistranou proxy, takže bez tohohle vidí audit její
    # IP místo skutečného zdroje; a naopak — věřit komukoli by znamenalo, že
    # si zdroj v logu přepíše hlavičkou kdokoli. Výchozí (uvicorn) 127.0.0.1.
    config = uvicorn.Config(create_app(*windows, allowed_origins=allowed_origins,
                                       allow_anonymous=allow_anonymous,
                                       rest_token=rest_token,
                                       rest_access=rest_access),
                            host=host, port=port,
                            log_level="warning",
                            ws_ping_interval=None, ws_ping_timeout=None,
                            **({"forwarded_allow_ips": forwarded_allow_ips}
                               if forwarded_allow_ips else {}),
                            **(tls.uvicorn_kwargs() if tls else {}))
    return uvicorn.Server(config)


def serve(*windows: GraphWindow, host: str = "127.0.0.1", port: int = 8080,
          open_browser: bool = False, tls: Tls | None = None,
          http_redirect: "bool | int" = False,
          forwarded_allow_ips: str | None = None,
          allowed_origins: "list[str] | None" = None,
          allow_anonymous: bool = True,
          rest_token: str | None = None,
          rest_access: "list[str] | None" = None,
          block: bool = True) -> ServerHandle | None:
    """Spustí server nad jedním nebo víc GraphWindow (multi-screen – víc
    grafových oken vyžaduje, aby mělo každé svůj `screen=`, viz `create_app`).
    `block=True` (default) blokuje do Ctrl-C; mutace grafu pak dělej
    z every() úloh nebo event handlerů. `block=False` server spustí
    v daemon vlákně a vrátí ServerHandle (REPL/Jupyter): prompt zůstane
    volný, `handle.stop()` server ukončí."""
    if not windows:
        raise ValueError("serve() vyžaduje aspoň jeden GraphWindow")
    # Zabezpečené okno mimo loopback bez TLS = kód i session id čitelně po
    # drátě; radši nenastartovat než tiše vystavit (viz tls.require_tls).
    require_tls(host, tls, private_windows=any(w.has_private_window()
                                               for w in windows))
    first_run_setup()                    # ~/.viewbase, uživatel, TOTP + QR
    # ADRESA DO LOGU: s TLS server na `http://` neodpoví vůbec (klient dostane
    # prázdnou odpověď) – bez vypsané adresy se na to dá snadno naletět.
    adresa = f"{scheme_for(tls)}://{host or '127.0.0.1'}:{port}/"
    if tls is not None:
        _system_log(f"listening on {adresa} (TLS, cert {tls.cert}; "
                    "plain http:// will NOT answer on this port)")
    else:
        _system_log(f"listening on {adresa}")
    server = _make_server(windows, host, port, tls, forwarded_allow_ips,
                          allowed_origins, allow_anonymous,
                          rest_token, rest_access)
    if forwarded_allow_ips:
        _system_log(f"trusting X-Forwarded-For from {forwarded_allow_ips}")
    if tls is not None and http_redirect:
        # `http_redirect=True` → port+1, nebo konkrétní číslo portu
        rport = port + 1 if http_redirect is True else int(http_redirect)
        _start_redirect(
            host, rport,
            lambda: (f"{scheme_for(tls)}://{host or '127.0.0.1'}:"
                     f"{_bound_port(server, port)}/"))
        _system_log(f"plain http on port {rport} redirects to {adresa}")
    if open_browser:
        url = f"{scheme_for(tls)}://{host}:{port}/"
        threading.Timer(0.7, webbrowser.open, args=(url,)).start()
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

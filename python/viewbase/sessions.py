"""Relace prohlížeče a granty k zabezpečeným oknům.

PROČ TO EXISTUJE. Do téhle verze byl zámek okna GLOBÁLNÍ vypínač: kdo zadal
kód, odemkl okno *na serveru* – a obsah se pak rozeslal všem připojeným, i
tomu, kdo přišel za hodinu a kód nikdy neviděl. Ověření tedy probíhalo jednou
za život okna, ne za relaci. Tady je to opravené: odemčení je **grant dvojice
(relace, okno)** s omezenou platností a server podle něj rozhoduje u KAŽDÉ
zprávy, komu obsah pošle a od koho vstup přijme.

PROČ NEPRŮHLEDNÉ ID A NE PODEPSANÝ TOKEN. Okna žijí v jednom procesu, který
je zároveň jediný ověřovatel – podepsaný token (JWT) by přinesl klíč k
rotaci, generace kvůli odvolávání a hodiny k synchronizaci, a nic by nevyřešil.
Neprůhledné id znamená, že pravdu drží tahle tabulka: odvolání (`Lock Window`,
`Logout`, konec platnosti) je smazání řádku a je okamžité. „Refresh" tokenu
odpadá úplně – hodnota v prohlížeči se nemění, jen se posouvá expirace
(klouzavá platnost), a to dělá server sám při provozu.

Dvě lhůty, obě potřebné:

- `ttl` (klouzavá) – relace bez aktivity vyprší; kdo odejde od stroje, ztratí
  přístup k obsahu, i když nechal tab otevřený,
- `max_age` (absolutní) – relace se nedá držet naživu donekonečna pouhým
  klikáním; po strop se vždycky znovu chce kód z autentikátoru.

Restart serveru tabulku zahodí, a to je správně: po restartu je všechno zase
zamčené. Session id samo o sobě NENÍ tajemství chráněné šifrou – po drátě ho
chrání TLS (viz tls.require_tls, mimo loopback povinné)."""
from __future__ import annotations

import secrets
import threading
import time
from typing import Callable

#: Klouzavá platnost relace (s) – přepíše `vb.Project(session_ttl=…)`.
DEFAULT_TTL = 900.0
#: Absolutní strop relace (s); po něm zase autentikátor.
DEFAULT_MAX_AGE = 8 * 3600.0
#: Délka session id v bajtech entropie (token_urlsafe je zakóduje).
SID_BYTES = 24


def new_sid() -> str:
    """Nové session id (kryptograficky náhodné, neuhodnutelné)."""
    return secrets.token_urlsafe(SID_BYTES)


class SessionStore:
    """Tabulka relací a jejich grantů k oknům. Thread-safe (handlery běží ve
    vlastním poolu, broadcast v event loopu).

    Čas se dá vstříknout (`clock`), takže se dá testovat vypršení bez čekání.
    """

    def __init__(self, *, ttl: float = DEFAULT_TTL,
                 max_age: float = DEFAULT_MAX_AGE,
                 clock: Callable[[], float] = time.monotonic) -> None:
        if ttl <= 0 or max_age <= 0:
            raise ValueError("ttl i max_age musí být kladné")
        self.ttl = float(ttl)
        self.max_age = float(max_age)
        self._clock = clock
        self._lock = threading.RLock()
        # sid -> {"born": t, "seen": t, "grants": {window_id: t_grant}}
        self._sessions: dict[str, dict] = {}

    # -- relace ------------------------------------------------------------

    def touch(self, sid: str | None, origin: str = "") -> str:
        """Zaeviduj/prodluž relaci a vrať platné sid.

        Neznámé (nebo vypršelé) sid se NEOŽIVÍ – vrátí se nové, prázdné.
        Kdyby se oživilo, stačilo by si zapamatovat staré id a po vypršení se
        vrátit k dřív získaným grantům.

        `origin` (odkud přišlo) jde do auditu, když někdo předloží relaci,
        která už neexistuje – po vypršení je to běžný reconnect, ale na
        vystavené instanci je to zároveň to, co je vidět při zkoušení
        cizích id."""
        with self._lock:
            now = self._clock()
            self._gc(now)
            if sid and sid in self._sessions:
                self._sessions[sid]["seen"] = now
                return sid
            if sid:
                from .logger import logger

                logger.audit(f"stale session {str(sid)[:8]}… presented "
                             f"{origin or 'from ?'} – issuing a new one")
            fresh = new_sid()
            self._sessions[fresh] = {"born": now, "seen": now, "grants": {}}
            return fresh

    def known(self, sid: str | None) -> bool:
        with self._lock:
            self._gc(self._clock())
            return bool(sid) and sid in self._sessions

    def forget(self, sid: str | None) -> None:
        """Logout: relace i všechny její granty zmizí."""
        with self._lock:
            self._sessions.pop(sid or "", None)

    # -- granty ------------------------------------------------------------

    def grant(self, sid: str, window_id: str) -> None:
        """Po ověření kódu: tahle relace smí obsah tohohle okna."""
        with self._lock:
            now = self._clock()
            rel = self._sessions.get(sid)
            if rel is None:                     # neznámé sid = žádný grant
                return
            rel["seen"] = now
            rel["grants"][str(window_id)] = now

    def has(self, sid: str | None, window_id: str) -> bool:
        """Smí tahle relace vidět obsah okna? (Jediná otázka, kterou se
        server ptá při každé zprávě k oknu i od okna.)"""
        with self._lock:
            self._gc(self._clock())
            rel = self._sessions.get(sid or "")
            return bool(rel) and str(window_id) in rel["grants"]

    def revoke(self, sid: str | None, window_id: str) -> None:
        """`Options → Lock Window` pro jednu relaci."""
        with self._lock:
            rel = self._sessions.get(sid or "")
            if rel is not None:
                rel["grants"].pop(str(window_id), None)

    def revoke_window(self, window_id: str) -> None:
        """Okno se zamklo pro všechny (zavření okna, `Lock all windows`)."""
        with self._lock:
            for rel in self._sessions.values():
                rel["grants"].pop(str(window_id), None)

    def sids_with(self, window_id: str) -> list[str]:
        """Relace, které mají grant k oknu (komu poslat obsah)."""
        with self._lock:
            self._gc(self._clock())
            return [sid for sid, rel in self._sessions.items()
                    if str(window_id) in rel["grants"]]

    # -- úklid -------------------------------------------------------------

    def _gc(self, now: float) -> None:
        """Zahoď relace za klouzavou platností nebo za absolutním stropem.

        Vypršení se ZAZNAMENÁVÁ (debug): jinak se z logu nedá poznat rozdíl
        mezi „divák odešel" a „relace mu vypršela pod rukama", a přitom to
        vysvětluje, proč si okno najednou zase řeklo o kód."""
        mrtve = [(sid, rel) for sid, rel in self._sessions.items()
                 if now - rel["seen"] > self.ttl
                 or now - rel["born"] > self.max_age]
        for sid, rel in mrtve:
            del self._sessions[sid]
            duvod = ("idle" if now - rel["seen"] > self.ttl else "max age")
            self._ohlas(f"session {sid[:8]}… expired ({duvod} after "
                        f"{now - rel['born']:.0f} s, {len(rel['grants'])} grants "
                        "revoked)")

    @staticmethod
    def _ohlas(message: str) -> None:
        """Zpráva o životním cyklu relace do ladicího logu (`log_level=debug`)."""
        from .logger import logger

        logger.debug(message, component="server")

    def clear(self) -> None:
        """Zapomeň všechny relace (restart serveru, testy)."""
        with self._lock:
            self._sessions.clear()

    def stats(self) -> dict[str, int]:
        """Pro log a testy: kolik relací a kolik grantů drží."""
        with self._lock:
            self._gc(self._clock())
            return {"sessions": len(self._sessions),
                    "grants": sum(len(r["grants"])
                                  for r in self._sessions.values())}


#: Proces-wide tabulka (jako log.bus): okna a server sdílejí jednu.
store = SessionStore()


def configure(*, ttl: float | None = None, max_age: float | None = None) -> None:
    """Přenastav globální tabulku (volá `vb.Project(session_ttl=…)`)."""
    if ttl is not None:
        store.ttl = float(ttl)
    if max_age is not None:
        store.max_age = float(max_age)


def reset() -> None:
    """Zapomeň všechny relace (testy, nový běh serveru)."""
    store.clear()

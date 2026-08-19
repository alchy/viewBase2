"""Kdo je uživatel a do jakých skupin patří.

ZÁSUVNÉ SCHVÁLNĚ: ověření identity a zdroj skupin jsou dvě různé věci a
v reálném nasazení bývají na různých místech (TOTP lokálně, skupiny
z adresáře). Proto rozhraní `IdentityProvider` a ne pevně zadrátovaný soubor
– LDAP nebo OIDC se přidá jako další implementace, bez zásahu do jádra.

SKUPINY SE NESTUJÍ REKURZIVNĚ a deklaruje to **nadřazená skupina**:
`group:ucetni` si vyjmenuje své podskupiny (`group:fakturace`, `group:mzdy`)
i konkrétní lidi. Kdo je ve `fakturaci`, je tím pádem i `ucetni` – členství
se propaguje NAHORU, přístup tedy platí dolů: co povolím účetním, mají i
fakturantky, a nemusím to nikde opakovat.

ROZBALUJE TO PROVIDER, NE JÁDRO. `groups_of()` vrací **tranzitivní uzávěr**,
tedy hotovou plochou množinu. Jádro tak nikdy nechodí po grafu skupin při
každé zprávě (to by byl průchod grafem a invalidace cache u každého
kliknutí) a autorizace zůstává jeden průnik množin (viz access.allowed).

CYKLY jsou v členství běžná chyba (`a` obsahuje `b`, `b` obsahuje `a`);
rozbalování je ohlídané navštívenou množinou, takže skončí, ne zacyklí.

PRO APLIKAČNÍ KÓD JE TENHLE MODUL ČERNÁ SKŘÍŇKA. Aplikace uživatele
NEZAKLÁDÁ, NEČTE ani nevypisuje – jediné, co dělá, je že na SVÝCH prvcích
jmenuje principály (`okno.access.add("group:ucetni")`). Samotné identity žijí
mimo program, v souboru politiky (nebo v adresáři), a spravuje je správce.
Důvod je praktický i bezpečnostní: kdyby aplikace uměla zakládat identity,
byl by seznam uživatelů funkcí nasazené verze kódu, ne konfigurace – a
každá aplikace by si směla vyrobit vlastního správce.

Jmenovat principála, který zatím neexistuje, není chyba (v adresáři může
vzniknout později), ale VŽDYCKY se to objeví v logu jako varování – tichý
překlep by jinak znamenal okno, které nikdo neuvidí.
"""
from __future__ import annotations

from typing import Iterable, Protocol

from .access import ADMINISTRATOR, USERS, principal
from .logger import logger


class IdentityProvider(Protocol):
    """Zdroj IDENTIT. Tři otázky, nic víc.

    Zásuvné: výchozí je JSON soubor (`LocalProvider`), ale nic nebrání
    LDAP nebo OIDC – stačí implementovat tyhle tři metody a předat instanci
    do `vb.Project(identity=…)`. Jádro se nikdy neptá jinak."""

    def exists(self, username: str) -> bool:
        """Zná tenhle zdroj takového uživatele?"""

    def authenticate(self, username: str, secret: str) -> bool:
        """Sedí tajemství (kód z autentikátoru, heslo, token)?"""

    def groups_of(self, username: str) -> set[str]:
        """Skupiny uživatele – UŽ ROZBALENÉ (tranzitivní uzávěr)."""


def expand_groups(seed: Iterable[str],
                  members: dict[str, Iterable[str]]) -> set[str]:
    """Rozbal rekurzivní členství do ploché množiny skupin.

    `members` je tak, jak to člověk píše a jak to ukazují správcovské nástroje
    – NADŘAZENÁ skupina vyjmenuje, co obsahuje:

        {"group:ucetni": ["group:fakturace", "group:mzdy", "user:hana"]}

    Kdo je ve `fakturaci`, je tím i `ucetni`. Uvnitř se mapa jednou obrátí
    (potomek → rodiče) a od `seed` (skupiny uživatele a jeho `user:` identita)
    se jde NAHORU do šířky. Navštívená množina hlídá cykly.

    Vrací jen `group:` principály – `user:` se do skupin nepočítá, slouží jen
    jako vstupní bod, když je člověk vypsaný přímo u skupiny."""
    rodice: dict[str, list[str]] = {}
    for nadrazena, obsah in members.items():
        for clen in obsah:
            rodice.setdefault(principal(clen), []).append(principal(nadrazena))

    fronta = [principal(g) for g in seed]
    videno: set[str] = set()
    while fronta:
        uzel = fronta.pop()
        if uzel in videno:
            continue
        videno.add(uzel)
        fronta.extend(rodice.get(uzel, ()))
    return {g for g in videno if g.startswith("group:")}


class LocalProvider:
    """Uživatelé a skupiny z `~/.viewbase/users.json` (v2).

    Ověřuje TOTP z autentikátoru (viewbase.mfa); skupiny bere ze záznamu
    uživatele a rozbaluje podle sekce `groups` v témže souboru. Zápis je
    STRUKTUROVANÝ – nadřazená skupina vyjmenuje, co obsahuje (ne unixový
    passwd styl, kde se členství píše k uživateli a hierarchie se nedá
    vyjádřit vůbec):

        {
          "version": 2,
          "users": {
            "jana":  {"totp_secret": "…", "groups": ["group:ucetni"]},
            "karel": {"totp_secret": "…", "groups": ["group:ucetni"]}
          },
          "groups": {
            "group:ucetni": {"members": ["group:fakturace", "group:mzdy"],
                             "description": "účtárna"},
            "group:mzdy":   {"members": ["user:hana"]}
          }
        }

    Čte se to takhle: `jana` a `karel` jsou účetní přímo (přes svůj záznam),
    `group:ucetni` navíc obsahuje celé podskupiny `fakturace` a `mzdy`, a
    `hana` je ve `mzdách` vypsaná jmenovitě, aniž by se sahalo do jejího
    záznamu. Kdo je v podskupině, je i v nadřazené – takže co povolím
    účetním, mají i fakturantky a hana.

    Sekce `groups` je nepovinná; bez ní jsou skupiny ploché. Krátký zápis
    `{"group:ucetni": ["group:mzdy"]}` (bez `members`) se taky přijme."""

    def __init__(self) -> None:
        from . import mfa

        self._mfa = mfa

    # -- data ---------------------------------------------------------------

    def _users(self) -> dict:
        return self._mfa.load_users()

    def _hierarchie(self) -> dict[str, list[str]]:
        """Mapa nadřazená skupina → co obsahuje (podskupiny a přímí členové).

        Přijímá dva zápisy, protože oba se v souborech přirozeně objeví:
        `{"group:ucetni": ["group:mzdy"]}` i
        `{"group:ucetni": {"members": ["group:mzdy"]}}`."""
        skupiny = self._mfa.load_store().get("groups")
        if not isinstance(skupiny, dict):
            return {}
        out: dict[str, list[str]] = {}
        for jmeno, zaznam in skupiny.items():
            obsah = zaznam.get("members", ()) if isinstance(zaznam, dict) else zaznam
            if isinstance(obsah, (list, tuple)):
                out[principal(jmeno)] = list(obsah)
        return out

    # -- IdentityProvider ---------------------------------------------------

    def exists(self, username: str) -> bool:
        return bool(username) and username in self._users()

    def authenticate(self, username: str, secret: str) -> bool:
        """Kód z autentikátoru daného uživatele (rate limit a anti-replay
        řeší mfa.verify)."""
        if not self.exists(username):
            return False
        return self._mfa.verify(secret, user=username)

    def known_groups(self) -> set[str]:
        """Všechny skupiny, o kterých soubor ví (u uživatelů i v hierarchii).

        Nepovinná metoda rozhraní: slouží jen k varování „takovou skupinu
        neznám" (viz access._zkontroluj). Zdroj, který ji nemá, se nevaruje."""
        out: set[str] = set()
        for zaznam in self._users().values():
            out.update(principal(g) for g in (zaznam.get("groups") or ()))
        hierarchie = self._hierarchie()
        out.update(hierarchie)
        for obsah in hierarchie.values():
            out.update(principal(c) for c in obsah if str(c).startswith("group:"))
        return out

    def groups_of(self, username: str) -> set[str]:
        """Skupiny uživatele včetně nadřazených (rekurzivně).

        Do výchozího bodu patří i `user:<jméno>`: člověk může být vypsaný
        přímo u skupiny (`"group:ucetni": ["user:hana"]`), aniž by se sahalo
        do jeho záznamu."""
        zaznam = self._users().get(username) or {}
        vlastni = list(zaznam.get("groups") or [USERS])
        return expand_groups([*vlastni, f"user:{username}"], self._hierarchie())


class PolicyStore(Protocol):
    """Zdroj PRÁV našich objektů (plocha, okno) – druhá zásuvná osa.

    Proč zvlášť od identit: LDAP ani OIDC nikdy nebude vědět nic o oknech
    téhle instance. Výměnou adresáře se tedy mění jen to, KDO je kdo;
    seznam „co smí group:ucetni vidět" zůstává naše doména. Výchozí
    `LocalPolicy` je sekce `access` v témže JSON souboru, ale nic nebrání
    databázi nebo konfigurační službě."""

    def load(self) -> dict[str, dict]:
        """Práva objektů: `{"screen:provoz": {"see": [...], "write": [...]}}`."""

    def save(self, access: dict[str, dict]) -> None:
        """Zapiš práva zpátky (změna z GUI nebo API)."""


class LocalPolicy:
    """Práva objektů ze sekce `access` téhož souboru (viz `LocalProvider`).

    Že sdílí soubor s identitami je jen výchozí pohodlí, ne vazba: `load`
    a `save` jsou celé rozhraní a jiná implementace může sáhnout kamkoli."""

    def load(self) -> dict[str, dict]:
        from . import mfa

        prava = mfa.load_store().get("access")
        return prava if isinstance(prava, dict) else {}

    def save(self, access: dict[str, dict]) -> None:
        from . import mfa

        mfa.update_section("access", access)


#: Aktivní zdroj identit; `vb.Project(identity=…)` ho vymění.
provider: IdentityProvider = LocalProvider()
#: Aktivní zdroj práv objektů; `vb.Project(policy=…)` ho vymění.
policy: PolicyStore = LocalPolicy()


def known_principal(jmeno: str) -> bool | None:
    """Zná zdroj identit tohohle principála? `None` = neumí odpovědět.

    `user:` se ptá providera; `group:` se hledá mezi skupinami, které zdroj
    zná. Vestavěné skupiny (`public`, `users`, `administrator`) platí vždycky
    a implicitní vlastní skupina uživatele taky."""
    from .access import ADMINISTRATOR, PUBLIC, USERS

    if jmeno in {PUBLIC, USERS, ADMINISTRATOR}:
        return True
    druh, _, hodnota = jmeno.partition(":")
    if druh == "user":
        return provider.exists(hodnota)
    znam = getattr(provider, "known_groups", None)
    if znam is None:
        return None                       # LDAP nemusí umět vypsat skupiny
    return jmeno in znam()


def configure(zdroj: IdentityProvider | None) -> IdentityProvider:
    """Nastav zdroj identit (volá `Project.__init__`)."""
    global provider
    if zdroj is not None:
        provider = zdroj
        logger.system(f"identity provider: {type(zdroj).__name__}")
    from . import access

    access.set_validator(known_principal)
    return provider


def configure_policy(zdroj: "PolicyStore | None") -> PolicyStore:
    """Nastav zdroj práv a načti je do modelu (volá `Project.__init__`)."""
    global policy
    if zdroj is not None:
        policy = zdroj
        logger.system(f"policy store: {type(zdroj).__name__}")
    from . import access

    access.configure_overrides(policy.load())
    return policy


def reset() -> None:
    """Zpátky na lokální soubor (testy, nový běh)."""
    global provider, policy
    provider = LocalProvider()
    policy = LocalPolicy()


def login(username: str, secret: str) -> set[str] | None:
    """Ověř uživatele a vrať jeho skupiny, nebo `None` při neúspěchu.

    Jediná cesta, jak se relace dostane od anonymní k ověřené – proto se
    tady i loguje (audit; nikdy ne tajemství)."""
    jmeno = str(username or "").strip()
    if not jmeno or not provider.authenticate(jmeno, secret or ""):
        return None
    skupiny = provider.groups_of(jmeno)
    return skupiny or {USERS}


def bootstrap_admin(username: str) -> None:
    """Zajisti, že první uživatel je správce (`group:administrator`).

    Obdoba root účtu: instance musí mít někoho, kdo se dostane všude, jinak
    by se první zabezpečené okno nedalo otevřít vůbec."""
    from . import mfa

    users = mfa.load_users()
    zaznam = users.get(username)
    if zaznam is not None and not zaznam.get("groups"):
        zaznam["groups"] = [ADMINISTRATOR]
        mfa.save_users(users)

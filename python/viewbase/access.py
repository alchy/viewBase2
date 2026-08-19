"""Kdo smí co: principálové, ACL a dvě slovesa.

Autorizace byla dosud vlastností okna (`private=True` = „chce kód") a nic
víc; kdo se dostal ke screenu, viděl všechno nezamčené. Tady je model, ve
kterém je přístup vlastností **objektu** (plocha, okno, log) vůči
**principálům relace**.

PRINCIPÁL je řetězec s prefixem: `user:jindrich`, `group:users`,
`group:public`. Relace jich má množinu – vlastní `user:<jméno>`, implicitní
`group:<jméno>` (uživatel má vždy skupinu pojmenovanou po sobě), skupiny ze
zdroje identit a vždy `group:public`.

ŽÁDNÉ „DENY". ACL je množina POVOLENÝCH principálů a vyhodnocení je průnik.
Záporná pravidla by si vynutila precedenci („co když je v obojím?") a model
by přestal být čitelný; `access.remove("group:public")` je odebrání
z povolených, ne zákaz.

DVĚ SLOVESA, protože „vidět" a „zasahovat" jsou různé věci – veřejné log
okno, které smí vyprázdnit jen admin:

- `access`       … kdo vidí obsah (co se vůbec odešle po drátě),
- `access_write` … kdo smí posílat události; nenastavené = totéž co `access`.

DĚDIČNOST místo výchozího `group:public`: objekt bez ACL bere ACL své
plochy, plocha bere výchozí hodnotu instance (`vb.Project(default_access=…)`,
výchozí `group:users`). Default-open by znamenal, že log okno s auditní
stopou – IP adresy, prefixy relací, příkazy ze shellu – je veřejné dřív, než
si toho kdokoli všimne.
"""
from __future__ import annotations

from typing import Callable, Iterable, Iterator

#: Ověřovač principálů; dosazuje ho `identity.configure()`. Vrací True/False,
#: nebo None, když zdroj identit odpovědět neumí (LDAP bez výpisu skupin).
_validator: Callable[[str], bool | None] | None = None


def set_validator(fn: "Callable[[str], bool | None] | None") -> None:
    """Zapoj kontrolu, jestli principál vůbec existuje (viz `_zkontroluj`)."""
    global _validator
    _validator = fn


def _check_principal(name: str, where: str) -> None:
    """Neexistující uživatel nebo skupina v ACL je skoro vždycky překlep –
    a tichý překlep znamená okno, které nikdo neuvidí, nebo naopak pravidlo,
    které nikdy nezabere. Do logu proto jde varování; zápis se NEODMÍTNE
    (identita může vzniknout později, třeba v adresáři)."""
    if _validator is None:
        return
    from .logger import logger

    if _validator(name) is False:
        logger.warning(f"access: principál '{name}' na {where} není znám zdroji "
                       "identit – překlep?", component="server")


def _record_change(where: str, change: str) -> None:
    """Každá změna práv v kódu je auditní událost: kdo co komu otevřel je
    přesně to, co se zpětně dohledává."""
    from .logger import logger

    logger.audit(f"access change: {where} {change}")

#: Skupina, kterou má každá relace včetně anonymní.
PUBLIC = "group:public"
#: Základní skupina přihlášených; výchozí `default_access` instance.
USERS = "group:users"
#: Skupina, kterou dostane uživatel založený jako první (obdoba root).
ADMINISTRATOR = "group:administrator"

_PREFIXES = ("user:", "group:")


def principal(name: str) -> str:
    """Znormalizuj principála. Bez prefixu se doplní `group:`.

    `access.add("users")` je tak totéž co `access.add("group:users")` – tohle
    je API, které se píše ručně, a mlčky selhat kvůli chybějícímu prefixu by
    znamenalo tiše otevřené okno."""
    text = str(name).strip()
    if not text:
        raise ValueError("principál nesmí být prázdný")
    if not text.startswith(_PREFIXES):
        text = f"group:{text}"
    name = text.split(":", 1)[1]
    if not name or ":" in name:
        raise ValueError(f"neplatný principál: {name!r}")
    return text


def user_principals(username: str | None, groups: Iterable[str] = ()) -> set[str]:
    """Principálové relace: `user:<jméno>`, `group:<jméno>`, skupiny, public.

    Anonymní relace (bez jména) má jen `group:public` – proto vidí jen to,
    co je výslovně veřejné.

    KAŽDÝ OVĚŘENÝ ČLOVĚK JE V `group:users`. Je to význam toho jména a bez
    toho by výchozí `default_access=["group:users"]` neznamenalo „kdokoli
    přihlášený", ale „kdo to má náhodou vypsané v záznamu" – včetně správce,
    který by po přihlášení neviděl nic."""
    out = {PUBLIC}
    if username:
        out.add(f"user:{username}")
        out.add(f"group:{username}")        # implicitní vlastní skupina
        out.add(USERS)                      # ověřený = uživatel instance
        out.update(principal(g) for g in groups)
    return out


def allowed(principals: Iterable[str], acl: Iterable[str]) -> bool:
    """Průnik principálů relace s ACL objektu. Celá autorizace je tahle
    jedna funkce – všechno ostatní je jen otázka, KTERÉ ACL se ptát.

    JEDINÁ VÝJIMKA: `group:administrator` projde vždycky. Je to obdoba roota
    a je to vědomé – instance musí mít někoho, kdo se dostane všude, jinak by
    špatně nastavené ACL zamklo správce z jeho vlastního workbenche a nešlo
    by to opravit zevnitř. Platí to i obráceně: správce se z ničeho vyloučit
    nedá, takže tu skupinu má dostat jen ten, kdo na stroj stejně vidí.
    Krok navíc (kód u privátního okna) tím dotčený NENÍ – ten se pořád chce."""
    if ADMINISTRATOR in principals:
        return True
    return bool(set(principals) & set(acl))


class Acl:
    """Množina povolených principálů s API, které se dobře píše ručně.

    `None` uvnitř znamená „nenastaveno" – takový objekt dědí (viz
    `Access.effective`). Prázdná množina je něco jiného: NIKDO, a to je
    platné nastavení (okno viditelné jen po step-up autentizaci)."""

    def __init__(self, values: Iterable[str] | None = None, *,
                 where: str = "?", verb: str = "see") -> None:
        self._set: set[str] | None = (
            {principal(h) for h in values} if values is not None else None)
        #: popis pro log a varování („window:mzdy see")
        self._kde = f"{where} {verb}"

    # -- zápis -------------------------------------------------------------

    def add(self, *names: str) -> "Acl":
        if self._set is None:
            self._set = set()
        for n in names:
            name = principal(n)
            _check_principal(name, self._kde)
            self._set.add(name)
            _record_change(self._kde, f"+{name}")
        return self

    def remove(self, *names: str) -> "Acl":
        if self._set is None:
            return self                      # nenastavené se nedá odebírat
        for n in names:
            name = principal(n)
            if name in self._set:
                self._set.discard(name)
                _record_change(self._kde, f"-{name}")
        return self

    def set(self, names: Iterable[str] | None) -> "Acl":
        """Přepiš celé ACL (`None` = zpátky na dědění)."""
        if names is None:
            self._set = None
            _record_change(self._kde, "= <dědí>")
            return self
        is_new = set()
        for n in names:
            name = principal(n)
            _check_principal(name, self._kde)
            is_new.add(name)
        self._set = is_new
        _record_change(self._kde, f"= {sorted(is_new) or '<nikdo>'}")
        return self

    def clear(self) -> "Acl":
        """Nikdo – platné nastavení, ne návrat k dědění (to je `set(None)`)."""
        self._set = set()
        _record_change(self._kde, "= <nikdo>")
        return self

    # -- čtení -------------------------------------------------------------

    @property
    def is_set(self) -> bool:
        return self._set is not None

    def list(self) -> list[str]:
        return sorted(self._set or ())

    def __contains__(self, name: object) -> bool:
        return bool(self._set) and principal(str(name)) in self._set

    def __iter__(self) -> Iterator[str]:
        return iter(sorted(self._set or ()))

    def __len__(self) -> int:
        return len(self._set or ())

    def __repr__(self) -> str:
        return f"Acl({self.list()})" if self.is_set else "Acl(<dědí>)"


class Access:
    """Přístup k jednomu objektu: `access` (vidět) + `access_write` (používat).

    Objekt si drží instanci; `effective_*` odpovídá na skutečnou otázku
    „co pro tenhle objekt platí", tedy včetně dědění od rodiče (plochy) a
    výchozí hodnoty instance."""

    def __init__(self, see: Iterable[str] | None = None,
                 write: Iterable[str] | None = None,
                 object_id: str | None = None) -> None:
        self.see = Acl(see, where=object_id or "?", verb="see")
        self.write = Acl(write, where=object_id or "?", verb="write")
        # Práva zadaná při vzniku objektu jsou taky „nastavení v kódu" –
        # ať se v auditu objeví i okno, které se rovnou narodí otevřené.
        for name, acl in (("see", self.see), ("write", self.write)):
            if acl.is_set:
                for kdo in acl:
                    _check_principal(kdo, acl._kde)
                _record_change(f"{object_id or '?'} {name}",
                            f"= {acl.list() or '<nikdo>'}")
        #: id objektu (`screen:provoz`, `screen:provoz/window:mzdy`) – podle
        #: něj se hledají práva v souboru politiky
        self.object_id = object_id

    # -- zkratky: `okno.access` se chová jako ACL pro „vidět" --------------
    #
    # `okno.access.add("group:ucetni")` je to, co se píše ručně a co je
    # v dokumentaci; druhé sloveso zůstává výslovné (`okno.access.write`).
    # Bez těchhle delegací by dokumentované API spadlo na AttributeError –
    # a přesně tak to bylo, než si toho někdo všiml.

    def add(self, *names: str) -> "Access":
        self.see.add(*names)
        return self

    def remove(self, *names: str) -> "Access":
        self.see.remove(*names)
        return self

    def set(self, names: Iterable[str] | None) -> "Access":
        self.see.set(names)
        return self

    def clear(self) -> "Access":
        self.see.clear()
        return self

    def list(self) -> list[str]:
        return self.see.list()

    @property
    def is_set(self) -> bool:
        return self.see.is_set

    def __contains__(self, name: object) -> bool:
        return name in self.see

    def __iter__(self) -> Iterator[str]:
        return iter(self.see)

    def __len__(self) -> int:
        return len(self.see)

    def rename(self, object_id: str) -> None:
        """Dej objektu jeho konečnou adresu (`screen:provoz/window:mzdy`).

        Okno vzniká dřív, než ví, na které ploše skončí – a teprve celá
        adresa je klíč, pod kterým ho zná soubor politiky. Přejmenování je
        tichá operace: práva se nemění, jen se ví, čí jsou."""
        self.object_id = object_id
        self.see._kde = f"{object_id} see"
        self.write._kde = f"{object_id} write"

    def effective_see(self, fallback: Iterable[str]) -> set[str]:
        """Kdo vidí: soubor politiky, jinak vlastní ACL, jinak zděděné."""
        from_file = override_for(self.object_id)
        if from_file and from_file["see"]:
            return set(from_file["see"])
        return set(self.see) if self.see.is_set else set(fallback)

    def effective_write(self, fallback: Iterable[str]) -> set[str]:
        """Kdo smí zasahovat: vlastní `write`, jinak TOTÉŽ CO VIDĚT.

        Ne fallback rodiče: kdyby se `write` dědil zvlášť, dalo by se
        omezit „vidět" a přitom nechat „psát" široké – tichý rozpor, který
        by nikdo nečekal."""
        from_file = override_for(self.object_id)
        if from_file and from_file["write"]:
            return set(from_file["write"])
        if self.write.is_set and not (from_file and from_file["see"]):
            return set(self.write)
        return self.effective_see(fallback)

    def can_see(self, principals: Iterable[str], fallback: Iterable[str]) -> bool:
        return allowed(principals, self.effective_see(fallback))

    def can_use(self, principals: Iterable[str], fallback: Iterable[str]) -> bool:
        return allowed(principals, self.effective_write(fallback))

    def __repr__(self) -> str:
        return f"Access(see={self.see!r}, write={self.write!r})"


#: Výchozí ACL instance; přepíše `vb.Project(default_access=[...])`.
DEFAULT_ACCESS: set[str] = {USERS}

#: Práva ze souboru politiky (sekce `access`), klíč = id objektu:
#: `{"screen:provoz": {"see": [...], "write": [...]}}`.
#: PŘEDNOST PŘED KÓDEM: správce musí umět opravit špatné ACL bez zásahu do
#: aplikace a bez nasazení nové verze. Kód tak dává výchozí hodnotu, soubor
#: rozhoduje.
OVERRIDES: dict[str, dict[str, list[str]]] = {}


def configure_overrides(mapping: dict | None) -> dict:
    """Načti sekci `access` ze souboru politiky (volá se při startu)."""
    global OVERRIDES
    if mapping is not None:
        OVERRIDES = {str(k): {"see": [principal(x) for x in (v.get("see") or [])],
                              "write": [principal(x) for x in (v.get("write") or [])]}
                     for k, v in mapping.items() if isinstance(v, dict)}
    return dict(OVERRIDES)


def override_for(object_id: str | None) -> dict[str, list[str]] | None:
    """Práva ze souboru pro daný objekt, nebo `None`."""
    return OVERRIDES.get(object_id or "") or None


def configure_default(access: Iterable[str] | None) -> set[str]:
    """Nastav výchozí ACL instance (volá `Project.__init__`)."""
    global DEFAULT_ACCESS
    if access is not None:
        DEFAULT_ACCESS = {principal(a) for a in access}
    return set(DEFAULT_ACCESS)


def reset_default() -> None:
    """Zpátky na `group:users` a bez override (testy, nový běh)."""
    global DEFAULT_ACCESS, OVERRIDES
    DEFAULT_ACCESS = {USERS}
    OVERRIDES = {}

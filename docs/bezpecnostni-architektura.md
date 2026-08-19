# Bezpečnostní architektura (internals)

*Jak je model přístupu postavený uvnitř: moduly, datové struktury, průchod
zprávy, vynucovací místa a invarianty.*

[← zpět na přehled](../README.md) · [jak se to používá →](zabezpeceni.md)

---

Tenhle dokument je pro toho, kdo knihovnu **upravuje nebo prověřuje**.
Odpovídá na „proč to je takhle a kde přesně se to rozhoduje". Kdo chce
vědět, jak model **používat** (`private=True`, skupiny, přihlášení, TLS),
patří do [Zabezpečení](zabezpeceni.md).

## Obsah

1. [Tři otázky, které se nesmí slévat](#1-tři-otázky-které-se-nesmí-slévat)
2. [Mapa modulů: kdo co vlastní](#2-mapa-modulů-kdo-co-vlastní)
3. [Uživatelé a skupiny: jak vznikají a jak se řídí](#3-uživatelé-a-skupiny-jak-vznikají-a-jak-se-řídí)
4. [Principálové a ACL](#4-principálové-a-acl)
5. [Relace](#5-relace)
6. [Životní cyklus zprávy](#6-životní-cyklus-zprávy)
7. [Vynucovací místa](#7-vynucovací-místa)
8. [Krok navíc (step-up)](#8-krok-navíc-step-up)
9. [Zásuvné osy](#9-zásuvné-osy)
10. [Audit a log](#10-audit-a-log)
11. [Přenos](#11-přenos)
12. [Invarianty a testy, které je hlídají](#12-invarianty-a-testy-které-je-hlídají)
13. [Model hrozeb: co to chrání a co ne](#13-model-hrozeb-co-to-chrání-a-co-ne)
14. [Známé mezery](#14-známé-mezery)
15. [Co nás naučily nálezy](#15-co-nás-naučily-nálezy)

---

## 1. Tři otázky, které se nesmí slévat

| otázka | odpověď dává | kde v kódu |
|---|---|---|
| **Kdo jsi?** (autentizace) | jméno + kód z autentikátoru | `identity.login()` |
| **Smíš k tomu?** (autorizace) | ACL objektu × principálové relace | `access.allowed()` |
| **Jsi to fakt ty, teď?** (krok navíc) | `private=True` → kód znovu | `sessions.store.has()` |

Třetí otázka je **ortogonální** k druhé. Členství ve skupině říká „tenhle
objekt tě smí zajímat", kód říká „a teď jsi to opravdu ty". Privátní okno
proto chce kód i po členovi správné skupiny — a i po správci.

## 2. Mapa modulů: kdo co vlastní

| modul | vlastní | výslovně NEdělá |
|---|---|---|
| `access.py` | principálové, `Acl`/`Access`, dědičnost, `allowed()` | nezná uživatele, relace ani okna — čisté funkce |
| `identity.py` | `IdentityProvider`, `PolicyStore`, rozbalení skupin | nerozhoduje o přístupu, jen odpovídá „kdo je kdo" |
| `mfa.py` | soubor politiky (**jediná autorita**), TOTP, QR, rate limit | nezná ACL ani okna |
| `sessions.py` | tabulka relací, jejich principálové, granty | neověřuje kód (to `mfa`), nerozhoduje o ACL |
| `events_mixin.py` | registr událostí + **jediné vynucovací místo** | neumí ACL sám — ptá se `windows_mixin` |
| `windows_mixin.py` | ACL plochy a oken, adresování akcí, audit odmítnutí | nezná protokol ani sokety |
| `server.py` | Origin, přihlášení po drátě, filtrace doručení, REST identita | nekontroluje ACL sám — jen adresuje |
| `log.py` / `logger.py` | sběrnice, sanace, úrovně, audit mimo práh | nikdy nezapíše tajemství |
| `tls.py` | certifikáty, `require_tls`, reverzní proxy | nic o identitách |
| `admin.py` | nástroj **správce**: uživatelé, skupiny, práva | není součástí běžící aplikace |

Závislosti jdou jedním směrem: `access` ← `identity` ← `sessions` ←
`windows_mixin` ← `events_mixin` ← `server`. `access.py` nezávisí na ničem
z knihovny, takže se celá autorizační logika dá testovat bez serveru
(`tests/test_access.py`).

## 3. Uživatelé a skupiny: jak vznikají a jak se řídí

### 3.1 Kde žijí

Všechno je v **jednom JSON dokumentu**, na který ukazuje konfigurace
(`vb.Project(users_file=…)`, jinak `~/.viewbase/users.json`, práva `0600`
v adresáři `0700`):

```json
{
  "version": 2,
  "users": {
    "workbench": {"totp_secret": "…", "is_mfa_enabled": true,
                  "label": "user:workbench",
                  "groups": ["group:administrator"],
                  "created": "2026-08-19T09:58:08"},
    "jindra":    {"totp_secret": "…", "groups": ["group:mzdy"]}
  },
  "groups": {
    "group:ucetni": {"members": ["group:fakturace", "group:mzdy"],
                     "description": "účtárna"},
    "group:mzdy":   {"members": ["user:hana"]}
  },
  "access": {
    "screen:provoz": {"see": ["group:ucetni"]},
    "screen:provoz/window:mzdy": {"see": ["group:mzdy"], "write": ["user:hana"]}
  }
}
```

Tři sekce, tři různí vlastníci — ale **soubor má jedinou autoritu**:

| sekce | čte a píše | přes |
|---|---|---|
| `users` | `mfa.py` | `load_users()` / `save_users()` |
| `groups` | `identity.LocalProvider` | `mfa.update_section("groups", …)` |
| `access` | `identity.LocalPolicy` | `mfa.update_section("access", …)` |

`mfa.load_store()` / `save_store()` / `update_section()` jsou jediná cesta
k dokumentu a drží zámek. Čtení a zápis jedné sekce je atomické vůči
ostatním: kdyby si soubor přepisoval každý vlastník po svém, poslední zápis
by ostatním sekce smazal (a přesně to se stalo, viz §15).

### 3.2 Jak vzniká uživatel

Čtyři cesty, všechny končí v `mfa.ensure_user()`:

| cesta | kdy | kód |
|---|---|---|
| uživatel instance | při vzniku `Project` | `vb.Project(user="workbench")` |
| další uživatelé instance | při vzniku `Project` | `vb.Project(users=["jindra", "demo"])` |
| ručně správcem | kdykoli | `python -m viewbase.admin adduser jindra --groups ucetni` |
| první start | automaticky | `first_run_setup()` v `serve()` |

`ensure_user()` je **idempotentní** a nikdy nepřepíše existující tajemství.
Když uživatel vzniká, dostane:

```python
{"totp_secret": pyotp.random_base32(),   # 32 znaků base32
 "is_mfa_enabled": True,
 "label": "user:jindra",                 # štítek v autentikátoru
 "groups": [ADMINISTRATOR if prvni else USERS],
 "created": "…"}
```

**První uživatel v souboru dostane `group:administrator`** (obdoba roota).
`mfa.provision()` proto řadí uživatele instance na první místo — na čisté
instalaci tak správcem není náhodně ten, kdo byl v seznamu první.

### 3.3 Tajemství a QR

Tajemství **nikdy neopustí disk**: do logu jde jen ukazatel, kde si
registraci vyzvednout. `_write_artifacts()` vyrobí do adresáře uživatele
(`~/.viewbase/user-<jméno>/`, `0700`) dva soubory s právy `0600`:

- `totp-<jméno>.txt` — ASCII QR ke `cat` (funguje přes SSH) + `otpauth://` URI
  a tajemství pro ruční zadání,
- `totp-<jméno>.svg` — tentýž QR jako obrázek (bez Pillow).

Štítek v autentikátoru je `viewBase:user:<jméno>` (`mfa.ISSUER` +
`mfa.account_label()`) — stejná syntaxe jako principál v ACL. Uloží se
do záznamu jako `label`; když se **liší od aktuálního**, `ensure_user()`
vyrobí QR znovu **ze stávajícího tajemství**. Naskenováním tak vznikne
v telefonu další položka se stejnými kódy a stará se dá smazat, aniž by se
cokoli zneplatnilo.

### 3.4 Jak vznikají skupiny

Skupina není záznam, který by se musel „zakládat" — je to **jméno, na které
se někdo odkáže**. Vznikají třemi způsoby:

**a) Implicitně, u každé ověřené relace** (`access.user_principals()`):

| principál | kdy |
|---|---|
| `group:public` | vždycky, i u anonymní relace |
| `user:<jméno>` | po přihlášení |
| `group:<jméno>` | po přihlášení — každý má vlastní skupinu pojmenovanou po sobě |
| `group:users` | po přihlášení — **každý ověřený člověk je uživatel instance** |
| `group:administrator` | jen kdo ho má v záznamu; v `allowed()` projde všude |

**b) Výčtem u uživatele** — pole `groups` v jeho záznamu:

```bash
python -m viewbase.admin adduser jindra --groups ucetni,mzdy
```

**c) Hierarchií v sekci `groups`** — členství deklaruje **nadřazená**
skupina, ne uživatel:

```bash
python -m viewbase.admin group ucetni --add mzdy --add fakturace
```

```json
"group:ucetni": {"members": ["group:mzdy", "group:fakturace"]}
```

Kdo je ve `mzdách`, je tím pádem i `ucetni`. Členství se propaguje
**nahoru**, přístup tedy platí **dolů**: co povolím účetním, mají
i fakturantky, a nikde se to neopakuje. Do `members` jde vypsat i konkrétní
člověk (`"user:hana"`), aniž by se sahalo do jeho záznamu.

### 3.5 Rozbalení hierarchie

Dělá to **provider, ne jádro** (`identity.expand_groups()`):

```python
rodice = {}                                   # potomek → rodiče (mapa se obrátí)
for nadrazena, obsah in members.items():
    for clen in obsah:
        rodice.setdefault(principal(clen), []).append(principal(nadrazena))

fronta = [principal(g) for g in seed]         # skupiny uživatele + user:<jméno>
videno = set()
while fronta:                                 # průchod NAHORU do šířky
    uzel = fronta.pop()
    if uzel in videno:
        continue
    videno.add(uzel)
    fronta.extend(rodice.get(uzel, ()))
return {g for g in videno if g.startswith("group:")}
```

`groups_of()` tedy vrací hotový **tranzitivní uzávěr**, plochou množinu.
Jádro díky tomu nikdy nechodí po grafu skupin při každé zprávě a autorizace
zůstává jediný průnik množin. `videno` hlídá cykly (`a` obsahuje `b`,
`b` obsahuje `a` je v konfiguraci běžná chyba) — rozbalení skončí, nezacyklí.

### 3.6 Jak se to řídí

Aplikace uživatele **nezakládá, nečte ani nevypisuje**. Jediné, co dělá, je
že na **svých** prvcích jmenuje principály. Kdyby je uměla zakládat, byl by
seznam uživatelů funkcí nasazené verze kódu místo konfigurace a každá
aplikace by si směla vyrobit vlastního správce.

Nástroj správce je proto samostatný (`python -m viewbase.admin`):

| příkaz | co dělá |
|---|---|
| `users` | vypíše uživatele a jejich skupiny **včetně zděděných** |
| `adduser <jméno> [--groups a,b]` | založí uživatele, TOTP a QR |
| `deluser <jméno>` | smaže uživatele |
| `groups` | vypíše hierarchii — co která skupina obsahuje |
| `group <jméno> --add/--remove <člen>` | upraví obsah skupiny |
| `access <objekt> --see/--write/--clear` | práva objektu (**přebíjejí kód**) |
| `show` | celý soubor politiky **bez tajemství** |

Píše do **téhož** souboru a **týmiž** funkcemi jako běžící server, takže si
sekce nemůžou přepsat. `--file` míří na jinou politiku (`/etc/viewbase`,
připojený svazek kontejneru).

Jmenovat principála, kterého zdroj identit nezná, **není chyba** (v adresáři
může vzniknout později) — ale vždycky se objeví v logu jako varování
(`access._check_principal` → `identity.known_principal`). A **každá** změna práv
v kódu je auditní záznam (`access._record_change`), včetně práv zadaných při
vzniku objektu:

```
access change: screen:provoz/window:mzdy see +group:ucetni
access: principál 'group:ucetnii' na screen:provoz/window:mzdy není znám zdroji identit – překlep?
```

### 3.7 Zánik

Smazání uživatele je okamžité i pro **živé relace**. Při první obnově skupin
(nejpozději za `groups_ttl`) se `sessions.principals()` zeptá
`provider.exists()`; když uživatel zmizel, relace padá na anonymní a jde
o tom auditní záznam. Adresář s jeho tajemstvím zůstane ležet — smazání je
vědomý ruční krok, ať je vidět, co se stalo.

## 4. Principálové a ACL

**Principál** je řetězec s prefixem: `user:hana`, `group:ucetni`. Bez
prefixu se doplní `group:` (`principal("users") == "group:users"`), protože
tohle API se píše ručně a mlčky selhat kvůli chybějícímu prefixu by
znamenalo tiše otevřené okno.

**Celá autorizace je jedna funkce:**

```python
def allowed(principals, acl):
    if ADMINISTRATOR in principals:      # obdoba roota; viz níž
        return True
    return bool(set(principals) & set(acl))
```

Všechno ostatní je jen otázka, **kterého ACL se ptát**.

**Žádné „deny".** ACL je množina povolených; `remove()` je odebrání
z povolených, ne zákaz. Záporná pravidla by si vynutila precedenci („co když
je v obojím?") a model by přestal být čitelný.

**Správcovská výjimka.** `group:administrator` projde vždycky — instance
musí mít někoho, kdo se dostane i k objektu se špatně nastaveným ACL, jinak
by se to nedalo opravit zevnitř. Platí to i obráceně: správce se z ničeho
vyloučit nedá, takže tu skupinu má dostat jen ten, kdo na stroj stejně vidí.
Krok navíc (kód u privátního okna) tím dotčený **není**.

### `Acl`: tři různé stavy

| stav | `is_set` | znamená |
|---|---|---|
| `Acl()` | `False` | **nenastaveno** → dědí (od plochy, pak z instance) |
| `Acl([]).clear()` | `True` | **nikdo** → platné nastavení, ne dědění |
| `Acl(["group:ucetni"])` | `True` | tihle principálové |

Rozdíl mezi „nenastaveno" a „nikdo" je podstatný: `remove()` na nenastaveném
ACL **nic nedělá**, protože z dědění by udělal prázdno, což je něco úplně
jiného.

### `Access`: dvě slovesa a dědičnost

```python
okno.access.add("group:ucetni")       # kdo vidí (zkratka pro .see)
okno.access.write.set(["user:hana"])  # kdo smí zasahovat
okno.access.list()
```

```
effective_see:    soubor politiky → vlastní ACL → fallback (plocha → instance)
effective_write:  soubor politiky → vlastní `write` → TOTÉŽ CO VIDĚT
```

`write` se **nedědí zvlášť**. Kdyby ano, dalo by se zúžit „vidět" a nechat
„psát" široké — tichý rozpor, který by nikdo nečekal.

**Soubor politiky přebíjí kód** (`access.OVERRIDES`, klíč = `object_id`):
správce musí umět opravit špatné ACL bez nasazení nové verze aplikace. Kód
tak dává výchozí hodnotu, soubor rozhoduje.

### Adresa objektu

| objekt | `object_id` |
|---|---|
| plocha | `screen:<id>` |
| okno | `screen:<id>/window:<window_id>` |
| log okno | `screen:<id>/window:__log` |

Okno vzniká samostatně (`HtmlWindow("mzdy")`) a adresu dostane, teprve když
ho plocha přijme (`windows_mixin._adopt()` → `Access.rename()`). Celá adresa
je klíč, pod kterým ho zná soubor politiky — kdyby stačilo `window:mzdy`,
dvě plochy se stejně pojmenovaným oknem by sdílely práva.

**Identita plochy je neprůhledná a stabilní** (`vb.Screen(id="provoz")`,
jinak náhodná). Procesní čítač `1, 2, 3…` plnil dřív dvě role najednou —
pořadí na liště a adresu — a jako adresa je rozbitý: dva procesy vyrobí
`screen_id=1` pro dvě různé plochy. Pořadí zůstalo jako `Screen.index`.

## 5. Relace

```python
# sid → záznam
{"born": t,            # vznik (absolutní strop)
 "seen": t,            # poslední aktivita (klouzavá platnost)
 "grants": {window_id: t},
 "user": "hana",       # None u anonymní
 "groups": {...},      # rozbalené ze zdroje identit
 "groups_at": t,       # kdy naposledy
 "principals": {...}}  # předpočítané pro allowed()
```

| lhůta | výchozí | proč |
|---|---|---|
| `ttl` | 900 s | kdo odejde od stroje, ztratí přístup i s otevřeným tabem |
| `max_age` | 8 h | relace se nedá držet naživu donekonečna klikáním |
| `groups_ttl` | 300 s | odebrání ze skupiny zabere za běhu, ne až po odhlášení |

**Session id je neprůhledné, ne podepsaný token.** Okna žijí v jednom
procesu, který je zároveň jediný ověřovatel — JWT by přinesl klíč k rotaci,
generace kvůli odvolávání a hodiny k synchronizaci, a nic by nevyřešil.
Neprůhledné id znamená, že pravdu drží tabulka: odvolání (`Lock Window`,
`Log Out`, vypršení) je smazání řádku a je okamžité. Restart serveru tabulku
zahodí — po restartu je všechno zase zamčené.

**Vypršelé sid se neoživuje.** `touch()` neznámé id zahodí a vydá nové
prázdné; kdyby se oživovalo, stačilo by si staré id zapamatovat a po vypršení
se vrátit k dřív získaným grantům. Předložení mrtvého sid jde do auditu —
po vypršení je to běžný reconnect, ale na vystavené instanci je to zároveň
to, co je vidět při zkoušení cizích id.

**Obnova skupin je mimo zámek.** `principals()` se ptá zdroje identit až po
uvolnění zámku tabulky: LDAP může být pomalý a držet kvůli němu tabulku by
zastavilo i vysílání. Když zdroj selže, drží se dosud známé skupiny (výpadek
adresáře nemá nikoho vyhodit).

## 6. Životní cyklus zprávy

```
prohlížeč                          server
   │
   │  GET /                        statické assety (index.html se necachuje)
   │─────────────────────────────▶
   │
   │  WS /ws                       ① origin_allowed()  ── cizí stránka: konec
   │─────────────────────────────▶
   │  hello {protocol, sid}        ② protokol sedí?
   │─────────────────────────────▶ ③ sessions.touch(sid) → platné sid
   │                               ④ pro každou plochu: _can_see_screen(sid)?
   │  ◀───── init (jen viditelné)     snapshot(sid) → _window_specs(sid)
   │  ◀───── session {user, visible, hidden}
   │
   │  login {user, code}           ⑤ identity.login() → mfa.check()
   │─────────────────────────────▶    sessions.login(sid, user, groups)
   │  ◀───── init (nově viditelné) ⑥ _send_screens() pošle jen to nové
   │  ◀───── session {user: "hana"}
   │
   │  event {event, screen_id,     ⑦ server doplní sid, remote_ip
   │         payload}                 a principals=None (VŽDY)
   │─────────────────────────────▶ ⑧ dispatch_event → _event_allowed()
   │                                    a) brána plochy      _screen_ok()
   │                                    b) ACL okna          _access_ok()
   │                                    c) krok navíc        _grant_ok()
   │                               ⑨ handler v thread poolu
   │
   │  ◀───── patch / action / log  ⑩ _broadcast_step: každá zpráva dostane
   │            (30×/s)               adresu {acl, only_sid, grant}
   │                                  a _deliver_to() ji pro každou relaci
   │                                  vyhodnotí zvlášť
```

Podstatné je **⑩**: „nevidíš" znamená „**neodešle se**", ne skrytí v UI.
ACL se do prohlížeče neposílá nikdy — klient se dozví jen to, co vidět smí.
Kdyby se schovávalo až v prohlížeči, stačí otevřít vývojářskou konzoli.

### Adresní značky

`_broadcast_step()` skládá ke každé zprávě adresu; `_deliver_to()` ji
vyhodnotí pro každou připojenou relaci. Musí projít **všechny** uvedené:

| značka | znamená | používá |
|---|---|---|
| `acl` | principálové, kteří objekt vidí | delty (ACL plochy), akce (ACL okna), log |
| `only_sid` | přesně jedna relace | odemčení/zamčení okna |
| `grant` | kdo má grant k oknu | obsah privátního okna |

Značky jsou vnitřní věc serveru — `_wire_action()` je před odesláním
odstraní, po drátě nejdou.

### Log má vlastní ACL

Log okno je **jediná výjimka z dědičnosti**: ACL se nebere z plochy, ale
z `default_access` instance. Logem teče auditní stopa celé instance a
`LogBus` je jeden pro celý proces — co v něm je, není vlastnost plochy, na
které okno leží. Zveřejnit stopu jde jen výslovně:

```python
vb.LogWindow(screen=s, access=["group:public"])
```

## 7. Vynucovací místa

Autorizace se rozhoduje **na čtyřech místech a nikde jinde**:

| místo | co hlídá | funkce |
|---|---|---|
| WS handshake | odkud smí přijít stránka | `server.origin_allowed()` |
| `init` snapshot | co vůbec dostane nový klient | `windows_mixin._window_specs()` |
| příchozí událost | co smí klient vyvolat | `events_mixin._event_allowed()` |
| vysílání | komu se která zpráva doručí | `server._deliver_to()` |

### Registrace události deklaruje, co je potřeba

```python
self._register("shell_input",   self._on_shell_input,   needs=Needs.USE)
self._register("window_unlock", self._on_window_unlock, needs=Needs.UNLOCK)
self._register("shell_new",     self._on_shell_new,     needs=Needs.SCREEN)
```

`needs` je **povinné** — bez něj registrace skončí chybou, takže nová
událost nejde přidat, aniž by autor tu otázku zodpověděl. Dřív se autorizace
psala v každém handleru zvlášť a **pět z devíti událostí ji nemělo**.

**Brána plochy platí u každé události a `needs` ji nevypíná** — říká jen, co
se žádá navíc o okno (`events_mixin.RULES`):

| `needs` | plocha | okno | grant | kdo to má |
|---|---|---|---|---|
| `SCREEN` | zasahovat | – | – | `shell_new`, `menu_select`, `@graph.on(...)` |
| `UNLOCK` | vidět | vidět | ne | `window_unlock` |
| `SEE` | vidět | vidět | ano | (zatím nikdo z vestavěných) |
| `USE` | zasahovat | zasahovat | ano | `window_submit`, `terminal_input`, `html_event`, `shell_input`, `shell_resize`, `window_lock` |

`UNLOCK` existuje proto, že `window_unlock` je **cesta ke grantu** — grant
po ní chtít nelze. Okno ale musí jít aspoň vidět, jinak by šlo zkoušet kód
na okno, o kterém se relace neměla dozvědět.

### Principály dosazuje vždy server

Na WS i na REST, **ať v payloadu byly, nebo ne**:

```python
{**payload, "client_id": client_id, "sid": sid, "principals": None, …}
```

Kdyby se jen doplňovaly, když chybí, poslal by si je klient sám a byl by
z toho správce. WS má vždy `None` (rozhoduje relace); REST dostane množinu
z `rest_principals()`.

### REST `/api/event`

REST nemá relaci prohlížeče, takže **bez tokenu je to anonym**
(`group:public`). Programový klient se prokazuje
`Authorization: Bearer …` nebo `X-ViewBase-Token`, porovnává se
`compare_digest`, a dostane principály z `vb.Project(rest_access=[…])`.
`shell_*`, `window_unlock` a `window_lock` jsou přes REST zakázané úplně —
jinak by stačil jeden `curl` na spuštění čehokoli na stroji.

## 8. Krok navíc (step-up)

Privátní okno (`private=True`, `controls.PrivateMixin`) se klientovi pošle
jen jako **prázdný rám** (`kind:"locked"`): žádné HTML, hodnoty polí ani
scrollback. To je rozdíl proti překryvu v DOMu — obsah po drátě vůbec
neputuje.

```
public_spec(unlocked)  →  unlocked ? spec() : lock_spec()
```

`unlocked` je `sessions.store.has(sid, window_id)` — tedy **grant dvojice
(relace, okno)**, ne globální vypínač. Dřív byl zámek globální: kdo zadal
kód, odemkl okno *na serveru* a obsah se rozeslal všem připojeným.

Kód ověřuje `mfa.check()` a vrací **důvod**, ne jen `True`/`False`:

| ochrana | hodnota | proti čemu | důvod |
|---|---|---|---|
| rate limit | 5 pokusů / 30 s **na uživatele** | hádání šesti číslic | `THROTTLED` |
| anti-replay | použitý kód **na daný účel** | odposlechnutý kód podruhé | `REPLAY` |
| tolerance hodin | ±1 okno (±30 s) | rozjeté hodiny na telefonu | – |

**Anti-replay je po účelech** (`purpose`), ne jeden společný seznam. Jeden
a tentýž kód je totiž potřeba dvakrát během třiceti sekund — jednou na
přihlášení a hned nato jako krok navíc u privátního okna — a autentikátor
mezitím žádný nový nevydá. Se společným seznamem druhé ověření vždycky
selhalo (nalezeno v provozu na shell okně). Ochrana zůstává tam, kde na ní
záleží: týž kód nejde použít dvakrát na **totéž** — přihlásit se dvakrát ani
odemknout dvakrát totéž okno. Rate limit je naopak společný pro uživatele:
je to obrana proti hádání a rozdělit ho po účelech by ji zředilo.

Použité kódy se **prořezávají** po uplynutí platnosti (`_REPLAY_MEMORY`) —
šestimístná hodnota se časem vrátí a věčný seznam by legitimní budoucí kód
zablokoval (a rostl by donekonečna).

Důvod jde do auditu i do hlášky v prohlížeči (`mfa.REASONS`). Dřív bylo
všechno „invalid code", takže se spotřebovaný kód nedal odlišit od zahlcení
pokusy a hledalo se to podle logu naslepo.

Bez `pyotp` (nebo bez registrace) se použije **jednorázový kód** ze souboru
v `~/.viewbase/` — důkaz, že člověk má přístup ke stroji, kde viewbase běží.
Kód se nevypisuje do logu, jen cesta k souboru.

Grant zaniká: `Options → Lock Window` (`revoke`), `Lock All Windows`
(`revoke_all`), `Log Out` (`logout`), vypršení relace, restart serveru.

## 9. Zásuvné osy

Dvě **samostatná** rozhraní, ne dvě metody jednoho. LDAP ani OIDC nikdy
nebude vědět nic o oknech téhle instance: výměnou adresáře se mění jen to,
kdo je kdo — „co smí `group:ucetni` vidět" zůstává doména aplikace.

```python
class IdentityProvider(Protocol):
    def exists(self, username: str) -> bool: ...
    def authenticate(self, username: str, secret: str) -> bool: ...
    def groups_of(self, username: str) -> set[str]: ...   # UŽ ROZBALENÉ

class PolicyStore(Protocol):
    def load(self) -> dict[str, dict]: ...                # {object_id: {see, write}}
    def save(self, access: dict[str, dict]) -> None: ...
```

```python
vb.Project(identity=MujLdap(), policy=MojeDatabaze())
```

Nepovinné rozšíření: `known_groups()` na provideru zapne varování „takovou
skupinu neznám". Zdroj, který ho nemá, se prostě nevaruje (`None` =
„neumím odpovědět", ne „neexistuje").

Že obě výchozí implementace sdílejí jeden soubor je **pohodlí, ne vazba**.

## 10. Audit a log

**Audit projde vždycky** — `logger.audit()` obchází práh `log_level`, takže
se bezpečnostní události nedají utišit nastavením. Komponenta je `security`;
je to komponenta, ne úroveň, protože úspěšné odemčení není `warning`
a odmítnutý kód není `error`.

Formát je sloupcový, ať jde číst po pozicích i strojově:

```
2026-08-19 09:35:12 INFO    a1b2c3d4 10.0.0.7        [security]  login: 'hana' in ['group:mzdy']
└─ timestamp ─────┘ └level┘ └ sid ─┘ └─── ip ──────┘ └component┘ └ detail
```

Ze session id jde do logu jen **prefix** — celé je přihlašovací údaj.
IP doplňuje **server** (`peer_of()`), ne klient.

Tři vrstvy ochrany toho, co do logu teče:

| vrstva | funkce | proti čemu |
|---|---|---|
| sanace | `log.sanitize()` | ESC sekvence (přebarví `docker logs`), `\n` (podvržený řádek), zaplavení (strop 2000 znaků) |
| redakce | `server.redacted()` | `code`, `data`, `sid`, `password`, `secret`, `token` se nahradí délkou |
| dávkování | `keystrokes.py` | klávesy do shellu po 32 znacích, ne po jedné; `[enter]`, `[arrow-up]`, apostrof jako `[quote]`, celé v `data='…'` pro parser |

Co se zaznamená: připojení a odpojení klienta, přihlášení i jeho neúspěch,
odhlášení, odemčení a zamčení okna, odmítnutá událost i s důvodem, předložení
mrtvé relace, vypršení relace, změny ACL v kódu, neznámý principál, příkazy
v shell okně (pod kterou identitou — uživatel instance i systémový uživatel
procesu), odmítnuté REST volání, nepovolený Origin.

## 11. Přenos

| ochrana | kde | výchozí chování |
|---|---|---|
| TLS | `tls.py` | `tls=True` vyrobí vlastnoručně podepsaný do `~/.viewbase/tls/` |
| povinné TLS | `tls.require_tls()` | mimo loopback + privátní okno bez TLS = **`ValueError` při startu** |
| `Origin` | `server.origin_allowed()` | musí sedět na `Host`, nebo být v `allowed_origins` |
| reverzní proxy | `forwarded_allow_ips` | komu se věří `X-Forwarded-For` — **adresa proxy**, ne klientů |

**WebSocket neprochází CORS.** Cizí stránka otevřená v prohlížeči diváka se
může připojit a prohlížeč jí v tom nezabrání. Grant tím nezíská (session id
je v `localStorage`, na který nedosáhne), ale bez kontroly originu by viděla
obsah nezabezpečených oken a mohla posílat události. Chybějící hlavička se
propouští — to není prohlížeč (curl, vlastní klient), takže se to cizí
stránkou zneužít nedá.

## 12. Invarianty a testy, které je hlídají

| # | invariant | test |
|---|---|---|
| 1 | Brána plochy platí u **každé** události; žádná hodnota `needs` ji nevypne | `test_event_authorization.py::test_zadna_hodnota_needs_nevypina_branu_plochy` |
| 2 | Každá vnitřní událost má deklarované `needs` | `test_event_authorization.py` (projde registr strojově) |
| 3 | Principály dosazuje server; klient si je nepodstrčí | `test_access_enforcement.py::test_klient_si_principaly_nepodstrci` |
| 4 | REST bez tokenu je anonym | `…::test_rest_bez_tokenu_je_anonym` |
| 5 | „Nevidíš" = neodešle se (obsah není v žádné zprávě) | `…::test_okno_mimo_ACL_se_v_snapshotu_vubec_neobjevi` |
| 6 | Log se nedědí z plochy | `…::test_log_se_nededi_z_plochy_na_ktere_okno_lezi` |
| 7 | Odemčení platí u každé zprávy, ne jen při otevření | `test_private_windows.py`, `test_sessions_delivery.py` |
| 8 | Odemykat lze jen okno, které je vidět | `…::test_odemykani_okna_mimo_ACL_neprojde` |
| 9 | Smazaný uživatel přijde o přístup hned | `test_identity.py::test_smazany_uzivatel_prijde_o_pristup_hned` |
| 10 | Zápis jedné sekce souboru nesmaže ostatní | `test_identity.py::test_zapis_uzivatelu_nesmi_smazat_skupiny_ani_prava` |
| 11 | Souběžné zápisy si sekce nepřepíšou | `test_identity.py::test_soubezne_zapisy_si_sekce_neprepisou` |
| 12 | Restart aplikace nikomu nezmění tajemství ani skupiny | `test_provisioning.py::test_druhy_start_nikomu_nezmeni_tajemstvi_ani_skupiny` |
| 13 | Tajemství nikdy neteče do konzole ani do logu | `test_mfa.py`, `test_provisioning.py`, `test_admin_cli.py` |
| 14 | Origin musí sedět | `test_origin.py` |
| 15 | Mimo loopback + privátní okno ⇒ TLS povinné | `test_tls.py` |
| 16 | Relace vyprší klouzavě i absolutně | `test_session_expiry.py` |
| 17 | Každá změna ACL v kódu je v auditu | `test_access.py::test_kazda_zmena_prav_v_kodu_jde_do_auditu` |
| 18 | Týž kód projde na přihlášení i na krok navíc, ale ne dvakrát na totéž | `test_mfa.py::test_tyz_kod_projde_na_prihlaseni_i_na_odemceni_okna` |
| 19 | Dokumentovaný zápis `okno.access.add(…)` opravdu funguje | `test_access.py::test_okno_access_se_chova_jako_ACL_pro_videt` |

Konec řetězu ověřuje `test_e2e_browser.py` ve skutečném prohlížeči: anonym
vidí výzvu a **žádný obsah**, špatný kód nic neotevře, správný kód pustí
plochu i okno, privátní okno zůstává prázdný rám, odhlášení plochu zase
zavře.

## 13. Model hrozeb: co to chrání a co ne

**Chrání proti:**

- divákovi, který se připojí a chce obsah, na který nemá (ACL + granty),
- odposlechu na síti (TLS, povinné mimo loopback u privátních oken),
- cizí stránce v prohlížeči diváka (`Origin`),
- hádání kódu (rate limit) a jeho opakovanému použití (anti-replay),
- „vzkříšení" staré relace (neoživované sid, absolutní strop),
- zametání stop (audit nejde utišit prahem),
- otravě logu (sanace ESC/`\n`/délky) a úniku tajemství do něj (redakce).

**Nechrání proti** (vědomě, mimo rozsah):

- **útočníkovi s přístupem na stroj.** Tajemství leží v `~/.viewbase`
  s právy `0600`; kdo je root nebo ten uživatel, má všechno. Model stojí na
  tom, že stroj je váš.
- **shell oknu jako takovému.** Otevřený a odemčený shell je skutečný proces
  pod uživatelem, který instanci spustil. Zámek chrání přístup k němu, ne
  systém před tím, kdo se dostal dovnitř.
- **správcovské skupině.** `group:administrator` projde všude; nedá se
  z ničeho vyloučit. Je to vlastnost, ne chyba (§4).
- **odepření služby.** Není limit na počet spojení, per-IP strop ani
  backpressure — viz §14.
- **postranním kanálům** (časování, délka zpráv).
- **útočníkovi uvnitř aplikačního kódu.** `@graph.on(...)` handlery jsou
  autorův kód a knihovna do nich nevidí.

## 14. Známé mezery

| mezera | dopad | poznámka |
|---|---|---|
| sekvenční vysílání | jeden pomalý klient zdrží doručení ostatním | `_broadcast_step()` posílá klientům `await`em za sebou |
| bez stropu spojení | vystavená instance nemá per-IP limit ani celkový strop | |
| ztracený autentikátor | není `admin reissue` — jediná cesta je smazat a založit znovu | tajemství se vědomě nikdy nepřepisuje |
| bez výpisu živých relací | správce nevidí, kdo je připojený, a nemůže někoho odhlásit | v auditu to je, ale ne jako přehled |

## 15. Co nás naučily nálezy

Skutečné chyby, které tenhle model formovaly. Každá má dnes test.

| nález | příčina | co z toho plyne |
|---|---|---|
| `shell_input` grant vůbec nekontroloval | kontrola se psala v každém handleru zvlášť — pět z devíti ji nemělo | autorizace patří do **registrace**, ne do handleru |
| `Needs.NONE` obcházelo bránu plochy | „nic navíc" se četlo jako „nic vůbec" | žádná hodnota nesmí umět vypnout kontrolu úplně |
| `curl` bez identity spustil autorský handler | REST neměl identitu žádnou | vstup bez relace je **anonym**, ne výjimka |
| log okno na veřejné ploše rozeslalo audit všem | ACL se dědilo z plochy, ale `LogBus` je proces-wide | co je globální, nesmí dědit práva od lokálního |
| smazaný uživatel si držel přístup | neznámé jméno dostalo výchozí `group:users` | „neznám" ≠ „výchozí" |
| první zápis uživatelů smazal skupiny i práva | tři vlastníci sekcí, tři zápisy celého souboru | jeden dokument = **jedna autorita** |
| odemčení jednoho diváka odhalilo obsah všem | zámek byl globální vypínač na okně | přístup patří dvojici **(relace, objekt)** |
| kód z autentikátoru se objevil v ladicím logu | payload se logoval celý | redakce podle klíčů, na jednom místě |
| `okno.access.add(...)` v dokumentaci neexistovalo v kódu | API se popsalo dřív, než vzniklo | dokumentovaný zápis patří do testu |
| shell okno nešlo odemknout platným kódem | přihlášení kód spotřebovalo a anti-replay byl společný pro celého uživatele | nová cesta k ověření musí projít **všechny** toky, kde se kód používá |
| tři různé příčiny se hlásily stejnou hláškou | ověření vracelo jen ano/ne | diagnostika je součást bezpečnosti, ne luxus |

---

**Související:** [Zabezpečení — jak se to používá](zabezpeceni.md) ·
[Veřejné API](api.md) · [Architektura](architektura.md) ·
návrh v [`docs/superpowers/specs/2026-08-19-autentizace-autorizace-design.md`](superpowers/specs/2026-08-19-autentizace-autorizace-design.md)

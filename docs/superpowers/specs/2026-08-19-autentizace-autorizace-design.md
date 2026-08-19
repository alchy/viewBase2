# Autentizace a autorizace: uživatelé, skupiny, ACL — Design

> Vytažení celého modelu „kdo smí co" z těla programu do vlastního
> podsystému. Autorizace přestává být vlastností okna (`private=True`) a
> stává se vlastností **objektu** (plocha, okno, log) vůči **principálům**
> relace. Navazuje na `2026-08-18-multiuser-privatni-okna-design.md`
> (relace a granty) a na dnešní stav, kde autorizace už má jediné vynucovací
> místo (`_register(..., needs=…)`).

## 1. Tři otázky, které se nesmí slévat

| otázka | odpověď dává | kde |
|---|---|---|
| **Kdo jsi?** (autentizace) | přihlášení: jméno + kód z autentikátoru | splash při načtení |
| **Smíš k tomu?** (autorizace) | ACL objektu × principálové relace | u každé zprávy |
| **Jsi to fakt ty, teď?** (step-up) | `private=True` → kód znovu | výzva u okna |

Třetí otázka je **ortogonální** k druhé: členství ve skupině říká „tenhle
objekt tě smí zajímat", kód říká „a teď jsi to opravdu ty". Privátní okno
tedy vyžaduje kód, i když k němu má relace přístup podle ACL.

## 2. Principálové a ACL

**Principál** je řetězec s prefixem: `user:jindrich`, `group:users`,
`group:public`. Relace jich má množinu — vlastní `user:<jméno>`, implicitní
`group:<jméno>` (každý uživatel má skupinu pojmenovanou po sobě), skupiny ze
zdroje identit a vždy `group:public`.

**ACL objektu** je množina povolených principálů. Vyhodnocení je jediná
čistá funkce:

```python
def allowed(principals: set[str], acl: set[str]) -> bool:
    return bool(principals & acl)
```

**Žádné „deny".** Záporná pravidla vyžadují precedenci a model tím přestane
být čitelný; `access.remove("group:public")` je odebrání z množiny povolených,
ne zákaz.

**Dvě slovesa**, protože „číst" a „zasahovat" jsou různé věci (veřejný log,
který smí vyprázdnit jen admin):

- `access` — kdo **vidí** obsah (co se vůbec odešle po drátě),
- `access_write` — kdo smí **posílat události**; když se nenastaví, platí
  totéž co `access`.

API na objektu (každý objekt má id):

```python
okno.access.add("group:users")
okno.access.remove("group:public")
okno.access.list()                    # {"group:users"}
okno.access_write.add("user:jindrich")
```

## 3. Dědičnost a výchozí hodnoty

Nový objekt **nemá** natvrdo `group:public` (to byl původní návrh; zamítnuto
vědomě). Dědí:

```
objekt bez ACL      → ACL své plochy
plocha bez ACL      → vb.Project(default_access=["group:users"])
```

Důvod je konkrétní: v log okně teče auditní stopa — IP adresy, prefixy relací,
příkazy zadané do shellu. S výchozím `public` by byla světu přístupná dřív,
než si toho kdokoli všimne. Kdo chce dnešní jednouživatelské pohodlí, nastaví
`default_access=["group:public"]` jedním parametrem, vědomě a na jednom místě.

## 4. Identita: anonymní vs. přihlášená relace

Relace je **buď anonymní** (principálové = `{group:public}`), **nebo
ověřená** (jméno + kód, principálové ze zdroje identit). Nic mezi tím: jméno
bez důkazu je jen řetězec, a jakmile na něm stojí přístup ke skupinám, je to
rozhodovací vstup od útočníka.

Splash se ptá na **jméno i kód**. Cachované jméno (`vb_user` v prohlížeči)
šetří psaní jména, ne důkaz. Anonymní relace je povolená (`allow_anonymous`,
výchozí zapnuto) a vidí jen `group:public`.

**Zdroj identit je zásuvný:**

```python
class IdentityProvider:
    def authenticate(self, username: str, secret: str) -> bool: ...
    def groups_of(self, username: str) -> set[str]: ...
    def exists(self, username: str) -> bool: ...
```

První verze: `LocalProvider` nad `~/.viewbase/users.json` (v2, s migrací
z dnešního formátu). LDAP/OIDC se přidá jako další implementace bez zásahu
do jádra. **Ověření a skupiny jsou oddělené** — někdo se může autentizovat
lokálním TOTP a skupiny mít z adresáře.

```json
{"version": 2,
 "users": {
   "workbench": {"auth": "totp", "totp_secret": "<base32, NIKDY do gitu>",
                 "groups": ["group:administrator"], "created": "…"},
   "hana":      {"auth": "totp", "totp_secret": "…", "groups": ["group:users"]}}}
```

Skupiny se resolvují při přihlášení a **cachují s TTL** (výchozí 300 s):
bez toho by se odebrání ze skupiny projevilo až po odhlášení, a to je právě
ta operace, kterou po incidentu potřebujete hned.

### 4.1 Rekurzivní skupiny: deklaruje je nadřazená skupina

Členství se píše **strukturovaně** (ne unixovým `passwd` stylem, kde se
členství věší na uživatele a hierarchie se nedá vyjádřit vůbec) a deklaruje
ho ta **nadřazená** skupina:

```json
{"groups": {
   "group:ucetni": {"members": ["group:fakturace", "group:mzdy"],
                    "description": "účtárna"},
   "group:mzdy":   {"members": ["user:hana"]}}}
```

Kdo je ve `fakturaci`, je tím pádem i `ucetni`: členství se propaguje
**nahoru**, takže přístup platí **dolů** — co povolím účetním, mají i
fakturantky, a nikde se to neopakuje. Člověka lze vypsat u skupiny přímo
(`hana`), aniž by se sahalo do jeho záznamu.

**Rozbaluje to provider, ne jádro.** `groups_of()` vrací hotový tranzitivní
uzávěr, takže autorizace zůstává jediný průnik množin a jádro nechodí po
grafu skupin při každé zprávě. Cykly (`a` obsahuje `b`, `b` obsahuje `a`)
jsou v konfiguraci běžná chyba — rozbalování je hlídá navštívenou množinou.

### 4.2 Dvě nezávislé osy: kdo jsi × co smí naše objekty

`IdentityProvider` a `PolicyStore` jsou **dvě samostatná rozhraní**, ne dvě
metody jednoho. Důvod je věcný: LDAP ani OIDC nikdy nebude vědět nic
o oknech téhle instance. Výměnou adresáře se tedy mění jen to, KDO je kdo;
„co smí `group:ucetni` vidět" zůstává naše doména a přežije to.

| osa | rozhraní | výchozí | vyměnitelné za |
|---|---|---|---|
| identity | `exists` / `authenticate` / `groups_of` | `LocalProvider` (sekce `users`, `groups`) | LDAP, OIDC |
| práva objektů | `load` / `save` | `LocalPolicy` (sekce `access`) | databáze, konfigurační služba |

Že obě výchozí implementace sdílejí jeden soubor je **pohodlí, ne vazba** —
`vb.Project(identity=…, policy=…)` je nastaví každou zvlášť.

**Soubor politiky má jedinou autoritu.** Sekce mají různé vlastníky, ale
dokument čte a zapisuje jediné místo (`mfa.load_store` / `save_store` /
`update_section`), celý a pod zámkem. Naivní „ulož si svoje" by při prvním
zápisu uživatelů smazalo hierarchii skupin i práva objektů; bez zámku by se
dva souběžné zápisy přepsaly taky, jen vzácněji a hůř dohledatelně.

### 4.3 Pro aplikační kód je zdroj identit černá skříňka

Aplikace uživatele **nezakládá, nečte ani nevypisuje**. Jediné, co dělá, je
že na **svých** prvcích jmenuje principály:

```python
okno.access.add("group:ucetni")
```

Identity žijí mimo program — v souboru politiky, na který ukazuje
konfigurace, nebo v adresáři — a spravuje je správce. Kdyby je uměla
zakládat aplikace, byl by seznam uživatelů funkcí nasazené verze kódu místo
konfigurace a každá aplikace by si směla vyrobit vlastního správce.

**Všechno kolem práv jde do logu.** Každé nastavení i odebrání v kódu je
auditní záznam (`access change: window:mzdy see +group:ucetni`), včetně práv
zadaných při vzniku objektu. Jmenovat principála, který zatím neexistuje,
není chyba — v adresáři může vzniknout později — ale **vždy** se objeví jako
varování; tichý překlep by jinak znamenal okno, které nikdo neuvidí. Zdroj,
který na existenci skupiny odpovědět neumí, se nevaruje.

## 5. Objekty, kterých se to týká

| objekt | id | ACL |
|---|---|---|
| **Screen** (plocha) | stabilní neprůhledné (viz §6) | vlastní; brána pro všechno na ní |
| grafové okno | `window_id` v rámci plochy | dědí z plochy |
| HTML / formulářové / konzolové okno | `window_id` | dědí |
| shell okno | `window_id` | dědí; navíc `private=True` vždy |
| log okno | `__log` | dědí; **nikdy ne public defaultem** (audit) |

**Dvě úrovně, obě musí projít:** ACL plochy je brána, ACL okna zúžení. Kdo
nemá přístup k ploše, nedostane ji v `init` snapshotu, nevidí žádné její
okno a volání API na její `window_id` neuspěje — okno se adresuje dvojicí
`(screen_id, window_id)`, takže „mimo plochu" není kam mířit.

**„Nevidíš" znamená „neodešle se"**, ne skrytí v UI. ACL se do prohlížeče
neposílá nikdy: klient se dozví jen to, co vidět smí.

## 6. Identita plochy: dnešní čítač nestačí

Dnes se `screen_id` přiděluje **procesním čítačem 1, 2, 3…**
(`screen.py:_allocate_id`). Pro plán, kde REST obsluhuje desítky klientů a
kontejner přebírá část ploch, je to rozbité: dva kontejnery vyrobí `screen_id=1`
pro dvě různé plochy a klient, který ji adresuje, netrefí.

Plocha proto dostane **stabilní neprůhledné id** (uuid4, nebo jméno zadané
volajícím: `vb.Screen(title="Provoz", id="provoz")`). Číselné id zůstane jako
zobrazované pořadí na liště, ne jako adresa.

## 7. Vynucení: jedno místo, rozšířené o slovesa

Dnešní `_register(event, handler, needs=Needs.GRANT|NONE)` se rozšíří:

```python
self._register("html_event",  self._on_html_event,  needs=Needs.USE)
self._register("window_lock", self._on_window_lock, needs=Needs.USE)
self._register("window_unlock", self._on_window_unlock, needs=Needs.SEE)
self._register("menu_select", self._on_menu_select, needs=Needs.NONE)
```

`dispatch_event` pak ověří v tomhle pořadí:

1. **ACL plochy** (jinak se událost zahodí, jako by plocha neexistovala),
2. **ACL okna** pro dané sloveso (`SEE` → `access`, `USE` → `access_write`),
3. **step-up** u `private=True` — grant relace k oknu (dnešní `sessions`).

Registrace bez `needs` dál skončí chybou; autorizační mapa zůstává čitelná
na jednom místě a hlídá ji test, který registr projde strojově.

## 8. Co se zachová

`private=True` = `private=True` se stejným chováním (výzva, grant relace,
`Options → Unlock/Lock Window`, per-relace doručování). Dnešní aplikace bez
jediné zmínky o skupinách musí fungovat dál: default `group:users`, jediný
uživatel `workbench` v `group:administrator`, který je členem všeho, co si
založí.

## 9. Etapy

1. ✅ **`access.py`** — principálové, ACL, dvě slovesa, dědičnost, výchozí
   hodnoty; čisté funkce a testy bez serveru.
2. ✅ **Identita** — soubor politiky v2 (jediná autorita nad dokumentem),
   `IdentityProvider` + `LocalProvider` s rekurzivními skupinami, `PolicyStore`
   + `LocalPolicy` jako druhá osa, principálové v relaci, TTL na skupiny.
3. ✅ **Vynucení** — `Needs.SEE/USE`, kontrola v `dispatch_event`, filtrování
   `init` snapshotu, akcí, delt i logu podle ACL plochy a okna.
4. ✅ **Identita plochy** — stabilní neprůhledné id (`vb.Screen(id="provoz")`),
   `index` zvlášť jako pořadí na liště, adresování `screen:<id>/window:<id>`.
5. ✅ **Frontend a nástroj správce** — přihlašovací výzva (jméno + kód, jen
   když server hlásí skryté plochy), menu `User: <jméno>` s `Lock All Windows`
   a `Log Out`, `python -m viewbase.admin` pro uživatele, skupiny a práva.

**Vytáhlo se během implementace:** přihlášení (etapa 5) muselo přijít
s vynucením (etapa 3) — bez něj by ACL byla buď zeď (nikdo nic nevidí), nebo
dekorace. A nástroj správce vznikl proto, že aplikace identity vědomě
nezakládá: někdo je založit musí.

**Zpětná kompatibilita se nedrží.** Knihovna zatím nemá nasazení, které by
se muselo šetřit, takže starý formát souboru ani stará jména parametrů
nepřežívají — čitelnost modelu je víc než plynulý upgrade. Jediná výjimka
byla jednorázová migrace existujícího `users.json` na v2, aby zapsaný
autentikátor zůstal platný.

**Mimo rozsah:** role nad rámec skupin, „deny" pravidla, per-uzel ACL
v grafu, REST tokeny pro programové klienty (dnes REST identitu nemá a
citlivé události odmítá).

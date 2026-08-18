# Multiuser workbench a privátní okna — Design

> Rozšíření zámku oken (`secured=True`) na **víc uživatelů**: každý divák se
> na začátku představí, zabezpečená okna jsou **privátní** (obsah vidí jen ten,
> kdo je odemkl), autentizace je **modul podle uživatele** (TOTP, externí
> služba) a všechno se loguje se jménem. Konfiguraci drží nový objekt
> `vb.Config`, který si vývojář vytvoří při instanciování projektu.
>
> Navazuje na `2026-08-18-shell-okno-design.md` (§Zabezpečená okna a TOTP).

## 1. Tři vrstvy, které se nesmí plést

| vrstva | co to je | kde | jak silné |
|---|---|---|---|
| **identita** | *kdo tvrdí, že je* | splash při načtení, cookie `vb_user` | žádný důkaz — jen jméno |
| **autentizace** | *dokázal to* | odemykání privátního okna (modul uživatele) | podle modulu |
| **autorizace** | *smí to* | `secured=True, allow=["jindrich"]` | seznam uživatelů/rolí |

Jméno ze splash **není token**: kdokoli napíše cokoli. Slouží k výběru
autentizačního modulu a hlavně **do logu**. Důkaz se vyžaduje až u okna
(rozhodnutí uživatele: autentizační model je per okno).

Shell zůstává procesem **OS uživatele, pod kterým běží server** — identita ve
workbenchi mu žádná práva nepřidává ani nebere. Log to říká nahlas:
`user=jindrich otevřel shell (proces běží jako OS uživatel j)`.

## 2. Kdo co vidí

| okno | kdo odemkl | ostatní | titulek |
|---|---|---|---|
| `secured=True`, odemčené mnou | plný obsah | (viz vpravo) | skutečný |
| `secured=True`, mnou neodemčené | prázdné tělo, klik = výzva | totéž | **`[private window]`** |
| bez zabezpečení | plný obsah | plný obsah | skutečný, **bez přívlastku** |

Privátní okna tedy **nemizí** – rám, poloha i velikost jsou vidět všem, obsah
a jméno ne. Titulek se skrývá taky (je to informace jako každá jiná); kdo chce
nápovědu, řekne si o ni: `secured=True, lock_title="Mzdy"` → `[private window] Mzdy`.

## 3. Odemčení je stav dvojice (klient, okno)

**Oprava dnešního stavu:** `window.state = "open"` je globální a akce se
rozesílají všem (`_broadcast_step`), takže by odemčení jedním divákem odhalilo
obsah všem. Nově:

- server drží `unlocked[client_id][window_id] = expires_at` (TTL z configu,
  výchozí 900 s, per okno),
- akce k zabezpečenému oknu nesou `only_client` a broadcast ostatní přeskočí,
- `init` snapshot se skládá **per klient** (co odemkl, to vidí),
- `logout` / `window_lock` odemčení zahodí a klientovi pošlou placeholder.

## 4. Tok

```
načtení → WS → klient pošle `identify {user}` (z cookie, jinak splash overlay)
    ├─ neznámý: loopback → enroll (založí uživatele, QR do qr_dir + konzole)
    │            jinak    → reject („Unknown user")
    └─ OK → server pošle `init` složený pro tohoto klienta
Options → „Unlock Window" (nad aktivním [private window]) → zelená výzva → ověření
    → server pošle skutečné `open_window` s obsahem JEN tomuto klientovi
Options nad odemčeným oknem → „Lock Window"      (zpět na placeholder, bez výzvy)
User → „Lock all windows" / „Logout"
```

Esc zavře výzvu; okno **zůstane** jako `[private window]`. Tím se ruší dřívější
chování „Esc okno zavře" – v multiuser modelu musí být privátní okna vidět
pořád. Výzva se **nikdy neotevře sama**: ani při otevření okna, ani klikem do
něj (klik okno jen aktivuje) – jedinou cestou je `Options → Unlock Window`.

## 5. `vb.Config`

```python
cfg = vb.Config(
    host="0.0.0.0", port=8443, tls=vb.Tls(cert="cert.pem", key="key.pem"),
    users_file="./secrets/users.json",        # default ~/.viewbase/users.json (0600)
    qr_dir="./secrets/qr",                    # default ~/.viewbase/user-<jméno>/
    auth_modules={
        "totp": vb.auth.Totp(issuer="ACME Monitoring"),
        "sso":  vb.auth.External(verify=over_v_sso, label="Firemní SSO",
                                 fields=("user", "code")),
        "none": vb.auth.None_(),              # jen prohlížení, nic neodemkne
    },
    default_auth="totp",
    on_unknown_user="auto",                   # loopback → enroll, jinak reject
    session_ttl=900,
    shell_cli=True, shell_allow_remote=False,
    secrets_to_stdout="auto",                 # tisknout jen na terminál
)
project = vb.Project(cfg)     # načte config, zajistí soubory (0600/0700), vygeneruje QR
```

Pořadí zdrojů: defaulty → `Config.from_file()` → env `VIEWBASE_*` → parametry.
`vb.Project(port=8080)` funguje dál (config si vyrobí sám).

Rozhraní autentizačního modulu (malé, aby šel dopsat vlastní):

```python
class AuthModule:
    fields: tuple[str, ...] = ("code",)              # co zobrazí výzva
    def verify(self, user: str, values: dict[str, str]) -> bool: ...
    def enroll(self, user: str) -> str | None: ...   # otpauth:// URI, nebo None
```

Vynucená pravidla: `host` mimo loopback bez `auth` → chyba; privátní okna
mimo loopback bez TLS → chyba (kódy nemají jezdit plaintextem); shell mimo
loopback jen s `shell_allow_remote=True`.

## 6. `users.json` (v2)

```json
{"version": 2,
 "users": {
   "jindrich": {"auth": "totp", "totp_secret": "<base32, NIKDY do gitu>",
                "roles": ["admin"],
                "created": "2026-08-18T11:15:03", "last_login": "…"},
   "hana":     {"auth": "sso",  "roles": ["operator"]},
   "kiosk":    {"auth": "none", "roles": ["viewer"]}}}
```

Tajemství jen tam, kde ho modul potřebuje. Migrace z v1 (plochý `workbench`)
automaticky při zápisu. CLI: `python -m viewbase.mfa add|show|reset <user>`
(QR se ukazuje jen z konzole serveru – kdo vidí QR, zaregistruje si zařízení).

## 7. Menu na liště

- **`Options`** – dodává aktivní okno (dnešní model). Nově:
  `[private window]` nabídne **`Unlock Window`**, odemčené zabezpečené okno
  **`Lock Window`** (obojí příkaz bez zaškrtávátka – mechanismus z `System`).
- **`System`** – `Shell CLI` (beze změny).
- **`User`** – jméno přihlášeného, `Lock all windows`, `Logout`.

## 8. Logování

Události od klienta nesou `client_id` (dnes) **+ `user`**. Log řádky i log okno
dostanou `user=…`; přihlášení, odemčení okna, odmítnutý kód, otevření shellu a
odhlášení jsou samostatné log události (audit stopa).

## 9. Rozsah

**Hotovo (nezávisle na multiuseru, funguje i v dnešním jednouživatelském
režimu):** `vb.Project(user=…)` = uživatel instance, jeho registrace při
prvním startu a artefakty v `~/.viewbase/user-<jméno>/totp-<jméno>.svg`; `Options → Unlock Window` u zamčeného okna a `Options → Lock
Window` u odemčeného zabezpečeného (událost `window_lock`, hook `on_locked()`,
u shellu proces běží dál), Esc výzvu jen odloží místo zavření okna.

**Teď:** `vb.Config` + `vb.auth` moduly (`Totp`, `External`, `None_`),
`users.json` v2 + migrace + CLI, splash s identitou a `identify` před `init`,
per-klient odemčení a cílené posílání, `[private window]` placeholder,
menu `User`, logování jména, dokumentace a ukázka `examples/multiuser.py`.

**Až potom:** role v `allow=` (formát to unese), OIDC redirect login, WebAuthn,
`require_login` (splash rovnou vyžaduje kód), Windows/ConPTY pro shell.

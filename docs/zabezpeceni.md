# Zabezpečená okna, relace a TLS

*Zámek okna, kód z autentikátoru, relace prohlížeče a šifrované spojení.*

[← zpět na přehled](../README.md) ·
[jak je to postavené uvnitř →](bezpecnostni-architektura.md)

---

Zabezpečení stojí na vrstvách, které spolu souvisí, ale dají se číst zvlášť:

| vrstva | otázka, na kterou odpovídá |
|---|---|
| [**přístup (ACL)**](#přístup-uživatelé-skupiny-a-acl) | kdo tenhle objekt vůbec smí vidět |
| **zámek okna** | co se vůbec pošle po drátě (níž na téhle stránce) |
| **relace a granty** | komu a jak dlouho |
| [**autorizace**](#autorizace-co-smí-která-událost) | která zpráva co smí |
| [**Origin**](#odkud-smí-přijít-stránka-origin) | odkud smí přijít stránka, která se připojí |
| [**TLS**](#tls-a-reverzní-proxy) | aby to po cestě nešlo odposlechnout |
| [**log a audit**](#log-co-se-zaznamená-a-co-uvidíte) | co se z toho dá zpětně dohledat |

- **Zabezpečená okna** — `private=True` na kterémkoli okně (jako `closable=`):
  okno se do prohlížeče pošle jen jako **prázdný rám**, obsah (HTML, hodnoty
  polí, scrollback, shell) po drátě neputuje, dokud divák nezadá kód v zelené
  výzvě ve stylu Guru Meditation. Kód je **TOTP z autentikátoru**, s rate
  limitem a ochranou proti opakovanému použití; bez registrace se použije
  jednorázový kód ze souboru. Shell okno
  je zabezpečené vždy. Zamčené okno **nic nevyskakuje**: ukáže se jako rám s
  poznámkou „Private window. Unlock this window via the Options menu." a chová
  se jako každé jiné okno (klik ho jen aktivuje). O kód si divák řekne sám —
  aktivní zamčené okno dá do lišty **`Options → Unlock Window`** (Esc výzvu
  zavře, okno zůstane zamčené). Odemčené zabezpečené okno má naopak
  **`Options → Lock Window`**: obsah se zase schová a příště si okno řekne o kód
  znovu; u shellu proces mezitím běží dál (zámek je jako zamčená obrazovka, ne
  zabité sezení). Ukázka: `examples/private_windows.py`.
- **Relace a granty** — odemčení nepatří oknu, ale **relaci prohlížeče**.
  Po ověření kódu server zapíše grant dvojice *(relace, okno)*; obsah a vstup
  se pak u **každé zprávy** kontrolují proti němu, `init` snapshot se staví
  pro každého klienta zvlášť. Kdo kód nezadal, vidí `[private window]` —
  i když okno odemkl někdo jiný a i když se připojí až potom.

  Prohlížeč drží jedno neprůhledné id v `localStorage` (`vb_sid`), takže F5
  ani restart prohlížeče o přístup nepřipraví. Platnost je **klouzavá**
  (výchozí 15 min bez aktivity) s **absolutním stropem** (8 h, pak zase
  autentikátor): `vb.Project(session_ttl=900, session_max_age=8*3600)`.
  Neznámé nebo vypršelé id se **neoživí** — dostane nové a prázdné, aby si ho
  nešlo schovat a po vypršení se vrátit ke starým grantům. Restart serveru
  tabulku zahodí, takže po něm je všechno zase zamčené.

  `Options → Lock Window` zruší grant **jen mojí relace** — kolega, který má
  okno odemčené vedle, o obsah nepřijde.

- **Registrace autentikátoru** — uživatele instance zvolí vývojář:
  `vb.Project(port=8080, user="jindrich")` (bez toho `workbench`). Při **prvním
  spuštění instance** se mu vygeneruje tajemství a QR — vypíše se do konzole
  serveru (ASCII, funguje i přes SSH) a uloží jako SVG do jeho adresáře:

  ```
  ~/.viewbase/users.json                        (0600) tajemství všech
  ~/.viewbase/user-jindrich/totp-jindrich.svg   (0600) QR jako obrázek
  ~/.viewbase/user-jindrich/totp-jindrich.txt   (0600) tentýž QR v ASCII
  ```

  (adresář uživatele 0700). `.txt` je ASCII QR k naskenování rovnou z
  terminálu — `cat ~/.viewbase/user-jindrich/totp-jindrich.txt` funguje i přes
  SSH, kde obrázek neotevřete; uvnitř je i ruční kód a `otpauth://` URI.
  Chybí-li soubory (starší instalace, smazané), vyrobí se při dalším startu
  znovu **ze stávajícího tajemství** — registrovat se podruhé není potřeba.

  **Do logu nejde žádné tajemství.** Konzole i log okno dostanou jen systémové
  texty: kdo je uživatel instance a kdo je registrovaný, že vznikla registrace
  (a kde si ji vyzvednout) a auditní stopa zámků:

  ```
  viewbase: uživatel instance: jindrich; registrovaní: hana (TOTP), jindrich (TOTP)
  [warning] backend_program/windows: neplatný kód k oknu 'mzdy'
  [info]    backend_program/windows: okno 'mzdy' odemčeno – token uživatele 'jindrich'
  [info]    backend_program/windows: okno 'mzdy' zamčeno uživatelem
  ```

  Stejným způsobem vzniká i **TLS**: `vb.Project(port=8443, tls=True)` si při
  první instanciaci vyrobí vlastnoručně podepsaný certifikát do
  `~/.viewbase/tls/` a příště ho jen použije (obnoví se sám týden před
  vypršením). SAN pokrývá `localhost`, `127.0.0.1`, `::1` a jméno stroje;
  další jména se přidají `tls_hosts=["vb.firma.cz", "10.0.0.5"]` — a změna
  seznamu certifikát přegeneruje, aby tiše nepokrýval míň, než čekáte. Otisk
  se vypíše do konzole, ať víte, co v prohlížeči potvrzujete:

  ```
  viewbase: self-signed TLS certificate generated: ~/.viewbase/tls/cert.pem
            (SHA-256 5A:79:DF:…; covers localhost, 127.0.0.1, ::1, stroj.local)
  ```

  Server při startu vypíše adresu včetně schématu — na TLS portu **`http://`
  neodpoví vůbec** (klient dostane prázdnou odpověď, protože mluví plaintextem
  do socketu čekajícího TLS handshake). Přesměrovat na témže portu proto nejde;
  co jde, je druhý plaintextový listener: `http_redirect=True` ho postaví na
  `port + 1`, `http_redirect=8080` na konkrétní port a odpovídá 308 na
  `https://…` se zachovanou cestou i dotazem.

  Vlastní certifikát: `tls=vb.Tls("cert.pem", "key.pem")`. Self-signed
  certifikát prohlížeč **napoprvé neuzná** — buď ho jednou potvrdíte, nebo
  importujete do důvěryhodných; JavaScript to za vás udělat nemůže, o důvěře
  rozhoduje prohlížeč a OS. Do produkce patří certifikát od CA nebo reverzní
  proxy. **Zabezpečené okno mimo loopback bez TLS server nespustí** — odemykací
  kód by šel po síti čitelně, tak radši ValueError s návodem než tichá díra.

  QR, `otpauth://` URI, ruční kód ani jednorázový kód (fallback bez `pyotp`,
  ten leží v `user-<jméno>/onetime-<okno>.txt`) se nikdy nevypíšou — jinak by
  skončily v `docker logs`, v CI artefaktu nebo na sdílené obrazovce.

  **Pozor na prostředí:** TOTP umí ověřit jen proces, který má `pyotp`. Když
  instanci spustíte jinde (systémový Python místo venv), okna spadnou na
  jednorázové kódy a kód z autentikátoru se tváří jako neplatný. Start proto
  varuje: *„pyotp v tomhle prostředí chybí … kód z autentikátoru fungovat
  NEBUDE; TOTP zapne: pip install pyotp qrcode"*. Registrace se tím neztrácí
  — tajemství zůstává v `users.json` a po doinstalování `pyotp` funguje
  původní záznam v autentikátoru dál. QR jde **jen do konzole a na disk**,
  nikdy přes HTTP — kdo ho uvidí, zaregistruje si vlastní autentikátor, takže
  ho vidí jedině ten, kdo na stroj už vidí; `/api/mfa/setup` proto neexistuje.
  Cestu k domovu přesměruje `VIEWBASE_HOME` (kontejnery, testy).

---

## Přístup: uživatelé, skupiny a ACL

Zámek okna odpovídá na otázku „jsi to fakt ty, teď?". Vrstva pod ním
odpovídá na jinou: **koho se tenhle objekt vůbec týká.** Obojí platí zároveň
— členství ve skupině říká „tohle tě smí zajímat", kód říká „a teď jsi to
opravdu ty", takže privátní okno chce kód i po členovi správné skupiny.

### Principálové a ACL

**Principál** je řetězec s prefixem: `user:hana`, `group:ucetni`,
`group:public`. Relace jich má množinu — vlastní `user:`, implicitní
`group:` pojmenovanou po uživateli, skupiny ze zdroje identit a vždycky
`group:public`. Vyhodnocení je průnik s ACL objektu, nic víc.

**Žádné „deny".** ACL je množina povolených; `remove()` je odebrání
z povolených, ne zákaz. Záporná pravidla by si vynutila precedenci a model
by přestal být čitelný.

**Dvě implicitní členství.** Každý ověřený člověk je v `group:users` (to je
význam toho jména — jinak by výchozí hodnota neznamenala „kdokoli
přihlášený"), a `group:administrator` **projde všude**. To druhé je obdoba
roota a je vědomé: instance musí mít někoho, kdo se dostane i k objektu se
špatně nastaveným ACL, jinak by se to nedalo opravit zevnitř. Platí to
i obráceně — správce se z ničeho vyloučit nedá, takže tu skupinu má dostat
jen ten, kdo na stroj stejně vidí. **Krok navíc tím dotčený není:** privátní
okno chce kód i po správci.

**Dvě slovesa**, protože „vidět" a „zasahovat" jsou různé věci:

```python
okno = vb.HtmlWindow("mzdy", title="Mzdy", access=["group:ucetni"])
okno.access.add("user:hana")            # …a ještě konkrétní člověk
okno.access.remove("group:public")
okno.access.list()                      # ['group:ucetni', 'user:hana']
okno.access.write.set(["group:ucetni"]) # vidí víc lidí, píše jen účtárna
```

Nenastavené `write` znamená totéž co „vidět" — aby nešlo omezit čtení a
nechat zápis omylem široký.

**Dědičnost:** okno bez ACL bere ACL plochy, plocha bere výchozí hodnotu
instance (`vb.Project(default_access=…)`, výchozí `group:users`).

**Jedinou výjimkou je log okno: to se z plochy NEDĚDÍ.** Logem teče auditní
stopa celé instance a LogBus je jeden pro celý proces — co v něm je, není
vlastnost plochy, na které okno leží. Kdyby se dědilo, stačilo by log okno
na veřejné ploše a stopa jde světu (nalezeno přesně takhle). Výchozí je
proto `default_access`; zveřejnit ji jde jen výslovně:
`vb.LogWindow(screen=s, access=["group:public"])`. Výchozí
`public` by znamenal, že log okno s auditní stopou — IP adresy, prefixy
relací, příkazy ze shellu — je veřejné dřív, než si toho kdo všimne. Kdo chce
jednouživatelské pohodlí na localhostu, řekne si o něj jedním parametrem:
`vb.Project(default_access=["group:public"])`.

**Plocha je brána, okno zúžení.** Kdo nevidí plochu, nedostane ji v `init`
snapshotu, nevidí žádné její okno a událost na ně neprojde. A „nevidíš"
znamená **„neodešle se"**, ne skrytí v prohlížeči: obsah po drátě neputuje,
ACL se ke klientovi neposílá nikdy.

### Skupiny se nestují rekurzivně

Členství deklaruje **nadřazená** skupina — strukturovaně, ne unixovým
`passwd` stylem:

```json
{"groups": {
   "group:ucetni": {"members": ["group:fakturace", "group:mzdy"]},
   "group:mzdy":   {"members": ["user:hana"]}}}
```

Kdo je ve `fakturaci`, je tím i `ucetni`: členství se propaguje **nahoru**,
přístup tedy platí **dolů** — co povolíte účetním, mají i fakturantky.
Rozbalení dělá zdroj identit a vrací hotovou plochou množinu, takže
autorizace zůstává jediný průnik. Cykly (`a` obsahuje `b`, `b` obsahuje `a`)
jsou ohlídané, skončí to.

### Dvě nezávislé zásuvné osy

| osa | rozhraní | výchozí | vyměnitelné za |
|---|---|---|---|
| **identity** | `exists` / `authenticate` / `groups_of` | JSON soubor | LDAP, OIDC |
| **práva objektů** | `load` / `save` | sekce `access` téhož souboru | databáze, konfigurační služba |

Odděleně schválně: LDAP nikdy nebude vědět nic o oknech téhle instance.
Výměnou adresáře se mění jen to, kdo je kdo — „co smí `group:ucetni` vidět"
zůstává vaše doména.

```python
vb.Project(users_file="/etc/viewbase/politika.json",   # kde politika leží
           default_access=["group:users"],             # výchozí ACL objektů
           identity=MujLdap(),                         # volitelně jiný zdroj
           allow_anonymous=False)                      # nejdřív se představ
```

**Aplikace uživatele nezakládá ani nečte.** Jediné, co dělá, je že na svých
prvcích jmenuje principály; identity žijí v souboru politiky (nebo
v adresáři) a spravuje je správce — samostatným nástrojem:

```bash
python -m viewbase.admin adduser hana --groups ucetni,mzdy
python -m viewbase.admin group ucetni --add mzdy --add fakturace
python -m viewbase.admin access screen:provoz --see ucetni
python -m viewbase.admin access screen:provoz/window:mzdy --write user:hana
python -m viewbase.admin users     # kdo existuje a v jakých skupinách je
python -m viewbase.admin show      # celý soubor politiky, bez tajemství
```

Nástroj zapisuje do **téhož** souboru a **týmiž** funkcemi jako běžící
server, takže si sekce nemůžou přepsat. Tajemství nevypíše nikdy — jen
řekne, kde leží QR pro autentikátor. Jmenovat principála, kterého zdroj nezná,
není chyba (může vzniknout později), ale **vždycky** se objeví v logu jako
varování — a **každá** změna práv v kódu je auditní záznam:

```
access change: screen:provoz/window:mzdy see +group:ucetni
access: principál 'group:ucetnii' na screen:provoz/window:mzdy není znám
        zdroji identit – překlep?
```

### Práva se dají opravit bez zásahu do programu

Sekce `access` v souboru politiky **přebíjí kód** — správce musí umět
napravit špatné ACL bez nasazení nové verze:

```json
{"access": {"screen:provoz": {"see": ["group:ucetni"]},
            "screen:provoz/window:mzdy": {"see": ["group:mzdy"],
                                          "write": ["user:hana"]}}}
```

Klíč je celá adresa objektu, takže dvě plochy se stejně pojmenovaným oknem
nesdílejí práva. **Předpokládá to pojmenovanou plochu** (`vb.Screen(id="provoz")`):
bez jména dostane plocha náhodnou adresu, která je po restartu jiná.

### Přihlášení

Anonymní relace má jen `group:public`. Přihlášení je **jméno + kód
z autentikátoru**; jméno bez důkazu je jen řetězec. Prohlížeč si pamatuje
jméno (`vb_user`), nikdy kód.

Výzva se ukáže jen tehdy, když je opravdu o co přijít — server hlásí, kolik
ploch zůstalo skryté. **Veřejná instance přihlašovací obrazovku nikdy
neukáže.** Přihlášený má v liště nabídku `User: <jméno>` s `Lock All Windows`
(zamkne všechna odemčená okna, identita zůstává) a `Log Out` (padá identita
i granty; plochy mimo dosah se zase zavřou).

Skupiny se po přihlášení drží 300 s a pak obnoví ze zdroje — odebrání ze
skupiny tak zabere i za běhu, ne až po odhlášení. **Smazaný uživatel padá
na anonymní relaci** hned při první obnově; dřív dostal neznámý uživatel
výchozí `group:users`, takže mu smazání nic neubralo.

Do auditu jde přihlášení, jeho neúspěch i odhlášení:

```
2026-08-19 09:35:12 INFO    a1b2c3d4 10.0.0.7        [security]  login: 'hana' in ['group:mzdy', 'group:ucetni']
2026-08-19 09:35:44 WARNING a1b2c3d4 10.0.0.7        [security]  login failed for user 'hana'
2026-08-19 09:41:02 WARNING e5f6a7b8 10.0.0.9        [security]  access to window 'mzdy' refused (use) – 'karel' is not in its ACL
```

## Log: co se zaznamená a co uvidíte

Dvě věci, které se snadno pletou:

- **Filtr v log okně** je POHLED. Divák si v `Options` odškrtne úrovně a
  zdroje, které chce vidět; na tom, co aplikace zaznamenává, to nic nemění.
- **`log_level`** je ZDROJ. Určuje, co vůbec vznikne:

  ```python
  vb.Project(port=8443, tls=True, log_level="debug")   # sandbox: chci vidět všechno
  project.log_level = "warning"                        # …a zase ztišit, za běhu
  ```

  Úrovně jsou čtyři (`debug`, `info`, `warning`, `error`), výchozí je
  `warning` — provozní server má mlčet o rutině a mluvit o problémech.

**Bezpečnostní audit prahem neprochází** — zaznamená se vždycky, i s
`log_level="error"`. Kdyby ho šlo utišit nastavením, stačilo by na vystaveném
stroji přehodit úroveň a zamést za sebou. Pozná se podle komponenty
`security` (není to pátá úroveň: úspěšné odemčení je `info`, odmítnutý kód
`warning`):

Řádek má **pevné pořadí sloupců**: kdy → jak vážné → **kdo** (prefix relace)
→ **odkud** (IP) → co (komponenta) → detail. Chybějící sloupec drží místo
pomlčkou, takže se log dá číst i strojově po pozicích:

```
2026-08-18 16:49:02 INFO    9K5eXLQo 127.0.0.1       [security] client 95d2bc7e connected
2026-08-18 16:49:02 DEBUG   9K5eXLQo 127.0.0.1       [server]   event 'window_unlock': {'window_id': 'sh', 'code': '<6 znaků>'}
2026-08-18 16:49:02 WARNING 9K5eXLQo 127.0.0.1       [security] invalid code for window 'sh'
2026-08-18 16:49:03 INFO    9K5eXLQo 127.0.0.1       [security] window 'sh' unlocked – token of user 'workbench'
2026-08-18 16:49:04 DEBUG   9K5eXLQo 127.0.0.1       [windows]  shell 'sh' keys (0 s, 3 znaků): data='id[enter]'
2026-08-18 16:49:04 INFO    9K5eXLQo 127.0.0.1       [security] shell 'sh' command by 'workbench' (os user 'j'): command='id'
2026-08-18 16:49:05 INFO    -        -               [server]   listening on https://127.0.0.1:60000/
```

Stejné pořadí má i log okno v prohlížeči
(`2026-08-18 16:49:02 [warning] 9K5eXLQo 127.0.0.1 backend_program/security: …`).
Ze session id jde do logu jen **prefix** — celé je přihlašovací údaj.

### Příkazy v shell okně

Shell okno zaznamenává, co se do něj napsalo — s **dvěma identitami**, které
se nesmí plést:

```
2026-08-18 16:03:24 INFO viewbase [security] shell 'sh' command by 'workbench'
                         from 89.24.1.2, session DJtjcP1W…, os user 'j': whoami
```

- `by 'workbench'` — uživatel **viewbase**, tedy kdo okno odemkl kódem z
  autentikátoru;
- `os user 'j'` — uživatel **operačního systému**, pod kterým proces
  skutečně běží (ten, pod kterým jede server). Odemčení ve workbenchi na tom
  nic nemění; kdo chce jiného, řekne si o něj příkazem (`su`, `sudo`) — a to
  je v téhle stopě vidět.

**Co to zaznamenává doslova:** řádek, který divák napsal, ne to, co shell
nakonec spustil. Historie, doplňování a editace řádku můžou dát jiný
výsledek, a **heslo napsané na výzvu `sudo` v logu bude** — terminál ho od
příkazu odlišit neumí (bash s readline drží ECHO vypnuté pořád a echuje si
sám). Kdo to nechce, vypne to:

```python
vb.ShellWindow("sh", audit_commands=False)
```

### Klávesy do shellu (ladicí stream)

Při `log_level="debug"` se zaznamenává i to, co se do shell okna mačká.
Klávesy chodí po jednom znaku, takže by z nich byl řádek na stisk — sbírají
se proto do **dávek po 32 znacích** (nebo do Enteru, nebo po minutě, když
někdo píše pomalu):

```
DEBUG viewbase [windows] shell 'sh' keys from 89.24.1.2, session -CYK2Jlc…
                         (0 s, 32 znaků): [arrow-up][ctrl-c]echo dlouhy retezec pres tri
DEBUG viewbase [windows] shell 'sh' keys … (0 s, 21 znaků): cet dva znaky celkem[enter]
```

Sekvence je **ohraničená** (`data='…'`), aby šlo poznat, kde končí — a
apostrof uvnitř se nahradí popisem `[quote]` místo escapování. Mezi
otevíracím a zavíracím apostrofem tak žádný další není a parser nemusí umět
escapy: `command='echo [quote]ahoj[quote]'`.

Neviditelné klávesy se **pojmenují**, ne vyhvězdičkují: `[enter]`, `[tab]`,
`[backspace]`, `[delete]`, `[arrow-up]`, `[page-down]`, `[ctrl-c]`, `[esc]`.
Hvězdička by řekla jen „něco tu bylo" a stříškový zápis (`^[[A`) chce
znalost ANSI. Do logu tím pádem nejde žádný řídicí znak, takže cizí vstup
nepřepíše terminál toho, kdo log čte.

Je to **doplněk auditu příkazů**, ne náhrada: audit dá čistý příkaz na úrovni
`info` (a jde vždycky), tenhle stream ukáže i to, co se do příkazu nakonec
nedostalo — historii, opravy, přerušení.



### Sanace toho, co jde do logu

Do logu tečou cizí vstupy — příkazy, payloady událostí, syrové zprávy od
klienta. Nejde o log4j (Python logging nic nevyhodnocuje), ale o tři reálné
věci, které řeší `log.sanitize` v jednom místě pro všechny cesty:

| útok | co by se stalo | co se s tím dělá |
|---|---|---|
| ESC sekvence | `docker logs` se čte v terminálu; `\x1b[2J` smaže obrazovku, obarví cizí řádky nebo schová vlastní | řídicí znaky se nahradí čitelným `\x1b` |
| podvržení řádku | `\n` v cizím textu vyrobí záznam, který vypadá jako od serveru | zalomení se escapuje, jeden záznam = jeden řádek |
| zaplavení | jedna zpráva utopí zbytek logu | ořízne se na 2000 znaků a připíše se, kolik chybí |

Razítko je vždy celé, `YYYY-MM-DD HH:MM:SS` — v konzoli serveru, v `docker
logs` i v log okně v prohlížeči. U instance, která běží dny a jejíž log se
vyhodnocuje zpětně, je bez data řádek k ničemu.

Do auditu jde **zdroj (IP)** u každé události; IP doplňuje server, ne klient,
takže si ji nikdo nepřepíše payloadem.

---

## Autorizace: co smí která událost

Každá vnitřní událost při registraci **deklaruje, co k ní je potřeba**, a
`dispatch_event` to vynutí dřív, než se k ní dostane handler:

```python
self._register("shell_input",   self._on_shell_input,   needs=Needs.USE)
self._register("window_unlock", self._on_window_unlock, needs=Needs.NONE)
```

**Brána plochy platí u každé události a `needs` ji nevypíná** — říká jen,
co se žádá navíc o okno:

| `needs` | plocha | okno | krok navíc (kód) |
|---|---|---|---|
| `SCREEN` | zasahovat | – | – |
| `UNLOCK` | vidět | vidět | ne (je to **cesta** ke kódu) |
| `SEE` | vidět | vidět | ano |
| `USE` | zasahovat | zasahovat | ano |

Dřív tu byla hodnota `NONE` ve významu „nekontroluj nic" a byla to díra:
`shell_new`, `menu_select` i **každá** uživatelská událost z `@graph.on(...)`
se daly zavolat na plochu, kterou relace vůbec neviděla. Hlídá to
`test_zadna_hodnota_needs_nevypina_branu_plochy`.

Bez `needs` registrace **skončí chybou**, takže se nová událost nedá přidat,
aniž by autor tu otázku zodpověděl — a celá autorizace se dá přečíst na
jednom místě místo čtení devíti funkcí. Vzniklo to z konkrétní zkušenosti:
dokud se kontrola psala v každém handleru zvlášť, **pět z devíti událostí ji
nemělo** a nikdo si toho několik týdnů nevšiml.

Celá mapa (`graph_window.py`, konstruktor) vypadá takhle:

| událost | potřebuje | proč |
|---|---|---|
| `shell_input`, `shell_resize` | `USE` | klávesy a velikost do procesu okna |
| `html_event`, `window_submit` | `USE` | klik, submit a hodnoty polí okna |
| `terminal_input` | `USE` | řádek do konzole okna |
| `window_lock` | `USE` | zamknout jde jen to, co mám odemčené |
| `window_unlock` | `UNLOCK` | **cesta, jak grant získat** — chrání ji kód z autentikátoru a rate limit; okno ale musím aspoň vidět, jinak by šlo zkoušet kód na okno, o kterém se nemám dozvědět |
| `shell_new` | `SCREEN` | nové okno vzniká zamčené a platí strop `MAX_SHELL_WINDOWS` |
| `menu_select` | `SCREEN` | volá autorský callback, ale plochou projít musí |

Uživatelské události (`@graph.on(...)`) dostávají `SCREEN`: grant knihovna
vyžadovat neumí (nemá jak poznat, jestli událost sahá na okno), ale branou
plochy projít musí.

### REST `/api/event`: bez tokenu je to anonym

REST nemá relaci prohlížeče. Dřív neměl identitu žádnou, takže `curl` bez
ničeho spustil autorský handler na ploše, kterou nikdo neměl vidět. Dnes je
bez tokenu **`group:public`** — na uzavřené instanci tedy neprojde:

```python
vb.Project(rest_token="…dlouhý náhodný řetězec…",
           rest_access=["group:roboti"])     # co smí programový klient
```

```bash
curl -H "Authorization: Bearer $TOKEN" -X POST https://…/api/event \
     -d '{"event": "terminal_write", "screen_id": "provoz", "payload": {…}}'
```

Token se porovnává `compare_digest` a `shell_*`, `window_unlock` i
`window_lock` zůstávají přes REST zakázané úplně. **Principály dosazuje vždy
server** — kdyby jen doplňoval chybějící, poslal by si je klient v payloadu
sám a byl by z toho správce.

Hlídá to `python/tests/test_event_authorization.py` — projde registr strojově,
takže desátá událost sadu shodí, dokud se u ní autor nerozhodne.

### Odemčení platí u každé zprávy, ne jen při otevření okna

Grant relace se ověřuje u **všech** cest, kterými se dá do okna psát —
`shell_input`, `shell_resize`, `html_event`, `window_submit`,
`terminal_input`. Odmítnutí jde do auditu i s důvodem, a ten rozlišuje dva
různé případy:

```
WARNING [security] input to window 'sh' refused – session has no grant for this window from 89.24.1.2
WARNING [security] input to window 'sh' refused – expired or unknown session from 89.24.1.2
```

Životní cyklus relace je vidět taky: vypršení v `debug`
(`session Poqzc6Pp… expired (idle after 902 s, 1 grants revoked)`) a
předložení už neplatné relace v auditu
(`stale session _gHGQkTu… presented from 89.24.1.2 – issuing a new one`).

`System → Shell CLI` je otevřená každému připojenému — okno vzniká zamčené,
takže se z něj bez kódu nic nespustí, ale vyrábět je donekonečna nejde:
platí strop `MAX_SHELL_WINDOWS` (8) a každý požadavek i odmítnutí jsou v
auditu.

---

## Odkud smí přijít stránka (Origin)

WebSocket **neprochází CORS**: cizí stránka otevřená v prohlížeči diváka se
může připojit na váš server a prohlížeč jí v tom nezabrání. Grant tím
nezíská — session id je v `localStorage`, na který nedosáhne, takže dostane
prázdnou relaci — ale obsah **nezabezpečených** oken by viděla a mohla by
posílat události.

Server proto při handshaku kontroluje `Origin`: bez nastavení musí sedět na
`Host` požadavku (tedy stránka z téhle instance), jmenovitý seznam se předá
při startu:

```python
vb.Project(port=8443, tls=True,
           allowed_origins=["https://workbench.firma.cz"])
```

Klient bez hlavičky `Origin` (curl, vlastní skript, testy) projde — není to
prohlížeč, takže ho cizí stránka zneužít nemůže. Odmítnutí jde do auditu:
`websocket refused – origin 'https://utocnik.example' not allowed`.

---

## TLS a reverzní proxy

### Za reverzní proxy (nginx, Traefik)

Když před viewbase postavíte proxy, je pro server **protistranou proxy** — a
v auditu byste místo skutečného zdroje viděli pořád tutéž adresu. Potřeba je
obojí: proxy musí zdroj poslat a viewbase jí to musí věřit.

**Na straně viewbase** — komu se hlavička `X-Forwarded-For` věří:

```python
vb.Project(port=8443, tls=True,
           forwarded_allow_ips="10.0.0.2")     # IP vaší proxy, ne "*"
```

Je to seznam adres, **kterým se věří**, ne seznam klientů. `"*"` znamená, že
si zdroj v logu přepíše kdokoli obyčejnou hlavičkou — na vystavené instanci
tím audit ztratí smysl. Bez parametru platí uvicorní výchozí `127.0.0.1`
(proxy na témže stroji). Zapnutí se vypíše při startu:
`trusting X-Forwarded-For from 10.0.0.2`.

**Na straně nginx** — hlavičky musí proxy skutečně poslat, včetně těch pro
WebSocket (bez `Upgrade`/`Connection` spojení neprojde vůbec):

```nginx
location / {
    proxy_pass https://viewbase:8443;

    proxy_set_header X-Real-IP        $remote_addr;
    proxy_set_header X-Forwarded-For  $proxy_add_x_forwarded_for;   # ← zdroj do auditu
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host             $host;

    proxy_http_version 1.1;                      # WebSocket (/ws)
    proxy_set_header Upgrade    $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 3600s;                    # živý tail nesmí vypršet
}
```

Pokud proxy TLS ukončuje sama, může viewbase za ní běžet bez certifikátu —
ale jen když je mezi nimi uzavřená síť (kontejnerová síť, localhost).
Loopback povinné TLS nevyžaduje; jinak je potřeba `tls=…`, aby úsek
proxy → viewbase nešel plaintextem.

**Tajemství se do logu nedostane.** Hodnoty klíčů `code`, `data` (klávesy do
shellu, tedy i hesla, která tam někdo píše), `sid`, `password`, `secret` a
`token` se nahradí délkou (`<6 znaků>`). Zbytek payloadu zůstává, aby se
dalo ladit.

Záznamy tečou **do dvou míst zároveň**: na sběrnici (log okno v prohlížeči)
a na stderr, tedy do `docker logs`. Když si logování nastavuje hostitelská
aplikace sama, knihovna jí handler nepřepisuje.

---

[← zpět na přehled](../README.md)

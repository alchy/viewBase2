# Zabezpečená okna, relace a TLS

*Zámek okna, kód z autentikátoru, relace prohlížeče a šifrované spojení.*

[← zpět na přehled](../README.md)

---

Zabezpečení stojí na třech vrstvách, které spolu souvisí, ale dají se
číst zvlášť: **zámek okna** (co se vůbec pošle po drátě), **relace**
(komu a jak dlouho) a **TLS** (aby to po cestě nešlo odposlechnout).

- **Zabezpečená okna** — `secured=True` na kterémkoli okně (jako `closable=`):
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
  zabité sezení). Ukázka: `examples/secured_windows.py`.
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

```
2026-08-18 15:50:57 INFO    viewbase [security] client 8b5bd7d6 connected from 89.24.x.x (session xzFBo_ya…)
2026-08-18 15:50:57 DEBUG   viewbase [server]   event 'window_unlock' from 89.24.x.x: {'window_id': 'mzdy', 'code': '<6 znaků>'}
2026-08-18 15:50:57 WARNING viewbase [security] invalid code for window 'mzdy' from 89.24.x.x, session xzFBo_ya…
2026-08-18 15:51:04 INFO    viewbase [security] window 'mzdy' unlocked – token of user 'workbench' from 89.24.x.x
2026-08-18 15:51:09 WARNING viewbase [security] REST attempt to call 'shell_input' from 89.24.x.x – refused
2026-08-18 15:51:12 INFO    viewbase [security] client 8b5bd7d6 from 89.24.x.x disconnected
```

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

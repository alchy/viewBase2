"""Správa uživatelů, skupin a práv – nástroj SPRÁVCE, ne aplikace.

PROČ SAMOSTATNÝ NÁSTROJ. Aplikace identity nezakládá ani nečte (viz
identity.py): kdyby uměla, byl by seznam uživatelů funkcí nasazené verze
kódu místo konfigurace a každá aplikace by si směla vyrobit vlastního
správce. Někdo je ale založit musí – a to je tohle.

    python -m viewbase.admin users
    python -m viewbase.admin adduser hana --groups ucetni,mzdy
    python -m viewbase.admin group ucetni --add mzdy --add fakturace
    python -m viewbase.admin access screen:provoz --see ucetni
    python -m viewbase.admin access screen:provoz/window:mzdy --write user:hana

Zapisuje do TÉHOŽ souboru politiky, na který ukazuje konfigurace instance
(`vb.Project(users_file=…)`, jinak `~/.viewbase/users.json`), a přes tytéž
funkce jako běžící server – jediná autorita nad dokumentem zůstává jedna
(mfa.update_section), takže si nástroj a server nemůžou přepsat sekce.

TAJEMSTVÍ SE NIKDY NEVYPISUJE. `adduser` řekne, kde leží QR a textová podoba
pro autentikátor; obsah zůstane v souboru s právy 0600.
"""
from __future__ import annotations

import argparse
import json
import sys
from typing import Any

from . import identity, mfa
from .access import USERS, principal


def _policy_document() -> dict[str, Any]:
    return mfa.load_store()


# ---- uživatelé -------------------------------------------------------------

def cmd_users(args: argparse.Namespace) -> int:
    """Kdo existuje a v jakých skupinách je (i těch zděděných)."""
    users = mfa.load_users()
    if not users:
        print("žádní uživatelé; založ prvního: "
              f"{sys.argv[0]} adduser <jméno>")
        return 0
    provider = identity.LocalProvider()
    for name in sorted(users):
        groups = sorted(provider.groups_of(name))
        totp = "TOTP" if users[name].get("totp_secret") else "bez TOTP"
        print(f"{name:<20} {totp:<10} {', '.join(groups)}")
    return 0


def cmd_adduser(args: argparse.Namespace) -> int:
    """Založ uživatele s TOTP a přiřaď mu skupiny."""
    if not mfa.available():
        print("chybí pyotp – bez něj nejde TOTP registrovat "
              "(pip install pyotp qrcode)", file=sys.stderr)
        return 2
    name = args.user
    users = mfa.load_users()
    fresh = name not in users
    mfa.ensure_user(name)
    groups = [principal(g) for g in (args.groups or "").split(",") if g.strip()]
    users = mfa.load_users()
    users[name]["groups"] = groups or users[name].get("groups") or [USERS]
    mfa.save_users(users)
    state = "založen" if fresh else "aktualizován"
    print(f"uživatel '{name}' {state}; skupiny: "
          f"{', '.join(users[name]['groups'])}")
    if fresh:
        directory = mfa.user_dir(name)
        print(f"autentikátor: cat {directory / f'totp-{name}.txt'}  "
              f"(nebo otevři {directory / f'totp-{name}.svg'})")
    return 0


def cmd_deluser(args: argparse.Namespace) -> int:
    """Smaž uživatele. Jeho členství ve skupinách zaniká s ním."""
    users = mfa.load_users()
    if args.user not in users:
        print(f"takového uživatele neznám: {args.user}", file=sys.stderr)
        return 1
    users.pop(args.user)
    mfa.save_users(users)
    print(f"uživatel '{args.user}' smazán "
          "(adresář s tajemstvím zůstává – smaž ho ručně, ať je to vidět)")
    return 0


# ---- skupiny ---------------------------------------------------------------

def cmd_groups(args: argparse.Namespace) -> int:
    """Hierarchie skupin: co která obsahuje."""
    groups = _policy_document().get("groups") or {}
    if not groups:
        print("hierarchie je prázdná (skupiny jsou ploché)")
        return 0
    for name in sorted(groups):
        record = groups[name]
        members = record.get("members", []) if isinstance(record, dict) else record
        print(f"{name:<24} obsahuje: {', '.join(members) or '—'}")
    return 0


def cmd_group(args: argparse.Namespace) -> int:
    """Uprav, co skupina obsahuje (podskupiny i konkrétní lidi).

    Členství deklaruje NADŘAZENÁ skupina: kdo je v podskupině, je i v ní."""
    groups = dict(_policy_document().get("groups") or {})
    key = principal(args.group)
    record = groups.get(key)
    members = list(record.get("members", []) if isinstance(record, dict)
                 else (record or []))
    for member in args.add or ():
        name = principal(member)
        if name not in members:
            members.append(name)
    for member in args.remove or ():
        name = principal(member)
        if name in members:
            members.remove(name)
    if not members and not args.add:
        groups.pop(key, None)
    else:
        groups[key] = {"members": members}
    mfa.update_section("groups", groups)
    print(f"{key} obsahuje: {', '.join(members) or '—'}")
    return 0


# ---- práva objektů ---------------------------------------------------------

def cmd_access(args: argparse.Namespace) -> int:
    """Práva objektu v souboru politiky. PŘEBÍJEJÍ KÓD aplikace.

    Objekt se adresuje `screen:<id>` nebo `screen:<id>/window:<id>` –
    předpokládá to pojmenovanou plochu (`vb.Screen(id="provoz")`)."""
    rights = dict(identity.policy.load())
    if args.clear:
        rights.pop(args.object, None)
        identity.policy.save(rights)
        print(f"{args.object}: práva ze souboru odebrána (platí kód aplikace)")
        return 0
    record = dict(rights.get(args.object) or {})
    if args.see is not None:
        record["see"] = [principal(g) for g in args.see.split(",") if g.strip()]
    if args.write is not None:
        record["write"] = [principal(g) for g in args.write.split(",") if g.strip()]
    if not record:
        print(json.dumps(rights.get(args.object) or {}, ensure_ascii=False))
        return 0
    rights[args.object] = record
    identity.policy.save(rights)
    print(f"{args.object}: vidí {record.get('see') or '(dědí)'}, "
          f"zasahuje {record.get('write') or '(stejně jako vidí)'}")
    return 0


def cmd_show(args: argparse.Namespace) -> int:
    """Celý soubor politiky bez tajemství – na kontrolu a do issue."""
    data = _policy_document()
    users = {j: {k: v for k, v in z.items() if k != "totp_secret"}
             for j, z in (data.get("users") or {}).items()}
    print(json.dumps({**data, "users": users}, indent=2, ensure_ascii=False))
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="python -m viewbase.admin",
        description="Správa uživatelů, skupin a práv viewBase.")
    parser.add_argument("--file", help="soubor politiky "
                        "(jinak ~/.viewbase/users.json)")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("users", help="vypiš uživatele a jejich skupiny"
                   ).set_defaults(func=cmd_users)

    p = sub.add_parser("adduser", help="založ uživatele (TOTP + skupiny)")
    p.add_argument("user")
    p.add_argument("--groups", help="čárkami oddělené skupiny (bez prefixu = group:)")
    p.set_defaults(func=cmd_adduser)

    p = sub.add_parser("deluser", help="smaž uživatele")
    p.add_argument("user")
    p.set_defaults(func=cmd_deluser)

    sub.add_parser("groups", help="vypiš hierarchii skupin"
                   ).set_defaults(func=cmd_groups)

    p = sub.add_parser("group", help="uprav, co skupina obsahuje")
    p.add_argument("group")
    p.add_argument("--add", action="append", help="přidej člena (skupinu i uživatele)")
    p.add_argument("--remove", action="append", help="odeber člena")
    p.set_defaults(func=cmd_group)

    p = sub.add_parser("access", help="práva objektu (přebíjejí kód)")
    p.add_argument("object", help="screen:<id> nebo screen:<id>/window:<id>")
    p.add_argument("--see", help="kdo vidí (čárkami oddělené)")
    p.add_argument("--write", help="kdo smí zasahovat")
    p.add_argument("--clear", action="store_true", help="odeber ze souboru")
    p.set_defaults(func=cmd_access)

    sub.add_parser("show", help="celý soubor politiky bez tajemství"
                   ).set_defaults(func=cmd_show)
    return parser


def main(argv: "list[str] | None" = None) -> int:
    args = build_parser().parse_args(argv)
    if args.file:
        mfa.configure_store(args.file)
    return args.func(args)


if __name__ == "__main__":                          # pragma: no cover
    raise SystemExit(main())

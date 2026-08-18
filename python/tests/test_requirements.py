"""Konzistence balíčku: co kód importuje, musí být v `pyproject.toml`, a co
`requires-python` slibuje, se musí na té verzi opravdu přeložit.

Nechytat tohle testem znamená, že se to zjistí až u někoho jiného ve chvíli,
kdy `import viewbase` spadne na SyntaxError (stalo se: f-string s backslashem
je až od 3.12, přitom knihovna slibuje 3.10+)."""
import ast
import pathlib
import sys

import pytest

KOREN = pathlib.Path(__file__).resolve().parent.parent
BALICEK = KOREN / "viewbase"


def _meta() -> dict:
    tomllib = pytest.importorskip("tomllib")
    return tomllib.loads((KOREN / "pyproject.toml").read_text("utf-8"))["project"]


def _zdroje():
    return sorted(BALICEK.rglob("*.py"))


def _tretich_stran() -> set[str]:
    """Kořenové názvy modulů, které nejsou stdlib ani vlastní balíček."""
    nalezene: set[str] = set()
    for soubor in _zdroje():
        for uzel in ast.walk(ast.parse(soubor.read_text("utf-8"))):
            if isinstance(uzel, ast.Import):
                nalezene |= {a.name.split(".")[0] for a in uzel.names}
            elif isinstance(uzel, ast.ImportFrom) and not uzel.level:
                nalezene.add((uzel.module or "").split(".")[0])
    return {m for m in nalezene
            if m and m not in sys.stdlib_module_names and m != "viewbase"}


def _deklarovane() -> set[str]:
    return {d.split("[")[0].split(">")[0].split("=")[0].split("<")[0].strip().lower()
            for d in _meta()["dependencies"]}


def test_kazdy_import_ma_svou_zavislost():
    chybi = _tretich_stran() - _deklarovane()
    assert not chybi, f"importuje se, ale není v dependencies: {sorted(chybi)}"


def test_zadna_zavislost_navic():
    """Nepoužitá závislost je zbytečná zátěž pro toho, kdo knihovnu instaluje."""
    navic = _deklarovane() - _tretich_stran()
    assert not navic, f"deklarované, ale nikde neimportované: {sorted(navic)}"


def test_totp_je_standardni_zavislost():
    """TOTP nesmí být volitelné: instance bez `pyotp` spadne na jednorázové
    kódy a kód z autentikátoru pak vypadá jako neplatný."""
    assert {"pyotp", "qrcode"} <= _deklarovane()


def test_kod_se_prelozi_na_nejnizsi_slibene_verzi():
    floor = tuple(int(x) for x in _meta()["requires-python"].lstrip(">=").split("."))
    spatne = []
    for soubor in _zdroje():
        try:
            ast.parse(soubor.read_text("utf-8"), feature_version=floor)
        except SyntaxError as chyba:
            spatne.append(f"{soubor.relative_to(KOREN)}:{chyba.lineno} {chyba.msg}")
    assert not spatne, (f"requires-python slibuje {floor[0]}.{floor[1]}, "
                        f"ale nepřeloží se: {spatne}")


def test_testy_nesahaji_do_skutecneho_domova():
    """Zábradlí (viz conftest.py): celá sada běží nad tmp domovem. Bez toho
    si testy zapisovaly jednorázové kódy do `~/.viewbase` skutečného
    uživatele."""
    import os

    from viewbase import mfa

    domov = mfa.home()
    assert os.environ.get("VIEWBASE_HOME"), "VIEWBASE_HOME musí být nastavené"
    assert pathlib.Path.home() / ".viewbase" != domov

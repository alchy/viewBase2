"""Čím to vlastně běží: verze balíčku a revize zdrojů.

PROČ. Log instance, která je vystavená a sledovaná, se vyhodnocuje zpětně –
a první otázka u každého nálezu je „na které verzi se to stalo?". Bez toho
se nedá poznat, jestli je chyba v běhu, který už je opravený, a jestli mají
dva logy vůbec srovnatelný původ. Proto se identita buildu vypisuje při
startu, hned vedle adresy.

Zdroj v pořadí podle spolehlivosti:

1. `VIEWBASE_BUILD` – co si nastaví image při sestavení
   (`ENV VIEWBASE_BUILD=$(git rev-parse --short HEAD)`); v kontejneru
   `.git` obvykle není, takže tohle je pro nasazení ta správná cesta,
2. `.git` vedle zdrojů – editable instalace z klonu (vývoj); čte se
   `HEAD`, `refs/…` a `packed-refs` PŘÍMO, žádný `git` subprocess,
3. verze balíčku – vždycky aspoň něco.
"""
from __future__ import annotations

import os
from pathlib import Path

#: Env proměnná, kterou si nastaví image při buildu.
BUILD_ENV = "VIEWBASE_BUILD"


def package_version() -> str:
    """Verze nainstalovaného balíčku (`viewbase.__version__` jako záloha)."""
    try:
        from importlib.metadata import PackageNotFoundError, version

        return version("viewbase")
    except Exception:                                    # noqa: BLE001
        from . import __version__

        return __version__


def _git_dir() -> Path | None:
    """`.git` nad zdroji (editable instalace z klonu), jinak None."""
    for parent in Path(__file__).resolve().parents:
        candidate = parent / ".git"
        if candidate.is_dir():
            return candidate
    return None


def git_revision(short: int = 7) -> str | None:
    """Hash HEAD ze souborů v `.git` – bez spouštění gitu.

    Subprocess by při každém startu volal externí binárku (a v kontejneru bez
    gitu by stejně selhal); tohle jsou tři čtení souboru."""
    git = _git_dir()
    if git is None:
        return None
    try:
        head = (git / "HEAD").read_text("utf-8").strip()
    except OSError:
        return None
    if not head.startswith("ref:"):
        return head[:short] or None                      # detached HEAD
    ref = head.split(" ", 1)[1].strip()
    direct = git / ref
    if direct.is_file():
        try:
            return direct.read_text("utf-8").strip()[:short]
        except OSError:
            return None
    # ref může být zabalený v packed-refs (po `git gc`)
    try:
        for line in (git / "packed-refs").read_text("utf-8").splitlines():
            if line.startswith("#") or " " not in line:
                continue
            hash_, name = line.split(" ", 1)
            if name.strip() == ref:
                return hash_[:short]
    except OSError:
        pass
    return None


def build_id() -> str:
    """Identita běhu do logu: `0.1.0 (git b44ef34)`, `0.1.0 (build …)`, `0.1.0`."""
    version = package_version()
    z_env = os.environ.get(BUILD_ENV, "").strip()
    if z_env:
        return f"{version} (build {z_env})"
    revision = git_revision()
    return f"{version} (git {revision})" if revision else version

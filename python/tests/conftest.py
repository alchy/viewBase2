"""Společné zábradlí pro celou testovací sadu.

TESTY NESMÍ SAHAT DO SKUTEČNÉHO `~/.viewbase` (nalezeno v provozu: sada si
do domovského adresáře uživatele zapisovala jednorázové kódy z `open_shell`,
takže tam po každém běhu přibývaly cizí soubory a matly při ladění). Každý
běh proto dostane vlastní `VIEWBASE_HOME` v tmp; testy, které si ho nastavují
samy, tenhle default jen přebijí."""
import os

import pytest


@pytest.fixture(autouse=True, scope="session")
def _viewbase_home(tmp_path_factory):
    domov = tmp_path_factory.mktemp("viewbase-home")
    puvodni = os.environ.get("VIEWBASE_HOME")
    os.environ["VIEWBASE_HOME"] = str(domov)
    yield domov
    if puvodni is None:
        os.environ.pop("VIEWBASE_HOME", None)
    else:
        os.environ["VIEWBASE_HOME"] = puvodni

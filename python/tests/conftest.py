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


@pytest.fixture(autouse=True)
def _verejna_instance():
    """Sada běží na VEŘEJNÉ instanci, pokud test neřekne jinak.

    Většina testů zkoumá obsah a chování oken, ne přístup: bez tohohle by
    každý z nich musel nejdřív přihlásit relaci, jen aby se dostal ke svému
    předmětu. Výchozí hodnota knihovny je naopak `group:users` (zavřeno) –
    testy přístupu si ji nastavují samy a explicitně.

    `vb.Project(default_access=["group:public"])` je legitimní konfigurace:
    přesně tak vypadá jednouživatelský workbench na localhostu."""
    from viewbase import access

    access.configure_default(["group:public"])
    yield
    access.reset_default()

"""Nástroj správce: zakládání uživatelů, skupin a práv mimo aplikaci.

Aplikace identity nezakládá ani nečte (viz identity.py) – ale někdo je
založit musí. Testuje se tady to, co by jinak nikdo nezkontroloval: že
nástroj zapisuje do TÉHOŽ souboru jako server, nemaže si s ním sekce a
nikdy nevypíše tajemství."""
import json

import pytest

from viewbase import admin, identity, mfa

pyotp = pytest.importorskip("pyotp")


@pytest.fixture(autouse=True)
def _domov(tmp_path, monkeypatch):
    monkeypatch.setenv("VIEWBASE_HOME", str(tmp_path))
    mfa.reset_state()
    identity.reset()
    yield tmp_path
    mfa.reset_state()
    identity.reset()


def _soubor(domov):
    return json.loads((domov / "users.json").read_text())


def test_adduser_zalozi_uzivatele_se_skupinami(_domov, capsys):
    assert admin.main(["adduser", "hana", "--groups", "ucetni,mzdy"]) == 0
    out = capsys.readouterr().out
    assert "hana" in out and "group:ucetni" in out
    data = _soubor(_domov)
    assert data["users"]["hana"]["groups"] == ["group:ucetni", "group:mzdy"]
    assert data["users"]["hana"]["totp_secret"] not in out    # nikdy do konzole
    assert "totp-hana.txt" in out                             # jen kde ho vzít


def test_group_deklaruje_co_obsahuje_a_clenstvi_se_propaguje(_domov, capsys):
    admin.main(["adduser", "hana", "--groups", "mzdy"])
    assert admin.main(["group", "ucetni", "--add", "mzdy",
                       "--add", "fakturace"]) == 0
    assert _soubor(_domov)["groups"]["group:ucetni"]["members"] == [
        "group:mzdy", "group:fakturace"]
    # hana je ve mzdách → je i účetní, aniž by se sahalo do jejího záznamu
    assert identity.LocalProvider().groups_of("hana") == {
        "group:mzdy", "group:ucetni"}

    admin.main(["group", "ucetni", "--remove", "fakturace"])
    assert _soubor(_domov)["groups"]["group:ucetni"]["members"] == ["group:mzdy"]


def test_access_zapise_prava_objektu_a_umi_je_zase_odebrat(_domov, capsys):
    admin.main(["adduser", "hana", "--groups", "ucetni"])
    assert admin.main(["access", "screen:provoz", "--see", "ucetni"]) == 0
    assert _soubor(_domov)["access"]["screen:provoz"]["see"] == ["group:ucetni"]

    admin.main(["access", "screen:provoz/window:mzdy",
                "--see", "ucetni", "--write", "user:hana"])
    zaznam = _soubor(_domov)["access"]["screen:provoz/window:mzdy"]
    assert zaznam == {"see": ["group:ucetni"], "write": ["user:hana"]}

    admin.main(["access", "screen:provoz", "--clear"])
    assert "screen:provoz" not in _soubor(_domov)["access"]


def test_nastroj_nesmi_prepsat_sekce_serveru(_domov):
    """Tentýž soubor, tři vlastníci – zápis jedné sekce nechá ostatní být."""
    admin.main(["adduser", "hana", "--groups", "mzdy"])
    admin.main(["group", "ucetni", "--add", "mzdy"])
    admin.main(["access", "screen:provoz", "--see", "ucetni"])
    admin.main(["adduser", "karel"])              # další zápis do `users`

    data = _soubor(_domov)
    assert set(data["users"]) == {"hana", "karel"}
    assert data["groups"]["group:ucetni"]["members"] == ["group:mzdy"]
    assert data["access"]["screen:provoz"]["see"] == ["group:ucetni"]


def test_users_vypise_i_zdedene_skupiny(_domov, capsys):
    admin.main(["adduser", "hana", "--groups", "mzdy"])
    admin.main(["group", "ucetni", "--add", "mzdy"])
    capsys.readouterr()
    admin.main(["users"])
    out = capsys.readouterr().out
    assert "hana" in out and "group:ucetni" in out and "group:mzdy" in out


def test_show_nikdy_nevypise_tajemstvi(_domov, capsys):
    admin.main(["adduser", "hana"])
    tajemstvi = mfa.load_users()["hana"]["totp_secret"]
    capsys.readouterr()
    admin.main(["show"])
    out = capsys.readouterr().out
    assert "hana" in out and tajemstvi not in out


def test_soubor_politiky_lze_zadat_parametrem(tmp_path, capsys):
    """`--file` míří jinam než domov – politika může ležet v /etc nebo na
    připojeném svazku kontejneru."""
    jinde = tmp_path / "jinde" / "politika.json"
    admin.main(["--file", str(jinde), "adduser", "hana", "--groups", "ucetni"])
    assert json.loads(jinde.read_text())["users"]["hana"]["groups"] == \
        ["group:ucetni"]


def test_cesta_k_souboru_nepretrvava_do_dalsiho_behu(tmp_path, _domov):
    """Nalezeno v sadě: `--file` je globální nastavení a zapomenout ho
    znamená, že další instance zapisuje jinam, než čeká."""
    admin.main(["--file", str(tmp_path / "jinde.json"), "adduser", "hana"])
    mfa.reset_state()
    assert mfa.store_path() == _domov / "users.json"


def test_deluser_smaze_uzivatele(_domov, capsys):
    admin.main(["adduser", "hana"])
    assert admin.main(["deluser", "hana"]) == 0
    assert "hana" not in mfa.load_users()
    assert admin.main(["deluser", "nikdo"]) == 1

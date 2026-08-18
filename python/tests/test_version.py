"""Identita běhu: čím to běží, aby šel log vyhodnotit zpětně."""
import pytest

from viewbase import version


@pytest.fixture(autouse=True)
def _bez_env(monkeypatch):
    monkeypatch.delenv(version.BUILD_ENV, raising=False)


def test_verze_balicku_je_vzdycky_neco():
    assert version.package_version()


def test_revize_z_git_adresare_bez_subprocesu():
    """V klonu (editable instalace) se hash čte přímo ze souborů `.git`."""
    revize = version.git_revision()
    assert revize is None or (len(revize) == 7 and revize.isalnum())


def test_env_ma_prednost_pred_gitem(monkeypatch):
    """V kontejneru `.git` obvykle není – image si identitu nastaví sama."""
    monkeypatch.setenv(version.BUILD_ENV, "img-2026.08.18")
    assert version.build_id() == f"{version.package_version()} (build img-2026.08.18)"


def test_bez_gitu_i_env_zbyde_aspon_verze(monkeypatch):
    monkeypatch.setattr(version, "git_revision", lambda *a, **kw: None)
    assert version.build_id() == version.package_version()


def test_start_hlasi_cim_bezi(tmp_path, monkeypatch, capsys):
    """První řádek logu odpoví na otázku „na které verzi se to stalo?"."""
    import viewbase as vb

    monkeypatch.setenv("VIEWBASE_HOME", str(tmp_path))
    screen = vb.Screen(title="X")
    vb.GraphWindow(screen=screen)
    with vb.Project(port=0) as project:
        project.serve(screen, block=False)
    radky = capsys.readouterr().out.splitlines()
    assert any("viewbase 0." in r and "starting" in r for r in radky), radky

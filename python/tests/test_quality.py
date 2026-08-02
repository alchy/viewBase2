"""Validace parametru quality."""
import pytest

import viewbase as vb


def test_quality_default_auto():
    assert vb.GraphWindow().config["quality"] == "auto"


def test_quality_validni_hodnoty():
    for value in ("low", "high", "auto"):
        assert vb.GraphWindow(quality=value).config["quality"] == value


def test_quality_nevalidni_pada():
    with pytest.raises(ValueError):
        vb.GraphWindow(quality="ultra")

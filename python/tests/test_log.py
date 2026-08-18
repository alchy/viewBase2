import pytest

from viewbase.log import COMPONENTS, LOG_LEVELS, LOG_SOURCES, LogBus, log


def test_publish_invalid_level_raises():
    with pytest.raises(ValueError):
        LogBus().publish("critical", "backend_user", "x")


def test_publish_invalid_source_raises():
    with pytest.raises(ValueError):
        LogBus().publish("info", "ghost", "x")


def test_publish_delivers_to_subscribers():
    bus = LogBus()
    got = []
    bus.subscribe(got.append)
    record = bus.publish("warning", "backend_program", "reconnect",
                          component="server")
    assert got == [record]
    assert record.level == "warning"
    assert record.source == "backend_program"
    assert record.message == "reconnect"


def test_unsubscribe_stops_delivery():
    bus = LogBus()
    got = []
    bus.subscribe(got.append)
    bus.unsubscribe(got.append)
    bus.publish("info", "backend_api", "x", component="rest")
    assert got == []


def test_as_dict():
    bus = LogBus()
    record = bus.publish("error", "frontend", "boom")
    assert record.as_dict() == {
        "level": "error", "source": "frontend", "message": "boom",
        "component": None}


def test_all_levels_and_sources_valid():
    bus = LogBus()
    for level in LOG_LEVELS:
        for source in LOG_SOURCES:
            component = "graph" if source in ("backend_api", "backend_program") else None
            bus.publish(level, source, "ok", component=component)


def test_internal_source_without_component_raises():
    bus = LogBus()
    with pytest.raises(ValueError):
        bus.publish("info", "backend_program", "reconnect klienta")


def test_internal_source_with_unknown_component_raises():
    bus = LogBus()
    with pytest.raises(ValueError):
        bus.publish("info", "backend_api", "POST /api/event", component="ghost")


def test_internal_source_with_valid_component_ok():
    bus = LogBus()
    record = bus.publish("info", "backend_program", "reconnect klienta",
                          component="server")
    assert record.component == "server"
    assert record.as_dict()["component"] == "server"


def test_user_and_frontend_source_component_optional():
    bus = LogBus()
    record = bus.publish("info", "backend_user", "ahoj")
    assert record.component is None


def test_components_cover_four_module_split():
    # `security` je šestá komponenta, ne pátá úroveň: audit se pozná podle ní
    # (viz logger.Logger.audit) a prahem `log_level` neprochází
    assert set(COMPONENTS) == {"graph", "gui", "windows", "rest", "server",
                               "security"}


def test_log_shortcut_uses_backend_user_source_on_global_bus():
    from viewbase.log import bus as global_bus
    got = []
    global_bus.subscribe(got.append)
    try:
        log("hello", level="debug")
        assert got[-1].source == "backend_user"
        assert got[-1].level == "debug"
        assert got[-1].message == "hello"
    finally:
        global_bus.unsubscribe(got.append)


def test_log_default_level_is_info():
    from viewbase.log import bus as global_bus
    got = []
    global_bus.subscribe(got.append)
    try:
        log("hi")
        assert got[-1].level == "info"
    finally:
        global_bus.unsubscribe(got.append)

"""PTY vrstva shell okna: skutečný proces (bash/zsh/cokoli) na pseudo-terminálu.

Čistě systémová část – o protokolu ani oknech neví nic, takže se testuje
samostatně (tests/test_pty_shell.py). Nad ní staví `ShellWindow` /
`GraphWindow.open_shell`.

Proč PTY a ne `subprocess.PIPE`: program na rouře pozná, že nemá terminál
(`isatty` → False), takže vypne barvy, prompt i celoobrazovkový režim. Na
PTY se chová jako v opravdovém terminálu – proto v okně poběží i `vim`,
`htop` nebo `mc` (frontend je vykreslí přes xterm.js).

Výstup chodí callbackem `on_data(text)` ze čtecího VLÁKNA (ne asyncio –
knihovna jinde taky pracuje s vlákny a akce jen řadí do fronty), konec
procesu `on_exit(code)`. Text je dekódovaný inkrementálně, aby se
vícebajtový znak rozseknutý mezi dvěma `read()` neztratil.

Windows (ConPTY přes pywinpty) není součástí prvního kroku – `PtyShell`
tam vyhodí `NotImplementedError` se srozumitelnou hláškou.
"""
from __future__ import annotations

import codecs
import os
import signal
import subprocess
import sys
import threading
import time
from typing import Any, Callable, Sequence

READ_CHUNK = 65536
KILL_AFTER_S = 2.0      # po SIGHUP počkej, pak SIGKILL


def default_command() -> list[str]:
    """Shell uživatele, pod kterým běží server (`$SHELL`), jinak /bin/sh.
    Login shell (`-l`) záměrně NE: okno je interaktivní shell, ne přihlášení –
    přepnutí uživatele si aplikace řekne explicitně (`command=["su", "-", …]`)."""
    if sys.platform == "win32":                         # pragma: no cover
        return [os.environ.get("COMSPEC", "cmd.exe")]
    return [os.environ.get("SHELL") or "/bin/sh", "-i"]


class PtyShell:
    """Proces na pseudo-terminálu.

    `command` je seznam argv (žádný shell-string – nechceme kvoting jako
    útočnou plochu). `on_data(text)` dostává výstup po kouscích, `on_exit(code)`
    se zavolá právě jednou, až proces skončí (i po `terminate()`).
    """

    def __init__(self, command: Sequence[str] | None = None, *,
                 cwd: str | None = None, env: dict[str, str] | None = None,
                 cols: int = 80, rows: int = 24,
                 on_data: Callable[[str], None] | None = None,
                 on_exit: Callable[[int | None], None] | None = None) -> None:
        if sys.platform == "win32":                     # pragma: no cover
            raise NotImplementedError(
                "Shell okno zatím běží jen na POSIX (macOS/Linux); Windows "
                "vyžaduje ConPTY (pywinpty) – viz spec 2026-08-18-shell-okno")
        self.command = list(command) if command else default_command()
        self.cwd = cwd
        self.env = env
        self.cols = max(1, int(cols))
        self.rows = max(1, int(rows))
        self.on_data = on_data or (lambda _text: None)
        self.on_exit = on_exit or (lambda _code: None)
        self._master: int | None = None
        self._proc: subprocess.Popen[Any] | None = None
        self._reader: threading.Thread | None = None
        self._decoder = codecs.getincrementaldecoder("utf-8")(errors="replace")
        self._exit_sent = threading.Event()

    # ---- životní cyklus ---------------------------------------------------

    @property
    def alive(self) -> bool:
        return self._proc is not None and self._proc.poll() is None

    def start(self) -> None:
        """Spusť proces na novém PTY a rozjeď čtecí vlákno."""
        import fcntl
        import pty
        import termios

        if self._proc is not None:
            raise RuntimeError("PtyShell už běží (start lze zavolat jen jednou)")
        master, slave = pty.openpty()
        self._master = master
        self._set_winsize(self.rows, self.cols)

        def child() -> None:
            # Popen dup2-uje slave na 0/1/2 a udělá setsid JEŠTĚ PŘED tímhle
            # callbackem, takže fd 0 je slave v nové session – zbývá z něj
            # udělat řídicí terminál, jinak by Ctrl-C nedoručil SIGINT.
            fcntl.ioctl(0, termios.TIOCSCTTY, 0)

        try:
            self._proc = subprocess.Popen(          # noqa: S603 (argv, ne shell)
                self.command, stdin=slave, stdout=slave, stderr=slave,
                cwd=self.cwd, env=self.env,
                start_new_session=True, preexec_fn=child, close_fds=True)
        finally:
            os.close(slave)                          # rodič slave nepotřebuje
        self._reader = threading.Thread(target=self._read_loop, name="viewbase-pty",
                                        daemon=True)
        self._reader.start()

    def write(self, data: str) -> None:
        """Klávesy do procesu (ne řádky – posílá se i Ctrl-C, šipky, Esc…)."""
        if self._master is None:
            raise RuntimeError("PtyShell neběží (chybí start)")
        try:
            os.write(self._master, data.encode("utf-8"))
        except OSError:
            pass                                     # proces mezitím skončil

    def resize(self, cols: int, rows: int) -> None:
        """Nové rozměry okna → SIGWINCH procesu (celoobrazovkové programy
        se překreslí)."""
        self.cols, self.rows = max(1, int(cols)), max(1, int(rows))
        self._set_winsize(self.rows, self.cols)

    def terminate(self) -> None:
        """SIGHUP celé procesní skupině (jako když zavřeš okno terminálu),
        po `KILL_AFTER_S` SIGKILL. Idempotentní."""
        proc = self._proc
        if proc is None or proc.poll() is not None:
            return
        try:
            os.killpg(os.getpgid(proc.pid), signal.SIGHUP)
        except (ProcessLookupError, PermissionError):
            return
        konec = time.time() + KILL_AFTER_S
        while time.time() < konec and proc.poll() is None:
            time.sleep(0.05)
        if proc.poll() is None:
            try:
                os.killpg(os.getpgid(proc.pid), signal.SIGKILL)
            except (ProcessLookupError, PermissionError):
                pass

    # ---- vnitřek ----------------------------------------------------------

    def _set_winsize(self, rows: int, cols: int) -> None:
        import fcntl
        import struct
        import termios

        if self._master is None:
            return
        try:
            fcntl.ioctl(self._master, termios.TIOCSWINSZ,
                        struct.pack("HHHH", rows, cols, 0, 0))
        except OSError:
            pass

    def _read_loop(self) -> None:
        """Čte master fd do EOF/EIO (EIO = dítě zavřelo slave = konec)."""
        while True:
            try:
                raw = os.read(self._master, READ_CHUNK)      # type: ignore[arg-type]
            except (OSError, ValueError):
                break
            if not raw:
                break
            text = self._decoder.decode(raw)
            if text:
                try:
                    self.on_data(text)
                except Exception:                            # noqa: BLE001
                    pass                                     # handler si chyby řeší sám
        self._finish()

    def _finish(self) -> None:
        if self._exit_sent.is_set():
            return
        self._exit_sent.set()
        proc = self._proc
        code = proc.wait() if proc is not None else None
        if self._master is not None:
            try:
                os.close(self._master)
            except OSError:
                pass
            self._master = None
        try:
            self.on_exit(code)
        except Exception:                                    # noqa: BLE001
            pass

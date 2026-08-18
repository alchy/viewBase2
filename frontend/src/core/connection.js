import { decode, encode, hello } from './protocol.js';

/** WebSocket klient: handshake, routing zpráv do store, reconnect s backoffem.
 *  Stavy hlásí přes onStatus('init' | 'close' | 'connect_failed' |
 *  'protocol_mismatch'). 'connect_failed' vs. 'close' rozlišuje, jestli
 *  spojení VŮBEC nikdy nenavázalo (první pokus neuspěl – „nezdařilo se"),
 *  nebo bylo živé a teprve teď spadlo („vypadlo") – jiná zpráva pro
 *  uživatele, ne stejný text pro dvě různé situace. */
export class Connection {
  constructor(url, store, {
    WebSocketImpl = globalThis.WebSocket,
    schedule = (fn, delay) => setTimeout(fn, delay),
    minBackoff = 500,
    maxBackoff = 10000,
    onStatus = () => {},
    onAction = () => {},
    onLog = () => {},
    resolveStore = null,
  } = {}) {
    this.url = url;
    this.store = store;
    this.WebSocketImpl = WebSocketImpl;
    this.schedule = schedule;
    this.minBackoff = minBackoff;
    this.maxBackoff = maxBackoff;
    this.backoff = minBackoff;
    this.onStatus = onStatus;
    this.onAction = onAction;
    this.onLog = onLog;
    // multi-screen (ScreenManager.resolveStore): jedna zpráva může patřit
    // kterémukoli screenu podle screen_id – bez resolveStore (dnešní
    // jednoscreenové použití) se pořád použije jediný this.store.
    this.resolveStore = resolveStore;
    this.stopped = false;   // po protocol_mismatch se už nereconnectuje
    this.everConnected = false;   // 'close' vs. 'connect_failed' rozlišení
    this.ws = null;
  }

  _storeFor(screenId) {
    if (this.resolveStore) {
      const resolved = this.resolveStore(screenId);
      if (resolved) return resolved;
    }
    return this.store;
  }

  connect() {
    const ws = new this.WebSocketImpl(this.url);
    this.ws = ws;
    ws.onopen = () => {
      this.everConnected = true;
      this.backoff = this.minBackoff;
      ws.send(encode(hello()));
    };
    ws.onmessage = (event) => this._onMessage(event.data);
    ws.onclose = () => {
      if (this.stopped) return;   // mismatch: uživatel už vidí výzvu k F5
      this.onStatus(this.everConnected ? 'close' : 'connect_failed');
      this.schedule(() => this.connect(), this.backoff);
      this.backoff = Math.min(this.backoff * 2, this.maxBackoff);
    };
  }

  _onMessage(raw) {
    let msg;
    try {
      msg = decode(raw);
    } catch (err) {
      console.warn('viewbase: malformed message from server', err);
      return;
    }
    if (msg.type === 'init') {
      this._storeFor(msg.screen_id).applyInit(msg);
      this.onStatus('init');
    } else if (msg.type === 'patch') {
      if (!this._storeFor(msg.screen_id).applyPatch(msg)) this.ws.close();  // mezera v seq
    } else if (msg.type === 'action') {
      this.onAction(msg);
    } else if (msg.type === 'log') {
      this.onLog(msg);
    } else if (msg.type === 'error') {
      console.error('viewbase server:', msg.error);
      if (msg.error === 'protocol_mismatch') {
        this.stopped = true;
        this.onStatus('protocol_mismatch');
      }
    }
  }

  send(message) {
    if (this.ws && this.ws.readyState === 1) this.ws.send(encode(message));
  }
}

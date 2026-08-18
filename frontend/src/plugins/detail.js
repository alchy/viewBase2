/** Detail plugin: okno s řádky klíč/hodnota nad uzlem grafu. Chrome dědí
 *  z BaseWindow (wm/); tady je tělo detailu, čisté funkce buildRows/
 *  windowsToRefresh a instalace do desktopu (typ okna 'detail', server
 *  akce `show_detail`, reakce na patche – živý refresh otevřených detailů
 *  a zavření detailů smazaných uzlů). Uzly a konfiguraci
 *  (`config.detail_window`) čte ze store – model vlastní graf plugin,
 *  detail je jeho čtenář. */
import { BaseWindow } from '../wm/base_window.js';

/** node + šablona řádků → pole {label, value}.
 *  rowsTemplate = pole dvojic [label, metaKey]; null = jeden řádek na meta. */
export function buildRows(node, rowsTemplate) {
  const meta = node?.meta ?? {};
  if (rowsTemplate == null) {
    return Object.entries(meta).map(([key, value]) => ({
      label: key, value: String(value ?? ''),
    }));
  }
  return rowsTemplate.map(([label, key]) => ({
    label, value: String(meta[key] ?? ''),
  }));
}

/** Z patche a množiny otevřených (detailních) oken urči, co překreslit a co
 *  zavřít. remove má přednost před update (uzel v obou → jen close). */
export function windowsToRefresh(patch, openIds) {
  const open = openIds instanceof Set ? openIds : new Set(openIds);
  const close = (patch.remove_nodes ?? []).filter((id) => open.has(id));
  const closing = new Set(close);
  const refresh = (patch.update_nodes ?? [])
    .map((n) => n.id)
    .filter((id) => open.has(id) && !closing.has(id));
  return { refresh, close };
}

/** Detailní okno: tělo = tabulka řádků klíč/hodnota; klik na hodnotu kopíruje. */
export class DetailWindow extends BaseWindow {
  constructor({ nodeId, title, rows, widthChars, container, manager }) {
    super({ id: nodeId, title, widthChars, container, manager, kind: 'detail' });
    this.rows = rows;
    this._buildBody();
    this._mount();
  }

  _buildBody() {
    const body = document.createElement('div');
    body.dataset.role = 'detail-body';
    body.style.cssText = [
      'padding:6px 10px', `width:${this.widthChars}ch`, 'max-width:90vw',
      'font:13px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace',
      'overflow:auto',
    ].join(';');
    this.body = body;
    this._renderBody();
    this.el.appendChild(body);
  }

  _renderBody() {
    this.body.replaceChildren();
    const table = document.createElement('table');
    table.style.cssText = 'border-collapse:collapse;width:100%';
    for (const { label, value } of this.rows) {
      const tr = table.insertRow();
      const keyCell = tr.insertCell();
      keyCell.textContent = label;
      keyCell.style.cssText = [
        'padding:1px 12px 1px 0', 'vertical-align:top', 'white-space:nowrap',
        'color:var(--vb-window-key, #667788)',
      ].join(';');
      const valCell = tr.insertCell();
      valCell.dataset.role = 'detail-value';
      valCell.textContent = value;
      valCell.style.cssText = [
        'padding:1px 0', 'word-break:break-all', 'cursor:copy',
      ].join(';');
      valCell.addEventListener('click', (e) => {
        e.stopPropagation();
        this._copy(value, valCell);
      });
    }
    this.body.appendChild(table);
  }

  _copy(value, cell) {
    const flash = () => {
      cell.style.transition = 'background 0.15s';
      const prev = cell.style.background;
      cell.style.background = 'var(--vb-window-gadget, #8a93a3)';
      setTimeout(() => { cell.style.background = prev; }, 180);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(flash).catch(() => {
        this._execCopy(value); flash();
      });
    } else {
      this._execCopy(value); flash();
    }
  }

  _execCopy(value) {
    try {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch {
      console.warn('viewbase: copy to clipboard failed');
    }
  }

  update({ title, rows }) {
    if (title != null) {
      this.setTitle(title);
    }
    if (rows != null) {
      this.rows = rows;
      if (!this.isMinimized) this._renderBody();
    }
  }
}

/** Instalace do desktopu: typ okna 'detail' (spec = {nodeId}), akce
 *  `show_detail` a živé patche. Factory řeší sémantiku „existující okno
 *  fokusni/obnov, jinak otevři" – to je vlastnost detailů (jedno okno na
 *  uzel), ne WindowManageru. */
export function createDetailPlugin({ container, windowManager, store }) {
  const config = () => store.config?.detail_window
    ?? { rows: null, width_chars: 128, open_on_click: true };

  windowManager.registerType('detail', ({ nodeId }) => {
    const existing = windowManager.get(nodeId);
    if (existing) {
      if (existing.isMinimized) existing.restore();
      else existing.bringToFront();
      return existing;
    }
    const node = store.nodes.get(nodeId);
    if (!node) return null;
    const cfg = config();
    const win = windowManager.adopt(new DetailWindow({
      nodeId,
      title: node.label,
      rows: buildRows(node, cfg.rows),
      widthChars: cfg.width_chars,
      container,
      manager: windowManager,
    }));
    win.bringToFront();
    return win;
  });

  store.subscribe((event) => {
    if (event.kind !== 'patch') return;
    const detailIds = new Set();
    for (const [id, win] of windowManager.windows) {
      if (win.kind === 'detail') detailIds.add(id);
    }
    if (detailIds.size === 0) return;
    const { refresh, close } = windowsToRefresh(event.patch, detailIds);
    for (const id of close) windowManager.close(id);
    const cfg = config();
    for (const id of refresh) {
      const win = windowManager.get(id);
      const node = store.nodes.get(id);
      if (win && node) {
        win.update({ title: node.label, rows: buildRows(node, cfg.rows) });
      }
    }
  });

  return {
    name: 'detail',
    actions: {
      show_detail: (msg) => windowManager.open('detail', { nodeId: msg.node_id }),
    },
  };
}

/** ScreenBar (WM jádro, §8 + §8a + §9 designu): PRÁVĚ JEDNA lišta na
 *  screen – vystředěný titulek, skupiny menu (ScreenMenu §8 + vestavěné
 *  Options §8a) a depth gadgety (`addGadget`, `ScreenManager`)
 *  POHROMADĚ v jednom pruhu, žádná druhá lišta navíc (uživatelská oprava:
 *  „máš na screenu mít vždy jen jednu lištu… i menu je v rámci screen
 *  lišty"). Je SOUČÁST kontejneru screenu (`container.appendChild`),
 *  takže se s ním posouvá jako jeden blok při drag-reveal (§6) – žádná
 *  fixní lišta, co zůstane viset, když se screen celý odtáhne pryč.
 *
 *  Dva druhy skupin v menu:
 *  - "vzdálené" ze ScreenMenu (§8, `pin_menu`) – klik na položku pošle
 *    event `menu_select`.
 *  - "lokální" Options (§8a) – položky určuje AKTIVNÍ okno na screenu
 *    (macOS menu bar model; dodává WindowManager.refreshOptions).
 *  Volba položky (příkaz i checkbox) dropdown VŽDY zavře – „zvolím,
 *  menu se zavře" (uživatelská oprava; dřív checkbox nechával dropdown
 *  otevřený pro vícenásobné přepínání). */
export class ScreenBar {
  constructor({ container, sendEvent }) {
    this.container = container;
    this.sendEvent = sendEvent;
    this.remoteGroups = [];   // ze ScreenMenu (§8), akce přes sendEvent
    this.optionsGroup = null; // { name: 'Options', items: [{key,label,checked,onToggle}] }
    this.systemGroup = null;  // vestavěné „System" (Shell CLI) – viz setSystemGroup
    this.openGroup = null;

    this.el = document.createElement('div');
    this.el.dataset.role = 'vb-screen-menu';
    this.el.style.cssText = [
      'position:absolute', 'top:0', 'left:0', 'right:0', 'z-index:1400',
      'font:12px system-ui,sans-serif',
    ].join(';');

    // JEDNA viditelná lišta (§2 designu reference – referenční screenshot
    // "Amiga Workbench   … graphics mem … other mem" jde OD KRAJE KE KRAJI,
    // ne plovoucí s mezerou – oprava dřívějšího pokusu), 3 sloupce (CSS
    // grid, aby titulek byl OPRAVDU vystředěný bez ohledu na nesymetrickou
    // šířku menu skupin vs. gadgetu): [menu skupiny, Options první] --
    // [titulek + živé metriky, vystředěno] -- [switch gadget].
    // `cursor:ns-resize` protože CELÁ (mimo interaktivní děti) je
    // drag-reveal povrch – `ScreenManager` na ni věší pointerdown/move/up.
    this.bar = document.createElement('div');
    this.bar.dataset.role = 'vb-screen-menu-bar';
    this.bar.style.cssText = [
      'display:grid', 'grid-template-columns:1fr auto 1fr', 'align-items:center',
      'height:26px', 'padding:0 6px',
      'background:var(--vb-screenbar-bg, rgba(230,230,235,0.95))',
      'color:var(--vb-screenbar-fg, #000)',
      'border:1px solid rgba(0,0,0,0.4)', 'box-sizing:border-box',
      'cursor:ns-resize', 'user-select:none',
    ].join(';');
    this.el.appendChild(this.bar);

    // skupiny menu (ScreenMenu + Options, Options první) – přerenderované
    // v _render()
    this.groupsEl = document.createElement('div');
    this.groupsEl.style.cssText = 'display:flex;justify-self:start;min-width:0';
    this.bar.appendChild(this.groupsEl);

    // Vystředěný TITULEK – nic víc (uživatelská oprava: metriky sítě
    // nese titulek grafového okna, „lišta už to nepotřebuje, má jen
    // titulek").
    this.titleEl = document.createElement('span');
    this.titleEl.dataset.role = 'vb-screen-bar-title';
    this.titleEl.style.cssText = [
      'overflow:hidden', 'text-overflow:ellipsis', 'white-space:nowrap',
      'font-weight:600', 'justify-self:center', 'min-width:0',
    ].join(';');
    this.bar.appendChild(this.titleEl);

    // depth gadgety (§2 designu reference) – naplní `ScreenManager.addGadget`
    this.gadgetsEl = document.createElement('div');
    this.gadgetsEl.style.cssText = 'display:flex;gap:3px;justify-self:end';
    this.bar.appendChild(this.gadgetsEl);

    this.dropdown = document.createElement('div');
    this.dropdown.dataset.role = 'vb-screen-menu-dropdown';
    this.dropdown.style.cssText = [
      'position:absolute', 'top:100%', 'left:0', 'display:none',
      'background:#d4d4d4', 'border:1px solid #000', 'min-width:190px',
      'box-shadow:0 4px 8px rgba(0,0,0,0.3)',
    ].join(';');
    this.el.appendChild(this.dropdown);

    container.appendChild(this.el);
    // klik mimo menu zabalí dropdown (§8: cross-platform klik-přepínání)
    this._onOutsideClick = (e) => {
      if (!this.el.contains(e.target)) this._closeDropdown();
    };
    document.addEventListener('pointerdown', this._onOutsideClick);
  }

  /** Titulek screenu (vystředěná část lišty) – volá `ScreenManager` při
   *  registraci a při každém initu (title se může změnit reconnectem). */
  setTitle(text) {
    this.titleEl.textContent = text;
  }

  /** Depth gadget (§2 designu reference – bitmapa vyříznutá ze
   *  screenbar-single-gadget-edge-to-edge.png, viz frontend/src/assets/
   *  gadgets/), přidává `ScreenManager` po straně ScreenMenu/Options
   *  skupin. `pointerdown` MUSÍ zastavit propagaci – jinak by klik na
   *  gadget zároveň nastartoval drag (celá lišta je jinak drag-reveal
   *  povrch, viz konstruktor). `icon` je URL BINÁRNÍ bitmapy (Vite asset
   *  import) – kreslí se jako CSS maska, barvu dává background (stejný
   *  vzor jako gadgety oken, viz base_window.js#_gadget). */
  addGadget(role, icon, title, onClick) {
    const btn = document.createElement('button');
    btn.dataset.role = role;
    btn.title = title;
    btn.style.cssText = [
      'width:20px', 'height:16px', 'padding:0', 'border:none', 'flex:none',
      'cursor:pointer', 'background:var(--vb-screenbar-fg, #000)',
      `-webkit-mask:url("${icon}") center/100% 100% no-repeat`,
      `mask:url("${icon}") center/100% 100% no-repeat`,
    ].join(';');
    btn.addEventListener('pointerdown', (e) => e.stopPropagation());
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      onClick();
    });
    this.gadgetsEl.appendChild(btn);
    return btn;
  }

  /** Spec ze ScreenMenu (§8, backendem definované) – null/prázdné groups
   *  = žádné vlastní skupiny, jen vestavěné Options zůstane. */
  setSpec(spec) {
    this.remoteGroups = spec && Array.isArray(spec.groups) ? spec.groups : [];
    this._render();
  }

  /** Vestavěná Options skupina (§8a + window-first model §3a handoveru):
   *  položky určuje AKTIVNÍ OKNO na screenu (macOS menu bar model – „aktivní
   *  aplikace otvírá svoje menu na hlavní liště"), ne screen sám.
   *  `items`: [{ key, label, checked, onToggle(checked) }]; `null` = žádné
   *  okno s Options na screenu → skupina se úplně schová (rozhodnutí
   *  uživatele: prázdný screen nemá zašedlé tlačítko, nemá žádné). */
  setOptionsGroup(items) {
    this.optionsGroup = items ? { name: 'Options', items, local: true } : null;
    this._render();
  }

  /** Vestavěná skupina „System": příkazy workbenche samotného, nezávislé na
   *  aplikaci – dnes „Shell CLI", která si od serveru řekne o nové shell okno
   *  (event `shell_new`; PTY se stejně spustí až po odemykacím kódu z konzole
   *  serveru, viz plugins/shell.js). Volba je dostupná vždy, server ji může
   *  vypnout přes `config.shell_cli === false`. */
  setSystemGroup(enabled = true) {
    this.systemGroup = enabled ? {
      name: 'System',
      local: true,
      items: [{
        key: 'shell-cli',
        label: 'Shell CLI',
        command: true,                       // příkaz, ne přepínač (bez ✓)
        onToggle: () => this.sendEvent({ type: 'event', event: 'shell_new', payload: {} }),
      }],
    } : null;
    this._render();
  }

  /** Options je VŽDY první skupina zleva (uživatelská oprava), za ní
   *  vestavěný System a pak ScreenMenu skupiny (pokud nějaké jsou). */
  _allGroups() {
    return [
      ...(this.optionsGroup ? [this.optionsGroup] : []),
      ...(this.systemGroup ? [this.systemGroup] : []),
      ...this.remoteGroups,
    ];
  }

  _render() {
    this.groupsEl.replaceChildren();
    const groups = this._allGroups();
    for (const group of groups) {
      const btn = document.createElement('button');
      btn.dataset.role = 'vb-menu-group';
      btn.dataset.group = group.name;
      btn.textContent = group.name;
      const active = group.name === this.openGroup;
      btn.style.cssText = [
        'padding:4px 12px', 'border:none', 'cursor:pointer', 'font:inherit',
        active ? 'background:#3b7bc4;color:#fff'
          : 'background:transparent;color:inherit',   // barvu dává lišta (téma)
      ].join(';');
      // pointerdown MUSÍ zastavit propagaci – jinak klik na skupinu zároveň
      // nastartuje drag (viz addGadget výše, stejný důvod).
      btn.addEventListener('pointerdown', (e) => e.stopPropagation());
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._toggleGroup(group);
      });
      this.groupsEl.appendChild(btn);
    }
    // otevřený dropdown ukazuje živý stav (checkbox toggle nezavírá menu) –
    // po každém renderu baru dohledej aktuální otevřenou skupinu a překresli
    if (this.openGroup) {
      const group = groups.find((g) => g.name === this.openGroup);
      if (group) this._renderDropdown(group);
      else this._closeDropdown();
    }
  }

  _toggleGroup(group) {
    if (this.openGroup === group.name) {
      this._closeDropdown();
      return;
    }
    this.openGroup = group.name;
    this._render();
    this._renderDropdown(group);
  }

  _renderDropdown(group) {
    this.dropdown.replaceChildren();
    for (const item of group.items) {
      const row = document.createElement('div');
      row.dataset.role = 'vb-menu-item';
      row.style.cssText = [
        'padding:5px 16px', 'cursor:pointer', 'white-space:nowrap',
        'display:flex', 'align-items:center', 'justify-content:space-between',
        'gap:16px', 'color:#000',
      ].join(';');
      const label = document.createElement('span');
      label.textContent = item.label;
      row.appendChild(label);

      if (group.local) {
        row.dataset.itemKey = item.key;
        if (!item.command) {                 // příkaz (Shell CLI) checkbox nemá
          const check = document.createElement('span');
          check.dataset.role = 'vb-menu-checkbox';
          check.textContent = item.checked ? '✓' : '';
          check.style.cssText = 'width:1em;display:inline-block;font-weight:700';
          row.appendChild(check);
        }
        row.addEventListener('click', (e) => {
          e.stopPropagation();
          item.onToggle(!item.checked);
          // „zvolím, menu se zavře" (uživatelská oprava) – checkbox se
          // chová stejně jako příkaz, žádné čekání na klik mimo menu
          this._closeDropdown();
        });
      } else {
        row.dataset.itemId = item.id;
        row.addEventListener('click', (e) => {
          e.stopPropagation();
          this.sendEvent({ type: 'event', event: 'menu_select',
            payload: { item_id: item.id } });
          this._closeDropdown();
        });
      }
      row.addEventListener('pointerenter', () => {
        row.style.background = '#3b7bc4';
        row.style.color = '#fff';
      });
      row.addEventListener('pointerleave', () => {
        row.style.background = '';
        row.style.color = '#000';
      });
      this.dropdown.appendChild(row);
    }
    this.dropdown.style.display = 'block';
  }

  _closeDropdown() {
    if (this.openGroup === null) return;
    this.openGroup = null;
    this.dropdown.style.display = 'none';
    this._render();
  }

  destroy() {
    document.removeEventListener('pointerdown', this._onOutsideClick);
    this.el.remove();
  }
}

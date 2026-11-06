// Page viewer. #<page> opens a page, #<page>/<n> also selects item n. All content comes from pages.js.
(() => {
  const SITE = window.SITE, PAGES = SITE.pages;
  const NS = 'http://www.w3.org/2000/svg', SHOT_W = 1440, SHOT_H = 2825, R = 42;   // callout radius at 1440px, as on the sheets
  const $ = id => document.getElementById(id);
  const svg = $('svg'), panel = $('panel'), drawer = $('drawer'), backdrop = $('backdrop'), menuBtn = $('menu-btn'), search = $('search'), list = $('list');
  const tapsBtn = $('taps-btn'), ver = $('ver');
  const params = new URLSearchParams(location.search);
  if (params.has('slide')) document.body.classList.add('slide');
  if (params.has('outline')) svg.classList.add('outline');
  let id = null, page = null, selected = null;

  // ---------- helpers ----------
  function el(tag, attrs = {}, html) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function s(tag, attrs = {}) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
  }
  function shape(sh, cls) {
    if (sh.c) return s('circle', { cx: sh.c[0], cy: sh.c[1], r: sh.c[2], class: cls });
    if (sh.e) { const [x0, y0, x1, y1] = sh.e; return s('ellipse', { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, rx: (x1 - x0) / 2, ry: (y1 - y0) / 2, class: cls }); }
    if (sh.r) { const [x0, y0, x1, y1, rad = 0] = sh.r; return s('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rx: rad, class: cls }); }
    return s('polygon', { points: sh.p.map(p => p.join(',')).join(' '), class: cls });
  }
  function badge(t) { return el('span', { class: 'badge' }, t); }
  function dest(it) { return it.back ? page.parent : it.to; }   // the page an item opens, if any
  function trail(pid) { const t = []; for (let p = pid; p; p = PAGES[p].parent) t.unshift(p); return t; }
  function plain(html) { const d = document.createElement('div'); d.innerHTML = html || ''; return d.textContent; }
  function parseHash() {
    const [p, n] = decodeURIComponent(location.hash.slice(1)).split('/');
    return { pid: PAGES[p] ? p : SITE.start, n: n ? Number(n) : null };
  }

  // ---------- sizing: the screenshot always fits the window ----------
  function view() { return page.view || [0, 0, SHOT_W, SHOT_H]; }
  function size() {
    const [x0, y0, x1, y1] = view(), w = x1 - x0, h = y1 - y0;
    const hdr = document.querySelector('header').offsetHeight, phone = innerWidth <= 760;
    const availH = innerHeight - hdr - (phone ? 16 : 28);
    const availW = phone ? innerWidth : innerWidth - 32 - 20 - 300;
    const k = Math.min(availH / h, availW / w);
    svg.setAttribute('width', Math.floor(w * k)); svg.setAttribute('height', Math.floor(h * k));
  }
  addEventListener('resize', () => page && size());

  // ---------- screenshot ----------
  function renderShot() {
    svg.replaceChildren();
    const [x0, y0, x1, y1] = view();
    svg.setAttribute('viewBox', `${x0} ${y0} ${x1 - x0} ${y1 - y0}`);
    svg.setAttribute('aria-label', page.title + ' screenshot');
    // m-lit: everything dark except the lit shapes. m-spot: only the other items' shapes, to darken them while one is spotlighted
    const defs = s('defs'), all = s('mask', { id: 'm-lit' }), spot = s('mask', { id: 'm-spot' });
    all.append(s('rect', { x: 0, y: 0, width: SHOT_W, height: SHOT_H, fill: '#fff' }));
    const fill = (sh, c) => { const k = shape(sh, ''); k.setAttribute('fill', c); return k; };
    for (const sh of page.lit || []) all.append(fill(sh, '#000'));
    for (const t of page.taps || []) { all.append(fill(t.shape, '#000')); spot.append(fill(t.shape, '#fff')); }   // unnumbered buttons are lit too
    for (const it of page.items) for (const sh of it.lit) { all.append(fill(sh, '#000')); spot.append(fill(sh, '#fff')); }
    for (const it of page.items) for (const sh of it.lit) {   // drawn last, so a spotlighted item is never covered by a neighbor
      const k = fill(sh, '#000'); k.setAttribute('data-n', it.n); k.style.display = 'none'; spot.append(k);
    }
    defs.append(all, spot); svg.append(defs);
    svg.append(s('image', { href: page.shot, x: 0, y: 0, width: SHOT_W, height: SHOT_H }));
    svg.append(s('rect', { x: 0, y: 0, width: SHOT_W, height: SHOT_H, class: 'dim', mask: 'url(#m-lit)' }));
    const sp = s('rect', { x: 0, y: 0, width: SHOT_W, height: SHOT_H, class: 'dim spot', mask: 'url(#m-spot)', id: 'spot' });
    sp.style.opacity = 0; svg.append(sp);

    // tap areas: every explained element (opens its page, or selects its explanation), then close/back buttons
    // largest first, so a small element sitting on a big one (Shortcut on Quest) stays tappable
    const area = sh => sh.c ? Math.PI * sh.c[2] ** 2 : sh.e ? (sh.e[2] - sh.e[0]) * (sh.e[3] - sh.e[1]) * .785
      : sh.r ? (sh.r[2] - sh.r[0]) * (sh.r[3] - sh.r[1])
      : Math.abs(sh.p.reduce((s, [x, y], i) => { const [u, v] = sh.p[(i + 1) % sh.p.length]; return s + x * v - u * y; }, 0)) / 2;
    // an item's lit area opens its page, or selects it when it has none (or when only its tap area opens the page)
    const taps = [];
    for (const it of page.items) {
      const opens = dest(it) && !it.tap;
      taps.push({ shapes: it.lit, to: opens ? dest(it) : null, it });
      if (it.to && it.tap) taps.push({ shapes: [it.tap], to: it.to, it });
    }
    taps.sort((a, b) => Math.max(...b.shapes.map(area)) - Math.max(...a.shapes.map(area)));
    for (const tp of taps) {
      const a = s('a', { href: tp.to ? '#' + tp.to : `#${id}/${tp.it.n}`, 'aria-label': tp.to ? 'Open ' + PAGES[tp.to].title : tp.it.name });
      for (const sh of tp.shapes) a.append(shape(sh, 'tap' + (tp.to ? ' link' : '')));
      if (!tp.to) a.addEventListener('click', ev => { ev.preventDefault(); select(tp.it.n, true); });
      svg.append(a);
    }
    for (const t of page.taps || []) {
      const to = t.back ? page.parent : t.to;
      const a = s('a', { href: '#' + to, 'aria-label': t.label + ' (' + PAGES[to].title + ')' });
      a.append(shape(t.shape, 'tap link'));
      svg.append(a);
    }
    for (const m of page.marks || []) {
      const g = s('g', { class: 'bmark' });
      g.append(s('rect', { x: m.at[0] - R, y: m.at[1] - R, width: 2 * R, height: 2 * R, rx: 14 }));
      const t = s('text', { x: m.at[0], y: m.at[1], 'font-size': 50 }); t.textContent = m.badge; g.append(t);
      svg.append(g);
    }
    for (const it of page.items) {
      const g = s('g', { class: 'num', 'data-n': it.n, role: 'button', 'aria-label': `${it.n}. ${it.name}` });
      g.append(s('circle', { cx: it.at[0], cy: it.at[1], r: R }));
      const t = s('text', { x: it.at[0], y: it.at[1] + 2, 'font-size': String(it.n).length > 1 ? 48 : 56 }); t.textContent = it.n; g.append(t);
      g.addEventListener('click', () => select(it.n, true));
      svg.append(g);
    }
    svg.classList.remove('hint'); void svg.getBoundingClientRect(); svg.classList.add('hint');
  }

  // ---------- explanations ----------
  function renderPanel() {
    panel.replaceChildren();
    if (page.intro) panel.append(el('p', { class: 'intro' }, page.intro));
    for (const it of page.items) {
      const a = el('article', { class: 'item', id: 'i-' + it.n, tabindex: 0 });
      const h = el('h2', {}, it.name);
      if (it.to) h.append(el('a', { class: 'open', href: '#' + it.to, 'aria-label': 'Open ' + PAGES[it.to].title }, 'Open'));
      a.append(el('span', { class: 'n' }, String(it.n)), h);
      if (it.text) a.append(el('p', {}, it.text));
      a.addEventListener('click', ev => { if (!ev.target.closest('a')) select(it.n, false); });
      a.addEventListener('keydown', ev => { if (ev.key === 'Enter' && !ev.target.closest('a')) select(it.n, false); });
      a.addEventListener('mouseenter', () => spotlight(it.n));
      a.addEventListener('mouseleave', () => spotlight(selected));
      panel.append(a);
    }
    if (page.note) panel.append(el('p', { class: 'note' }, page.note));
  }

  // spotlight: darken every explained element except item n (n = null: everything lit)
  function spotlight(n) {
    svg.querySelectorAll('#m-spot [data-n]').forEach(k => { k.style.display = String(n) === k.dataset.n ? '' : 'none'; });
    const sp = $('spot'); if (sp) sp.style.opacity = n ? .82 : 0;
    svg.querySelectorAll('.num').forEach(g => g.classList.toggle('on', String(n) === g.dataset.n));
  }
  function select(n, scrollPanel) {
    selected = page.items.some(it => it.n === n) ? n : null;
    spotlight(selected);
    panel.querySelectorAll('.item').forEach(a => a.classList.toggle('on', a.id === 'i-' + selected));
    history.replaceState(null, '', selected ? `#${id}/${selected}` : '#' + id);
    const it = page.items.find(x => x.n === selected);
    document.title = (it ? `${it.n}. ${it.name} · ` : '') + `${page.title} · ${SITE.title}`;
    if (selected && scrollPanel) $('i-' + selected).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderCrumbs() {
    const nav = $('crumbs'); nav.replaceChildren();
    trail(id).forEach((p, i, all) => {
      if (i) nav.append(el('span', { class: 'sep', 'aria-hidden': 'true' }, '›'));
      const here = i === all.length - 1;
      const item = here ? el('span', { class: 'here', 'aria-current': 'page' }) : el('a', { href: '#' + p });
      if (PAGES[p].badge) item.append(badge(PAGES[p].badge));
      item.append(document.createTextNode(PAGES[p].title));
      nav.append(item);
    });
  }

  function open(pid, n) {
    if (pid !== id) {
      id = pid; page = PAGES[pid]; selected = null;
      ver.textContent = page.ver ? 'Ver. ' + page.ver : '';
      renderCrumbs(); renderShot(); renderPanel(); size(); renderList();
      if (document.body.classList.contains('slide')) fitSlide();
      scrollTo(0, 0);
    }
    select(n, true);
  }

  // slide capture: a long panel flows into two columns so the whole page fits one slide
  function fitSlide() {
    panel.classList.remove('cols2');
    if (panel.getBoundingClientRect().bottom > innerHeight - 12) panel.classList.add('cols2');
  }

  // ---------- drawer ----------
  function pageLink(p) {
    const a = el('a', { href: '#' + p });
    a.style.paddingLeft = (8 + 18 * (trail(p).length - 1)) + 'px';
    if (PAGES[p].badge) a.append(badge(PAGES[p].badge));
    a.append(el('span', {}, PAGES[p].title));
    if (p === id) a.className = 'current';
    return a;
  }
  function itemLink(p, it, hit) {
    const a = el('a', { href: `#${p}/${it.n}`, class: hit ? 'hit' : '' });
    a.append(el('span', { class: 'n' }, String(it.n)), el('span', {}, it.name));
    if (hit) a.append(el('span', { class: 'where' }, PAGES[p].title));
    return a;
  }
  function renderList() {
    list.replaceChildren();
    const q = search.value.trim().toLowerCase();
    if (q) {
      let hits = 0;
      for (const p of SITE.menu) {
        if (PAGES[p].title.toLowerCase().includes(q)) { list.append(pageLink(p)); hits++; }
        for (const it of PAGES[p].items) if ((it.name + ' ' + plain(it.text)).toLowerCase().includes(q)) { list.append(itemLink(p, it, true)); hits++; }
      }
      if (!hits) list.append(el('p', { class: 'none' }, 'Nothing matches.'));
      return;
    }
    for (const p of SITE.menu) {
      list.append(pageLink(p));
      if (p === id) {
        const box = el('div', { class: 'sub' });
        for (const it of PAGES[p].items) { const a = itemLink(p, it, false); a.style.paddingLeft = (26 + 18 * (trail(p).length - 1)) + 'px'; box.append(a); }
        list.append(box);
      }
    }
  }
  function setDrawer(on) {
    drawer.hidden = !on; backdrop.hidden = !on; menuBtn.setAttribute('aria-expanded', String(on));
    if (on) { renderList(); search.focus(); } else menuBtn.focus({ preventScroll: true });
  }
  menuBtn.addEventListener('click', () => setDrawer(drawer.hidden));
  backdrop.addEventListener('click', () => setDrawer(false));
  addEventListener('keydown', ev => { if (ev.key === 'Escape' && !drawer.hidden) setDrawer(false); });
  search.addEventListener('input', renderList);
  list.addEventListener('click', ev => { if (ev.target.closest('a')) setDrawer(false); });

  // show / hide every tap area that opens another page (remembered in this browser when it can be)
  function setTaps(on) {
    svg.classList.toggle('showtaps', on);
    tapsBtn.setAttribute('aria-pressed', String(on));
    tapsBtn.textContent = on ? 'Hide tap areas' : 'Show tap areas';
    try { localStorage.setItem('showtaps', on ? '1' : ''); } catch (e) {}
  }
  let tapsOn = false; try { tapsOn = localStorage.getItem('showtaps') === '1'; } catch (e) {}
  setTaps(tapsOn && !document.body.classList.contains('slide'));
  tapsBtn.addEventListener('click', () => setTaps(tapsBtn.getAttribute('aria-pressed') !== 'true'));

  // tapping anywhere that isn't an element, a number or an explanation clears the selection
  document.addEventListener('click', ev => {
    if (selected && !ev.target.closest('a, .num, .item, header, #drawer')) select(null, false);
  });

  // ---------- routing ----------
  function route() { const { pid, n } = parseHash(); open(pid, n); }
  addEventListener('hashchange', route);
  route();
})();

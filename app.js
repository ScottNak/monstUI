// Sheet viewer. Addresses: #<SheetId> opens a sheet, #<SheetId>/<n> also highlights callout n.
// Everything comes from data.js (built by tools/build.py); coordinates there are sheet pixels.
(() => {
  const SITE = window.SITE, SHEETS = SITE.sheets;
  const $ = id => document.getElementById(id);
  const view = $('view'), stage = $('stage'), img = $('sheet'), svg = $('hot'), loading = $('loading');
  const drawer = $('drawer'), backdrop = $('backdrop'), menuBtn = $('menu-btn'), search = $('search'), list = $('list');
  const NS = 'http://www.w3.org/2000/svg';
  let current = null;

  // ---------- helpers ----------
  function badge(b) {
    const s = document.createElement('span');
    s.className = 'badge ' + (/^[A-Z]$/.test(b) ? 'up' : /^[a-z]$/.test(b) ? 'low' : 'kana');
    const inner = document.createElement('span'); inner.textContent = b; s.append(inner);
    return s;
  }
  function el(tag, attrs = {}, text) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (text != null) e.textContent = text;
    return e;
  }
  function svgEl(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
  }
  function parseHash() {
    const [id, n] = decodeURIComponent(location.hash.slice(1)).split('/');
    return { id: SHEETS[id] ? id : SITE.start, n: n ? Number(n) : null };
  }
  function ownBadge(s) { const c = s.crumbs.find(([, to]) => to === s.id); return c ? c[0] : null; }

  // ---------- zoom ----------
  function isFull() { return view.classList.contains('full'); }
  function scale() { return stage.clientWidth / current.w; }
  function setFull(on, ev) {
    let fx = 0.5, fy = 0;
    if (ev) { const r = stage.getBoundingClientRect(); fx = (ev.clientX - r.left) / r.width; fy = (ev.clientY - r.top) / r.height; }
    else { fx = (view.scrollLeft + view.clientWidth / 2) / stage.clientWidth; fy = (view.scrollTop + view.clientHeight / 2) / stage.clientHeight; }
    view.classList.toggle('full', on);
    $('fit').setAttribute('aria-pressed', String(!on)); $('full').setAttribute('aria-pressed', String(on));
    view.scrollLeft = fx * stage.clientWidth - view.clientWidth / 2;
    view.scrollTop = fy * stage.clientHeight - view.clientHeight / 2;
  }
  $('fit').addEventListener('click', () => setFull(false));
  $('full').addEventListener('click', () => setFull(true));
  svg.addEventListener('click', ev => { if (ev.target === svg) setFull(!isFull(), ev); });

  // ---------- scrolling ----------
  function scrollToPoint(x, y) {
    const k = scale();
    view.scrollTo({ left: x * k - view.clientWidth / 2, top: y * k - view.clientHeight / 2, behavior: 'smooth' });
  }
  function scrollToSpan([x0, y0, x1]) {          // bring sheet x0..x1 into view with y0 near the top
    const k = scale(), span = (x1 - x0) * k;
    const left = span <= view.clientWidth ? (x0 + x1) / 2 * k - view.clientWidth / 2 : x0 * k;
    view.scrollTo({ left, top: y0 * k - 12, behavior: 'smooth' });
  }

  // ---------- sheet ----------
  function renderCrumbs(s) {
    const nav = $('crumbs'); nav.replaceChildren();
    const trail = s.crumbs.length ? s.crumbs : [[null, s.id]];
    trail.forEach(([b, to], i) => {
      if (i) nav.append(el('span', { class: 'sep', 'aria-hidden': 'true' }, '›'));
      const here = to === s.id;
      const item = here ? el('span', { class: 'here', 'aria-current': 'page' }) : el('a', { href: '#' + to });
      if (b) item.append(badge(b));
      item.append(el('span', { class: 't' }, SHEETS[to].title));
      nav.append(item);
    });
  }

  function renderHotspots(s) {
    svg.replaceChildren();
    svg.setAttribute('viewBox', `0 0 ${s.w} ${s.h}`);
    for (const l of s.links) {
      const a = svgEl('a', { href: l.to ? '#' + l.to : '#', 'aria-label': l.to ? 'Open ' + SHEETS[l.to].title : l.what });
      const shape = l.circle
        ? svgEl('circle', { cx: l.circle[0], cy: l.circle[1], r: l.circle[2], class: 'hot' })
        : svgEl('rect', { x: l.rect[0], y: l.rect[1], width: l.rect[2] - l.rect[0], height: l.rect[3] - l.rect[1], rx: 12, class: 'hot' });
      a.append(shape);
      if (l.at) a.addEventListener('click', ev => { ev.preventDefault(); scrollToSpan(l.at); });
      svg.append(a);
    }
    for (const e of s.entries) {
      for (const p of e.spots) {
        const a = svgEl('a', { href: `#${s.id}/${e.n}`, 'aria-label': `${e.n}. ${e.name}` });
        a.append(svgEl('circle', { cx: p.x, cy: p.y, r: p.r + 10, class: 'mark', 'data-n': e.n }));
        a.addEventListener('click', ev => { ev.preventDefault(); history.replaceState(null, '', `#${s.id}/${e.n}`); highlight(e.n, false); });
        svg.append(a);
      }
    }
    svg.classList.remove('hint'); void svg.getBoundingClientRect(); svg.classList.add('hint');
  }

  function highlight(n, scroll) {
    svg.querySelectorAll('.mark.on').forEach(m => m.classList.remove('on'));
    const e = n && current.entries.find(x => x.n === n);
    if (!e) return;
    svg.querySelectorAll(`.mark[data-n="${n}"]`).forEach(m => m.classList.add('on'));
    if (scroll) scrollToPoint(e.spots[0].x, e.spots[0].y);
    document.title = `${e.n}. ${e.name} · ${current.title} · ${SITE.title}`;
  }

  function open(id, n) {
    const s = SHEETS[id];
    if (current !== s) {
      current = s;
      document.title = `${s.title} · ${SITE.title}`;
      renderCrumbs(s);
      img.alt = s.title + ' reference sheet';
      stage.style.maxWidth = s.w + 'px';
      stage.style.aspectRatio = `${s.w} / ${s.h}`;
      loading.hidden = false; img.style.visibility = 'hidden';
      img.onload = () => { loading.hidden = true; img.style.visibility = ''; highlight(n, true); };
      img.src = s.file;
      renderHotspots(s);
      view.scrollTo(0, 0);
      renderList();
      if (img.complete && img.naturalWidth) img.onload();
      return;
    }
    highlight(n, true);
    if (!n) document.title = `${s.title} · ${SITE.title}`;
  }

  // ---------- drawer ----------
  function sheetLink(s) {
    const a = el('a', { href: '#' + s.id });
    const b = ownBadge(s); if (b) a.append(badge(b));
    a.append(el('span', {}, s.title));
    if (s === current) a.className = 'current';
    return a;
  }
  function entryLink(s, e, showSheet) {
    const a = el('a', { href: `#${s.id}/${e.n}` });
    a.append(el('span', { class: 'n' }, String(e.n)), el('span', {}, e.name));
    if (showSheet) a.append(el('span', { class: 'where' }, s.title));
    return a;
  }
  function renderList() {
    list.replaceChildren();
    const q = search.value.trim().toLowerCase();
    if (q) {
      let hits = 0;
      for (const g of SITE.groups) for (const id of g.sheets) {
        const s = SHEETS[id];
        if (s.title.toLowerCase().includes(q)) { list.append(sheetLink(s)); hits++; }
        for (const e of s.entries) if (e.name.toLowerCase().includes(q)) {
          const a = entryLink(s, e, true); a.style.paddingLeft = '8px'; list.append(a); hits++;
        }
      }
      if (!hits) list.append(el('p', { class: 'none' }, 'Nothing matches.'));
      return;
    }
    for (const g of SITE.groups) {
      const h = el('h2'); if (g.badge) h.append(badge(g.badge)); h.append(el('span', {}, g.label));
      list.append(h);
      for (const id of g.sheets) {
        const s = SHEETS[id];
        list.append(sheetLink(s));
        if (s === current && s.entries.length) {
          const box = el('div', { class: 'entries' });
          for (const e of s.entries) box.append(entryLink(s, e, false));
          list.append(box);
        }
      }
    }
  }
  function setDrawer(on) {
    drawer.hidden = !on; backdrop.hidden = !on; menuBtn.setAttribute('aria-expanded', String(on));
    if (on) { renderList(); search.focus(); } else menuBtn.focus({ preventScroll: true });
  }
  menuBtn.addEventListener('click', () => setDrawer(drawer.hidden));
  backdrop.addEventListener('click', () => setDrawer(false));
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && !drawer.hidden) setDrawer(false); });
  search.addEventListener('input', renderList);
  list.addEventListener('click', ev => { if (ev.target.closest('a')) setDrawer(false); });

  // ---------- routing ----------
  function route() { const { id, n } = parseHash(); open(id, n); }
  window.addEventListener('hashchange', route);
  route();
})();

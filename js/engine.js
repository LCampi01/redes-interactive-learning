/* ============================================================
   Motor de escenas · Redes interactivo
   Cada lección describe "escenas" (topo, seq, fields, bits, chart, stack)
   y cada paso dice qué mostrar de la escena. Ver GUIA-LECCIONES.md.
   ============================================================ */
(function () {
'use strict';

const W = 800, H = 440, HOLD = 1.9;
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const tw = (s, fs) => String(s == null ? '' : s).length * fs * 0.61;
const f1 = n => (Math.round(n * 10) / 10);
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
let UID = 0;
// Traducción de textos fijos de la interfaz (diccionario en js/i18n/ui-en.js)
function T(s, vars) {
  let o = (COURSE.lang !== 'es' && window.UI_EN && Object.prototype.hasOwnProperty.call(window.UI_EN, s)) ? window.UI_EN[s] : s;
  if (vars) o = o.replace(/\{(\w+)\}/g, (m, k) => vars[k] != null ? vars[k] : m);
  return o;
}

const ICONS = {
  pc: 'M3 4.5h18v11.5H3z M8.5 20h7 M12 16v4',
  server: 'M4 4h16v6.5H4z M4 13.5h16V20H4z M7.5 7.2h.01 M7.5 16.8h.01 M11 7.2h5 M11 16.8h5',
  switch: 'M2.5 7.5h19v9h-19z M6 10.5h5 M9 8.8l2 1.7-2 1.7 M18 13.5h-5 M15 11.8l-2 1.7 2 1.7',
  hub: 'M2.5 8.5h19v7h-19z M6.5 12h.01 M10.2 12h.01 M13.8 12h.01 M17.5 12h.01',
  bridge: 'M2.5 16h19 M5 16V8.5 M19 16V8.5 M5 8.5c3.2 4.2 10.8 4.2 14 0 M9 16v-4.2 M15 16v-4.2 M12 16v-3.4',
  router: 'M12 3a9 9 0 100 18 9 9 0 000-18z M12 6.5v11 M6.5 12h11 M12 6.5l-1.8 1.8 M12 6.5l1.8 1.8 M12 17.5l-1.8-1.8 M12 17.5l1.8-1.8 M6.5 12l1.8-1.8 M6.5 12l1.8 1.8 M17.5 12l-1.8-1.8 M17.5 12l-1.8 1.8',
  ap: 'M12 19.5h.01 M8.6 16a5 5 0 016.8 0 M5.6 12.8a9.2 9.2 0 0112.8 0 M2.8 9.6a13.2 13.2 0 0118.4 0',
  cloud: 'M7 18.5a4.2 4.2 0 01-.6-8.3 5.6 5.6 0 0110.8-1.3 4.6 4.6 0 01.4 9.6z',
  dns: 'M12 3a9 9 0 100 18 9 9 0 000-18z M3 12h18 M12 3c3.2 3 3.2 15 0 18 M12 3c-3.2 3-3.2 15 0 18',
  db: 'M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3z M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6 M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3',
  fw: 'M3 5h18v14H3z M3 9.7h18 M3 14.3h18 M9 5v4.7 M15 5v4.7 M6 9.7v4.6 M12 9.7v4.6 M18 9.7v4.6 M9 14.3V19 M15 14.3V19',
  phone: 'M7.5 2.5h9v19h-9z M11 18.5h2',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8z M4 21c.8-4 3.8-6 8-6s7.2 2 8 6',
  lock: 'M6 11h12v9.5H6z M8.8 11V8a3.2 3.2 0 016.4 0v3 M12 14.5v2.5',
  doc: 'M6 3h8.5L19 7.5V21H6z M14.5 3v4.5H19 M9 12.5h7 M9 16.5h7',
  key: 'M8 15a4 4 0 100-8 4 4 0 000 8z M11.5 11H21 M17 11v3.5 M20 11v2.5',
  printer: 'M7 8V3.5h10V8 M4 8h16v9h-3 M7 17H4 M7 13.5h10V21H7z',
  tel: 'M5 4h4l1.5 4.5-2 1.5a12 12 0 005.5 5.5l1.5-2L20 15v4a1.5 1.5 0 01-1.5 1.5C10.5 20.5 3.5 13.5 3.5 5.5A1.5 1.5 0 015 4z'
};
// tipo -> [color por defecto, ícono]
const TYPES = {
  pc: ['white', 'pc'], server: ['blue', 'server'], switch: ['green', 'switch'], hub: ['gray', 'hub'],
  bridge: ['orange', 'bridge'], router: ['yellow', 'router'], ap: ['purple', 'ap'], cloud: ['white', 'cloud'],
  dns: ['yellow', 'dns'], db: ['purple', 'db'], fw: ['red', 'fw'], phone: ['white', 'phone'], user: ['white', 'user'],
  lock: ['yellow', 'lock'], doc: ['white', 'doc'], key: ['yellow', 'key'], printer: ['gray', 'printer'], tel: ['white', 'tel']
};
const SPECIAL = { bus: 1, state: 1, box: 1, txt: 1, dot: 1 };

function icon(name, x, y, size) {
  const d = ICONS[name] || ICONS.pc;
  return `<path class="ico" d="${d}" transform="translate(${f1(x - size / 2)},${f1(y - size / 2)}) scale(${size / 24})"/>`;
}
function mtext(txt, x, y, cls, lh, anchor) {
  const ls = String(txt == null ? '' : txt).split('\n');
  const y0 = y - (ls.length - 1) * lh / 2;
  return `<text class="${cls}" x="${f1(x)}" y="${f1(y0)}" text-anchor="${anchor || 'middle'}">` +
    ls.map((l, i) => `<tspan x="${f1(x)}" dy="${i ? lh : 0}">${esc(l)}</tspan>`).join('') + '</text>';
}
function arrowHead(x, y, ang, cls) {
  return `<path class="ah ${cls || ''}" d="M0 0L-10 -4.6L-10 4.6Z" transform="translate(${f1(x)},${f1(y)}) rotate(${f1(ang * 180 / Math.PI)})"/>`;
}
function fo(x, y, w, html, cls) {
  return `<foreignObject x="${x}" y="${y}" width="${w}" height="${H}" class="fo"><div xmlns="http://www.w3.org/1999/xhtml" class="${cls}">${html}</div></foreignObject>`;
}

/* ---------------- geometría ---------------- */
function half(n) {
  const t = n.t || 'pc';
  if (t === 'state') return [(n.w || tw(n.l, 11) + 26) / 2, (n.h || 28) / 2];
  if (t === 'box') return [(n.w || 120) / 2, (n.h || 40) / 2];
  if (t === 'txt' || t === 'dot' || t === 'bus') return [0, 0];
  return [29, 26];
}
function center(n) { return n.t === 'bus' ? { x: n.x + n.w / 2, y: n.y } : { x: n.x, y: n.y }; }
function trim(n, toward, pad) {
  const [hw, hh] = half(n); const c = center(n);
  if (!hw) return c;
  const dx = toward.x - c.x, dy = toward.y - c.y;
  if (!dx && !dy) return c;
  const k = Math.min(dx ? (hw + pad) / Math.abs(dx) : 1e9, dy ? (hh + pad) / Math.abs(dy) : 1e9);
  return { x: c.x + dx * Math.min(k, 1), y: c.y + dy * Math.min(k, 1) };
}
function linkGeom(sc, l) {
  const A = sc._n[l.a], B = sc._n[l.b];
  let a = center(A), b = center(B);
  const cl = (bus, x) => Math.max(bus.x, Math.min(bus.x + bus.w, x));
  if (A.t === 'bus') a = { x: cl(A, B.x), y: A.y };
  if (B.t === 'bus') b = { x: cl(B, A.x), y: B.y };
  let ctrl = null;
  if (l.curve) {
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
    ctrl = { x: mx - dy / len * l.curve, y: my + dx / len * l.curve };
  }
  const needTrim = l.arrow || SPECIAL[A.t] || SPECIAL[B.t];
  if (needTrim) {
    if (A.t !== 'bus') a = trim(A, ctrl || b, 2);
    if (B.t !== 'bus') b = trim(B, ctrl || a, l.arrow ? 4 : 2);
  }
  const mid = ctrl ? { x: (a.x + 2 * ctrl.x + b.x) / 4, y: (a.y + 2 * ctrl.y + b.y) / 4 } : { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const d = ctrl ? `M${f1(a.x)} ${f1(a.y)}Q${f1(ctrl.x)} ${f1(ctrl.y)} ${f1(b.x)} ${f1(b.y)}` : `M${f1(a.x)} ${f1(a.y)}L${f1(b.x)} ${f1(b.y)}`;
  const from = ctrl || a;
  return { a, b, ctrl, mid, d, ang: Math.atan2(b.y - from.y, b.x - from.x) };
}
function findLink(sc, x, y) {
  return (sc.links || []).find(l => (l.a === x && l.b === y) || (l.a === y && l.b === x));
}
function pathPts(sc, p) {
  const N = sc._n;
  const raw = p.map(e => Array.isArray(e) ? { x: e[0], y: e[1] } : N[e]).filter(Boolean);
  const out = [];
  const push = q => { const l = out[out.length - 1]; if (!l || Math.abs(l.x - q.x) > .5 || Math.abs(l.y - q.y) > .5) out.push(q); };
  raw.forEach((e, i) => {
    if (e.t === 'bus') {
      const prev = raw[i - 1], next = raw[i + 1], cl = x => Math.max(e.x, Math.min(e.x + e.w, x));
      if (prev && prev.t !== 'bus') push({ x: cl(prev.x), y: e.y });
      if (next && next.t !== 'bus') push({ x: cl(next.x), y: e.y });
      if (!prev && !next) push({ x: e.x + e.w / 2, y: e.y });
      return;
    }
    const prev = raw[i - 1];
    if (prev && prev.id && e.id) {
      const l = findLink(sc, prev.id, e.id);
      if (l && l.curve) {
        const g = linkGeom(sc, l), fwd = l.a === prev.id;
        for (let k = 1; k <= 12; k++) {
          const t = fwd ? k / 12 : 1 - k / 12, u = 1 - t;
          const c0 = center(sc._n[l.a]), c1 = center(sc._n[l.b]);
          push({ x: u * u * c0.x + 2 * u * t * g.ctrl.x + t * t * c1.x, y: u * u * c0.y + 2 * u * t * g.ctrl.y + t * t * c1.y });
        }
        return;
      }
    }
    push({ x: e.x, y: e.y });
  });
  return out;
}
function polyLen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); return L; }
function polyAt(pts, L, t) {
  let d = t * L;
  for (let i = 1; i < pts.length; i++) {
    const s = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    if (d <= s || i === pts.length - 1) { const k = s ? Math.min(d / s, 1) : 0; return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * k, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * k }; }
    d -= s;
  }
  return pts[0];
}
function allIds(sc) { return sc.nodes.map(n => n.id).concat((sc.zones || []).filter(z => z.id).map(z => z.id)); }

/* ---------------- nodos ---------------- */
function nodeSVG(n, cls) {
  const t = n.t || 'pc';
  if (t === 'dot') return '';
  if (t === 'bus') {
    return `<g class="nd bus ${cls}"><line class="busl" x1="${n.x}" y1="${n.y}" x2="${n.x + n.w}" y2="${n.y}"/>` +
      `<circle class="buscap" cx="${n.x}" cy="${n.y}" r="5"/><circle class="buscap" cx="${n.x + n.w}" cy="${n.y}" r="5"/>` +
      (n.l ? `<text class="lkl" x="${n.x + 4}" y="${n.y - 12}" text-anchor="start">${esc(n.l)}</text>` : '') + '</g>';
  }
  if (t === 'txt') return `<g class="nd ${cls}">${mtext(n.l, n.x, n.y, 'ntxt' + (n.c ? ' tc-' + n.c : '') + (n.big ? ' big' : ''), n.big ? 20 : 14, n.anchor)}</g>`;
  if (t === 'state' || t === 'box') {
    const [hw, hh] = half(n);
    return `<g class="nd ${t} c-${n.c || 'white'} ${cls}"><rect class="depth" x="${f1(n.x - hw)}" y="${f1(n.y - hh + 4)}" width="${f1(hw * 2)}" height="${f1(hh * 2)}" rx="${t === 'state' ? hh : 8}"/>` +
      `<rect class="face" x="${f1(n.x - hw)}" y="${f1(n.y - hh)}" width="${f1(hw * 2)}" height="${f1(hh * 2)}" rx="${t === 'state' ? hh : 8}"/>` +
      mtext(n.l, n.x, n.y + 4 - (n.sub ? 6 : 0), 'nlbl in', 13) +
      (n.sub ? mtext(n.sub, n.x, n.y + 12, 'nsub', 11) : '') + '</g>';
  }
  const T = TYPES[t] || TYPES.pc, c = n.c || T[0];
  return `<g class="nd card c-${c} ${cls}">` +
    `<rect class="depth" x="${n.x - 27}" y="${n.y - 18}" width="54" height="46" rx="11"/>` +
    `<rect class="face" x="${n.x - 27}" y="${n.y - 24}" width="54" height="46" rx="11"/>` +
    icon(n.icon || T[1], n.x, n.y - 1, 28) +
    (n.l ? mtext(n.l, n.x, n.y + 43, 'nlbl', 12) : '') +
    (n.sub ? mtext(n.sub, n.x, n.y + 43 + 12 * String(n.l || '').split('\n').length, 'nsub', 11) : '') +
    (cls.indexOf('off') >= 0 ? `<path class="offx" d="M${n.x - 16} ${n.y - 17}l32 32m0 -32l-32 32"/>` : '') + '</g>';
}

/* ---------------- TOPO ---------------- */
function renderTopo(sc, s, ctx) {
  const N = sc._n;
  const vis = new Set(s._show || allIds(sc)); (s.hide || []).forEach(i => vis.delete(i));
  const hi = new Set(s.hi || []), dim = new Set(s.dim || []), xx = new Set(s.x || []);
  const prev = s._prevShow ? new Set(s._prevShow) : null;
  const neu = id => (!ctx.static && prev && !prev.has(id)) ? ' enter' : '';
  let o = '';
  (sc.zones || []).forEach(z => {
    if (z.id && !vis.has(z.id)) return;
    o += `<g class="zone c-${z.c || 'gray'}${z.id ? neu(z.id) : ''}${hi.has(z.id) ? ' hi' : ''}${dim.has(z.id) ? ' dim' : ''}"><rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="16"/>` +
      (z.l ? `<text x="${z.x + 12}" y="${z.y + 18}">${esc(z.l)}</text>` : '') + '</g>';
  });
  (sc.links || []).forEach(l => {
    const id = l.id || l.a + '-' + l.b;
    if (!N[l.a] || !N[l.b] || !vis.has(l.a) || !vis.has(l.b) || (s.hide || []).indexOf(id) >= 0) return;
    const g = linkGeom(sc, l), blocked = xx.has(id);
    const cls = ['lk', l.dash ? 'dash' : '', l.wl ? 'wl' : '', l.thick ? 'thick' : '', l.c ? 'c-' + l.c + ' col' : '', hi.has(id) ? 'hi' : '', dim.has(id) ? 'dim' : '', blocked ? 'x' : '',
      (!ctx.static && prev && (!prev.has(l.a) || !prev.has(l.b))) ? 'enter' : ''].join(' ');
    const lab = (s.ll && s.ll[id] != null) ? s.ll[id] : l.l;
    o += `<g class="${cls}"><path d="${g.d}"/>` + (l.arrow ? arrowHead(g.b.x, g.b.y, g.ang) : '') +
      (blocked ? `<g class="blk" transform="translate(${f1(g.mid.x)},${f1(g.mid.y)})"><circle r="9"/><path d="M-4.5 -4.5L4.5 4.5M4.5 -4.5L-4.5 4.5"/></g>` : '') +
      (lab ? mtext(lab, g.mid.x + (l.lx || 0), g.mid.y - 8 + (l.ly || 0), 'lkl', 11) : '') + '</g>';
  });
  sc.nodes.forEach(n => {
    if (!vis.has(n.id)) return;
    o += nodeSVG(n, (hi.has(n.id) ? 'hi ' : '') + (dim.has(n.id) ? 'dim ' : '') + (xx.has(n.id) ? 'off ' : '') + neu(n.id));
  });
  Object.keys(s.tags || {}).forEach(id => {
    const n = N[id]; if (!n || !vis.has(id)) return;
    const c = center(n), [, hh] = half(n), txt = s.tags[id], w = tw(txt, 10) + 14, y = c.y - (hh || 10) - 22;
    o += `<g class="tag"><rect x="${f1(c.x - w / 2)}" y="${f1(y - 9)}" width="${f1(w)}" height="18" rx="9"/><text x="${f1(c.x)}" y="${f1(y + 3.5)}" text-anchor="middle">${esc(txt)}</text></g>`;
  });
  // efectos
  (s.fx || []).forEach((f, i) => {
    const id = 'fx' + ctx.uid + '_' + i, t = f.t || 0;
    if (f.k === 'wave') {
      const n = N[f.at]; if (!n) return; const c = center(n), R = f.r || 150, cnt = f.n || 2, d = f.d || 1.5;
      for (let k = 0; k < cnt; k++) {
        o += `<circle class="wave c-${f.c || 'ctl'}" id="${id}_${k}" cx="${c.x}" cy="${c.y}" r="0" style="opacity:0"/>`;
        ctx.binders.push(root => { const el = root.querySelector('#' + id + '_' + k); return { t: t + k * .4, d, sp: .6 - k * .25, fn(q) { if (q <= 0 || q >= 1) { el.style.opacity = 0; return; } el.setAttribute('r', f1(q * R)); el.style.opacity = f1((1 - q) * 1.2); } }; });
      }
    } else if (f.k === 'sig') {
      const bus = N[f.bus], from = N[f.from]; if (!bus || !from) return;
      const tap = Math.max(bus.x, Math.min(bus.x + bus.w, from.x)), d = f.d || 1.4;
      o += `<line class="sig c-${f.c || 'req'}" id="${id}" x1="${tap}" y1="${bus.y}" x2="${tap}" y2="${bus.y}" style="opacity:0"/>`;
      ctx.binders.push(root => { const el = root.querySelector('#' + id); return { t, d, sp: 1, fn(q) { if (q <= 0) { el.style.opacity = 0; return; } const e = Math.min(q, 1); el.style.opacity = 1; el.setAttribute('x1', f1(tap - e * (tap - bus.x))); el.setAttribute('x2', f1(tap + e * (bus.x + bus.w - tap))); } }; });
    } else if (f.k === 'boom') {
      const p = Array.isArray(f.at) ? { x: f.at[0], y: f.at[1] } : center(N[f.at] || { x: 0, y: 0 });
      o += `<g class="boom" id="${id}" transform="translate(${p.x},${p.y})" style="opacity:0"><path d="M0 -17L5 -6L16 -9L9 0L16 9L5 6L0 17L-5 6L-16 9L-9 0L-16 -9L-5 -6Z"/>${f.l ? `<text y="-23" text-anchor="middle">${esc(f.l)}</text>` : ''}</g>`;
      ctx.binders.push(root => { const el = root.querySelector('#' + id); return { t, d: .35, sp: 1, fn(q) { el.style.opacity = q <= 0 ? 0 : 1; const k = q <= 0 ? 0 : Math.min(1, .4 + q * .6); el.setAttribute('transform', `translate(${p.x},${p.y}) scale(${f1(k)})`); } }; });
    }
  });
  // paquetes
  let tcur = 0, lastStart = 0;
  (s.pk || []).forEach((p, i) => {
    const pts = pathPts(sc, p.p || []); if (pts.length < 2) return;
    const hops = Math.max(1, (p.p || []).length - 1), d = p.d || (.55 + .5 * hops);
    const t = p.t != null ? p.t : (p.par ? lastStart : tcur);
    lastStart = t; tcur = Math.max(tcur, t + d);
    const id = 'pk' + ctx.uid + '_' + i, lw = p.l ? tw(p.l, 10) + 16 : 0, L = polyLen(pts);
    o += `<g class="pk c-${p.c || 'req'}" id="${id}" style="opacity:0">` +
      (p.l ? `<rect x="${f1(-lw / 2)}" y="-10" width="${f1(lw)}" height="20" rx="10"/><text y="3.6" text-anchor="middle">${esc(p.l)}</text>` : `<circle r="6.5"/>`) +
      (p.drop ? `<path class="dropx" d="M-7 -29L7 -15M7 -29L-7 -15" style="opacity:0"/>` : '') + '</g>';
    ctx.binders.push(root => {
      const el = root.querySelector('#' + id), dx = el.querySelector('.dropx'), keep = p.stay || p.drop;
      const endAt = p.drop && p.dropAt ? p.dropAt : 1;
      return { t, d, sp: .55, fn(q) {
        if (q <= 0) { el.style.opacity = 0; return; }
        const pos = polyAt(pts, L, ease(Math.min(q, 1)) * endAt);
        el.setAttribute('transform', `translate(${f1(pos.x)},${f1(pos.y)})`);
        el.style.opacity = q >= 1 ? (keep ? 1 : 0) : 1;
        if (dx) dx.style.opacity = q >= 1 ? 1 : 0;
      } };
    });
  });
  return o;
}

/* ---------------- SEQ (diagrama de secuencia) ---------------- */
function renderSeq(sc, s, ctx) {
  const A = sc.actors, n = A.length, x0 = n === 2 ? 190 : (n === 3 ? 130 : 100), x1 = W - x0;
  const X = {}; A.forEach((a, i) => X[a.id] = n === 1 ? W / 2 : x0 + (x1 - x0) * i / (n - 1));
  const rows = sc.msgs.length, top = 96, bottom = H - 16, sp = Math.min(40, (bottom - top - 6) / Math.max(rows, 1));
  const upto = s._upto == null ? rows : s._upto, from = s._from || 0;
  let o = '';
  A.forEach(a => {
    const x = X[a.id], T = TYPES[a.t] || TYPES.pc, w = Math.max(96, tw(a.l, 12) + 54), stt = s.states && s.states[a.id];
    o += `<line class="life" x1="${x}" y1="60" x2="${x}" y2="${bottom}"/>`;
    o += `<g class="nd state c-${a.c || T[0]}"><rect class="depth" x="${f1(x - w / 2)}" y="18" width="${f1(w)}" height="34" rx="10"/><rect class="face" x="${f1(x - w / 2)}" y="14" width="${f1(w)}" height="34" rx="10"/>` +
      icon(T[1], x - w / 2 + 20, 31, 20) + `<text class="nlbl in" x="${f1(x + 10)}" y="35" text-anchor="middle">${esc(a.l)}</text></g>`;
    if (stt) { const sw = tw(stt, 10) + 16; o += `<g class="tag st"><rect x="${f1(x - sw / 2)}" y="60" width="${f1(sw)}" height="18" rx="9"/><text x="${x}" y="72.5" text-anchor="middle">${esc(stt)}</text></g>`; }
  });
  let k = 0;
  sc.msgs.forEach((m, i) => {
    if (i >= upto) return;
    const y = top + 16 + i * sp, isNew = i >= from, id = 'm' + ctx.uid + '_' + i;
    const cls = (isNew ? 'new' : 'old');
    if (m.div != null) { const w = tw(m.div, 10) + 20; o += `<g class="sdiv ${cls}"><line x1="40" y1="${f1(y - 4)}" x2="${W - 40}" y2="${f1(y - 4)}"/><rect x="${f1(W / 2 - w / 2)}" y="${f1(y - 13)}" width="${f1(w)}" height="18" rx="9"/><text x="${W / 2}" y="${f1(y - .5)}" text-anchor="middle">${esc(m.div)}</text></g>`; return; }
    if (m.gap) return;
    if (m.note != null) {
      const x = X[m.at] != null ? X[m.at] : W / 2, w = tw(m.note, 10) + 18;
      o += `<g class="snote c-${m.c || 'yellow'} ${cls}" id="${id}"><rect x="${f1(x - w / 2)}" y="${f1(y - 14)}" width="${f1(w)}" height="20" rx="6"/><text x="${f1(x)}" y="${f1(y)}" text-anchor="middle">${esc(m.note)}</text></g>`;
      if (isNew) { const t = k * .75; k += .6; ctx.binders.push(root => { const el = root.querySelector('#' + id); return { t, d: .3, sp: 1, fn(q) { el.style.opacity = q <= 0 ? 0 : Math.min(1, q); } }; }); }
      return;
    }
    const xa = X[m.f], xb = X[m.to]; if (xa == null || xb == null) return;
    const dir = xb > xa ? 1 : -1, end = m.lost ? xa + (xb - xa) * .58 : xb - dir * 3, ya = y - 4, yb = y + 4;
    const len = Math.hypot(end - xa, yb - ya), ang = Math.atan2(yb - ya, end - xa);
    const fs = Math.min(11, Math.max(8, (Math.abs(xb - xa) - 30) / (String(m.l || '').length * .61 || 1)));
    o += `<g class="msg c-${m.c || 'req'} ${cls}${m.dash ? ' dash' : ''}" id="${id}"><path class="ml" d="M${f1(xa)} ${f1(ya)}L${f1(end)} ${f1(yb)}" ${isNew && !m.dash ? `stroke-dasharray="${f1(len)}" stroke-dashoffset="0"` : ''}/>` +
      `<g class="mh">${m.lost ? `<path class="lostx" d="M-6 -6L6 6M6 -6L-6 6" transform="translate(${f1(end)},${f1(yb)})"/>` : arrowHead(end + dir * 3, yb + .4, ang)}</g>` +
      `<text class="mlbl" x="${f1((xa + xb) / 2)}" y="${f1(y - 9)}" text-anchor="middle" style="font-size:${f1(fs)}px">${esc(m.l)}</text></g>`;
    if (isNew) {
      const t = k * .75; k += 1;
      ctx.binders.push(root => {
        const el = root.querySelector('#' + id), ml = el.querySelector('.ml'), mh = el.querySelector('.mh'), tx = el.querySelector('.mlbl');
        return { t, d: .65, sp: 1, fn(q) {
          const e = q <= 0 ? 0 : Math.min(1, q);
          el.style.opacity = q <= 0 ? 0 : 1;
          if (!m.dash) ml.setAttribute('stroke-dashoffset', f1(len * (1 - ease(e))));
          mh.style.opacity = e >= .95 ? 1 : 0; tx.style.opacity = Math.min(1, e * 2);
        } };
      });
    }
  });
  return o;
}

/* ---------------- FIELDS (formato de trama / cabecera) ---------------- */
function fieldRow(row, x0, y, wTot, h, hiSet, ctx) {
  const tot = row.reduce((a, f) => a + (f.w || 1), 0); let x = x0, o = '';
  row.forEach(f => {
    const w = wTot * (f.w || 1) / tot, isHi = hiSet ? hiSet.has(f.id) : true;
    const lines = String(f.l || '').split('\n'), longest = lines.reduce((a, l) => Math.max(a, l.length), 1);
    const fs = Math.max(6.5, Math.min(11.5, (w - 8) / (longest * .61)));
    const cy = y + h / 2 + (f.s ? -5 : 0);
    o += `<g class="fld c-${f.c || 'blue'} ${isHi ? (hiSet ? 'hi' : '') : 'lo'}${f.ghost ? ' ghost' : ''}"><rect x="${f1(x)}" y="${y}" width="${f1(w)}" height="${h}" rx="5"/>` +
      `<text class="fl" x="${f1(x + w / 2)}" y="${f1(cy - (lines.length - 1) * fs * .6 + fs * .35)}" text-anchor="middle" style="font-size:${f1(fs)}px">` +
      lines.map((l, i) => `<tspan x="${f1(x + w / 2)}" dy="${i ? f1(fs * 1.2) : 0}">${esc(l)}</tspan>`).join('') + '</text>' +
      (f.s ? `<text class="fs" x="${f1(x + w / 2)}" y="${f1(y + h - 7)}" text-anchor="middle" style="font-size:${f1(Math.min(9.5, Math.max(6, (w - 4) / (String(f.s).length * .61))))}px">${esc(f.s)}</text>` : '') + '</g>';
    f._x = x; f._w = w; f._y = y; x += w;
  });
  return o;
}
function renderFields(sc, s, ctx) {
  const hiSet = s.hi ? new Set(s.hi) : null, x0 = 40, wTot = W - 80, rh = sc.rh || 50;
  let y = 24, o = '';
  if (sc.title) { o += `<text class="ftitle" x="${x0}" y="${y + 12}">${esc(sc.title)}</text>`; y += 28; }
  if (sc.ruler) {
    const n = sc.ruler; [0, 4, 8, 16, 24, n].forEach(b => { if (b > n) return; const x = x0 + wTot * b / n; o += `<line class="tick" x1="${f1(x)}" y1="${y}" x2="${f1(x)}" y2="${y + 6}"/><text class="fs" x="${f1(x)}" y="${y - 3}" text-anchor="${b === 0 ? 'start' : b === n ? 'end' : 'middle'}">${b === n ? 'bit ' + (n - 1) : b}</text>`; });
    y += 12;
  }
  sc.rows.forEach(r => { o += fieldRow(r, x0, y, wTot, rh, hiSet, ctx); y += rh + 4; });
  if (sc.zoom && s.zoom) {
    const z = sc.zoom, src = [].concat.apply([], sc.rows).find(f => f.id === z.from), zx = z.x || 90, zw = z.w || W - 180, zy = y + 46;
    if (src) o += `<path class="zoomc" d="M${f1(src._x)} ${src._y + rh}L${zx} ${zy}M${f1(src._x + src._w)} ${src._y + rh}L${zx + zw} ${zy}"/>`;
    if (z.title) o += `<text class="ftitle sm" x="${zx}" y="${zy - 8}">${esc(z.title)}</text>`;
    z.rows.forEach((r, i) => { o += fieldRow(r, zx, zy + i * (rh + 4), zw, rh, hiSet, ctx); });
    y = zy + z.rows.length * (rh + 4);
  }
  if (s.det) o += fo(x0, y + 12, wTot, s.det, 'det');
  // centra verticalmente cuando el contenido es bajo
  const used = y + (s.det ? 30 + Math.ceil(String(s.det).replace(/<[^>]+>/g, '').length / 105) * 18 : 0);
  const dy = Math.max(0, Math.min(90, Math.floor((H - used) / 2 - 24)));
  return dy ? `<g transform="translate(0,${dy})">${o}</g>` : o;
}

/* ---------------- BITS (direcciones IP, máscara, bloques) ---------------- */
function barSVG(bar, x0, y, w, h) {
  const span = bar.span || [0, 255], size = span[1] - span[0] + 1; let o = '';
  if (bar.title) o += `<text class="ftitle sm" x="${x0}" y="${y - 8}">${esc(bar.title)}</text>`;
  o += `<rect class="barbg" x="${x0}" y="${y}" width="${w}" height="${h}" rx="6"/>`;
  (bar.blocks || []).forEach(b => {
    const bx = x0 + w * (b.a - span[0]) / size, bw = w * (b.b - b.a + 1) / size;
    const fs = Math.max(6, Math.min(10.5, (bw - 6) / (String(b.l || '').length * .61 || 1)));
    o += `<g class="blkb c-${b.c || 'green'}${b.hi ? ' hi' : ''}${b.free ? ' free' : ''}"><rect x="${f1(bx + 1)}" y="${y + 1}" width="${f1(Math.max(1, bw - 2))}" height="${h - 2}" rx="5"/>` +
      (b.l && bw > 16 ? `<text x="${f1(bx + bw / 2)}" y="${f1(y + h / 2 + fs * .35)}" text-anchor="middle" style="font-size:${f1(fs)}px">${esc(b.l)}</text>` : '') +
      `<text class="fs" x="${f1(bx + 2)}" y="${y + h + 12}" text-anchor="start">${b.a}</text></g>`;
  });
  o += `<text class="fs" x="${x0 + w}" y="${y + h + 12}" text-anchor="end">${span[1]}</text>`;
  return o;
}
function renderBits(sc, s, ctx) {
  let o = '', y = 30;
  const title = s.title || sc.title;
  if (title) { o += `<text class="ftitle" x="40" y="${y + 6}">${esc(title)}</text>`; y += 26; }
  if (s.ip) {
    const oct = String(s.ip).split('.').map(Number), mask = s.mask == null ? 32 : s.mask, sub = s.sub == null ? mask : s.sub;
    const cw = 19, gap = 12, x0 = (W - (32 * cw + 3 * gap)) / 2;
    o += `<text class="ipbig" x="${W / 2}" y="${y + 24}" text-anchor="middle">${esc(s.ip)}${s.mask != null ? `<tspan class="ipmask"> /${sub}</tspan>` : ''}</text>`;
    y += 44;
    const cls = b => b < mask ? 'net' : (b < sub ? 'sub' : 'host');
    for (let b = 0; b < 32; b++) {
      const o8 = b >> 3, x = x0 + b * cw + o8 * gap, bit = (oct[o8] >> (7 - (b & 7))) & 1;
      const hl = s.hiBits && b >= s.hiBits[0] && b <= s.hiBits[1];
      o += `<g class="bit ${s.mask != null ? cls(b) : 'plain'}${hl ? ' hl' : ''}"><rect x="${f1(x)}" y="${y}" width="${cw - 2}" height="26" rx="4"/><text x="${f1(x + (cw - 2) / 2)}" y="${y + 17.5}" text-anchor="middle">${bit}</text></g>`;
    }
    for (let k = 0; k < 4; k++) o += `<text class="octd" x="${f1(x0 + k * (8 * cw + gap) + 4 * cw - 1)}" y="${y + 42}" text-anchor="middle">${oct[k]}</text>`;
    y += 50;
    if (s.mask != null) {
      const m = []; for (let k = 0; k < 4; k++) { const bits = Math.max(0, Math.min(8, sub - k * 8)); m.push(256 - Math.pow(2, 8 - bits)); }
      for (let b = 0; b < 32; b++) { const o8 = b >> 3, x = x0 + b * cw + o8 * gap; o += `<g class="bit mk ${b < sub ? 'one' : 'zero'}"><rect x="${f1(x)}" y="${y}" width="${cw - 2}" height="18" rx="3"/><text x="${f1(x + (cw - 2) / 2)}" y="${y + 13}" text-anchor="middle">${b < sub ? 1 : 0}</text></g>`; }
      o += `<text class="fs" x="${f1(x0 - 8)}" y="${y + 13}" text-anchor="end">${esc(T('máscara'))}</text>`;
      for (let k = 0; k < 4; k++) o += `<text class="octd sm" x="${f1(x0 + k * (8 * cw + gap) + 4 * cw - 1)}" y="${y + 32}" text-anchor="middle">${m[k]}</text>`;
      y += 42;
      const leg = [['net', T('red · {n} bits', { n: mask })]]; if (sub > mask) leg.push(['sub', T('subred · {n} bits', { n: sub - mask })]); if (sub < 32) leg.push(['host', T('host · {n} bits', { n: 32 - sub })]);
      let lx = W / 2 - leg.length * 75;
      leg.forEach(l => { o += `<g class="bit ${l[0]}"><rect x="${lx}" y="${y}" width="12" height="12" rx="3"/></g><text class="fs lg" x="${lx + 17}" y="${y + 10}">${esc(l[1])}</text>`; lx += 150; });
      y += 24;
    }
  }
  if (s.lines) {
    const colW = (W - 80) / Math.min(s.lines.length, 4);
    s.lines.forEach((l, i) => { const x = 40 + (i % 4) * colW, yy = y + Math.floor(i / 4) * 44; o += `<g class="kv${l.hi ? ' hi' : ''}"><rect x="${f1(x)}" y="${yy}" width="${f1(colW - 8)}" height="38" rx="7"/><text class="k" x="${f1(x + 9)}" y="${yy + 14}">${esc(l.l)}</text><text class="v" x="${f1(x + 9)}" y="${yy + 30}">${esc(l.v)}</text></g>`; });
    y += Math.ceil(s.lines.length / 4) * 44 + 8;
  }
  const bars = s.bars || (s.blocks ? [{ title: s.blocksTitle, blocks: s.blocks, span: s.span }] : []);
  bars.forEach(b => { y += b.title ? 24 : 6; o += barSVG(b, 40, y, W - 80, b.h || 36); y += (b.h || 36) + 22; });
  return o;
}

/* ---------------- CHART ---------------- */
function renderChart(sc, s, ctx) {
  const x0 = 70, x1 = W - 40, y0 = H - 56, y1 = 44;
  const series = s.series || sc.series || [], n = Math.max.apply(null, series.map(q => q.pts.length).concat([2]));
  const ymax = s.ymax || sc.ymax || Math.max.apply(null, [].concat.apply([], series.map(q => q.pts))) * 1.15;
  const X = i => x0 + (x1 - x0) * i / (n - 1), Y = v => y0 - (y0 - y1) * v / ymax;
  let o = `<path class="axis" d="M${x0} ${y1 - 10}V${y0}H${x1 + 8}"/>`;
  for (let g = 0; g <= 4; g++) { const v = ymax * g / 4; o += `<line class="grid" x1="${x0}" y1="${f1(Y(v))}" x2="${x1}" y2="${f1(Y(v))}"/><text class="fs" x="${x0 - 8}" y="${f1(Y(v) + 3)}" text-anchor="end">${Math.round(v)}</text>`; }
  for (let i = 0; i < n; i++) if (n <= 16 || i % 2 === 0) o += `<text class="fs" x="${f1(X(i))}" y="${y0 + 15}" text-anchor="middle">${i + (sc.x0 != null ? sc.x0 : 1)}</text>`;
  const xl = s.xl || sc.xl, yl = s.yl || sc.yl;
  if (xl) o += `<text class="fs lg" x="${(x0 + x1) / 2}" y="${y0 + 34}" text-anchor="middle">${esc(xl)}</text>`;
  if (yl) o += `<text class="fs lg" x="${x0 - 46}" y="${(y0 + y1) / 2}" text-anchor="middle" transform="rotate(-90 ${x0 - 46} ${(y0 + y1) / 2})">${esc(yl)}</text>`;
  (s.hline || sc.hline || []).forEach(hl => { o += `<line class="hline c-${hl.c || 'purple'}" x1="${x0}" y1="${f1(Y(hl.y))}" x2="${x1}" y2="${f1(Y(hl.y))}"/><text class="fs lg" x="${x1 - 4}" y="${f1(Y(hl.y) - 5)}" text-anchor="end">${esc(hl.l)}</text>`; });
  series.forEach((q, si) => {
    const upto = s.upto == null ? q.pts.length : Math.min(s.upto, q.pts.length), pts = q.pts.slice(0, upto);
    const d = pts.map((v, i) => (i ? 'L' : 'M') + f1(X(i)) + ' ' + f1(Y(v))).join(''), id = 'ch' + ctx.uid + '_' + si;
    let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(X(i) - X(i - 1), Y(pts[i]) - Y(pts[i - 1]));
    o += `<g class="ser c-${q.c || 'req'}"><path id="${id}" d="${d}" stroke-dasharray="${f1(len + 1)}" stroke-dashoffset="0"/>` + pts.map((v, i) => `<circle cx="${f1(X(i))}" cy="${f1(Y(v))}" r="3.2"/>`).join('') +
      (q.l && pts.length ? `<text class="fs lg" x="${f1(X(pts.length - 1) - 6)}" y="${f1(Y(pts[pts.length - 1]) - 9)}" text-anchor="end">${esc(q.l)}</text>` : '') + '</g>';
    ctx.binders.push(root => { const el = root.querySelector('#' + id); return { t: 0, d: 1.6, sp: 1, fn(q2) { el.setAttribute('stroke-dashoffset', f1((len + 1) * (1 - ease(Math.max(0, Math.min(1, q2)))))); } }; });
  });
  (s.marks || sc.marks || []).forEach(m => { if (s.upto != null && m.i >= s.upto) return; const x = X(m.i); o += `<g class="mark c-${m.c || 'bad'}"><line x1="${f1(x)}" y1="${y1}" x2="${f1(x)}" y2="${y0}"/><text x="${f1(x)}" y="${y1 - 6 - (m.dy || 0)}" text-anchor="middle">${esc(m.l)}</text></g>`; });
  return o;
}

/* ---------------- STACK (medidor: CIR / EIR, créditos...) ---------------- */
function renderStack(sc, s, ctx) {
  const levels = s.levels || sc.levels || [], items = s.items || [], unit = s.unit || sc.unit || '';
  const max = s.max || sc.max || (levels.length ? levels[levels.length - 1].to * 1.3 : 100);
  const bx = 250, bw = 150, yb = H - 44, yt = 50, Y = v => yb - (yb - yt) * Math.min(v, max) / max;
  let o = `<rect class="barbg" x="${bx}" y="${yt}" width="${bw}" height="${yb - yt}" rx="8"/>`;
  const title = s.title || sc.title; if (title) o += `<text class="ftitle" x="40" y="34">${esc(title)}</text>`;
  let prevTo = 0;
  levels.forEach(l => {
    o += `<rect class="lvl c-${l.c || 'green'}" x="${bx}" y="${f1(Y(l.to))}" width="${bw}" height="${f1(Y(prevTo) - Y(l.to))}"/>`;
    o += `<line class="lvll" x1="${bx - 70}" y1="${f1(Y(l.to))}" x2="${bx + bw}" y2="${f1(Y(l.to))}"/><text class="fs lg" x="${bx - 74}" y="${f1(Y(l.to) + 4)}" text-anchor="end">${esc(l.l)} · ${l.to} ${esc(unit)}</text>`;
    prevTo = l.to;
  });
  if (prevTo < max) o += `<text class="fs lg" x="${bx - 74}" y="${f1(Y((prevTo + max) / 2) + 4)}" text-anchor="end">${esc(s.overLabel || sc.overLabel || T('excede: se descarta'))}</text>`;
  let acc = 0;
  items.forEach((it, i) => {
    const a = acc, b = acc + it.v; acc = b;
    let li = levels.findIndex(l => b <= l.to); const over = li < 0;
    const c = over ? 'red' : (levels[li].c || 'green'), tag = over ? (s.overTag || sc.overTag || T('descartada')) : (levels[li].tag || '');
    const y = Y(b), h = Math.max(4, Y(a) - Y(b)), id = 'sk' + ctx.uid + '_' + i;
    o += `<g class="skit c-${c}${over ? ' over' : ''}" id="${id}"><rect x="${bx + 8}" y="${f1(y + 1)}" width="${bw - 16}" height="${f1(h - 2)}" rx="5"/>` +
      `<text class="fl" x="${bx + bw / 2}" y="${f1(y + h / 2 + 4)}" text-anchor="middle">${esc(it.l || '')}</text>` +
      `<path class="lead" d="M${bx + bw - 6} ${f1(y + h / 2)}H${bx + bw + 26}"/><text class="sktag" x="${bx + bw + 32}" y="${f1(y + h / 2 + 4)}">${esc(it.v + ' ' + unit + (tag ? ' → ' + tag : ''))}</text></g>`;
    ctx.binders.push(root => { const el = root.querySelector('#' + id); return { t: i * .55, d: .45, sp: 1, fn(q) { const e = q <= 0 ? 0 : Math.min(1, q); el.style.opacity = e; el.setAttribute('transform', `translate(0,${f1(-30 * (1 - ease(e)))})`); } }; });
  });
  return o;
}

/* ---------------- capas comunes ---------------- */
function overlays(s) {
  let o = '';
  (s.notes || []).forEach(n => { o += fo(n.x, n.y, n.w || 200, n.text, 'note c-' + (n.c || 'yellow')); });
  (s.tbl ? [].concat(s.tbl) : []).forEach(t => {
    const hi = t.hi == null ? [] : [].concat(t.hi);
    o += fo(t.x, t.y, t.w || 220, (t.title ? `<div class="tt">${esc(t.title)}</div>` : '') + '<table>' +
      (t.cols ? '<tr>' + t.cols.map(c => `<th>${esc(c)}</th>`).join('') + '</tr>' : '') +
      (t.rows || []).map((r, i) => `<tr class="${hi.indexOf(i) >= 0 ? 'hi' : ''}">` + r.map(c => `<td>${esc(c)}</td>`).join('') + '</tr>').join('') + '</table>', 'stbl');
  });
  return o;
}

const R = { topo: renderTopo, seq: renderSeq, fields: renderFields, bits: renderBits, chart: renderChart, stack: renderStack };

function mount(host, lesson, i, opts) {
  opts = opts || {};
  const s = lesson.steps[i], sc = (lesson.scenes || {})[s.scene];
  const ctx = { binders: [], static: !!opts.static, uid: ++UID };
  let inner = '';
  try {
    if (!sc) throw new Error('escena "' + s.scene + '" no definida');
    inner = R[sc.kind](sc, s, ctx) + overlays(s);
  } catch (e) {
    ctx.error = e; ctx.binders = [];
    inner = `<text x="24" y="44" class="err">${esc(T('Error en la escena:'))} ${esc(e.message)}</text>`;
    if (window.console) console.error('[escena]', lesson.id, 'paso', i + 1, e);
  }
  host.innerHTML = `<svg class="scene k-${sc ? sc.kind : 'x'}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(s.t)}">${inner}</svg>`;
  let items = [];
  try { items = ctx.binders.map(b => b(host)).filter(Boolean); } catch (e) { ctx.error = e; if (window.console) console.error(e); }
  items.forEach(it => { it.d = Math.max(it.d || .01, .01); });
  const total = items.reduce((m, it) => Math.max(m, it.t + it.d), 0);
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let start = 0, paused = false, pausedAt = 0, raf = 0, dead = false;
  const setAll = el => items.forEach(it => it.fn((el - it.t) / it.d));
  function frame(now) {
    if (dead || paused) return;
    if (!start) start = now;
    let el = (now - start) / 1000;
    if (el > total + HOLD) { if (reduce) { setAll(total); return; } start = now; el = 0; }
    setAll(Math.min(el, total + .001));
    raf = requestAnimationFrame(frame);
  }
  if (opts.static || !items.length) items.forEach(it => it.fn(it.sp != null ? it.sp : 1));
  else { setAll(0); raf = requestAnimationFrame(frame); }
  return {
    hasAnim: items.length > 0 && !opts.static, error: ctx.error,
    replay() { if (!items.length) return; cancelAnimationFrame(raf); start = 0; paused = false; raf = requestAnimationFrame(frame); },
    toggle() {
      if (!items.length) return false;
      if (paused) { paused = false; start += performance.now() - pausedAt; raf = requestAnimationFrame(frame); }
      else { paused = true; pausedAt = performance.now(); cancelAnimationFrame(raf); }
      return paused;
    },
    destroy() { dead = true; cancelAnimationFrame(raf); }
  };
}

/* ---------------- curso ---------------- */
function prep(lesson) {
  const scenes = lesson.scenes || {};
  Object.keys(scenes).forEach(k => { const sc = scenes[k]; if (sc.kind === 'topo') { sc._n = {}; sc.nodes.forEach(n => sc._n[n.id] = n); } });
  let stats = {}; const last = {};
  (lesson.steps || []).forEach((s, i) => {
    stats = Object.assign({}, stats, s.st || {}); s._st = stats;
    const sc = scenes[s.scene]; if (!sc) return;
    const prevS = i > 0 ? lesson.steps[i - 1] : null, same = prevS && prevS.scene === s.scene;
    if (sc.kind === 'topo') {
      if (s.add && !s.show) s._show = Array.from(new Set((last[s.scene] || []).concat(s.add)));
      else s._show = s.show || null;
      last[s.scene] = s._show || allIds(sc);
      s._prevShow = same ? (prevS._show || allIds(sc)).filter(id => (prevS.hide || []).indexOf(id) < 0) : null;
    }
    if (sc.kind === 'seq') {
      const up = s.upto == null ? sc.msgs.length : s.upto, prev = same ? prevS._upto : 0;
      s._upto = up; s._from = s.anim != null ? s.anim : (prev <= up ? prev : 0);
    }
  });
}
function validate(lesson) {
  const errs = [], E = m => errs.push(m), scenes = lesson.scenes || {};
  ['id', 'title', 'desc', 'steps'].forEach(k => { if (!lesson[k]) E('falta "' + k + '"'); });
  (lesson.steps || []).forEach((s, i) => {
    const P = 'paso ' + (i + 1) + ': ', sc = scenes[s.scene];
    if (!s.t) E(P + 'falta título t'); if (!s.b) E(P + 'falta cuerpo b'); if (!s.s) E(P + 'falta etiqueta corta s');
    if (!sc) { E(P + 'escena desconocida "' + s.scene + '"'); return; }
    if (!R[sc.kind]) { E(P + 'kind desconocido ' + sc.kind); return; }
    if (sc.kind === 'topo') {
      const ids = new Set(allIds(sc)), lids = new Set((sc.links || []).map(l => l.id || l.a + '-' + l.b));
      (sc.links || []).forEach(l => { if (!sc._n[l.a] || !sc._n[l.b]) E('escena ' + s.scene + ': link con nodo inexistente ' + l.a + '-' + l.b); });
      const chk = (arr, what, links) => (arr || []).forEach(id => { if (!ids.has(id) && !(links && lids.has(id))) E(P + what + ' → id inexistente "' + id + '"'); });
      chk(s.show, 'show'); chk(s.add, 'add'); chk(s.hide, 'hide', 1); chk(s.hi, 'hi', 1); chk(s.dim, 'dim', 1); chk(s.x, 'x', 1);
      chk(Object.keys(s.tags || {}), 'tags'); chk(Object.keys(s.ll || {}), 'll', 1);
      (s.pk || []).forEach((p, j) => { if (!p.p || p.p.length < 2) E(P + 'pk[' + j + '] necesita p con 2+ puntos'); (p.p || []).forEach(e => { if (!Array.isArray(e) && !sc._n[e]) E(P + 'pk[' + j + '] nodo inexistente "' + e + '"'); }); });
      (s.fx || []).forEach((f, j) => { ['at', 'bus', 'from'].forEach(k => { if (f[k] && !Array.isArray(f[k]) && !sc._n[f[k]]) E(P + 'fx[' + j + '].' + k + ' inexistente "' + f[k] + '"'); }); });
      sc.nodes.forEach(n => { if (n.t !== 'bus' && (n.x < 20 || n.x > W - 20 || n.y < 20 || n.y > H - 20)) E('escena ' + s.scene + ': nodo ' + n.id + ' fuera del lienzo 800×440'); });
    }
    if (sc.kind === 'seq') {
      const a = new Set(sc.actors.map(x => x.id));
      sc.msgs.forEach((m, j) => { if (m.f && !a.has(m.f)) E('seq ' + s.scene + ' msg ' + j + ': actor f "' + m.f + '"'); if (m.to && !a.has(m.to)) E('seq ' + s.scene + ' msg ' + j + ': actor to "' + m.to + '"'); if (m.at && !a.has(m.at)) E('seq ' + s.scene + ' msg ' + j + ': actor at "' + m.at + '"'); });
      if (s.upto != null && s.upto > sc.msgs.length) E(P + 'upto mayor que la cantidad de mensajes');
      if (sc.msgs.length > 13) E('seq ' + s.scene + ': más de 13 filas, no entra (dividir en dos escenas)');
    }
    if (sc.kind === 'fields') {
      const ids = new Set(); sc.rows.concat(sc.zoom ? sc.zoom.rows : []).forEach(r => r.forEach(f => ids.add(f.id)));
      (s.hi || []).forEach(id => { if (!ids.has(id)) E(P + 'hi → campo inexistente "' + id + '"'); });
    }
  });
  (lesson.quiz || []).forEach((q, i) => { if (!q.q || !q.o || q.o[q.a] == null) E('quiz ' + (i + 1) + ' mal formado'); });
  return errs;
}

/* ---------- idiomas: clona una lección traduciendo sus textos ----------
   Las claves de ID_KEYS son identificadores (no se traducen); en un paso, t / s / b son texto. */
const ID_KEYS = { id: 1, scene: 1, kind: 1, c: 1, fig: 1, f: 1, to: 1, at: 1, from: 1, bus: 1, icon: 1, anchor: 1, k: 1, a: 1, b: 1, t: 1, p: 1, show: 1, add: 1, hide: 1, hi: 1, dim: 1, x: 1, span: 1, pts: 1, hiBits: 1, ip: 1 };
const MAP_KEYS = { tags: 1, ll: 1, states: 1, st: 1 };
function walk(v, fn, mode) {
  if (v == null || typeof v !== 'object') return (typeof v === 'string' && mode !== 'raw') ? fn(v) : v;
  if (Array.isArray(v)) {
    if (mode === 'legend') return v.map(p => [p[0], fn(p[1])]);
    return v.map(x => walk(x, fn, mode === 'steps' ? 'step' : mode));
  }
  const o = {};
  Object.keys(v).forEach(k => {
    const x = v[k];
    if (mode === 'raw' || mode === 'map') o[k] = walk(x, fn, mode);
    else if (k === 'steps') o[k] = walk(x, fn, 'steps');
    else if (k === 'legend') o[k] = walk(x, fn, 'legend');
    else if (k === 'scenes') { o[k] = {}; Object.keys(x).forEach(n => { o[k][n] = walk(x[n], fn, null); }); }
    else if (MAP_KEYS[k]) o[k] = walk(x, fn, 'map');
    else if (mode === 'step' && (k === 't' || k === 's' || k === 'b')) o[k] = walk(x, fn, null);
    else if (ID_KEYS[k]) o[k] = walk(x, fn, 'raw');
    else o[k] = walk(x, fn, null);
  });
  return o;
}
const same = s => s;
function build(src, dict) {
  const l = walk(src, dict ? (s => Object.prototype.hasOwnProperty.call(dict, s) ? dict[s] : s) : same, null);
  try { prep(l); } catch (e) { if (window.console) console.error('prep', src.id, e); }
  return l;
}

const COURSE = {
  chapters: [], src: {}, lessons: {}, order: [], lang: 'es',
  add(l) { this.src[l.id] = l; this.lessons[l.id] = build(l, null); },
  setLang(lang, dict) {
    this.lang = lang;
    Object.keys(this.src).forEach(id => { this.lessons[id] = build(this.src[id], lang === 'es' ? null : dict); });
    this.finalize();
  },
  // textos traducibles de una lección (para armar los archivos de i18n)
  strings(id) { const out = []; walk(this.src[id], s => { if (/[A-Za-zÀ-ÿ]/.test(s)) out.push(s); return s; }, null); return out; },
  finalize() {
    this.order = [];
    this.chapters.forEach(ch => {
      ch.items = ch.lessons.filter(id => this.lessons[id]);
      ch.items.forEach((id, k) => { const l = this.lessons[id]; l.chapter = ch; l.idx = k; this.order.push(id); });
    });
  }
};

window.COURSE = COURSE;
window.T = T;
window.ENGINE = { mount, validate, esc, W, H, ICONS, barSVG, renderBits: (s) => { const ctx = { binders: [], static: true, uid: ++UID }; return `<svg class="scene k-bits" viewBox="0 0 ${W} ${s._h || H}" xmlns="http://www.w3.org/2000/svg">${renderBits({}, s, ctx)}</svg>`; } };
})();

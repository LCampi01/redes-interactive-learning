/* ============================================================
   App · navegación, lección, práctica, laboratorio, machetes
   ============================================================ */
(function () {
'use strict';
const C = window.COURSE, E = window.ENGINE, esc = E.esc, T = window.T;
C.finalize();
const $ = (s, r) => (r || document).querySelector(s);
const app = $('#app');
const FIG = 'assets/apunte/';

const I = {
  learn: 'M4 5.5c2.7-1 5.3-1 8 0v13c-2.7-1-5.3-1-8 0z M12 5.5c2.7-1 5.3-1 8 0v13c-2.7-1-5.3-1-8 0z',
  practice: 'M12 3l2.6 5.6 6 .7-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.3l6-.7z',
  lab: 'M9 3h6 M10 3v6.5L4.8 18a2 2 0 001.7 3h11a2 2 0 001.7-3L14 9.5V3 M7.5 15h9',
  cheat: 'M6 3h9l4 4v14H6z M15 3v4h4 M9 12h7 M9 16h5',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14z M16.2 16.2L21 21',
  moon: 'M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z',
  sun: 'M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z M12 2v2.5 M12 19.5V22 M2 12h2.5 M19.5 12H22 M5 5l1.8 1.8 M17.2 17.2L19 19 M5 19l1.8-1.8 M17.2 6.8L19 5',
  menu: 'M4 6.5h16 M4 12h16 M4 17.5h16',
  replay: 'M4 12a8 8 0 108-8H7 M10 1L7 4l3 3',
  pause: 'M8 5v14 M16 5v14', play: 'M7 4.5v15l12-7.5z',
  left: 'M19 12H5 M11 6l-6 6 6 6', right: 'M5 12h14 M13 6l6 6-6 6',
  bulb: 'M9 18h6 M10 21h4 M12 3a6 6 0 00-3.8 10.6c.6.6.8 1.2.8 1.9V16h6v-.5c0-.7.2-1.3.8-1.9A6 6 0 0012 3z',
  img: 'M4 5h16v14H4z M4 15l4.5-4.5 4 4 2.5-2.5 5 5 M15.5 9.5h.01',
  chev: 'M9 5l7 7-7 7', x: 'M6 6l12 12 M18 6L6 18'
};
const ic = n => `<svg class="i" viewBox="0 0 24 24"><path d="${I[n]}"/></svg>`;

/* ---------- estado ---------- */
const KEY = 'redes.apuntes.v1';
let store = { done: {}, last: null, theme: null, quiz: {}, open: {}, lang: null };
try { store = Object.assign(store, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { } };
const sysDark = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = () => store.theme || (sysDark() ? 'dark' : 'light');
const applyTheme = () => document.documentElement.setAttribute('data-theme', theme());
applyTheme();

let ctl = null;           // controlador de la animación actual
let route = null;

function parse() {
  const h = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (h[0] === 'practica') return { view: 'practice', arg: h[1] || 'all' };
  if (h[0] === 'laboratorio') return { view: 'lab', arg: h[1] || '' };
  if (h[0] === 'machetes') return { view: 'cheats' };
  let id = h[0], step = parseInt(h[1], 10) || 1;
  if (!C.lessons[id]) {
    const last = (store.last || '').split('/');
    if (!h[0] && C.lessons[last[0]]) { id = last[0]; step = parseInt(last[1], 10) || 1; } else { id = C.order[0]; step = 1; }
  }
  const l = C.lessons[id];
  if (!l) return { view: 'empty' };
  step = Math.max(1, Math.min(l.steps.length, step));
  return { view: 'learn', id, step };
}

/* ---------- shell ---------- */
function topbar() {
  const t = (v, href, icn, label) => `<a class="tab${route.view === v ? ' on' : ''}" href="${href}">${ic(icn)}<span>${T(label)}</span></a>`;
  return `<header class="top">
    <button class="icon-btn menu-btn" data-act="menu" aria-label="${T('Índice del curso')}">${ic('menu')}</button>
    <a class="brand" href="#/" aria-label="${T('Inicio')}">
      <svg viewBox="0 0 32 32"><rect x="1" y="1" width="30" height="30" rx="8" fill="var(--card)" stroke="var(--ink)" stroke-width="1.6"/><path d="M9 22V10h14v12H9" fill="none" stroke="var(--ink)" stroke-width="1.8"/><circle cx="9" cy="10" r="3.4" fill="var(--yellow)" stroke="var(--ink)" stroke-width="1.5"/><circle cx="23" cy="10" r="3.4" fill="var(--blue)" stroke="var(--ink)" stroke-width="1.5"/><circle cx="23" cy="22" r="3.4" fill="var(--green)" stroke="var(--ink)" stroke-width="1.5"/><circle cx="9" cy="22" r="3.4" fill="var(--purple)" stroke="var(--ink)" stroke-width="1.5"/></svg>
      <span>${T('Redes')} <small>${T('· apuntes interactivos')}</small></span></a>
    <nav class="tabs">${t('learn', '#/', 'learn', 'Aprender')}${t('practice', '#/practica', 'practice', 'Práctica')}${t('lab', '#/laboratorio', 'lab', 'Laboratorio')}${t('cheats', '#/machetes', 'cheat', 'Machetes')}</nav>
    <span class="sp"></span>
    <button class="search-btn" data-act="search">${ic('search')}<span>${T('Buscar lecciones y temas…')}</span><kbd>Ctrl K</kbd></button>
    <div class="lang" role="group" aria-label="${T('Idioma')}"><button data-act="lang" data-lang="es" class="${C.lang === 'es' ? 'on' : ''}" title="Español" aria-pressed="${C.lang === 'es'}">ES</button><button data-act="lang" data-lang="en" class="${C.lang === 'en' ? 'on' : ''}" title="English" aria-pressed="${C.lang === 'en'}">EN</button></div>
    <button class="icon-btn" data-act="theme" aria-label="${T('Cambiar tema')}">${ic(theme() === 'dark' ? 'sun' : 'moon')}</button>
  </header>`;
}
function sidebar() {
  const cur = route.view === 'learn' ? C.lessons[route.id] : null;
  const total = C.order.length, done = C.order.filter(id => store.done[id]).length;
  return `<aside class="side">
    <div class="card tree"><h2>${T('Curso')} <span>${T('{n} lecciones', { n: total })}</span></h2>
    ${C.chapters.map(ch => {
      if (!ch.items.length) return '';
      const open = store.open[ch.id] != null ? store.open[ch.id] : (cur ? cur.chapter === ch : ch === C.chapters[0]);
      const isOpen = open || (cur && cur.chapter === ch && store.open[ch.id] !== false);
      const d = ch.items.filter(id => store.done[id]).length;
      return `<div class="ch${isOpen ? ' open' : ''}" style="--c:var(--${ch.c})"><button data-act="ch" data-id="${ch.id}"><svg class="i chev" viewBox="0 0 24 24"><path d="${I.chev}"/></svg><i class="fold"></i>${ch.n}. ${esc(T(ch.title))}<span class="cnt">${d}/${ch.items.length}</span></button>
        <ul>${ch.items.map(id => { const l = C.lessons[id]; return `<li><a href="#/${id}/1" class="${cur && cur.id === id ? 'on' : ''}${store.done[id] ? ' done' : ''}"><i class="dotc"></i>${esc(l.title)}</a></li>`; }).join('')}</ul></div>`;
    }).join('')}</div>
    <div class="card prog"><div class="row"><span>${T('Progreso')}</span><span>${done} / ${total}</span></div><div class="bar"><i style="width:${total ? done / total * 100 : 0}%"></i></div></div>
  </aside>`;
}

/* ---------- vista: lección ---------- */
const KIND_C = { problema: 'red', contexto: 'gray', idea: 'yellow', mecanismo: 'blue', ejemplo: 'green', detalle: 'orange', resumen: 'purple', 'comparación': 'orange', 'práctica': 'green' };
function lessonView() {
  const l = C.lessons[route.id], n = l.steps.length, i = route.step - 1, s = l.steps[i], ch = l.chapter;
  const prevSt = i > 0 ? l.steps[i - 1]._st : {};
  const pos = C.order.indexOf(l.id), nextL = C.lessons[C.order[pos + 1]];
  const figs = s.fig ? [].concat(s.fig) : [];
  const last = i === n - 1;
  const legend = l.legend || [];
  return `<main class="main">
    <div class="lhead"><div class="crumb">${ch.n}. ${esc(T(ch.title))} / ${T('Lección {a} de {b}', { a: l.idx + 1, b: ch.items.length })}</div>
      <div class="trow"><h1>${esc(l.title)}</h1><div class="badges"><span class="badge" style="--c:var(--yellow)">${l.min || 8} min</span><span class="badge" style="--c:var(--green)">${esc(l.level || T('Inicial'))}</span><span class="badge" style="--c:var(--purple)">${T('{n} pasos', { n })}</span></div></div>
      <p>${esc(l.desc)}</p></div>
    <section class="card stage">
      <div class="bar">${(l.stats || []).map(t => { const v = s._st[t.k]; return `<div class="tile${v != null && v !== prevSt[t.k] && i > 0 ? ' chg' : ''}"><div class="k">${esc(t.l)}</div><div class="v">${v != null ? esc(v) : '—'}</div></div>`; }).join('')}
        <span class="sp"></span><button class="btn sm" data-act="replay" title="${T('Repetir (R)')}">${ic('replay')}${T('Repetir')}</button><button class="btn sm" data-act="pause" title="${T('Pausa (Espacio)')}">${ic('pause')}<span>${T('Pausa')}</span></button></div>
      <div class="canvas" id="canvas"></div>
      ${legend.length ? `<div class="legend">${legend.map(g => `<span><i class="c-${g[0]}" style="background:var(--c)"></i>${esc(g[1])}</span>`).join('')}</div>` : ''}
    </section>
    <section class="card tline"><div class="hd"><span class="eyebrow">${T('En esta lección')}</span><span>${T('Paso {a} de {b}', { a: i + 1, b: n })}</span></div>
      <ol>${l.steps.map((st, k) => `<li class="${k === i ? 'on' : k < i ? 'past' : ''}"><button data-go="${l.id}/${k + 1}" title="${esc(st.t)}"><span class="n">${k + 1}</span><span class="lb">${esc(st.s || '')}</span></button></li>`).join('')}</ol></section>
  </main>
  <aside class="right">
    <section class="card step"><div class="hd"><span class="eyebrow">${T('Paso')} ${i + 1} / ${n}</span>${s.k ? `<span class="kind" style="--c:var(--${KIND_C[s.k] || 'gray'})">${esc(T(s.k))}</span>` : ''}</div>
      <h2>${esc(s.t)}</h2><div class="body">${s.b}</div>
      ${s.key ? `<div class="keyidea">${ic('bulb')}<div><span class="eyebrow">${T('Idea clave')}</span><div>${s.key}</div></div></div>` : ''}
      ${figs.length ? `<button class="figbtn" data-act="fig" data-fig="${esc(figs.join(','))}">${ic('img')}${figs.length > 1 ? T('Ver {n} figuras del apunte', { n: figs.length }) : T('Ver figura del apunte')}</button>` : ''}
      <div class="nav"><button class="btn" data-go="${l.id}/${i}" ${i === 0 ? 'disabled' : ''}>${ic('left')}${T('Atrás')}</button>
        ${!last ? `<button class="btn pri" data-go="${l.id}/${i + 2}"><span>${T('Siguiente:')} ${esc(l.steps[i + 1].s || '')}</span>${ic('right')}</button>`
        : nextL ? `<button class="btn pri" data-go="${nextL.id}/1"><span>${esc(nextL.title)}</span>${ic('right')}</button>`
          : `<a class="btn pri" href="#/practica"><span>${T('Ir a la práctica')}</span>${ic('right')}</a>`}</div>
      <div class="hint"><span><kbd>←</kbd> <kbd>→</kbd> ${T('paso')}</span><span><kbd>R</kbd> ${T('repetir')}</span><span><kbd>${T('Espacio')}</kbd> ${T('pausa')}</span></div>
    </section>
    <section class="card learn"><span class="eyebrow">${T('Aprenderás')}</span>
      <ul>${(l.learn || []).map(t => `<li class="${store.done[l.id] ? 'ok' : ''}"><i></i><span>${esc(t)}</span></li>`).join('')}</ul>
      <div class="more">${(l.quiz || []).length ? `<a class="btn sm" href="#/practica/${l.id}">${ic('practice')}${T('Practicar esta lección')}</a>` : ''}</div>
    </section>
  </aside>`;
}
function mountStage() {
  if (ctl) { ctl.destroy(); ctl = null; }
  const host = $('#canvas'); if (!host) return;
  const l = C.lessons[route.id];
  ctl = E.mount(host, l, route.step - 1, {});
  const pb = $('[data-act="pause"]'), rb = $('[data-act="replay"]');
  if (!ctl.hasAnim) { if (pb) pb.disabled = true; if (rb) rb.disabled = true; }
}

/* ---------- vista: práctica ---------- */
function allQuestions(filter) {
  const out = [];
  C.order.forEach(id => {
    const l = C.lessons[id];
    if (filter !== 'all' && filter !== id && filter !== l.chapter.id) return;
    (l.quiz || []).forEach((q, k) => out.push({ q, key: id + ':' + k, l }));
  });
  return out;
}
function practiceView() {
  const f = route.arg, qs = allQuestions(f), lf = C.lessons[f];
  const ok = qs.filter(x => store.quiz[x.key] === x.q.a).length, ans = qs.filter(x => store.quiz[x.key] != null).length;
  return `<main class="page"><header><span class="eyebrow">${T('Práctica')}</span><h1>${lf ? esc(lf.title) : T('Autoevaluación')}</h1>
      <p>${T('Preguntas armadas a partir de los apuntes. Elegí una opción y mirá la explicación; tus respuestas quedan guardadas en este navegador.')}</p></header>
    <div class="chips"><a class="chip${f === 'all' ? ' on' : ''}" href="#/practica" style="text-decoration:none">${T('Todo')}</a>${C.chapters.filter(c => c.items.length).map(c => `<a class="chip${f === c.id || (lf && lf.chapter === c) ? ' on' : ''}" href="#/practica/${c.id}" style="text-decoration:none">${c.n}. ${esc(T(c.title))}</a>`).join('')}</div>
    <div class="score"><span class="badge" style="--c:var(--green)">${T('{n} correctas', { n: ok })}</span><span class="badge">${T('{a} / {b} respondidas', { a: ans, b: qs.length })}</span><button class="btn sm" data-act="quiz-reset">${ic('replay')}${T('Reiniciar estas preguntas')}</button></div>
    <div class="qgrid">${qs.map((x, n) => {
      const a = store.quiz[x.key], done = a != null;
      return `<article class="card q${done ? ' done' : ''}" data-key="${x.key}"><div class="src">${x.l.chapter.n} · <a href="#/${x.l.id}/1">${esc(x.l.title)}</a></div><h3>${n + 1}. ${esc(x.q.q)}</h3>
        <div class="opts">${x.q.o.map((o, k) => `<button data-opt="${k}" class="${done ? (k === x.q.a ? 'ok' : (k === a ? 'no' : '')) : ''}"><b>${'ABCDE'[k]}</b><span>${esc(o)}</span></button>`).join('')}</div>
        <div class="why">${done ? ('<b>' + T(a === x.q.a ? 'Correcto.' : 'No.') + '</b> ') : ''}${esc(x.q.why || '')}</div></article>`;
    }).join('') || '<p>' + T('Todavía no hay preguntas para esta selección.') + '</p>'}</div></main>`;
}

/* ---------- vista: machetes ---------- */
function cheatsView() {
  return `<main class="page"><header><span class="eyebrow">${T('Machetes')}</span><h1>${T('Resumen para repasar')}</h1>
    <p>${T('Lo esencial de cada lección en una tarjeta. Se puede imprimir')} (<kbd>Ctrl P</kbd>).</p></header>
    ${C.chapters.filter(c => c.items.length).map(ch => `<div class="chsec" style="--c:var(--${ch.c})"><i></i>${ch.n}. ${esc(T(ch.title))}</div>
      <div class="cgrid">${ch.items.map(id => { const l = C.lessons[id]; if (!(l.cheat || []).length) return '';
        return `<article class="card cheat"><h3>${esc(l.title)}<a href="#/${l.id}/1">${T('ver lección →')}</a></h3><dl>${l.cheat.map(r => `<div><dt>${esc(r[0])}</dt><dd>${r[1]}</dd></div>`).join('')}</dl></article>`; }).join('')}</div>`).join('')}</main>`;
}

/* ---------- render ---------- */
function render() {
  route = parse();
  document.documentElement.lang = C.lang;
  document.body.classList.remove('nav-open');
  if (route.view === 'empty') { app.innerHTML = '<p style="padding:40px;font-family:monospace">No hay lecciones cargadas.</p>'; return; }
  let body, wide = true;
  if (route.view === 'learn') {
    const l = C.lessons[route.id];
    store.last = route.id + '/' + route.step;
    if (route.step === l.steps.length) store.done[route.id] = true;
    save();
    body = lessonView(); wide = false;
    document.title = l.title + ' · ' + T('Redes');
  } else if (route.view === 'practice') { body = practiceView(); document.title = T('Práctica') + ' · ' + T('Redes'); }
  else if (route.view === 'lab') { body = window.LAB ? window.LAB.view(route.arg) : '<main class="page"></main>'; document.title = T('Laboratorio') + ' · ' + T('Redes'); }
  else { body = cheatsView(); document.title = T('Machetes') + ' · ' + T('Redes'); }
  if (ctl) { ctl.destroy(); ctl = null; }
  const sc = $('.side .tree') ? $('.side .tree').scrollTop : 0;
  app.innerHTML = topbar() + `<div class="layout${wide ? ' wide' : ''}">${sidebar()}${body}</div>`;
  if ($('.side .tree')) $('.side .tree').scrollTop = sc;
  if (route.view === 'learn') mountStage();
  if (route.view === 'lab' && window.LAB) window.LAB.mount(route.arg);
}
function loadLang(lang, cb) {
  if (lang !== 'en') { C.setLang('es'); cb(); return; }
  const done = () => { C.setLang('en', window.I18N_EN || {}); cb(); };
  if (window.I18N_EN) { done(); return; }
  const s = document.createElement('script'); s.src = 'js/i18n/en.js'; s.onload = done; s.onerror = done; document.head.appendChild(s);
}
function setLang(lang) { if (lang === C.lang) return; store.lang = lang; save(); loadLang(lang, render); }
function go(path) { if (location.hash === '#/' + path) render(); else location.hash = '#/' + path; }

/* ---------- modales ---------- */
function closeModal() { const m = $('.modal'); if (m) m.remove(); }
function openFig(list) {
  closeModal();
  const d = document.createElement('div'); d.className = 'modal fig';
  d.innerHTML = `<div class="card box">${list.map(f => `<img src="${FIG}${esc(f)}" alt="${T('Figura del apunte')}">`).join('')}<div class="cap"><span>${T('Figura original de tus apuntes (Redes.docx)')}</span><button class="btn sm" data-act="close">${ic('x')}${T('Cerrar')}</button></div></div>`;
  document.body.appendChild(d);
}
function searchIndex() {
  const out = [];
  C.order.forEach(id => {
    const l = C.lessons[id];
    out.push({ m: 1, t: l.title, s: l.chapter.n + '. ' + T(l.chapter.title) + ' — ' + l.desc, h: id + '/1', x: (l.title + ' ' + l.desc).toLowerCase() });
    l.steps.forEach((st, k) => out.push({ t: st.t, s: l.title + ' · ' + T('paso') + ' ' + (k + 1), h: id + '/' + (k + 1), x: (st.t + ' ' + String(st.b).replace(/<[^>]+>/g, ' ') + ' ' + (st.key || '')).toLowerCase() }));
    (l.cheat || []).forEach(r => out.push({ t: r[0], s: T('Machete') + ' · ' + l.title, h: 'machetes', x: (r[0] + ' ' + r[1]).toLowerCase() }));
  });
  return out;
}
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
function openSearch() {
  closeModal();
  const idx = searchIndex(); idx.forEach(r => r.x = norm(r.x));
  const d = document.createElement('div'); d.className = 'modal';
  d.innerHTML = `<div class="card box"><input type="search" placeholder="${T('Buscar: CSMA/CD, ventana, DLCI, handshake…')}" aria-label="${T('Buscar')}"><div class="res"></div></div>`;
  document.body.appendChild(d);
  const inp = $('input', d), res = $('.res', d); let sel = 0, hits = [];
  const draw = () => {
    const q = norm(inp.value.trim().toLowerCase());
    hits = (q ? idx.filter(r => q.split(/\s+/).every(w => r.x.indexOf(w) >= 0)) : idx.filter(r => r.m)).slice(0, 40);
    sel = Math.min(sel, Math.max(0, hits.length - 1));
    res.innerHTML = hits.map((r, k) => `<a href="#/${r.h}" class="${k === sel ? 'sel' : ''}"><b>${esc(r.t)}</b><span>${esc(r.s.slice(0, 110))}</span></a>`).join('') || '<div class="empty">' + T('Sin resultados.') + '</div>';
  };
  inp.addEventListener('input', () => { sel = 0; draw(); });
  inp.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { sel = Math.min(hits.length - 1, sel + 1); draw(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); draw(); e.preventDefault(); }
    else if (e.key === 'Enter' && hits[sel]) { closeModal(); go(hits[sel].h); }
    const a = $('.sel', res); if (a) a.scrollIntoView({ block: 'nearest' });
  });
  draw(); inp.focus();
}

/* ---------- eventos ---------- */
document.addEventListener('click', e => {
  const m = e.target.closest('.modal');
  if (m && (e.target === m || e.target.closest('[data-act="close"]') || e.target.closest('.res a'))) { closeModal(); if (e.target === m) return; }
  const g = e.target.closest('[data-go]'); if (g) { go(g.dataset.go); return; }
  const o = e.target.closest('[data-opt]');
  if (o) { const q = o.closest('.q'); store.quiz[q.dataset.key] = +o.dataset.opt; save(); const y = window.scrollY; render(); window.scrollTo(0, y); return; }
  const a = e.target.closest('[data-act]'); if (!a) { if (document.body.classList.contains('nav-open') && !e.target.closest('.side')) document.body.classList.remove('nav-open'); return; }
  const act = a.dataset.act;
  if (act === 'lang') setLang(a.dataset.lang);
  else if (act === 'theme') { store.theme = theme() === 'dark' ? 'light' : 'dark'; save(); applyTheme(); render(); }
  else if (act === 'menu') document.body.classList.toggle('nav-open');
  else if (act === 'search') openSearch();
  else if (act === 'ch') { const el = a.parentNode; const open = !el.classList.contains('open'); el.classList.toggle('open', open); store.open[a.dataset.id] = open; save(); }
  else if (act === 'replay') { if (ctl) ctl.replay(); setPauseBtn(false); }
  else if (act === 'pause') togglePause();
  else if (act === 'fig') openFig(a.dataset.fig.split(','));
  else if (act === 'quiz-reset') { allQuestions(route.arg).forEach(x => delete store.quiz[x.key]); save(); render(); }
});
function setPauseBtn(p) { const b = $('[data-act="pause"]'); if (b) b.innerHTML = ic(p ? 'play' : 'pause') + '<span>' + T(p ? 'Seguir' : 'Pausa') + '</span>'; }
function togglePause() { if (ctl) setPauseBtn(ctl.toggle()); }
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); return; }
  if (e.key === 'Escape') { closeModal(); document.body.classList.remove('nav-open'); return; }
  if ($('.modal') || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.ctrlKey || e.metaKey || e.altKey) return;
  if (route.view !== 'learn') return;
  const l = C.lessons[route.id];
  if (e.key === 'ArrowRight') {
    if (route.step < l.steps.length) go(route.id + '/' + (route.step + 1));
    else { const nx = C.order[C.order.indexOf(route.id) + 1]; if (nx) go(nx + '/1'); }
  } else if (e.key === 'ArrowLeft') { if (route.step > 1) go(route.id + '/' + (route.step - 1)); }
  else if (e.key.toLowerCase() === 'r') { if (ctl) ctl.replay(); setPauseBtn(false); }
  else if (e.key === ' ') { e.preventDefault(); togglePause(); }
});
window.addEventListener('hashchange', render);

/* ---------- modos de desarrollo: ?validate=1 y ?preview=<id> ---------- */
const qs = new URLSearchParams(location.search);
function boot() {
if (qs.get('extract')) {
  // textos traducibles, sin repetidos, agrupados por la primera lección donde aparecen
  const seen = new Set(), out = {};
  C.chapters.forEach(ch => ch.lessons.forEach(id => { if (C.src[id]) out[id] = C.strings(id).filter(s => !seen.has(s) && (seen.add(s), true)); }));
  document.body.innerHTML = '<pre id="extract">' + esc(JSON.stringify(out)) + '</pre>';
} else if (qs.get('validate')) {
  const only = qs.get('validate') === '1' ? null : qs.get('validate').split(',');
  const out = []; let bad = 0;
  const tmp = document.createElement('div');
  C.chapters.forEach(ch => ch.lessons.forEach(id => {
    if (only && only.indexOf(id) < 0) return;
    const l = C.lessons[id];
    if (!l) { out.push('FALTA   ' + id + '  (no se cargó js/lessons/' + id + '.js, o tiene un error de sintaxis)'); bad++; return; }
    const errs = E.validate(l);
    l.steps.forEach((s, i) => { const c = E.mount(tmp, l, i, { static: true }); if (c.error) errs.push('paso ' + (i + 1) + ': excepción al dibujar → ' + c.error.message); });
    if (errs.length) bad++;
    out.push((errs.length ? 'ERROR   ' : 'OK      ') + id + '  (' + l.steps.length + ' pasos, ' + (l.quiz || []).length + ' preguntas, ' + (l.cheat || []).length + ' filas de machete)' + errs.map(x => '\n          - ' + x).join(''));
  }));
  document.body.innerHTML = '<pre class="val card" id="validation">VALIDACION ' + (bad ? 'CON ' + bad + ' PROBLEMAS' : 'SIN ERRORES') + '\n\n' + esc(out.join('\n')) + '</pre>';
} else if (qs.get('preview')) {
  const l = C.lessons[qs.get('preview')];
  if (!l) document.body.innerHTML = '<pre class="val card">No existe la lección ' + esc(qs.get('preview')) + '</pre>';
  else {
    const a = Math.max(1, +qs.get('from') || 1), b = Math.min(l.steps.length, +qs.get('to') || l.steps.length);
    if (qs.get('theme')) document.documentElement.setAttribute('data-theme', qs.get('theme'));
    let h = '';
    for (let i = a; i <= b; i++) h += `<div class="card cell"><h4>${i}. ${esc(l.steps[i - 1].t)} <span class="kind">${esc(l.steps[i - 1].k || '')}</span></h4><div class="canvas" id="pv${i}"></div><div class="txt">${l.steps[i - 1].b}${l.steps[i - 1].key ? '<p><b>Idea clave:</b> ' + l.steps[i - 1].key + '</p>' : ''}</div></div>`;
    document.body.innerHTML = '<div class="sheet">' + h + '</div>';
    for (let i = a; i <= b; i++) E.mount($('#pv' + i), l, i - 1, { static: true });
  }
} else render();
}
loadLang(qs.get('lang') || store.lang || 'es', boot);
})();

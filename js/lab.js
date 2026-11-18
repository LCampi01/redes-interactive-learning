/* ============================================================
   Laboratorio · calculadoras para practicar con números propios
   ============================================================ */
(function () {
'use strict';
const E = window.ENGINE, esc = E.esc, T = window.T;
const $ = (s, r) => (r || document).querySelector(s);

/* ---------- utilidades IP ---------- */
const ip2int = s => { const p = String(s).trim().split('.'); if (p.length !== 4) return null; let n = 0; for (const x of p) { if (!/^\d{1,3}$/.test(x) || +x > 255) return null; n = n * 256 + (+x); } return n; };
const int2ip = n => [n / 16777216 | 0, (n / 65536 | 0) % 256, (n / 256 | 0) % 256, n % 256].join('.');
const size = p => Math.pow(2, 32 - p);
const netOf = (n, p) => Math.floor(n / size(p)) * size(p);
const maskOf = p => int2ip(4294967296 - size(p));
const wildOf = p => int2ip(size(p) - 1);
const klass = n => { const o = n / 16777216 | 0; return o < 128 ? 'A' : o < 192 ? 'B' : o < 224 ? 'C' : o < 240 ? 'D (multicast)' : 'E (reservada)'; };
const priv = n => { const a = n / 16777216 | 0, b = (n / 65536 | 0) % 256; return a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168); };
const DEC = () => window.COURSE.lang === 'es' ? ',' : '.';
const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, window.COURSE.lang === 'es' ? '.' : ',');
const kv = rows => '<div class="kvs">' + rows.map(r => `<div><span>${esc(T(r[0]))}</span><b>${esc(typeof r[1] === 'string' ? T(r[1]) : r[1])}</b></div>`).join('') + '</div>';
const bad = m => `<div class="bad">${esc(T(m))}</div>`;
const th = cols => '<tr>' + cols.map(c => '<th>' + esc(T(c)) + '</th>').join('') + '</tr>';
const td = c => `<td>${esc(typeof c === 'string' ? T(c) : c)}</td>`;
const COLS = ['green', 'yellow', 'blue', 'purple', 'orange', 'red'];

const TOOLS = {
  subredes: {
    name: 'Subredes', title: 'Calculadora de subredes',
    intro: 'Escribí una dirección, el prefijo de la red original y el prefijo de la subred. Los bits azules son de red, los amarillos son los que "tomaste" para la subred y los verdes quedan para hosts.',
    form: `<label>Dirección IP<input id="l-ip" value="200.1.10.130"></label><label>Prefijo de la red<input id="l-base" type="number" min="0" max="32" value="24"></label><label>Prefijo de la subred<input id="l-sub" type="number" min="0" max="32" value="26"></label>`,
    run() {
      const n = ip2int($('#l-ip').value), base = +$('#l-base').value, sub = +$('#l-sub').value;
      if (n == null) return bad('La dirección IP no es válida (formato a.b.c.d, cada octeto de 0 a 255).');
      if (!(base >= 0 && sub <= 32 && sub >= base)) return bad('El prefijo de subred tiene que ser mayor o igual al de la red, y ambos estar entre 0 y 32.');
      const net = netOf(n, sub), bc = net + size(sub) - 1, hosts = sub >= 31 ? 0 : size(sub) - 2, cnt = Math.pow(2, sub - base);
      const step = { ip: int2ip(n), mask: base, sub: sub, _h: 190 };
      const b0 = netOf(n, base);
      if (base >= 24 && cnt <= 64) {
        step.blocks = []; for (let k = 0; k < cnt; k++) { const a = (b0 + k * size(sub)) % 256; step.blocks.push({ a, b: a + size(sub) - 1, l: '.' + a + '/' + sub, c: COLS[k % COLS.length], hi: b0 + k * size(sub) === net }); }
        step.span = [b0 % 256, b0 % 256 + size(base) - 1]; step.blocksTitle = T(cnt > 1 ? 'Último octeto: {n} subredes /{p}' : 'Último octeto: {n} subred /{p}', { n: cnt, p: sub }); step._h = 290;
      }
      return E.renderBits(step) + kv([
        ['Dirección de subred', int2ip(net) + '/' + sub], ['Broadcast', int2ip(bc)], ['Primer host', hosts ? int2ip(net + 1) : '—'], ['Último host', hosts ? int2ip(bc - 1) : '—'],
        ['Hosts útiles', hosts ? '2^' + (32 - sub) + ' − 2 = ' + fmt(hosts) : '0'], ['Máscara', maskOf(sub)], ['Wildcard', wildOf(sub)], ['Subredes posibles', '2^' + (sub - base) + ' = ' + fmt(cnt)],
        ['Clase (histórica)', klass(n)], ['¿Privada (RFC 1918)?', priv(n) ? 'Sí' : 'No']]);
    }
  },
  vlsm: {
    name: 'VLSM', title: 'Asignación VLSM',
    intro: 'Indicá el bloque disponible y cuántos hosts necesita cada subred. Se asigna de mayor a menor, cada una con la máscara más ajustada, y lo que sobra queda contiguo para crecer.',
    form: `<label>Bloque disponible<input id="l-net" value="200.1.10.0/24"></label><label>Hosts por subred (separados por coma)<input id="l-need" class="w" value="100, 50, 10, 2"></label>`,
    run() {
      const m = $('#l-net').value.trim().match(/^(.+)\/(\d+)$/); if (!m) return bad('Escribí el bloque como a.b.c.d/prefijo, por ejemplo 200.1.10.0/24.');
      const p = +m[2], n0 = ip2int(m[1]); if (n0 == null || p > 30) return bad('Bloque inválido (el prefijo tiene que ser /30 o menor).');
      const needs = $('#l-need').value.split(/[,;\s]+/).filter(Boolean).map(Number);
      if (!needs.length || needs.some(x => !(x > 0))) return bad('Los requerimientos tienen que ser números positivos.');
      const base = netOf(n0, p), end = base + size(p); let cur = base; const rows = [], blocks = [];
      needs.map((h, i) => ({ h, i })).sort((a, b) => b.h - a.h).forEach((r, k) => {
        const bits = Math.max(2, Math.ceil(Math.log2(r.h + 2))), sp = 32 - bits, sz = size(sp);
        cur = Math.ceil(cur / sz) * sz;
        if (cur + sz > end) { rows.push([r.h, 'no entra', '—', '—', '—', '—']); return; }
        rows.push([r.h, int2ip(cur) + '/' + sp, maskOf(sp), int2ip(cur + 1) + ' – ' + int2ip(cur + sz - 2), int2ip(cur + sz - 1), sz - 2]);
        blocks.push({ a: cur - base, b: cur - base + sz - 1, l: '/' + sp + ' · ' + r.h + 'h', c: COLS[k % COLS.length] }); cur += sz;
      });
      if (cur < end) blocks.push({ a: cur - base, b: end - base - 1, l: T('libre'), free: 1 });
      const svg = `<svg class="scene" viewBox="0 0 800 96" xmlns="http://www.w3.org/2000/svg">${E.barSVG({ title: T('Bloque {b} (posiciones relativas al inicio del bloque)', { b: int2ip(base) + '/' + p }), span: [0, size(p) - 1], blocks }, 40, 30, 720, 38)}</svg>`;
      return svg + '<table>' + th(['Necesita', 'Subred', 'Máscara', 'Rango de hosts', 'Broadcast', 'Hosts útiles']) +
        rows.map(r => '<tr>' + r.map(td).join('') + '</tr>').join('') + '</table>' +
        kv([['Direcciones del bloque', fmt(size(p))], ['Asignadas', fmt(cur - base)], ['Libres (contiguas al final)', fmt(Math.max(0, end - cur))]]);
    }
  },
  fragmentacion: {
    name: 'Fragmentación IP', title: 'Fragmentar un datagrama',
    intro: 'Un router tiene que sacar un datagrama por una interfaz con MTU menor. Cada fragmento lleva su propia cabecera de 20 bytes y el offset se escribe en bloques de 8 bytes.',
    form: `<label>Longitud total del datagrama (bytes)<input id="l-len" type="number" value="1500" min="21"></label><label>MTU de salida<input id="l-mtu" type="number" value="620" min="28"></label><label>Flag "no fragmentar"<select id="l-df"><option value="0">DF = 0</option><option value="1">DF = 1</option></select></label>`,
    run() {
      const len = +$('#l-len').value, mtu = +$('#l-mtu').value, df = $('#l-df').value === '1';
      if (!(len > 20) || !(mtu >= 28)) return bad('La longitud debe ser mayor a 20 (cabecera) y el MTU al menos 28.');
      if (len <= mtu) return kv([['Resultado', 'Entra sin fragmentar'], ['Longitud', len + ' bytes'], ['MTU', mtu + ' bytes']]);
      if (df) return bad('DF = 1 y el datagrama no entra: el router lo descarta y avisa con ICMP "fragmentation needed, but DF flag set".');
      const data = len - 20, per = Math.floor((mtu - 20) / 8) * 8, rows = []; let off = 0, k = 1;
      while (off < data) { const d = Math.min(per, data - off); rows.push([k++, d + 20, off + ' – ' + (off + d - 1), off, off / 8, off + d < data ? 1 : 0]); off += d; }
      return '<table>' + th(['Fragmento', 'Longitud total', 'Bytes de datos', 'Desplazamiento', 'Campo offset (÷ 8)', 'Más fragmentos']) +
        rows.map(r => '<tr>' + r.map(c => `<td>${c}</td>`).join('') + '</tr>').join('') + '</table>' +
        kv([['Datos a repartir', data + ' bytes'], ['Datos por fragmento', T('{n} bytes (múltiplo de 8)', { n: per })], ['Fragmentos', rows.length], ['Bytes extra de cabeceras', (rows.length - 1) * 20]]);
    }
  },
  stuffing: {
    name: 'Bit stuffing', title: 'Inserción de ceros (HDLC)',
    intro: 'El flag 01111110 delimita la trama, así que no puede aparecer adentro. El emisor inserta un 0 después de cada cinco 1 seguidos; el receptor lo quita.',
    form: `<label>Bits del mensaje<input id="l-bits" class="w" value="0111111011111011111100"></label>`,
    run() {
      const bits = $('#l-bits').value.replace(/[^01]/g, ''); if (!bits) return bad('Escribí una secuencia de 0 y 1.');
      let out = '', run = 0, ins = 0;
      for (const b of bits) { out += b; if (b === '1') { run++; if (run === 5) { out += '<mark>0</mark>'; ins++; run = 0; } } else run = 0; }
      return `<div class="bitstr"><span class="flag">01111110</span>${out}<span class="flag">01111110</span></div>` +
        kv([['Bits originales', bits.length], ['Ceros insertados', ins], ['Bits en la línea (con flags)', bits.length + ins + 16]]);
    }
  },
  backoff: {
    name: 'Backoff', title: 'Backoff exponencial binario',
    intro: 'Después de la colisión número n, cada estación elige N al azar entre 0 y 2ⁿ − 1 (n se limita a 10) y espera N · 2t. A 10 Mbps, 2t = 51,2 µs: el tiempo de transmitir 64 bytes.',
    form: `<label>Colisiones consecutivas (n)<input id="l-n" type="number" min="1" max="16" value="1"></label><label>&nbsp;<button class="btn" id="l-roll" type="button">Sortear de nuevo</button></label>`,
    run() {
      const n = Math.max(1, Math.min(16, +$('#l-n').value || 1)), k = Math.min(n, 10), max = Math.pow(2, k) - 1;
      const a = Math.floor(Math.random() * (max + 1)), b = Math.floor(Math.random() * (max + 1));
      return kv([['Rango de N', '0 … ' + fmt(max)], ['Prob. de elegir lo mismo', (100 / (max + 1)).toFixed(max > 99 ? 2 : 1).replace('.', DEC()) + ' %'], ['Espera máxima', (max * 51.2 / 1000).toFixed(2).replace('.', DEC()) + ' ms'],
        ['Estación A', 'N = ' + a + ' → ' + (a * 51.2).toFixed(1).replace('.', DEC()) + ' µs'], ['Estación D', 'N = ' + b + ' → ' + (b * 51.2).toFixed(1).replace('.', DEC()) + ' µs'],
        ['Resultado', a === b ? 'Vuelven a chocar' : T('Transmite primero {x}', { x: a < b ? 'A' : 'D' })], ['Intentos restantes', n >= 16 ? '0: se abandona' : String(16 - n)]]);
    }
  },
  cir: {
    name: 'Frame Relay', title: 'CIR, EIR y el bit DE',
    intro: 'El nodo de ingreso cuenta los bits que llegan durante Tc. Lo que entra bajo el CIR pasa con DE = 0; lo que cae en el exceso se marca DE = 1 (descartable si hay congestión); lo que supera CIR + EIR se descarta en el ingreso.',
    form: `<label>CIR (kb en Tc = 1 s)<input id="l-cir" type="number" value="64" min="1"></label><label>EIR (kb)<input id="l-eir" type="number" value="64" min="0"></label><label>Tamaño de las tramas (kb, en orden)<input id="l-fr" class="w" value="20, 20, 20, 30, 30, 25"></label>`,
    run(host) {
      const cir = +$('#l-cir').value, eir = +$('#l-eir').value, fr = $('#l-fr').value.split(/[,;\s]+/).filter(Boolean).map(Number);
      if (!(cir > 0) || !(eir >= 0) || !fr.length || fr.some(x => !(x > 0))) return bad('Revisá los valores: CIR > 0, EIR ≥ 0 y tramas positivas.');
      const tot = fr.reduce((a, b) => a + b, 0), levels = [{ to: cir, l: 'CIR', c: 'green', tag: 'DE = 0' }];
      if (eir > 0) levels.push({ to: cir + eir, l: 'CIR + EIR', c: 'yellow', tag: 'DE = 1' });
      const fake = { id: 'lab', steps: [{ t: 'CIR / EIR', scene: 's', max: Math.max(tot, cir + eir) * 1.12, levels, items: fr.map((v, i) => ({ v, l: T('trama {n}', { n: i + 1 }) })) }], scenes: { s: { kind: 'stack', unit: 'kb' } } };
      host.innerHTML = '<div id="l-stage"></div>' + kv([['Access rate mínimo', (cir + eir) + ' kb/s'], ['Enviado en Tc', tot + ' kb'], ['Comprometido', Math.min(tot, cir) + ' kb'], ['En exceso', Math.max(0, Math.min(tot, cir + eir) - cir) + ' kb']]);
      if (TOOLS.cir.ctl) TOOLS.cir.ctl.destroy();
      TOOLS.cir.ctl = E.mount($('#l-stage', host), fake, 0, {});
      return null;
    }
  },
  tcp: {
    name: 'TCP', title: 'MSS, ventana y stop-and-wait',
    intro: 'Tres cuentas que aparecen todo el tiempo: el MSS que se anuncia en el SYN, la ventana real cuando hay window scale, y cuántos paquetes por segundo permite stop-and-wait según el retardo de ida y vuelta.',
    form: `<label>MTU de la interfaz<input id="l-mtu2" type="number" value="1500"></label><label>Campo Window<input id="l-win" type="number" value="513"></label><label>Window scale (exponente)<input id="l-ws" type="number" value="8" min="0" max="14"></label><label>Round trip delay (ms)<input id="l-rtd" type="number" value="250" min="1"></label>`,
    run() {
      const mtu = +$('#l-mtu2').value, win = +$('#l-win').value, ws = +$('#l-ws').value, rtd = +$('#l-rtd').value;
      if (!(mtu > 40) || !(win >= 0) || !(ws >= 0) || !(rtd > 0)) return bad('Revisá los valores ingresados.');
      const real = win * Math.pow(2, ws), mss = mtu - 40;
      return kv([['MSS = MTU − 40', mss + ' bytes'], ['Ventana real', win + ' × 2^' + ws + ' = ' + fmt(real) + ' bytes'], ['Segmentos MSS en la ventana', Math.floor(real / mss)],
        ['Stop-and-wait', T('{n} paquetes/s', { n: (1000 / rtd).toFixed(1).replace('.', DEC()) })], ['Con ventana de 4', T('{n} paquetes/s', { n: (4000 / rtd).toFixed(1).replace('.', DEC()) })], ['RTO razonable', T('algo mayor a {n} ms', { n: rtd })]]);
    }
  }
};
const ORDER = ['subredes', 'vlsm', 'fragmentacion', 'stuffing', 'backoff', 'cir', 'tcp'];

window.LAB = {
  view(arg) {
    const id = TOOLS[arg] ? arg : ORDER[0], t = TOOLS[id];
    return `<main class="page"><header><span class="eyebrow">${T('Laboratorio')}</span><h1>${T('Probá con tus propios números')}</h1><p>${T('Calculadoras para resolver los ejercicios típicos de la materia y comprobar tus cuentas.')}</p></header>
      <div class="chips">${ORDER.map(k => `<a class="chip${k === id ? ' on' : ''}" href="#/laboratorio/${k}" style="text-decoration:none">${esc(T(TOOLS[k].name))}</a>`).join('')}</div>
      <section class="card tool"><h2>${esc(T(t.title))}</h2><p>${esc(T(t.intro))}</p><form class="form" id="l-form" onsubmit="return false">${t.form.replace(/<label>([^<&]+)</g, (m, s) => '<label>' + esc(T(s)) + '<').replace('>Sortear de nuevo<', '>' + T('Sortear de nuevo') + '<')}</form><div class="out" id="l-out"></div></section></main>`;
  },
  mount(arg) {
    const id = TOOLS[arg] ? arg : ORDER[0], t = TOOLS[id], out = $('#l-out'), form = $('#l-form');
    if (!out) return;
    const run = () => { let h; try { h = t.run(out); } catch (e) { h = `<div class="bad">${esc(T('No se pudo calcular:') + ' ' + e.message)}</div>`; } if (h != null) out.innerHTML = h; };
    form.addEventListener('input', run); form.addEventListener('change', run);
    const roll = $('#l-roll'); if (roll) roll.addEventListener('click', run);
    run();
  }
};
})();

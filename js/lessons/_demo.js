/* Lección de demostración del motor: un paso por cada tipo de escena.
   No está en el índice del curso (js/course.js); se ve con  index.html?preview=_demo  */
COURSE.add({
  id: '_demo', title: 'Demo del motor', desc: 'Un ejemplo de cada tipo de escena.', min: 1, level: 'Dev',
  learn: ['Ver todos los tipos de escena'],
  stats: [{ k: 'a', l: 'Dato A' }, { k: 'b', l: 'Dato B' }],
  scenes: {
    red: {
      kind: 'topo',
      zones: [{ id: 'z1', x: 30, y: 60, w: 330, h: 300, l: 'VLAN 10', c: 'green' }, { id: 'z2', x: 440, y: 60, w: 330, h: 300, l: 'VLAN 20', c: 'purple' }],
      nodes: [
        { id: 'PC1', t: 'pc', x: 90, y: 130, l: 'PC1', sub: '10.0.0.5' }, { id: 'PC2', t: 'pc', x: 90, y: 290, l: 'PC2' },
        { id: 'SW', t: 'switch', x: 260, y: 210, l: 'Switch' }, { id: 'R', t: 'router', x: 400, y: 210, l: 'Router' },
        { id: 'AP', t: 'ap', x: 540, y: 210, l: 'AP' }, { id: 'SRV', t: 'server', x: 700, y: 130, l: 'Servidor' }, { id: 'TEL', t: 'phone', x: 700, y: 290, l: 'Celular' }
      ],
      links: [{ a: 'PC1', b: 'SW' }, { a: 'PC2', b: 'SW' }, { a: 'SW', b: 'R', l: 'trunk 802.1Q', thick: 1 }, { a: 'R', b: 'AP' }, { a: 'AP', b: 'SRV', dash: 1 }, { a: 'AP', b: 'TEL', wl: 1 }]
    },
    estados: {
      kind: 'topo',
      nodes: [
        { id: 'closed', t: 'state', x: 140, y: 110, l: 'CLOSED', c: 'gray' }, { id: 'syn', t: 'state', x: 400, y: 110, l: 'SYN_SENT', c: 'yellow' },
        { id: 'est', t: 'state', x: 660, y: 110, l: 'ESTABLISHED', c: 'green' }, { id: 'fin', t: 'state', x: 400, y: 300, l: 'FIN_WAIT_1', c: 'orange' },
        { id: 'caja', t: 'box', x: 140, y: 300, w: 170, h: 54, l: 'Caja con texto', sub: 'y subtítulo', c: 'blue' }
      ],
      links: [{ a: 'closed', b: 'syn', arrow: 1, l: 'envía SYN' }, { a: 'syn', b: 'est', arrow: 1, l: 'recibe SYN+ACK\nenvía ACK' }, { a: 'est', b: 'fin', arrow: 1, l: 'envía FIN', curve: 40 }, { a: 'fin', b: 'closed', arrow: 1, dash: 1, curve: -30 }]
    },
    hs: {
      kind: 'seq',
      actors: [{ id: 'C', l: 'Cliente', t: 'pc' }, { id: 'S', l: 'Servidor', t: 'server' }],
      msgs: [
        { f: 'C', to: 'S', l: 'SYN · seq = x', c: 'ctl' }, { f: 'S', to: 'C', l: 'SYN + ACK · seq = y, ack = x+1', c: 'ctl' }, { f: 'C', to: 'S', l: 'ACK · ack = y+1', c: 'ctl' },
        { div: 'transferencia de datos' }, { f: 'C', to: 'S', l: 'datos (200 bytes)', c: 'req' }, { f: 'S', to: 'C', l: 'ACK que se pierde', c: 'res', lost: 1 }, { at: 'C', note: 'expira el RTO', c: 'red' }, { f: 'C', to: 'S', l: 'retransmisión', c: 'bad' }
      ]
    },
    trama: {
      kind: 'fields', title: 'Trama Ethernet', rh: 50,
      rows: [[{ id: 'pre', l: 'Preámbulo', s: '7 B', w: 7, c: 'gray' }, { id: 'sfd', l: 'SFD', s: '1', w: 2.2, c: 'gray' }, { id: 'da', l: 'MAC destino', s: '6 B', w: 6, c: 'green' }, { id: 'sa', l: 'MAC origen', s: '6 B', w: 6, c: 'blue' }, { id: 'tag', l: 'Tag', s: '4 B', w: 4, c: 'yellow' }, { id: 'len', l: 'Len/Type', s: '2 B', w: 3.5, c: 'purple' }, { id: 'dat', l: 'Datos + Pad', s: '46 – 1500 B', w: 12, c: 'white' }, { id: 'fcs', l: 'FCS', s: '4 B', w: 4, c: 'orange' }]],
      zoom: { from: 'tag', title: 'Dentro del tag 802.1Q', rows: [[{ id: 'tpid', l: 'Ethertype 0x8100', s: '16 bits', w: 16, c: 'yellow' }, { id: 'pri', l: 'PRI', s: '3 bits', w: 4, c: 'red' }, { id: 'cfi', l: 'CFI', s: '1', w: 2, c: 'gray' }, { id: 'vid', l: 'VLAN ID', s: '12 bits', w: 12, c: 'green' }]] }
    },
    cab: {
      kind: 'fields', title: 'Cabecera con regla de 32 bits', ruler: 32, rh: 40,
      rows: [
        [{ id: 'v', l: 'Versión', s: '4', w: 4, c: 'gray' }, { id: 'hl', l: 'HLEN', s: '4', w: 4, c: 'gray' }, { id: 'tos', l: 'ToS', s: '8', w: 8, c: 'yellow' }, { id: 'tl', l: 'Longitud total', s: '16', w: 16, c: 'blue' }],
        [{ id: 'idn', l: 'Identificación', s: '16', w: 16, c: 'green' }, { id: 'fl', l: 'Flags', s: '3', w: 3, c: 'orange' }, { id: 'off', l: 'Offset', s: '13', w: 13, c: 'orange' }]
      ]
    },
    ip: { kind: 'bits' }, cw: { kind: 'chart', xl: 'rondas (RTT)', yl: 'segmentos' }, cir: { kind: 'stack', unit: 'kb' }
  },
  steps: [
    { s: 'topo', k: 'mecanismo', t: 'Topología con paquetes, zonas, tabla y nota', b: '<p>Paquetes en secuencia y en paralelo.</p>', scene: 'red', hi: ['SW'], x: ['AP-SRV'], tags: { PC1: 'origen', TEL: 'asociado' },
      pk: [{ p: ['PC1', 'SW'], l: 'trama' }, { p: ['SW', 'PC2'], l: 'copia', c: 'res', par: 0 }, { p: ['SW', 'R', 'AP'], l: 'tag 10', c: 'key', par: 1 }, { p: ['AP', 'SRV'], l: 'bloqueado', c: 'bad', drop: 1, dropAt: .5 }],
      fx: [{ k: 'wave', at: 'AP', c: 'ctl', t: 1.5, r: 130 }],
      tbl: { x: 180, y: 300, w: 190, title: 'Tabla MAC', cols: ['MAC', 'Puerto'], rows: [['aa:aa', '1'], ['bb:bb', '2']], hi: 0 },
      notes: [{ x: 450, y: 320, w: 220, c: 'yellow', text: 'Las <b>notas</b> aceptan HTML y hacen salto de línea solas.' }], st: { a: '1', b: '10 Mbps' } },
    { s: 'estados', k: 'detalle', t: 'Diagrama de estados (topo con state/box)', b: '<p>Nodos <code>state</code> y <code>box</code>, links con flecha y curva.</p>', scene: 'estados', hi: ['syn'], pk: [{ p: ['closed', 'syn'], l: 'SYN', c: 'ctl' }, { p: ['syn', 'est'], l: 'ACK', c: 'ctl' }, { p: ['est', 'fin'], c: 'bad' }], st: { a: '2' } },
    { s: 'seq', k: 'mecanismo', t: 'Secuencia: primeros mensajes', b: '<p><code>upto</code> controla cuántas filas se ven.</p>', scene: 'hs', upto: 3, states: { C: 'SYN_SENT', S: 'LISTEN' } },
    { s: 'seq 2', k: 'ejemplo', t: 'Secuencia: el resto (los viejos se atenúan)', b: '<p>Mensaje perdido, nota y divisor.</p>', scene: 'hs', states: { C: 'ESTABLISHED', S: 'ESTABLISHED' } },
    { s: 'fields', k: 'detalle', t: 'Campos con resaltado, zoom y detalle', b: '<p><code>hi</code>, <code>zoom</code> y <code>det</code>.</p>', scene: 'trama', hi: ['tag', 'vid'], zoom: 1, det: '<b>VLAN ID</b>: 12 bits → hasta 4096 VLANs. El detalle acepta <code>HTML</code>.' },
    { s: 'regla', k: 'detalle', t: 'Cabecera con varias filas y regla de bits', b: '<p>Sin <code>hi</code> se ven todos los colores.</p>', scene: 'cab', det: 'Cada fila mide 32 bits.' },
    { s: 'bits', k: 'ejemplo', t: 'Dirección IP en bits, máscara y bloques', b: '<p>Red, subred y host.</p>', scene: 'ip', ip: '200.1.10.130', mask: 24, sub: 26,
      lines: [{ l: 'Subred', v: '200.1.10.128/26' }, { l: 'Hosts', v: '.129 – .190', hi: 1 }, { l: 'Broadcast', v: '200.1.10.191' }, { l: 'Máscara', v: '255.255.255.192' }],
      blocksTitle: 'Último octeto: 4 subredes /26', blocks: [{ a: 0, b: 63, l: '.0/26', c: 'green' }, { a: 64, b: 127, l: '.64/26', c: 'yellow' }, { a: 128, b: 191, l: '.128/26', c: 'blue', hi: 1 }, { a: 192, b: 255, l: 'libre', free: 1 }] },
    { s: 'chart', k: 'ejemplo', t: 'Gráfico de líneas', b: '<p>Series, marcas y líneas horizontales.</p>', scene: 'cw', ymax: 20,
      series: [{ l: 'cwnd', c: 'req', pts: [1, 2, 4, 8, 16, 1, 2, 4, 8, 4, 5, 6] }], marks: [{ i: 5, l: 'RTO → vuelve a 1', c: 'bad' }, { i: 9, l: '3 ACK dup → mitad', c: 'ctl' }], hline: [{ y: 18, l: 'crédito del receptor', c: 'purple' }] },
    { s: 'stack', k: 'resumen', t: 'Medidor apilado (CIR / EIR)', b: '<p>Cada ítem toma el color del nivel donde cae.</p>', scene: 'cir', title: 'Tramas en un Tc de 1 s', max: 170,
      levels: [{ to: 64, l: 'CIR (Bc)', c: 'green', tag: 'DE = 0' }, { to: 128, l: 'CIR + EIR', c: 'yellow', tag: 'DE = 1' }], items: [{ v: 25, l: 'trama 1' }, { v: 25, l: 'trama 2' }, { v: 30, l: 'trama 3' }, { v: 35, l: 'trama 4' }, { v: 30, l: 'trama 5' }] }
  ],
  quiz: [], cheat: []
});

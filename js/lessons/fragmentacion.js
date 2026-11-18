COURSE.add({
  id: 'fragmentacion',
  title: 'Fragmentación y reensamblado',
  desc: 'Qué hace IP cuando un datagrama no entra en la red que tiene que cruzar: quién lo parte, quién lo vuelve a armar, qué dice cada fragmento en su cabecera y por qué hoy casi todos piden no fragmentar.',
  min: 10, level: 'Intermedio',
  learn: [
    'Qué es la MTU y por qué IP tiene que adaptar el datagrama a cada red',
    'Quién fragmenta (el router que lo necesita) y quién reensambla (solo el destino)',
    'Qué comparten los fragmentos y cómo se usan el offset y el flag "más fragmentos"',
    'Qué hace el flag "no fragmentar" y qué desventajas tiene fragmentar',
    'Cómo se vuelve a fragmentar un fragmento sin perder su lugar en el original'
  ],
  stats: [{ k: 'dg', l: 'Datagrama' }, { k: 'mtu', l: 'MTU del salto' }, { k: 'fr', l: 'Fragmentos' }],
  legend: [['req', 'datagrama / fragmento'], ['key', 'con "no fragmentar"'], ['ctl', 'aviso ICMP'], ['bad', 'descartado / perdido']],
  scenes: {
    mtu: {
      kind: 'topo',
      nodes: [
        { id: 'tr', t: 'box', x: 200, y: 120, w: 290, h: 54, l: 'Capa de transporte', sub: 'entrega un paquete de 20 000 bytes', c: 'blue' },
        { id: 'ip', t: 'box', x: 200, y: 228, w: 290, h: 54, l: 'IP', sub: 'adapta el paquete a la MTU de abajo', c: 'yellow' },
        { id: 'enl', t: 'box', x: 200, y: 336, w: 290, h: 54, l: 'Capa de enlace: Ethernet', sub: 'MTU = 1500 bytes', c: 'green' }
      ],
      links: [{ a: 'tr', b: 'ip', arrow: 1 }, { a: 'ip', b: 'enl', arrow: 1 }]
    },
    viaje: {
      kind: 'topo',
      zones: [{ id: 'net2', x: 300, y: 95, w: 200, h: 210, l: 'NET 2 · MTU = 620 bytes', c: 'yellow' }],
      nodes: [
        { id: 'A', t: 'pc', x: 70, y: 200, l: 'A' },
        { id: 'R1', t: 'router', x: 220, y: 200, l: 'R1' },
        { id: 'R2', t: 'router', x: 580, y: 200, l: 'R2' },
        { id: 'B', t: 'pc', x: 730, y: 200, l: 'B' },
        { id: 'd1', t: 'dot', x: 400, y: 145 }, { id: 'd2', t: 'dot', x: 400, y: 200 }, { id: 'd3', t: 'dot', x: 400, y: 255 }
      ],
      links: [{ a: 'A', b: 'R1', l: 'MTU 1500', ly: -12 }, { a: 'R1', b: 'R2' }, { a: 'R2', b: 'B', l: 'MTU 1500', ly: -12 }]
    },
    frag: {
      kind: 'fields', title: 'Un datagrama de 1500 bytes pasa a ser tres', rh: 46,
      rows: [
        [{ id: 'h0', l: 'Cabecera', s: '20 B', w: 2.4, c: 'gray' }, { id: 'o1', l: 'Datos 1', s: '600 bytes', w: 6, c: 'green' }, { id: 'o2', l: 'Datos 2', s: '600 bytes', w: 6, c: 'blue' }, { id: 'o3', l: 'Datos 3', s: '280 bytes', w: 2.8, c: 'orange' }],
        [{ id: 'h1', l: 'Cab. F1', s: '20 B', w: 2.4, c: 'yellow' }, { id: 'f1', l: 'Datos 1', s: '600 bytes', w: 6, c: 'green' }, { id: 'g1', l: 'Fragmento 1 · 620 bytes en total', w: 8.8, c: 'white', ghost: 1 }],
        [{ id: 'h2', l: 'Cab. F2', s: '20 B', w: 2.4, c: 'yellow' }, { id: 'f2', l: 'Datos 2', s: '600 bytes', w: 6, c: 'blue' }, { id: 'g2', l: 'Fragmento 2 · 620 bytes en total', w: 8.8, c: 'white', ghost: 1 }],
        [{ id: 'h3', l: 'Cab. F3', s: '20 B', w: 2.4, c: 'yellow' }, { id: 'f3', l: 'Datos 3', s: '280 bytes', w: 2.8, c: 'orange' }, { id: 'g3', l: 'Fragmento 3 · 300 bytes en total', w: 12, c: 'white', ghost: 1 }]
      ]
    },
    hdrs: {
      kind: 'fields', title: 'Qué dice la cabecera de cada fragmento', rh: 46,
      rows: [
        [{ id: 'c0', l: '', w: 3.4, c: 'white', ghost: 1 }, { id: 'cid', l: 'Identificación', w: 5, c: 'gray' }, { id: 'cip', l: 'IP origen y destino', w: 6, c: 'gray' }, { id: 'cln', l: 'Longitud total', w: 4.6, c: 'gray' }, { id: 'cmf', l: 'Más fragmentos', w: 5, c: 'gray' }, { id: 'cof', l: 'Offset', w: 5, c: 'gray' }],
        [{ id: 'n1', l: 'Fragmento 1', w: 3.4, c: 'yellow' }, { id: 'i1', l: 'la del original', w: 5, c: 'green' }, { id: 'p1', l: 'las del original', w: 6, c: 'green' }, { id: 'l1', l: '620', s: '20 + 600', w: 4.6, c: 'blue' }, { id: 'm1', l: '1', s: 'vienen más', w: 5, c: 'orange' }, { id: 'x1', l: '0', s: 'byte 0', w: 5, c: 'orange' }],
        [{ id: 'n2', l: 'Fragmento 2', w: 3.4, c: 'yellow' }, { id: 'i2', l: 'la del original', w: 5, c: 'green' }, { id: 'p2', l: 'las del original', w: 6, c: 'green' }, { id: 'l2', l: '620', s: '20 + 600', w: 4.6, c: 'blue' }, { id: 'm2', l: '1', s: 'vienen más', w: 5, c: 'orange' }, { id: 'x2', l: '75', s: 'byte 600 ÷ 8', w: 5, c: 'orange' }],
        [{ id: 'n3', l: 'Fragmento 3', w: 3.4, c: 'yellow' }, { id: 'i3', l: 'la del original', w: 5, c: 'green' }, { id: 'p3', l: 'las del original', w: 6, c: 'green' }, { id: 'l3', l: '300', s: '20 + 280', w: 4.6, c: 'blue' }, { id: 'm3', l: '0', s: 'es el último', w: 5, c: 'orange' }, { id: 'x3', l: '150', s: 'byte 1200 ÷ 8', w: 5, c: 'orange' }]
      ]
    },
    viaje2: {
      kind: 'topo',
      nodes: [
        { id: 'A', t: 'pc', x: 60, y: 150, l: 'A' },
        { id: 'R1', t: 'router', x: 190, y: 150, l: 'R1' },
        { id: 'R3', t: 'router', x: 400, y: 150, l: 'R3' },
        { id: 'R2', t: 'router', x: 610, y: 150, l: 'R2' },
        { id: 'B', t: 'pc', x: 740, y: 150, l: 'B' }
      ],
      links: [{ a: 'A', b: 'R1', l: 'MTU 1500', ly: -12 }, { a: 'R1', b: 'R3', l: 'MTU 620', ly: -58 }, { a: 'R3', b: 'R2', l: 'MTU 576', ly: -78 }, { a: 'R2', b: 'B', l: 'MTU 1500', ly: -12 }]
    }
  },
  steps: [
    {
      s: 'MTU', k: 'contexto', t: 'Cada red tiene su MTU',
      b: '<p>Las distintas tecnologías de enlace tienen <b>distinta capacidad de transporte</b>. Cada una tiene su <b>MTU</b> (Maximum Transfer Unit): el tamaño máximo que puede llevar.</p><p>Si la capa de transporte entrega un paquete de 20 000 bytes y en la capa de enlace hay Ethernet, la capacidad es mucho menor. IP debe <b>adaptar el paquete</b> a las limitaciones del protocolo de enlace.</p><p>Ese mecanismo de IP es la <b>fragmentación y el reensamblado</b>.</p>',
      key: 'La MTU la impone la red de abajo; el que se adapta es IP.',
      fig: 'image55.png', scene: 'mtu', hi: ['ip'],
      pk: [{ p: ['tr', 'ip'], l: '20 000 bytes', d: 1.3 }, { p: ['ip', 'enl'], l: 'de a 1500', c: 'res', d: 1.3 }],
      tbl: { x: 455, y: 112, w: 280, title: 'MTU de cada red', cols: ['Red', 'MTU (bytes)'], rows: [['Token Ring 16 Mbps', '17914'], ['IEEE 802.3 (Ethernet)', '1500'], ['X.25', '576']], hi: 1 },
      notes: [{ x: 455, y: 240, w: 280, c: 'yellow', text: 'Un mismo datagrama puede tener que cruzar redes con MTU muy distintas antes de llegar a destino.' }],
      st: { dg: '—', mtu: '—', fr: '—' }
    },
    {
      s: 'El ejemplo', k: 'problema', t: 'De A a B, con una red más chica en el medio',
      b: '<p>A quiere enviarle un mensaje a B. Le envía a <b>R1</b> un datagrama IP con una longitud total de <b>1500 bytes</b>, el máximo que le permite su red.</p><p>R1 analiza la IP destino y decide que tiene que sacarlo por la interfaz de <b>NET 2</b>. Pero esa interfaz tiene una MTU de <b>620 bytes</b>: el datagrama <b>no cabe</b> en la red que debe cruzar.</p>',
      key: 'El problema aparece en el medio del camino: A no sabe qué redes hay más adelante.',
      fig: 'image56.png', scene: 'viaje', hi: ['R1', 'net2'], tags: { R1: '1500 > 620: no cabe' },
      pk: [{ p: ['A', 'R1'], l: '1500 bytes', d: 1.5, stay: 1 }],
      notes: [{ x: 250, y: 328, w: 300, c: 'yellow', text: 'R1 mira la <b>IP destino</b> → debe salir por NET 2 → la MTU de esa interfaz es <b>620</b> y el datagrama mide <b>1500</b>.' }],
      st: { dg: '1500 bytes', mtu: '620 bytes', fr: '—' }
    },
    {
      s: 'R1 parte', k: 'mecanismo', t: 'R1 fragmenta',
      b: '<p>R1 <b>parte el datagrama en fragmentos</b> que sí entran en la MTU de 620 y los envía por esa interfaz.</p><p>Cuando un datagrama IP se fragmenta, se convierte en <b>múltiples datagramas IP</b>: cada fragmento lleva su propia cabecera.</p><p>De los 1500 bytes, 20 son de cabecera y 1480 de datos. Los datos se reparten en <b>600 + 600 + 280</b> y cada parte recibe una cabecera de 20 bytes.</p>',
      key: 'Un datagrama entra a R1; salen tres.',
      scene: 'viaje', hi: ['R1'], tags: { R1: 'fragmenta en 3' },
      pk: [
        { p: ['A', 'R1'], l: '1500 bytes', t: 0, d: 1.1 },
        { p: ['R1', 'd1', 'R2'], l: 'F1 · 620 B', t: 1.2, d: 1.9 }, { p: ['R1', 'd2', 'R2'], l: 'F2 · 620 B', t: 1.45, d: 1.9 }, { p: ['R1', 'd3', 'R2'], l: 'F3 · 300 B', t: 1.7, d: 1.9 }
      ],
      tbl: { x: 265, y: 322, w: 290, cols: ['Fragmento', 'Cabecera', 'Datos', 'Longitud total'], rows: [['F1', '20 B', '600 B', '620 B'], ['F2', '20 B', '600 B', '620 B'], ['F3', '20 B', '280 B', '300 B']] },
      st: { fr: '3 (620 + 620 + 300)' }
    },
    {
      s: 'B rearma', k: 'mecanismo', t: 'R2 conmuta, B reensambla',
      b: '<p><b>R2</b> recibe tres datagramas. <b>No sabe que son fragmentos</b>: los conmuta como si fuesen tres datagramas diferentes con destino a B.</p><p>En <b>B</b>, el protocolo IP recibe tres datagramas que en la cabecera tienen la información de que son fragmentos de un paquete mayor. IP los toma, <b>reconstruye</b> el datagrama original y lo entrega a la capa de transporte.</p><p>Es IP quien fragmenta y quien reensambla.</p>',
      key: 'Fragmenta el router que lo necesita; reensambla únicamente el destino.',
      scene: 'viaje', hi: ['R2', 'B'], tags: { R2: 'conmuta 3 datagramas', B: 'reensambla' }, ll: { 'R2-B': '' },
      pk: [
        { p: ['R1', 'd1', 'R2'], l: 'F1', t: 0, d: 1.6 }, { p: ['R1', 'd2', 'R2'], l: 'F2', t: .25, d: 1.6 }, { p: ['R1', 'd3', 'R2'], l: 'F3', t: .5, d: 1.6 },
        { p: ['R2', [655, 165], 'B'], l: 'F1', t: 2.2, d: 1.4 }, { p: ['R2', 'B'], l: 'F2', t: 2.45, d: 1.4 }, { p: ['R2', [655, 235], 'B'], l: 'F3', t: 2.7, d: 1.4 }
      ],
      notes: [{ x: 250, y: 328, w: 300, c: 'yellow', text: 'R2 <b>no los vuelve a unir</b>, aunque la red que sigue tenga MTU 1500: para él son tres datagramas como cualquier otro. Recién <b>B</b> recupera los 1500 bytes.' }],
      st: { mtu: '1500 bytes (después de R2)' }
    },
    {
      s: 'Por dentro', k: 'ejemplo', t: 'Los fragmentos por dentro',
      b: '<p>Cada fragmento se convierte en un <b>datagrama independiente</b>, con su propia cabecera.</p><p>Las tres cabeceras comparten datos <b>inmutables</b>, copiados del original:</p><ul><li>el <b>identificador</b>,</li><li>la <b>IP origen</b>,</li><li>la <b>IP destino</b>.</li></ul><p>Así el destino sabe que los tres pertenecen al mismo datagrama. Lo que <b>cambia</b> de uno a otro son un flag y el campo de <b>desplazamiento</b> (offset), que dicen qué lugar ocupa ese pedazo.</p>',
      key: 'Mismo identificador y mismas direcciones = fragmentos del mismo datagrama.',
      fig: 'image57.png', scene: 'frag',
      det: 'Arriba, el original: 20 + 600 + 600 + 280 = <b>1500</b> bytes. Abajo, lo que viaja por NET 2: 620 + 620 + 300 = <b>1540</b> bytes. Cada fragmento paga su propia cabecera.',
      st: { mtu: '620 bytes' }
    },
    {
      s: 'Offset', k: 'ejemplo', t: 'El offset y el flag "más fragmentos"',
      b: '<p>El <b>offset</b> indica dónde van los datos del fragmento dentro del original: en el byte 0, el 600 y el 1200.</p><p>Pero no se guarda el valor absoluto: haría falta un campo tan grande como el de longitud. Para achicarlo, se escribe en <b>múltiplos de 8 bytes</b>: 600 son <b>75</b> bloques y 1200 son <b>150</b>.</p><p>El flag <b>más fragmentos</b> vale 0 si es el último (o el único) fragmento. Con él, el destino evalúa si ya tiene todos.</p>',
      key: 'Offset = posición en bytes ÷ 8. Más fragmentos = 0 solo en el último.',
      fig: 'image58.png', scene: 'hdrs', hi: ['cmf', 'cof', 'm1', 'm2', 'm3', 'x1', 'x2', 'x3'],
      det: '600 ÷ 8 = <b>75</b> · 1200 ÷ 8 = <b>150</b>. El campo Offset tiene 13 bits; contando de a 8 bytes alcanza para ubicar un pedazo en cualquier lugar de un datagrama de hasta 65 535 bytes.',
      st: { fr: 'offsets 0 · 75 · 150' }
    },
    {
      s: 'No fragmentar', k: 'detalle', t: 'El flag "no fragmentar"',
      b: '<p>El otro flag, <b>no fragmentar</b>, impide la fragmentación.</p><p>Si un router necesita fragmentar un datagrama y ese bit está encendido, no puede hacerlo: <b>descarta el paquete</b>.</p><p>En los routers corre además otro protocolo, <b>ICMP</b>, que interviene en este caso: con él se le avisa al origen que el datagrama no pudo seguir.</p>',
      key: 'Con "no fragmentar", si no entra entero, no pasa.',
      scene: 'viaje', hi: ['R1'], tags: { R1: 'debe fragmentar y no puede' },
      pk: [
        { p: ['A', 'R1'], l: 'DF = 1', c: 'key', d: 1.3 },
        { p: ['R1', 'd2'], l: 'no cabe', c: 'bad', d: 1, drop: 1, dropAt: .6 },
        { p: ['R1', [145, 262], 'A'], l: 'ICMP: aviso', c: 'ctl', d: 1.5 }
      ],
      notes: [{ x: 250, y: 328, w: 300, c: 'yellow', text: '<b>DF = 1</b>: el datagrama de 1500 bytes lleva encendido el bit <b>no fragmentar</b>. R1 no puede partirlo: lo descarta y el aviso vuelve hacia A.' }],
      st: { dg: '1500 bytes · no fragmentar', fr: '0: se descarta' }
    },
    {
      s: 'Desventajas', k: 'problema', t: 'Por qué se evita fragmentar',
      b: '<p>Fragmentar convierte un datagrama en varios, e IP es <b>no confiable</b>: cada uno tiene su probabilidad de perderse. Si partimos un datagrama en tres, <b>se triplica la probabilidad de pérdida</b>.</p><p>Además genera <b>más carga de procesamiento</b> en los routers, que deben fragmentar y crear un paquete por cada fragmento.</p><p>Por eso una aplicación puede solicitar <b>no fragmentar</b>. En la actualidad, la mayoría lo hace.</p>',
      key: 'Tres fragmentos = tres oportunidades de perder el datagrama entero.',
      scene: 'viaje', hi: ['B'], tags: { B: 'falta F2' }, ll: { 'R2-B': '' },
      pk: [
        { p: ['R1', 'd1', 'R2'], l: 'F1', t: 0, d: 1.6 },
        { p: ['R1', 'd2', 'R2'], l: 'F2', c: 'bad', t: .25, d: 1.6, drop: 1, dropAt: .55 },
        { p: ['R1', 'd3', 'R2'], l: 'F3', t: .5, d: 1.6 },
        { p: ['R2', [655, 165], 'B'], l: 'F1', t: 2.2, d: 1.4 }, { p: ['R2', [655, 235], 'B'], l: 'F3', t: 2.45, d: 1.4 }
      ],
      notes: [{ x: 250, y: 328, w: 300, c: 'red', text: 'Se perdió un solo fragmento, pero B <b>no puede reconstruir</b> el datagrama: los otros dos viajaron para nada.' }],
      st: { dg: '1500 bytes', fr: '3 → llegan 2' }
    },
    {
      s: 'Refragmentar', k: 'detalle', t: 'Fragmentar un fragmento',
      b: '<p>La fragmentación puede hacerse de manera <b>reiterada</b>. Si más adelante hay una interfaz con una MTU todavía menor, hay que <b>fragmentar los fragmentos</b>.</p><p>Como los fragmentos ya vienen con offset, el nuevo offset se calcula <b>relativo al datagrama original</b>, no al fragmento que se está partiendo.</p><p>En el ejemplo, R3 debe sacar los tres fragmentos por una red con MTU 576: en vez de tres llegan cinco, cada uno con su lugar en el original.</p>',
      key: 'No importa cuántas veces se parta: el offset siempre habla del datagrama original.',
      fig: 'image59.png', scene: 'viaje2', hi: ['R3'], tags: { R3: 'vuelve a fragmentar' },
      pk: [
        { p: ['R1', [295, 110], 'R3'], l: 'F1 · 0', t: 0, d: 1.5 }, { p: ['R1', 'R3'], l: 'F2 · 75', t: 0, d: 1.5 }, { p: ['R1', [295, 190], 'R3'], l: 'F3 · 150', t: 0, d: 1.5 },
        { p: ['R3', [505, 90], 'R2'], l: 'F1a · 0', t: 1.8, d: 1.7 }, { p: ['R3', [505, 120], 'R2'], l: 'F1b · 69', t: 1.8, d: 1.7 }, { p: ['R3', 'R2'], l: 'F2a · 75', t: 1.8, d: 1.7 },
        { p: ['R3', [505, 180], 'R2'], l: 'F2b · 144', t: 1.8, d: 1.7 }, { p: ['R3', [505, 210], 'R2'], l: 'F3 · 150', t: 1.8, d: 1.7 }
      ],
      tbl: { x: 40, y: 252, w: 390, title: 'Lo que sale de R3 (MTU 576)', cols: ['Fragmento', 'Datos', 'Empieza en', 'Offset (÷ 8)', 'Más frag.'], rows: [['F1a', '552 B', 'byte 0', '0', '1'], ['F1b', '48 B', 'byte 552', '69', '1'], ['F2a', '552 B', 'byte 600', '75', '1'], ['F2b', '48 B', 'byte 1152', '144', '1'], ['F3 (sin tocar)', '280 B', 'byte 1200', '150', '0']] },
      notes: [{ x: 450, y: 252, w: 310, c: 'yellow', text: 'MTU 576 − 20 de cabecera = 556. Como el offset cuenta de a 8 bytes, cada pedazo que no es el último lleva un múltiplo de 8: <b>552</b>.<br>F1b conserva <b>más fragmentos = 1</b>: detrás de él todavía vienen F2 y F3.' }],
      st: { mtu: '576 bytes', fr: '3 → 5' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'Fragmentación en una mirada',
      b: '<ul><li>Cada red tiene su <b>MTU</b>; si el datagrama no entra, el router lo <b>fragmenta</b>.</li><li>Cada fragmento es un datagrama independiente; solo el <b>destino</b> reensambla.</li><li>Comparten <b>identificación</b>, IP origen e IP destino.</li><li><b>Offset</b> en unidades de 8 bytes (0, 75, 150) y flag <b>más fragmentos</b> (0 en el último).</li><li><b>No fragmentar</b>: si no entra, se descarta. Fragmentar multiplica la probabilidad de pérdida y carga a los routers.</li></ul><p>Ya sabemos qué lleva un datagrama. Falta ver cómo se identifica a quién va dirigido: en la próxima lección, <b>direccionamiento IP</b>.</p>',
      scene: 'viaje', tags: { R1: 'fragmenta', R2: 'conmuta', B: 'reensambla' }, ll: { 'R2-B': '' },
      pk: [
        { p: ['A', 'R1'], l: '1500 bytes', t: 0, d: 1 },
        { p: ['R1', 'd1', 'R2'], l: 'offset 0', t: 1.1, d: 1.6 }, { p: ['R1', 'd2', 'R2'], l: 'offset 75', t: 1.3, d: 1.6 }, { p: ['R1', 'd3', 'R2'], l: 'offset 150', t: 1.5, d: 1.6 },
        { p: ['R2', [655, 165], 'B'], l: 'F1', t: 3.2, d: 1.3 }, { p: ['R2', 'B'], l: 'F2', t: 3.4, d: 1.3 }, { p: ['R2', [655, 235], 'B'], l: 'F3', t: 3.6, d: 1.3 }
      ],
      st: { dg: '1500 bytes', mtu: '620 bytes', fr: '3 (offsets 0 · 75 · 150)' }
    }
  ],
  quiz: [
    { q: 'R1 fragmentó un datagrama en tres. ¿Quién lo reensambla?', o: ['R2, el siguiente router', 'El primer router cuya red tenga MTU suficiente', 'El host destino (B)', 'Nadie: la capa de transporte recibe los tres por separado'], a: 2, why: 'Los routers intermedios conmutan los fragmentos como datagramas independientes; solo IP en el destino reconstruye el original.' },
    { q: 'Un fragmento lleva datos que empiezan en el byte 1200 del datagrama original. ¿Qué valor tiene su campo offset?', o: ['1200', '150', '75', '3'], a: 1, why: 'El offset se escribe en múltiplos de 8 bytes: 1200 ÷ 8 = 150.' },
    { q: '¿En qué fragmento el flag "más fragmentos" vale 0?', o: ['En el primero', 'En todos menos el último', 'En el último (o en un datagrama sin fragmentar)', 'En ninguno: siempre vale 1'], a: 2, why: 'Vale 0 si es el último o el único fragmento; así el destino sabe dónde termina el datagrama y puede evaluar si tiene todos.' },
    { q: 'Un datagrama con el flag "no fragmentar" llega a un router cuya interfaz de salida tiene una MTU menor. ¿Qué ocurre?', o: ['Se fragmenta igual', 'El router lo descarta', 'Se recorta al tamaño de la MTU', 'Queda en cola hasta que cambie la MTU'], a: 1, why: 'Si el router necesita fragmentar y no puede, descarta el paquete; ICMP es el protocolo que interviene para avisar.' }
  ],
  cheat: [
    ['MTU', 'Maximum Transfer Unit: lo máximo que transporta cada red. Token Ring 17914, 802.3 1500, X.25 576 bytes.'],
    ['Fragmentar', 'Lo hace el router cuya interfaz de salida tiene una MTU menor que el datagrama. Cada fragmento es un datagrama IP independiente.'],
    ['Reensamblar', 'Solo en el <b>destino</b>. Los routers intermedios no saben (ni les importa) que son fragmentos.'],
    ['Lo que comparten', 'Identificación, IP origen e IP destino: iguales a los del datagrama original.'],
    ['Offset', 'Lugar de los datos en el original, en <b>unidades de 8 bytes</b>. Ejemplo: 0, 600, 1200 → 0, 75, 150.'],
    ['Flag "más fragmentos"', '1 mientras vengan más; 0 en el último o único fragmento.'],
    ['Flag "no fragmentar"', 'Impide fragmentar: si el datagrama no entra, el router lo descarta (y entra en juego ICMP).'],
    ['Desventajas', 'Con 3 fragmentos se triplica la probabilidad de pérdida y los routers trabajan más. Hoy la mayoría de las aplicaciones pide no fragmentar.']
  ]
});

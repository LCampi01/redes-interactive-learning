COURSE.add({
  id: 'hub-bridge-switch',
  title: 'Del hub al switch',
  desc: 'Cómo se fue achicando el dominio de colisión: del hub que repite todo, al bridge que aprende direcciones y al switch donde cada estación tiene su propio enlace full-duplex.',
  min: 11, level: 'Intermedio',
  learn: [
    'Por qué un hub es el mismo bus de siempre: un único dominio de colisión',
    'Cuándo se puede usar full-duplex y prescindir de CSMA/CD',
    'Cómo un bridge divide dominios de colisión, aprende MACs y filtra o reenvía',
    'Por qué un switch es un bridge con muchos puertos, con buffers y sin colisiones',
    'Los modos cut-through, fragment-free y store-and-forward'
  ],
  stats: [{ k: 'disp', l: 'Dispositivo' }, { k: 'dom', l: 'Dominios de colisión' }, { k: 'cap', l: 'Capacidad por estación' }, { k: 'modo', l: 'Modo' }],
  legend: [['req', 'trama'], ['res', 'otra trama'], ['bad', 'filtrada / descartada']],
  scenes: {
    hub: {
      kind: 'topo',
      zones: [{ id: 'zAll', x: 30, y: 56, w: 740, h: 310, l: 'Un único dominio de colisión · todas compiten por los mismos 10 Mbps', c: 'red' }],
      nodes: [
        { id: 'H1', t: 'hub', x: 210, y: 150, l: 'Hub 1' }, { id: 'H2', t: 'hub', x: 590, y: 150, l: 'Hub 2' },
        { id: 'E1', t: 'pc', x: 90, y: 295, l: 'ETD 1' }, { id: 'E2', t: 'pc', x: 210, y: 295, l: 'ETD 2' }, { id: 'E3', t: 'pc', x: 330, y: 295, l: 'ETD 3' },
        { id: 'E4', t: 'pc', x: 470, y: 295, l: 'ETD 4' }, { id: 'E5', t: 'pc', x: 590, y: 295, l: 'ETD 5' }, { id: 'E6', t: 'pc', x: 710, y: 295, l: 'ETD 6' }
      ],
      links: [{ a: 'E1', b: 'H1' }, { a: 'E2', b: 'H1' }, { a: 'E3', b: 'H1' }, { a: 'E4', b: 'H2' }, { a: 'E5', b: 'H2' }, { a: 'E6', b: 'H2' }, { a: 'H1', b: 'H2', l: 'cable cruzado', ly: 30 }]
    },
    fd: {
      kind: 'topo',
      nodes: [
        { id: 'A', t: 'pc', x: 100, y: 200, l: 'A' }, { id: 'B', t: 'pc', x: 700, y: 200, l: 'B' },
        { id: 'ATX', t: 'box', x: 250, y: 140, w: 104, h: 46, l: 'TX', sub: '10 Mbps hacia B', c: 'green' }, { id: 'ARX', t: 'box', x: 250, y: 260, w: 104, h: 46, l: 'RX', c: 'gray' },
        { id: 'BTX', t: 'box', x: 550, y: 140, w: 104, h: 46, l: 'TX', sub: '10 Mbps hacia A', c: 'blue' }, { id: 'BRX', t: 'box', x: 550, y: 260, w: 104, h: 46, l: 'RX', c: 'gray' }
      ],
      links: [
        { a: 'A', b: 'ATX' }, { a: 'A', b: 'ARX' }, { a: 'B', b: 'BTX' }, { a: 'B', b: 'BRX' },
        { a: 'ATX', b: 'BRX', arrow: 1, c: 'green' },
        { a: 'BTX', b: 'ARX', arrow: 1, c: 'blue' }
      ]
    },
    br: {
      kind: 'topo',
      zones: [
        { id: 'z1', x: 30, y: 28, w: 310, h: 215, l: 'Dominio de colisión 1 · 10 Mbps', c: 'orange' },
        { id: 'z2', x: 460, y: 28, w: 310, h: 215, l: 'Dominio de colisión 2 · 10 Mbps', c: 'blue' }
      ],
      nodes: [
        { id: 'BUS1', t: 'bus', x: 60, y: 215, w: 258 }, { id: 'BUS2', t: 'bus', x: 482, y: 215, w: 258 },
        { id: 'A', t: 'pc', x: 115, y: 120, l: 'A' }, { id: 'B', t: 'pc', x: 250, y: 120, l: 'B' },
        { id: 'C', t: 'pc', x: 550, y: 120, l: 'C' }, { id: 'D', t: 'pc', x: 685, y: 120, l: 'D' },
        { id: 'BR', t: 'bridge', x: 400, y: 215, l: 'Bridge' }, { id: 'X', t: 'pc', x: 400, y: 92, l: 'X', c: 'green' }
      ],
      links: [
        { a: 'A', b: 'BUS1' }, { a: 'B', b: 'BUS1' }, { a: 'C', b: 'BUS2' }, { a: 'D', b: 'BUS2' },
        { a: 'BUS1', b: 'BR', l: 'P1', lx: 12 }, { a: 'BR', b: 'BUS2', l: 'P2', lx: -12 }, { a: 'X', b: 'BR', l: 'P3', lx: 18, ly: 22, c: 'green' }
      ]
    },
    sw: {
      kind: 'topo',
      nodes: [
        { id: 'SW', t: 'switch', x: 400, y: 195, l: 'Switch' },
        { id: 'X', t: 'pc', x: 150, y: 105, l: 'X' }, { id: 'Y', t: 'pc', x: 150, y: 305, l: 'Y' },
        { id: 'Z', t: 'pc', x: 650, y: 105, l: 'Z' }, { id: 'W', t: 'pc', x: 650, y: 305, l: 'W' }
      ],
      links: [
        { a: 'X', b: 'SW', l: 'P1', ly: -6 }, { a: 'Y', b: 'SW', l: 'P2', ly: -6 }, { a: 'Z', b: 'SW', l: 'P3', ly: -6 }, { a: 'W', b: 'SW', l: 'P4', ly: -6 }
      ]
    },
    modos: {
      kind: 'fields', title: '¿Cuánto de la trama espera el switch antes de conmutar?', rh: 46,
      rows: [
        [{ id: 'c0', l: 'Cut-through', w: 7, c: 'gray' }, { id: 'c1', l: 'DA', s: '6 B', w: 2.2, c: 'green' }, { id: 'c2', l: 'el resto llega cuando ya se está reenviando', w: 21.8, c: 'white' }],
        [{ id: 'f0', l: 'Fragment-free', w: 7, c: 'gray' }, { id: 'f1', l: 'primeros 64 B', s: 'ventana de colisión', w: 7, c: 'yellow' }, { id: 'f2', l: 'el resto llega cuando ya se está reenviando', w: 17, c: 'white' }],
        [{ id: 's0', l: 'Store-and-forward', w: 7, c: 'gray' }, { id: 's1', l: 'trama completa', s: 'la recibe entera y chequea el CRC', w: 24, c: 'orange' }]
      ]
    },
    evo: {
      kind: 'topo',
      nodes: [
        { id: 'H', t: 'hub', x: 150, y: 150, l: 'Hub', sub: 'capa física' },
        { id: 'B', t: 'bridge', x: 400, y: 150, l: 'Bridge', sub: 'capa de enlace' },
        { id: 'S', t: 'switch', x: 650, y: 150, l: 'Switch', sub: 'capa de enlace' }
      ],
      links: [{ a: 'H', b: 'B', arrow: 1, l: 'divide en segmentos', ly: -10 }, { a: 'B', b: 'S', arrow: 1, l: 'un puerto por estación', ly: -10 }]
    }
  },
  steps: [
    {
      s: 'Hub', k: 'contexto', t: 'Estrella con hub: el mismo bus de siempre',
      b: '<p>Con el tiempo la topología pasó de bus a <b>estrella</b>: un concentrador, el <b>hub</b>, con las estaciones conectadas a él.</p><p>El hub es un dispositivo de <b>capa física</b>, un <b>repetidor</b>: recibe la señal por un puerto, la regenera y la <b>copia en todos</b> los demás. Se comporta exactamente igual que un bus.</p><p>Si faltan puertos se agrega otro hub con un cable cruzado, y el bus se agranda: todas las estaciones forman un único <b>dominio de colisión</b> y compiten por los únicos 10 Mbps.</p>',
      key: 'Cambió la forma del cableado, no el funcionamiento: sigue siendo CSMA/CD sobre un medio compartido.',
      fig: 'image7.png', scene: 'hub', hi: ['E1'], tags: { E1: 'transmite', H1: 'repite la señal', H2: 'repite la señal' },
      pk: [{ p: ['E1', 'H1'], l: 'trama', d: 1 }, { p: ['H1', 'E2'], l: 'copia', d: 1 }, { p: ['H1', 'E3'], l: 'copia', d: 1, par: 1 }, { p: ['H1', 'H2'], l: 'copia', d: 1, par: 1 },
        { p: ['H2', 'E4'], l: 'copia', d: 1 }, { p: ['H2', 'E5'], l: 'copia', d: 1, par: 1 }, { p: ['H2', 'E6'], l: 'copia', d: 1, par: 1 }],
      st: { disp: 'Hub · capa física', dom: '1', cap: '10 Mbps entre 6', modo: 'Half-duplex' }
    },
    {
      s: 'Full-duplex', k: 'idea', t: 'Dos estaciones y un cable cruzado: full-duplex',
      b: '<p>Queremos conectar <b>dos estaciones directamente</b>. Con un cable común no funciona: las dos interfaces son eléctricamente iguales.</p><p>El <b>cable cruzado</b> alterna los pines: el de transmisión de una llega al de recepción de la otra. Quedan <b>dos canales independientes</b>.</p><p>Ya no tiene sentido escuchar el medio ni buscar colisiones, porque no se pueden producir. Se pasa de half-duplex a <b>full-duplex</b> y se prescinde de <b>CSMA/CD</b>: 10 Mbps de A a B y 10 Mbps de B a A.</p>',
      key: 'Sin medio compartido no hay colisiones, pausas ni tiempo perdido: se duplica el ancho de banda.',
      fig: ['image12.png', 'image13.png'], scene: 'fd', tags: { A: 'transmite y recibe', B: 'transmite y recibe' },
      pk: [{ p: ['ATX', 'BRX'], l: 'A → B', c: 'req', t: 0, d: 1.8 }, { p: ['BTX', 'ARX'], l: 'B → A', c: 'res', t: .3, d: 1.8 }],
      notes: [{ x: 240, y: 318, w: 320, c: 'yellow', text: 'Vínculo <b>punto a punto</b>: cada sentido viaja por su propio par, así que las dos tramas se cruzan sin interferirse.' }],
      st: { disp: 'Cable cruzado', dom: '0 · no hay colisiones', cap: '10 + 10 Mbps', modo: 'Full-duplex' }
    },
    {
      s: 'Bridge', k: 'idea', t: 'Bridge: partir el dominio de colisión',
      b: '<p>La red crece: más hubs, más estaciones, y todas siguen repartiéndose los mismos <b>10 Mbps</b>. El rendimiento cae.</p><p>Para mejorarlo se usa un <b>bridge</b>. Se conecta en la red y opera de forma <b>transparente</b>: para las estaciones no existe.</p><p>El bridge <b>divide el medio en segmentos</b>, y cada uno es un <b>dominio de colisión</b> separado. Ahora cada par de estaciones comparte los 10 Mbps de <b>su</b> segmento.</p>',
      key: 'Menos estaciones compitiendo por cada segmento = menos colisiones y más rendimiento.',
      fig: 'image14.png', scene: 'br', hide: ['X'], hi: ['BR'], tags: { A: 'transmite', D: 'transmite' },
      fx: [{ k: 'sig', bus: 'BUS1', from: 'A', c: 'req', t: 0, d: 1.2 }, { k: 'sig', bus: 'BUS2', from: 'D', c: 'res', t: 0, d: 1.2 }],
      pk: [{ p: ['A', 'BUS1', 'B'], l: 'A → B', t: .1, d: 1.5, stay: 1 }, { p: ['D', 'BUS2', 'C'], l: 'D → C', c: 'res', t: .1, d: 1.5, stay: 1 }],
      notes: [{ x: 210, y: 300, w: 380, c: 'yellow', text: 'A le envía a B y D le envía a C <b>al mismo tiempo</b>. No chocan: cada transmisión queda en su propio segmento.' }],
      st: { disp: 'Bridge · capa de enlace', dom: '2', cap: '10 Mbps por segmento', modo: 'Half-duplex' }
    },
    {
      s: 'Tabla MAC', k: 'mecanismo', t: 'Aprender direcciones: filtrar o reenviar',
      b: '<p>Al conectarse, el bridge va <b>aprendiendo las direcciones MAC</b> para saber de qué lado está cada estación. Las guarda en una <b>tabla interna</b>, de tamaño limitado (eso determina la extensión de la red).</p><p>Con la tabla decide si la trama cruza o no:</p><ul><li>Emisor y destinatario en el <b>mismo segmento</b>: la <b>filtra</b>.</li><li>Destinatario en el <b>otro segmento</b>: la <b>deja pasar</b>.</li></ul><p>Los <b>broadcast</b> siempre los deja pasar.</p>',
      key: 'El bridge separa dominios de colisión, pero no detiene los broadcast.',
      fig: 'image15.png', scene: 'br', hide: ['X'], hi: ['BR'], tags: { BR: 'B está en P1 → filtra' },
      fx: [{ k: 'sig', bus: 'BUS1', from: 'A', c: 'req', t: 0, d: 1.2 }],
      pk: [{ p: ['A', 'BUS1', 'B'], l: 'A → B', t: .1, d: 1.4, stay: 1 }, { p: ['A', 'BUS1', 'BR'], l: 'A → B', c: 'bad', t: .1, d: 1.7, drop: 1 }],
      tbl: { x: 290, y: 285, w: 220, title: 'Tabla del bridge', cols: ['MAC', 'Puerto'], rows: [['MAC de A', 'P1'], ['MAC de B', 'P1'], ['MAC de C', 'P2'], ['MAC de D', 'P2']], hi: [0, 1] }
    },
    {
      s: 'Reenvío', k: 'mecanismo', t: 'Para cruzar, el bridge es una estación más',
      b: '<p>Cuando el destinatario está del otro lado, el bridge <b>funciona igual que una estación</b>:</p><ul><li>A escucha <b>su</b> segmento y transmite.</li><li>El bridge recibe la trama y la <b>almacena en un buffer</b>.</li><li>Después <b>escucha el otro segmento</b> y, cuando está libre, la transmite.</li></ul><p>Es decir, el bridge comparte los 10 Mbps con las estaciones del primer segmento y con las del segundo, por separado.</p>',
      key: 'El bridge hace CSMA/CD en cada segmento: una colisión de un lado nunca se propaga al otro.',
      scene: 'br', hide: ['X'], hi: ['BR', 'C'], tags: { A: 'escucha → transmite', BR: 'buffer → escucha P2' },
      fx: [{ k: 'sig', bus: 'BUS1', from: 'A', c: 'req', t: 0, d: 1.2 }, { k: 'sig', bus: 'BUS2', from: 'BR', c: 'req', t: 1.9, d: 1.2 }],
      pk: [{ p: ['A', 'BUS1', 'BR'], l: 'A → C', t: .1, d: 1.7 }, { p: ['BR', 'BUS2', 'C'], l: 'A → C', t: 2, d: 1.6, stay: 1 }],
      tbl: { x: 290, y: 285, w: 220, title: 'Tabla del bridge', cols: ['MAC', 'Puerto'], rows: [['MAC de A', 'P1'], ['MAC de B', 'P1'], ['MAC de C', 'P2'], ['MAC de D', 'P2']], hi: [2] }
    },
    {
      s: 'Puerto propio', k: 'idea', t: 'Un segmento con una sola estación',
      b: '<p>Agregamos un <b>puerto más</b> al bridge y en ese segmento conectamos <b>una sola estación</b>, X. Se carga en la tabla como las demás.</p><p>X no compite con nadie por el recurso: tiene todo el segmento para ella y está conectada <b>directamente al bridge</b>. Entonces puede habilitar la interfaz <b>full-duplex</b> y transmitir y recibir al mismo tiempo: 10 Mbps de ida y 10 Mbps de vuelta.</p><p>Los otros dos segmentos siguen siendo compartidos, con CSMA/CD.</p>',
      key: 'Una estación sola en su puerto no necesita CSMA/CD. De esta observación nace el switch.',
      fig: 'image16.png', scene: 'br', hi: ['X', 'X-BR'], tags: { X: 'full-duplex' },
      pk: [{ p: [[391, 118], [391, 189]], c: 'req', t: 0, d: 1.1 }, { p: [[409, 189], [409, 118]], c: 'res', t: 0, d: 1.1 }, { p: [[391, 118], [391, 189]], c: 'req', t: 1.3, d: 1.1 }, { p: [[409, 189], [409, 118]], c: 'res', t: 1.3, d: 1.1 }],
      tbl: { x: 290, y: 285, w: 220, title: 'Tabla del bridge', cols: ['MAC', 'Puerto'], rows: [['MAC de A', 'P1'], ['MAC de B', 'P1'], ['MAC de C', 'P2'], ['MAC de D', 'P2'], ['MAC de X', 'P3']], hi: [4] },
      st: { dom: '2 compartidos + X sola', cap: 'X: 10 + 10 Mbps', modo: 'X en full-duplex' }
    },
    {
      s: 'Switch', k: 'idea', t: 'Switch: un bridge con muchos puertos',
      b: '<p>Llevemos la idea al extremo: el <b>switch</b> es un <b>bridge con muchos más puertos</b>, para que <b>todas</b> las estaciones se conecten a él, cada una en modo full-duplex.</p><p>El hub es un repetidor de <b>capa física</b>; el switch es de <b>capa de enlace</b>: sabe quién está en cada puerto, conoce sus direcciones MAC.</p><p>Sigue siendo <b>transparente</b>: las estaciones no saben que está ahí. Si llega una trama para una dirección que no tiene en la tabla, la <b>copia en todos los puertos</b>.</p>',
      key: 'Cada estación tiene su enlace propio: dos conversaciones distintas ocurren a la vez sin molestarse.',
      fig: 'image17.png', scene: 'sw', hi: ['SW'],
      pk: [{ p: ['X', 'SW', 'Z'], l: 'X → Z', t: 0, d: 2, stay: 1 }, { p: ['W', 'SW', 'Y'], l: 'W → Y', c: 'res', t: 0, d: 2, stay: 1 }],
      tbl: { x: 305, y: 262, w: 190, title: 'Tabla del switch', cols: ['MAC', 'Puerto'], rows: [['MAC de X', 'P1'], ['MAC de Y', 'P2'], ['MAC de Z', 'P3'], ['MAC de W', 'P4']] },
      st: { disp: 'Switch · capa de enlace', dom: '0 · no hay colisiones', cap: '10 + 10 Mbps propios', modo: 'Full-duplex' }
    },
    {
      s: 'Buffers', k: 'mecanismo', t: 'Buffers en vez de colisiones',
      b: '<p>¿Y si dos estaciones le envían a la misma al mismo tiempo? No chocan:</p><ul><li>Cada trama se guarda en el <b>buffer</b> del puerto por el que entró.</li><li>De ahí se copia al puerto de la <b>MAC destino</b>.</li><li>Cuando el switch puede, la transmite a la estación.</li></ul><p>La estación emisora piensa que ya entregó el mensaje, pero en realidad quedó almacenado en el switch.</p><p>Si en un puerto hay un <b>hub</b>, ahí el switch espera el medio libre con CSMA/CD y puede haber colisiones.</p>',
      key: 'En el switch las tramas esperan su turno en un buffer; ya no se destruyen entre sí.',
      scene: 'sw', hi: ['SW', 'Z'], tags: { SW: 'guarda las dos en buffers', X: 'cree que ya la entregó' },
      pk: [{ p: ['X', 'SW'], l: 'X → Z', t: 0, d: 1.1 }, { p: ['Y', 'SW'], l: 'Y → Z', c: 'res', t: 0, d: 1.1 }, { p: ['SW', 'Z'], l: 'X → Z', t: 1.3, d: 1.1 }, { p: ['SW', 'Z'], l: 'Y → Z', c: 'res', t: 2.6, d: 1.1, stay: 1 }],
      tbl: { x: 305, y: 262, w: 190, title: 'Tabla del switch', cols: ['MAC', 'Puerto'], rows: [['MAC de X', 'P1'], ['MAC de Y', 'P2'], ['MAC de Z', 'P3'], ['MAC de W', 'P4']], hi: [2] }
    },
    {
      s: 'Modos', k: 'comparación', t: 'Cut-through, fragment-free y store-and-forward',
      b: '<p>Para conmutar, el switch necesita la <b>MAC destino</b>, que viene en el primer campo de la trama.</p><ul><li><b>Cut-through</b>: decide apenas recibe esos <b>6 bytes</b>. Si hay hubs, quedan 58 bytes dentro de la ventana de colisión: la trama ya conmutada puede terminar <b>truncada</b>.</li><li><b>Fragment-free</b>: espera los primeros <b>64 bytes</b>, que cubren la ventana de colisión.</li><li><b>Store-and-forward</b>: espera la <b>trama completa</b>, analiza el CRC y, si es correcto, conmuta.</li></ul>',
      key: 'Cuanto más espera el switch, más lento conmuta y menos tramas dañadas reenvía.',
      fig: 'image18.png', scene: 'modos', hi: ['c0', 'c1', 'f0', 'f1', 's0', 's1'],
      det: 'En color, lo que el switch tiene que recibir <b>antes</b> de decidir. <b>Cut-through</b> es el más rápido pero puede reenviar tramas truncadas; <b>store-and-forward</b> es el más lento y el único que verifica el CRC; <b>fragment-free</b> es el intermedio.'
    },
    {
      s: 'Resumen', k: 'resumen', t: 'Del hub al switch en una mirada',
      b: '<ul><li><b>Hub</b>: repetidor de capa física. Un único dominio de colisión, 10 Mbps para todos.</li><li><b>Full-duplex</b>: con un enlace punto a punto no hay colisiones y sobra CSMA/CD.</li><li><b>Bridge</b>: divide dominios de colisión, aprende MACs, filtra o reenvía. Deja pasar los broadcast.</li><li><b>Switch</b>: bridge con muchos puertos, buffers y full-duplex.</li><li>Modos: <b>cut-through</b> (6 bytes), <b>fragment-free</b> (64) y <b>store-and-forward</b> (trama completa).</li></ul><p>Los bridges son transparentes y no se conocen entre sí. En la próxima lección vemos el problema que eso trae cuando hay caminos redundantes: los <b>loops</b>, y cómo los resuelve <b>Spanning Tree</b>.</p>',
      scene: 'evo',
      pk: [{ p: ['H', 'B'], c: 'req', d: 1.2 }, { p: ['B', 'S'], c: 'req', d: 1.2 }],
      notes: [
        { x: 55, y: 250, w: 190, c: 'red', text: '<b>Repite</b> la señal en todos los puertos. Un solo dominio de colisión: 10 Mbps para todas.' },
        { x: 305, y: 250, w: 190, c: 'orange', text: '<b>Aprende MACs</b> y filtra o reenvía. Un dominio de colisión por segmento.' },
        { x: 555, y: 250, w: 190, c: 'green', text: '<b>Un puerto por estación</b>, full-duplex y con buffers. Sin colisiones: 10 + 10 Mbps para cada una.' }
      ],
      st: { disp: 'Hub → bridge → switch', dom: '1 → 2 → 0', cap: 'compartida → propia', modo: 'Half → full-duplex' }
    }
  ],
  quiz: [
    { q: 'Seis estaciones están conectadas a dos hubs unidos entre sí. ¿Cuántos dominios de colisión hay?', o: ['Seis, uno por estación', 'Dos, uno por hub', 'Uno solo', 'Ninguno'], a: 2, why: 'El hub es un repetidor de capa física: copia la señal en todos los puertos y en el otro hub, así que todas compiten por los mismos 10 Mbps.' },
    { q: 'Un bridge recibe una trama cuyo emisor y destinatario están en el mismo segmento. ¿Qué hace?', o: ['La filtra: no la pasa al otro segmento', 'La reenvía por todos los puertos', 'La devuelve al emisor', 'Genera una señal de jam'], a: 0, why: 'Con su tabla de MACs sabe que los dos están del mismo lado; solo deja pasar la trama cuando el destinatario está en otro segmento (y siempre los broadcast).' },
    { q: '¿Por qué una estación conectada sola a un puerto de bridge o switch puede usar full-duplex?', o: ['Porque el switch le asigna más prioridad', 'Porque no comparte el segmento con nadie: no puede haber colisiones', 'Porque usa un preámbulo más corto', 'Porque el switch es de capa física'], a: 1, why: 'Al no competir con otras estaciones por el medio, no hace falta CSMA/CD y puede transmitir y recibir a la vez.' },
    { q: '¿Qué modo de conmutación espera los primeros 64 bytes antes de reenviar?', o: ['Cut-through', 'Store-and-forward', 'Fragment-free', 'Full-duplex'], a: 2, why: 'Fragment-free espera la ventana de colisión (64 bytes) para no conmutar una trama que después quede truncada; cut-through espera 6 bytes y store-and-forward la trama completa.' }
  ],
  cheat: [
    ['Hub', 'Repetidor de <b>capa física</b>: regenera la señal y la copia en todos los puertos. Equivale a un bus.'],
    ['Dominio de colisión', 'Conjunto de estaciones que compiten por el mismo medio (los mismos 10 Mbps) y pueden colisionar entre sí.'],
    ['Full-duplex', 'Enlace punto a punto con un canal por sentido (cable cruzado entre dos estaciones). Sin CSMA/CD: 10 + 10 Mbps.'],
    ['Bridge', 'Transparente. Divide dominios de colisión, aprende MACs en una tabla, <b>filtra</b> o <b>reenvía</b>. Los broadcast siempre pasan.'],
    ['Reenvío del bridge', 'Actúa como una estación: guarda la trama en un buffer, escucha el otro segmento y transmite.'],
    ['Switch', 'Bridge de <b>capa de enlace</b> con muchos puertos: una estación por puerto, full-duplex, buffers, sin colisiones. Destino desconocido → copia a todos.'],
    ['Cut-through', 'Conmuta al recibir la MAC destino (6 bytes). Rápido, pero puede reenviar tramas truncadas.'],
    ['Fragment-free / Store-and-forward', 'Espera 64 bytes (ventana de colisión) / espera la trama completa y chequea el CRC.']
  ]
});

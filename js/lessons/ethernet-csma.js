COURSE.add({
  id: 'ethernet-csma',
  title: 'Ethernet y CSMA/CD',
  desc: 'Un solo cable para todas las estaciones: cómo se ponen de acuerdo para transmitir, qué pasa cuando chocan y por qué una trama no puede medir menos de 64 bytes.',
  min: 10, level: 'Inicial',
  learn: [
    'Qué es Ethernet / 802.3 y en qué subcapa trabaja (MAC y LLC)',
    'Cómo funciona CSMA/CD: escuchar, transmitir y detectar colisiones',
    'Qué son el jamming y el backoff exponencial binario',
    'Por qué existe la ventana de colisión y el mínimo de 64 bytes (PAD)'
  ],
  stats: [{ k: 'medio', l: 'Medio' }, { k: 'modo', l: 'Modo' }, { k: 'col', l: 'Colisiones (n)' }, { k: 'esp', l: 'Espera' }],
  legend: [['req', 'señal / trama de A'], ['res', 'señal de otra estación'], ['bad', 'colisión']],
  scenes: {
    bus: {
      kind: 'topo',
      nodes: [
        { id: 'BUS', t: 'bus', x: 90, y: 285, w: 620, l: 'coaxil · 10 Mbps' },
        { id: 'A', t: 'pc', x: 150, y: 150, l: 'A' }, { id: 'B', t: 'pc', x: 330, y: 150, l: 'B' },
        { id: 'C', t: 'pc', x: 510, y: 150, l: 'C' }, { id: 'D', t: 'pc', x: 690, y: 150, l: 'D' }
      ],
      links: [{ a: 'A', b: 'BUS' }, { a: 'B', b: 'BUS' }, { a: 'C', b: 'BUS' }, { a: 'D', b: 'BUS' }]
    },
    osi: {
      kind: 'topo',
      nodes: [
        { id: 't1', t: 'txt', x: 220, y: 50, l: 'Modelo OSI', big: 1 }, { id: 't2', t: 'txt', x: 560, y: 50, l: 'IEEE 802', big: 1 },
        { id: 'red', t: 'box', x: 220, y: 110, w: 220, h: 46, l: 'Capa de red', c: 'gray' },
        { id: 'enl', t: 'box', x: 220, y: 205, w: 220, h: 100, l: 'Capa de enlace', c: 'blue' },
        { id: 'fis', t: 'box', x: 220, y: 320, w: 220, h: 46, l: 'Capa física', c: 'gray' },
        { id: 'sup', t: 'box', x: 560, y: 110, w: 280, h: 46, l: 'Capas superiores', c: 'gray' },
        { id: 'llc', t: 'box', x: 560, y: 179, w: 280, h: 46, l: 'LLC · Logical Link Control', sub: '802.2 — común a todas', c: 'yellow' },
        { id: 'mac', t: 'box', x: 560, y: 233, w: 280, h: 46, l: 'MAC · Medium Access Control', sub: '802.3 Ethernet · 802.11 Wi-Fi · …', c: 'green' },
        { id: 'fis2', t: 'box', x: 560, y: 320, w: 280, h: 46, l: 'Física (coaxil, par trenzado…)', c: 'gray' }
      ],
      links: [{ a: 'enl', b: 'llc', dash: 1 }, { a: 'enl', b: 'mac', dash: 1 }]
    },
    largo: {
      kind: 'topo',
      nodes: [
        { id: 'BUS', t: 'bus', x: 70, y: 250, w: 660, l: 'hasta 2,5 km · 5 segmentos de 500 m + 4 repetidores' },
        { id: 'A', t: 'pc', x: 95, y: 120, l: 'A' }, { id: 'D', t: 'pc', x: 705, y: 120, l: 'D' }
      ],
      links: [{ a: 'A', b: 'BUS' }, { a: 'D', b: 'BUS' }]
    }
  },
  steps: [
    {
      s: 'Ethernet', k: 'contexto', t: 'Una LAN, un cable para todos',
      b: '<p>Una <b>red de área local</b> es la que queda circunscripta a una oficina, un piso o un edificio. La tecnología que se impuso es <b>Ethernet</b> (marca de DIX: Digital, Intel y Xerox), que la IEEE estandarizó como <b>802.3</b>.</p><p>En su forma original es un <b>bus</b>: un coaxil del que cuelgan todas las estaciones. Es una red <b>peer to peer</b> (nadie tiene prioridad) y <b>half-duplex</b>.</p><p>1970 Aloha → 1979 Ethernet II → 1985 802.3 (10 Mbps) → 1995 Fast Ethernet → 1998 Gigabit → 2002 10 Gb. Todas comparten el <b>mismo formato de trama</b>.</p>',
      key: 'No hay un controlador central: el acceso al medio está <b>distribuido</b> entre todas las estaciones.',
      fig: ['image2.png', 'image3.png'], scene: 'bus', st: { medio: 'Bus compartido', modo: 'Half-duplex', col: '0', esp: '—' }
    },
    {
      s: 'MAC y LLC', k: 'contexto', t: 'Dónde vive Ethernet: MAC y LLC',
      b: '<p>Comparado con OSI, Ethernet / 802.3 opera en la <b>capa de enlace</b>, que la IEEE parte en dos subcapas:</p><ul><li><b>LLC</b> (Logical Link Control, 802.2): la de arriba, <b>común</b> a todas las tecnologías.</li><li><b>MAC</b> (Medium Access Control): la de abajo, <b>depende de cada tecnología</b>. Cada comité normalizó cómo se accede al medio: 802.3 para Ethernet, 802.11 para Wi-Fi…</li></ul>',
      key: 'Lo que cambia entre una LAN cableada y una inalámbrica es la subcapa MAC; el LLC queda igual.',
      fig: 'image1.png', scene: 'osi', hi: ['mac']
    },
    {
      s: 'Un medio', k: 'problema', t: 'Lo que transmite uno, lo escuchan todos',
      b: '<p>Cuando una estación transmite (en banda base, con códigos de línea como <b>Manchester</b>), la señal <b>ocupa todo el medio</b> y las demás escuchan: es una configuración <b>punto a multipunto</b>.</p><p>De acá salen dos necesidades:</p><ul><li>Un <b>control de acceso al medio</b>: cómo se organizan para usar el mismo cable.</li><li><b>Direccionamiento</b>: identificar emisor y destinatario. Cada estación compara la MAC destino con la suya: si coincide procesa la trama, si no la descarta.</li></ul>',
      scene: 'bus', hi: ['A'], tags: { A: 'transmite', B: 'no es para mí', C: '¡es para mí!', D: 'no es para mí' },
      fx: [{ k: 'sig', bus: 'BUS', from: 'A', c: 'req', t: 0, d: 1.3 }],
      pk: [{ p: ['A', 'BUS', 'B'], l: 'trama → C', t: .1, d: 1.3 }, { p: ['A', 'BUS', 'C'], l: 'trama → C', t: .1, d: 1.6, stay: 1 }, { p: ['A', 'BUS', 'D'], l: 'trama → C', t: .1, d: 1.9 }]
    },
    {
      s: 'Escuchar', k: 'mecanismo', t: 'Carrier Sense: escuchar antes de hablar',
      b: '<p>Antes de transmitir, la estación <b>escucha el medio</b>. Si está libre, transmite; si está ocupado, espera a que se libere.</p><p>Como Manchester tiene una transición en cada intervalo de bit, es imposible que alguien esté transmitiendo sin que se note.</p><p>La trama se propaga y la reciben todas. Cada una <b>chequea el CRC</b> y después la <b>MAC destino</b>.</p>',
      key: 'CS = Carrier Sense (escucho) · MA = Multiple Access (somos varios en el mismo medio).',
      fig: 'image5.png', scene: 'bus', hi: ['B'], tags: { A: 'transmitiendo', B: 'medio ocupado → espero' },
      fx: [{ k: 'sig', bus: 'BUS', from: 'A', c: 'req', t: 0, d: 1.2 }],
      notes: [{ x: 250, y: 330, w: 300, c: 'yellow', text: '<b>B</b> tiene una trama lista, pero detecta portadora en el cable. Va a transmitir recién cuando el medio quede libre.' }]
    },
    {
      s: 'Colisión', k: 'problema', t: 'Dos estaciones a la vez: colisión',
      b: '<p>Todas ejecutan el mismo procedimiento, cada una por su cuenta. Puede pasar que dos vean el medio libre <b>en el mismo instante</b> y arranquen juntas.</p><p>Las señales se interfieren y nadie puede entender nada: <b>ambas transmisiones hay que repetirlas</b>.</p><p>La colisión está contemplada (es la <b>CD</b>, Collision Detection): la estación <b>transmite y escucha a la vez</b>. Si lo que escucha no es igual a lo que envía, hay alguien más en el medio.</p>',
      key: 'Una colisión no es un error raro: es parte normal del funcionamiento de CSMA/CD.',
      scene: 'bus', hi: ['A', 'D'], tags: { A: 'libre → transmito', D: 'libre → transmito' },
      fx: [{ k: 'sig', bus: 'BUS', from: 'A', c: 'req', t: 0, d: 1.5 }, { k: 'sig', bus: 'BUS', from: 'D', c: 'res', t: 0, d: 1.5 }, { k: 'boom', at: [420, 285], t: .68, l: 'colisión' }],
      st: { col: '1' }
    },
    {
      s: 'Jamming', k: 'mecanismo', t: 'Jam: que todos se enteren',
      b: '<p>Al detectar la colisión, el estándar pide una situación de <b>JAMMING</b>: las estaciones <b>sostienen la transmisión</b> un momento para asegurarse de que <b>todas</b> detecten que hubo colisión.</p><p>Después cada una incrementa su <b>contador de colisiones n</b> y deja de transmitir.</p>',
      scene: 'bus', hi: ['A', 'D'], tags: { A: 'JAM · n = 1', D: 'JAM · n = 1', B: 'detecta colisión', C: 'detecta colisión' },
      fx: [{ k: 'sig', bus: 'BUS', from: 'A', c: 'bad', t: 0, d: .9 }, { k: 'sig', bus: 'BUS', from: 'D', c: 'bad', t: 0, d: .9 }, { k: 'boom', at: [420, 285], t: .1, l: 'jam' }]
    },
    {
      s: 'Backoff', k: 'mecanismo', t: 'Backoff exponencial binario',
      b: '<p>Para no volver a chocar, cada estación elige al azar un número <b>N</b> entre <b>0 y 2ⁿ − 1</b> y espera <b>N · 2t</b> antes de reintentar.</p><p>Con n = 1 hay un 50 % de que elijan lo mismo y choquen otra vez. Cada colisión sube n, el rango se duplica y la probabilidad de coincidir baja.</p><p>El contador crece hasta <b>10</b>, pero se sigue intentando hasta <b>16</b> veces; si no se pudo, se da la red por inaccesible. Con transmisiones exitosas el contador vuelve a bajar.</p>',
      key: 'El retardo aleatorio es lo que desempata: cuanto más chocan, más se separan en el tiempo.',
      fig: 'image6.png', scene: 'bus', hi: ['A'], tags: { A: 'N = 0 → transmito ya', D: 'N = 1 → espero 2t' },
      pk: [{ p: ['A', 'BUS', 'C'], l: 'trama de A', d: 1.5 }, { p: ['D', 'BUS', 'B'], l: 'trama de D', c: 'res', d: 1.5 }],
      tbl: { x: 268, y: 318, w: 270, title: 'después de n colisiones', cols: ['n', 'N posible', 'coinciden'], rows: [['1', '0 … 1', '50 %'], ['2', '0 … 3', '25 %'], ['3', '0 … 7', '12,5 %'], ['10', '0 … 1023', '≈ 0,1 %']], hi: 0 },
      st: { esp: 'N · 2t' }
    },
    {
      s: '64 bytes', k: 'detalle', t: 'La ventana de colisión y los 64 bytes',
      b: '<p>Un segmento de coaxil grueso mide hasta <b>500 m</b> (200 m el fino); con hasta 4 repetidores se llega a <b>2,5 km</b>. A 10 Mbps, cuando una estación lleva transmitidos <b>64 bytes</b> ya llenó de señal todo el bus.</p><p>Desde ese momento nadie más va a arrancar (todos escuchan antes), así que las colisiones solo pueden ocurrir en esos primeros 64 bytes: la <b>ventana de colisión</b>.</p><p>Si una trama fuera más corta, A terminaría de transmitir <b>antes</b> de que la colisión vuelva hasta ella, y no la detectaría. Por eso el mínimo es 64 bytes, y el campo <b>PAD</b> rellena lo que falte.</p>',
      key: 'Trama mínima de 64 bytes = garantía de que el emisor sigue escuchando cuando la colisión regresa.',
      scene: 'largo', hi: ['A'], tags: { A: 'sigue transmitiendo…', D: 've libre → transmite' },
      fx: [{ k: 'sig', bus: 'BUS', from: 'A', c: 'req', t: 0, d: 2.4 }, { k: 'sig', bus: 'BUS', from: 'D', c: 'bad', t: 2.05, d: 2.4 }, { k: 'boom', at: [668, 250], t: 2.25, l: 'colisión lejos de A' }],
      notes: [{ x: 200, y: 300, w: 400, c: 'yellow', text: 'La señal de A tarda en recorrer los 2,5 km. D arranca justo antes de que llegue. La interferencia tiene que <b>volver</b> hasta A mientras A todavía transmite: eso lo aseguran los 64 bytes.' }],
      st: { esp: '—' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'CSMA/CD en una mirada',
      b: '<ul><li><b>Escucho</b> el medio; si está libre, transmito.</li><li>Mientras transmito <b>sigo escuchando</b>: si difiere, hubo colisión.</li><li><b>Jam</b>, sumo 1 a n y espero <b>N · 2t</b> con N al azar en 0…2ⁿ−1.</li><li>Máximo 16 intentos; n crece hasta 10.</li><li>Trama mínima de <b>64 bytes</b> para cubrir la ventana de colisión.</li></ul><p>Todo esto vale mientras el medio sea compartido. En la próxima lección miramos la trama por dentro, y después cómo hubs, bridges y switches van achicando (y eliminando) el problema.</p>',
      scene: 'bus', pk: [{ p: ['B', 'BUS', 'D'], l: 'trama', d: 1.5 }, { p: ['C', 'BUS', 'A'], l: 'trama', c: 'res', d: 1.5 }]
    }
  ],
  quiz: [
    { q: 'En CSMA/CD, ¿cómo detecta una estación que hubo una colisión?', o: ['Recibe un mensaje de error del bus', 'Compara lo que escucha con lo que está transmitiendo', 'Espera el ACK del destinatario', 'Se lo avisa el repetidor'], a: 1, why: 'La estación transmite y escucha en paralelo; si lo que escucha no es igual a lo que envía, alguien más está en el medio.' },
    { q: 'Tras la tercera colisión consecutiva (n = 3), ¿entre qué valores se elige N?', o: ['0 a 3', '0 a 7', '1 a 8', '0 a 15'], a: 1, why: 'N se elige al azar entre 0 y 2ⁿ − 1; con n = 3 es 0…7, y se espera N · 2t.' },
    { q: '¿Por qué una trama Ethernet debe medir como mínimo 64 bytes?', o: ['Para que entre la cabecera IP', 'Porque el CRC necesita 64 bytes', 'Para que el emisor siga transmitiendo durante toda la ventana de colisión', 'Para sincronizar los relojes con Manchester'], a: 2, why: 'A los 64 bytes la señal ya llenó el bus de 2,5 km; si la trama fuese más corta, la colisión volvería cuando el emisor ya dejó de escuchar.' },
    { q: '¿Qué subcapa es común a todas las tecnologías LAN de la IEEE?', o: ['MAC', 'LLC (802.2)', 'La capa física', '802.3'], a: 1, why: 'La LLC es la subcapa superior común; la MAC depende de cada tecnología (802.3, 802.11…).' }
  ],
  cheat: [
    ['Ethernet / 802.3', 'LAN peer to peer, half-duplex, acceso al medio distribuido. Mismo formato de trama de 10 Mbps a 10 Gb.'],
    ['Subcapas de enlace', '<b>LLC</b> (802.2, común) arriba; <b>MAC</b> (depende de la tecnología) abajo.'],
    ['CSMA/CD', 'Escuchar → transmitir si está libre → seguir escuchando para detectar colisión.'],
    ['Jamming', 'Sostener la transmisión tras la colisión para que todas las estaciones la detecten.'],
    ['Backoff', 'Esperar N · 2t, con N al azar en 0…2ⁿ−1. n crece hasta 10; hasta 16 intentos.'],
    ['Ventana de colisión', 'Primeros 64 bytes: lo que tarda la señal en llenar los 2,5 km. Por eso trama mínima = 64 bytes (PAD rellena).'],
    ['Longitudes', 'Coaxil grueso 500 m, fino 200 m; hasta 4 repetidores → 2,5 km.']
  ]
});

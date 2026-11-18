COURSE.add({
  id: 'udp',
  title: 'UDP: ágil y sin conexión',
  desc: 'El otro protocolo de transporte: una cabecera de 8 bytes, ninguna garantía y nada que establecer. Qué ofrece, qué deja afuera y para qué conviene.',
  min: 9, level: 'Inicial',
  learn: [
    'Qué campos tiene la cabecera UDP y en qué se diferencia de la de TCP',
    'Qué servicios da UDP y cuáles no',
    'Para qué tipo de aplicaciones se prefiere: DNS, NTP, multicast, streaming',
    'Qué hace el receptor con un datagrama: encolar, descartar o responder con ICMP',
    'Cómo se calcula el checksum con la pseudo-cabecera'
  ],
  legend: [['req', 'consulta / datagrama'], ['res', 'respuesta'], ['ctl', 'control de TCP'], ['data', 'uno a muchos'], ['bad', 'descartado / ICMP']],
  scenes: {
    agil: {
      kind: 'seq',
      actors: [{ id: 'C', l: 'Cliente', t: 'pc' }, { id: 'S', l: 'Servidor', t: 'server' }],
      msgs: [
        { div: 'con TCP: primero hay que conectarse' },
        { f: 'C', to: 'S', l: 'SYN', c: 'ctl' },
        { f: 'S', to: 'C', l: 'SYN + ACK', c: 'ctl' },
        { f: 'C', to: 'S', l: 'ACK', c: 'ctl' },
        { f: 'C', to: 'S', l: 'consulta', c: 'req' },
        { f: 'S', to: 'C', l: 'respuesta', c: 'res' },
        { at: 'C', note: '… y todavía falta cerrar: FIN y ACK' },
        { div: 'con UDP: directo' },
        { f: 'C', to: 'S', l: 'consulta', c: 'req' },
        { f: 'S', to: 'C', l: 'respuesta', c: 'res' }
      ]
    },
    udp: {
      kind: 'fields', title: 'Datagrama UDP · cabecera de 8 bytes', ruler: 32, rh: 52,
      rows: [
        [{ id: 'sp', l: 'Puerto origen', s: '16 bits', w: 16, c: 'green' }, { id: 'dp', l: 'Puerto destino', s: '16 bits', w: 16, c: 'blue' }],
        [{ id: 'len', l: 'Longitud total UDP (octetos)', s: '16 bits', w: 16, c: 'yellow' }, { id: 'ck', l: 'Checksum (opcional)', s: '16 bits', w: 16, c: 'orange' }],
        [{ id: 'dat', l: 'Datos', s: 'lo que entrega la aplicación', w: 32, c: 'white' }]
      ]
    },
    tcp: {
      kind: 'fields', title: 'Cabecera TCP: qué queda en UDP', ruler: 32, rh: 40,
      rows: [
        [{ id: 'sp', l: 'Puerto origen', s: '16 bits', w: 16, c: 'green' }, { id: 'dp', l: 'Puerto destino', s: '16 bits', w: 16, c: 'blue' }],
        [{ id: 'seq', l: 'Número de secuencia', s: '32 bits', w: 32, c: 'yellow' }],
        [{ id: 'ack', l: 'Número de confirmación (ACK)', s: '32 bits', w: 32, c: 'purple' }],
        [{ id: 'hl', l: 'Header length', s: '4 bits', w: 4, c: 'orange' }, { id: 'rsv', l: 'Reservado', s: '6 bits', w: 6, c: 'gray' }, { id: 'fl', l: 'Flags', s: '6 bits', w: 6, c: 'red' }, { id: 'win', l: 'Window', s: '16 bits', w: 16, c: 'blue' }],
        [{ id: 'ck', l: 'Checksum', s: '16 bits', w: 16, c: 'orange' }, { id: 'up', l: 'Urgent pointer', s: '16 bits', w: 16, c: 'red' }],
        [{ id: 'opt', l: 'Opciones: MSS, Window scale, Timestamp…', s: 'longitud variable', w: 32, c: 'white', ghost: 1 }]
      ]
    },
    serv: {
      kind: 'topo',
      nodes: [
        { id: 't1', t: 'txt', x: 220, y: 50, l: 'Igual que IP', big: 1 }, { id: 't2', t: 'txt', x: 580, y: 50, l: 'Lo que UDP agrega', big: 1 },
        { id: 'n1', t: 'box', x: 220, y: 115, w: 300, h: 50, l: 'Sin conexión', sub: 'no mantiene un estado', c: 'gray' },
        { id: 'n2', t: 'box', x: 220, y: 185, w: 300, h: 50, l: 'No confiable', sub: 'no notifica los descartes', c: 'gray' },
        { id: 'n3', t: 'box', x: 220, y: 255, w: 300, h: 50, l: 'No reordena', sub: 'no secuencia los paquetes', c: 'gray' },
        { id: 'n4', t: 'box', x: 220, y: 325, w: 300, h: 50, l: 'Sin control de flujo', sub: 'ni de congestión', c: 'gray' },
        { id: 'p1', t: 'box', x: 580, y: 115, w: 300, h: 50, l: 'Puerto origen y puerto destino', sub: 'para identificar servicios', c: 'green' },
        { id: 'p2', t: 'box', x: 580, y: 185, w: 300, h: 50, l: 'Checksum', sub: 'de la parte de datos · opcional', c: 'orange' }
      ],
      links: []
    },
    uso: {
      kind: 'topo',
      nodes: [
        { id: 'C', t: 'pc', x: 120, y: 215, l: 'Cliente', sub: 'puerto alto' },
        { id: 'DNS', t: 'dns', x: 490, y: 110, l: 'Name server', sub: 'UDP 53' },
        { id: 'NTP', t: 'server', x: 490, y: 320, l: 'NTP server', sub: 'UDP 123' }
      ],
      links: [{ a: 'C', b: 'DNS' }, { a: 'C', b: 'NTP' }]
    },
    multi: {
      kind: 'topo',
      nodes: [
        { id: 'SRC', t: 'server', x: 120, y: 215, l: 'Emisor' }, { id: 'SW', t: 'switch', x: 380, y: 215, l: 'Red' },
        { id: 'R1', t: 'pc', x: 660, y: 95, l: 'Receptor 1' }, { id: 'R2', t: 'pc', x: 660, y: 215, l: 'Receptor 2' }, { id: 'R3', t: 'pc', x: 660, y: 335, l: 'Receptor 3' }
      ],
      links: [{ a: 'SRC', b: 'SW' }, { a: 'SW', b: 'R1' }, { a: 'SW', b: 'R2' }, { a: 'SW', b: 'R3' }]
    },
    rx: {
      kind: 'topo',
      nodes: [
        { id: 'C', t: 'pc', x: 100, y: 215, l: 'Origen' }, { id: 'H', t: 'server', x: 360, y: 215, l: 'Host destino' },
        { id: 'P1', t: 'box', x: 640, y: 100, w: 200, h: 48, l: 'Puerto 53 · activo', sub: 'hay lugar en el buffer', c: 'green' },
        { id: 'P2', t: 'box', x: 640, y: 215, w: 200, h: 48, l: 'Puerto 123 · activo', sub: 'buffer lleno', c: 'yellow' },
        { id: 'P3', t: 'box', x: 640, y: 330, w: 200, h: 48, l: 'Puerto 69 · inactivo', sub: 'no hay aplicación escuchando', c: 'gray' }
      ],
      links: [{ a: 'C', b: 'H' }, { a: 'H', b: 'P1' }, { a: 'H', b: 'P2' }, { a: 'H', b: 'P3', dash: 1 }]
    },
    pseudo: {
      kind: 'fields', title: 'Sobre qué se calcula el checksum', ruler: 32, rh: 40,
      rows: [
        [{ id: 'sip', l: 'Dirección IP origen', s: 'pseudo-cabecera', w: 32, c: 'gray', ghost: 1 }],
        [{ id: 'dip', l: 'Dirección IP destino', s: 'pseudo-cabecera', w: 32, c: 'gray', ghost: 1 }],
        [{ id: 'zero', l: 'Todo ceros', s: '8 bits', w: 8, c: 'gray', ghost: 1 }, { id: 'pid', l: 'Protocol ID', s: '8 bits', w: 8, c: 'gray', ghost: 1 }, { id: 'plen', l: 'UDP Total Length', s: '16 bits', w: 16, c: 'gray', ghost: 1 }],
        [{ id: 'sp', l: 'Puerto origen', s: 'cabecera UDP', w: 16, c: 'green' }, { id: 'dp', l: 'Puerto destino', s: 'cabecera UDP', w: 16, c: 'blue' }],
        [{ id: 'len', l: 'Longitud total UDP', s: 'cabecera UDP', w: 16, c: 'yellow' }, { id: 'ck', l: 'Checksum', s: 'cabecera UDP', w: 16, c: 'orange' }],
        [{ id: 'dat', l: 'Datos', s: 'datos UDP', w: 32, c: 'white' }]
      ]
    }
  },
  steps: [
    {
      s: 'UDP', k: 'contexto', t: 'UDP: transporte sin conexión',
      b: '<p><b>UDP</b> (User Datagram Protocol, RFC 768) es la otra opción de la capa de transporte: una variante mucho más simple que TCP.</p><ul><li><b>No es orientado a la conexión</b>: no hay handshake ni estado.</li><li>La detección de errores es <b>opcional</b>.</li><li>No hace control de flujo ni de congestión.</li><li>No secuencia los paquetes.</li></ul><p>A cambio es un protocolo <b>ágil</b>: útil para preguntas frecuentes y continuas, donde armar una conexión para cada una sería puro costo.</p>',
      key: 'Con UDP, el primer mensaje que se envía ya lleva los datos.',
      scene: 'agil'
    },
    {
      s: 'Cabecera', k: 'detalle', t: 'Una cabecera de 8 bytes',
      b: '<p>El tamaño de una cabecera refleja los servicios del protocolo, y la de UDP es mínima: <b>cuatro campos de 16 bits</b>, 8 bytes en total.</p><ul><li><b>Puerto origen</b> y <b>puerto destino</b>: igual que en TCP, identifican a la aplicación en cada host.</li><li><b>UDP Total Length</b>: la longitud total del datagrama, en octetos.</li><li><b>Checksum</b>: opcional.</li></ul><p>A continuación viene el campo de datos.</p>',
      key: 'Ocho bytes contra los veinte (como mínimo) de TCP.',
      fig: 'image129.png', scene: 'udp',
      det: 'No hay número de secuencia, ni ACK, ni flags, ni ventana: UDP no tiene nada que numerar, confirmar ni negociar.'
    },
    {
      s: 'vs TCP', k: 'comparación', t: 'Lo que UDP deja afuera',
      b: '<p>Comparada con la cabecera TCP, la de UDP conserva solo los <b>puertos</b> y el <b>checksum</b> (y suma su campo de longitud). Cada campo que falta es un servicio que UDP no da:</p><ul><li>Sin <b>secuencia</b> ni <b>ACK</b>: no hay confirmaciones, retransmisiones ni reordenamiento.</li><li>Sin <b>flags</b> SYN y FIN: no hay conexión que abrir ni cerrar.</li><li>Sin <b>Window</b>: no hay control de flujo.</li><li>Sin opciones: no hay nada que negociar.</li></ul>',
      key: 'Menos campos, menos servicios… y menos trabajo por cada mensaje.',
      scene: 'tcp', hi: ['sp', 'dp', 'ck'],
      det: 'Resaltado, lo único que TCP y UDP tienen en común: <b>puertos</b> y <b>checksum</b>. Todo lo que quedó pálido no existe en UDP.'
    },
    {
      s: 'Servicios', k: 'idea', t: 'Casi IP, más los puertos',
      b: '<p>UDP brinda servicios <b>similares a los de IP</b>:</p><ul><li><b>No orientado a la conexión</b>: no mantiene un estado.</li><li><b>No confiable</b>: no envía notificaciones en caso de descartes y no reordena.</li><li>No realiza <b>control de flujo</b>.</li></ul><p>Sobre eso agrega solo dos cosas:</p><ul><li><b>Puerto origen y puerto destino</b>, para identificar servicios.</li><li><b>Checksum</b> de la parte de datos, opcional.</li></ul>',
      key: 'UDP lleva el datagrama IP hasta la aplicación correcta, y poco más.',
      scene: 'serv', hi: ['p1', 'p2'],
      notes: [{ x: 432, y: 262, w: 296, c: 'yellow', text: 'Por eso se lo elige para <b>aplicaciones no críticas</b>, que no necesitan control de flujo ni de errores.' }]
    },
    {
      s: 'Usos', k: 'ejemplo', t: 'Petición y respuesta: DNS y NTP',
      b: '<p>UDP se prefiere para <b>procesos simples de petición y respuesta</b>:</p><ul><li><b>DNS</b>: la consulta de un cliente a su name server va sobre UDP porque es ágil; el servidor suele estar cerca y se puede confiar sin establecer una conexión.</li><li><b>NTP</b>: un cliente sincroniza su reloj con un NTP server; sirve, por ejemplo, para poder comparar logs.</li></ul><p>Como en TCP, los servicios escuchan en <b>well-known ports</b>.</p>',
      key: 'Una pregunta, una respuesta: abrir y cerrar una conexión costaría más que el intercambio mismo.',
      fig: 'image130.png', scene: 'uso',
      pk: [{ p: ['C', 'DNS'], l: 'consulta DNS', c: 'req', d: 1.3 }, { p: ['DNS', 'C'], l: 'respuesta', c: 'res', d: 1.3 }, { p: ['C', 'NTP'], l: '¿qué hora es?', c: 'req', d: 1.3 }, { p: ['NTP', 'C'], l: 'hora', c: 'res', d: 1.3 }],
      tbl: { x: 608, y: 140, w: 150, title: 'well-known ports UDP', cols: ['Puerto', 'Servicio'], rows: [['7', 'ECHO'], ['53', 'DNS'], ['69', 'TFTP'], ['123', 'NTP'], ['161', 'SNMP']] }
    },
    {
      s: 'Multicast', k: 'ejemplo', t: 'Uno a muchos y streaming',
      b: '<p>TCP es punto a punto: para llegar a varios destinos habría que establecer una conexión con cada uno. Si queremos enviar un mensaje <b>a más de uno</b>, tenemos que usar UDP:</p><ul><li><b>Multicast y broadcast</b>: los broadcasts van sobre UDP.</li><li><b>Streaming de audio y video</b>.</li></ul><p>No hay conexiones que mantener ni confirmaciones que esperar de cada receptor.</p>',
      key: 'Un datagrama UDP puede tener muchos destinatarios; una conexión TCP, solo dos extremos.',
      scene: 'multi', hi: ['SRC'], tags: { SRC: 'sin conexiones' },
      pk: [{ p: ['SRC', 'SW'], l: 'datagrama', c: 'data', d: 1.1 }, { p: ['SW', 'R1'], l: 'copia', c: 'data', d: 1.1 }, { p: ['SW', 'R2'], l: 'copia', c: 'data', d: 1.1, par: 1 }, { p: ['SW', 'R3'], l: 'copia', c: 'data', d: 1.1, par: 1 }]
    },
    {
      s: 'Receptor', k: 'mecanismo', t: 'Qué hace el que recibe',
      b: '<p>El sistema destino recibe un datagrama sin conexión previa. Verifica el <b>puerto destino</b> contra los puertos activos en ese momento:</p><ul><li>Si <b>no coincide</b> con ninguno activo, envía un <b>ICMP «destino inalcanzable»</b>.</li><li>Si coincide y <b>hay lugar en el buffer</b>, lo encola.</li><li>Si coincide pero no hay lugar, lo <b>descarta sin enviar mensaje de error</b>.</li></ul>',
      key: 'El único aviso que puede volver es el de puerto inactivo, y lo envía ICMP. El descarte por falta de lugar es silencioso.',
      scene: 'rx', tags: { P1: 'se encola', P2: 'se descarta, sin aviso', P3: 'ICMP destino inalcanzable' },
      pk: [{ p: ['C', 'H', 'P1'], l: '→ :53', c: 'req', d: 1.6, stay: 1 }, { p: ['C', 'H', 'P2'], l: '→ :123', c: 'bad', d: 1.6, drop: 1, dropAt: .8 }, { p: ['C', 'H'], l: '→ :69', c: 'req', d: 1 }, { p: ['H', 'C'], l: 'ICMP inalcanz.', c: 'bad', d: 1.2 }]
    },
    {
      s: 'Checksum', k: 'detalle', t: 'Checksum con pseudo-cabecera',
      b: '<p>El checksum de UDP es <b>opcional</b> y es su único control de errores. Como la cabecera trae poca información, para calcularlo se le agrega una <b>pseudo-cabecera</b>, armada con información de otra capa: las direcciones IP de origen y destino, el identificador de protocolo y la longitud UDP.</p><p>El checksum se calcula sobre pseudo-cabecera, cabecera UDP y datos. El receptor <b>rearma</b> todo eso, calcula el checksum y lo <b>compara</b> con el que recibió.</p>',
      key: 'Es detección, no recuperación: UDP no tiene con qué pedir una retransmisión.',
      fig: 'image131.png', scene: 'pseudo', hi: ['sip', 'dip', 'zero', 'pid', 'plen', 'ck'],
      det: 'Con borde punteado, la <b>pseudo-cabecera</b> que cada extremo arma para la cuenta. Debajo, la cabecera UDP y los datos.'
    },
    {
      s: 'Resumen', k: 'resumen', t: 'UDP en una mirada',
      b: '<ul><li><b>UDP</b>: transporte sin conexión, no confiable, sin control de flujo ni de congestión, sin secuenciar.</li><li>Cabecera de <b>8 bytes</b>: puertos, longitud y checksum opcional.</li><li>Se prefiere para <b>petición y respuesta</b> (DNS, NTP), <b>multicast y broadcast</b>, y <b>streaming</b>.</li><li>Puerto inactivo → ICMP destino inalcanzable; sin lugar en el buffer → descarte silencioso.</li><li>El checksum se calcula con una <b>pseudo-cabecera</b>.</li></ul><p>Con TCP y UDP queda cerrada la capa de transporte. La próxima unidad vuelve a la capa de enlace, pero en redes <b>WAN</b>, y empieza por <b>HDLC</b>.</p>',
      scene: 'udp', hi: ['sp', 'dp'],
      det: '<b>TCP</b>: conexión, confirmaciones, control de flujo y de congestión. <b>UDP</b>: puertos, un checksum opcional y nada más. La aplicación elige cuál le conviene.'
    }
  ],
  quiz: [
    { q: '¿Cuánto mide la cabecera UDP?', o: ['4 bytes', '8 bytes', '20 bytes', 'Es variable'], a: 1, why: 'Son cuatro campos de 16 bits: puerto origen, puerto destino, longitud total y checksum.' },
    { q: 'Llega un datagrama UDP a un puerto en el que no hay ninguna aplicación activa. ¿Qué hace el host destino?', o: ['Lo descarta en silencio', 'Responde con un segmento RST', 'Envía un ICMP «destino inalcanzable»', 'Lo encola hasta que alguien escuche'], a: 2, why: 'Si el puerto destino no coincide con ninguno activo se responde con ICMP. El descarte silencioso ocurre cuando el puerto está activo pero no hay lugar en el buffer.' },
    { q: '¿Por qué una consulta DNS va sobre UDP?', o: ['Porque UDP garantiza la entrega', 'Porque es un intercambio simple de petición y respuesta, y UDP es ágil', 'Porque UDP ordena las respuestas', 'Porque DNS necesita control de flujo'], a: 1, why: 'Para una pregunta y una respuesta no vale la pena establecer y liberar una conexión.' },
    { q: '¿Cuál de estos servicios sí ofrece UDP?', o: ['Control de flujo', 'Retransmisión de datagramas perdidos', 'Identificar a la aplicación mediante puertos', 'Reordenar los datagramas'], a: 2, why: 'UDP agrega a IP los puertos origen y destino y un checksum opcional; no confirma, no reordena y no controla el flujo.' }
  ],
  cheat: [
    ['UDP', 'RFC 768. Transporte no orientado a la conexión y no confiable; ágil, para preguntas frecuentes y continuas.'],
    ['Cabecera', '8 bytes: puerto origen, puerto destino, longitud total y checksum (opcional), 16 bits cada uno.'],
    ['Qué no hace', 'No mantiene estado, no confirma, no avisa descartes, no reordena, no controla flujo ni congestión.'],
    ['Qué agrega a IP', 'Puertos para identificar servicios y un checksum opcional.'],
    ['Se prefiere para', 'Petición y respuesta simple (DNS, NTP), multicast y broadcast, streaming de audio y video.'],
    ['Receptor', 'Puerto inactivo → ICMP destino inalcanzable. Puerto activo con lugar → encola. Sin lugar → descarta sin avisar.'],
    ['Well-known ports', '7 ECHO · 53 DNS · 69 TFTP · 123 NTP · 161 SNMP.'],
    ['Checksum', 'Se calcula sobre pseudo-cabecera (IP origen, IP destino, Protocol ID, longitud UDP) + cabecera UDP + datos.']
  ]
});

COURSE.add({
  id: 'tcp-flujo',
  title: 'TCP: control de flujo y retransmisión',
  desc: 'Cómo hace el receptor para frenar al emisor sin dejar de confirmar: créditos en bytes, el ejemplo de Stallings paso a paso, y cuánto esperar antes de retransmitir.',
  min: 12, level: 'Intermedio',
  learn: [
    'Para qué sirve el control de flujo y por qué stop and wait es ineficiente',
    'Por qué TCP separa la confirmación (ACK) del permiso para enviar (Window)',
    'Cómo se lleva la cuenta del crédito, con el ejemplo de Stallings',
    'Qué resuelve la opción window scale factor',
    'Cómo se elige el RTO a partir del round trip delay'
  ],
  stats: [{ k: 'cred', l: 'Crédito de A' }, { k: 'rng', l: 'Puede enviar' }, { k: 'sin', l: 'Enviado sin confirmar' }],
  legend: [['req', 'segmento de datos'], ['res', 'ACK + Window'], ['ctl', 'Window = 0 (freno)'], ['key', 'retransmisión'], ['bad', 'perdido / de más']],
  scenes: {
    sw: {
      kind: 'seq',
      actors: [{ id: 'A', l: 'A · Argentina', t: 'pc' }, { id: 'B', l: 'B · Europa', t: 'pc' }],
      msgs: [
        { f: 'A', to: 'B', l: 'paquete 1 · tarda 125 ms en llegar', c: 'req' },
        { f: 'B', to: 'A', l: 'ACK 1 · otros 125 ms de vuelta', c: 'res' },
        { at: 'A', note: 't = 250 ms: recién ahora envía el 2' },
        { f: 'A', to: 'B', l: 'paquete 2', c: 'req' },
        { f: 'B', to: 'A', l: 'ACK 2', c: 'res' },
        { at: 'A', note: 't = 500 ms → 4 paquetes por segundo' }
      ]
    },
    sld: {
      kind: 'seq',
      actors: [{ id: 'A', l: 'A', t: 'pc' }, { id: 'B', l: 'B', t: 'pc' }],
      msgs: [
        { f: 'A', to: 'B', l: 'paquete 1', c: 'req' },
        { f: 'A', to: 'B', l: 'paquete 2', c: 'req' },
        { f: 'A', to: 'B', l: 'paquete 3', c: 'req' },
        { f: 'A', to: 'B', l: 'paquete 4', c: 'req' },
        { at: 'A', note: 'ventana = 4: el quinto tiene que esperar' },
        { f: 'B', to: 'A', l: 'ACK del paquete 1', c: 'res' },
        { f: 'A', to: 'B', l: 'paquete 5', c: 'req' }
      ]
    },
    cab: {
      kind: 'fields', title: 'Cabecera TCP: dos campos, dos mecanismos', ruler: 32, rh: 40,
      rows: [
        [{ id: 'sp', l: 'Puerto origen', s: '16 bits', w: 16, c: 'green' }, { id: 'dp', l: 'Puerto destino', s: '16 bits', w: 16, c: 'blue' }],
        [{ id: 'seq', l: 'Número de secuencia', s: '32 bits', w: 32, c: 'yellow' }],
        [{ id: 'ack', l: 'Número de confirmación (ACK) → control de errores', s: '32 bits', w: 32, c: 'purple' }],
        [{ id: 'hl', l: 'Header length', s: '4 bits', w: 4, c: 'orange' }, { id: 'rsv', l: 'Reservado', s: '6 bits', w: 6, c: 'gray' }, { id: 'fl', l: 'Flags', s: '6 bits', w: 6, c: 'red' },
          { id: 'win', l: 'Window → control de flujo', s: '16 bits', w: 16, c: 'blue' }],
        [{ id: 'ck', l: 'Checksum', s: '16 bits', w: 16, c: 'gray' }, { id: 'up', l: 'Urgent pointer', s: '16 bits', w: 16, c: 'red' }],
        [{ id: 'opt', l: 'Opciones: MSS, Window scale, Timestamp…', s: 'longitud variable', w: 32, c: 'white', ghost: 1 }]
      ]
    },
    st: {
      kind: 'seq',
      actors: [{ id: 'A', l: 'Entidad A', t: 'pc' }, { id: 'B', l: 'Entidad B', t: 'server' }],
      msgs: [
        { at: 'A', note: 'crédito 1400: del 1001 al 2400', c: 'green' },
        { f: 'A', to: 'B', l: 'SN = 1001 · 200 bytes', c: 'req' },
        { f: 'A', to: 'B', l: 'SN = 1201 · 200 bytes', c: 'req' },
        { f: 'A', to: 'B', l: 'SN = 1401 · 200 bytes', c: 'req' },
        { at: 'A', note: 'usó 600: le quedan 800' },
        { at: 'B', note: 'envía ACK = 1601, Window = 1000', c: 'blue' },
        { f: 'A', to: 'B', l: 'SN = 1601 · 200 bytes', c: 'req' },
        { f: 'A', to: 'B', l: 'SN = 1801 · 200 bytes', c: 'req' },
        { at: 'A', note: 'sin ese ACK todavía: le quedan 400' },
        { f: 'B', to: 'A', l: 'llega ACK = 1601 · Window = 1000', c: 'res' },
        { at: 'A', note: 'ventana 1601 a 2600: quedan 600', c: 'green' },
        { f: 'B', to: 'A', l: 'ACK = 2001 · Window = 0', c: 'ctl' },
        { at: 'A', note: 'crédito 0: A deja de transmitir', c: 'red' }
      ]
    },
    tx: { kind: 'bits' },
    ws: { kind: 'bits' },
    rto: {
      kind: 'seq',
      actors: [{ id: 'A', l: 'A', t: 'pc' }, { id: 'B', l: 'B', t: 'server' }],
      msgs: [
        { div: 'se pierde un segmento' },
        { f: 'A', to: 'B', l: 'SN = 1001', c: 'req', lost: 1 },
        { at: 'A', note: 'no llega el ACK: expira el RTO', c: 'red' },
        { f: 'A', to: 'B', l: 'retransmisión · SN = 1001', c: 'key' },
        { f: 'B', to: 'A', l: 'ACK = 1201', c: 'res' },
        { div: 'RTO muy corto: 5 ms con un round trip delay de 10 ms' },
        { f: 'A', to: 'B', l: 'SN = 1201', c: 'req' },
        { f: 'A', to: 'B', l: 'a los 5 ms: retransmisión innecesaria', c: 'bad' },
        { f: 'B', to: 'A', l: 'ACK = 1401 (llega a los 10 ms)', c: 'res' },
        { at: 'B', note: 'B recibió dos copias del mismo segmento' }
      ]
    }
  },
  steps: [
    {
      s: 'Stop & wait', k: 'problema', t: 'Controlar el flujo: stop and wait',
      b: '<p>El <b>control de flujo</b> permite que un extremo le indique al otro que deje de transmitir. Hace falta porque los dos nodos suelen tener <b>capacidades distintas</b>: la comunicación se ajusta a la del que menos puede.</p><p>La forma más simple es <b>stop and wait</b>: envío un mensaje y no envío otro hasta recibir su confirmación. Si el receptor no puede almacenar más, no confirma.</p><p>Con A y B lejos y un <b>round trip delay de 250 ms</b>, sale un mensaje cada 250 ms: apenas <b>4 paquetes por segundo</b>.</p>',
      key: 'Stop and wait frena bien al emisor, pero desperdicia el enlace: casi todo el tiempo se va en esperar.',
      fig: ['image120.png', 'image121.png'], scene: 'sw',
      st: { cred: '—', rng: '—', sin: '—' }
    },
    {
      s: 'Ventana', k: 'idea', t: 'Ventana deslizante',
      b: '<p>La <b>ventana deslizante</b> (sliding window) mejora el esquema: se envían <b>varios paquetes sin esperar confirmación</b>. Con una ventana de 4, A manda cuatro seguidos y no puede enviar el quinto hasta recibir el ACK del primero. Cada confirmación libera lugar para un paquete más.</p><p>El tamaño de la ventana depende de la capacidad de los dispositivos, del <b>ancho de banda</b> y del <b>retardo</b> extremo a extremo: al doble de distancia (500 ms), la misma ventana rinde solo 8 paquetes por segundo.</p>',
      key: 'Así funciona HDLC: la ventana se mide en mensajes y cada ACK, además de confirmar, habilita a enviar el siguiente.',
      scene: 'sld'
    },
    {
      s: 'Créditos', k: 'idea', t: 'TCP separa confirmar de dar permiso',
      b: '<p>En HDLC, confirmar y dar permiso son <b>lo mismo</b>. Si B recibió bien una trama pero no quiere más, tiene que <b>retener el ACK</b>, y deja sin confirmar algo que sí llegó: el control de flujo se mete con el control de errores.</p><p>TCP los separa con un <b>esquema de créditos</b>. Cada confirmación lleva dos datos:</p><ul><li><b>ACK = i</b>: recibí todo hasta i − 1; espero el i.</li><li><b>Window = j</b>: podés enviarme j octetos, del i al i + j − 1.</li></ul>',
      key: 'El crédito es el <b>buffer</b> que el sistema operativo del receptor reservó para la conexión. Se mide en bytes, no en mensajes, y cada extremo le otorga el suyo al otro.',
      scene: 'cab', hi: ['ack', 'win'],
      det: 'Ejemplo: <b>ACK = 30, Window = 64240</b> → recibí hasta el octeto 29 y podés enviarme del 30 al 64269. Un extremo puede confirmar datos <b>sin permitir más</b>.'
    },
    {
      s: 'Ejemplo 1', k: 'ejemplo', t: 'Stallings: A gasta su crédito',
      b: '<p>Ejemplo de Stallings, con segmentos de <b>200 bytes</b>. B le había otorgado a A un crédito de <b>1400 octetos</b> a partir del 1001: A puede enviar del 1001 al 2400, y B también lleva esa cuenta.</p><p>La aplicación le entrega a A tres bloques. TCP los encapsula con número de secuencia <b>1001</b>, <b>1201</b> y <b>1401</b> (el del primer byte de cada uno).</p><p>Con cada transmisión A <b>achica su ventana</b>: consumió 600 y le quedan <b>800</b>.</p>',
      key: 'El emisor descuenta crédito al enviar, sin esperar a que el segmento llegue ni a que se lo confirmen.',
      fig: 'image122.png', scene: 'st', upto: 5,
      st: { cred: '800 bytes', rng: '1601 – 2400', sin: '600 bytes' }
    },
    {
      s: 'Ejemplo 2', k: 'ejemplo', t: 'Stallings: B confirma y da menos crédito',
      b: '<p>B recibe los tres segmentos y los confirma con <b>ACK = 1601</b>. Pero no devuelve todo el crédito: solo puede recibir <b>200 bytes más allá de la ventana original</b>, así que anuncia <b>Window = 1000</b> (del 1601 al 2600).</p><p>Mientras esa confirmación viaja, la aplicación le da a A dos bloques más: salen con secuencia <b>1601</b> y <b>1801</b>.</p><p>A lleva enviados cinco segmentos sin recibir nada: usó 1000 de los 1400 y le quedan <b>400</b>.</p>',
      key: 'A los 800 que le quedaban a A, B le suma 200. Pero A recién se entera cuando llega la confirmación; mientras tanto se maneja con lo que tiene.',
      fig: 'image122.png', scene: 'st', upto: 9,
      st: { cred: '400 bytes', rng: '2001 – 2400', sin: '1000 bytes' }
    },
    {
      s: 'Window = 0', k: 'ejemplo', t: 'Stallings: llega el crédito… y el freno',
      b: '<p>Llega a A el <code>ACK = 1601, Window = 1000</code>. Su ventana ahora va del 1601 al 2600, y ya usó 400 con los dos últimos segmentos (todavía en viaje): le quedan <b>600</b>. B, al recibirlos, hace la misma cuenta.</p><p>Si B se queda sin lugar o no llega a procesar, puede frenar a A <b>sin dejar de confirmar</b>: <code>ACK = 2001, Window = 0</code>. Recibió bien hasta el 2000, pero el crédito es cero.</p>',
      key: 'Lo que A haya enviado por encima del 2000 antes de enterarse se da por perdido: B no tiene dónde ponerlo, y habrá que reenviarlo cuando vuelva a dar crédito.',
      fig: 'image122.png', scene: 'st',
      st: { cred: '600 → 0', rng: '2001 – 2600 → nada', sin: '400 → 0' }
    },
    {
      s: 'Transmisor', k: 'detalle', t: 'La ventana vista desde el transmisor',
      b: '<p>Para el <b>transmisor</b>, la secuencia de bytes queda partida en tres zonas:</p><ul><li><b>Datos confirmados</b>: enviados y con el ACK recibido.</li><li><b>Datos enviados sin confirmar</b>: desde el número del último ACK recibido hasta el próximo número de secuencia a enviar.</li><li><b>Transmisión permitida</b>: desde el próximo número de secuencia hasta el <b>fin de la ventana</b> (el crédito).</li></ul><p>Abajo, la ventana de A en los cuatro momentos del ejemplo.</p>',
      key: 'Por eso es «deslizante»: el borde de atrás avanza con cada ACK y el de adelante con cada crédito.',
      fig: 'image126.png', scene: 'tx', title: 'La ventana de A sobre la secuencia de bytes',
      lines: [{ l: 'Último ACK recibido', v: '1601' }, { l: 'Próximo SN a enviar', v: '2001' }, { l: 'Fin de la ventana', v: '2600' }, { l: 'Transmisión permitida', v: '600 bytes', hi: 1 }],
      bars: [
        { title: '1 · Crédito inicial de 1400', span: [1001, 2600], h: 30, blocks: [{ a: 1001, b: 2400, l: 'puede enviar: 1400', c: 'green' }, { a: 2401, b: 2600, l: 'sin crédito', free: 1 }] },
        { title: '2 · Envió 1001, 1201 y 1401', span: [1001, 2600], h: 30, blocks: [{ a: 1001, b: 1600, l: 'enviado sin confirmar: 600', c: 'yellow' }, { a: 1601, b: 2400, l: 'puede enviar: 800', c: 'green' }, { a: 2401, b: 2600, l: 'sin crédito', free: 1 }] },
        { title: '3 · Envió también 1601 y 1801', span: [1001, 2600], h: 30, blocks: [{ a: 1001, b: 2000, l: 'enviado sin confirmar: 1000', c: 'yellow' }, { a: 2001, b: 2400, l: 'puede enviar: 400', c: 'green' }, { a: 2401, b: 2600, l: 'sin crédito', free: 1 }] },
        { title: '4 · Llegó ACK = 1601, Window = 1000', span: [1001, 2600], h: 30, blocks: [{ a: 1001, b: 1600, l: 'confirmado', c: 'gray' }, { a: 1601, b: 2000, l: 'sin confirmar: 400', c: 'yellow' }, { a: 2001, b: 2600, l: 'puede enviar: 600', c: 'green', hi: 1 }] }
      ],
      st: { cred: '600 bytes', rng: '2001 – 2600', sin: '400 bytes' }
    },
    {
      s: 'Win scale', k: 'detalle', t: 'Window scale factor: ventanas más grandes',
      b: '<p>El campo Window mide 16 bits: como máximo, <b>65535 bytes</b>. La opción <b>window scale factor</b> nació para enlaces de <b>muy alto retardo</b>, como un satélite geoestacionario (round trip delay del orden de 500 ms): hay que tener muchos paquetes en tránsito mientras los ACK tardan en volver.</p><p>Hoy pasa lo mismo con enlaces de <b>mucho ancho de banda</b>: lo que cuenta es la relación entre ancho de banda y retardo.</p><p>La opción lleva un valor, por ejemplo 8, y el campo Window se multiplica por 2⁸ = 256.</p>',
      key: 'En la captura, Window = 513 con factor 256: la ventana real es 513 × 256 = <b>131328 bytes</b>, imposible de escribir en 16 bits.',
      fig: 'image125.png', scene: 'ws', title: 'Window scale: escalar un campo de 16 bits',
      lines: [{ l: 'Campo Window (16 bits)', v: '513' }, { l: 'Opción Window scale', v: '8 → × 2⁸ = 256' }, { l: 'Ventana real', v: '513 × 256 = 131328', hi: 1 }, { l: 'Máximo sin escala', v: '65535 bytes' }],
      bars: [{ title: 'Ventana anunciada, en bytes', span: [1, 131328], h: 44, blocks: [{ a: 1, b: 65535, l: 'lo máximo que entra en 16 bits', c: 'yellow' }, { a: 65536, b: 131328, l: 'solo con window scale', c: 'green', hi: 1 }] }],
      tbl: { x: 40, y: 262, w: 640, title: 'Cuándo no alcanzan 65535 bytes', cols: ['Escenario', 'Round trip delay', 'Qué pasa'], rows: [['Satélite geoestacionario', '≈ 500 ms', 'los ACK tardan: hay que tener muchos paquetes en tránsito'], ['Enlace de gran ancho de banda', 'algunos ms', 'se puede enviar muchísimo antes de que vuelva un ACK']] },
      st: { cred: '—', rng: '—', sin: '—' }
    },
    {
      s: 'RTO', k: 'mecanismo', t: 'Retransmisión: cuánto esperar el ACK',
      b: '<p>TCP solo tiene <b>confirmación positiva</b>: no existe el rechazo. Si el ACK de un segmento no llega dentro del <b>RTO</b> (Retransmission Time Out), se retransmite.</p><p>El RTO es propio de cada conexión: dentro de Buenos Aires el round trip delay ronda los 10 ms; hacia Europa, los 250 ms.</p><ul><li><b>Muy corto</b>: se reenvía algo que había llegado bien; tráfico de más y copias duplicadas.</li><li><b>Muy largo</b> (400 ms para un RTD de 10): ante una pérdida, el emisor queda ocioso esperando.</li></ul>',
      key: 'El RTO debe ser función del round trip delay: un poco más, nunca menos y no mucho más. La opción <b>Timestamp</b> permite medirlo con precisión para ajustar el RTO.',
      scene: 'rto'
    },
    {
      s: 'Resumen', k: 'resumen', t: 'Flujo y errores, cada uno con su campo',
      b: '<ul><li><b>Control de flujo</b>: que el receptor pueda frenar al emisor.</li><li>Stop and wait → ventana deslizante → <b>créditos</b> en bytes.</li><li><code>ACK = i, Window = j</code>: recibí hasta i − 1; podés enviar de i a i + j − 1.</li><li><b>Window = 0</b> frena sin dejar de confirmar.</li><li><b>Window scale</b>: ventanas de más de 65535 bytes.</li><li>Solo ACK positivo; sin ACK dentro del <b>RTO</b>, se retransmite.</li></ul><p>El crédito dice cuánto puede recibir <b>el otro extremo</b>, no cuánto aguanta <b>la red</b> que está en el medio. De eso se ocupa el control de congestión, en la próxima lección.</p>',
      scene: 'cab', hi: ['seq', 'ack', 'win', 'opt'],
      det: '<b>Secuencia + ACK</b> → qué llegó (control de errores) · <b>Window</b> → cuánto más se puede enviar (control de flujo) · <b>Opciones</b> → Window scale y Timestamp.'
    }
  ],
  quiz: [
    { q: 'Con stop and wait y un round trip delay de 250 ms, ¿cuántos paquetes se envían por segundo?', o: ['1', '4', '8', '250'], a: 1, why: 'Cada paquete tarda 125 ms en llegar y su ACK otros 125 ms en volver: uno cada 250 ms, es decir 4 por segundo.' },
    { q: 'A recibe un segmento con ACK = 1601 y Window = 1000. ¿Hasta qué byte tiene permitido enviar?', o: ['1000', '1601', '2600', '2601'], a: 2, why: 'El crédito va de i a i + j − 1: de 1601 a 1601 + 1000 − 1 = 2600.' },
    { q: '¿Por qué TCP separa el ACK del campo Window?', o: ['Para que la cabecera tenga 20 bytes', 'Para poder confirmar lo recibido sin dar permiso para enviar más', 'Porque el ACK viaja por UDP', 'Para no tener que numerar los bytes'], a: 1, why: 'Si confirmar fuera dar permiso (como en HDLC), para frenar habría que retener el ACK de datos que sí llegaron. Con Window = 0 se frena y se confirma igual.' },
    { q: '¿Qué pasa si el RTO es menor que el round trip delay?', o: ['El emisor queda ocioso mucho tiempo', 'Se retransmiten segmentos que habían llegado bien', 'El receptor envía un rechazo', 'Se agota el crédito'], a: 1, why: 'El emisor no espera lo suficiente: reenvía antes de que el ACK pueda llegar y el receptor recibe copias duplicadas.' }
  ],
  cheat: [
    ['Control de flujo', 'Mecanismo para que un extremo le indique al otro que deje de transmitir; iguala capacidades distintas.'],
    ['Stop and wait', 'Un mensaje y esperar su ACK. Con RTD de 250 ms: 4 paquetes por segundo.'],
    ['Ventana deslizante', 'Varios mensajes sin confirmar (p. ej. 4); cada ACK habilita uno más. En HDLC confirmar = dar permiso.'],
    ['Créditos (TCP)', '<b>ACK = i, Window = j</b>: recibí hasta i − 1 y podés enviar de i a i + j − 1. El crédito es el buffer del receptor, en bytes.'],
    ['Ejemplo de Stallings', 'Crédito 1400 desde 1001 → envía 3 × 200: quedan 800 → envía 2 más: 400 → llega ACK 1601, W 1000: quedan 600.'],
    ['Window = 0', 'Frena al emisor sin dejar de confirmar. Lo enviado por encima se pierde y se reenvía después.'],
    ['Window scale', 'Opción que multiplica el campo Window por 2ⁿ: 513 × 256 = 131328 bytes. Para mucho retardo o mucho ancho de banda.'],
    ['RTO / Timestamp', 'Solo ACK positivo: sin ACK dentro del RTO, se retransmite. RTO apenas mayor al round trip delay; Timestamp sirve para medirlo.']
  ]
});

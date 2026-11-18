COURSE.add({
  id: 'hdlc',
  title: 'HDLC: enlace orientado al bit',
  desc: 'El protocolo de enlace de las WAN punto a punto: cómo delimita las tramas con un flag, qué lleva el campo de control y cómo confirma, frena y retransmite contando tramas.',
  min: 12, level: 'Intermedio',
  learn: [
    'Qué significa que un protocolo sea orientado al bit y para qué sirve la inserción de ceros',
    'Qué tipos de estación y configuraciones define HDLC',
    'Cómo es la trama y cómo se leen las tramas I, S y U del campo de control',
    'Cómo se usan N(S), N(R) y el bit P/F',
    'Cómo se recupera de un rechazo (REJ, go-back-N) y de la expiración del timer T1'
  ],
  stats: [{ k: 'etapa', l: 'Etapa' }, { k: 'mec', l: 'Mecanismo' }, { k: 'conf', l: 'Última confirmación' }],
  legend: [['req', 'trama I de A'], ['res', 'trama I de B'], ['ctl', 'supervisión (S)'], ['key', 'no numerada (U)'], ['bad', 'trama perdida']],
  scenes: {
    est: {
      kind: 'topo',
      zones: [
        { id: 'z1', x: 24, y: 62, w: 440, h: 326, l: 'Configuración no equilibrada', c: 'yellow' },
        { id: 'z2', x: 486, y: 62, w: 290, h: 326, l: 'Configuración equilibrada', c: 'green' }
      ],
      nodes: [
        { id: 'P', t: 'server', x: 110, y: 215, l: 'Primaria', sub: 'host: emite órdenes' },
        { id: 'S1', t: 'pc', x: 370, y: 140, l: 'Secundaria', sub: 'terminal: solo responde' },
        { id: 'S2', t: 'pc', x: 370, y: 290, l: 'Secundaria', sub: 'terminal: solo responde' },
        { id: 'RA', t: 'router', x: 550, y: 215, l: 'Router A', sub: 'combinada' },
        { id: 'RB', t: 'router', x: 712, y: 215, l: 'Router B', sub: 'combinada' }
      ],
      links: [{ a: 'P', b: 'S1' }, { a: 'P', b: 'S2' }, { a: 'RA', b: 'RB', l: 'serial', ly: 26, thick: 1 }]
    },
    stuff: {
      kind: 'fields', title: 'Delimitación con flags e inserción de ceros', rh: 50,
      rows: [
        [{ id: 'la', l: 'Mensaje a enviar', w: 12, c: 'gray' }, { id: 'a1', l: '0', w: 1.6, c: 'white' }, { id: 'a2', l: '11111', s: 'cinco 1', w: 5, c: 'yellow' }, { id: 'a3', l: '1', w: 1.6, c: 'white' }, { id: 'a4', l: '0', w: 1.6, c: 'white' }, { id: 'a5', l: '11111', s: 'cinco 1', w: 5, c: 'yellow' }, { id: 'a6', l: '1', w: 1.6, c: 'white' }, { id: 'a7', l: '00', w: 2.4, c: 'white' }],
        [{ id: 'lb', l: 'En el enlace', w: 7.5, c: 'gray' }, { id: 'f1', l: '01111110', s: 'flag · 7E', w: 7.5, c: 'purple' }, { id: 'b1', l: '0', w: 1.6, c: 'white' }, { id: 'b2', l: '11111', w: 5, c: 'yellow' }, { id: 'z1', l: '0', w: 1.8, c: 'orange' }, { id: 'b3', l: '1', w: 1.6, c: 'white' }, { id: 'b4', l: '0', w: 1.6, c: 'white' }, { id: 'b5', l: '11111', w: 5, c: 'yellow' }, { id: 'z2', l: '0', w: 1.8, c: 'orange' }, { id: 'b6', l: '1', w: 1.6, c: 'white' }, { id: 'b7', l: '00', w: 2.4, c: 'white' }, { id: 'f2', l: '01111110', s: 'flag · 7E', w: 7.5, c: 'purple' }],
        [{ id: 'lc', l: 'Mensaje que entrega el receptor', w: 12, c: 'gray' }, { id: 'c1', l: '0', w: 1.6, c: 'white' }, { id: 'c2', l: '11111', w: 5, c: 'yellow' }, { id: 'c3', l: '1', w: 1.6, c: 'white' }, { id: 'c4', l: '0', w: 1.6, c: 'white' }, { id: 'c5', l: '11111', w: 5, c: 'yellow' }, { id: 'c6', l: '1', w: 1.6, c: 'white' }, { id: 'c7', l: '00', w: 2.4, c: 'white' }]
      ]
    },
    trama: {
      kind: 'fields', title: 'Trama HDLC', rh: 46,
      rows: [[
        { id: 'fl1', l: 'Flag', s: '01111110', w: 5, c: 'purple' }, { id: 'dir', l: 'Dirección', s: '8 bits', w: 5, c: 'blue' },
        { id: 'ctl', l: 'Control', s: '8 o 16 bits', w: 6, c: 'yellow' }, { id: 'dat', l: 'Datos', s: 'longitud variable', w: 14, c: 'white' },
        { id: 'fcs', l: 'FCS', s: '16 o 32 bits', w: 6, c: 'orange' }, { id: 'fl2', l: 'Flag', s: '01111110', w: 5, c: 'purple' }
      ]],
      zoom: {
        from: 'ctl', title: 'Campo de control de 8 bits: tres formatos', x: 60, w: 680,
        rows: [
          [{ id: 'i0', l: '0', w: 1, c: 'green' }, { id: 'ins', l: 'N(S)', s: '3 bits', w: 3, c: 'green' }, { id: 'ipf', l: 'P/F', s: '1 bit', w: 1, c: 'purple' }, { id: 'inr', l: 'N(R)', s: '3 bits', w: 3, c: 'blue' }, { id: 'il', l: 'I · Información', s: 'lleva datos', w: 5.5, c: 'gray' }],
          [{ id: 's0', l: '1', w: 1, c: 'yellow' }, { id: 's1', l: '0', w: 1, c: 'yellow' }, { id: 'scod', l: 'Código', s: '2 bits', w: 2, c: 'yellow' }, { id: 'spf', l: 'P/F', s: '1 bit', w: 1, c: 'purple' }, { id: 'snr', l: 'N(R)', s: '3 bits', w: 3, c: 'blue' }, { id: 'sl', l: 'S · Supervisión', s: 'RR · RNR · REJ · SREJ', w: 5.5, c: 'gray' }],
          [{ id: 'u0', l: '1', w: 1, c: 'orange' }, { id: 'u1', l: '1', w: 1, c: 'orange' }, { id: 'ucod', l: 'Código', s: '2 bits', w: 2, c: 'orange' }, { id: 'upf', l: 'P/F', s: '1 bit', w: 1, c: 'purple' }, { id: 'ucod2', l: 'Código', s: '3 bits', w: 3, c: 'orange' }, { id: 'ul', l: 'U · No numerada', s: 'SABM · UA · DISC · DM · FRMR', w: 5.5, c: 'gray' }]
        ]
      }
    },
    con: {
      kind: 'seq',
      actors: [{ id: 'A', l: 'Router A', t: 'router' }, { id: 'B', l: 'Router B', t: 'router' }],
      msgs: [
        { div: 'iniciación' },
        { f: 'A', to: 'B', l: 'SABM · pido conexión en modo balanceado', c: 'key' },
        { at: 'A', note: 'expira T1 sin respuesta', c: 'red' },
        { f: 'A', to: 'B', l: 'SABM · retransmisión', c: 'key' },
        { f: 'B', to: 'A', l: 'UA · conexión aceptada', c: 'key' },
        { div: 'transferencia' },
        { f: 'A', to: 'B', l: 'I, 0, 0 · la numeración empieza en 0', c: 'req' },
        { note: '… intercambio de tramas I y S …', c: 'gray' },
        { div: 'desconexión' },
        { f: 'A', to: 'B', l: 'DISC · cierro la conexión', c: 'key' },
        { f: 'B', to: 'A', l: 'UA · confirmado', c: 'key' }
      ]
    },
    ej1: {
      kind: 'seq',
      actors: [{ id: 'A', l: 'Router A', t: 'router' }, { id: 'B', l: 'Router B', t: 'router' }],
      msgs: [
        { f: 'A', to: 'B', l: 'I, 0, 0 · trama 0 de A', c: 'req' },
        { f: 'B', to: 'A', l: 'I, 0, 1 · trama 0 de B, confirma la 0 de A', c: 'res' },
        { f: 'A', to: 'B', l: 'I, 1, 1 · trama 1 de A, confirma la 0 de B', c: 'req' },
        { f: 'A', to: 'B', l: 'I, 2, 1 · trama 2 de A', c: 'req' },
        { f: 'B', to: 'A', l: 'I, 1, 3 · trama 1 de B, confirma la 1 y la 2 juntas', c: 'res' },
        { f: 'A', to: 'B', l: 'I, 3, 2 · trama 3 de A, confirma la 1 de B', c: 'req' },
        { f: 'B', to: 'A', l: 'I, 2, 4 · trama 2 de B, confirma la 3 de A', c: 'res' },
        { f: 'B', to: 'A', l: 'I, 3, 4 · trama 3 de B', c: 'res' },
        { f: 'A', to: 'B', l: 'RR, 4 · sin datos para enviar: solo confirma la 2 y la 3', c: 'ctl' }
      ]
    },
    ej2: {
      kind: 'seq',
      actors: [{ id: 'A', l: 'Router A', t: 'router' }, { id: 'B', l: 'Router B', t: 'router' }],
      msgs: [
        { f: 'B', to: 'A', l: 'I, 3, 0 · trama 3 de B', c: 'res' },
        { f: 'A', to: 'B', l: 'RNR, 4 · recibí la 3, pero estoy ocupado', c: 'ctl' },
        { at: 'B', note: 'transmisión suspendida', c: 'yellow' },
        { f: 'B', to: 'A', l: 'RR, 0, P · sondeo: exijo una respuesta', c: 'ctl' },
        { f: 'A', to: 'B', l: 'RNR, 4, F · sigo ocupado', c: 'ctl' },
        { f: 'B', to: 'A', l: 'RR, 0, P · pasado un tiempo, insiste', c: 'ctl' },
        { f: 'A', to: 'B', l: 'RR, 4, F · listo: espero la 4', c: 'ctl' },
        { f: 'B', to: 'A', l: 'I, 4, 0 · se retoma la transferencia', c: 'res' }
      ]
    },
    ej3: {
      kind: 'seq',
      actors: [{ id: 'A', l: 'Router A', t: 'router' }, { id: 'B', l: 'Router B', t: 'router' }],
      msgs: [
        { f: 'A', to: 'B', l: 'I, 3, 0', c: 'req' },
        { f: 'A', to: 'B', l: 'I, 4, 0 · se pierde', c: 'bad', lost: 1 },
        { f: 'A', to: 'B', l: 'I, 5, 0', c: 'req' },
        { at: 'B', note: 'llegó la 5, esperaba la 4', c: 'red' },
        { f: 'B', to: 'A', l: 'REJ, 4 · rechazo: espero la 4', c: 'ctl' },
        { f: 'A', to: 'B', l: 'I, 4, 0 · vuelve atrás y retransmite', c: 'req' },
        { f: 'A', to: 'B', l: 'I, 5, 0 · otra vez, aunque ya había llegado', c: 'req' },
        { f: 'A', to: 'B', l: 'I, 6, 0', c: 'req' }
      ]
    },
    ej4: {
      kind: 'seq',
      actors: [{ id: 'A', l: 'Router A', t: 'router' }, { id: 'B', l: 'Router B', t: 'router' }],
      msgs: [
        { f: 'A', to: 'B', l: 'I, 2, 0', c: 'req' },
        { f: 'A', to: 'B', l: 'I, 3, 0 · se pierde', c: 'bad', lost: 1 },
        { f: 'B', to: 'A', l: 'RR, 3 · recibí la 2, espero la 3', c: 'ctl' },
        { at: 'A', note: 'expira T1: la 3 sigue sin confirmar', c: 'red' },
        { f: 'A', to: 'B', l: 'RR, 0, P · sondeo antes de retransmitir', c: 'ctl' },
        { f: 'B', to: 'A', l: 'RR, 3, F · acá estoy, sigo esperando la 3', c: 'ctl' },
        { f: 'A', to: 'B', l: 'I, 3, 0 · retransmisión', c: 'req' },
        { f: 'B', to: 'A', l: 'RR, 4 · confirmada la 3', c: 'ctl' }
      ]
    },
    enlace: {
      kind: 'topo',
      nodes: [
        { id: 'A', t: 'router', x: 170, y: 200, l: 'Router A', sub: 'estación combinada' },
        { id: 'B', t: 'router', x: 630, y: 200, l: 'Router B', sub: 'estación combinada' }
      ],
      links: [{ a: 'A', b: 'B', l: 'enlace serial punto a punto', ly: 28, thick: 1 }]
    }
  },
  steps: [
    {
      s: 'HDLC', k: 'contexto', t: 'Un protocolo de enlace para la WAN',
      b: '<p><b>HDLC</b> es un protocolo de <b>WAN</b> de capa de enlace, <b>orientado al bit</b>. Los protocolos antiguos eran orientados al <b>carácter</b>: caracteres especiales marcaban el inicio y el fin, y si el mensaje contenía uno de ellos se ejecutaba como una acción y el mensaje quedaba truncado.</p><p>Se creó para atender dos escenarios:</p><ul><li><b>No equilibrado</b>: una estación <b>primaria</b> (el host: mantiene el enlace y emite órdenes) y terminales <b>secundarias</b>, que solo emiten respuestas.</li><li><b>Equilibrado</b>: dos estaciones <b>combinadas</b>, que emiten órdenes y respuestas. Es el que se usa hoy, por ejemplo entre dos routers unidos por serial.</li></ul>',
      key: 'De acá en adelante trabajamos con dos estaciones combinadas en un enlace punto a punto.',
      fig: ['image133.png', 'image134.png'], scene: 'est',
      pk: [
        { p: ['P', 'S1'], l: 'orden', c: 'yellow', d: 1.3 }, { p: ['S1', 'P'], l: 'respuesta', c: 'white', d: 1.3 },
        { p: ['RA', 'RB'], l: 'orden', c: 'yellow', t: 0, d: 1.3 }, { p: ['RB', 'RA'], l: 'respuesta', c: 'white', t: 1.3, d: 1.3 },
        { p: ['RB', 'RA'], l: 'orden', c: 'yellow', t: 2.8, d: 1.3 }, { p: ['RA', 'RB'], l: 'respuesta', c: 'white', t: 4.1, d: 1.3 }
      ],
      st: { etapa: '—', mec: '—', conf: '—' }
    },
    {
      s: 'Flag', k: 'mecanismo', t: 'El flag y la inserción de ceros',
      b: '<p>La capa física entrega una secuencia de bits; la capa de enlace tiene que detectar dónde empieza y dónde termina cada trama. En HDLC lo marca un <b>flag</b>: <code>01111110</code> (<b>7E</b> en hexadecimal).</p><p>Eso impone una restricción: el flag <b>no puede aparecer dentro</b> del mensaje. El emisor recorre lo que va a enviar y <b>después de cinco 1 seguidos inserta un 0</b>, sin importar lo que venga a continuación.</p><p>El receptor hace lo inverso: cuando encuentra cinco 1 seguidos, <b>elimina el 0</b> que sigue y reconstruye el mensaje original.</p>',
      key: 'Gracias a la inserción de ceros la transmisión es <b>transparente</b>: el mensaje puede tener cualquier combinación de bits.',
      fig: 'image132.png', scene: 'stuff',
      det: 'El mensaje de ejemplo empieza justo con <code>01111110</code>. Los dos <b>0</b> en naranja los agrega el emisor y los quita el receptor: en el enlace nunca hay seis 1 seguidos, salvo en los flags.'
    },
    {
      s: 'Trama', k: 'detalle', t: 'Un único formato de trama',
      b: '<p>Todas las tramas tienen la misma estructura:</p><ul><li><b>Flag</b> de inicio y de fin.</li><li><b>Dirección</b> (8 bits): tiene sentido en la configuración no equilibrada, con varias secundarias en un bus. Entre dos estaciones combinadas el valor es fijo e irrelevante: hay un único interlocutor posible.</li><li><b>Control</b> (8 o 16 bits): de formato variable; sobre él se implementan el control de flujo y el control del enlace.</li><li><b>Datos</b>: longitud variable, transparente e independiente del código.</li><li><b>FCS</b> (16 o 32 bits): un CRC calculado sobre los bits de la trama, sin los flags.</li></ul>',
      fig: 'image135.png', scene: 'trama',
      det: 'Si el <b>FCS</b> que calcula el receptor no coincide, la trama se ignora: para el protocolo es lo mismo que si se hubiera perdido.'
    },
    {
      s: 'Control', k: 'detalle', t: 'El campo de control: tramas I, S y U',
      b: '<p>Los primeros bits indican el tipo de trama:</p><ul><li><b>I · Información</b> (0): lleva datos, con <b>N(S)</b> y <b>N(R)</b>.</li><li><b>S · Supervisión</b> (10): control de flujo y de errores. <b>RR</b> receptor preparado, <b>RNR</b> no preparado, <b>REJ</b> rechazo simple, <b>SREJ</b> rechazo selectivo (casi no se usa).</li><li><b>U · No numerada</b> (11): conexión y desconexión. <b>SABM</b> pide conectar, <b>UA</b> confirma, <b>DISC</b> cierra, <b>DM</b> rechaza la conexión, <b>FRMR</b> rechaza una trama.</li></ul><p>El bit <b>P/F</b> está en las tres: en una orden es <b>Poll</b> (exige una respuesta) y en la respuesta es <b>Final</b>.</p>',
      key: 'N(R) = 4 significa: recibí bien hasta la 3, espero la 4.',
      fig: ['image136.png', 'image137.png', 'image138.png', 'image139.png'], scene: 'trama', zoom: 1,
      hi: ['ctl', 'i0', 'ins', 'ipf', 'inr', 'il', 's0', 's1', 'scod', 'spf', 'snr', 'sl', 'u0', 'u1', 'ucod', 'upf', 'ucod2', 'ul'],
      det: '<b>N(S)</b>: número de la trama que envío. <b>N(R)</b>: número de la trama que espero, como el ACK de TCP, pero <b>cuentan tramas, no bytes</b>. Con 3 bits se numera en módulo 8 (de 0 a 7). Con control de 16 bits pasan a 7 bits: módulo 128, ventana de hasta 127 tramas.'
    },
    {
      s: 'Conexión', k: 'mecanismo', t: 'Iniciación, transferencia y desconexión',
      b: '<p>HDLC es <b>orientado a la conexión</b>. Cualquiera de los dos extremos puede iniciarla con una trama no numerada <b>SABM</b> (modo asíncrono balanceado), que también fija si se numera con 3 o con 7 bits (en ese caso, SABME).</p><p>Al enviar arranca el <b>timer T1</b>: si expira sin respuesta, se retransmite. Tras N intentos se decide que el enlace no está disponible.</p><p>El otro extremo acepta con <b>UA</b> o rechaza con <b>DM</b>.</p><p>La <b>desconexión</b> es abrupta: <b>DISC</b> y <b>UA</b>. No es como TCP, donde cada uno cierra su mitad: las tramas I pendientes de confirmación se pueden perder.</p>',
      key: 'Las tramas U se llaman no numeradas porque no llevan N(S) ni N(R).',
      fig: 'image140.png', scene: 'con', states: { A: 'inicia y cierra', B: 'acepta' },
      st: { etapa: 'Las tres etapas', mec: 'Timer T1', conf: 'UA' }
    },
    {
      s: 'Ej. I', k: 'ejemplo', t: 'Ejemplo I: datos en ambos sentidos',
      b: '<p>Cada trama de información se anota <b>I, N(S), N(R)</b>.</p><ul><li>A envía <b>I,0,0</b>. B responde con datos propios, <b>I,0,1</b>: su trama 0 y, montada encima, la confirmación de la 0 de A. Eso es <b>piggybacking</b>.</li><li>A envía la 1 y la 2. B espera a tener algo para mandar y con <b>I,1,3</b> confirma las dos juntas: la confirmación es <b>acumulativa</b>, como en TCP.</li><li>Al final A recibe la 2 y la 3 de B y no tiene datos. Para que a B no le expire T1 y retransmita, confirma con una trama de supervisión: <b>RR,4</b>.</li></ul>',
      key: 'Si hay datos para mandar, la confirmación viaja en la misma trama I; si no, se usa una RR.',
      fig: 'image141.png', scene: 'ej1', states: { A: 'espera la 4 de B', B: 'espera la 4 de A' },
      st: { etapa: 'Transferencia', mec: 'Piggybacking', conf: 'RR, 4' }
    },
    {
      s: 'Ej. II', k: 'ejemplo', t: 'Ejemplo II: receptor ocupado',
      b: '<p>B envía <b>I,3,0</b>. A la recibe, pero necesita detener temporalmente la transmisión: activa el <b>control de flujo</b> con <b>RNR,4</b>. Confirma la 3 y avisa que no está preparado; aunque B tenga crédito, no debe enviar más.</p><p>Si B necesita transmitir y el enlace sigue suspendido, <b>sondea</b> a A con <b>RR,0,P</b>: el bit Poll exige una respuesta.</p><p>A contesta con el bit Final: <b>RNR,4,F</b> mientras sigue ocupado, <b>RR,4,F</b> cuando está listo. Recién entonces B envía <b>I,4,0</b>.</p>',
      key: 'P va en la orden y F en la respuesta: un sondeo siempre recibe contestación.',
      fig: 'image142.png', scene: 'ej2', states: { A: 'ocupado → listo', B: 'tiene la 4 para enviar' },
      st: { mec: 'Control de flujo (RNR)', conf: 'RR, 4, F' }
    },
    {
      s: 'Ej. III', k: 'ejemplo', t: 'Ejemplo III: rechazo y go-back-N',
      b: '<p>A envía <b>I,3,0</b>, <b>I,4,0</b> e <b>I,5,0</b>. La 4 se pierde: por ejemplo, llega con el FCS mal y B la descarta. A no lo sabe y sigue enviando.</p><p>B recibe la 3 y después la 5: una trama <b>fuera de secuencia</b>. Envía <b>REJ,4</b>: rechazo, espero la 4.</p><p>A <b>vuelve a la 4</b> y transmite de ahí en adelante (4, 5 y 6), sin importar que la 5 ya hubiera llegado. Eso es <b>go-back-N</b>, el rechazo simple.</p><p>La alternativa es el rechazo selectivo, <b>SREJ</b>, que pide una única trama: más eficiente, pero mucho más complejo.</p>',
      key: 'REJ,N: se retransmite desde la trama N en adelante.',
      fig: 'image143.png', scene: 'ej3', states: { B: 'espera la 7' },
      st: { mec: 'Go-back-N (REJ)', conf: 'REJ, 4' }
    },
    {
      s: 'Ej. IV', k: 'ejemplo', t: 'Ejemplo IV: expira el timer',
      b: '<p>A envía la 2 y la 3. La 3 se pierde o llega con error.</p><p>B solo puede confirmar lo que recibió. Como no tiene nada para enviar, usa una supervisión: <b>RR,3</b> (recibí la 2, espero la 3).</p><p>A se queda esperando la confirmación de la 3 y <b>expira T1</b>. Antes de retransmitir <b>sondea</b> a B con <b>RR,0,P</b>, y B responde <b>RR,3,F</b>: está funcionando y la comunicación puede continuar.</p><p>Entonces A <b>retransmite I,3,0</b> y B confirma con <b>RR,4</b>.</p>',
      key: 'Acá no hay REJ porque después de la trama perdida no llegó ninguna otra: lo que dispara la recuperación es el timer.',
      fig: 'image144.png', scene: 'ej4', states: { A: 'retransmite la 3', B: 'espera la 4' },
      st: { mec: 'Timer T1 + sondeo P/F', conf: 'RR, 4' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'HDLC en una mirada',
      b: '<ul><li>Protocolo WAN de enlace, <b>orientado al bit</b> y a la conexión; hoy se usa entre estaciones combinadas.</li><li>El flag <b>7E</b> delimita las tramas y la <b>inserción de ceros</b> las hace transparentes.</li><li>Campo de control: tramas <b>I</b>, <b>S</b> (RR, RNR, REJ, SREJ) y <b>U</b> (SABM, UA, DISC, DM).</li><li><b>N(S)</b> y <b>N(R)</b> cuentan tramas, módulo 8 o 128; el bit <b>P/F</b> sondea.</li><li>Se recupera con <b>REJ</b> (go-back-N) o con el timer <b>T1</b>.</li></ul><p>HDLC confirma y retransmite en cada enlace. En la próxima lección, <b>Frame Relay</b> hereda su trama pero deja de recuperar errores: conecta sitios remotos con circuitos virtuales sobre una red compartida.</p>',
      scene: 'enlace', tags: { A: 'espera la 1 de B', B: 'espera la 2 de A' },
      pk: [{ p: ['A', 'B'], l: 'I, 0, 0', c: 'req', d: 1.3 }, { p: ['B', 'A'], l: 'I, 0, 1', c: 'res', d: 1.3 }, { p: ['A', 'B'], l: 'I, 1, 1', c: 'req', d: 1.3 }, { p: ['B', 'A'], l: 'RR, 2', c: 'ctl', d: 1.3 }],
      notes: [{ x: 215, y: 300, w: 370, c: 'yellow', text: '<b>I, N(S), N(R)</b>: envío mi trama N(S) y espero tu trama N(R). Las confirmaciones son acumulativas y cuentan <b>tramas</b>, no bytes.' }],
      st: { etapa: 'Transferencia', mec: 'Ventana deslizante', conf: 'RR, 2' }
    }
  ],
  quiz: [
    { q: 'El mensaje a enviar contiene la secuencia 01111110. ¿Qué viaja por el enlace en ese lugar?', o: ['01111110, sin cambios', '011111010: se inserta un 0 después de cinco 1 seguidos', '0111111010: se inserta un 0 después de seis 1', 'Un carácter de escape seguido del flag'], a: 1, why: 'El emisor inserta un 0 después de cada cinco 1 consecutivos, sin mirar lo que sigue; el receptor lo quita y recupera el mensaje.' },
    { q: 'Una estación recibe una trama I con N(R) = 4. ¿Qué le está diciendo el otro extremo?', o: ['Que le quedan 4 tramas por enviar', 'Que recibió bien hasta la trama 3 y espera la 4', 'Que rechaza la trama 4', 'Que la ventana es de 4 bytes'], a: 1, why: 'N(R) es el número de la próxima trama esperada: confirma en forma acumulativa todas las anteriores, y cuenta tramas, no bytes.' },
    { q: 'B recibe la trama 3 y después la 5. Con rechazo simple, ¿qué ocurre?', o: ['B envía SREJ,4 y A retransmite solo la 4', 'B envía RNR,4 y A se detiene', 'B envía REJ,4 y A retransmite desde la 4 en adelante', 'B espera a que expire su timer T1'], a: 2, why: 'REJ activa go-back-N: A vuelve a la trama 4 y retransmite desde ahí, aunque la 5 ya hubiera llegado.' },
    { q: '¿Para qué envía una estación una trama RR con el bit P encendido?', o: ['Para cerrar la conexión', 'Para sondear al otro extremo y exigirle una respuesta, que llega con el bit F', 'Para pedir números de secuencia de 7 bits', 'Para indicar que es la última trama de datos'], a: 1, why: 'P (Poll) en una orden exige respuesta; el otro extremo contesta con F (Final). Se usa cuando el enlace está suspendido o antes de retransmitir tras expirar T1.' }
  ],
  cheat: [
    ['Flag', '<code>01111110</code> (7E): marca el inicio y el fin de cada trama.'],
    ['Inserción de ceros', 'El emisor agrega un 0 después de cinco 1 seguidos; el receptor lo quita. Así el flag nunca aparece dentro del mensaje.'],
    ['Estaciones', '<b>Primaria</b> (órdenes), <b>secundaria</b> (respuestas), <b>combinada</b> (ambas). No equilibrada: primaria + secundarias. Equilibrada: dos combinadas.'],
    ['Trama', 'Flag · Dirección (8) · Control (8 o 16) · Datos (variable) · FCS (16 o 32) · Flag.'],
    ['Tramas I / S / U', '<b>I</b> (0…): datos con N(S) y N(R). <b>S</b> (10…): RR, RNR, REJ, SREJ. <b>U</b> (11…): SABM, UA, DISC, DM, FRMR.'],
    ['N(S) / N(R)', 'Trama que envío / próxima trama que espero. Cuentan tramas: 3 bits (módulo 8) o 7 bits (módulo 128).'],
    ['Bit P/F', '<b>Poll</b> en una orden (exige respuesta), <b>Final</b> en la respuesta.'],
    ['Recuperación', '<b>REJ,N</b>: go-back-N desde la trama N. <b>T1</b>: si expira, se sondea con RR,P y se retransmite.']
  ]
});

COURSE.add({
  id: 'tcp-conexion',
  title: 'TCP: puertos y conexión',
  desc: 'Qué agrega TCP sobre IP: puertos para identificar aplicaciones, bytes numerados y confirmados, y una conexión que se abre con tres segmentos y se cierra de a mitades.',
  min: 12, level: 'Intermedio',
  learn: [
    'Qué significa que TCP sea punto a punto, orientado a la conexión y confiable',
    'Cómo se lee la cabecera TCP: puertos, secuencia, ACK, header length, flags y window',
    'Por qué el MSS se calcula como MTU − 40 y se declara en el SYN',
    'Cómo funciona el three-way handshake y por qué estados pasan cliente y servidor',
    'Qué son los well-known ports y cómo usa un firewall los segmentos SYN'
  ],
  stats: [{ k: 'cli', l: 'Estado del cliente' }, { k: 'srv', l: 'Estado del servidor' }, { k: 'mss', l: 'MSS (A / B)' }],
  legend: [['ctl', 'control: SYN / ACK / FIN'], ['req', 'datos del cliente'], ['res', 'respuesta del servidor'], ['bad', 'descartado']],
  scenes: {
    e2e: {
      kind: 'topo',
      zones: [
        { id: 'z4', x: 40, y: 95, w: 720, h: 250, l: 'Capa 4 · TCP: control de errores entre los dos extremos (cliente ↔ servidor)', c: 'orange' },
        { id: 'z2', x: 60, y: 150, w: 290, h: 150, l: 'Capa 2 · CRC entre vecinos directos', c: 'blue' }
      ],
      nodes: [
        { id: 'C', t: 'pc', x: 120, y: 225, l: 'Cliente' }, { id: 'R', t: 'router', x: 290, y: 225, l: 'Router' },
        { id: 'NET', t: 'cloud', x: 480, y: 225, l: 'Internet' }, { id: 'S', t: 'server', x: 680, y: 225, l: 'Servidor' }
      ],
      links: [{ a: 'C', b: 'R' }, { a: 'R', b: 'NET' }, { a: 'NET', b: 'S' }]
    },
    cab: {
      kind: 'fields', title: 'Cabecera TCP · 20 bytes sin opciones', ruler: 32, rh: 40,
      rows: [
        [{ id: 'sp', l: 'Puerto origen', s: '16 bits', w: 16, c: 'green' }, { id: 'dp', l: 'Puerto destino', s: '16 bits', w: 16, c: 'blue' }],
        [{ id: 'seq', l: 'Número de secuencia', s: '32 bits', w: 32, c: 'yellow' }],
        [{ id: 'ack', l: 'Número de confirmación (ACK)', s: '32 bits', w: 32, c: 'purple' }],
        [{ id: 'hl', l: 'Header length', s: '4 bits', w: 4, c: 'orange' }, { id: 'rsv', l: 'Reservado', s: '6 bits', w: 6, c: 'gray' },
          { id: 'urg', l: 'U\nR\nG', w: 1, c: 'red' }, { id: 'fack', l: 'A\nC\nK', w: 1, c: 'purple' }, { id: 'psh', l: 'P\nS\nH', w: 1, c: 'yellow' },
          { id: 'rst', l: 'R\nS\nT', w: 1, c: 'red' }, { id: 'syn', l: 'S\nY\nN', w: 1, c: 'green' }, { id: 'fin', l: 'F\nI\nN', w: 1, c: 'orange' },
          { id: 'win', l: 'Window', s: '16 bits', w: 16, c: 'blue' }],
        [{ id: 'ck', l: 'Checksum', s: '16 bits', w: 16, c: 'gray' }, { id: 'up', l: 'Urgent pointer', s: '16 bits', w: 16, c: 'red' }],
        [{ id: 'opt', l: 'Opciones (si hay): MSS, Window scale, Timestamp…', s: 'longitud variable', w: 32, c: 'white', ghost: 1 }]
      ]
    },
    bytes: {
      kind: 'seq',
      actors: [{ id: 'C', l: 'Cliente', t: 'pc' }, { id: 'S', l: 'Servidor', t: 'server' }],
      msgs: [
        { div: 'un mensaje de 10 bytes' },
        { f: 'C', to: 'S', l: 'GET · seq = 1 · bytes 1 a 10', c: 'req' },
        { f: 'S', to: 'C', l: 'ack = 11 → recibí hasta el 10, espero el 11', c: 'res' },
        { div: 'confirmación acumulativa: tres segmentos de 10 bytes' },
        { f: 'C', to: 'S', l: 'seq = 1 · bytes 1 a 10', c: 'req' },
        { f: 'C', to: 'S', l: 'seq = 11 · bytes 11 a 20', c: 'req' },
        { f: 'C', to: 'S', l: 'seq = 21 · bytes 21 a 30', c: 'req' },
        { f: 'S', to: 'C', l: 'ack = 31 → confirma los 30 bytes de una vez', c: 'res' }
      ]
    },
    mss: {
      kind: 'topo',
      nodes: [
        { id: 'A', t: 'pc', x: 110, y: 170, l: 'A (cliente)' }, { id: 'R', t: 'router', x: 370, y: 170, l: 'Router' },
        { id: 'B', t: 'server', x: 680, y: 170, l: 'B (servidor)' }
      ],
      links: [{ a: 'A', b: 'R', l: 'SLIP · MTU = 296', ly: -12 }, { a: 'R', b: 'B', l: 'Ethernet · MTU = 1500', thick: 1, ly: -12 }]
    },
    hs: {
      kind: 'seq',
      actors: [{ id: 'C', l: 'Cliente (A)', t: 'pc' }, { id: 'S', l: 'Servidor (B)', t: 'server' }],
      msgs: [
        { f: 'C', to: 'S', l: 'SYN · seq = x', c: 'ctl' },
        { f: 'S', to: 'C', l: 'SYN + ACK · seq = y · ack = x + 1', c: 'ctl' },
        { f: 'C', to: 'S', l: 'ACK · seq = x + 1 · ack = y + 1', c: 'ctl' },
        { div: 'conexión establecida' },
        { f: 'C', to: 'S', l: 'datos (en la práctica, en un cuarto segmento)', c: 'req' }
      ]
    },
    est: {
      kind: 'topo',
      nodes: [
        { id: 'tc', t: 'txt', x: 150, y: 36, l: 'Cliente', big: 1 }, { id: 'ts', t: 'txt', x: 650, y: 36, l: 'Servidor', big: 1 },
        { id: 'c0', t: 'state', x: 150, y: 75, l: 'CLOSED', c: 'gray' }, { id: 'c1', t: 'state', x: 150, y: 137, l: 'SYN_SENT', c: 'yellow' },
        { id: 'c2', t: 'state', x: 150, y: 199, l: 'ESTABLISHED', c: 'green' }, { id: 'c3', t: 'state', x: 150, y: 261, l: 'FIN_WAIT_1', c: 'orange' },
        { id: 'c4', t: 'state', x: 150, y: 323, l: 'FIN_WAIT_2', c: 'orange' }, { id: 'c5', t: 'state', x: 150, y: 385, l: 'TIME_WAIT', c: 'purple' },
        { id: 's0', t: 'state', x: 650, y: 75, l: 'CLOSED', c: 'gray' }, { id: 's1', t: 'state', x: 650, y: 137, l: 'LISTEN', c: 'blue' },
        { id: 's2', t: 'state', x: 650, y: 199, l: 'SYN_RCVD', c: 'yellow' }, { id: 's3', t: 'state', x: 650, y: 261, l: 'ESTABLISHED', c: 'green' },
        { id: 's4', t: 'state', x: 650, y: 323, l: 'CLOSE_WAIT', c: 'orange' }, { id: 's5', t: 'state', x: 650, y: 385, l: 'LAST_ACK', c: 'purple' },
        { id: 'd1', t: 'dot', x: 45, y: 385 }, { id: 'd2', t: 'dot', x: 45, y: 75 },
        { id: 'e1', t: 'dot', x: 755, y: 385 }, { id: 'e2', t: 'dot', x: 755, y: 75 }
      ],
      links: [
        { a: 'c0', b: 'c1', arrow: 1, l: 'apertura activa\nenvía SYN', lx: 85, ly: 12 },
        { a: 'c1', b: 'c2', arrow: 1, l: 'recibe SYN+ACK\nenvía ACK', lx: 85, ly: 12 },
        { a: 'c2', b: 'c3', arrow: 1, l: 'la aplicación cierra\nenvía FIN', lx: 92, ly: 12 },
        { a: 'c3', b: 'c4', arrow: 1, l: 'recibe ACK', lx: 85, ly: 12 },
        { a: 'c4', b: 'c5', arrow: 1, l: 'recibe FIN\nenvía ACK', lx: 85, ly: 12 },
        { a: 'c5', b: 'd1', dash: 1 }, { a: 'd1', b: 'd2', dash: 1, l: 'espera\ny cierra', lx: 33 }, { a: 'd2', b: 'c0', dash: 1, arrow: 1 },
        { a: 's0', b: 's1', arrow: 1, l: 'apertura pasiva\ninicia el servicio', lx: -88, ly: 12 },
        { a: 's1', b: 's2', arrow: 1, l: 'recibe SYN\nenvía SYN+ACK', lx: -85, ly: 12 },
        { a: 's2', b: 's3', arrow: 1, l: 'recibe ACK', lx: -85, ly: 12 },
        { a: 's3', b: 's4', arrow: 1, l: 'recibe FIN\nenvía ACK', lx: -85, ly: 12 },
        { a: 's4', b: 's5', arrow: 1, l: 'la aplicación cierra\nenvía FIN', lx: -92, ly: 12 },
        { a: 's5', b: 'e1', dash: 1 }, { a: 'e1', b: 'e2', dash: 1, l: 'recibe\nACK', lx: -26 }, { a: 'e2', b: 's0', dash: 1, arrow: 1 }
      ]
    },
    fw: {
      kind: 'topo',
      nodes: [
        { id: 'C1', t: 'pc', x: 100, y: 120, l: 'Cliente 1' }, { id: 'C2', t: 'pc', x: 100, y: 300, l: 'Cliente 2' },
        { id: 'FW', t: 'fw', x: 330, y: 210, l: 'Firewall' }, { id: 'S', t: 'server', x: 530, y: 210, l: 'Servidor web', sub: 'escucha en :80' }
      ],
      links: [{ a: 'C1', b: 'FW' }, { a: 'C2', b: 'FW' }, { a: 'FW', b: 'S' }]
    }
  },
  steps: [
    {
      s: 'TCP', k: 'contexto', t: 'TCP: una conexión confiable entre dos',
      b: '<p><b>TCP</b> es un protocolo de <b>capa de transporte</b> (la otra opción es UDP). Es <b>punto a punto</b>: comunica exclusivamente dos dispositivos, por eso no se usa para broadcast ni multicast.</p><p>Es <b>orientado a la conexión</b>: primero se establece, después se intercambian datos y al final se libera. Y es <b>confiable</b>, porque recurre a:</p><ul><li>Confirmaciones</li><li>Timeouts y retransmisiones</li><li>Checksum de cabecera y cuerpo</li></ul><p>Su PDU es el <b>segmento</b>, que en general viaja dentro de un único datagrama IP.</p>',
      key: 'Hay <b>doble control de errores</b>: la capa 2 lo hace entre vecinos directos (un CRC que solo detecta); TCP lo hace entre los dos extremos y además recupera.',
      scene: 'e2e', hi: ['z4'],
      pk: [{ p: ['C', 'R'], l: 'trama + CRC', c: 'res', d: 1.2 }, { p: ['C', 'R', 'NET', 'S'], l: 'segmento TCP', c: 'req', d: 2.2 }, { p: ['S', 'NET', 'R', 'C'], l: 'ACK', c: 'ctl', d: 2.1 }],
      st: { cli: 'CLOSED', srv: 'CLOSED', mss: '—' }
    },
    {
      s: 'Puertos', k: 'idea', t: 'Puertos: a qué aplicación le hablo',
      b: '<p>Una cabecera es tan grande como los servicios que ofrece el protocolo: la de TCP mide <b>20 bytes</b> como mínimo, en palabras de 32 bits.</p><p>Empieza con <b>puerto origen</b> y <b>puerto destino</b> (16 bits cada uno): identifican a la <b>aplicación</b> dentro de cada host. Siempre hay un <b>cliente</b> (puede ser cualquiera) que se conecta a un <b>servidor</b> conocido: 443 HTTPS, 80 HTTP, 25 SMTP.</p><p>Cada extremo de la conexión es un <b>endpoint</b>: dirección IP + puerto.</p>',
      key: 'Los <b>cuatro valores</b> (IP y puerto del cliente, IP y puerto del servidor) identifican a la conexión; por eso un mismo puerto puede atender muchas conexiones.',
      fig: 'image108.png', scene: 'cab', hi: ['sp', 'dp'],
      det: 'Una conexión: <b>192.168.0.208 : 52326</b> (endpoint del cliente, puerto alto) ↔ <b>40.113.103.199 : 443</b> (endpoint del servidor, puerto conocido).'
    },
    {
      s: 'Seq y ACK', k: 'mecanismo', t: 'Número de secuencia y ACK acumulativo',
      b: '<p>Para TCP, todo lo que se intercambia es <b>una gran secuencia de bytes</b>. El <b>Sequence Number</b> (32 bits) dice qué lugar ocupa en esa secuencia el <b>primer byte</b> del segmento.</p><p>El <b>Acknowledgement Number</b> (32 bits) confirma lo recibido indicando el <b>próximo byte que se espera</b>: tras recibir los bytes 1 a 10 se responde <code>ack = 11</code>.</p><p>Las confirmaciones son <b>acumulativas</b>: el receptor puede esperar tres segmentos de 10 bytes y confirmarlos juntos con <code>ack = 31</code>.</p>',
      key: 'TCP no numera segmentos: cuenta <b>bytes</b>. Un ack = n significa «recibí bien hasta n − 1, espero el n».',
      scene: 'bytes'
    },
    {
      s: 'Flags', k: 'detalle', t: 'Header length, flags y window',
      b: '<p><b>Header length</b> (4 bits): por las opciones, la cabecera es de largo variable; se mide en <b>palabras de 32 bits</b> (5 = 20 bytes).</p><p>Los <b>flags</b>, de un bit cada uno:</p><ul><li><b>URG</b>: hay datos urgentes (ver Urgent pointer).</li><li><b>ACK</b>: el campo de confirmación es válido.</li><li><b>PSH</b>: procesar y responder ya, sin demorar (telnet).</li><li><b>RST</b>: reiniciar la conexión.</li><li><b>SYN</b>: sincronizar números de secuencia.</li><li><b>FIN</b>: no tengo más datos.</li></ul><p><b>Window</b> es el campo del control de flujo.</p>',
      key: 'SYN, FIN y RST explican cómo se establece y se libera la conexión.',
      fig: 'image109.png', scene: 'cab', hi: ['hl', 'urg', 'fack', 'psh', 'rst', 'syn', 'fin', 'win'],
      det: 'En un SYN capturado con Wireshark, <b>Header length = 8</b>: 8 × 4 = 32 bytes = 20 de cabecera fija + <b>12 de opciones</b> (entre ellas, MSS = 1460).'
    },
    {
      s: 'MSS', k: 'ejemplo', t: 'MSS: segmentos que no haya que fragmentar',
      b: '<p>La opción <b>MSS</b> (Maximum Segment Size) se declara al establecer la conexión, en los segmentos <b>SYN</b>, y no cambia después. Cada extremo avisa qué tan grande puede ser un segmento:</p><p><b>MSS = MTU de la interfaz − 40</b> (20 bytes de cabecera IP + 20 de TCP).</p><p>B está en Ethernet: 1500 − 40 = <b>1460</b>. A sale por SLIP: 296 − 40 = <b>256</b>. Sin MSS, B armaría datagramas de 1500 bytes y el router tendría que fragmentarlos para el enlace de 296.</p>',
      key: 'El MSS solo conoce los MTU de los extremos: si en el camino hay un enlace más chico (por ejemplo, de 1200), ahí se fragmenta igual.',
      fig: ['image111.png', 'image110.png'], scene: 'mss', tags: { A: 'MSS = 296 − 40', B: 'MSS = 1500 − 40' },
      pk: [{ p: ['A', 'R', 'B'], l: 'SYN MSS=256', c: 'ctl', d: 2 }, { p: ['B', 'R', 'A'], l: 'SYN MSS=1460', c: 'res', d: 2 }],
      tbl: { x: 90, y: 290, w: 250, title: 'MSS = MTU − 20 (IP) − 20 (TCP)', cols: ['Extremo', 'MTU', 'MSS'], rows: [['A · SLIP', '296', '256'], ['B · Ethernet', '1500', '1460']], hi: 0 },
      notes: [{ x: 400, y: 292, w: 310, c: 'yellow', text: 'A ya sabe que su enlace es chico y se lo cuenta a B: los dos arman segmentos de hasta <b>256 bytes</b> y el router no tiene que fragmentar.' }],
      st: { mss: '256 / 1460' }
    },
    {
      s: 'Handshake', k: 'mecanismo', t: 'Three-way handshake',
      b: '<p>La conexión se establece con tres segmentos:</p><ul><li>El cliente envía un <b>SYN</b>: una cabecera sin datos, con un número de secuencia inicial <b>x</b> elegido al azar.</li><li>El servidor acepta con <b>SYN + ACK</b>: su propio número <b>y</b>, y <code>ack = x + 1</code>. Si no acepta, responde <b>RST</b>.</li><li>El cliente contesta <b>ACK</b> con <code>ack = y + 1</code>.</li></ul><p>Wireshark muestra números <b>relativos</b>: si x = 90, se ve seq = 0, y el servidor confirma 1 (en realidad, 91).</p>',
      key: 'El SYN no lleva datos, pero se confirma como si ocupara un byte: un byte que no existe. Lo mismo pasa con el FIN.',
      fig: 'image113.png', scene: 'hs', states: { C: 'ESTABLISHED', S: 'ESTABLISHED' },
      tbl: { x: 285, y: 312, w: 230, title: 'Lo que muestra Wireshark', cols: ['Campo', 'Real', 'Relativo'], rows: [['seq del SYN (x)', '90', '0'], ['ack del servidor', '91', '1']] },
      st: { cli: 'ESTABLISHED', srv: 'ESTABLISHED' }
    },
    {
      s: 'Apertura', k: 'mecanismo', t: 'Estados: apertura activa y pasiva',
      b: '<p>Cada extremo lleva el <b>estado</b> de la conexión.</p><p><b>Servidor</b>: al iniciar un servicio le pide a TCP que escuche en su puerto. Es la <b>apertura pasiva</b>: pasa de CLOSED a <b>LISTEN</b>. Al recibir un SYN contesta SYN+ACK y queda en <b>SYN_RCVD</b>; con el ACK del cliente llega a <b>ESTABLISHED</b>.</p><p><b>Cliente</b>: una aplicación pide conectarse a una IP + puerto. Es la <b>apertura activa</b>: envía el SYN y pasa a <b>SYN_SENT</b>; al recibir el SYN+ACK envía el ACK y queda en <b>ESTABLISHED</b>.</p>',
      key: 'El servidor ya estaba esperando (pasivo); el que toma la iniciativa y envía el SYN es el cliente (activo).',
      fig: ['image114.png', 'image115.png'], scene: 'est',
      dim: ['c3', 'c4', 'c5', 's4', 's5', 'c2-c3', 'c3-c4', 'c4-c5', 'c5-d1', 'd1-d2', 'd2-c0', 's3-s4', 's4-s5', 's5-e1', 'e1-e2', 'e2-s0'],
      pk: [{ p: ['c1', 's1'], l: 'SYN', c: 'ctl', d: 1.5 }, { p: ['s2', 'c1'], l: 'SYN+ACK', c: 'ctl', d: 1.5 }, { p: ['c2', 's2'], l: 'ACK', c: 'ctl', d: 1.5 }]
    },
    {
      s: 'Cierre', k: 'mecanismo', t: 'Cierre: cada extremo cierra su mitad',
      b: '<p>Terminado el intercambio, <b>cada extremo cierra su mitad</b>:</p><ul><li>El cliente envía <b>FIN</b> y pasa a <b>FIN_WAIT_1</b>.</li><li>El servidor responde ACK y queda en <b>CLOSE_WAIT</b>; al recibirlo, el cliente pasa a <b>FIN_WAIT_2</b>: su mitad ya está cerrada.</li><li>El servidor envía su <b>FIN</b> y pasa a <b>LAST_ACK</b>.</li><li>El cliente responde ACK y queda en <b>TIME_WAIT</b>; con ese ACK el servidor da por terminada la conexión.</li></ul><p>En Windows, <code>netstat</code> lista las conexiones TCP con su estado.</p>',
      key: 'El cierre normal lleva cuatro segmentos: FIN y ACK en un sentido, FIN y ACK en el otro.',
      fig: 'image116.png', scene: 'est',
      dim: ['c1', 's1', 's2', 'c0-c1', 'c1-c2', 's0-s1', 's1-s2', 's2-s3'],
      pk: [{ p: ['c3', 's3'], l: 'FIN', c: 'ctl', d: 1.3 }, { p: ['s4', 'c3'], l: 'ACK', c: 'ctl', d: 1.3 }, { p: ['s5', 'c4'], l: 'FIN', c: 'ctl', d: 1.3 }, { p: ['c5', 's5'], l: 'ACK', c: 'ctl', d: 1.3 }],
      tbl: { x: 318, y: 62, w: 164, title: 'netstat · 192.168.0.208', cols: ['Puerto local', 'Estado'], rows: [[':139', 'LISTENING'], [':52326', 'ESTABLISHED'], [':61766', 'CLOSE_WAIT'], [':61958', 'TIME_WAIT']] },
      st: { cli: 'TIME_WAIT', srv: 'CLOSED' }
    },
    {
      s: 'Firewall', k: 'detalle', t: 'Puertos conocidos y el rol del firewall',
      b: '<p>Los servidores escuchan en <b>well-known ports</b> (por debajo de 1024) y tienen una IP estable; el puerto del cliente suele ser mayor a 1024. Si un servicio corre en otro puerto hay que indicarlo: <code>dirección:8080</code>.</p><p>El SYN es la forma en que un servidor se expone. Por eso un <b>firewall</b> se configura para dejar pasar solo los <b>SYN dirigidos al puerto del servicio</b> (por ejemplo, 80); los que van a otro puerto se descartan sin avisar. Hacia afuera, deja salir los SYN que genera el servidor.</p>',
      key: 'Controlar los SYN es controlar quién puede abrir conexiones y hacia qué puerto.',
      fig: 'image128.png', scene: 'fw', hi: ['FW'], tags: { FW: 'solo SYN a :80' },
      pk: [{ p: ['C1', 'FW', 'S'], l: 'SYN → :80', c: 'req', d: 1.8 }, { p: ['C2', 'FW'], l: 'SYN → :23', c: 'bad', d: 1.3, drop: 1 }, { p: ['S', 'FW', 'C1'], l: 'SYN+ACK', c: 'res', d: 1.8 }],
      tbl: { x: 622, y: 70, w: 158, title: 'well-known ports', cols: ['Puerto', 'Servicio'], rows: [['20', 'FTP-Data'], ['21', 'FTP-Command'], ['23', 'Telnet'], ['25', 'SMTP'], ['53', 'DNS'], ['80', 'HTTP'], ['110', 'POP3'], ['443', 'HTTPS']], hi: 5 },
      notes: [{ x: 215, y: 322, w: 370, c: 'yellow', text: 'El firewall también <b>lleva la cuenta de las conexiones establecidas</b>: así deja pasar los segmentos que no son SYN (datos, ACK, FIN) de esas conexiones.' }],
      st: { cli: '—', srv: 'LISTEN' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'TCP y su conexión, en una mirada',
      b: '<ul><li><b>Punto a punto, orientado a la conexión y confiable</b>; segundo control de errores, de extremo a extremo.</li><li><b>Puerto</b> = aplicación; <b>endpoint</b> = IP + puerto; cuatro valores = una conexión.</li><li><b>Seq</b> numera bytes; <b>ACK</b> acumulativo = próximo byte esperado.</li><li><b>MSS</b> = MTU − 40, declarado en el SYN.</li><li>Apertura: <b>SYN → SYN+ACK → ACK</b>. Cierre: cada extremo cierra su mitad con FIN + ACK.</li></ul><p>Queda un campo sin usar: <b>Window</b>. En la próxima lección vemos cómo lo aprovecha TCP para el control de flujo, y cuándo decide retransmitir.</p>',
      scene: 'cab', det: 'Puertos → <b>quién</b> habla · Secuencia y ACK → <b>qué</b> llegó · Flags → <b>estado</b> de la conexión · Window → <b>cuánto</b> se puede enviar.'
    }
  ],
  quiz: [
    { q: '¿Qué identifica a una conexión TCP?', o: ['El puerto destino', 'La dirección IP del servidor', 'Los cuatro valores: IP y puerto de cada extremo', 'El número de secuencia inicial'], a: 2, why: 'Cada endpoint es IP + puerto, y el par de endpoints identifica a la conexión; por eso un mismo puerto puede atender muchas conexiones.' },
    { q: 'Un extremo recibe tres segmentos de 10 bytes; el primero tiene seq = 1. ¿Con qué ack los confirma juntos?', o: ['3', '30', '31', '11'], a: 2, why: 'Las confirmaciones son acumulativas y el ack indica el próximo byte esperado: recibió hasta el 30, espera el 31.' },
    { q: 'Un host sale por un enlace con MTU de 296 bytes. ¿Qué MSS declara en su SYN?', o: ['296', '276', '256', '1460'], a: 2, why: 'MSS = MTU − 40 (20 bytes de cabecera IP + 20 de cabecera TCP): 296 − 40 = 256.' },
    { q: 'Un servidor en estado LISTEN recibe un SYN y acepta la conexión. ¿Qué hace?', o: ['Responde ACK y pasa a ESTABLISHED', 'Responde SYN + ACK y pasa a SYN_RCVD', 'Responde RST y vuelve a CLOSED', 'Responde FIN y pasa a CLOSE_WAIT'], a: 1, why: 'Contesta con su propio SYN más el ACK de x + 1 y espera en SYN_RCVD el ACK del cliente; recién ahí pasa a ESTABLISHED.' }
  ],
  cheat: [
    ['TCP', 'Capa de transporte. Punto a punto, orientado a la conexión, confiable: confirmaciones, timeouts, retransmisiones y checksum.'],
    ['Endpoint / conexión', '<b>Endpoint</b> = IP + puerto (16 bits). La conexión se identifica por los 4 valores de sus dos endpoints.'],
    ['Seq / ACK', '<b>Seq</b>: posición del primer byte del segmento. <b>ACK</b>: próximo byte esperado, acumulativo (10 bytes → 11; 30 bytes → 31).'],
    ['Header length', 'En palabras de 32 bits: 5 = 20 bytes; 8 = 32 bytes (20 + 12 de opciones).'],
    ['Flags', 'URG · ACK · PSH (responder ya) · RST (reiniciar) · SYN (sincronizar) · FIN (no hay más datos).'],
    ['MSS', 'MTU − 40. Se declara en el SYN y no cambia. Ethernet 1500 → 1460; SLIP 296 → 256.'],
    ['Three-way handshake', 'SYN (seq = x) → SYN+ACK (seq = y, ack = x+1) → ACK (ack = y+1). Si no se acepta: RST.'],
    ['Estados', '<b>Cliente</b>: CLOSED → SYN_SENT → ESTABLISHED → FIN_WAIT_1 → FIN_WAIT_2 → TIME_WAIT. <b>Servidor</b>: CLOSED → LISTEN → SYN_RCVD → ESTABLISHED → CLOSE_WAIT → LAST_ACK.']
  ]
});

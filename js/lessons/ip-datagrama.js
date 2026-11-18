COURSE.add({
  id: 'ip-datagrama',
  title: 'IP: el datagrama',
  desc: 'El protocolo sobre el que se apoya todo Internet: qué promete (y qué no) un servicio connectionless y best effort, y qué lleva campo por campo la cabecera de un datagrama IP.',
  min: 11, level: 'Intermedio',
  learn: [
    'Cómo se organiza la suite TCP/IP: IP en red, TCP y UDP en transporte, aplicaciones arriba',
    'Qué significa que IP sea connectionless, no confiable y best effort',
    'Qué guarda cada campo de la cabecera IP y cuánto mide',
    'Cómo el TTL evita que un datagrama dé vueltas para siempre',
    'Para qué sirve el ToS y por qué influir en el camino es delicado'
  ],
  stats: [{ k: 'serv', l: 'Servicio de IP' }, { k: 'hdr', l: 'Cabecera' }, { k: 'ttl', l: 'TTL' }],
  legend: [['req', 'paquete'], ['res', 'otro paquete'], ['key', 'marcado con ToS'], ['bad', 'descartado']],
  scenes: {
    suite: {
      kind: 'topo',
      nodes: [
        { id: 't1', t: 'txt', x: 95, y: 62, l: 'Modelo OSI', big: 1 }, { id: 't2', t: 'txt', x: 400, y: 62, l: 'Suite TCP/IP', big: 1 },
        { id: 'o7', t: 'box', x: 95, y: 104, w: 130, h: 38, l: 'Aplicación', c: 'gray' },
        { id: 'o6', t: 'box', x: 95, y: 148, w: 130, h: 38, l: 'Presentación', c: 'gray' },
        { id: 'o5', t: 'box', x: 95, y: 192, w: 130, h: 38, l: 'Sesión', c: 'gray' },
        { id: 'o4', t: 'box', x: 95, y: 236, w: 130, h: 38, l: 'Transporte', c: 'gray' },
        { id: 'o3', t: 'box', x: 95, y: 280, w: 130, h: 38, l: 'Red', c: 'gray' },
        { id: 'o2', t: 'box', x: 95, y: 324, w: 130, h: 38, l: 'Enlace', c: 'gray' },
        { id: 'o1', t: 'box', x: 95, y: 368, w: 130, h: 38, l: 'Físico', c: 'gray' },
        { id: 'app', t: 'box', x: 400, y: 148, w: 400, h: 126, l: 'TELNET · DNS · FTP · HTTP · SNMP · SMTP …', sub: 'todos los protocolos de aplicación conocidos', c: 'green' },
        { id: 'tcp', t: 'box', x: 299, y: 236, w: 198, h: 38, l: 'TCP', sub: 'variante confiable', c: 'blue' },
        { id: 'udp', t: 'box', x: 501, y: 236, w: 198, h: 38, l: 'UDP', sub: 'variante ágil', c: 'blue' },
        { id: 'ip', t: 'box', x: 238, y: 280, w: 76, h: 38, l: 'IP', c: 'yellow' },
        { id: 'arp', t: 'box', x: 319, y: 280, w: 76, h: 38, l: 'ARP', c: 'white' },
        { id: 'rarp', t: 'box', x: 400, y: 280, w: 76, h: 38, l: 'RARP', c: 'white' },
        { id: 'icmp', t: 'box', x: 481, y: 280, w: 76, h: 38, l: 'ICMP', c: 'white' },
        { id: 'rp', t: 'box', x: 562, y: 280, w: 76, h: 38, l: 'RP', c: 'white' },
        { id: 'ifz', t: 'box', x: 400, y: 346, w: 400, h: 82, l: 'Interfaz de red', sub: 'enlace + físico', c: 'purple' },
        { id: 'l4', t: 'txt', x: 614, y: 152, l: 'APLICACIÓN', anchor: 'start' },
        { id: 'l3', t: 'txt', x: 614, y: 240, l: 'TRANSPORTE', anchor: 'start' },
        { id: 'l2', t: 'txt', x: 614, y: 284, l: 'INTERNET', anchor: 'start' },
        { id: 'l1', t: 'txt', x: 614, y: 350, l: 'INTERFAZ', anchor: 'start' }
      ],
      links: []
    },
    caminos: {
      kind: 'topo',
      zones: [{ id: 'zp', x: 140, y: 62, w: 520, h: 330, l: 'redes de los proveedores', c: 'blue' }],
      nodes: [
        { id: 'A', t: 'pc', x: 60, y: 225, l: 'A', sub: 'origen' },
        { id: 'R1', t: 'router', x: 205, y: 225, l: 'R1' },
        { id: 'R2', t: 'router', x: 400, y: 118, l: 'R2' },
        { id: 'R3', t: 'router', x: 400, y: 332, l: 'R3' },
        { id: 'R4', t: 'router', x: 595, y: 225, l: 'R4' },
        { id: 'B', t: 'server', x: 735, y: 225, l: 'B', sub: 'destino' }
      ],
      links: [{ a: 'A', b: 'R1' }, { a: 'R1', b: 'R2', lx: -52, ly: -4 }, { a: 'R2', b: 'R4' }, { a: 'R1', b: 'R3', lx: -52, ly: 22 }, { a: 'R3', b: 'R4' }, { a: 'R4', b: 'B' }]
    },
    cab: {
      kind: 'fields', title: 'Datagrama IP', ruler: 32, rh: 36,
      rows: [
        [{ id: 'v', l: 'Versión', s: '4 bits', w: 4, c: 'gray' }, { id: 'hl', l: 'HLEN', s: '4 bits', w: 4, c: 'yellow' }, { id: 'tos', l: 'ToS', s: '8 bits', w: 8, c: 'orange' }, { id: 'tl', l: 'Longitud total', s: '16 bits', w: 16, c: 'blue' }],
        [{ id: 'idn', l: 'Identificación', s: '16 bits', w: 16, c: 'green' }, { id: 'fl', l: 'Flags', s: '3 bits', w: 3, c: 'green' }, { id: 'off', l: 'Desplazamiento del fragmento', s: '13 bits', w: 13, c: 'green' }],
        [{ id: 'ttl', l: 'TTL', s: '8 bits', w: 8, c: 'red' }, { id: 'pro', l: 'Protocolo', s: '8 bits', w: 8, c: 'purple' }, { id: 'chk', l: 'Checksum del encabezado', s: '16 bits', w: 16, c: 'yellow' }],
        [{ id: 'src', l: 'Dirección IP origen', s: '32 bits', w: 32, c: 'blue' }],
        [{ id: 'dst', l: 'Dirección IP destino', s: '32 bits', w: 32, c: 'blue' }],
        [{ id: 'opt', l: 'Opciones (si las hay)', s: 'longitud variable', w: 24, c: 'gray' }, { id: 'pad', l: 'Relleno', s: 'hasta 32 bits', w: 8, c: 'gray' }],
        [{ id: 'dat', l: 'DATOS …', w: 32, c: 'white' }]
      ]
    },
    ttl: {
      kind: 'topo',
      nodes: [
        { id: 'A', t: 'pc', x: 70, y: 140, l: 'A', sub: 'origen' },
        { id: 'R1', t: 'router', x: 250, y: 140, l: 'R1' },
        { id: 'R2', t: 'router', x: 500, y: 140, l: 'R2' },
        { id: 'R3', t: 'router', x: 375, y: 320, l: 'R3' },
        { id: 'B', t: 'server', x: 710, y: 140, l: 'B', sub: 'destino' }
      ],
      links: [{ a: 'A', b: 'R1' }, { a: 'R1', b: 'R2' }, { a: 'R2', b: 'R3' }, { a: 'R3', b: 'R1' }, { a: 'R2', b: 'B', dash: 1 }]
    },
    tos: {
      kind: 'fields', title: 'El campo ToS (8 bits)', rh: 62,
      rows: [[
        { id: 'pre', l: 'otros usos', s: '3 bits', w: 3, c: 'gray' },
        { id: 'd', l: 'Minimizar\ndelay', s: '1 bit', w: 2.4, c: 'green' }, { id: 't', l: 'Maximizar\nthroughput', s: '1 bit', w: 2.4, c: 'blue' },
        { id: 'r', l: 'Maximizar\nconfiabilidad', s: '1 bit', w: 2.4, c: 'purple' }, { id: 'c', l: 'Minimizar\ncosto', s: '1 bit', w: 2.4, c: 'orange' },
        { id: 'z', l: '—', s: '1 bit', w: 1.2, c: 'gray' }
      ]]
    }
  },
  steps: [
    {
      s: 'Suite', k: 'contexto', t: 'La suite TCP/IP',
      b: '<p>Se le dice <b>suite</b> porque es un conjunto de protocolos; entre ellos, <b>TCP</b> (Transmission Control Protocol) e <b>IP</b> (Internet Protocol).</p><ul><li><b>Capa de red</b>: el protocolo es <b>IP</b>. Los demás (ARP, RARP, ICMP…) son de soporte: ayudan a IP.</li><li><b>Transporte</b>: dos variantes, <b>TCP</b> (la confiable) y <b>UDP</b> (la ágil).</li><li><b>Aplicación</b>: por encima del transporte, todos los protocolos conocidos (HTTP, DNS, FTP, SMTP…).</li></ul>',
      key: 'Muchas aplicaciones arriba, muchas redes abajo y, en el medio, un único protocolo de red: IP.',
      fig: 'image48.png', scene: 'suite', hi: ['ip', 'tcp', 'udp'], st: { serv: '—', hdr: '—', ttl: '—' }
    },
    {
      s: 'Filosofía', k: 'idea', t: 'Connectionless, no confiable, best effort',
      b: '<p>Todo opera sobre un servicio de <b>entrega de paquetes connectionless</b>. En capa de red hablamos de <b>paquetes</b> o <b>datagramas</b>. El servicio de IP es:</p><ul><li><b>No confiable</b>: los paquetes pueden perderse, duplicarse, desordenarse o demorarse, y IP no le avisa al receptor.</li><li><b>Connectionless</b>: cada paquete se trata de forma <b>independiente</b>. Los routers no guardan estado de qué hicieron con el anterior ni qué harán con el siguiente.</li><li><b>Best effort</b>: no hay garantías.</li></ul><p>A cambio es <b>resiliente</b>: se repone ante cualquier falla de la red.</p>',
      key: 'IP hace lo mejor que puede con cada paquete, por separado y sin prometer nada.',
      fig: 'image49.png', scene: 'caminos', tags: { B: 'llegan 2 y 1' },
      pk: [
        { p: ['A', 'R1', 'R2', 'R4', 'B'], l: 'paquete 1', t: 0, d: 3.2 },
        { p: ['A', 'R1', 'R3', 'R4', 'B'], l: 'paquete 2', c: 'res', t: .7, d: 2.2 },
        { p: ['A', 'R1', 'R2', 'R4', 'B'], l: 'paquete 3', c: 'bad', t: 1.5, d: 3, drop: 1, dropAt: .4 }
      ],
      notes: [{ x: 300, y: 186, w: 200, c: 'yellow', text: 'Tres paquetes del mismo mensaje: cada uno se encamina <b>por separado</b>. El 2 llega antes que el 1 y el 3 se pierde, <b>sin que nadie avise</b>.' }],
      st: { serv: 'Connectionless · best effort' }
    },
    {
      s: 'Cabecera', k: 'detalle', t: 'El datagrama: cabecera y datos',
      b: '<p>El protocolo se implementa en la <b>cabecera</b>, que se dibuja en filas de 32 bits. Los dos primeros campos:</p><ul><li><b>Versión</b> (4 bits).</li><li><b>HLEN</b> (4 bits): longitud de la cabecera, que puede ser variable. Se mide en <b>palabras de 32 bits</b>, y el mínimo es <b>5 palabras</b>.</li></ul><p>Con HLEN se sabe qué parte del datagrama total es cabecera y dónde empiezan los datos.</p>',
      key: 'HLEN no cuenta bytes: cuenta filas de 32 bits.',
      fig: 'image50.png', scene: 'cab', hi: ['v', 'hl'],
      det: '<b>HLEN = 5</b> → 5 palabras × 32 bits = 160 bits = <b>20 bytes</b>: las cinco primeras filas del dibujo. Si hay opciones, HLEN es mayor.',
      st: { hdr: 'mínimo 5 palabras = 20 bytes' }
    },
    {
      s: 'Longitud', k: 'detalle', t: 'Longitud total y los campos de fragmentación',
      b: '<ul><li><b>Longitud total</b> (16 bits): tamaño del datagrama completo. Con 16 bits, el valor máximo es <b>65 535</b>.</li><li><b>Identificación</b>: cada paquete que sale del host lleva un valor distinto; es su identificador propio.</li><li><b>Flags</b> y <b>Offset</b> (desplazamiento del fragmento): junto con la identificación permiten partir un datagrama y volver a armarlo.</li></ul><p>Esos tres campos son el tema de la próxima lección: <b>fragmentación</b>.</p>',
      key: 'Un datagrama IP puede medir, como mucho, 65 535 bytes.',
      scene: 'cab', hi: ['tl', 'idn', 'fl', 'off'],
      det: '<b>Longitud total</b>: 16 bits → de 0 a 2¹⁶ − 1 = <b>65 535</b>. <b>Identificación + Flags + Offset</b> ocupan toda la segunda fila: 16 + 3 + 13 = 32 bits.'
    },
    {
      s: 'Checksum', k: 'detalle', t: 'Protocolo y Checksum',
      b: '<ul><li><b>Protocolo</b> (8 bits): indica qué hay en el campo de datos; por ejemplo, un segmento TCP.</li><li><b>Checksum</b> (16 bits): sirve para detectar errores, pero <b>solo del encabezado</b>. IP no garantiza una entrega libre de errores: únicamente chequea que la cabecera sea correcta.</li></ul><p>Si hay un error en el encabezado, el datagrama <b>se descarta</b>: no podemos asegurar que esté yendo al destinatario correcto.</p>',
      key: 'El checksum de IP protege la cabecera, no los datos.',
      scene: 'cab', hi: ['pro', 'chk'],
      det: 'Un bit cambiado en la <b>dirección destino</b> mandaría el datagrama a otro lado: por eso, ante un checksum incorrecto, el router lo descarta sin intentar corregirlo.'
    },
    {
      s: 'Direcciones', k: 'detalle', t: 'Direcciones, opciones y relleno',
      b: '<ul><li><b>Dirección IP fuente y destino</b> (32 bits cada una).</li><li><b>Opciones</b>: son las que hacen variable la longitud de la cabecera.</li><li><b>Relleno</b>: completa el campo de opciones para que ocupe todos los bits de la palabra (parecido al relleno de Ethernet).</li></ul><p>IP cumple dos funciones: con las <b>direcciones</b> identifica quién soy y a dónde quiero ir, y con el <b>encaminamiento</b> resuelve cómo llegar hasta ahí.</p>',
      key: 'Direccionar y encaminar: las dos tareas de IP.',
      scene: 'cab', hi: ['src', 'dst', 'opt', 'pad'],
      det: 'Sin opciones, la cabecera termina en la <b>dirección destino</b> (20 bytes, HLEN = 5). Con opciones, el relleno la lleva hasta un múltiplo de 32 bits para que HLEN pueda contarla.'
    },
    {
      s: 'TTL', k: 'mecanismo', t: 'TTL: el tiempo de vida',
      b: '<p><b>Time To Live</b> (8 bits): en su origen, un tiempo de vida máximo de <b>255 segundos</b>. Cada router debía descontar el tiempo que el datagrama pasaba en sus colas o siendo procesado.</p><p>Lo que se hace actualmente es más simple: cada router lo <b>decrementa en 1</b>. Se pasó de segundos a <b>saltos</b>: cuántos routers puede atravesar antes de quedarse sin vida.</p><p>Sirve para evitar <b>loops</b>, donde los datagramas dan vueltas sin avanzar. Cuando el TTL llega a <b>0</b>, el router lo <b>descarta</b>.</p>',
      key: 'El TTL es un contador de saltos: garantiza que ningún datagrama circule para siempre.',
      scene: 'ttl', hi: ['R1'], tags: { R1: 'resta 1 en cada pasada', R2: 'resta 1', R3: 'resta 1', B: 'nunca llega' },
      pk: [
        { p: ['A', 'R1'], l: 'TTL = 4', d: 1 }, { p: ['R1', 'R2'], l: 'TTL = 3', d: 1 }, { p: ['R2', 'R3'], l: 'TTL = 2', d: 1 }, { p: ['R3', 'R1'], l: 'TTL = 1', d: 1 },
        { p: ['R1', [160, 255]], l: 'TTL = 0', c: 'bad', d: .9, drop: 1 }
      ],
      notes: [{ x: 520, y: 240, w: 250, c: 'yellow', text: 'Un error de ruteo arma un <b>loop</b> entre R1, R2 y R3. Sin TTL el datagrama daría vueltas para siempre; con TTL, el router que lo deja en <b>0</b> lo descarta.' }],
      st: { ttl: '4 → 3 → 2 → 1 → 0: descartado' }
    },
    {
      s: 'ToS', k: 'detalle', t: 'Type of Service: marcar el paquete',
      b: '<p><b>ToS</b> (8 bits) implementa, de alguna manera, la idea de <b>calidad de servicio</b>: marcar los paquetes con un indicador de cómo deben ser tratados (urgente, puede esperar…).</p><p>Originalmente se definieron <b>4 bits</b>; después, distintos RFC los fueron modificando y agregando otros. Solo <b>uno</b> de los cuatro puede estar encendido:</p><ul><li>Minimizar <b>delay</b></li><li>Maximizar <b>throughput</b></li><li>Maximizar <b>confiabilidad</b></li><li>Minimizar <b>costo</b></li></ul>',
      key: 'Cada aplicación marca lo que más le importa: Telnet pide poca demora; FTP de datos, mucho caudal.',
      fig: 'image51.png', scene: 'tos', hi: ['d', 't', 'r', 'c'],
      tbl: { x: 150, y: 228, w: 510, title: 'Valores recomendados de ToS (RFC 1349)', cols: ['Aplicación', 'Min. delay', 'Max. throughput', 'Max. confiabilidad', 'Min. costo'], rows: [['Telnet / Rlogin', '1', '0', '0', '0'], ['FTP · control', '1', '0', '0', '0'], ['DNS query (UDP)', '1', '0', '0', '0'], ['FTP · datos', '0', '1', '0', '0'], ['ICMP', '0', '0', '0', '0']] },
      st: { ttl: 'se resta 1 por salto' }
    },
    {
      s: 'Camino', k: 'ejemplo', t: 'ToS: influir en el camino',
      b: '<p>Los routers hacen <b>encaminamiento</b>: conectan redes hasta alcanzar el destino. Si conmutan mirando solo la dirección destino, no hace falta decirles nada más.</p><p>Pero el protocolo permite <b>influir</b> en esa decisión. Cuando un router tiene <b>dos caminos</b> hacia el destino, según el ToS el paquete puede tomar el más rápido, el más barato, etc.</p><p>Cuidado: cada router tiene además <b>sus propios clientes</b>. Un paquete marcado como urgente entra en conflicto con los paquetes de ellos. Es un sistema <b>muy frágil</b>.</p>',
      key: 'Pedir un trato especial no obliga a nadie: cada red del camino tiene sus propias prioridades.',
      fig: ['image53.png', 'image54.png'], scene: 'caminos', hi: ['R1'], tags: { R1: 'dos caminos: mira el ToS', R2: 'tiene sus propios clientes' },
      ll: { 'R1-R2': 'más rápido', 'R1-R3': 'más barato' },
      pk: [{ p: ['A', 'R1', 'R2', 'R4', 'B'], l: 'ToS: min. delay', c: 'key', d: 2.6 }, { p: ['A', 'R1', 'R3', 'R4', 'B'], l: 'ToS: min. costo', c: 'res', d: 3.2 }],
      notes: [{ x: 300, y: 192, w: 200, c: 'red', text: 'Mi paquete <b>urgente</b> compite con los paquetes de los clientes de cada proveedor. Hay que tenerlo en cuenta antes de influir en el camino.' }]
    },
    {
      s: 'Resumen', k: 'resumen', t: 'El datagrama IP en una mirada',
      b: '<ul><li>IP es <b>connectionless</b>, <b>no confiable</b> y <b>best effort</b>: cada datagrama viaja por su cuenta.</li><li>Cabecera de <b>20 bytes</b> como mínimo (HLEN = 5); datagrama de hasta <b>65 535</b> bytes.</li><li><b>TTL</b>: cada router resta 1; en 0 se descarta.</li><li><b>Checksum</b>: solo de la cabecera.</li><li><b>ToS</b>: 4 bits para pedir menos demora, más caudal, más confiabilidad o menos costo.</li></ul><p>Quedaron pendientes Identificación, Flags y Offset. En la próxima lección vemos para qué están: <b>fragmentación y reensamblado</b>.</p>',
      scene: 'cab',
      det: 'Fila 1: cómo es el datagrama · Fila 2: <b>fragmentación</b> (lo que sigue) · Fila 3: vida, contenido y control · Filas 4 y 5: quién lo envía y a dónde va.',
      st: { serv: 'Connectionless · best effort', hdr: '20 bytes + opciones', ttl: 'se resta 1 por salto' }
    }
  ],
  quiz: [
    { q: '¿Qué significa que IP sea connectionless?', o: ['Que no usa cables', 'Que cada paquete se trata de forma independiente, sin que los routers guarden estado de los anteriores', 'Que primero establece una conexión y después envía', 'Que retransmite los paquetes perdidos'], a: 1, why: 'La red trata cada datagrama por separado, sin considerar qué hizo con el anterior ni qué hará con el siguiente.' },
    { q: 'Un datagrama tiene HLEN = 5. ¿Cuánto mide su cabecera?', o: ['5 bytes', '5 bits', '20 bytes', '40 bytes'], a: 2, why: 'HLEN cuenta palabras de 32 bits: 5 × 32 = 160 bits = 20 bytes, la cabecera mínima (sin opciones).' },
    { q: '¿Qué protege el checksum de la cabecera IP?', o: ['Todo el datagrama', 'Solo los datos', 'Solo el encabezado', 'Las direcciones MAC'], a: 2, why: 'IP solo chequea que el encabezado sea correcto; si tiene un error, descarta el datagrama porque no puede asegurar a dónde va.' },
    { q: 'Un router recibe un datagrama con TTL = 1. ¿Qué pasa?', o: ['Lo reenvía con TTL = 1', 'Lo decrementa a 0 y lo descarta', 'Le suma 255 y lo reenvía', 'Lo devuelve al router anterior'], a: 1, why: 'Cada router resta 1 al TTL; cuando llega a 0 el datagrama se descarta. Así se evita que quede dando vueltas en un loop.' }
  ],
  cheat: [
    ['Suite TCP/IP', '<b>IP</b> en capa de red (con ARP, RARP, ICMP de soporte); <b>TCP</b> (confiable) y <b>UDP</b> (ágil) en transporte; aplicaciones arriba.'],
    ['Servicio de IP', '<b>Connectionless</b> (cada paquete por separado), <b>no confiable</b> (puede perder, duplicar, desordenar o demorar) y <b>best effort</b> (sin garantías).'],
    ['Versión · HLEN', '4 bits cada uno. HLEN = longitud de la cabecera en palabras de 32 bits; mínimo 5 (20 bytes).'],
    ['Longitud total', '16 bits: hasta 65 535.'],
    ['Identificación · Flags · Offset', 'Identificador propio de cada paquete, más lo necesario para fragmentar y reensamblar.'],
    ['TTL', '8 bits. Nació en segundos (máx. 255); hoy son saltos: cada router resta 1 y en 0 descarta. Evita loops.'],
    ['Protocolo · Checksum', 'Protocolo (8 bits): qué va en los datos (p. ej. TCP). Checksum (16 bits): solo de la cabecera; si falla, se descarta.'],
    ['ToS', '8 bits; 4 originales, solo uno encendido: minimizar delay, maximizar throughput, maximizar confiabilidad, minimizar costo.']
  ]
});

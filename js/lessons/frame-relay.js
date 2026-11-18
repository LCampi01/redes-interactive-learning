COURSE.add({
  id: 'frame-relay',
  title: 'Frame Relay',
  desc: 'Circuitos virtuales sobre una red compartida: cómo se identifica cada circuito con el DLCI, qué garantiza el CIR y qué pasa con las tramas que lo exceden.',
  min: 12, level: 'Intermedio',
  learn: [
    'Qué diferencia a un circuito virtual de un circuito real y por qué hace viable la malla',
    'Cómo los nodos conmutan las tramas con el DLCI y su tabla de puertos',
    'Qué campos tiene la trama: DLCI, FECN, BECN, DE y EA',
    'Qué son CIR, EIR, Tc, Bc y Be, y cuándo una trama sale con DE = 1 o se descarta',
    'Por qué Frame Relay solo notifica la congestión'
  ],
  stats: [{ k: 'acc', l: 'Acceso' }, { k: 'cir', l: 'CIR' }, { k: 'cont', l: 'Contador en Tc' }, { k: 'de', l: 'Resultado' }],
  legend: [['req', 'trama del circuito'], ['res', 'otro circuito o cliente'], ['key', 'trama marcada (FECN, DE = 1)'], ['ctl', 'BECN']],
  scenes: {
    circ: {
      kind: 'topo',
      zones: [
        { id: 'zr', x: 30, y: 64, w: 740, h: 150, l: 'Red telefónica: circuito real', c: 'yellow' },
        { id: 'zv', x: 30, y: 236, w: 740, h: 152, l: 'Red de paquetes: circuito virtual', c: 'green' }
      ],
      nodes: [
        { id: 'T1', t: 'tel', x: 100, y: 140, l: 'Abonado' }, { id: 'C1', t: 'hub', x: 300, y: 140, l: 'Central' },
        { id: 'C2', t: 'hub', x: 500, y: 140, l: 'Central' }, { id: 'T2', t: 'tel', x: 700, y: 140, l: 'Abonado' },
        { id: 'R1', t: 'router', x: 100, y: 312, l: 'Abonado' }, { id: 'N1', t: 'switch', x: 300, y: 312, l: 'Nodo' },
        { id: 'N2', t: 'switch', x: 500, y: 312, l: 'Nodo' }, { id: 'R2', t: 'router', x: 700, y: 312, l: 'Abonado' }
      ],
      links: [
        { a: 'T1', b: 'C1' }, { a: 'C1', b: 'C2', l: 'slot dedicado · 64 kb', ly: 28, thick: 1, c: 'yellow' }, { a: 'C2', b: 'T2' },
        { a: 'R1', b: 'N1', l: 'acceso', ly: 28 }, { a: 'N1', b: 'N2', l: 'enlace compartido', ly: 28, thick: 1 }, { a: 'N2', b: 'R2', l: 'acceso', ly: 28 }
      ]
    },
    malla: {
      kind: 'topo',
      zones: [
        { id: 'zc', x: 24, y: 62, w: 366, h: 328, l: 'Circuitos reales: malla = 6 circuitos', c: 'yellow' },
        { id: 'zf', x: 410, y: 62, w: 366, h: 328, l: 'Frame Relay: 1 acceso por sitio', c: 'green' }
      ],
      nodes: [
        { id: 'CC', t: 'router', x: 207, y: 122, l: 'Casa central' }, { id: 'S1', t: 'router', x: 85, y: 225, l: 'Sucursal 1' },
        { id: 'S3', t: 'router', x: 329, y: 225, l: 'Sucursal 3' }, { id: 'S2', t: 'router', x: 207, y: 328, l: 'Sucursal 2' },
        { id: 'FC', t: 'router', x: 593, y: 122, l: 'Casa central' }, { id: 'F1', t: 'router', x: 471, y: 225, l: 'Sucursal 1' },
        { id: 'F3', t: 'router', x: 715, y: 225, l: 'Sucursal 3' }, { id: 'F2', t: 'router', x: 593, y: 328, l: 'Sucursal 2' },
        { id: 'FR', t: 'cloud', x: 593, y: 225, l: 'Red FR', c: 'blue' }
      ],
      links: [
        { a: 'CC', b: 'S1', thick: 1 }, { a: 'CC', b: 'S2', thick: 1 }, { a: 'CC', b: 'S3', thick: 1 },
        { a: 'S1', b: 'S2', dash: 1, c: 'red' }, { a: 'S2', b: 'S3', dash: 1, c: 'red' }, { a: 'S1', b: 'S3', dash: 1, c: 'red' },
        { a: 'FC', b: 'FR' }, { a: 'F1', b: 'FR' }, { a: 'F2', b: 'FR' }, { a: 'F3', b: 'FR' }
      ]
    },
    red: {
      kind: 'topo',
      zones: [{ id: 'zf', x: 168, y: 62, w: 302, h: 328, l: 'Red Frame Relay', c: 'blue' }],
      nodes: [
        { id: 'RA', t: 'router', x: 70, y: 215, l: 'Casa central' },
        { id: 'N1', t: 'switch', x: 215, y: 215, l: 'Nodo 1' }, { id: 'N2', t: 'switch', x: 400, y: 122, l: 'Nodo 2' }, { id: 'N3', t: 'switch', x: 400, y: 318, l: 'Nodo 3' },
        { id: 'RB', t: 'router', x: 620, y: 122, l: 'Sucursal B' }, { id: 'RC', t: 'router', x: 620, y: 318, l: 'Sucursal C' }
      ],
      links: [
        { a: 'RA', b: 'N1', l: 'acceso', ly: 28, thick: 1 }, { a: 'N1', b: 'N2', lx: -40, ly: -8 }, { a: 'N1', b: 'N3', lx: -34, ly: 18 },
        { a: 'N2', b: 'N3' }, { a: 'N2', b: 'RB', ly: 28 }, { a: 'N3', b: 'RC', ly: 28 }
      ]
    },
    trama: {
      kind: 'fields', title: 'Trama Frame Relay (LAPF)', rh: 46,
      rows: [[
        { id: 'f1', l: 'Flag', s: '1 byte', w: 4, c: 'purple' }, { id: 'dir', l: 'Dirección', s: '2 bytes (hasta 4)', w: 7, c: 'green' },
        { id: 'dat', l: 'Campo de datos', s: 'variable · máx. 4096 bytes', w: 15, c: 'white' },
        { id: 'fcs', l: 'FCS', s: '2 bytes · CRC-16', w: 6, c: 'orange' }, { id: 'f2', l: 'Flag', s: '1 byte', w: 4, c: 'purple' }
      ]],
      zoom: {
        from: 'dir', title: 'Campo de dirección: configuración mínima de 2 bytes', x: 90, w: 620,
        rows: [
          [{ id: 'd1', l: 'DLCI', s: '6 bits', w: 6, c: 'green' }, { id: 'cr', l: 'C/R', s: '1 bit', w: 1, c: 'gray' }, { id: 'ea0', l: 'EA = 0', s: 'sigue', w: 1, c: 'gray' }],
          [{ id: 'd2', l: 'DLCI', s: '4 bits', w: 4, c: 'green' }, { id: 'fecn', l: 'FECN', s: '1 bit', w: 1, c: 'yellow' }, { id: 'becn', l: 'BECN', s: '1 bit', w: 1, c: 'purple' }, { id: 'de', l: 'DE', s: '1 bit', w: 1, c: 'red' }, { id: 'ea1', l: 'EA = 1', s: 'fin', w: 1, c: 'gray' }]
        ]
      }
    },
    cir: { kind: 'stack', unit: 'kb' }
  },
  steps: [
    {
      s: 'Circuitos', k: 'contexto', t: 'Circuitos virtuales en lugar de circuitos reales',
      b: '<p><b>Frame Relay</b> es un protocolo de <b>capa 2</b> derivado de HDLC y <b>orientado a la conexión</b>. No provee calidad de servicio ni recuperación de errores, y se implementa sobre velocidades de n × 64 kb hasta 34 Mbps.</p><p>Tradicionalmente los sitios se unían por la red telefónica, que arma <b>circuitos reales</b>: reserva un slot de 64 kb, dedicado de manera exclusiva a esa comunicación.</p><p>En una red de paquetes se contrata un <b>acceso</b> y un <b>circuito virtual</b>: una configuración lógica en los nodos que dice que un abonado se comunica con otro. No se reservan recursos: el enlace se <b>comparte</b> entre todos, y por eso es más barato.</p>',
      key: 'Circuito real = recurso físico de uso exclusivo. Circuito virtual = configuración lógica sobre un enlace compartido.',
      fig: ['image146.png', 'image147.png'], scene: 'circ',
      pk: [
        { p: ['T1', 'C1', 'C2', 'T2'], l: 'voz', c: 'white', t: 0, d: 2.8 },
        { p: ['R1', 'N1', 'N2', 'R2'], l: 'trama', c: 'req', t: 0, d: 2.8 },
        { p: [[240, 372], 'N1', 'N2', [560, 372]], l: 'otro cliente', c: 'res', t: 1.1, d: 2.4 }
      ],
      st: { acc: '—', cir: '—', cont: '—', de: '—' }
    },
    {
      s: 'Topologías', k: 'problema', t: 'De la estrella a la malla',
      b: '<p>Con enlaces hacia la casa central se arma una <b>estrella</b>: todas las sucursales acceden a sus servicios, pero para comunicar dos sucursales hay que pasar sí o sí por la central.</p><p>Una <b>malla</b> con circuitos reales obliga a contratar una cantidad enorme de circuitos (en rojo) que casi no se usan: caro e ineficiente.</p><p>Con Frame Relay cada sitio contrata <b>un acceso</b> a la red y el proveedor lo conecta con los demás por circuitos virtuales. Casi siempre son <b>permanentes (PVC)</b>; los <b>conmutados</b>, parecidos a un llamado telefónico para datos, son menos populares.</p>',
      key: 'Sumar un sitio a la malla es contratar un acceso y pedir circuitos virtuales, no tender circuitos dedicados.',
      fig: ['image148.png', 'image149.png'], scene: 'malla',
      pk: [
        { p: ['S1', 'CC', 'S3'], l: 'vía la central', c: 'req', t: 0, d: 2.6 },
        { p: ['F1', 'FR', 'F3'], l: 'PVC 1 → 3', c: 'req', t: 0, d: 2.2 },
        { p: ['F2', 'FR', 'FC'], l: 'PVC 2 → central', c: 'res', t: 1.2, d: 2.2 }
      ]
    },
    {
      s: 'DLCI', k: 'mecanismo', t: 'DLCI: de qué circuito es cada trama',
      b: '<p>Por un único acceso viajan <b>multiplexadas</b> varias comunicaciones lógicas hacia distintos destinos. Cada una se identifica con un <b>DLCI</b> (identificador de canal lógico), una idea parecida al tag de VLAN de 802.1Q.</p><p>Cada nodo tiene una tabla: lo que <b>entra</b> por un puerto con un DLCI <b>sale</b> por otro puerto con otro DLCI. En el ejemplo, lo que llega por el Port 0 con DLCI 16 sale por el Port 2 con DLCI 30.</p><p>El <b>PVC</b> queda establecido como la concatenación de esos DLCI, de nodo a nodo. Es una configuración <b>estática</b> que carga el proveedor: por cada servicio nuevo asigna un DLCI y completa las tablas.</p>',
      key: 'El DLCI no viaja igual de punta a punta: cada nodo lo cambia según su tabla.',
      fig: ['image149.png', 'image150.png'], scene: 'red', hi: ['N1'],
      ll: { 'RA-N1': 'DLCI 16', 'N1-N2': 'DLCI 30', 'N2-RB': 'DLCI 100' },
      pk: [
        { p: ['RA', 'N1'], l: 'DLCI 16', c: 'req', d: 1.2 }, { p: ['N1', 'N2'], l: 'DLCI 30', c: 'req', d: 1.2 }, { p: ['N2', 'RB'], l: 'DLCI 100', c: 'req', d: 1.2 },
        { p: ['RA', 'N1', 'N3', 'RC'], l: 'otro PVC', c: 'res', t: 1.4, d: 3 }
      ],
      tbl: [
        { x: 16, y: 304, w: 262, title: 'Nodo 1', cols: ['IN_PORT', 'IN_DLCI', 'OUT_PORT', 'OUT_DLCI'], rows: [['Port 0', '16', 'Port 2', '30']], hi: 0 },
        { x: 500, y: 188, w: 262, title: 'Nodo 2 (visto desde la sucursal B)', cols: ['IN_PORT', 'IN_DLCI', 'OUT_PORT', 'OUT_DLCI'], rows: [['Port 0', '100', 'Port 1', '30']] }
      ]
    },
    {
      s: 'Trama', k: 'detalle', t: 'La trama de Frame Relay',
      b: '<p>El formato lo define <b>LAPF</b>, la versión core de Frame Relay: es el <b>plano de usuario</b>, y cubre solo algunas de las funciones de la capa de enlace. Aparte existe un <b>plano de control</b>, con un protocolo para conectar dos extremos con circuitos virtuales conmutados.</p><ul><li><b>Flag</b>: el mismo de HDLC, con inserción de ceros.</li><li><b>Dirección</b>: 2 bytes como mínimo, extensible a 3 o 4. A diferencia de HDLC, no hay campo de control.</li><li><b>Datos</b>: longitud variable, hasta 4096 bytes (generalmente 1600).</li><li><b>FCS</b>: el mismo de HDLC, un CRC-16.</li></ul>',
      fig: ['image145.png', 'image151.png'], scene: 'trama', zoom: 1,
      det: '<b>DLCI</b>: 6 + 4 = 10 bits, o sea 2¹⁰ circuitos posibles (más si la dirección ocupa 3 o 4 bytes). <b>EA</b> (Extended Address): 0 si el campo continúa, 1 en el último byte. <b>C/R</b>: comando / respuesta. <b>FECN</b> y <b>BECN</b>: avisos de congestión. <b>DE</b>: en 1, la trama es descartable.'
    },
    {
      s: 'CIR / EIR', k: 'idea', t: 'CIR y EIR: lo comprometido y el exceso',
      b: '<p>El tráfico de datos es <b>asimétrico</b>: un GET de HTTP es un pedido chico y la respuesta puede traer megas. Un circuito de capacidad fija no se ajusta: lo ideal es tener mucha capacidad, pero solo cuando se la necesita.</p><p>Frame Relay distingue dos tasas dentro del acceso:</p><ul><li><b>CIR</b> (tasa de información comprometida): lo que el proveedor <b>garantiza</b> transportar.</li><li><b>EIR</b> (tasa en exceso): lo que se consume por encima del CIR. No está garantizado: se transmite si hay lugar en la red.</li></ul><p>Por ejemplo, un acceso de 2 Mb con un CIR de 256 kb. En los próximos pasos usamos un acceso de <b>128 kb</b> con <b>64 kb</b> de CIR y 64 kb de EIR.</p>',
      key: 'Si la red está congestionada, el proveedor garantiza que al menos deja transmitir el CIR.',
      fig: 'image152.png', scene: 'cir', title: 'Bits transmitidos durante un Tc de 1 segundo', max: 160,
      levels: [{ to: 64, l: 'CIR (Bc)', c: 'green', tag: 'DE = 0' }, { to: 128, l: 'CIR + EIR', c: 'yellow', tag: 'DE = 1' }], items: [],
      notes: [
        { x: 450, y: 74, w: 318, c: 'yellow', text: '<b>Tc</b>: intervalo durante el cual se mide la tasa de transmisión.<br><b>Bc</b>: cantidad máxima de bits que la red garantiza entregar durante Tc.<br><b>Be</b>: cantidad máxima de bits por encima del CIR que la red intentará entregar durante Tc.' },
        { x: 450, y: 240, w: 318, c: 'green', text: '<b>CIR = Bc / Tc</b> &nbsp;·&nbsp; EIR = Be / Tc<br>Con Tc = 1 s y Bc = 64 kb, el CIR es de 64 kb por segundo.' }
      ],
      st: { acc: '128 kb', cir: '64 kb', cont: '0 kb', de: '—' }
    },
    {
      s: 'Bajo el CIR', k: 'ejemplo', t: 'Gestión del tráfico I: por debajo del CIR',
      b: '<p>El nodo al que estamos conectados hace el <b>control de tráfico</b>: mide que se cumpla lo comprometido con un <b>contador</b> que arranca en cada Tc.</p><p>Entra una trama de X bits y el contador marca X. Entra otra de Y: X + Y. Entra una tercera de Z: X + Y + Z.</p><p>Las tres llegaron en el mismo segundo y suman menos de 64 kb: están <b>por debajo del CIR</b>, dentro del área comprometida.</p><p>El nodo las deja pasar con el bit <b>DE = 0</b>. Cuando DE vale 1, la trama es descartable.</p>',
      key: 'Mientras el tráfico se mantenga por debajo del CIR, todas las tramas viajan comprometidas.',
      fig: 'image153.png', scene: 'cir', title: 'Tres tramas en un Tc de 1 segundo', max: 160,
      levels: [{ to: 64, l: 'CIR (Bc)', c: 'green', tag: 'DE = 0' }, { to: 128, l: 'CIR + EIR', c: 'yellow', tag: 'DE = 1' }],
      items: [{ v: 20, l: 'trama 1 · X' }, { v: 18, l: 'trama 2 · Y' }, { v: 22, l: 'trama 3 · Z' }],
      notes: [{ x: 580, y: 286, w: 196, c: 'green', text: 'Valores de ejemplo: 20 + 18 + 22 = <b>60 kb</b>, menos que los 64 kb comprometidos.' }],
      st: { cont: '60 kb', de: 'todas con DE = 0' }
    },
    {
      s: 'Exceso', k: 'ejemplo', t: 'Gestión del tráfico II: en zona de exceso',
      b: '<p>Ahora, en el mismo intervalo, se transmiten <b>cuatro</b> tramas cuya suma excede el límite comprometido.</p><p>Las tres primeras siguen por debajo del CIR: pasan con <b>DE = 0</b>.</p><p>La cuarta cruza el umbral y entra en la zona de <b>EIR</b>: fue transmitida en exceso, y el nodo le pone <b>DE = 1</b>.</p><p>La red transmite todo el tráfico mientras tenga capacidad. Pero si algún nodo experimenta congestión, descarta primero las tramas con DE = 1, porque están por encima de lo comprometido.</p>',
      key: 'DE = 1 no es un descarte: es la marca de qué se puede descartar primero si hace falta.',
      fig: 'image154.png', scene: 'cir', title: 'Cuatro tramas en un Tc de 1 segundo', max: 160,
      levels: [{ to: 64, l: 'CIR (Bc)', c: 'green', tag: 'DE = 0' }, { to: 128, l: 'CIR + EIR', c: 'yellow', tag: 'DE = 1' }],
      items: [{ v: 20, l: 'trama 1' }, { v: 18, l: 'trama 2' }, { v: 22, l: 'trama 3' }, { v: 30, l: 'trama 4' }],
      notes: [{ x: 580, y: 286, w: 196, c: 'yellow', text: 'Con la trama 4 el contador llega a <b>90 kb</b>: pasa los 64 kb del CIR, pero no los 128 kb de CIR + EIR.' }],
      st: { cont: '90 kb', de: 'trama 4 con DE = 1' }
    },
    {
      s: 'Descarte', k: 'ejemplo', t: 'Gestión del tráfico III: más que CIR + EIR',
      b: '<p>Tercer caso: se transmite por encima del CIR <b>y</b> del EIR. Puede darse, por ejemplo, cuando lo que se le quiere enviar al servidor excede el CIR + EIR.</p><p>Las tramas que superan CIR + EIR son <b>descartadas en el ingreso</b>: ni siquiera entran a la red.</p><p>Así, en un mismo intervalo hay tramas que viajan comprometidas (DE = 0), otras marcadas (DE = 1) y otras que directamente se descartan.</p><p>Frame Relay <b>no gestiona</b> las tramas descartadas: lo hacen las capas superiores, que van a retransmitir.</p>',
      key: 'Tres regiones: DE = 0 hasta Bc, DE = 1 hasta Bc + Be, y rechazo por encima.',
      fig: 'image155.png', scene: 'cir', title: 'Cuatro tramas más grandes en un Tc de 1 segundo', max: 160,
      levels: [{ to: 64, l: 'CIR (Bc)', c: 'green', tag: 'DE = 0' }, { to: 128, l: 'CIR + EIR', c: 'yellow', tag: 'DE = 1' }],
      items: [{ v: 30, l: 'trama 1' }, { v: 30, l: 'trama 2' }, { v: 40, l: 'trama 3' }, { v: 45, l: 'trama 4' }],
      notes: [{ x: 580, y: 286, w: 196, c: 'red', text: 'La trama 4 llevaría el contador a <b>145 kb</b>: supera los 128 kb de CIR + EIR.' }],
      st: { cont: '100 kb + descarte', de: 'trama 4 descartada' }
    },
    {
      s: 'Congestión', k: 'mecanismo', t: 'FECN y BECN: avisar la congestión',
      b: '<p>Frame Relay <b>no hace control de flujo</b>: si una estación transmite por encima de la capacidad de la otra, la sobrecarga.</p><p>Tampoco hace control de la congestión: solo la <b>notifica</b> a los extremos, con dos bits de la trama.</p><ul><li><b>FECN</b> (Forward Explicit Congestion Notification): notifica <b>hacia adelante</b>. Quien lo recibe sabe que un nodo del camino está experimentando congestión.</li><li><b>BECN</b> (Backward Explicit Congestion Notification): notifica <b>hacia atrás</b>. Le indica al que está inyectando mucho tráfico que reduzca su tasa de transmisión, porque es uno de los involucrados.</li></ul>',
      key: 'La red avisa; reaccionar queda en manos de los extremos.',
      fig: 'image156.png', scene: 'red', hi: ['N2'],
      tags: { N2: 'nodo congestionado', RB: 'recibe FECN', RA: 'recibe BECN' },
      pk: [
        { p: ['RA', 'N1', 'N2'], l: 'trama', c: 'req', d: 1.8 },
        { p: ['N2', 'RB'], l: 'FECN = 1', c: 'key', d: 1.5 },
        { p: ['N2', 'N1', 'RA'], l: 'BECN = 1', c: 'ctl', par: 1, d: 2.2 }
      ],
      notes: [{ x: 500, y: 196, w: 262, c: 'yellow', text: '<b>FECN</b> sigue el sentido de la transmisión; <b>BECN</b> vuelve hacia el origen del tráfico.' }],
      st: { acc: '—', cir: '—', cont: '—', de: 'solo notificación' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'Frame Relay en una mirada',
      b: '<ul><li>Capa 2, derivado de HDLC y orientado a la conexión; <b>sin</b> QoS, recuperación de errores ni control de flujo.</li><li><b>Circuitos virtuales</b> (en general PVC) sobre enlaces compartidos: la malla se vuelve viable.</li><li>El <b>DLCI</b> identifica cada circuito; los nodos lo conmutan con una tabla puerto / DLCI.</li><li><b>CIR</b> garantizado (DE = 0), <b>EIR</b> en exceso (DE = 1) y descarte por encima de CIR + EIR.</li><li><b>FECN / BECN</b> solo notifican la congestión.</li></ul><p>En la próxima lección, <b>ATM</b> lleva los circuitos virtuales a celdas de tamaño fijo y agrega calidad de servicio por conexión.</p>',
      scene: 'red', ll: { 'RA-N1': 'DLCI 16', 'N1-N2': 'DLCI 30', 'N2-RB': 'DLCI 100' },
      pk: [
        { p: ['RA', 'N1', 'N2', 'RB'], l: 'DE = 0', c: 'req', t: 0, d: 3 },
        { p: ['RA', 'N1', 'N2', 'RB'], l: 'DE = 1', c: 'key', t: 1.2, d: 3 },
        { p: ['RA', 'N1', 'N3', 'RC'], l: 'otro PVC', c: 'res', t: .6, d: 3 }
      ],
      notes: [{ x: 500, y: 196, w: 262, c: 'yellow', text: 'Si un nodo se congestiona, las tramas con <b>DE = 1</b> son las primeras en descartarse.' }]
    }
  ],
  quiz: [
    { q: '¿Qué diferencia a un circuito virtual de un circuito real?', o: ['Es más rápido porque usa fibra', 'No reserva recursos: es una configuración lógica sobre un enlace compartido', 'Reserva un slot de 64 kb para cada comunicación', 'Solo sirve para tráfico de voz'], a: 1, why: 'El circuito real dedica un recurso físico de uso exclusivo; el virtual es una configuración en los nodos y el enlace se comparte, por eso es más barato.' },
    { q: 'La tabla de un nodo dice: Port 0 / DLCI 16 → Port 2 / DLCI 30. ¿Qué pasa con una trama que llega por el Port 0 con DLCI 16?', o: ['Sale por el Port 2 con DLCI 16', 'Sale por el Port 2 con el DLCI cambiado a 30', 'Se descarta porque el DLCI no coincide', 'Sale por todos los puertos'], a: 1, why: 'El nodo conmuta por puerto y DLCI de entrada, y reescribe el DLCI con el de salida: el PVC es la concatenación de esos DLCI.' },
    { q: 'Acceso de 128 kb, CIR de 64 kb, Tc de 1 s. En este intervalo ya entraron 60 kb y llega una trama de 30 kb. ¿Qué hace el nodo de ingreso?', o: ['La deja pasar con DE = 0', 'La deja pasar con DE = 1', 'La descarta', 'La guarda hasta el próximo Tc'], a: 1, why: 'El contador llega a 90 kb: supera el CIR pero no el CIR + EIR, así que la trama viaja en exceso, marcada como descartable.' },
    { q: 'Un nodo de la red Frame Relay se congestiona. ¿Qué hace el protocolo?', o: ['Retransmite las tramas perdidas', 'Frena al emisor con una trama RNR', 'Lo notifica a los extremos con los bits FECN y BECN', 'Aumenta el CIR del circuito'], a: 2, why: 'Frame Relay no hace control de flujo ni de congestión: solo notifica, hacia adelante (FECN) y hacia atrás (BECN).' }
  ],
  cheat: [
    ['Frame Relay', 'Capa 2, derivado de HDLC, orientado a la conexión. Sin QoS ni recuperación de errores. De n × 64 kb a 34 Mbps.'],
    ['LAPF', 'Versión core: define la trama del plano de usuario. El plano de control establece los circuitos conmutados.'],
    ['Circuito virtual', 'Configuración lógica sobre enlaces compartidos, sin reserva de recursos. <b>PVC</b>: permanente, el más usado.'],
    ['DLCI', 'Identificador del circuito: 10 bits (6 + 4). Tabla del nodo: IN_PORT / IN_DLCI → OUT_PORT / OUT_DLCI.'],
    ['Trama', 'Flag · Dirección (DLCI, C/R, FECN, BECN, DE, EA) · Datos (hasta 4096 bytes) · FCS (CRC-16) · Flag.'],
    ['CIR / EIR', '<b>CIR = Bc / Tc</b>: tasa garantizada. <b>EIR = Be / Tc</b>: exceso que se entrega si hay lugar.'],
    ['Bit DE', 'Bajo el CIR: DE = 0. Entre CIR y CIR + EIR: DE = 1. Por encima: descarte en el ingreso.'],
    ['FECN / BECN', 'Notificación de congestión hacia adelante / hacia atrás. No hay control de flujo ni de congestión.']
  ]
});

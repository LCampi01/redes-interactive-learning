COURSE.add({
  id: 'mpls',
  title: 'MPLS: conmutar por etiquetas',
  desc: 'En lugar de buscar la IP destino en cada salto, la red del proveedor le pega al paquete una etiqueta corta y conmuta por coincidencia exacta. Quién la pone, quién la cambia y quién la quita.',
  min: 11, level: 'Intermedio',
  learn: [
    'Cuál es el costo de rutear IP salto a salto y qué cambia con las etiquetas',
    'Qué hacen el plano de control y el plano de datos de un router',
    'Qué diferencia a un LSR de un Edge LSR y cómo viaja un paquete por el dominio MPLS',
    'Qué campos tiene la etiqueta y dónde se ubica',
    'Qué son una FEC y LDP, y cómo se maneja el TTL'
  ],
  stats: [{ k: 'lbl', l: 'Etiqueta del paquete' }, { k: 'op', l: 'Operación' }, { k: 'busq', l: 'Búsqueda' }],
  legend: [['req', 'datagrama IP'], ['key', 'paquete etiquetado'], ['ctl', 'plano de control (rutas, LDP)']],
  scenes: {
    ip: {
      kind: 'topo',
      nodes: [
        { id: 'H1', t: 'pc', x: 60, y: 170, l: 'Origen' },
        { id: 'R1', t: 'router', x: 220, y: 170, l: 'Router 1' }, { id: 'R2', t: 'router', x: 400, y: 170, l: 'Router 2' }, { id: 'R3', t: 'router', x: 580, y: 170, l: 'Router 3' },
        { id: 'H2', t: 'server', x: 740, y: 170, l: 'Destino', sub: '20.1.1.1' }
      ],
      links: [{ a: 'H1', b: 'R1' }, { a: 'R1', b: 'R2' }, { a: 'R2', b: 'R3' }, { a: 'R3', b: 'H2' }]
    },
    planos: {
      kind: 'topo',
      zones: [
        { id: 'zc', x: 150, y: 62, w: 500, h: 150, l: 'Plano de control', c: 'purple' },
        { id: 'zd', x: 150, y: 236, w: 500, h: 152, l: 'Plano de datos', c: 'green' }
      ],
      nodes: [
        { id: 'rp', t: 'box', x: 283, y: 144, w: 214, h: 54, l: 'Protocolos de ruteo', sub: 'hablan con los routers vecinos', c: 'white' },
        { id: 'ldp', t: 'box', x: 517, y: 144, w: 214, h: 54, l: 'LDP', sub: 'intercambia las etiquetas', c: 'white' },
        { id: 'fip', t: 'box', x: 283, y: 318, w: 214, h: 54, l: 'Conmutación IP', sub: 'la entrada que mejor se ajusta', c: 'yellow' },
        { id: 'fl', t: 'box', x: 517, y: 318, w: 214, h: 54, l: 'Conmutación por etiqueta', sub: 'coincidencia exacta', c: 'green' },
        { id: 'vl', t: 'txt', x: 76, y: 118, l: 'routers\nvecinos', c: 'gray' }, { id: 'vr', t: 'txt', x: 724, y: 118, l: 'routers\nvecinos', c: 'gray' },
        { id: 'pi', t: 'txt', x: 76, y: 292, l: 'paquetes\nque entran', c: 'gray' }, { id: 'po', t: 'txt', x: 724, y: 292, l: 'paquetes\nque salen', c: 'gray' }
      ],
      links: [{ a: 'rp', b: 'fip', arrow: 1, l: 'tabla de ruteo' }, { a: 'ldp', b: 'fl', arrow: 1, l: 'tabla de etiquetas' }]
    },
    dom: {
      kind: 'topo',
      zones: [{ id: 'zm', x: 140, y: 96, w: 520, h: 160, l: 'Dominio MPLS: la red del proveedor', c: 'green' }],
      nodes: [
        { id: 'H1', t: 'pc', x: 60, y: 180, l: 'Usuario' },
        { id: 'E1', t: 'router', x: 210, y: 180, l: 'Edge LSR', c: 'orange' }, { id: 'L', t: 'router', x: 400, y: 180, l: 'LSR', c: 'green' }, { id: 'E2', t: 'router', x: 590, y: 180, l: 'Edge LSR', c: 'orange' },
        { id: 'H2', t: 'pc', x: 740, y: 180, l: 'Usuario', sub: '20.1.1.1' }
      ],
      links: [{ a: 'H1', b: 'E1', ly: 28 }, { a: 'E1', b: 'L', ly: 28, thick: 1 }, { a: 'L', b: 'E2', ly: 28, thick: 1 }, { a: 'E2', b: 'H2', ly: 28 }]
    },
    etq: {
      kind: 'fields', title: 'Antes y después del router de borde', rh: 44,
      rows: [
        [{ id: 'b2', l: 'Cabecera de capa 2', s: 'lo que ingresa', w: 8, c: 'gray' }, { id: 'b3', l: 'Cabecera IP', s: 'capa 3', w: 8, c: 'blue' }, { id: 'bp', l: 'Datos', w: 17, c: 'white' }],
        [{ id: 'l2', l: 'Cabecera de capa 2', s: 'la de la interfaz de salida', w: 8, c: 'gray' }, { id: 'lab', l: 'Etiqueta', s: '4 bytes', w: 5, c: 'yellow' }, { id: 'l3', l: 'Cabecera IP', s: 'capa 3', w: 8, c: 'blue' }, { id: 'pay', l: 'Datos', w: 12, c: 'white' }]
      ],
      zoom: {
        from: 'lab', title: 'Etiqueta MPLS: 32 bits', x: 90, w: 620,
        rows: [[{ id: 'lbl', l: 'Label', s: '20 bits', w: 20, c: 'yellow' }, { id: 'exp', l: 'Exp', s: '3 bits', w: 3.4, c: 'purple' }, { id: 'bos', l: 'S', s: '1 bit', w: 2.4, c: 'red' }, { id: 'ttl', l: 'TTL', s: '8 bits', w: 8, c: 'green' }]]
      }
    }
  },
  steps: [
    {
      s: 'Ruteo IP', k: 'problema', t: 'El costo de rutear salto a salto',
      b: '<p>En una red IP los routers intercambian información con los protocolos de ruteo y arman su <b>tabla de ruteo</b>. Cuando llega un datagrama, el router lee la <b>IP destino</b>, la busca en la tabla y con eso toma la decisión de conmutación.</p><p>La tabla es tan grande como la red: un router de Internet tiene, aproximadamente, <b>900 mil entradas</b>, y tiene que comparar la dirección destino con ellas para ver cuál <b>se ajusta mejor</b>.</p><p>Y esa búsqueda se repite en <b>cada salto</b> que da el paquete, es decir, en cada router al que llega.</p>',
      key: 'El trabajo caro no se hace una vez: se hace completo en todos los routers del camino.',
      scene: 'ip', tags: { R1: 'busca en la tabla', R2: 'busca otra vez', R3: 'y otra vez' },
      pk: [{ p: ['H1', 'R1'], l: 'a 20.1.1.1', d: 1.1 }, { p: ['R1', 'R2'], l: 'a 20.1.1.1', d: 1.1 }, { p: ['R2', 'R3'], l: 'a 20.1.1.1', d: 1.1 }, { p: ['R3', 'H2'], l: 'a 20.1.1.1', d: 1.1 }],
      tbl: { x: 70, y: 262, w: 300, title: 'Tabla de ruteo · ≈ 900 mil entradas', cols: ['Red destino', 'Sale hacia'], rows: [['…', '…'], ['20.0.0.0/8', 'el próximo router'], ['…', '…']], hi: 1 },
      notes: [{ x: 420, y: 272, w: 320, c: 'yellow', text: 'No alcanza con encontrar <b>una</b> entrada que coincida: hay que encontrar la que <b>mejor se ajusta</b> a la dirección destino.' }],
      st: { lbl: '—', op: 'ruteo IP en cada salto', busq: 'la que mejor se ajusta' }
    },
    {
      s: 'Etiquetas', k: 'idea', t: 'MPLS: decidir con una etiqueta',
      b: '<p><b>MPLS</b> (Multiprotocol Label Switching) es un mecanismo de <b>conmutación basado en etiquetas</b>, estándar en las WAN. No es una tecnología de capa de enlace.</p><p>Al paquete se le agrega una <b>etiqueta</b> que identifica la red destino y oculta la cabecera IP: el router decide mirando solo la etiqueta. Como es de <b>longitud fija</b> y se busca una <b>coincidencia exacta</b>, es mucho más eficiente.</p><p>Beneficios:</p><ul><li>VPN y calidad de servicio (QoS).</li><li>Ruteo de IP unicast y multicast.</li><li>Reduce la tarea de conmutación en el core de la red.</li><li>Puede transportar otros protocolos, no solo IP.</li></ul>',
      key: 'Con IP hay que buscar la entrada que mejor se ajusta; con MPLS se va directo a la coincidencia exacta.',
      scene: 'ip', hi: ['R2'], tags: { R1: 'pone la etiqueta', R2: 'mira solo la etiqueta', R3: 'quita la etiqueta' },
      pk: [{ p: ['H1', 'R1'], l: 'IP', d: 1.1 }, { p: ['R1', 'R2'], l: 'etiqueta | IP', c: 'key', d: 1.1 }, { p: ['R2', 'R3'], l: 'etiqueta | IP', c: 'key', d: 1.1 }, { p: ['R3', 'H2'], l: 'IP', d: 1.1 }],
      tbl: { x: 160, y: 266, w: 480, cols: ['', 'Ruteo IP', 'MPLS'], rows: [['Qué se busca', 'la IP destino', 'la etiqueta, de longitud fija'], ['Coincidencia', 'la que mejor se ajusta', 'exacta: una entrada completa'], ['En el core', 'búsqueda en cada salto', 'solo se cambian etiquetas']], hi: 1 },
      st: { lbl: 'longitud fija', op: 'conmutación por etiquetas', busq: 'coincidencia exacta' }
    },
    {
      s: 'Planos', k: 'contexto', t: 'Plano de control y plano de datos',
      b: '<p>Dentro de un router hay dos planos:</p><ul><li><b>Plano de control</b>: el administrativo. En él corren los <b>protocolos de ruteo</b> (una aplicación que se comunica con la misma aplicación en otro router) y contiene toda la información que después se usa para conmutar.</li><li><b>Plano de datos</b> (o de usuario): donde ocurre la <b>conmutación de paquetes</b>, a partir de esa información.</li></ul><p>Con IP, el plano de datos compara la IP destino con la tabla de ruteo. Con MPLS, toma la decisión con la <b>etiqueta</b>: una entrada completa y de longitud fija.</p>',
      key: 'El plano de control arma las tablas; el plano de datos las usa paquete por paquete.',
      fig: ['image172.png', 'image173.png'], scene: 'planos',
      pk: [
        { p: [[50, 152], [172, 152]], l: 'rutas', c: 'ctl', t: 0, d: 1.4 }, { p: [[750, 152], [628, 152]], l: 'etiquetas', c: 'ctl', t: 0, d: 1.4 },
        { p: [[50, 326], [172, 326]], l: 'IP', c: 'req', t: 1.6, d: 1.4 }, { p: [[628, 326], [750, 326]], l: 'etiqueta | IP', c: 'key', t: 3, d: 1.4 }
      ]
    },
    {
      s: 'LSR', k: 'contexto', t: 'LSR y Edge LSR',
      b: '<p>El <b>dominio MPLS</b> es la red del proveedor. El usuario está de un lado y del otro, y no tiene nada que ver con MPLS: envía un paquete a un router y la red lo entrega en el otro extremo.</p><ul><li><b>LSR</b> (Label Switching Router): routers que implementan MPLS. Pueden conmutar por etiquetas, no solo por IP, y eso es mucho más rápido que conmutar datagramas IP.</li><li><b>Edge LSR</b>: los de borde. Hablan IP con el usuario y <b>etiquetan</b> los datagramas para que el LSR los reciba. El Edge LSR del otro lado <b>saca la etiqueta</b> y entrega el paquete.</li></ul>',
      key: 'Los Edge LSR cargan con el procesamiento; los LSR del core solo intercambian etiquetas.',
      fig: 'image174.png', scene: 'dom', tags: { E1: 'pone la etiqueta', L: 'solo conmuta etiquetas', E2: 'quita la etiqueta' },
      pk: [{ p: ['H1', 'E1'], l: 'IP', d: 1.1 }, { p: ['E1', 'L'], l: 'etiqueta | IP', c: 'key', d: 1.2 }, { p: ['L', 'E2'], l: 'etiqueta | IP', c: 'key', d: 1.2 }, { p: ['E2', 'H2'], l: 'IP', d: 1.1 }],
      notes: [{ x: 170, y: 286, w: 460, c: 'yellow', text: 'Fuera del dominio el paquete es un datagrama IP común. La etiqueta solo existe <b>dentro</b> de la red del proveedor.' }],
      st: { lbl: 'solo dentro del dominio', op: 'poner · cambiar · quitar', busq: 'coincidencia exacta' }
    },
    {
      s: 'Ingreso', k: 'ejemplo', t: 'Ejemplo: el Edge LSR pone la etiqueta 43',
      b: '<p>Al Edge LSR le llega un datagrama con IP destino <b>20.1.1.1</b>.</p><p>El router mira su <b>tabla de ruteo</b>, busca la red destino 20 y encuentra una entrada que dice que a todo lo que va dirigido a esa red le corresponde la <b>etiqueta 43</b>.</p><p>Le <b>inserta la etiqueta</b> y lo pasa al LSR.</p><p>Es la única vez, dentro del dominio, que se hace la búsqueda por IP.</p>',
      key: 'Ruteo por IP una sola vez, en el borde: de ahí en más decide la etiqueta.',
      fig: 'image175.png', scene: 'dom', hi: ['E1'], tags: { E1: 'red 20 → etiqueta 43' }, ll: { 'E1-L': 'L = 43' },
      pk: [{ p: ['H1', 'E1'], l: 'a 20.1.1.1', d: 1.5 }, { p: ['E1', 'L'], l: '43 | 20.1.1.1', c: 'key', d: 1.7, stay: 1 }],
      tbl: { x: 96, y: 278, w: 240, title: 'Edge LSR · tabla de ruteo', cols: ['Red destino', 'Etiqueta'], rows: [['20.0.0.0/8', '43']], hi: 0 },
      st: { lbl: '43', op: 'insertar la etiqueta', busq: 'tabla de ruteo IP' }
    },
    {
      s: 'Cambio', k: 'ejemplo', t: 'Ejemplo: 43 → 31, y afuera sin etiqueta',
      b: '<p>El <b>LSR</b> no mira la IP. Busca la etiqueta en su tabla y ve que lo que ingresa con la <b>43</b> sale con la <b>31</b>: cambia una por otra y reenvía.</p><p>El paquete llega a otro router, que detecta que va a <b>salir de la red</b> MPLS: <b>saca la etiqueta</b>, mira su tabla de ruteo IP y conmuta como un router común.</p><p>Los routers de borde tienen la sobrecarga de procesamiento; los LSR solo intercambian etiquetas.</p>',
      key: 'La etiqueta cambia en cada tramo: 43 en uno, 31 en el siguiente.',
      fig: ['image175.png', 'image178.png'], scene: 'dom', hi: ['L', 'E2'], tags: { L: 'cambia 43 por 31', E2: 'quita la 31 y rutea' }, ll: { 'E1-L': 'L = 43', 'L-E2': 'L = 31' },
      pk: [{ p: ['E1', 'L'], l: '43 | 20.1.1.1', c: 'key', d: 1.5 }, { p: ['L', 'E2'], l: '31 | 20.1.1.1', c: 'key', d: 1.5 }, { p: ['E2', 'H2'], l: 'a 20.1.1.1', d: 1.5, stay: 1 }],
      tbl: [
        { x: 60, y: 278, w: 200, title: 'Edge LSR de ingreso', cols: ['Red destino', 'Etiqueta'], rows: [['20.0.0.0/8', '43']] },
        { x: 300, y: 278, w: 200, title: 'LSR', cols: ['Entra con', 'Sale con'], rows: [['43', '31']], hi: 0 },
        { x: 530, y: 278, w: 230, title: 'Edge LSR de salida', cols: ['Entra con', 'Acción'], rows: [['31', 'quitar y rutear por IP']], hi: 0 }
      ],
      st: { lbl: '31 → sin etiqueta', op: 'intercambiar y quitar', busq: 'coincidencia exacta' }
    },
    {
      s: 'Etiqueta', k: 'detalle', t: 'La etiqueta: 4 bytes entre la capa 2 y la capa 3',
      b: '<p>La etiqueta es un identificador de <b>4 bytes</b> que define el destino y el servicio de un paquete.</p><p>Al router de borde le ingresa un datagrama IP encapsulado en una trama de capa 2. Se fija a qué <b>FEC</b> pertenece en función de la IP destino, y lo que sale es el mismo datagrama, encapsulado en el formato de capa 2 que corresponde a la interfaz de salida, pero con una etiqueta.</p><p>La etiqueta se ubica <b>entre la cabecera de capa 2 y la de capa 3</b>: por ejemplo, entre la cabecera Ethernet y la cabecera IP.</p>',
      key: 'Por estar entre la capa 2 y la capa 3, MPLS no es una tecnología de capa de enlace.',
      fig: ['image176.png', 'image177.png'], scene: 'etq', zoom: 1, hi: ['lab', 'lbl', 'exp', 'bos', 'ttl', 'l2', 'l3'],
      det: '<b>Label</b> (20 bits): el valor que se busca en la tabla. <b>Experimental</b> (3 bits). <b>S</b> (1 bit): indicador de última etiqueta, porque se pueden anidar etiquetas, por ejemplo en una VPN. <b>TTL</b> (8 bits): tiempo de vida.',
      st: { lbl: '4 bytes · Label de 20 bits', op: '—' }
    },
    {
      s: 'FEC y LDP', k: 'mecanismo', t: 'FEC, significado local y LDP',
      b: '<p>Una <b>FEC</b> (Forwarding Equivalent Class) es un grupo de paquetes tratados de la misma manera y sobre un mismo camino. Conmutar en MPLS es asignar cada paquete a una FEC y determinar el próximo salto de cada FEC.</p><p>Un destino con un tipo de servicio es una FEC y recibe una etiqueta; otro tipo de servicio al mismo destino es otra FEC, con otra etiqueta. Así cada paquete se procesa según su urgencia o servicio.</p><p>La etiqueta tiene <b>significado local</b>: cada LSR mapea una etiqueta a una FEC y le cuenta esa asociación a sus vecinos con <b>LDP</b>, un protocolo del plano de control parecido a RIP. Así aparecen las entradas en los routers de borde.</p>',
      key: 'Es el LSR quien determina qué etiqueta corresponde a cada red; LDP se encarga de avisarlo.',
      fig: 'image179.png', scene: 'dom', hi: ['L'], tags: { L: 'red 20: mi etiqueta es 43', E2: 'red 20: la mía es 31' }, ll: { 'E1-L': 'L = 43', 'L-E2': 'L = 31' },
      pk: [{ p: ['E2', 'L'], l: 'LDP: red 20 = 31', c: 'ctl', d: 1.6 }, { p: ['L', 'E1'], l: 'LDP: red 20 = 43', c: 'ctl', d: 1.6 }, { p: ['E1', 'L', 'E2'], l: 'datos', c: 'key', d: 2.2 }],
      tbl: { x: 170, y: 278, w: 460, title: 'En el Edge LSR: una etiqueta por FEC', cols: ['FEC (destino + tipo de servicio)', 'Etiqueta'], rows: [['red 20.0.0.0/8', '43'], ['red 20.0.0.0/8, otro tipo de servicio', 'otra etiqueta']], hi: 0 },
      st: { lbl: 'una por FEC', op: 'LDP reparte las etiquetas', busq: 'coincidencia exacta' }
    },
    {
      s: 'TTL', k: 'detalle', t: 'Qué pasa con el TTL',
      b: '<p>Los LSR solo leen la etiqueta: la cabecera IP está oculta. Por eso solo decrementan el <b>TTL de la etiqueta</b>; el TTL de la cabecera de red lo tocan los routers de borde.</p><ul><li><b>Al ingreso</b>, el Edge LSR decrementa el TTL y lo <b>copia de la cabecera IP a la etiqueta</b>.</li><li>Cada <b>LSR</b> decrementa el de la etiqueta (si hay varias anidadas, solo el de la última).</li><li><b>Al egreso</b>, el Edge LSR decrementa y <b>copia el TTL de la etiqueta a la cabecera IP</b>.</li></ul><p>Sin este mecanismo, toda la red MPLS se vería como un solo gran salto.</p>',
      key: 'El TTL es uno solo: viaja en la etiqueta mientras dura el dominio y vuelve a IP al salir.',
      fig: ['image180.png', 'image181.png'], scene: 'dom', tags: { E1: '−1 y copia a etiqueta', L: '−1 solo en etiqueta', E2: '−1 y copia a IP' },
      pk: [{ p: ['H1', 'E1'], l: 'TTL IP 5', d: 1.2 }, { p: ['E1', 'L'], l: 'IP 4 · etiq. 4', c: 'key', d: 1.3 }, { p: ['L', 'E2'], l: 'IP 4 · etiq. 3', c: 'key', d: 1.3 }, { p: ['E2', 'H2'], l: 'TTL IP 2', d: 1.2 }],
      tbl: { x: 215, y: 274, w: 370, title: 'El TTL a lo largo del camino', cols: ['Tramo', 'TTL en IP', 'TTL en etiqueta'], rows: [['llega al Edge LSR', '5', '—'], ['Edge LSR → LSR', '4', '4'], ['LSR → Edge LSR', '4', '3'], ['sale del dominio', '2', '—']] },
      st: { lbl: 'lleva su propio TTL', op: 'copiar y decrementar el TTL', busq: '—' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'MPLS en una mirada',
      b: '<ul><li>El ruteo IP busca en <b>cada salto</b> la entrada que mejor se ajusta, en tablas de unas 900 mil entradas.</li><li><b>MPLS</b> conmuta por <b>etiquetas</b> de longitud fija, con coincidencia exacta.</li><li>El <b>Edge LSR</b> pone y quita la etiqueta; el <b>LSR</b> solo la intercambia (43 → 31).</li><li>La etiqueta (4 bytes: Label, Exp, S, TTL) va entre la capa 2 y la capa 3, identifica una <b>FEC</b> y tiene significado local; <b>LDP</b> la reparte.</li><li>El <b>TTL</b> se copia de IP a la etiqueta al entrar y de vuelta al salir.</li></ul><p>Con esto cerramos las redes WAN. Todo lo que vimos transporta datos, pero no los protege. En la próxima unidad, <b>Seguridad</b>, empezamos por la <b>criptografía</b>.</p>',
      scene: 'dom', ll: { 'E1-L': 'L = 43', 'L-E2': 'L = 31' }, tags: { E1: 'pone 43', L: '43 → 31', E2: 'quita 31' },
      pk: [{ p: ['H1', 'E1'], l: 'a 20.1.1.1', d: 1.1 }, { p: ['E1', 'L'], l: '43 | 20.1.1.1', c: 'key', d: 1.2 }, { p: ['L', 'E2'], l: '31 | 20.1.1.1', c: 'key', d: 1.2 }, { p: ['E2', 'H2'], l: 'a 20.1.1.1', d: 1.1 }],
      notes: [{ x: 170, y: 286, w: 460, c: 'yellow', text: 'Una sola búsqueda por IP en el borde; dentro del dominio, coincidencia exacta de una etiqueta de longitud fija.' }],
      st: { lbl: '43 → 31', op: 'poner · cambiar · quitar', busq: 'coincidencia exacta' }
    }
  ],
  quiz: [
    { q: '¿Por qué conmutar por etiquetas es más eficiente que rutear por IP?', o: ['Porque la etiqueta viaja cifrada', 'Porque la etiqueta es de longitud fija y se busca una coincidencia exacta', 'Porque los routers ya no necesitan tablas', 'Porque el paquete evita pasar por los routers del core'], a: 1, why: 'Con IP hay que encontrar, entre todas las entradas, la que mejor se ajusta; con MPLS se busca una entrada completa de longitud fija.' },
    { q: 'El Edge LSR tiene "red 20 → etiqueta 43" y el LSR siguiente tiene "43 → 31". ¿Con qué etiqueta sale del LSR un datagrama dirigido a 20.1.1.1?', o: ['43', '31', '20', 'Sin etiqueta'], a: 1, why: 'El Edge inserta la 43 y el LSR la intercambia por la 31; recién el último router quita la etiqueta y rutea por IP.' },
    { q: '¿Dónde se ubica la etiqueta MPLS?', o: ['Dentro de la cabecera IP, en el campo de opciones', 'Después de los datos, antes del FCS', 'Entre la cabecera de capa 2 y la cabecera de capa 3', 'Reemplaza a la cabecera de capa 2'], a: 2, why: 'La etiqueta de 4 bytes se inserta entre la cabecera de capa 2 (por ejemplo Ethernet) y la cabecera IP.' },
    { q: 'Un datagrama llega al Edge LSR de ingreso con TTL = 5 y atraviesa un LSR antes del Edge LSR de salida. ¿Con qué TTL en la cabecera IP sale del dominio?', o: ['5', '4', '3', '2'], a: 3, why: 'El ingreso decrementa a 4 y lo copia a la etiqueta; el LSR baja la etiqueta a 3; el egreso decrementa a 2 y lo copia de vuelta a IP.' }
  ],
  cheat: [
    ['Ruteo IP', 'En cada salto se busca la entrada que mejor se ajusta a la IP destino (unas 900 mil entradas en un router de Internet).'],
    ['MPLS', 'Conmutación por etiquetas de longitud fija y coincidencia exacta. No es de capa 2. Beneficios: VPN, QoS, menos trabajo en el core, otros protocolos además de IP.'],
    ['Planos', '<b>Control</b>: protocolos de ruteo y LDP. <b>Datos</b>: conmutación de paquetes, por IP o por etiqueta.'],
    ['LSR / Edge LSR', '<b>Edge LSR</b>: habla IP con el usuario, pone y quita la etiqueta. <b>LSR</b>: solo intercambia etiquetas.'],
    ['Ejemplo', 'A 20.1.1.1: el Edge pone la 43 → el LSR cambia 43 por 31 → el último quita la etiqueta y rutea por IP.'],
    ['Etiqueta', '4 bytes entre la capa 2 y la capa 3: Label (20 bits), Experimental (3), última etiqueta (1), TTL (8).'],
    ['FEC y LDP', '<b>FEC</b>: paquetes tratados igual y por el mismo camino (destino + servicio). La etiqueta tiene significado local; <b>LDP</b> la intercambia entre LSR.'],
    ['TTL', 'Se copia de IP a la etiqueta al ingresar, los LSR decrementan el de la etiqueta y se copia de vuelta a IP al salir.']
  ]
});

COURSE.add({
  id: 'stp',
  title: 'Loops y Spanning Tree',
  desc: 'Qué pasa cuando hay dos caminos entre los mismos segmentos, por qué una sola trama puede tumbar la red y cómo los switches se ponen de acuerdo para bloquear un puerto.',
  min: 11, level: 'Intermedio',
  learn: [
    'Por qué un camino redundante entre bridges genera un loop de capa de enlace',
    'Qué es un BPDU y cómo se arma el Bridge ID (prioridad + MAC)',
    'Cómo se elige el ROOT y qué es el root port de cada switch',
    'Qué puerto se bloquea y qué pasa cuando se cae un enlace',
    'Los estados de un puerto: blocking, listening, learning y forwarding'
  ],
  stats: [{ k: 'loop', l: 'Loop' }, { k: 'root', l: 'ROOT' }, { k: 'blk', l: 'Puertos bloqueados' }],
  legend: [['req', 'trama de datos'], ['bad', 'copia que da vueltas'], ['ctl', 'BPDU']],
  scenes: {
    loop: {
      kind: 'topo',
      nodes: [
        { id: 'SUP', t: 'bus', x: 30, y: 144, w: 550, l: 'segmento superior' }, { id: 'INF', t: 'bus', x: 30, y: 306, w: 550, l: 'segmento inferior' },
        { id: 'P', t: 'pc', x: 185, y: 76, l: 'P' }, { id: 'Y', t: 'pc', x: 520, y: 76, l: 'Y' },
        { id: 'X', t: 'pc', x: 185, y: 372, l: 'X' }, { id: 'Q', t: 'pc', x: 520, y: 372, l: 'Q' },
        { id: 'BA', t: 'bridge', x: 295, y: 214, l: 'Bridge A' }, { id: 'BB', t: 'bridge', x: 435, y: 214, l: 'Bridge B' }
      ],
      links: [
        { a: 'P', b: 'SUP' }, { a: 'Y', b: 'SUP' }, { a: 'X', b: 'INF' }, { a: 'Q', b: 'INF' },
        { a: 'BA', b: 'SUP' }, { a: 'BA', b: 'INF' }, { a: 'BB', b: 'SUP' }, { a: 'BB', b: 'INF' }
      ]
    },
    tri: {
      kind: 'topo',
      nodes: [
        { id: 'S1', t: 'switch', x: 200, y: 115, l: 'Switch 1', sub: 'ID 20 · …1C' }, { id: 'S2', t: 'switch', x: 600, y: 115, l: 'Switch 2', sub: 'ID 20 · …1A' },
        { id: 'S3', t: 'switch', x: 400, y: 315, l: 'Switch 3', sub: 'ID 10 · …1F' },
        { id: 'PA', t: 'pc', x: 70, y: 115, l: 'A' }, { id: 'PB', t: 'pc', x: 730, y: 115, l: 'B' }
      ],
      links: [
        { a: 'S1', b: 'S2', ly: -12 }, { a: 'S1', b: 'S3', lx: -50, ly: 6 }, { a: 'S2', b: 'S3', lx: 50, ly: 6 },
        { a: 'PA', b: 'S1' }, { a: 'PB', b: 'S2' }
      ]
    },
    est: {
      kind: 'topo',
      nodes: [
        { id: 'tt', t: 'txt', x: 400, y: 85, l: 'Puerto de un switch al que se le conecta algo nuevo', big: 1 },
        { id: 'BLK', t: 'state', x: 110, y: 150, l: 'BLOCKING', c: 'red' }, { id: 'LIS', t: 'state', x: 305, y: 150, l: 'LISTENING', c: 'yellow' },
        { id: 'LRN', t: 'state', x: 500, y: 150, l: 'LEARNING', c: 'blue' }, { id: 'FWD', t: 'state', x: 695, y: 150, l: 'FORWARDING', c: 'green' }
      ],
      links: [{ a: 'BLK', b: 'LIS', arrow: 1 }, { a: 'LIS', b: 'LRN', arrow: 1 }, { a: 'LRN', b: 'FWD', arrow: 1 }]
    }
  },
  steps: [
    {
      s: 'Redundancia', k: 'problema', t: 'Un segundo bridge para no depender de uno',
      b: '<p>Un bridge une dos segmentos, pero funciona con electricidad: si se apaga, los segmentos quedan desconectados. Es un <b>punto de fallo</b>.</p><p>La idea natural es agregar un <b>segundo bridge</b> en paralelo. Miremos qué pasa cuando X (abajo) le envía una trama a Y (arriba):</p><ul><li>La trama llega a <b>los dos</b> bridges.</li><li>Los dos hacen <b>forwarding</b>, porque el destino está en el otro segmento.</li><li>Como el segmento superior es compartido, A y B <b>compiten</b> por el acceso al medio.</li></ul>',
      key: 'Los bridges son transparentes: ninguno sabe que el otro existe.',
      fig: 'image19.png', scene: 'loop', hi: ['X'], tags: { X: 'envía a Y', BA: 'la reenvío', BB: 'la reenvío' },
      fx: [{ k: 'sig', bus: 'INF', from: 'X', c: 'req', t: 0, d: 1.2 }],
      pk: [{ p: ['X', 'INF', 'BA'], l: 'para Y', t: .1, d: 1.5, stay: 1 }, { p: ['X', 'INF', 'BB'], l: 'para Y', t: .1, d: 1.8, stay: 1 }],
      notes: [{ x: 598, y: 185, w: 185, c: 'yellow', text: 'Dos caminos entre los mismos segmentos: hay <b>redundancia</b>… y dos copias de la misma trama esperando para subir.' }],
      st: { loop: 'Posible: dos caminos', root: '—', blk: '0' }
    },
    {
      s: 'Tablas', k: 'problema', t: 'La copia entra por el lado equivocado',
      b: '<p>Uno de los bridges gana el medio. Supongamos que es A: transmite la trama en el segmento superior y <b>Y la recibe</b>.</p><p>Pero el bridge B también la recibe, <b>por el otro lado</b>. Ve una trama de X que llega desde arriba y saca conclusiones falsas:</p><ul><li>Piensa que <b>X está en el segmento superior</b>.</li><li>Va a buscar a <b>Y en el segmento inferior</b>.</li></ul><p>Su tabla quedó con información que no es real.</p>',
      key: 'Con dos caminos, la misma dirección de origen aparece por los dos lados del bridge.',
      fig: 'image20.png', scene: 'loop', hi: ['BB'], tags: { BA: 'gana y transmite', BB: '¿X está arriba?', Y: 'recibida' },
      fx: [{ k: 'sig', bus: 'SUP', from: 'BA', c: 'req', t: 0, d: 1.2 }],
      pk: [{ p: ['BA', 'SUP', 'Y'], l: 'para Y', t: .1, d: 1.6, stay: 1 }, { p: ['BA', 'SUP', 'BB'], l: 'para Y', c: 'bad', t: .1, d: 1.6, stay: 1 }],
      tbl: { x: 598, y: 170, w: 185, title: 'Tabla del Bridge B', cols: ['MAC', 'Segmento'], rows: [['X', 'superior'], ['Y', 'inferior']], hi: [0, 1] },
      notes: [{ x: 598, y: 262, w: 185, c: 'red', text: 'Las dos entradas están <b>al revés</b>: X está abajo e Y arriba.' }],
      st: { loop: 'Tablas corruptas' }
    },
    {
      s: 'Loop', k: 'problema', t: 'Loop infinito de capa de enlace',
      b: '<p>B todavía tenía su copia lista para transmitir, y ahora además recibió la misma trama por arriba. La transmite hacia abajo, y al bridge A le pasa lo mismo: la recibe del lado contrario y se confunde igual.</p><p>Esto se repite: uno gana y transmite, el otro vuelve a pasar el mismo mensaje… un <b>loop infinito</b> de capa de enlace.</p><p>La red queda <b>anulada por completo</b>: los bridges la bloquean enviando la misma trama de un lado al otro.</p>',
      key: 'En capa de enlace nada frena a una trama que da vueltas: el loop no se corta solo.',
      fig: 'image21.png', scene: 'loop', hi: ['BA', 'BB'], tags: { BA: 'la vuelve a pasar', BB: 'la vuelve a pasar' },
      pk: [{ p: ['BB', 'INF', 'BA', 'SUP', 'BB', 'INF', 'BA', 'SUP', 'BB'], l: 'para Y', c: 'bad', d: 5.4 }],
      notes: [{ x: 598, y: 185, w: 185, c: 'red', text: 'La <b>misma trama</b> pasa de un segmento al otro sin fin. Las demás estaciones ya no pueden usar la red.' }],
      st: { loop: 'Infinito · red caída' }
    },
    {
      s: 'Idea STP', k: 'idea', t: 'Spanning Tree: conocerse y cerrar un puerto',
      b: '<p>El problema de fondo es que los bridges <b>no se conocen</b> entre sí. Para eso se creó el protocolo <b>Spanning Tree</b> (STP): detecta los loops y los rompe.</p><p>Los bridges se descubren y acuerdan <b>quién opera</b> y quién <b>cierra una interfaz</b>, para no recibir el mismo mensaje por los dos lados.</p><p>La redundancia no se pierde: si el bridge que opera se apaga, el otro lo detecta y <b>toma su rol</b>.</p>',
      key: 'STP no elimina el camino redundante: lo deja en reserva, bloqueado.',
      fig: 'image22.png', scene: 'loop', hi: ['BA'], x: ['BB-INF'], tags: { BA: 'opera', BB: 'puerto cerrado' },
      fx: [{ k: 'sig', bus: 'INF', from: 'X', c: 'req', t: 0, d: 1.1 }, { k: 'sig', bus: 'SUP', from: 'BA', c: 'req', t: 1.5, d: 1.1 }],
      pk: [{ p: ['X', 'INF', 'BA'], l: 'para Y', t: .1, d: 1.4 }, { p: ['BA', 'SUP', 'Y'], l: 'para Y', t: 1.6, d: 1.5, stay: 1 }],
      notes: [{ x: 598, y: 185, w: 185, c: 'green', text: 'Queda <b>un solo camino</b> activo entre los segmentos. La trama llega una vez y el loop desaparece.' }],
      st: { loop: 'Roto', blk: '1' }
    },
    {
      s: 'BPDU', k: 'mecanismo', t: 'Con switches pasa lo mismo: los BPDU',
      b: '<p>En topología estrella también hay loops: alcanza con que tres switches queden conectados <b>en triángulo</b>.</p><p>Para detectarlo, cada switch envía <b>continuamente</b>, por <b>todos sus puertos</b>, un <b>BPDU</b> (Bridge PDU): un mensaje que indica qué switch es. Se envía <b>cada 2 segundos</b>.</p><p>Con los BPDU cada switch sabe que tiene otros switches conectados. Una vez que se conocen, corren el algoritmo de Spanning Tree para decidir cómo romper el loop.</p>',
      key: 'Los loops nacen del desconocimiento; los BPDU son la forma de presentarse.',
      fig: 'image23.png', scene: 'tri',
      fx: [{ k: 'wave', at: 'S1', c: 'ctl', t: 0, r: 90 }, { k: 'wave', at: 'S2', c: 'ctl', t: 0, r: 90 }, { k: 'wave', at: 'S3', c: 'ctl', t: 0, r: 90 }],
      pk: [{ p: ['S1', 'S2'], l: 'BPDU', c: 'ctl', t: .2, d: 1.4 }, { p: ['S2', 'S3'], l: 'BPDU', c: 'ctl', t: .2, d: 1.4 }, { p: ['S3', 'S1'], l: 'BPDU', c: 'ctl', t: .2, d: 1.4 },
        { p: ['S2', 'S1'], l: 'BPDU', c: 'ctl', t: 1.9, d: 1.4 }, { p: ['S3', 'S2'], l: 'BPDU', c: 'ctl', t: 1.9, d: 1.4 }, { p: ['S1', 'S3'], l: 'BPDU', c: 'ctl', t: 1.9, d: 1.4 }],
      notes: [{ x: 25, y: 262, w: 235, c: 'purple', text: 'Cada <b>2 segundos</b>, cada switch manda un BPDU por cada puerto con su <b>Bridge ID</b>.' }],
      st: { loop: 'Posible: triángulo', root: 'Sin elegir', blk: '0' }
    },
    {
      s: 'ROOT', k: 'mecanismo', t: 'Elegir la raíz: el menor Bridge ID',
      b: '<p>La idea es transformar el loop en un <b>árbol</b>: se elige un switch como <b>raíz</b> (ROOT) y el resto son ramas que no cierran el ciclo.</p><p>Todo switch tiene un <b>Bridge ID</b>, compuesto por una <b>prioridad</b> y su <b>MAC address</b>. El de <b>menor prioridad</b> es el ROOT; si todos tienen la misma prioridad, se desempata con la MAC.</p><p>En el BPDU viaja el Bridge ID propio y también el <b>Root ID</b>, para que todos concuerden en quién es el ROOT. Todos participan de la elección.</p>',
      key: 'El ROOT no bloquea ninguno de sus puertos.',
      scene: 'tri', hi: ['S3'], tags: { S3: 'ROOT' },
      pk: [{ p: ['S3', 'S1'], l: 'root = SW 3', c: 'ctl', t: 0, d: 1.5 }, { p: ['S3', 'S2'], l: 'root = SW 3', c: 'ctl', t: 0, d: 1.5 }, { p: ['S1', 'S2'], l: 'root = SW 3', c: 'ctl', t: 1.7, d: 1.4 }],
      tbl: { x: 565, y: 255, w: 215, title: 'Bridge ID', cols: ['Switch', 'Prioridad', 'MAC'], rows: [['1', '20', '…1C'], ['2', '20', '…1A'], ['3', '10', '…1F']], hi: [2] },
      notes: [{ x: 25, y: 262, w: 235, c: 'yellow', text: 'El switch 3 tiene la <b>prioridad más baja</b> (10): es el ROOT aunque su MAC sea la mayor.' }],
      st: { root: 'Switch 3 (prioridad 10)' }
    },
    {
      s: 'Bloqueo', k: 'mecanismo', t: 'Root port y puerto bloqueado',
      b: '<p>Cada switch que no es ROOT identifica el puerto que lo lleva a la raíz por el <b>camino más corto</b> (directo o a través de otros switches): es su <b>ROOT PORT</b>.</p><p>Los switches 1 y 2 además están conectados entre sí. Deben <b>desempatar</b>: uno deja el puerto activo y el otro lo <b>bloquea</b>. Acá pierde el switch 1, el de Bridge ID más alto.</p><p>Por el puerto cerrado no se envían ni se reciben mensajes: el enlace queda <b>solo para BPDU</b>. Para ir de 1 a 2 hay que pasar por el ROOT.</p>',
      key: 'Árbol = un único camino entre dos switches cualesquiera, siempre pasando por la raíz.',
      fig: 'image24.png', scene: 'tri', hi: ['S1-S3', 'S2-S3'], x: ['S1-S2'], tags: { S3: 'ROOT', S1: 'bloquea su puerto' },
      ll: { 'S1-S3': 'root port', 'S2-S3': 'root port', 'S1-S2': 'solo BPDU' },
      pk: [{ p: ['PA', 'S1', 'S3', 'S2', 'PB'], l: 'trama', t: 0, d: 3.2, stay: 1 }, { p: ['S2', 'S1'], l: 'BPDU', c: 'ctl', t: 3.4, d: 1.3 }],
      tbl: { x: 565, y: 255, w: 215, title: 'Bridge ID', cols: ['Switch', 'Prioridad', 'MAC'], rows: [['1', '20', '…1C'], ['2', '20', '…1A'], ['3', '10', '…1F']], hi: [0] },
      notes: [{ x: 25, y: 262, w: 235, c: 'yellow', text: 'La trama de A a B baja hasta el ROOT y vuelve a subir. El enlace 1–2 existe, pero no lleva datos.' }],
      st: { loop: 'Roto', blk: '1 (en el switch 1)' }
    },
    {
      s: 'Recálculo', k: 'ejemplo', t: 'Se cae un enlace: STP recalcula',
      b: '<p>Spanning Tree descubre loops y <b>desactiva vínculos redundantes</b>, pero no se olvida de ellos.</p><p>Si un link se desconecta, el algoritmo <b>se recalcula</b> para ver qué pasó y <b>reactiva</b> el vínculo que tenía bloqueado.</p><p>En el ejemplo se cae el enlace entre el switch 2 y el ROOT. El switch 1 desbloquea su puerto, y el 2 llega a la raíz <b>pasando por el 1</b>: el camino más corto que le queda.</p>',
      key: 'El enlace bloqueado es el repuesto: entra en servicio cuando falla el principal.',
      scene: 'tri', hi: ['S1-S2'], x: ['S2-S3'], tags: { S3: 'ROOT', S1: 'desbloquea el puerto' },
      ll: { 'S1-S3': 'root port', 'S2-S3': 'enlace caído', 'S1-S2': 'root port del switch 2' },
      pk: [{ p: ['PB', 'S2', 'S1', 'PA'], l: 'trama', t: 0, d: 2.6, stay: 1 }, { p: ['S3', 'S1', 'S2'], l: 'BPDU', c: 'ctl', t: 2.8, d: 2 }],
      notes: [{ x: 25, y: 262, w: 235, c: 'green', text: 'Sin loop no hay nada que bloquear: los dos enlaces que quedan forman el árbol.' }],
      st: { loop: 'No hay (un enlace caído)', blk: '0' }
    },
    {
      s: 'Estados', k: 'detalle', t: 'Conectar algo nuevo: los estados de un puerto',
      b: '<p>Todos los switches corren STP en todos sus puertos. Cuando se conecta un dispositivo nuevo, el switch tiene que <b>ver qué se conectó antes de activar el puerto</b>, para no armar otro loop. El puerto pasa por una serie de estados:</p><ul><li><b>BLOCKING</b>: no deja pasar tráfico.</li><li><b>LISTENING</b>: escucha qué hay del otro lado.</li><li><b>LEARNING</b>: aprende la MAC del dispositivo.</li><li><b>FORWARDING</b>: pasa el tráfico, o bloquea si se produciría un bucle.</li></ul>',
      key: 'Primero escuchar, después reenviar: un puerto nuevo nunca arranca pasando tráfico.',
      scene: 'est',
      pk: [{ p: ['BLK', 'LIS', 'LRN', 'FWD'], c: 'ctl', d: 4, stay: 1 }],
      notes: [
        { x: 25, y: 195, w: 170, c: 'red', text: 'No deja pasar tráfico.' },
        { x: 220, y: 195, w: 170, c: 'yellow', text: 'Escucha para ver si se conectó un switch, una estación de trabajo, etc.' },
        { x: 415, y: 195, w: 170, c: 'blue', text: 'Aprende cuál es la MAC address del dispositivo conectado.' },
        { x: 610, y: 195, w: 170, c: 'green', text: 'Pasa el tráfico, o bloquea el puerto si se produce un bucle.' },
        { x: 150, y: 325, w: 500, c: 'purple', text: 'Si al escuchar encuentra un <b>BPDU</b>, hay un <b>nuevo switch</b> en la red. Si su prioridad es menor, pasa a ser el ROOT, el anterior deja de serlo y <b>cambia la topología</b>.' }
      ]
    },
    {
      s: 'Resumen', k: 'resumen', t: 'Spanning Tree en una mirada',
      b: '<ul><li>Dos caminos entre los mismos segmentos = tablas corruptas y <b>loop infinito</b> de capa de enlace.</li><li>Los switches se presentan con <b>BPDU</b> cada 2 segundos.</li><li><b>Bridge ID</b> = prioridad + MAC. El menor es el <b>ROOT</b>.</li><li>Cada switch elige su <b>root port</b>; los enlaces que sobran se <b>bloquean</b> (solo pasa BPDU).</li><li>Si cae un enlace, se recalcula y se reactiva el bloqueado.</li><li>Puerto nuevo: blocking → listening → learning → forwarding.</li></ul><p>Hasta acá todas las estaciones de un switch comparten el mismo dominio de broadcast. En la próxima lección lo partimos en varios con <b>VLANs</b>.</p>',
      scene: 'tri', hi: ['S3'], x: ['S1-S2'], tags: { S3: 'ROOT' },
      ll: { 'S1-S3': 'root port', 'S2-S3': 'root port', 'S1-S2': 'bloqueado' },
      fx: [{ k: 'wave', at: 'S3', c: 'ctl', t: 0, r: 80 }],
      pk: [{ p: ['S3', 'S1'], l: 'BPDU', c: 'ctl', t: .1, d: 1.3 }, { p: ['S3', 'S2'], l: 'BPDU', c: 'ctl', t: .1, d: 1.3 }, { p: ['PB', 'S2', 'S3', 'S1', 'PA'], l: 'trama', t: 1.6, d: 3 }],
      st: { loop: 'Roto por STP', root: 'Switch 3', blk: '1' }
    }
  ],
  quiz: [
    { q: 'Dos bridges unen en paralelo los mismos dos segmentos y no corren STP. ¿Qué pasa con una trama que tiene que cruzar?', o: ['Llega duplicada una sola vez y nada más', 'Los bridges la descartan por seguridad', 'Queda dando vueltas entre los dos bridges en un loop infinito', 'Solo cruza por el bridge de menor MAC'], a: 2, why: 'Cada bridge recibe la copia del otro por el lado contrario, corrompe su tabla y la vuelve a reenviar: un loop de capa de enlace que anula la red.' },
    { q: '¿Qué switch se elige como ROOT?', o: ['El que tiene más puertos', 'El de menor prioridad en su Bridge ID (y, si empatan, se desempata con la MAC)', 'El primero que se encendió', 'El que tiene más estaciones conectadas'], a: 1, why: 'El Bridge ID se compone de prioridad + MAC address; la menor prioridad gana y la MAC desempata.' },
    { q: '¿Qué puede circular por un puerto que Spanning Tree dejó bloqueado?', o: ['Nada, queda eléctricamente apagado', 'Solo tramas de broadcast', 'Solo BPDU', 'Todo el tráfico, pero con menor prioridad'], a: 2, why: 'El enlace queda inhabilitado para enviar y recibir mensajes, pero los BPDU siguen pasando: así se detecta si hay que reactivarlo.' },
    { q: '¿Por qué un puerto recién conectado no pasa directo a FORWARDING?', o: ['Porque primero debe escuchar qué se conectó, para no crear un loop', 'Porque el cable necesita cargarse', 'Porque espera que el ROOT le asigne una MAC', 'Porque debe negociar la velocidad a 10 Mbps'], a: 0, why: 'El puerto arranca en BLOCKING, escucha (LISTENING) por si aparece un BPDU de otro switch, aprende la MAC (LEARNING) y recién después reenvía.' }
  ],
  cheat: [
    ['Bridging loop', 'Dos caminos entre los mismos segmentos: la trama se reenvía sin fin y las tablas de MAC quedan mal. Anula la red.'],
    ['Spanning Tree (STP)', 'Descubre loops y desactiva vínculos redundantes, formando un árbol con raíz en el ROOT. Si cae un link, recalcula.'],
    ['BPDU', 'Bridge PDU: mensaje que cada switch envía por todos sus puertos <b>cada 2 segundos</b>, con su Bridge ID y el Root ID.'],
    ['Bridge ID', '<b>Prioridad + MAC address</b>. El de menor prioridad es el ROOT; a igual prioridad desempata la MAC.'],
    ['Root port', 'En cada switch que no es ROOT, el puerto que lleva a la raíz por el camino más corto.'],
    ['Puerto bloqueado', 'Entre dos switches no-root conectados, uno cierra su puerto: no pasan tramas, solo BPDU.'],
    ['Estados del puerto', 'BLOCKING → LISTENING → LEARNING → FORWARDING.']
  ]
});

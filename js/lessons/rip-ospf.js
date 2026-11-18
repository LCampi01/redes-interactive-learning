COURSE.add({
  id: 'rip-ospf',
  title: 'RIP y OSPF',
  desc: 'Dos protocolos interiores que arman solos la tabla de ruteo: RIP cuenta saltos y repite su tabla cada 30 segundos; OSPF dibuja el grafo de la red, avisa solo los cambios y se organiza en áreas.',
  min: 12, level: 'Intermedio',
  learn: [
    'Cómo propaga RIP las redes que conoce y por qué su métrica llega solo hasta 15 saltos',
    'Qué hacen los timers de RIP cuando un vecino deja de enviar actualizaciones',
    'Por qué OSPF (link state, Dijkstra) elige mejores caminos y converge más rápido',
    'Para qué sirven las áreas y el área de backbone',
    'Qué es un sistema autónomo y la diferencia entre un IGP y un protocolo exterior como BGP4'
  ],
  stats: [{ k: 'proto', l: 'Protocolo' }, { k: 'tipo', l: 'Tipo' }, { k: 'met', l: 'Métrica' }, { k: 'sobre', l: 'Viaja sobre' }],
  legend: [['req', 'actualización / camino elegido'], ['data', 'camino alternativo'], ['ctl', 'request / aviso de cambio'], ['res', 'confirmación'], ['key', 'información sumarizada'], ['bad', 'se pierde / peor camino']],
  scenes: {
    rip: {
      kind: 'topo',
      nodes: [
        { id: 'NA', t: 'cloud', x: 70, y: 200, l: 'Red A' },
        { id: 'RA', t: 'router', x: 190, y: 200, l: 'RA' },
        { id: 'R1', t: 'router', x: 320, y: 200, l: 'R1' },
        { id: 'R2', t: 'router', x: 450, y: 200, l: 'R2' },
        { id: 'R3', t: 'router', x: 610, y: 110, l: 'R3' },
        { id: 'R4', t: 'router', x: 610, y: 300, l: 'R4' }
      ],
      links: [{ a: 'NA', b: 'RA' }, { a: 'RA', b: 'R1' }, { a: 'R1', b: 'R2' }, { a: 'R2', b: 'R3' }, { a: 'R2', b: 'R4' }, { a: 'R3', b: 'R4' }]
    },
    timers: {
      kind: 'seq',
      actors: [{ id: 'V', l: 'Vecino', t: 'router' }, { id: 'R', l: 'Router', t: 'router' }, { id: 'O', l: 'Otro vecino', t: 'router' }],
      msgs: [
        { f: 'V', to: 'R', l: 'update: la tabla de ruteo completa', c: 'req' },
        { f: 'V', to: 'R', l: 'unos 30 s después: otra vez la tabla completa', c: 'req' },
        { at: 'V', note: 'el vecino deja de responder', c: 'red' },
        { f: 'V', to: 'R', l: 'update que nunca llega', c: 'bad', lost: 1 },
        { at: 'R', note: '3 min sin updates (6 perdidos): métrica = infinito', c: 'yellow' },
        { f: 'R', to: 'O', l: 'aviso: esa ruta quedó inalcanzable', c: 'ctl' },
        { at: 'R', note: '2 min más: la ruta se borra de la tabla', c: 'red' }
      ]
    },
    grafo: {
      kind: 'topo',
      nodes: [
        { id: 'G1', t: 'router', x: 120, y: 215, l: 'R1' }, { id: 'G2', t: 'router', x: 400, y: 105, l: 'R2' },
        { id: 'G3', t: 'router', x: 400, y: 325, l: 'R3' }, { id: 'G4', t: 'router', x: 680, y: 215, l: 'R4' }
      ],
      links: [
        { a: 'G1', b: 'G4', l: '64 kbps', dash: 1, lx: -135 },
        { a: 'G1', b: 'G2', l: '100 Mbps', thick: 1, lx: -30 }, { a: 'G2', b: 'G4', l: '100 Mbps', thick: 1, lx: 30 },
        { a: 'G1', b: 'G3', l: '10 Mbps', lx: 36 }, { a: 'G3', b: 'G4', l: '10 Mbps', lx: -36 }
      ]
    },
    areas: {
      kind: 'topo',
      zones: [
        { id: 'bb', x: 200, y: 58, w: 400, h: 122, l: 'Área de backbone', c: 'yellow' },
        { id: 'a1', x: 30, y: 262, w: 230, h: 138, l: 'Área 1', c: 'green' },
        { id: 'a2', x: 285, y: 262, w: 230, h: 138, l: 'Área 2', c: 'blue' },
        { id: 'a3', x: 540, y: 262, w: 230, h: 138, l: 'Área 3', c: 'purple' }
      ],
      nodes: [
        { id: 'B1', t: 'router', x: 280, y: 126 }, { id: 'B2', t: 'router', x: 400, y: 126 }, { id: 'B3', t: 'router', x: 520, y: 126 },
        { id: 'P1', t: 'router', x: 82, y: 340 }, { id: 'P2', t: 'router', x: 208, y: 340 },
        { id: 'Q1', t: 'router', x: 337, y: 340 }, { id: 'Q2', t: 'router', x: 463, y: 340 },
        { id: 'S1', t: 'router', x: 592, y: 340 }, { id: 'S2', t: 'router', x: 718, y: 340 }
      ],
      links: [
        { a: 'B1', b: 'B2' }, { a: 'B2', b: 'B3' }, { a: 'P1', b: 'P2' }, { a: 'Q1', b: 'Q2' }, { a: 'S1', b: 'S2' },
        { a: 'P2', b: 'B1' }, { a: 'Q2', b: 'B2' }, { a: 'S2', b: 'B3' }
      ]
    },
    sa: {
      kind: 'topo',
      zones: [
        { id: 'as1', x: 30, y: 70, w: 320, h: 310, l: 'Sistema autónomo 1 · IGP: OSPF', c: 'green' },
        { id: 'as2', x: 450, y: 70, w: 320, h: 310, l: 'Sistema autónomo 2 · IGP: RIP', c: 'blue' }
      ],
      nodes: [
        { id: 'X1', t: 'router', x: 100, y: 160 }, { id: 'X2', t: 'router', x: 100, y: 300 }, { id: 'XB', t: 'router', x: 270, y: 230, l: 'router de borde', c: 'purple' },
        { id: 'YB', t: 'router', x: 530, y: 230, l: 'router de borde', c: 'purple' }, { id: 'Y1', t: 'router', x: 700, y: 160 }, { id: 'Y2', t: 'router', x: 700, y: 300 }
      ],
      links: [
        { a: 'X1', b: 'X2' }, { a: 'X1', b: 'XB' }, { a: 'X2', b: 'XB' }, { a: 'YB', b: 'Y1' }, { a: 'YB', b: 'Y2' }, { a: 'Y1', b: 'Y2' },
        { a: 'XB', b: 'YB', l: 'BGP4', thick: 1, c: 'purple', ly: -6 }
      ]
    },
    vs: {
      kind: 'topo',
      nodes: [
        { id: 'rip', t: 'box', x: 250, y: 86, w: 230, h: 52, l: 'RIP', sub: 'el primero: simple', c: 'green' },
        { id: 'ospf', t: 'box', x: 550, y: 86, w: 230, h: 52, l: 'OSPF', sub: 'el recomendado: robusto y sólido', c: 'blue' }
      ],
      links: []
    }
  },
  steps: [
    {
      s: 'RIP', k: 'contexto', t: 'RIP: el primero y el más simple',
      b: '<p><b>RIP</b> fue el primer protocolo de ruteo en utilizarse. Es <b>interior</b> y <b>distance vector</b>: los routers se cuentan entre ellos las redes que conocen y a cuántos <b>saltos</b> están. Esa es su métrica (hop count, <b>máximo 15</b>): gana el camino con menos saltos. Viaja encapsulado en <b>UDP</b>.</p><ul><li><b>Versión 1</b> (RFC 1058): <b>classful</b>. Solo dice la red (la "red 10"), no sirve con subnetting.</li><li><b>Versión 2</b> (RFC 2453): <b>classless</b>. Informa cada red <b>junto con su máscara</b>.</li></ul>',
      key: 'RIP no conoce la topología: solo sabe a cuántos saltos queda cada red según sus vecinos.',
      scene: 'rip', hi: ['RA', 'R1'],
      tags: { RA: 'conozco la red A' },
      pk: [{ p: ['RA', 'R1'], l: 'update', d: 1.3 }, { p: ['R1', 'R2'], l: 'update', d: 1.3 }],
      tbl: { x: 40, y: 290, w: 360, title: 'Las dos versiones de RIP', cols: ['', 'v1 · RFC 1058', 'v2 · RFC 2453'], rows: [['Direcciones', 'classful (por clases)', 'classless'], ['Envía la máscara', 'no', 'sí'], ['Subredes', 'no las distingue', 'las informa']], hi: [] },
      st: { proto: 'RIP', tipo: 'Distance vector', met: 'Saltos (máx. 15)', sobre: 'UDP' }
    },
    {
      s: 'Saltos', k: 'ejemplo', t: 'Cómo se propaga una red: 1, 2, 3 saltos',
      b: '<p>RA anuncia la red A. <b>R1</b> lo escucha, anota "A a <b>1 salto</b>" y lo comunica por todas sus interfaces. <b>R2</b> recibe ese mensaje, anota "A a <b>2 saltos</b>" y repite lo mismo.</p><p>R3 y R4 quedan a la misma distancia: A a <b>3 saltos</b>.</p><p>Pero R3 también le anuncia la red a R4: por ese lado A queda a <b>4 saltos</b>. R4 elige el camino más corto y <b>guarda el otro</b> por las dudas.</p>',
      key: 'Cada router suma un salto a lo que le cuentan y se queda con la métrica menor.',
      fig: 'image77.png', scene: 'rip', hi: ['R4'], tags: { R1: 'A a 1 salto', R2: 'A a 2 saltos', R3: 'A a 3 saltos', R4: 'A a 3 saltos' },
      pk: [{ p: ['RA', 'R1'], l: 'A: 1', d: 1 }, { p: ['R1', 'R2'], l: 'A: 2', d: 1 }, { p: ['R2', 'R3'], l: 'A: 3', d: 1.1 }, { p: ['R2', 'R4'], l: 'A: 3', d: 1.1, par: 1 }, { p: ['R3', 'R4'], l: 'A: 4', c: 'data', d: 1.2 }],
      tbl: { x: 40, y: 290, w: 300, title: 'Lo que anota R4 sobre la red A', cols: ['Vía', 'Saltos', ''], rows: [['R2', '3', 'el más corto: lo usa'], ['R3', '4', 'alternativo: lo guarda']], hi: 0 }
    },
    {
      s: 'Timers', k: 'mecanismo', t: 'Timers: la confiabilidad son informes periódicos',
      b: '<p>Cada <b>30 segundos</b> (un valor aleatorio entre 25 y 35) el router envía su <b>tabla de ruteo completa</b> a los vecinos. Eso también sirve para saber si el vecino sigue ahí.</p><ul><li>Si una ruta no se actualiza en <b>3 minutos</b> (6 updates perdidos), su métrica pasa a <b>infinito</b>: es inalcanzable, el enlace se da por caído, y se informa a los vecinos.</li><li><b>2 minutos</b> después, un mecanismo de limpieza <b>borra</b> de la tabla las entradas con métrica infinito.</li></ul>',
      key: 'En RIP nadie avisa que se cayó: lo delata el silencio, y eso lleva minutos.',
      scene: 'timers', states: { V: 'cada 25 a 35 s', R: 'espera los updates' }
    },
    {
      s: 'Arranque', k: 'detalle', t: 'Inicialización, confiabilidad y seguridad',
      b: '<ul><li><b>Inicialización</b>: al arrancar envía por <b>broadcast</b> una request a todos los vecinos pidiendo sus tablas completas. No hace neighbor discovery ni recibe confirmación.</li><li><b>Confiabilidad</b>: se basa en la retransmisión periódica.</li><li><b>Subredes</b> (v2): incluye la información de subred y la informa en las actualizaciones.</li><li><b>Seguridad</b> (v2): password opcional de 16 bytes, en cleartext. Evita los <b>black-holes</b>: routers que informan todas las redes con métrica 0.</li></ul>',
      scene: 'rip', hi: ['R2'], tags: { R2: 'arranca' },
      fx: [{ k: 'wave', at: 'R2', c: 'ctl', t: 0, r: 120 }],
      pk: [{ p: ['R1', 'R2'], l: 'tabla', t: 1.1, d: 1.2 }, { p: ['R3', 'R2'], l: 'tabla', d: 1.2, par: 1 }, { p: ['R4', 'R2'], l: 'tabla', d: 1.2, par: 1 }],
      notes: [{ x: 40, y: 296, w: 330, c: 'yellow', text: 'Sin el password, cualquier router que anuncie todas las redes con <b>métrica 0</b> se vuelve el mejor camino para sus vecinos: el tráfico va hacia él y se pierde.' }]
    },
    {
      s: 'OSPF', k: 'idea', t: 'OSPF: conocer el mapa completo',
      b: '<p><b>OSPF</b> (RFC 2328) es el protocolo interior recomendado para TCP/IP: más robusto y sólido. Es <b>link state</b> y usa el algoritmo de <b>Dijkstra</b>.</p><p>En lugar de contar la tabla con sus métricas, arma internamente un <b>grafo de la topología</b>: puede ver, más allá de los vecinos conectados, cuál es el mejor de los caminos.</p><p>Considera más información que los saltos (por ejemplo el ancho de banda) y corre <b>directamente sobre IP</b>, no sobre UDP.</p>',
      key: 'El camino más corto en saltos no siempre es el mejor: OSPF puede elegir el de mayor ancho de banda.',
      scene: 'grafo', hi: ['G1-G2', 'G2-G4'], tags: { G1: 'origen', G4: 'destino' },
      pk: [{ p: ['G1', 'G4'], l: 'RIP: 1 salto', c: 'bad', d: 2 }, { p: ['G1', 'G2', 'G4'], l: 'OSPF', d: 2.2 }],
      notes: [{ x: 30, y: 318, w: 236, c: 'yellow', text: '<b>RIP</b> solo cuenta saltos: elige el enlace directo de 64 kbps. <b>OSPF</b> conoce todo el grafo y el estado de cada enlace: va por R2.' }],
      st: { proto: 'OSPF', tipo: 'Link state (Dijkstra)', met: 'Optimizada', sobre: 'IP directo' }
    },
    {
      s: 'Flooding', k: 'mecanismo', t: 'Por qué OSPF converge más rápido',
      b: '<p>Entre vecinos OSPF hay <b>adyacencia</b>. Cuando un router detecta que una adyacencia se perdió (el vecino ya no es alcanzable), dispara una <b>notificación de cambio de topología</b> que llega a todos los nodos.</p><ul><li><b>Flooding</b>: inunda la red con la notificación y recibe <b>confirmación</b> de que la recibieron.</li><li>Intercambia menos información que RIP: entre un cambio y otro solo viajan <b>keep-alives</b>, que verifican que el vecino adyacente sigue activo.</li></ul>',
      key: 'RIP repite todo cada 30 segundos; OSPF avisa solo cuando algo cambia, y lo hace enseguida.',
      scene: 'grafo', x: ['G2-G4'], hi: ['G2'], tags: { G2: 'adyacencia perdida' },
      pk: [{ p: ['G2', 'G1'], l: 'cambio', c: 'ctl', d: 1.1 }, { p: ['G1', 'G3'], l: 'cambio', c: 'ctl', d: 1.1 }, { p: ['G1', 'G4'], l: 'cambio', c: 'ctl', d: 1.3, par: 1 }, { p: ['G3', 'G1'], l: 'ok', c: 'res', d: 1.1 }, { p: ['G4', 'G1'], l: 'ok', c: 'res', d: 1.3, par: 1 }],
      notes: [{ x: 30, y: 318, w: 236, c: 'yellow', text: 'Cada router que recibe el aviso <b>recalcula su grafo</b>. No hay que esperar minutos de silencio como en RIP.' }]
    },
    {
      s: 'Áreas', k: 'idea', t: 'Jerarquía: áreas y área de backbone',
      b: '<p>OSPF es <b>jerárquico</b>: permite armar <b>áreas</b> conectadas a un <b>área de backbone</b>.</p><p>Como requiere más almacenamiento y cómputo que RIP, conviene tener áreas pequeñas:</p><ul><li>Los routers de una misma área intercambian información <b>detallada</b> de la topología.</li><li>Uno de ellos habla con el backbone e intercambia información <b>sumarizada</b>.</li></ul><p>El backbone consolida y distribuye. Así se escala mucho más allá de los 15 saltos de RIP.</p>',
      key: 'Detalle adentro del área, resumen hacia afuera: no todos tienen que hablar con todos.',
      fig: 'image78.png', scene: 'areas', hi: ['bb'],
      pk: [{ p: ['P1', 'P2'], l: 'detalle', d: 1 }, { p: ['P2', 'B1'], l: 'resumen', c: 'key', d: 1.2 }, { p: ['B1', 'B2'], c: 'key', d: .7 }, { p: ['B2', 'B3'], c: 'key', d: .7 }, { p: ['B2', 'Q2'], l: 'resumen', c: 'key', d: 1.2 }, { p: ['B3', 'S2'], l: 'resumen', c: 'key', d: 1.2, par: 1 }]
    },
    {
      s: 'IGP y BGP4', k: 'contexto', t: 'Sistemas autónomos: IGP adentro, BGP4 entre ellos',
      b: '<p>Un <b>IGP</b> (Interior Gateway Protocol) como RIP u OSPF corre dentro de un dominio de administración, de una empresa: un <b>sistema autónomo</b>. Ahí adentro se quiere que todos los routers conozcan toda la red.</p><p>Para conectar sistemas autónomos <b>entre sí</b> se usan protocolos <b>exteriores</b>, por ejemplo <b>BGP4</b>.</p><p>Al conectarme con la red de otro no quiero mostrarle toda mi topología, sino solo lo que quiero que vea. Así funciona el ruteo de Internet.</p>',
      key: 'Interior = toda la información dentro de mi organización. Exterior = solo lo que elijo publicar.',
      fig: 'image79.png', scene: 'sa', hi: ['XB', 'YB', 'XB-YB'],
      pk: [{ p: ['X1', 'XB'], l: 'IGP', d: 1.1 }, { p: ['Y1', 'YB'], l: 'IGP', d: 1.1, par: 1 }, { p: ['XB', 'YB'], l: 'BGP4', c: 'ctl', d: 1.5 }],
      st: { proto: 'BGP4', tipo: 'Exterior', met: '—', sobre: 'entre sistemas autónomos' }
    },
    {
      s: 'RIP vs OSPF', k: 'comparación', t: 'RIP y OSPF, lado a lado',
      b: '<p>Los dos son <b>interiores</b> y <b>dinámicos</b>, pero resuelven el problema de formas muy distintas.</p><p>RIP es simple y gasta pocos recursos, a cambio de converger lento y no pasar de 15 saltos.</p><p>OSPF necesita más memoria y cómputo, pero elige mejor, converge rápido y escala con áreas. Además permite <b>balancear carga</b> entre dos rutas de igual métrica, soporta <b>VLSM y CIDR</b> y puede autenticar con contraseña simple o con <b>hashing</b> de los mensajes (MD5, preshared key) para garantizar la integridad.</p>',
      scene: 'vs',
      tbl: { x: 112, y: 132, w: 576, cols: ['', 'RIP', 'OSPF'], rows: [['Algoritmo', 'distance vector', 'link state (Dijkstra)'], ['Métrica', 'saltos, máximo 15', 'optimizada (ancho de banda…)'], ['Viaja sobre', 'UDP', 'IP directamente'], ['Qué intercambia', 'la tabla completa cada 30 s', 'cambios de topología + keep-alives'], ['Convergencia', 'lenta: depende de timers', 'rápida: flooding con confirmación'], ['Diseño', 'plano', 'jerárquico: áreas + backbone'], ['Caminos', 'uno solo', 'balanceo entre rutas de igual métrica'], ['Subredes', 'solo la versión 2', 'VLSM y CIDR'], ['Seguridad', 'v2: password en cleartext', 'cleartext o hash MD5']] },
      notes: [{ x: 112, y: 358, w: 520, c: 'yellow', text: 'OSPF es un proceso más complejo que RIP: pide más <b>almacenamiento y cómputo</b> en cada router. Por eso conviene mantener las áreas pequeñas.' }],
      st: { proto: 'RIP y OSPF', tipo: 'Interiores (IGP)', met: 'saltos / optimizada', sobre: 'UDP / IP' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'RIP y OSPF en una mirada',
      b: '<ul><li><b>RIP</b>: distance vector, métrica en saltos (máx. 15), sobre UDP. v2 agrega máscara y password.</li><li>Tabla completa cada 30 s; 3 min sin noticias → infinito; 2 min más → se borra.</li><li><b>OSPF</b>: link state con Dijkstra, sobre IP. Flooding de cambios con confirmación y keep-alives.</li><li><b>Áreas</b> con detalle adentro y resumen hacia el backbone.</li><li><b>IGP</b> dentro del sistema autónomo; <b>BGP4</b> entre ellos.</li></ul><p>¿Y cuando un router no puede entregar un datagrama? Alguien tiene que avisarle al origen. En la próxima lección: <b>ICMP</b>.</p>',
      scene: 'grafo', hide: ['G1-G4'], ll: { 'G1-G3': '100 Mbps', 'G3-G4': '100 Mbps' }, hi: ['G1-G2', 'G2-G4', 'G1-G3', 'G3-G4'], tags: { G1: 'dos rutas iguales' },
      pk: [{ p: ['G1', 'G2', 'G4'], l: 'OSPF', d: 2.2 }, { p: ['G1', 'G3', 'G4'], l: 'OSPF', d: 2.2, par: 1 }],
      notes: [{ x: 290, y: 190, w: 220, c: 'yellow', text: 'Con dos rutas de <b>igual métrica</b>, OSPF reparte el tráfico entre ambas: <b>balanceo de carga</b>.' }]
    }
  ],
  quiz: [
    { q: '¿Qué métrica usa RIP y cuál es su valor máximo?', o: ['El ancho de banda, hasta 100 Mbps', 'La cantidad de saltos, con un máximo de 15', 'El delay, hasta 30 segundos', 'La confiabilidad del enlace, de 0 a 255'], a: 1, why: 'RIP es distance vector: mide la distancia en saltos (hop count) y admite como máximo 15.' },
    { q: 'En RIP, ¿qué ocurre si una ruta no recibe actualizaciones durante 3 minutos?', o: ['Se borra de la tabla en ese instante', 'Se envía un broadcast pidiendo la tabla completa', 'Su métrica se pone en infinito y se informa a los vecinos; 2 minutos después se borra', 'Se cambia automáticamente a OSPF'], a: 2, why: 'A los 3 minutos (6 updates perdidos) la ruta se marca inalcanzable con métrica infinito; el borrado demora 2 minutos más.' },
    { q: '¿Por qué OSPF converge más rápido que RIP?', o: ['Porque usa UDP en lugar de IP', 'Porque envía su tabla completa cada 5 segundos', 'Porque ante un cambio inunda la red con la notificación y recibe confirmación, sin esperar timers', 'Porque solo admite 15 routers'], a: 2, why: 'Cuando se pierde una adyacencia, OSPF hace flooding del cambio de topología a todos los nodos; RIP depende de sus informes periódicos.' },
    { q: 'En OSPF, ¿qué información intercambia un área con el área de backbone?', o: ['La topología detallada de todos sus routers', 'Información sumarizada', 'Ninguna: las áreas están aisladas', 'Solo keep-alives'], a: 1, why: 'Dentro del área la información es detallada; hacia el backbone se envía sumarizada, y el backbone la consolida y distribuye.' }
  ],
  cheat: [
    ['RIP', 'Interior, <b>distance vector</b>. Métrica = saltos (<b>máx. 15</b>). Sobre <b>UDP</b>. Elige el camino con menos saltos.'],
    ['RIP v1 / v2', 'v1 (RFC 1058) classful: no informa máscara. v2 (RFC 2453) classless: red + máscara, password opcional de 16 bytes.'],
    ['Timers de RIP', 'Update con la tabla completa cada 30 s (25 a 35). <b>3 min</b> sin noticias → métrica infinito. <b>2 min</b> más → se borra.'],
    ['OSPF', 'Interior, <b>link state</b>, algoritmo de <b>Dijkstra</b> sobre el grafo de la topología. Corre directo sobre <b>IP</b> (RFC 2328).'],
    ['Convergencia OSPF', 'Al perder una adyacencia hace <b>flooding</b> del cambio, con confirmación. Entre cambios solo keep-alives.'],
    ['Áreas', 'Información detallada dentro del área, sumarizada hacia el <b>área de backbone</b>, que consolida y distribuye.'],
    ['Extras de OSPF', 'Balanceo de carga entre rutas de igual métrica, VLSM y CIDR, autenticación cleartext o hash MD5.'],
    ['IGP y BGP4', 'Un IGP corre dentro de un <b>sistema autónomo</b>; para conectar sistemas autónomos se usa un protocolo exterior como BGP4.']
  ]
});

COURSE.add({
  id: 'ruteo',
  title: 'La tabla de ruteo',
  desc: 'Cómo decide cada equipo por dónde sacar un datagrama: qué guarda la tabla de ruteo, cómo se elige la entrada con la coincidencia más larga y cómo el paquete avanza salto a salto hasta su destino.',
  min: 11, level: 'Intermedio',
  learn: [
    'Las dos funciones de un router: determinar el mejor camino y conmutar el datagrama',
    'Qué guarda cada entrada de la tabla de ruteo y qué significa on-link',
    'Cómo se elige una entrada por longest match y para qué sirve la ruta 0.0.0.0',
    'Cómo viaja un datagrama salto a salto y cuándo termina el viaje',
    'Qué se le pide a un protocolo de ruteo y cómo se clasifican'
  ],
  stats: [{ k: 'dst', l: 'IP destino' }, { k: 'en', l: 'Quién decide' }, { k: 'ent', l: 'Entrada elegida' }, { k: 'sal', l: 'Se lo entrega a' }],
  legend: [['req', 'datagrama IP'], ['ctl', 'ARP request / aviso de cambio'], ['res', 'ARP reply']],
  scenes: {
    red: {
      kind: 'topo',
      zones: [
        { id: 'z1', x: 20, y: 62, w: 232, h: 302, l: 'LAN 192.168.0.0 /24', c: 'green' },
        { id: 'z2', x: 630, y: 62, w: 150, h: 168, l: '200.5.10.0 /24', c: 'blue' }
      ],
      nodes: [
        { id: 'A', t: 'pc', x: 70, y: 158, l: 'A', sub: '192.168.0.12' },
        { id: 'SW', t: 'switch', x: 190, y: 158 },
        { id: 'B', t: 'pc', x: 190, y: 288, l: 'B', sub: '192.168.0.20' },
        { id: 'R1', t: 'router', x: 330, y: 158, l: 'R1', sub: '192.168.0.1' },
        { id: 'R2', t: 'router', x: 500, y: 158, l: 'R2', sub: '10.0.0.2' },
        { id: 'S', t: 'server', x: 705, y: 158, l: 'S', sub: '200.5.10.8' }
      ],
      links: [{ a: 'A', b: 'SW' }, { a: 'SW', b: 'B' }, { a: 'SW', b: 'R1' }, { a: 'R1', b: 'R2', l: '10.0.0.0 /30', ly: 31 }, { a: 'R2', b: 'S' }]
    },
    entrada: {
      kind: 'fields', title: 'Una entrada de la tabla de ruteo', rh: 56,
      rows: [[
        { id: 'red', l: 'Red destino', s: 'a dónde quiero llegar', w: 1, c: 'green' },
        { id: 'mask', l: 'Máscara', s: 'cuántos bits comparar', w: 1, c: 'blue' },
        { id: 'gw', l: 'Gateway', s: 'próximo salto', w: 1, c: 'yellow' },
        { id: 'ifz', l: 'Interfaz', s: 'por dónde se sale', w: 1, c: 'purple' },
        { id: 'met', l: 'Métrica', s: 'menor = mejor', w: 1, c: 'orange' }
      ]]
    },
    lm: { kind: 'bits' },
    malla: {
      kind: 'topo',
      nodes: [
        { id: 'M1', t: 'router', x: 140, y: 215, l: 'R1' }, { id: 'M2', t: 'router', x: 400, y: 110, l: 'R2' },
        { id: 'M3', t: 'router', x: 400, y: 330, l: 'R3' }, { id: 'M4', t: 'router', x: 660, y: 215, l: 'R4' }
      ],
      links: [{ a: 'M1', b: 'M2' }, { a: 'M1', b: 'M3' }, { a: 'M2', b: 'M4' }, { a: 'M3', b: 'M4' }]
    },
    clas: {
      kind: 'topo',
      nodes: [
        { id: 't', t: 'txt', x: 400, y: 52, l: 'Cinco formas de clasificar un protocolo de ruteo', big: 1 },
        { id: 'c1', t: 'box', x: 96, y: 118, w: 140, h: 56, l: 'Estático\nDinámico', c: 'green' },
        { id: 'c2', t: 'box', x: 248, y: 118, w: 140, h: 56, l: 'Single-path\nMulti-path', c: 'blue' },
        { id: 'c3', t: 'box', x: 400, y: 118, w: 140, h: 56, l: 'Plano\nJerárquico', c: 'yellow' },
        { id: 'c4', t: 'box', x: 552, y: 118, w: 140, h: 56, l: 'Interior\nExterior', c: 'purple' },
        { id: 'c5', t: 'box', x: 704, y: 118, w: 140, h: 56, l: 'Distance vector\nLink state', c: 'orange' }
      ],
      links: []
    }
  },
  steps: [
    {
      s: 'El router', k: 'contexto', t: 'Las dos funciones de un router',
      b: '<p>El ruteo ocurre en la <b>capa 3</b>. Un router cumple dos funciones:</p><ul><li><b>Determinar el mejor camino</b> al destino. Para eso necesita información sobre la topología de la red.</li><li><b>Conmutar el datagrama</b>: lo recibe, analiza su tabla, elige una interfaz de salida, lo encapsula en un mensaje de capa 2 y lo envía.</li></ul><p>La decisión de encaminamiento se toma <b>en cada router</b>, uno tras otro, hasta llegar al final.</p>',
      key: 'Cada router resuelve solo el próximo paso; el camino completo se arma salto a salto.',
      scene: 'red', hi: ['R1', 'R2'], tags: { R1: '¿por dónde sale?', R2: '¿por dónde sale?' },
      pk: [{ p: ['A', 'SW', 'R1'], l: 'datagrama', d: 1.4 }, { p: ['R1', 'R2'], l: 'datagrama', d: 1.1 }, { p: ['R2', 'S'], l: 'datagrama', d: 1.2, stay: 1 }],
      notes: [
        { x: 282, y: 258, w: 232, c: 'yellow', text: '<b>1 · Determinar el mejor camino</b><br>Consulta su tabla de ruteo: ¿a quién le paso este datagrama?' },
        { x: 532, y: 258, w: 240, c: 'blue', text: '<b>2 · Conmutar el datagrama</b><br>Lo encapsula en una trama de capa 2 y lo saca por la interfaz elegida.' }
      ],
      st: { dst: '200.5.10.8', en: 'cada router', ent: '—', sal: '—' }
    },
    {
      s: 'La tabla', k: 'detalle', t: 'Qué guarda la tabla de ruteo',
      b: '<p>Los routers y <b>todos los dispositivos</b> (también una PC) tienen una <b>tabla de ruteo</b>: la estructura donde se concentra, a veces detallada y a veces sumarizada, la información de qué camino seguir.</p><p>Cada entrada contiene:</p><ul><li><b>Red destino</b> y <b>máscara</b>.</li><li><b>Gateway</b>: el próximo salto.</li><li><b>Interfaz</b> con la que se alcanza ese próximo salto.</li><li><b>Métrica</b>: un calificador. Si hay dos entradas posibles, gana la de <b>menor métrica</b>.</li></ul>',
      key: 'La tabla no describe el camino entero: dice a quién pasarle el datagrama y por qué interfaz.',
      fig: 'image75.png', scene: 'entrada',
      tbl: { x: 150, y: 246, w: 500, title: 'Tabla de ruteo de la PC A', cols: ['Red destino', 'Máscara', 'Gateway', 'Interfaz', 'Métrica'], rows: [['0.0.0.0', '0.0.0.0', '192.168.0.1', '192.168.0.12', '50'], ['127.0.0.0', '255.0.0.0', 'On-link', '127.0.0.1', '331'], ['192.168.0.0', '255.255.255.0', 'On-link', '192.168.0.12', '306'], ['192.168.0.12', '255.255.255.255', 'On-link', '192.168.0.12', '306']], hi: 2 },
      notes: [{ x: 150, y: 388, w: 500, c: 'yellow', text: 'Fila resaltada: para ir a la red <b>192.168.0.0</b> se sale por la interfaz <b>192.168.0.12</b>. La primera fila (0.0.0.0) es la ruta por defecto: la vemos en un momento.' }],
      st: { dst: '—', en: 'PC A', ent: '—', sal: '—' }
    },
    {
      s: 'On-link', k: 'mecanismo', t: 'On-link: el destino es un vecino',
      b: '<p><b>On-link</b> en la columna Gateway significa que el destino es un <b>vecino</b>: está en la misma red LAN, no hace falta ningún intermediario.</p><p>Si A quiere comunicarse con 192.168.0.20, la entrada 192.168.0.0 coincide. Entonces A ejecuta <b>ARP</b>, encuentra cuál es la estación y le entrega la trama directamente.</p><p>Esto es posible justamente porque es un vecino: ARP solo funciona dentro de la misma LAN.</p>',
      key: 'On-link = entrega directa: se resuelve con ARP, sin pasar por un router.',
      scene: 'red', hi: ['A', 'B'], dim: ['R1', 'R2', 'S', 'z2'], tags: { A: '¿quién es .20?', B: 'soy yo' },
      fx: [{ k: 'wave', at: 'A', c: 'ctl', t: 0, r: 130 }],
      pk: [{ p: ['B', 'SW', 'A'], l: 'ARP reply', c: 'res', t: 1.1, d: 1.4 }, { p: ['A', 'SW', 'B'], l: 'datagrama', d: 1.5, stay: 1 }],
      tbl: { x: 282, y: 250, w: 490, title: 'Tabla de ruteo de A', cols: ['Red destino', 'Máscara', 'Gateway', 'Interfaz', 'Métrica'], rows: [['0.0.0.0', '0.0.0.0', '192.168.0.1', '192.168.0.12', '50'], ['127.0.0.0', '255.0.0.0', 'On-link', '127.0.0.1', '331'], ['192.168.0.0', '255.255.255.0', 'On-link', '192.168.0.12', '306'], ['192.168.0.12', '255.255.255.255', 'On-link', '192.168.0.12', '306']], hi: 2 },
      st: { dst: '192.168.0.20', en: 'PC A', ent: '192.168.0.0 · On-link', sal: 'B, directo (ARP)' }
    },
    {
      s: 'Longest match', k: 'mecanismo', t: 'Longest match: gana la coincidencia más larga',
      b: '<p>Como cada entrada tiene máscara, la coincidencia con el destino es <b>parcial</b>: solo se comparan los bits que indica la máscara.</p><p>El módulo IP toma la IP destino y recorre la tabla <b>secuencialmente</b>, porque no hay una coincidencia exacta que buscar.</p><p>Si coinciden varias entradas (por ejemplo, el mismo prefijo con distinta máscara) se elige <b>siempre</b> la de <b>longest match</b>: la que tiene la mayor cantidad de bits coincidentes.</p>',
      key: 'Más bits coincidentes = información más específica sobre dónde está el destino.',
      scene: 'lm', title: 'Destino 200.5.10.8: ¿qué entrada coincide en más bits?', ip: '200.5.10.8', mask: 24, hiBits: [16, 23],
      lines: [{ l: 'Entrada 0.0.0.0 /0', v: 'siempre (0 bits)' }, { l: 'Entrada 200.5.0.0 /16', v: '16 bits iguales' }, { l: 'Entrada 200.5.10.0 /24', v: '24 bits: gana', hi: 1 }, { l: 'Entrada 200.5.20.0 /24', v: 'no coincide' }],
      st: { dst: '200.5.10.8', en: 'un router', ent: '200.5.10.0 /24', sal: '—' }
    },
    {
      s: 'Por defecto', k: 'idea', t: 'La ruta por defecto y el default gateway',
      b: '<p>La entrada <b>0.0.0.0</b> es la <b>ruta por defecto</b>: siempre da verdadera y es la peor coincidencia posible. Si el destino no coincide con ninguna otra entrada, coincide con ella: toma <b>todo lo desconocido</b>.</p><p>Su gateway es el <b>default gateway</b>: un vecino que permite salir de la red.</p><p>A quiere llegar a 200.5.10.8. No es un vecino, así que solo coincide 0.0.0.0 y el datagrama se le pasa a R1 (192.168.0.1).</p>',
      key: 'Cuando no sé a quién entregarle el datagrama, se lo paso al default gateway.',
      scene: 'red', hi: ['A', 'R1'], tags: { A: 'no es vecino', R1: 'default gateway' },
      pk: [{ p: ['A', 'SW', 'R1'], l: 'a 200.5.10.8', d: 1.8, stay: 1 }],
      tbl: { x: 282, y: 250, w: 490, title: 'Tabla de ruteo de A', cols: ['Red destino', 'Máscara', 'Gateway', 'Interfaz', 'Métrica'], rows: [['0.0.0.0', '0.0.0.0', '192.168.0.1', '192.168.0.12', '50'], ['127.0.0.0', '255.0.0.0', 'On-link', '127.0.0.1', '331'], ['192.168.0.0', '255.255.255.0', 'On-link', '192.168.0.12', '306'], ['192.168.0.12', '255.255.255.255', 'On-link', '192.168.0.12', '306']], hi: 0 },
      st: { dst: '200.5.10.8', en: 'PC A', ent: '0.0.0.0 (por defecto)', sal: 'R1 · 192.168.0.1' }
    },
    {
      s: 'Un salto', k: 'ejemplo', t: 'En el router empieza todo de nuevo',
      b: '<p>El datagrama llega a R1 y el proceso <b>comienza nuevamente</b>: lee la IP destino, recorre su tabla y elige por longest match.</p><p>Un router suele tener <b>múltiples interfaces</b>, así que la decisión es más compleja que en una PC.</p><p>Después <b>conmuta</b>: arma una trama nueva de capa 2 y saca el datagrama por la interfaz elegida hacia el próximo salto.</p><p>A ese ir pasando de router en router se le dice <b>salto</b> (hop).</p>',
      key: 'En cada salto se repite lo mismo: IP destino → tabla → interfaz de salida.',
      scene: 'red', hi: ['R1', 'R1-R2'], tags: { R1: 'longest match', R2: 'próximo salto' },
      pk: [{ p: ['R1', 'R2'], l: 'a 200.5.10.8', d: 1.6, stay: 1 }],
      tbl: { x: 282, y: 250, w: 440, title: 'Tabla de ruteo de R1', cols: ['Red destino', 'Máscara', 'Gateway', 'Interfaz'], rows: [['192.168.0.0', '255.255.255.0', 'On-link', '192.168.0.1'], ['10.0.0.0', '255.255.255.252', 'On-link', '10.0.0.1'], ['200.5.10.0', '255.255.255.0', '10.0.0.2', '10.0.0.1']], hi: 2 },
      st: { en: 'R1', ent: '200.5.10.0 /24', sal: 'R2 · 10.0.0.2' }
    },
    {
      s: 'El final', k: 'ejemplo', t: 'Cuándo termina el viaje',
      b: '<p>Esto se repite en cada router <b>hasta el final</b>, que ocurre en uno de tres casos:</p><ul><li>Un router determina que el destino es <b>un vecino</b>: lo entrega directamente (ARP mediante).</li><li><b>No se encontró un camino</b>: el datagrama no se puede entregar.</li><li>El paquete <b>cumplió su ciclo de vida</b> (el TTL llegó a 0) y se descarta.</li></ul><p>Acá R2 tiene la red 200.5.10.0 on-link: S es su vecino.</p>',
      key: 'El último router ya no busca un gateway: busca la MAC del destino.',
      scene: 'red', hi: ['R2', 'S'], tags: { R2: 'on-link: ARP', S: 'destino' },
      pk: [{ p: ['R2', 'S'], l: 'a 200.5.10.8', d: 1.6, stay: 1 }],
      tbl: [
        { x: 282, y: 234, w: 440, title: 'Tabla de ruteo de R2', cols: ['Red destino', 'Máscara', 'Gateway', 'Interfaz'], rows: [['10.0.0.0', '255.255.255.252', 'On-link', '10.0.0.2'], ['200.5.10.0', '255.255.255.0', 'On-link', '200.5.10.1'], ['192.168.0.0', '255.255.255.0', '10.0.0.1', '10.0.0.2']], hi: 1 },
        { x: 282, y: 344, w: 440, title: 'El viaje termina cuando…', rows: [['el destino es vecino de un router', 'entrega directa'], ['no se encontró un camino', 'no se entrega'], ['el TTL llegó a 0', 'se descarta']], hi: 0 }
      ],
      st: { en: 'R2', ent: '200.5.10.0 · On-link', sal: 'S, directo (ARP)' }
    },
    {
      s: 'Objetivos', k: 'idea', t: 'Qué se le pide a un protocolo de ruteo',
      b: '<p>Un protocolo de ruteo es una aplicación que corre en el router. Se busca que sea:</p><ul><li><b>Flexible</b>: se adapta rápido a los cambios de topología.</li><li><b>Óptimo</b>: capaz de elegir la mejor ruta.</li><li>De <b>rápida convergencia</b>.</li><li><b>Robusto</b>: opera ante eventuales fallas.</li><li><b>Simple</b>: no debe ocupar los recursos (ni los vínculos) del router.</li></ul><p>Si cae un enlace, los routers lo detectan y se cuentan el cambio: están <b>convergiendo</b>.</p>',
      key: 'El protocolo <b>convergió</b> cuando todos los routers tienen tablas de ruteo consistentes.',
      scene: 'malla', x: ['M2-M4'], hi: ['M2', 'M4'], tags: { M2: 'detecta la caída', M4: 'detecta la caída' },
      pk: [{ p: ['M2', 'M1'], l: 'cambio', c: 'ctl', d: 1.3 }, { p: ['M4', 'M3'], l: 'cambio', c: 'ctl', d: 1.3, par: 1 }, { p: ['M1', 'M3'], l: 'cambio', c: 'ctl', d: 1.3 }, { p: ['M3', 'M1'], l: 'cambio', c: 'ctl', d: 1.3, par: 1 }],
      notes: [{ x: 300, y: 188, w: 200, c: 'yellow', text: 'Mientras se avisan el cambio, <b>convergen</b>. Cuando todos acuerdan los caminos posibles, <b>convergió</b>.' }],
      st: { dst: '—', en: 'todos los routers', ent: '—', sal: '—' }
    },
    {
      s: 'Tipos', k: 'comparación', t: 'Cómo se clasifican los protocolos de ruteo',
      b: '<ul><li><b>Estático / dinámico</b>: rutas escritas a mano o aprendidas.</li><li><b>Single / multi-path</b>: un único camino, o varios con balanceo de carga.</li><li><b>Plano / jerárquico</b>: todos comparten todo (no escala), o áreas que dialogan con un área central.</li><li><b>Interior / exterior</b>: un IGP corre dentro de una organización; el exterior conecta organizaciones mostrando solo lo que se quiere.</li><li><b>Distance vector / link state</b>: cuenta saltos, o evalúa además ancho de banda, delay y confiabilidad.</li></ul>',
      key: 'El camino con menos saltos no siempre es el mejor: puede haber otro más largo con más ancho de banda.',
      fig: 'image76.png', scene: 'clas',
      tbl: { x: 105, y: 190, w: 590, title: 'Protocolos y sus características', cols: ['Protocolo', 'Rutas', 'Caminos', 'Diseño', 'Ámbito', 'Algoritmo'], rows: [['RIP', 'dinámico', 'single-path', 'plano', 'interior', 'distance vector'], ['IGRP', 'dinámico', 'multi-path', 'plano', 'interior', 'distance vector'], ['OSPF', 'dinámico', 'multi-path', 'jerárquico', 'interior', 'link state'], ['EIGRP', 'dinámico', 'multi-path', 'plano', 'interior', 'adv. distance vector']], hi: [0, 2] },
      notes: [{ x: 105, y: 340, w: 590, c: 'yellow', text: 'Todos los protocolos de la materia son <b>interiores</b> (IGP). En la próxima lección miramos los dos resaltados: <b>RIP</b> y <b>OSPF</b>.' }],
      st: { en: 'protocolo de ruteo' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'El ruteo en una mirada',
      b: '<ul><li>El router <b>determina el mejor camino</b> y <b>conmuta</b> el datagrama.</li><li>Tabla de ruteo: red destino, máscara, gateway, interfaz y métrica.</li><li><b>On-link</b>: el destino es vecino, se resuelve con ARP.</li><li>Gana el <b>longest match</b>; <b>0.0.0.0</b> toma lo desconocido y lo manda al default gateway.</li><li>Salto a salto hasta que el destino es vecino, no hay ruta o se agota el TTL.</li></ul><p>Las tablas pueden cargarse a mano, pero lo habitual es que las arme un protocolo. En la próxima lección: <b>RIP y OSPF</b>.</p>',
      scene: 'red', tags: { A: '0.0.0.0 → R1', R1: '/24 → R2', R2: 'on-link → S' },
      pk: [{ p: ['A', 'SW', 'R1', 'R2', 'S'], l: 'datagrama', d: 3.6, stay: 1 }],
      notes: [{ x: 300, y: 276, w: 440, c: 'yellow', text: 'Tres tablas, tres decisiones: <b>A</b> usa la ruta por defecto, <b>R1</b> encuentra una entrada más específica y <b>R2</b> tiene al destino como vecino.' }],
      st: { dst: '200.5.10.8', en: 'A, R1 y R2', ent: 'una por salto', sal: 'S' }
    }
  ],
  quiz: [
    { q: '¿Cuáles son las dos funciones que realiza un router?', o: ['Fragmentar y reensamblar datagramas', 'Determinar el mejor camino y conmutar el datagrama', 'Resolver nombres y asignar direcciones IP', 'Detectar colisiones y retransmitir tramas'], a: 1, why: 'El router determina el mejor camino consultando su tabla de ruteo y luego conmuta el datagrama: lo encapsula en capa 2 y lo saca por la interfaz elegida.' },
    { q: 'Un router tiene las entradas 0.0.0.0 /0, 200.5.0.0 /16 y 200.5.10.0 /24. Llega un datagrama para 200.5.10.8. ¿Cuál usa?', o: ['0.0.0.0 /0, porque siempre da verdadera', '200.5.0.0 /16, porque está antes en la tabla', '200.5.10.0 /24, porque es la coincidencia más larga', 'Ninguna: descarta el datagrama'], a: 2, why: 'Las tres coinciden, pero siempre se elige el longest match: la entrada con más bits coincidentes, en este caso la /24.' },
    { q: 'En la tabla de ruteo de una PC, ¿qué significa que el gateway de una entrada sea "On-link"?', o: ['Que el enlace está caído', 'Que el destino es un vecino de la misma LAN y se resuelve con ARP', 'Que hay que usar el default gateway', 'Que la ruta fue aprendida por un protocolo dinámico'], a: 1, why: 'On-link indica que el destino está en la misma red: no hace falta un intermediario, se ejecuta ARP y se entrega directamente.' },
    { q: '¿Cuándo se dice que un protocolo de ruteo convergió?', o: ['Cuando todos los routers tienen tablas de ruteo consistentes', 'Cuando un router detecta la caída de un enlace', 'Cuando se carga la ruta por defecto', 'Cuando el TTL de los datagramas llega a 0'], a: 0, why: 'Mientras los routers se cuentan los cambios están convergiendo; convergió cuando todos conocen la misma información de topología.' }
  ],
  cheat: [
    ['Funciones del router', '<b>Determinar el mejor camino</b> (tabla de ruteo) y <b>conmutar</b> el datagrama (encapsular en capa 2 y sacarlo por una interfaz).'],
    ['Tabla de ruteo', 'Red destino, máscara, gateway (próximo salto), interfaz y métrica. A igual destino gana la <b>menor métrica</b>.'],
    ['On-link', 'El destino es un vecino de la misma LAN: se resuelve con ARP y se entrega sin intermediarios.'],
    ['Longest match', 'Se recorre la tabla y se elige la entrada con más bits coincidentes con la IP destino.'],
    ['Ruta por defecto', '<b>0.0.0.0</b>: siempre coincide, es la peor coincidencia. Su gateway es el <b>default gateway</b>, el vecino que permite salir de la red.'],
    ['Fin del viaje', 'El destino es vecino de un router, no se encontró camino o el TTL llegó a 0.'],
    ['Convergencia', 'Todos los routers tienen tablas consistentes. Un buen protocolo es flexible, óptimo, de rápida convergencia, robusto y simple.'],
    ['Clasificación', 'Estático/dinámico · single/multi-path · plano/jerárquico · interior/exterior · distance vector/link state.']
  ]
});

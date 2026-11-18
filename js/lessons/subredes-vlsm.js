COURSE.add({
  id: 'subredes-vlsm',
  title: 'Subredes y VLSM',
  desc: 'Cómo partir un único bloque de direcciones en varias redes más chicas tomando bits del host, cómo calcular rangos, broadcast y máscara, y cómo repartir a medida con VLSM sin desperdiciar.',
  min: 13, level: 'Intermedio',
  learn: [
    'Por qué conviene partir un bloque en subredes en vez de pedir otro',
    'Cómo se toman bits del host para identificar la subred y cuántos hosts quedan',
    'Cómo calcular la dirección de subred, el rango de hosts, el broadcast y la máscara',
    'Qué es VLSM: subredes de distinto tamaño según lo que cada una necesita',
    'Por qué se reservan bloques contiguos y cuándo se pueden unificar'
  ],
  stats: [{ k: 'pref', l: 'Prefijo' }, { k: 'mask', l: 'Máscara' }, { k: 'sub', l: 'Subredes' }, { k: 'hosts', l: 'Hosts por subred' }],
  scenes: {
    red: {
      kind: 'topo',
      zones: [
        { id: 'zc', x: 40, y: 58, w: 285, h: 325, l: 'Casa central', c: 'green' },
        { id: 'zs1', x: 632, y: 58, w: 138, h: 160, l: 'Sucursal 1', c: 'yellow' },
        { id: 'zs2', x: 488, y: 232, w: 144, h: 158, l: 'Sucursal 2', c: 'blue' }
      ],
      nodes: [
        { id: 'H1', t: 'hub', x: 180, y: 150, l: 'Hub' },
        { id: 'A', t: 'pc', x: 110, y: 300, l: 'PC', sub: '.100' },
        { id: 'B', t: 'pc', x: 250, y: 300, l: 'PC', sub: '.101' },
        { id: 'R1', t: 'router', x: 400, y: 150, l: 'Router' },
        { id: 'R2', t: 'router', x: 550, y: 150, l: 'Router' },
        { id: 'C', t: 'pc', x: 700, y: 150, l: 'PC' },
        { id: 'R3', t: 'router', x: 400, y: 325, l: 'Router' },
        { id: 'D', t: 'pc', x: 560, y: 325, l: 'PC' }
      ],
      links: [{ a: 'H1', b: 'A' }, { a: 'H1', b: 'B' }, { a: 'H1', b: 'R1' }, { a: 'R1', b: 'R2', dash: 1 }, { a: 'R2', b: 'C' }, { a: 'R1', b: 'R3', dash: 1 }, { a: 'R3', b: 'D' }]
    },
    ip: { kind: 'bits' }
  },
  steps: [
    {
      s: 'Problema', k: 'problema', t: 'Un solo bloque y una sucursal nueva',
      b: '<p>Tenemos dos estaciones en un hub, un router y el segmento <b>200.1.10.0/24</b> que nos asignó la IANA: todas nuestras direcciones empiezan con el prefijo 200.1.10.</p><p>Abrimos una <b>sucursal</b> y queremos que sea una <b>red diferente</b>. Hay dos opciones:</p><ul><li>Pedirle a la IANA <b>otro segmento</b>: difícil, porque los segmentos son acotados.</li><li>Usar <b>subredes</b>: tomar el segmento que ya tenemos y fragmentarlo en redes más chicas.</li></ul>',
      key: 'Una subred es un pedazo del bloque original que funciona como una red aparte.',
      fig: 'image66.png', scene: 'red', show: ['zc', 'zs1', 'H1', 'A', 'B', 'R1', 'R2', 'C'], hi: ['zs1', 'C'], tags: { H1: '200.1.10.0/24', C: '¿qué red uso?' },
      st: { pref: '/24', mask: '255.255.255.0', sub: '1', hosts: '254' }
    },
    {
      s: 'Tomar bits', k: 'idea', t: 'Tomar bits del host para la subred',
      b: '<p>Con /24, los primeros tres octetos son de red y el último (8 bits) es de host.</p><p>La idea es <b>tomar bits de ese octeto</b> (bloquearlos) para identificar la <b>subred</b> y dejar el resto para los hosts. Con los <b>2 primeros bits</b> hay cuatro combinaciones: 00, 01, 10 y 11 → <b>4 subredes</b>.</p><p>El costo: cuantos más bits se toman, <b>menos hosts</b> entran en cada una. Quedan 6 bits: 2⁶ = 64 direcciones, menos la de red y la de broadcast = <b>62 hosts</b>.</p>',
      key: 'Cada bit que pasa de host a subred duplica las subredes y reduce a la mitad su tamaño.',
      scene: 'ip', ip: '200.1.10.0', mask: 24, sub: 26, hiBits: [24, 25],
      lines: [{ l: 'Bits tomados', v: '2 → 2^2 = 4 subredes', hi: 1 }, { l: 'Bits de host', v: '8 − 2 = 6' }, { l: 'Direcciones por subred', v: '2^6 = 64' }, { l: 'Hosts útiles', v: '64 − 2 = 62' }],
      blocksTitle: 'Último octeto (0 a 255): cuatro subredes /26',
      blocks: [{ a: 0, b: 63, l: '00 → .0/26', c: 'green' }, { a: 64, b: 127, l: '01 → .64/26', c: 'yellow' }, { a: 128, b: 191, l: '10 → .128/26', c: 'blue' }, { a: 192, b: 255, l: '11 → .192/26', c: 'purple' }],
      st: { pref: '/26', mask: '255.255.255.192', sub: '4', hosts: '62' }
    },
    {
      s: 'Rangos', k: 'ejemplo', t: 'Primer caso: cuatro subredes /26',
      b: '<p>En cada subred, la <b>primera dirección</b> (host todo 0) identifica a la subred y la <b>última</b> (host todo 1) es su broadcast.</p><p>Ejemplo: <code>200.1.10.130</code>. Su último octeto es <b>10</b>000010: empieza con 10, así que pertenece a <b>200.1.10.128/26</b>, con hosts de .129 a .190 y broadcast .191.</p><p>La máscara tiene 24 + 2 = <b>26 unos</b>: 11000000 = 192 → <code>255.255.255.192</code>.</p><p>El broadcast de la última subred es .255, igual que el de la red original: hoy no es un inconveniente.</p>',
      key: 'Subred = primera dirección del bloque · broadcast = última · hosts = todo lo del medio.',
      scene: 'ip', ip: '200.1.10.130', mask: 24, sub: 26, hiBits: [24, 25],
      lines: [{ l: '00 → 200.1.10.0/26', v: '.1–.62 · bc .63' }, { l: '01 → 200.1.10.64/26', v: '.65–.126 · bc .127' }, { l: '10 → 200.1.10.128/26', v: '.129–.190 · bc .191', hi: 1 }, { l: '11 → 200.1.10.192/26', v: '.193–.254 · bc .255' }],
      blocksTitle: 'La dirección .130 cae en la tercera subred',
      blocks: [{ a: 0, b: 63, l: '.0/26', c: 'green' }, { a: 64, b: 127, l: '.64/26', c: 'yellow' }, { a: 128, b: 191, l: '.128/26 ← .130', c: 'blue', hi: 1 }, { a: 192, b: 255, l: '.192/26', c: 'purple' }]
    },
    {
      s: '5 sucursales', k: 'ejemplo', t: 'Segundo caso: cinco sucursales',
      b: '<p>Abrimos dos sucursales más: ahora son <b>5</b>. Con dos bits solo teníamos cuatro combinaciones, así que hay que <b>tomar un bit más</b>.</p><p>Con <b>3 bits fijos</b> hay 2³ = <b>8 combinaciones</b> (alcanzan para las 5 y sobran 3).</p><p>Quedan <b>5 bits para hosts</b>: 2⁵ − 2 = <b>30 hosts</b> por subred.</p><p>La máscara pasa a /27: 11100000 = 224 → <code>255.255.255.224</code>.</p>',
      key: 'Más subredes = menos hosts en cada una: de 62 bajamos a 30.',
      scene: 'ip', ip: '200.1.10.0', mask: 24, sub: 27, hiBits: [24, 26],
      lines: [{ l: 'Bits de subred', v: '3 → 2^3 = 8', hi: 1 }, { l: 'Bits de host', v: '8 − 3 = 5' }, { l: 'Hosts útiles', v: '2^5 − 2 = 30' }, { l: 'Máscara /27', v: '255.255.255.224' }],
      blocksTitle: 'Último octeto: ocho subredes /27 de 32 direcciones (5 en uso)',
      blocks: [{ a: 0, b: 31, l: 'Suc. 1', c: 'green' }, { a: 32, b: 63, l: 'Suc. 2', c: 'yellow' }, { a: 64, b: 95, l: 'Suc. 3', c: 'blue' }, { a: 96, b: 127, l: 'Suc. 4', c: 'purple' }, { a: 128, b: 159, l: 'Suc. 5', c: 'orange' }, { a: 160, b: 191, l: 'libre', free: 1 }, { a: 192, b: 223, l: 'libre', free: 1 }, { a: 224, b: 255, l: 'libre', free: 1 }],
      st: { pref: '/27', mask: '255.255.255.224', sub: '8', hosts: '30' }
    },
    {
      s: 'Casa central', k: 'ejemplo', t: 'Tercer caso: subredes de distinto tamaño',
      b: '<p>Ahora queremos una <b>casa central</b> con un conjunto grande de direcciones, y otro conjunto para el resto.</p><p>Usamos el <b>primer bit</b> del último octeto para partir en dos mitades <b>/25</b>. La que empieza con 0 queda para la casa central (hosts .1 a .126).</p><p>La que empieza con 1 se sigue dividiendo: fijando un bit más salen <b>10</b> y <b>11</b>, dos subredes <b>/26</b> que arrancan en .128 y en .192 (128 + 64).</p>',
      key: 'No hace falta que todas las subredes midan lo mismo: se puede seguir partiendo solo una mitad.',
      fig: ['image67.png', 'image68.png'], scene: 'ip', ip: '200.1.10.128', mask: 24, sub: 26, hiBits: [24, 25],
      lines: [{ l: '0 → 200.1.10.0/25', v: 'hosts .1 – .126 (126)' }, { l: '10 → 200.1.10.128/26', v: 'hosts .129 – .190 (62)', hi: 1 }, { l: '11 → 200.1.10.192/26', v: 'hosts .193 – .254 (62)' }],
      bars: [
        { title: 'Primer bit: dos mitades /25', h: 30, blocks: [{ a: 0, b: 127, l: '0 → .0/25 · casa central', c: 'green' }, { a: 128, b: 255, l: '1 → .128/25 · para seguir dividiendo', c: 'gray' }] },
        { title: 'La segunda mitad se parte en dos /26', h: 30, blocks: [{ a: 0, b: 127, l: '.0/25 · casa central', c: 'green' }, { a: 128, b: 191, l: '10 → .128/26', c: 'blue', hi: 1 }, { a: 192, b: 255, l: '11 → .192/26', c: 'purple', hi: 1 }] }
      ],
      st: { pref: '/25 y /26', mask: '.128 y .192', sub: '3', hosts: '126 · 62 · 62' }
    },
    {
      s: 'Regla 256', k: 'idea', t: 'Regla práctica: dividir 256 y restar 2',
      b: '<p>Para saber cuántas direcciones tiene cada subred se va <b>dividiendo 256</b>: con 2 subredes son 128 cada una; si una se parte, 64; después 32, 16…</p><p>A cada bloque se le <b>restan 2</b> (la dirección de subred y el broadcast): 126, 62, 30, 14…</p><p>La <b>subred siguiente</b> empieza donde termina la anterior: 128 + 64 = 192.</p><p>Para la <b>máscara</b> se cuentan los bits fijos: 24 → <code>255.255.255.0</code>; cada bit extra suma su peso al último octeto (128, 192, 224, 240…).</p>',
      key: 'Tamaño del bloque = 256 dividido por la cantidad de subredes. Hosts = tamaño − 2.',
      scene: 'ip', title: 'Cada bit que se fija parte el bloque a la mitad', ip: '200.1.10.128', mask: 24, sub: 26,
      lines: [{ l: '/24 · máscara .0', v: '256 − 2 = 254' }, { l: '/25 · máscara .128', v: '128 − 2 = 126' }, { l: '/26 · máscara .192', v: '64 − 2 = 62', hi: 1 }, { l: '/27 · máscara .224', v: '32 − 2 = 30' }, { l: '/28 · máscara .240', v: '16 − 2 = 14' }, { l: '/29 · máscara .248', v: '8 − 2 = 6' }, { l: '/30 · máscara .252', v: '4 − 2 = 2' }, { l: 'Subred siguiente', v: '128 + 64 = 192' }],
      blocksTitle: 'Tamaños que salen de dividir 256',
      blocks: [{ a: 0, b: 127, l: '128 direcciones (/25)', c: 'green' }, { a: 128, b: 191, l: '64 (/26)', c: 'blue', hi: 1 }, { a: 192, b: 223, l: '32 (/27)', c: 'yellow' }, { a: 224, b: 239, l: '16', c: 'purple' }, { a: 240, b: 255, l: '16', c: 'orange' }],
      st: { pref: '/24 … /30', mask: 'según bits fijos', sub: '256 ÷ tamaño', hosts: 'tamaño − 2' }
    },
    {
      s: 'VLSM', k: 'problema', t: 'VLSM: no dar de más',
      b: '<p>Nuevo requerimiento: una subred de <b>10 hosts</b> y otra de <b>2 hosts</b>. Si a cada una le damos un /26 (62 hosts), estamos <b>desperdiciando</b>.</p><p>La idea de <b>VLSM</b> es parecida a las clases de la IANA: bloques de distinto tamaño, <b>a medida</b>.</p><ul><li>10 hosts: hacen falta <b>4 bits</b> de host (2⁴ − 2 = 14). Quedan 4 bits de subred → <b>/28</b>.</li><li>2 hosts: alcanzan <b>2 bits</b> (2² − 2 = 2) → <b>/30</b>.</li></ul>',
      key: 'Se elige la menor cantidad de bits de host que cubre lo pedido; el resto del octeto es subred.',
      scene: 'ip', ip: '200.1.10.224', mask: 24, sub: 28, hiBits: [28, 31],
      lines: [{ l: 'Necesito 10 hosts', v: '4 bits: 2^4 − 2 = 14' }, { l: 'Prefijo', v: '24 + 4 = /28', hi: 1 }, { l: 'Necesito 2 hosts', v: '2 bits: 2^2 − 2 = 2' }, { l: 'Prefijo', v: '24 + 6 = /30', hi: 1 }],
      blocksTitle: 'Sin VLSM: dos /26 para quien necesita 10 y 2 hosts',
      blocks: [{ a: 0, b: 127, l: '.0/25 · casa central', c: 'green' }, { a: 128, b: 191, l: '10 hosts → sobran 52', c: 'red' }, { a: 192, b: 255, l: '2 hosts → sobran 60', c: 'red' }],
      st: { pref: '/28 y /30', mask: '.240 y .252', sub: 'a medida', hosts: '14 · 2' }
    },
    {
      s: 'A medida', k: 'mecanismo', t: 'Reservar un fragmento y dividir el otro',
      b: '<p>El método es iterativo: de cada bloque se <b>reserva una mitad</b> para uso futuro y se <b>divide la otra</b>, hasta llegar al tamaño pedido.</p><ul><li>.128/26 queda en reserva; .192/26 se parte en dos /27.</li><li>.192/27 en reserva; .224/27 se parte en dos /28.</li><li><b>.224/28</b> (14 útiles) → la subred de 10 hosts.</li><li>.240/28 se parte: .240/29 en reserva y, dentro de .248, el <b>.248/30</b> → la de 2 hosts.</li></ul><p>En la figura del apunte se le deja el /29 entero (6 útiles).</p>',
      key: 'Bloques grandes en reserva, bloques chicos a medida: así queda lugar para crecer.',
      fig: ['image69.png', 'image70.png'], scene: 'ip', title: 'Plan VLSM sobre 200.1.10.0/24',
      lines: [{ l: '200.1.10.0/25', v: 'casa central · 126' }, { l: '200.1.10.128/26', v: 'reserva · 62' }, { l: '200.1.10.192/27', v: 'reserva · 30' }, { l: '200.1.10.224/28', v: '10 hosts · 14 útiles', hi: 1 }, { l: '200.1.10.240/29', v: 'reserva · 6' }, { l: '200.1.10.248/30', v: '2 hosts · 2 útiles', hi: 1 }, { l: '200.1.10.252/30', v: 'libre · 2' }],
      bars: [
        { title: 'Último octeto completo (0 a 255)', blocks: [{ a: 0, b: 127, l: '.0/25 · casa central', c: 'green' }, { a: 128, b: 191, l: '.128/26 · reserva', free: 1 }, { a: 192, b: 223, l: '.192/27', free: 1 }, { a: 224, b: 239, l: '/28', c: 'yellow', hi: 1 }, { a: 240, b: 255, l: 'zoom', c: 'orange', hi: 1 }] },
        { title: 'Zoom al final del bloque (224 a 255): .248/30 es la subred de 2 hosts', span: [224, 255], blocks: [{ a: 224, b: 239, l: '.224/28 · subred de 10 hosts', c: 'yellow', hi: 1 }, { a: 240, b: 247, l: '.240/29 · reserva', free: 1 }, { a: 248, b: 251, l: '.248/30', c: 'orange', hi: 1 }, { a: 252, b: 255, l: '.252/30', free: 1 }] }
      ],
      st: { pref: '/25 … /30', mask: 'variable', sub: '2 nuevas + reservas', hosts: '126 · 14 · 2' }
    },
    {
      s: 'Contiguos', k: 'detalle', t: 'Crecer: solo se unen fragmentos contiguos',
      b: '<p>Haber partido tanto tiene un problema: ¿y si una subred <b>necesita más hosts</b>?</p><p>Se pueden <b>unificar</b> fragmentos, es decir, armar uno más grande a partir de dos más chicos, pero <b>solo si son contiguos</b>.</p><p>Por eso conviene dejar al lado de cada subred un fragmento contiguo completo en reserva, y fragmentar siempre de modo que después se pueda volver a unir. No siempre se logra reservar todo contiguo: hay que hacerlo lo más que se pueda.</p>',
      key: 'Dos mitades contiguas vuelven a formar el bloque del que salieron, con un bit menos de prefijo.',
      scene: 'ip', title: 'La subred de 2 hosts crece (zoom 224 a 255)',
      lines: [{ l: '.248/30 + .252/30', v: '= .248/29 → 6 hosts', hi: 1 }, { l: '.240/29 + .248/29', v: '= .240/28 → 14 hosts', hi: 1 }, { l: '.128/26 y .252/30', v: 'no contiguos: no se unen' }],
      bars: [
        { title: 'Hoy', h: 30, span: [224, 255], blocks: [{ a: 224, b: 239, l: '.224/28 · 10 hosts', c: 'yellow' }, { a: 240, b: 247, l: '.240/29 · reserva', free: 1 }, { a: 248, b: 251, l: '.248/30', c: 'orange', hi: 1 }, { a: 252, b: 255, l: 'libre', free: 1 }] },
        { title: 'Absorbe el /30 libre que tiene al lado', h: 30, span: [224, 255], blocks: [{ a: 224, b: 239, l: '.224/28 · 10 hosts', c: 'yellow' }, { a: 240, b: 247, l: '.240/29 · reserva', free: 1 }, { a: 248, b: 255, l: '.248/29 · 6 hosts', c: 'orange', hi: 1 }] },
        { title: 'Si vuelve a crecer, absorbe la reserva contigua', h: 30, span: [224, 255], blocks: [{ a: 224, b: 239, l: '.224/28 · 10 hosts', c: 'yellow' }, { a: 240, b: 255, l: '.240/28 · 14 hosts', c: 'orange', hi: 1 }] }
      ],
      st: { pref: '/30 → /29 → /28', mask: '.252 → .248 → .240', sub: 'se unifican', hosts: '2 → 6 → 14' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'Subredes y VLSM en una mirada',
      b: '<ul><li><b>Subred</b>: se toman bits del host para identificarla. n bits → 2ⁿ subredes.</li><li>Hosts útiles = 2 elevado a los bits de host, <b>menos 2</b> (subred y broadcast).</li><li>Regla práctica: <b>dividir 256</b> y restar 2. La siguiente subred empieza sumando el tamaño.</li><li><b>Máscara</b> = cantidad de bits fijos: /26 → .192, /27 → .224, /28 → .240.</li><li><b>VLSM</b>: bloques a medida, reservando contiguos para crecer.</li></ul><p>Ya sabemos qué IP lleva cada host y a qué red pertenece. Falta un detalle: para entregarle una trama a un vecino hace falta su MAC. Eso lo resuelve <b>ARP</b>.</p>',
      scene: 'red', tags: { H1: '200.1.10.0/25', C: '.224/28', D: '.248/30' },
      pk: [{ p: ['A', 'H1', 'R1', 'R2', 'C'], l: 'entre subredes', c: 'req', d: 2.6 }, { p: ['D', 'R3', 'R1', 'H1', 'B'], l: 'entre subredes', c: 'res', d: 2.6 }],
      st: { pref: '/25 · /28 · /30', mask: 'variable (VLSM)', sub: '3 en uso', hosts: '126 · 14 · 2' }
    }
  ],
  quiz: [
    { q: 'Se divide 200.1.10.0/24 en 4 subredes iguales. ¿A cuál pertenece el host 200.1.10.100 y cuál es el broadcast de esa subred?', o: ['200.1.10.0/26 · broadcast .63', '200.1.10.64/26 · broadcast .127', '200.1.10.64/26 · broadcast .128', '200.1.10.96/27 · broadcast .127'], a: 1, why: '100 = 01100100 empieza con 01: es la subred .64/26, que va de .64 a .127 (hosts .65 – .126, broadcast .127).' },
    { q: 'Hacen falta 5 subredes iguales dentro de un /24. ¿Qué prefijo, máscara y cantidad de hosts por subred resultan?', o: ['/26 · 255.255.255.192 · 62 hosts', '/27 · 255.255.255.224 · 32 hosts', '/27 · 255.255.255.224 · 30 hosts', '/28 · 255.255.255.240 · 14 hosts'], a: 2, why: 'Para 5 subredes se necesitan 3 bits (8 combinaciones): /27, máscara .224. Quedan 5 bits de host: 2⁵ − 2 = 30.' },
    { q: 'Con VLSM hay que ubicar una subred de 10 hosts y otra de 2. ¿Qué prefijos se ajustan sin desperdiciar?', o: ['/26 y /26', '/27 y /29', '/28 y /30', '/29 y /30'], a: 2, why: '10 hosts piden 4 bits de host (2⁴ − 2 = 14) → /28; 2 hosts piden 2 bits (2² − 2 = 2) → /30. Un /29 solo da 6 hosts.' },
    { q: 'La subred 200.1.10.128/25 se parte en dos. ¿Cuáles son las subredes resultantes?', o: ['200.1.10.128/26 y 200.1.10.192/26', '200.1.10.128/26 y 200.1.10.160/26', '200.1.10.128/24 y 200.1.10.192/24', '200.1.10.0/26 y 200.1.10.64/26'], a: 0, why: 'Al fijar un bit más, el bloque de 128 se divide en dos de 64: el primero empieza en .128 y el segundo en 128 + 64 = .192.' }
  ],
  cheat: [
    ['Subred', 'Se toman bits del host para identificarla: n bits → 2ⁿ subredes, cada una con menos hosts.'],
    ['Hosts útiles', '2 elevado a los bits de host, menos 2: la primera dirección es la <b>subred</b> y la última el <b>broadcast</b>.'],
    ['/24 en cuatro /26', '.0, .64, .128, .192 · 62 hosts cada una · máscara 255.255.255.192.'],
    ['/27', '3 bits de subred → 8 subredes de 30 hosts · máscara 255.255.255.224.'],
    ['Regla práctica', 'Dividir 256: 128, 64, 32, 16, 8, 4… y restar 2. La siguiente subred = anterior + tamaño.'],
    ['Máscara', 'Bits fijos → último octeto: /25 .128 · /26 .192 · /27 .224 · /28 .240 · /29 .248 · /30 .252.'],
    ['VLSM', 'Subredes de distinto tamaño según la necesidad: 10 hosts → /28 (14), 2 hosts → /30 (2).'],
    ['Reservar y unificar', 'Reservar una mitad, dividir la otra. Solo se pueden unificar fragmentos <b>contiguos</b>.']
  ]
});

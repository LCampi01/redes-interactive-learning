COURSE.add({
  id: 'dhcp',
  title: 'DHCP: configuración automática',
  desc: 'Un host recién encendido no tiene IP ni sabe a quién pedírsela: cómo la consigue con cuatro mensajes, por cuánto tiempo la conserva y qué hay que prever al diseñar el servicio.',
  min: 10, level: 'Intermedio',
  learn: [
    'Qué parámetros necesita todo host y por qué conviene asignarlos de forma dinámica',
    'Los cuatro mensajes Discover, Offer, Request y ACK, y por qué viajan en broadcast',
    'Cuándo aparecen NACK, Decline, Release e Inform',
    'Cómo se renueva el lease (al 50 %) y qué pasa si el servidor no responde',
    'Criterios de diseño: dos servidores, IP estáticas, routers, DDNS y duración del lease'
  ],
  stats: [{ k: 'ip', l: 'IP del cliente' }, { k: 'msg', l: 'Mensaje' }, { k: 'dst', l: 'IP destino' }, { k: 'lease', l: 'Lease' }],
  legend: [['req', 'mensaje del cliente'], ['res', 'oferta del servidor'], ['ctl', 'ACK'], ['bad', 'NACK / Decline']],
  scenes: {
    red: {
      kind: 'topo',
      nodes: [
        { id: 'C', t: 'pc', x: 110, y: 220, l: 'Cliente', sub: 'PC-07' },
        { id: 'SW', t: 'switch', x: 300, y: 220, l: 'Switch' },
        { id: 'B', t: 'pc', x: 110, y: 85, l: 'Otro host' },
        { id: 'S1', t: 'server', x: 520, y: 110, l: 'DHCP 1', sub: '192.168.1.2' },
        { id: 'S2', t: 'server', x: 520, y: 330, l: 'DHCP 2', sub: '192.168.1.3' },
        { id: 'R', t: 'router', x: 700, y: 220, l: 'Router', sub: '192.168.1.1' }
      ],
      links: [{ a: 'C', b: 'SW' }, { a: 'SW', b: 'B' }, { a: 'SW', b: 'S1' }, { a: 'SW', b: 'S2' }, { a: 'SW', b: 'R' }]
    },
    otros: {
      kind: 'seq',
      actors: [{ id: 'C', l: 'Cliente', t: 'pc' }, { id: 'S', l: 'DHCP Server', t: 'server' }],
      msgs: [
        { at: 'C', note: 'quiere renovar una IP anterior' },
        { f: 'C', to: 'S', l: 'REQUEST · 192.168.1.50 (sin Discover ni Offer)', c: 'req' },
        { f: 'S', to: 'C', l: 'NACK · no confirmo esa dirección', c: 'bad' },
        { f: 'C', to: 'S', l: 'DISCOVER · vuelve a empezar', c: 'req' },
        { div: 'otros mensajes del cliente' },
        { f: 'C', to: 'S', l: 'DECLINE · la IP ya está en uso (ARP gratuito)', c: 'bad' },
        { f: 'C', to: 'S', l: 'RELEASE · libero la asignación', c: 'req' },
        { f: 'C', to: 'S', l: 'INFORM · solo quiero los parámetros', c: 'req' }
      ]
    },
    ren: {
      kind: 'seq',
      actors: [{ id: 'C', l: 'Cliente', t: 'pc' }, { id: 'S', l: 'DHCP Server', t: 'server' }],
      msgs: [
        { at: 'C', note: 'lease de 24 h' },
        { div: 'a las 12 h · 50 % del lease' },
        { f: 'C', to: 'S', l: 'REQUEST · me quedo con 192.168.1.50', c: 'req' },
        { f: 'S', to: 'C', l: 'ACK · nuevas 24 h', c: 'ctl' },
        { div: 'si el servidor no responde' },
        { f: 'C', to: 'S', l: 'REQUEST · 1.er intento (12 h)', c: 'req', lost: 1 },
        { f: 'C', to: 'S', l: 'REQUEST · 2.º intento (6 h después)', c: 'req', lost: 1 },
        { f: 'C', to: 'S', l: 'REQUEST · 3.º y último (3 h después)', c: 'req', lost: 1 },
        { at: 'C', note: 'libera la IP', c: 'red' },
        { f: 'C', to: 'S', l: 'DISCOVER · empieza de nuevo', c: 'req' }
      ]
    },
    pool: { kind: 'bits' },
    hs: {
      kind: 'seq',
      actors: [{ id: 'C', l: 'Cliente', t: 'pc' }, { id: 'S1', l: 'DHCP 1', t: 'server' }, { id: 'S2', l: 'DHCP 2', t: 'server' }],
      msgs: [
        { at: 'C', note: 'arranca sin IP' },
        { f: 'C', to: 'S2', l: 'DISCOVER · 0.0.0.0 → 255.255.255.255 · MAC + nombre', c: 'req' },
        { f: 'S1', to: 'C', l: 'OFFER · 192.168.1.50', c: 'res' },
        { f: 'S2', to: 'C', l: 'OFFER · 192.168.1.130', c: 'res' },
        { at: 'C', note: 'elige una oferta' },
        { f: 'C', to: 'S2', l: 'REQUEST (broadcast) · acepto 192.168.1.50 de DHCP 1', c: 'req' },
        { at: 'S2', note: 'libera 192.168.1.130' },
        { f: 'S1', to: 'C', l: 'ACK · IP + parámetros', c: 'ctl' },
        { at: 'C', note: 'ya opera con 192.168.1.50', c: 'green' }
      ]
    }
  },
  steps: [
    {
      s: 'Qué falta', k: 'contexto', t: 'Lo que todo host necesita para operar',
      b: '<p>Para hablar en una red IP, todo host debe tener:</p><ul><li>Una <b>IP única</b>.</li><li>La <b>máscara de subred</b>.</li><li>El <b>default gateway</b>, si queremos salir de la red.</li><li>Un <b>servidor DNS</b>.</li></ul><p>Antes se llevaba un <b>control manual</b> de las direcciones, equipo por equipo. Un error en la máscara dejaba al host desconectado, porque no podía determinar a qué red pertenecía.</p>',
      key: 'Sin esos cuatro datos el host no opera; cargarlos a mano no escala y es fuente de errores.',
      scene: 'red', show: ['C', 'SW', 'B', 'R'], hi: ['C'], tags: { C: '¿mi configuración?' },
      tbl: { x: 420, y: 296, w: 250, title: 'lo que hay que configurar', cols: ['Parámetro', 'Ejemplo'], rows: [['IP única', '192.168.1.50'], ['Máscara', '255.255.255.0'], ['Default gateway', '192.168.1.1'], ['Servidor DNS', '192.168.1.5']] },
      st: { ip: 'sin IP', msg: '—', dst: '—', lease: '—' }
    },
    {
      s: 'DHCP', k: 'idea', t: 'Un servidor que reparte la configuración',
      b: '<p><b>DHCP</b> (Dynamic Host Configuration Protocol) automatiza la distribución de direcciones. Deriva de <b>BOOTP</b>, que permitía inicializar computadoras sin disco rígido.</p><p>El servidor centraliza la asignación y <b>registra qué IP tiene cada cliente</b>. Ventajas:</p><ul><li>No hay que llevar el registro a mano ni hay errores de configuración.</li><li>Un cambio se hace en el servidor y todos lo toman solos.</li><li>Las IP que se dejan de usar <b>se recuperan</b> para otro host.</li><li>Junto con la IP van todos los parámetros.</li></ul>',
      key: 'Asignación dinámica: las direcciones se prestan por un tiempo y vuelven al servidor.',
      scene: 'red', add: ['S1'], hi: ['S1'], tags: { S1: 'administra las IP' },
      tbl: { x: 400, y: 296, w: 270, title: 'registro del servidor', cols: ['IP', 'Cliente', 'Lease'], rows: [['192.168.1.50', 'libre', '—'], ['192.168.1.51', 'Notebook', '24 h'], ['192.168.1.52', 'Televisor', '24 h']] }
    },
    {
      s: 'Discover', k: 'mecanismo', t: '1 · Discover: ¿hay algún servidor?',
      b: '<p>El cliente DHCP corre en todo dispositivo (PC, impresora, televisor). Al inicializar <b>no tiene IP</b> ni sabe quién es el servidor, así que usa direcciones especiales:</p><ul><li>IP origen <b>0.0.0.0</b>.</li><li>IP destino <b>255.255.255.255</b> (broadcast): llega a todos, y puede haber varios servidores.</li></ul><p>El <b>Discover</b> lleva la <b>MAC</b> del cliente y su <b>nombre</b>. Se envía al encender por primera vez, cuando el servidor rechaza un pedido o cuando el cliente libera su IP y pide una nueva.</p>',
      fig: 'image98.png', scene: 'red', add: ['S2'], hi: ['C'], tags: { C: 'origen 0.0.0.0', B: 'lo ignora' },
      fx: [{ k: 'wave', at: 'SW', c: 'req', t: .8, r: 170 }],
      pk: [{ p: ['C', 'SW'], l: 'DISCOVER', d: .9 }, { p: ['SW', 'S1'], l: 'DISCOVER', d: 1.1 }, { p: ['SW', 'S2'], l: 'DISCOVER', d: 1.1, par: 1 }, { p: ['SW', 'R'], l: 'DISCOVER', d: 1.1, par: 1 }, { p: ['SW', 'B'], l: 'DISCOVER', d: 1.1, par: 1 }],
      notes: [{ x: 28, y: 306, w: 215, c: 'yellow', text: 'Es un <b>broadcast</b>: el switch lo entrega por todas sus bocas. Solo los servidores DHCP lo van a contestar.' }],
      st: { ip: '0.0.0.0', msg: 'Discover', dst: '255.255.255.255' }
    },
    {
      s: 'Offer', k: 'mecanismo', t: '2 · Offer: cada servidor hace su oferta',
      b: '<p><b>Todos</b> los servidores DHCP que reciben el pedido responden con una <b>oferta</b>:</p><ul><li>La MAC del cliente (que sigue con IP 0.0.0.0).</li><li>La <b>IP ofrecida</b> y la <b>máscara</b>.</li><li>El <b>lease</b>: cuánto dura la asignación.</li><li>La <b>identificación del servidor</b> (su IP).</li></ul><p>Cada servidor <b>reserva</b> la dirección que ofreció mientras espera la confirmación. Si llegan varias ofertas, el cliente tiene que elegir una (en general, la primera).</p>',
      scene: 'red', hi: ['S1', 'S2'], tags: { S1: 'reserva .50', S2: 'reserva .130' },
      pk: [{ p: ['S1', 'SW', 'C'], l: 'OFFER .50', c: 'res', d: 1.9, stay: 1 }, { p: ['S2', 'SW', 'C'], l: 'OFFER .130', c: 'res', d: 1.9, t: .7 }],
      tbl: { x: 28, y: 300, w: 222, title: 'oferta de DHCP 1', rows: [['MAC cliente', 'la de PC-07'], ['IP ofrecida', '192.168.1.50'], ['Máscara', '255.255.255.0'], ['Lease', '24 h'], ['Servidor', '192.168.1.2']], hi: 1 },
      st: { msg: 'Offer', lease: '24 h (ofrecido)' }
    },
    {
      s: 'Request', k: 'mecanismo', t: '3 · Request: me quedo con esta',
      b: '<p>El cliente elige una oferta y envía un <b>Request</b>: le pide a ese servidor quedarse con la dirección ofrecida.</p><p>Como todavía no tiene IP para operar, el intercambio sigue siendo <b>broadcast</b>. Eso tiene una ventaja: <b>todos los servidores se enteran</b> de qué oferta se aceptó. El que no fue elegido <b>libera</b> la dirección que había reservado.</p>',
      key: 'El Request en broadcast acepta una oferta y, de paso, les avisa a los demás servidores que la suya quedó libre.',
      fig: 'image99.png', scene: 'red', hi: ['C', 'S1'], dim: ['B', 'R'], tags: { C: 'elijo a DHCP 1', S1: 'aceptó mi oferta', S2: 'libera .130' },
      fx: [{ k: 'wave', at: 'SW', c: 'req', t: .8, r: 170 }],
      pk: [{ p: ['C', 'SW'], l: 'REQUEST .50', d: .9 }, { p: ['SW', 'S1'], l: 'REQUEST .50', d: 1.1, stay: 1 }, { p: ['SW', 'S2'], l: 'REQUEST .50', d: 1.1, par: 1 }, { p: ['SW', 'R'], d: 1.1, par: 1 }, { p: ['SW', 'B'], d: 1.1, par: 1 }],
      st: { msg: 'Request', dst: '255.255.255.255', lease: '24 h (ofrecido)' }
    },
    {
      s: 'ACK', k: 'mecanismo', t: '4 · ACK: la dirección es tuya',
      b: '<p>El servidor cuya oferta fue aceptada responde con una confirmación positiva: el <b>ACK</b>. Contiene la IP asignada y los demás <b>parámetros de configuración</b>.</p><p>Recién en ese momento el cliente puede <b>empezar a usar</b> la dirección.</p><p>El servidor no verifica que el cliente realmente la esté usando: solo la entrega, y por el <b>lease</b> sabe cuándo volverá a estar disponible.</p>',
      scene: 'red', hi: ['C', 'S1'], dim: ['S2'], tags: { C: '192.168.1.50 /24', S1: '.50 → PC-07' },
      pk: [{ p: ['S1', 'SW', 'C'], l: 'ACK', c: 'ctl', d: 1.9, stay: 1 }],
      tbl: { x: 28, y: 300, w: 222, title: 'configuración de PC-07', rows: [['IP', '192.168.1.50'], ['Máscara', '255.255.255.0'], ['Gateway', '192.168.1.1'], ['DNS', '192.168.1.5'], ['Lease', '24 h']], hi: 0 },
      st: { ip: '192.168.1.50', msg: 'ACK', lease: '24 h' }
    },
    {
      s: 'NACK y otros', k: 'detalle', t: 'Cuando la respuesta es no: NACK y otros mensajes',
      b: '<p>El servidor puede contestar un Request con un <b>NACK</b>: no confirma la dirección. Ocurre cuando:</p><ul><li>El cliente intenta <b>renovar una IP anterior</b> (salteando Discover y Offer) y ya no está disponible.</li><li>La IP es <b>inválida</b> porque el cliente se movió físicamente de subred.</li></ul><p>Otros mensajes del cliente: <b>Decline</b> (la dirección ya está en uso; lo detecta con ARP gratuito), <b>Release</b> (libera la asignación y cancela el lease) e <b>Inform</b> (pide solo parámetros adicionales).</p>',
      scene: 'otros', st: { ip: '¿192.168.1.50?', msg: 'NACK', dst: '—', lease: '—' }
    },
    {
      s: 'Renovación', k: 'mecanismo', t: 'Renovar el lease: al 50 %',
      b: '<p>Al <b>50 % del lease</b> el cliente intenta renovar. Con 24 h, lo hace a las 12 h. No necesita Discover ni Offer porque su IP sigue siendo válida: manda un <b>Request</b>, y con el <b>ACK</b> tiene otras 24 h.</p><p>Si el servidor no responde, reintenta <b>a la mitad de lo que queda</b>: 6 h después y, por tercera y última vez, 3 h después. Sin confirmación (o con un NACK) libera la IP y <b>vuelve al Discover</b>.</p>',
      key: 'Si el equipo se desconecta no hay renovación: cumplido el lease, el servidor recupera la dirección.',
      scene: 'ren', st: { ip: '192.168.1.50', msg: 'Request (renovación)', dst: 'el servidor', lease: '24 h → renueva a las 12 h' }
    },
    {
      s: 'Diseño', k: 'detalle', t: 'Diseñar el servicio: pools, opciones y lease',
      b: '<ul><li>Repartir el espacio entre <b>dos servidores DHCP</b>: sin IP, el cliente no puede operar.</li><li><b>Excluir del pool</b> un rango para IP <b>estáticas</b> (routers, impresoras).</li><li>Configurar los <b>routers</b> para que dejen pasar los pedidos DHCP, que son broadcast.</li><li><b>DDNS</b>: si una estación cambia de IP, hay que actualizar la relación IP–nombre.</li></ul><p>Las <b>opciones</b> (RFC 2132) permiten enviar más parámetros para que el cliente se autoconfigure.</p>',
      key: 'Pool chico → lease corto: las direcciones se recuperan rápido y se pueden volver a prestar.',
      scene: 'pool', title: 'Opciones DHCP (RFC 2132) y reparto de 192.168.1.0/24',
      lines: [{ l: 'Opción', v: 'Subnet mask' }, { l: 'Opción', v: 'Router' }, { l: 'Opción', v: 'Domain Name Server' }, { l: 'Opción', v: 'Static route' }],
      blocksTitle: 'Último octeto: quién reparte cada rango',
      blocks: [{ a: 0, b: 19, l: 'estáticas', c: 'yellow' }, { a: 20, b: 119, l: 'pool de DHCP 1', c: 'green' }, { a: 120, b: 219, l: 'pool de DHCP 2', c: 'blue' }, { a: 220, b: 255, l: 'libre', free: 1 }],
      notes: [
        { x: 40, y: 236, w: 220, c: 'yellow', text: '<b>Estáticas</b>: routers, impresoras y otros equipos a los que conviene encontrar siempre en la misma IP.' },
        { x: 290, y: 236, w: 220, c: 'green', text: '<b>Dos servidores</b>: si uno cae, el otro sigue entregando direcciones de su parte del espacio.' },
        { x: 540, y: 236, w: 220, c: 'purple', text: '<b>Sin direcciones libres</b>, el servidor no hace ninguna oferta. Con un pool chico, un lease corto deja margen.' }
      ],
      st: { ip: '—', msg: '—', dst: '—', lease: 'pool chico → corto' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'DHCP en una mirada',
      b: '<ul><li><b>Discover</b>: broadcast desde 0.0.0.0 con MAC y nombre.</li><li><b>Offer</b>: IP, máscara, lease e id del servidor; la IP queda reservada.</li><li><b>Request</b>: en broadcast; los otros servidores liberan su oferta.</li><li><b>ACK</b>: ya se puede usar la IP. <b>NACK</b>: de vuelta al Discover.</li><li>Renovación al <b>50 %</b> del lease.</li></ul><p>Con esto el host queda configurado dentro de su red. En la próxima lección vemos cómo unir dos redes privadas a través de Internet: <b>VPN</b> e IPSec.</p>',
      scene: 'hs', st: { ip: '192.168.1.50', msg: 'D → O → R → A', dst: 'broadcast', lease: '24 h' }
    }
  ],
  quiz: [
    { q: '¿Con qué direcciones IP viaja un DHCP Discover?', o: ['Origen 0.0.0.0 y destino 255.255.255.255', 'Origen 255.255.255.255 y destino 0.0.0.0', 'Origen la IP anterior del cliente y destino la del servidor', 'Origen 0.0.0.0 y destino el default gateway'], a: 0, why: 'El cliente todavía no tiene IP (0.0.0.0) y no sabe quién es el servidor, así que lo busca por broadcast.' },
    { q: '¿Por qué el Request se envía en broadcast aunque el cliente ya eligió un servidor?', o: ['Porque el switch no sabe dónde está el servidor', 'Para que los demás servidores sepan qué oferta se aceptó y liberen la suya', 'Para que todos los hosts actualicen su tabla ARP', 'Porque DHCP no admite otro tipo de envío'], a: 1, why: 'El cliente aún opera sin IP, y el broadcast permite que los servidores no elegidos recuperen la dirección que habían reservado.' },
    { q: 'Un cliente recibe una IP con un lease de 24 h. ¿Cuándo intenta renovarla por primera vez?', o: ['A las 6 h', 'A las 12 h', 'A las 23 h', 'Cuando el lease ya venció'], a: 1, why: 'La renovación se intenta al 50 % del lease; si no hay respuesta, reintenta 6 h después y luego 3 h después.' },
    { q: 'El pool de direcciones es chico respecto de la cantidad de equipos que pasan por la red. ¿Qué conviene?', o: ['Un lease largo, para renovar menos', 'Un lease corto, para recuperar rápido las direcciones', 'Desactivar la renovación', 'Asignar todas las IP de forma estática'], a: 1, why: 'Con un lease corto las direcciones que se dejan de usar vuelven antes al servidor y se pueden volver a prestar.' }
  ],
  cheat: [
    ['Todo host necesita', 'IP única, máscara de subred, default gateway y servidor DNS.'],
    ['Discover', 'Cliente → broadcast. Origen <b>0.0.0.0</b>, destino <b>255.255.255.255</b>; lleva MAC y nombre.'],
    ['Offer', 'Cada servidor ofrece IP, máscara, lease y su identificación, y <b>reserva</b> la dirección.'],
    ['Request', 'En broadcast: acepta una oferta y hace que los otros servidores liberen la suya.'],
    ['ACK / NACK', '<b>ACK</b>: IP y parámetros confirmados. <b>NACK</b>: IP no disponible o inválida (cambio de subred) → Discover.'],
    ['Decline · Release · Inform', 'IP en uso (ARP gratuito) · libera y cancela el lease · pide solo parámetros.'],
    ['Renovación', 'Request al <b>50 %</b> del lease; reintentos a la mitad de lo que queda (6 h, 3 h); si falla, libera y vuelve al Discover.'],
    ['Diseño', 'Dos servidores, rango excluido para estáticas, routers que dejen pasar el broadcast, DDNS. Pool chico → lease corto.']
  ]
});

COURSE.add({
  id: 'arp',
  title: 'ARP: de la IP a la MAC',
  desc: 'La capa de red piensa en direcciones IP, pero la trama Ethernet necesita una MAC destino. ARP es el protocolo que averigua la MAC a partir de la IP: una pregunta en broadcast y una respuesta en unicast.',
  min: 11, level: 'Inicial',
  learn: [
    'Por qué hace falta traducir una dirección IP en una MAC',
    'La diferencia entre entrega directa (a un vecino) y entrega al router (default gateway)',
    'Cómo funcionan el ARP request en broadcast, el reply en unicast y la caché ARP',
    'Qué pasa con los broadcasts y multicasts IP, que no usan ARP',
    'El formato del mensaje ARP, el ARP gratuito y cómo viaja dentro de una trama Ethernet'
  ],
  stats: [{ k: 'dst', l: 'IP destino' }, { k: 'mac', l: 'MAC destino de la trama' }, { k: 'cache', l: 'Caché ARP de A' }],
  legend: [['req', 'ARP request (broadcast)'], ['res', 'ARP reply (unicast)'], ['data', 'datagrama IP'], ['bad', 'IP duplicada']],
  scenes: {
    trama: {
      kind: 'fields', title: 'La trama Ethernet que A tiene que armar', rh: 54,
      rows: [[
        { id: 'da', l: 'MAC destino', s: '¿?', w: 6, c: 'red' }, { id: 'sa', l: 'MAC origen', s: 'la de A', w: 6, c: 'blue' },
        { id: 'tp', l: 'Tipo', s: '0x0800', w: 3.5, c: 'purple' }, { id: 'dat', l: 'Datos: datagrama IP', s: '46 – 1500 B', w: 14, c: 'yellow' }, { id: 'fcs', l: 'CRC', s: '4 B', w: 3, c: 'gray' }
      ]],
      zoom: { from: 'dat', title: 'Dentro del datagrama (PDU de capa 3)', rows: [[
        { id: 'iph', l: 'resto de la cabecera', w: 7, c: 'gray' }, { id: 'ipo', l: 'IP origen', s: '10.200.128.10', w: 6, c: 'blue' },
        { id: 'ipd', l: 'IP destino', s: '10.200.128.1', w: 6, c: 'green' }, { id: 'ipp', l: 'mensaje de la aplicación', w: 9, c: 'white' }
      ]] }
    },
    lan: {
      kind: 'topo',
      zones: [{ id: 'z', x: 30, y: 52, w: 585, h: 340, l: 'Mi red', c: 'green' }],
      nodes: [
        { id: 'A', t: 'pc', x: 130, y: 140, l: 'A', sub: '10.200.128.10' },
        { id: 'C', t: 'pc', x: 130, y: 320, l: 'C', sub: '10.200.128.20' },
        { id: 'SW', t: 'switch', x: 330, y: 230, l: 'Switch' },
        { id: 'B', t: 'pc', x: 535, y: 140, l: 'B', sub: '10.200.128.1' },
        { id: 'R', t: 'router', x: 535, y: 320, l: 'Router', sub: '10.200.128.254' },
        { id: 'NET', t: 'cloud', x: 715, y: 320, l: 'Otra red', sub: '24.32.218.197' }
      ],
      links: [{ a: 'A', b: 'SW' }, { a: 'C', b: 'SW' }, { a: 'B', b: 'SW' }, { a: 'R', b: 'SW' }, { a: 'R', b: 'NET' }]
    },
    dup: {
      kind: 'topo',
      nodes: [
        { id: 'N', t: 'pc', x: 120, y: 220, l: 'Host nuevo', sub: 'quiere usar 10.200.128.1' },
        { id: 'SW', t: 'switch', x: 350, y: 220, l: 'Switch' },
        { id: 'B', t: 'pc', x: 600, y: 130, l: 'B', sub: '10.200.128.1' },
        { id: 'C', t: 'pc', x: 600, y: 320, l: 'C', sub: '10.200.128.20' }
      ],
      links: [{ a: 'N', b: 'SW' }, { a: 'SW', b: 'B' }, { a: 'SW', b: 'C' }]
    },
    mc: { kind: 'bits' },
    arpmsg: {
      kind: 'fields', title: 'Mensaje ARP · 28 bytes', rh: 46,
      rows: [
        [{ id: 'ht', l: 'Hardware type', s: '2 B · Ethernet = 1', w: 16, c: 'gray' }, { id: 'pt', l: 'Protocol type', s: '2 B · IP = 0x0800', w: 16, c: 'gray' }],
        [{ id: 'hl', l: 'Long. dir. física', s: '1 B · 6', w: 8, c: 'yellow' }, { id: 'pl', l: 'Long. dir. lógica', s: '1 B · 4', w: 8, c: 'yellow' }, { id: 'op', l: 'Operación', s: '2 B · 1 request · 2 reply', w: 16, c: 'purple' }],
        [{ id: 'sha', l: 'Dirección física del emisor', s: '6 B · MAC de quien envía', w: 6, c: 'blue' }, { id: 'spa', l: 'Dirección lógica del emisor', s: '4 B · su IP', w: 4, c: 'blue' }],
        [{ id: 'tha', l: 'Dirección física del destino', s: '6 B · lo que quiero averiguar', w: 6, c: 'red' }, { id: 'tpa', l: 'Dirección lógica del destino', s: '4 B · la IP consultada', w: 4, c: 'green' }]
      ]
    },
    tramaArp: {
      kind: 'fields', title: 'ARP dentro de una trama Ethernet', rh: 54,
      rows: [[
        { id: 'da', l: 'MAC destino', s: '6 B', w: 6, c: 'green' }, { id: 'sa', l: 'MAC origen', s: '6 B', w: 6, c: 'blue' },
        { id: 'tp', l: 'Tipo 0x0806', s: '2 B', w: 5.5, c: 'purple' }, { id: 'arp', l: 'ARP request / reply', s: '28 B', w: 11, c: 'yellow' },
        { id: 'pad', l: 'PAD', s: '18 B', w: 6, c: 'orange' }, { id: 'fcs', l: 'CRC', s: '4 B', w: 3.5, c: 'gray' }
      ]]
    }
  },
  steps: [
    {
      s: 'Problema', k: 'problema', t: 'Tengo la IP, me falta la MAC',
      b: '<p>Las aplicaciones solo trabajan con <b>direcciones IP</b> (o con nombres, que se convierten en una IP). IP resuelve direccionamiento y encaminamiento.</p><p>Pero para pasarle esa PDU de capa 3 a alguien hay que <b>encapsularla en un protocolo de capa 2</b> y dársela a la interfaz de red: Ethernet / 802.3 o Wi-Fi (802.11).</p><p>Y la trama se envía a una <b>MAC destino</b>. Hay que encontrar la manera de <b>mapear</b> la IP que se intenta alcanzar con la dirección física de a quién entregarle el datagrama.</p>',
      key: 'IP dice a quién va el datagrama; la MAC dice a qué placa de la LAN hay que entregar la trama.',
      scene: 'trama', hi: ['da', 'ipd'], zoom: 1,
      det: 'La aplicación nos dio la <b>IP destino</b>, que viaja adentro del datagrama. Para armar la trama falta la <b>MAC destino</b>: eso es lo que resuelve <b>ARP</b> (Address Resolution Protocol).',
      st: { dst: '10.200.128.1', mac: '¿?', cache: 'vacía' }
    },
    {
      s: 'Dos casos', k: 'idea', t: 'Entrega directa o entrega al router',
      b: '<p>El destinatario puede estar <b>dentro o fuera</b> de mi red. Hay dos situaciones:</p><ul><li><b>Entrega directa</b>: la IP destino es de un <b>vecino</b> de mi red. Se traduce esa IP en la MAC del vecino y se le entrega directamente.</li><li>La IP <b>no pertenece</b> a un vecino: el mensaje se entrega al <b>router</b>, para que lo saque de la red.</li></ul><p>En cualquiera de los dos casos, ARP permite obtener una MAC a partir de una dirección IP.</p>',
      key: 'Siempre se le entrega la trama a alguien de la propia LAN: al destino mismo o al router.',
      scene: 'lan', hi: ['B', 'R'], tags: { B: 'vecino: directo', R: 'saca de la red' },
      pk: [{ p: ['A', 'SW', 'B'], l: 'a un vecino', c: 'data', d: 1.8 }, { p: ['A', 'SW', 'R', 'NET'], l: 'a otra red', c: 'data', d: 2.6 }],
      st: { dst: 'vecino o remoto', mac: '¿?', cache: 'vacía' }
    },
    {
      s: 'Request', k: 'mecanismo', t: 'ARP request: preguntarles a todos',
      b: '<p>ARP tiene dos mensajes: <b>request</b> y <b>reply</b>.</p><p>El request se envía como un <b>broadcast</b>: el host les pregunta a <b>todos</b> los de la red quién tiene una dirección, por ejemplo <code>10.200.128.1</code>.</p><p>La trama va a la MAC destino con todos los bits en 1, así que el switch la reenvía por todos los puertos y la reciben todas las estaciones. Cada una compara la IP consultada con la suya.</p>',
      key: 'La consulta va en broadcast porque todavía no se sabe a qué MAC dirigirla.',
      fig: 'image71.png', scene: 'lan', hi: ['A'], tags: { A: '¿quién tiene 10.200.128.1?', B: '¡es mi IP!', C: 'no es mi IP', R: 'no es mi IP' },
      fx: [{ k: 'wave', at: 'SW', c: 'req', t: 1, r: 130 }],
      pk: [{ p: ['A', 'SW'], l: 'ARP request', c: 'req', d: 1 }, { p: ['SW', 'B'], l: 'request', c: 'req', d: 1.1, stay: 1 }, { p: ['SW', 'C'], l: 'request', c: 'req', d: 1.1, par: 1 }, { p: ['SW', 'R'], l: 'request', c: 'req', d: 1.1, par: 1 }],
      notes: [{ x: 238, y: 64, w: 190, c: 'yellow', text: 'MAC destino de la trama:<br><b>FF-FF-FF-FF-FF-FF</b> (broadcast)' }],
      st: { dst: '10.200.128.1', mac: 'FF-FF-FF-FF-FF-FF', cache: 'vacía' }
    },
    {
      s: 'Reply', k: 'mecanismo', t: 'ARP reply y la caché',
      b: '<p>El que tiene esa IP <b>responde con su MAC address</b>. La respuesta ya no es un broadcast: es un <b>unicast</b> dirigido al que preguntó.</p><p>Eso genera una entrada en la <b>caché ARP</b> de la estación que consultó, para usar esa MAC cada vez que le envíe algo al vecino.</p><p>La asociación dura un <b>intervalo corto</b> y luego <b>caduca</b>: se borra y, si hace falta, se vuelve a preguntar.</p>',
      key: 'Consulta en broadcast, respuesta en unicast, resultado guardado en caché por un rato.',
      fig: 'image71.png', scene: 'lan', hi: ['B', 'A'], tags: { B: 'soy 00-12-F0-13-1C-70', A: 'lo guardo en caché' },
      pk: [{ p: ['B', 'SW', 'A'], l: 'ARP reply', c: 'res', d: 1.8 }, { p: ['A', 'SW', 'B'], l: 'datagrama IP', c: 'data', d: 1.8 }],
      tbl: { x: 222, y: 300, w: 230, title: 'Caché ARP de A', cols: ['IP', 'MAC'], rows: [['10.200.128.1', '00-12-F0-13-1C-70']], hi: 0 },
      st: { dst: '10.200.128.1', mac: '00-12-F0-13-1C-70', cache: '1 entrada (caduca)' }
    },
    {
      s: 'Gateway', k: 'ejemplo', t: 'Destino en otra red: el default gateway',
      b: '<p>Si la IP destino <b>no es de un vecino</b>, nadie en la LAN va a contestar por ella. El datagrama se le entrega al router, así que ARP se usa para averiguar <b>la MAC del router</b>.</p><p>El <b>default gateway</b> (puerta de enlace predeterminada) suele ser la IP del router que conecta la red interna con una red externa (Internet).</p><p>Generalmente la IP del host se asigna automáticamente a través del router (DHCP), y por eso el gateway suele ser una variación de la propia dirección.</p>',
      key: 'Para salir de la red se pregunta por la MAC del default gateway, no por la del destino final.',
      scene: 'lan', hi: ['R'], tags: { A: 'destino 24.32.218.197', R: 'default gateway' },
      pk: [{ p: ['A', 'SW', 'R'], l: 'ARP request', c: 'req', d: 1.2 }, { p: ['R', 'SW', 'A'], l: 'ARP reply', c: 'res', d: 1.2 }, { p: ['A', 'SW', 'R', 'NET'], l: 'datagrama IP', c: 'data', d: 2.2 }],
      tbl: { x: 222, y: 300, w: 230, title: 'Caché ARP de A', cols: ['IP', 'MAC'], rows: [['10.200.128.1', '00-12-F0-13-1C-70'], ['10.200.128.254', 'MAC del router']], hi: 1 },
      st: { dst: '24.32.218.197', mac: 'la del router', cache: '2 entradas' }
    },
    {
      s: 'Sin ARP', k: 'detalle', t: 'Broadcast y multicast: no se pregunta',
      b: '<p><b>Broadcast</b>: nadie tiene la dirección 255.255.255.255, así que no tiene sentido preguntar por ella. El datagrama se encapsula en una trama con MAC destino <b>todos unos</b>: un broadcast IP se mapea a un broadcast Ethernet.</p><p><b>Multicast</b>: tampoco la tiene nadie. La MAC destino <b>se arma</b> con un <b>prefijo reservado</b> para tráfico multicast (01-00-5E) seguido de los <b>últimos bits de la IP</b> que se intenta alcanzar.</p>',
      key: 'Para broadcast y multicast la MAC destino se calcula a partir de la IP, sin enviar ningún ARP.',
      fig: 'image72.png', scene: 'mc', title: 'IP multicast 224.0.0.252: se copian sus últimos 23 bits', ip: '224.0.0.252', hiBits: [9, 31],
      lines: [{ l: 'IP broadcast', v: '255.255.255.255' }, { l: 'MAC destino', v: 'FF-FF-FF-FF-FF-FF', hi: 1 }, { l: 'IP multicast', v: '224.0.0.252' }, { l: 'MAC destino', v: '01-00-5E-00-00-FC', hi: 1 }],
      bars: [{ title: 'MAC multicast (48 bits) = prefijo reservado + un 0 + últimos 23 bits de la IP', span: [0, 47], blocks: [{ a: 0, b: 23, l: '01-00-5E · prefijo multicast (24 bits)', c: 'purple' }, { a: 24, b: 24, l: '0', c: 'gray' }, { a: 25, b: 47, l: '00-00-FC · 23 bits de la IP', c: 'red', hi: 1 }] }],
      st: { dst: 'broadcast / multicast', mac: 'se calcula', cache: 'no se usa' }
    },
    {
      s: 'Formato', k: 'detalle', t: 'El mensaje ARP, campo por campo',
      b: '<ul><li><b>Hardware type</b>: 1 si es Ethernet. <b>Protocol type</b>: 0x0800 si es IP.</li><li><b>Longitudes</b>: 6 bytes la dirección física (Ethernet) y 4 la lógica (IP).</li><li><b>Operación</b>: ARP request, ARP reply, RARP request o RARP reply.</li><li><b>Emisor</b>: MAC e IP de quien envía el mensaje.</li><li><b>Destino</b>: la IP de la que se quiere averiguar la MAC, y la dirección física del destino, que es justamente lo que se busca.</li></ul>',
      key: 'El request lleva la IP buscada y deja vacía la MAC del destino; el reply la trae completa.',
      fig: 'image73.png', scene: 'arpmsg',
      det: 'En el request de A: <b>operación = 1</b>, emisor = MAC de A y 10.200.128.10, dirección lógica del destino = <b>10.200.128.1</b>. Códigos de operación: 1 ARP request · 2 ARP reply · 3 RARP request · 4 RARP reply.',
      st: { dst: '10.200.128.1', mac: 'FF-FF-FF-FF-FF-FF', cache: '—' }
    },
    {
      s: 'Gratuito', k: 'detalle', t: 'ARP gratuito: preguntar por uno mismo',
      b: '<p>Un <b>ARP gratuito</b> es un host que <b>pregunta por sí mismo</b>: envía un request consultando por su propia IP.</p><p>Es el mismo proceso de siempre (un broadcast a todos), pero el objetivo es otro: <b>verificar que la IP que tiene no esté en uso</b>.</p><p>Si <b>alguien responde</b>, la IP ya está en uso, y no puede haber dos IP iguales en la red.</p>',
      key: 'En un ARP gratuito lo bueno es que nadie conteste.',
      scene: 'dup', hi: ['N', 'B'], tags: { N: '¿quién tiene 10.200.128.1?', B: 'yo: ya está en uso', C: 'no es mi IP' },
      pk: [{ p: ['N', 'SW'], l: 'ARP gratuito', c: 'req', d: 1 }, { p: ['SW', 'B'], l: 'request', c: 'req', d: 1 }, { p: ['SW', 'C'], l: 'request', c: 'req', d: 1, par: 1 }, { p: ['B', 'SW', 'N'], l: 'ARP reply', c: 'bad', d: 1.8, stay: 1 }],
      notes: [{ x: 150, y: 318, w: 300, c: 'yellow', text: 'Si <b>nadie</b> responde, la dirección está libre y el host la usa. Si llega un reply, hay una <b>IP duplicada</b>.' }],
      st: { dst: 'su propia IP', mac: 'FF-FF-FF-FF-FF-FF', cache: '—' }
    },
    {
      s: 'En la trama', k: 'detalle', t: 'ARP adentro de Ethernet: tipo 0x0806',
      b: '<p>ARP no viaja dentro de un datagrama IP: va <b>directamente en la trama Ethernet</b>.</p><p>El campo <b>tipo</b> se completa con <b>0x0806</b> para indicar que lo que sigue es un mensaje ARP (un datagrama IP lleva 0x0800).</p><p>Como el mensaje ARP solo tiene <b>28 bytes</b> y el campo de datos de Ethernet necesita al menos 46, se completa con un <b>pad</b> (relleno) de <b>18 bytes</b>.</p>',
      key: '28 bytes de ARP + 18 de relleno = los 46 bytes mínimos de datos de una trama Ethernet.',
      fig: 'image74.png', scene: 'tramaArp', hi: ['tp', 'arp', 'pad'],
      det: '<b>6 + 6 + 2 + 28 + 18 + 4 = 64 bytes</b>: la trama mínima de Ethernet. En un request la MAC destino es la de broadcast; en un reply, la del host que preguntó.',
      st: { dst: '—', mac: 'broadcast o unicast', cache: '—' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'ARP en una mirada',
      b: '<ul><li>La trama necesita una <b>MAC destino</b>; ARP la obtiene a partir de la IP.</li><li>Vecino → <b>entrega directa</b>. Otra red → MAC del <b>default gateway</b>.</li><li><b>Request</b> en broadcast, <b>reply</b> en unicast, resultado en <b>caché</b> que caduca.</li><li>Broadcast y multicast IP <b>no usan ARP</b>: la MAC se calcula.</li><li><b>ARP gratuito</b>: detectar una IP duplicada.</li><li>En Ethernet: tipo <b>0x0806</b>, 28 bytes + 18 de pad.</li></ul><p>Ya sabemos entregarle la trama al vecino o al router. Falta ver cómo se decide <b>cuál es el próximo salto</b>: en la próxima lección, Ruteo y la <b>tabla de ruteo</b>.</p>',
      scene: 'lan', tags: { A: '¿quién tiene 10.200.128.1?', B: 'soy 00-12-F0-13-1C-70' },
      pk: [{ p: ['A', 'SW', 'B'], l: 'ARP request', c: 'req', d: 1.4 }, { p: ['B', 'SW', 'A'], l: 'ARP reply', c: 'res', d: 1.4 }, { p: ['A', 'SW', 'B'], l: 'datagrama IP', c: 'data', d: 1.4 }],
      st: { dst: '10.200.128.1', mac: '00-12-F0-13-1C-70', cache: '1 entrada (caduca)' }
    }
  ],
  quiz: [
    { q: '¿Cómo viajan el ARP request y el ARP reply?', o: ['Los dos en broadcast', 'El request en broadcast y el reply en unicast', 'El request en unicast y el reply en broadcast', 'Los dos en unicast'], a: 1, why: 'Se pregunta a todos porque no se conoce la MAC; el que tiene la IP le contesta solo al que preguntó.' },
    { q: 'El host A quiere enviar un datagrama a una IP que no pertenece a su red. ¿La MAC de quién necesita averiguar con ARP?', o: ['La del host destino final', 'La del switch', 'La del router (default gateway)', 'Ninguna: usa la MAC de broadcast'], a: 2, why: 'Si el destino no es un vecino, la trama se le entrega al router para que saque el datagrama de la red.' },
    { q: 'Un host envía un datagrama a 255.255.255.255. ¿Qué hace con ARP?', o: ['Envía un ARP request por 255.255.255.255', 'No usa ARP: encapsula en una trama con MAC destino todos unos', 'Le pregunta la MAC al router', 'Usa la última entrada de su caché'], a: 1, why: 'Nadie tiene esa dirección: el broadcast IP se mapea directamente al broadcast Ethernet (FF-FF-FF-FF-FF-FF).' },
    { q: '¿Para qué sirve un ARP gratuito?', o: ['Para renovar la caché de los vecinos cada minuto', 'Para averiguar la MAC del default gateway', 'Para verificar que la propia IP no esté en uso por otro host', 'Para obtener una IP por DHCP'], a: 2, why: 'El host pregunta por su propia IP; si alguien responde, esa dirección ya está en uso.' }
  ],
  cheat: [
    ['ARP', 'Address Resolution Protocol: obtiene la <b>MAC</b> a partir de una <b>IP</b> para poder armar la trama.'],
    ['Entrega directa / al router', 'Destino vecino → su MAC. Destino en otra red → MAC del router (default gateway).'],
    ['Request / Reply', 'Request en <b>broadcast</b> («¿quién tiene 10.200.128.1?»); reply en <b>unicast</b> con la MAC.'],
    ['Caché ARP', 'Guarda la asociación IP → MAC por un intervalo corto; al caducar se borra y se vuelve a preguntar.'],
    ['Broadcast y multicast', 'Sin ARP. Broadcast → MAC todos unos. Multicast → prefijo reservado 01-00-5E + últimos 23 bits de la IP.'],
    ['Mensaje ARP', '28 bytes: hardware type (1), protocol type (0x0800), longitudes (6 y 4), operación, MAC e IP del emisor, MAC e IP del destino.'],
    ['ARP gratuito', 'El host pregunta por su propia IP: si alguien responde, la IP está duplicada.'],
    ['En Ethernet', 'Tipo <b>0x0806</b>; 28 bytes de ARP + 18 de pad = 46 bytes de datos.']
  ]
});

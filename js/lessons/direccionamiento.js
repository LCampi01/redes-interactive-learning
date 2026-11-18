COURSE.add({
  id: 'direccionamiento',
  title: 'Direccionamiento IP',
  desc: 'Cómo se identifica a cada dispositivo en Internet: los 32 bits de una dirección IP, qué parte nombra a la red y cuál al host, para qué sirve la máscara y cómo se repartió el espacio de direcciones.',
  min: 11, level: 'Inicial',
  learn: [
    'Por qué hace falta una dirección IP además de la MAC',
    'Cómo se lee una dirección de 32 bits y qué indica la máscara',
    'Qué significan la dirección de red y la de broadcast (y por qué quedan 254 hosts)',
    'Cómo repartió la IANA el espacio en clases A, B, C, D y E',
    'Qué son las direcciones privadas (RFC 1918) y el direccionamiento classless con prefijos'
  ],
  stats: [{ k: 'ip', l: 'Dirección' }, { k: 'mask', l: 'Máscara' }, { k: 'red', l: 'Red' }, { k: 'hosts', l: 'Hosts útiles' }],
  legend: [['req', 'ida / tráfico dentro de la LAN'], ['res', 'respuesta / tráfico que sale'], ['bad', 'descartado']],
  scenes: {
    carta: {
      kind: 'topo',
      nodes: [
        { id: 'A', t: 'pc', x: 90, y: 190, l: 'A (origen)', sub: '200.10.1.100' },
        { id: 'R1', t: 'router', x: 245, y: 190, l: 'Router' },
        { id: 'NET', t: 'cloud', x: 400, y: 190, l: 'Otras redes' },
        { id: 'R2', t: 'router', x: 555, y: 190, l: 'Router' },
        { id: 'B', t: 'server', x: 710, y: 190, l: 'B (destino)', sub: '24.32.218.197' }
      ],
      links: [{ a: 'A', b: 'R1' }, { a: 'R1', b: 'NET' }, { a: 'NET', b: 'R2' }, { a: 'R2', b: 'B' }]
    },
    lan: {
      kind: 'topo',
      zones: [{ id: 'z', x: 40, y: 62, w: 510, h: 320, l: 'Red 200.10.1 (la misma calle)', c: 'green' }],
      nodes: [
        { id: 'H1', t: 'pc', x: 120, y: 150, l: 'Host 100', sub: '200.10.1.100' },
        { id: 'H2', t: 'pc', x: 270, y: 150, l: 'Host 101', sub: '200.10.1.101' },
        { id: 'H3', t: 'pc', x: 420, y: 150, l: 'Host 102', sub: '200.10.1.102' },
        { id: 'SW', t: 'switch', x: 270, y: 310, l: 'Switch' },
        { id: 'R', t: 'router', x: 480, y: 310, l: 'Router' },
        { id: 'NET', t: 'cloud', x: 690, y: 310, l: 'Otras redes' }
      ],
      links: [{ a: 'H1', b: 'SW' }, { a: 'H2', b: 'SW' }, { a: 'H3', b: 'SW' }, { a: 'SW', b: 'R' }, { a: 'R', b: 'NET' }]
    },
    priv: {
      kind: 'topo',
      zones: [
        { id: 'z1', x: 30, y: 62, w: 215, h: 320, l: 'Empresa 1', c: 'blue' },
        { id: 'z2', x: 555, y: 62, w: 215, h: 320, l: 'Empresa 2', c: 'purple' }
      ],
      nodes: [
        { id: 'P1', t: 'pc', x: 105, y: 160, l: 'PC', sub: '192.168.0.10' },
        { id: 'R1', t: 'router', x: 200, y: 310, l: 'Router' },
        { id: 'NET', t: 'cloud', x: 400, y: 310, l: 'Internet' },
        { id: 'R2', t: 'router', x: 600, y: 310, l: 'Router' },
        { id: 'P2', t: 'pc', x: 695, y: 160, l: 'PC', sub: '192.168.0.10' }
      ],
      links: [{ a: 'P1', b: 'R1' }, { a: 'R1', b: 'NET' }, { a: 'NET', b: 'R2' }, { a: 'R2', b: 'P2' }]
    },
    ip: { kind: 'bits' }
  },
  steps: [
    {
      s: 'La carta', k: 'contexto', t: 'Direccionar: como escribir una carta',
      b: '<p><b>IP</b>, como protocolo de capa 3, resuelve dos cosas: <b>direccionamiento</b> y <b>encaminamiento</b>.</p><p>El direccionamiento permite conectarse con un destino que está <b>en otra red</b>. Hacen falta dos datos: la <b>dirección destino</b> y la <b>dirección origen</b>, para que la respuesta pueda volver.</p><p>Es como una carta: de un lado se escribe quién es el destinatario y dónde se ubica; del otro, quién soy yo y dónde me ubico.</p>',
      key: 'Cada datagrama lleva un identificador único del emisor y otro del destinatario.',
      scene: 'carta', hi: ['A', 'B'], tags: { A: 'remitente', B: 'destinatario' },
      pk: [{ p: ['A', 'R1', 'NET', 'R2', 'B'], l: 'para B · de A', c: 'req', d: 2.4 }, { p: ['B', 'R2', 'NET', 'R1', 'A'], l: 'para A · de B', c: 'res', d: 2.4 }],
      notes: [{ x: 200, y: 300, w: 400, c: 'yellow', text: 'La dirección <b>destino</b> permite llegar; la dirección <b>origen</b> es la que permite contestar. Las dos viajan en la cabecera de cada datagrama.' }],
      st: { ip: '—', mask: '—', red: '—', hosts: '—' }
    },
    {
      s: '32 bits', k: 'idea', t: 'Un identificador de 32 bits',
      b: '<p>El identificador elegido tiene <b>32 bits</b>: unos 4.300 millones de combinaciones. IP nació para un pedido del Departamento de Defensa de EE. UU.; nadie imaginaba que iba a ser el protocolo de Internet, y 32 bits parecían cubrir cualquier necesidad futura.</p><p>Se escribe como <b>4 bytes separados por puntos</b>, cada uno con su valor <b>decimal</b> (0 a 255): por ejemplo <code>24.32.218.197</code>.</p><p>Así todos tienen un identificador diferente, sin ambigüedad.</p>',
      key: 'Una dirección IPv4 son 32 bits; la notación con puntos es solo una forma cómoda de escribirlos.',
      scene: 'ip', title: 'Una dirección IP, bit por bit', ip: '24.32.218.197', hiBits: [0, 7],
      lines: [{ l: 'Longitud', v: '32 bits' }, { l: 'Se escribe como', v: '4 octetos en decimal' }, { l: 'Cada octeto', v: '0 a 255' }, { l: 'Direcciones posibles', v: '2^32 ≈ 4.300 millones', hi: 1 }],
      notes: [{ x: 150, y: 228, w: 500, c: 'yellow', text: 'Cada grupo de 8 bits se escribe con su valor decimal. El primero: <b>00011000</b> = 16 + 8 = <b>24</b>. El último: <b>11000101</b> = 128 + 64 + 4 + 1 = <b>197</b>.' }],
      st: { ip: '24.32.218.197' }
    },
    {
      s: 'Red y host', k: 'idea', t: 'Dos partes: red y host',
      b: '<p>Dentro de la LAN las estaciones se hablan por <b>MAC address</b>. Pero la MAC <b>no sirve para comunicarse con dispositivos fuera de la red</b>: cada estación necesita, además, una dirección IP para poder salir y que le vuelvan las respuestas.</p><p>Los 32 bits tienen dos partes:</p><ul><li><b>Red</b>: igual para todos los dispositivos de la misma red.</li><li><b>Host</b> (todo dispositivo direccionable): distinto para cada uno.</li></ul><p>Como en una calle: todas las casas comparten la calle y cada una tiene su número.</p>',
      key: 'Mismo identificador de red para todos; identificador de host distinto para cada uno.',
      fig: 'image60.png', scene: 'lan', hi: ['z'],
      pk: [{ p: ['H1', 'SW', 'H2'], l: 'por MAC', c: 'req', d: 1.6 }, { p: ['H3', 'SW', 'R', 'NET'], l: 'necesita IP', c: 'res', d: 2.2 }],
      notes: [{ x: 575, y: 90, w: 195, c: 'yellow', text: '<b>Calle</b> = red: 200.10.1<br><b>Número</b> = host: 100, 101, 102<br>No puede haber dos casas con el mismo número.' }],
      st: { ip: '200.10.1.100', red: '200.10.1' }
    },
    {
      s: 'Máscara', k: 'mecanismo', t: 'La máscara marca la frontera',
      b: '<p>La <b>máscara</b> dice qué parte de la dirección es red y qué parte es host. Tiene <b>32 bits</b>, igual que la IP: a cada bit de la dirección le corresponde un bit de la máscara.</p><p>Regla: los <b>unos van todos seguidos al principio</b> (red) y los <b>ceros todos seguidos al final</b> (host). No puede haber unos intercalados.</p><p>Si los tres primeros octetos son de red, cada uno vale 11111111 = 255 y el último 00000000 = 0: <code>255.255.255.0</code>. En <code>200.10.1.100</code>, <b>200.10.1</b> es la red y <b>100</b> el host.</p>',
      key: 'Bit de máscara en 1 → ese bit de la IP es de red. En 0 → es de host.',
      fig: 'image61.png', scene: 'ip', title: 'IP y máscara, alineadas bit a bit', ip: '200.10.1.100', mask: 24,
      lines: [{ l: 'Dirección IP', v: '200.10.1.100' }, { l: 'Máscara', v: '255.255.255.0', hi: 1 }, { l: 'Parte de red', v: '200.10.1' }, { l: 'Parte de host', v: '100' }],
      notes: [{ x: 150, y: 290, w: 500, c: 'yellow', text: 'Al configurar una IP en un dispositivo, siempre se pide también la <b>máscara de subred</b>: sin ella no se sabe dónde termina la red y dónde empieza el host.' }],
      st: { ip: '200.10.1.100', mask: '255.255.255.0', red: '200.10.1' }
    },
    {
      s: 'Red y bcast', k: 'detalle', t: 'Todo ceros es la red, todo unos es broadcast',
      b: '<p>Todos los hosts de la red empiezan con <b>200.10.1</b>; lo que cambia son los últimos 8 bits: 256 combinaciones (0 a 255).</p><p>Dos de ellas no se pueden asignar a un dispositivo:</p><ul><li>Host <b>todo en 0</b> (<code>200.10.1.0</code>): identifica a <b>la red</b> como un todo.</li><li>Host <b>todo en 1</b> (<code>200.10.1.255</code>): es el <b>broadcast</b>.</li></ul><p>Quedan <b>254 direcciones válidas</b> para usar dentro de la red.</p>',
      key: 'Hosts útiles = 2 elevado a la cantidad de bits de host, menos 2.',
      scene: 'ip', ip: '200.10.1.255', mask: 24, hiBits: [24, 31],
      lines: [{ l: 'Host todo en 0', v: '200.10.1.0 (red)' }, { l: 'Host todo en 1', v: '200.10.1.255 (bcast)', hi: 1 }, { l: 'Combinaciones', v: '2^8 = 256' }, { l: 'Hosts útiles', v: '256 − 2 = 254' }],
      blocksTitle: 'Último octeto de la red 200.10.1', blocks: [{ a: 1, b: 254, l: '.1 … .254 → 254 direcciones para hosts', c: 'green' }],
      notes: [{ x: 40, y: 340, w: 230, c: 'blue', text: '<b>.0</b> queda reservada: nombra a la red completa.' }, { x: 530, y: 340, w: 230, c: 'red', text: '<b>.255</b> queda reservada: es el broadcast de la red.' }],
      st: { hosts: '254' }
    },
    {
      s: 'IANA', k: 'contexto', t: 'La IANA parte el espacio por la mitad',
      b: '<p>Con Internet se creó la <b>IANA</b>, que administra el espacio de direcciones IPv4: una empresa decía cuántos dispositivos tenía y recibía una dirección de red.</p><p>Para repartir, la IANA <b>parte el espacio en bloques</b>, siempre por la mitad. Las direcciones que empiezan con el bit <b>0</b> son la <b>clase A</b>. La mitad que empieza con 1 se vuelve a partir: <b>10</b> es clase <b>B</b>; después <b>110</b> es <b>C</b>, <b>1110</b> es <b>D</b> y <b>1111</b> es <b>E</b>.</p>',
      key: 'Con mirar el primer octeto se sabe la clase: A 0–127, B 128–191, C 192–223.',
      fig: 'image62.png', scene: 'ip', title: 'Espacio IPv4 según el valor del primer octeto (0 a 255)',
      bars: [
        { title: '1 · Primer bit', h: 30, blocks: [{ a: 0, b: 127, l: 'empieza con 0 → clase A', c: 'green' }, { a: 128, b: 255, l: 'empieza con 1', c: 'gray' }] },
        { title: '2 · La mitad del 1 se parte otra vez', h: 30, blocks: [{ a: 0, b: 127, l: 'A', c: 'green' }, { a: 128, b: 191, l: '10 → clase B', c: 'blue' }, { a: 192, b: 255, l: 'empieza con 11', c: 'gray' }] },
        { title: '3 · Y otra vez', h: 30, blocks: [{ a: 0, b: 127, l: 'A', c: 'green' }, { a: 128, b: 191, l: 'B', c: 'blue' }, { a: 192, b: 223, l: '110 → C', c: 'yellow' }, { a: 224, b: 255, l: '111…', c: 'gray' }] },
        { title: '4 · Resultado: cinco clases', h: 30, blocks: [{ a: 0, b: 127, l: 'A · 0', c: 'green', hi: 1 }, { a: 128, b: 191, l: 'B · 10', c: 'blue', hi: 1 }, { a: 192, b: 223, l: 'C · 110', c: 'yellow', hi: 1 }, { a: 224, b: 239, l: 'D', c: 'purple', hi: 1 }, { a: 240, b: 255, l: 'E', c: 'red', hi: 1 }] }
      ],
      st: { ip: '—', mask: 'según la clase', red: '—', hosts: '—' }
    },
    {
      s: 'Clases', k: 'detalle', t: 'Clases A, B, C, D y E',
      b: '<p>Cada clase fija cuántos bits son de red y cuántos de host:</p><ul><li><b>A</b> (redes grandes): 8 de red y 24 de host. Con el primer bit fijo quedan 2⁷ redes.</li><li><b>B</b> (medianas): 16 y 16. Dos bits fijos → 2¹⁴ redes.</li><li><b>C</b> (chicas): 24 y 8. Tres bits fijos → 2²¹ redes de 2⁸ direcciones.</li><li><b>D</b>: multicast. <b>E</b>: reservada para uso futuro.</li></ul>',
      key: 'Cuantos más bits se usan para la red, más redes hay y más chica es cada una.',
      fig: ['image63.png', 'image64.png'], scene: 'ip', title: 'Los 32 bits de cada clase (bit 0 a bit 31)',
      bars: [
        { title: 'Clase A · primer octeto 0 – 127 · 2^7 = 128 redes · 2^24 ≈ 16 millones de hosts por red', h: 26, span: [0, 31], blocks: [{ a: 0, b: 0, l: '0', c: 'gray' }, { a: 1, b: 7, l: 'red · 7 bits', c: 'green' }, { a: 8, b: 31, l: 'host · 24 bits', c: 'blue' }] },
        { title: 'Clase B · 128 – 191 · 2^14 ≈ 16 mil redes · 2^16 ≈ 64 mil hosts por red', h: 26, span: [0, 31], blocks: [{ a: 0, b: 1, l: '10', c: 'gray' }, { a: 2, b: 15, l: 'red · 14 bits', c: 'green' }, { a: 16, b: 31, l: 'host · 16 bits', c: 'blue' }] },
        { title: 'Clase C · 192 – 223 · 2^21 ≈ 2 millones de redes · 2^8 = 256 hosts por red', h: 26, span: [0, 31], blocks: [{ a: 0, b: 2, l: '110', c: 'gray' }, { a: 3, b: 23, l: 'red · 21 bits', c: 'green' }, { a: 24, b: 31, l: 'host · 8 bits', c: 'blue' }] },
        { title: 'Clase D · 224 – 239 · multicast', h: 26, span: [0, 31], blocks: [{ a: 0, b: 3, l: '1110', c: 'gray' }, { a: 4, b: 31, l: 'dirección multicast · 28 bits', c: 'purple' }] },
        { title: 'Clase E · 240 – 255 · reservada para uso futuro', h: 26, span: [0, 31], blocks: [{ a: 0, b: 3, l: '1111', c: 'gray' }, { a: 4, b: 31, l: 'reservado', c: 'red' }] }
      ]
    },
    {
      s: 'Privadas', k: 'problema', t: 'Se acaban las direcciones: RFC 1918',
      b: '<p>Los pedidos crecen y cada vez quedan menos direcciones disponibles. La respuesta es la <b>RFC 1918</b>: se reservan bloques de clase A, B y C para <b>uso privado</b>.</p><p>Cualquier empresa puede usarlos libremente para armar sus redes TCP/IP internas.</p><p>A cambio, esas direcciones <b>no pueden ingresar a Internet</b>: ahí hay que respetar la unicidad, y habrá muchas empresas que repiten las mismas.</p>',
      key: 'Una dirección privada puede repetirse en miles de redes; por eso no puede circular por Internet.',
      fig: 'image65.png', scene: 'priv', hi: ['P1', 'P2'], tags: { P1: 'IP privada', P2: 'la misma IP' },
      pk: [{ p: ['P1', 'R1', 'NET'], l: 'origen privado', c: 'bad', d: 2.2, drop: 1, dropAt: .82 }],
      tbl: { x: 276, y: 70, w: 230, title: 'RFC 1918 · no entran a Internet', cols: ['Prefijo', 'Rango'], rows: [['10/8', '10.0.0.0 – 10.255.255.255'], ['172.16/12', '172.16.0.0 – 172.31.255.255'], ['192.168/16', '192.168.0.0 – 192.168.255.255']], hi: 2 },
      st: { ip: '192.168.0.10', mask: '—', red: 'privada', hosts: '—' }
    },
    {
      s: 'Classless', k: 'idea', t: 'Sin clases: el prefijo',
      b: '<p>Después se decide <b>eliminar las clases</b>: es el direccionamiento <b>classless</b>. La IANA ya no está atada a identificadores de red de 8, 16 o 24 bits: puede entregar, por ejemplo, un bloque con <b>22 bits</b> de red.</p><p>Se gana flexibilidad: un bloque puede ser un fragmento de una clase, o juntar fragmentos de más de una.</p><p>A los bits fijos se los llama <b>prefijo</b> (prefix). La máscara da la <b>longitud del prefijo</b>, que se escribe <code>/22</code>.</p>',
      key: 'Prefijo = los bits fijos de un bloque. Su longitud es la cantidad de unos de la máscara.',
      scene: 'ip', title: 'Un bloque con prefijo de 22 bits', ip: '200.10.4.0', mask: 22, hiBits: [0, 21],
      lines: [{ l: 'Bloque', v: '200.10.4.0/22', hi: 1 }, { l: 'Longitud del prefijo', v: '22 bits fijos' }, { l: 'Máscara', v: '255.255.252.0' }, { l: 'Bits de host', v: '2^10 − 2 = 1022' }],
      notes: [{ x: 150, y: 290, w: 500, c: 'yellow', text: 'Con clases, la frontera red / host solo podía caer en el bit 8, 16 o 24. Con classless puede caer en <b>cualquier bit</b>: acá, en la mitad del tercer octeto.' }],
      st: { ip: '200.10.4.0', mask: '255.255.252.0 (/22)', red: '200.10.4.0/22', hosts: '1022' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'Direccionamiento IP en una mirada',
      b: '<ul><li>Dirección IP: <b>32 bits</b>, 4 octetos en decimal.</li><li>Dos partes: <b>red</b> (común) y <b>host</b> (único). La <b>máscara</b> marca la frontera con unos contiguos.</li><li>Host todo 0 = <b>la red</b>; todo 1 = <b>broadcast</b>. Útiles: 2ⁿ − 2.</li><li>Clases <b>A, B, C</b> (0, 10, 110), D multicast, E reservada.</li><li><b>RFC 1918</b>: direcciones privadas que no entran a Internet.</li><li><b>Classless</b>: prefijos de cualquier longitud.</li></ul><p>Si el prefijo puede tener cualquier largo, también podemos alargarlo nosotros: en la próxima lección partimos un bloque en <b>subredes</b>.</p>',
      scene: 'ip', title: 'El ejemplo completo', ip: '200.10.1.100', mask: 24,
      lines: [{ l: 'Red', v: '200.10.1.0/24', hi: 1 }, { l: 'Host (útiles .1 – .254)', v: '.100' }, { l: 'Broadcast', v: '200.10.1.255' }, { l: 'Clase original', v: 'C (empieza con 110)' }],
      blocksTitle: 'Primer octeto: 200 cae en el bloque de la clase C',
      blocks: [{ a: 0, b: 127, l: 'A', c: 'green' }, { a: 128, b: 191, l: 'B', c: 'blue' }, { a: 192, b: 223, l: 'C', c: 'yellow', hi: 1 }, { a: 224, b: 239, l: 'D', c: 'purple' }, { a: 240, b: 255, l: 'E', c: 'red' }],
      st: { ip: '200.10.1.100', mask: '255.255.255.0 (/24)', red: '200.10.1.0/24', hosts: '254' }
    }
  ],
  quiz: [
    { q: 'Un host tiene la IP 200.10.1.100 con máscara 255.255.255.0. ¿Cuál es la parte de red y cuál la de host?', o: ['Red 200 · host 10.1.100', 'Red 200.10 · host 1.100', 'Red 200.10.1 · host 100', 'Red 200.10.1.100 · no tiene parte de host'], a: 2, why: 'La máscara tiene 24 unos seguidos: los tres primeros octetos son de red y el último es el host.' },
    { q: 'En esa misma red, ¿cuántas direcciones se pueden asignar a dispositivos?', o: ['256', '255', '254', '128'], a: 2, why: 'Con 8 bits de host hay 256 combinaciones, pero todo 0 identifica a la red y todo 1 es el broadcast: quedan 254.' },
    { q: 'Una dirección empieza con los bits 10 (primer octeto entre 128 y 191). ¿A qué clase pertenece?', o: ['Clase A', 'Clase B', 'Clase C', 'Clase D'], a: 1, why: 'La clase A empieza con 0, la B con 10, la C con 110 y la D con 1110. La B usa 16 bits de red y 16 de host.' },
    { q: '¿Qué caracteriza a las direcciones de la RFC 1918, como 192.168.0.10?', o: ['Son las únicas que pueden usarse en Internet', 'Cualquiera puede usarlas en su red interna, pero no pueden ingresar a Internet', 'Están reservadas para multicast', 'Solo las puede asignar la IANA a empresas grandes'], a: 1, why: 'Son bloques de uso privado: se repiten en muchas redes internas, así que no cumplen la unicidad que exige Internet.' }
  ],
  cheat: [
    ['Dirección IP', '32 bits en 4 octetos decimales (0–255). Unas 4.300 millones de combinaciones.'],
    ['Red y host', 'La parte de <b>red</b> es común a todos los dispositivos de la red; la de <b>host</b> es única para cada uno.'],
    ['Máscara', '32 bits: unos contiguos al principio (red) y ceros al final (host). Ej.: 255.255.255.0 = /24.'],
    ['Red y broadcast', 'Host todo 0 = la red; host todo 1 = broadcast. Hosts útiles = 2ⁿ − 2 (con 8 bits: 254).'],
    ['Clases', '<b>A</b> 0… (0–127, /8) · <b>B</b> 10… (128–191, /16) · <b>C</b> 110… (192–223, /24) · <b>D</b> 1110 multicast · <b>E</b> 1111 reservada.'],
    ['Redes por clase', 'A: 2⁷ redes de 2²⁴ hosts · B: 2¹⁴ de 2¹⁶ · C: 2²¹ de 2⁸.'],
    ['RFC 1918', 'Privadas: 10/8, 172.16/12 y 192.168/16. No pueden ingresar a Internet.'],
    ['Classless / prefijo', 'Sin fronteras de clase: el prefijo (bits fijos) puede tener cualquier longitud, p. ej. /22.']
  ]
});

COURSE.add({
  id: 'dns',
  title: 'DNS: nombres en lugar de direcciones',
  desc: 'Nadie recuerda direcciones IP: recordamos nombres. Cómo se pasó de un archivo de texto a una base de datos distribuida y jerárquica, y qué consultas se disparan cada vez que escribimos un nombre.',
  min: 12, level: 'Intermedio',
  learn: [
    'Por qué el hostfile no alcanzaba y qué resuelve el esquema cliente-servidor (resolver y name server)',
    'Cómo se organiza el espacio de nombres: root, TLD, dominios, subdominios y FQDN',
    'Qué es una zona de autoridad y qué roles cumplen los servidores',
    'La diferencia entre consulta recursiva e iterativa, y el papel del caché y el TTL',
    'Qué son los resource records A, AAAA, MX y CNAME y cómo consultar con nslookup'
  ],
  stats: [{ k: 'q', l: 'Se busca' }, { k: 'tipo', l: 'Cómo se resuelve' }, { k: 'quien', l: 'Quién responde' }, { k: 'res', l: 'Resultado' }],
  legend: [['req', 'consulta recursiva'], ['ctl', 'consulta iterativa'], ['res', 'referencia / respuesta'], ['key', 'respuesta autoritativa']],
  scenes: {
    hosts: {
      kind: 'topo',
      nodes: [
        { id: 'V', t: 'pc', x: 90, y: 115, l: 'VERDE', c: 'green' },
        { id: 'RJ', t: 'pc', x: 90, y: 305, l: 'ROJO', c: 'red' },
        { id: 'N', t: 'pc', x: 290, y: 345, l: 'NARANJA', c: 'orange' },
        { id: 'AZ', t: 'pc', x: 540, y: 345, l: 'AZUL', c: 'blue' },
        { id: 'SRI', t: 'server', x: 430, y: 155, l: 'Stanford (SRI)' }
      ],
      links: [{ a: 'V', b: 'SRI', dash: 1 }, { a: 'RJ', b: 'SRI', dash: 1 }, { a: 'N', b: 'SRI', dash: 1 }, { a: 'AZ', b: 'SRI', dash: 1 }]
    },
    cs: {
      kind: 'topo',
      nodes: [
        { id: 'DH', t: 'server', x: 130, y: 100, l: 'Servidor DHCP', c: 'yellow' },
        { id: 'PC', t: 'pc', x: 130, y: 280, l: 'Resolver', sub: 'el cliente DNS' },
        { id: 'NS', t: 'dns', x: 640, y: 280, l: 'Name server', sub: '181.45.64.77' }
      ],
      links: [{ a: 'DH', b: 'PC', dash: 1 }, { a: 'PC', b: 'NS' }]
    },
    arbol: {
      kind: 'topo',
      nodes: [
        { id: 'l0', t: 'txt', x: 24, y: 89, l: 'Root', anchor: 'start', c: 'gray' },
        { id: 'l1', t: 'txt', x: 24, y: 179, l: 'Top-level', anchor: 'start', c: 'gray' },
        { id: 'l2', t: 'txt', x: 24, y: 269, l: 'Second-level', anchor: 'start', c: 'gray' },
        { id: 'l3', t: 'txt', x: 24, y: 359, l: 'Subdominios', anchor: 'start', c: 'gray' },
        { id: 'root', t: 'state', x: 430, y: 85, l: '. (root)', c: 'green' },
        { id: 'com', t: 'state', x: 250, y: 175, l: 'com', c: 'yellow' },
        { id: 'edu', t: 'state', x: 370, y: 175, l: 'edu', c: 'yellow' },
        { id: 'org', t: 'state', x: 490, y: 175, l: 'org', c: 'yellow' },
        { id: 'ar', t: 'state', x: 610, y: 175, l: 'ar', c: 'yellow' },
        { id: 'goo', t: 'state', x: 190, y: 265, l: 'google.com', c: 'purple' },
        { id: 'ms', t: 'state', x: 315, y: 265, l: 'microsoft.com', c: 'purple' },
        { id: 'utn', t: 'state', x: 610, y: 265, l: 'utn.edu.ar', c: 'purple' },
        { id: 'frba', t: 'state', x: 550, y: 355, l: 'frba', c: 'blue' },
        { id: 'fra', t: 'state', x: 670, y: 355, l: 'fra', c: 'blue' }
      ],
      links: [{ a: 'root', b: 'com' }, { a: 'root', b: 'edu' }, { a: 'root', b: 'org' }, { a: 'root', b: 'ar' }, { a: 'com', b: 'goo' }, { a: 'com', b: 'ms' }, { a: 'ar', b: 'utn' }, { a: 'utn', b: 'frba' }, { a: 'utn', b: 'fra' }]
    },
    zona: {
      kind: 'topo',
      zones: [{ id: 'za', x: 262, y: 56, w: 500, h: 340, l: 'Zona de autoridad · utn.edu.ar', c: 'green' }],
      nodes: [
        { id: 'SUP', t: 'server', x: 110, y: 150, l: 'Servidor de .ar', sub: 'nivel superior', c: 'yellow' },
        { id: 'PRI', t: 'server', x: 370, y: 150, l: 'Primario', sub: 'archivo de zona local' },
        { id: 'SEC', t: 'server', x: 650, y: 150, l: 'Secundario', sub: 'copia del master' },
        { id: 'CO', t: 'dns', x: 110, y: 320, l: 'Caching-only', sub: 'no guarda zonas', c: 'gray' }
      ],
      links: [{ a: 'SUP', b: 'PRI', l: 'delega', arrow: 1 }, { a: 'PRI', b: 'SEC', arrow: 1 }]
    },
    res: {
      kind: 'seq',
      actors: [{ id: 'C', l: 'Resolver', t: 'pc' }, { id: 'L', l: 'DNS local', t: 'dns' }, { id: 'R', l: 'Root', t: 'server' }, { id: 'AR', l: '.ar', t: 'server' }, { id: 'U', l: 'utn.edu.ar', t: 'server' }],
      msgs: [
        { f: 'C', to: 'L', l: '¿frba.utn.edu.ar?', c: 'req' },
        { at: 'L', note: 'no lo tiene en caché', c: 'yellow' },
        { f: 'L', to: 'R', l: '¿frba.utn.edu.ar?', c: 'ctl' },
        { f: 'R', to: 'L', l: 'referencia: .ar', c: 'res' },
        { f: 'L', to: 'AR', l: '¿frba.utn.edu.ar?', c: 'ctl' },
        { f: 'AR', to: 'L', l: 'no la conozco; referencia: servidores de utn', c: 'res' },
        { f: 'L', to: 'U', l: '¿frba.utn.edu.ar?', c: 'ctl' },
        { f: 'U', to: 'L', l: 'respuesta autoritativa: tengo esa zona, esta es la IP', c: 'key' },
        { at: 'L', note: 'la guarda en caché', c: 'yellow' },
        { f: 'L', to: 'C', l: 'la IP pedida', c: 'res' }
      ]
    },
    net: {
      kind: 'topo',
      nodes: [
        { id: 'C1', t: 'pc', x: 100, y: 130, l: 'Cliente 1' },
        { id: 'C2', t: 'pc', x: 100, y: 310, l: 'Cliente 2' },
        { id: 'L', t: 'dns', x: 330, y: 220, l: 'DNS local' },
        { id: 'RT', t: 'server', x: 670, y: 95, l: 'Root' },
        { id: 'AR', t: 'server', x: 670, y: 220, l: '.ar' },
        { id: 'UT', t: 'server', x: 670, y: 345, l: 'utn.edu.ar' }
      ],
      links: [{ a: 'C1', b: 'L' }, { a: 'C2', b: 'L' }, { a: 'L', b: 'RT' }, { a: 'L', b: 'AR' }, { a: 'L', b: 'UT' }]
    },
    rr: {
      kind: 'topo',
      nodes: [
        { id: 'ra', t: 'box', x: 112, y: 92, w: 166, h: 52, l: 'A', sub: 'nombre → dirección IPv4', c: 'green' },
        { id: 'r4', t: 'box', x: 304, y: 92, w: 166, h: 52, l: 'AAAA', sub: 'nombre → dirección IPv6', c: 'blue' },
        { id: 'rm', t: 'box', x: 496, y: 92, w: 166, h: 52, l: 'MX', sub: 'dominio → sus mail servers', c: 'yellow' },
        { id: 'rc', t: 'box', x: 688, y: 92, w: 166, h: 52, l: 'CNAME', sub: 'alias: nombre → nombre', c: 'purple' }
      ],
      links: []
    },
    prac: {
      kind: 'topo',
      nodes: [
        { id: 'p1', t: 'box', x: 105, y: 96, w: 150, h: 52, l: 'Nombre a resolver', sub: 'sistemas', c: 'white' },
        { id: 'p2', t: 'box', x: 302, y: 96, w: 150, h: 52, l: 'Sufijos', sub: '+ .frba.utn.edu.ar', c: 'purple' },
        { id: 'p3', t: 'box', x: 499, y: 96, w: 150, h: 52, l: 'Hostfile local', sub: 'prevalece sobre el DNS', c: 'yellow' },
        { id: 'p4', t: 'box', x: 696, y: 96, w: 150, h: 52, l: 'Servidor DNS', sub: 'el configurado o 8.8.8.8', c: 'green' }
      ],
      links: [{ a: 'p1', b: 'p2', arrow: 1 }, { a: 'p2', b: 'p3', arrow: 1 }, { a: 'p3', b: 'p4', arrow: 1 }]
    }
  },
  steps: [
    {
      s: 'Hostfile', k: 'problema', t: 'Del nombre a la IP: el hostfile',
      b: '<p>Para acceder a un servidor es más cómodo usar un <b>nombre</b> que una dirección de 32 bits: escribimos www.google.com, no su IP.</p><p>Todo dispositivo tiene un <b>hostfile</b>: un archivo de texto con la asociación <b>estática</b> entre un nombre y una IP.</p><p>Originalmente Stanford mantenía ese archivo, y cada equipo lo descargaba por <b>FTP</b> para conocer los nombres con sus IPs.</p><p>La limitación: es un espacio <b>plano</b>, no puede haber dos nombres iguales.</p>',
      key: 'Un único archivo de texto para toda la red no escala: hacía falta otro esquema.',
      fig: 'image85.png', scene: 'hosts', hi: ['SRI'], tags: { SRI: 'un solo archivo' },
      pk: [{ p: ['V', 'SRI'], l: 'FTP', c: 'ctl', d: 1.5 }, { p: ['SRI', 'V'], l: 'hosts.txt', c: 'res', d: 1.5 }, { p: ['SRI', 'N'], l: 'hosts.txt', c: 'res', d: 1.5 }],
      tbl: { x: 570, y: 100, w: 200, title: 'Hosts.txt', rows: [['VERDE', '191.105.6.10'], ['ROJO', '202.131.6.200'], ['AZUL', '121.17.6.22'], ['NARANJA', '212.191.7.45']] },
      notes: [{ x: 600, y: 225, w: 180, c: 'yellow', text: 'Si alguien más quisiera llamarse <b>VERDE</b>, no podría: los nombres no se pueden repetir.' }],
      st: { q: 'VERDE', tipo: 'archivo de texto', quien: 'Stanford (por FTP)', res: '191.105.6.10' }
    },
    {
      s: 'Resolver', k: 'idea', t: 'Cliente-servidor: resolver y name server',
      b: '<p>El <b>DNS</b> (Domain Name System, RFC 1034 y 1035) reemplaza el archivo por un esquema <b>cliente-servidor</b> sobre una base de datos distribuida:</p><ul><li><b>Resolver</b>: el cliente. Envía el pedido de resolución de parte de la aplicación.</li><li><b>Name server</b>: recibe el pedido y resuelve el nombre a una dirección IP.</li></ul><p>El resolver tiene <b>configurado</b> un name server. La lista de servidores DNS se la da el <b>servidor DHCP</b> (los ofrece el proveedor) y se ve con <b>ipconfig</b>.</p>',
      key: 'El cliente no sabe resolver nombres: sabe a quién preguntarle.',
      fig: ['image86.png', 'image87.png'], scene: 'cs', hi: ['PC', 'NS'], tags: { NS: 'resuelve el nombre' },
      pk: [{ p: ['DH', 'PC'], l: 'tus DNS servers', c: 'key', d: 1.4 }, { p: ['PC', 'NS'], l: '¿www.google.com?', d: 1.7 }, { p: ['NS', 'PC'], l: 'su IP', c: 'res', d: 1.7, stay: 1 }],
      tbl: { x: 330, y: 80, w: 300, title: 'ipconfig /all', rows: [['DNS Servers . . . :', '181.45.64.77'], ['', '190.55.154.133'], ['', '181.47.248.145']], hi: 0 },
      st: { q: 'www.google.com', tipo: 'cliente-servidor', quien: 'el name server', res: 'su dirección IP' }
    },
    {
      s: 'Jerarquía', k: 'idea', t: 'Un espacio de nombres jerárquico',
      b: '<p>El espacio ya no es plano. Arriba está el <b>root</b>, que se representa con un <b>punto</b>. Debajo, los <b>top-level domains</b>: .com, .edu, .org y el código de cada país (.ar).</p><p>Cada nivel <b>delega el control</b>: los servidores raíz tienen referencia a los de .ar, que delegan en dominios de segundo nivel (utn.edu.ar), que a su vez tienen subdominios (frba, fra). Cada entidad es responsable de su dominio.</p><p>El nombre completo de un host es su <b>FQDN</b>: host.subdominio.dominio.tld<b>.</b></p>',
      key: 'Con el punto final el nombre está completo: se lee de derecha a izquierda, desde el root.',
      fig: 'image88.png', scene: 'arbol', hi: ['root', 'ar', 'utn', 'frba', 'root-ar', 'ar-utn', 'utn-frba'],
      notes: [{ x: 150, y: 312, w: 300, c: 'yellow', text: 'FQDN (Fully Qualified Domain Name):<br><b>sistemas.frba.utn.edu.ar.</b><br>host · subdominio · dominio · TLD · root' }],
      st: { q: 'sistemas.frba.utn.edu.ar.', tipo: 'jerarquía con delegación', quien: 'cada dominio', res: '—' }
    },
    {
      s: 'Zonas', k: 'detalle', t: 'Zonas de autoridad y roles de los servidores',
      b: '<p>Una <b>zona de autoridad</b> es la porción de dominio por la que un servidor es responsable. Ese servidor tiene el <b>archivo de zona</b>, con los resource records del dominio, y el nivel superior sabe cómo llegar a él. Un mismo server puede mantener muchas zonas.</p><ul><li><b>Primario</b>: guarda los archivos de zona localmente.</li><li><b>Secundario</b>: obtiene la zona de un <b>master</b> (que puede ser primario o secundario).</li><li><b>Caching-only</b>: no tiene zonas; solo guarda resultados de consultas.</li></ul>',
      key: 'Primario y secundario replican la zona para tener mayor disponibilidad.',
      scene: 'zona', hi: ['PRI'], tags: { PRI: 'responsable de la zona' },
      pk: [{ p: ['PRI', 'SEC'], l: 'copia de la zona', c: 'key', d: 1.8, stay: 1 }],
      tbl: { x: 285, y: 232, w: 300, title: 'Archivo de zona', cols: ['Nombre', 'Tipo', 'Dato'], rows: [['www', 'IN A', '200.69.225.145'], ['rhino', 'IN A', '200.26.65.12'], ['ftp', 'CNAME', 'rhino']] },
      notes: [{ x: 560, y: 240, w: 185, c: 'yellow', text: 'Los servidores DNS que da el proveedor suelen ser <b>caching-only</b>: atienden consultas de clientes, no alojan zonas.' }],
      st: { q: 'www', tipo: 'archivo de zona', quien: 'el servidor de la zona', res: '200.69.225.145' }
    },
    {
      s: 'Recursiva', k: 'mecanismo', t: 'La consulta del cliente es recursiva',
      b: '<p>El resolver le pregunta a su servidor preconfigurado. Esa consulta es <b>recursiva</b>: le pide una <b>respuesta final</b>. O viene la dirección IP, o viene un mensaje de error.</p><p>Si el servidor ya conoce la respuesta, contesta y no consulta a nadie. Para un FQDN desconocido tiene que salir a buscarla.</p><p>La petición viaja en <b>UDP al puerto 53</b>, más ágil que TCP. Si la respuesta excede el tamaño máximo y llega <b>truncada</b>, se repite la consulta usando <b>TCP</b>.</p>',
      key: 'Recursiva = el cliente delega toda la búsqueda: quiere la IP o un error, nada intermedio.',
      scene: 'res', upto: 2, states: { C: 'consulta recursiva', L: 'debe dar IP o error' },
      notes: [{ x: 180, y: 236, w: 440, c: 'yellow', text: 'El servidor DNS escucha en el <b>puerto 53</b>, tanto en UDP como en TCP. Primero se intenta por <b>UDP</b>; si la respuesta llega truncada, se vuelve a preguntar por <b>TCP</b>.' }],
      st: { q: 'frba.utn.edu.ar', tipo: 'consulta recursiva', quien: 'el DNS local', res: 'pendiente' }
    },
    {
      s: 'Iterativas', k: 'mecanismo', t: 'Las consultas del servidor son iterativas',
      b: '<p>El DNS local no conoce frba.utn.edu.ar, así que pregunta él. Sus consultas son <b>iterativas</b>: el otro servidor puede dar la respuesta final o un <b>indicio de dónde seguir preguntando</b>.</p><ul><li>El <b>root</b> no conoce la IP, pero sabe quién responde por <b>.ar</b>.</li><li>El servidor de <b>.ar</b> tiene referencia a los name servers de <b>utn</b>.</li><li>Ese servidor tiene la zona: da la respuesta <b>autoritativa</b>.</li></ul><p>Recién entonces el DNS local le responde al cliente.</p>',
      key: 'Una sola consulta recursiva del cliente dispara varias iterativas del servidor.',
      fig: 'image89.png', scene: 'res', states: { L: 'consultas iterativas', R: 'da una referencia', AR: 'da una referencia', U: 'autoritativo' },
      st: { tipo: 'consultas iterativas', quien: 'root → .ar → utn.edu.ar', res: 'respuesta autoritativa' }
    },
    {
      s: 'Caché y TTL', k: 'mecanismo', t: 'Caché y TTL: no preguntar dos veces',
      b: '<p>Los DNS servers <b>cachean</b> los resultados de las consultas iterativas para no repetir todo el proceso.</p><p>Cada entrada tiene un <b>tiempo de vida (TTL)</b>, que es un parámetro de configuración de la zona: junto con la IP, el servidor de la zona dice por cuánto tiempo es válida la asociación. Cuando expira, la entrada se borra.</p><p>Al responder una consulta recursiva se envía el <b>TTL remanente</b>, así el cliente también puede guardarla en su caché y no volver a preguntar.</p>',
      key: 'El dueño de la zona decide cuánto tiempo pueden los demás recordar su respuesta.',
      scene: 'net', show: ['C1', 'C2', 'L'], hi: ['L'], tags: { L: 'ya lo tengo en caché', C1: 'preguntó antes' },
      pk: [{ p: ['C2', 'L'], l: '¿sistemas…?', d: 1.5 }, { p: ['L', [226, 296], 'C2'], l: 'IP + TTL', c: 'res', d: 1.5, stay: 1 }],
      tbl: { x: 420, y: 150, w: 350, title: 'Caché del DNS local', cols: ['Nombre', 'IP', 'TTL restante'], rows: [['sistemas.frba.utn.edu.ar', '200.89.153.25', '3540 s']], hi: 0 },
      notes: [{ x: 420, y: 240, w: 340, c: 'yellow', text: 'La respuesta sale del caché, no del servidor de la zona: por eso nslookup la marca como <b>non-authoritative answer</b>.' }],
      st: { q: 'sistemas.frba.utn.edu.ar', tipo: 'desde el caché', quien: 'el DNS local', res: '200.89.153.25' }
    },
    {
      s: 'Registros', k: 'detalle', t: 'Resource records: A, AAAA, MX y CNAME',
      b: '<p>El archivo de zona está hecho de <b>resource records</b>. Al consultar se indica qué <b>tipo</b> de registro se busca:</p><ul><li><b>A</b>: el más común. Asocia un nombre de host con una dirección IP. <b>AAAA</b> es el equivalente para IPv6.</li><li><b>MX</b> (Mail Exchange): resuelve el dominio de una dirección de mail a la lista de servidores de correo donde entregarlo.</li><li><b>CNAME</b> (Canonical Name): un alias. Vincula un nombre con otro nombre.</li></ul>',
      key: 'Cada tipo de registro tiene un tratamiento diferente: no todo en DNS es nombre → IP.',
      fig: ['image90.png', 'image91.png', 'image92.png'], scene: 'rr',
      tbl: { x: 200, y: 160, w: 400, title: 'Archivo de zona: ejemplos', cols: ['Nombre', 'Tipo', 'Dato'], rows: [['www', 'IN A', '200.69.225.145'], ['rhino', 'IN A', '200.26.65.12'], ['@', 'IN MX', '[10] mailhost'], ['@', 'IN MX', '[20] mail1.infovia.com.ar'], ['fileserver1', 'CNAME', 'rhino'], ['ftp', 'CNAME', 'rhino']] },
      notes: [{ x: 130, y: 340, w: 540, c: 'yellow', text: 'Un mail de Gmail a alguien@hotmail.com: el servidor de Gmail le pide al DNS los <b>MX</b> de hotmail.com y recibe la lista de servidores de correo donde conectarse para entregarlo.' }],
      st: { q: 'MX de hotmail.com', tipo: 'por tipo de registro', quien: 'el servidor de la zona', res: 'lista de mail servers' }
    },
    {
      s: 'nslookup', k: 'ejemplo', t: 'nslookup, hostfile local y sufijos',
      b: '<ul><li><b>nslookup</b> da acceso al resolver: permite consultar directamente al servidor de nombres, elegir cuál usar (por ejemplo 8.8.8.8, de Google) y buscar por tipo de registro.</li><li>El <b>hostfile</b> local sigue existiendo y <b>prevalece</b>: primero se busca ahí y después se va al DNS.</li><li>Si no se sabe si el nombre está completo, el sistema le agrega <b>sufijos</b>. Con un punto al final, el nombre es completo.</li><li><b>Consulta inversa</b>: se da una IP y se pregunta el nombre. Así traceroute le pone nombre a cada router.</li></ul>',
      key: 'Orden de búsqueda: primero el hostfile de la máquina, después el servidor DNS.',
      fig: 'image95.png', scene: 'prac', hi: ['p3'],
      pk: [{ p: [[105, 50], [696, 50]], l: 'sistemas', d: 3 }],
      tbl: { x: 180, y: 170, w: 300, title: 'nslookup', rows: [['> sistemas.frba.utn.edu.ar'], ['Server: UnKnown'], ['Address: 10.66.84.4'], ['Non-authoritative answer:'], ['Name: sistemas.frba.utn.edu.ar'], ['Address: 200.89.153.25']], hi: [3, 5] },
      notes: [{ x: 440, y: 190, w: 250, c: 'yellow', text: 'En Windows el hostfile está en <code>System32\\drivers\\etc\\hosts</code>. Lo que figure ahí gana sobre lo que diga el DNS.' }],
      st: { q: 'sistemas', tipo: 'sufijo + hostfile + DNS', quien: '10.66.84.4 (desde caché)', res: '200.89.153.25' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'DNS en una mirada',
      b: '<ul><li>Del hostfile plano a una base <b>distribuida y jerárquica</b>: root, TLD, dominios, subdominios.</li><li><b>Resolver</b> (cliente) y <b>name server</b>; cada <b>zona</b> tiene su servidor responsable.</li><li>Consulta <b>recursiva</b> del cliente; <b>iterativas</b> del servidor hasta la respuesta <b>autoritativa</b>.</li><li><b>Caché</b> con <b>TTL</b> para no repetir el proceso.</li><li>Puerto <b>53</b>, UDP (TCP si se trunca). Registros A, AAAA, MX y CNAME.</li></ul><p>Vimos que la lista de servidores DNS se la entrega al equipo un servidor DHCP. En la próxima lección: cómo un host recibe toda su configuración con <b>DHCP</b>.</p>',
      scene: 'net', hi: ['L'],
      pk: [{ p: ['C1', 'L'], l: 'recursiva', d: 1.1 }, { p: ['L', 'RT'], l: 'iterativa', c: 'ctl', d: 1 }, { p: ['L', 'AR'], l: 'iterativa', c: 'ctl', d: 1 }, { p: ['L', 'UT'], l: 'iterativa', c: 'ctl', d: 1 }, { p: ['L', [226, 148], 'C1'], l: 'IP', c: 'res', d: 1.1, stay: 1 }],
      st: { q: 'frba.utn.edu.ar', tipo: 'recursiva + iterativas', quien: 'root → .ar → utn.edu.ar', res: 'IP, y queda en caché' }
    }
  ],
  quiz: [
    { q: '¿Qué tipo de consulta le hace el resolver a su servidor DNS configurado?', o: ['Iterativa: acepta una referencia a otro servidor', 'Recursiva: espera la respuesta final, una IP o un error', 'Inversa: envía una IP y espera un nombre', 'Autoritativa: solo consulta al dueño de la zona'], a: 1, why: 'El cliente hace una consulta recursiva: le pide al servidor que le dé la respuesta final, sea la dirección IP o un mensaje de error.' },
    { q: 'El DNS local no tiene en caché frba.utn.edu.ar. ¿A quién le pregunta primero?', o: ['Al servidor de utn.edu.ar', 'Al servidor de .ar', 'A los servidores root', 'Al servidor DHCP'], a: 2, why: 'Empieza por el root, que no conoce la IP pero le da la referencia a los servidores de .ar; de ahí sigue bajando hasta la respuesta autoritativa.' },
    { q: '¿Qué protocolo y puerto usa normalmente una consulta DNS?', o: ['TCP, puerto 80', 'UDP, puerto 53; TCP si la respuesta llega truncada', 'Siempre TCP, puerto 53', 'ICMP, protocolo 1'], a: 1, why: 'El servidor escucha en el puerto 53 de UDP y TCP. La petición se hace por UDP por ser más ágil; si la respuesta excede el tamaño máximo se repite por TCP.' },
    { q: '¿Para qué sirve un registro MX?', o: ['Para asociar un nombre con una dirección IPv6', 'Para crear un alias de otro nombre', 'Para saber qué servidores de correo reciben el mail de un dominio', 'Para indicar el TTL de la zona'], a: 2, why: 'MX (Mail Exchange) resuelve el dominio de una dirección de mail a la lista de servidores de correo donde conectarse para entregarlo.' }
  ],
  cheat: [
    ['Hostfile', 'Archivo de texto con asociaciones estáticas nombre → IP. Espacio plano: sin nombres repetidos. Hoy el local <b>prevalece</b> sobre el DNS.'],
    ['Resolver / name server', 'El resolver (cliente) envía el pedido; el name server lo resuelve. El servidor configurado lo entrega DHCP (se ve con ipconfig).'],
    ['FQDN', 'host.subdominio.dominio.tld<b>.</b> Jerarquía: root (el punto) → TLD (.com, .ar) → second-level → subdominios.'],
    ['Zona de autoridad', 'Porción de dominio de la que un servidor es responsable; tiene el archivo de zona. Roles: primario, secundario, master, caching-only.'],
    ['Recursiva / iterativa', '<b>Recursiva</b>: cliente → servidor, exige IP o error. <b>Iterativa</b>: servidor → name servers, acepta una referencia o la respuesta autoritativa.'],
    ['Caché y TTL', 'El servidor guarda las respuestas durante el TTL que fija la zona; al cliente le llega el TTL remanente.'],
    ['Puerto', '<b>53</b> en UDP y TCP. Se consulta por UDP; si la respuesta viene truncada, se repite por TCP.'],
    ['Resource records', '<b>A</b> nombre → IPv4 · <b>AAAA</b> IPv6 · <b>MX</b> servidores de correo del dominio · <b>CNAME</b> alias.']
  ]
});

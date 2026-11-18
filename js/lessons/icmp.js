COURSE.add({
  id: 'icmp',
  title: 'ICMP, ping y traceroute',
  desc: 'IP no avisa cuando algo sale mal: de eso se encarga ICMP. Qué mensajes existen, cómo los aprovecha ping y cómo traceroute descubre cada router del camino jugando con el TTL.',
  min: 11, level: 'Intermedio',
  learn: [
    'Qué es ICMP y cómo viaja encapsulado en IP (protocolo 1)',
    'Cuándo se genera un mensaje de destino inalcanzable y cuáles son sus motivos',
    'Qué significa tiempo de espera agotado y qué tiene que ver el TTL',
    'Cómo funciona ping con echo request y echo reply, y por qué puede no haber respuesta',
    'Cómo traceroute arma el camino salto a salto y qué son los asteriscos'
  ],
  stats: [{ k: 'msg', l: 'Mensaje ICMP' }, { k: 'de', l: 'Lo envía' }, { k: 'ttl', l: 'TTL de salida' }, { k: 'hops', l: 'Saltos conocidos' }],
  legend: [['req', 'datagrama / echo request'], ['res', 'echo reply'], ['bad', 'ICMP de error']],
  scenes: {
    tipos: {
      kind: 'topo',
      nodes: [
        { id: 'icmp', t: 'box', x: 400, y: 86, w: 220, h: 46, l: 'Mensaje ICMP', c: 'green' },
        { id: 'err', t: 'box', x: 220, y: 172, w: 250, h: 46, l: 'Reporte de error', c: 'yellow' },
        { id: 'qry', t: 'box', x: 580, y: 172, w: 250, h: 46, l: 'Consulta / respuesta', c: 'blue' },
        { id: 'unr', t: 'box', x: 220, y: 242, w: 250, h: 34, l: 'Destino inalcanzable', c: 'white' },
        { id: 'tex', t: 'box', x: 220, y: 286, w: 250, h: 34, l: 'Tiempo de espera agotado', c: 'white' },
        { id: 'red', t: 'box', x: 220, y: 330, w: 250, h: 34, l: 'Router redirect', c: 'white' },
        { id: 'par', t: 'box', x: 220, y: 374, w: 250, h: 34, l: 'Problema de parámetro', c: 'white' },
        { id: 'ech', t: 'box', x: 580, y: 242, w: 250, h: 34, l: 'Echo request / reply', c: 'white' },
        { id: 'tst', t: 'box', x: 580, y: 286, w: 250, h: 34, l: 'Timestamp request / reply', c: 'white' },
        { id: 'dis', t: 'box', x: 580, y: 330, w: 250, h: 34, l: 'Router discovery', c: 'white' }
      ],
      links: [{ a: 'icmp', b: 'err', arrow: 1 }, { a: 'icmp', b: 'qry', arrow: 1 }]
    },
    dg: {
      kind: 'fields', title: 'Un mensaje ICMP viaja dentro de un datagrama IP', rh: 44,
      rows: [[
        { id: 'iph', l: 'Cabecera IP', s: 'protocolo = 1', w: 5, c: 'blue' },
        { id: 'msg', l: 'Mensaje ICMP', s: 'ocupa el lugar de los datos del datagrama', w: 11, c: 'yellow' }
      ]],
      zoom: {
        from: 'msg', title: 'Dentro del mensaje ICMP', rows: [
          [{ id: 'tipo', l: 'Tipo', s: '8 bits', w: 8, c: 'green' }, { id: 'cod', l: 'Código', s: '8 bits', w: 8, c: 'orange' }, { id: 'chk', l: 'ICMP Checksum', s: '16 bits', w: 16, c: 'gray' }],
          [{ id: 'resto', l: 'Resto del encabezado ICMP', s: '32 bits · depende del tipo', w: 32, c: 'purple' }],
          [{ id: 'datos', l: 'Datos', s: '0 a 68 bytes', w: 32, c: 'white' }]
        ]
      }
    },
    cam: {
      kind: 'topo',
      nodes: [
        { id: 'A', t: 'pc', x: 70, y: 140, l: 'A', sub: 'origen' },
        { id: 'R1', t: 'router', x: 230, y: 140, l: 'R1', sub: '200.26.65.5' },
        { id: 'R2', t: 'router', x: 390, y: 140, l: 'R2', sub: '200.69.225.150' },
        { id: 'R3', t: 'router', x: 550, y: 140, l: 'R3' },
        { id: 'D', t: 'server', x: 710, y: 140, l: 'www.yahoo.com', sub: '69.147.114.210' }
      ],
      links: [{ a: 'A', b: 'R1' }, { a: 'R1', b: 'R2' }, { a: 'R2', b: 'R3' }, { a: 'R3', b: 'D' }]
    }
  },
  steps: [
    {
      s: 'ICMP', k: 'contexto', t: 'ICMP: el protocolo que avisa',
      b: '<p>En TCP/IP la capa 3 tiene más de un protocolo. <b>ICMP</b> (Internet Control Message Protocol) es un protocolo de <b>soporte a IP</b>: la mensajería de control de Internet.</p><ul><li>Comunica <b>errores</b> a nivel de red.</li><li>Informa acerca de <b>eventos inesperados</b>.</li><li>Informa acerca de la red, <b>en respuesta a consultas</b>.</li></ul><p>Solo informa el error: <b>no especifica qué acción correctiva tomar</b>.</p><p>Sus mensajes son de dos familias: reportes de error y consulta / respuesta.</p>',
      key: 'IP entrega con el mejor esfuerzo; ICMP es quien cuenta lo que pasó, pero no lo arregla.',
      fig: 'image81.png', scene: 'tipos', hi: ['unr', 'tex', 'ech'], dim: ['red', 'par', 'tst', 'dis'],
      st: { msg: '—', de: '—', ttl: '—', hops: '—' }
    },
    {
      s: 'Encapsulado', k: 'detalle', t: 'Un mensaje ICMP va dentro de un datagrama IP',
      b: '<p>ICMP no usa TCP ni UDP: va <b>encapsulado directamente en IP</b>, con su propio código de protocolo, el <b>1</b>.</p><p>Todos los mensajes empiezan igual:</p><ul><li><b>Tipo</b> y <b>Código</b> (8 bits cada uno).</li><li><b>Checksum</b> de ICMP (16 bits).</li><li>El <b>resto del encabezado</b>, que cambia según el mensaje.</li><li><b>Datos</b> (0 a 68 bytes).</li></ul>',
      key: 'Campo Protocolo de la cabecera IP = 1 → lo que sigue es un mensaje ICMP.',
      fig: 'image80.png', scene: 'dg', zoom: 1,
      det: 'En un <b>echo</b>, el resto del encabezado lleva un <b>identificador</b> y un <b>número de secuencia</b> para contrastar cada request con su reply.'
    },
    {
      s: 'Inalcanzable', k: 'mecanismo', t: 'Destino inalcanzable',
      b: '<p>Ante la imposibilidad de <b>entregar o conmutar</b> un datagrama, el router envía un mensaje ICMP al origen <b>antes de descartarlo</b>.</p><p>El mensaje indica el motivo. Los dos más comunes:</p><ul><li><b>Network unreachable</b>: el router no sabe cómo llegar a la red destino.</li><li><b>Host unreachable</b>: se llegó a la red destino, pero no se encuentra el host.</li></ul><p>Los demás motivos están en la tabla. Acá R2 no tiene ruta hacia la red pedida.</p>',
      key: 'El router descarta, pero no en silencio: le cuenta al origen por qué.',
      scene: 'cam', hi: ['R2'], dim: ['R3', 'D'], tags: { A: 'envía un datagrama', R2: 'no sé llegar a esa red' },
      pk: [{ p: ['A', 'R1', 'R2'], l: 'IP', d: 1.8, drop: 1 }, { p: ['R2', 'R1', 'A'], l: 'ICMP', c: 'bad', d: 1.8, stay: 1 }],
      tbl: { x: 150, y: 232, w: 500, title: 'Destino inalcanzable: motivos', cols: ['Motivo', 'Cuándo ocurre'], rows: [['Network unreachable', 'el router no sabe cómo llegar a la red destino'], ['Host unreachable', 'se llegó a la red destino pero no está el host'], ['Protocol not enabled', 'el protocolo pedido (TCP/UDP) no está habilitado'], ['Port not bound to a service', 'el puerto no tiene nada corriendo'], ['Fragmentation needed, DF set', 'hay que fragmentar y el origen lo impide (DF)'], ['Source route failed', 'no se encuentra el próximo salto que indicó el origen']], hi: 0 },
      st: { msg: 'Destino inalcanzable', de: 'R2', ttl: '—', hops: '—' }
    },
    {
      s: 'TTL en 0', k: 'mecanismo', t: 'Tiempo de espera agotado',
      b: '<p>Cada router <b>decrementa el TTL</b> del datagrama antes de reenviarlo. Cuando un router detecta que el TTL debe quedar en <b>0</b>, el paquete cumplió su ciclo de vida.</p><p>El router lo <b>descarta</b> y le avisa al origen con un ICMP de <b>tiempo de espera agotado</b> (time exceeded).</p><p>En el ejemplo, A envía con TTL = 2: R1 lo baja a 1 y lo reenvía; R2 lo bajaría a 0, así que lo descarta y avisa.</p>',
      key: 'El aviso viene firmado: la IP origen del ICMP es la del router que descartó el datagrama.',
      scene: 'cam', hi: ['R2'], dim: ['R3', 'D'], tags: { R1: 'TTL 2 → 1: sigue', R2: 'TTL 1 → 0: descarta' },
      pk: [{ p: ['A', 'R1', 'R2'], l: 'TTL 2', d: 1.8, drop: 1 }, { p: ['R2', 'R1', 'A'], l: 'ICMP', c: 'bad', d: 1.8, stay: 1 }],
      notes: [{ x: 170, y: 248, w: 460, c: 'yellow', text: 'El origen recibe un ICMP de <b>tiempo agotado</b> enviado por <b>200.69.225.150</b>. Sin proponérselo, acaba de enterarse de qué router está a 2 saltos. En eso se apoya traceroute.' }],
      st: { msg: 'Tiempo agotado', de: 'R2', ttl: '2', hops: '—' }
    },
    {
      s: 'Echo y ping', k: 'mecanismo', t: 'Echo request, echo reply y ping',
      b: '<p>Con un <b>echo request</b> un origen quiere saber si un destino es alcanzable. Si el destino lo recibe, responde con un <b>echo reply</b> que incluye los mismos datos del request.</p><p>En ese intercambio se basa <b>ping</b>: envía echo requests y muestra las respuestas recibidas, con el tiempo de ida y vuelta de cada una.</p><p>En el ejemplo del apunte: 4 enviados, 4 recibidos, 0 % de pérdida, entre 183 y 218 ms.</p>',
      key: 'Ping = echo request de ida + echo reply de vuelta. Si vuelve, hay camino en los dos sentidos.',
      fig: ['image82.png', 'image83.png'], scene: 'cam', hi: ['A', 'D'], tags: { D: 'responde el echo' },
      pk: [{ p: ['A', 'R1', 'R2', 'R3', 'D'], l: 'echo request', d: 2.4 }, { p: ['D', 'R3', 'R2', 'R1', 'A'], l: 'echo reply', c: 'res', d: 2.4, stay: 1 }],
      tbl: { x: 190, y: 236, w: 420, title: 'ping www.yahoo.com', rows: [['Reply from 69.147.114.210: bytes=32 time=183ms TTL=55'], ['Reply from 69.147.114.210: bytes=32 time=184ms TTL=55'], ['Reply from 69.147.114.210: bytes=32 time=184ms TTL=55'], ['Reply from 69.147.114.210: bytes=32 time=218ms TTL=55'], ['Sent = 4, Received = 4, Lost = 0 (0% loss)']], hi: 4 },
      st: { msg: 'Echo request / reply', de: 'A y el destino', ttl: '—', hops: '—' }
    },
    {
      s: 'Sin respuesta', k: 'problema', t: 'Si el ping no responde',
      b: '<p>Que no llegue el echo reply puede deberse a varias cosas:</p><ul><li>El <b>request no llega</b> a destino.</li><li>Un administrador de red o un <b>firewall bloquea ICMP</b>.</li><li>El <b>sistema operativo</b> del destino deliberadamente no responde el ping.</li><li>La <b>respuesta se pierde</b> en el camino de vuelta.</li></ul><p>No es buena práctica deshabilitar todo ICMP: suele haber recomendaciones sobre qué mensajes dejar pasar y cuáles no.</p>',
      key: 'Que el ping no vuelva no significa que no se pueda llegar al destino.',
      scene: 'cam', hi: ['R3'], tags: { R3: 'firewall: bloquea ICMP' },
      pk: [{ p: ['A', 'R1', 'R2', 'R3'], l: 'echo request', d: 2.2, drop: 1, dropAt: .9 }, { p: ['D', 'R3'], l: 'echo reply', c: 'res', t: 3, d: 1.6, drop: 1, dropAt: .6 }],
      tbl: { x: 190, y: 236, w: 420, title: 'Sin respuesta puede ser…', rows: [['1', 'el request no llega a destino'], ['2', 'un firewall o un administrador bloquea ICMP'], ['3', 'el sistema operativo destino no responde ping'], ['4', 'la respuesta se pierde en el camino']], hi: [1, 3] },
      st: { msg: 'Echo request', de: 'A', ttl: '—', hops: '—' }
    },
    {
      s: 'Traceroute', k: 'mecanismo', t: 'Traceroute: tres requests con TTL = 1',
      b: '<p><b>Traceroute</b> es una aplicación que intenta trazar el camino hasta un destino, mostrando cada salto.</p><p>Empieza enviando <b>tres echo request con TTL = 1</b>. El primer router decrementa el TTL, llega a 0, descarta el paquete y devuelve un <b>tiempo agotado</b>. Con eso el router queda <b>identificado</b>.</p><p>El primer salto siempre muestra la IP del <b>default gateway</b>. Lo hace tres veces y por eso hay tres tiempos por línea.</p>',
      key: 'Traceroute provoca a propósito el error de TTL para que cada router se delate.',
      fig: 'image84.png', scene: 'cam', hi: ['R1'], dim: ['R2', 'R3', 'D'], tags: { A: 'TTL = 1, tres veces', R1: 'TTL 1 → 0' },
      pk: [{ p: ['A', 'R1'], l: 'TTL 1', t: 0, d: 1, drop: 1, dropAt: .72 }, { p: ['A', 'R1'], l: 'TTL 1', t: .3, d: 1, drop: 1, dropAt: .72 }, { p: ['A', 'R1'], l: 'TTL 1', t: .6, d: 1, drop: 1, dropAt: .72 },
        { p: ['R1', [150, 172], 'A'], l: 'ICMP', c: 'bad', t: 1.9, d: 1 }, { p: ['R1', [150, 172], 'A'], l: 'ICMP', c: 'bad', t: 2.2, d: 1 }, { p: ['R1', [150, 172], 'A'], l: 'ICMP', c: 'bad', t: 2.5, d: 1 }],
      tbl: { x: 190, y: 240, w: 420, title: 'tracert www.yahoo.com', cols: ['Salto', '1.º', '2.º', '3.º', 'Quién respondió'], rows: [['1', '1 ms', '1 ms', '1 ms', '200.26.65.5']], hi: 0 },
      st: { msg: 'Tiempo agotado', de: 'R1', ttl: '1', hops: '1' }
    },
    {
      s: 'TTL 2, 3…', k: 'ejemplo', t: 'Un TTL más en cada ronda',
      b: '<p>A continuación envía tres nuevos requests con <b>TTL = 2</b>: pasan por el primer salto, que decrementa uno, y mueren en el <b>segundo router</b>, que responde. Luego TTL = 3, y así <b>iterativamente</b>, avanzando entre los routers.</p><p>Si en una línea aparecen <b>* * *</b>, no hubo mensaje de error: es un router que <b>no quiere responder</b>.</p><p>Igual se sigue avanzando: los requests con TTL mayor lo atraviesan sin problema y se conocen los routers siguientes.</p>',
      key: 'Los asteriscos no cortan la traza: ese router reenvía paquetes, solo que no contesta ICMP.',
      scene: 'cam', hi: ['R2', 'R3'], dim: ['D'], tags: { R2: 'responde', R3: 'no contesta: * * *' },
      pk: [{ p: ['A', 'R1', 'R2'], l: 'TTL 2', d: 1.5, drop: 1 }, { p: ['R2', 'R1', 'A'], l: 'ICMP', c: 'bad', d: 1.5 }, { p: ['A', 'R1', 'R2', 'R3'], l: 'TTL 3', d: 2, drop: 1, dropAt: .9 }],
      tbl: { x: 190, y: 240, w: 420, title: 'tracert www.yahoo.com', cols: ['Salto', '1.º', '2.º', '3.º', 'Quién respondió'], rows: [['1', '1 ms', '1 ms', '1 ms', '200.26.65.5'], ['2', '57 ms', '6 ms', '4 ms', '200.69.225.150'], ['3', '*', '*', '*', 'Request timed out.']], hi: [1, 2] },
      st: { msg: 'Tiempo agotado', de: 'R2 (R3 calla)', ttl: '2 y 3', hops: '3' }
    },
    {
      s: 'Llegada', k: 'ejemplo', t: 'El destino responde con un echo reply',
      b: '<p>Con el TTL suficiente, el request ya no muere en ningún router: <b>llega al destino</b>.</p><p>El destino no devuelve un tiempo agotado sino un <b>echo reply</b>. Esa es la señal de que se llegó al final: la traza está completa y se sabe cuántos saltos hicieron falta.</p><p>En la captura del apunte, www.yahoo.com aparece en el <b>salto 12</b>, y los saltos 6 y 7 muestran asteriscos.</p>',
      key: 'Tiempo agotado = todavía falta camino. Echo reply = llegaste.',
      fig: 'image84.png', scene: 'cam', hi: ['D'], tags: { D: 'echo reply: soy el destino' },
      pk: [{ p: ['A', 'R1', 'R2', 'R3', 'D'], l: 'TTL 4', d: 2.4 }, { p: ['D', 'R3', 'R2', 'R1', 'A'], l: 'echo reply', c: 'res', d: 2.4, stay: 1 }],
      tbl: { x: 190, y: 240, w: 420, title: 'tracert www.yahoo.com', cols: ['Salto', '1.º', '2.º', '3.º', 'Quién respondió'], rows: [['1', '1 ms', '1 ms', '1 ms', '200.26.65.5'], ['2', '57 ms', '6 ms', '4 ms', '200.69.225.150'], ['3', '*', '*', '*', 'Request timed out.'], ['4', '171 ms', '170 ms', '174 ms', '69.147.114.210']], hi: 3 },
      st: { msg: 'Echo reply', de: 'el destino', ttl: '4', hops: '4 · traza completa' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'ICMP en una mirada',
      b: '<ul><li><b>ICMP</b> es el soporte de IP: informa errores y eventos, no los corrige. Va en IP con <b>protocolo 1</b>.</li><li><b>Destino inalcanzable</b>: el router no pudo entregar ni conmutar, y dice por qué.</li><li><b>Tiempo agotado</b>: el TTL llegó a 0.</li><li><b>Ping</b>: echo request y echo reply.</li><li><b>Traceroute</b>: TTL 1, 2, 3… hasta recibir el echo reply; <b>* * *</b> es un router que no contesta.</li></ul><p>Hasta acá usamos direcciones IP. En la próxima unidad vemos quién traduce <b>www.yahoo.com</b> a 69.147.114.210: el <b>DNS</b>.</p>',
      scene: 'cam',
      pk: [{ p: ['A', 'R1', 'R2', 'R3', 'D'], l: 'echo request', d: 2.4 }, { p: ['D', 'R3', 'R2', 'R1', 'A'], l: 'echo reply', c: 'res', d: 2.4 }],
      tbl: { x: 130, y: 240, w: 540, title: 'Tres mensajes, dos herramientas', cols: ['Mensaje', 'Quién lo envía', 'Para qué sirve'], rows: [['Destino inalcanzable', 'el router que no puede entregar', 'avisar el motivo al origen'], ['Tiempo agotado', 'el router que deja el TTL en 0', 'evitar vueltas; traceroute'], ['Echo request / reply', 'origen / destino', 'ping y fin de traceroute']] },
      st: { msg: '—', de: '—', ttl: '—', hops: '—' }
    }
  ],
  quiz: [
    { q: 'Cuando un router no puede entregar un datagrama, ¿qué hace ICMP?', o: ['Retransmite el datagrama por otro camino', 'Informa el error al origen, sin indicar ninguna acción correctiva', 'Corrige la tabla de ruteo del router', 'Abre una conexión TCP para avisar'], a: 1, why: 'ICMP es un protocolo de soporte: comunica errores y eventos, pero solo informa; no especifica qué acción tomar.' },
    { q: 'Traceroute envía sus primeros tres requests con TTL = 1. ¿Quién responde y con qué mensaje?', o: ['El destino final, con un echo reply', 'El primer router (el default gateway), con un tiempo de espera agotado', 'El servidor DNS, con la IP del destino', 'Nadie: el paquete se descarta en silencio'], a: 1, why: 'El primer router decrementa el TTL a 0, descarta el paquete y devuelve un ICMP de tiempo agotado, con lo que queda identificado.' },
    { q: 'En la salida de traceroute, el salto 6 muestra "* * *". ¿Qué significa?', o: ['Que el destino es inalcanzable', 'Que la traza terminó en ese punto', 'Que ese router no devolvió el mensaje de error, pero la traza continúa', 'Que el TTL inicial era demasiado bajo'], a: 2, why: 'Los asteriscos indican un router que no quiere responder; los requests con TTL mayor igual lo atraviesan y se siguen descubriendo routers.' },
    { q: 'Un ping a un servidor no recibe respuesta. ¿Se puede concluir que el servidor es inalcanzable?', o: ['Sí, siempre', 'Sí, salvo que el TTL sea 55', 'No: un firewall puede bloquear ICMP o el sistema operativo puede no responder', 'No, porque ping usa TCP y puede estar cerrado el puerto'], a: 2, why: 'Muchos administradores o firewalls bloquean ICMP y algunos sistemas no responden ping: la falta de respuesta no implica que no haya camino.' }
  ],
  cheat: [
    ['ICMP', 'Protocolo de soporte de IP: comunica errores, eventos inesperados y respuestas a consultas. <b>Solo informa</b>, no corrige.'],
    ['Encapsulado', 'Va directo dentro de IP con <b>protocolo = 1</b>. Encabezado: Tipo, Código, Checksum y un resto que depende del mensaje.'],
    ['Destino inalcanzable', 'Lo envía el router antes de descartar. Motivos: red, host, protocolo, puerto, fragmentación necesaria con DF, source route.'],
    ['Tiempo agotado', 'El router que debe dejar el <b>TTL en 0</b> descarta el datagrama y avisa al origen.'],
    ['Echo request / reply', 'Consulta y respuesta para saber si un destino es alcanzable. Base de <b>ping</b>.'],
    ['Ping sin respuesta', 'El request no llegó, ICMP bloqueado, el sistema destino no responde o la respuesta se perdió. No implica que no haya camino.'],
    ['Traceroute', 'Tres requests con TTL = 1, luego 2, 3… Cada router responde tiempo agotado; el destino responde echo reply.'],
    ['* * *', 'Router que no devuelve el error. La traza sigue igual con el TTL siguiente.']
  ]
});

COURSE.add({
  id: 'tls',
  title: 'TLS: el handshake seguro',
  desc: 'Qué pasa entre el browser y el servidor antes del primer dato encriptado: el handshake de TLS, los cipher suites, el certificado y la cadena de confianza que lo respalda.',
  min: 10, level: 'Avanzado',
  learn: [
    'Qué es TLS y por qué combina encriptación asimétrica y simétrica',
    'La secuencia del handshake: TCP, Client Hello, Server Hello, Certificate y Change Cipher Spec',
    'Qué cuatro algoritmos define un cipher suite',
    'Cómo se valida un certificado con la cadena de confianza hasta una ROOT CA',
    'Qué es la autenticación mutua y por qué se usa poco'
  ],
  stats: [{ k: 'fase', l: 'Fase' }, { k: 'cif', l: 'Encriptación en uso' }, { k: 'aut', l: 'Identidad probada' }],
  legend: [['ctl', 'control (TCP / Change Cipher Spec)'], ['req', 'cliente'], ['res', 'servidor'], ['key', 'certificado'], ['data', 'datos encriptados']],
  scenes: {
    web: {
      kind: 'topo',
      nodes: [
        { id: 'T', t: 'txt', x: 400, y: 62, l: 'SSL  →  TLS', big: 1 },
        { id: 'C', t: 'pc', x: 120, y: 180, l: 'Browser' },
        { id: 'NET', t: 'cloud', x: 400, y: 180, l: 'Internet' },
        { id: 'S', t: 'server', x: 680, y: 180, l: 'Servidor web' },
        { id: 'ASIM', t: 'box', x: 250, y: 335, w: 270, h: 58, l: 'Encriptación asimétrica', sub: 'autenticación · en el handshake', c: 'orange' },
        { id: 'SIM', t: 'box', x: 550, y: 335, w: 270, h: 58, l: 'Encriptación simétrica', sub: 'intercambio de datos', c: 'green' }
      ],
      links: [{ a: 'C', b: 'NET' }, { a: 'NET', b: 'S' }]
    },
    hs: {
      kind: 'seq',
      actors: [{ id: 'C', l: 'Cliente (browser)', t: 'pc' }, { id: 'S', l: 'Servidor', t: 'server' }],
      msgs: [
        { f: 'C', to: 'S', l: 'SYN', c: 'ctl' },
        { f: 'S', to: 'C', l: 'SYN-ACK', c: 'ctl' },
        { f: 'C', to: 'S', l: 'ACK', c: 'ctl' },
        { div: 'conexión TCP establecida · empieza TLS' },
        { f: 'C', to: 'S', l: 'Client Hello · lista de cipher suites soportados', c: 'req' },
        { f: 'S', to: 'C', l: 'Server Hello · cipher suite seleccionado', c: 'res' },
        { f: 'S', to: 'C', l: 'Certificate · certificado del servidor', c: 'key' },
        { f: 'C', to: 'S', l: 'Change Cipher Spec', c: 'ctl' },
        { f: 'S', to: 'C', l: 'Change Cipher Spec', c: 'ctl' },
        { div: 'fin del handshake' },
        { f: 'C', to: 'S', l: 'Application Data (encriptado)', c: 'data' },
        { f: 'S', to: 'C', l: 'Application Data (encriptado)', c: 'data' }
      ]
    },
    suite: {
      kind: 'fields', title: 'Un cipher suite, parte por parte', rh: 58,
      rows: [[
        { id: 'p', l: 'TLS', w: 3, c: 'gray' },
        { id: 'kx', l: 'DHE', s: 'key exchange', w: 5.5, c: 'purple' },
        { id: 'au', l: 'RSA', s: 'autenticación', w: 5.5, c: 'orange' },
        { id: 'w', l: 'WITH', w: 3.5, c: 'gray' },
        { id: 'en', l: 'AES_128_CBC', s: 'encriptación simétrica', w: 9, c: 'green' },
        { id: 'mac', l: 'SHA', s: 'MAC · integridad', w: 5.5, c: 'blue' }
      ]]
    },
    cert: {
      kind: 'topo',
      nodes: [
        { id: 'CR', t: 'box', x: 150, y: 110, w: 160, h: 54, l: 'ROOT CA', sub: 'certificado raíz', c: 'yellow' },
        { id: 'CI', t: 'box', x: 400, y: 110, w: 160, h: 54, l: 'CA intermedia', sub: 'issuer: ROOT CA', c: 'white' },
        { id: 'CS', t: 'box', x: 650, y: 110, w: 160, h: 54, l: 'Cert. del servidor', sub: 'issuer: CA intermedia', c: 'blue' },
        { id: 'C', t: 'pc', x: 150, y: 310, l: 'Cliente' },
        { id: 'S', t: 'server', x: 650, y: 310, l: 'Servidor' }
      ],
      links: [
        { a: 'CS', b: 'CI', arrow: 1, l: 'librado por', ly: -6 }, { a: 'CI', b: 'CR', arrow: 1, l: 'librado por', ly: -6 },
        { a: 'C', b: 'CR', dash: 1, l: 'confía', lx: 30 }, { a: 'S', b: 'CS', dash: 1, l: 'presenta', lx: -34 }, { a: 'S', b: 'C' }
      ]
    },
    mutua: {
      kind: 'seq',
      actors: [{ id: 'C', l: 'Cliente (browser)', t: 'pc' }, { id: 'S', l: 'Servidor', t: 'server' }],
      msgs: [
        { f: 'C', to: 'S', l: 'Client Hello', c: 'req' },
        { f: 'S', to: 'C', l: 'Server Hello + Certificate', c: 'res' },
        { f: 'S', to: 'C', l: 'solicita el certificado del cliente (opcional)', c: 'key' },
        { f: 'C', to: 'S', l: 'Certificate · certificado del cliente', c: 'key' },
        { at: 'S', note: 'ahora sabe quién es el cliente' },
        { f: 'C', to: 'S', l: 'Change Cipher Spec', c: 'ctl' },
        { f: 'S', to: 'C', l: 'Change Cipher Spec', c: 'ctl' },
        { div: 'datos encriptados' }
      ]
    }
  },
  steps: [
    {
      s: 'TLS', k: 'contexto', t: 'De SSL a TLS',
      b: '<p><b>TLS</b> (Transport Layer Security) es la evolución de lo que se conocía como <b>SSL</b>.</p><p>Se utiliza para <b>proteger el tráfico HTTP</b> entre un servidor y un browser: lo que cruza la red pública viaja encriptado.</p><p>Para lograrlo se apoya en las piezas de la lección anterior: claves simétricas y asimétricas, hash y certificados.</p>',
      key: 'TLS es la capa de seguridad sobre la que viaja el HTTP de un sitio seguro.',
      scene: 'web', show: ['T', 'C', 'NET', 'S'], tags: { NET: 'solo ve datos encriptados' },
      pk: [{ p: ['C', 'NET', 'S'], l: 'HTTP sobre TLS', c: 'data', d: 2.2 }, { p: ['S', 'NET', 'C'], l: 'HTTP sobre TLS', c: 'data', d: 2.2 }],
      st: { fase: '—', cif: '—', aut: '—' }
    },
    {
      s: 'Dos claves', k: 'idea', t: 'Asimétrica para autenticar, simétrica para los datos',
      b: '<p>TLS utiliza los dos tipos de encriptación, cada uno donde rinde más:</p><ul><li><b>Asimétrica</b> para la <b>autenticación</b>: con un par de claves y un certificado se prueba la identidad.</li><li><b>Simétrica</b> para el <b>intercambio de datos</b>: es mucho más eficiente en cómputo.</li></ul><p>La complicación de la simétrica era distribuir la clave. El <b>handshake</b> resuelve eso: los dos extremos acuerdan cómo intercambiar las claves simétricas antes de enviar datos.</p>',
      key: 'Asimétrica al principio, para saber con quién hablo; simétrica después, para hablar rápido.',
      scene: 'web', add: ['ASIM', 'SIM'], hi: ['ASIM', 'SIM'],
      pk: [{ p: ['C', 'NET', 'S'], l: 'handshake', c: 'key', d: 2 }, { p: ['S', 'NET', 'C'], l: 'datos', c: 'data', d: 2 }]
    },
    {
      s: 'TCP', k: 'mecanismo', t: 'Antes que nada, la conexión TCP',
      b: '<p>El <b>handshake</b> es la forma en que un cliente se conecta a un servidor protegido por TLS.</p><p>Los primeros tres mensajes, <b>SYN</b>, <b>SYN-ACK</b> y <b>ACK</b>, no son de TLS: son parte de <b>TCP</b>. TLS necesita primero una conexión establecida sobre la cual trabajar.</p><p>Hasta acá todavía no hay nada encriptado.</p>',
      fig: 'image187.png', scene: 'hs', upto: 4,
      st: { fase: 'Conexión TCP', cif: 'ninguna', aut: 'nadie' }
    },
    {
      s: 'Client Hello', k: 'mecanismo', t: 'Client Hello: esto es lo que soporto',
      b: '<p>Con la conexión establecida, el cliente envía un <b>Client Hello</b>: indica que solicita una <b>conexión segura</b> y manda la lista de <b>cipher suites</b> que soporta.</p><p>La lista va <b>ordenada por preferencia</b>. El servidor va a elegir el mayor que pueda soportar.</p>',
      key: 'El cliente propone; el que decide es el servidor.',
      scene: 'hs', upto: 5,
      st: { fase: 'Handshake TLS' }
    },
    {
      s: 'Cipher suite', k: 'detalle', t: 'Qué define un cipher suite',
      b: '<p>Un <b>cipher suite</b> agrupa los algoritmos criptográficos de la conexión. De cada uno se sabe:</p><ul><li><b>Key exchange</b>: cómo se intercambiarán las claves simétricas.</li><li><b>Authentication</b>: cómo se autenticará.</li><li><b>Bulk encryption</b>: el algoritmo de clave simétrica a utilizar.</li><li><b>MAC</b> (Message Authentication Code): el método para chequear la integridad.</li></ul>',
      key: 'El nombre del cipher suite resume los cuatro algoritmos que va a usar la conexión.',
      scene: 'suite',
      det: 'El cliente manda varios, del más preferido al menos preferido. El servidor recorre la lista y se queda con el <b>mayor que puede soportar</b>; ese es el que informa en el Server Hello.',
      tbl: { x: 230, y: 300, w: 360, title: 'lista del Client Hello · orden de preferencia', cols: ['N.º', 'Cipher suite', 'Servidor'], rows: [['1', 'TLS_DHE_RSA_WITH_AES_256_CBC_SHA', 'no lo soporta'], ['2', 'TLS_DHE_RSA_WITH_AES_128_CBC_SHA', 'elegido'], ['3', 'TLS_RSA_WITH_3DES_EDE_CBC_SHA', '—']], hi: 1 }
    },
    {
      s: 'Server Hello', k: 'mecanismo', t: 'Server Hello y Certificate',
      b: '<p>El servidor responde con el <b>Server Hello</b>, donde informa el <b>cipher seleccionado</b>.</p><p>Junto con él envía un <b>Certificate</b>: un documento generado por una <b>autoridad certificante</b>, con el que el servidor prueba su identidad.</p>',
      scene: 'hs', upto: 7, anim: 5,
      st: { fase: 'Handshake TLS', cif: 'ninguna (ya acordada)', aut: 'servidor, si el certificado es válido' }
    },
    {
      s: 'Certificados', k: 'detalle', t: 'Certificados y cadena de confianza',
      b: '<p>El certificado tiene un elemento <b>issuer</b>: el emisor, quien lo libró. Eso arma una <b>cadena de confianza</b> que termina en una <b>ROOT CA</b>, una empresa dedicada a generar certificados.</p><p>Si el certificado fue librado por una ROOT CA <b>en la que yo confío</b>, lo acepto como válido.</p><p>Puede estar librado por la ROOT CA o por una <b>entidad intermedia</b>; por eso el servidor debe enviar <b>toda la cadena</b>, para que el cliente la analice.</p>',
      key: 'Confío en el servidor porque confío en quien firmó su certificado.',
      scene: 'cert', hi: ['CR'], tags: { C: 'ROOT CA confiable → válido' },
      pk: [{ p: ['S', 'C'], l: 'toda la cadena', c: 'key', d: 1.8 }, { p: ['CS', 'CI'], l: '¿issuer?', c: 'ctl', d: 1 }, { p: ['CI', 'CR'], l: '¿issuer?', c: 'ctl', d: 1 }],
      notes: [{ x: 290, y: 188, w: 220, c: 'yellow', text: 'El cliente sube por los <b>issuer</b> hasta llegar a una raíz que ya tiene como confiable.' }],
      st: { aut: 'servidor' }
    },
    {
      s: 'Datos', k: 'mecanismo', t: 'Change Cipher Spec y datos encriptados',
      b: '<p>El handshake se finaliza con <b>Change Cipher Spec</b>: cada lado avisa que pasa a usar el cifrado acordado.</p><p>A partir de allí se envían los <b>datos de aplicación</b> (el HTTP), encriptados con el algoritmo de <b>clave simétrica</b> del cipher suite elegido.</p>',
      key: 'Todo lo anterior fue para llegar a este punto: datos encriptados entre dos extremos que ya se pusieron de acuerdo.',
      scene: 'hs', anim: 7, states: { C: 'canal seguro', S: 'canal seguro' },
      st: { fase: 'Datos', cif: 'simétrica', aut: 'servidor' }
    },
    {
      s: 'Mutua', k: 'detalle', t: 'Autenticación mutua (opcional)',
      b: '<p>En el handshake que vimos solo presenta certificado el servidor. La <b>autenticación del cliente</b> (TLS mutual authentication) es <b>opcional</b>.</p><p>Luego del Server Hello, el servidor puede <b>solicitarle al cliente que presente su certificado</b>.</p><p>No es muy utilizada, porque es complejo lidiar con certificados.</p>',
      scene: 'mutua',
      st: { fase: 'Handshake TLS', cif: 'ninguna', aut: 'servidor y cliente' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'TLS en una mirada',
      b: '<ul><li><b>TLS</b>: evolución de SSL; protege HTTP entre browser y servidor.</li><li>Asimétrica para <b>autenticar</b>, simétrica para los <b>datos</b>.</li><li>Handshake: TCP → <b>Client Hello</b> (cipher suites) → <b>Server Hello</b> + <b>Certificate</b> → <b>Change Cipher Spec</b> → datos.</li><li>Cipher suite: key exchange, autenticación, encriptación simétrica y MAC.</li><li>El certificado vale si su <b>cadena</b> llega a una ROOT CA de confianza.</li></ul><p>Con esta lección termina el curso: del cable compartido de Ethernet a una conexión web segura.</p>',
      scene: 'web', hi: ['C', 'S'], tags: { C: 'validó el certificado', S: 'probó su identidad' },
      pk: [{ p: ['C', 'NET', 'S'], l: 'datos encriptados', c: 'data', d: 2 }, { p: ['S', 'NET', 'C'], l: 'datos encriptados', c: 'data', d: 2 }],
      st: { fase: 'Datos', cif: 'simétrica', aut: 'servidor' }
    }
  ],
  quiz: [
    { q: 'En el handshake de una conexión TLS, ¿a qué protocolo pertenecen los tres primeros mensajes (SYN, SYN-ACK, ACK)?', o: ['A TLS', 'A TCP', 'A HTTP', 'A SSL'], a: 1, why: 'Primero se establece la conexión TCP; recién después el cliente envía el Client Hello de TLS.' },
    { q: '¿Qué envía el cliente en el Client Hello?', o: ['Su certificado', 'La clave simétrica ya elegida', 'La lista de cipher suites que soporta, por orden de preferencia', 'El cipher suite que eligió el servidor'], a: 2, why: 'El cliente solicita la conexión segura y propone sus cipher suites; el servidor elige el mayor que puede soportar.' },
    { q: '¿Para qué usa TLS cada tipo de encriptación?', o: ['Asimétrica para los datos y simétrica para autenticar', 'Asimétrica para autenticar y simétrica para el intercambio de datos', 'Solo usa encriptación asimétrica', 'Solo usa encriptación simétrica'], a: 1, why: 'La asimétrica sirve para la autenticación; la simétrica, más eficiente, para los datos.' },
    { q: '¿Por qué el servidor debe enviar toda la cadena de certificación?', o: ['Porque el cliente no guarda ningún certificado', 'Porque su certificado puede estar librado por una entidad intermedia y el cliente debe llegar hasta una ROOT CA en la que confía', 'Para que el cliente elija el certificado que prefiera', 'Porque cada certificado encripta al siguiente'], a: 1, why: 'El cliente analiza la cadena siguiendo los issuer; acepta el certificado si termina en una ROOT CA de confianza.' }
  ],
  cheat: [
    ['TLS', 'Evolución de SSL. Protege el tráfico HTTP entre servidor y browser.'],
    ['Dos encriptaciones', '<b>Asimétrica</b> para autenticación; <b>simétrica</b> para el intercambio de datos.'],
    ['Handshake', 'SYN, SYN-ACK, ACK (TCP) → Client Hello → Server Hello + Certificate → Change Cipher Spec → datos.'],
    ['Client Hello', 'Pide conexión segura y envía la lista de cipher suites soportados, por preferencia.'],
    ['Cipher suite', 'Key exchange · autenticación · encriptación simétrica (bulk) · MAC para integridad.'],
    ['Server Hello', 'Informa el cipher seleccionado y presenta el <b>Certificate</b>, generado por una autoridad certificante.'],
    ['Cadena de confianza', 'Certificado → issuer → (CA intermedia) → <b>ROOT CA</b>. El servidor envía toda la cadena.'],
    ['Autenticación mutua', 'Opcional: el servidor pide el certificado del cliente después del Server Hello. Poco usada.']
  ]
});

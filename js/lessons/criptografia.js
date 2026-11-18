COURSE.add({
  id: 'criptografia',
  title: 'Criptografía: claves, hash y firma',
  desc: 'Las piezas con las que se construye toda comunicación segura: clave simétrica, par de claves pública y privada, funciones de hash y firma digital, y qué garantiza cada una.',
  min: 11, level: 'Intermedio',
  learn: [
    'Los cuatro objetivos: autenticación, integridad, confidencialidad y no repudio',
    'Qué es el espacio de claves y por qué frena la fuerza bruta',
    'En qué se diferencian la encriptación simétrica y la asimétrica',
    'Por qué hace falta la doble encripción para autenticar al emisor',
    'Qué es un digesto y cómo se arma y se verifica una firma digital'
  ],
  stats: [{ k: 'tec', l: 'Técnica' }, { k: 'claves', l: 'Claves' }, { k: 'gar', l: 'Garantiza' }],
  legend: [['req', 'texto claro'], ['key', 'encriptado'], ['ctl', 'digesto / firma'], ['bad', 'impostor o intento fallido']],
  scenes: {
    obj: {
      kind: 'topo',
      nodes: [
        { id: 'A', t: 'user', x: 110, y: 150, l: 'A', sub: 'transmisor' },
        { id: 'NET', t: 'cloud', x: 400, y: 150, l: 'Red' },
        { id: 'B', t: 'user', x: 690, y: 150, l: 'B', sub: 'receptor' },
        { id: 'AUT', t: 'box', x: 110, y: 330, w: 172, h: 56, l: 'Autenticación', sub: 'quién es quién', c: 'green' },
        { id: 'INT', t: 'box', x: 303, y: 330, w: 172, h: 56, l: 'Integridad', sub: 'datos sin alterar', c: 'blue' },
        { id: 'CONF', t: 'box', x: 497, y: 330, w: 172, h: 56, l: 'Confidencialidad', sub: 'nadie más lo lee', c: 'yellow' },
        { id: 'NR', t: 'box', x: 690, y: 330, w: 172, h: 56, l: 'No repudio', sub: 'vincula con el autor', c: 'purple' }
      ],
      links: [{ a: 'A', b: 'NET' }, { a: 'NET', b: 'B' }]
    },
    alg: {
      kind: 'topo',
      nodes: [
        { id: 'P', t: 'doc', x: 120, y: 190, l: 'Texto claro' },
        { id: 'K', t: 'key', x: 400, y: 70, l: 'Clave' },
        { id: 'ALG', t: 'box', x: 400, y: 190, w: 170, h: 56, l: 'Algoritmo', sub: 'criptográfico', c: 'green' },
        { id: 'C', t: 'doc', x: 680, y: 190, l: 'Texto cifrado', c: 'yellow' }
      ],
      links: [{ a: 'P', b: 'ALG', arrow: 1 }, { a: 'K', b: 'ALG', arrow: 1 }, { a: 'ALG', b: 'C', arrow: 1 }]
    },
    sim: {
      kind: 'topo',
      nodes: [
        { id: 'A', t: 'user', x: 80, y: 220, l: 'A' },
        { id: 'E', t: 'lock', x: 240, y: 220, l: 'Encripta' },
        { id: 'NET', t: 'cloud', x: 400, y: 220, l: 'Red' },
        { id: 'D', t: 'lock', x: 560, y: 220, l: 'Desencripta' },
        { id: 'B', t: 'user', x: 720, y: 220, l: 'B' },
        { id: 'K', t: 'key', x: 400, y: 95 }
      ],
      links: [{ a: 'A', b: 'E' }, { a: 'E', b: 'NET' }, { a: 'NET', b: 'D' }, { a: 'D', b: 'B' }, { a: 'K', b: 'E', dash: 1 }, { a: 'K', b: 'D', dash: 1 }]
    },
    asim: {
      kind: 'topo',
      nodes: [
        { id: 'A', t: 'user', x: 80, y: 200, l: 'A' },
        { id: 'E', t: 'lock', x: 240, y: 200, l: 'Encripta' },
        { id: 'NET', t: 'cloud', x: 400, y: 200, l: 'Red' },
        { id: 'D', t: 'lock', x: 560, y: 200, l: 'Desencripta' },
        { id: 'B', t: 'user', x: 720, y: 200, l: 'B' },
        { id: 'PUB', t: 'key', x: 240, y: 85, c: 'green' },
        { id: 'PRIV', t: 'key', x: 560, y: 85, c: 'orange' },
        { id: 'X', t: 'user', x: 80, y: 335, l: 'Impostor', c: 'red' }
      ],
      links: [{ a: 'A', b: 'E' }, { a: 'E', b: 'NET' }, { a: 'NET', b: 'D' }, { a: 'D', b: 'B' }, { a: 'PUB', b: 'E', dash: 1 }, { a: 'PRIV', b: 'D', dash: 1 }, { a: 'X', b: 'E', dash: 1 }]
    },
    doble: {
      kind: 'topo',
      zones: [{ id: 'za', x: 18, y: 120, w: 374, h: 170, l: 'Lado de A', c: 'gray' }, { id: 'zb', x: 408, y: 120, w: 374, h: 170, l: 'Lado de B', c: 'gray' }],
      nodes: [
        { id: 'A', t: 'user', x: 70, y: 205, l: 'A' },
        { id: 'E1', t: 'lock', x: 200, y: 205, l: 'Encripta', sub: 'privada de A', c: 'orange' },
        { id: 'E2', t: 'lock', x: 330, y: 205, l: 'Encripta', sub: 'pública de B', c: 'green' },
        { id: 'D1', t: 'lock', x: 470, y: 205, l: 'Desencripta', sub: 'privada de B', c: 'orange' },
        { id: 'D2', t: 'lock', x: 600, y: 205, l: 'Desencripta', sub: 'pública de A', c: 'green' },
        { id: 'B', t: 'user', x: 730, y: 205, l: 'B' }
      ],
      links: [{ a: 'A', b: 'E1' }, { a: 'E1', b: 'E2' }, { a: 'E2', b: 'D1', thick: 1 }, { a: 'D1', b: 'D2' }, { a: 'D2', b: 'B' }]
    },
    hash: {
      kind: 'topo',
      nodes: [
        { id: 'M1', t: 'doc', x: 110, y: 125, l: 'Documento', sub: '2 MB' },
        { id: 'H1', t: 'box', x: 340, y: 125, w: 130, h: 50, l: 'HASH', c: 'green' },
        { id: 'D1', t: 'box', x: 600, y: 125, w: 230, h: 54, l: 'a3f5 9c21 … 7e04', sub: 'digesto · largo fijo', c: 'yellow' },
        { id: 'M2', t: 'doc', x: 110, y: 290, l: 'Mensaje', sub: 'una sola palabra' },
        { id: 'H2', t: 'box', x: 340, y: 290, w: 130, h: 50, l: 'HASH', c: 'green' },
        { id: 'D2', t: 'box', x: 600, y: 290, w: 230, h: 54, l: 'e1b7 04d2 … 5a90', sub: 'digesto · el mismo largo', c: 'yellow' }
      ],
      links: [{ a: 'M1', b: 'H1', arrow: 1 }, { a: 'H1', b: 'D1', arrow: 1 }, { a: 'M2', b: 'H2', arrow: 1 }, { a: 'H2', b: 'D2', arrow: 1 }]
    },
    firma: {
      kind: 'topo',
      nodes: [
        { id: 'M', t: 'doc', x: 80, y: 140, l: 'Documento' },
        { id: 'H', t: 'box', x: 230, y: 140, w: 100, h: 46, l: 'HASH', c: 'green' },
        { id: 'DG', t: 'box', x: 380, y: 140, w: 110, h: 46, l: 'Digesto', c: 'yellow' },
        { id: 'ENC', t: 'lock', x: 530, y: 140, l: 'Encripta', sub: 'privada de A', c: 'orange' },
        { id: 'SIG', t: 'box', x: 680, y: 140, w: 110, h: 46, l: 'Firma', c: 'purple' },
        { id: 'OUT', t: 'box', x: 380, y: 320, w: 220, h: 56, l: 'Documento + firma', sub: 'lo que se le envía a B', c: 'white' }
      ],
      links: [{ a: 'M', b: 'H', arrow: 1 }, { a: 'H', b: 'DG', arrow: 1 }, { a: 'DG', b: 'ENC', arrow: 1 }, { a: 'ENC', b: 'SIG', arrow: 1 }, { a: 'M', b: 'OUT', arrow: 1, dash: 1 }, { a: 'SIG', b: 'OUT', arrow: 1, dash: 1 }]
    },
    verif: {
      kind: 'topo',
      nodes: [
        { id: 'IN', t: 'box', x: 400, y: 85, w: 220, h: 50, l: 'Documento + firma', sub: 'lo que recibió B', c: 'white' },
        { id: 'DEC', t: 'box', x: 210, y: 200, w: 170, h: 50, l: 'Desencripta', sub: 'con la pública de A', c: 'orange' },
        { id: 'HS', t: 'box', x: 590, y: 200, w: 170, h: 50, l: 'HASH', sub: 'misma función que usó A', c: 'green' },
        { id: 'G1', t: 'box', x: 210, y: 340, w: 170, h: 50, l: 'Digesto', sub: 'el que firmó A', c: 'yellow' },
        { id: 'G2', t: 'box', x: 590, y: 340, w: 170, h: 50, l: 'Digesto', sub: 'calculado por B', c: 'yellow' }
      ],
      links: [{ a: 'IN', b: 'DEC', arrow: 1, l: 'firma', lx: -34 }, { a: 'IN', b: 'HS', arrow: 1, l: 'documento', lx: 46 }, { a: 'DEC', b: 'G1', arrow: 1, id: 'dg1' }, { a: 'HS', b: 'G2', arrow: 1 }, { a: 'G1', b: 'G2', dash: 1, l: 'comparar' }]
    }
  },
  steps: [
    {
      s: 'Objetivos', k: 'contexto', t: 'Para qué sirve la criptografía',
      b: '<p>La <b>criptografía</b> es la ciencia de leer y escribir mensajes codificados. Es el componente fundamental de los mecanismos de:</p><ul><li><b>Autenticación</b>: establece la identidad del transmisor y del receptor.</li><li><b>Integridad</b>: asegura que los datos no fueron alterados.</li><li><b>Confidencialidad</b>: nadie, salvo transmisor y receptor, puede interceptar los datos.</li><li><b>No repudio</b> (vinculación): vincula un documento o transacción con una persona o un sistema.</li></ul>',
      key: 'Cada técnica de esta lección cubre uno o varios de estos cuatro objetivos.',
      scene: 'obj', pk: [{ p: ['A', 'NET', 'B'], l: 'mensaje', d: 2.2 }],
      st: { tec: '—', claves: '—', gar: '—' }
    },
    {
      s: 'Clave', k: 'idea', t: 'Un algoritmo y una clave',
      b: '<p>En general, un mecanismo criptográfico usa un <b>algoritmo</b> y una <b>clave</b>.</p><p>El <b>espacio de claves</b> es el rango de valores posibles de la clave. Cuanto más grande, más difícil es obtenerla por <b>fuerza bruta</b>: aplicar todas las combinaciones posibles hasta encontrarla.</p><p>Con una clave de n bits hay 2ⁿ valores: cada bit que se agrega <b>duplica</b> el trabajo del atacante.</p>',
      key: 'La seguridad descansa en el tamaño del espacio de claves.',
      scene: 'alg', hi: ['K'], tags: { C: 'ilegible sin la clave' },
      pk: [{ p: ['P', 'ALG'], l: 'mensaje', d: 1.1 }, { p: ['K', 'ALG'], l: 'clave', c: 'ctl', d: 1.1, par: 1 }, { p: ['ALG', 'C'], l: 'x7#q9…', c: 'key', d: 1.1, stay: 1 }],
      tbl: { x: 120, y: 290, w: 250, title: 'espacio de claves', cols: ['Bits', 'Valores posibles'], rows: [['8', '256'], ['128', '≈ 3,4 × 10^38'], ['192', '≈ 6,3 × 10^57'], ['256', '≈ 1,2 × 10^77']] },
      notes: [{ x: 440, y: 298, w: 250, c: 'red', text: '<b>Fuerza bruta</b>: probar una clave tras otra hasta dar con la correcta. Con 8 bits son 256 intentos; con 128 bits es impracticable.' }],
      st: { tec: 'Algoritmo + clave', claves: 'n bits → 2ⁿ valores', gar: '—' }
    },
    {
      s: 'Simétrica', k: 'mecanismo', t: 'Encriptación simétrica: una sola clave',
      b: '<p>También llamada de <b>clave secreta</b>: usa una <b>única clave común</b> y el mismo algoritmo para encriptar y para desencriptar.</p><p>Es la más <b>eficiente</b> en términos de cómputo. Su complicación es la <b>distribución de las claves</b>: los dos extremos tienen que tener la misma, sin que nadie más la conozca.</p><p>Ejemplos: <b>DES</b>, <b>3DES</b> (triple DES), <b>RC4</b>, <b>IDEA</b> y <b>AES</b> (128/192/256).</p>',
      fig: 'image182.png', scene: 'sim', hi: ['K'], tags: { K: 'clave secreta K · la misma en los dos extremos', E: 'usa K', D: 'usa K' },
      pk: [{ p: ['A', 'E'], l: 'mensaje', d: 1 }, { p: ['E', 'NET', 'D'], l: 'encriptado', c: 'key', d: 2 }, { p: ['D', 'B'], l: 'mensaje', d: 1, stay: 1 }],
      notes: [{ x: 250, y: 310, w: 300, c: 'yellow', text: 'El problema no es el algoritmo sino la clave: ¿cómo llega a B <b>sin que nadie más la vea</b>?' }],
      st: { tec: 'Simétrica', claves: '1 secreta, compartida', gar: 'Confidencialidad' }
    },
    {
      s: 'Asimétrica', k: 'mecanismo', t: 'Encriptación asimétrica: un par de claves',
      b: '<p>Es la encripción de <b>clave pública</b>. En lugar de una clave única se genera un <b>par</b>: la <b>pública</b> se divulga y la <b>privada</b> se mantiene en reserva.</p><p>Se <b>encripta con la clave pública</b> del destinatario y se <b>desencripta con su clave privada</b>. Cada uno le da al otro su pública.</p><p>Exige <b>más cómputo</b> que la simétrica. Se usa para integridad y confidencialidad de los datos, y para autenticación y no repudio del emisor.</p>',
      fig: 'image183.png', scene: 'asim', hide: ['X'], hi: ['PUB', 'PRIV'], tags: { PUB: 'pública de B · la conocen todos', PRIV: 'privada de B · solo la tiene B' },
      pk: [{ p: ['A', 'E'], l: 'mensaje', d: 1 }, { p: ['E', 'NET', 'D'], l: 'encriptado', c: 'key', d: 2 }, { p: ['D', 'B'], l: 'mensaje', d: 1, stay: 1 }],
      st: { tec: 'Asimétrica', claves: 'Par pública / privada', gar: 'Confidencialidad' }
    },
    {
      s: 'Un sentido', k: 'problema', t: 'Un solo sentido no dice quién escribe',
      b: '<p>Si solo se encripta con la pública de B, la <b>confidencialidad</b> está garantizada: nadie más que B puede leer el mensaje.</p><p>Pero hay un inconveniente con la <b>autenticación</b> y el <b>no repudio</b>: para encriptar se usó únicamente una clave que <b>conocen todos</b>. Cualquiera podría mandar un mensaje haciéndose pasar por otro.</p>',
      key: 'La clave pública protege el contenido, pero no prueba la identidad del emisor.',
      scene: 'asim', hi: ['X', 'PUB'], dim: ['A'], tags: { X: 'dice ser A', B: '¿lo mandó A?', PUB: 'pública de B · la conocen todos', PRIV: 'privada de B' },
      pk: [{ p: ['X', 'E'], l: 'soy A', c: 'bad', d: 1.1 }, { p: ['E', 'NET', 'D'], l: 'encriptado', c: 'key', d: 2 }, { p: ['D', 'B'], l: 'soy A', c: 'bad', d: 1, stay: 1 }],
      notes: [{ x: 300, y: 300, w: 330, c: 'red', text: 'El impostor también tiene la <b>pública de B</b>. El mensaje llega bien encriptado y B lo abre sin problema, pero no tiene forma de saber quién lo escribió.' }],
      st: { gar: 'Confidencialidad, pero no identidad' }
    },
    {
      s: 'Doble', k: 'mecanismo', t: 'Doble encripción',
      b: '<p>La solución es encriptar <b>dos veces</b>:</p><ul><li>A encripta el mensaje con <b>su clave privada</b> y con la <b>pública de B</b>.</li><li>B lo desencripta con <b>su clave privada</b> y con la <b>pública de A</b>.</li></ul><p>Solo B puede abrirlo, y solo A pudo haberlo generado: tenemos confidencialidad y, además, la posibilidad de <b>autenticación y no repudio</b>.</p>',
      key: 'La privada de A prueba quién lo envió; la pública de B asegura que solo B lo lea.',
      scene: 'doble',
      pk: [{ p: ['A', 'E1'], l: 'mensaje', d: .8 }, { p: ['E1', 'E2'], l: '1 capa', c: 'ctl', d: .8 }, { p: ['E2', 'D1'], l: '2 capas', c: 'key', d: 1.1 }, { p: ['D1', 'D2'], l: '1 capa', c: 'ctl', d: .8 }, { p: ['D2', 'B'], l: 'mensaje', d: .8, stay: 1 }],
      notes: [
        { x: 60, y: 312, w: 300, c: 'orange', text: 'Lo que abre la <b>pública de A</b> solo pudo cerrarlo la <b>privada de A</b>: autenticación y no repudio.' },
        { x: 440, y: 312, w: 300, c: 'green', text: 'Lo que cierra la <b>pública de B</b> solo lo abre la <b>privada de B</b>: confidencialidad.' }
      ],
      st: { tec: 'Doble encripción', claves: 'Los dos pares', gar: 'Confid. + autenticación + no repudio' }
    },
    {
      s: 'Hash', k: 'mecanismo', t: 'Funciones de hash',
      b: '<p>Una <b>función de hash</b> toma una entrada de longitud arbitraria y genera una salida de <b>longitud fija</b>: el <b>digesto</b>. Debe cumplir:</p><ul><li><b>Consistencia</b>: la misma entrada da siempre la misma salida.</li><li><b>Aleatoriedad</b>: impide adivinar el mensaje original.</li><li><b>Unicidad</b>: es prácticamente imposible hallar dos mensajes con el mismo digesto.</li><li><b>One way</b>: dado un digesto, no se puede acertar la entrada.</li></ul><p>Garantizan la <b>integridad</b>. Ejemplos: MD4, MD5, SHA.</p>',
      fig: 'image184.png', scene: 'hash', hi: ['D1', 'D2'],
      pk: [{ p: ['M1', 'H1'], l: 'entrada', d: 1 }, { p: ['M2', 'H2'], l: 'entrada', d: 1, par: 1 }, { p: ['H1', 'D1'], l: 'digesto', c: 'ctl', d: 1 }, { p: ['H2', 'D2'], l: 'digesto', c: 'ctl', d: 1, par: 1 }, { p: [[482, 125], 'H1'], l: 'one way', c: 'bad', d: 1.2, drop: 1, dropAt: .55 }],
      st: { tec: 'Función de hash', claves: 'Ninguna', gar: 'Integridad' }
    },
    {
      s: 'Firma', k: 'mecanismo', t: 'Firma digital: un digesto encriptado',
      b: '<p>Una <b>firma digital</b> es un <b>digesto encriptado</b> que se adiciona a un documento.</p><p>El emisor calcula el hash del documento y encripta ese digesto con su <b>clave privada</b>. El resultado, la firma, viaja junto con el documento.</p><p>Puede utilizarse para <b>confirmar la identidad del emisor</b> y para <b>garantizar la integridad</b> del documento.</p>',
      key: 'Firma = hash del documento + encripción con la clave privada del emisor.',
      fig: 'image185.png', scene: 'firma', hi: ['SIG', 'OUT'],
      pk: [{ p: ['M', 'H'], l: 'documento', d: .8 }, { p: ['H', 'DG'], l: 'digesto', c: 'ctl', d: .8 }, { p: ['DG', 'ENC'], l: 'digesto', c: 'ctl', d: .8 }, { p: ['ENC', 'SIG'], l: 'firma', c: 'key', d: .8 }, { p: ['SIG', 'OUT'], l: 'firma', c: 'key', d: 1.1, stay: 1 }, { p: ['M', 'OUT'], l: 'documento', d: 1.1, par: 1 }],
      st: { tec: 'Firma digital', claves: 'Privada del emisor', gar: 'Identidad + integridad' }
    },
    {
      s: 'Verificar', k: 'mecanismo', t: 'Verificación de la firma',
      b: '<p>El receptor separa el documento de la firma y hace dos cosas:</p><ul><li><b>Desencripta la firma</b> con la clave pública del emisor: obtiene el digesto original.</li><li>Calcula el <b>hash del documento</b> recibido: obtiene otro digesto.</li></ul><p>Después los <b>compara</b>. Si coinciden, el documento no fue alterado y la firma solo pudo generarla el dueño de la clave privada.</p>',
      fig: 'image186.png', scene: 'verif', hi: ['G1', 'G2'],
      pk: [{ p: ['IN', 'DEC'], l: 'firma', c: 'key', d: 1 }, { p: ['IN', 'HS'], l: 'documento', d: 1, par: 1 }, { p: ['DEC', 'G1'], l: 'digesto', c: 'ctl', d: .9 }, { p: ['HS', 'G2'], l: 'digesto', c: 'ctl', d: .9, par: 1 }],
      notes: [{ x: 300, y: 236, w: 200, c: 'green', text: '<b>Si son iguales</b>: el documento está íntegro y lo firmó A. <b>Si difieren</b>: se alteró o no es de A.' }],
      st: { claves: 'Pública del emisor' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'Criptografía en una mirada',
      b: '<ul><li><b>Simétrica</b>: una clave, eficiente; el problema es distribuirla.</li><li><b>Asimétrica</b>: par pública/privada, más costosa; se encripta con la pública del destinatario.</li><li><b>Doble encripción</b>: suma autenticación y no repudio.</li><li><b>Hash</b>: digesto de largo fijo, garantiza integridad.</li><li><b>Firma digital</b>: digesto encriptado que se agrega al documento.</li></ul><p>En la próxima lección, la última del curso, vemos cómo <b>TLS</b> combina todas estas piezas para proteger el tráfico web.</p>',
      scene: 'obj', hi: ['AUT', 'INT', 'CONF', 'NR'], tags: { AUT: 'doble encripción · firma', INT: 'hash · firma', CONF: 'encriptación', NR: 'clave privada' },
      pk: [{ p: ['A', 'NET', 'B'], l: 'encriptado + firma', c: 'key', d: 2.2 }],
      st: { tec: 'Todas', claves: 'Simétrica + par asimétrico', gar: 'Los cuatro objetivos' }
    }
  ],
  quiz: [
    { q: 'A quiere enviarle a B un mensaje que solo B pueda leer, usando encriptación asimétrica. ¿Con qué clave lo encripta?', o: ['Con la clave privada de A', 'Con la clave pública de B', 'Con la clave privada de B', 'Con la clave pública de A'], a: 1, why: 'Se encripta con la pública del destinatario y solo su clave privada puede desencriptarlo.' },
    { q: '¿Cuál es la principal complicación de la encriptación simétrica?', o: ['Es muy costosa en cómputo', 'El digesto tiene largo fijo', 'La distribución de la clave entre los extremos', 'No garantiza confidencialidad'], a: 2, why: 'Es eficiente, pero los dos extremos tienen que compartir la misma clave secreta sin que nadie más la obtenga.' },
    { q: '¿Qué agrega la doble encripción (privada de A + pública de B) respecto de encriptar solo con la pública de B?', o: ['Más velocidad', 'Autenticación y no repudio del emisor', 'Un digesto de largo fijo', 'Nada: es equivalente'], a: 1, why: 'La pública de B la conocen todos; al usar además la privada de A queda probado que el mensaje lo generó A.' },
    { q: '¿Qué es una firma digital?', o: ['El documento completo encriptado con una clave simétrica', 'Un digesto encriptado que se adiciona al documento', 'La clave pública del emisor', 'Un hash sin encriptar'], a: 1, why: 'Se calcula el hash del documento y ese digesto se encripta con la clave privada del emisor; confirma identidad e integridad.' }
  ],
  cheat: [
    ['Objetivos', 'Autenticación, integridad, confidencialidad y no repudio (vinculación).'],
    ['Espacio de claves', 'Rango de valores posibles de la clave; cuanto mayor, más difícil la <b>fuerza bruta</b>.'],
    ['Simétrica', 'Clave secreta única, mismo algoritmo en ambos sentidos. Eficiente; problema: distribución. DES, 3DES, RC4, IDEA, AES.'],
    ['Asimétrica', 'Par <b>pública</b> (se divulga) / <b>privada</b> (se guarda). Se encripta con la pública del destinatario. Más cómputo.'],
    ['Doble encripción', 'Privada de A + pública de B → confidencialidad, autenticación y no repudio.'],
    ['Hash', 'Entrada arbitraria → <b>digesto</b> de largo fijo. Consistencia, aleatoriedad, unicidad, one way. MD4, MD5, SHA.'],
    ['Firma digital', 'Digesto encriptado con la privada del emisor, agregado al documento. Se verifica con su pública comparando digestos.']
  ]
});

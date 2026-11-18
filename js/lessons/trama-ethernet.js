COURSE.add({
  id: 'trama-ethernet',
  title: 'La trama Ethernet y las direcciones MAC',
  desc: 'El sobre que arma la capa de enlace, campo por campo: para qué sirve cada uno, cómo es una dirección MAC y cómo decide cada estación si una trama es para ella.',
  min: 10, level: 'Inicial',
  learn: [
    'Los ocho campos de la trama Ethernet / 802.3 y el tamaño de cada uno',
    'Cómo se compone una dirección MAC de 48 bits (OUI + DUI) y quién la asigna',
    'Cómo decide una estación si procesa una trama: unicast, broadcast y multicast',
    'La diferencia entre Type (Ethernet II) y Length (802.3)',
    'Para qué sirven el PAD (mínimo de 64 bytes) y el FCS (CRC de 32 bits)'
  ],
  stats: [{ k: 'campo', l: 'Campo' }, { k: 'tam', l: 'Tamaño' }, { k: 'proc', l: 'La procesan' }],
  legend: [['req', 'unicast'], ['ctl', 'broadcast'], ['key', 'multicast']],
  scenes: {
    trama: {
      kind: 'fields', title: 'Trama Ethernet / 802.3 (en el orden en que sale al cable)', rh: 50,
      rows: [[
        { id: 'pre', l: 'Preámbulo', s: '7 B', w: 7, c: 'gray' }, { id: 'sfd', l: 'SFD', s: '1 B', w: 2.6, c: 'gray' },
        { id: 'da', l: 'DA', s: '6 B', w: 6, c: 'green' }, { id: 'sa', l: 'SA', s: '6 B', w: 6, c: 'blue' },
        { id: 'len', l: 'Len/Type', s: '2 B', w: 4.6, c: 'purple' }, { id: 'dat', l: 'Datos', s: '0 – 1500 B', w: 11, c: 'white' },
        { id: 'pad', l: 'Pad', s: '0 – 46 B', w: 4.6, c: 'yellow' }, { id: 'fcs', l: 'FCS', s: '4 B', w: 4, c: 'orange' }
      ]],
      zoom: {
        from: 'da', title: 'Una dirección MAC: 48 bits = 6 bytes',
        rows: [
          [{ id: 'b1', l: '00', s: '8 bits', w: 1, c: 'green' }, { id: 'b2', l: '12', s: '8 bits', w: 1, c: 'green' }, { id: 'b3', l: 'F0', s: '8 bits', w: 1, c: 'green' },
            { id: 'b4', l: '22', s: '8 bits', w: 1, c: 'blue' }, { id: 'b5', l: '1C', s: '8 bits', w: 1, c: 'blue' }, { id: 'b6', l: '76', s: '8 bits', w: 1, c: 'blue' }],
          [{ id: 'oui', l: 'OUI · identifica al fabricante', s: '24 bits · el bloque lo asigna la IEEE', w: 3, c: 'green' }, { id: 'dui', l: 'DUI · identifica al dispositivo', s: '24 bits · lo asigna el fabricante', w: 3, c: 'blue' }]
        ]
      }
    },
    red: {
      kind: 'topo',
      nodes: [
        { id: 'BUS', t: 'bus', x: 30, y: 285, w: 740, l: 'medio compartido' },
        { id: 'A', t: 'pc', x: 150, y: 150, l: 'A' }, { id: 'B', t: 'pc', x: 330, y: 150, l: 'B' },
        { id: 'C', t: 'pc', x: 510, y: 150, l: 'C' }, { id: 'D', t: 'pc', x: 690, y: 150, l: 'D' },
        { id: 'mA', t: 'txt', x: 208, y: 150, l: 'MAC\n…-0A' }, { id: 'mB', t: 'txt', x: 388, y: 150, l: 'MAC\n…-0B' },
        { id: 'mC', t: 'txt', x: 568, y: 150, l: 'MAC\n…-0C' }, { id: 'mD', t: 'txt', x: 748, y: 150, l: 'MAC\n…-0D' }
      ],
      links: [{ a: 'A', b: 'BUS' }, { a: 'B', b: 'BUS' }, { a: 'C', b: 'BUS' }, { a: 'D', b: 'BUS' }]
    },
    tipos: {
      kind: 'fields', title: 'El mismo campo de 2 bytes, dos significados', rh: 50,
      rows: [
        [{ id: 'n1', l: 'Ethernet II', w: 5.5, c: 'gray' }, { id: 'da1', l: 'DA', s: '6 B', w: 3.5, c: 'green' }, { id: 'sa1', l: 'SA', s: '6 B', w: 3.5, c: 'blue' },
          { id: 'typ', l: 'Type = IPv4', s: 'protocolo que pidió el envío', w: 8.5, c: 'purple' }, { id: 'dat1', l: 'Datos', w: 8, c: 'white' }, { id: 'fcs1', l: 'FCS', s: '4 B', w: 3, c: 'orange' }],
        [{ id: 'n2', l: 'IEEE 802.3', w: 5.5, c: 'gray' }, { id: 'da2', l: 'DA', s: '6 B', w: 3.5, c: 'green' }, { id: 'sa2', l: 'SA', s: '6 B', w: 3.5, c: 'blue' },
          { id: 'lng', l: 'Length = 300', s: 'bytes del campo de datos', w: 8.5, c: 'yellow' }, { id: 'dat2', l: 'Datos (300 B)', w: 8, c: 'white' }, { id: 'fcs2', l: 'FCS', s: '4 B', w: 3, c: 'orange' }]
      ]
    },
    minima: {
      kind: 'fields', title: 'Tamaño de la trama, de DA a FCS', rh: 50,
      rows: [
        [{ id: 'm0', l: 'Mínima', s: '64 B', w: 4.5, c: 'gray' }, { id: 'mda', l: 'DA', s: '6 B', w: 3, c: 'green' }, { id: 'msa', l: 'SA', s: '6 B', w: 3, c: 'blue' }, { id: 'mlen', l: 'Len', s: '2 B', w: 2.5, c: 'purple' },
          { id: 'mdat', l: 'Datos', s: '10 B', w: 4, c: 'white' }, { id: 'mpad', l: 'Pad (relleno)', s: '36 B', w: 9, c: 'yellow' }, { id: 'mfcs', l: 'FCS', s: '4 B', w: 3, c: 'orange' }],
        [{ id: 'x0', l: 'Máxima', s: '1518 B', w: 4.5, c: 'gray' }, { id: 'xda', l: 'DA', s: '6 B', w: 3, c: 'green' }, { id: 'xsa', l: 'SA', s: '6 B', w: 3, c: 'blue' }, { id: 'xlen', l: 'Len', s: '2 B', w: 2.5, c: 'purple' },
          { id: 'xdat', l: 'Datos', s: '1500 B', w: 13, c: 'white' }, { id: 'xfcs', l: 'FCS', s: '4 B', w: 3, c: 'orange' }]
      ]
    }
  },
  steps: [
    {
      s: 'El sobre', k: 'contexto', t: 'La trama: el sobre de la capa de enlace',
      b: '<p>Cuando una estación envía un mensaje al medio, lo hace con el formato de la <b>trama Ethernet</b>: el <b>sobre</b> en el que la capa de enlace mete lo que recibe de la capa de red.</p><p>El sobre tiene una <b>cabecera</b>, con los elementos que el protocolo necesita para operar, y un <b>trailer</b> al final.</p><p>La figura del apunte la dibuja al revés (preámbulo a la derecha) porque la flecha marca el <b>sentido de la transmisión</b>: lo primero que sale al cable es el preámbulo.</p>',
      key: 'Es el mismo formato de trama desde los 10 Mbps originales hasta 10 Gb.',
      fig: 'image4.png', scene: 'trama',
      det: '<b>Cabecera</b>: del preámbulo al Len/Type · <b>Carga</b>: datos + relleno · <b>Trailer</b>: FCS. Los números son el tamaño de cada campo en <b>bytes</b>.',
      st: { campo: 'Trama completa', tam: '8 campos', proc: '—' }
    },
    {
      s: 'Preámbulo', k: 'detalle', t: 'Preámbulo y SFD: preparar al receptor',
      b: '<p>Los dos primeros campos no llevan información: preparan a las estaciones que escuchan.</p><ul><li><b>Preámbulo</b> (7 bytes): logra que todas las estaciones se <b>sincronicen</b>. Originalmente se usaba el código <b>Manchester</b>, que garantiza una transición por cada intervalo de tiempo.</li><li><b>SFD</b>, Start of Frame Delimiter (1 byte): indica el <b>fin del preámbulo</b> y el comienzo de la trama.</li></ul>',
      scene: 'trama', hi: ['pre', 'sfd'],
      det: 'Primero <b>7 bytes</b> para engancharse con el ritmo del emisor; después <b>1 byte</b> que avisa que lo que sigue ya es la trama.',
      st: { campo: 'Preámbulo + SFD', tam: '7 + 1 bytes' }
    },
    {
      s: 'DA y SA', k: 'detalle', t: 'DA y SA: a quién va y quién la envía',
      b: '<p>Siguen las dos direcciones, de <b>6 bytes</b> cada una:</p><ul><li><b>DA</b> (Destination Address): la dirección de destino.</li><li><b>SA</b> (Source Address): la dirección de origen.</li></ul><p>Son las <b>MAC address</b>: direcciones de <b>48 bits</b> asociadas a la interfaz de red. Cada dispositivo con placa de red trae su MAC <b>de fábrica</b>, y esa dirección es <b>única</b>: no se repite.</p>',
      key: 'El destino va primero: es lo primero que necesita mirar quien recibe la trama.',
      scene: 'trama', hi: ['da', 'sa'],
      det: 'DA y SA miden <b>6 bytes = 48 bits</b> cada una. Una MAC se escribe en hexadecimal, por ejemplo <code>00-12-F0-22-1C-76</code>.',
      st: { campo: 'DA y SA', tam: '6 + 6 bytes' }
    },
    {
      s: 'MAC', k: 'detalle', t: 'Dentro de una MAC: OUI + DUI',
      b: '<p>La dirección MAC se compone de dos mitades:</p><ul><li><b>OUI</b>: identificador único del <b>fabricante</b>.</li><li><b>DUI</b>: identificador único del <b>dispositivo</b>.</li></ul><p>Las direcciones las regula la <b>IEEE</b>: le asigna un <b>bloque OUI</b> a cada fabricante, y el fabricante le asigna un DUI a cada uno de sus dispositivos.</p>',
      key: 'IEEE reparte los OUI, cada fabricante reparte sus DUI: así ninguna MAC se repite.',
      scene: 'trama', hi: ['da', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'oui', 'dui'], zoom: 1,
      det: 'En <code>00-12-F0-22-1C-76</code>, la mitad <b>00-12-F0</b> dice quién fabricó la placa y <b>22-1C-76</b> cuál placa es.',
      st: { campo: 'MAC address', tam: '48 bits (24 + 24)' }
    },
    {
      s: 'Unicast', k: 'mecanismo', t: 'Unicast: ¿esta trama es para mí?',
      b: '<p>La trama se propaga por el medio y <b>la reciben todas</b> las estaciones. Cada una decide qué hacer mirando la <b>DA</b>:</p><ul><li>Si es <b>igual a su MAC</b>, la recibe y la procesa.</li><li>Si es distinta, la <b>ignora y descarta</b>.</li></ul><p>Esto es <b>unicast</b>: hay un origen y un destino, el remitente le envía un mensaje al destinatario. En la animación, A le escribe a C.</p>',
      key: 'El medio es compartido, pero el direccionamiento hace que solo el destinatario se quede con la trama.',
      scene: 'red', hi: ['A', 'C'], tags: { A: 'DA = …-0C', B: 'no es mi MAC', C: 'es mi MAC', D: 'no es mi MAC' },
      fx: [{ k: 'sig', bus: 'BUS', from: 'A', c: 'req', t: 0, d: 1.3 }],
      pk: [{ p: ['A', 'BUS', 'B'], l: 'para …-0C', t: .1, d: 1.3, drop: 1 }, { p: ['A', 'BUS', 'C'], l: 'para …-0C', t: .1, d: 1.6, stay: 1 }, { p: ['A', 'BUS', 'D'], l: 'para …-0C', t: .1, d: 1.9, drop: 1 }],
      notes: [{ x: 190, y: 322, w: 420, c: 'yellow', text: 'Cada estación primero <b>chequea el CRC</b> (campo FCS). Si es correcto, compara la <b>DA</b> con su propia MAC: solo C la procesa.' }],
      st: { campo: 'DA unicast', tam: '6 bytes', proc: 'Solo el destinatario' }
    },
    {
      s: 'Broadcast', k: 'mecanismo', t: 'Broadcast: todos unos, para todos',
      b: '<p>Existen direcciones especiales. La de <b>broadcast</b> se completa con <b>todos unos</b>: 48 bits en 1, que en hexadecimal se escribe <code>FF-FF-FF-FF-FF-FF</code>.</p><p>Esa dirección de destino indica que el mensaje va dirigido a <b>todas las estaciones de la red</b>: todas lo reciben <b>y lo procesan</b>.</p>',
      key: 'Broadcast = «para todos». Vuelve a aparecer en cada lección que sigue: bridges, switches y VLANs.',
      scene: 'red', hi: ['A'], tags: { A: 'DA = FF-FF-FF-FF-FF-FF', B: 'la proceso', C: 'la proceso', D: 'la proceso' },
      fx: [{ k: 'sig', bus: 'BUS', from: 'A', c: 'ctl', t: 0, d: 1.3 }],
      pk: [{ p: ['A', 'BUS', 'B'], l: 'broadcast', c: 'ctl', t: .1, d: 1.3, stay: 1 }, { p: ['A', 'BUS', 'C'], l: 'broadcast', c: 'ctl', t: .1, d: 1.6, stay: 1 }, { p: ['A', 'BUS', 'D'], l: 'broadcast', c: 'ctl', t: .1, d: 1.9, stay: 1 }],
      notes: [{ x: 230, y: 322, w: 340, c: 'purple', text: '<b>FF-FF-FF-FF-FF-FF</b> = 48 bits en uno. Ninguna estación la descarta.' }],
      st: { campo: 'DA broadcast', proc: 'Todas las estaciones' }
    },
    {
      s: 'Multicast', k: 'mecanismo', t: 'Multicast: para un grupo',
      b: '<p>En <b>multicast</b> el mensaje va dirigido a un <b>grupo</b> de destinatarios: hay una dirección MAC que identifica al grupo.</p><p>Una estación recibe y procesa esa trama <b>solo si está en el grupo</b>.</p><p>Entonces, cada estación revisa la DA por si es:</p><ul><li><b>unicast</b> y el destinatario es ella,</li><li><b>broadcast</b>, o</li><li><b>multicast</b> de un grupo al que pertenece.</li></ul>',
      scene: 'red', hi: ['B', 'D'], tags: { A: 'DA = MAC del grupo', B: 'estoy en el grupo', C: 'no estoy: descarto', D: 'estoy en el grupo' },
      fx: [{ k: 'sig', bus: 'BUS', from: 'A', c: 'key', t: 0, d: 1.3 }],
      pk: [{ p: ['A', 'BUS', 'B'], l: 'multicast', c: 'key', t: .1, d: 1.3, stay: 1 }, { p: ['A', 'BUS', 'C'], l: 'multicast', c: 'key', t: .1, d: 1.6, drop: 1 }, { p: ['A', 'BUS', 'D'], l: 'multicast', c: 'key', t: .1, d: 1.9, stay: 1 }],
      notes: [{ x: 230, y: 322, w: 340, c: 'yellow', text: 'B y D pertenecen al grupo y la procesan. C la recibe igual, pero la descarta.' }],
      st: { campo: 'DA multicast', proc: 'Las del grupo' }
    },
    {
      s: 'Len/Type', k: 'comparación', t: 'Len/Type: un campo, dos lecturas',
      b: '<p>Después de las direcciones viene un campo de <b>2 bytes</b> que significa cosas distintas según el estándar:</p><ul><li>En <b>Ethernet II</b> es <b>Type</b> (o <b>ethertype</b>): indica el <b>protocolo</b> que solicitó la transmisión, para entregarle los datos en el destino. Por ejemplo, IPv4.</li><li>En <b>802.3</b> es <b>Length</b>: contiene la <b>longitud del campo de datos</b>.</li></ul>',
      key: 'Mismo lugar y mismo tamaño en las dos versiones: por eso el campo se llama Len/Type.',
      scene: 'tipos', hi: ['n1', 'typ', 'n2', 'lng'],
      det: 'El resto de la trama es idéntico. Lo único que cambia es <b>cómo se interpreta</b> este campo: a quién entregar los datos (Type) o cuántos bytes de datos hay (Length).',
      st: { campo: 'Len / Type', tam: '2 bytes', proc: '—' }
    },
    {
      s: 'PAD y FCS', k: 'detalle', t: 'Datos, PAD y FCS: el final de la trama',
      b: '<ul><li><b>Datos</b>: de 0 a 1500 bytes. Es el mensaje que entregó la capa de red.</li><li><b>PAD</b>: de 0 a 46 bytes de <b>relleno</b>. Si la trama no llega al mínimo de <b>64 bytes</b> que fija el estándar (la ventana de colisión), la capa de enlace completa lo que falta.</li><li><b>FCS</b>, Frame Check Sequence: 4 bytes con un <b>CRC de 32 bits</b>. Cada estación lo chequea antes de mirar la dirección de destino.</li></ul>',
      key: 'PAD garantiza el tamaño mínimo; FCS permite detectar que la trama llegó dañada.',
      scene: 'minima',
      det: '<b>Mínima</b>: 6 + 6 + 2 + 10 de datos + <b>36 de relleno</b> + 4 = <b>64 bytes</b>. <b>Máxima</b>: 6 + 6 + 2 + 1500 + 4 = <b>1518 bytes</b>. Con 46 bytes de datos o más, el PAD queda en 0.',
      st: { campo: 'Datos + PAD + FCS', tam: '46 a 1500 + 4 bytes' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'La trama en una mirada',
      b: '<ul><li><b>Preámbulo + SFD</b> (7 + 1): sincronizan y marcan el inicio.</li><li><b>DA y SA</b> (6 + 6): direcciones MAC de 48 bits, OUI + DUI.</li><li>La DA puede ser <b>unicast</b>, <b>broadcast</b> (todos unos) o <b>multicast</b> (un grupo).</li><li><b>Len/Type</b> (2): protocolo en Ethernet II, longitud en 802.3.</li><li><b>Datos + PAD</b>: hasta 1500 bytes, con relleno para llegar a 64.</li><li><b>FCS</b> (4): CRC de 32 bits.</li></ul><p>En la próxima lección aparecen los equipos que leen estas direcciones para decidir por dónde va cada trama: del <b>hub</b> al <b>switch</b>.</p>',
      scene: 'trama', zoom: 1,
      st: { campo: 'Trama completa', tam: '64 a 1518 bytes', proc: 'Según la DA' }
    }
  ],
  quiz: [
    { q: '¿Cómo está compuesta una dirección MAC?', o: ['32 bits: red + host', '48 bits: OUI del fabricante + DUI del dispositivo', '64 bits: prioridad + dirección', '48 bits elegidos al azar por cada estación'], a: 1, why: 'La IEEE le asigna un bloque OUI a cada fabricante y el fabricante un DUI a cada dispositivo: 24 + 24 = 48 bits.' },
    { q: 'Una trama llega con dirección de destino FF-FF-FF-FF-FF-FF. ¿Qué estaciones la procesan?', o: ['Ninguna: es una dirección inválida', 'Solo la que tenga esa MAC de fábrica', 'Todas las estaciones de la red', 'Solo las que pertenecen a un grupo'], a: 2, why: 'Todos unos es la dirección de broadcast: va dirigida a todas las estaciones, que la reciben y la procesan.' },
    { q: 'En Ethernet II, ¿qué indica el campo de 2 bytes que sigue a la dirección de origen?', o: ['La longitud del campo de datos', 'El protocolo que solicitó la transmisión (por ejemplo IPv4)', 'La cantidad de bytes de relleno', 'El resultado del CRC'], a: 1, why: 'En Ethernet II es Type o ethertype; en 802.3 ese mismo campo contiene la longitud de los datos.' },
    { q: 'La capa de red entrega solo 10 bytes de datos. ¿Qué hace la capa de enlace?', o: ['Descarta el mensaje por ser muy corto', 'Agranda el preámbulo', 'Completa con 36 bytes de PAD para llegar a los 64 bytes', 'Envía la trama de 28 bytes tal cual'], a: 2, why: 'El estándar exige un mínimo de 64 bytes; el campo PAD (0 a 46 bytes) rellena lo que falte: 6 + 6 + 2 + 10 + 36 + 4 = 64.' }
  ],
  cheat: [
    ['Preámbulo / SFD', '7 bytes para que las estaciones se sincronicen + 1 byte que marca el fin del preámbulo y el inicio de la trama.'],
    ['DA / SA', 'Dirección de destino y de origen, <b>6 bytes</b> cada una. Son direcciones MAC.'],
    ['MAC address', '48 bits, única, de fábrica. <b>OUI</b> (fabricante, lo asigna la IEEE) + <b>DUI</b> (dispositivo, lo asigna el fabricante).'],
    ['Unicast / broadcast / multicast', 'Un destinatario · todas las estaciones (48 unos, <code>FF-FF-FF-FF-FF-FF</code>) · un grupo identificado por una MAC.'],
    ['Len/Type', '2 bytes. <b>Ethernet II</b>: tipo (protocolo de capa superior). <b>802.3</b>: longitud del campo de datos.'],
    ['Datos / PAD', 'Datos: 0 a 1500 bytes. PAD: 0 a 46 bytes de relleno para alcanzar el mínimo de <b>64 bytes</b>.'],
    ['FCS', 'Frame Check Sequence: 4 bytes, <b>CRC de 32 bits</b>. Se chequea antes que la dirección de destino.']
  ]
});

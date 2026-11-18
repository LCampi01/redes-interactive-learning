COURSE.add({
  id: 'wlan-pcf-trama',
  title: 'PCF, tramas 802.11 y asociación',
  desc: 'Cómo el Access Point toma el control del medio y sondea a las estaciones, qué lleva adentro una trama 802.11, cómo se une una terminal a la celda y en qué se diferencian 802.11 b, a, g y n.',
  min: 11, level: 'Intermedio',
  learn: [
    'Qué es PCF y cómo se alterna con DCF dentro del intervalo de repetición',
    'Para qué sirven los beacons y por qué SIFS < PIFS < DIFS deja afuera a las estaciones sin PCF',
    'La secuencia de sondeo: beacon, datos + poll, datos + ACK y fin del período libre de contención',
    'El formato de la trama 802.11 y los subcampos de Frame Control',
    'Los pasos para incorporarse a una celda, WEP y la evolución 802.11 b / a / g / n'
  ],
  stats: [{ k: 'modo', l: 'Modo' }, { k: 'ifs', l: 'Espera entre tramas' }, { k: 'trama', l: 'Tipo de trama' }],
  legend: [['ctl', 'beacon / CF-End'], ['data', 'AP: datos + ACK + poll'], ['req', 'estación: datos + ACK'], ['key', 'autenticación']],
  scenes: {
    celda: {
      kind: 'topo',
      nodes: [
        { id: 'AP', t: 'ap', x: 400, y: 110, l: 'Access Point' },
        { id: 'E1', t: 'pc', x: 170, y: 235, l: 'Estación 1' },
        { id: 'E2', t: 'pc', x: 400, y: 245, l: 'Estación 2' },
        { id: 'E3', t: 'pc', x: 630, y: 235, l: 'Estación 3' },
        { id: 'rep', t: 'txt', x: 215, y: 340, l: '←  intervalo de repetición  →' },
        { id: 'b1', t: 'box', x: 50, y: 372, w: 40, h: 36, l: 'B', c: 'purple' },
        { id: 'pcf1', t: 'box', x: 160, y: 372, w: 176, h: 36, l: 'PCF · sondea el AP', c: 'orange' },
        { id: 'dcf1', t: 'box', x: 325, y: 372, w: 146, h: 36, l: 'DCF · contención', c: 'gray' },
        { id: 'b2', t: 'box', x: 420, y: 372, w: 40, h: 36, l: 'B', c: 'purple' },
        { id: 'pcf2', t: 'box', x: 530, y: 372, w: 176, h: 36, l: 'PCF · sondea el AP', c: 'orange' },
        { id: 'dcf2', t: 'box', x: 695, y: 372, w: 146, h: 36, l: 'DCF · contención', c: 'gray' }
      ],
      links: [{ a: 'E1', b: 'AP', wl: 1 }, { a: 'E2', b: 'AP', wl: 1 }, { a: 'E3', b: 'AP', wl: 1 }]
    },
    ifs: {
      kind: 'fields', title: 'Después de una trama: cuánto espera cada uno', rh: 54,
      rows: [
        [{ id: 'p1', l: 'trama anterior', w: 4.6, c: 'gray' }, { id: 'sifs', l: 'SIFS', s: 'corto', w: 1.5, c: 'green' }, { id: 'r1', l: 'sigue el PCF: datos, ACK, poll', s: 'el AP o la estación sondeada', w: 10.9, c: 'green' }],
        [{ id: 'p2', l: 'trama anterior', w: 4.6, c: 'gray' }, { id: 'pifs', l: 'PIFS', s: 'intermedio', w: 3, c: 'yellow' }, { id: 'r2', l: 'el AP retoma y sondea a la siguiente', s: 'cuando la estación sondeada no respondió', w: 9.4, c: 'yellow' }],
        [{ id: 'p3', l: 'trama anterior', w: 4.6, c: 'gray' }, { id: 'difs', l: 'DIFS', s: 'largo', w: 4.6, c: 'red' }, { id: 'r3', l: 'recién acá entraría una estación sin PCF', s: 'pero el medio ya está ocupado', w: 7.8, c: 'red', ghost: 1 }]
      ]
    },
    pcf: {
      kind: 'seq',
      actors: [{ id: 'AP', l: 'Access Point', t: 'ap' }, { id: 'E1', l: 'Estación 1', t: 'pc' }, { id: 'E2', l: 'Estación 2', t: 'pc' }, { id: 'E3', l: 'Estación 3', t: 'pc' }],
      msgs: [
        { f: 'AP', to: 'E3', l: 'BEACON · empieza el período libre de contención', c: 'ctl' },
        { f: 'AP', to: 'E1', l: 'SIFS · D1 + poll', c: 'data' },
        { f: 'E1', to: 'AP', l: 'SIFS · U1 + ACK', c: 'req' },
        { f: 'AP', to: 'E2', l: 'SIFS · D2 + ACK (de U1) + poll', c: 'data' },
        { f: 'E2', to: 'AP', l: 'SIFS · U2 + ACK', c: 'req' },
        { f: 'AP', to: 'E3', l: 'SIFS · D3 + ACK (de U2) + poll', c: 'data' },
        { at: 'E3', note: 'nada para transmitir', c: 'gray' },
        { f: 'AP', to: 'E1', l: 'PIFS · D4 + poll', c: 'data' },
        { f: 'E1', to: 'AP', l: 'SIFS · U4 + ACK', c: 'req' },
        { f: 'AP', to: 'E3', l: 'CF-End · fin del período libre de contención', c: 'ctl' },
        { div: 'DCF: las terminales vuelven a competir por el medio' }
      ]
    },
    trama: {
      kind: 'fields', title: 'Trama 802.11', rh: 46,
      rows: [[
        { id: 'fc', l: 'Frame\nControl', s: '2 B', w: 3, c: 'yellow' }, { id: 'dur', l: 'Duración\n/ ID', s: '2 B', w: 3, c: 'orange' },
        { id: 'a1', l: 'Address 1', s: '6 B', w: 4, c: 'green' }, { id: 'a2', l: 'Address 2', s: '6 B', w: 4, c: 'green' }, { id: 'a3', l: 'Address 3', s: '6 B', w: 4, c: 'green' },
        { id: 'seq', l: 'Sequence\nControl', s: '2 B', w: 3, c: 'purple' }, { id: 'a4', l: 'Address 4', s: '6 B', w: 4, c: 'green' },
        { id: 'body', l: 'Frame Body', s: '0 – 2312 B', w: 5.4, c: 'white' }, { id: 'crc', l: 'CRC', s: '4 B', w: 2.6, c: 'blue' }
      ]],
      zoom: {
        from: 'fc', title: 'Dentro de Frame Control (16 bits · cada flag ocupa 1 bit)', x: 40, w: 720,
        rows: [[
          { id: 'ver', l: 'Versión', s: '2 bits', w: 2.6, c: 'gray' }, { id: 'type', l: 'Type', s: '2 bits', w: 2.6, c: 'yellow' }, { id: 'sub', l: 'Subtype', s: '4 bits', w: 3.6, c: 'yellow' },
          { id: 'tods', l: 'To\nDS', w: 1.4, c: 'green' }, { id: 'fromds', l: 'From\nDS', w: 1.4, c: 'green' },
          { id: 'mf', l: 'More\nfrag', w: 1.4, c: 'orange' }, { id: 'retry', l: 'Retry', w: 1.4, c: 'orange' },
          { id: 'pwr', l: 'Pwr\nmgmt', w: 1.4, c: 'blue' }, { id: 'md', l: 'More\ndata', w: 1.4, c: 'blue' },
          { id: 'wep', l: 'WEP', w: 1.4, c: 'red' }, { id: 'ord', l: 'Order', w: 1.4, c: 'gray' }
        ]]
      }
    },
    join: {
      kind: 'seq',
      actors: [{ id: 'T', l: 'Terminal', t: 'pc' }, { id: 'AP', l: 'Access Point', t: 'ap' }],
      msgs: [
        { div: '1 · sincronización' },
        { f: 'AP', to: 'T', l: 'beacon (uno cada 100 ms)', c: 'ctl' },
        { at: 'T', note: 'conoce la red y se sincroniza', c: 'yellow' },
        { div: '2 · autenticación' },
        { f: 'T', to: 'AP', l: 'autenticación: intercambio de información (clave)', c: 'key' },
        { f: 'AP', to: 'T', l: 'autenticación confirmada', c: 'key' },
        { div: '3 · asociación' },
        { f: 'T', to: 'AP', l: 'petición de asociación', c: 'req' },
        { f: 'AP', to: 'T', l: 'confirmación de asociación', c: 'res' },
        { at: 'T', note: 'vinculada al AP: ya puede transmitir', c: 'green' }
      ]
    },
    std: {
      kind: 'topo',
      nodes: [
        { id: 'b', t: 'box', x: 115, y: 115, w: 160, h: 58, l: '802.11b', sub: 'la primera masiva', c: 'green' },
        { id: 'a', t: 'box', x: 305, y: 115, w: 160, h: 58, l: '802.11a', sub: 'más rápida, en 5 GHz', c: 'blue' },
        { id: 'g', t: 'box', x: 495, y: 115, w: 160, h: 58, l: '802.11g', sub: '54 Mbps en 2,4 GHz', c: 'orange' },
        { id: 'n', t: 'box', x: 685, y: 115, w: 160, h: 58, l: '802.11n', sub: 'dos bandas, más antenas', c: 'purple' }
      ],
      links: [{ a: 'b', b: 'a', arrow: 1 }, { a: 'a', b: 'g', arrow: 1 }, { a: 'g', b: 'n', arrow: 1 }]
    }
  },
  steps: [
    {
      s: 'PCF', k: 'idea', t: 'PCF: el Access Point toma el control',
      b: '<p>Con DCF una estación nunca sabe cuándo va a transmitir. Para sacar esa aleatoriedad se inventó <b>PCF</b>, el <b>período libre de contención</b>.</p><p>En PCF el Access Point <b>toma el control del medio</b> y decide quién transmite y en qué momento. La terminal no espera su turno escuchando: el AP la <b>sondea</b> (poll), es decir, le pregunta si tiene algo para transmitir.</p><p>El AP va alternando control puntual (<b>PCF</b>) y distribuido (<b>DCF</b>). Un PCF seguido de un DCF forman el <b>intervalo de repetición</b>.</p>',
      key: 'En DCF cada estación pelea por el medio; en PCF el AP reparte los turnos.',
      fig: 'image43.png', scene: 'celda', hi: ['AP', 'b1', 'pcf1'], tags: { AP: 'decide quién transmite' },
      fx: [{ k: 'wave', at: 'AP', c: 'ctl', t: 0, r: 250 }],
      pk: [
        { p: ['AP', [255, 148], 'E1'], l: 'poll', c: 'data', t: .9, d: 1 }, { p: ['E1', [315, 200], 'AP'], l: 'datos', c: 'req', d: 1 },
        { p: ['AP', [545, 148], 'E3'], l: 'poll', c: 'data', d: 1 }, { p: ['E3', [485, 200], 'AP'], l: 'datos', c: 'req', d: 1 }
      ],
      notes: [{ x: 566, y: 62, w: 214, c: 'purple', text: '<b>Beacon (B)</b>: trama de administración que el AP emite <b>1 cada 100 ms</b>. Sirve para <b>anunciarse</b> (así el S.O. arma la lista de redes) y para anunciar el <b>comienzo de un PCF</b>.' }],
      st: { modo: 'PCF: sondeo del AP', ifs: '—', trama: 'Beacon (administración)' }
    },
    {
      s: 'SIFS · PIFS', k: 'detalle', t: 'SIFS, PIFS y DIFS: quién llega primero',
      b: '<p>Puede haber estaciones que soporten PCF y otras que no. Las que no, siguen como en DCF: escuchan y, cuando se abre una ventana de <b>DIFS</b> libre, intentan transmitir.</p><p>Para que eso no pase en medio de un PCF se eligieron intervalos entre tramas <b>más cortos</b>:</p><ul><li><b>SIFS</b>: el que sigue, en general, a cada operación.</li><li><b>PIFS</b>: el que espera el AP si la estación sondeada no tiene nada.</li></ul><p>Así nunca hay un silencio de duración DIFS, y ninguna otra estación encuentra espacio para entrar.</p>',
      key: 'SIFS < PIFS < DIFS: el que tiene que esperar menos se queda con el medio.',
      fig: 'image43.png', scene: 'ifs',
      det: 'Durante el PCF siempre hay alguien que transmite después de un <b>SIFS</b> o, a lo sumo, de un <b>PIFS</b>. El medio nunca queda libre un <b>DIFS</b> completo: las estaciones que no soportan PCF siguen escuchando, pero no logran entrar hasta que el período termina.',
      st: { ifs: 'SIFS < PIFS < DIFS' }
    },
    {
      s: 'Sondeo', k: 'mecanismo', t: 'El sondeo, paso a paso',
      b: '<p>El <b>beacon</b> anuncia el comienzo del PCF. Después de un SIFS, el AP envía una trama de datos (<b>D1</b>) y, junto con ella, un <b>poll</b>.</p><p>Si la estación sondeada tiene algo para transmitir, envía su trama de datos más el <b>ACK</b> de lo que recibió (<b>U1 + ACK</b>).</p><p>Tras otro SIFS, el AP hace <b>varias operaciones en una sola transmisión</b>: envía datos (D2), confirma lo que recibió de la estación (ACK) y sondea a la siguiente (poll).</p>',
      key: 'Datos, confirmación y sondeo viajan juntos: así no queda ningún hueco entre tramas.',
      fig: 'image43.png', scene: 'pcf', upto: 5, states: { AP: 'controla el medio' },
      st: { ifs: 'SIFS', trama: 'Datos + ACK + poll' }
    },
    {
      s: 'Fin del PCF', k: 'mecanismo', t: 'Sin respuesta, PIFS y fin del período',
      b: '<p>El AP repite el esquema: cada vez que envía algo, manda <b>datos</b>, alguna <b>confirmación</b> (si hace falta) y el <b>poll</b> a la siguiente estación.</p><p>Si la estación sondeada <b>no tiene nada</b> para transmitir, el AP espera un <b>PIFS</b>, transmite una nueva trama de datos y sondea a otra.</p><p>Al final, el AP anuncia el <b>fin del período libre de contención</b>. El medio queda libre para que las terminales vuelvan a competir en <b>DCF</b>, donde también pueden operar las que no soportan PCF.</p>',
      key: 'El AP recibe la trama del emisor y es él quien se la envía al destinatario.',
      fig: 'image43.png', scene: 'pcf', states: { AP: 'controla el medio' },
      st: { modo: 'PCF → vuelve DCF', ifs: 'PIFS si nadie responde' }
    },
    {
      s: 'Trama', k: 'detalle', t: 'La trama 802.11 y sus tipos',
      b: '<p>Terminal y Access Point intercambian tramas con este formato: cabecera MAC, cuerpo (0 a 2312 bytes) y CRC. El controlador de la placa de red se la presenta al dispositivo como una trama <b>Ethernet II</b>.</p><p>El primer campo, <b>Frame Control</b>, se expande en varios subcampos. Type y Subtype dicen qué clase de trama es:</p><ul><li><b>Administración</b>: asociación, autenticación, beacon.</li><li><b>Control</b>: RTS, CTS, ACK.</li><li><b>Datos</b>.</li></ul>',
      key: 'Las tramas que ya vimos (beacon, RTS, CTS, ACK) se distinguen por el tipo que marca Frame Control.',
      fig: ['image44.png', 'image45.png'], scene: 'trama', zoom: 1, hi: ['fc', 'type', 'sub'],
      tbl: { x: 185, y: 297, w: 440, title: 'Tipos de trama (Type / Subtype)', cols: ['Tipo', 'Ejemplos'], rows: [['Administración', 'petición / confirmación de asociación, autenticación, beacon'], ['Control', 'RTS, CTS, ACK'], ['Datos', 'la información que se transporta']] },
      st: { modo: '—', ifs: '—', trama: 'Administración · Control · Datos' }
    },
    {
      s: 'Flags', k: 'detalle', t: 'Frame Control: los flags',
      b: '<p>El resto de Frame Control son flags de un bit:</p><ul><li><b>More frag</b>: la trama está fragmentada. Si la probabilidad de error del canal es alta, conviene enviar mensajes pequeños.</li><li><b>Retry</b>: la trama es una retransmisión.</li><li><b>Power mgmt</b>: en qué modo de energía queda la estación después de transmitir.</li><li><b>More data</b>: el AP le avisa a la estación que tiene más para ella.</li><li><b>WEP</b>: el campo de datos va encriptado.</li><li><b>Order</b>: orden.</li></ul>',
      fig: 'image45.png', scene: 'trama', zoom: 1, hi: ['mf', 'retry', 'pwr', 'md', 'wep', 'ord'],
      det: '<b>Retry</b> en acción: se pierde el ACK de una trama → el emisor cree que no llegó y la reenvía con Retry = 1 → el receptor, que ya la tenía, la reconoce como duplicado y la descarta.',
      st: { trama: 'Cualquiera: los flags van siempre' }
    },
    {
      s: 'Direcciones', k: 'detalle', t: 'ToDS, FromDS y las direcciones',
      b: '<p>Dos bits dicen si la trama va hacia el <b>sistema de distribución</b> o viene de él:</p><ul><li><b>ToDS = 1</b>: se envía al Access Point con destino a una estación en el sistema de distribución.</li><li><b>FromDS = 1</b>: la trama viene del sistema de distribución.</li></ul><p>Según esos dos bits cambia qué lleva cada campo <b>Address</b> (tabla).</p><p>El resto: <b>Duración</b> (cuánto tiempo necesita la estación que transmite), <b>Sequence Control</b> (indica el fragmento) y un <b>CRC</b> de 32 bits.</p>',
      key: 'Como en el medio siempre está el AP, dos direcciones no alcanzan: por eso hay hasta cuatro.',
      fig: 'image46.png', scene: 'trama', zoom: 1, hi: ['tods', 'fromds', 'a1', 'a2', 'a3', 'a4'],
      tbl: { x: 40, y: 297, w: 385, title: 'Campos Address según ToDS y FromDS', cols: ['ToDS', 'FromDS', 'Address 1', 'Address 2', 'Address 3', 'Address 4'], rows: [['0', '0', 'DA', 'SA', 'BSSID', 'N/A'], ['0', '1', 'DA', 'BSSID', 'SA', 'N/A'], ['1', '0', 'BSSID', 'SA', 'DA', 'N/A'], ['1', '1', 'RA', 'TA', 'DA', 'SA']] },
      notes: [{ x: 440, y: 297, w: 320, c: 'yellow', text: '<b>DA</b>: destino · <b>SA</b>: origen · <b>BSSID</b>: identifica la celda del AP · <b>RA / TA</b>: quién recibe y quién transmite en el aire.<br><b>Duración</b> es el tiempo con el que las demás arman su NAV.' }],
      st: { trama: 'Datos' }
    },
    {
      s: 'Asociación', k: 'mecanismo', t: 'Incorporarse a una celda (y protegerla)',
      b: '<p>Para incorporarse a una celda, una estación completa tres pasos:</p><ul><li><b>Sincronización</b>: por medio de los beacon frames del Access Point.</li><li><b>Autenticación</b>: intercambio de información (clave) entre el AP y el terminal.</li><li><b>Asociación</b>: se vincula la terminal al AP. A partir de acá puede transmitir.</li></ul><p>Para proteger la red se definió <b>WEP</b> (Wired Equivalent Privacy): evita la intercepción de la información y limita qué terminales acceden al AP. Hoy casi no se usa: se podía esquivar por fuerza bruta.</p>',
      key: 'Sincronizar, autenticar, asociar: recién después del tercer paso se pueden enviar datos.',
      scene: 'join', states: { T: 'quiere entrar', AP: 'emite beacons' },
      st: { trama: 'Administración' }
    },
    {
      s: 'Estándares', k: 'comparación', t: '802.11 b, a, g y n',
      b: '<p>Cronológicamente:</p><ul><li><b>802.11b</b>: la primera solución adoptada masivamente. 2,4 GHz, hasta 11 Mbps, modulación DSSS.</li><li><b>802.11a</b>: 54 Mbps con OFDM, pero en 5 GHz, lo que no resultó mejor (requería antenas mayores).</li><li><b>802.11g</b>: los 54 Mbps en la banda de 2,4 GHz, con OFDM o DSSS.</li><li><b>802.11n</b>: usa las dos bandas, hasta 600 Mbps con OFDM.</li></ul>',
      key: 'Cada norma buscó más velocidad: primero cambiando la modulación, después sumando bandas y antenas.',
      fig: 'image47.png', scene: 'std', hi: ['n'],
      pk: [{ p: ['b', 'a', 'g', 'n'], d: 2.6 }],
      tbl: { x: 252, y: 185, w: 300, cols: ['Norma', 'Banda', 'Velocidad máxima', 'Modulación'], rows: [['802.11b', '2,4 GHz', '11 Mbps', 'DSSS'], ['802.11a', '5 GHz', '54 Mbps', 'OFDM'], ['802.11g', '2,4 GHz', '54 Mbps', 'OFDM o DSSS'], ['802.11n', '2,4 y 5 GHz', 'hasta 600 Mbps', 'OFDM']], hi: 3 },
      notes: [{ x: 200, y: 318, w: 400, c: 'purple', text: '<b>802.11n</b> permite usar <b>diversidad de antenas</b>: con múltiples antenas se pueden transmitir <b>múltiples flujos en simultáneo</b>.' }],
      st: { modo: '—', trama: '—' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'PCF y tramas en una mirada',
      b: '<ul><li><b>PCF</b>: el AP sondea a las estaciones; se alterna con DCF en cada intervalo de repetición.</li><li><b>Beacon</b> cada 100 ms: anuncia la red y el comienzo del PCF.</li><li><b>SIFS < PIFS < DIFS</b>: durante el PCF nadie más logra entrar.</li><li>Trama 802.11: Frame Control (tipo, ToDS / FromDS, flags), duración, hasta 4 direcciones, CRC.</li><li>Entrar a una celda: sincronización, autenticación, asociación.</li></ul><p>Con esto cerramos la capa de enlace, cableada e inalámbrica. Lo que sigue es la capa de red: en la próxima lección, <b>IP y su datagrama</b>.</p>',
      scene: 'celda', hi: ['dcf1', 'dcf2'], tags: { AP: 'fin del PCF: vuelve DCF', E1: 'compite', E3: 'compite' },
      fx: [{ k: 'wave', at: 'AP', c: 'ctl', t: 0, r: 250 }],
      pk: [{ p: ['E1', 'AP'], l: 'trama', t: 1, d: 1.2 }, { p: ['E3', 'AP'], l: 'trama', c: 'res', t: 2.4, d: 1.2 }],
      st: { modo: 'PCF + DCF', ifs: 'SIFS < PIFS < DIFS', trama: 'Adm. · Control · Datos' }
    }
  ],
  quiz: [
    { q: '¿Qué diferencia a PCF de DCF?', o: ['En PCF no se usan ACK', 'En PCF el Access Point decide quién transmite y sondea a las estaciones', 'En PCF las estaciones transmiten sin pasar por el AP', 'PCF solo funciona en la banda de 5 GHz'], a: 1, why: 'En PCF el AP toma el control del medio y va preguntando (poll) a cada estación; en DCF las estaciones compiten por el canal.' },
    { q: '¿Por qué una estación que no soporta PCF no logra transmitir durante el período libre de contención?', o: ['Porque el AP la desasocia', 'Porque su NAV queda roto', 'Porque nunca encuentra el medio libre durante un DIFS: las tramas se suceden cada SIFS o PIFS', 'Porque no recibe los beacons'], a: 2, why: 'SIFS y PIFS son más cortos que DIFS, así que durante el PCF nunca hay un silencio lo bastante largo para que entre.' },
    { q: 'Se pierde el ACK de una trama y el emisor la envía otra vez. ¿Qué flag de Frame Control permite al receptor descartar el duplicado?', o: ['More frag', 'Retry', 'More data', 'Order'], a: 1, why: 'Retry indica que la trama es una retransmisión; sirve justamente para descartar duplicados cuando se perdió el ACK.' },
    { q: '¿En qué orden se incorpora una estación a una celda?', o: ['Asociación, autenticación, sincronización', 'Autenticación, sincronización, asociación', 'Sincronización, autenticación, asociación', 'Sincronización, asociación, autenticación'], a: 2, why: 'Primero se sincroniza con los beacons, después intercambia la clave (autenticación) y por último se vincula al AP (asociación).' }
  ],
  cheat: [
    ['PCF', 'Período libre de contención: el AP controla el medio y <b>sondea</b> (poll) a las estaciones. Se alterna con DCF: PCF + DCF = intervalo de repetición.'],
    ['Beacon', 'Trama de administración, 1 cada 100 ms. Anuncia la red (lista de redes del S.O.) y el comienzo del PCF.'],
    ['Intervalos', '<b>SIFS < PIFS < DIFS</b>. SIFS tras cada operación; PIFS si la estación sondeada no responde; DIFS es lo que esperan las que compiten.'],
    ['Secuencia PCF', 'Beacon → D1 + poll → U1 + ACK → D2 + ACK + poll → … → fin del período libre de contención → DCF.'],
    ['Frame Control', 'Tipo (administración, control, datos), ToDS, FromDS, More frag, Retry, Power mgmt, More data, WEP, Order.'],
    ['Resto de la trama', 'Duración, hasta 4 campos Address (según ToDS / FromDS), Sequence Control (fragmento), cuerpo de 0 a 2312 bytes, CRC de 32 bits.'],
    ['Entrar a la celda', 'Sincronización (beacons) → autenticación (clave) → asociación. <b>WEP</b>: protección original, hoy en desuso.'],
    ['Estándares', '<b>b</b>: 2,4 GHz, 11 Mbps, DSSS · <b>a</b>: 5 GHz, 54 Mbps, OFDM · <b>g</b>: 2,4 GHz, 54 Mbps · <b>n</b>: 2,4 y 5 GHz, hasta 600 Mbps, varias antenas.']
  ]
});

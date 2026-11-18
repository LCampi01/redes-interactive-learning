COURSE.add({
  id: 'wlan-csma-ca',
  title: 'Wi-Fi: acceso al medio con CSMA/CA',
  desc: 'En una red inalámbrica no alcanza con escuchar antes de hablar: quiénes forman una red 802.11, en qué canales opera y cómo se evitan las colisiones con DIFS, RTS, CTS, ACK y el NAV.',
  min: 10, level: 'Intermedio',
  learn: [
    'Qué elementos tiene una red 802.11 en modo infraestructura (AP, BSS, terminales, sistema de distribución)',
    'Cómo se reparten los canales en 2,4 GHz y en 5 GHz, y por qué se usan el 1, el 6 y el 11',
    'Por qué CSMA/CD no sirve en el aire: el problema del nodo oculto',
    'Cómo funciona DCF con RTS / CTS: DIFS, RTS, CTS, datos, ACK y la portadora virtual (NAV)',
    'Cómo es el DCF básico y por qué su aleatoriedad molesta a las aplicaciones síncronas'
  ],
  stats: [{ k: 'banda', l: 'Banda' }, { k: 'mac', l: 'Acceso al medio' }, { k: 'nav', l: 'NAV de las otras' }],
  legend: [['req', 'trama'], ['ctl', 'RTS'], ['res', 'CTS / ACK del AP'], ['data', 'datos'], ['bad', 'colisión / no permitido']],
  scenes: {
    bss: {
      kind: 'topo',
      zones: [{ id: 'zb', x: 60, y: 150, w: 520, h: 245, l: 'BSS · Basic Service Set', c: 'purple' }],
      nodes: [
        { id: 'DS', t: 'bus', x: 240, y: 95, w: 510, l: 'Sistema de distribución · LAN cableada' },
        { id: 'AP', t: 'ap', x: 320, y: 200, l: 'Access Point' },
        { id: 'SRV', t: 'server', x: 690, y: 205, l: 'Servidor', sub: 'en la LAN' },
        { id: 'T1', t: 'pc', x: 140, y: 300, l: 'Terminal 1' },
        { id: 'T2', t: 'phone', x: 320, y: 342, l: 'Terminal 2' },
        { id: 'T3', t: 'pc', x: 500, y: 300, l: 'Terminal 3' }
      ],
      links: [{ a: 'AP', b: 'DS' }, { a: 'SRV', b: 'DS' }, { a: 'T1', b: 'AP', wl: 1 }, { a: 'T2', b: 'AP', wl: 1 }, { a: 'T3', b: 'AP', wl: 1 }]
    },
    capas: {
      kind: 'topo',
      nodes: [
        { id: 'c1', t: 'txt', x: 255, y: 72, l: 'LAN cableada', big: 1 }, { id: 'c2', t: 'txt', x: 545, y: 72, l: 'Wireless LAN', big: 1 },
        { id: 'tl', t: 'txt', x: 62, y: 232, l: 'Capa de\nenlace' },
        { id: 'sup', t: 'box', x: 400, y: 125, w: 560, h: 44, l: 'Capas superiores (red, transporte, aplicación)', c: 'gray' },
        { id: 'llc', t: 'box', x: 400, y: 197, w: 560, h: 52, l: 'LLC · 802.2', sub: 'subcapa superior: la misma en las dos redes', c: 'yellow' },
        { id: 'mac3', t: 'box', x: 255, y: 267, w: 270, h: 52, l: 'MAC 802.3', sub: 'Ethernet · CSMA/CD', c: 'green' },
        { id: 'mac11', t: 'box', x: 545, y: 267, w: 270, h: 52, l: 'MAC 802.11', sub: 'Wi-Fi · CSMA/CA', c: 'purple' },
        { id: 'f3', t: 'box', x: 255, y: 337, w: 270, h: 44, l: 'Física: coaxil, par trenzado', c: 'gray' },
        { id: 'f11', t: 'box', x: 545, y: 337, w: 270, h: 44, l: 'Física: radio', c: 'gray' }
      ],
      links: []
    },
    canales: { kind: 'bits' },
    oculto: {
      kind: 'topo',
      zones: [{ id: 'cob', x: 80, y: 66, w: 640, h: 326, l: 'cobertura del Access Point', c: 'purple' }],
      nodes: [
        { id: 'AP', t: 'ap', x: 400, y: 135, l: 'Access Point' },
        { id: 'A', t: 'pc', x: 180, y: 300, l: 'Terminal A' },
        { id: 'B', t: 'pc', x: 620, y: 300, l: 'Terminal B' },
        { id: 'W', t: 'box', x: 400, y: 310, w: 30, h: 116, l: '', c: 'gray' },
        { id: 'WT', t: 'txt', x: 400, y: 240, l: 'obstáculo' }
      ],
      links: [{ a: 'A', b: 'AP', wl: 1 }, { a: 'B', b: 'AP', wl: 1 }]
    },
    rts: {
      kind: 'seq',
      actors: [{ id: 'A', l: 'Terminal A', t: 'pc' }, { id: 'AP', l: 'Access Point', t: 'ap' }, { id: 'B', l: 'Terminal B', t: 'pc' }],
      msgs: [
        { at: 'A', note: 'medio libre durante un DIFS', c: 'yellow' },
        { f: 'A', to: 'AP', l: 'RTS · cuánto tiempo necesito', c: 'ctl' },
        { at: 'B', note: 'no oye el RTS (nodo oculto)', c: 'red' },
        { f: 'AP', to: 'A', l: 'CTS · podés transmitir', c: 'res' },
        { f: 'AP', to: 'B', l: 'el mismo CTS también llega a B', c: 'res', dash: 1 },
        { at: 'B', note: 'activa su NAV (CTS)', c: 'purple' },
        { f: 'A', to: 'AP', l: 'DATOS', c: 'data' },
        { at: 'B', note: 'NAV activo: no transmite', c: 'purple' },
        { f: 'AP', to: 'A', l: 'ACK · llegó bien', c: 'res' },
        { f: 'AP', to: 'B', l: 'B también escucha el ACK', c: 'res', dash: 1 },
        { at: 'B', note: 'NAV cancelado → espera un DIFS', c: 'green' },
        { div: 'ventana de contención: vuelven a competir por el canal' }
      ]
    },
    dcf: {
      kind: 'topo',
      nodes: [
        { id: 'nav', t: 'state', x: 150, y: 115, l: '¿NAV desactivado?', c: 'purple' },
        { id: 'lib', t: 'state', x: 400, y: 115, l: '¿Libre un DIFS?', c: 'yellow' },
        { id: 'tx', t: 'box', x: 650, y: 115, w: 160, h: 44, l: 'Transmitir la trama', c: 'green' },
        { id: 'ack', t: 'state', x: 650, y: 250, l: '¿Llegó el ACK?', c: 'blue' },
        { id: 'ok', t: 'state', x: 650, y: 365, l: 'Transmisión correcta', c: 'green' },
        { id: 'bo', t: 'box', x: 300, y: 270, w: 230, h: 54, l: 'Backoff exponencial', sub: 'espera aleatoria, como en la LAN', c: 'orange' }
      ],
      links: [
        { a: 'bo', b: 'nav', arrow: 1, dash: 1, curve: -75, l: 'reintenta', id: 'retry', lx: -38 },
        { a: 'nav', b: 'lib', arrow: 1, l: 'sí' }, { a: 'lib', b: 'tx', arrow: 1, l: 'sí' }, { a: 'tx', b: 'ack', arrow: 1 },
        { a: 'ack', b: 'ok', arrow: 1, l: 'sí', lx: 14 }, { a: 'ack', b: 'bo', arrow: 1, l: 'no: hubo colisión' },
        { a: 'nav', b: 'bo', arrow: 1, l: 'no', id: 'navno', lx: 14 }, { a: 'lib', b: 'bo', arrow: 1, l: 'no: ocupado', lx: 40 }
      ]
    }
  },
  steps: [
    {
      s: 'Elementos', k: 'contexto', t: 'Los elementos de una red 802.11',
      b: '<p>El estándar <b>IEEE 802.11</b> identifica tres elementos:</p><ul><li><b>Access Point (AP)</b>: controla un área llamada <b>Basic Service Set (BSS)</b> y brinda el acceso al sistema de distribución.</li><li><b>Terminales inalámbricos</b>: se conectan al Access Point.</li><li><b>Sistema de distribución</b>: generalmente, la red LAN cableada.</li></ul><p>Como hay un Access Point, esto se llama <b>modo infraestructura</b> (existe otra variante, ad-hoc, sin APs). Nos enfocamos en la capa de enlace: cómo viajan las tramas entre los terminales y el AP.</p>',
      key: 'Modo infraestructura = terminales + un Access Point que los une a la LAN cableada.',
      fig: 'image36.png', scene: 'bss', hi: ['AP', 'zb'], st: { banda: '2,4 / 5 GHz', mac: '—', nav: '—' }
    },
    {
      s: 'Capas', k: 'contexto', t: 'El mismo modelo de capas, otra MAC',
      b: '<p>En la LAN cableada la capa de enlace tenía dos subcapas: <b>LLC</b> arriba y otra que dependía de la tecnología. En Wireless LAN es igual:</p><ul><li>Subcapa superior: el estándar <b>802.2</b> (LLC), el mismo de Ethernet.</li><li>Subcapa inferior: <b>802.11 MAC</b>, que define cómo se accede al medio inalámbrico.</li></ul><p>Debajo queda la capa física, que acá es la radio.</p>',
      key: 'Para las capas de arriba nada cambia: lo que se reemplaza es la subcapa MAC (y la física).',
      fig: 'image37.png', scene: 'capas', hi: ['llc', 'mac11']
    },
    {
      s: '2,4 GHz', k: 'detalle', t: 'Banda de 2,4 GHz: canales que se solapan',
      b: '<p>El espectro radioeléctrico está controlado: cada dispositivo tiene asignada una <b>banda de frecuencias</b>. Wireless LAN opera en la banda de <b>2,4 GHz</b>, repartida en <b>11 canales de 22 MHz</b>.</p><p>El problema es que los canales <b>se solapan</b>: cada uno comparte frecuencias con sus vecinos.</p><p>Solo tres no se pisan entre sí: el <b>1</b>, el <b>6</b> y el <b>11</b>. Por eso los dispositivos de esta banda operan generalmente en esos tres canales.</p>',
      key: 'En 2,4 GHz hay 11 canales, pero solo 3 que no se interfieren: 1, 6 y 11.',
      fig: 'image38.png', scene: 'canales', title: 'Banda de 2,4 GHz',
      lines: [{ l: 'Banda', v: '2,4 GHz' }, { l: 'Canales', v: '11 de 22 MHz' }, { l: 'No se solapan', v: '1 · 6 · 11', hi: 1 }],
      bars: [
        { title: 'Cada fila muestra canales que no se pisan entre sí (frecuencias en MHz)', span: [2401, 2472], h: 28, blocks: [{ a: 2401, b: 2422, l: 'canal 1', c: 'green', hi: 1 }, { a: 2426, b: 2447, l: 'canal 6', c: 'green', hi: 1 }, { a: 2451, b: 2472, l: 'canal 11', c: 'green', hi: 1 }] },
        { span: [2401, 2472], h: 28, blocks: [{ a: 2406, b: 2427, l: 'canal 2', c: 'yellow' }, { a: 2431, b: 2452, l: 'canal 7', c: 'yellow' }] },
        { span: [2401, 2472], h: 28, blocks: [{ a: 2411, b: 2432, l: 'canal 3', c: 'yellow' }, { a: 2436, b: 2457, l: 'canal 8', c: 'yellow' }] },
        { span: [2401, 2472], h: 28, blocks: [{ a: 2416, b: 2437, l: 'canal 4', c: 'yellow' }, { a: 2441, b: 2462, l: 'canal 9', c: 'yellow' }] },
        { span: [2401, 2472], h: 28, blocks: [{ a: 2421, b: 2442, l: 'canal 5', c: 'yellow' }, { a: 2446, b: 2467, l: 'canal 10', c: 'yellow' }] }
      ],
      st: { banda: '2,4 GHz · canales 1, 6, 11' }
    },
    {
      s: '5 GHz', k: 'detalle', t: 'Banda de 5 GHz: más lugar',
      b: '<p>La banda de <b>5 GHz</b> es más amplia que la anterior: tiene <b>más canales</b> y estos <b>no se solapan</b>.</p><p>Además, las tecnologías que usan esta banda permiten <b>agrupar canales</b> vecinos para formar un canal más ancho. Con más ancho de banda se gana velocidad de transmisión.</p>',
      key: 'Más espectro, canales separados y la posibilidad de unirlos: por eso 5 GHz rinde más.',
      fig: 'image39.png', scene: 'canales', title: 'Banda de 5 GHz (primer tramo, en MHz)',
      lines: [{ l: 'Banda', v: '5 GHz' }, { l: 'Canales', v: 'más y sin solaparse' }, { l: 'Agrupar canales', v: 'más ancho de banda', hi: 1 }],
      bars: [
        { title: 'Canales de 20 MHz: uno al lado del otro', span: [5170, 5329], h: 30, blocks: [{ a: 5170, b: 5189, l: '36', c: 'green' }, { a: 5190, b: 5209, l: '40', c: 'green' }, { a: 5210, b: 5229, l: '44', c: 'green' }, { a: 5230, b: 5249, l: '48', c: 'green' }, { a: 5250, b: 5269, l: '52', c: 'green' }, { a: 5270, b: 5289, l: '56', c: 'green' }, { a: 5290, b: 5309, l: '60', c: 'green' }, { a: 5310, b: 5329, l: '64', c: 'green' }] },
        { title: 'Agrupados de a dos: canales de 40 MHz', span: [5170, 5329], h: 30, blocks: [{ a: 5170, b: 5209, l: '36 + 40', c: 'blue' }, { a: 5210, b: 5249, l: '44 + 48', c: 'blue' }, { a: 5250, b: 5289, l: '52 + 56', c: 'blue' }, { a: 5290, b: 5329, l: '60 + 64', c: 'blue' }] },
        { title: 'Agrupados de a cuatro: canales de 80 MHz', span: [5170, 5329], h: 30, blocks: [{ a: 5170, b: 5249, l: '36 + 40 + 44 + 48', c: 'purple' }, { a: 5250, b: 5329, l: '52 + 56 + 60 + 64', c: 'purple' }] }
      ],
      st: { banda: '5 GHz · sin solapamiento' }
    },
    {
      s: 'Por el AP', k: 'idea', t: 'Todo pasa por el Access Point',
      b: '<p>La comunicación en esta red es <b>siempre</b> del equipo terminal al Access Point o viceversa. Un terminal <b>no dialoga directamente</b> con otro terminal: le entrega la trama al AP y el AP la reenvía.</p><p>Por eso decimos que es un control de acceso al medio <b>centralizado</b>.</p><p>Consecuencia importante: cada terminal necesita visibilidad con el Access Point, pero <b>no</b> con el resto de los dispositivos.</p>',
      key: 'Desde y hacia el Access Point: nunca de terminal a terminal.',
      scene: 'bss', hi: ['AP'], tags: { AP: 'todo pasa por acá' },
      pk: [
        { p: ['T1', 'T3'], l: 'directo: no', c: 'bad', d: 1.2, drop: 1, dropAt: .42 },
        { p: ['T1', 'AP', 'T3'], l: 'trama → T3', d: 1.8 },
        { p: ['T3', 'AP', 'DS', 'SRV'], l: 'trama → LAN', c: 'res', d: 2.2 }
      ],
      st: { banda: '2,4 / 5 GHz', mac: 'Centralizado en el AP' }
    },
    {
      s: 'Nodo oculto', k: 'problema', t: 'Por qué CSMA/CD no sirve: el nodo oculto',
      b: '<p>En la LAN usábamos CSMA/CD: escuchar el medio antes de transmitir. En Wireless eso <b>no es práctico</b>.</p><p>Dos terminales pueden ver al AP pero <b>no verse entre sí</b>, por ejemplo con un obstáculo en el medio. Ninguno puede saber si el otro está transmitiendo: es el <b>nodo oculto</b>.</p><p>Por eso se usa <b>CSMA/CA</b> (Collision Avoidance): el objetivo es <b>evitar</b> las colisiones, porque el costo de recuperarse de ellas es muy alto.</p>',
      key: 'CD = detectar la colisión y recuperarse. CA = hacer lo posible para que no ocurra.',
      fig: 'image41.png', scene: 'oculto', hi: ['A', 'B'], tags: { A: 'no oye a B → transmite', B: 'no oye a A → transmite' },
      fx: [{ k: 'wave', at: 'A', c: 'req', t: 0, r: 200 }, { k: 'wave', at: 'B', c: 'res', t: 0, r: 200 }, { k: 'boom', at: [400, 150], t: 1.25, l: 'colisión en el AP' }],
      pk: [{ p: ['A', 'AP'], l: 'trama de A', t: .2, d: 1.2 }, { p: ['B', 'AP'], l: 'trama de B', c: 'res', t: .2, d: 1.2 }],
      st: { mac: 'CSMA/CA: evitar colisiones' }
    },
    {
      s: 'RTS / CTS', k: 'mecanismo', t: 'DCF con RTS / CTS: pedir permiso',
      b: '<p>Fue el algoritmo de control original, pensado para el nodo oculto. El emisor es la terminal y el destinatario, el Access Point.</p><ul><li>La estación escucha el medio (lo que pueda escuchar): debe estar libre durante un intervalo <b>DIFS</b>.</li><li>Envía un <b>RTS</b> (Request To Send).</li><li>El AP responde con un <b>CTS</b> (Clear To Send): puede transmitir.</li></ul><p>B quizás no escuchó el RTS, pero <b>sí escucha el CTS</b>, porque tiene visibilidad con el AP. Entonces activa una portadora virtual: el <b>NAV</b>.</p>',
      key: 'El CTS sale del AP, y al AP lo escuchan todos: así se enteran también los nodos ocultos.',
      fig: 'image40.png', scene: 'rts', upto: 6, states: { A: 'origen', AP: 'destino', B: 'otra terminal' },
      st: { mac: 'DCF con RTS / CTS', nav: 'Activo (por el CTS)' }
    },
    {
      s: 'Datos y ACK', k: 'mecanismo', t: 'Datos, ACK y el NAV de las otras',
      b: '<p>Con el CTS, el emisor transmite los <b>datos</b>. El AP confirma con un <b>ACK</b> si los recibió bien: puede haber interferencia, con tantos dispositivos en la banda.</p><p>El <b>NAV</b> es una <b>portadora virtual</b>: quien escucha un RTS o un CTS lo activa por el tiempo que esa trama indica. Mientras está activo, sabe que otra terminal transmite y no la interfiere.</p><p>Cuando se detecta el ACK, el NAV se cancela. Las estaciones esperan un <b>DIFS</b> e intentan ganar el canal.</p>',
      key: 'NAV (RTS) si escuché el pedido, NAV (CTS) si escuché la respuesta: en los dos casos, me callo.',
      fig: 'image40.png', scene: 'rts', states: { A: 'origen', AP: 'destino', B: 'otra terminal' },
      st: { nav: 'Cancelado → DIFS' }
    },
    {
      s: 'DCF básico', k: 'mecanismo', t: 'DCF básico: sin RTS ni CTS',
      b: '<p>Se notó que el nodo oculto <b>no era tan común</b>, y el mecanismo cambió. Una estación con algo para transmitir:</p><ul><li>Chequea su <b>NAV</b>. Si está activado, espera y ejecuta el <b>backoff exponencial</b> (el de redes LAN).</li><li>Si está desactivado, escucha el medio. Si está libre durante un <b>DIFS</b>, transmite.</li><li>Si recibe el <b>ACK</b>, transmitió bien. Si no, hubo una colisión: backoff antes de retransmitir.</li></ul>',
      key: 'Acá la colisión no se detecta escuchando: se deduce porque no llegó el ACK.',
      fig: 'image42.png', scene: 'dcf', hi: ['nav', 'lib', 'tx', 'ack'], tags: { nav: 'tengo una trama' },
      pk: [{ p: ['nav', 'lib', 'tx', 'ack', 'ok'], l: 'con ACK', d: 2.8 }, { p: ['ack', 'bo', 'nav'], l: 'sin ACK', c: 'bad', d: 2.2 }],
      st: { mac: 'DCF básico', nav: 'Se chequea antes de escuchar' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'CSMA/CA en una mirada',
      b: '<ul><li>Modo infraestructura: todo pasa por el <b>Access Point</b>.</li><li>2,4 GHz: canales <b>1, 6 y 11</b>. 5 GHz: más canales, sin solapamiento.</li><li>Nodo oculto: no sirve CSMA/CD; se <b>evitan</b> las colisiones (CSMA/CA).</li><li><b>DIFS → RTS → CTS → datos → ACK</b>, con el <b>NAV</b> callando al resto.</li><li>DCF básico: NAV, DIFS, transmitir y esperar el ACK; si no llega, backoff.</li></ul><p>Con o sin RTS/CTS hay <b>aleatoriedad</b>: una estación nunca sabe cuánto va a esperar. Las aplicaciones síncronas necesitan cierta certeza: para eso se inventó <b>PCF</b>, el tema de la próxima lección.</p>',
      scene: 'oculto', hi: ['AP'], tags: { A: 'recibe el CTS: transmite', B: 'NAV activo: espera' },
      fx: [{ k: 'wave', at: 'AP', c: 'res', t: 1.1, r: 300 }],
      pk: [{ p: ['A', 'AP'], l: 'RTS', c: 'ctl', d: 1 }, { p: ['AP', 'A'], l: 'CTS', c: 'res', d: 1.1 }, { p: ['AP', 'B'], l: 'CTS', c: 'res', d: 1.1, par: 1 }],
      st: { mac: 'CSMA/CA', nav: 'Activo mientras otro transmite' }
    }
  ],
  quiz: [
    { q: '¿Por qué en 2,4 GHz se usan casi siempre los canales 1, 6 y 11?', o: ['Porque son los de mayor potencia', 'Porque son los únicos tres que no se solapan entre sí', 'Porque los demás están reservados para el Access Point', 'Porque son los únicos de 22 MHz'], a: 1, why: 'Hay 11 canales de 22 MHz que se pisan con sus vecinos; solo el 1, el 6 y el 11 no comparten frecuencias.' },
    { q: '¿Qué es el problema del nodo oculto?', o: ['Un terminal que no ve al Access Point', 'Un Access Point que no figura en la lista de redes', 'Dos terminales que ven al AP pero no se escuchan entre sí', 'Un terminal que transmite sin esperar el DIFS'], a: 2, why: 'Cada terminal necesita visibilidad con el AP, no con las demás; si dos no se escuchan, ninguna sabe cuándo transmite la otra.' },
    { q: 'Una terminal no escuchó el RTS, pero sí el CTS del Access Point. ¿Qué hace?', o: ['Transmite, porque el CTS le da permiso', 'Activa su NAV por el tiempo que indica el CTS y no transmite', 'Responde con un ACK', 'Envía su propio RTS de inmediato'], a: 1, why: 'El CTS le avisa que otra terminal va a transmitir: activa la portadora virtual (NAV) y espera hasta que se cancele.' },
    { q: 'En DCF básico, ¿cómo sabe una estación que su trama colisionó?', o: ['Porque no recibe el ACK', 'Porque compara lo que escucha con lo que transmite', 'Porque el AP le envía un jam', 'Porque su NAV se activa'], a: 0, why: 'Si llega el ACK transmitió correctamente; si no llega, hubo colisión y ejecuta el backoff exponencial antes de retransmitir.' }
  ],
  cheat: [
    ['Modo infraestructura', '<b>Access Point</b> + terminales + sistema de distribución (la LAN cableada). El área que controla el AP es el <b>BSS</b>.'],
    ['Capas', '<b>802.2 LLC</b> arriba (igual que en Ethernet) y <b>802.11 MAC</b> abajo.'],
    ['Canales', '2,4 GHz: 11 canales de 22 MHz solapados; se usan <b>1, 6 y 11</b>. 5 GHz: más canales, no se solapan y se pueden agrupar.'],
    ['Nodo oculto', 'Dos terminales ven al AP pero no entre sí: escuchar el medio no alcanza. Por eso no sirve CSMA/CD.'],
    ['CSMA/CA', 'Collision Avoidance: <b>evitar</b> la colisión, porque recuperarse de ella es muy costoso.'],
    ['DCF con RTS / CTS', 'DIFS libre → <b>RTS</b> → <b>CTS</b> → datos → <b>ACK</b>.'],
    ['NAV', 'Portadora virtual: quien oye un RTS o un CTS no transmite por el tiempo indicado. Se cancela con el ACK; después, DIFS y a competir.'],
    ['DCF básico', 'Chequear NAV → medio libre un DIFS → transmitir → esperar ACK. Sin ACK = colisión → backoff exponencial.']
  ]
});

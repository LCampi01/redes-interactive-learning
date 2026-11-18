COURSE.add({
  id: 'atm',
  title: 'ATM: celdas de 53 bytes',
  desc: 'Una red que corta todo en celdas iguales: por qué conviene la longitud fija, cómo se identifican las conexiones con VPI / VCI, qué hace el HEC y cómo se adapta y se contrata cada servicio.',
  min: 13, level: 'Avanzado',
  learn: [
    'Por qué ATM usa celdas de longitud fija y qué lleva su cabecera',
    'Cómo se organizan las conexiones en canales (VCI) dentro de caminos (VPI)',
    'Cómo el HEC corrige errores de la cabecera y además delimita las celdas',
    'Qué hace la capa de adaptación (AAL) y qué clases de servicio existen',
    'Qué se declara al pedir una conexión y cómo la red la admite y la controla'
  ],
  stats: [{ k: 'celda', l: 'Celda' }, { k: 'id', l: 'Identificador de conexión' }, { k: 'hec', l: 'Uso del HEC' }, { k: 'aal', l: 'Adaptación' }],
  legend: [['req', 'celda'], ['res', 'otro canal / respuesta'], ['ctl', 'señalización'], ['key', 'caso con error o exceso']],
  scenes: {
    red: {
      kind: 'topo',
      zones: [{ id: 'zr', x: 215, y: 62, w: 370, h: 152, l: 'Red ATM del proveedor', c: 'blue' }],
      nodes: [
        { id: 'U1', t: 'pc', x: 90, y: 150, l: 'Usuario' }, { id: 'S1', t: 'switch', x: 290, y: 150, l: 'Switch ATM' },
        { id: 'S2', t: 'switch', x: 510, y: 150, l: 'Switch ATM' }, { id: 'U2', t: 'pc', x: 710, y: 150, l: 'Usuario' }
      ],
      links: [{ a: 'U1', b: 'S1', l: 'UNI', ly: 28 }, { a: 'S1', b: 'S2', l: 'NNI', ly: 28, thick: 1 }, { a: 'S2', b: 'U2', l: 'UNI', ly: 28 }]
    },
    celda: {
      kind: 'fields', title: 'Celda ATM: 53 bytes', rh: 44,
      rows: [[{ id: 'cab', l: 'Cabecera', s: '5 bytes', w: 7, c: 'blue' }, { id: 'dat', l: 'Campo de información (datos)', s: '48 bytes', w: 46, c: 'white' }]],
      zoom: {
        from: 'cab', title: 'La cabecera en cada interfaz', x: 60, w: 680,
        rows: [
          [{ id: 'lu', l: 'UNI', w: 4, c: 'gray' }, { id: 'gfc', l: 'GFC', s: '4 bits', w: 4, c: 'yellow' }, { id: 'vpi', l: 'VPI', s: '8 bits', w: 8, c: 'green' }, { id: 'vci', l: 'VCI', s: '16 bits', w: 14, c: 'purple' }, { id: 'pt', l: 'PT', s: '3 bits', w: 3.4, c: 'orange' }, { id: 'clp', l: 'CLP', s: '1 bit', w: 3, c: 'red' }, { id: 'hec', l: 'HEC', s: '8 bits', w: 8, c: 'blue' }],
          [{ id: 'ln', l: 'NNI', w: 4, c: 'gray' }, { id: 'vpi2', l: 'VPI', s: '12 bits', w: 12, c: 'green' }, { id: 'vci2', l: 'VCI', s: '16 bits', w: 14, c: 'purple' }, { id: 'pt2', l: 'PT', s: '3 bits', w: 3.4, c: 'orange' }, { id: 'clp2', l: 'CLP', s: '1 bit', w: 3, c: 'red' }, { id: 'hec2', l: 'HEC', s: '8 bits', w: 8, c: 'blue' }]
        ]
      }
    },
    vp: {
      kind: 'topo',
      zones: [
        { id: 'zv', x: 24, y: 62, w: 752, h: 150, l: 'VP switch: cambia solo el camino (VPI)', c: 'yellow' },
        { id: 'zc', x: 24, y: 228, w: 752, h: 164, l: 'VC switch: conmuta el camino y el canal (VPI y VCI)', c: 'green' }
      ],
      nodes: [
        { id: 'i1', t: 'box', x: 130, y: 146, w: 170, h: 56, l: 'VPI 4', sub: 'lleva VCI 1 y VCI 2', c: 'orange' },
        { id: 'VP', t: 'switch', x: 400, y: 140, l: 'VP switch', c: 'yellow' },
        { id: 'o1', t: 'box', x: 670, y: 146, w: 170, h: 56, l: 'VPI 5', sub: 'siguen VCI 1 y VCI 2', c: 'orange' },
        { id: 'i2', t: 'box', x: 130, y: 314, w: 170, h: 56, l: 'VPI 1', sub: 'lleva VCI 1 y VCI 2', c: 'orange' },
        { id: 'VC', t: 'switch', x: 400, y: 308, l: 'VC switch' },
        { id: 'o2', t: 'box', x: 670, y: 274, w: 170, h: 46, l: 'VPI 3', sub: 'con VCI 3', c: 'orange' },
        { id: 'o3', t: 'box', x: 670, y: 352, w: 170, h: 46, l: 'VPI 2', sub: 'con VCI 4', c: 'orange' }
      ],
      links: [{ a: 'i1', b: 'VP', thick: 1 }, { a: 'VP', b: 'o1', thick: 1 }, { a: 'i2', b: 'VC', thick: 1 }, { a: 'VC', b: 'o2' }, { a: 'VC', b: 'o3' }]
    },
    conx: {
      kind: 'topo',
      nodes: [
        { id: 'ped', t: 'box', x: 100, y: 105, w: 150, h: 50, l: 'Pedido de\nconexión VCC', c: 'blue' },
        { id: 'vpc', t: 'state', x: 100, y: 220, h: 36, l: '¿Existe VPC?', c: 'yellow' },
        { id: 'nvo', t: 'box', x: 100, y: 340, w: 150, h: 50, l: 'Establecer\nnuevo VPC', c: 'white' },
        { id: 'qos', t: 'state', x: 330, y: 220, h: 36, l: '¿Satisface la QoS?', c: 'yellow' },
        { id: 'con', t: 'box', x: 700, y: 220, w: 140, h: 50, l: 'Realizar\nconexión', c: 'green' },
        { id: 'mod', t: 'box', x: 330, y: 340, w: 130, h: 50, l: 'Modificar\nsolicitud', c: 'orange' },
        { id: 'acc', t: 'state', x: 530, y: 340, h: 36, l: '¿Petición aceptada?', c: 'yellow' },
        { id: 'rej', t: 'box', x: 715, y: 340, w: 120, h: 50, l: 'Rechazar\nsolicitud', c: 'red' }
      ],
      links: [
        { a: 'ped', b: 'vpc', arrow: 1 }, { a: 'vpc', b: 'qos', arrow: 1, l: 'SÍ' }, { a: 'vpc', b: 'nvo', arrow: 1, l: 'NO', lx: 18, ly: 10 },
        { a: 'nvo', b: 'qos', arrow: 1 }, { a: 'qos', b: 'con', arrow: 1, l: 'SÍ' }, { a: 'qos', b: 'mod', arrow: 1, l: 'NO', lx: 18, ly: 10 },
        { a: 'mod', b: 'acc', arrow: 1 }, { a: 'acc', b: 'con', arrow: 1, l: 'SÍ', lx: 18 }, { a: 'acc', b: 'rej', arrow: 1, l: 'NO' }
      ]
    },
    hec: {
      kind: 'topo',
      nodes: [
        { id: 'corr', t: 'state', x: 190, y: 205, w: 176, h: 50, l: 'Modo corrección', sub: 'por defecto', c: 'yellow' },
        { id: 'det', t: 'state', x: 610, y: 205, w: 176, h: 50, l: 'Modo detección', sub: 'ya hubo un error', c: 'green' }
      ],
      links: [
        { a: 'corr', b: 'det', id: 'multi', curve: -120, arrow: 1, l: 'error en varios bits\nla celda se descarta', ly: -20 },
        { a: 'det', b: 'corr', id: 'ok', arrow: 1, l: 'sin error · ninguna acción', ly: 32 },
        { a: 'corr', b: 'det', id: 'single', curve: 120, arrow: 1, l: 'error en un solo bit\nse corrige', ly: 30 }
      ]
    },
    sync: {
      kind: 'topo',
      nodes: [
        { id: 'hunt', t: 'state', x: 170, y: 150, w: 124, h: 48, l: 'HUNT', sub: 'bit a bit', c: 'yellow' },
        { id: 'pre', t: 'state', x: 630, y: 150, w: 134, h: 48, l: 'PRESYNC', sub: 'celda a celda', c: 'green' },
        { id: 'syn', t: 'state', x: 400, y: 340, w: 134, h: 48, l: 'SYNC', sub: 'celda a celda', c: 'green' }
      ],
      links: [
        { a: 'hunt', b: 'pre', curve: -50, arrow: 1, l: 'HEC correcto', ly: -8 },
        { a: 'pre', b: 'hunt', curve: -50, arrow: 1, l: 'HEC incorrecto', ly: 24 },
        { a: 'pre', b: 'syn', arrow: 1, l: 'δ HEC correctos\nconsecutivos', lx: 80 },
        { a: 'syn', b: 'hunt', arrow: 1, l: 'α HEC incorrectos\nconsecutivos', lx: -86 }
      ]
    },
    aal: {
      kind: 'fields', title: 'De un datagrama IP a celdas ATM', rh: 42,
      rows: [
        [{ id: 'l1', l: 'Capa superior', s: 'usuario de la AAL', w: 7, c: 'gray' }, { id: 'ip', l: 'Cab. IP', s: '20 bytes', w: 4, c: 'blue' }, { id: 'dd', l: 'Datos del datagrama', s: '1480 bytes', w: 27, c: 'white' }],
        [{ id: 'l2', l: 'Convergencia', s: 'agrega bytes auxiliares', w: 7, c: 'gray' }, { id: 'a1', l: 'aux', w: 2, c: 'purple' }, { id: 'pdu', l: 'Datagrama IP completo', s: '1500 bytes', w: 27, c: 'white' }, { id: 'a2', l: 'aux', w: 2, c: 'purple' }],
        [{ id: 'l3', l: 'Segmentación', s: 'bloques de 48 bytes', w: 7, c: 'gray' }, { id: 's1', l: '48 B', s: 'con cab. IP', w: 5.1, c: 'blue' }, { id: 's2', l: '48 B', w: 5.1, c: 'green' }, { id: 's3', l: '48 B', w: 5.1, c: 'green' }, { id: 's4', l: '48 B', w: 5.1, c: 'green' }, { id: 'sd', l: '…', w: 5.5, c: 'white', ghost: 1 }, { id: 's5', l: '48 B', w: 5.1, c: 'green' }],
        [{ id: 'l4', l: 'Capa ATM', s: 'una celda por bloque', w: 7, c: 'gray' }, { id: 'h1', l: 'H', w: 1, c: 'orange' }, { id: 'p1', l: '48 B', w: 4.1, c: 'blue' }, { id: 'h2', l: 'H', w: 1, c: 'orange' }, { id: 'p2', l: '48 B', w: 4.1, c: 'green' }, { id: 'h3', l: 'H', w: 1, c: 'orange' }, { id: 'p3', l: '48 B', w: 4.1, c: 'green' }, { id: 'h4', l: 'H', w: 1, c: 'orange' }, { id: 'p4', l: '48 B', w: 4.1, c: 'green' }, { id: 'cd', l: '…', w: 5.5, c: 'white', ghost: 1 }, { id: 'h5', l: 'H', w: 1, c: 'orange' }, { id: 'p5', l: '48 B', w: 4.1, c: 'green' }]
      ]
    },
    clases: {
      kind: 'fields', title: 'Clases de servicio y su capa de adaptación', rh: 40,
      rows: [
        [{ id: 'k0', l: 'Clase', w: 9, c: 'gray' }, { id: 'ca', l: 'A', w: 6, c: 'blue' }, { id: 'cb', l: 'B', w: 6, c: 'blue' }, { id: 'cc', l: 'C', w: 6, c: 'blue' }, { id: 'cd', l: 'D', w: 6, c: 'blue' }],
        [{ id: 'k1', l: 'Sincronización\norigen – destino', w: 9, c: 'gray' }, { id: 'sr', l: 'Requerida', w: 12, c: 'purple' }, { id: 'sn', l: 'No requerida', w: 12, c: 'white' }],
        [{ id: 'k2', l: 'Tasa de bits', w: 9, c: 'gray' }, { id: 'tc', l: 'Constante', w: 6, c: 'green' }, { id: 'tv', l: 'Variable', w: 18, c: 'yellow' }],
        [{ id: 'k3', l: 'Tipo de conexión', w: 9, c: 'gray' }, { id: 'co', l: 'Orientado a la conexión', w: 18, c: 'green' }, { id: 'cl', l: 'Sin conexión', w: 6, c: 'white' }],
        [{ id: 'k4', l: 'Capa de adaptación', w: 9, c: 'gray' }, { id: 'l1', l: 'AAL1', w: 6, c: 'orange' }, { id: 'l2', l: 'AAL2', w: 6, c: 'orange' }, { id: 'l5', l: 'AAL5', w: 6, c: 'orange' }, { id: 'l34', l: 'AAL3/4', w: 6, c: 'orange' }],
        [{ id: 'k5', l: 'Qué se busca', w: 9, c: 'gray' }, { id: 'q1', l: 'Transmisión ágil, sin retardo', s: 'una pérdida o un error no importan', w: 12, c: 'purple' }, { id: 'q2', l: 'Sin pérdidas ni errores', s: 'insensible al retardo', w: 12, c: 'white' }]
      ]
    }
  },
  steps: [
    {
      s: 'Celda', k: 'contexto', t: 'Todo en celdas del mismo tamaño',
      b: '<p><b>ATM</b> (Asynchronous Transfer Mode) es un protocolo de <b>capa 2</b>, orientado al bit. En los protocolos anteriores la PDU era de longitud variable; en ATM es de <b>longitud fija</b> y tan chica que se la llama <b>celda</b>: 53 bytes.</p><p>Con tramas variables el equipo tiene que esperar a que cada trama se complete, y cada una tarda distinto. Con PDU todas iguales se puede <b>predecir y acotar</b> el tiempo de conmutación: retardo fijo y pequeño, baja latencia.</p><p>Además es <b>orientado a la conexión</b>, permite definir <b>calidad de servicio</b> en cada conexión y manejar <b>ancho de banda a demanda</b>.</p>',
      key: 'Se diseñó para llegar de extremo a extremo, pero los usuarios siguieron con Ethernet: ATM quedó en la red del proveedor.',
      fig: ['image157.png', 'image158.png'], scene: 'red',
      pk: [
        { p: ['U1', 'S1', 'S2', 'U2'], l: 'celda', t: 0, d: 3 }, { p: ['U1', 'S1', 'S2', 'U2'], l: 'celda', t: .75, d: 3 },
        { p: ['U1', 'S1', 'S2', 'U2'], l: 'celda', t: 1.5, d: 3 }, { p: ['U1', 'S1', 'S2', 'U2'], l: 'celda', t: 2.25, d: 3 }
      ],
      notes: [{ x: 150, y: 236, w: 500, c: 'yellow', text: 'Cada celda mide <b>53 bytes</b>: 5 de cabecera + 48 de datos. El switch tarda lo mismo en procesar cualquiera de ellas.' }],
      tbl: { x: 190, y: 300, w: 420, cols: ['', 'Trama (HDLC, Frame Relay)', 'Celda ATM'], rows: [['Longitud', 'variable', 'fija: 53 bytes'], ['Conmutación', 'depende de cada trama', 'siempre el mismo tiempo']], hi: 1 },
      st: { celda: '53 bytes (5 + 48)', id: '—', hec: '—', aal: '—' }
    },
    {
      s: 'Cabecera', k: 'detalle', t: 'La cabecera de la celda, en UNI y en NNI',
      b: '<p>Hay dos interfaces: <b>UNI</b> (User to Network Interface), con la que nos conectamos a un switch ATM, y <b>NNI</b> (Network to Network Interface), que une dos nodos. La cabecera cambia apenas de una a otra.</p><ul><li><b>GFC</b> (Generic Flow Control): solo en UNI, porque el control de flujo se hace entre el usuario y la red.</li><li><b>VPI</b> y <b>VCI</b>: en conjunto identifican la conexión, como el DLCI de Frame Relay.</li><li><b>Payload Type</b>: tipo de carga (celda de usuario u OAM) y aviso de congestión.</li><li><b>CLP</b>: prioridad de la celda. En 1 se puede descartar, igual que el bit DE.</li><li><b>HEC</b>: control de errores de la cabecera.</li></ul>',
      key: 'Cinco bytes de cabecera para 48 de datos: ATM tiene más overhead que los protocolos anteriores.',
      fig: ['image160.png', 'image161.png', 'image162.png', 'image163.png'], scene: 'celda', zoom: 1,
      det: 'El <b>HEC</b> es 1 byte que controla los otros 4: detecta errores en la cabecera y corrige hasta 1 bit. ATM <b>no</b> controla errores sobre el campo de datos. La red pone <b>CLP = 1</b> cuando el usuario excede algún parámetro de tráfico.',
      st: { id: 'VPI + VCI', hec: 'protege la cabecera' }
    },
    {
      s: 'VPI / VCI', k: 'idea', t: 'Canales virtuales dentro de caminos virtuales',
      b: '<p>El identificador tiene dos partes porque las conexiones se pensaron con <b>jerarquía</b>: los <b>canales virtuales</b> (VC) viajan agrupados dentro de <b>caminos virtuales</b> (VP).</p><ul><li>Un <b>VP switch</b> conmuta caminos: cambia el VPI y los canales que van adentro lo siguen sin que nadie toque su VCI. Con un solo cambio el proveedor re-enruta todas las conexiones de ese camino.</li><li>Un <b>VC switch</b> conmuta canales: como el canal entra dentro de un camino, conmuta tanto el VPI como el VCI.</li></ul><p>Una conexión de extremo a extremo (<b>VCC</b>) va atravesando así distintos caminos.</p>',
      key: 'Agrupar canales en caminos le permite al proveedor gestionar con más eficiencia el tráfico de sus clientes.',
      fig: ['image164.png', 'image165.png'], scene: 'vp',
      pk: [
        { p: ['i1', 'VP'], l: 'VPI 4 · VCI 1', t: 0, d: 1.3 }, { p: ['VP', 'o1'], l: 'VPI 5 · VCI 1', t: 1.3, d: 1.3 },
        { p: ['i2', 'VC'], l: 'VPI 1 · VCI 1', t: 0, d: 1.3 }, { p: ['VC', 'o2'], l: 'VPI 3 · VCI 3', t: 1.3, d: 1.3 },
        { p: ['i2', 'VC'], l: 'VPI 1 · VCI 2', c: 'res', t: 2.8, d: 1.3 }, { p: ['VC', 'o3'], l: 'VPI 2 · VCI 4', c: 'res', t: 4.1, d: 1.3 }
      ]
    },
    {
      s: 'Conexión', k: 'mecanismo', t: 'Pedir una conexión',
      b: '<p>ATM es orientado a la conexión: un extremo pide una <b>VCC</b> mediante un protocolo de <b>señalización</b>, indicando con quién se quiere conectar y qué características tendrá la conexión.</p><ul><li>El switch se fija si <b>existe un camino (VPC)</b> que lleve al destino. Si no existe, lo crea.</li><li>Después consulta si ese camino <b>satisface la QoS</b>, es decir, si la red tiene los recursos que se piden. Si los tiene, realiza la conexión.</li><li>Si no, le pide al usuario que <b>modifique la solicitud</b>: el usuario puede aceptar, y se conecta, o la solicitud se rechaza.</li></ul>',
      key: 'La conexión se establece solo si la red puede cumplir la calidad de servicio pedida.',
      fig: 'image166.png', scene: 'conx', hi: ['vpc', 'qos'],
      pk: [{ p: ['ped', 'vpc'], l: 'pedido', c: 'ctl', d: 1 }, { p: ['vpc', 'qos'], l: 'hay VPC', c: 'ctl', d: 1.2 }, { p: ['qos', 'con'], l: 'hay recursos', c: 'ctl', d: 1.6, stay: 1 }],
      notes: [{ x: 250, y: 74, w: 500, c: 'yellow', text: 'Las VCC pueden ser <b>usuario – usuario</b> (llevan los datos de extremo a extremo), <b>usuario – red</b> (señalización) o <b>red – red</b> (información de ruteo entre switches).' }]
    },
    {
      s: 'HEC', k: 'mecanismo', t: 'HEC: corregir o descartar',
      b: '<p>El <b>HEC</b> se calcula con un procedimiento similar al de HDLC y permite <b>corregir 1 bit</b> erróneo de la cabecera.</p><p>Con la conexión establecida, el nodo lo verifica celda tras celda:</p><ul><li>Por defecto está en <b>modo corrección</b>. Mientras ninguna celda tenga errores, se queda ahí.</li><li>Si detecta un error en una cabecera pasa a <b>modo detección</b>: un único bit errado se corrige; si son varios, la celda se descarta.</li><li>En modo detección, si la celda siguiente llega sin error vuelve a corrección; si el HEC vuelve a dar erróneo, la celda se <b>descarta</b>.</li></ul>',
      key: 'Un bit aislado se corrige; si los errores se repiten, se supone que el problema es otro.',
      fig: 'image167.png', scene: 'hec', hi: ['corr'],
      pk: [
        { p: ['corr', [295, 250], [400, 265], [505, 250], 'det'], l: 'error de 1 bit', c: 'key', d: 2 },
        { p: ['det', [400, 205], 'corr'], l: 'celda sin error', c: 'req', d: 2 }
      ],
      notes: [
        { x: 60, y: 300, w: 240, c: 'yellow', text: '<b>Sin error</b>: sigue en modo corrección, sin ninguna acción.' },
        { x: 500, y: 300, w: 240, c: 'green', text: '<b>Otro error</b>: la celda se descarta y sigue en modo detección.' }
      ],
      st: { hec: 'corrección / detección' }
    },
    {
      s: 'Delimitar', k: 'mecanismo', t: 'Encontrar las celdas con el HEC',
      b: '<p>La capa física tiene que <b>delimitar las celdas</b>, y acá no hay flag: el sincronismo se obtiene con el <b>HEC</b>.</p><ul><li><b>HUNT</b> (captura): el receptor toma un bloque del tamaño de una celda y calcula el HEC. Si da incorrecto, se corre <b>un bit</b> y vuelve a calcular.</li><li><b>PRESYNC</b>: un HEC correcto puede ser una celda o una coincidencia. Avanza <b>celda a celda</b>: si el siguiente falla, vuelve a HUNT.</li><li><b>SYNC</b>: tras varias celdas consecutivas correctas ya sabe dónde empieza y termina cada una, y las procesa de a una. Si aparece una serie de celdas con error, perdió el sincronismo y vuelve a HUNT.</li></ul>',
      key: 'El mismo byte sirve para dos cosas: proteger la cabecera y marcar dónde empieza cada celda.',
      fig: 'image169.png', scene: 'sync', hi: ['hunt'],
      pk: [{ p: ['hunt', 'pre'], l: 'HEC correcto', d: 1.6 }, { p: ['pre', 'syn'], l: 'δ correctos', d: 1.6, stay: 1 }],
      notes: [
        { x: 24, y: 306, w: 228, c: 'yellow', text: 'La capa física también monitorea errores, inserta <b>celdas vacías</b> (idle) cuando no hay datos y mantiene el sincronismo.' },
        { x: 556, y: 306, w: 220, c: 'green', text: 'En <b>SYNC</b> vale el diagrama anterior: un bit aislado se corrige y la celda se procesa.' }
      ],
      st: { hec: 'delimita las celdas' }
    },
    {
      s: 'AAL', k: 'mecanismo', t: 'AAL: adaptar lo que viene de arriba',
      b: '<p>Sobre la capa física (generalmente <b>SDH</b>), ATM se divide en dos: la <b>capa ATM</b> propiamente dicha y la <b>AAL</b>, la capa de adaptación.</p><p>La capa superior quiere transmitir, por ejemplo, un datagrama IP de 1500 bytes, y en una celda entran 48. La AAL <b>oculta</b> esa característica con dos subcapas:</p><ul><li><b>Convergencia</b>: agrega bytes auxiliares a la PDU.</li><li><b>Segmentación y reensamblado</b>: la corta en bloques de 48 bytes, que caben en el campo de datos de la celda.</li></ul><p>También se ocupa de los errores de transmisión, de las celdas perdidas o mal insertadas y del control de flujo.</p>',
      key: 'No se fragmenta desde IP: se segmenta en la AAL y se transmite todo de una sola vez.',
      fig: ['image159.png', 'image168.png', 'image170.png'], scene: 'aal',
      det: 'Si se <b>fragmentara</b> con IP usando 48 bytes como MTU, cada fragmento repetiría los 20 bytes de cabecera IP y llevaría solo 28 de datos. Con la <b>segmentación</b>, la cabecera IP viaja en un solo bloque y el resto son partes del datagrama: 1500 / 48 da unas 32 celdas (<b>H</b> = cabecera ATM de 5 bytes).',
      st: { aal: 'convergencia + segmentación' }
    },
    {
      s: 'Clases', k: 'detalle', t: 'Clases y categorías de servicio',
      b: '<p>Por ATM se puede transmitir todo tipo de servicios, no solo datos. Hay cuatro <b>clases</b>, cada una con su AAL:</p><ul><li><b>A</b>: tasa de bits constante, con sincronización entre origen y destino. <b>AAL1</b>.</li><li><b>B</b>: igual, pero con tasa variable. <b>AAL2</b>.</li><li><b>C</b>: datos orientados a la conexión. <b>AAL5</b>.</li><li><b>D</b>: datos sin conexión. <b>AAL3/4</b>.</li></ul><p>Según la AAL, la convergencia agrega la información auxiliar necesaria (timestamp, detección de errores…) para recuperar la señal tal cual ingresó.</p><p>Al pedir una conexión, el usuario indica qué <b>categoría de servicio</b> necesita.</p>',
      fig: 'image171.png', scene: 'clases',
      det: 'Categorías del ATM Forum. <b>Tiempo real</b>: CBR (tasa de bit constante) y VBR (variable), equivalentes a las clases A y B. <b>No tiempo real</b>: VBR, ABR (tasa de bit disponible) y UBR (tasa no especificada).',
      st: { aal: 'AAL1 · AAL2 · AAL5 · AAL3/4' }
    },
    {
      s: 'Contrato', k: 'mecanismo', t: 'Descriptor de tráfico, QoS, CAC y UPC',
      b: '<p>Junto con la categoría, al pedir una VCC el usuario entrega un <b>descriptor de tráfico</b> (qué va a transmitir) y los <b>parámetros de QoS</b> (qué espera de la red), para ambas direcciones.</p><p><b>Call Admission Control</b> es la función de señalización de la red: en función de todos esos valores, <b>acepta o no</b> la conexión.</p><p>Con la conexión establecida, el switch corre el <b>UPC</b> (User Parameter Control): compara lo que el usuario envía con lo solicitado y controla que cumpla el <b>PCR</b> y el <b>SCR</b> contratados. Es lo mismo que hacía el nodo de Frame Relay cuando contaba bits para que no nos pasáramos del CIR.</p>',
      key: 'CAC decide antes de conectar; UPC vigila mientras dura la conexión.',
      scene: 'red', hide: ['zr'], hi: ['S1'], tags: { S1: 'CAC, después UPC' },
      pk: [
        { p: ['U1', 'S1'], l: 'pedido de VCC', c: 'ctl', d: 1.2 }, { p: ['S1', 'U1'], l: 'aceptada', c: 'res', d: 1.2 },
        { p: ['U1', 'S1', 'S2', 'U2'], l: 'celdas', c: 'req', d: 2 }, { p: ['S1', 'S2', 'U2'], l: 'CLP = 1', c: 'key', d: 1.5 }
      ],
      tbl: [
        { x: 24, y: 236, w: 372, title: 'Descriptor de tráfico', cols: ['Parámetro', 'Qué limita', 'Para'], rows: [['PCR', 'tasa máxima de celdas', 'CBR y VBR'], ['SCR', 'promedio de la tasa', 'VBR'], ['MBS', 'ráfaga máxima a velocidad PCR', 'VBR'], ['MCR', 'tasa mínima requerida', 'ABR']] },
        { x: 412, y: 236, w: 364, title: 'Parámetros de QoS', cols: ['Parámetro', 'Qué se le pide a la red'], rows: [['CDV pico a pico', 'variación máxima del retardo'], ['maxCTD', 'retardo máximo de transferencia'], ['CLR', 'tasa de pérdida máxima']] }
      ]
    },
    {
      s: 'Resumen', k: 'resumen', t: 'ATM en una mirada',
      b: '<ul><li><b>Celdas</b> de 53 bytes (5 + 48): tiempo de conmutación predecible y baja latencia.</li><li>Orientado a la conexión: cada una se identifica con <b>VPI / VCI</b>, canales dentro de caminos.</li><li>El <b>HEC</b> protege la cabecera, corrige 1 bit y además delimita las celdas (HUNT → PRESYNC → SYNC).</li><li>La <b>AAL</b> adapta cada servicio: convergencia más segmentación en bloques de 48 bytes.</li><li>Calidad de servicio por conexión: categoría, descriptor de tráfico y QoS. <b>CAC</b> admite, <b>UPC</b> controla.</li></ul><p>Frame Relay y ATM conmutan con un identificador corto de capa 2. En la próxima lección, <b>MPLS</b> lleva esa idea al transporte de IP: conmutar por etiquetas en lugar de rutear salto a salto.</p>',
      scene: 'red', tags: { S1: 'conmuta por VPI / VCI', S2: 'conmuta por VPI / VCI' },
      pk: [
        { p: ['U1', 'S1', 'S2', 'U2'], l: 'celda', t: 0, d: 3 }, { p: ['U1', 'S1', 'S2', 'U2'], l: 'celda', t: 1, d: 3 }, { p: ['U1', 'S1', 'S2', 'U2'], l: 'celda', t: 2, d: 3 }
      ],
      notes: [{ x: 150, y: 250, w: 500, c: 'yellow', text: 'Cabecera: <b>GFC</b> (solo UNI) · <b>VPI</b> · <b>VCI</b> · <b>Payload Type</b> · <b>CLP</b> · <b>HEC</b>. Después, siempre 48 bytes de datos.' }]
    }
  ],
  quiz: [
    { q: '¿Por qué ATM usa una PDU de longitud fija?', o: ['Para que entre un datagrama IP completo', 'Para poder predecir y acotar el tiempo de conmutación', 'Porque así no hace falta cabecera', 'Para no tener que establecer conexiones'], a: 1, why: 'Si todas las celdas son iguales, el switch tarda lo mismo en procesar cada una: retardo fijo y pequeño, baja latencia.' },
    { q: '¿Qué campo de la cabecera existe en la interfaz UNI pero no en la NNI?', o: ['VPI', 'CLP', 'GFC', 'HEC'], a: 2, why: 'El control de flujo genérico se hace entre el usuario y la red; una vez que el tráfico ingresó, solo se transporta.' },
    { q: 'El receptor está en HUNT y encuentra un HEC correcto. ¿Qué hace?', o: ['Da las celdas por delimitadas y pasa directo a SYNC', 'Pasa a PRESYNC y sigue verificando celda a celda', 'Descarta la celda y se corre un bit', 'Pasa a modo detección'], a: 1, why: 'Un HEC correcto puede ser una coincidencia: recién después de varias celdas consecutivas correctas pasa a SYNC; si falla, vuelve a HUNT.' },
    { q: '¿En qué se diferencia la segmentación de la AAL de la fragmentación de IP?', o: ['La AAL repite la cabecera IP en cada bloque', 'La cabecera IP viaja una sola vez y el resto de los bloques son partes del datagrama', 'La AAL solo segmenta datagramas de menos de 48 bytes', 'No hay diferencia: es el mismo mecanismo'], a: 1, why: 'Con fragmentación IP cada fragmento llevaría 20 bytes de cabecera y solo 28 de datos; la AAL corta la PDU completa en bloques de 48 bytes.' }
  ],
  cheat: [
    ['Celda', '53 bytes: 5 de cabecera + 48 de datos. Longitud fija: conmutación predecible y baja latencia.'],
    ['UNI / NNI', 'Interfaz usuario – red / red – red. El campo <b>GFC</b> solo existe en UNI.'],
    ['VPI / VCI', 'Identificador de conexión: canales virtuales dentro de caminos virtuales. <b>VP switch</b> cambia el VPI; <b>VC switch</b>, VPI y VCI.'],
    ['CLP y HEC', '<b>CLP</b> = 1: celda descartable (como el DE). <b>HEC</b>: 1 byte que protege la cabecera y corrige 1 bit; los datos no se controlan.'],
    ['Delimitación', 'Se hace con el HEC: <b>HUNT</b> (bit a bit) → <b>PRESYNC</b> (celda a celda) → <b>SYNC</b>.'],
    ['AAL', 'Convergencia + segmentación y reensamblado en bloques de 48 bytes. La cabecera IP viaja una sola vez.'],
    ['Clases', 'A: tasa constante, AAL1 · B: variable con sincronización, AAL2 · C: datos con conexión, AAL5 · D: datos sin conexión, AAL3/4.'],
    ['Contrato', 'Categoría (CBR, VBR, ABR, UBR) + descriptor (PCR, SCR, MBS, MCR) + QoS (CDV, maxCTD, CLR). <b>CAC</b> admite; <b>UPC</b> controla PCR y SCR.']
  ]
});

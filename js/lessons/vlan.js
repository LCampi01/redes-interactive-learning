COURSE.add({
  id: 'vlan',
  title: 'VLANs, 802.1Q y LACP',
  desc: 'Cómo un mismo switch se parte en varias redes aisladas, cómo se extienden a otros equipos con un trunk etiquetado y cómo se suman cables sin crear loops.',
  min: 11, level: 'Intermedio',
  learn: [
    'Qué es una VLAN y por qué separa dominios de broadcast',
    'Por qué hace falta un router para comunicar dos VLANs',
    'Cómo un trunk 802.1Q lleva varias VLANs por un solo cable etiquetando las tramas',
    'El formato del tag de 4 bytes: ethertype 0x8100, PRI y VLAN-ID',
    'Qué resuelve LACP al agrupar varios puertos en uno lógico'
  ],
  stats: [{ k: 'bc', l: 'Dominios de broadcast' }, { k: 'pto', l: 'Enlace entre equipos' }, { k: 'tr', l: 'Por ese enlace viaja' }],
  legend: [['req', 'trama de la VLAN 10'], ['res', 'trama de la VLAN 20'], ['key', 'trama con tag 802.1Q'], ['bad', 'no pasa a la otra VLAN']],
  scenes: {
    uno: {
      kind: 'topo',
      zones: [
        { id: 'z10', x: 50, y: 40, w: 340, h: 350, l: 'VLAN 10 · desarrollo', c: 'green' },
        { id: 'z20', x: 410, y: 40, w: 340, h: 350, l: 'VLAN 20 · producción', c: 'blue' }
      ],
      nodes: [
        { id: 'SW', t: 'switch', x: 400, y: 245, l: 'Switch' },
        { id: 'A1', t: 'pc', x: 140, y: 160, l: 'A1', c: 'green' }, { id: 'A2', t: 'pc', x: 140, y: 320, l: 'A2', c: 'green' },
        { id: 'B1', t: 'pc', x: 660, y: 160, l: 'B1', c: 'blue' }, { id: 'B2', t: 'pc', x: 660, y: 320, l: 'B2', c: 'blue' },
        { id: 'R', t: 'router', x: 400, y: 95, l: 'Router' },
        { id: 'd10', t: 'dot', x: 340, y: 170 }, { id: 'd20', t: 'dot', x: 460, y: 170 }
      ],
      links: [
        { a: 'A1', b: 'SW', c: 'green' }, { a: 'A2', b: 'SW', c: 'green' }, { a: 'B1', b: 'SW', c: 'blue' }, { a: 'B2', b: 'SW', c: 'blue' },
        { a: 'SW', b: 'd10', c: 'green' }, { a: 'd10', b: 'R', c: 'green' }, { a: 'SW', b: 'd20', c: 'blue' }, { a: 'd20', b: 'R', c: 'blue' }
      ]
    },
    dos: {
      kind: 'topo',
      nodes: [
        { id: 'S1', t: 'switch', x: 280, y: 215, l: 'Switch 1' }, { id: 'S2', t: 'switch', x: 520, y: 215, l: 'Switch 2' },
        { id: 'A1', t: 'pc', x: 110, y: 115, l: 'A1', sub: 'VLAN 10', c: 'green' }, { id: 'B1', t: 'pc', x: 110, y: 305, l: 'B1', sub: 'VLAN 20', c: 'blue' },
        { id: 'A2', t: 'pc', x: 690, y: 115, l: 'A2', sub: 'VLAN 10', c: 'green' }, { id: 'B2', t: 'pc', x: 690, y: 305, l: 'B2', sub: 'VLAN 20', c: 'blue' }
      ],
      links: [
        { a: 'A1', b: 'S1', c: 'green' }, { a: 'B1', b: 'S1', c: 'blue' }, { a: 'A2', b: 'S2', c: 'green' }, { a: 'B2', b: 'S2', c: 'blue' },
        { a: 'S1', b: 'S2', id: 'trunk', thick: 1, c: 'yellow', l: 'trunk 802.1Q', ly: 30 },
        { a: 'S1', b: 'S2', id: 'l10', curve: -70, c: 'green', l: 'puertos de la VLAN 10', ly: -4 },
        { a: 'S1', b: 'S2', id: 'l20', curve: 70, c: 'blue', l: 'puertos de la VLAN 20', ly: 26 }
      ]
    },
    tag: {
      kind: 'fields', title: 'Trama Ethernet con etiqueta 802.1Q', rh: 50,
      rows: [[
        { id: 'pre', l: 'Preámbulo', s: '7 B', w: 6, c: 'gray' }, { id: 'sfd', l: 'SFD', s: '1 B', w: 2.6, c: 'gray' },
        { id: 'da', l: 'DA', s: '6 B', w: 4.6, c: 'green' }, { id: 'sa', l: 'SA', s: '6 B', w: 4.6, c: 'blue' },
        { id: 'tag', l: 'Tag', s: '4 B', w: 5, c: 'yellow' }, { id: 'len', l: 'Type/Len', s: '2 B', w: 4.6, c: 'purple' },
        { id: 'dat', l: 'Datos', s: 'hasta 1500 B', w: 10, c: 'white' }, { id: 'fcs', l: 'FCS', s: '4 B', w: 4, c: 'orange' }
      ]],
      zoom: {
        from: 'tag', title: 'Dentro del tag: 4 bytes = 32 bits',
        rows: [[
          { id: 'tpid', l: 'Ethertype = 0x8100', s: '2 bytes (16 bits)', w: 16, c: 'yellow' }, { id: 'pri', l: 'PRI', s: '3 bits · 0 a 7', w: 5.5, c: 'red' },
          { id: 'cfi', l: '', s: '1 bit', w: 2.4, c: 'gray' }, { id: 'vid', l: 'VLAN-ID', s: '12 bits · 0 a 4095', w: 12, c: 'green' }
        ]]
      }
    },
    serv: {
      kind: 'topo',
      nodes: [
        { id: 'SW', t: 'switch', x: 350, y: 225, l: 'Switch' },
        { id: 'A', t: 'pc', x: 110, y: 140, l: 'Cliente A', sub: 'VLAN 10', c: 'green' }, { id: 'B', t: 'pc', x: 110, y: 310, l: 'Cliente B', sub: 'VLAN 20', c: 'blue' },
        { id: 'R', t: 'router', x: 580, y: 140, l: 'Router' }, { id: 'NET', t: 'cloud', x: 720, y: 140, l: 'Internet' },
        { id: 'VM', t: 'server', x: 580, y: 310, l: 'Servidor de VMs' }
      ],
      links: [
        { a: 'A', b: 'SW', c: 'green' }, { a: 'B', b: 'SW', c: 'blue' },
        { a: 'SW', b: 'R', thick: 1, c: 'yellow', l: 'trunk 802.1Q', lx: -42, ly: -14 }, { a: 'R', b: 'NET' },
        { a: 'SW', b: 'VM', thick: 1, c: 'yellow', l: 'trunk 802.1Q', lx: -52, ly: 34 }
      ]
    },
    agg: {
      kind: 'topo',
      zones: [{ id: 'zL', x: 332, y: 146, w: 136, h: 122, l: 'grupo LACP', c: 'purple' }],
      nodes: [
        { id: 'S1', t: 'switch', x: 285, y: 215, l: 'Switch 1' }, { id: 'S2', t: 'switch', x: 515, y: 215, l: 'Switch 2' },
        { id: 'L1', t: 'pc', x: 105, y: 105 }, { id: 'L2', t: 'pc', x: 105, y: 215 }, { id: 'L3', t: 'pc', x: 105, y: 325 },
        { id: 'R1', t: 'pc', x: 695, y: 105 }, { id: 'R2', t: 'pc', x: 695, y: 215 }, { id: 'R3', t: 'pc', x: 695, y: 325 }
      ],
      links: [
        { a: 'L1', b: 'S1' }, { a: 'L2', b: 'S1' }, { a: 'L3', b: 'S1' }, { a: 'R1', b: 'S2' }, { a: 'R2', b: 'S2' }, { a: 'R3', b: 'S2' },
        { a: 'S1', b: 'S2', id: 'c1', curve: -50, thick: 1, ly: -2 }, { a: 'S1', b: 'S2', id: 'c2', curve: 50, thick: 1, ly: 32 }
      ]
    }
  },
  steps: [
    {
      s: 'VLAN', k: 'idea', t: 'Una VLAN: partir el switch en varios',
      b: '<p>Hasta ahora, todas las estaciones de un switch estaban en el mismo <b>dominio de broadcast</b>. Queremos armar dos redes separadas, por ejemplo desarrollo y producción, con <b>el mismo switch</b>.</p><p>Una <b>VLAN</b> es una LAN virtual: se <b>asocian puertos</b> a una VLAN y esos puertos se comportan «como si fueran» un switch completamente separado, con su propio dominio de broadcast.</p><p>Un mensaje se copia en los puertos de <b>su</b> VLAN, pero no llega al otro lado.</p>',
      key: 'Aislar sirve para que un grupo no vea ni comparta el tráfico del otro; un proveedor lo usa para separar a sus clientes.',
      fig: 'image25.png', scene: 'uno', hide: ['R', 'd10', 'd20'], hi: ['A1'], tags: { A1: 'broadcast', A2: 'lo recibe', B1: 'no le llega', B2: 'no le llega' },
      fx: [{ k: 'wave', at: 'A1', c: 'req', t: 0, r: 70 }],
      pk: [{ p: ['A1', 'SW', 'A2'], l: 'broadcast', t: .2, d: 2, stay: 1 }, { p: ['A1', 'SW', 'B1'], l: 'broadcast', c: 'bad', t: .2, d: 2, drop: 1, dropAt: .57 }],
      st: { bc: '2 · uno por VLAN', pto: '—', tr: '—' }
    },
    {
      s: 'Router', k: 'mecanismo', t: 'Para pasar de una VLAN a otra: un router',
      b: '<p>Las VLANs <b>aíslan las redes</b>. Si igual queremos que dos VLANs se comuniquen, hace falta un dispositivo de <b>capa de red</b>: el <b>router</b>, que permite el paso de una red hacia la otra.</p><p>Cuando una estación quiere comunicarse con otra que está en la otra VLAN, le envía el mensaje al router. El router analiza la trama, lee la dirección de destino y envía el mensaje a la otra red.</p>',
      key: 'Dentro de una VLAN conmuta el switch (capa de enlace); entre VLANs decide el router (capa de red).',
      fig: 'image26.png', scene: 'uno', hi: ['R'], tags: { A1: 'envía a B1', B1: 'la recibe' },
      pk: [{ p: ['A1', 'SW', 'd10', 'R'], l: 'para B1', t: 0, d: 2.2 }, { p: ['R', 'd20', 'SW', 'B1'], l: 'para B1', c: 'res', t: 2.4, d: 2.2, stay: 1 }],
      st: { bc: '2 · unidos por el router', pto: '1 puerto por VLAN', tr: 'tramas comunes' }
    },
    {
      s: 'Extender', k: 'problema', t: 'Extender una VLAN a otro switch',
      b: '<p>Un usuario de una VLAN necesita más puertos, y el switch ya los tiene todos ocupados. Hay que usar <b>otro switch</b> y asignarle ahí los puertos que pide.</p><p>Una primera alternativa: unir un puerto de un switch con un puerto del otro, <b>ambos de la misma VLAN</b>.</p><p>Funciona, pero se gastan muchos puertos, y empeora si hay que conectar <b>un cable por cada VLAN</b> que quiera extenderse.</p>',
      key: 'Un enlace por VLAN no escala: los puertos se acaban antes que las VLANs.',
      fig: 'image27.png', scene: 'dos', hide: ['trunk'],
      pk: [{ p: ['A1', 'S1', [400, 180], 'S2', 'A2'], l: 'VLAN 10', t: 0, d: 2.6, stay: 1 }, { p: ['B1', 'S1', [400, 250], 'S2', 'B2'], l: 'VLAN 20', c: 'res', t: .3, d: 2.6, stay: 1 }],
      notes: [{ x: 250, y: 325, w: 300, c: 'red', text: 'Dos VLANs = <b>dos cables y cuatro puertos</b> ocupados. Con cada VLAN nueva se suma otro par.' }],
      st: { bc: '2', pto: '1 cable por VLAN', tr: 'tramas sin etiqueta' }
    },
    {
      s: 'Trunk', k: 'mecanismo', t: 'Trunk 802.1Q: un cable para todas las VLANs',
      b: '<p>La alternativa conveniente es <b>802.1Q</b> o <b>VLAN tagging</b>, que convirtió en estándar lo que antes cada fabricante resolvía a su modo.</p><p>Se toma un puerto en cada switch que <b>no pertenece a ninguna VLAN</b> y se los une: eso es un <b>trunk</b>.</p><ul><li>Al entrar al trunk, el switch le agrega a la trama una <b>etiqueta</b> que indica a qué VLAN pertenece.</li><li>Al llegar, el otro switch <b>lee la etiqueta, la elimina</b> y copia la trama en los puertos de esa VLAN.</li></ul>',
      key: 'El trunk permite tener miembros de una misma VLAN en otro dispositivo físico.',
      fig: ['image28.png', 'image29.png'], scene: 'dos', hide: ['l10', 'l20'], hi: ['trunk'], tags: { S1: 'agrega el tag', S2: 'lee y quita el tag' },
      pk: [{ p: ['A1', 'S1'], l: 'trama', t: 0, d: 1 }, { p: ['S1', 'S2'], l: 'tag 10 + trama', c: 'key', t: 1.1, d: 1.4 }, { p: ['S2', 'A2'], l: 'trama', t: 2.6, d: 1, stay: 1 },
        { p: ['B1', 'S1'], l: 'trama', c: 'res', t: 3.1, d: 1 }, { p: ['S1', 'S2'], l: 'tag 20 + trama', c: 'key', t: 4.2, d: 1.4 }, { p: ['S2', 'B2'], l: 'trama', c: 'res', t: 5.7, d: 1, stay: 1 }],
      st: { pto: '1 trunk 802.1Q', tr: 'tramas con tag' }
    },
    {
      s: 'El tag', k: 'detalle', t: 'Dónde va la etiqueta',
      b: '<p>El switch tiene su tabla con las MAC address y su ubicación. Si el destino está en el otro switch, la trama sale por el puerto 802.1Q.</p><p>Para pasar por el trunk se le agrega un campo <b>tag de 4 bytes</b>, que se inserta <b>entre la dirección de origen y el Type/Len</b>.</p><p>La etiqueta solo existe entre los puertos 802.1Q: las estaciones siguen enviando y recibiendo la trama Ethernet de siempre.</p>',
      key: 'El resto de la trama no se toca: el tag se intercala y después se saca.',
      fig: ['image30.png', 'image31.png'], scene: 'tag', hi: ['tag'],
      det: 'Trama original: … SA · Type/Len · Datos … En el trunk: … SA · <b>Tag (4 bytes)</b> · Type/Len · Datos … Al salir del trunk se elimina el tag y vuelve a quedar la original.',
      st: { tr: 'trama + tag de 4 bytes' }
    },
    {
      s: 'VLAN-ID', k: 'detalle', t: 'Dentro del tag: ethertype, PRI y VLAN-ID',
      b: '<ul><li>Un nuevo <b>ethertype</b>, distinto al del Type/Len, con el valor <b>0x8100</b>: indica que lo que sigue es una etiqueta. Al eliminarla vuelve a estar el Type/Len original.</li><li><b>PRI</b>: lo usa otro protocolo, <b>802.1p</b>, para darle <b>prioridad</b> a una trama sobre otra y así mejorar la calidad de servicio.</li><li><b>VLAN-ID</b>: el número de VLAN. Con 12 bits permite <b>4096</b> combinaciones.</li></ul>',
      key: 'Lo que distingue una VLAN de otra en el trunk son solo los 12 bits del VLAN-ID.',
      fig: 'image32.png', scene: 'tag', hi: ['tag', 'tpid', 'pri', 'vid'], zoom: 1,
      det: '2 bytes de ethertype + 3 bits de PRI + 1 bit de flag + 12 bits de VLAN-ID = <b>32 bits</b>. 2¹² = <b>4096</b> VLANs posibles (0 a 4095).'
    },
    {
      s: 'Router y VMs', k: 'ejemplo', t: 'Un trunk hacia el router o un servidor',
      b: '<p>Cada cliente del switch quiere salir a Internet. Con un puerto por VLAN, para 100 VLANs harían falta un router de <b>100 interfaces y 100 cables</b>.</p><p>La otra alternativa: <b>un puerto 802.1Q</b> conectado al router. Por ese único puerto físico llegan las tramas de todas las VLANs, cada una con su etiqueta, y el router etiqueta las que devuelve.</p><p>Sirve para cualquier equipo que necesite esa separación, por ejemplo un servidor de <b>máquinas virtuales</b> donde cada VLAN tiene su conjunto de VMs.</p>',
      key: 'Un puerto 802.1Q alcanza para extender VLANs o darles un recurso, sin gastar un puerto por VLAN.',
      scene: 'serv', hi: ['R', 'VM'], tags: { R: 'una interfaz, N VLANs', VM: 'VMs en cada VLAN' },
      pk: [{ p: ['A', 'SW'], l: 'trama', t: 0, d: 1 }, { p: ['SW', 'R'], l: 'tag 10', c: 'key', t: 1.1, d: 1.2 }, { p: ['R', 'NET'], c: 'req', t: 2.4, d: .8 },
        { p: ['B', 'SW'], l: 'trama', c: 'res', t: 2.6, d: 1 }, { p: ['SW', 'VM'], l: 'tag 20', c: 'key', t: 3.7, d: 1.2, stay: 1 }],
      notes: [{ x: 215, y: 40, w: 255, c: 'yellow', text: 'Con un trunk, 100 VLANs entran por <b>un solo puerto</b> del router.' }],
      st: { pto: '1 trunk por equipo', tr: 'tramas con tag' }
    },
    {
      s: 'Capacidad', k: 'problema', t: 'El cable compartido es un cuello de botella',
      b: '<p>En un switch cada estación tiene <b>su propio cable</b> full-duplex de 10 Mbps. Pero el cable que une dos switches lo usan <b>todas</b>: la capacidad ya no es para una sola, es para todas.</p><p>Siempre que aparece un recurso compartido la capacidad tiende a ser menor. El tráfico queda <b>desbalanceado</b>.</p><p>¿Y si agregamos un <b>segundo cable</b> entre los switches? No se puede así nomás: forma un <b>loop</b>, y Spanning Tree bloquea uno de los dos puertos.</p>',
      key: 'Sumar un cable en paralelo no suma capacidad: STP lo deja bloqueado.',
      fig: ['image33.png', 'image34.png'], scene: 'agg', hide: ['zL'], x: ['c2'], hi: ['c1'], tags: { S1: 'todo por un cable' },
      ll: { c1: '10 Mbps para todas', c2: 'STP lo bloquea' },
      pk: [{ p: ['L1', 'S1', 'S2', 'R1'], c: 'req', t: 0, d: 2.2 }, { p: ['L2', 'S1', 'S2', 'R2'], c: 'res', t: .5, d: 2.2 }, { p: ['L3', 'S1', 'S2', 'R3'], c: 'data', t: 1, d: 2.2 }],
      st: { pto: '1 cable útil', tr: 'el tráfico de todas' }
    },
    {
      s: 'LACP', k: 'idea', t: 'LACP: varios puertos, un solo puerto lógico',
      b: '<p><b>LACP</b> (Link Aggregation Control Protocol) le indica al switch que considere esos puertos como <b>un único puerto lógico</b>. Si para el switch es un solo enlace, <b>no hay loop</b>.</p><p>Permite tomar distintos puertos, <b>hasta 8</b>, y armar un grupo que se ve como un solo puerto.</p><p>Así se evita el cuello de botella de pasar todo por un cable y <b>aumenta la capacidad</b>. También sirve para 802.1Q: con varios puertos se arma un gran trunk.</p>',
      key: 'Físicamente son varios cables; lógicamente, uno solo. Por eso Spanning Tree no bloquea nada.',
      fig: 'image35.png', scene: 'agg', hi: ['zL', 'c1', 'c2'],
      pk: [{ p: ['L1', 'S1', 'S2', 'R1'], c: 'req', t: 0, d: 2.2 }, { p: ['L2', 'S1', [400, 240], 'S2', 'R2'], c: 'res', t: .2, d: 2.2 }, { p: ['L3', 'S1', 'S2', 'R3'], c: 'data', t: 1.2, d: 2.2 }, { p: ['R1', 'S2', [400, 240], 'S1', 'L1'], c: 'req', t: 1.6, d: 2.2 }],
      notes: [{ x: 240, y: 330, w: 320, c: 'purple', text: 'Grupo LACP: <b>hasta 8 puertos</b> que el switch trata como <b>uno solo</b>. Suma capacidad sin formar un loop.' }],
      st: { pto: 'LACP: hasta 8 en 1 lógico', tr: 'tráfico repartido' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'VLANs en una mirada',
      b: '<ul><li><b>VLAN</b>: puertos de un switch agrupados como si fueran un switch aparte. Un dominio de broadcast por VLAN.</li><li>Para comunicar VLANs hace falta un <b>router</b>.</li><li><b>Trunk 802.1Q</b>: un puerto que lleva todas las VLANs; etiqueta al entrar y quita la etiqueta al salir.</li><li><b>Tag</b> de 4 bytes entre SA y Type/Len: ethertype 0x8100, PRI (802.1p) y VLAN-ID (4096 valores).</li><li><b>LACP</b>: hasta 8 puertos como uno lógico, más capacidad y sin loop.</li></ul><p>Con esto cerramos las LAN cableadas. En la próxima unidad el medio compartido es el aire: <b>Wireless LAN</b> y 802.11.</p>',
      scene: 'tag', zoom: 1,
      det: 'La trama que viaja por un trunk: la de siempre, más <b>4 bytes</b> que dicen a qué VLAN pertenece.',
      st: { bc: 'Uno por VLAN', pto: 'Trunk 802.1Q (+ LACP)', tr: 'tramas con tag' }
    }
  ],
  quiz: [
    { q: 'Una estación de la VLAN 10 envía un broadcast. ¿A quién le llega?', o: ['Solo a los puertos asociados a la VLAN 10', 'A todas las estaciones del switch', 'Solo al router', 'A ninguna: las VLANs bloquean los broadcast'], a: 0, why: 'Cada VLAN es su propio dominio de broadcast: el mensaje se copia en los puertos de la misma VLAN y no llega a las otras.' },
    { q: '¿Qué se necesita para que una estación de una VLAN se comunique con una de otra VLAN?', o: ['Un hub entre los dos puertos', 'Un dispositivo de capa de red: un router', 'Nada, el switch las conecta solo', 'Activar LACP'], a: 1, why: 'Las VLANs aíslan las redes; el paso de una a otra lo hace un router, que analiza la trama y la envía a la otra red.' },
    { q: '¿Dónde se inserta el tag 802.1Q y cuánto mide?', o: ['Antes del preámbulo, 2 bytes', 'Entre la dirección de origen y el Type/Len, 4 bytes', 'Después del FCS, 4 bytes', 'Reemplaza a la dirección de destino, 6 bytes'], a: 1, why: 'El tag de 4 bytes (ethertype 0x8100, PRI y VLAN-ID) se intercala entre SA y Type/Len, y se elimina al salir del trunk.' },
    { q: 'Se conectan dos cables entre los mismos dos switches. ¿Qué logra LACP?', o: ['Que cada cable lleve una VLAN distinta', 'Que Spanning Tree bloquee uno de los dos', 'Que el switch los vea como un único puerto lógico: suma capacidad y no hay loop', 'Que las tramas viajen sin tag'], a: 2, why: 'LACP agrupa hasta 8 puertos en un puerto lógico; al verse como un solo enlace no se forma un loop y se evita el cuello de botella.' }
  ],
  cheat: [
    ['VLAN', 'LAN virtual: puertos de un switch asociados a una misma red. Cada VLAN es un <b>dominio de broadcast</b> aislado.'],
    ['Entre VLANs', 'Hace falta un dispositivo de <b>capa de red</b> (router) para pasar de una a otra.'],
    ['Trunk 802.1Q', 'Puerto que no pertenece a ninguna VLAN y las transporta a todas: <b>etiqueta</b> la trama al entrar y la <b>quita</b> al salir.'],
    ['Tag', '4 bytes entre SA y Type/Len: ethertype <code>0x8100</code> + PRI + VLAN-ID.'],
    ['VLAN-ID', '12 bits → <b>4096</b> VLANs posibles.'],
    ['PRI / 802.1p', 'Prioridad de la trama: permite que una sea más urgente que otra (calidad de servicio).'],
    ['Capacidad', 'Un enlace compartido (trunk, uplink) reparte su capacidad entre todas las estaciones que lo usan.'],
    ['LACP', 'Link Aggregation Control Protocol: hasta <b>8 puertos</b> como un único puerto lógico. Más capacidad, sin loop; sirve también para trunks.']
  ]
});

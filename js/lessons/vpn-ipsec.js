COURSE.add({
  id: 'vpn-ipsec',
  title: 'VPN e IPSec',
  desc: 'Cómo unir dos redes privadas a través de Internet como si hubiera un enlace dedicado: túneles, los modos de IPSec, AH y ESP, y la configuración en dos fases.',
  min: 11, level: 'Avanzado',
  learn: [
    'Qué es una VPN, sus dos modalidades y los protocolos que se usan en cada capa',
    'La diferencia entre IPSec en modo transporte y en modo túnel',
    'Qué garantiza AH y qué agrega ESP',
    'Cómo se configura un túnel: fase 1 (IKE) y fase 2 (IPSec policy)',
    'Cómo una access list decide qué tráfico entra al túnel'
  ],
  stats: [{ k: 'mod', l: 'Modo IPSec' }, { k: 'prot', l: 'Protección' }, { k: 've', l: 'En Internet se ve' }],
  legend: [['req', 'paquete original'], ['key', 'encriptado (túnel)'], ['ctl', 'negociación IKE'], ['bad', 'no puede cruzar']],
  scenes: {
    vpn: {
      kind: 'topo',
      zones: [
        { id: 'zl', x: 24, y: 128, w: 262, h: 170, l: 'Casa central · 192.168.1.0/24', c: 'green' },
        { id: 'zr', x: 514, y: 128, w: 262, h: 170, l: 'Sucursal · 192.168.2.0/24', c: 'blue' }
      ],
      nodes: [
        { id: 'A', t: 'pc', x: 85, y: 215, l: 'A', sub: '192.168.1.100' },
        { id: 'H', t: 'router', x: 225, y: 215, l: 'Router H', sub: 'IP pública' },
        { id: 'NET', t: 'cloud', x: 400, y: 215, l: 'Internet' },
        { id: 'Y', t: 'router', x: 575, y: 215, l: 'Router Y', sub: 'IP pública' },
        { id: 'B', t: 'pc', x: 715, y: 215, l: 'B', sub: '192.168.2.15' },
        { id: 'U', t: 'user', x: 400, y: 345, l: 'Usuario remoto' }
      ],
      links: [
        { a: 'A', b: 'H' }, { a: 'H', b: 'NET' }, { a: 'NET', b: 'Y' }, { a: 'Y', b: 'B' },
        { a: 'H', b: 'Y', id: 'tun', curve: -120, thick: 1, c: 'green', l: 'túnel', ly: -12 },
        { a: 'U', b: 'NET', dash: 1 }
      ]
    },
    modos: {
      kind: 'fields', title: 'Qué hace IPSec con el datagrama', rh: 60,
      rows: [
        [{ id: 'l0', l: 'Datagrama\noriginal', w: 5, c: 'white' }, { id: 'oip', l: 'Cabecera IP', s: 'origen Z · destino T', w: 7, c: 'gray' }, { id: 'opl', l: 'PDU de transporte', s: 'TCP / UDP + datos', w: 18, c: 'blue' }],
        [{ id: 'l1', l: 'Modo\ntransporte', w: 5, c: 'white' }, { id: 'tip', l: 'Cabecera IP', s: 'origen Z · destino T', w: 7, c: 'gray' }, { id: 'th', l: 'IPSec-H', w: 3.5, c: 'yellow' }, { id: 'tpl', l: 'PDU de transporte', s: 'encriptada', w: 11, c: 'green' }, { id: 'tt', l: 'IPSec-T', w: 3.5, c: 'yellow' }],
        [{ id: 'l2', l: 'Modo\ntúnel', w: 5, c: 'white' }, { id: 'nip', l: 'Nueva cab. IP', s: 'gateway → gateway', w: 6, c: 'orange' }, { id: 'uh', l: 'IPSec-H', w: 3.5, c: 'yellow' }, { id: 'uip', l: 'Cabecera IP', s: 'Z → T', w: 4.5, c: 'green' }, { id: 'upl', l: 'PDU de transporte', s: 'encriptada', w: 7.5, c: 'green' }, { id: 'ut', l: 'IPSec-T', w: 3.5, c: 'yellow' }]
      ]
    },
    ahesp: {
      kind: 'fields', title: 'AH y ESP sobre el mismo datagrama', rh: 60,
      rows: [
        [{ id: 'la', l: 'AH', w: 3, c: 'white' }, { id: 'aip', l: 'Cabecera IP', w: 5, c: 'gray' }, { id: 'ah', l: 'AH', s: 'lleva el digesto', w: 5.5, c: 'yellow' }, { id: 'apl', l: 'Payload de transporte', s: 'viaja en claro', w: 12, c: 'blue' }, { id: 'apad', l: 'Padding', w: 3.5, c: 'gray' }],
        [{ id: 'le', l: 'ESP', w: 3, c: 'white' }, { id: 'eip', l: 'Cabecera IP', w: 5, c: 'gray' }, { id: 'eh', l: 'ESP header', w: 4.5, c: 'yellow' }, { id: 'epl', l: 'Payload de transporte', s: 'encriptado', w: 9, c: 'green' }, { id: 'et', l: 'ESP trailer', s: 'encriptado', w: 4.5, c: 'green' }, { id: 'ead', l: 'Auth data', s: 'digesto', w: 4, c: 'orange' }]
      ]
    },
    ace: {
      kind: 'fields', title: 'La access list: un descriptor de tráfico', rh: 54,
      rows: [[
        { id: 'c1', l: 'access-list 102', w: 7.5, c: 'gray' }, { id: 'p1', l: 'permit', w: 3.5, c: 'green' }, { id: 'i1', l: 'ip', w: 2, c: 'gray' },
        { id: 's1', l: '192.168.1.0', s: 'red local', w: 6, c: 'blue' }, { id: 'w1', l: '0.0.0.255', s: 'wildcard', w: 5, c: 'yellow' },
        { id: 'd1', l: '192.168.2.0', s: 'red remota', w: 6, c: 'purple' }, { id: 'x1', l: '0.0.0.255', s: 'wildcard', w: 5, c: 'yellow' }
      ]]
    }
  },
  steps: [
    {
      s: 'VPN', k: 'contexto', t: 'Una red privada que no es real',
      b: '<p>En una red privada real hay un <b>enlace dedicado</b> entre dos puntos: nadie más ve lo que pasa por ahí. Pero es costoso, porque el proveedor reserva recursos físicos de manera exclusiva.</p><p>Una <b>VPN</b> (red privada virtual) logra lo mismo de forma virtual: sobre una <b>red pública</b> (Internet) se establece un <b>túnel</b>, un circuito virtual por el que la información viaja <b>segura y encriptada</b>, como si fuera una red privada.</p>',
      key: 'VPN = mi red privada, armada de manera virtual sobre una red pública.',
      fig: 'image100.png', scene: 'vpn', show: ['zl', 'zr', 'A', 'H', 'NET', 'Y', 'B'], hi: ['tun'],
      pk: [{ p: ['A', 'H'], l: 'datos', d: .9 }, { p: ['H', 'Y'], l: 'encriptado', c: 'key', d: 1.8 }, { p: ['Y', 'B'], l: 'datos', d: .9 }],
      st: { mod: '—', prot: '—', ve: 'tráfico encriptado' }
    },
    {
      s: 'Modalidades', k: 'detalle', t: 'Dos modalidades y cuatro protocolos',
      b: '<ul><li><b>Acceso remoto</b>: un usuario se conecta a su oficina y usa los recursos centrales como si estuviera en esa red. Suele ser un software que se conecta al gateway del túnel (una IP pública); es una solución propietaria.</li><li><b>Site to site</b> (LAN to LAN): dos redes quedan unidas como por un circuito real, que en realidad es virtual.</li></ul><p>Los protocolos se distinguen por la <b>capa</b> en la que trabajan; <b>IPSec</b> es el estándar actual.</p>',
      scene: 'vpn', add: ['U'], hi: ['U', 'tun'], tags: { U: 'acceso remoto' }, ll: { tun: 'site to site' },
      pk: [{ p: ['U', 'NET', 'H', 'A'], l: 'encriptado', c: 'key', d: 2.6 }, { p: ['B', 'Y'], l: 'datos', d: .8, t: .4 }, { p: ['Y', 'H'], l: 'encriptado', c: 'key', d: 1.8 }],
      tbl: { x: 24, y: 318, w: 300, cols: ['Protocolo', 'Capa', 'Detalle'], rows: [['PPTP', '2', 'Microsoft · sin encriptación'], ['L2TP', '2', 'Cisco + MS · con IPSec (ESP)'], ['IPSec', '3', 'el estándar actual'], ['SSL', '4', 'sin cliente de software']], hi: 2 }
    },
    {
      s: 'Transporte', k: 'mecanismo', t: 'IPSec en modo transporte',
      b: '<p><b>IPSec</b> es una suite de protocolos y opciones de configuración. Se diseñó para proteger las comunicaciones en IPv6 y luego se portó a IPv4, donde más se usa. Ofrece dos modos.</p><p>En <b>modo transporte</b> toma la <b>PDU de la capa de transporte</b> y la encripta cuando llega a la capa de red. Un host la encripta y el otro la desencripta.</p><p>Protege la comunicación <b>entre dos hosts</b>: la cabecera IP sigue mostrando quiénes dialogan.</p>',
      fig: 'image101.png', scene: 'modos', hi: ['l0', 'oip', 'opl', 'l1', 'tip', 'th', 'tpl', 'tt'],
      det: '<b>Modo transporte</b>: lo único que se encripta es la PDU de transporte, envuelta entre una cabecera y una cola de IPSec. La cabecera IP original queda adelante, a la vista, con las direcciones de los dos hosts.',
      st: { mod: 'Transporte', ve: 'las IP de los hosts' }
    },
    {
      s: 'Túnel', k: 'mecanismo', t: 'IPSec en modo túnel',
      b: '<p>En <b>modo túnel</b> no dialogan los hosts sino dos <b>gateways</b>, que encriptan todo el tráfico que va de un lado al otro.</p><p>Un datagrama con origen Z y destino T se <b>encripta por completo, incluida su cabecera</b>, y se <b>encapsula dentro de otro datagrama IP</b> que lleva las direcciones de los gateways.</p><p>Quien mire el tráfico en Internet ve el diálogo entre los gateways, no entre los hosts que participan.</p>',
      key: 'Modo túnel: un datagrama IP encriptado, encapsulado dentro de otro y enviado.',
      fig: 'image101.png', scene: 'modos', hi: ['l0', 'oip', 'opl', 'l2', 'nip', 'uh', 'uip', 'upl', 'ut'],
      det: '<b>Modo túnel</b>: el datagrama original completo (cabecera IP con Z y T + PDU de transporte) pasa a ser la carga encriptada. Adelante va una <b>cabecera IP nueva</b>, con origen y destino en los gateways de cada extremo.',
      st: { mod: 'Túnel', ve: 'las IP de los gateways' }
    },
    {
      s: 'AH y ESP', k: 'comparación', t: 'Dos protocolos: AH y ESP',
      b: '<p>IPSec tiene dos variantes de protocolo:</p><ul><li><b>AH</b> (Authentication Header): garantiza que el mensaje viene de quien dice ser y que <b>no fue alterado</b>. Pero <b>no encripta</b>: no hay confidencialidad.</li><li><b>ESP</b>: además de autenticidad e integridad, garantiza la <b>confidencialidad</b>, porque encripta los datos.</li></ul>',
      key: 'AH = autenticidad + integridad. ESP = eso mismo + confidencialidad.',
      fig: ['image102.png', 'image103.png'], scene: 'ahesp',
      det: 'En <b>AH</b> el digesto de autenticación va dentro de la propia cabecera AH y el payload queda legible. En <b>ESP</b> se encriptan el payload y el trailer; la autenticación cubre desde el ESP header hasta el trailer, y el digesto viaja al final.',
      st: { mod: '—', prot: 'AH: no encripta · ESP: sí', ve: '—' }
    },
    {
      s: 'El problema', k: 'problema', t: 'Dos LAN privadas separadas por Internet',
      b: '<p>Tenemos la LAN <b>192.168.1.0</b> y la sucursal <b>192.168.2.0</b>. Los routers H e Y salen a Internet con una <b>IP pública</b>.</p><p>La comunicación directa es imposible: en Internet las <b>direcciones privadas no son válidas</b>.</p><p>Tampoco sirve apuntar a la IP pública del router: es una relación <b>de uno a muchos</b> (todas las estaciones salen por esa única dirección), así que no se puede llegar específicamente de 192.168.1.100 a 192.168.2.15.</p>',
      key: 'El túnel es lo más parecido a un vínculo directo entre los dos routers.',
      fig: 'image104.png', scene: 'vpn', show: ['zl', 'zr', 'A', 'H', 'NET', 'Y', 'B'], hide: ['tun'], hi: ['A', 'B'], tags: { NET: 'no rutea 192.168.x.x' },
      pk: [{ p: ['A', 'H'], l: 'a 192.168.2.15', d: 1 }, { p: ['H', 'NET'], l: 'a 192.168.2.15', c: 'bad', d: 1.2, drop: 1, dropAt: .8 }],
      notes: [{ x: 250, y: 318, w: 300, c: 'yellow', text: 'Las direcciones <b>192.168.x.x</b> son privadas: sirven dentro de cada LAN, pero ningún router de Internet sabe llegar a ellas.' }],
      st: { mod: '—', prot: '—', ve: 'solo IP públicas' }
    },
    {
      s: 'Fase 1', k: 'mecanismo', t: 'Fase 1: IKE policy',
      b: '<p>A cada router hay que decirle <b>dónde termina el túnel</b> (el <b>peer</b>) y acordar parámetros <b>idénticos en ambos lados</b>:</p><ul><li>Un protocolo de <b>encriptación</b> (3DES).</li><li>Un método de <b>hashing</b> para la integridad (SHA).</li><li>Una <b>pre-shared key</b> (PSK): la misma clave privada en los dos extremos. También se pueden usar certificados.</li></ul><p>Esta configuración inicial es la <b>IKE</b> (Internet Key Exchange) policy, el protocolo estándar para el intercambio de claves.</p>',
      scene: 'vpn', show: ['zl', 'zr', 'A', 'H', 'NET', 'Y', 'B'], hi: ['H', 'Y'], dim: ['A', 'B'], tags: { H: 'se configura acá', Y: 'peer 192.168.3.1' }, ll: { tun: 'túnel por levantar' },
      pk: [{ p: ['H', 'NET', 'Y'], l: 'ISAKMP', c: 'ctl', d: 1.7 }, { p: ['Y', 'NET', 'H'], l: 'ISAKMP', c: 'ctl', d: 1.7 }],
      notes: [{ x: 205, y: 312, w: 390, c: 'white', text: '<code>crypto isakmp policy 1</code><br><code>&nbsp;&nbsp;authentication pre-share</code><br><code>&nbsp;&nbsp;hash sha</code><br><code>&nbsp;&nbsp;encryption 3des</code><br><code>crypto isakmp key "clave_privada" address 192.168.3.1</code>' }],
      st: { mod: 'Túnel', prot: 'IKE: 3DES · SHA · PSK', ve: 'las IP de los gateways' }
    },
    {
      s: 'Fase 2', k: 'mecanismo', t: 'Fase 2: IPSec policy',
      b: '<p>La fase 2 describe <b>qué va por dentro del túnel</b>:</p><ul><li><b>transform-set</b>: algoritmo de encriptación y de hash (igual en ambos lados).</li><li><b>access-list</b>: el descriptor de tráfico. El <b>wildcard</b> de Cisco es la inversa de la máscara: 255.255.255.0 → 0.0.0.255.</li><li><b>crypto map</b>: une el peer, la access list y el transform-set; puede haber varios túneles.</li></ul><p>Por último, el crypto map se <b>aplica a la interfaz</b> que sale a Internet.</p>',
      fig: 'image106.png', scene: 'ace',
      det: '<code>crypto ipsec transform-set ESP-3DES-SHA esp-3des esp-sha-hmac</code><br><code>access-list 102 permit ip 192.168.1.0 0.0.0.255 192.168.2.0 0.0.0.255</code><br><code>crypto map IPSEC 20 ipsec-isakmp</code><br><code>&nbsp;&nbsp;set peer 192.168.3.1</code><br><code>&nbsp;&nbsp;match address 102</code><br><code>&nbsp;&nbsp;set transform-set ESP-3DES-SHA</code><br><code>interface fastEthernet 0/0</code><br><code>&nbsp;&nbsp;crypto map IPSEC</code>',
      st: { prot: 'ESP · 3DES · SHA' }
    },
    {
      s: 'El viaje', k: 'ejemplo', t: 'Un paquete cruza el túnel',
      b: '<p>A le envía a 192.168.2.15 y el paquete va a su <b>default gateway</b>. Al cruzar la interfaz de salida se encuentra con el <b>crypto map</b> y su access list.</p><p>Las entradas (ACE) se <b>evalúan en orden</b>: cuando una coincide, el paquete se acepta, <b>se encripta y se envía</b> por el túnel.</p><p>Si no coincide con ninguna cae en el <b>deny any any</b> implícito del final y no entra al túnel. El otro router tiene la misma ACL con local y remoto <b>invertidos</b>.</p>',
      key: 'En una ACL, todo lo que no está explícitamente permitido está prohibido.',
      fig: 'image107.png', scene: 'vpn', show: ['zl', 'zr', 'A', 'H', 'NET', 'Y', 'B'], hi: ['H', 'tun'], tags: { H: 'coincide con la ACE 1', Y: 'desencripta' },
      pk: [{ p: ['A', 'H'], l: 'a 192.168.2.15', d: 1 }, { p: ['H', 'Y'], l: 'ESP encriptado', c: 'key', d: 1.9 }, { p: ['Y', 'B'], l: 'a 192.168.2.15', d: 1, stay: 1 }],
      tbl: { x: 196, y: 318, w: 408, title: 'access-list 102 · se evalúa en orden', rows: [['1', 'permit ip 192.168.1.0 0.0.0.255 192.168.2.0 0.0.0.255'], ['2', 'permit ip 192.168.3.0 0.0.0.255 192.168.2.0 0.0.0.255'], ['fin', 'deny any any (implícito): no entra al túnel']], hi: 0 },
      st: { mod: 'Túnel', prot: 'ESP · 3DES · SHA', ve: 'las IP de los gateways' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'VPN e IPSec en una mirada',
      b: '<ul><li><b>VPN</b>: un túnel sobre una red pública en lugar de un enlace dedicado.</li><li>Modalidades: <b>acceso remoto</b> y <b>site to site</b>.</li><li>IPSec <b>transporte</b> (host a host) o <b>túnel</b> (entre gateways, con el datagrama completo encapsulado).</li><li><b>AH</b> no encripta; <b>ESP</b> sí.</li><li><b>Fase 1</b> (IKE): encriptación, hash, PSK y peer. <b>Fase 2</b>: transform-set, access list y crypto map.</li></ul><p>Hasta acá trabajamos en la capa de red. En la próxima lección subimos a la capa de transporte: <b>TCP</b>.</p>',
      scene: 'vpn', hi: ['tun'], tags: { H: 'encripta / desencripta', Y: 'encripta / desencripta' },
      pk: [{ p: ['A', 'H'], l: 'datos', d: .8 }, { p: ['H', 'Y'], l: 'encriptado', c: 'key', d: 1.5 }, { p: ['Y', 'B'], l: 'datos', d: .8 }, { p: ['B', 'Y'], l: 'respuesta', c: 'res', d: .8 }, { p: ['Y', 'H'], l: 'encriptado', c: 'key', d: 1.5 }, { p: ['H', 'A'], l: 'respuesta', c: 'res', d: .8 }]
    }
  ],
  quiz: [
    { q: 'En IPSec modo túnel, ¿qué direcciones IP ve alguien que observa el tráfico en Internet?', o: ['Las de los dos hosts que se comunican', 'Las de los gateways de cada extremo del túnel', 'Ninguna: la cabecera IP exterior también va encriptada', 'Las direcciones privadas de cada LAN'], a: 1, why: 'El datagrama original se encripta completo y se encapsula en otro cuya cabecera lleva las IP de los gateways.' },
    { q: '¿Cuál es la diferencia entre AH y ESP?', o: ['AH encripta y ESP solo autentica', 'AH trabaja en capa 2 y ESP en capa 3', 'Los dos dan autenticidad e integridad, pero solo ESP encripta', 'AH se usa en modo túnel y ESP en modo transporte'], a: 2, why: 'AH garantiza origen e integridad pero no confidencialidad; ESP agrega la encriptación de los datos.' },
    { q: 'En una access list de Cisco, ¿qué wildcard corresponde a la máscara 255.255.255.0?', o: ['255.255.255.0', '0.0.0.255', '0.0.0.0', '255.0.0.0'], a: 1, why: 'El wildcard es la inversa de la máscara: 255.255.255.0 → 0.0.0.255.' },
    { q: 'Un paquete llega a la interfaz con el crypto map y no coincide con ninguna entrada de la access list. ¿Qué pasa?', o: ['Se encripta igual, por las dudas', 'Cae en el deny any any implícito y no entra al túnel', 'El router le pregunta al peer qué hacer', 'Se evalúa de nuevo la primera entrada'], a: 1, why: 'Toda ACL termina con un deny any any implícito: lo que no está explícitamente permitido queda afuera del túnel.' }
  ],
  cheat: [
    ['VPN', 'Red privada virtual: un <b>túnel</b> seguro y encriptado sobre una red pública, en lugar de un enlace dedicado.'],
    ['Modalidades', '<b>Acceso remoto</b> (un usuario contra su oficina) y <b>site to site</b> (dos redes unidas).'],
    ['Protocolos', 'PPTP y L2TP (capa 2), <b>IPSec</b> (capa 3, el estándar), SSL (capa 4, sin cliente).'],
    ['Modo transporte', 'Se encripta la PDU de transporte; cabecera IP original a la vista. Host a host.'],
    ['Modo túnel', 'Datagrama completo encriptado y encapsulado en otro con las IP de los gateways.'],
    ['AH / ESP', '<b>AH</b>: autenticidad e integridad, no encripta. <b>ESP</b>: además confidencialidad.'],
    ['Fase 1 · IKE', '<code>crypto isakmp policy</code>: encriptación, hash, pre-shared key y peer, iguales en ambos lados.'],
    ['Fase 2 · IPSec', 'transform-set + access list + crypto map aplicado a la interfaz. ACL: wildcard = máscara inversa, entradas en orden, <code>deny any any</code> implícito.']
  ]
});

COURSE.add({
  id: 'tcp-congestion',
  title: 'TCP: control de congestión',
  desc: 'Qué pasa cuando la red del medio no da abasto, y cómo TCP regula cuánto envía: ventana de congestión, slow start, fast retransmit y fast recovery.',
  min: 11, level: 'Avanzado',
  learn: [
    'Por qué la sobresuscripción de un enlace termina en congestión, y por qué retransmitir la empeora',
    'Cómo se calcula la ventana permitida a partir de la ventana de congestión y el crédito',
    'Cómo crece y cómo se reinicia la ventana en slow start',
    'Qué es la global synchronization',
    'Qué mejoran fast retransmit y fast recovery'
  ],
  stats: [{ k: 'cwnd', l: 'Ventana de congestión' }, { k: 'perm', l: 'Ventana permitida' }, { k: 'ev', l: 'Ante una pérdida' }],
  legend: [['req', 'segmento'], ['res', 'ACK'], ['ctl', 'ACK duplicado'], ['key', 'retransmisión'], ['bad', 'descartado / perdido']],
  scenes: {
    red: {
      kind: 'topo',
      nodes: [
        { id: 'U1', t: 'pc', x: 100, y: 90, l: 'Cliente 1' }, { id: 'U2', t: 'pc', x: 100, y: 205, l: 'Cliente 2' },
        { id: 'dots', t: 'txt', x: 100, y: 278, l: '· · ·', big: 1 },
        { id: 'U3', t: 'pc', x: 100, y: 330, l: 'Cliente 500' },
        { id: 'R', t: 'router', x: 380, y: 205, l: 'Router' }, { id: 'NET', t: 'cloud', x: 690, y: 205, l: 'Internet' },
        { id: 'BUF', t: 'box', x: 380, y: 330, w: 150, h: 44, l: 'buffer de salida', sub: 'se llena y desborda', c: 'red' }
      ],
      links: [
        { a: 'U1', b: 'R', l: '1 Mb' }, { a: 'U2', b: 'R', l: '1 Mb', ly: -4 }, { a: 'U3', b: 'R', l: '1 Mb' },
        { a: 'R', b: 'NET', l: 'enlace de 100 Mb', thick: 1, ly: -14 }, { a: 'R', b: 'BUF', dash: 1 }
      ]
    },
    efic: { kind: 'chart', xl: 'tráfico que generan los usuarios, en decenas de Mb (curva ilustrativa)', yl: 'utilización del enlace (%)' },
    perm: { kind: 'stack', unit: 'seg.' },
    ss: {
      kind: 'seq',
      actors: [{ id: 'E', l: 'Emisor', t: 'pc' }, { id: 'R', l: 'Receptor', t: 'server' }],
      msgs: [
        { at: 'E', note: 'cwnd = 1' },
        { f: 'E', to: 'R', l: 'segmento 1', c: 'req' },
        { f: 'R', to: 'E', l: 'ACK', c: 'res' },
        { at: 'E', note: 'cwnd = 2 (+1 por cada ACK)' },
        { f: 'E', to: 'R', l: 'segmentos 2 y 3', c: 'req' },
        { f: 'R', to: 'E', l: '2 ACK', c: 'res' },
        { at: 'E', note: 'cwnd = 4' },
        { f: 'E', to: 'R', l: 'segmentos 4, 5, 6 y 7', c: 'req' },
        { f: 'R', to: 'E', l: '4 ACK', c: 'res' },
        { at: 'E', note: 'cwnd = 8' }
      ]
    },
    cw: { kind: 'chart', xl: 'rondas de envío', yl: 'ventana de congestión (segmentos)' },
    gs: { kind: 'chart', xl: 'tiempo (rondas de envío)', yl: 'tráfico total sobre el enlace (% de su capacidad)' },
    fr: {
      kind: 'seq',
      actors: [{ id: 'E', l: 'Emisor', t: 'pc' }, { id: 'R', l: 'Receptor', t: 'server' }],
      msgs: [
        { f: 'E', to: 'R', l: 'segmento 1', c: 'req' },
        { f: 'E', to: 'R', l: 'segmento 2', c: 'bad', lost: 1 },
        { f: 'R', to: 'E', l: 'ACK: espero el 2', c: 'res' },
        { f: 'E', to: 'R', l: 'segmentos 3, 4 y 5 (llegan bien)', c: 'req' },
        { f: 'R', to: 'E', l: 'ACK duplicado 1: espero el 2', c: 'ctl' },
        { f: 'R', to: 'E', l: 'ACK duplicado 2: espero el 2', c: 'ctl' },
        { f: 'R', to: 'E', l: 'ACK duplicado 3: espero el 2', c: 'ctl' },
        { at: 'E', note: '3 ACK duplicados: no espera el RTO', c: 'yellow' },
        { f: 'E', to: 'R', l: 'retransmite el segmento 2', c: 'key' },
        { f: 'R', to: 'E', l: 'ACK: espero el 6', c: 'res' }
      ]
    }
  },
  steps: [
    {
      s: 'Escenario', k: 'contexto', t: 'Muchos accesos, un solo enlace',
      b: '<p>Un router recibe a muchos clientes y los saca a Internet por un único enlace. Cada usuario tiene su ancho de banda de acceso, y la suma de todos es <b>muy superior</b> a la del enlace: hay una <b>sobresuscripción</b> del servicio.</p><p>Por ejemplo: 500 clientes de 1 Mb suman 500 Mb, contra un enlace de <b>100 Mb</b>. Mientras no transmitan todos a la vez, alcanza. Si todos se ponen a enviar al mismo tiempo, generan sobre el enlace una carga superior a su capacidad.</p>',
      key: 'El control de flujo cuida al receptor. Acá el que no da abasto es un router en el medio del camino.',
      fig: 'image127.png', scene: 'red', hide: ['BUF'], hi: ['R-NET'], tags: { R: 'entran 500 Mb · salen 100' },
      pk: [{ p: ['U1', 'R', 'NET'], l: 'segmento', d: 1.8 }, { p: ['U2', 'R', 'NET'], l: 'segmento', d: 1.8, t: .3 }, { p: ['U3', 'R', 'NET'], l: 'segmento', d: 1.8, t: .6 }],
      st: { cwnd: '—', perm: '—', ev: '—' }
    },
    {
      s: 'Congestión', k: 'problema', t: 'Buffers llenos, descartes y más tráfico',
      b: '<p>Como no puede cursar todo lo que recibe, el router empieza a llenar los <b>buffers de salida</b> del enlace. Si esa intensidad se sostiene, el buffer se desborda y el router <b>descarta paquetes</b>: es el <b>estado de congestión</b>.</p><p>Para el cliente, un segmento descartado es una confirmación que no llega: lo <b>retransmite</b>. Esa retransmisión se suma al tráfico que ya había, y la carga sobre el enlace crece todavía más.</p>',
      key: 'La congestión se realimenta: descartar genera retransmisiones, y las retransmisiones generan más descartes. Todos pierden.',
      scene: 'red', hi: ['BUF'], tags: { R: 'no da abasto' },
      pk: [
        { p: ['U1', 'R', 'NET'], l: 'segmento', c: 'req', d: 1.6 },
        { p: ['U2', 'R'], l: 'segmento', c: 'bad', d: 1.1, par: 1, drop: 1 },
        { p: ['U3', 'R'], l: 'segmento', c: 'bad', d: 1.1, par: 1, drop: 1 },
        { p: ['U2', 'R', 'NET'], l: 'retransmisión', c: 'key', d: 1.8 },
        { p: ['U3', 'R'], l: 'retransmisión', c: 'bad', d: 1.1, par: 1, drop: 1 }
      ],
      notes: [{ x: 520, y: 290, w: 240, c: 'yellow', text: 'Cada segmento descartado vuelve a entrar como <b>retransmisión</b>, encima del tráfico nuevo.' }]
    },
    {
      s: 'Eficiencia', k: 'problema', t: 'La utilización del enlace se derrumba',
      b: '<p>A medida que aumenta el tráfico, aumenta la <b>utilización</b> del enlace. Pero pasado cierto punto aparece la congestión y la eficiencia <b>empieza a reducirse</b>: lo que generan los usuarios no entra, se descarta y se retransmite.</p><p>Lo ideal es llegar a la máxima eficiencia y <b>quedarse ahí</b>: usar los 100 Mb todo el tiempo. El enlace tiene un costo, y lo mejor es aprovecharlo siempre.</p><p>TCP tiene un mecanismo de <b>control de congestión</b> para no llegar a ese punto.</p>',
      key: 'Pasada la capacidad del enlace, generar más tráfico no entrega más: entrega menos.',
      scene: 'efic', ymax: 120,
      series: [
        { c: 'req', pts: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 100, 100, 100, 100, 100] },
        { c: 'bad', pts: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 86, 70, 54, 40, 28] }
      ],
      marks: [{ i: 9, l: 'buffers llenos: empiezan los descartes', c: 'bad' }],
      notes: [{ x: 92, y: 58, w: 250, c: 'green', text: '<b>Verde</b>: lo ideal, usar siempre los 100 Mb' }, { x: 92, y: 94, w: 250, c: 'red', text: '<b>Rojo</b>: lo que pasa cuando hay congestión' }]
    },
    {
      s: 'Permitida', k: 'idea', t: 'Ventana permitida: el menor de dos límites',
      b: '<p>El otro extremo ya nos dio un <b>crédito</b>. ¿Lo usamos todo de entrada, o de a poco? Ahí interviene el control de congestión.</p><p>TCP define una <b>ventana permitida</b>:</p><p><b>ventana permitida = mínimo(ventana de congestión, crédito)</b></p><p>El crédito lo fija el receptor (su buffer). La <b>ventana de congestión</b> (cwnd) la maneja el propio emisor, según cómo responde la red. Aunque el crédito alcance para 1000 segmentos, se envían tantos como diga la ventana permitida.</p>',
      key: 'El crédito protege al receptor; la ventana de congestión protege a la red. Manda siempre el más chico.',
      scene: 'perm', title: 'Ventana permitida = mínimo(cwnd, crédito)', max: 20, overLabel: 'excede el crédito',
      levels: [{ to: 4, l: 'cwnd', c: 'green', tag: 'se envía' }, { to: 16, l: 'crédito', c: 'yellow', tag: 'espera' }],
      items: [{ v: 1, l: 'segmento 1' }, { v: 1, l: 'segmento 2' }, { v: 1, l: 'segmento 3' }, { v: 1, l: 'segmento 4' }, { v: 1, l: 'segmento 5' }, { v: 1, l: 'segmento 6' }, { v: 1, l: 'segmento 7' }],
      notes: [{ x: 470, y: 64, w: 290, c: 'yellow', text: 'Ejemplo: el crédito alcanza para <b>16</b> segmentos, pero la ventana de congestión vale <b>4</b>. De los 7 segmentos listos salen 4; los otros 3 esperan aunque haya crédito.' }],
      st: { cwnd: '4', perm: 'mín(4, 16) = 4' }
    },
    {
      s: 'Slow start', k: 'mecanismo', t: 'Slow start: empezar de a poco',
      b: '<p><b>Slow start</b> fue el primer método de control de congestión. Al iniciar la conexión, la ventana de congestión vale <b>1</b>: aunque el crédito sea enorme, se envía un solo segmento.</p><p>Por <b>cada confirmación</b> recibida, la ventana se incrementa en 1:</p><ul><li>1 segmento → 1 ACK → cwnd = 2</li><li>2 segmentos → 2 ACK → cwnd = 4</li><li>4 segmentos → 4 ACK → cwnd = 8</li></ul><p>El crecimiento es <b>exponencial</b>.</p>',
      key: 'Si el tráfico se introduce de a poco en la red, se puede reaccionar cuando aparece la congestión.',
      scene: 'ss',
      st: { cwnd: '1 → 2 → 4 → 8', perm: 'la que diga cwnd' }
    },
    {
      s: 'Pérdida', k: 'mecanismo', t: 'Se pierde un segmento: volver a 1',
      b: '<p>Cuando un segmento se pierde (caduca el <b>RTO</b> sin confirmación), la ventana de congestión <b>vuelve a 1</b> y se empieza de nuevo.</p><p>Si el host venía enviando de a ocho segmentos y eso produce congestión, el router llena su buffer y descarta. El host reinicia la ventana: pasa de transmitir de a ocho a transmitir <b>de a uno</b>, y reduce drásticamente su tasa.</p><p>Eso baja la carga sobre el router y evita que la utilización del enlace caiga.</p>',
      key: 'Para slow start, toda pérdida es señal de congestión, y la respuesta es frenar casi por completo.',
      scene: 'cw', ymax: 12,
      series: [{ l: 'cwnd', c: 'req', pts: [1, 2, 4, 8, 1, 2, 4, 8, 1, 2, 4, 8] }],
      marks: [{ i: 4, l: 'caduca el RTO → cwnd = 1', c: 'bad' }, { i: 8, l: 'caduca el RTO → cwnd = 1', c: 'bad' }],
      st: { cwnd: '8 → 1', ev: 'RTO → cwnd = 1' }
    },
    {
      s: 'Sincronía', k: 'problema', t: 'Global synchronization',
      b: '<p>Slow start tiene un efecto indeseado. Si <b>todas</b> las estaciones lo usan, todas aumentan su ventana <b>al mismo tiempo</b> hasta que se produce la congestión; cuando el router empieza a descartar, todas vuelven a 1 y <b>dejan de transmitir juntas</b>.</p><p>El ciclo se repite una y otra vez: es la <b>global synchronization</b>. El enlace pasa de usarse mucho a usarse poco o nada.</p>',
      key: 'Se evita el colapso, pero a costa de desaprovechar el enlace buena parte del tiempo.',
      scene: 'gs', ymax: 140,
      series: [{ c: 'data', pts: [15, 30, 60, 120, 15, 30, 60, 120, 15, 30, 60] }],
      hline: [{ y: 100, l: 'capacidad del enlace', c: 'purple' }],
      marks: [{ i: 4, l: 'descartes: todos vuelven a 1', c: 'bad' }, { i: 8, l: 'descartes: todos vuelven a 1', c: 'bad' }]
    },
    {
      s: 'Fast retx', k: 'mecanismo', t: 'Fast retransmit: tres ACK duplicados',
      b: '<p>Una mejora. Si la fuente recibe un <b>ACK duplicado</b> (otra vez «espero el 2»), hay dos posibilidades: el segmento 2 se demoró y ya lo van a confirmar, o se perdió y hay que retransmitirlo.</p><p>Con <b>3 ACK duplicados</b> no se espera a que caduque el RTO: se <b>retransmite</b> el segmento perdido. Que sigan llegando confirmaciones muestra que la red funciona y los paquetes fluyen; si ninguna cubre al segmento 2, tiene que haberse perdido.</p>',
      key: 'Fast retransmit detecta la pérdida de forma más temprana que el RTO.',
      scene: 'fr',
      st: { ev: '3 ACK dup → retransmitir' }
    },
    {
      s: 'Fast recov.', k: 'mecanismo', t: 'Fast recovery: a la mitad, no a 1',
      b: '<p><b>Fast recovery</b> se combina con fast retransmit y mejora a slow start: evita volver a 1 cada vez que se pierde un segmento.</p><p>Al recibir el tercer ACK duplicado se puede pensar que el segmento se perdió, pero <b>no por congestión</b>: la red sigue entregando. En vez de reiniciar la ventana de congestión en 1, se la fija en <b>la mitad</b> de lo que vale.</p><p>Si efectivamente hay congestión, el mecanismo funciona igual, porque la ventana se reduce.</p>',
      key: 'Desaparecen los intervalos en los que se deja de transmitir o la tasa cae abruptamente.',
      scene: 'cw', ymax: 12,
      series: [{ c: 'bad', pts: [1, 2, 4, 8, 1, 2, 4, 8, 1, 2, 4, 8] }, { c: 'req', pts: [1, 2, 4, 8, 4, 8, 4, 8, 4, 8, 4, 8] }],
      marks: [{ i: 4, l: 'pérdida: a 4 (la mitad) en vez de a 1', c: 'ctl' }],
      notes: [{ x: 470, y: 50, w: 150, c: 'red', text: '<b>Rojo</b>: solo slow start' }, { x: 628, y: 50, w: 150, c: 'green', text: '<b>Verde</b>: fast recovery' }],
      st: { cwnd: '8 → 4', ev: '3 ACK dup → cwnd / 2' }
    },
    {
      s: 'Resumen', k: 'resumen', t: 'Control de congestión en una mirada',
      b: '<ul><li><b>Congestión</b>: buffers llenos, descartes y retransmisiones que empeoran todo.</li><li><b>Ventana permitida</b> = mínimo(ventana de congestión, crédito).</li><li><b>Slow start</b>: cwnd arranca en 1 y suma 1 por ACK (1, 2, 4, 8…); si caduca el RTO, vuelve a 1.</li><li><b>Global synchronization</b>: todos frenan a la vez.</li><li><b>Fast retransmit</b>: 3 ACK duplicados → retransmitir ya.</li><li><b>Fast recovery</b>: cwnd a la mitad en lugar de a 1.</li></ul><p>Conexión, confirmaciones, créditos, ventanas: es el precio de la confiabilidad. En la próxima lección, el otro protocolo de transporte: <b>UDP</b>, que no hace nada de esto.</p>',
      scene: 'red', hide: ['BUF'], tags: { R: 'sin descartes' },
      pk: [{ p: ['U1', 'R', 'NET'], l: 'cwnd = 4', d: 1.8 }, { p: ['U2', 'R', 'NET'], l: 'cwnd = 2', c: 'res', d: 1.8, t: .5 }, { p: ['U3', 'R', 'NET'], l: 'cwnd = 8', c: 'key', d: 1.8, t: 1 }],
      st: { cwnd: 'la regula el emisor', perm: 'mín(cwnd, crédito)', ev: 'RTO → 1 · 3 dup → mitad' }
    }
  ],
  quiz: [
    { q: 'El receptor otorgó crédito para 16 segmentos y la ventana de congestión vale 4. ¿Cuántos segmentos se pueden enviar?', o: ['16', '4', '20', '12'], a: 1, why: 'La ventana permitida es el mínimo entre la ventana de congestión y el crédito: mínimo(4, 16) = 4.' },
    { q: 'En slow start, con ventana de congestión 4 se envían 4 segmentos y llegan sus 4 confirmaciones. ¿Cuánto vale ahora la ventana?', o: ['5', '6', '8', '16'], a: 2, why: 'Se suma 1 por cada ACK recibido: 4 + 4 = 8. Por eso el crecimiento es exponencial (1, 2, 4, 8…).' },
    { q: '¿Qué hace fast retransmit al recibir 3 ACK duplicados?', o: ['Espera a que caduque el RTO', 'Retransmite el segmento perdido sin esperar el RTO', 'Cierra la conexión con RST', 'Pone el crédito en cero'], a: 1, why: 'Tres duplicados indican que la red sigue entregando paquetes y que ese segmento se perdió: se lo retransmite antes de que caduque el RTO.' },
    { q: 'Con fast recovery, la ventana de congestión vale 8 y llega el tercer ACK duplicado. ¿A cuánto pasa?', o: ['1', '4', '7', '16'], a: 1, why: 'En lugar de reiniciarla en 1 como slow start, fast recovery la fija en la mitad de su valor: 4.' }
  ],
  cheat: [
    ['Congestión', 'La carga supera la capacidad del enlace: se llenan los buffers del router, hay descartes y las retransmisiones suman más tráfico.'],
    ['Sobresuscripción', 'La suma de los accesos supera al enlace: 500 clientes de 1 Mb contra 100 Mb.'],
    ['Ventana permitida', '<b>mínimo(ventana de congestión, crédito)</b>. El crédito lo da el receptor; la de congestión la regula el emisor.'],
    ['Slow start', 'cwnd arranca en 1 y suma 1 por cada ACK: 1, 2, 4, 8… Si caduca el RTO, vuelve a 1.'],
    ['Global synchronization', 'Todas las estaciones crecen y caen a 1 al mismo tiempo: el enlace alterna entre saturado y casi vacío.'],
    ['Fast retransmit', '3 ACK duplicados → se retransmite el segmento perdido sin esperar el RTO.'],
    ['Fast recovery', 'Con el tercer ACK duplicado, cwnd pasa a la mitad en lugar de a 1. Se combina con fast retransmit.']
  ]
});

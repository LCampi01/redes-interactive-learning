# Guía para escribir lecciones

Cada lección es un archivo `js/lessons/<id>.js` que llama a `COURSE.add({...})`.
El orden y la unidad de cada lección están en `js/course.js`; el `<script>` ya está en `index.html`.

Ejemplos reales para copiar la forma:

- `js/lessons/ethernet-csma.js` — lección completa (tono, largo de los textos, quiz, machete).
- `js/lessons/_demo.js` — un paso por cada tipo de escena, con todas las opciones.

## Estructura

```js
COURSE.add({
  id: 'mi-leccion',                 // igual al nombre del archivo
  title: 'Título corto',
  desc: 'Una oración que diga qué se va a entender.',
  min: 9, level: 'Inicial' | 'Intermedio' | 'Avanzado',
  learn: ['4 o 5 cosas que se aprenden'],
  stats: [{ k: 'clave', l: 'Etiqueta' }],        // opcional: 2–4 "medidores" arriba del lienzo
  legend: [['req', 'petición'], ['res', 'respuesta']],   // opcional: colores usados en los paquetes
  scenes: { nombre: { kind: 'topo' | 'seq' | 'fields' | 'bits' | 'chart' | 'stack', ... } },
  steps: [ { ...paso }, ... ],      // 6 a 10 pasos
  quiz: [{ q: 'Pregunta', o: ['A', 'B', 'C', 'D'], a: 1, why: 'Por qué.' }],   // 3–5, a = índice correcto
  cheat: [['Término', 'Definición corta (acepta <b>HTML</b>)']]                 // 5–8 filas
});
```

### Paso (campos comunes)

| campo | qué es |
|---|---|
| `s` | etiqueta corta para la línea de tiempo (1–2 palabras, máx. ~12 caracteres) |
| `k` | tipo: `contexto`, `problema`, `idea`, `mecanismo`, `ejemplo`, `detalle`, `comparación`, `resumen` |
| `t` | título del paso |
| `b` | cuerpo en HTML (`<p>`, `<ul><li>`, `<b>`, `<code>`). **Máx. ~90 palabras**: el panel es angosto |
| `key` | opcional: la "idea clave" en una oración |
| `fig` | opcional: figura(s) original(es) del apunte, p. ej. `'image24.png'` o `['image19.png','image20.png']` (están en `assets/apunte/`; en el texto del apunte aparecen como `[IMG:media/imageN.png]`) |
| `scene` | nombre de la escena a mostrar |
| `st` | opcional: valores de los medidores `{ clave: 'valor' }` (se arrastran a los pasos siguientes) |
| `notes` | opcional: carteles sobre el lienzo `[{ x, y, w, text: 'HTML', c: 'yellow' }]` (hacen salto de línea solos) |
| `tbl` | opcional: tabla flotante `{ x, y, w, title, cols: [...], rows: [[...]], hi: filaResaltada }` (o un array de tablas) |

El lienzo mide **800 × 440**. Todas las coordenadas son en esas unidades.

Colores disponibles (`c`): `green yellow blue purple red orange gray white`, y semánticos para paquetes/mensajes:
`req` (verde), `res` (azul), `ctl` (violeta), `bad` (rojo), `key` (amarillo), `data` (naranja).

## Escenas

### `topo` — topologías, flujos y diagramas de estados

```js
red: { kind: 'topo',
  zones: [{ id: 'z1', x, y, w, h, l: 'Dominio de colisión', c: 'red' }],     // rectángulo punteado de fondo
  nodes: [{ id: 'A', t: 'pc', x: 120, y: 150, l: 'A', sub: '10.0.0.1', c: 'green' }],
  links: [{ a: 'A', b: 'SW', l: 'etiqueta', dash: 1, wl: 1, thick: 1, arrow: 1, curve: 40, c: 'blue', id: 'opcional' }]
}
```

- Tipos de nodo con ícono (tarjeta de 58×52, la etiqueta va debajo): `pc server switch hub bridge router ap cloud dns db fw phone user lock doc key printer tel`.
- Nodos especiales: `bus` (`x, y, w`: línea horizontal; los links a un bus caen verticales), `state` (pastilla con el texto adentro), `box` (`w, h`, texto adentro + `sub`), `txt` (texto suelto; `big: 1`, `c`), `dot` (punto invisible, sirve de escala para paquetes).
- `\n` en `l` corta la línea. El id de un link es `l.id` o `'A-SW'` (a-b). `lx` / `ly` corren la etiqueta del link (útil en diagonales).
- Si hay dos links entre el mismo par de nodos, los paquetes siguen el primero; para el otro pasá un punto intermedio `[x, y]` en `p`.
- Separá los nodos ≥ 110 px en horizontal y ≥ 120 px en vertical; dejá libre y < 60 e y > 390. Los `tags` ocupan ~30 px arriba del nodo.

Estado del paso:

| campo | efecto |
|---|---|
| `show: [ids]` | solo se ven esos nodos/zonas (un link se ve si se ven sus dos extremos). Sin `show` se ve todo |
| `add: [ids]` | lo que se veía en el paso anterior de la misma escena **más** estos (para ir construyendo) |
| `hide: [ids]` | oculta nodos, zonas o links puntuales |
| `hi`, `dim` | resalta / atenúa nodos, links o zonas |
| `x: [ids]` | link bloqueado (✕ roja) o nodo caído |
| `tags: { A: 'escucha…' }` | globito negro arriba del nodo (corto) |
| `ll: { 'A-SW': 'texto' }` | cambia la etiqueta de un link |
| `pk: [...]` | paquetes animados |
| `fx: [...]` | efectos |

Paquetes: `{ p: ['A','SW','B'], l: 'trama', c: 'req', d: 1.6, t: 0, par: 1, stay: 1, drop: 1, dropAt: .5 }`

- `p`: camino por ids de nodos o puntos `[x, y]`. Si pasa por un `bus`, recorre el cable.
- Sin `t`, cada paquete arranca **cuando termina el anterior**; `par: 1` lo hace arrancar junto con el anterior. `d` = duración total en segundos.
- `stay`: queda en destino; `drop`: termina con ✕ (`dropAt: .5` lo corta a mitad de camino). Etiquetas cortas (≤ 14 caracteres).
- La animación se repite sola; mantené cada paso en ≤ 6 s.

Efectos: `{ k: 'wave', at: 'AP', c: 'ctl', t: 0, r: 150 }` (onda de radio / broadcast), `{ k: 'sig', bus: 'BUS', from: 'A', c: 'req', t: 0, d: 1.4 }` (señal que llena un bus), `{ k: 'boom', at: [x, y] | 'id', t: 1, l: 'colisión' }`.

### `seq` — diagrama de secuencia (tiempo hacia abajo)

```js
hs: { kind: 'seq',
  actors: [{ id: 'C', l: 'Cliente', t: 'pc' }, { id: 'S', l: 'Servidor', t: 'server' }],   // 2 a 4
  msgs: [
    { f: 'C', to: 'S', l: 'SYN · seq = x', c: 'ctl' },
    { f: 'S', to: 'C', l: 'ACK', c: 'res', lost: 1 },      // se pierde a mitad de camino
    { at: 'C', note: 'expira T1', c: 'red' },              // cartel sobre la línea de vida
    { div: 'transferencia de datos' },                     // separador
    { gap: 1 }                                             // fila vacía
  ] }
```

Paso: `upto: n` muestra las primeras n filas (sin `upto`, todas); las nuevas respecto del paso anterior se animan y las viejas se atenúan. `states: { C: 'SYN_SENT' }` pone un cartelito de estado bajo cada actor. **Máximo 13 filas por escena** (si hay más, partila en dos escenas).

### `fields` — formato de trama / cabecera

```js
trama: { kind: 'fields', title: 'Trama Ethernet', rh: 50, ruler: 32 /* opcional: regla de bits */,
  rows: [[{ id: 'da', l: 'MAC destino', s: '6 B', w: 6, c: 'green' }, ...], [...segunda fila...]],
  zoom: { from: 'tag', title: 'Dentro del tag', rows: [[...]] }      // opcional: detalle de un campo
}
```

`w` es el ancho relativo dentro de la fila; `s` el tamaño (texto chico). Paso: `hi: ['da','sa']` resalta campos (los demás quedan pálidos; sin `hi` se ven todos con color), `zoom: 1` muestra el detalle, `det: 'HTML'` agrega un recuadro explicativo debajo. Usá etiquetas cortas en campos angostos.

### `bits` — direcciones IP, máscaras y bloques

Escena: `{ kind: 'bits' }`. Todo va en el paso:
`ip: '200.1.10.130', mask: 24, sub: 26` (bits de red / subred / host coloreados y fila de máscara), `hiBits: [24, 25]`,
`lines: [{ l: 'Subred', v: '200.1.10.128/26', hi: 1 }]` (hasta 8 fichas),
`blocks: [{ a: 0, b: 63, l: '.0/26', c: 'green', hi: 1, free: 1 }]` + `blocksTitle`, `span: [0, 255]`, o varias barras con `bars: [{ title, span, blocks }]`, y `title`.

### `chart` — gráfico de líneas

Escena: `{ kind: 'chart', xl: 'eje x', yl: 'eje y' }`. Paso: `series: [{ l: 'cwnd', c: 'req', pts: [1,2,4,8] }]`, `upto: n` (dibuja los primeros n puntos), `marks: [{ i: 5, l: 'pérdida', c: 'bad' }]`, `hline: [{ y: 16, l: 'crédito', c: 'purple' }]`, `ymax`.

### `stack` — medidor apilado (CIR/EIR, créditos, buffers)

Escena: `{ kind: 'stack', unit: 'kb' }`. Paso: `title`, `max`, `levels: [{ to: 64, l: 'CIR', c: 'green', tag: 'DE = 0' }, { to: 128, l: 'CIR + EIR', c: 'yellow', tag: 'DE = 1' }]`, `items: [{ v: 25, l: 'trama 1' }]`. Cada ítem toma el color del nivel donde cae su tope; lo que excede el último nivel sale en rojo como "descartada" (`overTag`, `overLabel`).

### Opciones menos usadas

- `seq`: `dash: 1` en un mensaje (línea punteada, p. ej. algo que "también escucha" otro actor); `anim: n` en el paso fuerza desde qué fila se anima.
- `fields`: `ghost: 1` en un campo (borde punteado, opcional/variable); `zoom.x` / `zoom.w` para mover o angostar el detalle; el `zoom` acepta varias filas. Las escenas `fields` bajas se centran solas en vertical, pero `notes` y `tbl` usan coordenadas absolutas: ubicarlos mirando la captura.
- `bits`: cada barra de `bars` acepta `h` (alto) y su propio `span`.
- `txt`: `anchor: 'start' | 'end'`.
- En `tbl` las celdas son texto plano y el ancho real lo decide el contenido.

## Criterios de contenido

- **Fiel al apunte**: explicá lo que dice el apunte, con sus ejemplos y números. No agregues temas que no están. Si el apunte tiene un dato evidentemente mal tipeado, usá el correcto y avisá al final.
- **Un mecanismo por paso**, y que en cada paso el lienzo muestre algo distinto (otro resaltado, otro paquete, una fila más). Preferí animar el mecanismo antes que describirlo.
- Arco sugerido: contexto/problema → mecanismo paso a paso → ejemplo con números → casos borde → resumen (el último paso es `k: 'resumen'` con una lista corta y, si aplica, puente a la lección siguiente).
- Español neutro como el del apunte ("tenemos", "se envía"), frases cortas, términos técnicos en **negrita** la primera vez. Sin emojis.
- Las preguntas del quiz se responden con lo que enseña la lección; `why` explica la respuesta en una oración.

## Idiomas (ES / EN)

Las lecciones se escriben en español. El botón ES / EN de la barra superior aplica un diccionario español → inglés:

- `js/i18n/ui-en.js`: textos fijos de la interfaz (a mano).
- `js/i18n/en.js`: textos de las lecciones, **generado** a partir de `i18n/es/<id>.json` (originales) e `i18n/en/<id>.json` (traducciones, mismo orden y cantidad).

Si se edita o agrega una lección: abrir `index.html?extract=1` para obtener los textos actuales, actualizar `i18n/es/` e `i18n/en/`, revisar con `python -I tools/check_i18n.py <id>` y regenerar con `python -I tools/build_i18n.py`. Un texto sin traducción simplemente se muestra en español. `?validate=1&lang=en` y `?preview=<id>&lang=en` revisan la versión en inglés.

## Verificar

No hay Node. Se valida y se sacan capturas con Edge sin ventana:

```
?validate=<id>,<id>        revisa referencias (ids, campos, filas) y dibuja cada paso
?preview=<id>&from=1&to=4  hoja con todos los pasos (estáticos) para revisar a ojo
```

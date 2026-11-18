/* Textos fijos de la interfaz en inglés. Clave = texto en español tal como aparece en app.js / lab.js / engine.js.
   (El contenido de las lecciones está en js/i18n/en.js, generado con tools/build_i18n.py.) */
window.UI_EN = {
  // barra superior y navegación
  'Índice del curso': 'Course index', 'Inicio': 'Home', 'Redes': 'Networks', '· apuntes interactivos': '· interactive notes',
  'Aprender': 'Learn', 'Práctica': 'Practice', 'Laboratorio': 'Lab', 'Machetes': 'Cheat sheets',
  'Buscar lecciones y temas…': 'Search lessons and topics…', 'Idioma': 'Language', 'Cambiar tema': 'Toggle theme',
  'Curso': 'Course', '{n} lecciones': '{n} lessons', 'Progreso': 'Progress',
  // unidades
  'Redes LAN': 'LAN networks', 'Wireless LAN': 'Wireless LAN', 'Capa de red · IP': 'Network layer · IP', 'Servicios de red': 'Network services',
  'Transporte': 'Transport', 'Redes WAN': 'WAN networks', 'Seguridad': 'Security',
  // lección
  'Lección {a} de {b}': 'Lesson {a} of {b}', 'Inicial': 'Beginner', '{n} pasos': '{n} steps',
  'Repetir (R)': 'Replay (R)', 'Repetir': 'Replay', 'Pausa (Espacio)': 'Pause (Space)', 'Pausa': 'Pause', 'Seguir': 'Resume',
  'En esta lección': 'In this lesson', 'Paso {a} de {b}': 'Step {a} of {b}', 'Paso': 'Step', 'Idea clave': 'Key idea',
  'Ver {n} figuras del apunte': 'View {n} figures from the notes', 'Ver figura del apunte': 'View figure from the notes',
  'Atrás': 'Back', 'Siguiente:': 'Next:', 'Ir a la práctica': 'Go to practice',
  'paso': 'step', 'repetir': 'replay', 'Espacio': 'Space', 'pausa': 'pause',
  'Aprenderás': 'You will learn', 'Practicar esta lección': 'Practice this lesson',
  'contexto': 'context', 'problema': 'problem', 'idea': 'idea', 'mecanismo': 'mechanism', 'ejemplo': 'example', 'detalle': 'detail',
  'comparación': 'comparison', 'resumen': 'summary', 'práctica': 'practice',
  // práctica
  'Autoevaluación': 'Self-assessment',
  'Preguntas armadas a partir de los apuntes. Elegí una opción y mirá la explicación; tus respuestas quedan guardadas en este navegador.': 'Questions built from the notes. Pick an option and read the explanation; your answers are saved in this browser.',
  'Todo': 'All', '{n} correctas': '{n} correct', '{a} / {b} respondidas': '{a} / {b} answered', 'Reiniciar estas preguntas': 'Reset these questions',
  'Correcto.': 'Correct.', 'No.': 'No.', 'Todavía no hay preguntas para esta selección.': 'There are no questions for this selection yet.',
  // machetes
  'Resumen para repasar': 'Summary for review', 'Lo esencial de cada lección en una tarjeta. Se puede imprimir': 'The essentials of each lesson on one card. Printable',
  'ver lección →': 'open lesson →', 'Machete': 'Cheat sheet',
  // figuras y búsqueda
  'Figura del apunte': 'Figure from the notes', 'Figura original de tus apuntes (Redes.docx)': 'Original figure from your notes (Redes.docx, in Spanish)', 'Cerrar': 'Close',
  'Buscar: CSMA/CD, ventana, DLCI, handshake…': 'Search: CSMA/CD, window, DLCI, handshake…', 'Buscar': 'Search', 'Sin resultados.': 'No results.',
  // motor de escenas
  'máscara': 'mask', 'red · {n} bits': 'network · {n} bits', 'subred · {n} bits': 'subnet · {n} bits', 'host · {n} bits': 'host · {n} bits',
  'excede: se descarta': 'over the limit: dropped', 'descartada': 'dropped', 'Error en la escena:': 'Scene error:',

  // ---------- laboratorio ----------
  'Probá con tus propios números': 'Try it with your own numbers',
  'Calculadoras para resolver los ejercicios típicos de la materia y comprobar tus cuentas.': 'Calculators for the typical exercises of the course, to check your own math.',
  'No se pudo calcular:': 'Could not compute:',
  'Subredes': 'Subnets', 'Fragmentación IP': 'IP fragmentation',
  // subredes
  'Calculadora de subredes': 'Subnet calculator',
  'Escribí una dirección, el prefijo de la red original y el prefijo de la subred. Los bits azules son de red, los amarillos son los que "tomaste" para la subred y los verdes quedan para hosts.': 'Enter an address, the prefix of the original network and the subnet prefix. Blue bits belong to the network, yellow bits are the ones "borrowed" for the subnet, and green bits are left for hosts.',
  'Dirección IP': 'IP address', 'Prefijo de la red': 'Network prefix', 'Prefijo de la subred': 'Subnet prefix',
  'La dirección IP no es válida (formato a.b.c.d, cada octeto de 0 a 255).': 'The IP address is not valid (format a.b.c.d, each octet from 0 to 255).',
  'El prefijo de subred tiene que ser mayor o igual al de la red, y ambos estar entre 0 y 32.': 'The subnet prefix must be greater than or equal to the network prefix, and both must be between 0 and 32.',
  'Dirección de subred': 'Subnet address', 'Primer host': 'First host', 'Último host': 'Last host', 'Hosts útiles': 'Usable hosts', 'Máscara': 'Mask',
  'Subredes posibles': 'Possible subnets', 'Clase (histórica)': 'Class (historical)', '¿Privada (RFC 1918)?': 'Private (RFC 1918)?', 'Sí': 'Yes', 'No': 'No',
  'E (reservada)': 'E (reserved)',
  'Último octeto: {n} subredes /{p}': 'Last octet: {n} /{p} subnets', 'Último octeto: {n} subred /{p}': 'Last octet: {n} /{p} subnet',
  // vlsm
  'Asignación VLSM': 'VLSM allocation',
  'Indicá el bloque disponible y cuántos hosts necesita cada subred. Se asigna de mayor a menor, cada una con la máscara más ajustada, y lo que sobra queda contiguo para crecer.': 'Enter the available block and how many hosts each subnet needs. Subnets are allocated from largest to smallest, each with the tightest mask, and what is left stays contiguous for growth.',
  'Bloque disponible': 'Available block', 'Hosts por subred (separados por coma)': 'Hosts per subnet (comma separated)',
  'Escribí el bloque como a.b.c.d/prefijo, por ejemplo 200.1.10.0/24.': 'Write the block as a.b.c.d/prefix, for example 200.1.10.0/24.',
  'Bloque inválido (el prefijo tiene que ser /30 o menor).': 'Invalid block (the prefix must be /30 or shorter).',
  'Los requerimientos tienen que ser números positivos.': 'The requirements must be positive numbers.',
  'no entra': 'does not fit', 'libre': 'free', 'Bloque {b} (posiciones relativas al inicio del bloque)': 'Block {b} (positions relative to the start of the block)',
  'Necesita': 'Needs', 'Subred': 'Subnet', 'Rango de hosts': 'Host range',
  'Direcciones del bloque': 'Addresses in the block', 'Asignadas': 'Allocated', 'Libres (contiguas al final)': 'Free (contiguous, at the end)',
  // fragmentación
  'Fragmentar un datagrama': 'Fragment a datagram',
  'Un router tiene que sacar un datagrama por una interfaz con MTU menor. Cada fragmento lleva su propia cabecera de 20 bytes y el offset se escribe en bloques de 8 bytes.': 'A router has to send a datagram out through an interface with a smaller MTU. Each fragment carries its own 20-byte header and the offset is written in 8-byte blocks.',
  'Longitud total del datagrama (bytes)': 'Total datagram length (bytes)', 'MTU de salida': 'Outgoing MTU', 'Flag "no fragmentar"': '"Don\'t fragment" flag',
  'La longitud debe ser mayor a 20 (cabecera) y el MTU al menos 28.': 'The length must be greater than 20 (header) and the MTU at least 28.',
  'DF = 1 y el datagrama no entra: el router lo descarta y avisa con ICMP "fragmentation needed, but DF flag set".': 'DF = 1 and the datagram does not fit: the router drops it and reports it with ICMP "fragmentation needed, but DF flag set".',
  'Resultado': 'Result', 'Entra sin fragmentar': 'Fits without fragmenting', 'Longitud': 'Length',
  'Fragmento': 'Fragment', 'Longitud total': 'Total length', 'Bytes de datos': 'Data bytes', 'Desplazamiento': 'Offset (bytes)', 'Campo offset (÷ 8)': 'Offset field (÷ 8)', 'Más fragmentos': 'More fragments',
  'Datos a repartir': 'Data to split', 'Datos por fragmento': 'Data per fragment', '{n} bytes (múltiplo de 8)': '{n} bytes (multiple of 8)', 'Fragmentos': 'Fragments', 'Bytes extra de cabeceras': 'Extra header bytes',
  // bit stuffing
  'Inserción de ceros (HDLC)': 'Zero insertion (HDLC)',
  'El flag 01111110 delimita la trama, así que no puede aparecer adentro. El emisor inserta un 0 después de cada cinco 1 seguidos; el receptor lo quita.': 'The flag 01111110 delimits the frame, so it cannot appear inside it. The sender inserts a 0 after every five consecutive 1s; the receiver removes it.',
  'Bits del mensaje': 'Message bits', 'Escribí una secuencia de 0 y 1.': 'Enter a sequence of 0s and 1s.',
  'Bits originales': 'Original bits', 'Ceros insertados': 'Inserted zeros', 'Bits en la línea (con flags)': 'Bits on the line (with flags)',
  // backoff
  'Backoff exponencial binario': 'Binary exponential backoff',
  'Después de la colisión número n, cada estación elige N al azar entre 0 y 2ⁿ − 1 (n se limita a 10) y espera N · 2t. A 10 Mbps, 2t = 51,2 µs: el tiempo de transmitir 64 bytes.': 'After collision number n, each station picks a random N between 0 and 2ⁿ − 1 (n is capped at 10) and waits N · 2t. At 10 Mbps, 2t = 51.2 µs: the time it takes to transmit 64 bytes.',
  'Colisiones consecutivas (n)': 'Consecutive collisions (n)', 'Sortear de nuevo': 'Draw again',
  'Rango de N': 'Range of N', 'Prob. de elegir lo mismo': 'Prob. of picking the same', 'Espera máxima': 'Maximum wait', 'Estación A': 'Station A', 'Estación D': 'Station D',
  'Vuelven a chocar': 'They collide again', 'Transmite primero {x}': '{x} transmits first', 'Intentos restantes': 'Attempts left', '0: se abandona': '0: gives up',
  // frame relay
  'CIR, EIR y el bit DE': 'CIR, EIR and the DE bit',
  'El nodo de ingreso cuenta los bits que llegan durante Tc. Lo que entra bajo el CIR pasa con DE = 0; lo que cae en el exceso se marca DE = 1 (descartable si hay congestión); lo que supera CIR + EIR se descarta en el ingreso.': 'The ingress node counts the bits that arrive during Tc. What fits under the CIR passes with DE = 0; what falls in the excess is marked DE = 1 (discard-eligible under congestion); what exceeds CIR + EIR is dropped at the ingress.',
  'CIR (kb en Tc = 1 s)': 'CIR (kb in Tc = 1 s)', 'Tamaño de las tramas (kb, en orden)': 'Frame sizes (kb, in order)',
  'Revisá los valores: CIR > 0, EIR ≥ 0 y tramas positivas.': 'Check the values: CIR > 0, EIR ≥ 0 and positive frame sizes.',
  'trama {n}': 'frame {n}', 'Access rate mínimo': 'Minimum access rate', 'Enviado en Tc': 'Sent in Tc', 'Comprometido': 'Committed', 'En exceso': 'In excess',
  // tcp
  'MSS, ventana y stop-and-wait': 'MSS, window and stop-and-wait',
  'Tres cuentas que aparecen todo el tiempo: el MSS que se anuncia en el SYN, la ventana real cuando hay window scale, y cuántos paquetes por segundo permite stop-and-wait según el retardo de ida y vuelta.': 'Three calculations that come up all the time: the MSS announced in the SYN, the real window when window scale is used, and how many packets per second stop-and-wait allows for a given round-trip delay.',
  'MTU de la interfaz': 'Interface MTU', 'Campo Window': 'Window field', 'Window scale (exponente)': 'Window scale (exponent)',
  'Revisá los valores ingresados.': 'Check the values you entered.',
  'Ventana real': 'Real window', 'Segmentos MSS en la ventana': 'MSS segments in the window', '{n} paquetes/s': '{n} packets/s', 'Con ventana de 4': 'With a window of 4',
  'RTO razonable': 'Reasonable RTO', 'algo mayor a {n} ms': 'slightly more than {n} ms'
};

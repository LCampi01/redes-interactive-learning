/* Índice del curso: unidades y orden de las lecciones.
   Cada lección vive en js/lessons/<id>.js y se registra con COURSE.add({...}). */
COURSE.chapters = [
  { id: 'lan', n: '01', title: 'Redes LAN', c: 'green', lessons: ['ethernet-csma', 'trama-ethernet', 'hub-bridge-switch', 'stp', 'vlan'] },
  { id: 'wlan', n: '02', title: 'Wireless LAN', c: 'purple', lessons: ['wlan-csma-ca', 'wlan-pcf-trama'] },
  { id: 'ip', n: '03', title: 'Capa de red · IP', c: 'blue', lessons: ['ip-datagrama', 'fragmentacion', 'direccionamiento', 'subredes-vlsm', 'arp', 'ruteo', 'rip-ospf', 'icmp'] },
  { id: 'serv', n: '04', title: 'Servicios de red', c: 'yellow', lessons: ['dns', 'dhcp', 'vpn-ipsec'] },
  { id: 'tcp', n: '05', title: 'Transporte', c: 'orange', lessons: ['tcp-conexion', 'tcp-flujo', 'tcp-congestion', 'udp'] },
  { id: 'wan', n: '06', title: 'Redes WAN', c: 'red', lessons: ['hdlc', 'frame-relay', 'atm', 'mpls'] },
  { id: 'seg', n: '07', title: 'Seguridad', c: 'gray', lessons: ['criptografia', 'tls'] }
];

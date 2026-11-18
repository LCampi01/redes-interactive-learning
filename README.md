# Redes · apuntes interactivos

Sitio para estudiar Redes de Datos con lecciones animadas paso a paso, armado a partir de apuntes de la materia (UTN).

- **28 lecciones** en 7 unidades: LAN, Wireless LAN, capa de red IP, servicios de red, transporte, WAN y seguridad.
- **Práctica**: 112 preguntas con explicación.
- **Laboratorio**: calculadoras de subredes, VLSM, fragmentación IP, bit stuffing, backoff, CIR/EIR y TCP.
- **Machetes**: una tarjeta resumen por lección.
- Español e inglés (botón ES / EN), tema claro y oscuro, buscador (Ctrl K).

## Cómo usarlo

No necesita instalación ni build: abrir `index.html` en el navegador.

También se puede servir la carpeta, por ejemplo:

```bash
python -m http.server 8765
```

y entrar a `http://localhost:8765`.

## Estructura

| Ruta | Contenido |
|---|---|
| `index.html`, `css/`, `js/app.js` | La aplicación |
| `js/engine.js` | Motor de escenas (topologías, secuencias, cabeceras, bits, gráficos) |
| `js/lessons/` | Una lección por archivo |
| `js/i18n/`, `i18n/` | Traducción al inglés (diccionario generado y sus fuentes) |
| `assets/apunte/` | Figuras originales del apunte |
| `tools/` | Scripts para revisar y generar la traducción |

El formato de las lecciones está explicado en [GUIA-LECCIONES.md](GUIA-LECCIONES.md).

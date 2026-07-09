# SEMANTIAR · Anotador SNOMED CT

Interfaz web (Angular) para anotar textos clínicos con códigos de **SNOMED CT**,
usando el buscador embebido (`autocomplete-binding`) restringido por jerarquía.

Pensada para el flujo de calibración de anotadores del proyecto SEMANTIAR
(corpus clínico en español rioplatense).

> 📄 Descripción técnica detallada (integración con el servidor de terminología,
> autocompletado, búsqueda multi-prefijo, FHIR API): [`docs/IMPLEMENTACION.md`](docs/IMPLEMENTACION.md).

## Flujo de Trabajo

1. **Cargar JSON** con los textos a anotar (o **Ejemplo** para probar con los 15 casos de calibración incluidos).
2. **Reanudar progreso:** Si el archivo JSON ya contiene anotaciones de una sesión anterior, se recuperan automáticamente. La aplicación informa el progreso consolidado y permite saltar directamente al primer caso pendiente usando el botón **"Ir al pendiente"**.
3. **Completar las anotaciones:** Por cada caso, seleccionar la categoría (jerarquía de SNOMED), buscar y seleccionar el código correspondiente, y completar el texto literal y el contexto clínico (Polaridad, Certeza, Temporalidad, Sujeto).
4. **Descargar resultado:** Genera un JSON que incluye el trabajo realizado. Si la anotación no está terminada, el anotador puede descargar el archivo, cerrar el navegador y cargarlo nuevamente en otra sesión para continuar.
5. **Auditoría de Esfuerzo:** Cada ciclo de carga y descarga queda registrado en los metadatos internos del archivo (`_meta`), lo que permite realizar análisis del esfuerzo de anotación (tiempos, pausas y sesiones requeridas).

## Formato de entrada (JSON)

```json
{
  "project": "SEMANTIAR - ...",
  "batch": "CALIBRACIÓN_ANOTADOR",
  "annotatorId": "A048",
  "sourceFile": "SEMANTIAR_CAL_A048.xlsx",
  "cases": [
    { "id": "CAL-001", "text": "Paciente con fiebre, tos productiva..." }
  ]
}
```

Solo `cases[].id` y `cases[].text` son obligatorios. El ejemplo (`public/example-input.json`) se generó a partir de `SEMANTIAR_CAL_A048.xlsx`.

## Formato de salida (JSON)

Igual que la entrada + metadatos de exportación, un array `concepts[]` por cada caso y el objeto de auditoría `_meta` que rastrea las sesiones de trabajo. Los bloques de concepto vacíos se descartan al exportar.

```json
{
  "project": "SEMANTIAR - ...",
  "batch": "CALIBRACIÓN_ANOTADOR",
  "annotatorId": "A048",
  "sourceFile": "SEMANTIAR_CAL_A048.xlsx",
  "exportedAt": "2026-07-09T09:30:00.000Z",
  "terminologyServer": "https://implementation-demo.snomedtools.org/fhir",
  "editionUri": "http://snomed.info/sct",
  "cases": [
    {
      "id": "CAL-001",
      "text": "Paciente con fiebre, ...",
      "concepts": [
        {
          "cat": "Hallazgo clínico",
          "sctid": "386661006",
          "term": "Fever",
          "textoLiteral": "fiebre",
          "pol": "Activo",
          "cert": "Confirmado",
          "temp": "Actual",
          "suj": "Paciente"
        }
      ],
      "comentarios": ""
    }
  ],
  "_meta": {
    "sessions": [
      {
        "action": "upload",
        "timestamp": "2026-07-09T09:10:00.000Z",
        "annotatedCount": 0,
        "totalCases": 15
      },
      {
        "action": "download",
        "timestamp": "2026-07-09T09:25:00.000Z",
        "annotatedCount": 8,
        "totalCases": 15
      },
      {
        "action": "upload",
        "timestamp": "2026-07-09T09:28:00.000Z",
        "annotatedCount": 8,
        "totalCases": 15
      },
      {
        "action": "download",
        "timestamp": "2026-07-09T09:30:00.000Z",
        "annotatedCount": 15,
        "totalCases": 15
      }
    ],
    "totalDownloads": 2,
    "firstLoadedAt": "2026-07-09T09:10:00.000Z",
    "completedAt": "2026-07-09T09:30:00.000Z"
  }
}
```

### Análisis del esfuerzo y auditoría (`_meta`)

El objeto `_meta` viaja encapsulado dentro del propio archivo JSON. Esto permite a los investigadores analizar retrospectivamente:
* **Sesiones de trabajo:** La cantidad de veces que el archivo fue cargado (`upload`) y descargado (`download`).
* **Progreso por sesión:** El número de casos anotados al inicio y al final de cada sesión (`annotatedCount`).
* **Tiempos de ejecución:** Fecha/hora precisa de la primera carga (`firstLoadedAt`) y de la finalización total (`completedAt`).

Este historial puede ser inspeccionado en vivo en la aplicación haciendo clic en el botón de estadísticas (📊) de la barra superior.


## Categorías → jerarquía SNOMED (ECL)

La búsqueda se restringe a la jerarquía elegida (root concepts verificados vía `$lookup`):

| Categoría | ECL |
|---|---|
| Hallazgo clínico | `<<404684003` |
| Procedimiento | `<<71388002` |
| Fármaco | `<<373873005` |

> Nota: por ahora solo están habilitados estos 3 dominios. Sustancia, Estructura
> corporal y Organismo quedaron fuera (se pueden reactivar en `CATEGORIES`).

## Servidor de terminología

Un único servidor para dev y prod: **SnowstormX demo**
(`https://implementation-demo.snomedtools.org/fhir`), definido en
`src/environments/`. Configurable en vivo desde la barra **Configuración de
terminología**.

### Detección automática de edición

Al iniciar (y con el botón **Re-detectar edición**), la app consulta el
`CodeSystem` del servidor y elige:

- **Argentina (`http://snomed.info/sct/11000221109`)** si está presente →
  búsqueda **en español**.
- **Internacional (`http://snomed.info/sct`)** como fallback → búsqueda
  **en inglés**.

La edición activa se muestra como badge en el panel de configuración. Cuando se
cargue la edición argentina en el servidor, la app la usará automáticamente sin
cambios de código.

## Desarrollo

```bash
npm start                 # http://localhost:4200 (o 4270 vía launch.json)
npm run build             # build de desarrollo
npm run build:pages       # build de producción para GitHub Pages (base-href ./ + .nojekyll)
```

El componente `src/app/bindings/autocomplete-binding` está portado del
`sct-implementation-demonstrator` (convertido a standalone) y consume un
`TerminologyService` mínimo (`src/app/services/terminology.service.ts`).

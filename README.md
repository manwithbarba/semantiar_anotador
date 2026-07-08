# SEMANTIAR · Anotador SNOMED CT

Interfaz web (Angular) para anotar textos clínicos con códigos de **SNOMED CT**,
usando el buscador embebido (`autocomplete-binding`) restringido por jerarquía.

Pensada para el flujo de calibración de anotadores del proyecto SEMANTIAR
(corpus clínico en español rioplatense).

## Flujo

1. **Cargar JSON** con los textos a anotar (o **Ejemplo** para probar con los 15
   casos de calibración incluidos).
2. Por cada concepto clínico del texto: elegir **Categoría** (jerarquía SNOMED),
   buscar y seleccionar el concepto, y completar **Texto literal** + contexto
   (Polaridad / Certeza / Temporalidad / Sujeto). Hasta 10 conceptos por caso.
3. **Descargar** el JSON anotado.

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

Solo `cases[].id` y `cases[].text` son obligatorios. El ejemplo
(`public/example-input.json`) se generó a partir de `SEMANTIAR_CAL_A048.xlsx`.

## Formato de salida (JSON)

Igual que la entrada + metadatos de exportación y, por caso, un array
`concepts[]`. Los bloques de concepto vacíos se descartan al exportar.

```json
{
  "annotatorId": "A048",
  "exportedAt": "2026-07-08T12:51:59.480Z",
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
  ]
}
```

> Un JSON de salida puede volver a cargarse: las anotaciones existentes se
> recuperan (la selección previa se muestra como chip; para cambiarla, re-buscar).

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

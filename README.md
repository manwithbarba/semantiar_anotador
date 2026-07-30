# SEMANTIAR · Anotador SNOMED CT

Interfaz web (Angular) para anotar textos clínicos con códigos de **SNOMED CT**,
usando el buscador embebido (`autocomplete-binding`) restringido por jerarquía.

Pensada para el flujo de calibración de anotadores del proyecto SEMANTIAR
(corpus clínico en español rioplatense).

> 📄 Descripción técnica detallada (integración con el servidor de terminología,
> autocompletado, búsqueda multi-prefijo, FHIR API): [`docs/IMPLEMENTACION.md`](docs/IMPLEMENTACION.md).

## Flujo

1. **Cargar JSON** con los textos a anotar, o reabrir un JSON de salida previo
   para continuar el trabajo de cualquier anotador.
2. Por cada nota, revisar exhaustivamente el texto y completar las decisiones
   de formas breves que aparezcan.
3. Por cada concepto clínico del texto: elegir **Categoría** (jerarquía SNOMED),
   buscar y seleccionar el concepto, y completar **Texto literal** + contexto
   (Polaridad / Certeza / Temporalidad / Sujeto). Se pueden registrar tantos
   conceptos por caso como sean clínicamente relevantes.
4. **Cerrar la nota** con **Revisada con conceptos** o **Sin conceptos anotables**.
   El contador superior disminuye en este paso, no al modificar un campo.
5. **Descargar** el JSON de avance o final.

La página trabaja en el navegador y no guarda cambios en GitHub ni en un
servidor. Mientras el estado diga **Cambios sin descargar**, el trabajo está
únicamente en esa pestaña. Descargá el JSON para conservarlo y, en otra sesión,
volvé a cargar ese archivo para continuar.

Cada selección de concepto, cambio de contexto o decisión léxica se aplica
inmediatamente a la nota en edición. **Anotación guardada** significa que el
cambio ya quedó registrado en la sesión; **Nota revisada** se reserva para el
cierre exhaustivo de la nota completa.

### Protocolo de anotación asistida

Los resaltados se presentan únicamente como candidatos incompletos. El anotador
debe revisar la nota completa y puede aceptar, ajustar los límites, descartar o
incorporar menciones omitidas. En la release bloqueada para anotadores, cada
span conserva sólo el literal y sus offsets: origen, confianza, categoría,
expansiones, claves léxicas y SCTID se eliminan o reemplazan por valores
genéricos. La auditoría de procedencia queda separada bajo custodia del
investigador. La salida registra `_annotationProtocol` y las acciones humanas
sobre cada span para asegurar trazabilidad.

Los lotes con `_annotationProtocol.mode: "core-blind"` se abren sin resaltados
y muestran una consigna específica de anotación desde cero. Ese modo se
conserva al descargar el resultado y no se reemplaza por el protocolo asistido.

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

Solo `cases[].id` y `cases[].text` son obligatorios. La página acepta tanto
JSON de entrada nuevos como JSON de salida ya anotados para retomar el trabajo.

## Formato de salida (JSON)

Igual que la entrada + metadatos de exportación y, por caso, un array
`concepts[]`. Los bloques de concepto vacíos se descartan al exportar.

```json
{
  "schemaVersion": "1.0.0",
  "textProfile": {
    "normalization": "NFC",
    "lineEndings": "LF",
    "offsetUnit": "utf16-code-unit"
  },
  "producer": {
    "app": "SemantIAr",
    "build": "SEMANTIAR-ANNOTATOR-2026.07",
    "platform": "web"
  },
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

El contrato formal está publicado en
[`public/semantiar-annotation.schema.json`](public/semantiar-annotation.schema.json).
Los SCTID se aceptan exclusivamente como cadenas. Antes de crear offsets,
`textNorm` se normaliza a NFC y LF; los offsets se expresan siempre en unidades
UTF-16. Los JSON anteriores sin `schemaVersion` se migran al cargarlos, por lo
que no es necesario reemplazar los lotes ya asignados.

### Finalización explícita y métricas locales

Cada nota debe cerrarse como **Revisada con conceptos** o **Sin conceptos
anotables**. Una modificación posterior la devuelve automáticamente a pendiente.
Los archivos previos que ya contienen un SCTID se migran como revisados al
volver a cargarlos.

En los lotes con capa léxica, cada forma breve tiene dos pasos visibles: decidir
la aparición individual (el contador `X/Y formas decididas`) y luego confirmar
**Revisión de formas**. Hasta completar ambos pasos, el cierre de la nota queda
bloqueado y la nota sigue figurando como pendiente.

La salida incorpora `_meta.telemetry` (`SEMANTIAR-TELEMETRY-1.1`). La comparación
entre `web` y `android` se aplica exclusivamente al flujo asistido con spans:

- tiempo activo total y por nota, con pausa por pestaña oculta y umbral de
  inactividad de 120 segundos;
- visitas, reaperturas y resultado de finalización por nota;
- episodios, consultas reales después del *debounce*, reformulaciones,
  resultados vacíos, errores, cancelaciones, latencia y rango seleccionado;
- conceptos agregados, eliminados o reemplazados, cambios de categoría y
  decisiones sobre spans;
- interacciones pasivas de UI: `clicksTotal` y distribución en `clicksByTarget` por componente objetivo (`span-accept`, `span-discard`, `concept-add`, `concept-remove`, `concept-edit`, `category-select`, `context-toggle`, `search-interaction`, `lexical-review`, `general-ui`);
- métricas de borrado e inhibición: `deletionsTotal` y desglose en `deletionsByType` (`concept`, `span`, `lexical-mention`, `comment`).
- el mismo conjunto de métricas separado en `cases[].byPlatform.web` y
  `cases[].byPlatform.android`, de modo que un único JSON pueda acumular y
  comparar tiempos, clics, búsquedas, errores y ediciones de ambas interfaces;
  Core Blind queda reservado a la página web y al investigador principal, y el
  APK rechaza esos lotes para evitar mezclarlos con el estudio móvil;
- `_meta.sessions[]` identifica cada carga y descarga con plataforma, versión de
  esquema, archivo y release terminológico. Los spans manuales y conceptos
  conservan además la plataforma donde fueron creados o seleccionados.

La telemetría se mantiene exclusivamente en memoria y en el JSON descargado:
no existe un backend analítico. Las consultas se guardan normalizadas y
agregadas por término y jerarquía para análisis posterior.

### Capa léxica v2

Los lotes con capa léxica habilitada permiten revisar cada aparición de una
abreviatura o forma breve, abstenerse sin adivinar y cerrar la revisión de modo
explícito. Los códigos, reglas de completitud, normalización de pistas, schema y
compatibilidad de recarga están definidos en
[`docs/CONTRATO_CAPA_LEXICA_V2.md`](docs/CONTRATO_CAPA_LEXICA_V2.md).

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

## SemantIAr Mobile · PWA (Sprint 1)

La aplicación puede instalarse como PWA desde Chrome en Android: abrí la página,
elegí **Instalar aplicación** o **Agregar a pantalla principal** y aceptá la
instalación. El Service Worker se registra únicamente en el build de producción
y conserva el shell de la aplicación para volver a abrirla sin red.

Esta primera fase no persiste anotaciones de pacientes fuera de la pestaña ni
sincroniza datos automáticamente: el avance sigue resguardándose mediante la
descarga del JSON. IndexedDB, reanudación y sincronización diferida pertenecen a
la Fase 2.

### Aplicación Android descargable

La web pública y la aplicación Android son dos entregables independientes:

- **Web / PWA:** <https://manwithbarba.github.io/semantiar_anotador/>
- **APK Android tester:** se publica como archivo descargable en
  [GitHub Releases](https://github.com/manwithbarba/semantiar_anotador/releases).

El APK es una versión pública de prueba para fines exclusivamente académicos.
Android puede solicitar autorización para instalar aplicaciones desde el
navegador o el gestor de archivos. Las actualizaciones del APK son manuales:
cuando haya una versión nueva, debe descargarse e instalarse desde Releases.

En Android, **Guardar avance** abre el selector del sistema para guardar o
compartir el JSON fuera de la aplicación. La web conserva la descarga habitual
del archivo en el navegador.

### Manual de SemantIAr App

La guía operativa específica para Android y PWA está disponible en:

- [Manual de uso en GitHub](docs/Manual_de_uso_SemantIAr_App.md).
- [Manual PDF descargable](https://manwithbarba.github.io/semantiar_anotador/manuales/Manual_de_uso_SemantIAr_App.pdf).

La aplicación Android incluye además una versión resumida embebida, accesible
desde **Ver manual de uso** en la pantalla inicial y desde **Más acciones**
durante la anotación. Desde ese panel puede guardarse o compartirse el PDF sin
salir del aplicativo.

## Release congelada para las celdas

`scripts/lock_assisted_annotation_corpus.py` aplica el postfiltro común a los
48 JSON y crea una release nueva con manifiesto SHA-256. La integridad se
comprueba con `scripts/verify_locked_corpus.py`. Una capa futura de GLiNER debe
generar una versión distinta y no modificar una release ya asignada.

El componente `src/app/bindings/autocomplete-binding` está portado del
`sct-implementation-demonstrator` (convertido a standalone) y consume un
`TerminologyService` mínimo (`src/app/services/terminology.service.ts`).

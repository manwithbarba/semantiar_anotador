# Contrato técnico de la capa léxica (Abreviaturas contextuales v2)

Este documento define el contrato ejecutable compartido por el modelo
TypeScript, el formulario Angular, la importación/exportación y el JSON Schema.
No reemplaza el manual de anotación.

## Nomenclatura unificada de interfaz

La interfaz presenta esta capa bajo la denominación **Abreviatura contextual / Forma breve**. En el flujo de **Revisión Unificada en 3 Pasos** (`1. Nota (Lectura y especialidad)` → `2. Marcación (Agregar o anular)` → `3. Decisiones (Clínico, Abreviatura o Ambos)`), las menciones pueden ser clasificadas como:
- **Solo información clínica** (Codificación SNOMED CT).
- **Solo abreviatura contextual** (Expansión literal y decisión contextual sin SNOMED CT).
- **Información clínica + abreviatura contextual** (Ambas capas integradas en la misma marca).
- **Sin valor clínico ni abreviatura (Anular)** (Registro explícito de rechazo / anulación).

## Códigos estables

| Campo | Código → etiqueta visible |
|---|---|
| `annotation.formType` | `abbreviation` → Abreviatura; `acronym` → Acrónimo pronunciable; `initialism` → Sigla / inicialismo; `alphanumeric` → Forma alfanumérica; `symbolic_abbreviation` → Abreviatura simbólica; `other` → Otra forma léxica |
| `annotation.decisionStatus` | `pending` → Pendiente; `resolved` → Sentido resuelto; `ambiguous` → Ambigua aun con contexto; `unknown` → No puedo determinarla; `new_sense_proposed` → Proponer sentido nuevo; `form_error` → Forma errónea o corrupta; `nonclinical` → Uso no clínico/estructural; `rejected` → No es abreviatura ni acrónimo (Anulada) |
| `annotation.function` | `null` → Sin clasificar; `header` → Encabezado; `entity` → Entidad clínica; `value` → Valor; `result` → Resultado; `modifier` → Modificador; `structural` → Marca estructural; `other` → Otra función |

`null` y `other` no son intercambiables: `null` conserva la ausencia de decisión
funcional; `other` registra una clasificación explícita. La función describe la
aparición y no crea automáticamente un concepto SNOMED CT.

## Preguntas de la interfaz y persistencia

| Pregunta para el anotador | Valor persistido |
|---|---|
| ¿Cómo está escrita? | `annotation.formType` |
| ¿Cómo se decide el significado? | `annotation.decisionStatus` |
| ¿Qué significa aquí? | `annotation.senseId`, sólo con `resolved` |
| ¿Qué significado proponés? | `annotation.proposedExpansion`, sólo con `new_sense_proposed` |
| ¿Cómo debería estar escrita? | `annotation.correctedForm`, sólo con `form_error` |
| ¿Qué papel cumple en esta parte de la nota? | `annotation.function` |
| ¿En qué parte de la nota aparece? | `annotation.section` |
| ¿Qué pistas usaste? | `annotation.evidenceCodes` |

`annotation.comment` se conserva por compatibilidad y trazabilidad de lotes
anteriores, pero no se presenta como un campo de captura en la tarjeta: la
interfaz reserva la captura semántica para `¿Qué significa aquí?` y sus campos
condicionales.

Los identificadores internos de sentido son el valor de persistencia del
selector, pero la interfaz muestra su expansión clínica y no el código. Los
offsets siguen guardados para trazabilidad y no se presentan al anotador.

## Reglas de cierre

- `pending` es sólo el estado inicial. Siempre bloquea `lexicalReview` y el
  cierre de la nota.
- `ambiguous` y `unknown` son abstenciones finales válidas. No requieren ni
  permiten un `senseId`.
- `resolved` requiere un `senseId` no vacío.
- `new_sense_proposed` requiere `proposedExpansion` no vacía.
- `form_error` requiere `correctedForm` no vacía.
- `nonclinical` y `rejected` son decisiones finales sin campo condicional.
- Al cambiar o importar una decisión se eliminan los campos condicionales que
  no corresponden al estado elegido.
- Una recarga v2 sólo conserva `lexicalReview.status = completed` y el cierre
  de la nota si todas las apariciones siguen cumpliendo estas reglas.

## Normalización en los límites JSON

`normalizeLexicalAnnotation` es la representación canónica de importación y
exportación:

1. recorta textos opcionales y convierte los vacíos en `null`;
2. recorta `evidenceCodes`, elimina vacíos y duplicados y conserva el primer
   orden de aparición;
3. no interpreta ese orden como ranking ni probabilidad;
4. mueve `POSIBLE_SEMANTICA_NO_CODIFICADA` desde `evidenceCodes` a `comment`;
5. conserva `function: null` como Sin clasificar;
6. limpia `senseId`, `proposedExpansion` y `correctedForm` cuando son
   incompatibles con `decisionStatus`.

`section` representa la ubicación estructural local dentro de la nota; no una
especialidad global.

## Sugerencias automáticas

La forma puede venir preseleccionada por una heurística de mayúsculas o dígitos
para mantener compatibilidad con los lotes v2. Es una sugerencia provisional que
el anotador debe revisar. Las mayúsculas no prueban por sí solas que una forma
sea `initialism`, y la escritura no determina su significado contextual.

## Schema y compatibilidad v2

La fuente canónica es
[`schemas/lexical-layer-v2.schema.json`](../schemas/lexical-layer-v2.schema.json).
El generador de releases la copia como `LEXICAL_LAYER_SCHEMA_V2.json` en Core
Blind, básico y avanzado. Los tres archivos deben conservar el mismo SHA-256.

No se renombró ningún código v2 ni se modifica el texto clínico, los offsets o
el inventario. La importación es deliberadamente tolerante con campos omitidos o
valores antiguos y los migra en memoria a la forma canónica; la exportación
siempre produce el contrato normalizado.

## Verificación reproducible

```text
npm.cmd test -- --watch=false
npm.cmd run build
python scripts/validate_lexical_contract_v2.py
```

El validador comprueba el schema canónico, la identidad de sus tres copias y
todos los archivos de casos de las releases v2 sin imprimir texto clínico.

# Contrato técnico de la capa léxica v2

> **Estado:** instantánea documental verificada contra el código del anotador en
> `main` (`8d74c75d3315698ab156011e0adfd485f10c8fe0`). No sustituye el schema
> ejecutable ni autoriza una release.
> **Procedencia:** `semantiar_anotador_tmp/docs/CONTRATO_CAPA_LEXICA_V2.md`
> **SHA-256 de la fuente:** `56e9c3ff03eb64c8703df5468cd0880bfd932f49f231abd88b275fc3eb7a5766`
> **Recuperación:** 2026-09-05.

## Nomenclatura de interfaz

La interfaz presenta esta capa como **Abreviatura contextual / Forma breve**.
En la revisión unificada de tres pasos, las menciones se clasifican como:

- **Solo información clínica**;
- **Solo abreviatura contextual**;
- **Información clínica + abreviatura contextual**;
- **Sin valor clínico ni abreviatura (Anular)**.

Una superposición parcial conserva dos marcas independientes y no equivale a
**Ambos**. Al ajustar los límites de una marca de doble capa se actualizan ambos
registros y la decisión léxica vuelve a `pending`.

## Códigos estables

| Campo | Código → etiqueta visible |
|---|---|
| `annotation.formType` | `abbreviation` → Abreviatura; `acronym` → Acrónimo pronunciable; `initialism` → Sigla/inicialismo; `alphanumeric` → Forma alfanumérica; `symbolic_abbreviation` → Abreviatura simbólica; `other` → Otra forma léxica |
| `annotation.decisionStatus` | `pending` → Pendiente; `resolved` → Sentido resuelto; `ambiguous` → Ambigua aun con contexto; `unknown` → No puedo determinarla; `new_sense_proposed` → Proponer sentido nuevo; `form_error` → Forma errónea o corrupta; `nonclinical` → Uso no clínico/estructural; `rejected` → No es abreviatura ni acrónimo |
| `annotation.function` | `null` → Sin clasificar; `header` → Encabezado; `entity` → Entidad clínica; `value` → Valor; `result` → Resultado; `modifier` → Modificador; `structural` → Marca estructural; `other` → Otra función |

`null` y `other` no son equivalentes: `null` conserva ausencia de decisión;
`other`, una clasificación explícita.

## Preguntas y persistencia

| Pregunta | Valor persistido |
|---|---|
| ¿Cómo está escrita? | `annotation.formType` |
| ¿Cómo se decide el significado? | `annotation.decisionStatus` |
| ¿Qué significa aquí? | `annotation.senseId`, sólo con `resolved` |
| ¿Qué significado proponés? | `annotation.proposedExpansion`, sólo con `new_sense_proposed` |
| ¿Cómo debería estar escrita? | `annotation.correctedForm`, sólo con `form_error` |
| ¿Qué papel cumple en esta parte de la nota? | `annotation.function` |
| ¿En qué parte de la nota aparece? | `annotation.section` |
| ¿Qué pistas usaste? | `annotation.evidenceCodes` |

`annotation.comment` se conserva por compatibilidad y trazabilidad, pero no es
el campo central de captura semántica. Los ids internos de sentido son valores
de persistencia; la interfaz muestra su expansión. Los offsets se conservan para
trazabilidad y no se presentan a la persona anotadora.

## Reglas de cierre

- `pending` bloquea `lexicalReview` y el cierre.
- `ambiguous` y `unknown` son abstenciones finales; no admiten `senseId`.
- `resolved` requiere `senseId`.
- `new_sense_proposed` requiere `proposedExpansion`.
- `form_error` requiere `correctedForm`.
- `nonclinical` y `rejected` son decisiones finales sin campo condicional.
- Al cambiar una decisión se eliminan campos incompatibles.
- Una recarga sólo conserva `lexicalReview.status = completed` y el cierre si
  todas las apariciones siguen siendo válidas.

## Normalización JSON

La representación canónica de importación/exportación:

1. recorta textos opcionales y convierte vacíos en `null`;
2. recorta `evidenceCodes`, elimina vacíos y duplicados y conserva el primer
   orden de aparición;
3. no interpreta el orden como ranking ni probabilidad;
4. mueve `POSIBLE_SEMANTICA_NO_CODIFICADA` desde `evidenceCodes` a `comment`;
5. conserva `function: null` como **Sin clasificar**;
6. limpia `senseId`, `proposedExpansion` y `correctedForm` cuando son
   incompatibles con `decisionStatus`.

`section` expresa ubicación estructural local, no especialidad global.

## Metadatos de candidatos

Una forma puede llegar preseleccionada por una heurística para compatibilidad
con lotes anteriores. Es una sugerencia provisional. En modo neutral, esos
metadatos de entrada no se muestran ni se exportan; forma y significado exigen
decisión humana.

## Fuente ejecutable y verificación

El schema ejecutable se conserva en el repositorio del anotador bajo la ruta
lógica `semantiar_anotador_tmp/schemas/lexical-layer-v2.schema.json`. Antes de
usar este contrato para una release se debe comprobar el schema, el código y las
pruebas en ese repositorio; esta copia no incorpora el schema ni datos clínicos.

# Contrato de interfaz y archivo · Calibración 3

> **Estado:** copia documental candidata; describe opciones de interfaz y
> completitud, pero requiere confirmación humana para una ronda operativa.
> **Procedencia:** `semantiar_anotador_tmp/anotador calibración 3/docs/CONTRATO_UI_JSON_CAL3.md`
> **SHA-256 de la fuente:** `2e6c5b7d1b64bc87029ec651f4959f9f1fb4085119c09407eca452fd8ac2bfaf`
> **Recuperación:** 2026-09-05.

## 1. Conceptos visibles

| En la pantalla | Significado |
|---|---|
| Nota | Texto completo asignado; no se edita. |
| Marca | Tramo propuesto para revisión; no es una respuesta. |
| Concepto clínico | Interpretación clínica expresada por una marca. |
| Forma breve | Abreviatura, sigla, acrónimo, código o encabezado cuyo sentido depende del contexto. |
| Literal | Palabras exactas seleccionadas. |
| Cierre | Confirmación de revisión completa sin pendientes. |

Las marcas clínicas y léxicas se conservan por separado. **Información clínica
+ abreviatura contextual** se usa cuando ambas revisiones corresponden al mismo
tramo exacto. Una superposición parcial representa dos marcas distintas.

## 2. Decisiones de una marca

| Opción | Cuándo usarla | Qué completar |
|---|---|---|
| **Solo información clínica** | Hallazgo, procedimiento o fármaco. | Categoría, concepto SNOMED CT y contexto. |
| **Solo abreviatura contextual** | Forma breve o encabezado relevante. | Significado o abstención, tipo, función, ubicación y pistas. |
| **Información clínica + abreviatura contextual** | Las dos capas usan el mismo tramo. | Ambas partes, de manera independiente. |
| **Sin valor clínico ni abreviatura (Anular)** | La marca no corresponde al estudio. | Motivo breve de anulación. |

## 3. Información clínica

- Elegir **Hallazgo clínico**, **Procedimiento** o **Fármaco**.
- Seleccionar un concepto que exprese el texto, no uno meramente parecido.
- Comprobar que la marca incluya sólo las palabras necesarias.
- Indicar polaridad, temporalidad, certeza y sujeto cuando estén expresados.

Una búsqueda sin resultados no obliga a elegir un concepto.

## 4. Forma breve

- Indicar cómo está escrita.
- Decidir qué significa en esa aparición.
- Señalar función y ubicación local cuando corresponda.
- Registrar sólo pistas observadas.

Mayúsculas, números y especialidad orientan, pero no prueban el significado.
**Ambigua** se usa cuando quedan dos sentidos posibles; **No puedo
determinarla**, cuando el contexto no alcanza.

## 5. Cierre

El contador baja sólo con **Revisada con conceptos** o **Sin conceptos
anotables** y cuando no queda nada pendiente. El cierre se bloquea si:

- hay una marca o forma breve sin decidir;
- falta un dato requerido;
- existe un concepto sin marca textual exacta;
- una forma breve sigue pendiente.

Una modificación posterior reabre la nota.

## 6. Archivo de avance

El archivo conserva texto original, marcas, decisiones, marcas temporales,
plataforma y estados de revisión. La recuperación local es sólo un respaldo del
navegador y puede contener texto clínico sin cifrado propio; no sustituye la
descarga ni debe mantenerse en equipos compartidos.

Para los detalles metodológicos, consultar el
[material técnico doctoral](MATERIAL_TECNICO_DOCTORAL_CAL3.md).

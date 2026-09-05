# Diccionario de datos en lenguaje operativo · Calibración 3

> **Estado:** copia documental candidata; no sustituye el JSON Schema
> ejecutable.
> **Procedencia:** `semantiar_anotador_tmp/anotador calibración 3/docs/CAL3_DICCIONARIO_DE_DATOS.md`
> **SHA-256 de la fuente:** `d5d314cae2d65bc01b91f93398b4cac30d5d5ed784bf527eb94da50879c8e0e9`
> **Recuperación:** 2026-09-05.

## 1. Datos de la nota

| Dato | Finalidad |
|---|---|
| Identificador de nota | Distinguir el caso revisado sin alterar ni repetir el id. |
| Texto original | Verificar que no se modificó durante la anotación. |
| Lote e identificador de anotador | Enrutar la entrega al equipo. |
| Fecha y plataforma | Trazar cada guardado. |

## 2. Datos de cada marca

| Dato | Finalidad |
|---|---|
| Literal | Mostrar el tramo exacto revisado. |
| Posición | Recuperar el tramo aunque el literal se repita. |
| Estado | Indicar aceptación, corrección o anulación. |
| Motivo de anulación | Explicar por qué la marca no corresponde. |
| Origen | Auditoría técnica; no se muestra durante la lectura inicial. |

Las superposiciones parciales conservan posiciones independientes. No se
duplican dos marcas exactamente iguales.

## 3. Datos clínicos

Cuando una marca contiene información clínica, se conservan:

- categoría: **Hallazgo clínico**, **Procedimiento** o **Fármaco**;
- concepto SNOMED CT y término;
- literal exacto;
- polaridad, temporalidad, certeza y sujeto;
- confirmación de revisión del contexto.

Todo concepto debe estar unido a una marca. Si no existe una interpretación
defendible, no se inventa una para completar el formulario.

## 4. Datos de formas breves

Se conservan:

- tipo de forma;
- significado local o abstención;
- función y ubicación en la nota;
- pistas observadas;
- corrección o propuesta nueva, sólo cuando corresponde.

**Ambigua** y **No puedo determinarla** son decisiones válidas y no deben llevar
un significado inventado.

## 5. Estados de la nota

- **Pendiente:** falta revisar o decidir.
- **Revisada con conceptos:** revisión completa con al menos un concepto válido.
- **Sin conceptos anotables:** revisión completa sin conceptos clínicos
  elegibles.

No se cierra con decisiones pendientes, campos requeridos vacíos ni conceptos
sin marca textual.

## 6. Privacidad

Los recursos públicos deben limitarse a la interfaz, schemas y ejemplos
sintéticos. Los lotes reales no se publican. El archivo de avance puede contener
texto clínico y se entrega sólo por el canal autorizado. El almacenamiento
local del navegador puede no estar cifrado por la aplicación y debe borrarse al
terminar, especialmente en equipos compartidos.

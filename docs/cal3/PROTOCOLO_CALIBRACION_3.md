# SemantIAr · Protocolo sencillo de la tercera calibración

> **Estado:** copia documental candidata; requiere confirmación de coordinación
> antes de distribuirse a anotadores.
> **Procedencia:** `semantiar_anotador_tmp/anotador calibración 3/docs/PROTOCOLO_CALIBRACION_3.md`
> **SHA-256 de la fuente:** `928c7172c51e6c49fde85c23b41803d2c9c2a2c71d704bdd5918615f689d6a9d`
> **Recuperación:** 2026-09-05.

**Versión de la fuente:** 27 de agosto de 2026
**Audiencia:** personas de la salud que participan como anotadoras
**Propósito:** que todas las personas revisen las notas de manera comparable

El [material técnico doctoral](MATERIAL_TECNICO_DOCTORAL_CAL3.md) explica el
diseño para el equipo investigador. Este documento indica qué hacer durante la
anotación.

## 1. Qué se evalúa

Se busca conocer si distintas personas pueden señalar las mismas expresiones,
interpretar su significado y elegir conceptos clínicos de manera consistente.
También se registran las instrucciones o pantallas que generan dudas.

La marca en pantalla es una ayuda, no una respuesta correcta. Cada anotador
debe tomar su propia decisión.

## 2. Cómo se asignan las notas

El equipo informa la cantidad de notas y el plazo. Las notas se reparten para
incluir variedad de ámbitos, dificultades y formas breves.

El trabajo es individual: no se consulta ni se comparte la decisión de otra
persona antes del cierre. Si una nota parece repetida o incorrectamente
asignada, se avisa a coordinación sin reemplazarla por otra.

## 3. Las tres etapas de cada nota

### Paso 1 · Leer

Leer toda la nota antes de mirar las marcas del lote. La especialidad puede ser
una orientación, pero no permite inventar menciones ni eliminar expresiones.

### Paso 2 · Marcar

Recorrer el texto completo. Para cada marca se puede:

- aceptar si el tramo es exacto;
- ajustar sus límites;
- anular si no corresponde al estudio;
- agregar una mención omitida.

Dos marcas parcialmente superpuestas pueden conservarse si representan cosas
distintas. No se duplica exactamente el mismo tramo.

### Paso 3 · Decidir y cerrar

Revisar una marca por vez con **Anterior / Siguiente**. Elegir:

- **Solo información clínica**;
- **Solo abreviatura contextual**;
- **Información clínica + abreviatura contextual** cuando ambas capas usan el
  mismo tramo exacto;
- **Sin valor clínico ni abreviatura (Anular)** cuando la marca no corresponde.

Completar sólo la información sustentada por la nota y cerrar cuando la cola no
tenga pendientes.

## 4. Cómo decidir sin adivinar

### Información clínica

Elegir **Hallazgo clínico**, **Procedimiento** o **Fármaco** y buscar el concepto
que mejor expresa el texto. Revisar polaridad, temporalidad, certeza y sujeto.

No agregar diagnósticos, fechas, gravedad o relaciones familiares que la nota
no mencione. Si ningún concepto es defendible, conservar la duda y avisar al
equipo.

### Forma breve

Indicar cómo está escrita, qué significa en esa aparición, qué función cumple,
en qué parte de la nota aparece y qué pistas sustentan la decisión.

Si hay dos significados posibles, elegir **Ambigua**. Si falta información,
elegir **No puedo determinarla**. Ambas opciones son válidas; no se inventa una
expansión.

## 5. Cierre

Una nota se cierra como:

- **Revisada con conceptos**, si queda al menos un concepto clínico válido;
- **Sin conceptos anotables**, si no queda ninguno.

Antes de cerrar:

- no quedan marcas o formas breves sin decidir;
- cada concepto está unido a una expresión exacta;
- no hay campos obligatorios vacíos;
- las dudas están registradas como tales.

Una modificación posterior reabre la nota.

## 6. Adjudicación de dudas

La adjudicación conserva las decisiones originales y registra la resolución.
No se cambia una decisión sólo para aumentar artificialmente la uniformidad. Si
una duda no se resuelve, se conservan las alternativas y el motivo.

## 7. Guardado y protección

Descargar avances con frecuencia y el archivo final al terminar. La descarga es
la copia de entrega y permite continuar en otro dispositivo.

La recuperación local puede contener texto clínico sin cifrado propio. No debe
usarse en equipos compartidos y debe borrarse al finalizar.

## 8. Información al equipo

El equipo compara decisiones, dudas y tiempo de trabajo. La persona anotadora no
calcula estadísticas; debe conservar las abstenciones, evitar respuestas
inventadas e informar reglas o pantallas confusas.

## 9. Decisiones de coordinación

Antes de distribuir el lote, coordinación confirma cantidad de notas, política
de desacuerdos, edición SNOMED CT, plataforma y fechas. Esas decisiones no se
toman dentro de la aplicación.

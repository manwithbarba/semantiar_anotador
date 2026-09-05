# Calibración 3 de SemantIAr · protocolo y material técnico

> **Estado:** copia documental candidata; requiere aprobación humana antes de
> usarse como protocolo operativo o fuente de afirmaciones del manuscrito.
> **Procedencia:** `semantiar_anotador_tmp/anotador calibración 3/docs/CAL3_PROTOCOLO_Y_MATERIAL_TECNICO.md`
> **SHA-256 de la fuente:** `54f0d44e65bfa843b9a7bfd1cafcf52304e6e8dba493b8b39d8a0c0f5e248f05`
> **Recuperación:** 2026-09-05.

**Versión del documento fuente:** CAL3-2026.08.27
**Alcance:** interfaz local de anotación, lotes asistidos y corpus *Core Blind*.
**Uso:** investigación doctoral y docencia; no es software médico.

## 1. Objetivo y preguntas de investigación

La tercera calibración debe medir la calidad de la decisión humana sobre tres
capas separables: (a) detección y límites de la mención, (b) clasificación
clínica y normalización SNOMED CT, y (c) resolución del significado local de
formas breves. El objetivo es medir la consistencia de decisiones tomadas sobre
el texto sin expansiones, categorías ni exclusiones semánticas automáticas.

Preguntas mínimas:

1. ¿La interfaz permite recuperar menciones omitidas y conservar límites
   defendibles, incluyendo solapamientos parciales?
2. ¿La ayuda terminológica reduce tiempo sin aumentar aceptación acrítica,
   especialmente en abreviaturas ambiguas?
3. ¿Las decisiones de abstención (`ambiguous`, `unknown`) se usan cuando la
   evidencia textual es insuficiente?
4. ¿La misma política produce resultados comparables entre anotadores independientes?

## 2. Diseño de la calibración

- **Unidad primaria:** una nota clínica desidentificada; la unidad de análisis
  secundaria es la aparición anotable.
- **Asignación:** estratificar por ámbito (ambulatorio/internación), densidad
  de menciones y presencia de formas breves. Registrar una semilla y un
  `assignmentId` por anotador; no reutilizar el orden de la nota como sustituto
  de aleatorización.
- **Muestra recomendada en la fuente:** 20–30 notas nuevas por anotador, con
  3–4 anotadores independientes por nota. Mantener un conjunto *holdout* que no
  se utilice para ajustar reglas durante la calibración.
- **Cegamiento:** ningún anotador ve origen, confianza, `matchedKey`, expansión
  propuesta, SCTID sugerido ni catálogo de sentidos candidatos. El modo *Core
  Blind* se abre sin resaltados; el modo asistido muestra sólo premarcas
  estructurales y exige lectura exhaustiva.
- **Adjudicación:** dos profesionales clínicos y una persona adjudicadora con
  experiencia terminológica revisan sólo los desacuerdos. Conservar la
  decisión de cada anotador y la resolución, sin sobrescribir el desacuerdo
  original.

Las cantidades y el esquema de adjudicación anteriores se conservan como
propuesta del documento fuente, no como decisiones confirmadas por este archivo.

## 3. Secuencia operacional en la interfaz

1. **Lectura:** leer toda la nota antes de resolver una aparición. La
   especialidad es una pista general y nunca reemplaza la sección local.
2. **Marcación:** aceptar, ajustar, descartar o incorporar cada mención. Una
   selección manual debe guardar `start`, `end` y literal exactos en unidades
   UTF-16. Las superposiciones parciales son independientes; no crear una
   segunda marca para representar sólo granularidad.
3. **Decisión y cierre:** clasificar cada aparición como clínica, léxica, ambas
   o excluida. Completar el detalle, declarar abstención cuando corresponda y
   cerrar sólo con cero pendientes. La descarga de avance es el mecanismo de
   recuperación y entrega.

La lectura y la decisión son fases distintas para reducir el anclaje. Ningún
atributo semántico precalculado, expansión ni estado de procedencia debe
aparecer antes de que la persona termine la lectura de la nota.

## 4. Política lingüística y semántica clínica

- **Mención vs. concepto:** el span representa una expresión del texto; el
  concepto representa una interpretación clínica defendible. Nunca inferir un
  diagnóstico a partir de un valor aislado, una sección o una abreviatura.
- **Forma breve:** registrar la superficie y su función discursiva (encabezado,
  entidad, valor, resultado, modificador o estructural). Las mayúsculas o los
  dígitos son pistas ortográficas, no prueba de significado.
- **Ambigüedad:** `ambiguous` significa que sobreviven dos o más lecturas
  plausibles; `unknown` significa que no hay evidencia suficiente. Ambas son
  resultados finales válidos y no requieren un `senseId`.
- **Contexto clínico:** polaridad, certeza, temporalidad y sujeto se anotan sólo
  si el texto los expresa. No convertir la ausencia de negación en una certeza
  clínica automática.
- **Spans discontinuos:** la versión CAL3 utiliza spans continuos. Si un tramo
  continuo incorpora material ajeno y dividirlo altera el sentido, registrar el
  caso para adjudicación en vez de forzar offsets.

## 5. Métricas y denominadores

Reportar por separado detección, límites, categoría y normalización:

- precisión, exhaustividad y F1 de menciones con coincidencia estricta de
  límites; añadir una tabla de coincidencia parcial para diagnóstico;
- acuerdo por categoría y por estado léxico (κ de Cohen para pares; α de
  Krippendorff o Fleiss sólo cuando el número de anotadores sea constante);
- acuerdo de concepto por SCTID y por jerarquía, sin premiar un SCTID elegido
  por una ayuda semántica no cegada;
- tasa de abstención, tasa de decisiones sin evidencia y proporción de campos
  incompletos al intentar cerrar;
- tiempo activo por nota, búsquedas y reformulaciones, errores de red y
  reaperturas. Registrar la plataforma sólo como metadato de trazabilidad y
  excluir pausas por inactividad.

Publicar siempre el denominador, el número de notas excluidas y el criterio de
desempate. No usar una precisión global que mezcle notas sin menciones con
notas de alta densidad.

## 6. Controles de calidad antes de liberar un lote

- validar el JSON contra el schema canónico y verificar que los SCTID sean
  cadenas;
- comprobar unicidad de `case.id` y `spanId`, offsets seguros UTF-16 y literal
  igual al texto normalizado;
- rechazar `resolved` sin `senseId`, `new_sense_proposed` sin propuesta y
  `form_error` sin corrección;
- impedir cierre con menciones o conceptos incompletos y registrar el motivo
  de exclusión cuando se anula un candidato;
- verificar que el payload público contenga sólo ejemplos sintéticos, schemas
  y recursos de la interfaz; los lotes clínicos quedan fuera de la publicación;
- adjuntar al resultado el hash de release, versión del schema, edición y
  versión de SNOMED CT, plataforma, semilla y marca temporal.

## 7. Decisiones que requieren aprobación humana

Antes de congelar la muestra, el equipo debe aprobar por escrito: endpoint
principal, política de abstención, versión/edición SNOMED CT, definición de
forma breve, granularidad clínica, tratamiento de spans discontinuos, número de
adjudicadores, plataforma de acceso y qué campos de telemetría se conservan.
La aplicación no debe resolver estas decisiones por defecto.

## 8. Lecturas teóricas orientativas

El marco combina lingüística de corpus (mención, función y contexto),
ingeniería de datos trazable (contratos, normalización, hashes y *holdout*) y
semántica clínica (jerarquías SNOMED CT, contexto y abstención). Para la
redacción doctoral, distinguir explícitamente **acuerdo de anotación**,
**calidad de normalización** y **utilidad de la interfaz**: son constructos
relacionados, pero no intercambiables.

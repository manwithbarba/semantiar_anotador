# SEMANTIAR · Anotador SNOMED CT — Descripción de la implementación

Documento técnico del anotador clínico del proyecto **SEMANTIAR** (creación de un
corpus clínico en español rioplatense anotado con SNOMED CT). Está pensado como
fuente para una comunicación científica: describe la arquitectura, la
integración con el servidor de terminología, el mecanismo de autocompletado, y
las decisiones de diseño relevantes para la reproducibilidad.

---

## 1. Resumen y arquitectura

El anotador es una **aplicación web de página única (SPA)**, desarrollada en
**Angular 21**, que se ejecuta enteramente en el navegador (*client-side*), sin
servidor de aplicación propio. Su único servicio externo es un **servidor de
terminología FHIR** (Snowstorm), consultado en tiempo real mediante peticiones
HTTP desde el navegador.

Flujo de trabajo del anotador:

1. **Carga** de un conjunto de textos clínicos desde un archivo JSON.
2. **Anotación**: por cada concepto clínico identificado en el texto, el
   anotador selecciona una **categoría** (jerarquía SNOMED CT), busca y elige el
   **concepto** mediante un buscador incremental restringido a esa jerarquía, y
   registra el **span textual literal** y el **contexto clínico**
   (polaridad, certeza, temporalidad, sujeto).
3. **Exportación** de las anotaciones a un archivo JSON.

Componentes principales del código:

| Componente | Rol |
|---|---|
| `AnnotatorComponent` (`src/app/annotator/`) | Interfaz de anotación, carga/exportación, gestión de estado. |
| `AutocompleteBindingComponent` (`src/app/bindings/autocomplete-binding/`) | Buscador incremental de conceptos (portado del *sct-implementation-demonstrator* de SNOMED International). |
| `TerminologyService` (`src/app/services/terminology.service.ts`) | Capa de acceso al servidor FHIR: expansión de ValueSets, *lookup*, detección de edición. |
| `annotation.model.ts` (`src/app/models/`) | Modelo de datos, categorías y correspondencia categoría → ECL. |

La aplicación no persiste datos en ningún servidor: el estado vive en memoria del
navegador y la salida es un archivo descargado por el usuario. Esto satisface el
requisito de **doble ciego** del protocolo de calibración (cada anotador trabaja
de forma aislada) y simplifica el despliegue.

---

## 2. Modelo de datos

### 2.1 Entrada

```json
{
  "project": "SEMANTIAR - ...",
  "batch": "CALIBRACIÓN_ANOTADOR",
  "annotatorId": "A048",
  "sourceFile": "SEMANTIAR_CAL_A048.xlsx",
  "cases": [
    { "id": "CAL-001", "text": "Paciente con fiebre, tos productiva y diagnóstico de neumonía." }
  ]
}
```

Solo `cases[].id` y `cases[].text` son obligatorios. El texto clínico no se
modifica durante la anotación (trazabilidad).

### 2.2 Salida

Cada caso incorpora un arreglo `concepts[]`; cada concepto es una anotación
completa:

```json
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
```

El documento de salida agrega metadatos de exportación (`exportedAt`,
`terminologyServer`, `editionUri`) que documentan **con qué edición y servidor**
se produjo la anotación —dato esencial para la reproducibilidad terminológica—.

---

## 3. Integración con el servidor de terminología

### 3.1 Servidor y estándar

El anotador consume un **servicio de terminología FHIR R4** provisto por
**Snowstorm / SnowstormX** (la implementación de referencia de SNOMED
International). La comunicación se realiza exclusivamente sobre las operaciones
estándar del recurso FHIR, sin dependencias de la API nativa de Snowstorm, lo que
hace la aplicación portable a cualquier servidor de terminología FHIR compatible.

Servidor utilizado: `https://implementation-demo.snomedtools.org/fhir`.

### 3.2 Operación `ValueSet/$expand` con ValueSets implícitos de SNOMED CT

El corazón de la integración es la operación FHIR
[`ValueSet/$expand`](https://hl7.org/fhir/R4/valueset-operation-expand.html),
combinada con los **ValueSets implícitos de SNOMED CT** definidos en la
especificación FHIR. En lugar de crear y publicar un ValueSet, se referencia uno
*intensional* mediante una URI canónica que embebe una expresión **ECL**
(*Expression Constraint Language*):

```
http://snomed.info/sct?fhir_vs=ecl/<expresión-ECL>
```

La URL efectiva que construye `TerminologyService.expandBindingAnswerValueSet()`
es:

```
{base}/ValueSet/$expand
    ?url={edición}?fhir_vs=ecl/{ECL}
    &count=50
    &offset=0
    &filter={texto-de-búsqueda}
    &language={idioma}
    &displayLanguage={idioma}
```

Parámetros:

- **`url`** — ValueSet implícito: la edición SNOMED CT más la restricción ECL que
  define el subconjunto candidato (ver §4).
- **`filter`** — cadena de búsqueda del usuario; el servidor la interpreta como
  búsqueda incremental de términos (ver §5.2).
- **`count` / `offset`** — paginación; el buscador solicita hasta 50 resultados.
- **`language` / `displayLanguage`** — idioma de los términos devueltos
  (español o inglés, según la edición detectada, §3.3).

El servidor responde un `ValueSet` expandido cuyo arreglo `expansion.contains[]`
contiene los conceptos candidatos, cada uno con `code` (SCTID) y `display`
(término preferido en el idioma solicitado).

**Ejemplo reproducible** (edición Internacional, jerarquía *Clinical finding*,
búsqueda «heart»):

```
GET https://implementation-demo.snomedtools.org/fhir/ValueSet/$expand
    ?url=http://snomed.info/sct?fhir_vs=ecl/<<404684003
    &count=10&filter=heart&displayLanguage=en
```

### 3.3 Detección automática de edición e idioma

Al iniciar (y bajo demanda con el botón «Re-detectar edición»), el anotador
consulta el catálogo de ediciones del servidor:

```
GET {base}/CodeSystem?_elements=version,url
```

y examina las versiones disponibles:

- Si existe una versión de la **edición argentina de SNOMED CT**
  (módulo `http://snomed.info/sct/11000221109`), se selecciona esa edición y el
  idioma de visualización pasa a **español** (`es`).
- En caso contrario, se usa como *fallback* la **edición Internacional**
  (`http://snomed.info/sct`) con términos en **inglés** (`en`).

Este mecanismo permite que, al incorporarse la edición nacional al servidor, la
aplicación la adopte automáticamente sin cambios de código, y deja registrada en
la exportación la edición efectivamente usada.

---

## 4. Restricción semántica por jerarquía (ECL)

Cada anotación se ancla a una de las **jerarquías SNOMED CT** habilitadas. El
anotador primero elige la categoría; esa elección determina la expresión ECL que
restringe el ValueSet candidato, de modo que la búsqueda **solo** puede devolver
conceptos de la jerarquía correcta. Esto reduce errores de clasificación y alinea
las anotaciones con el modelo de referencia.

Correspondencia categoría → ECL (los conceptos raíz fueron verificados como
activos mediante la operación `CodeSystem/$lookup`):

| Categoría | ECL | Concepto raíz |
|---|---|---|
| Hallazgo clínico | `<<404684003` | *Clinical finding (finding)* |
| Procedimiento | `<<71388002` | *Procedure (procedure)* |
| Fármaco | `<<373873005` | *Pharmaceutical / biologic product (product)* |

El operador ECL `<<` denota «el concepto y todos sus descendientes»
(*descendant-or-self*), es decir, toda la jerarquía transitiva bajo la raíz. El
conjunto de categorías es configurable en `annotation.model.ts`; en la fase
actual se limitó a estas tres.

---

## 5. Buscador incremental (autocompletado)

El buscador (`AutocompleteBindingComponent`) combina un **flujo reactivo del lado
del cliente** con la **búsqueda de términos del servidor**.

### 5.1 Flujo reactivo del cliente

La entrada del usuario se procesa con RxJS mediante la siguiente cadena
(`valueChanges` del control de formulario):

1. **`debounceTime(300)`** — espera 300 ms de inactividad de tecleo antes de
   consultar, evitando una petición por pulsación.
2. **`distinctUntilChanged()`** — descarta valores repetidos.
3. **Umbral de 3 caracteres** — no se consulta al servidor con menos de 3
   caracteres, reduciendo ruido y carga.
4. **`switchMap`** — cancela la petición anterior si el usuario sigue tecleando,
   garantizando que solo se procese la búsqueda más reciente (evita condiciones
   de carrera).
5. **`concat(of([]), petición)`** — emite primero una lista vacía (limpia el
   panel de resultados de inmediato) y luego el resultado del servidor.
6. **`map(r => r.expansion.contains ?? [])`** — extrae los conceptos de la
   respuesta FHIR.
7. **`catchError`** — ante error de red o del servidor, devuelve lista vacía sin
   interrumpir la sesión.
8. **`finalize`** — apaga el indicador de carga.

El resultado se muestra como lista de opciones; al seleccionar una, se almacenan
el `code` (SCTID) y `display` (término) del concepto.

### 5.2 Búsqueda multi-prefijo del servidor

El parámetro `filter` de `$expand` activa la **búsqueda de términos de Snowstorm**,
que es de tipo **multi-prefijo**:

- La cadena de búsqueda se **tokeniza** en palabras.
- Cada token se compara como **prefijo** (no requiere la palabra completa) contra
  las palabras de todas las descripciones activas de cada concepto.
- Un concepto coincide cuando **todos** los tokens encuentran alguna palabra
  (lógica **AND**), **independientemente del orden** en que se escriban.

Esto habilita búsquedas abreviadas y desordenadas. Ejemplos empíricos (edición
Internacional, jerarquía *Clinical finding*):

| Consulta (`filter`) | Primer resultado |
|---|---|
| `ac myo inf` | *Acute myocardial infarction* |
| `diab typ 2` | *Type 2 diabetes mellitus* |

En `diab typ 2`, los tokens `diab`→*diabetes*, `typ`→*type*, `2`→*2* coinciden
como prefijos y el orden de la consulta no coincide con el del término preferido;
aun así el concepto correcto se recupera. Esta característica es especialmente
útil para anotadores que trabajan con abreviaturas y jerga clínica.

### 5.3 Ordenamiento de resultados

Los resultados se devuelven ordenados por el criterio de relevancia de Snowstorm,
cuyo componente principal es la **longitud de la descripción que produjo la
coincidencia**: a menor longitud de la descripción coincidente, mayor jerarquía
en el orden. La intuición es que un término breve que contiene las palabras
buscadas suele ser el concepto más general y probable, mientras que las
descripciones más largas corresponden a conceptos más específicos.

Un matiz importante para interpretar el orden: la búsqueda se evalúa contra
**todas las descripciones activas** del concepto (término preferido y
sinónimos), pero lo que se **muestra** al anotador es el **término preferido
(PT)** en el idioma solicitado. En consecuencia, la coincidencia y el
ordenamiento pueden basarse en un **sinónimo** cuya longitud difiere de la del PT
mostrado. Cuando eso ocurre, el orden visible —leído sobre los PT— **no parece
monótono por longitud**, aunque el criterio subyacente (longitud de la
descripción coincidente) sí lo sea.

Ejemplo ilustrativo (búsqueda «heart», jerarquía *Clinical finding*): entre los
primeros resultados aparece *Myocardial infarction* (PT de 21 caracteres) por
encima de términos con PT más corto. La razón es que la coincidencia con «heart»
se produjo sobre el **sinónimo** *Heart attack* (descripción corta), que
determina su posición en el ranking; pero la interfaz exhibe el PT
*Myocardial infarction*. El criterio de orden es, por tanto, consistente respecto
de la descripción coincidente, aunque no lo aparente al observar únicamente los
términos preferidos.

El anotador **no reordena** los resultados en el cliente: respeta estrictamente
el orden provisto por el servidor de terminología.

> Nota metodológica: al analizar el orden de resultados no debe asumirse una
> clasificación por longitud del término preferido. El ordenamiento se rige por
> la longitud de la **descripción que hizo match**, que puede ser un sinónimo
> distinto del término mostrado.

---

## 6. Modelo de anotación de contexto clínico

Además del código SNOMED CT, cada anotación registra cuatro atributos de
contexto, alineados con las necesidades de un corpus clínico:

| Atributo | Valores | Propósito |
|---|---|---|
| **Polaridad** | Activo / Negado | Distinguir afirmación de negación (p. ej. «sin neumonía»). |
| **Certeza** | Confirmado / Sospecha / Diferencial | Grado de certeza diagnóstica. |
| **Temporalidad** | Actual / Histórico | Problema presente vs. antecedente. |
| **Sujeto** | Paciente / Familiar | A quién refiere el hallazgo. |

También se registra el **texto literal** (span exacto copiado del texto fuente),
lo que permite vincular cada código con su expresión en español rioplatense —base
para estudios de cobertura terminológica y de sinónimos locales— y un campo de
**comentarios** por caso para dudas del anotador.

---

## 7. Flujo de trabajo, progreso y trazabilidad

- **Indicador de progreso**: la interfaz muestra la proporción de casos con al
  menos un concepto codificado; al completarse todos, el control de descarga
  cambia de estado para señalar que la tarea está lista.
- **Control de trabajo sin guardar**: un indicador interno (`dirty`) marca si hay
  anotaciones no descargadas; la acción «Limpiar y empezar de nuevo» solicita
  confirmación explícita antes de descartar trabajo no exportado.
- **Metadatos de exportación**: cada archivo de salida incluye la fecha/hora, el
  servidor y la edición utilizados, dejando registro del contexto terminológico
  de la anotación.
- **Finalización explícita**: cada nota se cierra como `coded` o
  `no-eligible-concepts`. Cualquier edición posterior la reabre, por lo que una
  nota revisada sin conceptos no se confunde con una nota aún pendiente.
- **Telemetría local comparable**: `_meta.telemetry` registra métricas del flujo
  asistido con spans separadas por plataforma. Incluye tiempo activo por
  nota, visitas, reaperturas, operaciones de edición, episodios/peticiones de
  búsqueda con latencia, resultados vacíos, errores, rango seleccionado y métricas
  pasivas de interfaz (`clicksTotal`, `clicksByTarget`, `deletionsTotal`, `deletionsByType`).
  La inactividad se corta a los 120 segundos y la pestaña oculta no acumula
  tiempo. Core Blind es un flujo exclusivo del investigador principal en la
  página web y no participa de la comparación Android–web; el APK bloquea su
  apertura.
- **Privacidad operativa**: no se envían métricas a un backend. Las consultas
  terminológicas se resumen normalizadas por término y jerarquía exclusivamente
  dentro del JSON que descarga el anotador.

---

## 8. Consideraciones de implementación y despliegue

- **Sin backend**: toda la lógica corre en el navegador; el servidor de
  terminología es el único servicio externo. Esto reduce superficie de ataque,
  costos y complejidad operativa.
- **CORS**: las peticiones a `$expand`, `$lookup` y `CodeSystem` se hacen
  *cross-origin* desde el navegador; el servidor de terminología debe habilitar
  CORS para el origen de la aplicación.
- **Portabilidad**: al usar solo operaciones FHIR estándar (`$expand`,
  `$lookup`, `CodeSystem`), el anotador funciona con cualquier servidor de
  terminología FHIR que soporte los ValueSets implícitos de SNOMED CT y ECL.
- **Despliegue**: la aplicación se compila a estáticos y se publica en GitHub
  Pages mediante integración continua; cada cambio en la rama principal se
  despliega automáticamente.

---

## 9. Reproducibilidad

Las siguientes peticiones ilustran la interacción real y pueden ejecutarse contra
el servidor para reproducir el comportamiento descrito.

Detección de ediciones:

```
GET https://implementation-demo.snomedtools.org/fhir/CodeSystem?_elements=version,url
```

Expansión con restricción de jerarquía y filtro (Hallazgo clínico, «fiebre»/«fever»):

```
GET https://implementation-demo.snomedtools.org/fhir/ValueSet/$expand
    ?url=http://snomed.info/sct?fhir_vs=ecl/<<404684003
    &count=50&offset=0&filter=fever&language=en&displayLanguage=en
```

Verificación de un concepto (lookup):

```
GET https://implementation-demo.snomedtools.org/fhir/CodeSystem/$lookup
    ?system=http://snomed.info/sct&code=386661006
```

---

## 10. Comparación exploratoria de la calibración inicial

### 10.1 Alcance y referencia utilizada

La primera calibración reunió 38 entregas sobre los mismos diez casos. Sus
resultados se compararon con un **conjunto de referencia provisional generado
automáticamente**. Esa referencia sirvió para ordenar la devolución formativa y
detectar patrones de error; no constituye consenso clínico, conjunto de
referencia humano adjudicado ni certificación del desempeño de las personas
anotadoras.

Por esa razón, las cifras de esta sección son **descriptivas y exploratorias**.
Tampoco representan concordancia entre anotadores: cada entrega se comparó por
separado con la referencia provisional.

### 10.2 Normalización, similitud y emparejamiento de menciones

Antes de comparar los textos seleccionados, la rutina histórica normalizó cada
literal mediante descomposición Unicode NFKD, eliminación de diacríticos,
conversión a minúsculas, compactación de espacios y recorte de puntuación en los
extremos.

Sean `a` y `b` dos *spans* normalizados. La similitud textual `S(a,b)` se definió
de la siguiente manera:

- `1` cuando ambos textos eran idénticos;
- `max(0,60; longitud_menor / longitud_mayor)` cuando uno contenía al otro;
- `0,75 × O + 0,25 × R` en los demás casos, donde `O` es el coeficiente de
  solapamiento entre los conjuntos de palabras y `R` es la razón de similitud
  secuencial.

Sólo se consideraron candidatos con `S(a,b) ≥ 0,55`. El emparejamiento fue
uno-a-uno y voraz: se recorrieron los candidatos desde la mayor similitud y un
*span* ya emparejado no podía reutilizarse.

La implementación histórica empleó la coincidencia exacta de SCTID como
criterio secundario cuando dos candidatos tenían la misma similitud textual.
Esto puede modificar qué menciones quedan emparejadas y, por tanto, introduce
una dependencia entre la alineación de límites y la evaluación del concepto.
Se conserva aquí para reproducir las cifras históricas, pero refuerza su
carácter exploratorio. En una evaluación confirmatoria, el criterio de
emparejamiento deberá fijarse antes del análisis y depender exclusivamente del
*span*; la comparación de SCTID deberá realizarse después de congelar los pares.

### 10.3 Indicadores informados

La comparación histórica informó:

- **F1 de *span* flexible**: acepta los pares que superan el umbral de similitud;
- **F1 de *span* estricto**: exige igualdad del literal normalizado;
- **F1 de concepto flexible**: evalúa el SCTID en los pares admitidos por el
  emparejamiento flexible;
- **crédito jerárquico**: asigna crédito parcial a conceptos cercanos en la
  jerarquía de SNOMED CT;
- **F1 de concepto estricto**: exige coincidencia estricta de límites y SCTID;
- **precisión y exhaustividad (*recall*)** del concepto flexible;
- **kappa frente a la referencia provisional**: presencia o ausencia de cada
  etiqueta exacta en un universo de 1.087 etiquetas, calculada para cada
  persona anotadora y luego resumida.

Para el crédito jerárquico se buscó un ancestro común y se sumó la distancia de
ambos conceptos hasta él. La distancia se dividió por diez y se limitó a uno;
el crédito fue `1 − distancia`. Si no existía un ancestro común recuperable, el
crédito era cero.

Los resultados agregados fueron: F1 de *span* flexible 0,642; F1 de *span*
estricto 0,359; F1 de concepto flexible 0,347; crédito jerárquico 0,483; F1 de
concepto estricto 0,225; precisión 0,406; exhaustividad 0,314; mediana individual
del F1 de concepto flexible 0,361; y kappa medio frente a la referencia
provisional 0,177.

### 10.4 Interpretación de los errores

Las banderas de error no son categorías mutuamente excluyentes. Una misma
mención puede contribuir, por ejemplo, a un límite impreciso y a un SCTID
incorrecto; además, la relación jerárquica inadecuada es un subconjunto de las
discordancias de SCTID. Por eso, los 3.977 registros de la tabla del capítulo
son marcas de error y no casos únicos. Sus porcentajes expresan la participación
de cada marca sobre ese total y no deben sumarse ni interpretarse como tasa de
personas o de notas afectadas.

La evaluación confirmatoria requerirá un conjunto de referencia humano
adjudicado, reglas de emparejamiento congeladas y una muestra independiente.
Sólo entonces corresponderá estimar concordancia entre anotadores y desempeño
frente a una referencia de evaluación.

---

## 11. Capa léxica v2 por aparición

La capa léxica se ejecuta en paralelo con la anotación clínica SNOMED CT, pero
conserva una unidad de decisión diferente: **cada aparición textual** de una
abreviatura, sigla o acrónimo. Una misma forma puede recibir sentidos distintos
en una misma nota si cambian la sección, la plantilla o el contexto local.

Cada caso de un lote v2 contiene:

- `lexicalMentions`: apariciones con identificador estable, offsets exactos,
  literal, origen del candidato, sentidos posibles no ordenados y una
  `annotation` editable;
- `lexicalReview`: cierre explícito de la revisión exhaustiva de la nota;
- `_lexicalInventory` en el documento: inventario provisional único de sentidos
  posibles, sin probabilidades, ranking ni sentido preferido.

Las decisiones admitidas son `resolved`, `ambiguous`, `unknown`,
`new_sense_proposed`, `form_error`, `nonclinical` y `rejected`, además del estado
transitorio `pending`. La interfaz exige información adicional sólo cuando la
decisión la necesita: `senseId` para `resolved`, expansión para un sentido nuevo
y forma corregida para un error de escritura. La abstención explícita evita
forzar una expansión cuando el contexto no alcanza.

El anotador puede seleccionar texto de la nota e incorporarlo directamente a la
capa léxica. Esto permite recuperar omisiones de los candidatos automáticos y
hace posible una revisión exhaustiva tanto en los lotes asistidos como en el
Core Blind. Las apariciones agregadas manualmente pueden eliminarse; los
candidatos distribuidos se conservan en el registro y pueden marcarse
`rejected` o `nonclinical`.

La nota no puede finalizarse hasta que:

1. todas las apariciones léxicas tengan una decisión válida;
2. el anotador confirme el cierre de `lexicalReview`;
3. también se hayan resuelto los candidatos y conceptos de la capa clínica.

En los lotes asistidos se premarcan candidatos mediante inventario, diccionario
filtrado y una heurística ortográfica conservadora. Esas fuentes sólo proponen
**dónde mirar**: no asignan un sentido, no muestran puntajes y no aplican una
prioridad por especialidad. En el Core Blind del investigador principal no se
incluyen candidatos léxicos y todas las apariciones se crean manualmente desde
cero.

Las liberaciones v2 son derivados bloqueados: mantienen intactos los lotes v1,
registran el hash del padre y publican su propio manifiesto SHA-256. El control
de acceso exclusivo del Core Blind se expresa como política de liberación; la
aplicación no sustituye los permisos del sistema de archivos ni la gestión de
identidades.

El contrato ejecutable completo —códigos, preguntas visibles, normalización,
dependencias entre estados y compatibilidad de recarga— se mantiene en
[`CONTRATO_CAPA_LEXICA_V2.md`](CONTRATO_CAPA_LEXICA_V2.md). El JSON Schema
canónico está en `schemas/lexical-layer-v2.schema.json`; el generador lo copia a
las tres releases para evitar divergencias.

---

## 12. Limitaciones y trabajo futuro

- **Idioma dependiente de la edición**: mientras la edición argentina no esté
  disponible en el servidor, la búsqueda opera sobre la edición Internacional en
  inglés; los términos en español rioplatense se capturan por ahora en el campo
  de texto literal.
- **Dominios acotados**: en la fase actual solo se habilitan tres jerarquías
  (Hallazgo, Procedimiento, Fármaco). Sustancia, Estructura corporal y Organismo
  están previstas y son triviales de reactivar.
- **Poscoordinación**: el anotador registra conceptos precoordinados; la
  anotación con expresiones poscoordinadas (ECL/expresiones compuestas) queda como
  posible extensión.
- **Concordancia entre anotadores**: la estructura de salida (código + contexto +
  span literal) está diseñada para permitir el cálculo posterior de acuerdo
  inter-anotador (p. ej. índices de concordancia sobre SCTID y sobre atributos de
  contexto).

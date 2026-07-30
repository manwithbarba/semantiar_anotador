# Manual de uso de SemantIAr App

Versión tester para Android y PWA - uso exclusivamente académico.

SemantIAr App permite revisar notas clínicas, registrar formas breves y codificar
conceptos con SNOMED CT. No es software médico y no debe utilizarse para tomar
decisiones asistenciales. Cargue únicamente archivos provistos por el equipo de
investigación y sin datos identificatorios de pacientes.

## 1. Instalar o abrir la aplicación

### Android (APK)

1. Descargue la versión tester desde
   [GitHub Releases](https://github.com/manwithbarba/semantiar_anotador/releases).
2. Abra el archivo APK descargado.
3. Si Android lo solicita, autorice temporalmente la instalación desde el
   navegador o gestor de archivos utilizado.
4. Instale la aplicación y ábrala desde el icono **SemantIAr App**.

Las actualizaciones del APK son manuales: cuando se publique una versión nueva,
debe descargarla e instalarla desde Releases.

### Página web / PWA

Abra <https://manwithbarba.github.io/semantiar_anotador/>. En Chrome para
Android puede elegir **Instalar aplicación** o **Agregar a pantalla principal**.

## 2. Cargar el JSON asignado

1. Pulse **Cargar archivo JSON**.
2. Seleccione exclusivamente el archivo correspondiente a su ID de anotador.
3. Compruebe que aparezcan las notas y el contador de progreso.

La aplicación acepta un JSON nuevo y también un JSON de avance descargado
anteriormente. El archivo de avance permite continuar el trabajo en otra sesión.

## 3. Trabajar sobre cada nota

Use el selector **Ir a una nota** para pasar de un caso a otro. Dentro de cada
caso, los accesos **Nota**, **Formas**, **Conceptos** y **Cierre** llevan
directamente a cada etapa, evitando desplazamientos largos.

### Revisar la nota y los spans

- Lea la nota completa, aunque existan términos resaltados.
- Un resaltado es un candidato: puede aceptarlo, descartarlo o ajustar sus
  límites.
- Para incorporar una mención omitida, seleccione su expresión exacta en la
  nota y use la acción de incorporación.
- En los lotes sin preanotaciones, agregue las menciones desde cero.

### Revisar formas breves

Revise cada abreviatura, sigla o acrónimo según su contexto local:

1. Indique cómo está escrita.
2. Decida si puede establecer su significado.
3. Registre su función y sección cuando corresponda.
4. Complete todas las tarjetas y confirme la revisión de formas.

No adivine. Las opciones de abstención o ambigüedad son decisiones válidas
cuando el contexto no permite resolver el significado.

### Codificar conceptos clínicos

Para cada mención clínicamente relevante:

1. Elija la jerarquía: **Hallazgo clínico**, **Procedimiento** o **Fármaco**.
2. Busque el concepto y selecciónelo de la lista de SNOMED CT.
3. Verifique el texto literal de la nota.
4. Complete polaridad, certeza, temporalidad y sujeto.

La selección queda registrada inmediatamente en la sesión. Puede agregar tantos
conceptos como sean necesarios.

## 4. Cerrar cada nota

Al terminar la revisión exhaustiva, elija una de estas opciones:

- **Revisada con conceptos**, si codificó uno o más conceptos.
- **Sin conceptos anotables**, si la nota no contiene conceptos elegibles.

El contador de pendientes disminuye solamente al cerrar la nota. Si modifica una
nota cerrada, vuelve automáticamente a estado pendiente y debe cerrarla otra vez.

## 5. Guardar, continuar y entregar

Pulse **Guardar avance** con frecuencia. En Android se abre el selector del
sistema para guardar o compartir el JSON. En la web se descarga el archivo.

- Si todavía no terminó, conserve ese JSON y vuelva a cargarlo para continuar.
- Cuando todas las notas estén cerradas, descargue el JSON final.
- Envíe el archivo final al responsable del estudio por el canal indicado.

La aplicación no guarda anotaciones en GitHub ni en un servidor propio. Mientras
no descargue el JSON, los cambios permanecen solamente en la sesión actual.

## 6. Privacidad y funcionamiento sin conexión

- No cargue nombres, documentos, direcciones ni otros identificadores de
  pacientes.
- El shell de la PWA puede abrirse sin red después de instalarse, pero la
  búsqueda terminológica puede requerir conexión.
- No elimine el JSON de avance hasta confirmar que fue guardado o enviado
  correctamente.

## 7. Solución de problemas

- **El contador no disminuye:** complete las decisiones requeridas y cierre la
  nota desde la sección **Cierre**.
- **No puedo cerrar una nota:** revise las formas breves pendientes y confirme
  su revisión; verifique también si corresponde agregar o eliminar conceptos.
- **No aparece una mención:** selecciónela en el texto e incorpórela manualmente.
- **Perdí el avance:** busque el último JSON descargado y vuelva a cargarlo.
- **La búsqueda no responde:** compruebe la conexión y reintente; si continúa,
  registre la incidencia y comuníquela al equipo investigador.

## 8. Alcance

SemantIAr App es una versión tester pública, en actualización continua y
destinada exclusivamente a investigación y docencia. Para el protocolo
metodológico completo consulte los manuales oficiales del proyecto.

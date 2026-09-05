# Gobernanza de la wiki de SemantIAr Anotador

> **Estado:** síntesis sanitizada para preservar el modelo de gobernanza; no
> modifica permisos ni publica contenido.
> **Fuentes:**
> `semantiar_anotador_tmp/docs/wiki-google-sites/README.md` — SHA-256
> `35c27b785b13ef0afcf2c381992760819f2f63d7c75c63b970dd5f8a35d15bc6`
> `semantiar_anotador_tmp/docs/wiki-google-sites/06_COMO_COLABORAR.md` — SHA-256
> `62a70e575e5e033292f617514fc6fc7676d4dfecdb3ec7d64852a23db122123b`
> `semantiar_anotador_tmp/docs/wiki-google-sites/REVISION_DEL_PLAN.md` — SHA-256
> `e7b79e629e874f3a402cee288714d5663ddd18f69ae1a72c045f51934edfc1a7`
> **Recuperación:** 2026-09-05.

## Función

La wiki es una capa editorial para enseñar el flujo, registrar dudas y proponer
mejoras. No reemplaza contratos técnicos, protocolos aprobados ni archivos
versionados.

## Separación de permisos

- **Lectura:** puede habilitarse por enlace cuando el contenido haya sido
  revisado para publicación.
- **Edición:** sólo cuentas autorizadas.
- **Publicación y permisos:** coordinación.
- **Comentarios y dudas:** plantilla sin texto clínico, JSON, identificadores,
  enlaces a lotes ni capturas con datos.

Un enlace público de lectura no implica edición pública. Si se habilita un
enlace de edición, no se distribuye junto con la URL pública.

## Flujo editorial

1. Una persona propone el cambio y describe el problema.
2. La propuesta queda **En revisión**.
3. Otra persona contrasta la instrucción con la aplicación y el protocolo.
4. Coordinación acepta, corrige o rechaza.
5. Se actualizan responsable, fecha y estado antes de publicar.

Una duda individual no se convierte en regla operativa sin esta revisión.

## Plantilla de contribución

### Problema observado

Describir la pantalla, regla o procedimiento que generó la duda.

### Propuesta

Redactar una acción directa por paso.

### Ejemplo sintético

Usar una frase inventada que no permita reconstruir una nota del corpus.

### Evidencia

Indicar la pantalla, protocolo o contrato que respalda el cambio.

### Estado

Usar **Nuevo**, **En revisión**, **Respondido** o **Incorporado**.

## Seguridad editorial

La wiki pública no contiene notas completas, JSON de trabajo, ids de caso o
paciente, lotes privados, credenciales ni capturas con esos datos. Los ejemplos
se limitan a escenarios sintéticos. Los desacuerdos y respuestas de calibración
no se publican antes del cierre porque podrían contaminar el trabajo
independiente.

## Control previo a publicación

- contenido alineado con el flujo real de tres pasos;
- enlaces y navegación probados;
- fecha y estado visibles;
- ejemplos sintéticos;
- ausencia de datos clínicos e identificadores;
- códigos terminológicos verificados;
- revisión humana registrada.

# AGENTS.md — Notas para agentes / colaboradores

## Cómo pasar un `.xlsx` de SEMANTIAR al JSON de entrada de esta app

La app **no lee `.xlsx`**: trabaja con un JSON de casos. Cuando llega una planilla
nueva (ej. `SEMANTIAR_CAL_A048.xlsx`) hay que convertirla una vez a JSON y dejar
el resultado disponible para cargar (o copiarlo a `public/` como nuevo ejemplo).

### 1. Estructura del `.xlsx` de origen

| Elemento | Detalle |
|---|---|
| Hoja de trabajo | `CALIBRACIÓN_ANOTADOR` (los casos a anotar) |
| Hoja de instrucciones | `INSTRUCCIONES` (no se convierte; solo referencia del modelo) |
| Fila de datos | los casos empiezan en la **fila 3** (`min_row=3`); filas 1–2 son título/encabezado |
| Columna A | `ID_MUESTRA` → `id` (ej. `CAL-001`) |
| Columna B | `TEXTO_CLÍNICO` → `text` |
| Columnas C… | bloques de anotación C1–C10 (se **ignoran** en la entrada; el anotador los completa en la app) |

> Si llega un lote con otro nombre de hoja o los datos en otra fila, ajustá
> `sheet` y `min_row` en el script.

### 2. Formato JSON de entrada que produce la app

```json
{
  "project": "SEMANTIAR - Sistema de anotación clínica (corpus español rioplatense)",
  "batch": "CALIBRACIÓN_ANOTADOR",
  "annotatorId": "A048",
  "sourceFile": "SEMANTIAR_CAL_A048.xlsx",
  "cases": [
    { "id": "CAL-001", "text": "Paciente con fiebre, tos productiva y diagnóstico de neumonía." }
  ]
}
```

Solo `cases[].id` y `cases[].text` son obligatorios; el resto son metadatos que
la app arrastra al JSON de salida. El `annotatorId` suele venir en el nombre del
archivo (`SEMANTIAR_CAL_**A048**.xlsx`).

### 3. Script de conversión (Python + openpyxl)

Requiere `openpyxl` (`pip install openpyxl`). Ajustá las 3 variables de arriba.

```python
import openpyxl, json, sys, re, pathlib

SRC = "SEMANTIAR_CAL_A048.xlsx"     # planilla de origen
SHEET = "CALIBRACIÓN_ANOTADOR"      # hoja con los casos
MIN_ROW = 3                          # primera fila de datos

annotator = (re.search(r"_CAL_([A-Za-z0-9]+)", SRC) or [None, ""])[1]

wb = openpyxl.load_workbook(SRC, data_only=True)
ws = wb[SHEET]

cases = []
for row in ws.iter_rows(min_row=MIN_ROW, values_only=True):
    id_, text = row[0], row[1]
    if id_ and text:
        cases.append({"id": str(id_).strip(), "text": str(text).strip()})

doc = {
    "project": "SEMANTIAR - Sistema de anotación clínica (corpus español rioplatense)",
    "batch": SHEET,
    "annotatorId": annotator,
    "sourceFile": SRC,
    "cases": cases,
}

out = pathlib.Path(SRC).with_suffix(".input.json")
out.write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"OK: {out} ({len(cases)} casos)")
```

### 4. Qué hacer con el JSON resultante

- **Uso normal**: entregarlo al anotador para que lo abra con **Cargar JSON**.
- **Nuevo ejemplo embebido**: copiarlo a `public/example-input.json` (lo carga el
  botón *Ejemplo*). El actual se generó así desde `SEMANTIAR_CAL_A048.xlsx`.

### 5. Notas

- Los bloques C1–C10 del `.xlsx` original **no** se importan: el modelo de anotación
  (SCTID, CAT, contexto) se completa en la app y se produce en el JSON de **salida**,
  no en el de entrada. Ver el formato de salida en `README.md`.
- **No** modificar `ID_MUESTRA` ni `TEXTO_CLÍNICO` al convertir (doble ciego / trazabilidad).
- Para el camino inverso (JSON de salida → columnas C1–C10 de un `.xlsx`), todavía no
  hay script; sería el siguiente paso si se necesita re-poblar la planilla original.

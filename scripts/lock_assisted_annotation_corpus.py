#!/usr/bin/env python3
"""Reevalúa y congela una versión auditable del corpus asistido SEMANTIAR.

La entrada no se modifica. La salida contiene exactamente 48 JSON de celdas,
sin SCTID ni metadatos algorítmicos precargados, junto con un manifiesto
SHA-256 y un registro reservado de todas las exclusiones o reclasificaciones.
GLiNER queda explícitamente fuera de esta versión: cualquier incorporación
futura debe generar una nueva release.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from enrich_premarked_spans import LAB_ANALYTES, SPAN_NOISE, normalize


CANONICAL_CATEGORIES = {"Hallazgo clínico", "Procedimiento", "Fármaco"}
ROUTE_ONLY = {"ev", "im", "sc", "vo"}
ADMINISTRATIVE = {"pte", "mc", "gi", "tto"}
PROCEDURE_OVERRIDES = {
    "chagas",
    "control de signos vitales",
    "ecg",
    "eco",
    "examen fisico",
    "hiv",
    "pap",
    "rmn",
    "tac",
    "toxo",
    "vdrl",
}
PROTOCOL = {
    "mode": "assisted-span-review",
    "instructionsVersion": "SEMANTIAR-ASISTIDA-1.0",
    "candidateMetadataVisible": False,
    "candidateMetadataStripped": True,
    "suggestedSctidVisible": False,
    "suggestedCategoryApplied": False,
    "exhaustiveReviewRequired": True,
    "coreBlindIncluded": False,
    "preannotationsPresent": True,
}


def load_json(path: Path) -> Any:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def dump_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        json.dump(value, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def measured_lab_value(text: str, span: dict[str, Any]) -> bool:
    literal = normalize(text[span["start"] : span["end"]])
    if literal not in LAB_ANALYTES:
        return False
    suffix = text[span["end"] : span["end"] + 24]
    import re

    return bool(re.match(r"\s*[:=]?\s*\d+(?:[.,/]\d+)?", suffix))


def review_span(text: str, span: dict[str, Any]) -> tuple[dict[str, Any] | None, str | None]:
    start, end = span.get("start"), span.get("end")
    if not isinstance(start, int) or not isinstance(end, int):
        return None, "offset_no_entero"
    if start < 0 or start >= end or end > len(text):
        return None, "offset_fuera_de_rango"
    if text[start:end] != span.get("textoLiteral"):
        return None, "literal_no_coincide_con_offset"

    # The locked v1 release is the deterministic + SpanCat baseline. Legacy
    # NER/GLiNER proposals are deferred so a future GLiNER release can be
    # evaluated as a genuine incremental layer rather than being partly
    # inherited by the baseline.
    if span.get("origin") == "ner":
        return None, "ner_heredado_diferido_a_release_gliner"

    literal = normalize(span["textoLiteral"])
    if literal in SPAN_NOISE:
        return None, "ruido_lexico"
    if literal in ADMINISTRATIVE:
        return None, "termino_administrativo_o_estructural"
    if literal in ROUTE_ONLY:
        return None, "via_aislada"
    if measured_lab_value(text, span):
        return None, "analito_con_valor_numerico_fuera_de_triaxialidad"

    reviewed = dict(span)
    reviewed.pop("sctid", None)
    reviewed.pop("term", None)
    suggest = dict(reviewed.get("suggest") or {})
    previous_category = suggest.get("category")
    if literal in PROCEDURE_OVERRIDES:
        suggest["category"] = "Procedimiento"
    category = suggest.get("category")
    if category not in CANONICAL_CATEGORIES:
        return None, "categoria_fuera_de_triaxialidad"
    reviewed["suggest"] = suggest
    reviewed["status"] = "pendiente"
    reviewed.pop("humanAudit", None)
    if previous_category != category:
        return reviewed, f"reclasificado:{previous_category or 'sin_categoria'}->{category}"
    return reviewed, None


def blind_candidate_span(reviewed: dict[str, Any]) -> dict[str, Any]:
    """Build the annotator-facing span without algorithmic or ontological hints."""
    return {
        "spanId": reviewed["spanId"],
        "start": reviewed["start"],
        "end": reviewed["end"],
        "textoLiteral": reviewed["textoLiteral"],
        "origin": "candidate",
        "confidence": 1.0,
        "status": "pendiente",
    }


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    fieldnames = [
        "estrato",
        "archivo",
        "caso_id",
        "span_id",
        "texto_literal",
        "origen",
        "accion",
    ]
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    input_root = args.input.resolve()
    output_root = args.output.resolve()
    if output_root.exists():
        raise FileExistsError(
            f"La release congelada ya existe y no se sobreescribe: {output_root}"
        )

    sources = sorted(
        path
        for stratum in ("basico", "avanzado")
        for path in (input_root / stratum).glob("celda_*_premarcado.json")
    )
    if len(sources) != 48:
        raise RuntimeError(f"Se esperaban 48 archivos y se encontraron {len(sources)}")

    output_root.mkdir(parents=True)
    generated_at = datetime.now(timezone.utc).isoformat()
    totals: Counter = Counter()
    actions: list[dict[str, Any]] = []
    manifest_files: list[dict[str, Any]] = []

    for source in sources:
        stratum = source.parent.name
        document = load_json(source)
        totals["files"] += 1
        totals["cases"] += len(document.get("cases", []))

        for case in document.get("cases", []):
            text = case.get("textNorm") or case.get("text") or ""
            reviewed_spans: list[dict[str, Any]] = []
            previous_end = 0
            for span in case.get("spans", []) or []:
                totals["spans_pre"] += 1
                reviewed, action = review_span(text, span)
                if reviewed is not None and reviewed["start"] < previous_end:
                    reviewed = None
                    action = "solapamiento_tras_reevaluacion"
                if reviewed is None:
                    totals["excluded"] += 1
                else:
                    reviewed_spans.append(blind_candidate_span(reviewed))
                    previous_end = reviewed["end"]
                    totals["spans_post"] += 1
                    totals[f"origin_{reviewed.get('origin', 'unknown')}"] += 1
                    totals[f"category_{reviewed['suggest']['category']}"] += 1
                    if action and action.startswith("reclasificado:"):
                        totals["reclassified"] += 1
                if action:
                    actions.append(
                        {
                            "estrato": stratum,
                            "archivo": source.name,
                            "caso_id": case.get("id", ""),
                            "span_id": span.get("spanId", ""),
                            "texto_literal": span.get("textoLiteral", ""),
                            "origen": span.get("origin", ""),
                            "accion": action,
                        }
                    )
            case["spans"] = reviewed_spans
            if case.get("concepts"):
                raise RuntimeError(f"La entrada contiene conceptos humanos: {source} / {case.get('id')}")
            case["concepts"] = []
            case.pop("_safetyNet", None)
            case.pop("_rescate", None)

        document.pop("_premarking", None)
        document["_annotationProtocol"] = PROTOCOL
        document["_trace"] = {
            "assistedCorpusRelease": "SEMANTIAR-ASISTIDA-1.0",
            "locked": True,
            "glinerIncluded": False,
            "candidateMetadataStripped": True,
        }

        destination = output_root / stratum / source.name
        dump_json(destination, document)
        manifest_files.append(
            {
                "stratum": stratum,
                "file": source.name,
                "source_sha256": sha256(source),
                "locked_sha256": sha256(destination),
            }
        )

    write_csv(output_root / "AUDITORIA_REEVALUACION_SPANS.csv", actions)
    manifest = {
        "schema_version": "1.0",
        "release": "SEMANTIAR-ASISTIDA-1.0",
        "generated_at_utc": generated_at,
        "locked": True,
        "gliner_included": False,
        "source_root": str(input_root),
        "protocol": PROTOCOL,
        "counts": dict(totals),
        "files": manifest_files,
    }
    dump_json(output_root / "CORPUS_LOCK_SHA256.json", manifest)

    report = f"""# Reevaluación y congelamiento del corpus asistido

## Identificación

- Release: `SEMANTIAR-ASISTIDA-1.0`
- Archivos de celda: {totals['files']}
- Casos: {totals['cases']}
- GLiNER incorporado: no
- Core Blind incorporado: no; las 100 notas serán producidas separadamente por el investigador principal.

## Resultado del postfiltro global

- Spans antes: {totals['spans_pre']}
- Spans después: {totals['spans_post']}
- Excluidos: {totals['excluded']}
- Reclasificados: {totals['reclassified']}

El filtro se aplicó por igual a spans heredados, deterministas y SpanCat. Se
excluyeron ruido léxico, términos administrativos, vías aisladas, offsets
inválidos y analitos seguidos por valores numéricos, porque estos últimos no
pertenecen de forma independiente a las tres jerarquías del proyecto. Las
pruebas y los exámenes inequívocos se normalizaron a `Procedimiento`.

## Blindaje

Los 48 archivos quedan identificados por `CORPUS_LOCK_SHA256.json`. La release
no debe modificarse después de su asignación. Una futura evaluación o adición
de GLiNER deberá producir `SEMANTIAR-ASISTIDA-2.0` y preservar esta versión para
comparación y trazabilidad. `AUDITORIA_REEVALUACION_SPANS.csv` registra cada
exclusión o reclasificación y debe permanecer bajo custodia del investigador.
Los JSON destinados a los anotadores conservan únicamente literal y offsets;
se sustituyen origen y confianza por valores genéricos y se eliminan categorías,
expansiones, claves léxicas, metadatos de generación y demás pistas algorítmicas
u ontológicas.
"""
    (output_root / "EVALUACION_REEVALUACION_SPANS.md").write_text(
        report, encoding="utf-8", newline="\n"
    )
    print(json.dumps(manifest["counts"], ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

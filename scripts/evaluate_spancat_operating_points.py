#!/usr/bin/env python3
"""Evalúa modelos SpanCat guardados en los umbrales usados por producción."""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

import spacy

from train_spancat_recall import load_rows, make_examples, metric_subset


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-root", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument(
        "--spec",
        action="append",
        required=True,
        help="nombre|grupo|ruta_modelo|umbral",
    )
    args = parser.parse_args()

    results = []
    for raw_spec in args.spec:
        name, group, model_value, threshold_value = raw_spec.split("|", 3)
        model_path = Path(model_value).resolve()
        threshold = float(threshold_value)
        nlp = spacy.load(model_path)
        component = nlp.get_pipe("spancat")
        component.cfg["threshold"] = threshold
        rows, sources = load_rows(args.data_root.resolve(), "test", (group,))
        examples = make_examples(nlp, rows)
        results.append({
            "name": name,
            "group": group,
            "model_path": str(model_path),
            "threshold": threshold,
            "test_documents": len(rows),
            "test_sources": sources,
            "exact_match_metrics": metric_subset(nlp.evaluate(examples)),
        })

    report = {
        "schema_version": "1.0",
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "definition": "Coincidencia exacta de límites de token y categoría en particiones de prueba externas no usadas para entrenamiento ni selección inicial.",
        "models": results,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

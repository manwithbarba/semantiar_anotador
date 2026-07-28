#!/usr/bin/env python3
"""Entrena SpanCat para las tres categorías SEMANTIAR con particiones externas.

Los conjuntos de entrenamiento, desarrollo y prueba se leen de los JSON en
formato GLiNER ya existentes en ``data/train``. La prueba se evalúa una sola vez
después de seleccionar el umbral sobre desarrollo. El modelo no recibe ninguno
de los 48 JSON que luego serán enriquecidos.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import random
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

import spacy
from spacy.tokens import Doc, Span
from spacy.training import Example
from spacy.util import compounding, minibatch


LABEL_MAP = {
    "hallazgo": "Hallazgo clínico",
    "hallazgo clínico": "Hallazgo clínico",
    "farmaco": "Fármaco",
    "fármaco": "Fármaco",
    "procedimiento": "Procedimiento",
}
GROUPS = ("splits", "farmacos", "procedimientos")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def load_rows(root: Path, split: str, groups: Iterable[str]) -> tuple[list[dict[str, Any]], list[dict[str, str]]]:
    rows: list[dict[str, Any]] = []
    sources: list[dict[str, str]] = []
    for group in groups:
        path = root / group / f"gliner_{split}.json"
        group_rows = json.loads(path.read_text(encoding="utf-8"))
        rows.extend(group_rows)
        sources.append({"group": group, "file": str(path.resolve()), "sha256": sha256(path)})
    return rows, sources


def row_to_example(nlp: spacy.Language, row: dict[str, Any]) -> Example:
    words = [str(token) for token in row["tokenized_text"]]
    predicted = Doc(nlp.vocab, words=words, spaces=[True] * len(words))
    reference = Doc(nlp.vocab, words=words, spaces=[True] * len(words))
    seen: set[tuple[int, int, str]] = set()
    spans: list[Span] = []
    for start, end_inclusive, raw_label in row.get("ner", []):
        label = LABEL_MAP.get(str(raw_label).casefold())
        end = int(end_inclusive) + 1
        start = int(start)
        key = (start, end, label or "")
        if label is None or key in seen or start < 0 or end > len(words) or start >= end:
            continue
        seen.add(key)
        spans.append(Span(reference, start, end, label=label))
    reference.spans["sc"] = spans
    return Example(predicted, reference)


def make_examples(nlp: spacy.Language, rows: Iterable[dict[str, Any]]) -> list[Example]:
    return [row_to_example(nlp, row) for row in rows]


def metric_subset(scores: dict[str, float | None]) -> dict[str, float | None]:
    wanted = (
        "spans_sc_p", "spans_sc_r", "spans_sc_f", "spans_sc_per_type",
    )
    return {key: scores.get(key) for key in wanted if key in scores}


def f_beta(precision: float, recall: float, beta: float = 2.0) -> float:
    if precision <= 0 and recall <= 0:
        return 0.0
    beta2 = beta * beta
    return (1 + beta2) * precision * recall / (beta2 * precision + recall)


def entity_counts(rows: Iterable[dict[str, Any]]) -> Counter:
    counts: Counter = Counter()
    for row in rows:
        unique = set()
        for start, end, raw_label in row.get("ner", []):
            label = LABEL_MAP.get(str(raw_label).casefold())
            if label:
                unique.add((int(start), int(end), label))
        counts.update(label for _, _, label in unique)
    return counts


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-root", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--epochs", type=int, default=6)
    parser.add_argument("--seed", type=int, default=20260721)
    parser.add_argument("--max-span-tokens", type=int, default=8)
    parser.add_argument("--dropout", type=float, default=0.2)
    parser.add_argument("--thresholds", default="0.25,0.35,0.45,0.55")
    parser.add_argument(
        "--groups",
        default=",".join(GROUPS),
        help="Subdirectorios separados por coma: splits,farmacos,procedimientos",
    )
    args = parser.parse_args()

    random.seed(args.seed)
    data_root = args.data_root.resolve()
    output = args.output.resolve()
    groups = tuple(value.strip() for value in args.groups.split(",") if value.strip())
    if not groups or any(group not in GROUPS for group in groups):
        raise ValueError(f"Grupos inválidos: {groups}")
    train_rows, train_sources = load_rows(data_root, "train", groups)
    dev_rows, dev_sources = load_rows(data_root, "dev", groups)
    test_rows, test_sources = load_rows(data_root, "test", groups)

    nlp = spacy.blank("es")
    nlp.add_pipe(
        "spancat",
        config={
            "spans_key": "sc",
            "threshold": 0.25,
            "max_positive": 1,
            "suggester": {
                "@misc": "spacy.ngram_suggester.v1",
                "sizes": list(range(1, args.max_span_tokens + 1)),
            },
        },
    )
    train_examples = make_examples(nlp, train_rows)
    dev_examples = make_examples(nlp, dev_rows)
    test_examples = make_examples(nlp, test_rows)
    optimizer = nlp.initialize(lambda: train_examples)

    history: list[dict[str, Any]] = []
    for epoch in range(1, args.epochs + 1):
        random.shuffle(train_examples)
        losses: dict[str, float] = {}
        batches = minibatch(train_examples, size=compounding(4.0, 32.0, 1.001))
        for batch in batches:
            nlp.update(batch, sgd=optimizer, drop=args.dropout, losses=losses)
        dev_scores = nlp.evaluate(dev_examples)
        history.append({
            "epoch": epoch,
            "loss": round(float(losses.get("spancat", 0.0)), 6),
            "dev": metric_subset(dev_scores),
        })
        print(json.dumps(history[-1], ensure_ascii=False))

    component = nlp.get_pipe("spancat")
    threshold_results: list[dict[str, Any]] = []
    for threshold in [float(value) for value in args.thresholds.split(",")]:
        component.cfg["threshold"] = threshold
        scores = nlp.evaluate(dev_examples)
        precision = float(scores.get("spans_sc_p") or 0.0)
        recall = float(scores.get("spans_sc_r") or 0.0)
        threshold_results.append({
            "threshold": threshold,
            "precision": precision,
            "recall": recall,
            "f1": float(scores.get("spans_sc_f") or 0.0),
            "f2": f_beta(precision, recall, 2.0),
            "per_type": scores.get("spans_sc_per_type", {}),
        })
    selected = max(threshold_results, key=lambda row: (row["f2"], row["recall"], row["precision"]))
    component.cfg["threshold"] = selected["threshold"]
    test_scores = metric_subset(nlp.evaluate(test_examples))

    output.mkdir(parents=True, exist_ok=True)
    model_dir = output / "model-best"
    nlp.meta.update({
        "name": "semantiar_spancat_recall",
        "version": "1.0.0",
        "description": "SpanCat aditivo para Hallazgo clínico, Procedimiento y Fármaco; sin SCTID.",
        "semantiar_threshold": selected["threshold"],
        "semantiar_training_data": str(data_root),
    })
    nlp.to_disk(model_dir)

    report = {
        "schema_version": "1.0",
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "spacy_version": spacy.__version__,
        "seed": args.seed,
        "epochs": args.epochs,
        "dropout": args.dropout,
        "groups": list(groups),
        "candidate_suggester": {"type": "ngram", "min_tokens": 1, "max_tokens": args.max_span_tokens},
        "data": {
            "train": {"documents": len(train_rows), "entities": dict(entity_counts(train_rows)), "sources": train_sources},
            "dev": {"documents": len(dev_rows), "entities": dict(entity_counts(dev_rows)), "sources": dev_sources},
            "test": {"documents": len(test_rows), "entities": dict(entity_counts(test_rows)), "sources": test_sources},
        },
        "training_history": history,
        "threshold_selection": {
            "criterion": "maximum F2 on development set; ties by recall then precision",
            "candidates": threshold_results,
            "selected": selected,
        },
        "held_out_test": test_scores,
        "model_path": str(model_dir),
        "limitations": [
            "Los corpus de entrenamiento combinan fuentes biomédicas y no equivalen al dominio HSI rioplatense.",
            "El umbral prioriza recall (F2); cada span sigue sujeto a revisión humana.",
            "La evaluación del conjunto de prueba mide coincidencia exacta de límites y categoría.",
        ],
    }
    (output / "TRAINING_REPORT.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps({"selected_threshold": selected, "held_out_test": test_scores, "model": str(model_dir)}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

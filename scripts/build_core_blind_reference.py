#!/usr/bin/env python3
"""Construye el Core Blind estratificado sin consultar ni exportar spans.

La selección es determinista, balanceada por dominio y distribuida entre las
24 celdas de cada nivel. Cada nota seleccionada pertenece a un par distinto
para reducir dependencia intrapaciente/intraepisodio dentro del conjunto.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


RELEASE = "SEMANTIAR-CORE-BLIND-1.0"
DEFAULT_SEED = "SEMANTIAR-CORE-BLIND-2026-07-21"
TARGET_PER_STRATUM = 100
TARGET_PER_DOMAIN = 50
DOMAINS = ("AMBULATORIO", "INTERNACION")
KNOWN_EXPOSED_CASES = {
    "CELDA_01__PAIR_0001__AMBULATORIO__AMB_OTHER_32115978",
    "CELDA_01__PAIR_0001__INTERNACION__INT_PHYSICAL_EXAM_23234676",
    "CELDA_01__PAIR_0049__AMBULATORIO__AMB_OTHER_24819610",
    "CELDA_24__PAIR_0048__AMBULATORIO__AMB_OTHER_15333292",
}
PROTOCOL = {
    "mode": "core-blind",
    "instructionsVersion": RELEASE,
    "candidateMetadataVisible": False,
    "candidateMetadataStripped": True,
    "suggestedSctidVisible": False,
    "suggestedCategoryApplied": False,
    "exhaustiveReviewRequired": True,
    "coreBlindIncluded": True,
    "preannotationsPresent": False,
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


def stable_rank(seed: str, *parts: str) -> str:
    value = "|".join((seed, *parts)).encode("utf-8")
    return hashlib.sha256(value).hexdigest()


def case_domain(case_id: str) -> str:
    for domain in DOMAINS:
        if f"__{domain}__" in case_id:
            return domain
    raise ValueError(f"No se pudo determinar el dominio de {case_id}")


def pair_key(case_id: str) -> str:
    match = re.match(r"^(CELDA_\d+__PAIR_\d+)__", case_id)
    if not match:
        raise ValueError(f"ID sin clave de par reconocible: {case_id}")
    return match.group(1)


def cell_number(path: Path) -> int:
    match = re.search(r"celda_(\d+)", path.name, flags=re.IGNORECASE)
    if not match:
        raise ValueError(f"Archivo sin número de celda: {path}")
    return int(match.group(1))


def cell_quotas(cells: list[int], seed: str, stratum: str, domain: str) -> dict[int, int]:
    base, remainder = divmod(TARGET_PER_DOMAIN, len(cells))
    ranked_cells = sorted(cells, key=lambda cell: stable_rank(seed, stratum, domain, str(cell)))
    extras = set(ranked_cells[:remainder])
    return {cell: base + (1 if cell in extras else 0) for cell in cells}


def select_stratum(input_root: Path, stratum: str, seed: str) -> list[dict[str, Any]]:
    source_files = sorted((input_root / stratum).glob("celda_*_premarcado.json"))
    if len(source_files) != 24:
        raise RuntimeError(f"{stratum}: se esperaban 24 celdas y se encontraron {len(source_files)}")

    candidates: dict[tuple[int, str], list[dict[str, Any]]] = defaultdict(list)
    for source in source_files:
        cell = cell_number(source)
        document = load_json(source)
        for case in document.get("cases", []):
            case_id = str(case.get("id", ""))
            if case_id in KNOWN_EXPOSED_CASES:
                continue
            domain = case_domain(case_id)
            candidates[(cell, domain)].append(
                {
                    "source_file": source.name,
                    "cell": cell,
                    "domain": domain,
                    "pair_key": pair_key(case_id),
                    "case": case,
                }
            )

    cells = sorted({cell for cell, _domain in candidates})
    if len(cells) != 24:
        raise RuntimeError(f"{stratum}: cobertura de celdas incompleta ({len(cells)}/24)")

    selected: list[dict[str, Any]] = []
    used_pairs: set[str] = set()
    for domain in DOMAINS:
        quotas = cell_quotas(cells, seed, stratum, domain)
        for cell in cells:
            eligible = [
                item
                for item in candidates[(cell, domain)]
                if item["pair_key"] not in used_pairs
            ]
            eligible.sort(
                key=lambda item: stable_rank(
                    seed, stratum, domain, str(cell), str(item["case"].get("id", ""))
                )
            )
            quota = quotas[cell]
            if len(eligible) < quota:
                raise RuntimeError(
                    f"{stratum}/{domain}/celda {cell:02d}: {len(eligible)} elegibles para cuota {quota}"
                )
            chosen = eligible[:quota]
            selected.extend(chosen)
            used_pairs.update(item["pair_key"] for item in chosen)

    if len(selected) != TARGET_PER_STRATUM:
        raise RuntimeError(f"{stratum}: selección inesperada de {len(selected)} notas")
    if len(used_pairs) != TARGET_PER_STRATUM:
        raise RuntimeError(f"{stratum}: se seleccionaron pares repetidos")
    return sorted(selected, key=lambda item: (item["cell"], str(item["case"].get("id", ""))))


def clean_case(case: dict[str, Any]) -> dict[str, Any]:
    text = str(case.get("text", ""))
    return {
        "id": str(case.get("id", "")),
        "text": text,
        "textNorm": str(case.get("textNorm", text)),
        "spans": [],
        "concepts": [],
        "comentarios": "",
    }


def write_selection_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    fieldnames = ["stratum", "cell", "domain", "source_file", "pair_key", "case_id"]
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--seed", default=DEFAULT_SEED)
    args = parser.parse_args()

    input_root = args.input.resolve()
    output_root = args.output.resolve()
    if output_root.exists():
        raise FileExistsError(f"La release Core Blind ya existe y no se sobreescribe: {output_root}")
    output_root.mkdir(parents=True)

    source_manifest = input_root / "CORPUS_LOCK_SHA256.json"
    if not source_manifest.exists():
        raise FileNotFoundError(f"Falta el manifiesto del corpus fuente: {source_manifest}")

    generated_at = datetime.now(timezone.utc).isoformat()
    manifest_outputs: list[dict[str, Any]] = []
    audit_rows: list[dict[str, Any]] = []
    summary: dict[str, Any] = {}

    for stratum in ("basico", "avanzado"):
        selected = select_stratum(input_root, stratum, args.seed)
        cases = [clean_case(item["case"]) for item in selected]
        domain_counts = Counter(item["domain"] for item in selected)
        cell_counts = Counter(item["cell"] for item in selected)
        document = {
            "project": "SEMANTIAR - conjunto de referencia Core Blind",
            "batch": f"CORE_BLIND_{stratum.upper()}_100",
            "annotatorId": "INVESTIGADOR_PRINCIPAL",
            "sourceFile": f"SEMANTIAR_CORE_BLIND_{stratum.upper()}_100.json",
            "schemaVersion": "2.0-core-blind",
            "cases": cases,
            "_trace": {
                "coreBlindRelease": RELEASE,
                "locked": True,
                "stratum": stratum,
                "selectionSeed": args.seed,
                "sourceCorpusManifestSha256": sha256(source_manifest),
            },
            "_annotationProtocol": PROTOCOL,
        }
        destination = output_root / stratum / f"SEMANTIAR_CORE_BLIND_{stratum.upper()}_100.json"
        dump_json(destination, document)
        manifest_outputs.append(
            {
                "stratum": stratum,
                "file": str(destination.relative_to(output_root)).replace("\\", "/"),
                "sha256": sha256(destination),
                "cases": len(cases),
                "domain_counts": dict(sorted(domain_counts.items())),
                "cell_counts": {f"{cell:02d}": cell_counts[cell] for cell in sorted(cell_counts)},
                "unique_pairs": len({item["pair_key"] for item in selected}),
            }
        )
        summary[stratum] = {
            "cases": len(cases),
            "domain_counts": dict(sorted(domain_counts.items())),
            "cells": len(cell_counts),
            "unique_pairs": len({item["pair_key"] for item in selected}),
        }
        audit_rows.extend(
            {
                "stratum": stratum,
                "cell": f"{item['cell']:02d}",
                "domain": item["domain"],
                "source_file": item["source_file"],
                "pair_key": item["pair_key"],
                "case_id": str(item["case"].get("id", "")),
            }
            for item in selected
        )

    audit_path = output_root / "CORE_BLIND_SELECTION_AUDIT.csv"
    write_selection_csv(audit_path, audit_rows)
    manifest = {
        "schema_version": "1.0",
        "release": RELEASE,
        "generated_at_utc": generated_at,
        "locked": True,
        "selection_method": "SHA-256 deterministic ranking; balanced by stratum, domain and cell",
        "selection_seed": args.seed,
        "source_root": str(input_root),
        "source_manifest_sha256": sha256(source_manifest),
        "known_exposed_cases_excluded": sorted(KNOWN_EXPOSED_CASES),
        "protocol": PROTOCOL,
        "outputs": manifest_outputs,
        "selection_audit_sha256": sha256(audit_path),
        "summary": summary,
    }
    dump_json(output_root / "CORE_BLIND_LOCK_SHA256.json", manifest)

    readme = f"""# SEMANTIAR Core Blind {RELEASE}

Este directorio contiene dos lotes independientes, directamente cargables en
Angular: 100 notas básicas y 100 notas avanzadas. Todos los casos tienen
`spans: []`, `concepts: []` y carecen de metadatos de preanotación.

## Diseño de selección

- Ranking determinista SHA-256 con semilla `{args.seed}`.
- 50 notas ambulatorias y 50 de internación por estrato.
- Representación de las 24 celdas en cada estrato.
- 100 pares distintos por estrato: no se seleccionan ambas notas de un mismo par.
- Se excluyen prospectivamente los casos previamente expuestos durante desarrollo/QA.

## Custodia

Entregar al investigador principal únicamente el JSON del estrato que anotará.
`CORE_BLIND_SELECTION_AUDIT.csv` y `CORE_BLIND_LOCK_SHA256.json` son documentos
de trazabilidad y no forman parte de la interfaz de anotación.
"""
    (output_root / "README_CORE_BLIND.md").write_text(readme, encoding="utf-8", newline="\n")
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

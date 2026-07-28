#!/usr/bin/env python3
"""Verificación independiente de una release Core Blind SEMANTIAR."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from collections import Counter
from pathlib import Path
from typing import Any


FORBIDDEN_KEYS = {
    "_premarking",
    "_rescate",
    "_safetyNet",
    "confidence",
    "lexiconSource",
    "matchedKey",
    "review",
    "sctid",
    "suggest",
    "term",
    "usedWSD",
}


def load_json(path: Path) -> Any:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def nested_keys(value: Any) -> set[str]:
    if isinstance(value, dict):
        return set(value) | {key for child in value.values() for key in nested_keys(child)}
    if isinstance(value, list):
        return {key for child in value for key in nested_keys(child)}
    return set()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("root", type=Path)
    args = parser.parse_args()
    root = args.root.resolve()
    manifest = load_json(root / "CORE_BLIND_LOCK_SHA256.json")
    exposed = set(manifest.get("known_exposed_cases_excluded", []))
    all_ids: set[str] = set()

    for output in manifest.get("outputs", []):
        path = root / output["file"]
        if sha256(path) != output["sha256"]:
            raise RuntimeError(f"Hash inválido: {path}")
        document = load_json(path)
        if document.get("_annotationProtocol", {}).get("mode") != "core-blind":
            raise RuntimeError(f"Protocolo incorrecto: {path}")
        cases = document.get("cases", [])
        if len(cases) != 100:
            raise RuntimeError(f"{path}: {len(cases)} casos; se esperaban 100")
        domains: Counter[str] = Counter()
        pairs: set[str] = set()
        for case in cases:
            case_id = str(case.get("id", ""))
            if case_id in exposed:
                raise RuntimeError(f"Caso previamente expuesto incluido: {case_id}")
            if case_id in all_ids:
                raise RuntimeError(f"Caso duplicado entre lotes: {case_id}")
            all_ids.add(case_id)
            if case.get("spans") != [] or case.get("concepts") != []:
                raise RuntimeError(f"Caso no ciego: {case_id}")
            forbidden = nested_keys(case) & FORBIDDEN_KEYS
            if forbidden:
                raise RuntimeError(f"{case_id}: claves prohibidas {sorted(forbidden)}")
            domain = "AMBULATORIO" if "__AMBULATORIO__" in case_id else "INTERNACION"
            domains[domain] += 1
            match = re.match(r"^(CELDA_\d+__PAIR_\d+)__", case_id)
            if not match:
                raise RuntimeError(f"ID sin par: {case_id}")
            pairs.add(match.group(1))
        if domains != Counter({"AMBULATORIO": 50, "INTERNACION": 50}):
            raise RuntimeError(f"Balance de dominio inválido en {path}: {dict(domains)}")
        if len(pairs) != 100:
            raise RuntimeError(f"Pares no únicos en {path}: {len(pairs)}")

    if len(all_ids) != 200:
        raise RuntimeError(f"Total global inesperado: {len(all_ids)}")
    print("OK: 200 notas Core Blind; 100 básicas y 100 avanzadas, sin spans ni fugas.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

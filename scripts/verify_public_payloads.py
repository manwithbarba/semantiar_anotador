#!/usr/bin/env python3
"""Fail the release build if clinical annotation payloads enter ``public/``.

The application publishes everything below ``public`` as a static asset.  A
review of the source tree is therefore not enough: this small gate checks the
actual files that Angular will copy to the public artifact.  The sole allowed
annotation document is the deliberately synthetic demo input.
"""

from __future__ import annotations

import json
from pathlib import Path
import sys


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ALLOWED_DEMO = PUBLIC / "example-input.json"
SCHEMA_NAMES = {"semantiar-annotation.schema.json"}
FORBIDDEN_DATA_SUFFIXES = {".csv", ".tsv", ".xlsx", ".xls", ".parquet", ".sqlite", ".db"}


def check() -> list[str]:
    failures: list[str] = []
    if not PUBLIC.is_dir():
        return [f"No existe el directorio público: {PUBLIC}"]

    for path in PUBLIC.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() in FORBIDDEN_DATA_SUFFIXES:
            failures.append(f"formato de datos no permitido en public/: {path.relative_to(ROOT)}")
        if path.suffix.lower() != ".json" or path.name in SCHEMA_NAMES:
            continue
        try:
            value = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, UnicodeError, json.JSONDecodeError) as exc:
            failures.append(f"JSON público ilegible ({path.relative_to(ROOT)}): {exc}")
            continue

        if not isinstance(value, dict) or "cases" not in value:
            continue
        if path != ALLOWED_DEMO:
            failures.append(f"documento de anotación no permitido en public/: {path.relative_to(ROOT)}")
            continue
        if value.get("batch") != "EJEMPLO_SINTETICO_CAL3":
            failures.append("example-input.json no declara el lote sintético de calibración 3")
        if value.get("annotatorId") != "DEMO":
            failures.append("example-input.json no usa el identificador DEMO")
        cases = value.get("cases")
        if not isinstance(cases, list) or not cases or any(
            not isinstance(item, dict) or not str(item.get("id", "")).startswith("CAL3-SYN-")
            for item in cases
        ):
            failures.append("example-input.json contiene casos que no tienen IDs sintéticos CAL3-SYN-")

    return failures


def main() -> int:
    failures = check()
    if failures:
        for failure in failures:
            print(f"ERROR: {failure}", file=sys.stderr)
        return 1
    print("OK: public/ no contiene lotes clínicos; sólo se permite el ejemplo sintético de CAL3.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

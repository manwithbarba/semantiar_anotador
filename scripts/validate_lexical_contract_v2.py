from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator


ROOT = Path(__file__).resolve().parents[1]
CANONICAL_SCHEMA = ROOT / "schemas" / "lexical-layer-v2.schema.json"
RELEASES = (
    ROOT / "core_blind_referencia_200_v2_lexical_ip_locked",
    ROOT / "corpus_anotacion_asistida_basico_v2_lexical_locked",
    ROOT / "corpus_anotacion_asistida_avanzado_v2_lexical_locked",
)


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    schema = read_json(CANONICAL_SCHEMA)
    Draft202012Validator.check_schema(schema)
    validator = Draft202012Validator(schema)
    expected_schema_hash = sha256(CANONICAL_SCHEMA)
    checked_files = 0
    checked_cases = 0
    failures: list[str] = []

    for release in RELEASES:
        release_schema = release / "LEXICAL_LAYER_SCHEMA_V2.json"
        if sha256(release_schema) != expected_schema_hash:
            failures.append(f"{release_schema.relative_to(ROOT)}: schema copy differs")

        for path in sorted(release.rglob("*.json")):
            document = read_json(path)
            if not isinstance(document.get("cases"), list):
                continue
            protocol = document.get("_annotationProtocol")
            if not isinstance(protocol, dict) or protocol.get("lexicalLayerEnabled") is not True:
                continue

            errors = sorted(validator.iter_errors(document), key=lambda error: list(error.path))
            for error in errors:
                json_path = "/".join(str(part) for part in error.absolute_path) or "$"
                failures.append(f"{path.relative_to(ROOT)}:{json_path}: {error.message}")
            checked_files += 1
            checked_cases += len(document["cases"])

    if failures:
        print(f"FAIL: {len(failures)} contract errors")
        for failure in failures[:50]:
            print(failure)
        return 1

    print(
        "OK: canonical lexical v2 schema and release copies match; "
        f"{checked_files} files / {checked_cases} cases validated"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

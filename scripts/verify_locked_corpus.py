#!/usr/bin/env python3
"""Verifica que los 48 JSON congelados conserven sus hashes registrados."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("corpus", type=Path)
    args = parser.parse_args()
    root = args.corpus.resolve()
    manifest = json.loads((root / "CORPUS_LOCK_SHA256.json").read_text(encoding="utf-8"))
    failures: list[str] = []
    for item in manifest.get("files", []):
        path = root / item["stratum"] / item["file"]
        if not path.exists():
            failures.append(f"FALTA {path}")
        elif sha256(path) != item["locked_sha256"]:
            failures.append(f"CAMBIÓ {path}")
    if failures:
        print("\n".join(failures))
        return 1
    print(f"OK: {len(manifest.get('files', []))} archivos coinciden con el manifiesto.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

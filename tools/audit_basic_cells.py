"""Aggregate the structural audit over the 24 basic input cells."""
import json
import sys
from collections import Counter
from pathlib import Path

from audit_annotation_json import audit


directory = Path(sys.argv[1])
files = sorted(directory.glob("celda_*_semantiar_input_deid_presidio_premarcado.json"))
categories = Counter()
affected_files = []
for file in files:
    report = audit(json.loads(file.read_text(encoding="utf-8")))
    categories.update(report.get("summary", {}))
    if report.get("issues"):
        affected_files.append({"file": file.name, "issues": len(report["issues"])})

print(json.dumps({
    "filesAudited": len(files),
    "issues": dict(categories),
    "affectedFiles": affected_files,
}, ensure_ascii=False, indent=2))

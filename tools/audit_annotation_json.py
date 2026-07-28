"""Structural audit for SEMANTIAR annotation exports.

It intentionally reports clinical decisions that need confirmation without
rewriting them. Offset and reference violations are reported separately.
"""
import json
import sys
from collections import Counter
from pathlib import Path


def issue(issues, category, case_id, detail):
    issues.append({"category": category, "caseId": case_id, "detail": detail})


def audit(document):
    issues = []
    summary = Counter()
    cases = document.get("cases", [])
    if not isinstance(cases, list):
        return {"error": "cases debe ser una lista"}

    for case in cases:
        case_id = str(case.get("id", "SIN_ID"))
        text = case.get("textNorm", case.get("text", ""))
        if not isinstance(text, str):
            issue(issues, "estructura", case_id, "text/textNorm no es texto")
            continue
        # `textNorm` is an optional, intentional offset base. It can differ
        # from the displayed source text after normalization and is therefore
        # not an inconsistency by itself.

        spans = case.get("spans", [])
        span_ids = set()
        valid_spans = []
        for span in spans if isinstance(spans, list) else []:
            sid = span.get("spanId")
            start, end, literal = span.get("start"), span.get("end"), span.get("textoLiteral")
            valid = (
                isinstance(sid, str)
                and isinstance(start, int)
                and isinstance(end, int)
                and isinstance(literal, str)
                and 0 <= start < end <= len(text)
                and text[start:end] == literal
            )
            if not valid:
                issue(issues, "offset_span", case_id, f"spanId={sid!r} tiene offsets o literal inválidos")
                continue
            if sid in span_ids:
                issue(issues, "identificador", case_id, f"spanId duplicado: {sid}")
                continue
            span_ids.add(sid)
            valid_spans.append(span)
        for left_index, left in enumerate(valid_spans):
            for right in valid_spans[left_index + 1:]:
                if left["start"] < right["end"] and left["end"] > right["start"]:
                    summary["spans_superpuestos_validos"] += 1

        for concept in case.get("concepts", []) if isinstance(case.get("concepts", []), list) else []:
            sid = concept.get("spanId")
            if sid and sid not in span_ids:
                issue(issues, "referencia_concepto", case_id, f"concepto apunta a spanId inexistente: {sid}")
            if sid in span_ids:
                span = next(item for item in valid_spans if item["spanId"] == sid)
                if concept.get("textoLiteral") != span["textoLiteral"]:
                    issue(issues, "referencia_concepto", case_id, f"literal del concepto no coincide con {sid}")

        lexical_pending = 0
        for mention in case.get("lexicalMentions", []) if isinstance(case.get("lexicalMentions", []), list) else []:
            annotation = mention.get("annotation", {}) if isinstance(mention, dict) else {}
            if annotation.get("decisionStatus") == "resolved" and not annotation.get("senseId"):
                lexical_pending += 1
                issue(issues, "decision_lexica", case_id, f"{mention.get('surface')!r}: figura como resuelta sin senseId")
        review = case.get("review", {}) if isinstance(case.get("review", {}), dict) else {}
        lexical_review = case.get("lexicalReview", {}) if isinstance(case.get("lexicalReview", {}), dict) else {}
        if review.get("status") == "finalized" and lexical_pending:
            issue(issues, "cierre", case_id, "nota finalizada con decisiones léxicas incompletas")
        if lexical_review.get("status") == "completed" and lexical_pending:
            issue(issues, "cierre_lexico", case_id, "revisión léxica completada con decisiones incompletas")

    return {
        "cases": len(cases),
        "issues": issues,
        "summary": dict(Counter(item["category"] for item in issues)),
        "validOverlaps": summary["spans_superpuestos_validos"],
    }


if __name__ == "__main__":
    source = Path(sys.argv[1])
    report = audit(json.loads(source.read_text(encoding="utf-8")))
    print(json.dumps(report, ensure_ascii=False, indent=2))

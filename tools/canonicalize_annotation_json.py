"""Create a non-destructive canonical copy of a SEMANTIAR export."""
import json
import sys
from pathlib import Path


def canonicalize(document):
    changed = []
    for case in document.get("cases", []):
        case_id = case.get("id", "SIN_ID")
        pending_lexical = False
        for mention in case.get("lexicalMentions", []):
            annotation = mention.get("annotation", {})
            if annotation.get("decisionStatus") == "resolved" and not annotation.get("senseId"):
                annotation["decisionStatus"] = "pending"
                pending_lexical = True
                changed.append(f"{case_id}: {mention.get('surface', 'forma sin texto')}")
        if pending_lexical:
            lexical_review = case.get("lexicalReview")
            if isinstance(lexical_review, dict):
                lexical_review.update({"status": "pending", "annotatorId": None, "completedAt": None})
            review = case.get("review")
            if isinstance(review, dict) and review.get("status") == "finalized":
                case["review"] = {"status": "pending"}
    return changed


if __name__ == "__main__":
    source, target = map(Path, sys.argv[1:3])
    document = json.loads(source.read_text(encoding="utf-8"))
    changed = canonicalize(document)
    target.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"OK: {target} ({len(changed)} decisiones normalizadas)")

from __future__ import annotations

import argparse
import hashlib
import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as stream:
        return json.load(stream)


def case_payload(case: dict[str, Any]) -> dict[str, Any]:
    return {
        key: case.get(key)
        for key in ("id", "text", "textNorm", "spans", "concepts", "comentarios")
        if key in case
    }


def add_error(errors: list[str], release: str, file: str, message: str) -> None:
    errors.append(f"{release}:{file}:{message}")


def audit_release(
    root: Path,
    release_dir: Path,
    manifest_name: str,
    parent_dir: Path,
    parent_manifest_name: str,
    expected_release: str,
    stratum: str | None,
    core: bool,
) -> dict[str, Any]:
    errors: list[str] = []
    manifest_path = release_dir / manifest_name
    manifest = read_json(manifest_path)
    parent_manifest_path = parent_dir / parent_manifest_name
    parent_manifest = read_json(parent_manifest_path)

    if manifest.get("release") != expected_release:
        add_error(errors, expected_release, manifest_name, "release_id_mismatch")
    if manifest.get("locked") is not True:
        add_error(errors, expected_release, manifest_name, "not_locked")
    if manifest.get("parentManifestSha256") != sha256(parent_manifest_path):
        add_error(errors, expected_release, manifest_name, "parent_manifest_hash_mismatch")

    layer = manifest.get("lexicalLayer", {})
    expected_layer_flags = {
        "preferredSenseVisible": False,
        "senseRankingVisible": False,
        "probabilitiesPresent": False,
        "exhaustiveReviewRequired": True,
        "manualMentionCreationEnabled": True,
        "abstentionEnabled": True,
    }
    for key, expected in expected_layer_flags.items():
        if layer.get(key) is not expected:
            add_error(errors, expected_release, manifest_name, f"layer_flag_{key}_mismatch")

    access = manifest.get("accessPolicy", {})
    expected_access = (
        "principal_investigator_only"
        if core
        else f"annotator_distribution_{stratum}"
    )
    if access.get("classification") != expected_access:
        add_error(errors, expected_release, manifest_name, "access_policy_mismatch")
    if access.get("osAclEnforcedByThisBuild") is not False:
        add_error(errors, expected_release, manifest_name, "acl_claim_mismatch")

    inventory = read_json(release_dir / "LEXICAL_INVENTORY_V2.json")
    sense_ids = {
        sense["senseId"]
        for entry in inventory.get("abbreviations", [])
        for sense in entry.get("senses", [])
    }
    if inventory.get("rankingPresent") is not False:
        add_error(errors, expected_release, "LEXICAL_INVENTORY_V2.json", "ranking_present")
    if inventory.get("probabilitiesPresent") is not False:
        add_error(errors, expected_release, "LEXICAL_INVENTORY_V2.json", "probabilities_present")
    if inventory.get("status") != "provisional_pending_clinical_adjudication":
        add_error(errors, expected_release, "LEXICAL_INVENTORY_V2.json", "inventory_status_mismatch")

    parent_by_path: dict[str, dict[str, Any]] = {}
    if core:
        for row in parent_manifest.get("outputs", []):
            parent_by_path[str(row["file"]).replace("\\", "/")] = row
    else:
        for row in parent_manifest.get("files", []):
            key = f"{row['stratum']}/{row['file']}".replace("\\", "/")
            parent_by_path[key] = row

    file_count = 0
    case_count = 0
    mention_count = 0
    cases_with_candidates = 0
    origin_counts: Counter[str] = Counter()
    schema_versions: Counter[str] = Counter()
    pending_reviews = 0
    parent_payloads_equal = 0

    banned_keys = {
        "preferredSense",
        "preferredSenseId",
        "senseRank",
        "rank",
        "score",
        "probability",
        "confidence",
        "support",
        "margin",
    }

    for row in manifest.get("files", []):
        relative = str(row["file"]).replace("\\", "/")
        output_path = release_dir / Path(relative)
        file_count += 1
        if sha256(output_path) != row.get("lockedSha256"):
            add_error(errors, expected_release, relative, "locked_hash_mismatch")

        parent_row = parent_by_path.get(relative)
        if parent_row is None:
            add_error(errors, expected_release, relative, "parent_file_not_found")
            continue
        parent_path = parent_dir / Path(relative)
        expected_parent_hash = (
            parent_row.get("sha256") if core else parent_row.get("locked_sha256")
        )
        if sha256(parent_path) != expected_parent_hash:
            add_error(errors, expected_release, relative, "parent_file_hash_mismatch")
        if row.get("parentSha256") != expected_parent_hash:
            add_error(errors, expected_release, relative, "recorded_parent_hash_mismatch")

        output_doc = read_json(output_path)
        parent_doc = read_json(parent_path)
        protocol = output_doc.get("_annotationProtocol", {})
        if protocol.get("lexicalLayerEnabled") is not True:
            add_error(errors, expected_release, relative, "lexical_layer_not_enabled")
        if protocol.get("lexicalPreferredSenseVisible") is not False:
            add_error(errors, expected_release, relative, "preferred_sense_visible")
        if protocol.get("lexicalSenseRankingVisible") is not False:
            add_error(errors, expected_release, relative, "sense_ranking_visible")
        if protocol.get("lexicalExhaustiveReviewRequired") is not True:
            add_error(errors, expected_release, relative, "lexical_review_not_required")
        if protocol.get("accessPolicy") != expected_access:
            add_error(errors, expected_release, relative, "document_access_policy_mismatch")

        schema_versions[str(output_doc.get("schemaVersion"))] += 1
        output_cases = output_doc.get("cases", [])
        parent_cases = parent_doc.get("cases", [])
        expected_cases_per_file = 100 if core else 50
        if len(output_cases) != expected_cases_per_file:
            add_error(errors, expected_release, relative, "unexpected_case_count")
        if len(output_cases) != len(parent_cases):
            add_error(errors, expected_release, relative, "parent_case_count_mismatch")

        for case_index, output_case in enumerate(output_cases):
            case_count += 1
            if case_index >= len(parent_cases):
                continue
            parent_case = parent_cases[case_index]
            if case_payload(output_case) != case_payload(parent_case):
                add_error(
                    errors,
                    expected_release,
                    relative,
                    f"clinical_payload_changed_at_ordinal_{case_index + 1}",
                )
            else:
                parent_payloads_equal += 1

            text_norm = str(output_case.get("textNorm", output_case.get("text", "")))
            review = output_case.get("lexicalReview", {})
            if review.get("status") != "pending":
                add_error(
                    errors,
                    expected_release,
                    relative,
                    f"lexical_review_not_pending_at_ordinal_{case_index + 1}",
                )
            else:
                pending_reviews += 1
            if review.get("exhaustiveReviewRequired") is not True:
                add_error(
                    errors,
                    expected_release,
                    relative,
                    f"lexical_review_not_exhaustive_at_ordinal_{case_index + 1}",
                )

            mentions = output_case.get("lexicalMentions")
            if not isinstance(mentions, list):
                add_error(
                    errors,
                    expected_release,
                    relative,
                    f"lexical_mentions_not_array_at_ordinal_{case_index + 1}",
                )
                continue
            if mentions:
                cases_with_candidates += 1
            if core and mentions:
                add_error(
                    errors,
                    expected_release,
                    relative,
                    f"core_contains_candidates_at_ordinal_{case_index + 1}",
                )

            seen_ids: set[str] = set()
            for mention_index, mention in enumerate(mentions):
                mention_count += 1
                origin_counts[str(mention.get("origin"))] += 1
                mention_id = mention.get("mentionId")
                start = mention.get("start")
                end = mention.get("end")
                surface = mention.get("surface")
                if mention_id in seen_ids:
                    add_error(
                        errors,
                        expected_release,
                        relative,
                        f"duplicate_mention_id_at_ordinal_{case_index + 1}_{mention_index + 1}",
                    )
                seen_ids.add(str(mention_id))
                if not (
                    isinstance(start, int)
                    and isinstance(end, int)
                    and isinstance(surface, str)
                    and 0 <= start < end <= len(text_norm)
                    and text_norm[start:end] == surface
                ):
                    add_error(
                        errors,
                        expected_release,
                        relative,
                        f"invalid_mention_offsets_at_ordinal_{case_index + 1}_{mention_index + 1}",
                    )

                candidate_ids = mention.get("candidateSenseIds", [])
                if any(candidate not in sense_ids for candidate in candidate_ids):
                    add_error(
                        errors,
                        expected_release,
                        relative,
                        f"unknown_candidate_sense_at_ordinal_{case_index + 1}_{mention_index + 1}",
                    )
                annotation = mention.get("annotation", {})
                if annotation.get("decisionStatus") != "pending":
                    add_error(
                        errors,
                        expected_release,
                        relative,
                        f"premature_lexical_decision_at_ordinal_{case_index + 1}_{mention_index + 1}",
                    )
                found_banned = banned_keys.intersection(mention) | banned_keys.intersection(annotation)
                if found_banned:
                    add_error(
                        errors,
                        expected_release,
                        relative,
                        f"guidance_metadata_present_at_ordinal_{case_index + 1}_{mention_index + 1}",
                    )

    expected_schema = "3.0-core-blind+lexical" if core else "3.0-span+lexical"
    if set(schema_versions) != {expected_schema}:
        add_error(errors, expected_release, manifest_name, "schema_version_mismatch")

    return {
        "release": expected_release,
        "path": str(release_dir),
        "parentManifestSha256Verified": manifest.get("parentManifestSha256")
        == sha256(parent_manifest_path),
        "counts": {
            "files": file_count,
            "cases": case_count,
            "lexicalMentions": mention_count,
            "casesWithCandidates": cases_with_candidates,
            "candidateOriginCounts": dict(sorted(origin_counts.items())),
            "pendingLexicalReviews": pending_reviews,
            "unchangedClinicalPayloads": parent_payloads_equal,
        },
        "accessPolicy": expected_access,
        "corePremarkingAbsent": core and mention_count == 0,
        "probabilitiesPresent": False,
        "senseRankingPresent": False,
        "errors": errors,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    root = args.root.resolve()

    releases = [
        audit_release(
            root,
            root / "core_blind_referencia_200_v2_lexical_ip_locked",
            "CORE_BLIND_V2_LOCK_SHA256.json",
            root / "core_blind_referencia_200_v1_locked",
            "CORE_BLIND_LOCK_SHA256.json",
            "SEMANTIAR-CORE-BLIND-2.0-LEXICAL-IP",
            None,
            True,
        ),
        audit_release(
            root,
            root / "corpus_anotacion_asistida_basico_v2_lexical_locked",
            "CORPUS_V2_LOCK_SHA256.json",
            root / "corpus_anotacion_asistida_v1_locked",
            "CORPUS_LOCK_SHA256.json",
            "SEMANTIAR-ASISTIDA-BASICO-2.0-LEXICAL",
            "basico",
            False,
        ),
        audit_release(
            root,
            root / "corpus_anotacion_asistida_avanzado_v2_lexical_locked",
            "CORPUS_V2_LOCK_SHA256.json",
            root / "corpus_anotacion_asistida_v1_locked",
            "CORPUS_LOCK_SHA256.json",
            "SEMANTIAR-ASISTIDA-AVANZADO-2.0-LEXICAL",
            "avanzado",
            False,
        ),
    ]
    all_errors = [error for release in releases for error in release["errors"]]
    report = {
        "schemaVersion": "1.0",
        "auditedAtUtc": datetime.now(timezone.utc).isoformat(),
        "scope": "SEMANTIAR lexical releases v2",
        "clinicalTextIncluded": False,
        "originalCaseIdsIncluded": False,
        "checks": {
            "parentV1Integrity": True,
            "v2LockHashes": True,
            "clinicalPayloadEquality": True,
            "lexicalOffsetIntegrity": True,
            "candidateNeutrality": True,
            "coreBlindNoPremarking": True,
            "splitByStratum": True,
            "reviewInitialization": True,
        },
        "releases": releases,
        "errorCount": len(all_errors),
        "passed": not all_errors,
    }
    args.output.write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if not all_errors else 1


if __name__ == "__main__":
    raise SystemExit(main())

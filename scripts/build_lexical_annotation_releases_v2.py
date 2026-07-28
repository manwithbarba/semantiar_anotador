from __future__ import annotations

import argparse
import copy
import hashlib
import json
import re
import shutil
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable


SCHEMA_VERSION_ASSISTED = "3.0-span+lexical"
SCHEMA_VERSION_CORE = "3.0-core-blind+lexical"
LEXICAL_LAYER_VERSION = "SEMANTIAR-LEXICAL-2.0"
CORE_RELEASE = "SEMANTIAR-CORE-BLIND-2.0-LEXICAL-IP"
BASIC_RELEASE = "SEMANTIAR-ASISTIDA-BASICO-2.0-LEXICAL"
ADVANCED_RELEASE = "SEMANTIAR-ASISTIDA-AVANZADO-2.0-LEXICAL"

CORE_DIRNAME = "core_blind_referencia_200_v2_lexical_ip_locked"
BASIC_DIRNAME = "corpus_anotacion_asistida_basico_v2_lexical_locked"
ADVANCED_DIRNAME = "corpus_anotacion_asistida_avanzado_v2_lexical_locked"

ROMAN_NUMERALS = {
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
}

LEXICAL_STOPWORDS = {
    "a",
    "al",
    "ante",
    "años",
    "año",
    "cada",
    "con",
    "contra",
    "de",
    "del",
    "desde",
    "dia",
    "día",
    "días",
    "durante",
    "e",
    "el",
    "en",
    "entre",
    "era",
    "es",
    "esta",
    "este",
    "fue",
    "ha",
    "hoy",
    "la",
    "las",
    "lo",
    "los",
    "mes",
    "meses",
    "muy",
    "ni",
    "no",
    "normal",
    "para",
    "pero",
    "por",
    "que",
    "se",
    "sin",
    "sobre",
    "su",
    "sus",
    "un",
    "una",
    "uno",
    "y",
    "ya",
}

MEASUREMENT_OR_FORMAT_FORMS = {
    "c",
    "cc",
    "cm",
    "dl",
    "g",
    "gr",
    "h",
    "hs",
    "kg",
    "l",
    "mcg",
    "mg",
    "min",
    "ml",
    "mm",
    "mmhg",
    "mmol",
    "seg",
    "u",
    "ui",
}

ORTHOGRAPHIC_PATTERN = re.compile(
    r"(?<![\w])(?:"
    r"[A-ZÁÉÍÓÚÜÑ]{2,6}"
    r"|[A-ZÁÉÍÓÚÜÑ]{1,4}\d{1,3}"
    r"|\d{1,2}[A-ZÁÉÍÓÚÜÑ]"
    r")(?![\w])",
    flags=re.UNICODE,
)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def sha256_bytes(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def canonical_json_bytes(value: Any) -> bytes:
    return (
        json.dumps(value, ensure_ascii=False, indent=2, sort_keys=False) + "\n"
    ).encode("utf-8")


def read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as stream:
        return json.load(stream)


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(canonical_json_bytes(value))


def write_text(path: Path, value: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value.rstrip() + "\n", encoding="utf-8", newline="\n")


def inventory_view(inventory: dict[str, Any]) -> dict[str, Any]:
    abbreviations: list[dict[str, Any]] = []
    for key in sorted(inventory.get("abbreviations", {}), key=str.casefold):
        senses = inventory["abbreviations"][key]
        forms: set[str] = set()
        sense_rows: list[dict[str, Any]] = []
        for sense in senses:
            forms.update(str(item) for item in sense.get("case_sensitive_forms", []))
            sense_rows.append(
                {
                    "senseId": str(sense["sense_id"]),
                    "expansion": str(sense["expansion"]),
                    "semanticType": sense.get("semantic_type"),
                    "resolutionPolicy": sense.get("resolution_policy"),
                }
            )
        abbreviations.append(
            {
                "key": key,
                "caseSensitiveForms": sorted(forms),
                "senses": sorted(sense_rows, key=lambda item: item["senseId"]),
            }
        )

    return {
        "schemaVersion": "1.0",
        "layerVersion": LEXICAL_LAYER_VERSION,
        "inventoryVersion": str(inventory.get("inventory_version", "unknown")),
        "locale": str(inventory.get("locale", "es-AR")),
        "status": "provisional_pending_clinical_adjudication",
        "rankingPresent": False,
        "probabilitiesPresent": False,
        "annotatorMayProposeNewSense": True,
        "annotatorMayAbstain": True,
        "abbreviations": abbreviations,
    }


def exact_form_senses(inventory: dict[str, Any]) -> dict[str, list[str]]:
    mapping: dict[str, set[str]] = {}
    for senses in inventory.get("abbreviations", {}).values():
        for sense in senses:
            sense_id = str(sense["sense_id"])
            for form in sense.get("case_sensitive_forms", []):
                mapping.setdefault(str(form), set()).add(sense_id)
    return {form: sorted(ids) for form, ids in mapping.items()}


def load_legacy_forms(path: Path) -> set[str]:
    raw = read_json(path)
    if not isinstance(raw, dict):
        raise ValueError("The legacy abbreviation dictionary must be a JSON object")
    forms: set[str] = set()
    for key in raw:
        value = str(key).strip()
        if value and len(value) <= 24:
            forms.add(value)
    return forms


def known_form_allowed(form: str) -> bool:
    stripped = form.strip()
    folded = stripped.casefold()
    if len(stripped) < 2:
        return False
    if folded in LEXICAL_STOPWORDS or folded in MEASUREMENT_OR_FORMAT_FORMS:
        return False
    if stripped.islower():
        return False
    return any(char.isalpha() for char in stripped)


def heuristic_form_allowed(form: str) -> bool:
    folded = form.casefold()
    if (
        folded in LEXICAL_STOPWORDS
        or folded in MEASUREMENT_OR_FORMAT_FORMS
        or form in ROMAN_NUMERALS
    ):
        return False
    if any(char.isdigit() for char in form):
        return True
    vowels = sum(char in "AEIOUÁÉÍÓÚÜ" for char in form)
    return 2 <= len(form) <= 6 and vowels <= 1


def compile_known_forms(forms: Iterable[str]) -> re.Pattern[str]:
    safe = [
        re.escape(form)
        for form in sorted(
            {item for item in forms if item.strip()},
            key=lambda value: (-len(value), value),
        )
    ]
    if not safe:
        return re.compile(r"(?!x)x")
    return re.compile(r"(?<![\w])(?:" + "|".join(safe) + r")(?![\w])", re.UNICODE)


def normalized_key(surface: str, form_senses: dict[str, list[str]]) -> str:
    if surface in form_senses:
        for key, senses in form_senses.items():
            if key == surface and senses:
                return senses[0].split(".", 1)[0]
    return surface.upper()


def form_type_hint(surface: str) -> str:
    if any(char.isdigit() for char in surface):
        return "alphanumeric"
    if "/" in surface or "-" in surface or "." in surface:
        return "symbolic_abbreviation"
    if len(surface) <= 2:
        return "initialism"
    return "abbreviation"


def mention_id(case_id: str, start: int, end: int, surface: str) -> str:
    payload = f"{case_id}\x1f{start}\x1f{end}\x1f{surface}".encode("utf-8")
    return "lex-" + hashlib.sha256(payload).hexdigest()[:16]


def new_annotation(*, form_type: str) -> dict[str, Any]:
    return {
        "decisionStatus": "pending",
        "formType": form_type,
        "correctedForm": None,
        "senseId": None,
        "proposedExpansion": None,
        "function": None,
        "section": None,
        "evidenceCodes": [],
        "comment": None,
        "annotatorId": None,
        "annotatedAt": None,
    }


def detect_candidates(
    *,
    case_id: str,
    text: str,
    known_pattern: re.Pattern[str],
    legacy_forms: set[str],
    form_senses: dict[str, list[str]],
) -> list[dict[str, Any]]:
    by_offsets: dict[tuple[int, int], dict[str, Any]] = {}

    for match in known_pattern.finditer(text):
        surface = match.group(0)
        senses = form_senses.get(surface, [])
        origin = "sense_inventory" if senses else "legacy_dictionary"
        row = {
            "mentionId": mention_id(case_id, match.start(), match.end(), surface),
            "start": match.start(),
            "end": match.end(),
            "surface": surface,
            "normalizedKey": normalized_key(surface, form_senses),
            "origin": origin,
            "candidateSenseIds": senses,
            "annotation": new_annotation(form_type=form_type_hint(surface)),
        }
        by_offsets[(match.start(), match.end())] = row

    for match in ORTHOGRAPHIC_PATTERN.finditer(text):
        surface = match.group(0)
        if not heuristic_form_allowed(surface):
            continue
        offsets = (match.start(), match.end())
        if offsets in by_offsets:
            continue
        senses = form_senses.get(surface, [])
        origin = (
            "sense_inventory"
            if senses
            else "legacy_dictionary"
            if surface in legacy_forms
            else "orthographic_heuristic"
        )
        by_offsets[offsets] = {
            "mentionId": mention_id(case_id, match.start(), match.end(), surface),
            "start": match.start(),
            "end": match.end(),
            "surface": surface,
            "normalizedKey": normalized_key(surface, form_senses),
            "origin": origin,
            "candidateSenseIds": senses,
            "annotation": new_annotation(form_type=form_type_hint(surface)),
        }

    return sorted(by_offsets.values(), key=lambda item: (item["start"], item["end"]))


def lexical_review() -> dict[str, Any]:
    return {
        "status": "pending",
        "exhaustiveReviewRequired": True,
        "annotatorId": None,
        "completedAt": None,
        "inventoryVersion": None,
    }


def validate_mentions(case: dict[str, Any]) -> list[str]:
    text = str(case.get("textNorm", case.get("text", "")))
    errors: list[str] = []
    ids: set[str] = set()
    for mention in case.get("lexicalMentions", []):
        mention_id_value = mention.get("mentionId")
        start = mention.get("start")
        end = mention.get("end")
        surface = mention.get("surface")
        if not isinstance(mention_id_value, str) or mention_id_value in ids:
            errors.append("invalid_or_duplicate_mention_id")
        else:
            ids.add(mention_id_value)
        if (
            not isinstance(start, int)
            or not isinstance(end, int)
            or start < 0
            or end <= start
            or end > len(text)
            or text[start:end] != surface
        ):
            errors.append("invalid_offset_or_surface")
    return errors


def augment_document(
    *,
    source_doc: dict[str, Any],
    parent_release: str,
    release: str,
    parent_file_sha256: str,
    lexical_inventory: dict[str, Any],
    lexical_inventory_sha256: str,
    known_pattern: re.Pattern[str],
    legacy_forms: set[str],
    form_senses: dict[str, list[str]],
    assisted: bool,
    stratum: str,
    access_policy: str,
) -> tuple[dict[str, Any], Counter[str], int]:
    doc = copy.deepcopy(source_doc)
    doc["schemaVersion"] = SCHEMA_VERSION_ASSISTED if assisted else SCHEMA_VERSION_CORE

    trace = dict(doc.get("_trace") or {})
    trace.update(
        {
            "parentRelease": parent_release,
            "parentFileSha256": parent_file_sha256,
            "lexicalRelease": release,
            "lexicalLayerVersion": LEXICAL_LAYER_VERSION,
            "lexicalInventorySha256": lexical_inventory_sha256,
            "lexicalCandidatesGenerated": assisted,
            "accessPolicy": access_policy,
        }
    )
    doc["_trace"] = trace

    protocol = dict(doc.get("_annotationProtocol") or {})
    protocol.update(
        {
            "instructionsVersion": release,
            "lexicalLayerEnabled": True,
            "lexicalLayerVersion": LEXICAL_LAYER_VERSION,
            "lexicalInventoryVersion": lexical_inventory["inventoryVersion"],
            "lexicalInventoryStatus": lexical_inventory["status"],
            "lexicalCandidatePolicy": (
                "neutral_dictionary_and_orthographic_candidates"
                if assisted
                else "none_core_blind_manual_detection"
            ),
            "lexicalCandidateMetadataVisible": True,
            "lexicalPreferredSenseVisible": False,
            "lexicalSenseRankingVisible": False,
            "lexicalSenseCodebookAvailable": True,
            "lexicalExhaustiveReviewRequired": True,
            "manualLexicalMentionCreationEnabled": True,
            "lexicalAbstentionEnabled": True,
            "accessPolicy": access_policy,
        }
    )
    doc["_annotationProtocol"] = protocol
    doc["_lexicalInventory"] = lexical_inventory

    origin_counts: Counter[str] = Counter()
    cases_with_candidates = 0
    for case in doc.get("cases", []):
        case_id = str(case.get("id", ""))
        text = str(case.get("textNorm", case.get("text", "")))
        mentions = (
            detect_candidates(
                case_id=case_id,
                text=text,
                known_pattern=known_pattern,
                legacy_forms=legacy_forms,
                form_senses=form_senses,
            )
            if assisted
            else []
        )
        case["lexicalMentions"] = mentions
        case["lexicalReview"] = lexical_review()
        if mentions:
            cases_with_candidates += 1
        origin_counts.update(item["origin"] for item in mentions)
        errors = validate_mentions(case)
        if errors:
            raise ValueError(f"Invalid lexical mentions in case {case_id}: {errors[:5]}")

    return doc, origin_counts, cases_with_candidates


def verify_assisted_sources(source_root: Path) -> tuple[dict[str, Any], str]:
    manifest_path = source_root / "CORPUS_LOCK_SHA256.json"
    manifest = read_json(manifest_path)
    if manifest.get("release") != "SEMANTIAR-ASISTIDA-1.0" or not manifest.get("locked"):
        raise ValueError("Unexpected or unlocked assisted parent release")
    for entry in manifest.get("files", []):
        source = source_root / entry["stratum"] / entry["file"]
        actual = sha256_file(source)
        if actual != entry["locked_sha256"]:
            raise ValueError(f"Assisted parent hash mismatch: {source}")
    return manifest, sha256_file(manifest_path)


def verify_core_sources(source_root: Path) -> tuple[dict[str, Any], str]:
    manifest_path = source_root / "CORE_BLIND_LOCK_SHA256.json"
    manifest = read_json(manifest_path)
    if manifest.get("release") != "SEMANTIAR-CORE-BLIND-1.0" or not manifest.get("locked"):
        raise ValueError("Unexpected or unlocked core parent release")
    for entry in manifest.get("outputs", []):
        source = source_root / entry["file"]
        actual = sha256_file(source)
        if actual != entry["sha256"]:
            raise ValueError(f"Core parent hash mismatch: {source}")
    audit_path = source_root / "CORE_BLIND_SELECTION_AUDIT.csv"
    if sha256_file(audit_path) != manifest.get("selection_audit_sha256"):
        raise ValueError("Core selection audit hash mismatch")
    return manifest, sha256_file(manifest_path)


def lexical_schema() -> dict[str, Any]:
    schema_path = Path(__file__).resolve().parents[1] / "schemas" / "lexical-layer-v2.schema.json"
    return read_json(schema_path)


def instructions_text(*, core: bool) -> str:
    candidate_paragraph = (
        "Este lote no contiene candidatos léxicos premarcados. Seleccione manualmente cada "
        "abreviatura, sigla, acrónimo o forma alfanumérica antes de cerrar la revisión."
        if core
        else "El lote contiene candidatos léxicos neutrales. Debe aceptar, rechazar o resolver "
        "cada candidato y agregar manualmente cualquier omisión."
    )
    return f"""
# Instrucciones de anotación - Capa léxica SemantIAr v2

## Alcance

{candidate_paragraph}

La unidad de decisión es cada aparición. Una misma forma puede tener sentidos
distintos en la misma nota. La especialidad y la sección son evidencia
contextual, no reglas absolutas.

## Decisiones permitidas

- `resolved`: seleccione un `senseId` del inventario provisional.
- `ambiguous`: permanecen dos o más sentidos compatibles.
- `unknown`: no hay evidencia suficiente para interpretar la forma.
- `new_sense_proposed`: escriba una expansión propuesta ausente del inventario.
- `form_error`: registre la forma corregida, por ejemplo una confusión letra-número.
- `nonclinical`: es una abreviatura real pero no expresa información clínica.
- `rejected`: el candidato no es una abreviatura o acrónimo.

## Reglas

1. Conserve los offsets y la forma literal.
2. No expanda por especialidad solamente.
3. Distinga encabezados estructurales de entidades clínicas.
4. No asigne SNOMED antes de resolver el sentido léxico.
5. Use abstención cuando falte evidencia.
6. Los sentidos ofrecidos son provisionales, no están ordenados ni representan
   probabilidades.
7. Finalice `lexicalReview` solo después de revisar exhaustivamente toda la nota.

## Privacidad y trazabilidad

No copie texto clínico fuera del JSON. El archivo conserva el hash de su fuente
v1, la versión del inventario y el registro temporal de cada decisión.
"""


def readme_text(*, release: str, parent_release: str, access_policy: str, core: bool) -> str:
    scope = (
        "Contiene los dos lotes Core Blind de 100 notas. La capa léxica se inicia "
        "vacía para preservar la ausencia de preanotaciones."
        if core
        else "Contiene 24 celdas de 50 notas de un único estrato, con candidatos "
        "léxicos neutrales y sin sentido preferido."
    )
    return f"""
# {release}

Liberación derivada y bloqueada de `{parent_release}`.

{scope}

## Política de acceso

`{access_policy}`

La política se registra como metadato y aviso de custodia. Esta liberación no
modifica permisos ACL del sistema operativo.

## Archivos de control

- `LEXICAL_LAYER_SCHEMA_V2.json`
- `LEXICAL_INVENTORY_V2.json`
- `INSTRUCCIONES_CAPA_LEXICA_V2.md`
- manifiesto SHA-256 de la liberación

Los archivos fuente v1 permanecen intactos.
"""


def file_record(
    *,
    relative_path: str,
    parent_sha256: str,
    output_path: Path,
    cases: int,
    lexical_mentions: int,
    cases_with_candidates: int,
    origin_counts: Counter[str],
) -> dict[str, Any]:
    return {
        "file": relative_path.replace("\\", "/"),
        "parentSha256": parent_sha256,
        "lockedSha256": sha256_file(output_path),
        "cases": cases,
        "lexicalMentions": lexical_mentions,
        "casesWithLexicalCandidates": cases_with_candidates,
        "candidateOriginCounts": dict(sorted(origin_counts.items())),
    }


def common_manifest(
    *,
    release: str,
    parent_release: str,
    parent_manifest_sha256: str,
    lexical_inventory_sha256: str,
    access_policy: str,
) -> dict[str, Any]:
    return {
        "schemaVersion": "1.0",
        "release": release,
        "generatedAtUtc": datetime.now(timezone.utc).isoformat(),
        "locked": True,
        "parentRelease": parent_release,
        "parentManifestSha256": parent_manifest_sha256,
        "lexicalLayer": {
            "version": LEXICAL_LAYER_VERSION,
            "inventorySha256": lexical_inventory_sha256,
            "preferredSenseVisible": False,
            "senseRankingVisible": False,
            "probabilitiesPresent": False,
            "exhaustiveReviewRequired": True,
            "manualMentionCreationEnabled": True,
            "abstentionEnabled": True,
        },
        "accessPolicy": {
            "classification": access_policy,
            "osAclEnforcedByThisBuild": False,
        },
        "files": [],
    }


def build_support_files(
    *,
    root: Path,
    release: str,
    parent_release: str,
    access_policy: str,
    lexical_inventory: dict[str, Any],
    core: bool,
) -> None:
    write_json(root / "LEXICAL_LAYER_SCHEMA_V2.json", lexical_schema())
    write_json(root / "LEXICAL_INVENTORY_V2.json", lexical_inventory)
    write_text(root / "INSTRUCCIONES_CAPA_LEXICA_V2.md", instructions_text(core=core))
    write_text(
        root / "README.md",
        readme_text(
            release=release,
            parent_release=parent_release,
            access_policy=access_policy,
            core=core,
        ),
    )


def build_core_release(
    *,
    source_root: Path,
    output_root: Path,
    source_manifest: dict[str, Any],
    source_manifest_sha256: str,
    lexical_inventory: dict[str, Any],
    lexical_inventory_sha256: str,
    known_pattern: re.Pattern[str],
    legacy_forms: set[str],
    form_senses: dict[str, list[str]],
) -> dict[str, Any]:
    target = output_root / CORE_DIRNAME
    target.mkdir(parents=True)
    access_policy = "principal_investigator_only"
    build_support_files(
        root=target,
        release=CORE_RELEASE,
        parent_release=source_manifest["release"],
        access_policy=access_policy,
        lexical_inventory=lexical_inventory,
        core=True,
    )
    shutil.copy2(
        source_root / "CORE_BLIND_SELECTION_AUDIT.csv",
        target / "CORE_BLIND_SELECTION_AUDIT.csv",
    )

    manifest = common_manifest(
        release=CORE_RELEASE,
        parent_release=source_manifest["release"],
        parent_manifest_sha256=source_manifest_sha256,
        lexical_inventory_sha256=lexical_inventory_sha256,
        access_policy=access_policy,
    )
    total_cases = 0
    for entry in source_manifest["outputs"]:
        source = source_root / entry["file"]
        destination = target / entry["file"]
        source_doc = read_json(source)
        augmented, origins, cases_with = augment_document(
            source_doc=source_doc,
            parent_release=source_manifest["release"],
            release=CORE_RELEASE,
            parent_file_sha256=entry["sha256"],
            lexical_inventory=lexical_inventory,
            lexical_inventory_sha256=lexical_inventory_sha256,
            known_pattern=known_pattern,
            legacy_forms=legacy_forms,
            form_senses=form_senses,
            assisted=False,
            stratum=entry["stratum"],
            access_policy=access_policy,
        )
        write_json(destination, augmented)
        cases = len(augmented["cases"])
        total_cases += cases
        manifest["files"].append(
            file_record(
                relative_path=entry["file"],
                parent_sha256=entry["sha256"],
                output_path=destination,
                cases=cases,
                lexical_mentions=0,
                cases_with_candidates=cases_with,
                origin_counts=origins,
            )
        )
    manifest["counts"] = {
        "files": len(manifest["files"]),
        "cases": total_cases,
        "lexicalMentions": 0,
        "candidatePolicy": "manual_detection_only",
    }
    manifest_path = target / "CORE_BLIND_V2_LOCK_SHA256.json"
    write_json(manifest_path, manifest)
    return {"path": str(target), "manifest": manifest}


def build_assisted_release(
    *,
    stratum: str,
    release: str,
    dirname: str,
    source_root: Path,
    output_root: Path,
    source_manifest: dict[str, Any],
    source_manifest_sha256: str,
    lexical_inventory: dict[str, Any],
    lexical_inventory_sha256: str,
    known_pattern: re.Pattern[str],
    legacy_forms: set[str],
    form_senses: dict[str, list[str]],
) -> dict[str, Any]:
    target = output_root / dirname
    target.mkdir(parents=True)
    access_policy = f"annotator_distribution_{stratum}"
    build_support_files(
        root=target,
        release=release,
        parent_release=source_manifest["release"],
        access_policy=access_policy,
        lexical_inventory=lexical_inventory,
        core=False,
    )
    manifest = common_manifest(
        release=release,
        parent_release=source_manifest["release"],
        parent_manifest_sha256=source_manifest_sha256,
        lexical_inventory_sha256=lexical_inventory_sha256,
        access_policy=access_policy,
    )
    total_cases = 0
    total_mentions = 0
    total_cases_with = 0
    total_origins: Counter[str] = Counter()

    entries = [
        item for item in source_manifest["files"] if item["stratum"] == stratum
    ]
    for entry in entries:
        source = source_root / stratum / entry["file"]
        relative = f"{stratum}/{entry['file']}"
        destination = target / relative
        source_doc = read_json(source)
        augmented, origins, cases_with = augment_document(
            source_doc=source_doc,
            parent_release=source_manifest["release"],
            release=release,
            parent_file_sha256=entry["locked_sha256"],
            lexical_inventory=lexical_inventory,
            lexical_inventory_sha256=lexical_inventory_sha256,
            known_pattern=known_pattern,
            legacy_forms=legacy_forms,
            form_senses=form_senses,
            assisted=True,
            stratum=stratum,
            access_policy=access_policy,
        )
        write_json(destination, augmented)
        cases = len(augmented["cases"])
        mentions = sum(len(case["lexicalMentions"]) for case in augmented["cases"])
        total_cases += cases
        total_mentions += mentions
        total_cases_with += cases_with
        total_origins.update(origins)
        manifest["files"].append(
            file_record(
                relative_path=relative,
                parent_sha256=entry["locked_sha256"],
                output_path=destination,
                cases=cases,
                lexical_mentions=mentions,
                cases_with_candidates=cases_with,
                origin_counts=origins,
            )
        )
    manifest["counts"] = {
        "files": len(manifest["files"]),
        "cases": total_cases,
        "lexicalMentions": total_mentions,
        "casesWithLexicalCandidates": total_cases_with,
        "candidateOriginCounts": dict(sorted(total_origins.items())),
        "candidatePolicy": "neutral_dictionary_and_orthographic_candidates",
    }
    manifest_path = target / "CORPUS_V2_LOCK_SHA256.json"
    write_json(manifest_path, manifest)
    return {"path": str(target), "manifest": manifest}


def validate_release(result: dict[str, Any]) -> list[str]:
    root = Path(result["path"])
    errors: list[str] = []
    for record in result["manifest"]["files"]:
        path = root / record["file"]
        if not path.exists():
            errors.append(f"missing:{record['file']}")
            continue
        if sha256_file(path) != record["lockedSha256"]:
            errors.append(f"hash:{record['file']}")
            continue
        doc = read_json(path)
        if not doc.get("_annotationProtocol", {}).get("lexicalLayerEnabled"):
            errors.append(f"protocol:{record['file']}")
        if "_lexicalInventory" not in doc:
            errors.append(f"inventory:{record['file']}")
        for case in doc.get("cases", []):
            if "lexicalMentions" not in case or "lexicalReview" not in case:
                errors.append(f"case_layer:{record['file']}")
                break
            mention_errors = validate_mentions(case)
            if mention_errors:
                errors.append(f"offset:{record['file']}")
                break
    return errors


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--core-source", type=Path, required=True)
    parser.add_argument("--assisted-source", type=Path, required=True)
    parser.add_argument("--sense-inventory", type=Path, required=True)
    parser.add_argument("--legacy-dictionary", type=Path, required=True)
    parser.add_argument("--output-root", type=Path, required=True)
    parser.add_argument(
        "--summary",
        type=Path,
        required=True,
        help="Aggregate non-clinical build summary JSON",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    output_dirs = [
        args.output_root / CORE_DIRNAME,
        args.output_root / BASIC_DIRNAME,
        args.output_root / ADVANCED_DIRNAME,
    ]
    existing = [path for path in output_dirs if path.exists()]
    if existing:
        raise FileExistsError(
            "Refusing to overwrite existing v2 release directories: "
            + ", ".join(str(path) for path in existing)
        )

    assisted_manifest, assisted_manifest_sha = verify_assisted_sources(
        args.assisted_source
    )
    core_manifest, core_manifest_sha = verify_core_sources(args.core_source)
    sense_inventory = read_json(args.sense_inventory)
    lexical_inventory = inventory_view(sense_inventory)
    lexical_inventory_sha = sha256_bytes(canonical_json_bytes(lexical_inventory))
    form_senses = exact_form_senses(sense_inventory)
    legacy_forms = {
        form
        for form in load_legacy_forms(args.legacy_dictionary)
        if known_form_allowed(form)
    }
    known_pattern = compile_known_forms(set(legacy_forms) | set(form_senses))

    built: list[dict[str, Any]] = []
    try:
        built.append(
            build_core_release(
                source_root=args.core_source,
                output_root=args.output_root,
                source_manifest=core_manifest,
                source_manifest_sha256=core_manifest_sha,
                lexical_inventory=lexical_inventory,
                lexical_inventory_sha256=lexical_inventory_sha,
                known_pattern=known_pattern,
                legacy_forms=legacy_forms,
                form_senses=form_senses,
            )
        )
        built.append(
            build_assisted_release(
                stratum="basico",
                release=BASIC_RELEASE,
                dirname=BASIC_DIRNAME,
                source_root=args.assisted_source,
                output_root=args.output_root,
                source_manifest=assisted_manifest,
                source_manifest_sha256=assisted_manifest_sha,
                lexical_inventory=lexical_inventory,
                lexical_inventory_sha256=lexical_inventory_sha,
                known_pattern=known_pattern,
                legacy_forms=legacy_forms,
                form_senses=form_senses,
            )
        )
        built.append(
            build_assisted_release(
                stratum="avanzado",
                release=ADVANCED_RELEASE,
                dirname=ADVANCED_DIRNAME,
                source_root=args.assisted_source,
                output_root=args.output_root,
                source_manifest=assisted_manifest,
                source_manifest_sha256=assisted_manifest_sha,
                lexical_inventory=lexical_inventory,
                lexical_inventory_sha256=lexical_inventory_sha,
                known_pattern=known_pattern,
                legacy_forms=legacy_forms,
                form_senses=form_senses,
            )
        )
    except Exception:
        for path in output_dirs:
            if path.exists():
                shutil.rmtree(path)
        raise

    validation_errors = {
        result["manifest"]["release"]: validate_release(result) for result in built
    }
    summary = {
        "schemaVersion": "1.0",
        "createdAtUtc": datetime.now(timezone.utc).isoformat(),
        "lexicalLayerVersion": LEXICAL_LAYER_VERSION,
        "sourceIntegrity": {
            "assistedParentVerified": True,
            "coreParentVerified": True,
            "assistedParentManifestSha256": assisted_manifest_sha,
            "coreParentManifestSha256": core_manifest_sha,
        },
        "inventory": {
            "senseInventorySha256": sha256_file(args.sense_inventory),
            "legacyDictionarySha256": sha256_file(args.legacy_dictionary),
            "embeddedInventorySha256": lexical_inventory_sha,
            "provisional": True,
            "probabilitiesPresent": False,
            "rankingPresent": False,
        },
        "releases": [
            {
                "release": result["manifest"]["release"],
                "path": result["path"],
                "counts": result["manifest"]["counts"],
                "validationErrors": validation_errors[result["manifest"]["release"]],
            }
            for result in built
        ],
        "clinicalTextIncludedInSummary": False,
        "originalCaseIdsIncludedInSummary": False,
    }
    write_json(args.summary, summary)
    errors = sum(len(items) for items in validation_errors.values())
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise

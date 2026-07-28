#!/usr/bin/env python3
"""Enriquece lotes SEMANTIAR con spans candidatos, sin adjudicar SCTID.

El proceso conserva los spans preexistentes, agrega coincidencias léxicas no
solapadas y normaliza las sugerencias a las tres jerarquías habilitadas por la
aplicación: Hallazgo clínico, Procedimiento y Fármaco. Los offsets siempre se
refieren a ``textNorm``. La salida incluye trazabilidad suficiente para repetir
y auditar la corrida.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import shutil
import unicodedata
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable


TOKEN_RE = re.compile(r"[0-9A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+")
SEGMENT_BOUNDARIES = ".\n\r;"
CANONICAL_CATEGORIES = {"Hallazgo clínico", "Procedimiento", "Fármaco"}
CATEGORY_MAP = {
    "Hallazgo clínico": "Hallazgo clínico",
    "Síntoma": "Hallazgo clínico",
    "Signo": "Hallazgo clínico",
    "Diagnóstico": "Hallazgo clínico",
    "Enfermedad": "Hallazgo clínico",
    "Medicamento": "Fármaco",
    "Fármaco": "Fármaco",
    "Procedimiento": "Procedimiento",
}

# Homógrafos y términos genéricos observados en el léxico farmacológico que no
# constituyen por sí solos una mención segura de fármaco en una nota clínica.
DRUG_BLOCKLIST = {
    "acido urico", "activa", "activar", "albumina", "aliviar", "amilasa",
    "amonio", "bilirrubina", "calcio", "calma", "calmar", "cloro",
    "colesterol", "controla", "controlar", "creatinina", "cura", "curar",
    "descansar", "dextrosa", "dolor", "estable", "evolucion", "evoluciona",
    "ferritina", "fiebre", "fosforo", "fuerza", "glucemia", "glucosa",
    "hdl", "hematocrito", "hemoglobina", "hierro", "indica", "indican",
    "indicar", "lactato", "ldl", "lipasa", "magnesio", "marcha", "mejora",
    "mejoral", "niega", "normal", "nota", "notar", "potasio", "presenta",
    "proteina", "proteinas", "refiere", "reposa", "reposo", "salud", "sodio",
    "tono", "transferrina", "trigliceridos", "troponina", "urea", "uremia",
    "urico", "vida", "agua", "oxigeno", "producto", "medicamento", "farmaco",
    "solucion", "suspension", "comprimido", "capsula", "jarabe", "crema",
    "actual", "acido", "aceite", "alcohol", "anticuerpos", "carbono", "cobre",
    "digestivo", "electrolito", "fibrinogeno", "maxima", "peptido", "plan",
    "plata", "plaquetas", "prolactina", "proteina c", "rutina", "soja", "vitamina",
    "ampliar",
}

ADMIN_ABBREVIATIONS = {
    "A", "AL", "AM", "CA", "CC", "CM", "DE", "E", "EL", "EN", "GR",
    "I", "II", "III", "IM", "IV", "IX", "KG", "LA", "MC", "MCG", "MG",
    "MI", "ML", "MM", "NI", "NO", "O", "PM", "PTE", "SC", "SE", "SI",
    "SU", "TTO", "TU", "UI", "UN", "US", "VI", "VO", "X", "XI", "Y", "Z",
    "AA", "AC", "AF", "AHF", "AP", "APP", "DL", "EV", "FNT", "GI", "LH",
    "LPM", "MEQ", "MMII", "MSD", "MSI", "OD", "OI", "RPM", "SP", "UTI",
}

ABBREVIATION_CATEGORY_OVERRIDES = {
    "AAS": "Fármaco", "ATB": "Fármaco", "PHP": "Fármaco",
    "CPRE": "Procedimiento", "CSV": "Procedimiento", "ECO": "Procedimiento",
    "ECG": "Procedimiento", "EEG": "Procedimiento", "PAP": "Procedimiento",
    "RMN": "Procedimiento", "RX": "Procedimiento", "TAC": "Procedimiento",
    "TTE": "Procedimiento", "VDRL": "Procedimiento",
}

EXPANSION_BLOCKLIST = {
    "antecedentes personales", "aire ambiente", "arteria pulmonar", "brazo izquierdo",
    "cirugia general", "dos veces por dia", "examen fisico", "historia clinica",
    "hipocondrio izq", "lado izquierdo", "lobulo medio", "mano derecha",
    "miembro inferior", "miembro superior derecho", "miembro superior izquierdo",
    "miembros inferiores", "obra social", "oido derecho", "ojo derecho",
    "por via oral", "signos vitales", "via endovenosa", "via oral",
}

PROCEDURE_FRAGMENT_BLOCKLIST = {
    "aparato urinario", "calcio ionico", "de abdomen", "de cerebro",
    "de columna cervical", "de columna dorsal", "de prostata", "de pulmon",
    "de vasos de cuello", "de vejiga", "formula leucocitaria", "hospital de dia",
    "medio interno", "orina completa", "pabellon auricular", "partes blandas",
    "peritonitis generalizada", "salud mental", "sinfisis pubiana",
    "terapia intensiva", "terapia intermedia", "vias biliares", "vitamina b12",
}

LAB_ANALYTES = {
    "albumina", "aldolasa", "bd", "beab", "bi", "bilirrubina", "bt", "ck", "colesterol", "cpk",
    "creat", "creatinina", "fa", "fal", "ferritina", "gb", "ggt", "glucemia",
    "glucosa", "got", "gpt", "gr", "hb", "hcto", "hdl", "hemoglobina", "hto",
    "hierro", "kptt", "ldh", "ldl", "lipasa", "pcr", "plaq", "plaquetas", "potasio", "procalcitonina",
    "sodio", "t3", "t4", "tgo", "tgp", "tp", "trigliceridos", "tsh", "urea",
    "transaminasas", "transferrina", "tromboplastina", "uremia", "vsg", "fructosamina",
}
SPAN_NOISE = {
    "paciente", "pacientes", "control", "consulta", "antecedente", "antecedentes",
    "tratamiento", "estudio", "estudios", "prueba", "normal", "normales", "valor",
    "valores", "resultado", "resultados", "servicio", "hospital", "medicacion",
    "acondiciona", "anexos", "autonomia", "bajo", "baile", "cama", "cena",
    "dermatologia", "digestivo", "drogas", "estudios solicitados", "viernes",
    "guarderia", "indicaciones", "odontologia", "observaciones", "perfil", "plato",
    "reactiva", "sat", "termino", "ubica", "viral", "abdominal", "adiposo",
    "ams", "aporte", "avm", "bmv", "cada", "canula", "cardiologia", "cloro",
    "comp", "complemento", "condiciones", "conjunto", "conservada", "conservados",
    "continua", "correccion", "crea", "cubre", "cuadro", "cursando", "dejar",
    "dificultad", "ers", "esquema", "evalua", "familiares", "fum", "glu", "guardia",
    "idx", "leu", "neurologia", "niega", "para", "pautas de alarma", "pelvis",
    "peso", "plan", "rin", "adinamia", "al respecto", "alim", "antec", "cigarrillos", "complementarios",
    "concurrio", "cua", "diaria", "folico", "hbsag", "hialina", "hospitalario",
    "indicada", "nefrologa", "novedades", "obeso", "seciones", "sedentario",
    "control evolutivo", "endocrinologia", "ensure", "entrevista virtual con victor",
    "familiar", "hablamos", "no esta en pareja", "no refiere", "oftalmologia", "seguimiento",
}

DRUG_CLASS_TERMS = {
    "aines", "antibiotico", "antibioticos", "broncodilatador", "broncodilatadores",
    "corticoide", "corticoides", "vasoactivo", "vasoactivos",
}

SPANCAT_MIN_CONFIDENCE = {
    "hallazgo_clinico": 0.45,
    "farmaco": 0.65,
    "procedimiento": 0.65,
}

DRUG_SUFFIXES = (
    "azepam", "azol", "ciclina", "dipina", "floxacina", "gliptina", "mab",
    "micina", "nib", "olol", "onide", "pam", "prazol", "pril", "sartan",
    "statina", "vir", "zolam",
)
DRUG_CONTEXT_RE = re.compile(
    r"(?i)\b(?:\d+(?:[.,]\d+)?\s*(?:mg|mcg|g|ml|ui)|ampolla|comprimido|capsula|"
    r"dosis|indica|indicacion|medicacion|recibe|tratamiento|via\s+(?:oral|endovenosa))\b"
)

PROCEDURE_CUES = {
    "analgesia", "anestesia", "angiotac", "audiometria", "auscultacion",
    "coagulograma", "consejeria", "coprocultivo", "cura", "curacion", "dialisis",
    "doppler", "ecocardiograma", "electrocardiograma", "espirometria", "examen",
    "gasometria", "heltograma", "hemocultivo", "hemocultivos", "hemograma",
    "hepatograma", "hidratacion", "holter", "impedanciometria", "ionograma",
    "oxigenoterapia", "palpacion", "perfil tiroideo", "quimioterapia", "radiografia",
    "rehabilitacion", "sedacion", "saturometria", "test", "transfusion", "urocultivo",
}

# Actos inequívocos cuando aparecen como sustantivo aislado. Los términos más
# generales del recurso (control, estudio, prueba, tratamiento) se reservan para
# coincidencias multipalabra exactas.
PROCEDURE_SINGLE_WORDS = {
    "amniocentesis", "amputacion", "artrodesis", "artroscopia", "biopsia",
    "cateterismo", "cirugia", "cultivo", "drenaje", "endoscopia", "exeresis",
    "extraccion", "fijacion", "implantacion", "implante", "incision", "infusion",
    "insercion", "laparoscopia", "laparotomia", "mamografia", "monitoreo",
    "puncion", "radiografia", "reconstruccion", "reseccion", "sutura",
}
PROCEDURE_SUFFIXES = (
    "centesis", "ectomia", "grafia", "laparoscopia", "laparotomia", "oscopia",
    "pexia", "plastia", "rrafia", "stomia", "tomia",
)
PROCEDURE_HINTS = {
    "administracion", "biopsia", "cateterismo", "cirugia", "cultivo", "drenaje",
    "ecografia", "electrocardiograma", "endoscopia", "extraccion", "infusion",
    "insercion", "mamografia", "monitoreo", "puncion", "radiografia", "resonancia",
    "reseccion", "tomografia",
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


def sha256_path(path: Path) -> str:
    if path.is_file():
        return sha256(path)
    digest = hashlib.sha256()
    for child in sorted(item for item in path.rglob("*") if item.is_file()):
        digest.update(child.relative_to(path).as_posix().encode("utf-8"))
        digest.update(sha256(child).encode("ascii"))
    return digest.hexdigest()


def normalize(value: str) -> str:
    value = unicodedata.normalize("NFD", value.casefold())
    value = "".join(ch for ch in value if unicodedata.category(ch) != "Mn")
    return " ".join(match.group(0) for match in TOKEN_RE.finditer(value))


def phrase_tokens(value: str) -> tuple[str, ...]:
    norm = normalize(value)
    return tuple(norm.split()) if norm else ()


def tokenise_with_offsets(text: str) -> list[tuple[str, int, int]]:
    return [(normalize(m.group(0)), m.start(), m.end()) for m in TOKEN_RE.finditer(text)]


def remove_semantic_tag(value: str) -> str:
    return re.sub(
        r"\s*\((?:procedimiento|procedure|producto medicinal|fármaco de uso clínico|"
        r"farmaco de uso clinico|régimen/terapia|regime/therapy)\)\s*$",
        "",
        value,
        flags=re.IGNORECASE,
    ).strip()


def spanish_or_neutral(value: str) -> bool:
    norm = f" {normalize(value)} "
    english_markers = (" procedure ", " examination ", " assessment ", " therapy ",
                       " imaging ", " repair ", " excision ", " replacement ",
                       " insertion ", " removal ", " measurement ")
    return not any(marker in norm for marker in english_markers)


@dataclass(frozen=True)
class LexicalEntry:
    category: str
    source: str
    matched_key: str
    confidence: float
    priority: int


@dataclass
class TrieNode:
    children: dict[str, "TrieNode"] = field(default_factory=dict)
    entries: list[LexicalEntry] = field(default_factory=list)


def add_phrase(
    lexicon: dict[tuple[str, ...], LexicalEntry],
    phrase: str,
    entry: LexicalEntry,
    *,
    max_tokens: int = 12,
) -> None:
    tokens = phrase_tokens(phrase)
    if not tokens or len(tokens) > max_tokens:
        return
    current = lexicon.get(tokens)
    if current is None or (entry.priority, entry.confidence) > (current.priority, current.confidence):
        lexicon[tokens] = entry


def derive_generic_drug_alias(term: str) -> str:
    value = remove_semantic_tag(term)
    value = re.sub(
        r"^(?:producto\s+(?:que\s+)?contiene(?:\s+exactamente)?|producto\s+con)\s+",
        "",
        value,
        flags=re.IGNORECASE,
    )
    value = re.sub(r"\s+como\s+(?:único|unico|solo)\s+ingrediente\s*$", "", value, flags=re.IGNORECASE)
    return value.strip()


def build_drug_lexicon(raw: dict[str, Any]) -> tuple[dict[tuple[str, ...], LexicalEntry], set[str]]:
    lexicon: dict[tuple[str, ...], LexicalEntry] = {}
    single_names: set[str] = set()
    for sctid, item in raw.get("farmacos", {}).items():
        candidates: list[tuple[str, str, int, float]] = []
        for active in item.get("principios_activos", []) or []:
            candidates.append((active, "principio_activo", 50, 0.96))
        brand = item.get("marca_comercial")
        if brand:
            candidates.append((brand, "marca_comercial", 45, 0.94))
        level = item.get("nivel", "")
        if level in {"MP_generico", "MPF_forma"}:
            derived = derive_generic_drug_alias(item.get("term", ""))
            if derived:
                candidates.append((derived, "termino_generico_derivado", 48, 0.95))
        if level == "CD_clinical_drug":
            candidates.append((item.get("term", ""), "farmaco_clinico", 55, 0.97))
        for alias, alias_type, priority, confidence in candidates:
            norm = normalize(alias)
            if not norm or len(norm) < 4 or norm in DRUG_BLOCKLIST or any(ch.isdigit() for ch in norm):
                continue
            tokens = tuple(norm.split())
            if len(tokens) == 1:
                single_names.add(norm)
            add_phrase(
                lexicon,
                alias,
                LexicalEntry("Fármaco", f"snomed_farmacos.{alias_type}", alias, confidence, priority),
                max_tokens=8,
            )
    return lexicon, single_names


def build_procedure_lexicon(raw: dict[str, Any]) -> dict[tuple[str, ...], LexicalEntry]:
    lexicon: dict[tuple[str, ...], LexicalEntry] = {}
    excluded = {normalize(value) for value in raw.get("analitos_excluidos", [])}
    for key, item in raw.get("procedimientos", {}).items():
        aliases: list[tuple[str, str, int]] = [
            (item.get("termino", ""), "termino", 35),
            (item.get("termino_original", ""), "termino_original", 34),
            (item.get("sctid_display", ""), "sctid_display", 42),
        ]
        aliases.extend((value, "sinonimo", 40) for value in (item.get("sinonimos", []) or []))
        for alias, alias_type, priority in aliases:
            alias = remove_semantic_tag(alias)
            norm = normalize(alias)
            if (
                not norm or norm in excluded or norm in PROCEDURE_FRAGMENT_BLOCKLIST
                or norm.startswith("de ") or len(norm) < 5 or not spanish_or_neutral(alias)
            ):
                continue
            tokens = tuple(norm.split())
            if len(tokens) == 1 and not (
                norm in PROCEDURE_SINGLE_WORDS or norm.endswith(PROCEDURE_SUFFIXES)
            ):
                continue
            add_phrase(
                lexicon,
                alias,
                LexicalEntry("Procedimiento", f"snomed_procedimientos.{alias_type}", alias, 0.93, priority),
            )
    return lexicon


def compile_context(raw: dict[str, Any]) -> dict[str, Any]:
    compiled: dict[str, Any] = {}
    for key in ("NEGATION_PRE", "NEGATION_POST", "PSEUDO_NEGATION", "UNCERTAINTY", "HISTORICAL", "FAMILY"):
        compiled[key] = [re.compile(pattern) for pattern in raw.get(key, [])]
    compiled["SECTIONS"] = {
        section: [re.compile(pattern) for pattern in patterns]
        for section, patterns in raw.get("SECTIONS", {}).items()
    }
    compiled["HEADER_PRIORS"] = raw.get("HEADER_PRIORS", {})
    return compiled


def build_abbreviation_resources(
    raw: dict[str, Any],
    drug_lexicon: dict[tuple[str, ...], LexicalEntry],
    procedure_lexicon: dict[tuple[str, ...], LexicalEntry],
    drug_single_names: set[str],
) -> tuple[dict[str, Any], dict[str, list[tuple[str, Any]]], dict[tuple[str, ...], LexicalEntry]]:
    exact = dict(raw)
    insensitive: dict[str, list[tuple[str, Any]]] = defaultdict(list)
    expansions: dict[tuple[str, ...], LexicalEntry] = {}
    for abbreviation, item in raw.items():
        if len(abbreviation) >= 3 and " " not in abbreviation:
            insensitive[abbreviation.upper()].append((abbreviation, item))
        values = [item.get("default", "")]
        values.extend(rule.get("expansion", "") for rule in item.get("rules", []))
        for value in values:
            tokens = phrase_tokens(value)
            if len(tokens) < 2 or len(tokens) > 10:
                continue
            if " ".join(tokens) in EXPANSION_BLOCKLIST:
                continue
            category = guess_category(value, drug_lexicon, procedure_lexicon, drug_single_names)
            add_phrase(
                expansions,
                value,
                LexicalEntry(category, "abbreviations_master.expansion", value, 0.88, 20),
                max_tokens=10,
            )
    return exact, insensitive, expansions


def guess_category(
    expansion: str,
    drug_lexicon: dict[tuple[str, ...], LexicalEntry],
    procedure_lexicon: dict[tuple[str, ...], LexicalEntry],
    drug_single_names: set[str],
) -> str:
    tokens = phrase_tokens(expansion)
    if tokens in drug_lexicon or any(token in drug_single_names for token in tokens):
        return "Fármaco"
    norm = " ".join(tokens)
    if tokens in procedure_lexicon or any(hint in norm for hint in PROCEDURE_HINTS) or norm.endswith(PROCEDURE_SUFFIXES):
        return "Procedimiento"
    return "Hallazgo clínico"


def build_trie(lexicons: Iterable[dict[tuple[str, ...], LexicalEntry]]) -> TrieNode:
    root = TrieNode()
    merged: dict[tuple[str, ...], LexicalEntry] = {}
    for lexicon in lexicons:
        for tokens, entry in lexicon.items():
            current = merged.get(tokens)
            if current is None or (entry.priority, entry.confidence) > (current.priority, current.confidence):
                merged[tokens] = entry
    for tokens, entry in merged.items():
        node = root
        for token in tokens:
            node = node.children.setdefault(token, TrieNode())
        node.entries.append(entry)
    return root


def resolve_abbreviation(item: dict[str, Any], window: str) -> tuple[str, bool]:
    default = item.get("default", "")
    norm_window = normalize(window)
    for rule in item.get("rules", []) or []:
        if any(normalize(term) in norm_window for term in rule.get("context", []) if normalize(term)):
            return rule.get("expansion", default), True
    return default, False


def find_sections(text: str, context: dict[str, Any]) -> list[tuple[int, str, dict[str, str]]]:
    marks: list[tuple[int, str, dict[str, str]]] = []
    offset = 0
    for line in text.splitlines(keepends=True):
        stripped = line.lstrip()
        lead = len(line) - len(stripped)
        found = False
        for section, patterns in context["SECTIONS"].items():
            if any(pattern.search(stripped) for pattern in patterns):
                marks.append((offset + lead, section, {}))
                found = True
                break
        if not found:
            norm_line = normalize(stripped.split(":", 1)[0])
            for header, prior in sorted(context["HEADER_PRIORS"].items(), key=lambda pair: -len(pair[0])):
                if norm_line == normalize(header) or norm_line.startswith(normalize(header) + " "):
                    attrs: dict[str, str] = {}
                    if prior.get("temporality"):
                        attrs["temp"] = prior["temporality"]
                    if prior.get("subject"):
                        attrs["suj"] = prior["subject"]
                    marks.append((offset + lead, prior.get("section_hint", ""), attrs))
                    break
        offset += len(line)
    return sorted(marks)


def context_for_span(text: str, start: int, end: int, context: dict[str, Any], sections: list[tuple[int, str, dict[str, str]]]) -> dict[str, str]:
    left = text[max(0, start - 100):start]
    right = text[end:min(len(text), end + 100)]
    left_cut = max((left.rfind(ch) for ch in SEGMENT_BOUNDARIES), default=-1)
    if left_cut >= 0:
        left = left[left_cut + 1:]
    right_cuts = [right.find(ch) for ch in SEGMENT_BOUNDARIES if ch in right]
    if right_cuts:
        right = right[:min(right_cuts)]
    whole = f"{left} {right}"
    pseudo = any(pattern.search(whole) for pattern in context["PSEUDO_NEGATION"])
    negated = any(pattern.search(left) for pattern in context["NEGATION_PRE"]) or any(
        pattern.search(right) for pattern in context["NEGATION_POST"]
    )
    attrs: dict[str, str] = {"pol": "Negado" if negated and not pseudo else "Activo"}
    if any(pattern.search(whole) for pattern in context["UNCERTAINTY"]):
        attrs["cert"] = "Sospecha"
    if any(pattern.search(whole) for pattern in context["HISTORICAL"]):
        attrs["temp"] = "Histórico"
    if any(pattern.search(whole) for pattern in context["FAMILY"]):
        attrs["suj"] = "Familiar"
    for position, section, priors in sections:
        if position <= start:
            if section:
                attrs["section"] = section
            attrs.update(priors)
        else:
            break
    return attrs


def overlaps(start: int, end: int, occupied: list[tuple[int, int]]) -> bool:
    return any(start < other_end and end > other_start for other_start, other_end in occupied)


def scan_trie(text: str, root: TrieNode) -> list[dict[str, Any]]:
    tokens = tokenise_with_offsets(text)
    candidates: list[dict[str, Any]] = []
    for index in range(len(tokens)):
        node = root
        cursor = index
        while cursor < len(tokens) and tokens[cursor][0] in node.children:
            node = node.children[tokens[cursor][0]]
            if node.entries:
                start, end = tokens[index][1], tokens[cursor][2]
                for entry in node.entries:
                    candidates.append({
                        "start": start,
                        "end": end,
                        "textoLiteral": text[start:end],
                        "entry": entry,
                        "token_count": cursor - index + 1,
                    })
            cursor += 1
    return candidates


def scan_abbreviations(
    text: str,
    exact: dict[str, Any],
    insensitive: dict[str, list[tuple[str, Any]]],
    drug_lexicon: dict[tuple[str, ...], LexicalEntry],
    procedure_lexicon: dict[tuple[str, ...], LexicalEntry],
    drug_single_names: set[str],
) -> list[dict[str, Any]]:
    raw_tokens = [(m.group(0), m.start(), m.end()) for m in TOKEN_RE.finditer(text)]
    candidates: list[dict[str, Any]] = []
    for index, (literal, start, end) in enumerate(raw_tokens):
        matched_key = literal if literal in exact else None
        item = exact.get(literal)
        if item is None and len(literal) >= 3 and literal.upper() in insensitive:
            matched_key, item = insensitive[literal.upper()][0]
        if item is None or literal.upper() in ADMIN_ABBREVIATIONS or len(literal) == 1:
            continue
        if normalize(literal) in LAB_ANALYTES and re.match(
            r"\s*[:=]?\s*\d+(?:[.,/]\d+)?", text[end:end + 24]
        ):
            continue
        window_start = raw_tokens[max(0, index - 6)][1]
        window_end = raw_tokens[min(len(raw_tokens) - 1, index + 6)][2]
        expansion, used_wsd = resolve_abbreviation(item, text[window_start:window_end])
        if len(matched_key) <= 2 and not (used_wsd or (literal.isupper() and literal.isalpha())):
            continue
        category = ABBREVIATION_CATEGORY_OVERRIDES.get(
            matched_key.upper(),
            guess_category(expansion, drug_lexicon, procedure_lexicon, drug_single_names),
        )
        candidates.append({
            "start": start,
            "end": end,
            "textoLiteral": literal,
            "entry": LexicalEntry(category, "abbreviations_master.sigla", matched_key, 0.91 if used_wsd else 0.86, 25),
            "token_count": 1,
            "expansion": expansion,
            "used_wsd": used_wsd,
        })
    return candidates


def scan_procedure_morphology(text: str) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    for norm, start, end in tokenise_with_offsets(text):
        if len(norm) < 6 or not (norm in PROCEDURE_SINGLE_WORDS or norm.endswith(PROCEDURE_SUFFIXES)):
            continue
        candidates.append({
            "start": start,
            "end": end,
            "textoLiteral": text[start:end],
            "entry": LexicalEntry("Procedimiento", "snomed_procedimientos.actos_reconocibles", norm, 0.89, 30),
            "token_count": 1,
        })
    return candidates


def measured_lab_value(text: str, start: int, end: int) -> bool:
    literal = normalize(text[start:end])
    if literal not in LAB_ANALYTES:
        return False
    return bool(re.match(r"\s*[:=]?\s*\d+(?:[.,/]\d+)?", text[end:end + 24]))


def plausible_drug_candidate(text: str, start: int, end: int, norm: str, score: float) -> bool:
    if norm in DRUG_CLASS_TERMS or norm.endswith(DRUG_SUFFIXES):
        return True
    nearby = text[max(0, start - 60):min(len(text), end + 60)]
    return bool(DRUG_CONTEXT_RE.search(nearby)) or score >= 0.85


def plausible_procedure_candidate(norm: str) -> bool:
    if norm in PROCEDURE_CUES or norm.endswith(PROCEDURE_SUFFIXES):
        return True
    tokens = set(norm.split())
    if tokens & PROCEDURE_CUES:
        return True
    return any(hint in norm for hint in PROCEDURE_HINTS)


def scan_spancat(text: str, models: list[Any]) -> list[dict[str, Any]]:
    """Obtiene candidatos SpanCat y aplica exclusiones estructurales tempranas."""
    candidates: list[dict[str, Any]] = []
    for model_index, nlp in enumerate(models, start=1):
        doc = nlp(text)
        group = doc.spans.get("sc")
        if group is None:
            continue
        raw_scores = group.attrs.get("scores", [])
        if hasattr(raw_scores, "reshape"):
            scores = list(raw_scores.reshape(-1))
        else:
            scores = list(raw_scores)
        if len(scores) != len(group):
            scores = [0.5] * len(group)
        for predicted, score in zip(group, scores):
            category = CATEGORY_MAP.get(predicted.label_)
            start, end = predicted.start_char, predicted.end_char
            while start < end and not text[start].isalnum():
                start += 1
            while end > start and not text[end - 1].isalnum():
                end -= 1
            literal = text[start:end]
            norm = normalize(literal)
            score_value = float(score)
            alpha_len = len(re.sub(r"[^a-z]", "", norm))
            if category not in CANONICAL_CATEGORIES or alpha_len < 3:
                continue
            if "\n" in literal or "\r" in literal:
                continue
            if re.fullmatch(r"\d+(?:[.,]\d+)?\s*(?:mg|mcg|g|ml|ui|ml/hora|horas?)", norm):
                continue
            source_label = normalize(predicted.label_).replace(" ", "_")
            if score_value < SPANCAT_MIN_CONFIDENCE.get(source_label, 1.0):
                continue
            if norm in SPAN_NOISE or norm in DRUG_BLOCKLIST or norm.upper() in ADMIN_ABBREVIATIONS:
                continue
            if category in {"Fármaco", "Procedimiento"} and any(
                token in LAB_ANALYTES for token in norm.split()
            ):
                continue
            if category in {"Fármaco", "Procedimiento"} and re.search(
                r"(?:^|\s)c\s+(?:hdl|ldl)(?:$|\s)", norm
            ):
                continue
            if category == "Hallazgo clínico" and re.search(
                r"\b(?:anos? de edad|ml hora)\b", norm
            ):
                continue
            if measured_lab_value(text, start, end):
                continue
            if category == "Procedimiento" and norm in DRUG_CLASS_TERMS:
                category = "Fármaco"
            if category == "Fármaco" and not plausible_drug_candidate(
                text, start, end, norm, score_value
            ):
                continue
            if category == "Procedimiento" and not plausible_procedure_candidate(norm):
                continue
            candidates.append({
                "start": start,
                "end": end,
                "textoLiteral": literal,
                "entry": LexicalEntry(category, f"spancat.{source_label}", predicted.label_, round(score_value, 4), 10),
                "token_count": predicted.end - predicted.start,
            })
    return candidates


def canonical_category(span: dict[str, Any]) -> str | None:
    suggest = span.get("suggest") or {}
    raw = suggest.get("category")
    if raw in CATEGORY_MAP:
        return CATEGORY_MAP[raw]
    if span.get("origin") == "ner" and raw:
        return "Hallazgo clínico"
    return None


def enrich_case(
    case: dict[str, Any],
    root: TrieNode,
    exact_abbr: dict[str, Any],
    insensitive_abbr: dict[str, list[tuple[str, Any]]],
    drug_lexicon: dict[tuple[str, ...], LexicalEntry],
    procedure_lexicon: dict[tuple[str, ...], LexicalEntry],
    drug_single_names: set[str],
    context: dict[str, Any],
    spancat_models: list[Any],
) -> tuple[dict[str, Any], list[dict[str, Any]], Counter]:
    text = case.get("textNorm") or case.get("text") or ""
    sections = find_sections(text, context)
    stats: Counter = Counter()
    existing: list[dict[str, Any]] = []
    ids: set[str] = set()
    for original in case.get("spans", []) or []:
        span = dict(original)
        if not isinstance(span.get("start"), int) or not isinstance(span.get("end"), int):
            stats["invalid_existing"] += 1
            continue
        if text[span["start"]:span["end"]] != span.get("textoLiteral"):
            stats["invalid_existing"] += 1
            continue
        if span.get("spanId") in ids:
            stats["duplicate_existing_id"] += 1
            continue
        ids.add(span.get("spanId"))
        suggest = dict(span.get("suggest") or {})
        category = canonical_category(span)
        if category is None:
            category = guess_category(
                suggest.get("expansionAbbrev") or span.get("textoLiteral", ""),
                drug_lexicon,
                procedure_lexicon,
                drug_single_names,
            )
        if suggest.get("category") != category:
            suggest["category"] = category
            stats["categories_normalized"] += 1
        derived = context_for_span(text, span["start"], span["end"], context, sections)
        for key, value in derived.items():
            suggest.setdefault(key, value)
        span["suggest"] = suggest
        existing.append(span)

    existing.sort(key=lambda item: (item["start"], item["end"]))
    occupied = [(span["start"], span["end"]) for span in existing]
    accepted: list[dict[str, Any]] = []

    def accept_stage(candidates: list[dict[str, Any]], stage: str) -> None:
        candidates.sort(
            key=lambda item: (
                -item["entry"].confidence if stage == "spancat" else -item["token_count"],
                -(item["end"] - item["start"]),
                -item["entry"].priority,
                item["start"],
            )
        )
        for candidate in candidates:
            start, end = candidate["start"], candidate["end"]
            if overlaps(start, end, occupied):
                stats[f"rejected_overlap_{stage}"] += 1
                continue
            entry: LexicalEntry = candidate["entry"]
            suggest: dict[str, Any] = {"category": entry.category}
            suggest.update(context_for_span(text, start, end, context, sections))
            if candidate.get("expansion"):
                suggest["expansionAbbrev"] = candidate["expansion"]
            suffix = 1
            while f"enr{suffix:03d}" in ids:
                suffix += 1
            span_id = f"enr{suffix:03d}"
            ids.add(span_id)
            if entry.source.startswith("spancat"):
                origin = "spancat"
            elif entry.source.startswith(("snomed_", "abbreviations_master.sigla")):
                origin = "dict"
            else:
                origin = "matcher"
            span = {
                "start": start,
                "end": end,
                "textoLiteral": text[start:end],
                "origin": origin,
                "confidence": entry.confidence,
                "matchedKey": entry.matched_key,
                "usedWSD": bool(candidate.get("used_wsd", False)),
                "suggest": suggest,
                "status": "pendiente",
                "spanId": span_id,
                "lexiconSource": entry.source,
            }
            accepted.append(span)
            occupied.append((start, end))
            stats[f"new_{entry.category}"] += 1
            stats[f"source_{entry.source}"] += 1

    deterministic = scan_trie(text, root)
    deterministic.extend(scan_abbreviations(text, exact_abbr, insensitive_abbr, drug_lexicon, procedure_lexicon, drug_single_names))
    deterministic.extend(scan_procedure_morphology(text))
    accept_stage(deterministic, "deterministic")
    accept_stage(scan_spancat(text, spancat_models), "spancat")
    case["spans"] = sorted(existing + accepted, key=lambda item: (item["start"], item["end"]))
    return case, accepted, stats


def span_category(span: dict[str, Any]) -> str:
    return canonical_category(span) or "Sin categoría canónica"


def validate_document(document: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    for case in document.get("cases", []):
        text = case.get("textNorm") or case.get("text") or ""
        previous_end = 0
        ids: set[str] = set()
        for span in sorted(case.get("spans", []), key=lambda item: (item["start"], item["end"])):
            label = f"{case.get('id')}:{span.get('spanId')}"
            start, end = span.get("start"), span.get("end")
            if not isinstance(start, int) or not isinstance(end, int) or start < previous_end or start >= end:
                errors.append(f"offset/overlap inválido: {label}")
                continue
            if end > len(text) or text[start:end] != span.get("textoLiteral"):
                errors.append(f"literal no coincide: {label}")
            if span.get("spanId") in ids:
                errors.append(f"spanId duplicado: {label}")
            if span_category(span) not in CANONICAL_CATEGORIES:
                errors.append(f"categoría no canónica: {label}")
            ids.add(span.get("spanId"))
            previous_end = end
    return errors


def count_document(document: dict[str, Any]) -> Counter:
    counts: Counter = Counter(cases=len(document.get("cases", [])))
    for case in document.get("cases", []):
        spans = case.get("spans", []) or []
        counts["spans"] += len(spans)
        if spans:
            counts["cases_with_spans"] += 1
        for span in spans:
            counts[f"category_{span_category(span)}"] += 1
    return counts


def relative_path(path: Path, base: Path) -> str:
    return path.resolve().relative_to(base.resolve()).as_posix()


def write_csv(path: Path, rows: list[dict[str, Any]], fieldnames: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--drugs", required=True, type=Path)
    parser.add_argument("--procedures", required=True, type=Path)
    parser.add_argument("--abbreviations", required=True, type=Path)
    parser.add_argument("--context-rules", required=True, type=Path)
    parser.add_argument("--spancat-model", required=True, type=Path, nargs="+")
    args = parser.parse_args()

    input_root = args.input.resolve()
    output_root = args.output.resolve()
    resources = {
        "snomed_farmacos": args.drugs.resolve(),
        "snomed_procedimientos": args.procedures.resolve(),
        "abreviaturas": args.abbreviations.resolve(),
        "reglas_contexto": args.context_rules.resolve(),
    }
    resources.update({
        f"spancat_model_{index}": path.resolve()
        for index, path in enumerate(args.spancat_model, start=1)
    })
    for required in [input_root, *resources.values()]:
        if not required.exists():
            raise FileNotFoundError(required)

    import spacy

    drug_raw = load_json(resources["snomed_farmacos"])
    procedure_raw = load_json(resources["snomed_procedimientos"])
    abbreviation_raw = load_json(resources["abreviaturas"])
    context_raw = load_json(resources["reglas_contexto"])
    drug_lexicon, drug_single_names = build_drug_lexicon(drug_raw)
    procedure_lexicon = build_procedure_lexicon(procedure_raw)
    exact_abbr, insensitive_abbr, expansion_lexicon = build_abbreviation_resources(
        abbreviation_raw, drug_lexicon, procedure_lexicon, drug_single_names
    )
    trie = build_trie((drug_lexicon, procedure_lexicon, expansion_lexicon))
    context = compile_context(context_raw)
    spancat_models = [spacy.load(path.resolve()) for path in args.spancat_model]
    for model_path, spancat_nlp in zip(args.spancat_model, spancat_models):
        if "spancat" not in spancat_nlp.pipe_names:
            raise RuntimeError(f"El modelo no contiene el componente spancat: {model_path}")

    source_files = sorted(
        path for stratum in ("basico", "avanzado")
        for path in (input_root / stratum).glob("celda_*_premarcado.json")
    )
    if len(source_files) != 48:
        raise RuntimeError(f"Se esperaban 48 JSON de celda y se encontraron {len(source_files)}")

    if output_root.exists():
        shutil.rmtree(output_root)
    output_root.mkdir(parents=True)

    run_at = datetime.now(timezone.utc).isoformat()
    aggregate_pre: Counter = Counter()
    aggregate_post: Counter = Counter()
    aggregate_enrichment: Counter = Counter()
    per_stratum_pre: dict[str, Counter] = defaultdict(Counter)
    per_stratum_post: dict[str, Counter] = defaultdict(Counter)
    per_stratum_enrichment: dict[str, Counter] = defaultdict(Counter)
    audit_rows: list[dict[str, Any]] = []
    file_rows: list[dict[str, Any]] = []
    manifest: dict[str, Any] = {
        "generated_at_utc": run_at,
        "input_root": str(input_root),
        "output_root": str(output_root),
        "resources": {
            name: {"path": str(path), "sha256": sha256_path(path)}
            for name, path in resources.items()
        },
        "files": [],
    }

    for source_path in source_files:
        stratum = source_path.parent.name
        source_document = load_json(source_path)
        pre_counts = count_document(source_document)
        source_hash_before = sha256(source_path)
        document = json.loads(json.dumps(source_document, ensure_ascii=False))
        file_stats: Counter = Counter()
        file_new: list[dict[str, Any]] = []
        cases_with_new: set[str] = set()
        for case in document.get("cases", []):
            enriched, accepted, case_stats = enrich_case(
                case, trie, exact_abbr, insensitive_abbr, drug_lexicon,
                procedure_lexicon, drug_single_names, context,
                spancat_models,
            )
            file_stats.update(case_stats)
            if accepted:
                cases_with_new.add(case.get("id", ""))
            for span in accepted:
                file_new.append(span)
                audit_rows.append({
                    "estrato": stratum,
                    "archivo": source_path.name,
                    "caso_id": case.get("id", ""),
                    "span_id": span["spanId"],
                    "inicio": span["start"],
                    "fin": span["end"],
                    "texto_literal": span["textoLiteral"],
                    "categoria": span["suggest"]["category"],
                    "fuente_lexica": span["lexiconSource"],
                    "clave_coincidente": span["matchedKey"],
                    "confianza": span["confidence"],
                    "polaridad_sugerida": span["suggest"].get("pol", ""),
                    "certeza_sugerida": span["suggest"].get("cert", ""),
                    "temporalidad_sugerida": span["suggest"].get("temp", ""),
                    "sujeto_sugerido": span["suggest"].get("suj", ""),
                    "seccion_sugerida": span["suggest"].get("section", ""),
                })
        document.setdefault("_premarking", {})["enrichment"] = {
            "method": "hybrid_deterministic_plus_spancat_v1",
            "generatedAtUtc": run_at,
            "blindAnnotation": True,
            "sctidPreloaded": False,
            "resources": {
                name: {
                    "file": path.name,
                    "sha256": sha256_path(path),
                }
                for name, path in resources.items()
            },
            "newSpans": len(file_new),
            "categoriesNormalized": file_stats["categories_normalized"],
        }
        errors = validate_document(document)
        if errors:
            raise RuntimeError(f"Validación fallida en {source_path.name}: {errors[:10]}")
        destination = output_root / stratum / source_path.name
        dump_json(destination, document)
        if sha256(source_path) != source_hash_before:
            raise RuntimeError(f"El archivo fuente cambió durante el proceso: {source_path}")
        post_counts = count_document(document)
        aggregate_pre.update(pre_counts)
        aggregate_post.update(post_counts)
        aggregate_enrichment.update(file_stats)
        per_stratum_pre[stratum].update(pre_counts)
        per_stratum_post[stratum].update(post_counts)
        per_stratum_enrichment[stratum].update(file_stats)
        file_rows.append({
            "estrato": stratum,
            "archivo": source_path.name,
            "casos": pre_counts["cases"],
            "spans_pre": pre_counts["spans"],
            "spans_post": post_counts["spans"],
            "spans_nuevos": len(file_new),
            "casos_con_spans_nuevos": len(cases_with_new),
            "categorias_normalizadas": file_stats["categories_normalized"],
            "errores_validacion": 0,
        })
        manifest["files"].append({
            "stratum": stratum,
            "file": source_path.name,
            "input_sha256": source_hash_before,
            "output_sha256": sha256(destination),
        })

    for stratum in ("basico", "avanzado"):
        pre = per_stratum_pre[stratum]
        post = per_stratum_post[stratum]
        enrichment = per_stratum_enrichment[stratum]
        coverage = {
            "casos_procesados": post["cases"],
            "spans_totales": post["spans"],
            "spans_por_caso_promedio": round(post["spans"] / post["cases"], 3),
            "notas_con_span_final": post["cases_with_spans"],
            "notas_sin_span_final": post["cases"] - post["cases_with_spans"],
            "cobertura_notas_con_span_pct": round(100 * post["cases_with_spans"] / post["cases"], 2),
            "comparacion_pre_post": {
                "spans_pre": pre["spans"],
                "spans_nuevos": post["spans"] - pre["spans"],
                "incremento_relativo_pct": round(100 * (post["spans"] - pre["spans"]) / pre["spans"], 2),
                "categorias_normalizadas": enrichment["categories_normalized"],
            },
            "por_categoria": {
                category: post[f"category_{category}"] for category in sorted(CANONICAL_CATEGORIES)
            },
        }
        dump_json(output_root / stratum / "resumen_cobertura.json", coverage)

    new_by_category = {
        category: aggregate_enrichment[f"new_{category}"] for category in sorted(CANONICAL_CATEGORIES)
    }
    new_by_source = {
        key.removeprefix("source_"): value
        for key, value in sorted(aggregate_enrichment.items()) if key.startswith("source_")
    }
    summary = {
        "schema_version": "1.0",
        "generated_at_utc": run_at,
        "method": "hybrid_deterministic_plus_spancat_v1",
        "scope": {"files": len(source_files), "cases": aggregate_post["cases"], "strata": ["basico", "avanzado"]},
        "resources": manifest["resources"],
        "lexicon": {
            "drug_phrases": len(drug_lexicon),
            "drug_single_names": len(drug_single_names),
            "procedure_phrases": len(procedure_lexicon),
            "abbreviation_entries": len(abbreviation_raw),
            "abbreviation_expansion_phrases": len(expansion_lexicon),
        },
        "pre": dict(aggregate_pre),
        "post": dict(aggregate_post),
        "change": {
            "new_spans": aggregate_post["spans"] - aggregate_pre["spans"],
            "relative_increase_pct": round(100 * (aggregate_post["spans"] - aggregate_pre["spans"]) / aggregate_pre["spans"], 2),
            "categories_normalized": aggregate_enrichment["categories_normalized"],
            "rejected_overlaps": {
                "deterministic": aggregate_enrichment["rejected_overlap_deterministic"],
                "spancat": aggregate_enrichment["rejected_overlap_spancat"],
            },
            "new_by_category": new_by_category,
            "new_by_source": new_by_source,
        },
        "validation": {
            "status": "passed",
            "json_files_validated": len(source_files),
            "offset_literal_exact": True,
            "unique_span_ids_per_case": True,
            "non_overlapping_spans": True,
            "canonical_categories_only": True,
            "source_files_unchanged": True,
        },
    }
    dump_json(output_root / "RESUMEN_ENRIQUECIMIENTO.json", summary)
    dump_json(output_root / "MANIFIESTO_SHA256.json", manifest)
    write_csv(
        output_root / "EVALUACION_POR_ARCHIVO.csv",
        file_rows,
        ["estrato", "archivo", "casos", "spans_pre", "spans_post", "spans_nuevos", "casos_con_spans_nuevos", "categorias_normalizadas", "errores_validacion"],
    )
    write_csv(
        output_root / "NUEVOS_SPANS_AUDITORIA.csv",
        audit_rows,
        ["estrato", "archivo", "caso_id", "span_id", "inicio", "fin", "texto_literal", "categoria", "fuente_lexica", "clave_coincidente", "confianza", "polaridad_sugerida", "certeza_sugerida", "temporalidad_sugerida", "sujeto_sugerido", "seccion_sugerida"],
    )
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

/** Data model for the SEMANTIAR annotation tool. */
import { environment } from '../../environments/environment';

export const SEMANTIAR_SCHEMA_VERSION = '1.0.0' as const;

export interface TextProfile {
  normalization: 'NFC';
  lineEndings: 'LF';
  offsetUnit: 'utf16-code-unit';
}

export const SEMANTIAR_TEXT_PROFILE: TextProfile = {
  normalization: 'NFC',
  lineEndings: 'LF',
  offsetUnit: 'utf16-code-unit',
};

export interface TerminologySnapshot {
  server: string;
  editionUri: string;
  version: string | null;
  displayLanguage: string;
  capturedAt: string;
}

export interface ProducerMetadata {
  app: 'SemantIAr';
  build: string;
  platform: 'web' | 'android';
}

export type AnnotationPlatform = ProducerMetadata['platform'];

/** Clinical case loaded from the input JSON (read-only content). */
export interface ClinicalCase {
  id: string;
  text: string;
  /** Offset base for premarked spans. Defaults to `text` when not provided. */
  textNorm?: string;
  spans?: PremarkedSpan[];
  concepts?: ConceptAnnotation[];
  comentarios?: string;
  review?: CaseReview;
  lexicalMentions?: LexicalMention[];
  lexicalReview?: LexicalReview;
}

export type SpanOrigin = 'candidate' | 'dict' | 'matcher' | 'ner' | 'spancat' | 'rescue' | 'human';
export type SpanStatus = 'pendiente' | 'confirmado' | 'descartado';

/** Contextual hints generated with a span. They intentionally exclude an SCTID. */
export interface SpanSuggestion {
  /** Source systems may use labels outside the three annotation categories. */
  category?: Category | string;
  expansionAbbrev?: string;
  pol?: Polarity;
  cert?: Certainty;
  temp?: Temporality;
  suj?: Subject;
  section?: string;
}

export interface SpanReview {
  disposition: 'elegible' | 'excluido';
  reason: string;
}

/** Human actions retained for audit but never shown as model guidance. */
export interface SpanHumanAudit {
  createdManually?: boolean;
  createdAt?: string;
  originalStart?: number;
  originalEnd?: number;
  originalTextoLiteral?: string;
  boundaryAdjusted?: boolean;
  lastAction?: 'created' | 'boundary_adjusted' | 'accepted' | 'discarded';
  lastActionAt?: string;
  createdPlatform?: AnnotationPlatform;
  lastActionPlatform?: AnnotationPlatform;
}

/** A fixed, premarked text span shared by all annotators. */
export interface PremarkedSpan {
  spanId: string;
  start: number;
  end: number;
  textoLiteral: string;
  origin: SpanOrigin;
  confidence: number;
  matchedKey?: string;
  usedWSD?: boolean;
  suggest?: SpanSuggestion;
  status: SpanStatus;
  review?: SpanReview;
  humanAudit?: SpanHumanAudit;
}

export type TextSegment =
  | { kind: 'text'; value: string }
  | { kind: 'span'; value: string; spans: PremarkedSpan[] };

export interface SpanNormalizationResult {
  spans: PremarkedSpan[];
  invalidCount: number;
}

/**
 * Keeps spans whose offsets and literal match `textNorm`. Spans may overlap:
 * different valid clinical mentions can share part of the same source text.
 * Invalid input is counted so callers can surface it rather than treating it as valid.
 */
export function normalizePremarkedSpans(
  rawSpans: unknown,
  textNorm: string
): SpanNormalizationResult {
  if (!Array.isArray(rawSpans)) return { spans: [], invalidCount: 0 };

  const candidates = rawSpans
    .filter(
      (span): span is PremarkedSpan =>
        typeof span === 'object' &&
        span !== null &&
        typeof (span as PremarkedSpan).spanId === 'string' &&
        typeof (span as PremarkedSpan).start === 'number' &&
        typeof (span as PremarkedSpan).end === 'number' &&
        typeof (span as PremarkedSpan).textoLiteral === 'string' &&
        typeof (span as PremarkedSpan).origin === 'string' &&
        typeof (span as PremarkedSpan).confidence === 'number'
    )
    .sort((left, right) => left.start - right.start || left.end - right.end);

  const spans: PremarkedSpan[] = [];
  let invalidCount = rawSpans.length - candidates.length;
  const ids = new Set<string>();

  for (const span of candidates) {
    const splitsSurrogatePair = (offset: number) => {
      if (offset <= 0 || offset >= textNorm.length) return false;
      const previous = textNorm.charCodeAt(offset - 1);
      const next = textNorm.charCodeAt(offset);
      return (
        previous >= 0xd800 &&
        previous <= 0xdbff &&
        next >= 0xdc00 &&
        next <= 0xdfff
      );
    };
    const validOffsets =
      Number.isInteger(span.start) &&
      Number.isInteger(span.end) &&
      span.start >= 0 &&
      span.start < span.end &&
      span.end <= textNorm.length &&
      !splitsSurrogatePair(span.start) &&
      !splitsSurrogatePair(span.end) &&
      textNorm.slice(span.start, span.end) === span.textoLiteral;

    if (!validOffsets || ids.has(span.spanId)) {
      invalidCount += 1;
      continue;
    }

    spans.push(reviewPremarkedSpan({ ...span, status: span.status ?? 'pendiente' }, textNorm));
    ids.add(span.spanId);
  }

  return { spans, invalidCount };
}

/**
 * Turns verified offsets into text segments. Each marked segment carries every
 * active span covering it, so partially or fully overlapping spans remain
 * independently selectable without duplicating source text.
 */
export function buildTextSegments(textNorm: string, spans: readonly PremarkedSpan[]): TextSegment[] {
  const activeSpans = spans
    .filter((span) => span.review?.disposition !== 'excluido')
    .sort((left, right) => left.start - right.start || left.end - right.end || left.spanId.localeCompare(right.spanId));
  const boundaries = [...new Set([0, textNorm.length, ...activeSpans.flatMap((span) => [span.start, span.end])])]
    .sort((left, right) => left - right);
  const segments: TextSegment[] = [];
  for (let index = 0; index < boundaries.length - 1; index += 1) {
    const start = boundaries[index];
    const end = boundaries[index + 1];
    if (end <= start) continue;
    const covering = activeSpans.filter((span) => span.start < end && span.end > start);
    const value = textNorm.slice(start, end);
    if (covering.length) {
      segments.push({ kind: 'span', value, spans: covering });
    } else {
      segments.push({ kind: 'text', value });
    }
  }
  return segments;
}

/**
 * Lab analytes excluded when immediately followed by a numeric result.
 * A measured analyte value (e.g. "GOT 38") is contextually clear but maps to
 * a Quantity, not a Finding/Procedure concept at annotation grain.
 * Note: 'hb' (hemoglobina) is handled separately — it has a cardiac WSD sense.
 */
const LABORATORY_ANALYTES = new Set([
  // bilirubins
  'bd', 'bi', 'bt',
  // coagulation
  'kptt', 'tp',
  // enzymes / liver
  'aldolasa', 'ck', 'cpk', 'fa', 'fal', 'ggt', 'got', 'gpt', 'ldh', 'tgo', 'tgp',
  // haematology
  'gb', 'gr', 'hb', 'hemoglobina', 'hto', 'hcto', 'plaq', 'plaquetas',
  // inflammatory
  'pcr', 'vsg',
  // metabolic
  'albumina', 'beab', 'bilirrubina', 'colesterol', 'creat', 'creatinina',
  'ferritina', 'fructosamina', 'glucemia', 'glucosa', 'hdl', 'hierro', 'ldl',
  'lipasa', 'potasio', 'procalcitonina', 'sodio', 'transaminasas', 'transferrina',
  'trigliceridos', 'tromboplastina', 'urea', 'uremia',
  // thyroid
  't3', 't4', 'tsh',
]);

/** Vital-sign abbreviations kept when carrying a measured numeric value. */
const VITAL_SIGNS = new Set(['fc', 'fr', 'sat', 'spo2', 'ta']);

/**
 * Single-token administrative/structural terms that never correspond to a
 * standalone SNOMED CT concept in the three annotation hierarchies.
 */
const ADMINISTRATIVE_TERMS = new Set([
  'pte',   // "paciente" — subject reference, not a clinical concept
  'mc',    // "motivo de consulta" — section header
  'gi',    // "gastrointestinal" — anatomical modifier
  'tto',   // "tratamiento" — generic noun; specific treatment captured elsewhere
]);

/** Route abbreviations excluded when isolated (valid only as modifiers). */
const ROUTES = new Set(['ev', 'im', 'sc', 'vo']);

/** Medications and parenteral preparations — always Fármaco. */
const MEDICATIONS = new Set(['aas', 'atb', 'php']);

/** Devices / lines / catheters — default Hallazgo clínico (in-situ state). */
const DEVICES = new Set(['avp', 'sng']);

/**
 * Procedures: imaging, electrophysiology, serology panels, vital-sign monitoring.
 * These are always eligible with category Procedimiento.
 */
const PROCEDURES = new Set([
  'csv',                        // control de signos vitales
  'ecg', 'eco', 'examen fisico', 'pap', 'rmn', 'tac',
  'chagas', 'hiv', 'toxo', 'vdrl',  // serology panels
]);

/** Clinical findings with unambiguous meaning (no WSD needed). */
const CLINICAL_FINDINGS = new Set([
  'afebril',
  'rha',   // ruidos hidroaéreos
]);

function literalKey(span: PremarkedSpan): string {
  return span.textoLiteral.trim().toLocaleLowerCase('es-AR');
}

function nearbyText(span: PremarkedSpan, textNorm: string): string {
  return textNorm.slice(Math.max(0, span.start - 80), Math.min(textNorm.length, span.end + 80));
}

function followsMeasuredValue(span: PremarkedSpan, textNorm: string): boolean {
  return /^\s*[:=]?\s*\d+(?:[.,/]\d+)?(?:\s*(?:%|mg\/dl|mmhg|rpm|lpm|g\/dl))?/i.test(
    textNorm.slice(span.end)
  );
}

function suggestCategory(span: PremarkedSpan, category: Category, expansionAbbrev?: string): PremarkedSpan {
  return {
    ...span,
    suggest: {
      ...span.suggest,
      category,
      ...(expansionAbbrev ? { expansionAbbrev } : {}),
    },
  };
}

/**
 * Classifies a premarked span into one of three annotation hierarchies
 * (Hallazgo clínico / Procedimiento / Fármaco) or marks it as excluded noise.
 *
 * Rules are applied in strict priority order following the tri-axial calibration
 * convention.  No SCTID is ever pre-loaded; only `suggest.category` is set so the
 * annotator sees a hint without being anchored to a specific concept.
 *
 * Priority chain:
 *   1  Administrative / structural terms     → excluido
 *   2  Route-only abbreviations              → excluido
 *   3  Lab analytes with numeric result      → excluido
 *   4  HB — WSD: cardiac vs haematology      → elegible (Hallazgo) | excluido
 *   5  Vital signs with numeric result       → elegible (Hallazgo)
 *   6  EG — WSD: edad gestacional vs Gaucher → elegible | excluido
 *   7  PR — WSD: per rectum / ECG / urología → elegible | excluido
 *   8  SV — WSD: sonda vesical vs signos vit → elegible (Hallazgo | Procedimiento)
 *   9  Unambiguous clinical findings         → elegible (Hallazgo)
 *  10  Medications                           → elegible (Fármaco)
 *  11  Devices / lines                       → elegible (Hallazgo)
 *  12  Procedures                            → elegible (Procedimiento)
 *  13  NER category normalisation            → elegible (normalised)
 *  14  Generic fallback                      → elegible (candidate for review)
 */
export function reviewPremarkedSpan(span: PremarkedSpan, textNorm: string): PremarkedSpan {
  const literal = literalKey(span);
  const context = nearbyText(span, textNorm);
  const measuredValue = followsMeasuredValue(span, textNorm);

  // ── 1. Administrative / structural terms ──────────────────────────────────
  if (ADMINISTRATIVE_TERMS.has(literal)) {
    return {
      ...span,
      review: {
        disposition: 'excluido',
        reason: 'Término estructural o administrativo sin concepto SNOMED CT propio.',
      },
    };
  }

  // ── 2. Route-only abbreviations ───────────────────────────────────────────
  if (ROUTES.has(literal)) {
    return {
      ...span,
      review: { disposition: 'excluido', reason: 'Vía aislada; requiere sustancia o acto explícito.' },
    };
  }

  // ── 3. Lab analytes with numeric result ───────────────────────────────────
  if (LABORATORY_ANALYTES.has(literal) && measuredValue) {
    return {
      ...span,
      review: {
        disposition: 'excluido',
        reason: 'Analito de laboratorio con valor numérico; no es una mención anotable independiente.',
      },
    };
  }

  // ── 4. HB — WSD: hemoglobina (lab) vs bloqueo de rama (cardiology) ────────
  if (literal === 'hb') {
    if (/\b(ecg|electrocardiograma|rama|bloqueo|conducción|bradicardia|taquicardia)\b/i.test(context)) {
      return {
        ...suggestCategory(span, 'Hallazgo clínico', 'Bloqueo de rama'),
        review: { disposition: 'elegible', reason: 'HB en contexto cardiológico: bloqueo de rama.' },
      };
    }
    if (measuredValue) {
      return {
        ...span,
        review: {
          disposition: 'excluido',
          reason: 'HB hemoglobina con valor numérico aislado.',
        },
      };
    }
    // HB without a value and without cardiac context → keep as candidate
  }

  // ── 5. Vital signs with measured value ────────────────────────────────────
  if (VITAL_SIGNS.has(literal) && measuredValue) {
    return {
      ...suggestCategory(span, 'Hallazgo clínico'),
      review: { disposition: 'elegible', reason: 'Signo vital con valor medido.' },
    };
  }

  // ── 6. EG — WSD: edad gestacional vs enfermedad de Gaucher ───────────────
  // The dictionary default ("enfermedad de Gaucher") almost never applies in
  // clinical notes; the obstetric sense covers the vast majority of occurrences.
  // Positive context: obstetric terms, gestational week notation, or obstetric
  // monitoring checklist items (PGE = prostaglandina E).
  if (literal === 'eg') {
    const obstetricsRe =
      /\b(sem(?:ana)?s?|embarazo|gestacional|g\d\s*p\d|obstetr|cesar[eé]|parto|fetal|[uú]tero|prenatal|perinatal|gestante|matern[ao]|neonatal|pge\b|anteparto|expulsivo|rec[áa]lculo)\b/i;
    if (obstetricsRe.test(context)) {
      return {
        ...suggestCategory(span, 'Hallazgo clínico', 'Edad gestacional'),
        review: { disposition: 'elegible', reason: 'EG con contexto obstétrico.' },
      };
    }
    return {
      ...span,
      review: {
        disposition: 'excluido',
        reason: 'EG sin contexto obstétrico suficiente; evita expansión default ambigua (enfermedad de Gaucher).',
      },
    };
  }

  // ── 7. PR — WSD: per rectum / intervalo PR (ECG) / prostatectomía radical ──
  if (literal === 'pr') {
    if (/\b(ecg|electrocardiograma|intervalo)\b/i.test(context)) {
      return {
        ...span,
        review: { disposition: 'excluido', reason: 'PR en contexto ECG (intervalo PR); evita expansión "per rectum".' },
      };
    }
    if (/\b(pr[oó]stata|prostatect|psa|urolog|prost[áa]t|resección)\b/i.test(context)) {
      return {
        ...suggestCategory(span, 'Procedimiento', 'Prostatectomía radical'),
        review: { disposition: 'elegible', reason: 'PR en contexto urológico: prostatectomía radical.' },
      };
    }
    // "per rectum" examination — eligible as procedure
    return {
      ...suggestCategory(span, 'Procedimiento'),
      review: { disposition: 'elegible', reason: 'PR: examen per rectum.' },
    };
  }

  // ── 8. SV — WSD: sonda vesical (device) vs signos vitales (procedure) ─────
  if (literal === 'sv') {
    if (/\b(permeable|clampe[ao]|d[eé]bito|drenaje|vesical|urinario|foley|in situ)\b/i.test(context)) {
      return {
        ...suggestCategory(span, 'Hallazgo clínico', 'Sonda vesical'),
        review: { disposition: 'elegible', reason: 'SV en contexto de sonda vesical (estado del dispositivo).' },
      };
    }
    if (/\b(control(?:ar)?|csv|monitoreo|monitore[ao])\b/i.test(context)) {
      return {
        ...suggestCategory(span, 'Procedimiento', 'Control de signos vitales'),
        review: { disposition: 'elegible', reason: 'SV en contexto de monitoreo de signos vitales.' },
      };
    }
    return {
      ...span,
      review: {
        disposition: 'elegible',
        reason: 'SV ambiguo: puede ser sonda vesical (Hallazgo) o signos vitales (Procedimiento). Revisar contexto.',
      },
    };
  }

  // ── 9. Unambiguous clinical findings ─────────────────────────────────────
  if (CLINICAL_FINDINGS.has(literal)) {
    return {
      ...suggestCategory(span, 'Hallazgo clínico'),
      review: { disposition: 'elegible', reason: 'Hallazgo clínico con significado no ambiguo.' },
    };
  }

  // ── 10. Medications ───────────────────────────────────────────────────────
  if (MEDICATIONS.has(literal)) {
    return {
      ...suggestCategory(span, 'Fármaco'),
      review: { disposition: 'elegible', reason: 'Sustancia o preparado administrable.' },
    };
  }

  // ── 11. Devices / lines ───────────────────────────────────────────────────
  // Default: device in situ (Hallazgo). When an action verb is in context the
  // act should be annotated as a *separate* span (origin='human'); the device
  // itself remains a Hallazgo reflecting its in-situ state.
  if (DEVICES.has(literal)) {
    return {
      ...suggestCategory(span, 'Hallazgo clínico'),
      review: { disposition: 'elegible', reason: 'Dispositivo o acceso en estado/in situ.' },
    };
  }

  // ── 12. Procedures ────────────────────────────────────────────────────────
  if (PROCEDURES.has(literal)) {
    return {
      ...suggestCategory(span, 'Procedimiento'),
      review: { disposition: 'elegible', reason: 'Estudio, prueba o procedimiento clínico.' },
    };
  }

  // ── 13. NER category normalisation ───────────────────────────────────────
  if (span.origin === 'ner') {
    const rawCat = span.suggest?.category ?? '';
    const category: Category =
      rawCat === 'Medicamento' || rawCat === 'Fármaco'
        ? 'Fármaco'
        : rawCat === 'Procedimiento'
          ? 'Procedimiento'
          : 'Hallazgo clínico';
    return {
      ...suggestCategory(span, category),
      review: { disposition: 'elegible', reason: 'Categoría normalizada desde NER.' },
    };
  }

  // ── 14. Generic fallback ──────────────────────────────────────────────────
  return {
    ...span,
    review: { disposition: 'elegible', reason: 'Candidato conservado para revisión humana.' },
  };
}

/** Input document uploaded by the annotator (or loaded from the example). */
export interface AnnotationDocument {
  schemaVersion?: string;
  textProfile?: TextProfile;
  terminology?: TerminologySnapshot;
  producer?: ProducerMetadata;
  project?: string;
  batch?: string;
  annotatorId?: string;
  sourceFile?: string;
  cases: ClinicalCase[];
  /** Session metadata preserved across upload/download cycles. */
  _meta?: AnnotationMeta;
  _premarking?: Record<string, unknown>;
  _trace?: Record<string, unknown>;
  _annotationProtocol?: AnnotationProtocol;
  _lexicalInventory?: LexicalInventory;
}

export interface AnnotationProtocol {
  mode: 'assisted-span-review' | 'core-blind';
  instructionsVersion: string;
  candidateMetadataVisible: boolean;
  candidateMetadataStripped: boolean;
  suggestedSctidVisible: boolean;
  suggestedCategoryApplied: boolean;
  exhaustiveReviewRequired: boolean;
  coreBlindIncluded: boolean;
  preannotationsPresent: boolean;
  lexicalLayerEnabled?: boolean;
  lexicalLayerVersion?: string;
  lexicalInventoryVersion?: string;
  lexicalInventoryStatus?: string;
  lexicalCandidatePolicy?: string;
  lexicalCandidateMetadataVisible?: boolean;
  lexicalPreferredSenseVisible?: boolean;
  lexicalSenseRankingVisible?: boolean;
  lexicalSenseCodebookAvailable?: boolean;
  lexicalExhaustiveReviewRequired?: boolean;
  manualLexicalMentionCreationEnabled?: boolean;
  lexicalAbstentionEnabled?: boolean;
  accessPolicy?: string;
}

export type LexicalOrigin =
  | 'sense_inventory'
  | 'legacy_dictionary'
  | 'orthographic_heuristic'
  | 'human';

export type LexicalDecisionStatus =
  | 'pending'
  | 'resolved'
  | 'ambiguous'
  | 'unknown'
  | 'new_sense_proposed'
  | 'form_error'
  | 'nonclinical'
  | 'rejected';

export type LexicalFormType =
  | 'abbreviation'
  | 'acronym'
  | 'initialism'
  | 'alphanumeric'
  | 'symbolic_abbreviation'
  | 'other';

export type LexicalFunction =
  | 'header'
  | 'entity'
  | 'value'
  | 'result'
  | 'modifier'
  | 'structural'
  | 'other';

export interface LexicalAnnotation {
  decisionStatus: LexicalDecisionStatus;
  formType: LexicalFormType;
  correctedForm: string | null;
  senseId: string | null;
  proposedExpansion: string | null;
  function: LexicalFunction | null;
  section: string | null;
  evidenceCodes: string[];
  comment: string | null;
  annotatorId: string | null;
  annotatedAt: string | null;
}

export interface LexicalMention {
  mentionId: string;
  start: number;
  end: number;
  surface: string;
  normalizedKey: string;
  origin: LexicalOrigin;
  candidateSenseIds: string[];
  annotation: LexicalAnnotation;
}

export interface LexicalReview {
  status: 'pending' | 'completed';
  exhaustiveReviewRequired: true;
  annotatorId: string | null;
  completedAt: string | null;
  inventoryVersion: string | null;
}

export interface LexicalSenseOption {
  senseId: string;
  expansion: string;
  semanticType?: string | null;
  resolutionPolicy?: string | null;
}

export interface LexicalInventoryEntry {
  key: string;
  caseSensitiveForms: string[];
  senses: LexicalSenseOption[];
}

export interface LexicalInventory {
  schemaVersion: string;
  layerVersion: string;
  inventoryVersion: string;
  locale: string;
  status: string;
  rankingPresent: boolean;
  probabilitiesPresent: boolean;
  annotatorMayProposeNewSense: boolean;
  annotatorMayAbstain: boolean;
  abbreviations: LexicalInventoryEntry[];
}

export interface LexicalNormalizationResult {
  mentions: LexicalMention[];
  invalidCount: number;
}

export interface LexicalChoice<T> {
  value: T;
  label: string;
  description: string;
  example?: string;
}

export const LEXICAL_DECISIONS: LexicalChoice<LexicalDecisionStatus>[] = [
  {
    value: 'pending',
    label: 'Pendiente',
    description: 'Todavía no decidiste. Es el estado inicial y bloquea el cierre.',
    example: 'No lo uses para registrar una duda final.',
  },
  {
    value: 'resolved',
    label: 'Sentido resuelto',
    description: 'La nota permite elegir un significado concreto de la lista.',
  },
  {
    value: 'ambiguous',
    label: 'Ambigua aun con contexto',
    description: 'Quedan dos o más significados posibles después de leer el contexto.',
    example: 'Es una abstención final válida.',
  },
  {
    value: 'unknown',
    label: 'No puedo determinarla',
    description: 'El contexto no alcanza para saber qué significa.',
    example: 'Es una abstención final válida; no hace falta adivinar.',
  },
  {
    value: 'new_sense_proposed',
    label: 'Proponer sentido nuevo',
    description: 'El significado se entiende, pero no aparece entre las opciones.',
  },
  {
    value: 'form_error',
    label: 'Forma errónea o corrupta',
    description: 'La escritura parece tener un error y podés indicar la forma corregida.',
  },
  {
    value: 'nonclinical',
    label: 'Uso no clínico/estructural',
    description: 'La forma organiza la nota o cumple un uso administrativo, no clínico.',
  },
  {
    value: 'rejected',
    label: 'No es abreviatura ni acrónimo',
    description: 'El candidato fue marcado por error y debe excluirse de la capa léxica.',
  },
];

export const LEXICAL_FORM_TYPES: LexicalChoice<LexicalFormType>[] = [
  {
    value: 'abbreviation',
    label: 'Abreviatura',
    description: 'Una palabra escrita de forma acortada.',
    example: 'Ejemplo de escritura: “temp.”.',
  },
  {
    value: 'acronym',
    label: 'Acrónimo pronunciable',
    description: 'Varias letras que se leen juntas como una palabra.',
    example: 'Contraste: no se deletrea letra por letra.',
  },
  {
    value: 'initialism',
    label: 'Sigla / inicialismo',
    description: 'Varias iniciales que normalmente se leen letra por letra.',
    example: 'Las mayúsculas solas no prueban que sea una sigla.',
  },
  {
    value: 'alphanumeric',
    label: 'Forma alfanumérica',
    description: 'Combina letras y números en una misma forma.',
    example: 'Ejemplo de escritura: “B12”.',
  },
  {
    value: 'symbolic_abbreviation',
    label: 'Abreviatura simbólica',
    description: 'Usa signos o símbolos como parte esencial de la forma.',
    example: 'Ejemplo de escritura: “SatO₂%”.',
  },
  {
    value: 'other',
    label: 'Otra forma léxica',
    description: 'Es una forma abreviada, pero no encaja en las opciones anteriores.',
  },
];

export const LEXICAL_UNCLASSIFIED_FUNCTION: LexicalChoice<null> = {
  value: null,
  label: 'Sin clasificar',
  description: 'Todavía no asignaste un papel. No equivale a “Otra función”.',
};

export const LEXICAL_FUNCTIONS: LexicalChoice<LexicalFunction>[] = [
  {
    value: 'header',
    label: 'Encabezado',
    description: 'Presenta una parte de la nota, como antecedentes o examen.',
  },
  {
    value: 'entity',
    label: 'Entidad clínica',
    description: 'Nombra algo clínico en el texto.',
    example: 'Esta elección no crea por sí sola una entidad SNOMED CT.',
  },
  {
    value: 'value',
    label: 'Valor',
    description: 'Expresa una cantidad, nivel o valor observado.',
  },
  {
    value: 'result',
    label: 'Resultado',
    description: 'Resume la conclusión de un estudio, examen o evaluación.',
  },
  {
    value: 'modifier',
    label: 'Modificador',
    description: 'Cambia o precisa el significado de otra expresión cercana.',
  },
  {
    value: 'structural',
    label: 'Marca estructural',
    description: 'Ordena o separa partes de la nota sin nombrar un dato clínico.',
  },
  {
    value: 'other',
    label: 'Otra función',
    description: 'El papel está identificado, pero no encaja en las opciones anteriores.',
  },
];

/** Local note sections offered to annotators; stored as readable values in JSON. */
export const LEXICAL_SECTIONS: LexicalChoice<string>[] = [
  { value: 'motivo de consulta', label: 'Motivo de consulta', description: 'Consulta, síntoma o razón principal.' },
  { value: 'antecedentes', label: 'Antecedentes', description: 'Personales, familiares u otros antecedentes.' },
  { value: 'medicación o tratamiento', label: 'Medicación o tratamiento', description: 'Fármacos, dosis, vía o tratamiento indicado.' },
  { value: 'examen físico', label: 'Examen físico', description: 'Hallazgos del examen o evaluación clínica.' },
  { value: 'signos vitales', label: 'Signos vitales', description: 'Constantes, mediciones o controles.' },
  { value: 'estudios o resultados', label: 'Estudios o resultados', description: 'Laboratorio, imágenes u otros estudios.' },
  { value: 'evolución', label: 'Evolución', description: 'Cambios, seguimiento o curso clínico.' },
  { value: 'conducta o plan', label: 'Conducta o plan', description: 'Indicaciones, procedimientos o plan terapéutico.' },
  { value: 'alta', label: 'Alta', description: 'Egreso, indicaciones o condición de alta.' },
  { value: 'encabezado', label: 'Encabezado', description: 'Etiqueta que organiza la nota.' },
  { value: 'otra parte de la nota', label: 'Otra parte de la nota', description: 'Ubicación no incluida en las opciones anteriores.' },
];

/** Standardized contextual clues. Multiple clues may be chosen for one appearance. */
export const LEXICAL_EVIDENCE_CODES: LexicalChoice<string>[] = [
  { value: 'encabezado cercano', label: 'Encabezado cercano', description: 'Un título o rótulo local orienta el sentido.' },
  { value: 'posición en la plantilla', label: 'Posición en la plantilla', description: 'La ubicación fija dentro del formulario aporta contexto.' },
  { value: 'palabras cercanas', label: 'Palabras cercanas', description: 'Las expresiones vecinas apoyan la interpretación.' },
  { value: 'valor o medición cercana', label: 'Valor o medición cercana', description: 'Número, unidad o formato de medición asociado.' },
  { value: 'medicación, dosis o vía', label: 'Medicación, dosis o vía', description: 'Contexto farmacológico, de dosis o vía de administración.' },
  { value: 'procedimiento cercano', label: 'Procedimiento cercano', description: 'La forma aparece junto a una práctica o estudio.' },
  { value: 'anatomía cercana', label: 'Anatomía cercana', description: 'Una región anatómica restringe el sentido.' },
  { value: 'negación', label: 'Negación', description: 'La expresión está afectada por una negación.' },
  { value: 'marca temporal', label: 'Marca temporal', description: 'Fecha, duración o secuencia temporal relevante.' },
  { value: 'antecedente personal', label: 'Antecedente personal', description: 'La información corresponde a antecedentes del paciente.' },
  { value: 'antecedente familiar', label: 'Antecedente familiar', description: 'La información se atribuye a familiares.' },
  { value: 'contexto obstétrico', label: 'Contexto obstétrico', description: 'Gestación, paridad o puerperio orientan el sentido.' },
];

const LEXICAL_DECISION_VALUES = new Set(LEXICAL_DECISIONS.map((item) => item.value));
const LEXICAL_FORM_VALUES = new Set(LEXICAL_FORM_TYPES.map((item) => item.value));
const LEXICAL_FUNCTION_VALUES = new Set(LEXICAL_FUNCTIONS.map((item) => item.value));
const LEXICAL_ORIGINS = new Set<LexicalOrigin>([
  'sense_inventory',
  'legacy_dictionary',
  'orthographic_heuristic',
  'human',
]);

function inferredLexicalForm(surface: string): LexicalFormType {
  if (/\d/u.test(surface)) return 'alphanumeric';
  if (/^[A-ZÁÉÍÓÚÜÑ]{2,}$/u.test(surface)) return 'initialism';
  return 'abbreviation';
}

export const NONCODED_SEMANTICS_COMMENT = 'POSIBLE_SEMANTICA_NO_CODIFICADA';

function nullableTrimmedString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export function normalizeEvidenceCodes(value: unknown): string[] {
  const values = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];
  return [
    ...new Set(
      values
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    ),
  ];
}

function commentWithNoncodedSemantics(value: unknown, markerPresent: boolean): string | null {
  const comment = nullableTrimmedString(value);
  if (!markerPresent || comment?.includes(NONCODED_SEMANTICS_COMMENT)) return comment;
  return comment ? `${comment}\n${NONCODED_SEMANTICS_COMMENT}` : NONCODED_SEMANTICS_COMMENT;
}

export function newLexicalAnnotation(
  surface = '',
  formType?: LexicalFormType
): LexicalAnnotation {
  return {
    decisionStatus: 'pending',
    formType: formType ?? inferredLexicalForm(surface),
    correctedForm: null,
    senseId: null,
    proposedExpansion: null,
    function: null,
    section: null,
    evidenceCodes: [],
    comment: null,
    annotatorId: null,
    annotatedAt: null,
  };
}

/**
 * Canonical representation used at every JSON boundary. Besides preserving v2
 * codes, it removes state that is incompatible with the contextual decision.
 */
export function normalizeLexicalAnnotation(
  rawAnnotation: unknown,
  surface = ''
): LexicalAnnotation {
  const raw =
    rawAnnotation && typeof rawAnnotation === 'object'
      ? (rawAnnotation as Partial<LexicalAnnotation>)
      : {};
  const defaults = newLexicalAnnotation(surface);
  const requestedDecisionStatus = LEXICAL_DECISION_VALUES.has(raw.decisionStatus as LexicalDecisionStatus)
    ? (raw.decisionStatus as LexicalDecisionStatus)
    : defaults.decisionStatus;
  // "Resolved" is only valid when the chosen inventory sense is retained.
  // Downgrading an incomplete legacy value to pending preserves the fact that
  // it still needs a clinician decision without inventing an abstention.
  const decisionStatus =
    requestedDecisionStatus === 'resolved' && !nullableTrimmedString(raw.senseId)
      ? 'pending'
      : requestedDecisionStatus;
  const formType = LEXICAL_FORM_VALUES.has(raw.formType as LexicalFormType)
    ? (raw.formType as LexicalFormType)
    : defaults.formType;
  const lexicalFunction = LEXICAL_FUNCTION_VALUES.has(raw.function as LexicalFunction)
    ? (raw.function as LexicalFunction)
    : null;
  const rawEvidenceCodes = normalizeEvidenceCodes(raw.evidenceCodes);
  const noncodedMarkerPresent = rawEvidenceCodes.includes(NONCODED_SEMANTICS_COMMENT);

  return {
    decisionStatus,
    formType,
    correctedForm:
      decisionStatus === 'form_error' ? nullableTrimmedString(raw.correctedForm) : null,
    senseId: decisionStatus === 'resolved' ? nullableTrimmedString(raw.senseId) : null,
    proposedExpansion:
      decisionStatus === 'new_sense_proposed'
        ? nullableTrimmedString(raw.proposedExpansion)
        : null,
    function: lexicalFunction,
    section: nullableTrimmedString(raw.section),
    evidenceCodes: rawEvidenceCodes.filter((code) => code !== NONCODED_SEMANTICS_COMMENT),
    comment: commentWithNoncodedSemantics(raw.comment, noncodedMarkerPresent),
    annotatorId: nullableTrimmedString(raw.annotatorId),
    annotatedAt: nullableTrimmedString(raw.annotatedAt),
  };
}

export function newLexicalReview(inventoryVersion: string | null = null): LexicalReview {
  return {
    status: 'pending',
    exhaustiveReviewRequired: true,
    annotatorId: null,
    completedAt: null,
    inventoryVersion,
  };
}

export function newHumanLexicalMention(
  mentionId: string,
  start: number,
  end: number,
  surface: string
): LexicalMention {
  return {
    mentionId,
    start,
    end,
    surface,
    normalizedKey: surface.trim().toLocaleUpperCase('es-AR'),
    origin: 'human',
    candidateSenseIds: [],
    annotation: newLexicalAnnotation(surface),
  };
}

export function normalizeLexicalMentions(
  rawMentions: unknown,
  textNorm: string
): LexicalNormalizationResult {
  if (!Array.isArray(rawMentions)) return { mentions: [], invalidCount: 0 };
  const mentions: LexicalMention[] = [];
  const ids = new Set<string>();
  let invalidCount = 0;

  for (const raw of rawMentions) {
    if (!raw || typeof raw !== 'object') {
      invalidCount += 1;
      continue;
    }
    const item = raw as Partial<LexicalMention>;
    const valid =
      typeof item.mentionId === 'string' &&
      item.mentionId.trim().length > 0 &&
      Number.isInteger(item.start) &&
      Number.isInteger(item.end) &&
      typeof item.surface === 'string' &&
      (item.start ?? -1) >= 0 &&
      (item.end ?? 0) > (item.start ?? -1) &&
      (item.end ?? textNorm.length + 1) <= textNorm.length &&
      textNorm.slice(item.start, item.end) === item.surface &&
      !ids.has(item.mentionId);
    if (!valid) {
      invalidCount += 1;
      continue;
    }
    const mentionId = item.mentionId as string;
    const surface = item.surface as string;

    const origin = LEXICAL_ORIGINS.has(item.origin as LexicalOrigin)
      ? (item.origin as LexicalOrigin)
      : 'human';

    mentions.push({
      mentionId,
      start: item.start as number,
      end: item.end as number,
      surface,
      normalizedKey:
        typeof item.normalizedKey === 'string' && item.normalizedKey.trim()
          ? item.normalizedKey.trim()
          : surface.trim().toLocaleUpperCase('es-AR'),
      origin,
      candidateSenseIds: Array.isArray(item.candidateSenseIds)
        ? [
            ...new Set(
              item.candidateSenseIds
                .filter((value): value is string => typeof value === 'string')
                .map((value) => value.trim())
                .filter(Boolean)
            ),
          ]
        : [],
      annotation: normalizeLexicalAnnotation(item.annotation, surface),
    });
    ids.add(mentionId);
  }

  mentions.sort((left, right) => left.start - right.start || left.end - right.end);
  return { mentions, invalidCount };
}

export function lexicalMentionComplete(mention: LexicalMention): boolean {
  const annotation = mention.annotation;
  switch (annotation.decisionStatus) {
    case 'resolved':
      return !!annotation.senseId?.trim();
    case 'new_sense_proposed':
      return !!annotation.proposedExpansion?.trim();
    case 'form_error':
      return !!annotation.correctedForm?.trim();
    case 'ambiguous':
    case 'unknown':
    case 'nonclinical':
    case 'rejected':
      return true;
    default:
      return false;
  }
}

export function normalizeLexicalReview(
  rawReview: unknown,
  mentions: readonly LexicalMention[],
  inventoryVersion: string | null = null
): LexicalReview {
  const raw =
    rawReview && typeof rawReview === 'object' ? (rawReview as Partial<LexicalReview>) : {};
  const completedAt = nullableTrimmedString(raw.completedAt);
  const completed =
    raw.status === 'completed' &&
    !!completedAt &&
    mentions.every((mention) => lexicalMentionComplete(mention));
  return {
    status: completed ? 'completed' : 'pending',
    exhaustiveReviewRequired: true,
    annotatorId: completed ? nullableTrimmedString(raw.annotatorId) : null,
    completedAt: completed ? completedAt : null,
    inventoryVersion:
      nullableTrimmedString(raw.inventoryVersion) ?? nullableTrimmedString(inventoryVersion),
  };
}

/** SNOMED CT hierarchy categories currently enabled for annotation. */
export type Category =
  | 'Hallazgo clínico'
  | 'Procedimiento'
  | 'Fármaco';

export function annotationCategory(value: unknown): Category | '' {
  return value === 'Hallazgo clínico' || value === 'Procedimiento' || value === 'Fármaco'
    ? value
    : '';
}

export type Polarity = 'Activo' | 'Negado';
export type Certainty = 'Confirmado' | 'Sospecha' | 'Diferencial';
export type Temporality = 'Actual' | 'Histórico';
export type Subject = 'Paciente' | 'Familiar';

/** One annotated concept block. A case may contain any number of concepts. */
export interface ConceptAnnotation {
  /**
   * Stable per-case ordinal assigned when the concept block is created.
   * It is deliberately not recalculated after deletion, so C3 stays C3.
   */
  sequence?: number;
  cat: Category | '';
  sctid: string;
  term: string;
  textoLiteral: string;
  pol: Polarity;
  cert: Certainty;
  temp: Temporality;
  suj: Subject;
  /** Fixed source span when the concept was produced from premarking. */
  spanId?: string;
  provenance?: {
    createdPlatform: AnnotationPlatform;
    lastEditedPlatform: AnnotationPlatform;
    terminologySelectedPlatform?: AnnotationPlatform;
  };
}

export type CaseReviewOutcome = 'coded' | 'no-eligible-concepts';

export interface CaseReview {
  status: 'pending' | 'finalized';
  outcome?: CaseReviewOutcome;
  finalizedAt?: string;
}

/** A case together with the concepts the annotator produced for it. */
export interface CaseAnnotation extends ClinicalCase {
  textNorm: string;
  spans: PremarkedSpan[];
  concepts: ConceptAnnotation[];
  comentarios: string;
  review?: CaseReview;
  lexicalMentions?: LexicalMention[];
  lexicalReview?: LexicalReview;
}

/** A single upload or download event for audit trail purposes. */
export interface SessionEntry {
  /** 'upload' when the file was loaded into the tool; 'download' when saved. */
  action: 'upload' | 'download';
  timestamp: string;
  annotatedCount: number;
  totalCases: number;
  reviewedCount?: number;
  appBuild?: string;
  platform?: AnnotationPlatform;
  sourceFile?: string;
  schemaVersion?: string;
  terminologyVersion?: string | null;
}

export interface SearchQueryTelemetry {
  query: string;
  category: Category | '';
  /** Missing only in legacy telemetry produced before platform tracking. */
  platform?: AnnotationPlatform;
  requests: number;
  zeroResults: number;
  errors: number;
  selections: number;
}

export interface SearchTelemetry {
  episodes: number;
  reformulations: number;
  requests: number;
  completedRequests: number;
  zeroResults: number;
  errors: number;
  cancelled: number;
  selections: number;
  totalLatencyMs: number;
  selectedRanks: number[];
  queries: SearchQueryTelemetry[];
}

export type TelemetryClickTarget =
  | 'span-accept'
  | 'span-discard'
  | 'concept-add'
  | 'concept-remove'
  | 'concept-edit'
  | 'category-select'
  | 'context-toggle'
  | 'search-interaction'
  | 'lexical-review'
  | 'general-ui';

export type TelemetryDeletionType =
  | 'concept'
  | 'span'
  | 'lexical-mention'
  | 'comment';

export interface CaseTelemetryBase {
  id: string;
  activeMs: number;
  visits: number;
  firstOpenedAt?: string;
  lastOpenedAt?: string;
  firstEditedAt?: string;
  lastEditedAt?: string;
  reopenedCount: number;
  finalizedAt?: string;
  finalizationOutcome?: CaseReviewOutcome;
  spansAccepted: number;
  spansDiscarded: number;
  manualSpansAdded: number;
  spanBoundaryAdjustments: number;
  conceptsAdded: number;
  conceptsRemoved: number;
  conceptsReplaced: number;
  categoryChanges: number;
  clicksTotal: number;
  clicksByTarget: Record<TelemetryClickTarget, number>;
  deletionsTotal: number;
  deletionsByType: Record<TelemetryDeletionType, number>;
  search: SearchTelemetry;
}

export interface CaseTelemetry extends CaseTelemetryBase {
  /** Same operational counters split by execution surface for friction analysis. */
  byPlatform: Record<AnnotationPlatform, CaseTelemetryBase>;
}

export interface AnnotationTelemetry {
  schemaVersion: '1.1';
  collectionMode: 'local-export-only';
  appBuild: string;
  idleThresholdMs: number;
  totalActiveMs: number;
  cases: CaseTelemetry[];
}

export const TELEMETRY_APP_BUILD = 'SEMANTIAR-ANNOTATOR-2026.07';
export const TELEMETRY_IDLE_THRESHOLD_MS = 120_000;

function emptyCaseTelemetryBase(id: string): CaseTelemetryBase {
  return {
    id,
    activeMs: 0,
    visits: 0,
    reopenedCount: 0,
    spansAccepted: 0,
    spansDiscarded: 0,
    manualSpansAdded: 0,
    spanBoundaryAdjustments: 0,
    conceptsAdded: 0,
    conceptsRemoved: 0,
    conceptsReplaced: 0,
    categoryChanges: 0,
    clicksTotal: 0,
    clicksByTarget: {
      'span-accept': 0,
      'span-discard': 0,
      'concept-add': 0,
      'concept-remove': 0,
      'concept-edit': 0,
      'category-select': 0,
      'context-toggle': 0,
      'search-interaction': 0,
      'lexical-review': 0,
      'general-ui': 0,
    },
    deletionsTotal: 0,
    deletionsByType: {
      concept: 0,
      span: 0,
      'lexical-mention': 0,
      comment: 0,
    },
    search: {
      episodes: 0,
      reformulations: 0,
      requests: 0,
      completedRequests: 0,
      zeroResults: 0,
      errors: 0,
      cancelled: 0,
      selections: 0,
      totalLatencyMs: 0,
      selectedRanks: [],
      queries: [],
    },
  };
}

function cloneCaseTelemetryBase(item: CaseTelemetryBase): CaseTelemetryBase {
  return {
    ...item,
    clicksByTarget: { ...item.clicksByTarget },
    deletionsByType: { ...item.deletionsByType },
    search: {
      ...item.search,
      selectedRanks: [...item.search.selectedRanks],
      queries: item.search.queries.map((query) => ({ ...query })),
    },
  };
}

function emptyCaseTelemetry(id: string): CaseTelemetry {
  return {
    ...emptyCaseTelemetryBase(id),
    byPlatform: {
      web: emptyCaseTelemetryBase(id),
      android: emptyCaseTelemetryBase(id),
    },
  };
}

export function createAnnotationTelemetry(
  caseIds: readonly string[],
  existing?: AnnotationTelemetry
): AnnotationTelemetry {
  const prior = new Map((existing?.cases ?? []).map((item) => [item.id, item]));
  const cases = caseIds.map((id) => {
    const previous = prior.get(id);
    if (!previous) return emptyCaseTelemetry(id);
    const empty = emptyCaseTelemetry(id);
    return {
      ...empty,
      ...previous,
      id,
      clicksTotal: previous.clicksTotal ?? 0,
      clicksByTarget: {
        ...empty.clicksByTarget,
        ...(previous.clicksByTarget ?? {}),
      },
      deletionsTotal: previous.deletionsTotal ?? 0,
      deletionsByType: {
        ...empty.deletionsByType,
        ...(previous.deletionsByType ?? {}),
      },
      search: {
        ...empty.search,
        ...previous.search,
        selectedRanks: [...(previous.search?.selectedRanks ?? [])],
        queries: (previous.search?.queries ?? []).map((query) => ({ ...query })),
      },
      byPlatform: {
        web: cloneCaseTelemetryBase(
          previous.byPlatform?.web ?? emptyCaseTelemetryBase(id)
        ),
        android: cloneCaseTelemetryBase(
          previous.byPlatform?.android ?? emptyCaseTelemetryBase(id)
        ),
      },
    };
  });
  return {
    schemaVersion: '1.1',
    collectionMode: 'local-export-only',
    appBuild: existing?.appBuild ?? TELEMETRY_APP_BUILD,
    idleThresholdMs: existing?.idleThresholdMs ?? TELEMETRY_IDLE_THRESHOLD_MS,
    totalActiveMs: cases.reduce((total, item) => total + item.activeMs, 0),
    cases,
  };
}

/**
 * Session-level metadata embedded in the JSON output.
 * Persists and accumulates across multiple upload/download cycles,
 * enabling calculation of annotation effort in post-hoc analysis.
 */
export interface AnnotationMeta {
  /** Ordered log of every upload and download action performed on this file. */
  sessions: SessionEntry[];
  /** Total number of completed download cycles (upload+work+download). */
  totalDownloads: number;
  /** ISO timestamp of the very first upload of this file. */
  firstLoadedAt: string;
  /**
   * ISO timestamp of the download that resulted in all cases being annotated.
   * Null until the file is fully complete and downloaded.
   */
  completedAt?: string;
  telemetry?: AnnotationTelemetry;
}

/** Full output document produced on download. */
export interface AnnotationOutput {
  schemaVersion: typeof SEMANTIAR_SCHEMA_VERSION;
  textProfile: TextProfile;
  terminology: TerminologySnapshot;
  producer: ProducerMetadata;
  project?: string;
  batch?: string;
  annotatorId?: string;
  sourceFile?: string;
  exportedAt: string;
  terminologyServer: string;
  editionUri: string;
  cases: CaseAnnotation[];
  /** Session metadata for audit and effort analysis. */
  _meta: AnnotationMeta;
  _premarking?: Record<string, unknown>;
  _trace?: Record<string, unknown>;
  _annotationProtocol: AnnotationProtocol;
  _lexicalInventory?: LexicalInventory;
}

export const ASSISTED_ANNOTATION_PROTOCOL: AnnotationProtocol = {
  mode: 'assisted-span-review',
  instructionsVersion: 'SEMANTIAR-ASISTIDA-1.0',
  candidateMetadataVisible: false,
  candidateMetadataStripped: true,
  suggestedSctidVisible: false,
  suggestedCategoryApplied: false,
  exhaustiveReviewRequired: true,
  coreBlindIncluded: false,
  preannotationsPresent: true,
};

export const CORE_BLIND_PROTOCOL: AnnotationProtocol = {
  mode: 'core-blind',
  instructionsVersion: 'SEMANTIAR-CORE-BLIND-1.0',
  candidateMetadataVisible: false,
  candidateMetadataStripped: true,
  suggestedSctidVisible: false,
  suggestedCategoryApplied: false,
  exhaustiveReviewRequired: true,
  coreBlindIncluded: true,
  preannotationsPresent: false,
};

/** Categories currently enabled, with their SNOMED hierarchy ECL constraint. */
export const CATEGORIES: { label: Category; ecl: string; search: string }[] = [
  { label: 'Hallazgo clínico', ecl: '<<404684003', search: 'Buscar hallazgo clínico…' },
  { label: 'Procedimiento', ecl: '<<71388002', search: 'Buscar procedimiento…' },
  { label: 'Fármaco', ecl: '<<373873005', search: 'Buscar fármaco…' },
];

export const POLARITIES: Polarity[] = ['Activo', 'Negado'];
export const CERTAINTIES: Certainty[] = ['Confirmado', 'Sospecha', 'Diferencial'];
export const TEMPORALITIES: Temporality[] = ['Actual', 'Histórico'];
export const SUBJECTS: Subject[] = ['Paciente', 'Familiar'];

/**
 * Retained as a compatibility export for downstream consumers. The annotator
 * intentionally has no per-case concept cap; this sentinel documents that
 * policy without imposing a UI or export limit.
 */
export const MAX_CONCEPTS_PER_CASE = Number.POSITIVE_INFINITY;

// Terminology defaults come from the Angular environment.
export const DEFAULT_TERMINOLOGY_SERVER = environment.terminologyServer;
export const DEFAULT_EDITION_URI = environment.editionUri;
export const DEFAULT_DISPLAY_LANGUAGE = environment.displayLanguage;

/** SNOMED CT Argentina edition module. Preferred when present on the server. */
export const AR_EDITION_URI = 'http://snomed.info/sct/11000221109';
export const AR_DISPLAY_LANGUAGE = 'es';
/** International edition (English fallback). */
export const INTL_EDITION_URI = 'http://snomed.info/sct';
export const INTL_DISPLAY_LANGUAGE = 'en';

export function newConcept(sequence?: number): ConceptAnnotation {
  return {
    ...(sequence === undefined ? {} : { sequence }),
    cat: '',
    sctid: '',
    term: '',
    textoLiteral: '',
    pol: 'Activo',
    cert: 'Confirmado',
    temp: 'Actual',
    suj: 'Paciente',
  };
}

export function eclForCategory(cat: Category | ''): string {
  const found = CATEGORIES.find((c) => c.label === cat);
  return found ? found.ecl : '';
}

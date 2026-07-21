/** Data model for the SEMANTIAR annotation tool. */
import { environment } from '../../environments/environment';

/** Clinical case loaded from the input JSON (read-only content). */
export interface ClinicalCase {
  id: string;
  text: string;
  /** Offset base for premarked spans. Defaults to `text` when not provided. */
  textNorm?: string;
  spans?: PremarkedSpan[];
  concepts?: ConceptAnnotation[];
  comentarios?: string;
}

export type SpanOrigin = 'dict' | 'matcher' | 'ner' | 'rescue' | 'human';
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
}

export type TextSegment =
  | { kind: 'text'; value: string }
  | { kind: 'span'; value: string; span: PremarkedSpan };

export interface SpanNormalizationResult {
  spans: PremarkedSpan[];
  invalidCount: number;
}

/**
 * Keeps only non-overlapping spans whose offsets and literal match `textNorm`.
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
  let previousEnd = 0;
  const ids = new Set<string>();

  for (const span of candidates) {
    const validOffsets =
      Number.isInteger(span.start) &&
      Number.isInteger(span.end) &&
      span.start >= previousEnd &&
      span.start < span.end &&
      span.end <= textNorm.length &&
      textNorm.slice(span.start, span.end) === span.textoLiteral;

    if (!validOffsets || ids.has(span.spanId)) {
      invalidCount += 1;
      continue;
    }

    spans.push(reviewPremarkedSpan({ ...span, status: span.status ?? 'pendiente' }, textNorm));
    ids.add(span.spanId);
    previousEnd = span.end;
  }

  return { spans, invalidCount };
}

/** Turns verified offsets into text and interactive-span segments for safe rendering. */
export function buildTextSegments(textNorm: string, spans: readonly PremarkedSpan[]): TextSegment[] {
  const segments: TextSegment[] = [];
  let cursor = 0;

  for (const span of spans) {
    if (span.review?.disposition === 'excluido') continue;
    if (span.start > cursor) {
      segments.push({ kind: 'text', value: textNorm.slice(cursor, span.start) });
    }
    segments.push({ kind: 'span', value: span.textoLiteral, span });
    cursor = span.end;
  }

  if (cursor < textNorm.length) {
    segments.push({ kind: 'text', value: textNorm.slice(cursor) });
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
  'gb', 'gr', 'hto', 'hcto', 'plaq',
  // inflammatory
  'pcr', 'vsg',
  // metabolic
  'colesterol', 'creat', 'creatinina', 'glucemia', 'trigliceridos', 'urea', 'uremia',
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
  'ecg', 'eco', 'pap', 'rmn', 'tac',
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
  project?: string;
  batch?: string;
  annotatorId?: string;
  sourceFile?: string;
  cases: ClinicalCase[];
  /** Session metadata preserved across upload/download cycles. */
  _meta?: AnnotationMeta;
  _premarking?: Record<string, unknown>;
  _trace?: Record<string, unknown>;
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

/** One annotated concept block (maps to a C1..C10 block in the spreadsheet). */
export interface ConceptAnnotation {
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
}

/** A case together with the concepts the annotator produced for it. */
export interface CaseAnnotation extends ClinicalCase {
  textNorm: string;
  spans: PremarkedSpan[];
  concepts: ConceptAnnotation[];
  comentarios: string;
}

/** A single upload or download event for audit trail purposes. */
export interface SessionEntry {
  /** 'upload' when the file was loaded into the tool; 'download' when saved. */
  action: 'upload' | 'download';
  timestamp: string;
  annotatedCount: number;
  totalCases: number;
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
}

/** Full output document produced on download. */
export interface AnnotationOutput {
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
}

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

export const MAX_CONCEPTS_PER_CASE = 10;

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

export function newConcept(): ConceptAnnotation {
  return {
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

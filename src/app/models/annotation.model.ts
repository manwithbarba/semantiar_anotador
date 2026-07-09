/** Data model for the SEMANTIAR annotation tool. */
import { environment } from '../../environments/environment';

/** Clinical case loaded from the input JSON (read-only content). */
export interface ClinicalCase {
  id: string;
  text: string;
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
}

/** SNOMED CT hierarchy categories currently enabled for annotation. */
export type Category =
  | 'Hallazgo clínico'
  | 'Procedimiento'
  | 'Fármaco';

export type Polarity = 'Activo' | 'Negado';
export type Certainty = 'Confirmado' | 'Sospecha' | 'Diferencial';
export type Temporality = 'Actual' | 'Histórico';
export type Subject = 'Paciente' | 'Familiar';

/** One annotated concept block. */
export interface ConceptAnnotation {
  /** Stable client-side id for list tracking; stripped on export. */
  uid: string;
  cat: Category | '';
  sctid: string;
  term: string;
  textoLiteral: string;
  pol: Polarity;
  cert: Certainty;
  temp: Temporality;
  suj: Subject;
}

/** A case together with the concepts the annotator produced for it. */
export interface CaseAnnotation extends ClinicalCase {
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

/** A case as written to the output file (concepts without the client-only uid). */
export interface ExportedCase extends ClinicalCase {
  concepts: Omit<ConceptAnnotation, 'uid'>[];
  comentarios: string;
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
  cases: ExportedCase[];
  /** Session metadata for audit and effort analysis. */
  _meta: AnnotationMeta;
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

let conceptUidCounter = 0;

export function newConcept(): ConceptAnnotation {
  return {
    uid: `c${++conceptUidCounter}`,
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

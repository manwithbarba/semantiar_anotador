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
}

/** SNOMED CT hierarchy categories allowed for annotation (the 5 from the spec). */
export type Category =
  | 'Hallazgo clínico'
  | 'Procedimiento'
  | 'Sustancia/Fármaco'
  | 'Estructura corporal'
  | 'Organismo';

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
}

/** A case together with the concepts the annotator produced for it. */
export interface CaseAnnotation extends ClinicalCase {
  concepts: ConceptAnnotation[];
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
  cases: CaseAnnotation[];
}

/** The 5 allowed categories with their SNOMED hierarchy ECL constraint. */
export const CATEGORIES: { label: Category; ecl: string; search: string }[] = [
  { label: 'Hallazgo clínico', ecl: '<<404684003', search: 'Buscar hallazgo clínico…' },
  { label: 'Procedimiento', ecl: '<<71388002', search: 'Buscar procedimiento…' },
  { label: 'Sustancia/Fármaco', ecl: '<<105590001 OR <<373873005', search: 'Buscar sustancia o fármaco…' },
  { label: 'Estructura corporal', ecl: '<<123037004', search: 'Buscar estructura corporal…' },
  { label: 'Organismo', ecl: '<<410607006', search: 'Buscar organismo…' },
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

import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import annotationSchema from '../../../public/semantiar-annotation.schema.json';
import {
  AnnotationDocument,
  ClinicalCase,
  ConceptAnnotation,
  isValidTextSpan,
  LexicalMention,
  PremarkedSpan,
  SEMANTIAR_SCHEMA_VERSION,
  SEMANTIAR_TEXT_PROFILE,
  TerminologySnapshot,
} from './annotation.model';

const KNOWN_LEGACY_SCHEMA_VERSIONS = new Set([
  '2.0-core-blind',
  '2.0-spanlayer',
  '3.0-core-blind+lexical',
  '3.0-span+lexical',
]);

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validateInterchangeSchema = ajv.compile(annotationSchema);

export class AnnotationInteropError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnnotationInteropError';
  }
}

export interface PreparedAnnotationDocument {
  document: AnnotationDocument;
  warnings: string[];
}

export function canonicalizeAnnotationText(value: string): string {
  return value.replace(/\r\n?/g, '\n').normalize('NFC');
}

function canonicalOffset(text: string, offset: number): number {
  return canonicalizeAnnotationText(text.slice(0, offset)).length;
}

function remapSpans(raw: unknown, source: string, canonical: string): unknown {
  if (!Array.isArray(raw) || source === canonical) return raw;
  return raw.map((item) => {
    if (!item || typeof item !== 'object') return item;
    const span = item as Partial<PremarkedSpan>;
    if (
      typeof span.start !== 'number' ||
      typeof span.end !== 'number' ||
      typeof span.textoLiteral !== 'string' ||
      !isValidTextSpan(source, span.start, span.end, span.textoLiteral)
    ) {
      return item;
    }
    const start = canonicalOffset(source, span.start);
    const end = canonicalOffset(source, span.end);
    return {
      ...span,
      start,
      end,
      textoLiteral: canonical.slice(start, end),
    };
  });
}

function remapLexicalMentions(raw: unknown, source: string, canonical: string): unknown {
  if (!Array.isArray(raw) || source === canonical) return raw;
  return raw.map((item) => {
    if (!item || typeof item !== 'object') return item;
    const mention = item as Partial<LexicalMention>;
    if (
      typeof mention.start !== 'number' ||
      typeof mention.end !== 'number' ||
      typeof mention.surface !== 'string' ||
      !isValidTextSpan(source, mention.start, mention.end, mention.surface)
    ) {
      return item;
    }
    const start = canonicalOffset(source, mention.start);
    const end = canonicalOffset(source, mention.end);
    return {
      ...mention,
      start,
      end,
      surface: canonical.slice(start, end),
    };
  });
}

function validateAndNormalizeConcepts(raw: unknown, caseId: string): ConceptAnnotation[] | undefined {
  if (raw === undefined) return undefined;
  if (!Array.isArray(raw)) {
    throw new AnnotationInteropError(`El caso “${caseId}” tiene "concepts" con formato inválido.`);
  }
  return raw.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new AnnotationInteropError(
        `El concepto ${index + 1} del caso “${caseId}” no es un objeto válido.`
      );
    }
    const concept = item as Partial<ConceptAnnotation>;
    const rawConcept = item as Record<string, unknown>;
    const conceptWithoutRemovedFields = { ...rawConcept };
    delete conceptWithoutRemovedFields['section'];
    delete conceptWithoutRemovedFields['clinicalStatus'];
    delete conceptWithoutRemovedFields['procedureStatus'];
    delete conceptWithoutRemovedFields['severity'];
    if (typeof concept.sctid === 'number') {
      throw new AnnotationInteropError(
        `El SCTID del concepto ${index + 1} del caso “${caseId}” está guardado como número. ` +
          'Debe ser una cadena entre comillas para evitar pérdida de dígitos.'
      );
    }
    if (concept.sctid !== undefined && typeof concept.sctid !== 'string') {
      throw new AnnotationInteropError(
        `El SCTID del concepto ${index + 1} del caso “${caseId}” debe ser texto.`
      );
    }
    const sctid = (concept.sctid ?? '').trim();
    if (sctid && !/^\d{6,18}$/.test(sctid)) {
      throw new AnnotationInteropError(
        `El SCTID “${sctid}” del caso “${caseId}” no tiene un formato válido.`
      );
    }
    return { ...conceptWithoutRemovedFields, sctid } as ConceptAnnotation;
  });
}

function validateTextProfile(raw: AnnotationDocument): void {
  if (!raw.textProfile) return;
  const profile = raw.textProfile;
  if (
    profile.normalization !== SEMANTIAR_TEXT_PROFILE.normalization ||
    profile.lineEndings !== SEMANTIAR_TEXT_PROFILE.lineEndings ||
    profile.offsetUnit !== SEMANTIAR_TEXT_PROFILE.offsetUnit
  ) {
    throw new AnnotationInteropError(
      'El archivo usa un sistema de offsets incompatible. Se requiere NFC, saltos LF y offsets UTF-16.'
    );
  }
}

function normalizeTerminology(raw: AnnotationDocument): TerminologySnapshot | undefined {
  if (raw.terminology) {
    const terminology = raw.terminology;
    if (
      typeof terminology.server !== 'string' ||
      typeof terminology.editionUri !== 'string' ||
      (terminology.version !== null && typeof terminology.version !== 'string') ||
      typeof terminology.displayLanguage !== 'string'
    ) {
      throw new AnnotationInteropError('La cabecera terminológica del archivo es inválida.');
    }
    return {
      ...terminology,
      capturedAt:
        typeof terminology.capturedAt === 'string'
          ? terminology.capturedAt
          : new Date().toISOString(),
    };
  }

  const legacy = raw as AnnotationDocument & {
    terminologyServer?: unknown;
    editionUri?: unknown;
  };
  if (typeof legacy.terminologyServer === 'string' || typeof legacy.editionUri === 'string') {
    return {
      server: typeof legacy.terminologyServer === 'string' ? legacy.terminologyServer : '',
      editionUri: typeof legacy.editionUri === 'string' ? legacy.editionUri : '',
      version: typeof legacy.editionUri === 'string' && legacy.editionUri.includes('/version/')
        ? legacy.editionUri
        : null,
      displayLanguage: 'es',
      capturedAt: new Date().toISOString(),
    };
  }
  return undefined;
}

function assertInterchangeSchema(raw: unknown): void {
  if (validateInterchangeSchema(raw)) return;
  const details = (validateInterchangeSchema.errors ?? [])
    .slice(0, 4)
    .map((error) => `${error.instancePath || '/'} ${error.message ?? 'es inválido'}`)
    .join('; ');
  throw new AnnotationInteropError(
    `El JSON declara el contrato SemantIAr ${SEMANTIAR_SCHEMA_VERSION}, pero no lo cumple: ${details}.`
  );
}

export function prepareAnnotationDocument(raw: unknown): PreparedAnnotationDocument {
  if (!raw || typeof raw !== 'object') {
    throw new AnnotationInteropError('El JSON debe contener un objeto en la raíz.');
  }
  const input = raw as AnnotationDocument;
  const warnings: string[] = [];
  let strictInterchange = false;

  let sourceSchemaVersion = input.sourceSchemaVersion;
  if (input.schemaVersion !== undefined) {
    if (typeof input.schemaVersion !== 'string') {
      throw new AnnotationInteropError('"schemaVersion" debe ser una cadena de texto.');
    }
    if (input.schemaVersion === SEMANTIAR_SCHEMA_VERSION) {
      assertInterchangeSchema(raw);
      strictInterchange = true;
    } else if (KNOWN_LEGACY_SCHEMA_VERSIONS.has(input.schemaVersion)) {
      sourceSchemaVersion = input.schemaVersion;
      warnings.push(
        `Lote ${input.schemaVersion}: se migró al contrato SemantIAr ${SEMANTIAR_SCHEMA_VERSION}.`
      );
    } else {
      throw new AnnotationInteropError(
        `La versión de esquema “${input.schemaVersion}” no es compatible con esta aplicación.`
      );
    }
  } else {
    warnings.push('Archivo anterior sin schemaVersion: se migró al contrato SemantIAr 1.0.0.');
  }

  validateTextProfile(input);
  if (!Array.isArray(input.cases) || input.cases.length === 0) {
    throw new AnnotationInteropError('El JSON no contiene una lista no vacía de "cases".');
  }

  const seenCaseIds = new Set<string>();
  const cases = input.cases.map((rawCase, index): ClinicalCase => {
    if (!rawCase || typeof rawCase !== 'object') {
      throw new AnnotationInteropError(`El caso ${index + 1} no es un objeto válido.`);
    }
    const caseId = typeof rawCase.id === 'string' ? rawCase.id.trim() : '';
    if (!caseId) {
      throw new AnnotationInteropError(`El caso ${index + 1} no tiene un "id" válido.`);
    }
    if (seenCaseIds.has(caseId)) {
      throw new AnnotationInteropError(
        `El ID de caso “${caseId}” está repetido. Cada caso debe tener un ID único para preservar la trazabilidad.`
      );
    }
    seenCaseIds.add(caseId);
    if (typeof rawCase.text !== 'string') {
      throw new AnnotationInteropError(`El caso “${caseId}” no tiene un "text" válido.`);
    }

    const sourceTextNorm =
      typeof rawCase.textNorm === 'string' ? rawCase.textNorm : rawCase.text;
    const textNorm = canonicalizeAnnotationText(sourceTextNorm);
    const spans = remapSpans(rawCase.spans, sourceTextNorm, textNorm) as PremarkedSpan[] | undefined;
    const lexicalMentions = remapLexicalMentions(
      rawCase.lexicalMentions,
      sourceTextNorm,
      textNorm
    ) as LexicalMention[] | undefined;
    const concepts = validateAndNormalizeConcepts(rawCase.concepts, caseId);

    if (sourceTextNorm !== textNorm) {
      warnings.push(`El texto normalizado del caso “${caseId}” se convirtió a NFC/LF.`);
    }

    return {
      ...rawCase,
      id: caseId,
      text: rawCase.text,
      specialty:
        typeof rawCase.specialty === 'string' && rawCase.specialty.trim()
          ? rawCase.specialty.trim()
          : null,
      textNorm,
      spans,
      lexicalMentions,
      concepts,
    };
  });

  return {
    document: {
      ...input,
      schemaVersion: strictInterchange ? SEMANTIAR_SCHEMA_VERSION : undefined,
      sourceSchemaVersion,
      textProfile: { ...SEMANTIAR_TEXT_PROFILE },
      terminology: normalizeTerminology(input),
      cases,
    },
    warnings,
  };
}

import { describe, expect, it } from 'vitest';
import {
  AnnotationInteropError,
  prepareAnnotationDocument,
} from './annotation-interop';
import { isSafeUtf16Boundary, normalizeLexicalMentions } from './annotation.model';

describe('SemantIAr annotation interoperability', () => {
  it('migrates CRLF and NFD text while preserving exact UTF-16 span offsets', () => {
    const textNorm = 'Control\r\nCafe\u0301 con dolor 😀';
    const literal = 'Cafe\u0301 con dolor 😀';
    const start = textNorm.indexOf(literal);
    const end = start + literal.length;

    const prepared = prepareAnnotationDocument({
      project: 'SEMANTIAR',
      cases: [
        {
          id: 'UNICODE-001',
          text: textNorm,
          textNorm,
          spans: [
            {
              spanId: 'human-001',
              start,
              end,
              textoLiteral: literal,
              origin: 'human',
              confidence: 1,
              status: 'pendiente',
            },
          ],
          concepts: [
            {
              cat: 'Hallazgo clínico',
              sctid: '222980061000013107',
              term: 'Hallazgo',
              textoLiteral: literal,
              pol: 'Activo',
              cert: 'Confirmado',
              temp: 'Actual',
              suj: 'Paciente',
            },
          ],
        },
      ],
    });

    const migrated = prepared.document.cases[0];
    expect(migrated.text).toBe(textNorm);
    expect(migrated.textNorm).toBe('Control\nCafé con dolor 😀');
    expect(migrated.spans?.[0].textoLiteral).toBe('Café con dolor 😀');
    expect(
      migrated.textNorm?.slice(migrated.spans![0].start, migrated.spans![0].end)
    ).toBe(migrated.spans?.[0].textoLiteral);
    expect(migrated.concepts?.[0].sctid).toBe('222980061000013107');
    expect(prepared.document.schemaVersion).toBeUndefined();
    expect(prepared.document.textProfile?.offsetUnit).toBe('utf16-code-unit');
  });

  it('rejects numeric SCTIDs before they can circulate between app and web', () => {
    expect(() =>
      prepareAnnotationDocument({
        cases: [
          {
            id: 'SCTID-001',
            text: 'Infarto',
            concepts: [{ sctid: 222980061000013107 }],
          },
        ],
      })
    ).toThrow(AnnotationInteropError);
  });

  it('rejects incompatible offset profiles', () => {
    expect(() =>
      prepareAnnotationDocument({
        schemaVersion: '1.0.0',
        textProfile: {
          normalization: 'NFC',
          lineEndings: 'LF',
          offsetUnit: 'unicode-code-point',
        },
        cases: [{ id: 'OFFSET-001', text: 'Dolor' }],
      })
    ).toThrow(/no lo cumple/);
  });

  it('migrates every known legacy lot schema without requiring regenerated JSON', () => {
    for (const schemaVersion of [
      '2.0-core-blind',
      '2.0-spanlayer',
      '3.0-core-blind+lexical',
      '3.0-span+lexical',
    ]) {
      const prepared = prepareAnnotationDocument({
        schemaVersion,
        cases: [{ id: `LEGACY-${schemaVersion}`, text: 'Paciente estable.' }],
      });
      expect(prepared.document.schemaVersion).toBeUndefined();
      expect(prepared.document.sourceSchemaVersion).toBe(schemaVersion);
    }
  });

  it('rejects a malformed document that claims the strict interchange schema', () => {
    expect(() =>
      prepareAnnotationDocument({
        schemaVersion: '1.0.0',
        cases: [{ id: 'FALSE-CONTRACT-001', text: 'Dolor' }],
      })
    ).toThrow(/no lo cumple/);
  });

  it('does not allow a touch selection to split an emoji surrogate pair', () => {
    const text = 'A😀B';
    expect(isSafeUtf16Boundary(text, 1)).toBe(true);
    expect(isSafeUtf16Boundary(text, 2)).toBe(false);
    expect(isSafeUtf16Boundary(text, 3)).toBe(true);
  });

  it('accepts a second round trip without changing canonical offsets or SCTIDs', () => {
    const first = prepareAnnotationDocument({
      cases: [
        {
          id: 'ROUNDTRIP-001',
          text: 'Niño con fiebre',
          spans: [
            {
              spanId: 'human-001',
              start: 9,
              end: 15,
              textoLiteral: 'fiebre',
              origin: 'human',
              confidence: 1,
              status: 'confirmado',
            },
          ],
          concepts: [{ sctid: '386661006' }],
        },
      ],
    }).document;
    const second = prepareAnnotationDocument({
      ...first,
      schemaVersion: '1.0.0',
      textProfile: {
        normalization: 'NFC',
        lineEndings: 'LF',
        offsetUnit: 'utf16-code-unit',
      },
      terminology: {
        server: 'https://example.test/fhir',
        editionUri: 'http://snomed.info/sct',
        version: null,
        displayLanguage: 'es',
        capturedAt: '2026-07-30T00:00:00.000Z',
      },
      producer: {
        app: 'SemantIAr',
        build: 'test',
        platform: 'web',
      },
    }).document;

    expect(second.cases[0].textNorm).toBe(first.cases[0].textNorm);
    expect(second.cases[0].spans).toEqual(first.cases[0].spans);
    expect(second.cases[0].concepts?.[0].sctid).toBe('386661006');
  });

  it('rejects imported lexical offsets that start on a combining mark', () => {
    const textNorm = 'Cafe\u0301';
    const result = normalizeLexicalMentions(
      [
        {
          mentionId: 'lex-1',
          start: 4,
          end: 5,
          surface: '\u0301',
          origin: 'human',
          candidateSenseIds: [],
        },
      ],
      textNorm
    );
    expect(result).toEqual({ mentions: [], invalidCount: 1 });
  });
});

import { describe, expect, it } from 'vitest';
import {
  AnnotationInteropError,
  isSafeUtf16Boundary,
  prepareAnnotationDocument,
} from './annotation-interop';

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
    expect(prepared.document.schemaVersion).toBe('1.0.0');
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
    ).toThrow(/offsets incompatible/);
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
    const second = prepareAnnotationDocument(first).document;

    expect(second.cases[0].textNorm).toBe(first.cases[0].textNorm);
    expect(second.cases[0].spans).toEqual(first.cases[0].spans);
    expect(second.cases[0].concepts?.[0].sctid).toBe('386661006');
  });
});

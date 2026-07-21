import { buildTextSegments, normalizePremarkedSpans } from './annotation.model';

describe('premarked span helpers', () => {
  it('keeps verified non-overlapping offsets and builds interactive segments', () => {
    const text = 'FX DE RODILLA con dolor';
    const result = normalizePremarkedSpans(
      [
        {
          spanId: 's001',
          start: 0,
          end: 13,
          textoLiteral: 'FX DE RODILLA',
          origin: 'matcher',
          confidence: 0.9,
          status: 'pendiente',
        },
      ],
      text
    );

    expect(result.invalidCount).toBe(0);
    expect(buildTextSegments(text, result.spans)).toEqual([
      { kind: 'span', value: 'FX DE RODILLA', span: result.spans[0] },
      { kind: 'text', value: ' con dolor' },
    ]);
  });

  it('reports malformed, duplicate and overlapping spans without rendering them', () => {
    const result = normalizePremarkedSpans(
      [
        {
          spanId: 's001',
          start: 0,
          end: 2,
          textoLiteral: 'FX',
          origin: 'dict',
          confidence: 0.9,
          status: 'pendiente',
        },
        {
          spanId: 's002',
          start: 0,
          end: 13,
          textoLiteral: 'FX DE RODILLA',
          origin: 'matcher',
          confidence: 0.9,
          status: 'pendiente',
        },
        {
          spanId: 's003',
          start: 14,
          end: 25,
          textoLiteral: 'dolor invalido',
          origin: 'ner',
          confidence: 0.5,
          status: 'pendiente',
        },
      ],
      'FX DE RODILLA con dolor'
    );

    expect(result.spans).toHaveLength(1);
    expect(result.spans[0].spanId).toBe('s001');
    expect(result.invalidCount).toBe(2);
  });

  it('excludes isolated laboratory results but retains vital signs with values', () => {
    const text = 'GOT 38, GPT 49, TA 120/80.';
    const result = normalizePremarkedSpans(
      [
        { spanId: 's001', start: 0, end: 3, textoLiteral: 'GOT', origin: 'dict', confidence: 0.9, status: 'pendiente' },
        { spanId: 's002', start: 8, end: 11, textoLiteral: 'GPT', origin: 'dict', confidence: 0.9, status: 'pendiente' },
        { spanId: 's003', start: 16, end: 18, textoLiteral: 'TA', origin: 'dict', confidence: 0.9, status: 'pendiente' },
      ],
      text
    );

    expect(result.spans.map((span) => span.review?.disposition)).toEqual(['excluido', 'excluido', 'elegible']);
    expect(result.spans[2].suggest?.category).toBe('Hallazgo clínico');
    expect(buildTextSegments(text, result.spans).map((segment) => segment.value).join('')).toBe(text);
  });

  it('uses context to avoid default EG and PR expansions', () => {
    const text = 'EG: 28.5 sem. PR 0.16 en ECG.';
    const result = normalizePremarkedSpans(
      [
        { spanId: 's001', start: 0, end: 2, textoLiteral: 'EG', origin: 'dict', confidence: 0.6, status: 'pendiente' },
        { spanId: 's002', start: 14, end: 16, textoLiteral: 'PR', origin: 'dict', confidence: 0.6, status: 'pendiente' },
      ],
      text
    );

    expect(result.spans[0].suggest?.expansionAbbrev).toBe('Edad gestacional');
    expect(result.spans[1].review?.disposition).toBe('excluido');
  });

  it('preclassifies tri-axial candidates without assigning a concept', () => {
    const text = 'AVP infundiendo PHP. Se solicita ECG.';
    const result = normalizePremarkedSpans(
      [
        { spanId: 's001', start: 0, end: 3, textoLiteral: 'AVP', origin: 'dict', confidence: 0.9, status: 'pendiente' },
        { spanId: 's002', start: 16, end: 19, textoLiteral: 'PHP', origin: 'dict', confidence: 0.9, status: 'pendiente' },
        { spanId: 's003', start: 33, end: 36, textoLiteral: 'ECG', origin: 'dict', confidence: 0.9, status: 'pendiente' },
      ],
      text
    );

    expect(result.spans.map((span) => span.suggest?.category)).toEqual([
      'Hallazgo clínico',
      'Fármaco',
      'Procedimiento',
    ]);
    expect(result.spans.every((span) => !('sctid' in span))).toBe(true);
  });

  it('excludes administrative terms (PTE, MC, TTO, GI)', () => {
    const text = 'PTE estable. MC: dolor. TTO indicado. Compromiso GI.';
    const mkSpan = (id: string, start: number, end: number, lit: string) =>
      ({ spanId: id, start, end, textoLiteral: lit, origin: 'dict' as const, confidence: 0.9, status: 'pendiente' as const });
    const result = normalizePremarkedSpans(
      [mkSpan('s1', 0, 3, 'PTE'), mkSpan('s2', 13, 15, 'MC'), mkSpan('s3', 23, 26, 'TTO'), mkSpan('s4', 49, 51, 'GI')],
      text
    );
    expect(result.spans.every((s) => s.review?.disposition === 'excluido')).toBe(true);
  });

  it('excludes new extended lab analytes with values (PLAQ, ALDOLASA, HTO, BT)', () => {
    const text = 'PLAQ 344000. Aldolasa 8. HTO 41. BT 0.27.';
    const mkSpan = (id: string, start: number, end: number, lit: string) =>
      ({ spanId: id, start, end, textoLiteral: lit, origin: 'dict' as const, confidence: 0.9, status: 'pendiente' as const });
    const result = normalizePremarkedSpans(
      [
        mkSpan('s1', 0, 4, 'PLAQ'),
        mkSpan('s2', 13, 21, 'Aldolasa'),
        mkSpan('s3', 23, 26, 'HTO'),
        mkSpan('s4', 33, 35, 'BT'),
      ],
      text
    );
    expect(result.spans.every((s) => s.review?.disposition === 'excluido')).toBe(true);
  });

  it('classifies HB as finding in cardiac context and excludes it as lab analyte with value', () => {
    const textCardiac = 'ECG: HB izquierdo. Ritmo sinusal.';
    const textLab = 'Hb 13.8 g/dl.';
    const mkSpan = (start: number, end: number, lit: string) =>
      ({ spanId: 's1', start, end, textoLiteral: lit, origin: 'dict' as const, confidence: 0.9, status: 'pendiente' as const });

    const cardiac = normalizePremarkedSpans([mkSpan(5, 7, 'HB')], textCardiac);
    expect(cardiac.spans[0].review?.disposition).toBe('elegible');
    expect(cardiac.spans[0].suggest?.category).toBe('Hallazgo clínico');

    const lab = normalizePremarkedSpans([mkSpan(0, 2, 'Hb')], textLab);
    expect(lab.spans[0].review?.disposition).toBe('excluido');
  });

  it('resolves EG in obstetric checklist context (PGE, parto terms)', () => {
    const text = 'RHA+EG+CATARSIS+DIURESIS+PGE NEG';
    const result = normalizePremarkedSpans(
      [{ spanId: 's1', start: 4, end: 6, textoLiteral: 'EG', origin: 'dict' as const, confidence: 0.6, status: 'pendiente' as const }],
      text
    );
    expect(result.spans[0].review?.disposition).toBe('elegible');
    expect(result.spans[0].suggest?.expansionAbbrev).toBe('Edad gestacional');
  });

  it('resolves PR as procedure in urology context', () => {
    const text = 'Se realizó PR. PSA elevado, urología.';
    const result = normalizePremarkedSpans(
      [{ spanId: 's1', start: 11, end: 13, textoLiteral: 'PR', origin: 'dict' as const, confidence: 0.6, status: 'pendiente' as const }],
      text
    );
    expect(result.spans[0].review?.disposition).toBe('elegible');
    expect(result.spans[0].suggest?.category).toBe('Procedimiento');
  });

  it('disambiguates SV as device (sonda vesical) vs procedure (signos vitales)', () => {
    const textDevice = 'SV permeable, débito escaso.';
    const textProcedure = 'CSV, monitoreado, medicado.';
    const mkSpan = (end: number, lit: string) =>
      ({ spanId: 's1', start: 0, end, textoLiteral: lit, origin: 'dict' as const, confidence: 0.9, status: 'pendiente' as const });

    const device = normalizePremarkedSpans([mkSpan(2, 'SV')], textDevice);
    expect(device.spans[0].suggest?.category).toBe('Hallazgo clínico');

    const proc = normalizePremarkedSpans([mkSpan(3, 'CSV')], textProcedure);
    expect(proc.spans[0].suggest?.category).toBe('Procedimiento');
  });

  it('classifies VDRL as procedure and unambiguous findings correctly', () => {
    const text = 'VDRL NR. RHA presentes. Afebril.';
    const result = normalizePremarkedSpans(
      [
        { spanId: 's1', start: 0, end: 4, textoLiteral: 'VDRL', origin: 'dict' as const, confidence: 0.9, status: 'pendiente' as const },
        { spanId: 's2', start: 9, end: 12, textoLiteral: 'RHA', origin: 'dict' as const, confidence: 0.9, status: 'pendiente' as const },
        { spanId: 's3', start: 24, end: 31, textoLiteral: 'Afebril', origin: 'dict' as const, confidence: 0.9, status: 'pendiente' as const },
      ],
      text
    );
    expect(result.spans[0].suggest?.category).toBe('Procedimiento');
    expect(result.spans[1].suggest?.category).toBe('Hallazgo clínico');
    expect(result.spans[2].suggest?.category).toBe('Hallazgo clínico');
  });
});

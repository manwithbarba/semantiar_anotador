import {
  ASSISTED_ANNOTATION_PROTOCOL,
  buildTextMarks,
  buildTextSegments,
  CORE_BLIND_PROTOCOL,
  createAnnotationTelemetry,
  LEXICAL_DECISIONS,
  LEXICAL_FORM_TYPES,
  LEXICAL_FUNCTIONS,
  LEXICAL_UNCLASSIFIED_FUNCTION,
  lexicalMentionComplete,
  NONCODED_SEMANTICS_COMMENT,
  newHumanLexicalMention,
  newConcept,
  normalizeEvidenceCodes,
  normalizeLexicalAnnotation,
  normalizeLexicalMentions,
  normalizeLexicalReview,
  normalizePremarkedSpans,
} from './annotation.model';

describe('premarked span helpers', () => {
  it('keeps verified offsets and builds interactive segments', () => {
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
      {
        kind: 'span',
        value: 'FX DE RODILLA',
        marks: [
          {
            key: 'range-0-13',
            start: 0,
            end: 13,
            surface: 'FX DE RODILLA',
            kind: 'clinical',
            spans: [result.spans[0]],
            lexicalMentions: [],
          },
        ],
      },
      { kind: 'text', value: ' con dolor' },
    ]);
  });

  it('reports malformed spans while preserving valid overlapping spans', () => {
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

    expect(result.spans).toHaveLength(2);
    expect(result.spans[0].spanId).toBe('s001');
    expect(result.spans[1].spanId).toBe('s002');
    expect(result.invalidCount).toBe(1);
    expect(buildTextSegments('FX DE RODILLA con dolor', result.spans)).toContainEqual({
      kind: 'span',
      value: 'FX',
      marks: expect.arrayContaining([
        expect.objectContaining({
          key: 'range-0-2',
          spans: [expect.objectContaining({ spanId: 's001' })],
        }),
        expect.objectContaining({
          key: 'range-0-13',
          spans: [expect.objectContaining({ spanId: 's002' })],
        }),
      ]),
    });
  });

  it('derives clinical, lexical and combined visual marks from exact offsets', () => {
    const text = 'dolor FC IAM';
    const spans = [
      {
        spanId: 'clinical',
        start: 0,
        end: 5,
        textoLiteral: 'dolor',
        origin: 'human' as const,
        confidence: 1,
        status: 'pendiente' as const,
      },
      {
        spanId: 'both',
        start: 9,
        end: 12,
        textoLiteral: 'IAM',
        origin: 'human' as const,
        confidence: 1,
        status: 'pendiente' as const,
      },
    ];
    const lexicalOnly = newHumanLexicalMention('lexical', 6, 8, 'FC');
    const lexicalBoth = newHumanLexicalMention('lexical-both', 9, 12, 'IAM');

    expect(buildTextMarks(text, spans, [lexicalOnly, lexicalBoth])).toEqual([
      expect.objectContaining({ key: 'range-0-5', kind: 'clinical' }),
      expect.objectContaining({ key: 'range-6-8', kind: 'lexical' }),
      expect.objectContaining({ key: 'range-9-12', kind: 'both' }),
    ]);
    expect(buildTextSegments(text, spans, [lexicalOnly, lexicalBoth])
      .map((segment) => segment.value)
      .join('')).toBe(text);
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

  it('excludes LDL followed by a numeric result and classifies physical examination as procedure', () => {
    const text = 'LDL 153. examen fisico completo.';
    const result = normalizePremarkedSpans(
      [
        {
          spanId: 's1',
          start: 0,
          end: 3,
          textoLiteral: 'LDL',
          origin: 'dict',
          confidence: 0.9,
          status: 'pendiente',
        },
        {
          spanId: 's2',
          start: 9,
          end: 22,
          textoLiteral: 'examen fisico',
          origin: 'matcher',
          confidence: 0.8,
          status: 'pendiente',
        },
      ],
      text
    );

    expect(result.spans[0].review?.disposition).toBe('excluido');
    expect(result.spans[1].review?.disposition).toBe('elegible');
    expect(result.spans[1].suggest?.category).toBe('Procedimiento');
  });

  it('retains human spans as eligible, including their origin and manual review reason', () => {
    const text = 'Ictericia de piel y mucosas.';
    const result = normalizePremarkedSpans(
      [
        {
          spanId: 'human-001',
          start: 0,
          end: 17,
          textoLiteral: 'Ictericia de piel',
          origin: 'human',
          confidence: 1,
          status: 'pendiente',
          review: { disposition: 'elegible', reason: 'Span agregado manualmente por el anotador.' },
        },
      ],
      text
    );

    expect(result.invalidCount).toBe(0);
    expect(result.spans[0]).toMatchObject({
      spanId: 'human-001',
      origin: 'human',
      review: { disposition: 'elegible' },
    });
  });

  it('assigns an optional stable sequence when creating a concept block', () => {
    expect(newConcept(3)).toMatchObject({
      sequence: 3,
      cat: '',
      sctid: '',
      section: null,
      clinicalStatus: null,
      procedureStatus: null,
      severity: null,
      contextReviewed: false,
    });
    expect(newConcept().sequence).toBeUndefined();
  });

  it('distinguishes assisted annotation from a Core Blind lot', () => {
    expect(ASSISTED_ANNOTATION_PROTOCOL).toMatchObject({
      mode: 'assisted-span-review',
      preannotationsPresent: true,
      coreBlindIncluded: false,
    });
    expect(CORE_BLIND_PROTOCOL).toMatchObject({
      mode: 'core-blind',
      preannotationsPresent: false,
      coreBlindIncluded: true,
    });
  });

  it('keeps excluded spans as ordinary text without changing selectable offsets', () => {
    const text = 'GOT 38, ictericia de piel.';
    const result = normalizePremarkedSpans(
      [
        {
          spanId: 's001',
          start: 0,
          end: 3,
          textoLiteral: 'GOT',
          origin: 'dict',
          confidence: 0.9,
          status: 'pendiente',
        },
      ],
      text
    );

    const renderedText = buildTextSegments(text, result.spans)
      .map((segment) => segment.value)
      .join('');
    expect(renderedText).toBe(text);
    expect(renderedText.indexOf('ictericia de piel')).toBe(8);
  });

  it('normalizes valid lexical appearances and rejects invalid offsets and duplicate ids', () => {
    const text = 'AP: asma. AP en atención primaria.';
    const result = normalizeLexicalMentions(
      [
        {
          mentionId: 'lex-001',
          start: 0,
          end: 2,
          surface: 'AP',
          normalizedKey: 'AP',
          origin: 'sense_inventory',
          candidateSenseIds: ['AP.personal_history', 'AP.primary_care'],
          annotation: {
            decisionStatus: 'pending',
            formType: 'initialism',
            correctedForm: null,
            senseId: null,
            proposedExpansion: null,
            function: null,
            section: null,
            evidenceCodes: [],
            comment: null,
            annotatorId: null,
            annotatedAt: null,
          },
        },
        {
          mentionId: 'lex-001',
          start: 10,
          end: 12,
          surface: 'AP',
          origin: 'sense_inventory',
          candidateSenseIds: [],
          annotation: {},
        },
        {
          mentionId: 'lex-003',
          start: 10,
          end: 12,
          surface: 'ZZ',
          origin: 'orthographic_heuristic',
          candidateSenseIds: [],
          annotation: {},
        },
      ],
      text
    );

    expect(result.mentions).toHaveLength(1);
    expect(result.invalidCount).toBe(2);
    expect(result.mentions[0].candidateSenseIds).toEqual([
      'AP.personal_history',
      'AP.primary_care',
    ]);
  });

  it('requires the decision-specific evidence before considering a lexical mention complete', () => {
    const mention = newHumanLexicalMention('lex-human-001', 0, 3, 'ACO');
    expect(lexicalMentionComplete(mention)).toBe(false);

    mention.annotation.decisionStatus = 'resolved';
    expect(lexicalMentionComplete(mention)).toBe(false);
    mention.annotation.senseId = 'ACO.oral_contraceptive';
    expect(lexicalMentionComplete(mention)).toBe(true);

    mention.annotation.decisionStatus = 'new_sense_proposed';
    mention.annotation.senseId = null;
    expect(lexicalMentionComplete(mention)).toBe(false);
    mention.annotation.proposedExpansion = 'expansión propuesta';
    expect(lexicalMentionComplete(mention)).toBe(true);
  });

  it('permits explicit abstention without forcing a guessed sense', () => {
    const mention = newHumanLexicalMention('lex-human-002', 0, 2, 'SV');
    mention.annotation.decisionStatus = 'unknown';
    expect(lexicalMentionComplete(mention)).toBe(true);
    expect(mention.annotation.senseId).toBeNull();
  });

  it('keeps the exact v2 codes and clinician-facing labels in one contract', () => {
    expect(LEXICAL_FORM_TYPES.map(({ value, label }) => [value, label])).toEqual([
      ['abbreviation', 'Abreviatura'],
      ['acronym', 'Acrónimo pronunciable'],
      ['initialism', 'Sigla / inicialismo'],
      ['alphanumeric', 'Forma alfanumérica'],
      ['symbolic_abbreviation', 'Abreviatura simbólica'],
      ['other', 'Otra forma léxica'],
    ]);
    expect(LEXICAL_DECISIONS.map(({ value, label }) => [value, label])).toEqual([
      ['pending', 'Pendiente'],
      ['resolved', 'Sentido resuelto'],
      ['ambiguous', 'Ambigua aun con contexto'],
      ['unknown', 'No puedo determinarla'],
      ['new_sense_proposed', 'Proponer sentido nuevo'],
      ['form_error', 'Forma errónea o corrupta'],
      ['nonclinical', 'Uso no clínico/estructural'],
      ['rejected', 'No es abreviatura ni acrónimo'],
    ]);
    expect(LEXICAL_FUNCTIONS.map(({ value, label }) => [value, label])).toEqual([
      ['header', 'Encabezado'],
      ['entity', 'Entidad clínica'],
      ['value', 'Valor'],
      ['result', 'Resultado'],
      ['modifier', 'Modificador'],
      ['structural', 'Marca estructural'],
      ['other', 'Otra función'],
    ]);
    expect(LEXICAL_UNCLASSIFIED_FUNCTION).toMatchObject({
      value: null,
      label: 'Sin clasificar',
    });
  });

  it('canonicalizes clues and keeps the non-coded-semantics marker only in comment', () => {
    expect(normalizeEvidenceCodes(' valor cercano, , encabezado, valor cercano ')).toEqual([
      'valor cercano',
      'encabezado',
    ]);

    const annotation = normalizeLexicalAnnotation(
      {
        decisionStatus: 'unknown',
        formType: 'other',
        function: null,
        section: '  antecedentes  ',
        evidenceCodes: [
          '  valor cercano ',
          '',
          'valor cercano',
          NONCODED_SEMANTICS_COMMENT,
        ],
        comment: '  revisar en adjudicación ',
      },
      'TA'
    );

    expect(annotation.evidenceCodes).toEqual(['valor cercano']);
    expect(annotation.section).toBe('antecedentes');
    expect(annotation.comment).toBe(
      `revisar en adjudicación\n${NONCODED_SEMANTICS_COMMENT}`
    );
  });

  it('clears every conditional field that is incompatible with the imported decision', () => {
    const common = {
      formType: 'initialism',
      senseId: 'sense-1',
      proposedExpansion: 'propuesta',
      correctedForm: 'forma',
    };

    expect(
      normalizeLexicalAnnotation({ ...common, decisionStatus: 'resolved' }, 'FC')
    ).toMatchObject({
      senseId: 'sense-1',
      proposedExpansion: null,
      correctedForm: null,
    });
    expect(
      normalizeLexicalAnnotation({ ...common, decisionStatus: 'new_sense_proposed' }, 'FC')
    ).toMatchObject({
      senseId: null,
      proposedExpansion: 'propuesta',
      correctedForm: null,
    });
    expect(
      normalizeLexicalAnnotation({ ...common, decisionStatus: 'form_error' }, 'FC')
    ).toMatchObject({
      senseId: null,
      proposedExpansion: null,
      correctedForm: 'forma',
    });
    expect(
      normalizeLexicalAnnotation({ ...common, decisionStatus: 'ambiguous' }, 'FC')
    ).toMatchObject({
      senseId: null,
      proposedExpansion: null,
      correctedForm: null,
    });
  });

  it('distinguishes a missing functional decision from explicit other', () => {
    expect(normalizeLexicalAnnotation({ function: null }, 'FC').function).toBeNull();
    expect(normalizeLexicalAnnotation({ function: 'other' }, 'FC').function).toBe('other');
  });

  it('reopens a v2 lexical review when any appearance is not actually complete', () => {
    const mention = newHumanLexicalMention('lex-v2-001', 0, 2, 'FC');
    const inconsistent = normalizeLexicalReview(
      {
        status: 'completed',
        exhaustiveReviewRequired: true,
        annotatorId: 'A001',
        completedAt: '2026-07-27T00:00:00.000Z',
        inventoryVersion: 'SEMANTIAR-LEXICAL-SENSES-2.0',
      },
      [mention],
      'SEMANTIAR-LEXICAL-SENSES-2.0'
    );
    expect(inconsistent).toMatchObject({
      status: 'pending',
      annotatorId: null,
      completedAt: null,
    });

    mention.annotation.decisionStatus = 'ambiguous';
    expect(
      normalizeLexicalReview(
        { status: 'completed', completedAt: '2026-07-27T00:00:00.000Z' },
        [mention]
      ).status
    ).toBe('completed');
  });

  it('supports resolution, ambiguity, rejection and abstention for FC, RHA, EG, TA and SG without deriving expansions', () => {
    const text = 'FC RHA EG TA SG';
    const surfaces = ['FC', 'RHA', 'EG', 'TA', 'SG'];
    const decisions = ['resolved', 'ambiguous', 'rejected', 'unknown', 'pending'] as const;
    const result = normalizeLexicalMentions(
      surfaces.map((surface, index) => {
        const start = text.indexOf(surface);
        return {
          mentionId: `lex-form-${index + 1}`,
          start,
          end: start + surface.length,
          surface,
          origin: 'orthographic_heuristic',
          candidateSenseIds: surface === 'FC' ? ['sense:fc:contextual'] : [],
          annotation: {
            decisionStatus: decisions[index],
            formType: 'initialism',
            senseId: surface === 'FC' ? 'sense:fc:contextual' : null,
            evidenceCodes: [],
          },
        };
      }),
      text
    );

    expect(result.invalidCount).toBe(0);
    expect(result.mentions.map((mention) => mention.surface)).toEqual(surfaces);
    expect(result.mentions.slice(0, 4).every(lexicalMentionComplete)).toBe(true);
    expect(lexicalMentionComplete(result.mentions[4])).toBe(false);
    expect(
      result.mentions.slice(1).every((mention) => mention.annotation.senseId === null)
    ).toBe(true);
  });

  it('preserves offsets in the required dense note and leaves every meaning unresolved by default', () => {
    const text =
      '29 GI P0 1C  FUM:  MAC ACO  AQ:CESAREA  AP: ASMA  AO: ABO CA GSTRICO  // EX MAMARIO: NORMAL AXILAS NEG //TRAE ECOTV /¡(1/23) : DLN  //  PAP PENDIENTE';
    const surfaces = ['GI', 'P0', '1C', 'FUM', 'MAC', 'ACO', 'AQ', 'AP', 'AO', 'ABO', 'CA', 'ECOTV', 'DLN', 'PAP'];
    const result = normalizeLexicalMentions(
      surfaces.map((surface, index) => {
        const start = text.indexOf(surface);
        return {
          mentionId: `lex-dense-${index + 1}`,
          start,
          end: start + surface.length,
          surface,
          origin: 'orthographic_heuristic',
          candidateSenseIds: [],
          annotation: {},
        };
      }),
      text
    );

    expect(result.invalidCount).toBe(0);
    expect(result.mentions).toHaveLength(surfaces.length);
    expect(
      result.mentions.every(
        (mention) =>
          text.slice(mention.start, mention.end) === mention.surface &&
          mention.annotation.decisionStatus === 'pending' &&
          mention.annotation.senseId === null
      )
    ).toBe(true);
  });
});

describe('telemetry helpers', () => {
  it('initializes and merges passive behavioral metrics (clicks and deletions)', () => {
    const telemetry = createAnnotationTelemetry(['CASE-001']);
    expect(telemetry.cases[0]).toMatchObject({
      id: 'CASE-001',
      clicksTotal: 0,
      deletionsTotal: 0,
    });
    expect(telemetry.cases[0].clicksByTarget).toEqual({
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
    });
    expect(telemetry.cases[0].deletionsByType).toEqual({
      concept: 0,
      span: 0,
      'lexical-mention': 0,
      comment: 0,
    });

    const updated = createAnnotationTelemetry(['CASE-001'], {
      ...telemetry,
      cases: [
        {
          ...telemetry.cases[0],
          clicksTotal: 5,
          clicksByTarget: { ...telemetry.cases[0].clicksByTarget, 'concept-add': 3, 'span-accept': 2 },
          deletionsTotal: 1,
          deletionsByType: { ...telemetry.cases[0].deletionsByType, concept: 1 },
        },
      ],
    });

    expect(updated.cases[0].clicksTotal).toBe(5);
    expect(updated.cases[0].clicksByTarget['concept-add']).toBe(3);
    expect(updated.cases[0].deletionsTotal).toBe(1);
    expect(updated.cases[0].deletionsByType.concept).toBe(1);
  });
});

import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { App } from './app';
import { AnnotatorComponent } from './annotator/annotator.component';
import {
  ASSISTED_ANNOTATION_PROTOCOL,
  createAnnotationTelemetry,
  buildTextSegments,
  newHumanLexicalMention,
  newLexicalReview,
  normalizePremarkedSpans,
  NONCODED_SEMANTICS_COMMENT,
} from './models/annotation.model';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the annotator toolbar', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-annotator')).toBeTruthy();
  });

  it('should calculate the source offsets of a manual selection across rendered segments', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    const text = 'al examen fisico: leve ictericia de piel y mucosas';
    annotator.cases.set([
      {
        id: 'OFFSET-001',
        text,
        textNorm: text,
        spans: [
          {
            spanId: 's001',
            start: 3,
            end: 16,
            textoLiteral: 'examen fisico',
            origin: 'matcher',
            confidence: 1,
            status: 'pendiente',
          },
        ],
        concepts: [],
        comentarios: '',
      },
    ]);

    const root = document.createElement('div');
    root.innerHTML =
      '<span data-source-start="0">al </span>' +
      '<button data-source-start="3">examen fisico</button>' +
      '<span data-source-start="16">: leve ictericia de piel y mucosas</span>';
    document.body.appendChild(root);
    const trailingText = root.lastElementChild?.firstChild;
    expect(trailingText).toBeTruthy();
    const localStart = trailingText!.textContent!.indexOf('ictericia');
    const range = document.createRange();
    range.setStart(trailingText!, localStart);
    range.setEnd(trailingText!, localStart + 'ictericia'.length);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);

    annotator.captureTextSelection(0, root);

    expect(annotator.humanSpanDraft()).toEqual({
      caseIndex: 0,
      start: text.indexOf('ictericia'),
      end: text.indexOf('ictericia') + 'ictericia'.length,
      textoLiteral: 'ictericia',
    });
    selection.removeAllRanges();
    root.remove();
  });

  it('should preserve and expose overlapping spans as independently selectable segments', () => {
    const text = 'Sat O2: 96% AA';
    const normalized = normalizePremarkedSpans(
      [
        {
          spanId: 'sat', start: 0, end: 11, textoLiteral: 'Sat O2: 96%',
          origin: 'human', confidence: 1, status: 'pendiente',
        },
        {
          spanId: 'o2', start: 4, end: 6, textoLiteral: 'O2',
          origin: 'human', confidence: 1, status: 'pendiente',
        },
      ],
      text
    );

    expect(normalized.invalidCount).toBe(0);
    expect(normalized.spans.map((span) => span.spanId)).toEqual(['sat', 'o2']);
    expect(buildTextSegments(text, normalized.spans)).toContainEqual({
      kind: 'span',
      value: 'O2',
      spans: expect.arrayContaining([
        expect.objectContaining({ spanId: 'sat' }),
        expect.objectContaining({ spanId: 'o2' }),
      ]),
    });
  });

  it('should finalize a reviewed case and reopen it after an annotation edit', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    annotator.cases.set([
      {
        id: 'REVIEW-001',
        text: 'Paciente con fiebre.',
        textNorm: 'Paciente con fiebre.',
        spans: [],
        concepts: [
          {
            sequence: 1,
            cat: 'Hallazgo clínico',
            sctid: '386661006',
            term: 'Fiebre',
            textoLiteral: 'fiebre',
            pol: 'Activo',
            cert: 'Confirmado',
            temp: 'Actual',
            suj: 'Paciente',
          },
        ],
        comentarios: '',
        review: { status: 'pending' },
      },
    ]);
    annotator.sessionMeta.set({
      sessions: [],
      totalDownloads: 0,
      firstLoadedAt: '2026-07-24T00:00:00.000Z',
      telemetry: createAnnotationTelemetry(['REVIEW-001']),
    });

    annotator.finalizeCase(0, 'coded');
    expect(annotator.cases()[0].review).toMatchObject({
      status: 'finalized',
      outcome: 'coded',
    });
    expect(annotator.reviewedCount()).toBe(1);

    annotator.updateComentarios(0, 'Revisar en adjudicación');
    expect(annotator.cases()[0].review).toEqual({ status: 'pending' });
    expect(annotator.sessionMeta()?.telemetry?.cases[0].reopenedCount).toBe(1);
  });

  it('should migrate previously coded notes to finalized review state on reload', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;

    (annotator as any).ingestDocument(
      {
        cases: [
          {
            id: 'LEGACY-001',
            text: 'Paciente con fiebre.',
            concepts: [
              {
                cat: 'Hallazgo clínico',
                sctid: '386661006',
                term: 'Fiebre',
                textoLiteral: 'fiebre',
                pol: 'Activo',
                cert: 'Confirmado',
                temp: 'Actual',
                suj: 'Paciente',
              },
            ],
          },
        ],
      },
      'parcial.json'
    );

    expect(annotator.cases()[0].review).toEqual({
      status: 'finalized',
      outcome: 'coded',
    });
    expect(annotator.reviewedCount()).toBe(1);
    expect(annotator.sessionMeta()?.telemetry?.collectionMode).toBe('local-export-only');
  });

  it('should reopen an inconsistent completed v2 lexical review on reload', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;

    (annotator as any).ingestDocument(
      {
        _annotationProtocol: {
          ...ASSISTED_ANNOTATION_PROTOCOL,
          lexicalLayerEnabled: true,
          lexicalExhaustiveReviewRequired: true,
        },
        _lexicalInventory: {
          schemaVersion: '2.0',
          layerVersion: 'SEMANTIAR-LEXICAL-2.0',
          inventoryVersion: 'SEMANTIAR-LEXICAL-SENSES-2.0',
          locale: 'es-AR',
          status: 'provisional',
          rankingPresent: false,
          probabilitiesPresent: false,
          annotatorMayProposeNewSense: true,
          annotatorMayAbstain: true,
          abbreviations: [],
        },
        cases: [
          {
            id: 'LEX-V2-001',
            text: 'FC',
            lexicalMentions: [
              {
                mentionId: 'lex-001',
                start: 0,
                end: 2,
                surface: 'FC',
                normalizedKey: 'FC',
                origin: 'orthographic_heuristic',
                candidateSenseIds: [],
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
            ],
            lexicalReview: {
              status: 'completed',
              exhaustiveReviewRequired: true,
              annotatorId: 'A001',
              completedAt: '2026-07-27T00:00:00.000Z',
              inventoryVersion: 'SEMANTIAR-LEXICAL-SENSES-2.0',
            },
            review: {
              status: 'finalized',
              outcome: 'no-eligible-concepts',
              finalizedAt: '2026-07-27T00:00:00.000Z',
            },
          },
        ],
      },
      'v2-inconsistente.json'
    );

    expect(annotator.cases()[0].lexicalReview).toMatchObject({
      status: 'pending',
      annotatorId: null,
      completedAt: null,
    });
    expect(annotator.cases()[0].review).toEqual({ status: 'pending' });
    expect(annotator.complete()).toBe(false);
  });

  it('should clean incompatible decision fields and canonicalize contextual clues', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    const mention = newHumanLexicalMention('lex-human-001', 0, 2, 'FC');
    mention.annotation.senseId = 'sense:old';
    mention.annotation.proposedExpansion = 'sentido previo';
    mention.annotation.correctedForm = 'forma previa';
    annotator.annotationProtocol.set({
      ...ASSISTED_ANNOTATION_PROTOCOL,
      lexicalLayerEnabled: true,
    });
    annotator.cases.set([
      {
        id: 'LEX-EDIT-001',
        text: 'FC',
        textNorm: 'FC',
        spans: [],
        concepts: [],
        comentarios: '',
        review: { status: 'pending' },
        lexicalMentions: [mention],
        lexicalReview: newLexicalReview(),
      },
    ]);

    annotator.updateLexicalAnnotation(0, mention.mentionId, 'decisionStatus', 'ambiguous');
    annotator.updateLexicalEvidence(
      0,
      mention.mentionId,
      ` valor cercano, , encabezado, valor cercano, ${NONCODED_SEMANTICS_COMMENT}`
    );

    const annotation = annotator.cases()[0].lexicalMentions![0].annotation;
    expect(annotation).toMatchObject({
      decisionStatus: 'ambiguous',
      senseId: null,
      proposedExpansion: null,
      correctedForm: null,
      evidenceCodes: ['valor cercano', 'encabezado'],
      comment: NONCODED_SEMANTICS_COMMENT,
    });
  });

  it('should accept final abstention but never allow pending to close the note', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    const mention = newHumanLexicalMention('lex-human-002', 0, 3, 'RHA');
    annotator.annotationProtocol.set({
      ...ASSISTED_ANNOTATION_PROTOCOL,
      lexicalLayerEnabled: true,
    });
    annotator.cases.set([
      {
        id: 'LEX-CLOSE-001',
        text: 'RHA',
        textNorm: 'RHA',
        spans: [],
        concepts: [],
        comentarios: '',
        review: { status: 'pending' },
        lexicalMentions: [mention],
        lexicalReview: newLexicalReview(),
      },
    ]);

    annotator.completeLexicalReview(0);
    expect(annotator.cases()[0].lexicalReview?.status).toBe('pending');
    annotator.finalizeCase(0, 'no-eligible-concepts');
    expect(annotator.cases()[0].review?.status).toBe('pending');

    annotator.updateLexicalAnnotation(0, mention.mentionId, 'decisionStatus', 'unknown');
    annotator.completeLexicalReview(0);
    expect(annotator.cases()[0].lexicalReview?.status).toBe('completed');
    annotator.finalizeCase(0, 'no-eligible-concepts');
    expect(annotator.cases()[0].review?.status).toBe('finalized');
  });

  it('should render clinician-readable, accessible lexical guidance without internal codes', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    const mention = newHumanLexicalMention('lex-human-003', 0, 2, 'FC');
    mention.candidateSenseIds = ['sense:internal-only'];
    annotator.annotationProtocol.set({
      ...ASSISTED_ANNOTATION_PROTOCOL,
      lexicalLayerEnabled: true,
    });
    annotator.lexicalInventory.set({
      schemaVersion: '2.0',
      layerVersion: 'SEMANTIAR-LEXICAL-2.0',
      inventoryVersion: 'SEMANTIAR-LEXICAL-SENSES-2.0',
      locale: 'es-AR',
      status: 'provisional',
      rankingPresent: false,
      probabilitiesPresent: false,
      annotatorMayProposeNewSense: true,
      annotatorMayAbstain: true,
      abbreviations: [
        {
          key: 'FC',
          caseSensitiveForms: ['FC'],
          senses: [{ senseId: 'sense:internal-only', expansion: 'significado clínico de prueba' }],
        },
      ],
    });
    annotator.cases.set([
      {
        id: 'LEX-UX-001',
        text: 'FC',
        textNorm: 'FC',
        spans: [],
        concepts: [],
        comentarios: '',
        review: { status: 'pending' },
        lexicalMentions: [mention],
        lexicalReview: newLexicalReview(),
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent ?? '';
    expect(text).toContain('¿Cómo está escrita?');
    expect(text).toContain('¿Podés saber qué significa aquí?');
    expect(text).toContain('¿Qué papel cumple en esta parte de la nota?');
    expect(text).toContain('¿En qué parte de la nota aparece?');
    expect(text).toContain('¿Qué pistas usaste?');
    expect(text).toContain('¿Hay algo importante que no quedó registrado arriba?');
    expect(text).toContain('Pendiente significa que todavía no decidiste');
    expect(text).toContain('Sin clasificar deja el papel sin decidir');
    expect(text).toContain('las mayúsculas no prueban que sea una sigla');
    expect(text).not.toContain('sense:internal-only');
    expect(text).not.toContain('posición 0–2');
    expect(compiled.querySelector('details.lexical-help summary')).toBeTruthy();
    expect(
      compiled.querySelector('mat-select[aria-describedby^="lexical-decision-help-"]')
    ).toBeTruthy();
  });

  it('should export the same canonical lexical contract used on import', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    const mention = newHumanLexicalMention('lex-human-004', 0, 2, 'TA');
    mention.annotation = {
      ...mention.annotation,
      decisionStatus: 'unknown',
      senseId: 'sense:stale',
      proposedExpansion: 'sentido incompatible',
      correctedForm: 'forma incompatible',
      section: '  antecedentes  ',
      evidenceCodes: [
        '  valor cercano ',
        '',
        'valor cercano',
        NONCODED_SEMANTICS_COMMENT,
      ],
    };
    annotator.annotationProtocol.set({
      ...ASSISTED_ANNOTATION_PROTOCOL,
      lexicalLayerEnabled: true,
    });
    annotator.cases.set([
      {
        id: 'LEX-EXPORT-001',
        text: 'TA',
        textNorm: 'TA',
        spans: [],
        concepts: [],
        comentarios: '',
        review: { status: 'pending' },
        lexicalMentions: [mention],
        lexicalReview: newLexicalReview(),
      },
    ]);

    let capturedBlob: Blob | undefined;
    const createObjectUrl = vi
      .spyOn(URL, 'createObjectURL')
      .mockImplementation((blob) => {
        capturedBlob = blob as Blob;
        return 'blob:lexical-contract-test';
      });
    const revokeObjectUrl = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);

    annotator.download();
    const outputText = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsText(capturedBlob!);
    });
    const output = JSON.parse(outputText);
    const annotation = output.cases[0].lexicalMentions[0].annotation;

    expect(annotation).toMatchObject({
      decisionStatus: 'unknown',
      senseId: null,
      proposedExpansion: null,
      correctedForm: null,
      section: 'antecedentes',
      evidenceCodes: ['valor cercano'],
      comment: NONCODED_SEMANTICS_COMMENT,
    });
    click.mockRestore();
    revokeObjectUrl.mockRestore();
    createObjectUrl.mockRestore();
  });

  it('should aggregate terminology search events without counting keystrokes', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    annotator.cases.set([
      {
        id: 'SEARCH-001',
        text: 'Diabetes mellitus tipo 2.',
        textNorm: 'Diabetes mellitus tipo 2.',
        spans: [],
        concepts: [
          {
            sequence: 1,
            cat: 'Hallazgo clínico',
            sctid: '',
            term: '',
            textoLiteral: 'Diabetes mellitus tipo 2',
            pol: 'Activo',
            cert: 'Confirmado',
            temp: 'Actual',
            suj: 'Paciente',
          },
        ],
        comentarios: '',
        review: { status: 'pending' },
      },
    ]);
    annotator.sessionMeta.set({
      sessions: [],
      totalDownloads: 0,
      firstLoadedAt: '2026-07-24T00:00:00.000Z',
      telemetry: createAnnotationTelemetry(['SEARCH-001']),
    });

    annotator.recordSearchTelemetry(0, 0, { type: 'episode-start', query: 'diabetes' });
    annotator.recordSearchTelemetry(0, 0, { type: 'request', query: 'diabetes' });
    annotator.recordSearchTelemetry(0, 0, {
      type: 'result',
      query: 'diabetes',
      resultCount: 12,
      latencyMs: 85,
    });
    annotator.recordSearchTelemetry(0, 0, {
      type: 'selection',
      query: 'diabetes',
      resultCount: 12,
      selectedRank: 2,
    });

    const search = annotator.sessionMeta()?.telemetry?.cases[0].search;
    expect(search).toMatchObject({
      episodes: 1,
      requests: 1,
      completedRequests: 1,
      selections: 1,
      totalLatencyMs: 85,
    });
    expect(search?.selectedRanks).toEqual([2]);
    expect(search?.queries[0]).toMatchObject({
      query: 'diabetes',
      category: 'Hallazgo clínico',
      requests: 1,
      selections: 1,
    });
  });
});

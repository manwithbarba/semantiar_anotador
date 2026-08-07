import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { vi } from 'vitest';
import { App } from './app';
import { AnnotatorComponent } from './annotator/annotator.component';
import {
  ASSISTED_ANNOTATION_PROTOCOL,
  createAnnotationTelemetry,
  buildTextSegments,
  newHumanLexicalMention,
  newLexicalReview,
  newConcept,
  normalizeLexicalMentions,
  normalizePremarkedSpans,
  NONCODED_SEMANTICS_COMMENT,
} from './models/annotation.model';
import { prepareAnnotationDocument } from './models/annotation-interop';

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

  it('should provide an embedded app manual with one PDF download action', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;

    annotator.openManual();
    fixture.detectChanges();
    await fixture.whenStable();

    const dialog = document.querySelector('.manual-dialog-content');
    expect(dialog?.textContent).toContain('Cargá el archivo asignado');
    expect(dialog?.textContent).toContain('Cerrá la nota');
    expect(
      [...document.querySelectorAll('button')].filter((button) =>
        button.textContent?.includes('Descargar o compartir PDF')
      )
    ).toHaveLength(1);
  });

  it('should use native lexical controls on a phone', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    const originalWidth = window.innerWidth;

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 390 });
    annotator.refreshMobileLayout();
    expect(annotator.compactMobile()).toBe(true);

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalWidth });
    annotator.refreshMobileLayout();
    expect(annotator.compactMobile()).toBe(false);
  });

  it('should render lexical decisions as native controls on a phone', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    annotator.compactMobile.set(true);
    annotator.annotationProtocol.set({ ...ASSISTED_ANNOTATION_PROTOCOL, lexicalLayerEnabled: true });
    annotator.cases.set([
      {
        id: 'MOBILE-LEXICAL-001',
        text: 'IAM sin datos adicionales.',
        textNorm: 'IAM sin datos adicionales.',
        spans: [],
        concepts: [],
        lexicalMentions: [newHumanLexicalMention('lex-mobile-001', 0, 3, 'IAM')],
        comentarios: '',
      },
    ]);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.lexical-native-field select')).toHaveLength(5);
    expect(fixture.nativeElement.querySelectorAll('.lexical-grid mat-select')).toHaveLength(0);
    expect(fixture.nativeElement.querySelector('.case-source #case-lexical-0')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.case-source #case-mention-add-0')).toBeTruthy();
  });

  it('should keep the free-form meaning input mounted while typing', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    const mention = newHumanLexicalMention('lex-freeform-001', 0, 2, 'BM');
    mention.annotation.decisionStatus = 'resolved';
    annotator.annotationProtocol.set({ ...ASSISTED_ANNOTATION_PROTOCOL, lexicalLayerEnabled: true });
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
      abbreviations: [],
    });
    annotator.cases.set([
      {
        id: 'LEX-FREEFORM-001',
        text: 'BM',
        textNorm: 'BM',
        spans: [],
        concepts: [],
        lexicalMentions: [mention],
        lexicalReview: newLexicalReview(),
        comentarios: '',
      },
    ]);

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input[placeholder="Escribí el sentido o su identificador"]')).toBeTruthy();

    annotator.updateLexicalAnnotation(0, mention.mentionId, 'senseId', 'B');
    fixture.detectChanges();

    expect(annotator.cases()[0].lexicalMentions?.[0].annotation.senseId).toBe('B');
    expect(fixture.nativeElement.querySelector('input[placeholder="Escribí el sentido o su identificador"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('mat-select[aria-label="¿Qué significa aquí?"]')).toBeNull();
  });

  it('should keep incorporation actions in the left source panel', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    annotator.annotationProtocol.set({ ...ASSISTED_ANNOTATION_PROTOCOL, lexicalLayerEnabled: true });
    annotator.cases.set([
      {
        id: 'LAYOUT-001',
        text: 'Paciente con fiebre.',
        textNorm: 'Paciente con fiebre.',
        spans: [],
        concepts: [],
        comentarios: '',
        lexicalMentions: [],
        lexicalReview: newLexicalReview(),
      },
    ]);
    annotator.humanSpanDraft.set({
      caseIndex: 0,
      start: 14,
      end: 20,
      textoLiteral: 'fiebre',
    });
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.case-source .human-span-draft')).toBeTruthy();
    expect(root.querySelector('.case-review .human-span-draft')).toBeNull();
    expect(root.querySelector('.case-source .span-actions')).toBeTruthy();
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

  it('should add a mobile typed mention with verified offsets and platform provenance', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    const text = 'Dolor abdominal y dolor abdominal recurrente.';
    annotator.cases.set([
      {
        id: 'MOBILE-SPAN-001',
        text,
        textNorm: text,
        spans: [],
        concepts: [],
        comentarios: '',
      },
    ]);
    annotator.sessionMeta.set({
      sessions: [],
      totalDownloads: 0,
      firstLoadedAt: '2026-07-30T00:00:00.000Z',
      telemetry: createAnnotationTelemetry(['MOBILE-SPAN-001']),
    });

    annotator.setMentionQuickValue(0, 'dolor abdominal');
    const candidates = annotator.mentionQuickCandidates(0);
    expect(candidates).toHaveLength(1);
    annotator.addHumanSpanAt(0, candidates[0].start, candidates[0].end);

    expect(annotator.cases()[0].spans[0]).toMatchObject({
      start: text.indexOf('dolor abdominal'),
      end: text.indexOf('dolor abdominal') + 'dolor abdominal'.length,
      textoLiteral: 'dolor abdominal',
      humanAudit: {
        createdPlatform: 'web',
        lastActionPlatform: 'web',
      },
    });
    expect(
      annotator.sessionMeta()?.telemetry?.cases[0].byPlatform.web.manualSpansAdded
    ).toBe(1);
  });

  it('should keep Core Blind restricted to the webpage', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    Object.defineProperty(annotator, 'isNativeApp', { value: true });

    (annotator as unknown as {
      ingestDocument: (doc: unknown, fileName: string) => void;
    }).ingestDocument(
      {
        project: 'SEMANTIAR',
        batch: 'CORE-BLIND',
        annotatorId: 'IP',
        sourceFile: 'core-blind.json',
        _annotationProtocol: {
          mode: 'core-blind',
          spansVisible: false,
          preannotationVisible: false,
          exhaustiveReviewRequired: true,
        },
        cases: [{ id: 'CB-001', text: 'Nota de referencia.' }],
      },
      'core-blind.json'
    );

    expect(annotator.loaded()).toBe(false);
    expect(annotator.cases()).toEqual([]);
  });

  it('should reject an isolated combining mark and preserve the complete mobile lexical span', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    const text = 'A\u0338';
    annotator.cases.set([
      {
        id: 'MOBILE-LEXICAL-UNICODE-001',
        text,
        textNorm: text.normalize('NFC'),
        spans: [],
        concepts: [],
        comentarios: '',
        lexicalMentions: [],
      },
    ]);

    annotator.setLexicalQuickValue(0, '\u0338');
    expect(annotator.lexicalQuickCandidates(0)).toEqual([]);
    annotator.addHumanLexicalMentionAt(0, 1, 2);
    expect(annotator.cases()[0].lexicalMentions).toEqual([]);

    annotator.setLexicalQuickValue(0, text);
    const [candidate] = annotator.lexicalQuickCandidates(0);
    annotator.addHumanLexicalMentionAt(0, candidate.start, candidate.end);
    const saved = annotator.cases()[0].lexicalMentions ?? [];
    expect(saved).toHaveLength(1);
    expect(normalizeLexicalMentions(saved, annotator.cases()[0].textNorm).invalidCount).toBe(0);
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

  it('should distinguish edited notes from notes explicitly closed by the annotator', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;

    annotator.cases.set([
      {
        id: 'FLOW-001',
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
      {
        id: 'FLOW-002',
        text: 'Sin hallazgos.',
        textNorm: 'Sin hallazgos.',
        spans: [],
        concepts: [],
        comentarios: '',
        review: { status: 'pending' },
      },
    ]);

    expect(annotator.reviewedCount()).toBe(0);
    expect(annotator.pendingCount()).toBe(2);
    expect(annotator.editingCount()).toBe(1);

    annotator.finalizeCase(0, 'coded');

    expect(annotator.reviewedCount()).toBe(1);
    expect(annotator.pendingCount()).toBe(1);
    expect(annotator.editingCount()).toBe(0);
  });

  it('should show the two visible steps of the lexical review flow', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    const mention = newHumanLexicalMention('flow-lex-001', 0, 2, 'FC');

    annotator.annotationProtocol.set({
      ...ASSISTED_ANNOTATION_PROTOCOL,
      lexicalLayerEnabled: true,
    });
    annotator.cases.set([
      {
        id: 'FLOW-LEX-001',
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

    expect(annotator.lexicalTotalCount(annotator.cases()[0])).toBe(1);
    expect(annotator.lexicalCompletedCount(annotator.cases()[0])).toBe(0);
    expect(annotator.lexicalProgressPct(annotator.cases()[0])).toBe(0);

    annotator.updateLexicalAnnotation(0, mention.mentionId, 'decisionStatus', 'unknown');

    expect(annotator.lexicalCompletedCount(annotator.cases()[0])).toBe(1);
    expect(annotator.lexicalProgressPct(annotator.cases()[0])).toBe(100);
    expect(annotator.cases()[0].lexicalReview?.status).toBe('pending');
    annotator.completeLexicalReview(0);
    expect(annotator.cases()[0].lexicalReview?.status).toBe('completed');
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
    expect(text).toContain('Revisión exhaustiva de información clínica');
    expect(text).not.toContain('Revisión exhaustiva de menciones clínicas');
    expect(compiled.querySelector('.case-guidance')).toBeNull();
    expect(text).toContain('¿Cómo está escrita?');
    expect(text).toContain('¿Cómo se decide el significado?');
    expect(text).not.toContain('¿Podés saber qué significa aquí?');
    expect(text).not.toContain('¿Qué significa aquí?');
    expect(text).toContain('¿Qué papel cumple en esta parte de la nota?');
    expect(text).toContain('¿En qué parte de la nota aparece?');
    expect(text).toContain('¿Qué pistas usaste?');
    expect(text).not.toContain('¿Hay algo importante que no quedó registrado arriba?');
    expect(text).not.toContain('Agregar mención breve');
    expect(compiled.querySelector('.case-source #case-lexical-0')).toBeNull();
    expect(compiled.querySelector('.case-review #case-lexical-0')).toBeNull();
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

  it('should show saved annotation state without duplicating the download command', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    annotator.cases.set([
      {
        id: 'FLOW-UI-001',
        text: 'Paciente estable.',
        textNorm: 'Paciente estable.',
        spans: [],
        concepts: [
          {
            sequence: 1,
            cat: 'Hallazgo clínico',
            sctid: '386661006',
            term: 'Fiebre',
            textoLiteral: 'estable',
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
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.case-close-jump')).toBeFalsy();
    expect(compiled.querySelector('.case-id')).toBeFalsy();
    expect(compiled.querySelector('.case-pager-copy small')?.textContent).toContain('Anotación guardada');
    expect(compiled.textContent).toContain('Anotación guardada');
    expect(compiled.querySelectorAll('.json-flow-download')).toHaveLength(0);
    expect(
      [...compiled.querySelectorAll('button')].filter((button) =>
        button.textContent?.includes('Descargar JSON de avance')
      )
    ).toHaveLength(1);
  });

  it('should label coded concepts and added mentions with actionable status text', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    const coded = newConcept(1);
    coded.cat = 'Hallazgo clínico';
    coded.sctid = '386661006';
    coded.term = 'Adecuadamente hidratado';
    coded.textoLiteral = 'adecuadamente hidratado';
    const added = newConcept(2);
    added.textoLiteral = 'alta médica';

    annotator.cases.set([
      {
        id: 'CONCEPT-LABEL-001',
        text: 'Adecuadamente hidratado. Alta médica.',
        textNorm: 'Adecuadamente hidratado. Alta médica.',
        spans: [],
        concepts: [coded, added],
        comentarios: '',
        review: { status: 'pending' },
      },
    ]);
    fixture.detectChanges();

    const conceptCards = fixture.nativeElement.querySelectorAll('.concept-block');
    expect(conceptCards[0].textContent).toContain('Adecuadamente hidratado');
    expect(conceptCards[0].textContent).toContain('Hallazgo clínico · Codificado');
    expect(conceptCards[1].textContent).toContain('alta médica');
    expect(conceptCards[1].textContent).toContain('Mención clínica · Pendiente de codificación');
    expect(fixture.nativeElement.textContent).not.toContain('Concepto clínico sin codificar');
    expect(fixture.nativeElement.textContent).not.toContain('Sin jerarquía · Pendiente');
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

    expect(output).toMatchObject({
      schemaVersion: '1.0.0',
      textProfile: {
        normalization: 'NFC',
        lineEndings: 'LF',
        offsetUnit: 'utf16-code-unit',
      },
      producer: { app: 'SemantIAr', platform: 'web' },
    });
    expect(output._meta.sessions.at(-1)).toMatchObject({
      action: 'download',
      platform: 'web',
      schemaVersion: '1.0.0',
    });
    expect(() => prepareAnnotationDocument(output)).not.toThrow();
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

  it('should ignore an out-of-order SNOMED detection after restoring a JSON version', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    const terminologyService = (annotator as any).terminologyService;
    const delayed = new Subject<any>();
    vi.spyOn(terminologyService, 'detectEdition').mockReturnValue(delayed);

    annotator.terminologyServer.set('https://old.example/fhir');
    annotator.detectEdition();
    (annotator as any).ingestDocument(
      {
        cases: [{ id: 'RACE-001', text: 'Paciente estable.' }],
        terminology: {
          server: 'https://restored.example/fhir',
          editionUri: 'http://snomed.info/sct/11000221109/version/20260331',
          version: 'http://snomed.info/sct/11000221109/version/20260331',
          displayLanguage: 'es',
          capturedAt: '2026-07-30T00:00:00.000Z',
        },
      },
      'race.json'
    );

    delayed.next({
      editionUri: 'http://snomed.info/sct/900000000000207008/version/20260701',
      version: 'http://snomed.info/sct/900000000000207008/version/20260701',
      displayLanguage: 'en',
      label: 'Internacional (en)',
      isArgentina: false,
    });

    expect(annotator.terminologyServer()).toBe('https://restored.example/fhir');
    expect(annotator.editionUri()).toBe(
      'http://snomed.info/sct/11000221109/version/20260331'
    );
    expect(terminologyService.terminologyServer).toBe('https://restored.example/fhir');
    expect(terminologyService.editionUri).toBe(
      'http://snomed.info/sct/11000221109/version/20260331'
    );
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
      platform: 'web',
      requests: 1,
      selections: 1,
    });
    expect(
      annotator.sessionMeta()?.telemetry?.cases[0].byPlatform.web.search
    ).toMatchObject({
      episodes: 1,
      requests: 1,
      completedRequests: 1,
      selections: 1,
      totalLatencyMs: 85,
    });
    expect(
      annotator.sessionMeta()?.telemetry?.cases[0].byPlatform.android.search.requests
    ).toBe(0);
  });

  it('should accumulate assisted-span search metrics separately across Android and web', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    annotator.cases.set([
      {
        id: 'CROSS-PLATFORM-001',
        text: 'Paciente con fiebre.',
        textNorm: 'Paciente con fiebre.',
        spans: [],
        concepts: [
          {
            cat: 'Hallazgo clínico',
            sctid: '',
            term: '',
            textoLiteral: 'fiebre',
            pol: 'Activo',
            cert: 'Confirmado',
            temp: 'Actual',
            suj: 'Paciente',
          },
        ],
        comentarios: '',
      },
    ]);
    annotator.sessionMeta.set({
      sessions: [],
      totalDownloads: 0,
      firstLoadedAt: '2026-07-30T00:00:00.000Z',
      telemetry: createAnnotationTelemetry(['CROSS-PLATFORM-001']),
    });

    (annotator as any).currentPlatform = 'android';
    annotator.recordSearchTelemetry(0, 0, { type: 'request', query: 'fiebre' });
    (annotator as any).currentPlatform = 'web';
    annotator.recordSearchTelemetry(0, 0, { type: 'request', query: 'fiebre' });

    const telemetry = annotator.sessionMeta()?.telemetry?.cases[0];
    expect(telemetry?.search.requests).toBe(2);
    expect(telemetry?.byPlatform.android.search.requests).toBe(1);
    expect(telemetry?.byPlatform.web.search.requests).toBe(1);
    expect(telemetry?.search.queries.map((query) => query.platform).sort()).toEqual([
      'android',
      'web',
    ]);
  });

  it('should track passive behavioral metrics (clicks, deletions, and target distribution)', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;

    annotator.cases.set([
      {
        id: 'TELEMETRY-001',
        text: 'Paciente con dolor abdominal.',
        textNorm: 'Paciente con dolor abdominal.',
        spans: [
          {
            spanId: 'span-1',
            start: 13,
            end: 28,
            textoLiteral: 'dolor abdominal',
            origin: 'candidate',
            confidence: 1.0,
            status: 'pendiente',
          },
        ],
        concepts: [],
        comentarios: '',
      },
    ]);
    annotator.sessionMeta.set({
      sessions: [],
      totalDownloads: 0,
      firstLoadedAt: '2026-07-24T00:00:00.000Z',
      telemetry: createAnnotationTelemetry(['TELEMETRY-001']),
    });

    const addCard = document.createElement('div');
    addCard.setAttribute('data-case-index', '0');
    const addButton = document.createElement('button');
    addButton.className = 'add-concept-btn';
    addCard.appendChild(addButton);
    annotator.onDocumentClick({ target: addButton } as unknown as MouseEvent);
    annotator.addConcept(0);

    const discardCard = document.createElement('div');
    discardCard.setAttribute('data-case-index', '0');
    const discardButton = document.createElement('button');
    discardButton.className = 'discard-span-btn';
    discardCard.appendChild(discardButton);
    annotator.onDocumentClick({ target: discardButton } as unknown as MouseEvent);
    annotator.selectedSpan.set({ caseIndex: 0, spanId: annotator.cases()[0].spans[0].spanId });
    annotator.discardSelectedSpan(0);

    const caseTelem = annotator.sessionMeta()?.telemetry?.cases[0];
    expect(caseTelem).toBeDefined();
    expect(caseTelem?.conceptsAdded).toBe(1);
    expect(caseTelem?.spansDiscarded).toBe(1);
    expect(caseTelem?.deletionsTotal).toBe(1);
    expect(caseTelem?.deletionsByType.span).toBe(1);
    expect(caseTelem?.clicksByTarget['concept-add']).toBe(1);
    expect(caseTelem?.clicksByTarget['span-discard']).toBe(1);
    expect(caseTelem?.clicksTotal).toBeGreaterThanOrEqual(2);
    expect(caseTelem?.byPlatform.web.conceptsAdded).toBe(1);
    expect(caseTelem?.byPlatform.web.spansDiscarded).toBe(1);
    expect(caseTelem?.byPlatform.web.clicksTotal).toBeGreaterThanOrEqual(2);
    expect(caseTelem?.byPlatform.android.clicksTotal).toBe(0);
  });
});

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
  conceptIsComplete,
  newHumanLexicalMention,
  newLexicalReview,
  newConcept,
  normalizeLexicalMentions,
  normalizePremarkedSpans,
  NONCODED_SEMANTICS_COMMENT,
  MEDICAL_SPECIALTIES,
} from './models/annotation.model';
import { prepareAnnotationDocument } from './models/annotation-interop';
import { AnnotationRecoveryService } from './services/annotation-recovery.service';

/** Sanitized structural fixture distilled from A034; it contains no clinical text. */
function makeA034ContractFixture(): Record<string, unknown> {
  const shape = [
    [11, 5, 8, 9, false],
    [2, 1, 1, 2, true],
    [9, 7, 3, 8, false],
    [2, 0, 1, 0, false],
    [3, 0, 4, 0, false],
    [1, 0, 0, 0, false],
    [1, 0, 4, 0, false],
    [1, 0, 0, 0, false],
    [2, 0, 2, 0, false],
    [3, 0, 0, 0, false],
  ] as const;

  const cases = shape.map(([spanCount, conceptCount, lexicalCount, confirmedCount, finalized], caseIndex) => {
    const spanTokens = Array.from({ length: spanCount }, (_, index) => `S${caseIndex + 1}_${index + 1}`);
    const lexicalTokens = Array.from({ length: lexicalCount }, (_, index) => `L${caseIndex + 1}_${index + 1}`);
    const tokens = [...spanTokens, ...lexicalTokens];
    const text = tokens.join(' ');
    const offsets: Array<{ start: number; end: number; value: string }> = [];
    let cursor = 0;
    for (const token of tokens) {
      offsets.push({ start: cursor, end: cursor + token.length, value: token });
      cursor += token.length + 1;
    }
    const spans = spanTokens.map((token, index) => ({
      spanId: `a034-span-${caseIndex + 1}-${index + 1}`,
      start: offsets[index].start,
      end: offsets[index].end,
      textoLiteral: token,
      origin: 'candidate',
      confidence: 1,
      status: index < confirmedCount ? 'confirmado' : 'pendiente',
      review: {
        disposition: 'elegible',
        reason: 'Fixture estructural sin texto clínico.',
      },
    }));
    const concepts = spans.slice(0, conceptCount).map((span, index) => ({
      sequence: index + 1,
      cat: 'Hallazgo clínico',
      sctid: String(100000 + caseIndex * 100 + index),
      term: `Concepto sintético ${caseIndex + 1}-${index + 1}`,
      textoLiteral: span.textoLiteral,
      pol: 'Activo',
      cert: 'Confirmado',
      temp: 'Actual',
      suj: 'Paciente',
      spanId: span.spanId,
    }));
    const lexicalMentions = lexicalTokens.map((token, index) => {
      const mention = newHumanLexicalMention(
        `a034-lex-${caseIndex + 1}-${index + 1}`,
        offsets[spanCount + index].start,
        offsets[spanCount + index].end,
        token
      );
      if (caseIndex < 3) mention.annotation.decisionStatus = 'unknown';
      return mention;
    });

    return {
      id: `A034-SYNTH-${String(caseIndex + 1).padStart(2, '0')}`,
      text,
      textNorm: text,
      spans,
      concepts,
      comentarios: '',
      review: finalized
        ? { status: 'finalized', outcome: 'coded' }
        : { status: 'pending' },
      lexicalMentions,
      lexicalReview: caseIndex < 3
        ? {
            status: 'completed',
            exhaustiveReviewRequired: true,
            annotatorId: 'A034',
            completedAt: '2026-08-17T12:00:00.000Z',
            inventoryVersion: 'fixture',
          }
        : newLexicalReview('fixture'),
    };
  });

  return {
    schemaVersion: '1.0.0',
    textProfile: { normalization: 'NFC', lineEndings: 'LF', offsetUnit: 'utf16-code-unit' },
    terminology: {
      server: 'https://example.invalid/fhir',
      editionUri: 'http://snomed.info/sct',
      version: null,
      displayLanguage: 'es',
      capturedAt: '2026-08-17T12:00:00.000Z',
    },
    producer: { app: 'SemantIAr', build: 'fixture', platform: 'web' },
    project: 'A034 structural fixture',
    batch: 'fixture',
    annotatorId: 'A034',
    cases,
    _annotationProtocol: {
      mode: 'assisted-span-review',
      exhaustiveReviewRequired: true,
      lexicalLayerEnabled: true,
    },
  };
}

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

  it('should offer clinical and interdisciplinary note specialties', () => {
    expect(MEDICAL_SPECIALTIES).toEqual(
      expect.arrayContaining(['Enfermería', 'Neonatología', 'Salud mental', 'Trabajo social'])
    );
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
    annotator.unifiedReviewPrototype.set(false);
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

  it('should present closure as a subview of step three', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    annotator.annotationProtocol.set({ ...ASSISTED_ANNOTATION_PROTOCOL, lexicalLayerEnabled: true });
    annotator.cases.set([
      {
        id: 'WORKFLOW-THREE-STEPS-001',
        text: 'Texto sintético de control.',
        textNorm: 'Texto sintético de control.',
        spans: [],
        concepts: [],
        lexicalMentions: [],
        comentarios: '',
      },
    ]);

    fixture.detectChanges();

    const workflowNav = fixture.nativeElement.querySelector('.case-workflow-steps') as HTMLElement;
    const workflowButtons = [...workflowNav.querySelectorAll('button')];
    expect(workflowButtons).toHaveLength(3);
    expect(workflowNav.textContent).toContain('Nota');
    expect(workflowNav.textContent).toContain('Marcación');
    expect(workflowNav.textContent).toContain('Decisiones');
    expect(workflowNav.textContent).toContain('cierre incluido');
    expect(workflowNav.querySelector('[aria-label="Paso 3: revisar el resultado y cerrar la nota"]')).toBeNull();
  });

  it('should expose the three unified annotation categories and preserve both dimensions', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    annotator.annotationProtocol.set({ ...ASSISTED_ANNOTATION_PROTOCOL, lexicalLayerEnabled: true });
    annotator.cases.set([
      {
        id: 'UNIFIED-TRIANGLE-001',
        text: 'BM',
        textNorm: 'BM',
        spans: [{
          spanId: 'span-unified-001',
          start: 0,
          end: 2,
          textoLiteral: 'BM',
          origin: 'candidate',
          confidence: 0.9,
          status: 'pendiente',
        }],
        concepts: [],
        lexicalMentions: [],
        comentarios: '',
      },
    ]);
    annotator.finishUnifiedMarking(0);
    fixture.detectChanges();

    const choiceText = fixture.nativeElement.querySelector('.unified-choice')?.textContent ?? '';
    expect(choiceText).toContain('Solo información clínica');
    expect(choiceText).toContain('Solo abreviatura contextual');
    expect(choiceText).toContain('Información clínica + abreviatura contextual');
    const choiceButtons = [...fixture.nativeElement.querySelectorAll('.unified-choice-actions button')] as HTMLButtonElement[];
    expect(choiceButtons[0].classList).toContain('mark-clinical');
    expect(choiceButtons[1].classList).toContain('mark-lexical');
    expect(choiceButtons[2].classList).toContain('mark-both');
    expect(choiceButtons[3].classList).toContain('mark-choice-skip');
    expect(fixture.nativeElement.querySelector('.unified-review-item .status-pending')).toBeTruthy();

    const key = 'range-0-2';
    annotator.classifyUnifiedItem(0, key, 'lexical');
    expect(annotator.unifiedReviewItems(annotator.cases()[0])[0].kind).toBe('lexical');

    annotator.classifyUnifiedItem(0, key, 'both');
    const combined = annotator.unifiedReviewItems(annotator.cases()[0])[0];
    expect(combined.kind).toBe('both');
    expect(annotator.unifiedDetailTargetFor(0)).toBe('both');
    expect(annotator.unifiedItemStatus(combined)).toContain('Clínica + abreviatura contextual');

    annotator.classifyUnifiedItem(0, key, 'clinical');
    expect(annotator.unifiedReviewItems(annotator.cases()[0])[0].kind).toBe('clinical');
    annotator.classifyUnifiedItem(0, key, 'lexical');
    expect(annotator.unifiedReviewItems(annotator.cases()[0])[0].kind).toBe('lexical');
  });

  it('should keep assisted suggestions hidden until the annotator confirms the first reading', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    annotator.cases.set([{
      id: 'BLIND-READING-001',
      text: 'Paciente con fiebre.',
      textNorm: 'Paciente con fiebre.',
      spans: [{
        spanId: 'blind-span-001',
        start: 13,
        end: 19,
        textoLiteral: 'fiebre',
        origin: 'candidate',
        confidence: 0.9,
        status: 'pendiente',
      }],
      concepts: [],
      comentarios: '',
      review: { status: 'pending' },
    }]);
    (annotator as any).readingComplete.set({ 0: false });

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.premarked-span')).toBeNull();
    expect(fixture.nativeElement.querySelector('.unified-reading-gate')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Terminé de leer');
    expect(annotator.readingCompleteFor(0)).toBe(false);

    annotator.startUnifiedMarking(0);
    fixture.detectChanges();
    expect(annotator.readingCompleteFor(0)).toBe(true);
    expect(fixture.nativeElement.querySelector('.unified-reading-gate')).toBeNull();
    expect(fixture.nativeElement.querySelector('.premarked-span')).toBeTruthy();
  });

  it('should ignore text selection during the blind reading pass', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    annotator.cases.set([{
      id: 'BLIND-READING-002',
      text: 'Dolor lumbar.',
      textNorm: 'Dolor lumbar.',
      spans: [],
      concepts: [],
      comentarios: '',
      review: { status: 'pending' },
    }]);
    (annotator as any).readingComplete.set({ 0: false });
    const root = document.createElement('div');
    root.textContent = 'Dolor lumbar.';
    document.body.appendChild(root);
    const node = root.firstChild!;
    const range = document.createRange();
    range.setStart(node, 0);
    range.setEnd(node, 4);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);

    annotator.captureTextSelection(0, root);

    expect(annotator.humanSpanDraft()).toBeNull();
    selection.removeAllRanges();
    root.remove();
  });

  it('should expose and explicitly restore a device-local recovery without overwriting a loaded file', async () => {
    const recovery = TestBed.inject(AnnotationRecoveryService);
    recovery.clear();
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    recovery.save(
      { cases: [{ id: 'RECOVERY-001', text: 'Texto de recuperación.' }] },
      { sourceFile: 'CAL3_A048.json', annotatorId: 'A048', batch: 'CAL3' },
      '2026-08-27T10:00:00.000Z',
    );
    (annotator as any).refreshRecoveryState();
    fixture.detectChanges();

    expect(annotator.recoveryOfferVisible()).toBe(true);
    expect(fixture.nativeElement.querySelector('.recovery-card')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Restaurar avance');

    annotator.restoreRecovery();
    fixture.detectChanges();
    expect(annotator.loaded()).toBe(true);
    expect(annotator.cases()[0].id).toBe('RECOVERY-001');
    expect(annotator.dirty()).toBe(true);
    expect(annotator.recoveryOfferVisible()).toBe(false);

    const previousCaseId = annotator.cases()[0].id;
    annotator.restoreRecovery();
    expect(annotator.cases()[0].id).toBe(previousCaseId);
    recovery.clear();
  });

  it('should expose clinical context attributes in the unified review', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    const concept = {
      ...newConcept(1),
      cat: 'Hallazgo clínico' as const,
      sctid: '386661006',
      term: 'Fiebre',
      textoLiteral: 'fiebre',
      pol: 'Negado' as const,
      cert: 'Sospecha' as const,
      temp: 'Histórico' as const,
      suj: 'Familiar' as const,
      spanId: 'span-context-001',
    };
    annotator.cases.set([
      {
        id: 'CONTEXT-UI-001',
        text: 'Sin fiebre familiar previa.',
        textNorm: 'Sin fiebre familiar previa.',
        spans: [{
          spanId: 'span-context-001',
          start: 4,
          end: 10,
          textoLiteral: 'fiebre',
          origin: 'candidate',
          confidence: 1,
          status: 'confirmado',
          review: { disposition: 'elegible', reason: 'Fixture de atributos clínicos.' },
        }],
        concepts: [concept],
        comentarios: '',
        review: { status: 'pending' },
      },
    ]);
    annotator.finishUnifiedMarking(0);
    fixture.detectChanges();

    const attributes = fixture.nativeElement.querySelector('.unified-clinical-attributes') as HTMLElement;
    expect(attributes).toBeTruthy();
    expect(attributes.textContent).toContain('PolaridadNegado');
    expect(attributes.textContent).toContain('CertezaSospecha');
    expect(attributes.textContent).toContain('TemporalidadHistórico');
    expect(attributes.textContent).toContain('SujetoFamiliar');
    expect(attributes.textContent).toContain('Editar atributos');
  });

  it('should expose category-specific attributes and require explicit context confirmation for new concepts', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    annotator.unifiedReviewPrototype.set(false);
    const concept = {
      ...newConcept(1),
      cat: 'Hallazgo clínico' as const,
      sctid: '386661006',
      term: 'Fiebre',
      textoLiteral: 'fiebre',
    };
    annotator.cases.set([{
      id: 'CONTEXT-EXTRA-001',
      text: 'Fiebre en evolución.',
      textNorm: 'Fiebre en evolución.',
      spans: [],
      concepts: [concept],
      comentarios: '',
      review: { status: 'pending' },
    }]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.f-section')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Estado clínico');
    expect(fixture.nativeElement.textContent).toContain('Severidad (si aparece)');
    expect(fixture.nativeElement.textContent).not.toContain('Estado del procedimiento');
    expect(conceptIsComplete(concept)).toBe(false);

    annotator.updateConceptField(0, 0, 'section', 'evolución');
    annotator.updateConceptField(0, 0, 'clinicalStatus', 'Recurrente');
    annotator.updateConceptField(0, 0, 'severity', 'Moderada');
    annotator.setClinicalContextReviewed(0, 0, true);
    expect(annotator.cases()[0].concepts[0]).toMatchObject({
      section: 'evolución',
      clinicalStatus: 'Recurrente',
      severity: 'Moderada',
      contextReviewed: true,
    });
    expect(conceptIsComplete(annotator.cases()[0].concepts[0])).toBe(true);

    annotator.onCategoryChange(0, 0, 'Procedimiento');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Estado del procedimiento');
    expect(fixture.nativeElement.textContent).not.toContain('Estado clínico');
    expect(annotator.cases()[0].concepts[0]).toMatchObject({
      cat: 'Procedimiento',
      clinicalStatus: null,
      severity: null,
      procedureStatus: null,
      sctid: '',
      term: '',
    });
  });

  it('should keep the free-form meaning input mounted while typing', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    annotator.unifiedReviewPrototype.set(false);
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
      marks: expect.arrayContaining([
        expect.objectContaining({
          key: 'range-0-11',
          spans: [expect.objectContaining({ spanId: 'sat' })],
        }),
        expect.objectContaining({
          key: 'range-4-6',
          spans: [expect.objectContaining({ spanId: 'o2' })],
        }),
      ]),
    });
  });

  it('should render clinical, lexical and combined marks with an accessible legend', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    const lexicalOnly = newHumanLexicalMention('lexical-only', 6, 8, 'FC');
    const lexicalBoth = newHumanLexicalMention('lexical-both', 9, 12, 'IAM');
    annotator.annotationProtocol.set({ ...ASSISTED_ANNOTATION_PROTOCOL, lexicalLayerEnabled: true });
    annotator.cases.set([
      {
        id: 'MARK-COLORS-001',
        text: 'dolor FC IAM',
        textNorm: 'dolor FC IAM',
        spans: [
          {
            spanId: 'clinical', start: 0, end: 5, textoLiteral: 'dolor',
            origin: 'human', confidence: 1, status: 'confirmado',
            review: { disposition: 'elegible', reason: 'Mención confirmada para la prueba visual.' },
          },
          {
            spanId: 'both', start: 9, end: 12, textoLiteral: 'IAM',
            origin: 'human', confidence: 1, status: 'confirmado',
            review: { disposition: 'elegible', reason: 'Mención confirmada para la prueba visual.' },
          },
        ],
        concepts: [],
        lexicalMentions: [lexicalOnly, lexicalBoth],
        lexicalReview: newLexicalReview(),
        comentarios: '',
      },
    ]);

    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('[data-mark-kind="clinical"]')).toHaveLength(1);
    expect(root.querySelectorAll('[data-mark-kind="lexical"]')).toHaveLength(1);
    expect(root.querySelectorAll('[data-mark-kind="both"]')).toHaveLength(1);
    expect(root.querySelector('.annotation-mark-legend')?.textContent).toContain('Información clínica');
    expect(root.querySelector('.annotation-mark-legend')?.textContent).toContain('Forma breve');
    expect(root.querySelector('.annotation-mark-legend')?.textContent).toContain('Ambas dimensiones');
  });

  it('should capture a selection that crosses a rendered overlapping mark without badge text', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    const text = 'antes FC después';
    annotator.cases.set([
      {
        id: 'CROSS-MARK-001',
        text,
        textNorm: text,
        spans: [
          {
            spanId: 'short', start: 6, end: 8, textoLiteral: 'FC',
            origin: 'human', confidence: 1, status: 'pendiente',
          },
          {
            spanId: 'long', start: 6, end: text.length, textoLiteral: 'FC después',
            origin: 'human', confidence: 1, status: 'pendiente',
          },
        ],
        concepts: [],
        comentarios: '',
      },
    ]);
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.case-text') as HTMLElement;
    const leadingText = root.querySelector('[data-source-start="0"]')?.firstChild;
    const trailingText = root.querySelector(
      '.marked-source-fragment[data-source-start="8"]'
    )?.firstChild;
    expect(leadingText).toBeTruthy();
    expect(trailingText).toBeTruthy();
    expect(root.textContent).not.toContain('2');
    const range = document.createRange();
    range.setStart(leadingText!, 0);
    range.setEnd(trailingText!, trailingText!.textContent!.length);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);

    annotator.captureTextSelection(0, root);

    expect(annotator.humanSpanDraft()).toEqual({
      caseIndex: 0,
      start: 0,
      end: text.length,
      textoLiteral: text,
    });
    selection.removeAllRanges();
  });

  it('should adjust a combined mark atomically and reopen its lexical decision', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    const mention = newHumanLexicalMention('lex-both', 0, 2, 'FC');
    mention.annotation.decisionStatus = 'resolved';
    mention.annotation.senseId = 'frecuencia cardíaca';
    annotator.annotationProtocol.set({ ...ASSISTED_ANNOTATION_PROTOCOL, lexicalLayerEnabled: true });
    annotator.cases.set([
      {
        id: 'ADJUST-BOTH-001',
        text: 'FC elevada',
        textNorm: 'FC elevada',
        spans: [
          {
            spanId: 'span-both', start: 0, end: 2, textoLiteral: 'FC',
            origin: 'candidate', confidence: 1, status: 'confirmado',
          },
        ],
        concepts: [
          {
            ...newConcept(1),
            cat: 'Hallazgo clínico',
            sctid: '364075005',
            term: 'Heart rate',
            textoLiteral: 'FC',
            spanId: 'span-both',
          },
        ],
        lexicalMentions: [mention],
        lexicalReview: {
          ...newLexicalReview(),
          status: 'completed',
          annotatorId: 'A001',
          completedAt: '2026-08-27T00:00:00.000Z',
        },
        comentarios: '',
      },
    ]);
    annotator.selectedTextMark.set({ caseIndex: 0, key: 'range-0-2' });
    annotator.selectedSpan.set({ caseIndex: 0, spanId: 'span-both' });
    annotator.humanSpanDraft.set({
      caseIndex: 0,
      start: 0,
      end: 10,
      textoLiteral: 'FC elevada',
    });

    annotator.adjustSelectedSpanBounds(0);

    const adjusted = annotator.cases()[0];
    expect(adjusted.spans[0]).toMatchObject({
      start: 0,
      end: 10,
      textoLiteral: 'FC elevada',
      status: 'pendiente',
      humanAudit: {
        originalStart: 0,
        originalEnd: 2,
        originalTextoLiteral: 'FC',
        boundaryAdjusted: true,
      },
    });
    expect(adjusted.concepts[0].textoLiteral).toBe('FC elevada');
    expect(adjusted.lexicalMentions?.[0]).toMatchObject({
      start: 0,
      end: 10,
      surface: 'FC elevada',
      normalizedKey: 'FC ELEVADA',
      candidateSenseIds: [],
      annotation: { decisionStatus: 'pending', senseId: null },
    });
    expect(adjusted.lexicalReview?.status).toBe('pending');
    expect(annotator.selectedTextMark()).toEqual({ caseIndex: 0, key: 'range-0-10' });
  });

  it('should reject an adjusted range that exactly duplicates another active mark', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    annotator.cases.set([
      {
        id: 'ADJUST-COLLISION-001',
        text: 'FC dolor',
        textNorm: 'FC dolor',
        spans: [
          {
            spanId: 'first', start: 0, end: 2, textoLiteral: 'FC',
            origin: 'human', confidence: 1, status: 'pendiente',
          },
          {
            spanId: 'second', start: 3, end: 8, textoLiteral: 'dolor',
            origin: 'human', confidence: 1, status: 'pendiente',
          },
        ],
        concepts: [],
        comentarios: '',
      },
    ]);
    annotator.selectedTextMark.set({ caseIndex: 0, key: 'range-0-2' });
    annotator.selectedSpan.set({ caseIndex: 0, spanId: 'first' });
    annotator.humanSpanDraft.set({ caseIndex: 0, start: 3, end: 8, textoLiteral: 'dolor' });

    annotator.adjustSelectedSpanBounds(0);

    expect(annotator.cases()[0].spans.map(({ start, end }) => [start, end])).toEqual([
      [0, 2],
      [3, 8],
    ]);
    expect(annotator.humanSpanDraft()).not.toBeNull();
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
        spans: [{
          spanId: 'review-span-1', start: 13, end: 19, textoLiteral: 'fiebre',
          origin: 'human', confidence: 1, status: 'confirmado',
          review: { disposition: 'elegible', reason: 'Prueba de cierre.' },
        }],
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
            spanId: 'review-span-1',
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
        spans: [{
          spanId: 'flow-span-1', start: 13, end: 19, textoLiteral: 'fiebre',
          origin: 'human', confidence: 1, status: 'confirmado',
          review: { disposition: 'elegible', reason: 'Prueba de cierre.' },
        }],
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
            spanId: 'flow-span-1',
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

  it('should restore the sanitized A034 shape and keep closure blockers explicit', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;

    const prepared = prepareAnnotationDocument(makeA034ContractFixture());
    (annotator as any).ingestDocument(prepared.document, 'A034-structural-fixture.json');

    expect(annotator.cases()).toHaveLength(10);
    expect(annotator.cases().reduce((total, item) => total + item.spans.length, 0)).toBe(35);
    expect(annotator.cases().reduce((total, item) => total + item.concepts.length, 0)).toBe(13);
    expect(annotator.cases().reduce((total, item) => total + (item.lexicalMentions?.length ?? 0), 0)).toBe(23);

    const first = annotator.cases()[0];
    const second = annotator.cases()[1];
    const third = annotator.cases()[2];
    expect(first.review?.status).toBe('pending');
    expect(annotator.casePendingSpanCount(first)).toBe(2);
    expect(first.concepts.every((concept) => concept.spanId && concept.term)).toBe(true);
    expect(second.review?.status).toBe('finalized');
    expect(third.review?.status).toBe('pending');
    expect(annotator.casePendingSpanCount(third)).toBe(1);
    expect(annotator.caseClosureBlockers(first)[0]).toContain('2 candidatos');

    for (const span of [...first.spans.filter((candidate) => candidate.status === 'pendiente')]) {
      annotator.selectedSpan.set({ caseIndex: 0, spanId: span.spanId });
      annotator.discardSelectedSpan(0);
    }
    expect(annotator.casePendingSpanCount(annotator.cases()[0])).toBe(0);
    annotator.finalizeCase(0, 'coded');
    expect(annotator.cases()[0].review?.status).toBe('finalized');
  });

  it('should preserve an incomplete concept block across download and reload', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    annotator.cases.set([
      {
        id: 'PERSIST-001',
        text: 'marca',
        textNorm: 'marca',
        spans: [],
        concepts: [{ ...newConcept(1), cat: 'Hallazgo clínico', textoLiteral: 'marca' }],
        comentarios: '',
        review: { status: 'pending' },
      },
    ]);

    let capturedBlob: Blob | undefined;
    const createObjectUrl = vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
      capturedBlob = blob as Blob;
      return 'blob:persistence-test';
    });
    const revokeObjectUrl = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    await annotator.download();
    const outputText = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsText(capturedBlob!);
    });
    const output = JSON.parse(outputText);
    expect(output.cases[0].concepts).toHaveLength(1);
    expect(output.cases[0].concepts[0]).toMatchObject({
      cat: 'Hallazgo clínico',
      textoLiteral: 'marca',
      sctid: '',
    });
    const reloaded = prepareAnnotationDocument(output);
    expect(reloaded.document).toBeTruthy();
    (annotator as any).ingestDocument(reloaded.document, 'PERSIST-001.json');
    expect(annotator.cases()[0].concepts[0]).toMatchObject({
      cat: 'Hallazgo clínico',
      textoLiteral: 'marca',
      sctid: '',
    });
    expect(annotator.cases()[0].review?.status).toBe('pending');

    click.mockRestore();
    revokeObjectUrl.mockRestore();
    createObjectUrl.mockRestore();
  });

  it('should block closure when a complete concept has no source span', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const annotator = fixture.debugElement.query(By.directive(AnnotatorComponent))
      .componentInstance as AnnotatorComponent;
    const orphan = {
      ...newConcept(1),
      cat: 'Hallazgo clínico' as const,
      sctid: '386661006',
      term: 'Fiebre',
      textoLiteral: 'fiebre',
      contextReviewed: true,
    };
    const caseItem = {
      id: 'ORPHAN-001',
      text: 'Paciente con fiebre.',
      textNorm: 'Paciente con fiebre.',
      spans: [],
      concepts: [orphan],
      comentarios: '',
      review: { status: 'pending' as const },
    };
    expect(annotator.caseOrphanConceptCount(caseItem)).toBe(1);
    expect(annotator.caseCanFinalize(caseItem, 'coded')).toBe(false);
    expect(annotator.caseClosureBlockers(caseItem).join(' ')).toContain('sin vínculo');
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
    annotator.unifiedReviewPrototype.set(false);
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
    expect(text).not.toContain('Revisión de información clínica');
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
    expect(text).toContain('Pendiente bloquea el cierre');
    expect(compiled.querySelector('.lexical-decision-guide')).toBeNull();
    expect(annotator.lexicalDecisions.map((option) => option.label)).toEqual(
      expect.arrayContaining([
        'Sentido resuelto',
        'Ambigua aun con contexto',
        'No puedo determinarla',
        'Proponer sentido nuevo',
        'Forma errónea o corrupta',
      ])
    );
    expect(text).toContain('Sin clasificar deja el papel vacío');
    expect(text).toContain('las mayúsculas no prueban que sea una sigla');
    expect(text).not.toContain('sense:internal-only');
    expect(text).not.toContain('posición 0–2');
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
    expect(compiled.querySelector('.case-pager-copy small')?.textContent).toContain('Avance cargado');
    expect(compiled.textContent).toContain('Avance cargado');
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
    annotator.unifiedReviewPrototype.set(false);
    const coded = newConcept(1);
    coded.cat = 'Hallazgo clínico';
    coded.sctid = '386661006';
    coded.term = 'Adecuadamente hidratado';
    coded.textoLiteral = 'adecuadamente hidratado';
    coded.contextReviewed = true;
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
    expect(conceptCards[0].querySelector('.status-resolved')).toBeTruthy();
    expect(conceptCards[1].textContent).toContain('alta médica');
    expect(conceptCards[1].textContent).toContain('Mención clínica · Pendiente de codificación');
    expect(conceptCards[1].querySelector('.status-pending')).toBeTruthy();
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

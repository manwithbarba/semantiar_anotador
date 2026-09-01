import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

import {
  AutocompleteBindingComponent,
  AutocompleteTelemetryEvent,
} from '../bindings/autocomplete-binding/autocomplete-binding.component';
import {
  TerminologyConceptHierarchy,
  TerminologyHierarchyConcept,
  TerminologyService,
} from '../services/terminology.service';
import {
  AnnotationDocument,
  ASSISTED_ANNOTATION_PROTOCOL,
  CORE_BLIND_PROTOCOL,
  AnnotationMeta,
  AnnotationProtocol,
  AnnotationOutput,
  CaseAnnotation,
  CaseReviewOutcome,
  CaseTelemetry,
  CaseTelemetryBase,
  TelemetryClickTarget,
  TelemetryDeletionType,
  Category,
  CLINICAL_SECTIONS,
  CLINICAL_STATUSES,
  actionablePendingSpans,
  conceptHasContent,
  conceptIsComplete,
  lexicalMentionComplete,
  LexicalAnnotation,
  LexicalDecisionStatus,
  LEXICAL_DECISIONS,
  LEXICAL_EVIDENCE_CODES,
  LEXICAL_FORM_TYPES,
  LEXICAL_FUNCTIONS,
  LEXICAL_SECTIONS,
  LEXICAL_UNCLASSIFIED_FUNCTION,
  MEDICAL_SPECIALTIES,
  LexicalInventory,
  LexicalInventoryEntry,
  LexicalMention,
  LexicalSenseOption,
  newHumanLexicalMention,
  newLexicalAnnotation,
  newLexicalReview,
  normalizeEvidenceCodes,
  normalizeLexicalAnnotation,
  normalizeLexicalMentions,
  normalizeLexicalReview,
  buildTextSegments,
  normalizePremarkedSpans,
  reconcileConceptSpanLinks,
  PremarkedSpan,
  TextMark,
  TextMarkKind,
  TextSegment,
  CATEGORIES,
  CERTAINTIES,
  ConceptAnnotation,
  DEFAULT_EDITION_URI,
  DEFAULT_TERMINOLOGY_SERVER,
  createAnnotationTelemetry,
  eclForCategory,
  isValidTextSpan,
  newConcept,
  POLARITIES,
  PROCEDURE_STATUSES,
  SEMANTIAR_SCHEMA_VERSION,
  SEMANTIAR_TEXT_PROFILE,
  SessionEntry,
  SUBJECTS,
  SEVERITIES,
  TELEMETRY_APP_BUILD,
  TELEMETRY_IDLE_THRESHOLD_MS,
  TEMPORALITIES,
} from '../models/annotation.model';
import {
  AnnotationInteropError,
  prepareAnnotationDocument,
} from '../models/annotation-interop';
import {
  AnnotationRecoveryEnvelope,
  AnnotationRecoveryService,
} from '../services/annotation-recovery.service';

type UnifiedReviewItemKind = 'pending' | 'clinical' | 'lexical' | 'both' | 'skipped';
type UnifiedReviewChoice = 'clinical' | 'lexical' | 'both' | 'skip';
type UnifiedDetailTarget = 'clinical' | 'lexical' | 'both';
type CaseWorkflowStep = 'cell' | 'marking' | 'decisions' | 'finalize';
type HierarchyLoadStatus = 'idle' | 'loading' | 'ready' | 'error';

interface ConceptHierarchyViewState extends TerminologyConceptHierarchy {
  status: HierarchyLoadStatus;
}

/**
 * Presentation-only grouping for the local unified-review prototype.
 * The persisted model deliberately keeps spans, clinical concepts and lexical
 * mentions independent for traceability; this object only lets the interface
 * present the three records as one decision when they share a source range.
 */
interface UnifiedReviewItem {
  key: string;
  start: number;
  end: number;
  surface: string;
  span: PremarkedSpan | null;
  lexicalMention: LexicalMention | null;
  concept: ConceptAnnotation | null;
  kind: UnifiedReviewItemKind;
}

@Component({
  selector: 'app-annotator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSnackBarModule,
    MatChipsModule,
    MatBadgeModule,
    AutocompleteBindingComponent,
  ],
  templateUrl: './annotator.component.html',
  styleUrl: './annotator.component.css',
})
export class AnnotatorComponent implements OnInit, OnDestroy {
  private terminologyService = inject(TerminologyService);
  private recoveryService = inject(AnnotationRecoveryService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private timingCaseIndex: number | null = null;
  private lastActivityMarkMs = 0;
  private timingActive = false;
  private textSelectionTimer: number | undefined;
  private pendingActiveMs = new Map<number, number>();
  private terminologyDetectionGeneration = 0;
  private recoverySaveTimer: number | undefined;
  /** The offer is only shown before the first explicit file/recovery load. */
  private recoveryOfferSuppressed = false;

  @ViewChild('confirmClear') confirmClearTpl!: TemplateRef<unknown>;
  @ViewChild('settingsDialog') settingsTpl!: TemplateRef<unknown>;
  @ViewChild('statsDialog') statsTpl!: TemplateRef<unknown>;
  @ViewChild('manualDialog') manualTpl!: TemplateRef<unknown>;

  readonly categories = CATEGORIES;
  readonly polarities = POLARITIES;
  readonly certainties = CERTAINTIES;
  readonly temporalities = TEMPORALITIES;
  readonly subjects = SUBJECTS;
  readonly clinicalSections = CLINICAL_SECTIONS;
  readonly clinicalStatuses = CLINICAL_STATUSES;
  readonly procedureStatuses = PROCEDURE_STATUSES;
  readonly severities = SEVERITIES;
  readonly lexicalDecisions = LEXICAL_DECISIONS;
  readonly lexicalFormTypes = LEXICAL_FORM_TYPES;
  readonly lexicalFunctions = LEXICAL_FUNCTIONS;
  readonly lexicalSections = LEXICAL_SECTIONS;
  readonly medicalSpecialties = MEDICAL_SPECIALTIES;
  readonly lexicalEvidenceCodes = LEXICAL_EVIDENCE_CODES;
  readonly lexicalUnclassifiedFunction = LEXICAL_UNCLASSIFIED_FUNCTION;
  /** The browser build is the normative Calibración 3 path. Android remains
   * available only as a legacy tester so old sessions can be recovered. */
  readonly nativePlatform = Capacitor.getPlatform();
  readonly isNativeApp = Capacitor.isNativePlatform();
  readonly isAndroidApp = this.nativePlatform === 'android';
  readonly currentPlatform = this.nativePlatform === 'android' ? 'android' as const : 'web' as const;

  // Document metadata
  project = signal<string>('');
  batch = signal<string>('');
  annotatorId = signal<string>('');
  sourceFile = signal<string>('');
  sourceSchemaVersion = signal<string | undefined>(undefined);
  loadedFileName = signal<string>('');
  premarking = signal<Record<string, unknown> | undefined>(undefined);
  trace = signal<Record<string, unknown> | undefined>(undefined);
  annotationProtocol = signal<AnnotationProtocol>(ASSISTED_ANNOTATION_PROTOCOL);
  lexicalInventory = signal<LexicalInventory | undefined>(undefined);

  // Terminology configuration (editable)
  terminologyServer = signal<string>(DEFAULT_TERMINOLOGY_SERVER);
  editionUri = signal<string>(DEFAULT_EDITION_URI);
  snomedVersion = signal<string | null>(null);
  displayLanguage = signal<string>('es');
  editionLabel = signal<string>('Detectando edición…');

  // Working set
  cases = signal<CaseAnnotation[]>([]);
  activeCaseIndex = signal<number>(0);
  caseSearch = signal<string>('');
  selectedSpan = signal<{ caseIndex: number; spanId: string } | null>(null);
  selectedTextMark = signal<{ caseIndex: number; key: string } | null>(null);
  humanSpanDraft = signal<{ caseIndex: number; start: number; end: number; textoLiteral: string } | null>(
    null
  );
  /** Draft text used by the one-tap lexical mention flow on mobile. */
  lexicalQuickEntry = signal<Record<number, string>>({});
  /** Draft text used to add an exact clinical mention without touch-dragging. */
  mentionQuickEntry = signal<Record<number, string>>({});
  /** Native phone controls avoid CDK overlay positioning outside the viewport. */
  compactMobile = signal<boolean>(false);
  /** Local-only UI experiment: classify a mark after selecting it, not before. */
  unifiedReviewPrototype = signal<boolean>(true);
  /** Presentation-only pointer for the sequential review queue. */
  private unifiedActiveItemKeys = signal<Record<number, string>>({});
  /** Two-phase flow: mark the note independently before exposing candidates. */
  private unifiedMarkingPhase = signal<Record<number, boolean>>({});
  /**
   * Explicit reading gate for the calibration protocol. Premarked candidates
   * stay out of the text until the annotator confirms that the note was read
   * in full. This keeps the first pass blind to the assisted suggestions while
   * preserving the underlying spans for the later decision queue.
   */
  private readingComplete = signal<Record<number, boolean>>({});
  /** Compact three-step navigation for the active cell. */
  private caseWorkflowSteps = signal<Record<number, CaseWorkflowStep>>({});
  /** The active branch is local UI state; it is not persisted in the annotation JSON. */
  private unifiedDetailContext = signal<{
    caseIdx: number;
    key: string;
    target: UnifiedDetailTarget;
  } | null>(null);
  /**
   * Read-only terminology context keyed by case/concept position. It is kept
   * out of the annotation model so hierarchy refreshes never alter exports.
   */
  private conceptHierarchy = signal<Record<string, ConceptHierarchyViewState>>({});

  /** Session metadata (upload/download audit trail). */
  sessionMeta = signal<AnnotationMeta | null>(null);

  /** True when there are annotation changes not yet downloaded. */
  dirty = signal<boolean>(false);
  /** Last device-local recovery snapshot offered to the annotator. */
  recoverySnapshot = signal<AnnotationRecoveryEnvelope | null>(null);
  recoveryStorageAvailable = signal<boolean>(false);
  recoverySavedAt = signal<string | null>(null);

  loaded = computed(() => this.cases().length > 0);
  coreBlindMode = computed(() => this.annotationProtocol().mode === 'core-blind');
  lexicalLayerEnabled = computed(() => this.annotationProtocol().lexicalLayerEnabled === true);
  filteredCaseEntries = computed(() => {
    const query = this.caseSearch().trim().toLocaleLowerCase('es-AR');
    return this.cases()
      .map((caseItem, index) => ({ caseItem, index }))
      .filter(({ caseItem }) => {
        if (!query) return true;
        return (
          caseItem.id.toLocaleLowerCase('es-AR').includes(query) ||
          caseItem.textNorm.toLocaleLowerCase('es-AR').includes(query)
        );
      });
  });
  activeCase = computed(() => this.cases()[this.activeCaseIndex()] ?? null);
  activeCasePosition = computed(() =>
    this.filteredCaseEntries().findIndex((entry) => entry.index === this.activeCaseIndex())
  );
  annotatedCount = computed(
    () => this.cases().filter((c) => c.concepts.some((cc) => !!cc.sctid)).length
  );
  reviewedCount = computed(
    () => this.cases().filter((c) => c.review?.status === 'finalized').length
  );
  pendingCount = computed(() => this.cases().length - this.reviewedCount());
  editingCount = computed(
    () => this.cases().filter((caseItem) => !this.isCaseFinalized(caseItem) && this.caseHasStarted(caseItem)).length
  );
  progressPct = computed(() => {
    const total = this.cases().length;
    return total ? Math.round((this.reviewedCount() / total) * 100) : 0;
  });
  complete = computed(() => this.loaded() && this.reviewedCount() === this.cases().length);
  jsonStatusLabel = computed(() => (this.dirty() ? 'Cambios sin descargar' : 'JSON cargado'));
  pendingButtonLabel = computed(() => `Ir al pendiente · ${this.pendingCount()}`);
  downloadButtonLabel = computed(() =>
    this.complete()
      ? 'Descargar JSON final'
      : `Descargar JSON de avance · ${this.reviewedCount()}/${this.cases().length} cerradas`
  );

  /** Index of the first case that has not been explicitly finalized. */
  firstPendingIdx = computed(() =>
    this.cases().findIndex((c) => c.review?.status !== 'finalized')
  );

  /** Session summary stats for display in the dialog. */
  totalDownloads = computed(() => this.sessionMeta()?.totalDownloads ?? 0);
  firstLoadedAt = computed(() => this.sessionMeta()?.firstLoadedAt ?? '—');
  completedAt = computed(() => this.sessionMeta()?.completedAt ?? null);
  totalActiveMs = computed(() => this.sessionMeta()?.telemetry?.totalActiveMs ?? 0);
  totalSearchRequests = computed(() =>
    this.sessionMeta()?.telemetry?.cases.reduce((total, item) => total + item.search.requests, 0) ?? 0
  );
  totalSearchEpisodes = computed(() =>
    this.sessionMeta()?.telemetry?.cases.reduce((total, item) => total + item.search.episodes, 0) ?? 0
  );
  totalZeroResultSearches = computed(() =>
    this.sessionMeta()?.telemetry?.cases.reduce((total, item) => total + item.search.zeroResults, 0) ?? 0
  );
  totalSearchErrors = computed(() =>
    this.sessionMeta()?.telemetry?.cases.reduce((total, item) => total + item.search.errors, 0) ?? 0
  );
  eligibleSpanCount = computed(() =>
    this.cases().reduce(
      (total, caseItem) =>
        total + caseItem.spans.filter((span) => span.review?.disposition !== 'excluido').length,
      0
    )
  );
  excludedSpanCount = computed(() =>
    this.cases().reduce(
      (total, caseItem) =>
        total + caseItem.spans.filter((span) => span.review?.disposition === 'excluido').length,
      0
    )
  );

  ngOnInit(): void {
    this.refreshMobileLayout();
    this.refreshRecoveryState();
    this.detectEdition();
  }

  ngOnDestroy(): void {
    this.terminologyDetectionGeneration += 1;
    if (this.textSelectionTimer !== undefined) window.clearTimeout(this.textSelectionTimer);
    if (this.recoverySaveTimer !== undefined) window.clearTimeout(this.recoverySaveTimer);
    this.flushActiveTime();
    this.flushPendingActiveTime();
    this.flushRecoverySave();
  }

  /** Update the control pattern when the browser crosses the mobile breakpoint. */
  refreshMobileLayout(): void {
    this.compactMobile.set(window.innerWidth <= 720);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.refreshMobileLayout();
  }

  @HostListener('document:pointerdown', ['$event'])
  @HostListener('document:keydown', ['$event'])
  @HostListener('window:scroll', ['$event'])
  onUserActivity(event: Event): void {
    if (!this.loaded() || document.hidden) return;
    const caseIndex = this.caseIndexFromEvent(event);
    if (caseIndex !== null) this.activateCase(caseIndex);

    const now = performance.now();
    if (this.timingActive) {
      this.accrueActiveTime(now);
    } else {
      this.timingActive = true;
    }
    this.lastActivityMarkMs = now;
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    if (document.hidden) {
      this.pauseActivityTracking();
      this.flushRecoverySave();
    } else {
      this.resumeActivityTracking();
    }
  }

  /** Synchronous last chance snapshot before a tab/window is discarded. */
  @HostListener('window:beforeunload')
  onBeforeUnload(): void {
    this.flushRecoverySave();
  }

  @HostListener('window:blur')
  onWindowBlur(): void {
    this.pauseActivityTracking();
  }

  @HostListener('window:focus')
  onWindowFocus(): void {
    this.resumeActivityTracking();
  }

  private caseIndexFromEvent(event: Event): number | null {
    const target = event.target;
    if (!(target instanceof Element)) return null;
    const card = target.closest<HTMLElement>('[data-case-index]');
    if (!card) return null;
    const index = Number(card.dataset['caseIndex']);
    return Number.isInteger(index) ? index : null;
  }

  private accrueActiveTime(now = performance.now()): void {
    if (!this.timingActive || this.timingCaseIndex === null || !this.loaded()) return;
    const threshold =
      this.sessionMeta()?.telemetry?.idleThresholdMs ?? TELEMETRY_IDLE_THRESHOLD_MS;
    const elapsed = Math.min(Math.max(0, now - this.lastActivityMarkMs), threshold);
    if (elapsed > 0) {
      this.pendingActiveMs.set(
        this.timingCaseIndex,
        (this.pendingActiveMs.get(this.timingCaseIndex) ?? 0) + elapsed
      );
    }
    this.lastActivityMarkMs = now;
  }

  private flushActiveTime(): void {
    this.accrueActiveTime(performance.now());
  }

  private flushPendingActiveTime(): void {
    if (!this.pendingActiveMs.size) return;
    const pending = new Map(this.pendingActiveMs);
    this.pendingActiveMs.clear();
    this.sessionMeta.update((meta) => {
      if (!meta) return meta;
      const telemetry = createAnnotationTelemetry(
        this.cases().map((item) => item.id),
        meta.telemetry
      );
      const cases = telemetry.cases.map((item, index) => {
        const elapsed = pending.get(index) ?? 0;
        return {
          ...item,
          activeMs: Math.round(item.activeMs + elapsed),
          byPlatform: {
            ...item.byPlatform,
            [this.currentPlatform]: {
              ...item.byPlatform[this.currentPlatform],
              activeMs: Math.round(item.byPlatform[this.currentPlatform].activeMs + elapsed),
            },
          },
        };
      });
      return {
        ...meta,
        telemetry: {
          ...telemetry,
          cases,
          totalActiveMs: cases.reduce((total, item) => total + item.activeMs, 0),
        },
      };
    });
  }

  private pauseActivityTracking(): void {
    if (!this.timingActive) return;
    this.flushActiveTime();
    this.flushPendingActiveTime();
    this.timingActive = false;
  }

  private resumeActivityTracking(): void {
    if (!this.loaded() || document.hidden) return;
    this.lastActivityMarkMs = performance.now();
    this.timingActive = true;
  }

  private updateCaseTelemetry(
    caseIdx: number,
    mutate: (item: CaseTelemetryBase) => void
  ): void {
    this.sessionMeta.update((meta) => {
      if (!meta) return meta;
      const telemetry = createAnnotationTelemetry(
        this.cases().map((item) => item.id),
        meta.telemetry
      );
      const cases = telemetry.cases.map((item, index) => {
        if (index !== caseIdx) return item;
        const copy: CaseTelemetry = {
          ...item,
          search: {
            ...item.search,
            selectedRanks: [...item.search.selectedRanks],
            queries: item.search.queries.map((query) => ({ ...query })),
          },
          byPlatform: {
            web: this.cloneCaseTelemetryBase(item.byPlatform.web),
            android: this.cloneCaseTelemetryBase(item.byPlatform.android),
          },
        };
        const platformCopy = copy.byPlatform[this.currentPlatform];
        mutate(copy);
        mutate(platformCopy);
        return copy;
      });
      return {
        ...meta,
        telemetry: {
          ...telemetry,
          cases,
          totalActiveMs: cases.reduce((total, item) => total + item.activeMs, 0),
        },
      };
    });
  }

  private recordClick(
    caseIdx: number,
    target: TelemetryClickTarget = 'general-ui'
  ): void {
    if (caseIdx < 0 || caseIdx >= this.cases().length) return;
    this.updateCaseTelemetry(caseIdx, (item) => {
      item.clicksTotal = (item.clicksTotal ?? 0) + 1;
      const currentMap = item.clicksByTarget ?? {
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
      };
      item.clicksByTarget = {
        ...currentMap,
        [target]: (currentMap[target] ?? 0) + 1,
      };
    });
  }

  private recordDeletion(
    caseIdx: number,
    type: TelemetryDeletionType
  ): void {
    if (caseIdx < 0 || caseIdx >= this.cases().length) return;
    this.updateCaseTelemetry(caseIdx, (item) => {
      item.deletionsTotal = (item.deletionsTotal ?? 0) + 1;
      const currentMap = item.deletionsByType ?? {
        concept: 0,
        span: 0,
        'lexical-mention': 0,
        comment: 0,
      };
      item.deletionsByType = {
        ...currentMap,
        [type]: (currentMap[type] ?? 0) + 1,
      };
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.loaded() || document.hidden) return;
    const targetElement = event.target;
    if (!(targetElement instanceof Element)) return;

    const caseIdx = this.caseIndexFromEvent(event) ?? this.activeCaseIndex();
    if (caseIdx < 0 || caseIdx >= this.cases().length) return;

    let targetType: TelemetryClickTarget = 'general-ui';
    if (targetElement.closest('.span-accept, [data-telemetry="span-accept"], button.confirm-span-btn')) {
      targetType = 'span-accept';
    } else if (targetElement.closest('.span-discard, [data-telemetry="span-discard"], button.discard-span-btn')) {
      targetType = 'span-discard';
    } else if (targetElement.closest('.concept-add, [data-telemetry="concept-add"], button.add-concept-btn')) {
      targetType = 'concept-add';
    } else if (targetElement.closest('.concept-remove, [data-telemetry="concept-remove"], button.remove-concept-btn')) {
      targetType = 'concept-remove';
    } else if (targetElement.closest('.concept-edit, [data-telemetry="concept-edit"]')) {
      targetType = 'concept-edit';
    } else if (targetElement.closest('.category-select, [data-telemetry="category-select"], mat-select')) {
      targetType = 'category-select';
    } else if (targetElement.closest('.context-toggle, [data-telemetry="context-toggle"]')) {
      targetType = 'context-toggle';
    } else if (targetElement.closest('.autocomplete-binding, app-autocomplete-binding')) {
      targetType = 'search-interaction';
    } else if (targetElement.closest('.lexical-review, [data-telemetry="lexical-review"]')) {
      targetType = 'lexical-review';
    }

    this.recordClick(caseIdx, targetType);
  }

  activateCase(caseIdx: number): void {
    if (caseIdx < 0 || caseIdx >= this.cases().length) return;
    if (this.timingCaseIndex === caseIdx) return;

    this.flushActiveTime();
    this.flushPendingActiveTime();
    this.activeCaseIndex.set(caseIdx);
    this.timingCaseIndex = caseIdx;
    this.lastActivityMarkMs = performance.now();
    this.timingActive = !document.hidden;

    const now = new Date().toISOString();
    this.updateCaseTelemetry(caseIdx, (item) => {
      item.visits += 1;
      item.firstOpenedAt ??= now;
      item.lastOpenedAt = now;
    });
  }

  formatDuration(milliseconds: number): string {
    const totalSeconds = Math.max(0, Math.round(milliseconds / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return hours
      ? `${hours} h ${String(minutes).padStart(2, '0')} min`
      : `${minutes} min ${String(seconds).padStart(2, '0')} s`;
  }

  /** Verify and select a known edition; never hide an unavailable terminology server. */
  detectEdition(): void {
    const generation = ++this.terminologyDetectionGeneration;
    const requestedServer = this.terminologyServer();
    this.editionLabel.set('Detectando edición…');
    this.terminologyService.detectEdition(requestedServer).subscribe((info) => {
      if (
        generation !== this.terminologyDetectionGeneration ||
        requestedServer !== this.terminologyServer()
      ) {
        return;
      }
      if (!info.available) {
        this.snomedVersion.set(null);
        this.editionLabel.set(
          info.error === 'server-unavailable'
            ? 'Servidor terminológico no disponible'
            : 'Edición terminológica no verificada'
        );
        this.conceptHierarchy.set({});
        this.snackBar.open(
          info.error === 'server-unavailable'
            ? 'No se pudo verificar el servidor terminológico. Conservá el avance y reintentá antes de codificar.'
            : 'No se encontró una edición SNOMED CT verificable. No se habilita una sustitución automática.',
          'OK',
          { duration: 6500 }
        );
        return;
      }
      this.editionUri.set(info.editionUri);
      this.snomedVersion.set(info.version);
      this.displayLanguage.set(info.displayLanguage);
      this.terminologyService.setTerminologyServer(requestedServer);
      this.terminologyService.setEditionUri(info.editionUri);
      this.terminologyService.setDisplayLanguage(info.displayLanguage);
      this.editionLabel.set(info.label);
      this.conceptHierarchy.set({});
      // A verified International result is allowed but remains visibly marked
      // as a fallback for the calibration record.
      if (!info.isArgentina) {
        this.snackBar.open(
          'Edición Argentina no disponible — usando Internacional (inglés).',
          'OK',
          { duration: 4000 }
        );
      }
    });
  }

  openSettings(): void {
    this.dialog.open(this.settingsTpl, { width: '540px' });
  }

  openStats(): void {
    this.flushActiveTime();
    this.flushPendingActiveTime();
    this.dialog.open(this.statsTpl, { width: '560px' });
  }

  openManual(): void {
    this.dialog.open(this.manualTpl, {
      width: 'min(680px, calc(100vw - 24px))',
      maxHeight: '88vh',
      panelClass: 'manual-dialog-panel',
    });
  }

  private cloneCaseTelemetryBase(item: CaseTelemetryBase): CaseTelemetryBase {
    return {
      ...item,
      clicksByTarget: { ...item.clicksByTarget },
      deletionsByType: { ...item.deletionsByType },
      search: {
        ...item.search,
        selectedRanks: [...item.search.selectedRanks],
        queries: item.search.queries.map((query) => ({ ...query })),
      },
    };
  }

  async downloadManual(): Promise<void> {
    const path = 'manuales/Manual_de_uso_SemantIAr_App_CAL3.pdf';
    const filename = 'Manual_de_uso_SemantIAr_App_CAL3.pdf';

    try {
      if (Capacitor.isNativePlatform()) {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Manual unavailable: ${response.status}`);
        const bytes = new Uint8Array(await response.arrayBuffer());
        const chunkSize = 0x8000;
        let binary = '';
        for (let offset = 0; offset < bytes.length; offset += chunkSize) {
          binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
        }
        const file = await Filesystem.writeFile({
          path: filename,
          data: btoa(binary),
          directory: Directory.Cache,
        });
        await Share.share({
          title: 'Manual de SemantIAr Anotador',
          text: 'Manual de uso para anotadores clínicos',
          files: [file.uri],
          dialogTitle: 'Guardar o compartir manual',
        });
      } else {
        const a = document.createElement('a');
        a.href = path;
        a.download = filename;
        a.click();
      }
    } catch {
      this.snackBar.open(
        'No se pudo abrir el manual. Verificá el espacio disponible y volvé a intentarlo.',
        'OK',
        { duration: 5000 },
      );
    }
  }

  /** Scroll smoothly to the first unannotated case card. */
  scrollToFirstPending(): void {
    const idx = this.firstPendingIdx();
    if (idx < 0) return;
    this.selectCase(idx);
    this.scrollActiveCaseIntoView(idx);
  }

  // ---- Device-local recovery ----

  private refreshRecoveryState(): void {
    this.recoveryStorageAvailable.set(this.recoveryService.available());
    this.recoverySnapshot.set(this.recoveryService.load());
    this.recoverySavedAt.set(this.recoverySnapshot()?.savedAt ?? null);
  }

  recoveryOfferVisible(): boolean {
    return !this.loaded() && !this.recoveryOfferSuppressed && !!this.recoverySnapshot();
  }

  recoveryDateLabel(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('es-AR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(date);
  }

  /** Restore only from the explicit home-screen action, never automatically. */
  restoreRecovery(): void {
    if (this.loaded()) {
      this.snackBar.open('Primero terminá o limpiá la nota que ya está cargada.', 'OK', {
        duration: 4000,
      });
      return;
    }
    const recovery = this.recoverySnapshot();
    if (!recovery) return;
    try {
      const prepared = prepareAnnotationDocument(recovery.document);
      this.ingestDocument(
        prepared.document,
        recovery.sourceFile || 'recuperacion-local.json',
        prepared.warnings,
      );
      // A restored snapshot represents work not yet exported in this tab.
      this.dirty.set(true);
      this.scheduleRecoverySave();
      this.snackBar.open('Recuperación local restaurada. Verificá la nota activa y guardá un JSON.', 'OK', {
        duration: 5500,
      });
    } catch (error) {
      const message =
        error instanceof AnnotationInteropError
          ? error.message
          : 'La recuperación local no es válida y no se pudo restaurar.';
      this.snackBar.open(message, 'OK', { duration: 6500 });
    }
  }

  clearRecovery(): void {
    this.recoveryService.clear();
    this.recoverySnapshot.set(null);
    this.recoverySavedAt.set(null);
    this.recoveryStorageAvailable.set(this.recoveryService.available());
    this.snackBar.open('Recuperación local borrada de este dispositivo.', 'OK', { duration: 3000 });
  }

  private scheduleRecoverySave(): void {
    if (!this.loaded() || !this.dirty()) return;
    if (this.recoverySaveTimer !== undefined) window.clearTimeout(this.recoverySaveTimer);
    this.recoverySaveTimer = window.setTimeout(() => {
      this.recoverySaveTimer = undefined;
      this.flushRecoverySave();
    }, 700);
  }

  private flushRecoverySave(): void {
    if (this.recoverySaveTimer !== undefined) {
      window.clearTimeout(this.recoverySaveTimer);
      this.recoverySaveTimer = undefined;
    }
    if (!this.loaded() || !this.dirty()) return;
    const document = this.buildPersistenceDocument();
    if (!document) return;
    const saved = this.recoveryService.save(document, {
      sourceFile: this.loadedFileName() || this.sourceFile(),
      annotatorId: this.annotatorId(),
      batch: this.batch(),
    });
    this.recoveryStorageAvailable.set(saved || this.recoveryService.available());
    if (saved) {
      const snapshot = this.recoveryService.load();
      this.recoverySnapshot.set(snapshot);
      this.recoverySavedAt.set(snapshot?.savedAt ?? null);
    }
  }

  // ---- Loading ----

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = JSON.parse(reader.result as string) as unknown;
        const prepared = prepareAnnotationDocument(raw);
        this.ingestDocument(prepared.document, file.name, prepared.warnings);
      } catch (error) {
        const message =
          error instanceof AnnotationInteropError
            ? error.message
            : 'El archivo no es un JSON válido.';
        this.snackBar.open(message, 'OK', { duration: 7000 });
      }
    };
    reader.readAsText(file);
    input.value = ''; // allow re-selecting the same file
  }

  private ingestDocument(
    doc: AnnotationDocument,
    fileName: string,
    migrationWarnings: string[] = []
  ): void {
    if (!doc || !Array.isArray(doc.cases) || doc.cases.length === 0) {
      this.snackBar.open('El JSON no contiene "cases".', 'OK', { duration: 4000 });
      return;
    }
    if (this.isNativeApp && doc._annotationProtocol?.mode === 'core-blind') {
      this.snackBar.open(
        'Core Blind es de uso exclusivo del investigador principal en la página web. Abrí este lote desde la versión web.',
        'OK',
        { duration: 8000 }
      );
      return;
    }
    // A manually selected JSON always wins over a stale local recovery. Keep
    // the envelope on disk until the user explicitly clears it, but suppress
    // its home-screen offer so it can never overwrite this loaded file.
    this.recoveryOfferSuppressed = true;
    this.recoverySnapshot.set(null);
    this.pauseActivityTracking();
    this.timingCaseIndex = null;
    this.pendingActiveMs.clear();
    this.project.set(doc.project ?? '');
    this.batch.set(doc.batch ?? '');
    this.annotatorId.set(doc.annotatorId ?? '');
    this.sourceFile.set(doc.sourceFile ?? fileName);
    this.sourceSchemaVersion.set(doc.sourceSchemaVersion);
    this.loadedFileName.set(fileName);

    if (doc.terminology) {
      this.terminologyDetectionGeneration += 1;
      this.terminologyServer.set(doc.terminology.server);
      this.editionUri.set(doc.terminology.editionUri);
      this.snomedVersion.set(doc.terminology.version);
      this.displayLanguage.set(doc.terminology.displayLanguage);
      this.terminologyService.setTerminologyServer(doc.terminology.server);
      this.terminologyService.setEditionUri(doc.terminology.editionUri);
      this.terminologyService.setDisplayLanguage(doc.terminology.displayLanguage);
      this.editionLabel.set(
        doc.terminology.version ? 'Versión restaurada del JSON' : 'Edición restaurada'
      );
    }

    // New assisted input files are allowed to omit the protocol and contain
    // only cases (optionally with pending spans). In that shape the default
    // protocol must keep all four Step 3 decisions available. Preserve the
    // clinical-only fallback solely for old exports that already contain
    // concept blocks and no lexical records.
    const hasExplicitProtocol = !!doc._annotationProtocol;
    const hasLexicalRecords = doc.cases.some(
      (item) =>
        (item.lexicalMentions?.length ?? 0) > 0 ||
        !!item.lexicalReview ||
        !!doc._lexicalInventory
    );
    const isLegacyClinicalOnlyExport =
      !hasExplicitProtocol &&
      !hasLexicalRecords &&
      doc.cases.every((item) => (item.concepts?.length ?? 0) > 0);
    const resolvedProtocol =
      doc._annotationProtocol?.mode === 'core-blind'
        ? { ...CORE_BLIND_PROTOCOL, ...doc._annotationProtocol }
        : isLegacyClinicalOnlyExport
          ? { ...ASSISTED_ANNOTATION_PROTOCOL, lexicalLayerEnabled: false }
          : { ...ASSISTED_ANNOTATION_PROTOCOL, ...doc._annotationProtocol };
    this.annotationProtocol.set(resolvedProtocol);
    this.lexicalInventory.set(doc._lexicalInventory);
    const lexicalLayerEnabled = resolvedProtocol.lexicalLayerEnabled === true;

    let invalidSpans = 0;
    let invalidLexicalMentions = 0;
    const cases: CaseAnnotation[] = doc.cases.map((c) => {
      const text = String(c.text ?? '');
      const textNorm = String(c.textNorm ?? text);
      const normalizedSpans = normalizePremarkedSpans(c.spans, textNorm);
      invalidSpans += normalizedSpans.invalidCount;
      const normalizedLexicalMentions = normalizeLexicalMentions(c.lexicalMentions, textNorm);
      invalidLexicalMentions += normalizedLexicalMentions.invalidCount;

      const concepts = Array.isArray(c.concepts)
        ? c.concepts.map((concept, index) => {
            const sequence = typeof concept.sequence === 'number' ? concept.sequence : index + 1;
            // Existing JSON files predate the explicit context confirmation.
            // Treat their already persisted four attributes as reviewed, while
            // keeping newly created concepts pending until the annotator checks
            // the confirmation control.
            const contextReviewed = Object.prototype.hasOwnProperty.call(concept, 'contextReviewed')
              ? concept.contextReviewed !== false
              : true;
            return { ...newConcept(sequence), ...concept, contextReviewed, sequence };
          })
        : [];
      const reconciled = reconcileConceptSpanLinks(concepts, normalizedSpans.spans);
      if (reconciled.linkedCount > 0 && !hasExplicitProtocol) {
        migrationWarnings.push(
          `${reconciled.linkedCount} concepto(s) se vincularon con su candidato de texto al cargar.`
        );
      }
      if (reconciled.ambiguousCount > 0) {
        migrationWarnings.push(
          `${reconciled.ambiguousCount} concepto(s) conservan más de una coincidencia posible; deben revisarse.`
        );
      }
      const hasCodedConcept = reconciled.concepts.some(conceptIsComplete);
      const lexicalReview = lexicalLayerEnabled
        ? normalizeLexicalReview(
            c.lexicalReview,
            normalizedLexicalMentions.mentions,
            doc._lexicalInventory?.inventoryVersion ?? null
          )
        : c.lexicalReview
          ? normalizeLexicalReview(
              c.lexicalReview,
              normalizedLexicalMentions.mentions,
              doc._lexicalInventory?.inventoryVersion ?? null
            )
          : undefined;
      const completeConcepts = reconciled.concepts.every(
        (concept) => !conceptHasContent(concept) || conceptIsComplete(concept)
      );
      const spansReady = actionablePendingSpans(reconciled.spans).length === 0;
      const lexicalReady =
        !lexicalLayerEnabled ||
        (!!lexicalReview &&
          lexicalReview.status === 'completed' &&
          normalizedLexicalMentions.mentions.every(lexicalMentionComplete));
      const persistedReviewIsValid =
        c.review?.status === 'finalized' && completeConcepts && spansReady && lexicalReady;
      const canAutoFinalizeLegacy =
        !c.review && hasCodedConcept && completeConcepts && spansReady && !lexicalLayerEnabled;
      const review = persistedReviewIsValid || canAutoFinalizeLegacy
        ? {
            ...(c.review ?? {}),
            status: 'finalized' as const,
            outcome: c.review?.outcome ?? ('coded' as const),
          }
        : { status: 'pending' as const };

      return {
        id: String(c.id ?? ''),
        text,
        specialty: typeof c.specialty === 'string' && c.specialty.trim() ? c.specialty.trim() : null,
        textNorm,
        spans: reconciled.spans,
        concepts: reconciled.concepts,
        comentarios: String(c.comentarios ?? ''),
        review,
        lexicalMentions: normalizedLexicalMentions.mentions,
        lexicalReview,
      };
    });
    this.cases.set(cases);
    this.premarking.set(doc._premarking);
    this.trace.set(doc._trace);
    this.activeCaseIndex.set(0);
    this.caseSearch.set('');
    this.selectedSpan.set(null);
    this.selectedTextMark.set(null);
    this.humanSpanDraft.set(null);
    this.lexicalQuickEntry.set({});
    this.mentionQuickEntry.set({});
    this.unifiedActiveItemKeys.set({});
    this.unifiedMarkingPhase.set(Object.fromEntries(cases.map((_, index) => [index, true])));
    this.readingComplete.set(Object.fromEntries(cases.map((_, index) => [index, false])));
    this.caseWorkflowSteps.set(Object.fromEntries(cases.map((_, index) => [index, 'cell' as CaseWorkflowStep])));
    this.unifiedDetailContext.set(null);
    this.conceptHierarchy.set({});

    // --- Session metadata: preserve existing or initialise ---
    const now = new Date().toISOString();
    const existingMeta: AnnotationMeta = {
      sessions: [...(doc._meta?.sessions ?? [])],
      totalDownloads: doc._meta?.totalDownloads ?? 0,
      firstLoadedAt: doc._meta?.firstLoadedAt ?? now,
      completedAt: doc._meta?.completedAt,
      telemetry: createAnnotationTelemetry(
        cases.map((item) => item.id),
        doc._meta?.telemetry
      ),
    };
    const annotated = cases.filter((c) => c.concepts.some((cc) => !!cc.sctid)).length;
    const reviewed = cases.filter((c) => c.review?.status === 'finalized').length;
    const uploadEntry: SessionEntry = {
      action: 'upload',
      timestamp: now,
      annotatedCount: annotated,
      reviewedCount: reviewed,
      totalCases: cases.length,
      appBuild: TELEMETRY_APP_BUILD,
      platform: this.currentPlatform,
      sourceFile: fileName,
      schemaVersion: doc.schemaVersion ?? doc.sourceSchemaVersion ?? 'legacy',
      terminologyVersion: doc.terminology?.version ?? null,
    };
    existingMeta.sessions = [...existingMeta.sessions, uploadEntry];
    this.sessionMeta.set(existingMeta);

    this.dirty.set(false);
    if (migrationWarnings.length) {
      this.snackBar.open(
        `${migrationWarnings.length} ajuste(s) de interoperabilidad aplicados al cargar.`,
        'OK',
        { duration: 5500 }
      );
    }
    if (invalidSpans) {
      this.snackBar.open(
        `Se omitieron ${invalidSpans} spans inválidos: revisá offsets, texto y solapamientos.`,
        'OK',
        { duration: 6000 }
      );
    }
    if (invalidLexicalMentions) {
      this.snackBar.open(
        `Se omitieron ${invalidLexicalMentions} formas sugeridas porque no coincidían correctamente con la nota.`,
        'OK',
        { duration: 6500 }
      );
    }

    // Inform the user whether this is a fresh start or a resumption.
    const resuming = reviewed > 0 || annotated > 0;
    const msg = resuming
      ? `Retomando: ${reviewed} de ${cases.length} notas revisadas. Pendientes: ${cases.length - reviewed}.`
      : `Cargados ${cases.length} casos. Comenzá por el primero.`;
    const action = resuming && this.firstPendingIdx() >= 0 ? 'Ir al pendiente' : 'OK';
    this.snackBar
      .open(msg, action, { duration: 6000 })
      .onAction()
      .subscribe(() => this.scrollToFirstPending());
    if (resuming && this.firstPendingIdx() >= 0) {
      this.activeCaseIndex.set(this.firstPendingIdx());
    }
    this.activateCase(this.activeCaseIndex());
  }

  // ---- Clear / start over ----

  /** Clear everything; warn first if there is undownloaded annotation work. */
  clearAll(): void {
    if (this.dirty()) {
      this.dialog
        .open(this.confirmClearTpl, { width: '420px' })
        .afterClosed()
        .subscribe((ok) => {
          if (ok) this.doClear();
        });
    } else {
      this.doClear();
    }
  }

  private doClear(): void {
    this.pauseActivityTracking();
    this.cases.set([]);
    this.project.set('');
    this.batch.set('');
    this.sourceFile.set('');
    this.sourceSchemaVersion.set(undefined);
    this.loadedFileName.set('');
    this.premarking.set(undefined);
    this.trace.set(undefined);
    this.lexicalInventory.set(undefined);
    this.selectedSpan.set(null);
    this.selectedTextMark.set(null);
    this.humanSpanDraft.set(null);
    this.lexicalQuickEntry.set({});
    this.mentionQuickEntry.set({});
    this.unifiedActiveItemKeys.set({});
    this.unifiedMarkingPhase.set({});
    this.readingComplete.set({});
    this.caseWorkflowSteps.set({});
    this.unifiedDetailContext.set(null);
    this.conceptHierarchy.set({});
    this.activeCaseIndex.set(0);
    this.caseSearch.set('');
    this.sessionMeta.set(null);
    this.recoveryService.clear();
    this.recoverySnapshot.set(null);
    this.recoverySavedAt.set(null);
    this.recoveryStorageAvailable.set(this.recoveryService.available());
    this.recoveryOfferSuppressed = false;
    this.timingCaseIndex = null;
    this.pendingActiveMs.clear();
    this.dirty.set(false);
    this.snackBar.open('Espacio de trabajo limpio.', 'OK', { duration: 2000 });
  }

  // ---- Concept block editing ----

  private mutateCase(
    caseIdx: number,
    fn: (c: CaseAnnotation) => void,
    options: { preserveReview?: boolean; recordEdit?: boolean } = {}
  ): void {
    const wasFinalized = this.cases()[caseIdx]?.review?.status === 'finalized';
    this.cases.update((list) => {
      const copy = list.map((c) => ({
        ...c,
        review: c.review ? { ...c.review } : { status: 'pending' as const },
        spans: c.spans.map((span) => ({
          ...span,
          suggest: span.suggest ? { ...span.suggest } : undefined,
          review: span.review ? { ...span.review } : undefined,
          humanAudit: span.humanAudit ? { ...span.humanAudit } : undefined,
        })),
        lexicalMentions: (c.lexicalMentions ?? []).map((mention) => ({
          ...mention,
          candidateSenseIds: [...mention.candidateSenseIds],
          annotation: { ...mention.annotation, evidenceCodes: [...mention.annotation.evidenceCodes] },
        })),
        lexicalReview: c.lexicalReview ? { ...c.lexicalReview } : undefined,
        concepts: c.concepts.map((x) => ({ ...x })),
      }));
      fn(copy[caseIdx]);
      if (wasFinalized && !options.preserveReview) {
        copy[caseIdx].review = { status: 'pending' };
      }
      return copy;
    });
    if (options.recordEdit !== false) {
      const editedAt = new Date().toISOString();
      this.updateCaseTelemetry(caseIdx, (item) => {
        item.firstEditedAt ??= editedAt;
        item.lastEditedAt = editedAt;
        if (wasFinalized && !options.preserveReview) {
          item.reopenedCount += 1;
          item.finalizedAt = undefined;
          item.finalizationOutcome = undefined;
        }
      });
    }
    this.dirty.set(true);
    this.scheduleRecoverySave();
  }

  addConcept(caseIdx: number): void {
    const sequence = this.nextConceptSequence(this.cases()[caseIdx]);
    this.mutateCase(caseIdx, (c) => {
      c.concepts.push({
        ...newConcept(sequence),
        provenance: {
          createdPlatform: this.currentPlatform,
          lastEditedPlatform: this.currentPlatform,
        },
      });
    });
    this.updateCaseTelemetry(caseIdx, (item) => (item.conceptsAdded += 1));
    this.focusConcept(caseIdx, sequence);
  }

  textSegments(caseItem: CaseAnnotation): TextSegment[] {
    return buildTextSegments(caseItem.textNorm, caseItem.spans, caseItem.lexicalMentions ?? []);
  }

  textMarkKindLabel(kind: TextMarkKind): string {
    if (kind === 'pending') return 'Sugerencia pendiente de clasificar';
    if (kind === 'clinical') return 'Información clínica';
    if (kind === 'lexical') return 'Forma breve';
    return 'Información clínica y forma breve';
  }

  textMarkSelected(caseIdx: number, key: string): boolean {
    const selected = this.selectedTextMark();
    return selected?.caseIndex === caseIdx && selected.key === key;
  }

  selectedTextMarkFor(caseIdx: number): TextMark | null {
    const selected = this.selectedTextMark();
    const caseItem = this.cases()[caseIdx];
    if (!selected || selected.caseIndex !== caseIdx || !caseItem) return null;
    for (const segment of this.textSegments(caseItem)) {
      if (segment.kind === 'span') {
        const mark = segment.marks.find((candidate) => candidate.key === selected.key);
        if (mark) return mark;
      }
    }
    return null;
  }

  selectTextMark(caseIdx: number, mark: TextMark): void {
    this.selectedTextMark.set({ caseIndex: caseIdx, key: mark.key });
    const sourceSpan = mark.spans.find((span) => span.status !== 'descartado');
    this.selectedSpan.set(
      sourceSpan ? { caseIndex: caseIdx, spanId: sourceSpan.spanId } : null
    );
    if (this.unifiedMarkingPhaseActive(caseIdx)) {
      this.caseWorkflowSteps.update((current) => ({ ...current, [caseIdx]: 'marking' }));
    }
    if (this.unifiedReviewPrototype() && !this.unifiedMarkingPhaseActive(caseIdx)) {
      this.openUnifiedReviewItem(caseIdx, mark.key);
    }
  }

  /** Source offset for a rendered segment, used by manual span selection. */
  textSegmentStart(caseItem: CaseAnnotation, segmentIndex: number): number {
    return this.textSegments(caseItem)
      .slice(0, segmentIndex)
      .reduce((offset, segment) => offset + segment.value.length, 0);
  }

  conceptsInSequenceOrder(caseItem: CaseAnnotation): { concept: ConceptAnnotation; index: number }[] {
    return caseItem.concepts
      .map((concept, index) => ({ concept, index }))
      // Keep the creation order in the reading direction. New concepts are
      // appended at the point where the annotator is working instead of being
      // moved to the top of a long list.
      .sort((left, right) => (left.concept.sequence ?? left.index) - (right.concept.sequence ?? right.index));
  }

  /**
   * Use the terminology term when it exists and otherwise keep the literal
   * mention visible. This is especially important for concepts added from a
   * selection, which have no SNOMED term until the annotator codes them.
   */
  conceptDisplayLabel(concept: ConceptAnnotation): string {
    return concept.term?.trim() || concept.textoLiteral?.trim() || 'Mención clínica sin texto';
  }

  /**
   * Translate the internal concept state into wording an annotator can act on.
   * “Pendiente” alone does not say whether the missing step is coding or
   * completing a new block.
   */
  conceptMetaLabel(concept: ConceptAnnotation): string {
    const category = concept.cat?.trim();
    if (concept.sctid?.trim()) {
      if (concept.contextReviewed === false) {
        return `${category || 'Concepto clínico'} · Pendiente de revisar el contexto`;
      }
      return `${category || 'Concepto clínico'} · Codificado`;
    }
    if (concept.textoLiteral?.trim() || concept.term?.trim()) {
      return `${category || 'Mención clínica'} · Pendiente de codificación`;
    }
    return `${category || 'Mención clínica'} · Pendiente de completar`;
  }

  /** Switches only the local prototype view; it does not transform annotation data. */
  toggleUnifiedReviewPrototype(): void {
    this.unifiedReviewPrototype.update((enabled) => !enabled);
  }

  unifiedMarkingPhaseActive(caseIdx: number): boolean {
    return this.unifiedReviewPrototype() && (this.unifiedMarkingPhase()[caseIdx] ?? true);
  }

  /** Whether the explicit reading gate has been completed for a note. */
  readingCompleteFor(caseIdx: number): boolean {
    if (!this.unifiedReviewPrototype()) return true;
    // Tests, embedded integrations and legacy callers may populate `cases`
    // directly. Preserve their pre-existing behaviour unless the document
    // loader explicitly installed a blind-reading state for this case.
    if (!Object.prototype.hasOwnProperty.call(this.readingComplete(), caseIdx)) return true;
    return this.readingComplete()[caseIdx] === true;
  }

  /** Premarked highlights are only shown after the reading gate. */
  premarkedVisibleFor(caseIdx: number): boolean {
    return this.readingCompleteFor(caseIdx);
  }

  /**
   * Move a note from the blind reading pass into exhaustive marking. The
   * action is deliberately explicit and auditable in the UI; it is not
   * inferred from a click or text selection.
   */
  startUnifiedMarking(caseIdx: number): void {
    if (!this.cases()[caseIdx]) return;
    this.readingComplete.update((current) => ({ ...current, [caseIdx]: true }));
    this.caseWorkflowSteps.update((current) => ({ ...current, [caseIdx]: 'marking' }));
    this.selectedSpan.set(null);
    this.selectedTextMark.set(null);
    this.humanSpanDraft.set(null);
    this.scrollCaseSection(caseIdx, 'source');
    this.snackBar.open(
      'Lectura confirmada. Ahora podés recorrer la nota y marcar todas las menciones.',
      'OK',
      { duration: 3200 }
    );
  }

  caseWorkflowStep(caseIdx: number): CaseWorkflowStep {
    return this.caseWorkflowSteps()[caseIdx] ?? 'cell';
  }

  setCaseWorkflowStep(caseIdx: number, step: CaseWorkflowStep): void {
    const caseItem = this.cases()[caseIdx];
    if (!caseItem) return;
    if (step === 'marking' && this.unifiedReviewPrototype() && !this.readingCompleteFor(caseIdx)) {
      this.snackBar.open('Primero confirmá la lectura completa de la nota.', 'OK', {
        duration: 3500,
      });
      return;
    }
    if ((step === 'decisions' || step === 'finalize') && this.unifiedMarkingPhaseActive(caseIdx)) {
      this.snackBar.open('Primero completá la marcación de menciones en la nota.', 'OK', {
        duration: 3500,
      });
      return;
    }
    this.caseWorkflowSteps.update((current) => ({ ...current, [caseIdx]: step }));
    if (step === 'cell' || step === 'marking') {
      this.unifiedMarkingPhase.update((current) => ({ ...current, [caseIdx]: true }));
      if (step === 'cell' && this.unifiedReviewPrototype()) {
        this.readingComplete.update((current) => ({ ...current, [caseIdx]: false }));
      }
      this.unifiedDetailContext.set(null);
      this.selectedSpan.set(null);
      this.selectedTextMark.set(null);
      this.humanSpanDraft.set(null);
      this.scrollCaseSection(caseIdx, 'source');
      return;
    }
    if (step === 'decisions') {
      const items = this.unifiedReviewItems(caseItem);
      const first = items.find((item) => this.unifiedItemRequiresAction(item)) ?? items[0];
      if (first) this.setUnifiedActiveItem(caseIdx, first.key);
      this.scrollCaseSection(caseIdx, 'unified');
      return;
    }
    if (step === 'finalize') {
      this.scrollCaseSection(caseIdx, 'finalize');
    }
  }

  unifiedMarkingAddedCount(caseItem: CaseAnnotation): number {
    return caseItem.spans.filter((span) => span.origin === 'human').length;
  }

  finishUnifiedMarking(caseIdx: number): void {
    const caseItem = this.cases()[caseIdx];
    if (!caseItem) return;
    if (this.humanSpanDraft()?.caseIndex === caseIdx) {
      this.snackBar.open(
        'Hay una selección sin marcar. Pulsá “Marcar para revisar” o limpiá la selección antes de continuar.',
        'OK',
        { duration: 4500 }
      );
      return;
    }
    this.unifiedMarkingPhase.update((current) => ({ ...current, [caseIdx]: false }));
    this.caseWorkflowSteps.update((current) => ({ ...current, [caseIdx]: 'decisions' }));
    this.unifiedDetailContext.set(null);
    const items = this.unifiedReviewItems(caseItem);
    const first = items.find((item) => this.unifiedItemRequiresAction(item)) ?? items[0];
    if (first) this.setUnifiedActiveItem(caseIdx, first.key);
  }

  returnToUnifiedMarking(caseIdx: number): void {
    this.readingComplete.update((current) => ({ ...current, [caseIdx]: true }));
    this.unifiedMarkingPhase.update((current) => ({ ...current, [caseIdx]: true }));
    this.caseWorkflowSteps.update((current) => ({ ...current, [caseIdx]: 'marking' }));
    this.unifiedDetailContext.set(null);
    this.selectedSpan.set(null);
    this.selectedTextMark.set(null);
    this.humanSpanDraft.set(null);
  }

  addClinicalToUnifiedDetail(caseIdx: number): void {
    const context = this.unifiedDetailContext();
    if (!context || context.caseIdx !== caseIdx) return;
    this.classifyUnifiedItem(caseIdx, context.key, 'both');
  }

  goToUnifiedDetail(caseIdx: number, direction: -1 | 1): void {
    const caseItem = this.cases()[caseIdx];
    if (!caseItem) return;
    const items = this.unifiedReviewItems(caseItem);
    if (!items.length) return;
    const current = this.unifiedActivePosition(caseIdx, items);
    const next = items[(current + direction + items.length) % items.length];
    if (!next) return;
    this.setUnifiedActiveItem(caseIdx, next.key);
    if (next.kind === 'pending' || next.kind === 'skipped') {
      this.unifiedDetailContext.set(null);
      return;
    }
    this.openUnifiedItemDetails(caseIdx, next.key);
  }

  unifiedActiveItemKey(caseIdx: number, items: UnifiedReviewItem[]): string | null {
    const explicit = this.unifiedActiveItemKeys()[caseIdx];
    if (explicit && items.some((item) => item.key === explicit)) return explicit;
    return items.find((item) => this.unifiedItemRequiresAction(item))?.key ?? items[0]?.key ?? null;
  }

  unifiedActivePosition(caseIdx: number, items: UnifiedReviewItem[]): number {
    const active = this.unifiedActiveItemKey(caseIdx, items);
    const position = active ? items.findIndex((item) => item.key === active) : -1;
    return position >= 0 ? position : 0;
  }

  setUnifiedActiveItem(caseIdx: number, key: string): void {
    this.unifiedActiveItemKeys.update((current) => ({ ...current, [caseIdx]: key }));
  }

  unifiedDetailOpenFor(caseIdx: number): boolean {
    return this.unifiedDetailContext()?.caseIdx === caseIdx;
  }

  unifiedDetailTargetFor(caseIdx: number): UnifiedDetailTarget | null {
    const context = this.unifiedDetailContext();
    return context?.caseIdx === caseIdx ? context.target : null;
  }

  /**
   * The secondary action belongs only to a lexical-only mark. A mark already
   * classified as both must not show a misleading second "add clinical"
   * action when its lexical details are opened.
   */
  unifiedDetailCanAddClinical(caseIdx: number): boolean {
    const context = this.unifiedDetailContext();
    if (!context || context.caseIdx !== caseIdx || context.target !== 'lexical') return false;
    const caseItem = this.cases()[caseIdx];
    if (!caseItem) return false;
    const item = this.unifiedReviewItems(caseItem).find(
      (candidate) => candidate.key === context.key
    );
    return !!item?.lexicalMention && !item.concept;
  }

  unifiedDetailLabelFor(caseIdx: number): string {
    const target = this.unifiedDetailTargetFor(caseIdx);
    if (target === 'both') return 'Información clínica + abreviatura contextual';
    if (target === 'clinical') return 'Solo información clínica';
    return 'Solo abreviatura contextual';
  }

  unifiedDetailMatchesMention(caseIdx: number, mention: LexicalMention): boolean {
    if (!this.unifiedReviewPrototype()) return true;
    const context = this.unifiedDetailContext();
    return context?.caseIdx === caseIdx
      && context.key === `range-${mention.start}-${mention.end}`;
  }

  unifiedDetailMatchesConcept(caseIdx: number, concept: ConceptAnnotation, caseItem: CaseAnnotation): boolean {
    if (!this.unifiedReviewPrototype()) return true;
    const context = this.unifiedDetailContext();
    if (context?.caseIdx !== caseIdx) return false;
    return this.unifiedReviewItems(caseItem).some(
      (item) => item.key === context.key && item.concept === concept
    );
  }

  closeUnifiedDetails(): void {
    this.unifiedDetailContext.set(null);
  }

  goToUnifiedItem(caseIdx: number, direction: -1 | 1): void {
    const caseItem = this.cases()[caseIdx];
    if (!caseItem) return;
    const items = this.unifiedReviewItems(caseItem);
    if (!items.length) return;
    const current = this.unifiedActivePosition(caseIdx, items);
    const ordered = direction > 0
      ? [...items.slice(current + 1), ...items.slice(0, current)]
      : [...items.slice(0, current).reverse(), ...items.slice(current + 1).reverse()];
    const next = ordered.find((item) => item.kind !== 'skipped') ?? items[(current + direction + items.length) % items.length];
    if (!next) return;
    this.setUnifiedActiveItem(caseIdx, next.key);
    this.openUnifiedReviewItem(caseIdx, next.key);
  }

  private unifiedItemRequiresAction(item: UnifiedReviewItem): boolean {
    if (item.kind === 'pending') return true;
    if (item.kind === 'clinical') return !this.unifiedConceptComplete(item);
    if (item.kind === 'lexical') return !this.unifiedLexicalComplete(item);
    if (item.kind === 'both') {
      return !this.unifiedConceptComplete(item) || !this.unifiedLexicalComplete(item);
    }
    return false;
  }

  private unifiedConceptComplete(item: UnifiedReviewItem): boolean {
    const concept = item.concept;
    return this.unifiedConceptCodingComplete(item) && concept?.contextReviewed !== false;
  }

  private unifiedConceptCodingComplete(item: UnifiedReviewItem): boolean {
    const concept = item.concept;
    return !!concept?.cat && !!concept.sctid && !!concept.textoLiteral?.trim();
  }

  private unifiedLexicalComplete(item: UnifiedReviewItem): boolean {
    return !!item.lexicalMention && this.isLexicalMentionComplete(item.lexicalMention);
  }

  /**
   * Groups records with the same source range for a single, user-facing
   * decision. The underlying span/concept/lexical records remain separate.
   */
  unifiedReviewItems(caseItem: CaseAnnotation): UnifiedReviewItem[] {
    const grouped = new Map<
      string,
      Omit<UnifiedReviewItem, 'kind'>
    >();
    const addRange = (start: number, end: number, surface: string) => {
      const key = `range-${start}-${end}`;
      const existing = grouped.get(key);
      if (existing) return existing;
      const item: Omit<UnifiedReviewItem, 'kind'> = {
        key,
        start,
        end,
        surface,
        span: null,
        lexicalMention: null,
        concept: null,
      };
      grouped.set(key, item);
      return item;
    };

    for (const span of caseItem.spans) {
      addRange(span.start, span.end, span.textoLiteral).span = span;
    }
    for (const mention of caseItem.lexicalMentions ?? []) {
      addRange(mention.start, mention.end, mention.surface).lexicalMention = mention;
    }
    for (const concept of caseItem.concepts) {
      const linkedSpan = concept.spanId
        ? caseItem.spans.find((span) => span.spanId === concept.spanId)
        : undefined;
      if (linkedSpan) {
        addRange(linkedSpan.start, linkedSpan.end, linkedSpan.textoLiteral).concept = concept;
        continue;
      }
      const literal = concept.textoLiteral.trim();
      const start = literal ? caseItem.textNorm.indexOf(literal) : -1;
      if (start >= 0) {
        addRange(start, start + literal.length, literal).concept = concept;
      }
    }

    return [...grouped.values()]
      .map((item): UnifiedReviewItem => {
        const activeLexicalMention =
          !!item.lexicalMention && item.lexicalMention.annotation.decisionStatus !== 'rejected';
        const excludedSpan =
          item.span?.status === 'descartado' || item.span?.review?.disposition === 'excluido';
        const kind: UnifiedReviewItemKind =
          excludedSpan && !item.concept && !activeLexicalMention
            ? 'skipped'
            : item.concept && activeLexicalMention
              ? 'both'
              : item.concept
                ? 'clinical'
                : activeLexicalMention
                  ? 'lexical'
                  : item.span
                    ? 'pending'
                    : 'skipped';
        return { ...item, kind };
      })
      .sort((left, right) => left.start - right.start || left.end - right.end || left.key.localeCompare(right.key));
  }

  unifiedPendingCount(caseItem: CaseAnnotation): number {
    return this.unifiedReviewItems(caseItem).filter((item) => this.unifiedItemRequiresAction(item)).length;
  }

  unifiedTotalCount(caseItem: CaseAnnotation): number {
    return this.unifiedReviewItems(caseItem).length;
  }

  unifiedResolvedCount(caseItem: CaseAnnotation): number {
    return Math.max(0, this.unifiedTotalCount(caseItem) - this.unifiedPendingCount(caseItem));
  }

  /** Visible status tone for the active Step 3 decision card. */
  unifiedItemStatusResolved(item: UnifiedReviewItem): boolean {
    return item.kind !== 'skipped' && !this.unifiedItemRequiresAction(item);
  }

  unifiedItemStatusPending(item: UnifiedReviewItem): boolean {
    return item.kind !== 'skipped' && this.unifiedItemRequiresAction(item);
  }

  unifiedItemStatus(item: UnifiedReviewItem): string {
    if (item.kind === 'pending') {
      return item.span?.origin === 'human'
        ? 'Nueva marca · decidí qué registrar'
        : 'Candidata · decidí qué registrar';
    }
    if (item.kind === 'skipped') return 'Anulada / Sin valor clínico ni abreviatura';
    if (item.kind === 'both') {
      const clinicalStatus = this.unifiedConceptComplete(item) ? 'clínica: codificada' : 'clínica: pendiente';
      const lexicalStatus = this.unifiedLexicalComplete(item)
        ? 'abreviatura: decidida'
        : 'abreviatura: pendiente';
      return `Clínica + abreviatura contextual · ${clinicalStatus} · ${lexicalStatus}`;
    }
    if (item.kind === 'clinical') {
      if (!this.unifiedConceptCodingComplete(item)) {
        return 'Solo información clínica · pendiente de codificación';
      }
      return item.concept?.contextReviewed === false
        ? 'Solo información clínica · pendiente de revisar el contexto'
        : 'Solo información clínica · codificada';
    }
    return this.unifiedLexicalComplete(item)
      ? 'Solo abreviatura contextual · decidida'
      : 'Solo abreviatura contextual · pendiente';
  }

  unifiedClinicalDescription(item: UnifiedReviewItem): string {
    if (!this.unifiedConceptCodingComplete(item)) {
      return 'Esta aparición quedó como información clínica. Completá jerarquía, concepto SNOMED CT y contexto.';
    }
    return item.concept?.contextReviewed === false
      ? 'La codificación está completa. Confirmá explícitamente los cuatro atributos de contexto antes de cerrar la nota.'
      : 'Esta aparición ya tiene información clínica codificada. Podés abrir el detalle para revisarla o modificarla.';
  }

  unifiedLexicalDescription(item: UnifiedReviewItem): string {
    return this.unifiedLexicalComplete(item)
      ? 'El significado contextual de esta abreviatura ya está decidido. Podés abrir el detalle para revisarlo o modificarlo.'
      : 'Esta aparición quedó como abreviatura contextual / forma breve. Completá la expresión, su sentido contextual, función, sección y pistas.';
  }

  unifiedBothDescription(item: UnifiedReviewItem): string {
    const clinicalComplete = this.unifiedConceptComplete(item);
    const clinicalCoded = this.unifiedConceptCodingComplete(item);
    const lexicalComplete = this.unifiedLexicalComplete(item);
    if (clinicalComplete && lexicalComplete) {
      return 'La información clínica y la abreviatura contextual de esta aparición ya están completas. Podés abrir ambas capas para revisarlas o modificarlas.';
    }
    if (clinicalComplete) {
      return 'La información clínica ya está codificada; falta completar la abreviatura contextual de esta misma aparición.';
    }
    if (lexicalComplete) {
      return clinicalCoded
        ? 'El significado contextual ya está decidido; falta confirmar los cuatro atributos de contexto clínico.'
        : 'El significado contextual ya está decidido; falta completar la codificación clínica de esta misma aparición.';
    }
    if (clinicalCoded) {
      return 'La codificación clínica está completa; falta confirmar los cuatro atributos de contexto clínico y completar la abreviatura contextual.';
    }
    return 'La misma aparición requiere codificación clínica y abreviatura contextual.';
  }

  markDraftForUnifiedReview(caseIdx: number): void {
    const draft = this.humanSpanDraft();
    if (!draft || draft.caseIndex !== caseIdx) return;
    const spanId = this.createHumanSpan(caseIdx, draft.start, draft.end);
    if (!spanId) return;
    this.humanSpanDraft.set(null);
    this.selectedSpan.set(null);
    this.selectedTextMark.set(null);
    window.getSelection()?.removeAllRanges();
    if (this.unifiedMarkingPhaseActive(caseIdx)) {
      this.caseWorkflowSteps.update((current) => ({ ...current, [caseIdx]: 'marking' }));
      this.snackBar.open(
        'Marca incorporada. Continuá recorriendo la nota; las decisiones se abren en la segunda fase.',
        'OK',
        { duration: 3200 }
      );
      return;
    }
    this.openUnifiedReviewItem(caseIdx, `range-${draft.start}-${draft.end}`);
  }

  classifyUnifiedItem(caseIdx: number, key: string, choice: UnifiedReviewChoice): void {
    const caseItem = this.cases()[caseIdx];
    const item = caseItem && this.unifiedReviewItems(caseItem).find((candidate) => candidate.key === key);
    if (!caseItem || !item) return;

    if (choice === 'skip') {
      if (item.span && item.span.status !== 'descartado') {
        this.selectedSpan.set({ caseIndex: caseIdx, spanId: item.span.spanId });
        this.discardSelectedSpan(caseIdx);
      }
      if (item.lexicalMention) {
        this.updateLexicalAnnotation(caseIdx, item.lexicalMention.mentionId, 'decisionStatus', 'rejected');
      }
      this.snackBar.open('La marca se registró como no anotable.', 'OK', { duration: 3000 });
      return;
    }

    if ((choice === 'lexical' || choice === 'both') && !this.lexicalLayerEnabled()) {
      this.snackBar.open('Este lote no tiene activa la revisión de formas breves.', 'OK', { duration: 3500 });
      return;
    }

    const span = this.ensureUnifiedSpan(caseIdx, item);
    if (!span) return;

    if (choice === 'clinical') {
      // Reclassification is explicit: choosing the clinical-only category
      // removes a previous lexical-only dimension instead of silently turning
      // the mark into Ambos.
      if (item.lexicalMention) this.removeUnifiedLexicalDimension(caseIdx, item);
      this.unifiedDetailContext.set({
        caseIdx,
        key,
        target: 'clinical',
      });
      const sequence = this.confirmSpanAsClinical(caseIdx, span.spanId);
      this.selectedSpan.set(null);
      this.selectedTextMark.set(null);
      if (sequence !== undefined) this.focusConcept(caseIdx, sequence);
      this.snackBar.open(
        'La marca quedó como término con información clínica.',
        'OK',
        { duration: 3200 }
      );
      return;
    }

    if (choice === 'lexical') {
      // The lexical-only category likewise removes a clinical concept that was
      // selected earlier. The source span remains and is reclassified locally.
      if (item.concept) this.removeUnifiedClinicalDimension(caseIdx, item);
      if (!item.lexicalMention) this.addHumanLexicalMentionAt(caseIdx, span.start, span.end);
      this.unifiedDetailContext.set({ caseIdx, key, target: 'lexical' });
      this.markSpanAsLexical(caseIdx, span.spanId);
      const lexical = this.cases()[caseIdx]?.lexicalMentions?.find(
        (mention) => mention.start === span.start && mention.end === span.end
      );
      if (lexical) this.focusLexicalMention(caseIdx, lexical.mentionId);
      this.snackBar.open('La marca quedó como término sin información clínica.', 'OK', { duration: 3200 });
      return;
    }

    // "Ambos" is the only branch that deliberately retains/adds both records.
    if (!item.lexicalMention) this.addHumanLexicalMentionAt(caseIdx, span.start, span.end);
    this.unifiedDetailContext.set({ caseIdx, key, target: 'both' });
    const sequence = this.confirmSpanAsClinical(caseIdx, span.spanId);
    this.selectedSpan.set(null);
    this.selectedTextMark.set(null);
    if (sequence !== undefined) this.focusConcept(caseIdx, sequence);
    this.snackBar.open('La misma marca quedó como Ambos.', 'OK', { duration: 3200 });
  }

  private removeUnifiedClinicalDimension(caseIdx: number, item: UnifiedReviewItem): void {
    const sequence = item.concept?.sequence;
    const spanId = item.concept?.spanId ?? item.span?.spanId;
    this.mutateCase(caseIdx, (caseItem) => {
      caseItem.concepts = caseItem.concepts.filter((concept) => {
        if (sequence !== undefined && concept.sequence === sequence) return false;
        return !(spanId && concept.spanId === spanId);
      });
    });
  }

  private removeUnifiedLexicalDimension(caseIdx: number, item: UnifiedReviewItem): void {
    const mentionId = item.lexicalMention?.mentionId;
    if (!mentionId) return;
    this.mutateCase(caseIdx, (caseItem) => {
      caseItem.lexicalMentions = (caseItem.lexicalMentions ?? []).filter(
        (mention) => mention.mentionId !== mentionId
      );
    });
  }

  openUnifiedItemDetails(caseIdx: number, key: string): void {
    const caseItem = this.cases()[caseIdx];
    const item = caseItem && this.unifiedReviewItems(caseItem).find((candidate) => candidate.key === key);
    if (!item) return;
    if (item.concept) {
      this.unifiedDetailContext.set({
        caseIdx,
        key,
        target: item.lexicalMention ? 'both' : 'clinical',
      });
      const sequence = item.concept.sequence
        ?? ((this.cases()[caseIdx]?.concepts.indexOf(item.concept) ?? -1) + 1);
      if (sequence > 0) this.focusConcept(caseIdx, sequence);
      return;
    }
    if (item.lexicalMention) {
      this.unifiedDetailContext.set({ caseIdx, key, target: 'lexical' });
      this.focusLexicalMention(caseIdx, item.lexicalMention.mentionId);
      return;
    }
    this.openUnifiedReviewItem(caseIdx, item.key);
  }

  private ensureUnifiedSpan(caseIdx: number, item: UnifiedReviewItem): PremarkedSpan | null {
    if (item.span) {
      return this.cases()[caseIdx]?.spans.find((span) => span.spanId === item.span?.spanId) ?? null;
    }
    const spanId = this.createHumanSpan(caseIdx, item.start, item.end);
    return spanId
      ? this.cases()[caseIdx]?.spans.find((span) => span.spanId === spanId) ?? null
      : null;
  }

  private confirmSpanAsClinical(caseIdx: number, spanId: string): number | undefined {
    let sequence: number | undefined;
    this.mutateCase(caseIdx, (caseItem) => {
      const fixedSpan = caseItem.spans.find((item) => item.spanId === spanId);
      if (!fixedSpan) return;
      fixedSpan.status = 'confirmado';
      fixedSpan.review = {
        disposition: 'elegible',
        reason: 'Clasificada como término con información clínica durante la revisión.',
      };
      fixedSpan.humanAudit = {
        ...(fixedSpan.humanAudit ?? {}),
        lastAction: 'accepted',
        lastActionAt: new Date().toISOString(),
        lastActionPlatform: this.currentPlatform,
      };
      const existing = caseItem.concepts.find((concept) => concept.spanId === fixedSpan.spanId);
      if (existing) {
        sequence = existing.sequence;
        return;
      }
      sequence = this.nextConceptSequence(caseItem);
      caseItem.concepts.push({
        ...newConcept(),
        sequence,
        spanId: fixedSpan.spanId,
        textoLiteral: fixedSpan.textoLiteral,
        provenance: {
          createdPlatform: this.currentPlatform,
          lastEditedPlatform: this.currentPlatform,
        },
      });
    });
    this.updateCaseTelemetry(caseIdx, (item) => (item.spansAccepted += 1));
    return sequence;
  }

  private markSpanAsLexical(caseIdx: number, spanId: string): void {
    this.mutateCase(caseIdx, (caseItem) => {
      const fixedSpan = caseItem.spans.find((item) => item.spanId === spanId);
      if (!fixedSpan) return;
      fixedSpan.status = 'confirmado';
      fixedSpan.review = {
        disposition: 'excluido',
        reason: 'Clasificada como forma breve; no se abre un concepto SNOMED CT automáticamente.',
      };
      fixedSpan.humanAudit = {
        ...(fixedSpan.humanAudit ?? {}),
        lastAction: 'accepted',
        lastActionAt: new Date().toISOString(),
        lastActionPlatform: this.currentPlatform,
      };
    });
    this.selectedSpan.set(null);
    this.selectedTextMark.set(null);
    this.updateCaseTelemetry(caseIdx, (item) => (item.spansAccepted += 1));
  }

  private openUnifiedReviewItem(caseIdx: number, key: string): void {
    this.setUnifiedActiveItem(caseIdx, key);
    window.setTimeout(() => {
      const element = document.getElementById(`case-unified-item-${caseIdx}-${key}`);
      if (element instanceof HTMLDetailsElement) element.open = true;
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (element instanceof HTMLElement) element.focus({ preventScroll: true });
    }, 0);
  }

  private openPrototypeDetailDrawer(caseIdx: number): void {
    if (!this.unifiedReviewPrototype()) return;
    window.setTimeout(() => {
      const drawer = document.getElementById(`case-unified-details-${caseIdx}`);
      if (drawer instanceof HTMLDetailsElement) drawer.open = true;
    }, 0);
  }

  private focusLexicalMention(caseIdx: number, mentionId: string): void {
    this.openPrototypeDetailDrawer(caseIdx);
    window.setTimeout(() => {
      const element = document.getElementById(`case-lexical-mention-${caseIdx}-${mentionId}`);
      if (element instanceof HTMLDetailsElement) element.open = true;
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (element instanceof HTMLElement) element.focus({ preventScroll: true });
    }, 0);
  }

  private focusConcept(caseIdx: number, sequence: number): void {
    // The card is rendered after the signal update. Waiting one frame keeps
    // the scroll anchored to the card that was just created, including when
    // the action came from a selected mention rather than the section header.
    this.openPrototypeDetailDrawer(caseIdx);
    window.setTimeout(() => {
      const element = document.getElementById(`case-concept-${caseIdx}-${sequence}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (element instanceof HTMLElement) {
        element.focus({ preventScroll: true });
      }
    }, 0);
  }

  /**
   * Android applies a long-press selection after the pointer event finishes.
   * Deferring the read keeps mouse, keyboard and touch selections equivalent.
   */
  queueTextSelection(caseIdx: number, element: HTMLElement): void {
    if (this.textSelectionTimer !== undefined) window.clearTimeout(this.textSelectionTimer);
    this.textSelectionTimer = window.setTimeout(() => {
      this.textSelectionTimer = undefined;
      this.captureTextSelection(caseIdx, element);
    }, 120);
  }

  captureTextSelection(caseIdx: number, element: HTMLElement): void {
    // Text selection is intentionally inert during the blind reading pass.
    // The annotator must confirm the full-note reading before any mention can
    // enter the review queue.
    if (this.unifiedReviewPrototype() && !this.readingCompleteFor(caseIdx)) {
      this.humanSpanDraft.set(null);
      window.getSelection()?.removeAllRanges();
      return;
    }
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      this.humanSpanDraft.set(null);
      return;
    }

    const range = selection.getRangeAt(0);
    if (!element.contains(range.startContainer) || !element.contains(range.endContainer)) {
      this.humanSpanDraft.set(null);
      return;
    }

    const textoLiteral = range.toString();
    if (!textoLiteral.trim()) {
      this.humanSpanDraft.set(null);
      return;
    }

    const caseItem = this.cases()[caseIdx];
    const start = this.selectionSourceOffset(element, range.startContainer, range.startOffset);
    const end = this.selectionSourceOffset(element, range.endContainer, range.endOffset);

    if (start === null || end === null || end <= start || !caseItem) {
      this.humanSpanDraft.set(null);
      this.snackBar.open('Seleccioná texto dentro de la nota clínica.', 'OK', { duration: 3500 });
      return;
    }

    const sourceLiteral = caseItem.textNorm.slice(start, end);
    const normalizeWhitespace = (value: string) =>
      value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

    if (sourceLiteral !== textoLiteral && normalizeWhitespace(sourceLiteral) !== normalizeWhitespace(textoLiteral)) {
      this.humanSpanDraft.set(null);
      this.snackBar.open('No se pudo calcular la posición del texto seleccionado.', 'OK', { duration: 3500 });
      return;
    }

    let safeStart = start;
    let safeEnd = end;
    while (safeStart < safeEnd && /\s/u.test(caseItem.textNorm[safeStart])) safeStart += 1;
    while (safeEnd > safeStart && /\s/u.test(caseItem.textNorm[safeEnd - 1])) safeEnd -= 1;
    const safeLiteral = caseItem.textNorm.slice(safeStart, safeEnd);
    if (!isValidTextSpan(caseItem.textNorm, safeStart, safeEnd, safeLiteral)) {
      this.humanSpanDraft.set(null);
      this.snackBar.open('La selección corta un carácter Unicode y no puede guardarse.', 'OK', {
        duration: 4000,
      });
      return;
    }

    // Store the source literal so the new span remains offset-valid after export.
    this.humanSpanDraft.set({
      caseIndex: caseIdx,
      start: safeStart,
      end: safeEnd,
      textoLiteral: safeLiteral,
    });
  }

  private selectionSourceOffset(root: HTMLElement, node: Node, offset: number): number | null {
    let current: Node | null = node;
    while (current && current !== root) {
      if (current instanceof HTMLElement && current.hasAttribute('data-source-start')) {
        const segmentStart = Number(current.getAttribute('data-source-start'));
        if (!Number.isFinite(segmentStart)) return null;
        const localRange = document.createRange();
        try {
          localRange.selectNodeContents(current);
          localRange.setEnd(node, offset);
          return segmentStart + localRange.toString().length;
        } catch {
          return null;
        }
      }
      current = current.parentNode;
    }

    // Fallback for an endpoint represented directly by the root element.
    try {
      const prefixRange = document.createRange();
      prefixRange.selectNodeContents(root);
      prefixRange.setEnd(node, offset);
      return prefixRange.toString().length;
    } catch {
      return null;
    }
  }

  addHumanSpan(caseIdx: number): void {
    if (this.unifiedReviewPrototype() && !this.readingCompleteFor(caseIdx)) return;
    const draft = this.humanSpanDraft();
    const caseItem = this.cases()[caseIdx];
    if (!draft || draft.caseIndex !== caseIdx || !caseItem) return;

    if (!this.createHumanSpan(caseIdx, draft.start, draft.end)) return;
    this.humanSpanDraft.set(null);
    window.getSelection()?.removeAllRanges();
  }

  mentionQuickValue(caseIdx: number): string {
    return this.mentionQuickEntry()[caseIdx] ?? '';
  }

  setMentionQuickValue(caseIdx: number, value: string): void {
    this.mentionQuickEntry.update((entries) => ({ ...entries, [caseIdx]: value }));
  }

  mentionQuickCandidates(caseIdx: number): Array<{
    start: number;
    end: number;
    surface: string;
    context: string;
  }> {
    return this.exactTextCandidates(this.cases()[caseIdx], this.mentionQuickValue(caseIdx));
  }

  addHumanSpanAt(caseIdx: number, start: number, end: number): void {
    if (this.unifiedReviewPrototype() && !this.readingCompleteFor(caseIdx)) return;
    if (!this.createHumanSpan(caseIdx, start, end)) return;
    const literal = this.cases()[caseIdx]?.textNorm.slice(start, end) ?? '';
    this.snackBar.open(`Mención “${literal}” incorporada con offsets verificados.`, 'OK', {
      duration: 3200,
    });
  }

  private createHumanSpan(caseIdx: number, start: number, end: number): string | null {
    const caseItem = this.cases()[caseIdx];
    if (!caseItem || !isValidTextSpan(caseItem.textNorm, start, end)) {
      this.snackBar.open('La selección no coincide con límites Unicode seguros.', 'OK', {
        duration: 4000,
      });
      return null;
    }
    if (caseItem.spans.some((span) => span.start === start && span.end === end)) {
      this.snackBar.open('Esa mención ya está incorporada.', 'OK', { duration: 3000 });
      return null;
    }

    const spanId = this.nextHumanSpanId(caseItem);
    const now = new Date().toISOString();
    this.mutateCase(caseIdx, (targetCase) => {
      targetCase.spans.push({
        spanId,
        start,
        end,
        textoLiteral: targetCase.textNorm.slice(start, end),
        origin: 'human',
        confidence: 1,
        status: 'pendiente',
        review: { disposition: 'elegible', reason: 'Span agregado manualmente por el anotador.' },
        humanAudit: {
          createdManually: true,
          createdAt: now,
          createdPlatform: this.currentPlatform,
          lastAction: 'created',
          lastActionAt: now,
          lastActionPlatform: this.currentPlatform,
        },
      });
      targetCase.spans.sort((left, right) => left.start - right.start || left.end - right.end);
    });
    this.selectedSpan.set({ caseIndex: caseIdx, spanId });
    this.selectedTextMark.set({ caseIndex: caseIdx, key: `range-${start}-${end}` });
    this.updateCaseTelemetry(caseIdx, (item) => (item.manualSpansAdded += 1));
    return spanId;
  }

  addHumanLexicalMention(caseIdx: number): void {
    if (this.unifiedReviewPrototype() && !this.readingCompleteFor(caseIdx)) return;
    const draft = this.humanSpanDraft();
    const caseItem = this.cases()[caseIdx];
    if (!draft || draft.caseIndex !== caseIdx || !caseItem || !this.lexicalLayerEnabled()) return;
    const duplicate = (caseItem.lexicalMentions ?? []).some(
      (mention) => mention.start === draft.start && mention.end === draft.end
    );
    if (duplicate) {
      this.snackBar.open('Esa forma breve ya está incorporada en la revisión.', 'OK', {
        duration: 3500,
      });
      return;
    }

    const mention = newHumanLexicalMention(
      this.nextHumanLexicalMentionId(caseItem),
      draft.start,
      draft.end,
      draft.textoLiteral
    );
    this.mutateCase(caseIdx, (targetCase) => {
      targetCase.lexicalMentions ??= [];
      targetCase.lexicalMentions.push(mention);
      targetCase.lexicalMentions.sort(
        (left, right) => left.start - right.start || left.end - right.end
      );
      this.reopenLexicalReview(targetCase);
    });
    this.humanSpanDraft.set(null);
    window.getSelection()?.removeAllRanges();
  }

  lexicalQuickValue(caseIdx: number): string {
    return this.lexicalQuickEntry()[caseIdx] ?? '';
  }

  setLexicalQuickValue(caseIdx: number, value: string): void {
    this.lexicalQuickEntry.update((entries) => ({ ...entries, [caseIdx]: value }));
  }

  /** Exact, offset-safe occurrences for a typed short form. */
  lexicalQuickCandidates(caseIdx: number): Array<{ start: number; end: number; surface: string; context: string }> {
    return this.exactTextCandidates(this.cases()[caseIdx], this.lexicalQuickValue(caseIdx));
  }

  private exactTextCandidates(
    caseItem: CaseAnnotation | undefined,
    rawSurface: string
  ): Array<{ start: number; end: number; surface: string; context: string }> {
    const surface = rawSurface.trim().normalize('NFC');
    if (!caseItem || !surface) return [];

    const candidates: Array<{ start: number; end: number; surface: string; context: string }> = [];
    let start = 0;
    while (start < caseItem.textNorm.length) {
      const matchStart = caseItem.textNorm.indexOf(surface, start);
      if (matchStart < 0) break;
      const end = matchStart + surface.length;
      const exactSurface = caseItem.textNorm.slice(matchStart, end);
      if (isValidTextSpan(caseItem.textNorm, matchStart, end, exactSurface)) {
        candidates.push({
          start: matchStart,
          end,
          surface: exactSurface,
          context: caseItem.textNorm.slice(
            Math.max(0, matchStart - 18),
            Math.min(caseItem.textNorm.length, end + 24)
          ),
        });
      }
      start = end;
    }
    return candidates;
  }

  addHumanLexicalMentionAt(caseIdx: number, start: number, end: number): void {
    if (this.unifiedReviewPrototype() && !this.readingCompleteFor(caseIdx)) return;
    const caseItem = this.cases()[caseIdx];
    const surface = caseItem?.textNorm.slice(start, end) ?? '';
    if (!caseItem || !isValidTextSpan(caseItem.textNorm, start, end, surface)) {
      this.snackBar.open('La forma breve no coincide con límites Unicode seguros.', 'OK', {
        duration: 3500,
      });
      return;
    }
    const duplicate = (caseItem.lexicalMentions ?? []).some(
      (mention) => mention.start === start && mention.end === end
    );
    if (duplicate) {
      this.snackBar.open('Esa forma breve ya está incorporada en la revisión.', 'OK', { duration: 3000 });
      return;
    }

    this.mutateCase(caseIdx, (targetCase) => {
      targetCase.lexicalMentions ??= [];
      targetCase.lexicalMentions.push(
        newHumanLexicalMention(this.nextHumanLexicalMentionId(targetCase), start, end, surface)
      );
      targetCase.lexicalMentions.sort((left, right) => left.start - right.start || left.end - right.end);
      this.reopenLexicalReview(targetCase);
    });
    this.snackBar.open(`Forma breve “${surface}” incorporada. Completá su decisión abajo.`, 'OK', {
      duration: 3000,
    });
  }

  /**
   * Returns only senses supplied by the inventory or candidate matching.
   *
   * This intentionally excludes the synthetic "Sentido guardado" option
   * used to display an already persisted free-form value. The template uses
   * this distinction to keep the free-form input mounted while the annotator
   * types; otherwise the first character creates a synthetic option, replaces
   * the input with a select, and truncates the value at one character.
   */
  lexicalSenseChoices(mention: LexicalMention): LexicalSenseOption[] {
    const allEntries = this.lexicalInventory()?.abbreviations ?? [];
    const allSenses = this.uniqueLexicalSenseOptions(allEntries.flatMap((entry) => entry.senses));

    const candidateMatches = mention.candidateSenseIds.length
      ? this.uniqueLexicalSenseOptions(
          allSenses.filter((sense) => mention.candidateSenseIds.includes(sense.senseId))
        )
      : [];
    const surfaceMatches = this.uniqueLexicalSenseOptions(
      allEntries
        .filter((entry) => this.lexicalEntryMatchesMention(entry, mention))
        .flatMap((entry) => entry.senses)
    );

    return candidateMatches.length ? candidateMatches : surfaceMatches;
  }

  lexicalSenseOptions(mention: LexicalMention): LexicalSenseOption[] {
    const options = this.lexicalSenseChoices(mention);
    const selectedSenseId = mention.annotation.senseId?.trim() ?? '';
    if (!selectedSenseId) return options;

    if (options.some((option) => option.senseId === selectedSenseId)) return options;

    const allSenses = this.uniqueLexicalSenseOptions(
      (this.lexicalInventory()?.abbreviations ?? []).flatMap((entry) => entry.senses)
    );
    const knownSelected = allSenses.find((option) => option.senseId === selectedSenseId);
    return this.uniqueLexicalSenseOptions([
      ...options,
      knownSelected ?? {
        senseId: selectedSenseId,
        expansion: `Sentido guardado: ${selectedSenseId}`,
      },
    ]);
  }

  private lexicalEntryMatchesMention(entry: LexicalInventoryEntry, mention: LexicalMention): boolean {
    const keys = new Set([
      mention.normalizedKey,
      mention.surface,
      mention.normalizedKey.trim().toLocaleLowerCase('es-AR'),
      mention.surface.trim().toLocaleLowerCase('es-AR'),
    ].map((value) => value.trim().toLocaleLowerCase('es-AR')));
    const entryKey = entry.key.trim().toLocaleLowerCase('es-AR');
    if (keys.has(entryKey)) return true;
    return entry.caseSensitiveForms.some((form) => keys.has(form.trim().toLocaleLowerCase('es-AR')));
  }

  private uniqueLexicalSenseOptions(options: LexicalSenseOption[]): LexicalSenseOption[] {
    return [...new Map(options.map((option) => [option.senseId, option])).values()].sort((left, right) =>
      left.expansion.localeCompare(right.expansion, 'es-AR') || left.senseId.localeCompare(right.senseId)
    );
  }

  lexicalOriginLabel(origin: LexicalMention['origin']): string {
    switch (origin) {
      case 'human':
        return 'Agregada por vos';
      case 'sense_inventory':
        return 'Sugerida por una lista de formas conocidas';
      case 'legacy_dictionary':
        return 'Sugerida por coincidencia con una forma conocida';
      default:
        return 'Sugerida por su escritura';
    }
  }

  lexicalFormSuggestion(mention: LexicalMention): string {
    if (/\d/u.test(mention.surface)) {
      return 'Sugerencia automática por letras y números: revisala; la escritura no determina el significado.';
    }
    if (/^[A-ZÁÉÍÓÚÜÑ]{2,}$/u.test(mention.surface)) {
      return 'Sugerencia automática por mayúsculas: revisala; las mayúsculas no prueban que sea una sigla.';
    }
    return 'El tipo está preseleccionado como ayuda inicial: revisalo antes de cerrar.';
  }

  lexicalFormLabel(value: string | null): string {
    return this.lexicalFormTypes.find((option) => option.value === value)?.label ?? 'Sin seleccionar';
  }

  lexicalDecisionLabel(value: string | null): string {
    return this.lexicalDecisions.find((option) => option.value === value)?.label ?? 'Sin seleccionar';
  }

  lexicalFunctionLabel(value: string | null): string {
    if (value === this.lexicalUnclassifiedFunction.value) {
      return this.lexicalUnclassifiedFunction.label;
    }
    return this.lexicalFunctions.find((option) => option.value === value)?.label ?? 'Sin clasificar';
  }

  lexicalSenseLabel(mention: LexicalMention): string {
    const selected = mention.annotation.senseId?.trim();
    if (!selected) return 'Sin seleccionar';
    return (
      this.lexicalSenseOptions(mention).find((option) => option.senseId === selected)?.expansion ??
      `Valor existente: ${selected}`
    );
  }

  lexicalSectionLabel(value: string | null): string {
    if (!value) return 'Sin especificar';
    return this.lexicalSections.find((option) => option.value === value)?.label ?? `Valor existente: ${value}`;
  }

  clinicalSectionLabel(value: string | null): string {
    if (!value) return 'Sin especificar';
    return this.clinicalSections.find((option) => option.value === value)?.label ?? `Valor existente: ${value}`;
  }

  isKnownClinicalSection(section: string | null): boolean {
    return !!section && this.clinicalSections.some((option) => option.value === section);
  }

  lexicalEvidenceSummary(values: readonly string[]): string {
    if (!values.length) return 'Sin pistas seleccionadas';
    const labels = values.map(
      (value) => this.lexicalEvidenceCodes.find((option) => option.value === value)?.label ?? value,
    );
    if (labels.length <= 2) return labels.join(', ');
    return `${labels.slice(0, 2).join(', ')} y ${labels.length - 2} más`;
  }

  isKnownLexicalSection(section: string | null): boolean {
    return !!section && this.lexicalSections.some((option) => option.value === section);
  }

  unlistedLexicalEvidenceCodes(mention: LexicalMention): string[] {
    const listed = new Set(this.lexicalEvidenceCodes.map((option) => option.value));
    return mention.annotation.evidenceCodes.filter((code) => !listed.has(code));
  }

  updateLexicalAnnotation(
    caseIdx: number,
    mentionId: string,
    field: keyof LexicalAnnotation,
    value: string | null
  ): void {
    this.mutateCase(caseIdx, (caseItem) => {
      const mention = (caseItem.lexicalMentions ?? []).find((item) => item.mentionId === mentionId);
      if (!mention) return;
      (mention.annotation as unknown as Record<string, unknown>)[field] = value;
      if (field === 'decisionStatus') {
        const status = value as LexicalDecisionStatus;
        if (status !== 'resolved') mention.annotation.senseId = null;
        if (status !== 'new_sense_proposed') mention.annotation.proposedExpansion = null;
        if (status !== 'form_error') mention.annotation.correctedForm = null;
      }
      mention.annotation.annotatorId = this.annotatorId() || null;
      mention.annotation.annotatedAt = new Date().toISOString();
      this.reopenLexicalReview(caseItem);
    });
  }

  updateLexicalEvidence(caseIdx: number, mentionId: string, value: string | string[]): void {
    this.mutateCase(caseIdx, (caseItem) => {
      const mention = (caseItem.lexicalMentions ?? []).find((item) => item.mentionId === mentionId);
      if (!mention) return;
      mention.annotation.evidenceCodes = normalizeEvidenceCodes(value);
      mention.annotation.annotatorId = this.annotatorId() || null;
      mention.annotation.annotatedAt = new Date().toISOString();
      mention.annotation = normalizeLexicalAnnotation(mention.annotation, mention.surface);
      this.reopenLexicalReview(caseItem);
    });
  }

  removeHumanLexicalMention(caseIdx: number, mentionId: string): void {
    this.mutateCase(caseIdx, (caseItem) => {
      const mention = (caseItem.lexicalMentions ?? []).find((item) => item.mentionId === mentionId);
      if (!mention || mention.origin !== 'human') return;
      caseItem.lexicalMentions = (caseItem.lexicalMentions ?? []).filter(
        (item) => item.mentionId !== mentionId
      );
      this.reopenLexicalReview(caseItem);
    });
  }

  lexicalPendingCount(caseItem: CaseAnnotation): number {
    return (caseItem.lexicalMentions ?? []).filter((mention) => !lexicalMentionComplete(mention))
      .length;
  }

  isLexicalMentionComplete(mention: LexicalMention): boolean {
    return lexicalMentionComplete(mention);
  }

  lexicalReviewReady(caseItem: CaseAnnotation): boolean {
    if (!this.lexicalLayerEnabled()) return true;
    // En el flujo unificado no hay un cierre léxico separado: al no quedar
    // formas breves pendientes, la revisión se considera cerrada junto con
    // la decisión de la nota.
    if (this.unifiedReviewPrototype() && this.lexicalPendingCount(caseItem) === 0) return true;
    return caseItem.lexicalReview?.status === 'completed' && this.lexicalPendingCount(caseItem) === 0;
  }

  private closeUnifiedLexicalReviewIfReady(caseIdx: number): void {
    if (!this.unifiedReviewPrototype() || !this.lexicalLayerEnabled()) return;
    const caseItem = this.cases()[caseIdx];
    if (
      !caseItem ||
      this.lexicalPendingCount(caseItem) > 0 ||
      caseItem.lexicalReview?.status === 'completed'
    ) {
      return;
    }
    const completedAt = new Date().toISOString();
    this.mutateCase(caseIdx, (target) => {
      target.lexicalReview = {
        ...(target.lexicalReview ??
          newLexicalReview(
            this.lexicalInventory()?.inventoryVersion ??
              this.annotationProtocol().lexicalInventoryVersion ??
              null
          )),
        status: 'completed',
        exhaustiveReviewRequired: true,
        annotatorId: this.annotatorId() || null,
        completedAt,
        inventoryVersion:
          this.lexicalInventory()?.inventoryVersion ??
          this.annotationProtocol().lexicalInventoryVersion ??
          null,
      };
    });
  }

  completeLexicalReview(caseIdx: number): void {
    const caseItem = this.cases()[caseIdx];
    if (!caseItem || !this.lexicalLayerEnabled()) return;
    const pending = this.lexicalPendingCount(caseItem);
    if (pending) {
      this.snackBar.open(
        `Falta decidir qué hacer con ${pending} formas breves. También podés usar “ambigua” o “no puedo determinarla”.`,
        'OK',
        { duration: 5500 }
      );
      return;
    }
    const completedAt = new Date().toISOString();
    this.mutateCase(caseIdx, (target) => {
      target.lexicalReview = {
        status: 'completed',
        exhaustiveReviewRequired: true,
        annotatorId: this.annotatorId() || null,
        completedAt,
        inventoryVersion:
          this.lexicalInventory()?.inventoryVersion ??
          this.annotationProtocol().lexicalInventoryVersion ??
          null,
      };
    });
    this.snackBar.open('Revisión de formas breves completada.', 'OK', { duration: 3000 });
  }

  private reopenLexicalReview(caseItem: CaseAnnotation): void {
    if (!this.lexicalLayerEnabled()) return;
    caseItem.lexicalReview = {
      ...newLexicalReview(
        this.lexicalInventory()?.inventoryVersion ??
          this.annotationProtocol().lexicalInventoryVersion ??
          null
      ),
      ...(caseItem.lexicalReview ?? {}),
      status: 'pending',
      completedAt: null,
      annotatorId: null,
      exhaustiveReviewRequired: true,
    };
  }

  adjustSelectedSpanBounds(caseIdx: number): void {
    const draft = this.humanSpanDraft();
    const selected = this.selectedTextMarkFor(caseIdx);
    const caseItem = this.cases()[caseIdx];
    if (!draft || draft.caseIndex !== caseIdx || !selected || !caseItem) return;

    if (draft.start === selected.start && draft.end === selected.end) {
      this.snackBar.open('La selección ya tiene esos límites.', 'OK', { duration: 2800 });
      return;
    }

    const selectedSpanIds = new Set(selected.spans.map((span) => span.spanId));
    const selectedMentionIds = new Set(
      selected.lexicalMentions.map((mention) => mention.mentionId)
    );
    const collidesWithAnotherRange =
      caseItem.spans.some(
        (span) =>
          !selectedSpanIds.has(span.spanId) &&
          span.status !== 'descartado' &&
          span.review?.disposition !== 'excluido' &&
          span.start === draft.start &&
          span.end === draft.end
      ) ||
      (caseItem.lexicalMentions ?? []).some(
        (mention) =>
          !selectedMentionIds.has(mention.mentionId) &&
          mention.annotation.decisionStatus !== 'rejected' &&
          mention.start === draft.start &&
          mention.end === draft.end
      );
    if (collidesWithAnotherRange) {
      this.snackBar.open(
        'Ya existe otra marca con esos límites. Podés superponerla parcialmente, pero no duplicarla.',
        'OK',
        { duration: 4500 }
      );
      return;
    }

    const changedAt = new Date().toISOString();
    this.mutateCase(caseIdx, (targetCase) => {
      for (const targetSpan of targetCase.spans.filter((span) => selectedSpanIds.has(span.spanId))) {
        const existingAudit = targetSpan.humanAudit ?? {};
        targetSpan.humanAudit = {
          ...existingAudit,
          originalStart: existingAudit.originalStart ?? targetSpan.start,
          originalEnd: existingAudit.originalEnd ?? targetSpan.end,
          originalTextoLiteral: existingAudit.originalTextoLiteral ?? targetSpan.textoLiteral,
          boundaryAdjusted: true,
          lastAction: 'boundary_adjusted',
          lastActionAt: changedAt,
          lastActionPlatform: this.currentPlatform,
        };
        targetSpan.start = draft.start;
        targetSpan.end = draft.end;
        targetSpan.textoLiteral = draft.textoLiteral;
        targetSpan.status = 'pendiente';
      }
      targetCase.concepts
        .filter((concept) => !!concept.spanId && selectedSpanIds.has(concept.spanId))
        .forEach((concept) => (concept.textoLiteral = draft.textoLiteral));

      const adjustedLexicalMentions = (targetCase.lexicalMentions ?? []).filter((mention) =>
        selectedMentionIds.has(mention.mentionId)
      );
      for (const mention of adjustedLexicalMentions) {
        mention.start = draft.start;
        mention.end = draft.end;
        mention.surface = draft.textoLiteral;
        mention.normalizedKey = draft.textoLiteral.trim().toLocaleUpperCase('es-AR');
        mention.candidateSenseIds = [];
        mention.annotation = newLexicalAnnotation(draft.textoLiteral);
      }
      if (adjustedLexicalMentions.length) this.reopenLexicalReview(targetCase);

      targetCase.spans.sort((left, right) => left.start - right.start || left.end - right.end);
      targetCase.lexicalMentions?.sort(
        (left, right) => left.start - right.start || left.end - right.end
      );
    });
    this.humanSpanDraft.set(null);
    window.getSelection()?.removeAllRanges();
    this.selectedTextMark.set({
      caseIndex: caseIdx,
      key: `range-${draft.start}-${draft.end}`,
    });
    this.updateCaseTelemetry(caseIdx, (item) => (item.spanBoundaryAdjustments += 1));
    this.snackBar.open(
      selected.kind === 'both'
        ? 'Límites actualizados en ambas dimensiones. Revisá de nuevo la forma breve y confirmá la mención clínica.'
        : selected.kind === 'lexical'
          ? 'Límites de la forma breve actualizados. Revisá nuevamente su significado contextual.'
          : 'Límites actualizados. Confirmá la mención para continuar.',
      'OK',
      { duration: 4500 }
    );
  }

  selectedSpanFor(caseIdx: number): PremarkedSpan | null {
    const selected = this.selectedSpan();
    if (!selected || selected.caseIndex !== caseIdx) return null;
    return this.cases()[caseIdx]?.spans.find((span) => span.spanId === selected.spanId) ?? null;
  }

  selectSpan(caseIdx: number, span: PremarkedSpan): void {
    if (span.status === 'descartado') return;
    this.selectedSpan.set({ caseIndex: caseIdx, spanId: span.spanId });
    this.selectedTextMark.set({
      caseIndex: caseIdx,
      key: `range-${span.start}-${span.end}`,
    });
    if (this.unifiedMarkingPhaseActive(caseIdx)) {
      this.caseWorkflowSteps.update((current) => ({ ...current, [caseIdx]: 'marking' }));
    }
    if (this.unifiedReviewPrototype() && !this.unifiedMarkingPhaseActive(caseIdx)) {
      this.openUnifiedReviewItem(caseIdx, `range-${span.start}-${span.end}`);
    }
  }

  selectCase(caseIdx: number): void {
    if (caseIdx < 0 || caseIdx >= this.cases().length) return;
    this.activateCase(caseIdx);
    this.selectedSpan.set(null);
    this.selectedTextMark.set(null);
    this.humanSpanDraft.set(null);
  }

  goToAdjacentCase(direction: -1 | 1): void {
    const entries = this.filteredCaseEntries();
    const currentPosition = this.activeCasePosition();
    if (currentPosition < 0) return;
    const nextEntry = entries[currentPosition + direction];
    if (nextEntry) {
      this.selectCase(nextEntry.index);
      this.scrollActiveCaseIntoView(nextEntry.index);
    }
  }

  selectCaseAndScroll(caseIdx: number): void {
    this.selectCase(Number(caseIdx));
    this.scrollActiveCaseIntoView(Number(caseIdx));
  }

  scrollCaseSection(caseIdx: number, section: 'source' | 'unified' | 'lexical' | 'concepts' | 'finalize'): void {
    const element = document.getElementById(`case-${section}-${caseIdx}`);
    if (element && typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private scrollActiveCaseIntoView(caseIdx: number): void {
    window.setTimeout(() => {
      const element = document.querySelector(`[data-case-index="${caseIdx}"]`) as HTMLElement | null;
      if (element && typeof element.scrollIntoView === 'function') {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  hasAnnotatedConcept(caseItem: CaseAnnotation): boolean {
    return caseItem.concepts.some(conceptIsComplete);
  }

  casePendingSpanCount(caseItem: CaseAnnotation): number {
    return actionablePendingSpans(caseItem.spans).length;
  }

  caseIncompleteConceptCount(caseItem: CaseAnnotation): number {
    return caseItem.concepts.filter(
      (concept) => conceptHasContent(concept) && !conceptIsComplete(concept)
    ).length;
  }

  /** Completed concepts must still point to the exact source span they explain. */
  caseOrphanConceptCount(caseItem: CaseAnnotation): number {
    const spanIds = new Set(
      caseItem.spans
        .filter((span) => span.review?.disposition !== 'excluido')
        .map((span) => span.spanId)
    );
    return caseItem.concepts.filter(
      (concept) =>
        conceptHasContent(concept) &&
        conceptIsComplete(concept) &&
        (!concept.spanId || !spanIds.has(concept.spanId))
    ).length;
  }

  casePendingSpanLabels(caseItem: CaseAnnotation): string[] {
    return actionablePendingSpans(caseItem.spans).map((span) => span.textoLiteral);
  }

  /** Human-readable blockers shared by the close buttons and the case card. */
  caseClosureBlockers(caseItem: CaseAnnotation): string[] {
    const blockers: string[] = [];
    const pendingSpans = this.casePendingSpanCount(caseItem);
    const incompleteConcepts = this.caseIncompleteConceptCount(caseItem);
    const lexicalPending = this.lexicalPendingCount(caseItem);
    if (pendingSpans) {
      blockers.push(
        `${pendingSpans} candidato${pendingSpans === 1 ? '' : 's'} sin decidir: aceptalo como concepto o descartalo.`
      );
    }
    if (incompleteConcepts) {
      blockers.push(
        `${incompleteConcepts} concepto${incompleteConcepts === 1 ? '' : 's'} iniciado${incompleteConcepts === 1 ? '' : 's'} sin completar.`
      );
    }
    const orphanConcepts = this.caseOrphanConceptCount(caseItem);
    if (orphanConcepts) {
      blockers.push(
        `${orphanConcepts} concepto${orphanConcepts === 1 ? '' : 's'} sin vínculo con una mención del texto; seleccioná o incorporá el tramo exacto.`
      );
    }
    if (!this.lexicalReviewReady(caseItem)) {
      blockers.push(
        lexicalPending
          ? `${lexicalPending} forma${lexicalPending === 1 ? '' : 's'} breve${lexicalPending === 1 ? '' : 's'} sin decidir.`
          : 'La revisión de formas breves todavía no está confirmada.'
      );
    }
    return blockers;
  }

  caseCanFinalize(caseItem: CaseAnnotation, outcome: CaseReviewOutcome): boolean {
    if (this.caseClosureBlockers(caseItem).length > 0) return false;
    if (outcome === 'coded') return this.hasAnnotatedConcept(caseItem);
    return !caseItem.concepts.some(conceptHasContent);
  }

  caseEligibleSpanCount(caseItem: CaseAnnotation): number {
    return caseItem.spans.filter((span) => span.review?.disposition !== 'excluido').length;
  }

  caseExcludedSpanCount(caseItem: CaseAnnotation): number {
    return caseItem.spans.filter((span) => span.review?.disposition === 'excluido').length;
  }

  caseProgressLabel(caseItem: CaseAnnotation): string {
    const coded = caseItem.concepts.filter((concept) => !!concept.sctid).length;
    const total = caseItem.concepts.length;
    if (!total) return 'Sin conceptos';
    return `${coded}/${total} codificados`;
  }

  /** True when a note has work in progress but has not been explicitly closed. */
  caseHasStarted(caseItem: CaseAnnotation): boolean {
    const lexicalStarted = (caseItem.lexicalMentions ?? []).some(({ annotation }) =>
      annotation.decisionStatus !== 'pending' ||
      annotation.function !== null ||
      annotation.section !== null ||
      annotation.evidenceCodes.length > 0 ||
      !!annotation.comment?.trim() ||
      !!annotation.annotatorId
    );
    return (
      this.hasAnnotatedConcept(caseItem) ||
      caseItem.comentarios.trim().length > 0 ||
      caseItem.spans.some((span) => span.status !== 'pendiente') ||
      caseItem.lexicalReview?.status === 'completed' ||
      lexicalStarted
    );
  }

  caseNavigationStatusLabel(caseItem: CaseAnnotation): string {
    if (this.isCaseFinalized(caseItem)) {
      return caseItem.review?.outcome === 'no-eligible-concepts'
        ? 'Revisada sin conceptos'
        : 'Revisada';
    }
    if (this.dirty() && this.caseHasStarted(caseItem)) return 'Cambios sin descargar';
    return this.caseHasStarted(caseItem) ? 'Avance cargado' : 'En revisión';
  }

  lexicalCompletedCount(caseItem: CaseAnnotation): number {
    return (caseItem.lexicalMentions ?? []).filter((mention) => lexicalMentionComplete(mention)).length;
  }

  lexicalTotalCount(caseItem: CaseAnnotation): number {
    return (caseItem.lexicalMentions ?? []).length;
  }

  lexicalProgressPct(caseItem: CaseAnnotation): number {
    const total = this.lexicalTotalCount(caseItem);
    return total ? Math.round((this.lexicalCompletedCount(caseItem) / total) * 100) : 100;
  }

  lexicalStepLabel(caseItem: CaseAnnotation): string {
    const pending = this.lexicalPendingCount(caseItem);
    if (pending > 0) {
      return `Mención breve · decidí cada aparición (${pending} pendiente${pending === 1 ? '' : 's'})`;
    }
    if (this.unifiedReviewPrototype()) {
      return 'Mención breve · revisión lista';
    }
    if (caseItem.lexicalReview?.status !== 'completed') {
      return 'Mención breve · confirmá la revisión';
    }
    return 'Mención breve · revisión cerrada';
  }

  isCaseFinalized(caseItem: CaseAnnotation): boolean {
    return caseItem.review?.status === 'finalized';
  }

  finalizeCase(caseIdx: number, outcome: CaseReviewOutcome): void {
    const caseItem = this.cases()[caseIdx];
    if (!caseItem) return;
    this.closeUnifiedLexicalReviewIfReady(caseIdx);
    const validationCase = this.cases()[caseIdx] ?? caseItem;
    const blockers = this.caseClosureBlockers(validationCase);
    if (blockers.length) {
      this.snackBar.open(blockers.join(' '), 'OK', { duration: 6500 });
      return;
    }

    if (outcome === 'coded') {
      if (!this.hasAnnotatedConcept(validationCase)) {
        this.snackBar.open('Agregá y codificá al menos un concepto antes de finalizar.', 'OK', {
          duration: 4500,
        });
        return;
      }
    } else if (validationCase.concepts.some(conceptHasContent)) {
      this.snackBar.open(
        'Esta nota tiene conceptos iniciados. Completalos o quitálos antes de marcarla sin conceptos anotables.',
        'OK',
        { duration: 5500 }
      );
      return;
    }

    const finalizedAt = new Date().toISOString();
    this.mutateCase(
      caseIdx,
      (target) => {
        target.review = { status: 'finalized', outcome, finalizedAt };
      },
      { preserveReview: true, recordEdit: false }
    );
    this.updateCaseTelemetry(caseIdx, (item) => {
      item.finalizedAt = finalizedAt;
      item.finalizationOutcome = outcome;
    });
    const hasNextCase = this.activeCasePosition() < this.filteredCaseEntries().length - 1;
    this.snackBar.open(
      outcome === 'coded'
        ? 'Nota marcada como revisada.'
        : 'Nota registrada sin conceptos anotables.',
      hasNextCase ? 'Siguiente nota' : 'OK',
      { duration: 5000 }
    ).onAction().subscribe(() => {
      if (hasNextCase) this.goToAdjacentCase(1);
    });
  }

  confirmSelectedSpan(caseIdx: number): void {
    const span = this.selectedSpanFor(caseIdx);
    if (!span) return;
    let createdSequence: number | undefined;

    this.mutateCase(caseIdx, (caseItem) => {
      const fixedSpan = caseItem.spans.find((item) => item.spanId === span.spanId);
      if (!fixedSpan) return;
      fixedSpan.status = 'confirmado';
      fixedSpan.humanAudit = {
        ...(fixedSpan.humanAudit ?? {}),
        lastAction: 'accepted',
        lastActionAt: new Date().toISOString(),
        lastActionPlatform: this.currentPlatform,
      };

      const existing = caseItem.concepts.find((concept) => concept.spanId === fixedSpan.spanId);
      if (existing) return;
      createdSequence = this.nextConceptSequence(caseItem);
      caseItem.concepts.push({
        ...newConcept(),
        sequence: createdSequence,
        spanId: fixedSpan.spanId,
        textoLiteral: fixedSpan.textoLiteral,
        provenance: {
          createdPlatform: this.currentPlatform,
          lastEditedPlatform: this.currentPlatform,
        },
      });
    });
    this.selectedSpan.set(null);
    this.selectedTextMark.set(null);
    this.humanSpanDraft.set(null);
    this.updateCaseTelemetry(caseIdx, (item) => (item.spansAccepted += 1));
    if (createdSequence !== undefined) this.focusConcept(caseIdx, createdSequence);
  }

  discardSelectedSpan(caseIdx: number): void {
    const span = this.selectedSpanFor(caseIdx);
    if (!span) return;

    this.mutateCase(caseIdx, (caseItem) => {
      const fixedSpan = caseItem.spans.find((item) => item.spanId === span.spanId);
      if (!fixedSpan) return;
      fixedSpan.status = 'descartado';
      fixedSpan.humanAudit = {
        ...(fixedSpan.humanAudit ?? {}),
        lastAction: 'discarded',
        lastActionAt: new Date().toISOString(),
        lastActionPlatform: this.currentPlatform,
      };
      caseItem.concepts = caseItem.concepts.filter((concept) => concept.spanId !== fixedSpan.spanId);
    });
    this.selectedSpan.set(null);
    this.selectedTextMark.set(null);
    this.updateCaseTelemetry(caseIdx, (item) => (item.spansDiscarded += 1));
    this.recordDeletion(caseIdx, 'span');
  }

  removeConcept(caseIdx: number, conceptIdx: number): void {
    this.clearConceptHierarchy(caseIdx, conceptIdx);
    this.mutateCase(caseIdx, (c) => {
      c.concepts.splice(conceptIdx, 1);
    });
    this.updateCaseTelemetry(caseIdx, (item) => (item.conceptsRemoved += 1));
    this.recordDeletion(caseIdx, 'concept');
  }

  private nextConceptSequence(caseItem: CaseAnnotation): number {
    return (
      Math.max(
        0,
        ...caseItem.concepts.map((concept, index) => concept.sequence ?? index + 1)
      ) + 1
    );
  }

  private nextHumanSpanId(caseItem: CaseAnnotation): string {
    const maxId = caseItem.spans.reduce((maximum, span) => {
      const match = /^human-(\d+)$/.exec(span.spanId);
      return match ? Math.max(maximum, Number(match[1])) : maximum;
    }, 0);
    return `human-${String(maxId + 1).padStart(3, '0')}`;
  }

  private nextHumanLexicalMentionId(caseItem: CaseAnnotation): string {
    const maxId = (caseItem.lexicalMentions ?? []).reduce((maximum, mention) => {
      const match = /^lex-human-(\d+)$/.exec(mention.mentionId);
      return match ? Math.max(maximum, Number(match[1])) : maximum;
    }, 0);
    return `lex-human-${String(maxId + 1).padStart(3, '0')}`;
  }

  onCategoryChange(caseIdx: number, conceptIdx: number, cat: Category): void {
    const previousCategory = this.cases()[caseIdx]?.concepts[conceptIdx]?.cat;
    this.clearConceptHierarchy(caseIdx, conceptIdx);
    this.mutateCase(caseIdx, (c) => {
      const concept = c.concepts[conceptIdx];
      concept.cat = cat;
      concept.provenance = {
        createdPlatform: concept.provenance?.createdPlatform ?? this.currentPlatform,
        lastEditedPlatform: this.currentPlatform,
        terminologySelectedPlatform: concept.provenance?.terminologySelectedPlatform,
      };
      // Changing hierarchy invalidates a previously chosen code
      concept.sctid = '';
      concept.term = '';
      // Experimental attributes are category-specific. Do not leave a
      // clinical or procedure status attached after reclassifying the same
      // mention to another SNOMED hierarchy.
      if (cat !== 'Hallazgo clínico') {
        concept.clinicalStatus = null;
        concept.severity = null;
      }
      if (cat !== 'Procedimiento') concept.procedureStatus = null;
    });
    if (previousCategory && previousCategory !== cat) {
      this.updateCaseTelemetry(caseIdx, (item) => (item.categoryChanges += 1));
    }
  }

  onConceptSelected(
    caseIdx: number,
    conceptIdx: number,
    selection: { code?: string; display?: string }
  ): void {
    const previousCode = this.cases()[caseIdx]?.concepts[conceptIdx]?.sctid ?? '';
    this.clearConceptHierarchy(caseIdx, conceptIdx);
    this.mutateCase(caseIdx, (c) => {
      const concept = c.concepts[conceptIdx];
      concept.sctid = selection?.code ?? '';
      concept.term = selection?.display ?? '';
      concept.provenance = {
        createdPlatform: concept.provenance?.createdPlatform ?? this.currentPlatform,
        lastEditedPlatform: this.currentPlatform,
        terminologySelectedPlatform: this.currentPlatform,
      };
    });
    if (previousCode && selection?.code && previousCode !== selection.code) {
      this.updateCaseTelemetry(caseIdx, (item) => (item.conceptsReplaced += 1));
    }
  }

  /** Stable local key for hierarchy metadata; the sequence survives deletions. */
  private conceptHierarchyKey(caseIdx: number, conceptIdx: number): string {
    const concept = this.cases()[caseIdx]?.concepts[conceptIdx];
    return `${caseIdx}:${concept?.sequence ?? conceptIdx}`;
  }

  conceptHierarchyFor(caseIdx: number, conceptIdx: number): ConceptHierarchyViewState | null {
    const concept = this.cases()[caseIdx]?.concepts[conceptIdx];
    const state = this.conceptHierarchy()[this.conceptHierarchyKey(caseIdx, conceptIdx)];
    return concept?.sctid && state?.code === concept.sctid ? state : null;
  }

  loadConceptHierarchy(caseIdx: number, conceptIdx: number): void {
    const concept = this.cases()[caseIdx]?.concepts[conceptIdx];
    const code = concept?.sctid?.trim();
    if (!code) return;
    const server = this.terminologyServer();
    const edition = this.editionUri();
    const key = this.conceptHierarchyKey(caseIdx, conceptIdx);
    const existing = this.conceptHierarchy()[key];
    if (existing?.code === code && (existing.status === 'loading' || existing.status === 'ready')) {
      return;
    }

    this.conceptHierarchy.update((current) => ({
      ...current,
      [key]: {
        code,
        status: 'loading',
        parents: [],
        children: [],
        totalParents: 0,
        totalChildren: 0,
      },
    }));

    this.terminologyService
      .lookupConceptHierarchy(code, server, edition)
      .subscribe((hierarchy) => {
        const currentConcept = this.cases()[caseIdx]?.concepts[conceptIdx];
        if (
          currentConcept?.sctid !== code ||
          this.terminologyServer() !== server ||
          this.editionUri() !== edition
        ) {
          return;
        }
        this.conceptHierarchy.update((current) => ({
          ...current,
          [key]: hierarchy
            ? { ...hierarchy, status: 'ready' }
            : {
                code,
                status: 'error',
                parents: [],
                children: [],
                totalParents: 0,
                totalChildren: 0,
              },
        }));
      });
  }

  clearConceptHierarchy(caseIdx: number, conceptIdx: number): void {
    const key = this.conceptHierarchyKey(caseIdx, conceptIdx);
    this.conceptHierarchy.update((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  hierarchyConceptLabel(item: TerminologyHierarchyConcept): string {
    return item.display?.trim() || `SCTID ${item.code}`;
  }

  /** Select a parent/child as the active concept without changing its category. */
  selectHierarchyConcept(
    caseIdx: number,
    conceptIdx: number,
    item: TerminologyHierarchyConcept
  ): void {
    const code = item.code?.trim();
    if (!code) return;
    this.onConceptSelected(caseIdx, conceptIdx, {
      code,
      display: item.display?.trim() || `SCTID ${code}`,
    });
  }

  recordSearchTelemetry(
    caseIdx: number,
    conceptIdx: number,
    event: AutocompleteTelemetryEvent
  ): void {
    this.activateCase(caseIdx);
    const category = this.cases()[caseIdx]?.concepts[conceptIdx]?.cat ?? '';
    this.updateCaseTelemetry(caseIdx, (item) => {
      const search = item.search;
      const queryMetric = () => {
        let query = search.queries.find(
          (candidate) =>
            candidate.query === event.query &&
            candidate.category === category &&
            candidate.platform === this.currentPlatform
        );
        if (!query) {
          query = {
            query: event.query,
            category,
            platform: this.currentPlatform,
            requests: 0,
            zeroResults: 0,
            errors: 0,
            selections: 0,
          };
          search.queries.push(query);
        }
        return query;
      };

      switch (event.type) {
        case 'episode-start':
          search.episodes += 1;
          break;
        case 'reformulation':
          search.reformulations += 1;
          break;
        case 'request':
          search.requests += 1;
          if (event.query) queryMetric().requests += 1;
          break;
        case 'result':
          search.completedRequests += 1;
          search.totalLatencyMs += event.latencyMs ?? 0;
          if ((event.resultCount ?? 0) === 0) {
            search.zeroResults += 1;
            if (event.query) queryMetric().zeroResults += 1;
          }
          break;
        case 'error':
          search.errors += 1;
          search.totalLatencyMs += event.latencyMs ?? 0;
          if (event.query) queryMetric().errors += 1;
          break;
        case 'cancelled':
          search.cancelled += 1;
          break;
        case 'selection':
          search.selections += 1;
          if (event.selectedRank) search.selectedRanks.push(event.selectedRank);
          if (event.query) queryMetric().selections += 1;
          break;
      }
    });
  }

  updateConceptField(
    caseIdx: number,
    conceptIdx: number,
    field: keyof ConceptAnnotation,
    value: string
  ): void {
    this.mutateCase(caseIdx, (c) => {
      const concept = c.concepts[conceptIdx];
      (concept as any)[field] = value;
      concept.provenance = {
        createdPlatform: concept.provenance?.createdPlatform ?? this.currentPlatform,
        lastEditedPlatform: this.currentPlatform,
        terminologySelectedPlatform: concept.provenance?.terminologySelectedPlatform,
      };
    });
  }

  setClinicalContextReviewed(caseIdx: number, conceptIdx: number, reviewed: boolean): void {
    this.mutateCase(caseIdx, (c) => {
      const concept = c.concepts[conceptIdx];
      if (!concept) return;
      concept.contextReviewed = reviewed;
      concept.provenance = {
        createdPlatform: concept.provenance?.createdPlatform ?? this.currentPlatform,
        lastEditedPlatform: this.currentPlatform,
        terminologySelectedPlatform: concept.provenance?.terminologySelectedPlatform,
      };
    });
  }

  updateComentarios(caseIdx: number, value: string): void {
    this.mutateCase(caseIdx, (c) => {
      c.comentarios = value;
    });
  }

  updateCaseSpecialty(caseIdx: number, value: string): void {
    this.mutateCase(caseIdx, (c) => {
      const specialty = typeof value === 'string' ? value.trim() : '';
      c.specialty = specialty || null;
    });
  }

  bindingFor(cat: Category | ''): { ecl: string; title: string } {
    const found = CATEGORIES.find((c) => c.label === cat);
    return {
      ecl: eclForCategory(cat),
      title: found ? found.search : 'Elegí una categoría primero',
    };
  }

  onServerChange(value: string): void {
    this.conceptHierarchy.set({});
    this.terminologyServer.set(value);
    this.terminologyService.setTerminologyServer(value);
    // Re-detect the edition on the new server.
    this.detectEdition();
  }

  onEditionChange(value: string): void {
    this.conceptHierarchy.set({});
    this.editionUri.set(value);
    this.snomedVersion.set(value.includes('/version/') ? value : null);
    this.terminologyService.setEditionUri(value);
    this.editionLabel.set('Edición manual');
  }

  // ---- Export ----

  /**
   * Build the canonical JSON shape used by both downloads and device-local
   * recovery. Keeping one serializer prevents a recovery restore from
   * silently dropping newer annotation fields.
   */
  private buildPersistenceDocument(
    now = new Date().toISOString(),
    meta: AnnotationMeta | null = this.sessionMeta(),
  ): AnnotationOutput | null {
    if (!this.loaded()) return null;
    const persistedMeta: AnnotationMeta = meta ?? {
      sessions: [],
      totalDownloads: 0,
      firstLoadedAt: now,
      telemetry: createAnnotationTelemetry(this.cases().map((item) => item.id)),
    };
    return {
      schemaVersion: SEMANTIAR_SCHEMA_VERSION,
      sourceSchemaVersion: this.sourceSchemaVersion(),
      textProfile: { ...SEMANTIAR_TEXT_PROFILE },
      terminology: {
        server: this.terminologyServer(),
        editionUri: this.editionUri(),
        version: this.snomedVersion(),
        displayLanguage: this.displayLanguage(),
        capturedAt: now,
      },
      producer: {
        app: 'SemantIAr',
        build: TELEMETRY_APP_BUILD,
        platform: this.currentPlatform,
      },
      project: this.project() || undefined,
      batch: this.batch() || undefined,
      annotatorId: this.annotatorId() || undefined,
      sourceFile: this.sourceFile() || undefined,
      exportedAt: now,
      terminologyServer: this.terminologyServer(),
      editionUri: this.editionUri(),
      cases: this.cases().map((c) => ({
        id: c.id,
        text: c.text,
        ...(c.specialty?.trim() ? { specialty: c.specialty.trim() } : {}),
        textNorm: c.textNorm,
        spans: c.spans,
        // Preserve every started block. An unfinished concept is progress
        // that must survive both download and local recovery.
        concepts: c.concepts.map((concept) => ({ ...concept })),
        comentarios: c.comentarios,
        review: c.review,
        lexicalMentions: (c.lexicalMentions ?? []).map((mention) => ({
          ...mention,
          candidateSenseIds: [...mention.candidateSenseIds],
          annotation: normalizeLexicalAnnotation(mention.annotation, mention.surface),
        })),
        lexicalReview: c.lexicalReview,
      })),
      _meta: persistedMeta,
      _premarking: this.premarking(),
      _trace: this.trace(),
      _annotationProtocol: this.annotationProtocol(),
      _lexicalInventory: this.lexicalInventory(),
    };
  }

  async download(): Promise<void> {
    this.flushActiveTime();
    this.flushPendingActiveTime();
    const now = new Date().toISOString();
    const annotated = this.annotatedCount();
    const reviewed = this.reviewedCount();
    const total = this.cases().length;

    // Build updated session metadata for this download event.
    const currentMeta: AnnotationMeta = this.sessionMeta() ?? {
      sessions: [],
      totalDownloads: 0,
      firstLoadedAt: now,
      telemetry: createAnnotationTelemetry(this.cases().map((item) => item.id)),
    };
    const downloadEntry: SessionEntry = {
      action: 'download',
      timestamp: now,
      annotatedCount: annotated,
      reviewedCount: reviewed,
      totalCases: total,
      appBuild: TELEMETRY_APP_BUILD,
      platform: this.currentPlatform,
      sourceFile: this.loadedFileName() || this.sourceFile(),
      schemaVersion: SEMANTIAR_SCHEMA_VERSION,
      sourceSchemaVersion: this.sourceSchemaVersion(),
      terminologyVersion: this.snomedVersion(),
    };
    const updatedMeta: AnnotationMeta = {
      ...currentMeta,
      sessions: [...currentMeta.sessions, downloadEntry],
      totalDownloads: currentMeta.totalDownloads + 1,
      completedAt: this.complete() ? (currentMeta.completedAt ?? now) : currentMeta.completedAt,
    };
    // Persist updated meta in the signal so it survives if the user re-uploads this file.
    this.sessionMeta.set(updatedMeta);

    const output = this.buildPersistenceDocument(now, updatedMeta);
    if (!output) return;
    const stamp = now.slice(0, 10);
    const idPart = this.annotatorId() ? `_${this.annotatorId()}` : '';
    const filename = `SEMANTIAR_anotado${idPart}_${stamp}.json`;
    const json = JSON.stringify(output, null, 2);

    try {
      if (Capacitor.isNativePlatform()) {
        const file = await Filesystem.writeFile({
          path: filename,
          data: json,
          directory: Directory.Cache,
          encoding: Encoding.UTF8,
        });
        await Share.share({
          title: 'Guardar avance de SemantIAr',
          text: 'JSON de avance de la anotación',
          files: [file.uri],
          dialogTitle: 'Guardar o compartir JSON',
        });
      } else {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }
      this.dirty.set(false);
      this.recoveryService.clear();
      this.recoverySnapshot.set(null);
      this.recoverySavedAt.set(null);
      this.recoveryStorageAvailable.set(this.recoveryService.available());
    } catch {
      this.snackBar.open(
        'No se pudo guardar el JSON. Volvé a intentarlo o elegí otra aplicación de destino.',
        'OK',
        { duration: 5000 },
      );
    }
  }
}

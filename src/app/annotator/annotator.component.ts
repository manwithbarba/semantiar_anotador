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
import { TerminologyService } from '../services/terminology.service';
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
  lexicalMentionComplete,
  LexicalAnnotation,
  LexicalDecisionStatus,
  LEXICAL_DECISIONS,
  LEXICAL_EVIDENCE_CODES,
  LEXICAL_FORM_TYPES,
  LEXICAL_FUNCTIONS,
  LEXICAL_SECTIONS,
  LEXICAL_UNCLASSIFIED_FUNCTION,
  LexicalInventory,
  LexicalInventoryEntry,
  LexicalMention,
  LexicalSenseOption,
  newHumanLexicalMention,
  newLexicalReview,
  normalizeEvidenceCodes,
  normalizeLexicalAnnotation,
  normalizeLexicalMentions,
  normalizeLexicalReview,
  buildTextSegments,
  normalizePremarkedSpans,
  PremarkedSpan,
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
  SEMANTIAR_SCHEMA_VERSION,
  SEMANTIAR_TEXT_PROFILE,
  SessionEntry,
  SUBJECTS,
  TELEMETRY_APP_BUILD,
  TELEMETRY_IDLE_THRESHOLD_MS,
  TEMPORALITIES,
} from '../models/annotation.model';
import {
  AnnotationInteropError,
  prepareAnnotationDocument,
} from '../models/annotation-interop';

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
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private timingCaseIndex: number | null = null;
  private lastActivityMarkMs = 0;
  private timingActive = false;
  private textSelectionTimer: number | undefined;
  private pendingActiveMs = new Map<number, number>();
  private terminologyDetectionGeneration = 0;

  @ViewChild('confirmClear') confirmClearTpl!: TemplateRef<unknown>;
  @ViewChild('settingsDialog') settingsTpl!: TemplateRef<unknown>;
  @ViewChild('statsDialog') statsTpl!: TemplateRef<unknown>;
  @ViewChild('manualDialog') manualTpl!: TemplateRef<unknown>;

  readonly categories = CATEGORIES;
  readonly polarities = POLARITIES;
  readonly certainties = CERTAINTIES;
  readonly temporalities = TEMPORALITIES;
  readonly subjects = SUBJECTS;
  readonly lexicalDecisions = LEXICAL_DECISIONS;
  readonly lexicalFormTypes = LEXICAL_FORM_TYPES;
  readonly lexicalFunctions = LEXICAL_FUNCTIONS;
  readonly lexicalSections = LEXICAL_SECTIONS;
  readonly lexicalEvidenceCodes = LEXICAL_EVIDENCE_CODES;
  readonly lexicalUnclassifiedFunction = LEXICAL_UNCLASSIFIED_FUNCTION;
  readonly isNativeApp = Capacitor.isNativePlatform();
  readonly currentPlatform = this.isNativeApp ? 'android' as const : 'web' as const;

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
  humanSpanDraft = signal<{ caseIndex: number; start: number; end: number; textoLiteral: string } | null>(
    null
  );
  /** Draft text used by the one-tap lexical mention flow on mobile. */
  lexicalQuickEntry = signal<Record<number, string>>({});
  /** Draft text used to add an exact clinical mention without touch-dragging. */
  mentionQuickEntry = signal<Record<number, string>>({});
  protocolExpanded = signal<boolean>(false);
  /** Native phone controls avoid CDK overlay positioning outside the viewport. */
  compactMobile = signal<boolean>(false);

  /** Session metadata (upload/download audit trail). */
  sessionMeta = signal<AnnotationMeta | null>(null);

  /** True when there are annotation changes not yet downloaded. */
  dirty = signal<boolean>(false);

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
    this.detectEdition();
  }

  ngOnDestroy(): void {
    this.terminologyDetectionGeneration += 1;
    if (this.textSelectionTimer !== undefined) window.clearTimeout(this.textSelectionTimer);
    this.flushActiveTime();
    this.flushPendingActiveTime();
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
    } else {
      this.resumeActivityTracking();
    }
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

  /** Auto-select the Argentina edition (Spanish) if present, else International (English). */
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
      this.editionUri.set(info.editionUri);
      this.snomedVersion.set(info.version);
      this.displayLanguage.set(info.displayLanguage);
      this.terminologyService.setTerminologyServer(requestedServer);
      this.terminologyService.setEditionUri(info.editionUri);
      this.terminologyService.setDisplayLanguage(info.displayLanguage);
      this.editionLabel.set(info.label);
      // No notice on success (Argentina present). Only warn on the English fallback.
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
    const path = 'manuales/Manual_de_uso_SemantIAr_App.pdf';
    const filename = 'Manual_de_uso_SemantIAr_App.pdf';

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
          title: 'Manual de SemantIAr App',
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

  toggleProtocol(): void {
    this.protocolExpanded.update((expanded) => !expanded);
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

    const resolvedProtocol =
      doc._annotationProtocol?.mode === 'core-blind'
        ? { ...CORE_BLIND_PROTOCOL, ...doc._annotationProtocol }
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
            return { ...newConcept(sequence), ...concept, sequence };
          })
        : [];
      const hasCodedConcept = concepts.some((concept) => !!concept.sctid);
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
      const review =
        c.review?.status === 'finalized' &&
        (!lexicalLayerEnabled || lexicalReview?.status === 'completed')
          ? { ...c.review }
          : hasCodedConcept && !lexicalLayerEnabled
            ? { status: 'finalized' as const, outcome: 'coded' as const }
            : { status: 'pending' as const };

      return {
        id: String(c.id ?? ''),
        text,
        textNorm,
        spans: normalizedSpans.spans,
        concepts,
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
    this.humanSpanDraft.set(null);
    this.lexicalQuickEntry.set({});
    this.mentionQuickEntry.set({});

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
    this.humanSpanDraft.set(null);
    this.lexicalQuickEntry.set({});
    this.mentionQuickEntry.set({});
    this.activeCaseIndex.set(0);
    this.caseSearch.set('');
    this.sessionMeta.set(null);
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
  }

  addConcept(caseIdx: number): void {
    this.mutateCase(caseIdx, (c) => {
      c.concepts.push({
        ...newConcept(this.nextConceptSequence(c)),
        provenance: {
          createdPlatform: this.currentPlatform,
          lastEditedPlatform: this.currentPlatform,
        },
      });
    });
    this.updateCaseTelemetry(caseIdx, (item) => (item.conceptsAdded += 1));
  }

  textSegments(caseItem: CaseAnnotation): TextSegment[] {
    return buildTextSegments(caseItem.textNorm, caseItem.spans);
  }

  /** Source offset for a rendered segment, used by manual span selection. */
  textSegmentStart(caseItem: CaseAnnotation, segmentIndex: number): number {
    return this.textSegments(caseItem)
      .slice(0, segmentIndex)
      .reduce((offset, segment) => offset + segment.value.length, 0);
  }

  conceptsInDescendingOrder(caseItem: CaseAnnotation): { concept: ConceptAnnotation; index: number }[] {
    return caseItem.concepts
      .map((concept, index) => ({ concept, index }))
      .sort((left, right) => (right.concept.sequence ?? right.index) - (left.concept.sequence ?? left.index));
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
    this.updateCaseTelemetry(caseIdx, (item) => (item.manualSpansAdded += 1));
    return spanId;
  }

  addHumanLexicalMention(caseIdx: number): void {
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

  lexicalSenseOptions(mention: LexicalMention): LexicalSenseOption[] {
    const allEntries = this.lexicalInventory()?.abbreviations ?? [];
    const allSenses = this.uniqueLexicalSenseOptions(allEntries.flatMap((entry) => entry.senses));
    const selectedSenseId = mention.annotation.senseId?.trim() ?? '';

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

    const options = candidateMatches.length ? candidateMatches : surfaceMatches;
    if (!selectedSenseId) return options;

    if (options.some((option) => option.senseId === selectedSenseId)) return options;

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
    return caseItem.lexicalReview?.status === 'completed' && this.lexicalPendingCount(caseItem) === 0;
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
    const selected = this.selectedSpanFor(caseIdx);
    const caseItem = this.cases()[caseIdx];
    if (!draft || draft.caseIndex !== caseIdx || !selected || !caseItem) return;

    const changedAt = new Date().toISOString();
    this.mutateCase(caseIdx, (targetCase) => {
      const targetSpan = targetCase.spans.find((span) => span.spanId === selected.spanId);
      if (!targetSpan) return;
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
      targetCase.concepts
        .filter((concept) => concept.spanId === targetSpan.spanId)
        .forEach((concept) => (concept.textoLiteral = draft.textoLiteral));
      targetCase.spans.sort((left, right) => left.start - right.start || left.end - right.end);
    });
    this.humanSpanDraft.set(null);
    window.getSelection()?.removeAllRanges();
    this.updateCaseTelemetry(caseIdx, (item) => (item.spanBoundaryAdjustments += 1));
    this.snackBar.open('Límites actualizados. Confirmá la mención para continuar.', 'OK', {
      duration: 3500,
    });
  }

  selectedSpanFor(caseIdx: number): PremarkedSpan | null {
    const selected = this.selectedSpan();
    if (!selected || selected.caseIndex !== caseIdx) return null;
    return this.cases()[caseIdx]?.spans.find((span) => span.spanId === selected.spanId) ?? null;
  }

  selectSpan(caseIdx: number, span: PremarkedSpan): void {
    if (span.status === 'descartado') return;
    this.selectedSpan.set({ caseIndex: caseIdx, spanId: span.spanId });
  }

  selectCase(caseIdx: number): void {
    if (caseIdx < 0 || caseIdx >= this.cases().length) return;
    this.activateCase(caseIdx);
    this.selectedSpan.set(null);
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

  scrollCaseSection(caseIdx: number, section: 'source' | 'lexical' | 'concepts' | 'finalize'): void {
    const element = document.getElementById(`case-${section}-${caseIdx}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private scrollActiveCaseIntoView(caseIdx: number): void {
    window.setTimeout(() => {
      const element = document.querySelector(`[data-case-index="${caseIdx}"]`) as HTMLElement | null;
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  hasAnnotatedConcept(caseItem: CaseAnnotation): boolean {
    return caseItem.concepts.some((concept) => !!concept.sctid);
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
      return `Paso 1 · Decidí cada forma breve (${pending} pendiente${pending === 1 ? '' : 's'})`;
    }
    if (caseItem.lexicalReview?.status !== 'completed') {
      return 'Paso 2 · Confirmá la revisión exhaustiva de formas';
    }
    return 'Revisión de formas breves cerrada';
  }

  isCaseFinalized(caseItem: CaseAnnotation): boolean {
    return caseItem.review?.status === 'finalized';
  }

  finalizeCase(caseIdx: number, outcome: CaseReviewOutcome): void {
    const caseItem = this.cases()[caseIdx];
    if (!caseItem) return;
    const codedConcepts = caseItem.concepts.filter((concept) => !!concept.sctid);
    const conceptHasContent = (concept: ConceptAnnotation) =>
      !!(concept.cat || concept.sctid || concept.term || concept.textoLiteral.trim());
    const pendingSpans = caseItem.spans.filter(
      (span) => span.review?.disposition !== 'excluido' && span.status === 'pendiente'
    );

    if (!this.lexicalReviewReady(caseItem)) {
      const pending = this.lexicalPendingCount(caseItem);
      this.snackBar.open(
        pending
          ? `Decidí qué hacer con las ${pending} formas breves pendientes y cerrá esa revisión.`
          : 'Marcá como completa la revisión de formas breves antes de finalizar la nota.',
        'OK',
        { duration: 5500 }
      );
      return;
    }

    if (pendingSpans.length) {
      this.snackBar.open(
        `Revisá los ${pendingSpans.length} candidatos pendientes antes de finalizar la nota.`,
        'OK',
        { duration: 5000 }
      );
      return;
    }

    if (outcome === 'coded') {
      if (!codedConcepts.length) {
        this.snackBar.open('Agregá y codificá al menos un concepto antes de finalizar.', 'OK', {
          duration: 4500,
        });
        return;
      }
      const incompleteConcept = caseItem.concepts.some(
        (concept) =>
          conceptHasContent(concept) &&
          (!concept.cat || !concept.sctid || !concept.textoLiteral.trim())
      );
      if (incompleteConcept) {
        this.snackBar.open(
          'Completá categoría, concepto SNOMED CT y texto literal en todos los bloques iniciados.',
          'OK',
          { duration: 5500 }
        );
        return;
      }
    } else if (caseItem.concepts.some(conceptHasContent)) {
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
      caseItem.concepts.push({
        ...newConcept(),
        sequence: this.nextConceptSequence(caseItem),
        spanId: fixedSpan.spanId,
        textoLiteral: fixedSpan.textoLiteral,
        provenance: {
          createdPlatform: this.currentPlatform,
          lastEditedPlatform: this.currentPlatform,
        },
      });
    });
    this.selectedSpan.set(null);
    this.humanSpanDraft.set(null);
    this.updateCaseTelemetry(caseIdx, (item) => (item.spansAccepted += 1));
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
    this.updateCaseTelemetry(caseIdx, (item) => (item.spansDiscarded += 1));
    this.recordDeletion(caseIdx, 'span');
  }

  removeConcept(caseIdx: number, conceptIdx: number): void {
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

  updateComentarios(caseIdx: number, value: string): void {
    this.mutateCase(caseIdx, (c) => {
      c.comentarios = value;
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
    this.terminologyServer.set(value);
    this.terminologyService.setTerminologyServer(value);
    // Re-detect the edition on the new server.
    this.detectEdition();
  }

  onEditionChange(value: string): void {
    this.editionUri.set(value);
    this.snomedVersion.set(value.includes('/version/') ? value : null);
    this.terminologyService.setEditionUri(value);
    this.editionLabel.set('Edición manual');
  }

  // ---- Export ----

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

    const output: AnnotationOutput = {
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
        textNorm: c.textNorm,
        spans: c.spans,
        // Drop fully-empty concept blocks on export
        concepts: c.concepts.filter((x) => x.sctid || x.textoLiteral || x.cat),
        comentarios: c.comentarios,
        review: c.review,
        lexicalMentions: (c.lexicalMentions ?? []).map((mention) => ({
          ...mention,
          candidateSenseIds: [...mention.candidateSenseIds],
          annotation: normalizeLexicalAnnotation(mention.annotation, mention.surface),
        })),
        lexicalReview: c.lexicalReview,
      })),
      _meta: updatedMeta,
      _premarking: this.premarking(),
      _trace: this.trace(),
      _annotationProtocol: this.annotationProtocol(),
      _lexicalInventory: this.lexicalInventory(),
    };
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
    } catch {
      this.snackBar.open(
        'No se pudo guardar el JSON. Volvé a intentarlo o elegí otra aplicación de destino.',
        'OK',
        { duration: 5000 },
      );
    }
  }
}

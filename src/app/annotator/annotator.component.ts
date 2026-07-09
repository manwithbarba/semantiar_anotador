import { Component, computed, HostListener, inject, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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

import { AutocompleteBindingComponent } from '../bindings/autocomplete-binding/autocomplete-binding.component';
import { TerminologyService } from '../services/terminology.service';
import {
  AnnotationDocument,
  AnnotationMeta,
  AnnotationOutput,
  CaseAnnotation,
  Category,
  CATEGORIES,
  CERTAINTIES,
  ConceptAnnotation,
  DEFAULT_EDITION_URI,
  DEFAULT_TERMINOLOGY_SERVER,
  eclForCategory,
  newConcept,
  POLARITIES,
  SessionEntry,
  SUBJECTS,
  TEMPORALITIES,
} from '../models/annotation.model';

@Component({
  selector: 'app-annotator',
  standalone: true,
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
export class AnnotatorComponent implements OnInit {
  private http = inject(HttpClient);
  private terminologyService = inject(TerminologyService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  @ViewChild('confirmClear') confirmClearTpl!: TemplateRef<unknown>;
  @ViewChild('settingsDialog') settingsTpl!: TemplateRef<unknown>;
  @ViewChild('statsDialog') statsTpl!: TemplateRef<unknown>;

  readonly categories = CATEGORIES;
  readonly polarities = POLARITIES;
  readonly certainties = CERTAINTIES;
  readonly temporalities = TEMPORALITIES;
  readonly subjects = SUBJECTS;

  // Document metadata
  project = signal<string>('');
  batch = signal<string>('');
  annotatorId = signal<string>('');
  sourceFile = signal<string>('');

  // Terminology configuration (editable)
  terminologyServer = signal<string>(DEFAULT_TERMINOLOGY_SERVER);
  editionUri = signal<string>(DEFAULT_EDITION_URI);
  editionLabel = signal<string>('Detectando edición…');

  // Working set
  cases = signal<CaseAnnotation[]>([]);

  /** Session metadata (upload/download audit trail). */
  sessionMeta = signal<AnnotationMeta | null>(null);

  /** True when there are annotation changes not yet downloaded. */
  dirty = signal<boolean>(false);

  loaded = computed(() => this.cases().length > 0);
  annotatedCount = computed(
    () => this.cases().filter((c) => c.concepts.some((cc) => !!cc.sctid)).length
  );
  pendingCount = computed(() => this.cases().length - this.annotatedCount());
  progressPct = computed(() => {
    const total = this.cases().length;
    return total ? Math.round((this.annotatedCount() / total) * 100) : 0;
  });
  complete = computed(() => this.loaded() && this.annotatedCount() === this.cases().length);

  /** Index of the first pending (unannotated) case. -1 if none. */
  firstPendingIdx = computed(() =>
    this.cases().findIndex((c) => !c.concepts.some((cc) => !!cc.sctid))
  );

  /** Session summary stats for display in the dialog. */
  totalDownloads = computed(() => this.sessionMeta()?.totalDownloads ?? 0);
  firstLoadedAt = computed(() => this.sessionMeta()?.firstLoadedAt ?? '—');
  completedAt = computed(() => this.sessionMeta()?.completedAt ?? null);

  ngOnInit(): void {
    this.detectEdition();
  }

  /** Warn before leaving/refreshing the page if there is undownloaded work. */
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.dirty()) {
      event.preventDefault();
      // Required by Chrome/Safari to trigger the native confirmation prompt.
      event.returnValue = '';
    }
  }

  /** Auto-select the Argentina edition (Spanish) if present, else International (English). */
  detectEdition(): void {
    this.editionLabel.set('Detectando edición…');
    this.terminologyService.detectEdition(this.terminologyServer()).subscribe((info) => {
      this.editionUri.set(info.editionUri);
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
    this.dialog.open(this.statsTpl, { width: '560px' });
  }

  /** Scroll smoothly to the first unannotated case card. */
  scrollToFirstPending(): void {
    const idx = this.firstPendingIdx();
    if (idx < 0) return;
    const cards = document.querySelectorAll('.case-card');
    const el = cards[idx] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---- Loading ----

  loadExample(): void {
    this.http.get<AnnotationDocument>('example-input.json').subscribe({
      next: (doc) => this.ingestDocument(doc, 'example-input.json'),
      error: () => this.snackBar.open('No se pudo cargar el ejemplo.', 'OK', { duration: 4000 }),
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const doc = JSON.parse(reader.result as string) as AnnotationDocument;
        this.ingestDocument(doc, file.name);
      } catch {
        this.snackBar.open('El archivo no es un JSON válido.', 'OK', { duration: 4000 });
      }
    };
    reader.readAsText(file);
    input.value = ''; // allow re-selecting the same file
  }

  private ingestDocument(doc: AnnotationDocument, fileName: string): void {
    if (!doc || !Array.isArray(doc.cases) || doc.cases.length === 0) {
      this.snackBar.open('El JSON no contiene "cases".', 'OK', { duration: 4000 });
      return;
    }
    this.project.set(doc.project ?? '');
    this.batch.set(doc.batch ?? '');
    this.annotatorId.set(doc.annotatorId ?? '');
    this.sourceFile.set(doc.sourceFile ?? fileName);

    const cases: CaseAnnotation[] = doc.cases.map((c: any) => ({
      id: String(c.id ?? ''),
      text: String(c.text ?? ''),
      // Preserve annotations if the JSON already carried them; otherwise start with one empty block
      concepts:
        Array.isArray(c.concepts) && c.concepts.length
          ? c.concepts.map((x: any) => ({ ...newConcept(), ...x }))
          : [newConcept()],
      comentarios: String(c.comentarios ?? ''),
    }));
    this.cases.set(cases);

    // --- Session metadata: preserve existing or initialise ---
    const now = new Date().toISOString();
    const existingMeta: AnnotationMeta = doc._meta ?? {
      sessions: [],
      totalDownloads: 0,
      firstLoadedAt: now,
    };
    const annotated = cases.filter((c) => c.concepts.some((cc) => !!cc.sctid)).length;
    const uploadEntry: SessionEntry = {
      action: 'upload',
      timestamp: now,
      annotatedCount: annotated,
      totalCases: cases.length,
    };
    existingMeta.sessions = [...existingMeta.sessions, uploadEntry];
    this.sessionMeta.set(existingMeta);

    this.dirty.set(false);

    // Inform the user whether this is a fresh start or a resumption.
    const resuming = annotated > 0;
    const msg = resuming
      ? `Retomando: ${annotated} de ${cases.length} casos ya anotados. Pendientes: ${cases.length - annotated}.`
      : `Cargados ${cases.length} casos. Comenzá por el primero.`;
    const action = resuming && this.firstPendingIdx() >= 0 ? 'Ir al pendiente' : 'OK';
    this.snackBar
      .open(msg, action, { duration: 6000 })
      .onAction()
      .subscribe(() => this.scrollToFirstPending());
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
    this.cases.set([]);
    this.project.set('');
    this.batch.set('');
    this.sourceFile.set('');
    this.sessionMeta.set(null);
    this.dirty.set(false);
    this.snackBar.open('Espacio de trabajo limpio.', 'OK', { duration: 2000 });
  }

  // ---- Concept block editing ----

  private mutateCase(caseIdx: number, fn: (c: CaseAnnotation) => void): void {
    this.cases.update((list) => {
      const copy = list.map((c) => ({ ...c, concepts: c.concepts.map((x) => ({ ...x })) }));
      fn(copy[caseIdx]);
      return copy;
    });
    this.dirty.set(true);
  }

  addConcept(caseIdx: number): void {
    // Prepend so the newest block appears right below the clinical text; a long
    // list then grows downward and never pushes the writing area off-screen.
    this.mutateCase(caseIdx, (c) => {
      c.concepts.unshift(newConcept());
    });
  }

  removeConcept(caseIdx: number, conceptIdx: number): void {
    this.mutateCase(caseIdx, (c) => {
      c.concepts.splice(conceptIdx, 1);
      if (c.concepts.length === 0) c.concepts.push(newConcept());
    });
  }

  onCategoryChange(caseIdx: number, conceptIdx: number, cat: Category): void {
    this.mutateCase(caseIdx, (c) => {
      const concept = c.concepts[conceptIdx];
      concept.cat = cat;
      // Changing hierarchy invalidates a previously chosen code
      concept.sctid = '';
      concept.term = '';
    });
  }

  onConceptSelected(
    caseIdx: number,
    conceptIdx: number,
    selection: { code?: string; display?: string }
  ): void {
    this.mutateCase(caseIdx, (c) => {
      const concept = c.concepts[conceptIdx];
      concept.sctid = selection?.code ?? '';
      concept.term = selection?.display ?? '';
    });
  }

  updateConceptField(
    caseIdx: number,
    conceptIdx: number,
    field: keyof ConceptAnnotation,
    value: string
  ): void {
    this.mutateCase(caseIdx, (c) => {
      (c.concepts[conceptIdx] as any)[field] = value;
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
    this.terminologyService.setEditionUri(value);
    this.editionLabel.set('Edición manual');
  }

  // ---- Export ----

  download(): void {
    const now = new Date().toISOString();
    const annotated = this.annotatedCount();
    const total = this.cases().length;

    // Build updated session metadata for this download event.
    const currentMeta = this.sessionMeta() ?? {
      sessions: [],
      totalDownloads: 0,
      firstLoadedAt: now,
    };
    const downloadEntry: SessionEntry = {
      action: 'download',
      timestamp: now,
      annotatedCount: annotated,
      totalCases: total,
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
        // Drop fully-empty concept blocks and the client-only uid on export
        concepts: c.concepts
          .filter((x) => x.sctid || x.textoLiteral || x.cat)
          .map(({ uid, ...rest }) => rest),
        comentarios: c.comentarios,
      })),
      _meta: updatedMeta,
    };
    const blob = new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = now.slice(0, 10);
    const idPart = this.annotatorId() ? `_${this.annotatorId()}` : '';
    a.href = url;
    a.download = `SEMANTIAR_anotado${idPart}_${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.dirty.set(false);
  }
}

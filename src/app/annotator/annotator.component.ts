import { Component, computed, inject, signal } from '@angular/core';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AutocompleteBindingComponent } from '../bindings/autocomplete-binding/autocomplete-binding.component';
import { TerminologyService } from '../services/terminology.service';
import {
  AnnotationDocument,
  AnnotationOutput,
  CaseAnnotation,
  Category,
  CATEGORIES,
  CERTAINTIES,
  ConceptAnnotation,
  DEFAULT_EDITION_URI,
  DEFAULT_TERMINOLOGY_SERVER,
  eclForCategory,
  MAX_CONCEPTS_PER_CASE,
  newConcept,
  POLARITIES,
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
    MatExpansionModule,
    MatProgressBarModule,
    MatSnackBarModule,
    AutocompleteBindingComponent,
  ],
  templateUrl: './annotator.component.html',
  styleUrl: './annotator.component.css',
})
export class AnnotatorComponent {
  private http = inject(HttpClient);
  private terminologyService = inject(TerminologyService);
  private snackBar = inject(MatSnackBar);

  readonly categories = CATEGORIES;
  readonly polarities = POLARITIES;
  readonly certainties = CERTAINTIES;
  readonly temporalities = TEMPORALITIES;
  readonly subjects = SUBJECTS;
  readonly maxConcepts = MAX_CONCEPTS_PER_CASE;

  // Document metadata
  project = signal<string>('');
  batch = signal<string>('');
  annotatorId = signal<string>('');
  sourceFile = signal<string>('');

  // Terminology configuration (editable)
  terminologyServer = signal<string>(DEFAULT_TERMINOLOGY_SERVER);
  editionUri = signal<string>(DEFAULT_EDITION_URI);

  // Working set
  cases = signal<CaseAnnotation[]>([]);

  loaded = computed(() => this.cases().length > 0);
  annotatedCount = computed(
    () => this.cases().filter((c) => c.concepts.some((cc) => !!cc.sctid)).length
  );
  progressPct = computed(() => {
    const total = this.cases().length;
    return total ? Math.round((this.annotatedCount() / total) * 100) : 0;
  });
  complete = computed(() => this.loaded() && this.annotatedCount() === this.cases().length);

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
    this.snackBar.open(`Cargados ${cases.length} casos.`, 'OK', { duration: 2500 });
  }

  // ---- Concept block editing ----

  private mutateCase(caseIdx: number, fn: (c: CaseAnnotation) => void): void {
    this.cases.update((list) => {
      const copy = list.map((c) => ({ ...c, concepts: c.concepts.map((x) => ({ ...x })) }));
      fn(copy[caseIdx]);
      return copy;
    });
  }

  addConcept(caseIdx: number): void {
    this.mutateCase(caseIdx, (c) => {
      if (c.concepts.length < this.maxConcepts) c.concepts.push(newConcept());
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
  }

  onEditionChange(value: string): void {
    this.editionUri.set(value);
    this.terminologyService.setEditionUri(value);
  }

  // ---- Export ----

  download(): void {
    const output: AnnotationOutput = {
      project: this.project() || undefined,
      batch: this.batch() || undefined,
      annotatorId: this.annotatorId() || undefined,
      sourceFile: this.sourceFile() || undefined,
      exportedAt: new Date().toISOString(),
      terminologyServer: this.terminologyServer(),
      editionUri: this.editionUri(),
      cases: this.cases().map((c) => ({
        id: c.id,
        text: c.text,
        // Drop fully-empty concept blocks on export
        concepts: c.concepts.filter((x) => x.sctid || x.textoLiteral || x.cat),
        comentarios: c.comentarios,
      })),
    };
    const blob = new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    const idPart = this.annotatorId() ? `_${this.annotatorId()}` : '';
    a.href = url;
    a.download = `SEMANTIAR_anotado${idPart}_${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

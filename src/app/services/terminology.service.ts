import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import {
  AR_DISPLAY_LANGUAGE,
  AR_EDITION_URI,
  DEFAULT_DISPLAY_LANGUAGE,
  DEFAULT_EDITION_URI,
  DEFAULT_TERMINOLOGY_SERVER,
  INTL_DISPLAY_LANGUAGE,
  INTL_EDITION_URI,
} from '../models/annotation.model';

/** Result of edition auto-detection. */
export interface EditionInfo {
  editionUri: string;
  displayLanguage: string;
  /** Short human label for the UI, e.g. "Argentina (es)". */
  label: string;
  /** True when the Argentina edition was found on the server. */
  isArgentina: boolean;
}

/**
 * Minimal terminology service: just enough for the autocomplete-binding component.
 * Performs a FHIR ValueSet/$expand against an ECL-backed value set on the
 * configured Snowstorm server / SNOMED edition.
 */
@Injectable({ providedIn: 'root' })
export class TerminologyService {
  /** FHIR base URL (e.g. https://snowstorm.ihtsdotools.org/fhir). */
  terminologyServer = DEFAULT_TERMINOLOGY_SERVER;
  /** Edition URI used as the `url=` system for $expand. */
  editionUri = DEFAULT_EDITION_URI;
  /** Display language for returned terms. */
  displayLanguage = DEFAULT_DISPLAY_LANGUAGE;

  constructor(private http: HttpClient) {}

  setTerminologyServer(url: string) {
    this.terminologyServer = (url || '').replace(/\/$/, '');
  }

  setEditionUri(uri: string) {
    this.editionUri = uri || '';
  }

  /**
   * Detect the best edition on the current server: prefer the Argentina edition
   * (in Spanish) when present, otherwise fall back to International (English).
   * Applies the result to the service state and returns it.
   */
  detectEdition(terminologyServer?: string): Observable<EditionInfo> {
    const base = (terminologyServer || this.terminologyServer || '').replace(/\/$/, '');
    const intl: EditionInfo = {
      editionUri: INTL_EDITION_URI,
      displayLanguage: INTL_DISPLAY_LANGUAGE,
      label: 'Internacional (en)',
      isArgentina: false,
    };
    if (!base) {
      this.applyEdition(intl);
      return of(intl);
    }
    const headers = new HttpHeaders({ Accept: 'application/fhir+json' });
    return this.http
      .get<any>(`${base}/CodeSystem?_elements=version,url`, { headers })
      .pipe(
        map((bundle: any) => {
          const hasAr = (bundle?.entry ?? []).some((e: any) =>
            String(e?.resource?.version ?? '').startsWith(AR_EDITION_URI)
          );
          const info: EditionInfo = hasAr
            ? {
                editionUri: AR_EDITION_URI,
                displayLanguage: AR_DISPLAY_LANGUAGE,
                label: 'Argentina (es)',
                isArgentina: true,
              }
            : intl;
          this.applyEdition(info);
          return info;
        }),
        catchError(() => {
          this.applyEdition(intl);
          return of(intl);
        })
      );
  }

  private applyEdition(info: EditionInfo): void {
    this.editionUri = info.editionUri;
    this.displayLanguage = info.displayLanguage;
  }

  /**
   * Signature kept compatible with the ported autocomplete-binding component.
   * `binding.ecl` carries the hierarchy constraint for the selected category.
   */
  expandBindingAnswerValueSet(
    binding: { ecl?: string; valueSetUrl?: string },
    filter: string,
    offset = 0,
    count = 50,
    terminologyServer?: string,
    editionUri?: string,
    _useExpansionCache = false
  ): Observable<any> {
    const ecl = (binding?.ecl ?? '').trim();
    if (!ecl) {
      return of({ expansion: { contains: [] } });
    }
    const base = (terminologyServer || this.terminologyServer || '').replace(/\/$/, '');
    const edition = editionUri || this.editionUri;
    if (!base) {
      return of({ expansion: { contains: [] } });
    }
    const terms = typeof filter === 'string' ? filter : '';
    const lang = this.displayLanguage;

    const requestUrl =
      `${base}/ValueSet/$expand` +
      `?url=${encodeURIComponent(edition)}?fhir_vs=ecl/${encodeURIComponent(ecl)}` +
      `&count=${count}&offset=${offset}` +
      `&filter=${encodeURIComponent(terms)}` +
      `&language=${lang}&displayLanguage=${lang}`;

    const headers = new HttpHeaders({
      Accept: 'application/fhir+json',
      'Accept-Language': lang,
    });

    return this.http.get<any>(requestUrl, { headers }).pipe(
      catchError((err) => {
        console.error('ValueSet $expand failed:', err);
        return of({ expansion: { contains: [] } });
      })
    );
  }

  /**
   * Validate / look up a concept via CodeSystem/$lookup on the configured edition.
   * Returns { code, display, inactive } or null when not found.
   */
  lookupConcept(
    code: string,
    terminologyServer?: string,
    editionUri?: string
  ): Observable<{ code: string; display: string; inactive: boolean } | null> {
    const base = (terminologyServer || this.terminologyServer || '').replace(/\/$/, '');
    const edition = editionUri || this.editionUri;
    if (!base || !code) {
      return of(null);
    }
    let requestUrl =
      `${base}/CodeSystem/$lookup` +
      `?system=http://snomed.info/sct&code=${encodeURIComponent(code)}`;
    if (edition && edition !== 'http://snomed.info/sct') {
      requestUrl += `&version=${encodeURIComponent(edition)}`;
    }
    const headers = new HttpHeaders({
      Accept: 'application/fhir+json',
      'Accept-Language': this.displayLanguage,
    });
    return this.http.get<any>(requestUrl, { headers }).pipe(
      map((res: any) => {
        const params: any[] = res?.parameter ?? [];
        const display = params.find((p) => p.name === 'display')?.valueString ?? '';
        const inactive = params.find((p) => p.name === 'inactive')?.valueBoolean ?? false;
        return display ? { code, display, inactive } : null;
      }),
      catchError(() => of(null))
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import {
  DEFAULT_DISPLAY_LANGUAGE,
  DEFAULT_EDITION_URI,
  DEFAULT_TERMINOLOGY_SERVER,
} from '../models/annotation.model';

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

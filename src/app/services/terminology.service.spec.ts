import { describe, expect, it } from 'vitest';
import { firstValueFrom, of, throwError } from 'rxjs';
import { TerminologyService } from './terminology.service';
import { AR_EDITION_URI } from '../models/annotation.model';

describe('TerminologyService', () => {
  it('does not silently fall back to International after a server failure', async () => {
    const http = {
      get: () => throwError(() => new Error('offline')),
    };
    const service = new TerminologyService(http as never);

    await expect(firstValueFrom(service.detectEdition('https://terminology.invalid/fhir'))).resolves
      .toMatchObject({
        available: false,
        error: 'server-unavailable',
        label: 'Servidor terminológico no disponible',
      });
  });

  it('pins the Argentina edition only when the server advertises a version', async () => {
    const http = {
      get: () => of({ entry: [{ resource: { version: `${AR_EDITION_URI}/version/20260731` } }] }),
    };
    const service = new TerminologyService(http as never);

    await expect(firstValueFrom(service.detectEdition('https://terminology.example/fhir'))).resolves
      .toMatchObject({
        available: true,
        isArgentina: true,
        version: `${AR_EDITION_URI}/version/20260731`,
      });
  });

  it('reports no edition instead of inventing a terminology pin', async () => {
    const http = {
      get: () => of({ entry: [{ resource: { version: 'unrelated-edition' } }] }),
    };
    const service = new TerminologyService(http as never);

    await expect(firstValueFrom(service.detectEdition('https://terminology.example/fhir'))).resolves
      .toMatchObject({
        available: false,
        error: 'edition-not-found',
      });
  });
});

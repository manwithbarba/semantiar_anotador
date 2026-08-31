import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TerminologyConceptHierarchy, TerminologyService } from './terminology.service';

function lookupResponse(display: string) {
  return {
    parameter: [
      { name: 'display', valueString: display },
      { name: 'inactive', valueBoolean: false },
    ],
  };
}

describe('TerminologyService hierarchy lookup', () => {
  let service: TerminologyService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TerminologyService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TerminologyService);
    http = TestBed.inject(HttpTestingController);
    service.setDisplayLanguage('es');
  });

  afterEach(() => http.verify());

  it('requests parent/child properties and resolves only the visible neighbours', () => {
    let result: TerminologyConceptHierarchy | null | undefined;
    service
      .lookupConceptHierarchy(
        '123',
        'https://terminology.example/fhir',
        'http://snomed.info/sct/version/20260701',
        1
      )
      .subscribe((value) => (result = value));

    const hierarchyRequest = http.expectOne(
      (request) => request.urlWithParams.startsWith('https://terminology.example/fhir/CodeSystem/$lookup')
    );
    expect(hierarchyRequest.request.urlWithParams).toContain('property=parent&property=child');
    expect(hierarchyRequest.request.urlWithParams).toContain(
      'version=http%3A%2F%2Fsnomed.info%2Fsct%2Fversion%2F20260701'
    );
    hierarchyRequest.flush({
      parameter: [
        {
          name: 'property',
          part: [
            { name: 'code', valueString: 'parent' },
            { name: 'value', valueCode: 'p1' },
          ],
        },
        {
          name: 'property',
          part: [
            { name: 'code', valueString: 'child' },
            { name: 'value', valueCode: 'c1' },
          ],
        },
        {
          name: 'property',
          part: [
            { name: 'code', valueString: 'child' },
            { name: 'value', valueCode: 'c2' },
          ],
        },
      ],
    });
    expect(result).toEqual({
      code: '123',
      parents: [{ code: 'p1', display: '', inactive: false }],
      children: [{ code: 'c1', display: '', inactive: false }],
      totalParents: 1,
      totalChildren: 2,
    });

    const parentRequest = http.expectOne((request) => request.urlWithParams.includes('code=p1'));
    const childRequest = http.expectOne((request) => request.urlWithParams.includes('code=c1'));
    expect(http.match((request) => request.urlWithParams.includes('code=c2'))).toHaveLength(0);
    parentRequest.flush(lookupResponse('Parent concept'));
    childRequest.flush(lookupResponse('Child concept'));

    expect(result).toEqual({
      code: '123',
      parents: [{ code: 'p1', display: 'Parent concept', inactive: false }],
      children: [{ code: 'c1', display: 'Child concept', inactive: false }],
      totalParents: 1,
      totalChildren: 2,
    });
  });
});

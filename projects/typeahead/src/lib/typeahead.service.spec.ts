import { TestBed, inject } from '@angular/core/testing';

import { TypeaheadService } from './typeahead.service';

describe('TypeaheadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TypeaheadService]
    });
  });

  it('should be created', inject([TypeaheadService], (service: TypeaheadService) => {
    expect(service).toBeTruthy();
  }));
});

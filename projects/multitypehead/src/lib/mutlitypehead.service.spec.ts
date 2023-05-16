import { TestBed, inject } from '@angular/core/testing';

import { MutlitypeheadService } from './mutlitypehead.service';

describe('MutlitypeheadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MutlitypeheadService]
    });
  });

  it('should be created', inject([MutlitypeheadService], (service: MutlitypeheadService) => {
    expect(service).toBeTruthy();
  }));
});

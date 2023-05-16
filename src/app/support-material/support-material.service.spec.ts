import { TestBed } from '@angular/core/testing';

import { SupportMaterialService } from './support-material.service';

describe('SupportMaterialService', () => {
  let service: SupportMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

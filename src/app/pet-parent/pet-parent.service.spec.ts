import { TestBed } from '@angular/core/testing';

import { PetParentService } from './pet-parent.service';

describe('PetParentService', () => {
  let service: PetParentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetParentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { TabserviceService } from './tabservice.service';

describe('TabserviceService', () => {
  let service: TabserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

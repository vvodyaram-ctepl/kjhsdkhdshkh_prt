import { TestBed } from '@angular/core/testing';

import { PointTrackerService } from './point-tracker.service';

describe('PointTrackerService', () => {
  let service: PointTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

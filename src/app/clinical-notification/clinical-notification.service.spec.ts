import { TestBed } from '@angular/core/testing';

import { ClinicalNotificationService } from './clinical-notification.service';

describe('ClinicalNotificationService', () => {
  let service: ClinicalNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicalNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

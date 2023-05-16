import { TestBed } from '@angular/core/testing';

import { QuesResponseService } from './ques-response.service';

describe('QuesResponseService', () => {
  let service: QuesResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuesResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

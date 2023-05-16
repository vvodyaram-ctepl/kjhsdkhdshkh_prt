import { TestBed } from '@angular/core/testing';

import { ImgScoreService } from './img-score.service';

describe('ImgScoreService', () => {
  let service: ImgScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImgScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

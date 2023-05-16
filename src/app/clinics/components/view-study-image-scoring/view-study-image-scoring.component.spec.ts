import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudyImageScoringComponent } from './view-study-image-scoring.component';

describe('ViewStudyImageScoringComponent', () => {
  let component: ViewStudyImageScoringComponent;
  let fixture: ComponentFixture<ViewStudyImageScoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStudyImageScoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudyImageScoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyImageScoringComponent } from './study-image-scoring.component';

describe('StudyImageScoringComponent', () => {
  let component: StudyImageScoringComponent;
  let fixture: ComponentFixture<StudyImageScoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudyImageScoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyImageScoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetReviewComponent } from './pet-review.component';

describe('PetReviewComponent', () => {
  let component: PetReviewComponent;
  let fixture: ComponentFixture<PetReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

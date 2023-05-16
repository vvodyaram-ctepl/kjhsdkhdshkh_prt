import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssociatedStudyComponent } from './add-associated-study.component';

describe('AddAssociatedStudyComponent', () => {
  let component: AddAssociatedStudyComponent;
  let fixture: ComponentFixture<AddAssociatedStudyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssociatedStudyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssociatedStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyAssociationComponent } from './study-association.component';

describe('StudyAssociationComponent', () => {
  let component: StudyAssociationComponent;
  let fixture: ComponentFixture<StudyAssociationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudyAssociationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

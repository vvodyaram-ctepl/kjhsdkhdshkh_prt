import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientNotesComponent } from './patient-notes.component';

describe('PatientNotesComponent', () => {
  let component: PatientNotesComponent;
  let fixture: ComponentFixture<PatientNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientObservationsComponent } from './patient-observations.component';

describe('PatientObservationsComponent', () => {
  let component: PatientObservationsComponent;
  let fixture: ComponentFixture<PatientObservationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientObservationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientObservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

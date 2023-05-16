import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientClientInfoComponent } from './patient-client-info.component';

describe('PatientClientInfoComponent', () => {
  let component: PatientClientInfoComponent;
  let fixture: ComponentFixture<PatientClientInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientClientInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientClientInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDeviceDetailsComponent } from './patient-device-details.component';

describe('PatientDeviceDetailsComponent', () => {
  let component: PatientDeviceDetailsComponent;
  let fixture: ComponentFixture<PatientDeviceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientDeviceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDeviceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

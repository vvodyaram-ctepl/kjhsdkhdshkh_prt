import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewClinicComponent } from './add-new-clinic.component';

describe('AddNewClinicComponent', () => {
  let component: AddNewClinicComponent;
  let fixture: ComponentFixture<AddNewClinicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewClinicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewClinicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

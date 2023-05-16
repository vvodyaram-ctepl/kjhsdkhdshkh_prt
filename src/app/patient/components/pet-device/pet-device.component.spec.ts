import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetDeviceComponent } from './pet-device.component';

describe('PetDeviceComponent', () => {
  let component: PetDeviceComponent;
  let fixture: ComponentFixture<PetDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

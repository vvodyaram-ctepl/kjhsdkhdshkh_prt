import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceInformationComponent } from './device-information.component';

describe('DeviceInformationComponent', () => {
  let component: DeviceInformationComponent;
  let fixture: ComponentFixture<DeviceInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

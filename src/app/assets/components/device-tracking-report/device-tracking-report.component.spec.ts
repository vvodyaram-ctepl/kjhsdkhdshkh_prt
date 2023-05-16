import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceTrackingReportComponent } from './device-tracking-report.component';

describe('DeviceTrackingReportComponent', () => {
  let component: DeviceTrackingReportComponent;
  let fixture: ComponentFixture<DeviceTrackingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceTrackingReportComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceTrackingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalNotificationComponent } from './clinical-notification.component';

describe('ClinicalNotificationComponent', () => {
  let component: ClinicalNotificationComponent;
  let fixture: ComponentFixture<ClinicalNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicalNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

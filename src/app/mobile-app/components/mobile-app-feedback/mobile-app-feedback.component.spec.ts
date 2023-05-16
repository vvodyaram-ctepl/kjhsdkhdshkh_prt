import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileAppFeedbackComponent } from './mobile-app-feedback.component';

describe('MobileAppFeedbackComponent', () => {
  let component: MobileAppFeedbackComponent;
  let fixture: ComponentFixture<MobileAppFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileAppFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileAppFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

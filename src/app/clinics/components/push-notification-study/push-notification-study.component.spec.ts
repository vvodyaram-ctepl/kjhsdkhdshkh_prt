import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PushNotificationStudyComponent } from './push-notification-study.component';

describe('PushNotificationStudyComponent', () => {
  let component: PushNotificationStudyComponent;
  let fixture: ComponentFixture<PushNotificationStudyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PushNotificationStudyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushNotificationStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

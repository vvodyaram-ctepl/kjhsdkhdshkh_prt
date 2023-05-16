import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPushNotificationComponent } from './add-push-notification.component';

describe('AddPushNotificationComponent', () => {
  let component: AddPushNotificationComponent;
  let fixture: ComponentFixture<AddPushNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPushNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPushNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

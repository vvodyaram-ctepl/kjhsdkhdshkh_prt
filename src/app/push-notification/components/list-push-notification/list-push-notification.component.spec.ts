import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPushNotificationComponent } from './list-push-notification.component';

describe('ListPushNotificationComponent', () => {
  let component: ListPushNotificationComponent;
  let fixture: ComponentFixture<ListPushNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPushNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPushNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

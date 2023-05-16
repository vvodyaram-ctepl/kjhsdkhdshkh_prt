import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPushComponent } from './view-push.component';

describe('ViewPushComponent', () => {
  let component: ViewPushComponent;
  let fixture: ComponentFixture<ViewPushComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPushComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

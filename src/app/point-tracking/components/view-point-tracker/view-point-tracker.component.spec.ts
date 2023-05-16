import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPointTrackerComponent } from './view-point-tracker.component';

describe('ViewPointTrackerComponent', () => {
  let component: ViewPointTrackerComponent;
  let fixture: ComponentFixture<ViewPointTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPointTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPointTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

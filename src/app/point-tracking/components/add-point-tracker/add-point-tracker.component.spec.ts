import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPointTrackerComponent } from './add-point-tracker.component';

describe('AddPointTrackerComponent', () => {
  let component: AddPointTrackerComponent;
  let fixture: ComponentFixture<AddPointTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPointTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPointTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

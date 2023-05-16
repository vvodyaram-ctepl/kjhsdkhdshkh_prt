import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityFactorComponent } from './activity-factor.component';

describe('ActivityFactorComponent', () => {
  let component: ActivityFactorComponent;
  let fixture: ComponentFixture<ActivityFactorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityFactorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

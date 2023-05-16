import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewActivityFactorComponent } from './view-activity-factor.component';

describe('ViewActivityFactorComponent', () => {
  let component: ViewActivityFactorComponent;
  let fixture: ComponentFixture<ViewActivityFactorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewActivityFactorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewActivityFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPatientTabsComponent } from './view-patient-tabs.component';

describe('ViewPatientTabsComponent', () => {
  let component: ViewPatientTabsComponent;
  let fixture: ComponentFixture<ViewPatientTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPatientTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPatientTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

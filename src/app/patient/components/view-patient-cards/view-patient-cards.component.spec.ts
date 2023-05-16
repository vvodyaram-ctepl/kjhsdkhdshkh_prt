import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPatientCardsComponent } from './view-patient-cards.component';

describe('ViewPatientCardsComponent', () => {
  let component: ViewPatientCardsComponent;
  let fixture: ComponentFixture<ViewPatientCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPatientCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPatientCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

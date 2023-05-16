import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestionnaireComponent } from './create-questionnaire.component';

describe('CreateQuestionnaireComponent', () => {
  let component: CreateQuestionnaireComponent;
  let fixture: ComponentFixture<CreateQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

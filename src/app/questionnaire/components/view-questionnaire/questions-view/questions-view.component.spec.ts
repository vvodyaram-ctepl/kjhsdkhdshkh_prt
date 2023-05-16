import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsViewComponent } from './questions-view.component';

describe('QuestionsViewComponent', () => {
  let component: QuestionsViewComponent;
  let fixture: ComponentFixture<QuestionsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

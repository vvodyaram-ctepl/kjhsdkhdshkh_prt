import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQuesReponseComponent } from './view-ques-reponse.component';

describe('ViewQuesReponseComponent', () => {
  let component: ViewQuesReponseComponent;
  let fixture: ComponentFixture<ViewQuesReponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewQuesReponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewQuesReponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

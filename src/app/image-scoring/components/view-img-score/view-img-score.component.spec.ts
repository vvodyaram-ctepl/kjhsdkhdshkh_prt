import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewImgScoreComponent } from './view-img-score.component';

describe('ViewImgScoreComponent', () => {
  let component: ViewImgScoreComponent;
  let fixture: ComponentFixture<ViewImgScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewImgScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewImgScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

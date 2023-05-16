import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListImgScoreComponent } from './list-img-score.component';

describe('ListImgScoreComponent', () => {
  let component: ListImgScoreComponent;
  let fixture: ComponentFixture<ListImgScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListImgScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListImgScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

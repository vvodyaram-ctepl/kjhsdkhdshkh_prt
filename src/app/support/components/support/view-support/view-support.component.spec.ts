import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSupportComponent } from './view-support.component';

describe('ViewSupportComponent', () => {
  let component: ViewSupportComponent;
  let fixture: ComponentFixture<ViewSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPrevilegeComponent } from './view-previlege.component';

describe('ViewPrevilegeComponent', () => {
  let component: ViewPrevilegeComponent;
  let fixture: ComponentFixture<ViewPrevilegeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPrevilegeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPrevilegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

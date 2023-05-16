import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRolesComponent } from './view-roles.component';

describe('ViewRolesComponent', () => {
  let component: ViewRolesComponent;
  let fixture: ComponentFixture<ViewRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

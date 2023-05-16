import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClinicUsersComponent } from './list-clinic-users.component';

describe('ListClinicUsersComponent', () => {
  let component: ListClinicUsersComponent;
  let fixture: ComponentFixture<ListClinicUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListClinicUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClinicUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupportComponent } from './add-support.component';

describe('AddSupportComponent', () => {
  let component: AddSupportComponent;
  let fixture: ComponentFixture<AddSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPetParentComponent } from './add-pet-parent.component';

describe('AddPetParentComponent', () => {
  let component: AddPetParentComponent;
  let fixture: ComponentFixture<AddPetParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPetParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPetParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

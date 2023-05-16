import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetParentInfoComponent } from './pet-parent-info.component';

describe('PetParentInfoComponent', () => {
  let component: PetParentInfoComponent;
  let fixture: ComponentFixture<PetParentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetParentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetParentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

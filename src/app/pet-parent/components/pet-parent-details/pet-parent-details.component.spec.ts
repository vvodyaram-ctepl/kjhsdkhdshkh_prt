import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetParentDetailsComponent } from './pet-parent-details.component';

describe('PetParentDetailsComponent', () => {
  let component: PetParentDetailsComponent;
  let fixture: ComponentFixture<PetParentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetParentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetParentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

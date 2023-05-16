import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetParentComponent } from './pet-parent.component';

describe('PetParentComponent', () => {
  let component: PetParentComponent;
  let fixture: ComponentFixture<PetParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

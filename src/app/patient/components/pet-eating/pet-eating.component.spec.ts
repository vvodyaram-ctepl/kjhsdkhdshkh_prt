import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetEatingComponent } from './pet-eating.component';

describe('PetEatingComponent', () => {
  let component: PetEatingComponent;
  let fixture: ComponentFixture<PetEatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetEatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetEatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociatePetComponent } from './associate-pet.component';

describe('AssociatePetComponent', () => {
  let component: AssociatePetComponent;
  let fixture: ComponentFixture<AssociatePetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociatePetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociatePetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

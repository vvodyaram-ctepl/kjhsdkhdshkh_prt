import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetStudyComponent } from './pet-study.component';

describe('PetStudyComponent', () => {
  let component: PetStudyComponent;
  let fixture: ComponentFixture<PetStudyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetStudyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupportMaterialComponent } from './add-support-material.component';

describe('AddSupportMaterialComponent', () => {
  let component: AddSupportMaterialComponent;
  let fixture: ComponentFixture<AddSupportMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSupportMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSupportMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

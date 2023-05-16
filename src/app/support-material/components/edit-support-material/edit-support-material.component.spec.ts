import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSupportMaterialComponent } from './edit-support-material.component';

describe('EditSupportMaterialComponent', () => {
  let component: EditSupportMaterialComponent;
  let fixture: ComponentFixture<EditSupportMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSupportMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSupportMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

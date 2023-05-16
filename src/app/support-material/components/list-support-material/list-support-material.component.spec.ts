import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSupportMaterialComponent } from './list-support-material.component';

describe('ListSupportMaterialComponent', () => {
  let component: ListSupportMaterialComponent;
  let fixture: ComponentFixture<ListSupportMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSupportMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSupportMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

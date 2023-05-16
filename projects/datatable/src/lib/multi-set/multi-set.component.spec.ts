import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSetComponent } from './multi-set.component';

describe('MultiSetComponent', () => {
  let component: MultiSetComponent;
  let fixture: ComponentFixture<MultiSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

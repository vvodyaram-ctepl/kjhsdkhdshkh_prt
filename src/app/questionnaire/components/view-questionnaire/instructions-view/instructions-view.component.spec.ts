import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionsViewComponent } from './instructions-view.component';

describe('InstructionsViewComponent', () => {
  let component: InstructionsViewComponent;
  let fixture: ComponentFixture<InstructionsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructionsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

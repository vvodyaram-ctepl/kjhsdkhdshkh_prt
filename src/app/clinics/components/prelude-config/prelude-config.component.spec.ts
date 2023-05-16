import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreludeConfigComponent } from './prelude-config.component';

describe('PreludeConfigComponent', () => {
  let component: PreludeConfigComponent;
  let fixture: ComponentFixture<PreludeConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreludeConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreludeConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

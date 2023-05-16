import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPreludeConfigComponent } from './view-prelude-config.component';

describe('ViewPreludeConfigComponent', () => {
  let component: ViewPreludeConfigComponent;
  let fixture: ComponentFixture<ViewPreludeConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPreludeConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPreludeConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

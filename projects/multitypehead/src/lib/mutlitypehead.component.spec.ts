import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutlitypeheadComponent } from './mutlitypehead.component';

describe('MutlitypeheadComponent', () => {
  let component: MutlitypeheadComponent;
  let fixture: ComponentFixture<MutlitypeheadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutlitypeheadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutlitypeheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

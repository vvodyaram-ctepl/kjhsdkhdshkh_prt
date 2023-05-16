import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileAppConfigComponent } from './mobile-app-config.component';

describe('MobileAppConfigComponent', () => {
  let component: MobileAppConfigComponent;
  let fixture: ComponentFixture<MobileAppConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileAppConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileAppConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

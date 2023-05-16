import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmwareVersionsComponent } from './firmware-versions.component';

describe('FirmwareVersionsComponent', () => {
  let component: FirmwareVersionsComponent;
  let fixture: ComponentFixture<FirmwareVersionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirmwareVersionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmwareVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

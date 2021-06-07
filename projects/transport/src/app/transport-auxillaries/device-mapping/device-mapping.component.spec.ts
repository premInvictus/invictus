import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceMappingComponent } from './device-mapping.component';

describe('DeviceMappingComponent', () => {
  let component: DeviceMappingComponent;
  let fixture: ComponentFixture<DeviceMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

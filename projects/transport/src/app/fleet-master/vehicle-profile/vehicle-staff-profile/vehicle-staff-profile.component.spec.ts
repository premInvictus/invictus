import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleStaffProfileComponent } from './vehicle-staff-profile.component';

describe('VehicleStaffProfileComponent', () => {
  let component: VehicleStaffProfileComponent;
  let fixture: ComponentFixture<VehicleStaffProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleStaffProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleStaffProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

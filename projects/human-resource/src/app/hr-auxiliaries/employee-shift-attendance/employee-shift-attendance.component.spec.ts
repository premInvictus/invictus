import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeShiftAttendanceComponent } from './employee-shift-attendance.component';

describe('EmployeeShiftAttendanceComponent', () => {
  let component: EmployeeShiftAttendanceComponent;
  let fixture: ComponentFixture<EmployeeShiftAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeShiftAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeShiftAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

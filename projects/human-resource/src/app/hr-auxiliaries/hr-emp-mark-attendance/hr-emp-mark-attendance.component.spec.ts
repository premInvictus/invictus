import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrEmpMarkAttendanceComponent } from './hr-emp-mark-attendance.component';

describe('HrEmpMarkAttendanceComponent', () => {
  let component: HrEmpMarkAttendanceComponent;
  let fixture: ComponentFixture<HrEmpMarkAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrEmpMarkAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrEmpMarkAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

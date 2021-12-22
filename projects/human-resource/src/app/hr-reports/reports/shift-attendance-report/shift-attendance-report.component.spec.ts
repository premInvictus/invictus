import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftAttendanceReportComponent } from './shift-attendance-report.component';

describe('ShiftAttendanceReportComponent', () => {
  let component: ShiftAttendanceReportComponent;
  let fixture: ComponentFixture<ShiftAttendanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftAttendanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftAttendanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

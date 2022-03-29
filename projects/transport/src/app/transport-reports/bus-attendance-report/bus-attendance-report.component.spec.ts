import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusAttendanceReportsComponent } from './running-log-reports.component';

describe('BusAttendanceReportsComponent', () => {
  let component: BusAttendanceReportsComponent;
  let fixture: ComponentFixture<BusAttendanceReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusAttendanceReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusAttendanceReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

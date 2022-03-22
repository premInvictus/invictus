import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAllotmentReportComponent } from './teacher-allotment-report.component';

describe('TeacherAllotmentReportComponent', () => {
  let component: TeacherAllotmentReportComponent;
  let fixture: ComponentFixture<TeacherAllotmentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherAllotmentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherAllotmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

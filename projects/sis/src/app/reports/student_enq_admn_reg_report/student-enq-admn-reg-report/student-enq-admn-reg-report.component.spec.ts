import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEnqAdmnRegReportComponent } from './student-enq-admn-reg-report.component';

describe('StudentEnqAdmnRegReportComponent', () => {
  let component: StudentEnqAdmnRegReportComponent;
  let fixture: ComponentFixture<StudentEnqAdmnRegReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentEnqAdmnRegReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentEnqAdmnRegReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

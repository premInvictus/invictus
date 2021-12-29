import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusProgressReportComponent } from './syllabus-progress-report.component';

describe('SyllabusProgressReportComponent', () => {
  let component: SyllabusProgressReportComponent;
  let fixture: ComponentFixture<SyllabusProgressReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyllabusProgressReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyllabusProgressReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

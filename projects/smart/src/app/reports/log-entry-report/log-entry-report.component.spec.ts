import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogEntryReportComponent } from './log-entry-report.component';

describe('LogEntryReportComponent', () => {
  let component: LogEntryReportComponent;
  let fixture: ComponentFixture<LogEntryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogEntryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogEntryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

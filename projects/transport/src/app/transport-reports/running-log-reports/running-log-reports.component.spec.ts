import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningLogReportsComponent } from './running-log-reports.component';

describe('RunningLogReportsComponent', () => {
  let component: RunningLogReportsComponent;
  let fixture: ComponentFixture<RunningLogReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunningLogReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunningLogReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodicalLogReportComponent } from './periodical-log-report.component';

describe('PeriodicalLogReportComponent', () => {
  let component: PeriodicalLogReportComponent;
  let fixture: ComponentFixture<PeriodicalLogReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodicalLogReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodicalLogReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

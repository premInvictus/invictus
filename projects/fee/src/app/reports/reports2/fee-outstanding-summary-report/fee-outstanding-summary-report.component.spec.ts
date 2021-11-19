import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeOutstandingSummaryReportComponent } from './fee-outstanding-summary-report.component';

describe('FeeOutstandingSummaryReportComponent', () => {
  let component: FeeOutstandingSummaryReportComponent;
  let fixture: ComponentFixture<FeeOutstandingSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeOutstandingSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeOutstandingSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarizedFeeReviewReportComponent } from './summarized-fee-review-report.component';

describe('SummarizedFeeReviewReportComponent', () => {
  let component: SummarizedFeeReviewReportComponent;
  let fixture: ComponentFixture<SummarizedFeeReviewReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummarizedFeeReviewReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarizedFeeReviewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

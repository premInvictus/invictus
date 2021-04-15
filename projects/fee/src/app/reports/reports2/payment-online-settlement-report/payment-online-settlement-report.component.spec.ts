import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOnlineSettlementReportComponent } from './payment-online-settlement-report.component';

describe('PaymentOnlineSettlementReportComponent', () => {
  let component: PaymentOnlineSettlementReportComponent;
  let fixture: ComponentFixture<PaymentOnlineSettlementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentOnlineSettlementReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentOnlineSettlementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

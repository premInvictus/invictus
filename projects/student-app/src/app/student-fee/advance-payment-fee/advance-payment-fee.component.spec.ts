import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePaymentFeeComponent } from './advance-payment-fee.component';

describe('AdvancePaymentFeeComponent', () => {
  let component: AdvancePaymentFeeComponent;
  let fixture: ComponentFixture<AdvancePaymentFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancePaymentFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancePaymentFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOrderModalComponent } from './payment-order-modal.component';

describe('PaymentOrderModalComponent', () => {
  let component: PaymentOrderModalComponent;
  let fixture: ComponentFixture<PaymentOrderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentOrderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

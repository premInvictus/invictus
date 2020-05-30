import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakePaymentViaEazypayComponent } from './make-payment-via-eazypay.component';

describe('MakePaymentViaEazypayComponent', () => {
  let component: MakePaymentViaEazypayComponent;
  let fixture: ComponentFixture<MakePaymentViaEazypayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakePaymentViaEazypayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakePaymentViaEazypayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

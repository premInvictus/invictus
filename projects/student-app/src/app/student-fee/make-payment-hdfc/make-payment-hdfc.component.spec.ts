import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakePaymentHdfcComponent } from './make-payment-hdfc.component';

describe('MakePaymentHdfcComponent', () => {
  let component: MakePaymentHdfcComponent;
  let fixture: ComponentFixture<MakePaymentHdfcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakePaymentHdfcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakePaymentHdfcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

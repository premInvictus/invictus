import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakePaymentPayuComponent } from './make-payment-payu.component';

describe('MakePaymentPayuComponent', () => {
  let component: MakePaymentPayuComponent;
  let fixture: ComponentFixture<MakePaymentPayuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakePaymentPayuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakePaymentPayuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

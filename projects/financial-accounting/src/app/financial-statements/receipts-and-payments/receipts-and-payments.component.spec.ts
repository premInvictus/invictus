import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptAndPaymentsComponent } from './receipts-and-payments.component';

describe('ReceiptAndPaymentsComponent', () => {
  let component: ReceiptAndPaymentsComponent;
  let fixture: ComponentFixture<ReceiptAndPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptAndPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptAndPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

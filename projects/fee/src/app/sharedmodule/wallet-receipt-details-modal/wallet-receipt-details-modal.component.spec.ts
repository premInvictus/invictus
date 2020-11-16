import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletReceiptDetailsModalComponent } from './wallet-receipt-details-modal.component';

describe('WalletReceiptDetailsModalComponent', () => {
  let component: WalletReceiptDetailsModalComponent;
  let fixture: ComponentFixture<WalletReceiptDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletReceiptDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletReceiptDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

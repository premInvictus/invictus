import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkWalletTransactionComponent } from './bulk-wallet-transaction.component';

describe('BulkWalletTransactionComponent', () => {
  let component: BulkWalletTransactionComponent;
  let fixture: ComponentFixture<BulkWalletTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkWalletTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkWalletTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

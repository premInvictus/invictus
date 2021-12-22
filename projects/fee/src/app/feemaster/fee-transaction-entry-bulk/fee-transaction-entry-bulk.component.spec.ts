import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeTransactionEntryBulkComponent } from './fee-transaction-entry-bulk.component';

describe('FeeTransactionEntryBulkComponent', () => {
  let component: FeeTransactionEntryBulkComponent;
  let fixture: ComponentFixture<FeeTransactionEntryBulkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeTransactionEntryBulkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeTransactionEntryBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

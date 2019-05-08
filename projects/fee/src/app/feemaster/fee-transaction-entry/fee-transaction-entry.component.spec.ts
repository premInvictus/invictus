import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeTransactionEntryComponent } from './fee-transaction-entry.component';

describe('FeeTransactionEntryComponent', () => {
  let component: FeeTransactionEntryComponent;
  let fixture: ComponentFixture<FeeTransactionEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeTransactionEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeTransactionEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

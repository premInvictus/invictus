import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeLedgerComponent } from './fee-ledger.component';

describe('FeeLedgerComponent', () => {
  let component: FeeLedgerComponent;
  let fixture: ComponentFixture<FeeLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

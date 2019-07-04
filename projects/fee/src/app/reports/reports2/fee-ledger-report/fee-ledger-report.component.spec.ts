import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeLedgerReportComponent } from './fee-ledger-report.component';

describe('FeeLedgerReportComponent', () => {
  let component: FeeLedgerReportComponent;
  let fixture: ComponentFixture<FeeLedgerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeLedgerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeLedgerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

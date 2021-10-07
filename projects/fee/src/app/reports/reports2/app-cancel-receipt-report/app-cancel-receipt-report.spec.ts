import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelReceiptReportComponent } from './app-cancel-receipt-report.component';

describe('DeletedReceiptReportComponent', () => {
  let component: CancelReceiptReportComponent;
  let fixture: ComponentFixture<CancelReceiptReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelReceiptReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelReceiptReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

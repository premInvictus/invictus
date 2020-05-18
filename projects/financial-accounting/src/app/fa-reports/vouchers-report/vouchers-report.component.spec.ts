import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchersReportComponent } from './vouchers-report.component';

describe('VouchersReportComponent', () => {
  let component: VouchersReportComponent;
  let fixture: ComponentFixture<VouchersReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VouchersReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VouchersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

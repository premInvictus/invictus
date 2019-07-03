import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityDepositReportComponent } from './security-deposit-report.component';

describe('SecurityDepositReportComponent', () => {
  let component: SecurityDepositReportComponent;
  let fixture: ComponentFixture<SecurityDepositReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityDepositReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityDepositReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

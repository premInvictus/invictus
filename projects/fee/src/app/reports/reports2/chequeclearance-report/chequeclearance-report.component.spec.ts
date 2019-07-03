import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeclearanceReportComponent } from './chequeclearance-report.component';

describe('ChequeclearanceReportComponent', () => {
  let component: ChequeclearanceReportComponent;
  let fixture: ComponentFixture<ChequeclearanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequeclearanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeclearanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

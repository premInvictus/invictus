import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementReportComponent } from './procurement-report.component';

describe('ProcurementReportComponent', () => {
  let component: ProcurementReportComponent;
  let fixture: ComponentFixture<ProcurementReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcurementReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

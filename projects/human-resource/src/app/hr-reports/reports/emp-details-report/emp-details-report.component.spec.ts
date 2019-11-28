import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpDetailsReportComponent } from './emp-details-report.component';

describe('EmpDetailsReportComponent', () => {
  let component: EmpDetailsReportComponent;
  let fixture: ComponentFixture<EmpDetailsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpDetailsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

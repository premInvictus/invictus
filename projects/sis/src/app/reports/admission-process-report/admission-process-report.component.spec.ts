import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionProcessReportComponent } from './admission-process-report.component';

describe('AdmissionProcessReportComponent', () => {
  let component: AdmissionProcessReportComponent;
  let fixture: ComponentFixture<AdmissionProcessReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmissionProcessReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionProcessReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

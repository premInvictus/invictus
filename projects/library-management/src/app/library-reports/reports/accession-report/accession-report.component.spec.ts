import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessionReportComponent } from './accession-report.component';

describe('AccessionReportComponent', () => {
  let component: AccessionReportComponent;
  let fixture: ComponentFixture<AccessionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

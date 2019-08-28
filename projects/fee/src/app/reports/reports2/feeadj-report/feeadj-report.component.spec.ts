import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeadjReportComponent } from './feeadj-report.component';

describe('FeeadjReportComponent', () => {
  let component: FeeadjReportComponent;
  let fixture: ComponentFixture<FeeadjReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeadjReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeadjReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

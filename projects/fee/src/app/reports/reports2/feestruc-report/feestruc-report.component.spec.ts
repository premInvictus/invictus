import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeestrucReportComponent } from './feestruc-report.component';

describe('FeestrucReportComponent', () => {
  let component: FeestrucReportComponent;
  let fixture: ComponentFixture<FeestrucReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeestrucReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeestrucReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtcReportComponent } from './etc-report.component';

describe('EtcReportComponent', () => {
  let component: EtcReportComponent;
  let fixture: ComponentFixture<EtcReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtcReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtcReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

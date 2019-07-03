import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingFeeinvReportComponent } from './missing-feeinv-report.component';

describe('MissingFeeinvReportComponent', () => {
  let component: MissingFeeinvReportComponent;
  let fixture: ComponentFixture<MissingFeeinvReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingFeeinvReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingFeeinvReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

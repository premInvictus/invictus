import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeconReportComponent } from './feecon-report.component';

describe('FeeconReportComponent', () => {
  let component: FeeconReportComponent;
  let fixture: ComponentFixture<FeeconReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeconReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeconReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

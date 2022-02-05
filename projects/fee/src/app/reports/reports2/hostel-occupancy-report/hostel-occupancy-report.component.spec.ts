import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelOccupancyReportComponent } from './hostel-occupancy-report.component';

describe('HostelOccupancyReportComponent', () => {
  let component: HostelOccupancyReportComponent;
  let fixture: ComponentFixture<HostelOccupancyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostelOccupancyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelOccupancyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

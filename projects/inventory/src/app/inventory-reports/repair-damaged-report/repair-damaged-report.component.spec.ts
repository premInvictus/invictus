import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairDamagedReportComponent } from './repair-damaged-report.component';

describe('RepairDamagedReportComponent', () => {
  let component: RepairDamagedReportComponent;
  let fixture: ComponentFixture<RepairDamagedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairDamagedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairDamagedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

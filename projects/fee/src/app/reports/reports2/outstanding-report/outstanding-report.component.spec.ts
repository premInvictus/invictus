import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingReportComponent } from './outstanding-report.component';

describe('OutstandingReportComponent', () => {
  let component: OutstandingReportComponent;
  let fixture: ComponentFixture<OutstandingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgersReportComponent } from './ledgers-report.component';

describe('LedgersReportComponent', () => {
  let component: LedgersReportComponent;
  let fixture: ComponentFixture<LedgersReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgersReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

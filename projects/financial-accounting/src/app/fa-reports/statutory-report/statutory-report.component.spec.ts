import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatutoryReportComponent } from './statutory-report.component';

describe('StatutoryReportComponent', () => {
  let component: StatutoryReportComponent;
  let fixture: ComponentFixture<StatutoryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatutoryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatutoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

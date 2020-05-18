import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeingReportComponent } from './ageing-report.component';

describe('AgeingReportComponent', () => {
  let component: AgeingReportComponent;
  let fixture: ComponentFixture<AgeingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgeingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarksReportComponent } from './remarks-report.component';

describe('RemarksReportComponent', () => {
  let component: RemarksReportComponent;
  let fixture: ComponentFixture<RemarksReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemarksReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemarksReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarkProgressReportModelComponent } from './remark-progress-report-model.component';

describe('RemarkProgressReportModelComponent', () => {
  let component: RemarkProgressReportModelComponent;
  let fixture: ComponentFixture<RemarkProgressReportModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemarkProgressReportModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemarkProgressReportModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

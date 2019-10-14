import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueReturnReportComponent } from './issue-return-report.component';

describe('IssueReturnReportComponent', () => {
  let component: IssueReturnReportComponent;
  let fixture: ComponentFixture<IssueReturnReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueReturnReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueReturnReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastAssignmentsReportComponent } from './past-assignments-report.component';

describe('PastAssignmentsReportComponent', () => {
  let component: PastAssignmentsReportComponent;
  let fixture: ComponentFixture<PastAssignmentsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastAssignmentsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastAssignmentsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

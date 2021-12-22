import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicwiseReportOverviewComponent } from './topicwise-report-overview.component';

describe('TopicwiseReportOverviewComponent', () => {
  let component: TopicwiseReportOverviewComponent;
  let fixture: ComponentFixture<TopicwiseReportOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicwiseReportOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicwiseReportOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

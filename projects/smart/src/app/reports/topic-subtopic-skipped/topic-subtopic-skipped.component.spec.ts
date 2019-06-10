import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicSubtopicSkippedComponent } from './topic-subtopic-skipped.component';

describe('TopicSubtopicSkippedComponent', () => {
  let component: TopicSubtopicSkippedComponent;
  let fixture: ComponentFixture<TopicSubtopicSkippedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicSubtopicSkippedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicSubtopicSkippedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

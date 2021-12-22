import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicwiseUpdateComponent } from './topicwise-update.component';

describe('TopicwiseUpdateComponent', () => {
  let component: TopicwiseUpdateComponent;
  let fixture: ComponentFixture<TopicwiseUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicwiseUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicwiseUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicMapComponent } from './topic-map.component';

describe('TopicMapComponent', () => {
  let component: TopicMapComponent;
  let fixture: ComponentFixture<TopicMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

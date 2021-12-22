import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerListViewComponent } from './scheduler-list-view.component';

describe('SchedulerListViewComponent', () => {
  let component: SchedulerListViewComponent;
  let fixture: ComponentFixture<SchedulerListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

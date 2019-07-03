import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerCalenderViewComponent } from './scheduler-calender-view.component';

describe('SchedulerCalenderViewComponent', () => {
  let component: SchedulerCalenderViewComponent;
  let fixture: ComponentFixture<SchedulerCalenderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerCalenderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerCalenderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

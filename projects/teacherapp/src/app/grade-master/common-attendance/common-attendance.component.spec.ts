import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonAttendanceComponent } from './common-attendance.component';

describe('CommonAttendanceComponent', () => {
  let component: CommonAttendanceComponent;
  let fixture: ComponentFixture<CommonAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodicalAttendanceComponent } from './periodical-attendance.component';

describe('PeriodicalAttendanceComponent', () => {
  let component: PeriodicalAttendanceComponent;
  let fixture: ComponentFixture<PeriodicalAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodicalAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodicalAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

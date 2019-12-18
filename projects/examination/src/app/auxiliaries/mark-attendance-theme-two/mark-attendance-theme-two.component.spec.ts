import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkAttendanceThemeTwoComponent } from './mark-attendance-theme-two.component';

describe('MarkAttendanceThemeTwoComponent', () => {
  let component: MarkAttendanceThemeTwoComponent;
  let fixture: ComponentFixture<MarkAttendanceThemeTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkAttendanceThemeTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkAttendanceThemeTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

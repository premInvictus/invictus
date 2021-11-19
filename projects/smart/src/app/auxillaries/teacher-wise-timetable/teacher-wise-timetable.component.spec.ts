import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherWiseTimetableComponent } from './teacher-wise-timetable.component';

describe('TeacherWiseTimetableComponent', () => {
  let component: TeacherWiseTimetableComponent;
  let fixture: ComponentFixture<TeacherWiseTimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherWiseTimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherWiseTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

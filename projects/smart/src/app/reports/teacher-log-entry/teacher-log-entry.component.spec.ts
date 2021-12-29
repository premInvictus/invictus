import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherLogEntryComponent } from './teacher-log-entry.component';

describe('TeacherLogEntryComponent', () => {
  let component: TeacherLogEntryComponent;
  let fixture: ComponentFixture<TeacherLogEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherLogEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherLogEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

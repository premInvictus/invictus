import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAcademicProfileComponent } from './student-academic-profile.component';

describe('StudentAcademicProfileComponent', () => {
  let component: StudentAcademicProfileComponent;
  let fixture: ComponentFixture<StudentAcademicProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAcademicProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAcademicProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

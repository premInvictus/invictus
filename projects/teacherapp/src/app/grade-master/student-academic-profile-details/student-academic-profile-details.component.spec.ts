import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAcademicProfileDetailsComponent } from './student-academic-profile-details.component';

describe('StudentAcademicProfileDetailsComponent', () => {
  let component: StudentAcademicProfileDetailsComponent;
  let fixture: ComponentFixture<StudentAcademicProfileDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAcademicProfileDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAcademicProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

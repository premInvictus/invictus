import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTestConfirmationScreenComponent } from './student-test-confirmation-screen.component';

describe('StudentTestConfirmationScreenComponent', () => {
  let component: StudentTestConfirmationScreenComponent;
  let fixture: ComponentFixture<StudentTestConfirmationScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentTestConfirmationScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentTestConfirmationScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

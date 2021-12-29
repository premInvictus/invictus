import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentVerificationModalComponent } from './student-verification-modal.component';

describe('StudentVerificationModalComponent', () => {
  let component: StudentVerificationModalComponent;
  let fixture: ComponentFixture<StudentVerificationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentVerificationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentVerificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

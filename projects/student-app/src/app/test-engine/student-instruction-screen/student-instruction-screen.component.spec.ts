import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInstructionScreenComponent } from './student-instruction-screen.component';

describe('StudentInstructionScreenComponent', () => {
  let component: StudentInstructionScreenComponent;
  let fixture: ComponentFixture<StudentInstructionScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentInstructionScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentInstructionScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

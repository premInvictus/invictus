import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentOngoingTestScreenComponent } from './student-ongoing-test-screen.component';

describe('StudentOngoingTestScreenComponent', () => {
  let component: StudentOngoingTestScreenComponent;
  let fixture: ComponentFixture<StudentOngoingTestScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentOngoingTestScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentOngoingTestScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

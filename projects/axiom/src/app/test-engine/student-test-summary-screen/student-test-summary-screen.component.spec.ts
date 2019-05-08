import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTestSummaryScreenComponent } from './student-test-summary-screen.component';

describe('StudentTestSummaryScreenComponent', () => {
  let component: StudentTestSummaryScreenComponent;
  let fixture: ComponentFixture<StudentTestSummaryScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentTestSummaryScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentTestSummaryScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

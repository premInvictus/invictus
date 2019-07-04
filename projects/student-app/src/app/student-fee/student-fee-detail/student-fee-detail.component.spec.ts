import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFeeDetailComponent } from './student-fee-detail.component';

describe('StudentFeeDetailComponent', () => {
  let component: StudentFeeDetailComponent;
  let fixture: ComponentFixture<StudentFeeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentFeeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentFeeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

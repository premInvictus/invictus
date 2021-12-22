import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentReviewComponent } from './assignment-review.component';

describe('AssignmentReviewComponent', () => {
  let component: AssignmentReviewComponent;
  let fixture: ComponentFixture<AssignmentReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

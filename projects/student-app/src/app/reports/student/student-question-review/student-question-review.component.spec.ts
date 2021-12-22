import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentQuestionReviewComponent } from './student-question-review.component';

describe('StudentQuestionReviewComponent', () => {
	let component: StudentQuestionReviewComponent;
	let fixture: ComponentFixture<StudentQuestionReviewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ StudentQuestionReviewComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StudentQuestionReviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

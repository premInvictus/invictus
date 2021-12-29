import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryReviewQuestionComponent } from './secondary-review-question.component';

describe('SecondaryReviewQuestionComponent', () => {
	let component: SecondaryReviewQuestionComponent;
	let fixture: ComponentFixture<SecondaryReviewQuestionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SecondaryReviewQuestionComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SecondaryReviewQuestionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryReviewSubjectiveComponent } from './secondary-review-subjective.component';

describe('SecondaryReviewSubjectiveComponent', () => {
	let component: SecondaryReviewSubjectiveComponent;
	let fixture: ComponentFixture<SecondaryReviewSubjectiveComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SecondaryReviewSubjectiveComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SecondaryReviewSubjectiveComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

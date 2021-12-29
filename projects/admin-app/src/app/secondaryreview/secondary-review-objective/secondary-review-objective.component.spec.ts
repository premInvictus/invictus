import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryReviewObjectiveComponent } from './secondary-review-objective.component';

describe('SecondaryReviewObjectiveComponent', () => {
	let component: SecondaryReviewObjectiveComponent;
	let fixture: ComponentFixture<SecondaryReviewObjectiveComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SecondaryReviewObjectiveComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SecondaryReviewObjectiveComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

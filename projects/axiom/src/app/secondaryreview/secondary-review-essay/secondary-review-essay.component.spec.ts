import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryReviewEssayComponent } from './secondary-review-essay.component';

describe('SecondaryReviewEssayComponent', () => {
	let component: SecondaryReviewEssayComponent;
	let fixture: ComponentFixture<SecondaryReviewEssayComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SecondaryReviewEssayComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SecondaryReviewEssayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewEssayComponent } from './review-essay.component';

describe('ReviewEssayComponent', () => {
	let component: ReviewEssayComponent;
	let fixture: ComponentFixture<ReviewEssayComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ReviewEssayComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ReviewEssayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

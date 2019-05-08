import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificTemplateReviewComponent } from './specific-template-review.component';

describe('SpecificTemplateReviewComponent', () => {
	let component: SpecificTemplateReviewComponent;
	let fixture: ComponentFixture<SpecificTemplateReviewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SpecificTemplateReviewComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SpecificTemplateReviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTemplateReviewComponent } from './generic-template-review.component';

describe('GenericTemplateReviewComponent', () => {
	let component: GenericTemplateReviewComponent;
	let fixture: ComponentFixture<GenericTemplateReviewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ GenericTemplateReviewComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GenericTemplateReviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

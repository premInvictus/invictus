import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericReviewPrintViewComponent } from './generic-review-print-view.component';

describe('GenericReviewPrintViewComponent', () => {
	let component: GenericReviewPrintViewComponent;
	let fixture: ComponentFixture<GenericReviewPrintViewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ GenericReviewPrintViewComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GenericReviewPrintViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

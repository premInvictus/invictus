import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuesPaperReviewViewComponent } from './ques-paper-review-view.component';

describe('QuesPaperReviewViewComponent', () => {
	let component: QuesPaperReviewViewComponent;
	let fixture: ComponentFixture<QuesPaperReviewViewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ QuesPaperReviewViewComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(QuesPaperReviewViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

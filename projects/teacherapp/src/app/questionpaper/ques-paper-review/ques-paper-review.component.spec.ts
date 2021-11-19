import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuesPaperReviewComponent } from './ques-paper-review.component';

describe('QuesPaperReviewComponent', () => {
	let component: QuesPaperReviewComponent;
	let fixture: ComponentFixture<QuesPaperReviewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ QuesPaperReviewComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(QuesPaperReviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

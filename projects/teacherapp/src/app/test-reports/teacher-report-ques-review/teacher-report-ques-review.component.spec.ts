import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherReportQuesReviewComponent } from './teacher-report-ques-review.component';

describe('TeacherReportQuesReviewComponent', () => {
	let component: TeacherReportQuesReviewComponent;
	let fixture: ComponentFixture<TeacherReportQuesReviewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ TeacherReportQuesReviewComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TeacherReportQuesReviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

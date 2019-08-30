import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClassPerformanceTopicsubtopicwiseReportComponent } from './admin-class-performance-topicsubtopicwise-report.component';

describe('AdminClassPerformanceTopicsubtopicwiseReportComponent', () => {
	let component: AdminClassPerformanceTopicsubtopicwiseReportComponent;
	let fixture: ComponentFixture<AdminClassPerformanceTopicsubtopicwiseReportComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ AdminClassPerformanceTopicsubtopicwiseReportComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdminClassPerformanceTopicsubtopicwiseReportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

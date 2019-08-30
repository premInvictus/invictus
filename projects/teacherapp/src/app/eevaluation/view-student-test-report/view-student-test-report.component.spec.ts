import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentTestReportComponent } from './view-student-test-report.component';

describe('ViewStudentTestReportComponent', () => {
	let component: ViewStudentTestReportComponent;
	let fixture: ComponentFixture<ViewStudentTestReportComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ViewStudentTestReportComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ViewStudentTestReportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

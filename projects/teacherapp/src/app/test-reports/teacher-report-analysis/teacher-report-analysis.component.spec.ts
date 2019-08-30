import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherReportAnalysisComponent } from './teacher-report-analysis.component';

describe('TeacherReportAnalysisComponent', () => {
	let component: TeacherReportAnalysisComponent;
	let fixture: ComponentFixture<TeacherReportAnalysisComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ TeacherReportAnalysisComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TeacherReportAnalysisComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

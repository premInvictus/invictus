import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherTestReportComponent } from './teacher-test-report.component';

describe('TeacherTestReportComponent', () => {
	let component: TeacherTestReportComponent;
	let fixture: ComponentFixture<TeacherTestReportComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ TeacherTestReportComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TeacherTestReportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

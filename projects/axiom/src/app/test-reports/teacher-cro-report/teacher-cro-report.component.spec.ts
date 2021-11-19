import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCroReportComponent } from './teacher-cro-report.component';

describe('TeacherCroReportComponent', () => {
	let component: TeacherCroReportComponent;
	let fixture: ComponentFixture<TeacherCroReportComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ TeacherCroReportComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TeacherCroReportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

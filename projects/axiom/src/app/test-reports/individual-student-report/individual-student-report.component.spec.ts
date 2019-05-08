import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualStudentReportComponent } from './individual-student-report.component';

describe('IndividualStudentReportComponent', () => {
	let component: IndividualStudentReportComponent;
	let fixture: ComponentFixture<IndividualStudentReportComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ IndividualStudentReportComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(IndividualStudentReportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

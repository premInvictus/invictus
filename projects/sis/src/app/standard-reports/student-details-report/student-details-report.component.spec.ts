import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDetailsReportComponent } from './student-details-report.component';

describe('StudentDetailsReportComponent', () => {
	let component: StudentDetailsReportComponent;
	let fixture: ComponentFixture<StudentDetailsReportComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [StudentDetailsReportComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StudentDetailsReportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

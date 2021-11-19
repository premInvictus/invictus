import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolStudentReportsComponent } from './school-student-reports.component';

describe('SchoolStudentReportsComponent', () => {
	let component: SchoolStudentReportsComponent;
	let fixture: ComponentFixture<SchoolStudentReportsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SchoolStudentReportsComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SchoolStudentReportsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

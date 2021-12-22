import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentScheduleExamComponent } from './student-schedule-exam.component';

describe('StudentScheduleExamComponent', () => {
	let component: StudentScheduleExamComponent;
	let fixture: ComponentFixture<StudentScheduleExamComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ StudentScheduleExamComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StudentScheduleExamComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

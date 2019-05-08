import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSubjectWisePerformanceComponent } from './student-subject-wise-performance.component';

describe('StudentSubjectWisePerformanceComponent', () => {
	let component: StudentSubjectWisePerformanceComponent;
	let fixture: ComponentFixture<StudentSubjectWisePerformanceComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ StudentSubjectWisePerformanceComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StudentSubjectWisePerformanceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

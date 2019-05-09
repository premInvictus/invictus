import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPerformanceAnalysisComponent } from './student-performance-analysis.component';

describe('StudentPerformanceAnalysisComponent', () => {
	let component: StudentPerformanceAnalysisComponent;
	let fixture: ComponentFixture<StudentPerformanceAnalysisComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ StudentPerformanceAnalysisComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StudentPerformanceAnalysisComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

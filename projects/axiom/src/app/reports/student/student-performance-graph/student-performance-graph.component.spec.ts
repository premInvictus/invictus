import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPerformanceGraphComponent } from './student-performance-graph.component';

describe('StudentPerformanceGraphComponent', () => {
	let component: StudentPerformanceGraphComponent;
	let fixture: ComponentFixture<StudentPerformanceGraphComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ StudentPerformanceGraphComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StudentPerformanceGraphComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

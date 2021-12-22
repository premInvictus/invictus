import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallStudentPerformanceComponent } from './overall-student-performance.component';

describe('OverallStudentPerformanceComponent', () => {
	let component: OverallStudentPerformanceComponent;
	let fixture: ComponentFixture<OverallStudentPerformanceComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ OverallStudentPerformanceComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OverallStudentPerformanceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

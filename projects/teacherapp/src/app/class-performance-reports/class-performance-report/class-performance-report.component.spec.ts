import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassPerformanceReportComponent } from './class-performance-report.component';

describe('ClassPerformanceReportComponent', () => {
	let component: ClassPerformanceReportComponent;
	let fixture: ComponentFixture<ClassPerformanceReportComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ClassPerformanceReportComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ClassPerformanceReportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

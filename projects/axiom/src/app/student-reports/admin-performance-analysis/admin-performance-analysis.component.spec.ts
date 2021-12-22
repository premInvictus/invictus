import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPerformanceAnalysisComponent } from './admin-performance-analysis.component';

describe('AdminPerformanceAnalysisComponent', () => {
	let component: AdminPerformanceAnalysisComponent;
	let fixture: ComponentFixture<AdminPerformanceAnalysisComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ AdminPerformanceAnalysisComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdminPerformanceAnalysisComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOverallPerformanceComponent } from './admin-overall-performance.component';

describe('AdminOverallPerformanceComponent', () => {
	let component: AdminOverallPerformanceComponent;
	let fixture: ComponentFixture<AdminOverallPerformanceComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ AdminOverallPerformanceComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdminOverallPerformanceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOverallClassPerformanceComponent } from './admin-overall-class-performance.component';

describe('AdminOverallClassPerformanceComponent', () => {
	let component: AdminOverallClassPerformanceComponent;
	let fixture: ComponentFixture<AdminOverallClassPerformanceComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ AdminOverallClassPerformanceComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdminOverallClassPerformanceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

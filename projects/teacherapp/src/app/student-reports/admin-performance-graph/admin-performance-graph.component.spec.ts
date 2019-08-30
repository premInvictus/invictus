import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPerformanceGraphComponent } from './admin-performance-graph.component';

describe('AdminPerformanceGraphComponent', () => {
	let component: AdminPerformanceGraphComponent;
	let fixture: ComponentFixture<AdminPerformanceGraphComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ AdminPerformanceGraphComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdminPerformanceGraphComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

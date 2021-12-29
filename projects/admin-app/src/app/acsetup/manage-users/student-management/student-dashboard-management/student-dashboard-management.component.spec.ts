import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDashboardManagementComponent } from './student-dashboard-management.component';

describe('StudentDashboardManagementComponent', () => {
	let component: StudentDashboardManagementComponent;
	let fixture: ComponentFixture<StudentDashboardManagementComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ StudentDashboardManagementComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StudentDashboardManagementComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCommonComponent } from './employee-common.component';

describe('EmployeeCommonComponent', () => {
	let component: EmployeeCommonComponent;
	let fixture: ComponentFixture<EmployeeCommonComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EmployeeCommonComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EmployeeCommonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

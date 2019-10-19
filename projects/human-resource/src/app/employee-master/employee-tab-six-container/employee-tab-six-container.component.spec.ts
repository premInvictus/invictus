import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTabSixContainerComponent } from './employee-tab-six-container.component';

describe('EmployeeTabSixContainerComponent', () => {
	let component: EmployeeTabSixContainerComponent;
	let fixture: ComponentFixture<EmployeeTabSixContainerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EmployeeTabSixContainerComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EmployeeTabSixContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

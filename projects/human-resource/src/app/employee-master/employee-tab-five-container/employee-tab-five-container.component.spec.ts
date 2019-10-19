import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTabFiveContainerComponent } from './employee-tab-five-container.component';

describe('EmployeeTabFiveContainerComponent', () => {
	let component: EmployeeTabFiveContainerComponent;
	let fixture: ComponentFixture<EmployeeTabFiveContainerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EmployeeTabFiveContainerComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EmployeeTabFiveContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

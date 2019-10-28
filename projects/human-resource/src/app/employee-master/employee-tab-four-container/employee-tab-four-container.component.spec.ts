import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTabFourContainerComponent } from './employee-tab-four-container.component';

describe('EmployeeTabFourContainerComponent', () => {
	let component: EmployeeTabFourContainerComponent;
	let fixture: ComponentFixture<EmployeeTabFourContainerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EmployeeTabFourContainerComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EmployeeTabFourContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

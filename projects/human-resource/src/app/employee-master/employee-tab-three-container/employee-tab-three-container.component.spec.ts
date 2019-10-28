import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTabThreeContainerComponent } from './employee-tab-three-container.component';

describe('EmployeeTabThreeContainerComponent', () => {
	let component: EmployeeTabThreeContainerComponent;
	let fixture: ComponentFixture<EmployeeTabThreeContainerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EmployeeTabThreeContainerComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EmployeeTabThreeContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

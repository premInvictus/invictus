import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTabOneContainerComponent } from './employee-tab-one-container.component';

describe('EmployeeTabOneContainerComponent', () => {
	let component: EmployeeTabOneContainerComponent;
	let fixture: ComponentFixture<EmployeeTabOneContainerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EmployeeTabOneContainerComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EmployeeTabOneContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTabTwoContainerComponent } from './employee-tab-two-container.component';

describe('EmployeeTabTwoContainerComponent', () => {
	let component: EmployeeTabTwoContainerComponent;
	let fixture: ComponentFixture<EmployeeTabTwoContainerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EmployeeTabTwoContainerComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EmployeeTabTwoContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLedgerComponent } from './employee-ledger.component';

describe('EmployeeLedgerComponent', () => {
	let component: EmployeeLedgerComponent;
	let fixture: ComponentFixture<EmployeeLedgerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EmployeeLedgerComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EmployeeLedgerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

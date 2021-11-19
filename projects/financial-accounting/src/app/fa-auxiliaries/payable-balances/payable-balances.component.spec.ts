import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableBalancesComponent } from './payable-balances.component';

describe('PayableBalancesComponent', () => {
	let component: PayableBalancesComponent;
	let fixture: ComponentFixture<PayableBalancesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ PayableBalancesComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PayableBalancesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

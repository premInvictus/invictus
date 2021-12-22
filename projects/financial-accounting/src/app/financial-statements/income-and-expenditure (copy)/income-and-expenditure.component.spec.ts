import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeAndExpenditureComponent } from './income-and-expenditure.component';

describe('IncomeAndExpenditureComponent', () => {
	let component: IncomeAndExpenditureComponent;
	let fixture: ComponentFixture<IncomeAndExpenditureComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ IncomeAndExpenditureComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(IncomeAndExpenditureComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

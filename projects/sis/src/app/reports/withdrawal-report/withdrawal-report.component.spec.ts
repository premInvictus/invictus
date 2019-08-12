import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalReportComponent } from './withdrawal-report.component';

describe('WithdrawalReportComponent', () => {
	let component: WithdrawalReportComponent;
	let fixture: ComponentFixture<WithdrawalReportComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WithdrawalReportComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WithdrawalReportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

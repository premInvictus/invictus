import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDetailsThemeTwoComponent } from './account-details-theme-two.component';

describe('AccountDetailsThemeTwoComponent', () => {
	let component: AccountDetailsThemeTwoComponent;
	let fixture: ComponentFixture<AccountDetailsThemeTwoComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AccountDetailsThemeTwoComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AccountDetailsThemeTwoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdcardPrintingSetupComponent } from './idcard-printing-setup.component';

describe('IdcardPrintingSetupComponent', () => {
	let component: IdcardPrintingSetupComponent;
	let fixture: ComponentFixture<IdcardPrintingSetupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [IdcardPrintingSetupComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(IdcardPrintingSetupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

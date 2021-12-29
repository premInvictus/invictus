import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCreationPopupComponent } from './invoice-creation-popup.component';

describe('InvoiceCreationPopupComponent', () => {
	let component: InvoiceCreationPopupComponent;
	let fixture: ComponentFixture<InvoiceCreationPopupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [InvoiceCreationPopupComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(InvoiceCreationPopupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

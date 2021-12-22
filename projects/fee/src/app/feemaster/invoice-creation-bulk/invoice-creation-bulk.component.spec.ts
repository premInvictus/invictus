import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCreationBulkComponent } from './invoice-creation-bulk.component';

describe('InvoiceCreationBulkComponent', () => {
	let component: InvoiceCreationBulkComponent;
	let fixture: ComponentFixture<InvoiceCreationBulkComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [InvoiceCreationBulkComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(InvoiceCreationBulkComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

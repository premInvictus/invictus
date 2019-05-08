import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCreationIndividualComponent } from './invoice-creation-individual.component';

describe('InvoiceCreationIndividualComponent', () => {
	let component: InvoiceCreationIndividualComponent;
	let fixture: ComponentFixture<InvoiceCreationIndividualComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [InvoiceCreationIndividualComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(InvoiceCreationIndividualComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

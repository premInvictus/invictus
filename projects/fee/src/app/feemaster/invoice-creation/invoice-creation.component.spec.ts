import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCreationComponent } from './invoice-creation.component';

describe('InvoiceCreationComponent', () => {
	let component: InvoiceCreationComponent;
	let fixture: ComponentFixture<InvoiceCreationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [InvoiceCreationComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(InvoiceCreationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

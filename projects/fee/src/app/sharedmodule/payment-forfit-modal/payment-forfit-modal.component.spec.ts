import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentForfitModalComponent } from './payment-forfit-modal.component';

describe('PaymentForfitModalComponent', () => {
	let component: PaymentForfitModalComponent;
	let fixture: ComponentFixture<PaymentForfitModalComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PaymentForfitModalComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PaymentForfitModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

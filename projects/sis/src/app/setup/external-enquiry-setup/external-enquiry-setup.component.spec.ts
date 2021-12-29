import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalEnquirySetupComponent } from './external-enquiry-setup.component';

describe('ExternalEnquirySetupComponent', () => {
	let component: ExternalEnquirySetupComponent;
	let fixture: ComponentFixture<ExternalEnquirySetupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ExternalEnquirySetupComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ExternalEnquirySetupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

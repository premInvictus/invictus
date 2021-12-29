import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquirySetupComponent } from './enquiry-setup.component';

describe('EnquirySetupComponent', () => {
	let component: EnquirySetupComponent;
	let fixture: ComponentFixture<EnquirySetupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EnquirySetupComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EnquirySetupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

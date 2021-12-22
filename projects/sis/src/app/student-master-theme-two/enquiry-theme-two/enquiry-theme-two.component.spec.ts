import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryThemeTwoComponent } from './enquiry-theme-two.component';

describe('EnquiryThemeTwoComponent', () => {
	let component: EnquiryThemeTwoComponent;
	let fixture: ComponentFixture<EnquiryThemeTwoComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EnquiryThemeTwoComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EnquiryThemeTwoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

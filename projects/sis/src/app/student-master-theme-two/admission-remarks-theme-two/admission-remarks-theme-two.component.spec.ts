import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionRemarksThemeTwoComponent } from './admission-remarks-theme-two.component';

describe('AdmissionRemarksThemeTwoComponent', () => {
	let component: AdmissionRemarksThemeTwoComponent;
	let fixture: ComponentFixture<AdmissionRemarksThemeTwoComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ AdmissionRemarksThemeTwoComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdmissionRemarksThemeTwoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionSetupComponent } from './admission-setup.component';

describe('AdmissionSetupComponent', () => {
	let component: AdmissionSetupComponent;
	let fixture: ComponentFixture<AdmissionSetupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AdmissionSetupComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdmissionSetupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

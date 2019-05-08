import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvAdmissionSetupComponent } from './prov-admission-setup.component';

describe('ProvAdmissionSetupComponent', () => {
	let component: ProvAdmissionSetupComponent;
	let fixture: ComponentFixture<ProvAdmissionSetupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ProvAdmissionSetupComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ProvAdmissionSetupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationSetupComponent } from './registration-setup.component';

describe('RegistrationSetupComponent', () => {
	let component: RegistrationSetupComponent;
	let fixture: ComponentFixture<RegistrationSetupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RegistrationSetupComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RegistrationSetupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

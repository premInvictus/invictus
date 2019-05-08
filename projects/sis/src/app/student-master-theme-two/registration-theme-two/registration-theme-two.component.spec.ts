import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationThemeTwoComponent } from './registration-theme-two.component';

describe('RegistrationThemeTwoComponent', () => {
	let component: RegistrationThemeTwoComponent;
	let fixture: ComponentFixture<RegistrationThemeTwoComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RegistrationThemeTwoComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RegistrationThemeTwoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

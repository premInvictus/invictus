import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionThemeTwoComponent } from './admission-theme-two.component';

describe('AdmissionThemeTwoComponent', () => {
	let component: AdmissionThemeTwoComponent;
	let fixture: ComponentFixture<AdmissionThemeTwoComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AdmissionThemeTwoComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdmissionThemeTwoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

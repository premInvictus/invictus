import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalInformationThemeTwoComponent } from './medical-information-theme-two.component';

describe('MedicalInformationThemeTwoComponent', () => {
	let component: MedicalInformationThemeTwoComponent;
	let fixture: ComponentFixture<MedicalInformationThemeTwoComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MedicalInformationThemeTwoComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MedicalInformationThemeTwoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

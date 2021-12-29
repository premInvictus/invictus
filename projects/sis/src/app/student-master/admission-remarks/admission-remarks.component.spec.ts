import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionRemarksComponent } from './admission-remarks.component';

describe('AdmissionRemarksComponent', () => {
	let component: AdmissionRemarksComponent;
	let fixture: ComponentFixture<AdmissionRemarksComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AdmissionRemarksComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdmissionRemarksComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionReportComponent } from './admission-report.component';

describe('AdmissionReportComponent', () => {
	let component: AdmissionReportComponent;
	let fixture: ComponentFixture<AdmissionReportComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AdmissionReportComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdmissionReportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificatePrintingSetupComponent } from './certificate-printing-setup.component';

describe('CertificatePrintingSetupComponent', () => {
	let component: CertificatePrintingSetupComponent;
	let fixture: ComponentFixture<CertificatePrintingSetupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CertificatePrintingSetupComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CertificatePrintingSetupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

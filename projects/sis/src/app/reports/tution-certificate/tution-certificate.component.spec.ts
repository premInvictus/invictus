import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutionCertificateComponent } from './tution-certificate.component';

describe('TutionCertificateComponent', () => {
	let component: TutionCertificateComponent;
	let fixture: ComponentFixture<TutionCertificateComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TutionCertificateComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TutionCertificateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

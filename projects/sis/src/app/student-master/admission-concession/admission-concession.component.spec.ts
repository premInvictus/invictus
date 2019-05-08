import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionConcessionComponent } from './admission-concession.component';

describe('AdmissionConcessionComponent', () => {
	let component: AdmissionConcessionComponent;
	let fixture: ComponentFixture<AdmissionConcessionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AdmissionConcessionComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdmissionConcessionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

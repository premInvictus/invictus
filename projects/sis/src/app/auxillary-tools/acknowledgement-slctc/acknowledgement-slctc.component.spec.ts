import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgementSlctcComponent } from './acknowledgement-slctc.component';

describe('AcknowledgementSlctcComponent', () => {
	let component: AcknowledgementSlctcComponent;
	let fixture: ComponentFixture<AcknowledgementSlctcComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ AcknowledgementSlctcComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AcknowledgementSlctcComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

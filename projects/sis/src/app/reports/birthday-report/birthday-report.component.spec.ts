import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdayReportComponent } from './birthday-report.component';

describe('BirthdayReportComponent', () => {
	let component: BirthdayReportComponent;
	let fixture: ComponentFixture<BirthdayReportComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BirthdayReportComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BirthdayReportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

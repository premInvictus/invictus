import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseReportComponent } from './house-report.component';

describe('HouseReportComponent', () => {
	let component: HouseReportComponent;
	let fixture: ComponentFixture<HouseReportComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [HouseReportComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HouseReportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

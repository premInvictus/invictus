import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiblingDetailsReportComponent } from './sibling-details-report.component';

describe('SiblingDetailsReportComponent', () => {
	let component: SiblingDetailsReportComponent;
	let fixture: ComponentFixture<SiblingDetailsReportComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SiblingDetailsReportComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SiblingDetailsReportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

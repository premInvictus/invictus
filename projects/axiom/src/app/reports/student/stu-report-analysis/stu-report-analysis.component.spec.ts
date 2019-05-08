import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StuReportAnalysisComponent } from './stu-report-analysis.component';

describe('StuReportAnalysisComponent', () => {
	let component: StuReportAnalysisComponent;
	let fixture: ComponentFixture<StuReportAnalysisComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ StuReportAnalysisComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StuReportAnalysisComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

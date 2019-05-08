import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassTopicSectionSlabwiseReportComponent } from './class-topic-section-slabwise-report.component';

describe('ClassTopicSectionSlabwiseReportComponent', () => {
	let component: ClassTopicSectionSlabwiseReportComponent;
	let fixture: ComponentFixture<ClassTopicSectionSlabwiseReportComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ClassTopicSectionSlabwiseReportComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ClassTopicSectionSlabwiseReportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

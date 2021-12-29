import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonDynamicChartComponent } from './common-dynamic-chart.component';

describe('CommonDynamicChartComponent', () => {
	let component: CommonDynamicChartComponent;
	let fixture: ComponentFixture<CommonDynamicChartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ CommonDynamicChartComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CommonDynamicChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

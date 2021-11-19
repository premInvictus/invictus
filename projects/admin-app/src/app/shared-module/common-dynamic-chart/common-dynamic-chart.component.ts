import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import {chart} from 'highcharts';

@Component({
	selector: 'app-common-dynamic-chart',
	templateUrl: './common-dynamic-chart.component.html',
	styleUrls: ['./common-dynamic-chart.component.css']
})
export class CommonDynamicChartComponent implements AfterViewInit, OnInit {

	@Input() options: any;
	dynamicValue;
	constructor() {}

	ngOnInit() {
		this.dynamicValue = 'container' + new Date().getTime();
	}
	ngAfterViewInit() {
		chart(this.dynamicValue, this.options);
	}
}

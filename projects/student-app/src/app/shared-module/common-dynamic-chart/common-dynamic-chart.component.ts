import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import {chart} from 'highcharts';
import * as Highcharts from 'highcharts';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/funnel')(Highcharts);
require('highcharts-grouped-categories')(Highcharts);

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

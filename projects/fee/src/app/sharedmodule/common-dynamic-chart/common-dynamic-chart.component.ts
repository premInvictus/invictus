import { Component, OnInit, Input, AfterViewInit, OnChanges } from '@angular/core';
import { chart } from 'highcharts';
@Component({
	selector: 'app-common-dynamic-chart',
	templateUrl: './common-dynamic-chart.component.html',
	styleUrls: ['./common-dynamic-chart.component.scss']
})
export class CommonDynamicChartComponent implements OnInit, AfterViewInit, OnChanges {
	@Input() options: any;
	dynamicValue: any;
	constructor() { }
	ngOnInit() {
		this.dynamicValue = 'container' + new Date().getTime();
	}
	ngOnChanges() {
		chart(this.dynamicValue, this.options);
	}
	ngAfterViewInit() {
		chart(this.dynamicValue, this.options);
	}

}

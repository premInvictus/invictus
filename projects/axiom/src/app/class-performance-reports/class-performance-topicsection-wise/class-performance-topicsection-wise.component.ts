import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { QelementService } from '../../questionbank/service/qelement.service';
import { ReportService } from '../../reports/service/report.service';
import { NotificationService, BreadCrumbService } from '../../_services/index';
import * as Highcharts from 'highcharts';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/funnel')(Highcharts);
require('highcharts-grouped-categories')(Highcharts);

@Component({
	selector: 'app-class-performance-topicsection-wise',
	templateUrl: './class-performance-topicsection-wise.component.html',
	styleUrls: ['./class-performance-topicsection-wise.component.css']
})
export class ClassPerformanceTopicsectionWiseComponent implements OnInit, OnChanges {
	homeUrl: any;
	@Input() classPerformanceFilter: FormGroup;
	teacherArray: any[] = [];
	classArray: any[] = [];
	@Input() sectionsArray: any[] = [];
	sectionWiseArray: any[] = [];
	overAllPerformanceDiv = false;
	topicSectionWiseArray: any[] = [];
	@Input() subjectArray: any[] = [];
	seriesArray: any[] = [];
	@Input() reportFlag: any;
	columnChart: any = {};
	@Input() tabFlag1: any;
	constructor( private fbuild: FormBuilder,
		private qelementService: QelementService,
		private breadCrumbService: BreadCrumbService,
		private notif: NotificationService,
		private reportService: ReportService) { }

	ngOnInit() {
		this.repopulateChart();
	}
	ngOnChanges() {
		if (this.reportFlag && this.tabFlag1) {
			this.classPerformanceFilter.value.sub_id = this.subjectArray[0].sub_id;
			this.sectionPerformance();
		} else {
			this.overAllPerformanceDiv = false;
		}
	}
	sectionPerformance() {
		this.repopulateChart();
		this.seriesArray = [];
		this.topicSectionWiseArray = [];
		if (!this.classPerformanceFilter.value.class_id) {
			this.notif.showSuccessErrorMessage('Please choose a class' , 'error');
		} else {
			const reportJSON = {
				class_id: this.classPerformanceFilter.value.class_id,
				sub_id: this.classPerformanceFilter.value.sub_id,
			};
			this.reportService.classPerformanceTopicSectionWise(reportJSON).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.topicSectionWiseArray = result.data;
					for (const top of this.topicSectionWiseArray) {
						this.columnChart.xAxis.categories.push(top.topic_name);
					}
					for (const item of this.sectionsArray) {
						const dataArr: any [] = [];
						for (const top of this.topicSectionWiseArray) {
							for (const titem of top.sec_arr) {
								if (Number(titem.sec_id) === Number(item.sec_id)) {
									dataArr.push(Number(titem.overall_performance));
								}
							}
						}
						this.seriesArray.push({
							name: item.sec_name,
							data: dataArr
						});
					}
					this.columnChart.series = this.seriesArray;
					this.overAllPerformanceDiv = true;
				} else {
					this.overAllPerformanceDiv = true;
				}
			});
		}
	}
	repopulateChart() {
		this.columnChart = {
			chart: {
				type: 'column'
		},
		title: {
				text: 'Topicwise Section Report'
		},
		xAxis: {
				categories: []
		},
		yAxis: {
			title: {
					text: 'Percentage'
			}
	},
		credits: {
				enabled: false
		},
		tooltip: {
			headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
			pointFormat: '<tr><td style="color:{series.color};padding:0">Section {series.name}: </td>' +
					'<td style="padding:0"><b>{point.y:.1f}%</b></td></tr>',
			footerFormat: '</table>',
			shared: true,
			useHTML: true
	},
	plotOptions: {
			column: {
					pointPadding: 0.2,
					borderWidth: 0
			}
	},
		series: []
		};
	}
	getCurrentSubject(value): void {
		this.classPerformanceFilter.value.sub_id = value;
		this.sectionPerformance();
	}
}

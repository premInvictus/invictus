import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReportService } from '../../_services/report.service';
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
	selector: 'app-class-topic-section-slabwise-report',
	templateUrl: './class-topic-section-slabwise-report.component.html',
	styleUrls: ['./class-topic-section-slabwise-report.component.css']
})
export class ClassTopicSectionSlabwiseReportComponent implements OnInit, OnChanges {
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
	dataArr0: any [] = [];
	dataArr32: any [] = [];
	dataArr40: any [] = [];
	dataArr50: any [] = [];
	dataArr60: any [] = [];
	dataArr70: any [] = [];
	dataArr80: any [] = [];
	dataArr90: any [] = [];
	dataArray: any[] = [];
	columnChart: any = {};
	@Input() reportFlag: any;
	@Input() tabFlag2: any;
	constructor(
		private notif: NotificationService,
		private reportService: ReportService) { }

	ngOnInit() {
		this.repopulateChart();
	}
	ngOnChanges() {
		if (this.reportFlag && this.tabFlag2) {
			this.classPerformanceFilter.value.sub_id = this.subjectArray[0].sub_id;
			this.sectionPerformance();
		} else {
			this.overAllPerformanceDiv = false;
		}
	}
	repopulateChart() {
		this.columnChart = {
			chart: {
				type: 'column'
		},
		title: {
				text: 'Topicwise Section Slab Report'
		},
		xAxis: {
				categories: []
		},
		yAxis: {
			allowDecimals: false,
			min: 0,
			max: 100,
			title: {
					text: 'Percentage'
			}
	},
		tooltip: {
			formatter: function () {
					return '<b>' + this.x + '</b><br/>' +
							this.series.name + ': ' + this.y + '%' + '<br/>';
			}
	},
	plotOptions: {
		column: {
			stacking: 'normal',
			pointPadding: 0.2,
			borderWidth: 0
	}
	},
		series: []
		};
	}
	sectionPerformance() {
		this.repopulateChart();
		this.seriesArray = [];
		this.topicSectionWiseArray = [];
		this.dataArray = [];
		this.dataArr0 = [];
		this.dataArr32 = [];
		this.dataArr40 = [];
		this.dataArr50 = [];
		this.dataArr60 = [];
		this.dataArr70 = [];
		this.dataArr80 = [];
		this.dataArr90 = [];
		if (!this.classPerformanceFilter.value.class_id) {
			this.notif.showSuccessErrorMessage('Please choose a class', 'error');
		} else {
				const reportJSON = {
					class_id: this.classPerformanceFilter.value.class_id,
					sub_id: this.classPerformanceFilter.value.sub_id
				};
			this.reportService.classPerformanceTopicSectionSlabWise(reportJSON).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.topicSectionWiseArray = result.data;
					for (const top of this.topicSectionWiseArray) {
						this.columnChart.xAxis.categories.push(top.topic_name);
					}
					for (const item of this.sectionsArray) {
						for (const top of this.topicSectionWiseArray) {
							const sec_arr: any[]  = [];
							const keys = Object.keys(top.sec_arr);
							keys.forEach(function(key) {
								sec_arr.push(top.sec_arr[key]);
							});
							for (const titem of sec_arr) {
								if (Number(titem.sec_id) === Number(item.sec_id)) {
									this.dataArr0.push({
										topic_id: top.topic_id,
										sec_id: titem.sec_id,
										marks: Number(titem.slab_0)
									});
									this.dataArr32.push({
										topic_id: top.topic_id,
										sec_id: titem.sec_id,
										marks: Number(titem.slab_32)
									});
								this.dataArr40.push({
									topic_id: top.topic_id,
									sec_id: titem.sec_id,
									marks: Number(titem.slab_40)
								});
								this.dataArr50.push({
									topic_id: top.topic_id,
									sec_id: titem.sec_id,
									marks: Number(titem.slab_50)
								});
								this.dataArr60.push({
									topic_id: top.topic_id,
									sec_id: titem.sec_id,
									marks: Number(titem.slab_60)
								});
								this.dataArr70.push({
									topic_id: top.topic_id,
									sec_id: titem.sec_id,
									marks: Number(titem.slab_70)
								});
								this.dataArr80.push({
									topic_id: top.topic_id,
									sec_id: titem.sec_id,
									marks: Number(titem.slab_80)
								});
								this.dataArr90.push({
									topic_id: top.topic_id,
									sec_id: titem.sec_id,
									marks: Number(titem.slab_90)
								});
							}
							}
						}
					}
					this.insertIntoDataArray(this.dataArr0, '#EB1010', 'Grade E');
					this.insertIntoDataArray(this.dataArr32, '#e81e63', 'Grade D');
					this.insertIntoDataArray(this.dataArr40, '#fe756d', 'Grade C2');
					this.insertIntoDataArray(this.dataArr50, '#fe9800', 'Grade C1');
					this.insertIntoDataArray(this.dataArr60, '#ccdb39', 'Grade B2');
					this.insertIntoDataArray(this.dataArr70, '#04cde4', 'Grade B1');
					this.insertIntoDataArray(this.dataArr80, '#4caf50', 'Grade A2');
					this.insertIntoDataArray(this.dataArr90, '#009688', 'Grade A1');
					this.dataArray.reverse();
					for (const item of this.dataArray) {
						this.seriesArray.push({
							name: item.name,
							data: item.data,
							stack: item.stack,
							color: item.color
						});
					}
					this.columnChart.series = this.seriesArray;
					this.overAllPerformanceDiv = true;
				} else {
					this.topicSectionWiseArray = [];
					this.overAllPerformanceDiv = true;
				}
			});
		}
	}
	insertIntoDataArray(array, color, slab_name) {
		for (const sec of this.sectionsArray) {
			const dataArr: any = [];
			for (const titem of array) {
				if (sec.sec_id === titem.sec_id) {
					dataArr.push(titem.marks);
					const findex = this.dataArray.findIndex(f => f.color === color  && f.stack === sec.sec_name);
					if (findex === -1) {
					this.dataArray.push({
						name: slab_name + '(Section ' + sec.sec_name + ')',
						stack: sec.sec_name,
						data: dataArr,
						color: color,
					});
				}
				}
			}
		}
	}
	getCurrentSubject(value): void {
		this.classPerformanceFilter.value.sub_id = value;
		this.sectionPerformance();
	}
}

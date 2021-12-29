import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
	selector: 'app-admin-class-performance-topicsubtopicwise-report',
	templateUrl: './admin-class-performance-topicsubtopicwise-report.component.html',
	styleUrls: ['./admin-class-performance-topicsubtopicwise-report.component.css']
})
export class AdminClassPerformanceTopicsubtopicwiseReportComponent implements OnInit, OnChanges {
	homeUrl: any;
	@Input() classPerformanceFilter: FormGroup;
	teacherArray: any[] = [];
	classArray: any[] = [];
	classArray2: any[] = [];
	sectionsArray: any[] = [];
	subjectWiseArray: any[] = [];
	overAllPerformanceDiv = false;
	@Input() subjectArray: any[] = [];
	@Input() reportFlag: any;
	constructor(
		private breadCrumbService: BreadCrumbService,
		private notif: NotificationService,
		private reportService: ReportService
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
	}
	ngOnChanges() {
		if (this.reportFlag) {
			this.subjectPerformance();
		} else {
			this.overAllPerformanceDiv = false;
		}
	}
	subjectPerformance() {
		if (!this.classPerformanceFilter.value.class_id) {
			this.notif.showSuccessErrorMessage('Please select a class', 'error');
		} else {
			const reportJSON = {
				class_id : this.classPerformanceFilter.value.class_id,
				sec_id : this.classPerformanceFilter.value.sec_id,
			};
			this.reportService.classPerformanceSubjectWise(reportJSON).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.subjectWiseArray = result.data;
					this.overAllPerformanceDiv = true;
				} else {
					this.overAllPerformanceDiv = true;
				}
			});
		}
	}
	getPercentageColor(value) {
		if (Number(value) > 90) {
			return '#009688';
		} else if (Number(value) > 80) {
			return '#4caf50';
		} else if (Number(value) > 70) {
			return '#04cde4';
		} else if (Number(value) > 60) {
			return '#ccdb39';
		} else if (Number(value) > 50) {
			return '#fe9800';
		} else if (Number(value) > 40) {
			return '#fe756d';
		} else if (Number(value) > 32) {
			return '#e81e63';
		} else {
			return '#EB1010';
		}
	}
}

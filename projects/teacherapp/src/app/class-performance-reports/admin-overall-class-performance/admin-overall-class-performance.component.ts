import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QelementService } from '../../questionbank/service/qelement.service';
import { ReportService } from '../../_services/report.service';
import { ActivatedRoute } from '@angular/router';
import {
	NotificationService,
	BreadCrumbService
} from '../../_services/index';
import * as Highcharts from 'highcharts';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/funnel')(Highcharts);
require('highcharts-grouped-categories')(Highcharts);

@Component({
	selector: 'app-admin-overall-class-performance',
	templateUrl: './admin-overall-class-performance.component.html',
	styleUrls: ['./admin-overall-class-performance.component.css']
})
export class AdminOverallClassPerformanceComponent implements OnInit, OnChanges {
	@Input() classPerformanceFilter: FormGroup;
	classArray: any[];
	subjectArray: any[];
	sectionsArray: any[];
	userDetail: any;
	currentUser: any;
	currentusername: any;
	currentUserClass: any;
	currentUserSec: any;
	currentAdmission: any;
	homeUrl: string;
	grade: any;
	presentStudentArray: any[] = [];
	overallPerformance: any[] = [];
	overallPerformanceTestMark: any[] = [];
	studentInfoDiv = false;
	seriesArray: any[] = [];
	overallPerformanceArray: any[] = [];
	OverallPerformanceDiv = false;
	@Input() reportFlag: any;
	@Input() tabFlag3: any;
	testTotalMarks: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	testsMarks: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	testArray: any[] = [];
	splineChart: any = {
		title: {
			text: ''
		},
		xAxis: {
			categories: [],
			title: {
				text: 'Test Name'
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: 'Percentage'
			}
		},
		labels: {
			items: [
				{
					html: 'Overall Performance',
					style: {
						left: '50px',
						top: '18px'
					}
				}
			]
		},
		colors: [
			'#04cde4',
			'#fe756d',
			'#6610f2',
			'#3f51b5',
			'#4caf50',
			'#e81e63',
			'#fe9800',
			'#795548',
			'#374046',
			'#009688',
			'#ccdb39',
			'#9c27b0'
		],
		series: []
	};
	constructor(
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private breadCrumbService: BreadCrumbService,
		private notif: NotificationService,
		private route: ActivatedRoute,
		private reportService: ReportService
	) {}

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
	}
	ngOnChanges() {
		if (this.reportFlag || this.tabFlag3) {
			this.getOverallPerformance();
		} else {
			this.OverallPerformanceDiv = false;
		}
	}
	getOverallPerformance() {
		/*Form Validation */
		if (this.classPerformanceFilter.value.sec_id) {
			this.overallPerformance = [];
			this.overallPerformanceArray = [];
			this.overallPerformanceTestMark = [];
			this.seriesArray = [];
			this.OverallPerformanceDiv = true;
			this.reportService
				.classOveralPerformance({
					class_id: this.classPerformanceFilter.value.class_id,
					sec_id: this.classPerformanceFilter.value.sec_id,
				})
				.subscribe((result: any) => {
					if (result && result.status === 'ok') {
						let testMarks: any[] = [];
						let stotal = 0;
						let tcount = 0;
						const ttotal = 0;
						let ttmi = 0;
						this.overallPerformanceArray = result.data;
						let i = 0;
						for (const item of this.overallPerformanceArray) {
							ttmi = 0;
							stotal = 0;
							tcount = 0;
							testMarks = [];
							Object.keys(item).forEach(key => {
								if (key !== 'sub_id' && key !== 'sub_name') {
									testMarks.push(Number(item[key]));
									this.testArray.push('Test' + (i + 1));
									i++;
								}
							});
							testMarks.reverse();
							for (const marks of testMarks) {
								stotal += Number(marks);
								if (Number(marks) > 0) {
									tcount++;
								}
							}
							const subject_avg = stotal / tcount;
							let str = subject_avg.toString();
							if (str === 'NaN') {
								str = '0';
							}
							this.overallPerformance.push({
								sub_total: stotal,
								sub_avg: str.slice(0, 4),
								sub_id: item.sub_id,
								sub_name: item.sub_name,
								test: testMarks
							});
							for (const tmark of testMarks) {
								this.testTotalMarks[ttmi++] += Number(tmark);
							}
							this.overallPerformanceTestMark.push({
								test_total: ttotal,
								test_avg: ttotal / ttmi,
								test: testMarks
							});
							this.seriesArray.push({
								type: 'spline',
								name: item.sub_name,
								data: testMarks
							});
						}
						this.OverallPerformanceDiv = true;
						this.studentInfoDiv = true;
						this.splineChart.xAxis.categories = this.testArray;
						this.splineChart.series = this.seriesArray;
					} else {
						this.OverallPerformanceDiv = true;
						this.studentInfoDiv = true;
					}
				});
		}
	}
	getPercentageColor(value) {
		if (Number(value) > 90) {
			this.grade = 'A1';
			return '#009688';
		} else if (Number(value) > 80) {
			this.grade = 'A2';
			return '#4caf50';
		} else if (Number(value) > 70) {
			this.grade = 'B1';
			return '#04cde4';
		} else if (Number(value) > 60) {
			this.grade = 'B2';
			return '#ccdb39';
		} else if (Number(value) > 50) {
			this.grade = 'C1';
			return '#fe9800';
		} else if (Number(value) > 40) {
			this.grade = 'C2';
			return '#fe756d';
		} else if (Number(value) > 32) {
			this.grade = 'D';
			return '#e81e63';
		} else {
			this.grade = 'E';
			return '#EB1010';
		}
	}
	printOverAllPerformance() {
		const printModal2 = document.getElementById('printModal');
		const popupWin = window.open(
			'',
			'_blank',
			'width=screen.width,height=screen.height'
		);
		popupWin.document.open();
		popupWin.document.write(
			'<html>' +
				'<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css"' +
				'integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">' +
				'<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">' +
				'<style>button.submit-button {display:none}' +
				'.qstStyle{width: 0.1rem;vertical-align: middle !important;}' +
				'.btn-emp {background-color: #fff;border: none;color: #ffffff;font-weight: bold !important;' +
				'width: 50px;height: 50px;border-radius: 100%;margin: auto !important;display: block !important;}' +
				'.table-striped tbody tr:nth-of-type(odd) {background-color: rgba(0,0,0,.05);}' +
				'.user-table {padding-top: 10px;overflow-x: auto;width: 100%;}' +
				'table thead th{vertical-align: text-bottom !important;}' +
				'tr, th, td {padding: 5px;}' +
				'table {font-size: 14px;width:100%}' +
				'.hor {border-width: 1px;border-color: #000;}' +
				'.qstStyle{width: 0.1rem;vertical-align: middle !important;}' +
				'td{word-break: initial !important;}' +
				'th {vertical-align: middle !important;}' +
				'.padding{margin-right: 20px;}' +
				'h4.text-center {text-align: center;font-size: 16px;}' +
				'mat-tab-header {display: none;}' +
				'mat-form-field {display: none; !important}' +
				'.report-information-bar {background-color: #e6e5df;}' +
				'b{font-weight: bolder;}' +
				'.info-first-circle {color: #f44a66;}' +
				'.info-second-circle {color: #32bea2;}' +
				'.info-third-circle {color: #6c65c8;}' +
				'.info-four-circle {color: #ffb519;}' +
				'.row{display:flex !important}' +
				'.information-bar-content {font-size: 14px !important;text-align: center !important;}' +
				'.col-lg-12 {width: 100%;}' +
				'.review-or{display:none !important}' +
				'.col-lg-4 {padding:10px !important;margin-bottom:5px !important;width:100%}' +
				'.white-box-content-title {text-align: center;font-size: 25px;}' +
				'.dialog-table-review-header {background-color: #e6e5df !important;}' +
				'.table td, .table th {padding: .75rem;vertical-align: top;border-top: 1px solid #dee2e6;}' +
				'.table {width: 100%;max-width: 100%;margin-bottom: 0rem;background-color: transparent;text-align:center}' +
				'.dialog-table-review {font-size: 12px;padding-left:10px;padding-right:10px}' +
				'.table-box {background-color: #ffffff;border: 1px solid #fe756d;}' +
				'</style>' +
				'<body onload="window.print()">' +
				printModal2.innerHTML +
				'</html>'
		);
		popupWin.document.close();
	}
}

import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { QelementService } from '../../questionbank/service/qelement.service';
import { ReportService } from '../../_services/report.service';
import {
	NotificationService,
	BreadCrumbService
} from '../../_services/index';
import { chart } from 'highcharts';

@Component({
	selector: 'app-admin-performance-graph',
	templateUrl: './admin-performance-graph.component.html',
	styleUrls: ['./admin-performance-graph.component.css']
})
export class AdminPerformanceGraphComponent implements OnInit, OnChanges {
	@Input() adminOverallFilter: FormGroup;
	es_id: number;
	classArray: any[];
	@Input() subjectArray: any[];
	sectionsArray: any[];
	userDetail: any;
	@Input() currentUser: any;
	loading = false;
	login_id: string;
	sec_id: string;
	currentusername: any;
	homeUrl: string;
	currentUserClass: any;
	currentUserSec: any;
	PerformanceDiv = false;
	studentInfoDiv = false;
	TopicSubtopicArray: any[] = [];
	topicwiseMarkArray: any[] = [];
	topicNameArray: any[] = [];
	topicMarkArray: any[] = [];
	topicwiseAverageArray: any[] = [];
	topicwisePerformanceArray: any[] = [];
	topiwiseHighestArray: any[] = [];
	currentUserAdmission: any;
	@Input() reportFlag: any;
	@Input() tabFlag6: any;
	columnchart: any = {};
	constructor(
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private notif: NotificationService,
		private reportService: ReportService,
		private breadCrumbService: BreadCrumbService
	) {}

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.viewReportTopicSubtopic();
	}
	ngOnChanges() {
		if (this.reportFlag && this.tabFlag6) {
			this.adminOverallFilter.value.sub_id = this.subjectArray[0].sub_id;
			this.viewReportTopic();
		} else {
			this.PerformanceDiv = false;
			this.studentInfoDiv = false;
		}
	}
	repopulateChart() {
		this.columnchart = {
			title: {
				text: 'Topicwise Exam Report'
			},
			xAxis: {
				categories: []
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Marks'
				}
			},
			labels: {
				items: [
					{
						html: 'Topicwise Exam Report',
						style: {
							left: '50px',
							top: '18px'
						}
					}
				]
			},
			plotOptions: {
				column: {
					stacking: 'normal',
					dataLabels: {
						enabled: true,
						color: 'white',
						format:
							'<span style="text-decoration:none !important;>{series.name}: {point.y}</span>'
					}
				}
			},
			series: [
				{
					type: 'column',
					name: 'Marks',
					color: '#6610f2',
					data: []
				},
				{
					type: 'spline',
					name: 'Class Average',
					color: '#fe756d',
					data: []
				},
				{
					type: 'spline',
					name: 'Highest Marks',
					color: '#04CDE4',
					data: []
				}
			]
		};
	}
	viewReportTopicSubtopic() {
		this.TopicSubtopicArray = [];
		this.reportService
			.viewReportTopicSubtopic({
				es_id: this.es_id,
				login_id: this.currentUser.au_login_id
			})
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.TopicSubtopicArray = result.data;
				}
			});
	}


	viewReportTopic() {
		/*Form Validation */
		if (this.adminOverallFilter.value.sub_id) {
			this.repopulateChart();
			this.topicMarkArray = [];
			this.topicNameArray = [];
			this.topicwiseMarkArray = [];
			this.topicwisePerformanceArray = [];
			this.topicwiseAverageArray = [];
			this.topiwiseHighestArray = [];
			this.reportService
				.topicwisePerformanceGraph({
					es_id: this.es_id,
					login_id: this.currentUser.au_login_id,
					class_id: this.adminOverallFilter.value.es_class_id,
					sub_id: this.adminOverallFilter.value.sub_id
				})
				.subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.topicwiseMarkArray = result.data;
						this.reportService
							.topicwisePerformanceGraphAvgHighest()
							.subscribe((result2: any) => {
								if (result2 && result2.status === 'ok') {
									this.topicwisePerformanceArray = result2.data;
									for (const item1 of this.topicwisePerformanceArray) {
										for (const item of this.topicwiseMarkArray) {
											if (
												item.topic_name === item1.topic_name &&
												this.currentUser.au_login_id === item.au_login_id
											) {
												this.topicNameArray.push(item.topic_name);
												this.topicMarkArray.push(Number(item.marks));
												this.topicwiseAverageArray.push(Number(item1.average));
												this.topiwiseHighestArray.push(Number(item1.highest));
											}
										}
									}
									this.columnchart.xAxis.categories = this.topicNameArray;
									this.columnchart.series[0].data = this.topicMarkArray;
									this.columnchart.series[1].data = this.topicwiseAverageArray;
									this.columnchart.series[2].data = this.topiwiseHighestArray;
									this.PerformanceDiv = true;
									this.studentInfoDiv = true;
								}
							});
					} else {
						this.PerformanceDiv = true;
						this.studentInfoDiv = true;
					}
				});
		}
	}
	printPerformanceGraph() {
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
				'.col-lg-4 {padding:10px !important;margin-bottom:5px !important;width:100%}' +
				'.white-box-content-title {text-align: center;font-size: 25px;}' +
				'.remove-or{display:none !important}' +
				'.text-center{text-align:center}' +
				'.mat-card:not([class*=mat-elevation-z]) {box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),' +
				'0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);}' +
				'.detail-question-box-grey {border: 1px solid #D6D6D6;border-radius: 5px;margin-left: 1%;}' +
				'.mat-card {transition: box-shadow 280ms cubic-bezier(.4,0,.2,1);display: block;' +
				'position: relative;padding: 24px;border-radius: 2px;}' +
				'.performanceChart{min-width: 310px;height: 400px;width: 800px;margin: 0 auto;}' +
				'</style>' +
				'<body onload="window.print()">' +
				printModal2.innerHTML +
				'</html>'
		);
		popupWin.document.close();
	}
}

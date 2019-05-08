import { Component, OnInit } from '@angular/core';
import { chart } from 'highcharts';
import { ReportService } from '../../reports/service/report.service';
import {ActivatedRoute} from '@angular/router';
import { QelementService } from '../../questionbank/service/qelement.service';

@Component({
	selector: 'app-teacher-cro-report',
	templateUrl: './teacher-cro-report.component.html',
	styleUrls: ['./teacher-cro-report.component.css']
})
export class TeacherCroReportComponent implements OnInit {
	testQuestionArray: any[] = [];
	testQuestionArrayResult: any[] = [];
	testNameArray: any[] = [];
	topicSubtopicArray: any[] = [];
	croReportDiv = false;
	es_id: number;
	etopicArray: any[] = []  ;
	estArray: any[] = [];
	disPriority: any = {critical: [], recommended: [], optional: []};
	examDetail: any = {};
	questionpaperDetail: any = {};
	pieChartFlag = false;
	teacherCro: any = {
						chart: {
							type:  'pie',
							height: 280,
							width: 280,
						},
						title: {
							text: ''
						},
						tooltip:  {
							pointFormat:  '{series.data.name}  <b>{point.percentage: .0f}%</b>'
					},
						credits:  {
							enabled:  false
						},
						plotOptions:  {
							pie:  {
									allowPointSelect:  true,
									cursor:  'pointer',
									dataLabels:  {
											enabled:  true,
											format:  '',
											distance:  -50,
									}
							}
					},
						series:  [{
							name:  'Question',
								data:  [
										{ name:  'Optional', y:  this.disPriority.optional.length , color: '#6610f2'},
										{ name:  'Critical', y:  this.disPriority.critical.length , color: '#fe756d' },
										{ name:  'Recommended', y:  this.disPriority.recommended.length  , color: '#04CDE4'}
								]
						}]
				};
constructor(private reportService: ReportService,
	private route: ActivatedRoute,
	private qelementService: QelementService) { }

ngOnInit() {

	this.es_id = this.route.snapshot.params['id'];
	this.getTestQuestions();
	}

	getTestQuestions(): void {
		this.testQuestionArray = [];
		this.reportService.testQuestionAnalysis({es_id: this.es_id}).subscribe(
			(result: any) => {
				this.getScheduledExam();
				if (result && result.status === 'ok') {
					this.testQuestionArrayResult = result.data;
					let curTopic_id = 0;
					let curTopic_name = '';
					let priPercentage = 0;
					for (const item of this.testQuestionArrayResult) {
						if (curTopic_id !== item.topic_id) {
							curTopic_id = item.topic_id;
							curTopic_name = item.topic_name;
							this.etopicArray.push({topic_id: curTopic_id, topic_name: curTopic_name});
						}
					}
					let curst_id = 0;
					let curst_name = '';
					for (const item of this.testQuestionArrayResult) {
						if (curst_id !== item.st_id) {
							curst_id = item.st_id;
							curst_name = item.st_name;
							curTopic_id = item.topic_id;
							this.estArray.push({topic_id: curTopic_id, st_id: curst_id, st_name: curst_name, qusArray: []});
						}
						}
						let jitem: any = {};
						for (const titem of this.etopicArray) {
						jitem = {};
						jitem.topic_name = titem.topic_name;
						jitem.topic_id = titem.topic_id;
						const stArray = [];
						for (const sitem of this.estArray) {
							if (sitem.topic_id === titem.topic_id) {
								stArray.push(sitem);
							}
						}
						jitem.stArray = stArray;
						this.topicSubtopicArray.push(jitem);
						}
						for (const titem of this.topicSubtopicArray) {
							for (const sitem of titem.stArray) {
								for (const qus of this.testQuestionArrayResult) {
									if (qus.topic_id === titem.topic_id && qus.st_id === sitem.st_id) {
										sitem.qusArray.push(qus);
										priPercentage = Math.round((Number(qus.correct) / (Number(qus.correct) + Number(qus.incorrect) + Number(qus.skip))) * 100);
										if (priPercentage > 60) {
											this.disPriority.optional.push(qus.qus_id);
										} else if (priPercentage > 32) {
											this.disPriority.recommended.push(qus.qus_id);
										} else {
											this.disPriority.critical.push(qus.qus_id);
										}
									}
								}
							}
							this.testQuestionArray.push(titem);
						}
					// start charts
					this.teacherCro.series[0].data[0].y = this.disPriority.optional.length;
					this.teacherCro.series[0].data[1].y = this.disPriority.critical.length;
					this.teacherCro.series[0].data[2].y = this.disPriority.recommended.length;
					this.pieChartFlag = true;
				}
			}
		);
	}
	getScheduledExam() {
		this.qelementService.getScheduledExam({es_id: this.es_id, es_status: '2'}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.examDetail = result.data[0];
					this.qelementService.getQuestionPaper({qp_id: this.examDetail.es_qp_id}).subscribe(
						(result1: any) => {
							if (result1 && result1.status === 'ok') {
								this.questionpaperDetail = result1.data[0];
								this.croReportDiv = true;
						}
						}
					);
				}
			}
		);
	}
	getQusPosition(qus_id) {
		for (let pi = 0; pi < this.questionpaperDetail.qlist.length; pi++) {
			if (qus_id === this.questionpaperDetail.qlist[pi].qpq_qus_id) {
				return pi + 1;
			}
		}
	}
	printCroReport() {
		const printModal2 = document.getElementById('printModal');
		const popupWin = window.open('', '_blank', 'width=screen.width,height=screen.height');
		popupWin.document.open();
		popupWin.document.write('<html>' +
		// tslint:disable-next-line:max-line-length
		'<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">' +
		// tslint:disable-next-line:max-line-length
		'<style>button.submit-button{display:none} @page {size:landscape} body{font-family: Roboto,"Helvetica Neue",Arial,sans-serif; font-size: 10px;}' +
		// tslint:disable-next-line:max-line-length
		'.mat-card:not([class*=mat-elevation-z]) {box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);}' +
		// tslint:disable-next-line:max-line-length
		'.mat-card {transition: box-shadow 280ms cubic-bezier(.4,0,.2,1);display: block;position: relative;padding: 24px;border-radius: 10px;width:450px}' +
		'.report-tab-content {height: 500px !important;padding-top:80px}' +
		'.row{display:flex}' +
		// tslint:disable-next-line:max-line-length
		'.table {width: 100%;max-width: 100%;margin-bottom: 0rem;background-color: transparent;text-align:center} .print-cro-chart-div{  max-width: 100%; } td{word-break: break-word}' +
		'.dialog-table-review {font-size: 12px;}' +
		'.dialog-table-review-header {background-color: #e6e5df !important;}' +
		'.table thead th {vertical-align: bottom;border-bottom: 2px solid #dee2e6;}' +
		'.highcharts-container {text-align:left !important; margin-left:46px !important}' +
		'.crochart.text-center.ng-star-inserted {padding-left: 0% !important;}' +
		'.row{display:flex !important}' +
			'.information-bar-content {font-size: 14px !important;text-align: center !important;}' +
			'.col-lg-12 {padding-left: 15px;width: 100%;}' +
			'.col-lg-3 {padding:10px !important;margin-bottom:5px !important;width:100%}' +
			'mat-tab-header {display: none;}' +
			'.report-information-bar {background-color: #e6e5df;}' +
			'b{font-weight: bolder;}' +
			'.info-first-circle {color: #f44a66;}' +
			'.info-second-circle {color: #32bea2;}' +
			'.info-third-circle {color: #6c65c8;}' +
			'.info-four-circle {color: #ffb519;}' +
			'.skipped-icon {color: #fe756d;}' +
			'.attempted-icon {color: #00c4db;}' +
			'.bookmark-icon {color: #6610f2;}' +
			'.table td, .table th {padding: .75rem;vertical-align: top;border-top: 1px solid #dee2e6;}' +
			'th{font-size:14px}' +
			'.legend-print {font-size: 16px;}' +
		'</style><body onload="window.print()">' + printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}
}

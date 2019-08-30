import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../_services/report.service';
import { ActivatedRoute } from '@angular/router';
import { HtmlToTextService } from '../../_services/htmltotext.service';
import {
	DomSanitizer,
	SafeResourceUrl,
	SafeUrl
} from '@angular/platform-browser';
import { QelementService } from '../../questionbank/service/qelement.service';
@Component({
	selector: 'app-teacher-test-question-analysis',
	templateUrl: './teacher-test-question-analysis.component.html',
	styleUrls: ['./teacher-test-question-analysis.component.css']
})
export class TeacherTestQuestionAnalysisComponent implements OnInit {
	loading = false;
	teacherQuestionGraph = false;
	testQuestionArray: any[] = [];
	testNameArray: any[] = [];
	pieArray: any[] = [];
	es_id: number;
	tableCollection = false;
	currentQP: any;
	examDetail: any;
	subjectArrayOfQP: any[] = [];
	subjectWiseTopicArray: any[] = [];
	testQuestionArrayTemp: any[] = [];
	// events
	teacherTestQuestionOption: any = {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie',
			height: 120,
			width: 160
		},
		tooltip: {
			pointFormat: '{series.data.name} <b>{point.percentage:.1f}%</b>'
		},
		title: {
			text: ''
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: false
				}
			}
		},
		colors: ['#04cde4', '#fe756d', '#6610f2'],
		series: [
			{
				name: 'Answer',
				colorByPoint: true,
				data: [
					{
						name: 'Correct',
						selected: true
					},
					{
						name: 'Incorrect'
					},
					{
						name: 'Skipped'
					}
				]
			}
		]
	};

	constructor(
		private reportService: ReportService,
		private route: ActivatedRoute,
		private htt: HtmlToTextService,
		private sanitizer: DomSanitizer,
		private qelementService: QelementService
	) {}
	htmlToText(html) {
		return this.htt.htmlToText(html);
	}
	ngOnInit() {
		this.es_id = this.route.snapshot.params['id'];
		this.getTestQuestions();
	}
	// tslint:disable-next-line:member-ordering
	public pieChartLabels: string[] = ['Incorrect', 'Correct', 'Skipped'];
	// tslint:disable-next-line:member-ordering
	public pieChartData: number[] = [];
	// tslint:disable-next-line:member-ordering
	public pieChartType = 'pie';
	// tslint:disable-next-line:member-ordering
	public pieChartOptions: any = {
		pieChartLabels: {
			display: false
		},
		tooltips: {
			enabled: false
		}
	};

	getAttempted(num1, num2) {
		return Number(num1) + Number(num2);
	}
	getTestQuestions(): void {
		this.loading = true;
		this.testQuestionArray = [];
		this.qelementService
			.getScheduledExam({ es_id: this.es_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.examDetail = result.data[0];
					this.qelementService
						.getQuestionPaper({ qp_id: this.examDetail.es_qp_id })
						.subscribe((result1: any) => {
							if (result1 && result1.status === 'ok') {
								this.currentQP = result1.data[0];
								let subIdArray = [];
								subIdArray = this.currentQP.qp_sub_id
									.replace(/\s/g, '')
									.split(',');
								let subNameArray = [];
								subNameArray = this.currentQP.sub_name
									.replace(/\s/g, '')
									.split(',');
								if (subIdArray.length === subNameArray.length) {
									for (let i = 0; i < subIdArray.length; i++) {
										const subIdName = {
											sub_id: subIdArray[i],
											sub_name: subNameArray[i]
										};
										this.subjectArrayOfQP.push(subIdName);
									}
								}

								for (const item of this.subjectArrayOfQP) {
									for (const titem of this.currentQP.qlist) {
										if (Number(item.sub_id) === Number(titem.topic_sub_id)) {
											this.subjectWiseTopicArray.push({
												qus_id: titem.qpq_qus_id,
												topic_id: titem.topic_id,
												topic_name: titem.topic_name,
												sub_id: item.sub_id
											});
										}
									}
								}
							}
						});
					this.reportService
						.testQuestionAnalysis({ es_id: this.es_id })
						.subscribe((result2: any) => {
							this.loading = false;
							if (result2 && result2.status === 'ok') {
								this.testQuestionArray = result2.data;

								this.tableCollection = true;
								let i = 0;
								for (const item of this.testQuestionArray) {
									// tslint:disable-next-line:radix
									this.teacherTestQuestionOption.series[0].data[0].y = parseInt(
										this.testQuestionArray[i].correct
									);
									// tslint:disable-next-line:radix
									this.teacherTestQuestionOption.series[0].data[1].y = parseInt(
										this.testQuestionArray[i].incorrect
									);
									// tslint:disable-next-line:radix
									this.teacherTestQuestionOption.series[0].data[2].y = parseInt(
										this.testQuestionArray[i].skip
									);
									this.testNameArray.push(this.testQuestionArray[i].qus_name);
									this.pieArray[i] = JSON.stringify(
										this.teacherTestQuestionOption
									);
									this.testQuestionArray[i]['pieOption'] = JSON.parse(
										this.pieArray[i]
									);
									i++;
								}
								for (const item of this.subjectWiseTopicArray) {
									for (const titem of this.testQuestionArray) {
										if (
											Number(item.topic_id) === Number(titem.topic_id) &&
											Number(item.qus_id) === Number(titem.qus_id)
										) {
											this.testQuestionArrayTemp.push({
												correct: titem.correct,
												dl_name: titem.dl_name,
												incorrect: titem.incorrect,
												option1: titem.option1,
												option2: titem.option2,
												option3: titem.option3,
												option4: titem.option4,
												options: titem.options,
												pieOption: titem.pieOption,
												qst_id: titem.qst_id,
												qus_id: titem.qus_id,
												qus_name: titem.qus_name,
												skill_name: titem.skill_name,
												skip: titem.skip,
												skip_option: titem.skip_option,
												st_id: titem.st_id,
												st_name: titem.st_name,
												topic_id: titem.topic_id,
												topic_name: titem.topic_name,
												sub_id: item.sub_id
											});
										}
									}
								}
								this.teacherQuestionGraph = true;
							}
						});
				}
			});
	}
	printTestQuestionAnalysis() {
		const printModal2 = document.getElementById('printModal');
		const popupWin = window.open(
			'',
			'_blank',
			'width=screen.width,height=screen.height'
		);
		popupWin.document.open();
		popupWin.document.write(
			// tslint:disable-next-line:max-line-length
			'<html><link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous"><style>button.submit-button { display:none; } @page {size:landscape}' +
				'.table thead th {vertical-align: bottom;border-bottom: 2px solid #dee2e6;}' +
				'.dialog-table-review-header {background-color: #e6e5df !important;}' +
				'.text-center {text-align: center !important;}' +
				'.teacher-other-tab-table {border: 1px solid #9c3;}' +
				'.fa-square:before {content: "\\f0c8";}' +
				'.fa, .far, .fas {font-family: Font Awesome\\ 5 Free;}' +
				'.fa, .fas {font-weight: 900;}' +
				// tslint:disable-next-line:max-line-length
				'.fa, .fab, .fal, .far, .fas {-moz-osx-font-smoothing: grayscale;-webkit-font-smoothing: antialiased;display: inline-block;font-style: normal;font-variant: normal;text-rendering: auto;line-height: 1;}' +
				'.attempted-icon {color: #00c4db !important;}' +
				'.skipped-icon {color: #fe756d !important;}' +
				'.bookmark-icon {color: #6610f2 !important;}' +
				'.dialog-table-review {font-size: 12px;width:100%}' +
				'.table td, .table th {padding: .75rem;vertical-align: top;border-top: 1px solid #dee2e6;}' +
				'th{width:3rem}' +
				'mat-tab-header {display: none;}' +
				'.report-information-bar {background-color: #e6e5df;}' +
				'b{font-weight: bolder;}' +
				'.info-first-circle {color: #f44a66;}' +
				'.info-second-circle {color: #32bea2;}' +
				'.info-third-circle {color: #6c65c8;}' +
				'.info-four-circle {color: #ffb519;}' +
				'.row{display:flex !important}' +
				'.information-bar-content {font-size: 14px !important;text-align: center !important;}' +
				'.col-lg-12 {width: 100%;}' +
				'.col-lg-3 {padding:10px !important;margin-bottom:5px !important;width:100%}' +
				'.student-score-card-legend {font-size: 10px !important;}' +
				'.attempted-icon {color: #00c4db;}' +
				'.skipped-icon {color: #fe756d;}' +
				'.bookmark-icon {color: #6610f2;}' +
				'</style><body onload="window.print()">' +
				printModal2.innerHTML +
				'</html>'
		);
		popupWin.document.close();
	}
}

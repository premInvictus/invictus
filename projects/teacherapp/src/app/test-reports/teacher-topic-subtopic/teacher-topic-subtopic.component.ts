import { Component, OnInit } from '@angular/core';
import { chart } from 'highcharts';
import { ReportService } from '../../_services/report.service';
import { ActivatedRoute } from '@angular/router';
import { QelementService } from '../../questionbank/service/qelement.service';
import { HtmlToTextService } from '../../_services/htmltotext.service';

@Component({
	selector: 'app-teacher-topic-subtopic',
	templateUrl: './teacher-topic-subtopic.component.html',
	styleUrls: ['./teacher-topic-subtopic.component.css']
})
export class TeacherTopicSubtopicComponent implements OnInit {
	loading = false;
	pieFlagTeacher = false;
	optionsPie: any = {
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
	testQuestionArray: any[] = [];
	testQuestionArrayResult: any[] = [];
	testNameArray: any[] = [];
	topicSubtopicArray: any[] = [];
	teachertopicsubtopicDeiv = false;
	es_id: number;
	etopicArray: any[] = [];
	estArray: any[] = [];
	examDetail: any = {};
	pieArray: any[] = [];
	questionpaperDetail: any = {};
	subjectArrayOfQP: any[] = [];
	subjectWiseTopicArray: any[] = [];
	tableCollection = false;
	testQuestionArrayTemp: any[] = [];
	public pieChartLabels: string[] = ['Incorrect', 'Correct', 'Skipped'];
	public pieChartData: number[] = [];
	public pieChartType = 'pie';
	public pieChartOptions: any = {
		pieChartLabels: {
			display: false
		},
		tooltips: {
			enabled: false
		}
	};

	constructor(
		private reportService: ReportService,
		private route: ActivatedRoute,
		private qelementService: QelementService,
		private htt: HtmlToTextService
	) {}

	ngOnInit() {
		this.es_id = this.route.snapshot.params['id'];
		this.getTestQuestions();
	}

	public chartHovered(e: any): void {}

	htmlToText(html) {
		return this.htt.htmlToText(html);
	}

	getAttempted(num1, num2) {
		return Number(num1) + Number(num2);
	}

	getTestQuestions(): void {
		this.testQuestionArray = [];
		this.loading = true;
		this.qelementService
			.getScheduledExam({ es_id: this.es_id, es_status: '2' })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.examDetail = result.data[0];
					this.qelementService
						.getQuestionPaper({ qp_id: this.examDetail.es_qp_id })
						.subscribe((res: any) => {
							if (res) {
								this.questionpaperDetail = res.data[0];
								const subIdArray = this.questionpaperDetail.qp_sub_id
									.replace(/\s/g, '')
									.split(',');
								const subNameArray = this.questionpaperDetail.sub_name
									.replace(/\s/g, '')
									.split(',');
								if (subIdArray.length === subNameArray.length) {
									for (let i = 0; i < subIdArray.length; i++) {
										const subDetail = {
											sub_id: subIdArray[i],
											sub_name: subNameArray[i]
										};
										this.subjectArrayOfQP.push(subDetail);
									}
								}

								for (const item of this.subjectArrayOfQP) {
									for (const titem of this.questionpaperDetail.qlist) {
										if (Number(titem.topic_sub_id) === Number(item.sub_id)) {
											const findex = this.subjectWiseTopicArray.findIndex(
												f =>
													Number(f.topic_id) === Number(titem.topic_id) &&
													Number(f.st_id) === Number(titem.st_id)
											);
											if (findex === -1) {
												this.subjectWiseTopicArray.push({
													topic_id: titem.topic_id,
													topic_name: titem.topic_name,
													st_name: titem.st_name,
													st_id: titem.st_id,
													sub_id: item.sub_id
												});
											} else {
												continue;
											}
										} else {
											continue;
										}
									}
								}
							}
							this.reportService
								.testQuestionAnalysis({ es_id: this.es_id })
								.subscribe((result2: any) => {
									this.loading = false;
									if (result2 && result2.status === 'ok') {
										this.testQuestionArrayResult = result2.data;
										let curTopic_id = 0;
										let curTopic_name = '';
										for (const item of this.testQuestionArrayResult) {
											if (curTopic_id !== item.topic_id) {
												curTopic_id = item.topic_id;
												curTopic_name = item.topic_name;
												this.etopicArray.push({
													topic_id: curTopic_id,
													topic_name: curTopic_name
												});
											}
										}
										let curst_id = 0;
										let curst_name = '';
										for (const item of this.testQuestionArrayResult) {
											if (curst_id !== item.st_id) {
												curst_id = item.st_id;
												curst_name = item.st_name;
												curTopic_id = item.topic_id;
												this.estArray.push({
													topic_id: curTopic_id,
													st_id: curst_id,
													st_name: curst_name,
													qusArray: []
												});
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
											let cntRowSpan = 0;
											for (const sitem of titem.stArray) {
												let i = 0;
												for (const qus of this.testQuestionArrayResult) {
													if (
														qus.topic_id === titem.topic_id &&
														qus.st_id === sitem.st_id
													) {
														// tslint:disable-next-line:radix
														this.optionsPie.series[0].data[0].y = parseInt(
															this.testQuestionArrayResult[i].correct
														);
														// tslint:disable-next-line:radix
														this.optionsPie.series[0].data[1].y = parseInt(
															this.testQuestionArrayResult[i].incorrect
														);
														// tslint:disable-next-line:radix
														this.optionsPie.series[0].data[2].y = parseInt(
															this.testQuestionArrayResult[i].skip
														);
														this.pieArray[i] = JSON.stringify(this.optionsPie);
														this.testQuestionArrayResult[i][
															'pieOptions'
														] = JSON.parse(this.pieArray[i]);
														sitem.qusArray.push(
															this.testQuestionArrayResult[i]
														);
													}
													i++;
												}
												sitem.row_span = sitem.qusArray.length.toString();
												cntRowSpan += sitem.qusArray.length;
											}
											titem.row_span = cntRowSpan.toString();
											this.testQuestionArray.push(titem);
											this.tableCollection = true;
										}
										for (const item of this.subjectWiseTopicArray) {
											for (const titem of this.testQuestionArray) {
												for (const st of titem.stArray) {
													if (Number(item.st_id) === Number(st.st_id)) {
														const findex = this.testQuestionArrayTemp.findIndex(
															f => Number(f.topic_id) === Number(titem.topic_id)
														);
														if (findex === -1) {
															this.testQuestionArrayTemp.push({
																row_span: titem.row_span,
																stArray: titem.stArray,
																topic_id: titem.topic_id,
																topic_name: titem.topic_name,
																sub_id: item.sub_id
															});
														}
													}
												}
											}
										}
										this.pieFlagTeacher = true;
										this.teachertopicsubtopicDeiv = true;
									}
								});
						});
				}
			});
	}

	getScheduledExam() {}

	getQusPosition(qus_id) {
		for (let pi = 0; pi < this.questionpaperDetail.qlist.length; pi++) {
			if (qus_id === this.questionpaperDetail.qlist[pi].qpq_qus_id) {
				return pi + 1;
			}
		}
	}
	printTestQuestionAnalysisTST() {
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
				'.attempted-icon {color: #00c4db !important;}' +
				'.skipped-icon {color: #fe756d !important;}' +
				'.bookmark-icon {color: #6610f2 !important;}' +
				'.dialog-table-review {font-size: 12px;width:100%}' +
				'.table td, .table th {padding: .75rem;vertical-align: top;border-top: 1px solid #dee2e6;}' +
				'th{width:3rem}' +
				'</style><body onload="window.print()">' +
				printModal2.innerHTML +
				'</html>'
		);
		popupWin.document.close();
	}
}

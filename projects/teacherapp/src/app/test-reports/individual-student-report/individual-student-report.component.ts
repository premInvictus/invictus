import {
	Component,
	AfterViewInit,
	OnInit,
	ViewEncapsulation
} from '@angular/core';
import { QelementService } from '../../questionbank/service/qelement.service';
import { ReportService } from '../../_services/report.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { chart } from 'highcharts';
import { HtmlToTextService } from '../../_services/htmltotext.service';
import * as Highcharts from 'highcharts';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/funnel')(Highcharts);

@Component({
	selector: 'app-individual-student-report',
	templateUrl: './individual-student-report.component.html',
	styleUrls: ['./individual-student-report.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class IndividualStudentReportComponent implements OnInit, AfterViewInit {
	percentageValue: (value: number) => string;
	gaugeValue1;
	gaugeValue2;
	es_id: number;
	eva_id: number;
	login_id: string;
	examDetail: any = {};
	currentQP: any = {};
	questionIdArray: any[] = [];
	questionsArray: any[] = [];
	questionsArrayResult: any[] = [];
	currentQA: any = {};
	currentQAIndex = 0;
	evalutionDetail: any = {};
	timeTakenDetail: any = {};
	examQuestionStatusArray: any[] = [];
	public optionHA = ['A', 'B', 'C', 'D', 'E'];
	public optionmatchHA = ['P', 'Q', 'R', 'S', 'T'];
	questionpaperDetail: any = {};
	presentStudentArray: any[] = [];
	highestMarks: number;
	classAverage: number;
	marksDetails: any = {};
	marksDetailsArray: any[] = [];
	rankDetails: any = {};
	TopicSubtopicArray: any[] = [];
	repostTopicArray: any[] = [];
	topicNameArray: any[] = [];
	topicMarkArray: any[] = [];
	viewReports: any = {};
	correctQArray: any[] = [];
	incorrectQArray: any[] = [];
	skipQArray: any[] = [];
	studentArray: any[] = [];
	stArray: any[] = [];
	testQuestionArray: any[] = [];
	subtopicNameArray: any[] = [];
	highestMarkArray: any[] = [];
	subtopicHighestArray: any[] = [];
	subjectArrayOfQP: any[] = [];
	averageMarkArray: any[] = [];
	subtopicAverageArray: any[] = [];
	etopicArray: any[] = [];
	estArray: any[] = [];
	topicSubtopicArray: any[] = [];
	tableCollection = false;
	getScheduledExamFlag = false;
	getExamAttendenceFlag = false;
	viewReportTimeTakenFlag = false;
	viewRankObtainedFlag = false;
	correctQuestioFlag = false;
	skipQuestionFlag = false;
	getCurrentQp: any;
	loading = false;
	maxMarks: any;
	markScored: any;
	trimmedPercentageVal: any;
	reportOverviewStudentTable = false;
	getInfoScoreCard = true;
	qpLength: any;
	currentEssay: any = {};
	currentQAHasEssay = false;
	subjectWiseTopicArray: any[] = [];
	topicSubtopicArrayTemp: any[] = [];
	marksScoredSubjectWiseArray: any[] = [];
	totalMarksSubtopics: any;
	public pieChartLabels: string[] = ['Correct', 'Incorrect', 'Skipped'];
	public pieChartData: number[];
	public pieChartType = 'pie';
	public chartColors: any[] = [
		{
			backgroundColor: ['#00b197', '#ff5872', '#fed000']
		}
	];
	accuracy: String;
	lineChart: any = {
		title: {
			text: 'Subtopicwise Exam Report'
		},
		xAxis: {
			categories: this.subtopicNameArray
		},
		labels: {
			items: [
				{
					html: 'Subtopicwise Exam Report',
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
				data: this.topicMarkArray
			},
			{
				type: 'spline',
				name: 'Class Average',
				color: '#fe756d',
				data: this.subtopicAverageArray
			},
			{
				type: 'spline',
				name: 'Highest Marks',
				color: '#04CDE4',
				data: this.subtopicHighestArray
			}
		]
	};
	lineChartFlag = false;
	pieOptionsFlag = false;
	pieOptions: any = {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie',
			height: 235,
			width: 250
		},
		title: {
			text: ''
		},
		tooltip: {
			pointFormat: '{series.data.name} <b>{point.y}</b>'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: false,
					format: '<b>{point.name}</b>',
					style: {
						color: 'black'
					}
				}
			}
		},
		colors: ['#04CDE4', '#fe756d', '#6610f2'],
		series: [
			{
				name: 'Answer',
				colorByPoint: true,
				data: [
					{
						name: 'Correct'
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
	firstGauge = false;
	secondGauge = false;
	gaugeOptions: any = {
		chart: {
			type: 'solidgauge',
			height: 235,
			width: 250,
			events: {
				render: ''
			}
		},

		title: {
			text: '',
			style: {
				fontSize: '10px'
			}
		},

		tooltip: {
			borderWidth: 0,
			backgroundColor: 'none',
			shadow: false,
			style: {
				fontSize: '14px'
			},
			pointFormat:
				'{series.name}<br><span style="font-size:16px; color: {point.color}; font-weight: bold;">{point.y}</span>',
			positioner: function(labelWidth) {
				return {
					x: (this.chart.chartWidth - labelWidth) / 40,
					y: this.chart.plotHeight / 2 - 117
				};
			}
		},

		pane: {
			startAngle: 0,
			endAngle: 360,
			background: [
				{
					// Track for Highest
					outerRadius: '112%',
					innerRadius: '88%',
					backgroundColor: '#04cde430',
					borderWidth: 0
				},
				{
					// Track for Marks
					outerRadius: '87%',
					innerRadius: '63%',
					backgroundColor: '#6610f238',
					borderWidth: 0
				},
				{
					// Track for Class Average
					outerRadius: '65%',
					innerRadius: '38%',
					backgroundColor: '#ffd2cf6b',
					borderWidth: 0
				}
			]
		},

		yAxis: {
			min: 0,
			max: '',
			lineWidth: 0,
			tickPositions: []
		},

		plotOptions: {
			solidgauge: {
				cursor: 'pointer',
				dataLabels: {
					enabled: false
				},
				linecap: '',
				stickyTracking: false
			}
		},

		series: [
			{
				name: 'Highest Marks',
				data: [
					{
						color: '#04CDE4',
						radius: '112%',
						innerRadius: '88%',
						y: ''
					}
				]
			},
			{
				name: 'Marks Scored',
				data: [
					{
						color: '#6610f2',
						radius: '87%',
						innerRadius: '63%',
						y: ''
					}
				]
			},
			{
				name: 'Class Average',
				data: [
					{
						color: '#fe756d',
						radius: '65%',
						innerRadius: '38%',
						y: ''
					}
				]
			}
		]
	};
	gaugeOptions2: any = {
		chart: {
			type: 'solidgauge',
			height: 120,
			width: 200
		},

		title: null,

		pane: {
			size: '100%',
			startAngle: -90,
			endAngle: 90,
			background: {
				backgroundColor: '#EEE',
				innerRadius: '60%',
				outerRadius: '100%',
				shape: 'arc'
			}
		},

		tooltip: {
			enabled: false
		},

		// the value axis
		yAxis: {
			min: 0,
			max: 100,
			title: {
				text: ''
			},
			lineWidth: 0,
			minorTickInterval: null,
			tickAmount: 2,
			labels: {
				y: 16
			}
		},

		plotOptions: {
			solidgauge: {
				dataLabels: {
					y: 5,
					borderWidth: 0,
					useHTML: true
				}
			}
		},
		series: [
			{
				name: 'Marks Obtained',
				data: [80]
			}
		]
	};
	singleIntegerArray: any[] = [
		{ id: '0' },
		{ id: '1' },
		{ id: '2' },
		{ id: '3' },
		{ id: '4' },
		{ id: '5' },
		{ id: '6' },
		{ id: '7' },
		{ id: '8' },
		{ id: '9' }
	];
	doubleIntegerArray1: any[] = [
		{ id: '0' },
		{ id: '1' },
		{ id: '2' },
		{ id: '3' },
		{ id: '4' },
		{ id: '5' },
		{ id: '6' },
		{ id: '7' },
		{ id: '8' },
		{ id: '9' }
	];
	doubleIntegerArray2: any[] = [
		{ id: '0' },
		{ id: '1' },
		{ id: '2' },
		{ id: '3' },
		{ id: '4' },
		{ id: '5' },
		{ id: '6' },
		{ id: '7' },
		{ id: '8' },
		{ id: '9' }
	];
	upperRowValue: any;
	lowerRowValue: any;
	digitValue: any;
	studentSingleFlag = false;
	upperRowFlag = false;
	lowerRowFlag = false;
	checkClass: any;
	studentSingleInputAnswer: any[] = [];
	studentDobleInputAnswer: any[] = [];
	checkUpperClass: any;
	checkLowerClass: any;
	studentMcqFlag = false;
	mcqValue: any;
	studentMcqAnswer: any;
	studentMcqmrAnswer: any;
	studentTfAnswer: any[];
	studentMtfAnswer: any[] = [];
	studentMatrixAnswer: any[] = [];
	studentMatrix45Answer: any[] = [];
	studentMcqMrFlag = false;
	trueFalseArray: any[] = [
		{ name: 'True', value: '0' },
		{ name: 'False', value: '1' }
	];
	mcqmrArray: any[] = [];
	tfFlag = false;
	tfValue: any;
	matchArray: any[] = [
		{ name: 'A', value: ['P', 'Q', 'R', 'S'] },
		{ name: 'B', value: ['P', 'Q', 'R', 'S'] },
		{ name: 'C', value: ['P', 'Q', 'R', 'S'] },
		{ name: 'D', value: ['P', 'Q', 'R', 'S'] }
	];

	matrixMatchArray: any[] = [
		{
			name: 'A',
			value: [
				{ index: 0, id: 'P' },
				{ index: 1, id: 'Q' },
				{ index: 2, id: 'R' },
				{ index: 3, id: 'S' }
			]
		},
		{
			name: 'B',
			value: [
				{ index: 4, id: 'P' },
				{ index: 5, id: 'Q' },
				{ index: 6, id: 'R' },
				{ index: 7, id: 'S' }
			]
		},
		{
			name: 'C',
			value: [
				{ index: 8, id: 'P' },
				{ index: 9, id: 'Q' },
				{ index: 10, id: 'R' },
				{ index: 11, id: 'S' }
			]
		},
		{
			name: 'D',
			value: [
				{ index: 12, id: 'P' },
				{ index: 13, id: 'Q' },
				{ index: 14, id: 'R' },
				{ index: 15, id: 'S' }
			]
		}
	];

	matrixMatch45Array: any[] = [
		{
			name: 'A',
			value: [
				{ index: 0, id: 'P' },
				{ index: 1, id: 'Q' },
				{ index: 2, id: 'R' },
				{ index: 3, id: 'S' },
				{ index: 4, id: 'T' }
			]
		},
		{
			name: 'B',
			value: [
				{ index: 5, id: 'P' },
				{ index: 6, id: 'Q' },
				{ index: 7, id: 'R' },
				{ index: 8, id: 'S' },
				{ index: 9, id: 'T' }
			]
		},
		{
			name: 'C',
			value: [
				{ index: 10, id: 'P' },
				{ index: 11, id: 'Q' },
				{ index: 12, id: 'R' },
				{ index: 13, id: 'S' },
				{ index: 14, id: 'T' }
			]
		},
		{
			name: 'D',
			value: [
				{ index: 15, id: 'P' },
				{ index: 16, id: 'Q' },
				{ index: 17, id: 'R' },
				{ index: 18, id: 'S' },
				{ index: 19, id: 'T' }
			]
		}
	];
	matchRowFirstValue: any;
	matchRowSecondValue: any;
	matchRowThirdValue: any;
	matchRowFourthValue: any;
	matchFlag = false;
	matrixStoreArray: any[] = [];
	matrixStore45Array: any[] = [];
	matrixMatchFlag = false;
	matrixMatch45Flag = false;
	subjectiveAnswer: any = { id: null };
	subjectiveInputAnswer: any;
	subjectiveFlag = false;
	showCorrect = false;
	grade: any;
	constructor(
		private qelementService: QelementService,
		private route: ActivatedRoute,
		private htt: HtmlToTextService,
		private reportService: ReportService,
		private router: Router
	) {
		this.percentageValue = function(value: number): string {
			return `${Math.round(value)} / ${this['max']}`;
		};
	}
	ngAfterViewInit() {
		this.viewReportTopic();
	}
	ngOnInit() {
		this.gaugeValue1 = '99';
		this.gaugeValue2 = '75';
		this.es_id = this.route.snapshot.params['id1'];
		this.login_id = this.route.snapshot.params['id2'];
		this.getScheduledExam();
		this.getExamAttendence();
		this.viewReportTimeTaken();
		// this.viewRankObtained();
		this.correctQuestion();
		this.subjectArrayOfQP = [];
		this.questionsArrayResult = [];
		// this.skipQuestion();
	}

	arrayFromObject(obj) {
		const arr = [];
		// tslint:disable-next-line:forin
		for (const i in obj) {
			arr.push(obj[i]);
		}
		return arr;
	}
	groupBy(list, fn) {
		const groups = {};
		for (let i = 0; i < list.length; i++) {
			const group = JSON.stringify(fn(list[i]));
			if (group in groups) {
				groups[group].push(list[i]);
			} else {
				groups[group] = [list[i]];
			}
		}
		return this.arrayFromObject(groups);
	}
	viewStudentTable() {
		this.getTopicDetails();
		this.reportOverviewStudentTable = true;
		this.getInfoScoreCard = false;
	}

	getColormcqmr(qansai) {
		if (this.currentQA.options[qansai].qopt_answer === '1') {
			return '#00b197';
		} else {
			return '';
		}
	}
	getColorMatrix(index1, index2) {
		if (this.currentQA.answer[index1][index2].qopt_answer === '1') {
			return '#00b197';
		} else {
			return '';
		}
	}
	getBoldMatrix(index1, index2) {
		if (this.currentQA.answer[index1][index2].qopt_answer === '1') {
			return 'bold';
		} else {
			return '';
		}
	}
	getColorMtf(index, value) {
		if (this.currentQA.options[index].qopt_answer === value) {
			return '#00b197';
		} else {
			return '';
		}
	}

	getboldMtf(index, value) {
		if (this.currentQA.options[index].qopt_answer === value) {
			return 'bold';
		} else {
			return '';
		}
	}
	getColorSingle(index) {
		if (Number(this.currentQA.qopt_answer) === index) {
			return '#00b197';
		} else {
			return '';
		}
	}
	getBoldSingle(index) {
		if (Number(this.currentQA.qopt_answer) === index) {
			return 'bold';
		} else {
			return '';
		}
	}

	getColorDouble(index) {
		if (
			Number(this.currentQA.qopt_answer.charAt(0)) === index ||
			Number(this.currentQA.qopt_answer.charAt(1)) === index
		) {
			return '#00b197';
		} else {
			return '';
		}
	}
	getBoldDouble(index) {
		if (
			Number(this.currentQA.qopt_answer.charAt(0)) === index ||
			Number(this.currentQA.qopt_answer.charAt(1)) === index
		) {
			return 'bold';
		} else {
			return '';
		}
	}
	getbold(qansai) {
		if (this.currentQA.options[qansai].qopt_answer === '1') {
			// return '2px solid #00b197';
			return 'bold';
		} else {
			return '';
		}
	}

	getReviewColor(reviewStatus) {
		if (reviewStatus === '2') {
			return '#00b197';
		} else if (reviewStatus === '1') {
			return '#fed000';
		} else {
			return '#ff5872';
		}
	}
	gobackScorecard() {
		this.reportOverviewStudentTable = false;
		this.getInfoScoreCard = true;
	}
	goBack() {
		this.router.navigate(['../../../report-analysis', this.examDetail.es_id], {relativeTo: this.route});
	}

	// events
	public chartClickedPie(e: any): void {}

	public chartHoveredPie(e: any): void {}
	getScorecordDiv() {
		if (
			this.getScheduledExamFlag &&
			this.getExamAttendence &&
			this.viewReportTimeTakenFlag &&
			this.viewRankObtainedFlag &&
			this.correctQuestioFlag &&
			this.skipQuestionFlag
		) {
			return true;
		}
	}

	getScheduledExam() {
		this.questionpaperDetail = [];
		this.qelementService
			.getScheduledExam({ es_id: this.es_id, es_status: '2' })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.examDetail = result.data[0];
					this.getStudents();
					this.qelementService
						.getQuestionPaper({ qp_id: this.examDetail.es_qp_id })
						.subscribe((res: any) => {
							if (res && res.status === 'ok') {
								this.questionpaperDetail = res.data[0];
								this.qpLength = this.questionpaperDetail.qlist.length;
								this.gaugeOptions.yAxis.max = Number(
									this.questionpaperDetail.tp_marks
								);
								this.getScheduledExamFlag = true;

		this.qelementService
		.getExamAttendance({ es_id: this.es_id, login_id: this.login_id })
		.subscribe((result9: any) => {
			if (result9 && result9.status === 'ok') {
				this.evalutionDetail = result9.data[0];
				this.eva_id = this.evalutionDetail.eva_id;
				this.reportService
					.viewRankObtained({ es_id: this.es_id })
					.subscribe((result2: any) => {
						if (result2 && result2.status === 'ok') {
							for (const item of result2.data) {
								if (this.eva_id === item.eva_id) {
									this.rankDetails = item;
									break;
								} else {
									this.rankDetails.rank = this.presentStudentArray.length;
								}
							}
						}
						this.viewRankObtainedFlag = true;
					});
				this.viewMarkObtained();
				this.qelementService
					.examQuestionStatus({ evd_eva_id: this.evalutionDetail.eva_id })
					.subscribe((res2: any) => {
						if (res2 && res2.status === 'ok') {
							this.examQuestionStatusArray = res2.data;
						}
					});
			}
		});
	this.qelementService
		.getScheduledExam({ es_id: this.es_id })
		.subscribe((result5: any) => {
			if (result5 && result5.status === 'ok') {
				this.examDetail = result5.data[0];
				// New Changes
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
										subId: subIdArray[i],
										subName: subNameArray[i]
									};
									this.subjectArrayOfQP.push(subIdName);
								}
							}
							for (const qitem of this.currentQP.qlist) {
								this.questionIdArray.push(qitem.qpq_qus_id);
							}
							for (const item of this.subjectArrayOfQP) {
								for (const titem of this.questionpaperDetail.qlist) {
									if (Number(titem.topic_sub_id) === Number(item.subId)) {
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
												sub_id: item.subId
											});
										} else {
											continue;
										}
									} else {
										continue;
									}
								}
							}
							this.qelementService
								.getQuestionsInTemplate({ qus_id: this.questionIdArray })
								.subscribe((result2: any) => {
									if (result2 && result2.status === 'ok') {
										this.questionsArrayResult = result2.data;
										for (const qus of this.questionsArrayResult) {
											qus.answerStatus = '';
											if (this.correctQArray.length > 0) {
												for (const cqa of this.correctQArray) {
													if (cqa.qus_id === qus.qus_id) {
														qus.answerStatus = '1';
														break;
													}
												}
											}
											if (this.incorrectQArray.length > 0) {
												for (const icqa of this.incorrectQArray) {
													if (icqa.qus_id === qus.qus_id) {
														qus.answerStatus = '0';
														break;
													}
												}
											}
											if (this.incorrectQArray.length > 0) {
												for (const sqa of this.skipQArray) {
													if (sqa.qus_id === qus.qus_id) {
														qus.answerStatus = '';
														break;
													}
												}
											}
											let qusIndex = 0;
											for (
												let item = 0;
												item < this.questionIdArray.length;
												item++
											) {
												if (this.questionIdArray[item] === qus.qus_id) {
													qusIndex = item;
													break;
												}
											}
											this.questionsArray[qusIndex] = qus;
										}
										const groupedArray = this.groupBy(
											this.questionsArray,
											item => {
												return [item.qus_ess_id];
											}
										);
										this.questionsArray = [];
										for (const group of groupedArray) {
											for (const qus of group) {
												this.questionsArray.push(qus);
											}
										}
										if (subIdArray.length > 0) {
											const groupOnSubArray = this.groupBy(
												this.questionsArray,
												item => {
													return [item.qus_sub_id];
												}
											);
											this.questionsArray = [];
											for (const group of groupOnSubArray) {
												for (const qus of group) {
													this.questionsArray.push(qus);
												}
											}
										}
										const tempArray: any[] = [];

										for (const sub of this.subjectArrayOfQP) {
											for (let i = 1; i <= 15; i++) {
												for (const item of this.questionsArray) {
													if (item.qus_sub_id === sub.subId) {
														if (Number(item.qus_qst_id) === i) {
															tempArray.push(item);
														} else {
															continue;
														}
													}
												}
											}
										}

										this.questionsArray = tempArray;
										this.currentQA = this.questionsArray[this.currentQAIndex];
										this.loadCurrentQ(this.currentQAIndex);
									}
								});
						}
					});
				// End
			}
		});
	this.digitValue = '-';
	this.upperRowValue = '-';
	this.lowerRowValue = '-';
	this.studentSingleFlag = false;
	this.upperRowFlag = false;
	this.lowerRowFlag = false;
	this.studentMcqFlag = false;
	this.mcqValue = '';
	this.studentMcqMrFlag = false;
	this.tfFlag = false;
	this.matchRowFirstValue = '';
	this.matchRowSecondValue = '';
	this.matchRowThirdValue = '';
	this.matchRowFourthValue = '';
	this.matchFlag = false;
	this.matrixMatchFlag = false;
	this.matrixMatch45Flag = false;
	this.subjectiveInputAnswer = '';
	this.subjectiveFlag = false;
							}
						});
				}
			});
	}
	getQusColor(answerStatus) {
		if (answerStatus === '') {
			return '#6f42c1';
		} else if (answerStatus === '0') {
			return '#ff5872';
		} else if (answerStatus === '1') {
			return '#00b197';
		}
	}
	loadCurrentQ(cqai) {
		this.currentQAHasEssay = false;
		this.currentQAIndex = cqai;
		this.mcqValue = '';
		this.tfValue = '';
		this.matchRowFirstValue = '';
		this.matchRowSecondValue = '';
		this.matchRowThirdValue = '';
		this.matchRowFourthValue = '';
		this.mcqmrArray = [];
		this.matrixStoreArray = [];
		this.matrixStore45Array = [];
		this.matchArray = [
			{ name: 'A', value: ['P', 'Q', 'R', 'S'] },
			{ name: 'B', value: ['P', 'Q', 'R', 'S'] },
			{ name: 'C', value: ['P', 'Q', 'R', 'S'] },
			{ name: 'D', value: ['P', 'Q', 'R', 'S'] }
		];
		this.matrixMatchArray = [
			{
				name: 'A',
				value: [
					{ index: 0, id: 'P' },
					{ index: 1, id: 'Q' },
					{ index: 2, id: 'R' },
					{ index: 3, id: 'S' }
				]
			},
			{
				name: 'B',
				value: [
					{ index: 4, id: 'P' },
					{ index: 5, id: 'Q' },
					{ index: 6, id: 'R' },
					{ index: 7, id: 'S' }
				]
			},
			{
				name: 'C',
				value: [
					{ index: 8, id: 'P' },
					{ index: 9, id: 'Q' },
					{ index: 10, id: 'R' },
					{ index: 11, id: 'S' }
				]
			},
			{
				name: 'D',
				value: [
					{ index: 12, id: 'P' },
					{ index: 13, id: 'Q' },
					{ index: 14, id: 'R' },
					{ index: 15, id: 'S' }
				]
			}
		];
		this.matrixMatch45Array = [
			{
				name: 'A',
				value: [
					{ index: 0, id: 'P' },
					{ index: 1, id: 'Q' },
					{ index: 2, id: 'R' },
					{ index: 3, id: 'S' },
					{ index: 4, id: 'T' }
				]
			},
			{
				name: 'B',
				value: [
					{ index: 5, id: 'P' },
					{ index: 6, id: 'Q' },
					{ index: 7, id: 'R' },
					{ index: 8, id: 'S' },
					{ index: 9, id: 'T' }
				]
			},
			{
				name: 'C',
				value: [
					{ index: 10, id: 'P' },
					{ index: 11, id: 'Q' },
					{ index: 12, id: 'R' },
					{ index: 13, id: 'S' },
					{ index: 14, id: 'T' }
				]
			},
			{
				name: 'D',
				value: [
					{ index: 15, id: 'P' },
					{ index: 16, id: 'Q' },
					{ index: 17, id: 'R' },
					{ index: 18, id: 'S' },
					{ index: 19, id: 'T' }
				]
			}
		];
		this.trueFalseArray = [
			{ name: 'True', value: '0' },
			{ name: 'False', value: '1' }
		];
		this.singleIntegerArray = [
			{ id: '0' },
			{ id: '1' },
			{ id: '2' },
			{ id: '3' },
			{ id: '4' },
			{ id: '5' },
			{ id: '6' },
			{ id: '7' },
			{ id: '8' },
			{ id: '9' }
		];
		this.doubleIntegerArray1 = [
			{ id: '0' },
			{ id: '1' },
			{ id: '2' },
			{ id: '3' },
			{ id: '4' },
			{ id: '5' },
			{ id: '6' },
			{ id: '7' },
			{ id: '8' },
			{ id: '9' }
		];
		this.doubleIntegerArray2 = [
			{ id: '0' },
			{ id: '1' },
			{ id: '2' },
			{ id: '3' },
			{ id: '4' },
			{ id: '5' },
			{ id: '6' },
			{ id: '7' },
			{ id: '8' },
			{ id: '9' }
		];
		this.subjectiveInputAnswer = '';
		this.subjectiveAnswer.id = null;
		this.qelementService
			.getQuestionPaper({ qp_id: this.examDetail.es_qp_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.getCurrentQp = result.data[0];

					if (this.getCurrentQp.qlist) {
						for (const item of this.getCurrentQp.qlist) {
							if (
								Number(item.qpq_qus_id) ===
								Number(this.questionsArray[this.currentQAIndex].qus_id)
							) {
								this.questionsArray[this.currentQAIndex].qus_marks =
									item.qpq_marks;
								break;
							} else {
								continue;
							}
						}
					}
				}
			});
		this.currentQA = this.questionsArray[this.currentQAIndex];
		if (this.currentQA.qus_ess_id !== '' && this.currentQA.qus_ess_id != null) {
			this.qelementService
				.getEssay({ ess_id: this.currentQA.qus_ess_id })
				.subscribe((resulte: any) => {
					if (resulte && resulte.status === 'ok') {
						this.currentEssay = resulte.data[0];
						this.currentQAHasEssay = true;
					}
				});
		}
		this.qelementService
			.studentWiseAnswerReview1({
				evd_eva_id: this.eva_id,
				evd_qt_id: this.currentQA.qus_qt_id,
				evd_qus_id: this.currentQA.qus_id
			})
			.subscribe((result: any) => {
				if (result) {
					if (result.data.length > 0) {
						if (
							Number(this.currentQA.qus_qst_id) > 5 &&
							Number(this.currentQA.qus_qst_id) < 13
						) {
							const studentAnswer = result.data[0];
							if (
								studentAnswer.evd_qus_answer !== '' &&
								studentAnswer.evd_qus_answer
							) {
								this.subjectiveAnswer.id = studentAnswer.evd_qus_answer;
								this.subjectiveFlag = true;
							} else {
								this.subjectiveFlag = false;
								this.subjectiveInputAnswer = '';
								// Reset Value
								this.subjectiveAnswer.id = null;
								// End
								// this.subjectiveAnswer.id="";
							}
						} else if (Number(this.currentQA.qus_qst_id) === 1) {
							// New MCQ
							this.studentMcqAnswer = result.data;
							this.studentMcqFlag = true;
							// End
						} else if (Number(this.currentQA.qus_qst_id) === 2) {
							// New MCQ MR
							this.studentMcqmrAnswer = result.data;
							for (let i = 0; i < this.studentMcqmrAnswer.length; i++) {
								if (Number(this.studentMcqmrAnswer[i].evd_qus_answer) === 1) {
									this.mcqmrArray.push({
										value: i
									});
								}
							}
							this.studentMcqMrFlag = true;
							// End
						} else if (Number(this.currentQA.qus_qst_id) === 3) {
							// New TF
							this.studentTfAnswer = result.data;
							this.tfFlag = true;
							// End
						} else if (this.currentQA.qus_qst_id === 4) {
							// New Match
							this.studentMtfAnswer = result.data;
							this.matchFlag = true;
							// End
						} else if (Number(this.currentQA.qus_qst_id) === 5) {
							this.studentMatrixAnswer = result.data;
							let ctr = 0;
							for (let i = 0; i < this.studentMatrixAnswer.length / 4; i++) {
								for (let j = 0; j < this.studentMatrixAnswer.length / 4; j++) {
									if (
										Number(this.studentMatrixAnswer[ctr].evd_qus_answer) === 1
									) {
										this.matrixStoreArray.push({
											id: i,
											value: ctr
										});
									}
									ctr++;
								}
							}
							this.matrixMatchFlag = true;
							// End
						} else if (Number(this.currentQA.qus_qst_id) === 13) {
							// New Matrix 4 *5
							this.studentMatrix45Answer = result.data;
							let ctr = 0;
							for (let i = 0; i < this.studentMatrix45Answer.length / 5; i++) {
								for (
									let j = 0;
									j < this.studentMatrix45Answer.length / 4;
									j++
								) {
									if (
										Number(this.studentMatrix45Answer[ctr].evd_qus_answer) === 1
									) {
										this.matrixStore45Array.push({
											id: i,
											value: ctr
										});
									}
									ctr++;
								}
							}
							this.matrixMatch45Flag = true;
							// End
						} else if (Number(this.currentQA.qus_qst_id) === 14) {
							this.studentSingleInputAnswer = result.data;
							if (this.studentSingleInputAnswer[0].evd_qus_answer) {
								this.digitValue = Number(
									this.studentSingleInputAnswer[0].evd_qus_answer
								);
								this.studentSingleFlag = true;
							} else {
								this.digitValue = '-';
								this.studentSingleFlag = false;
								// Reset Value
								this.singleIntegerArray = [
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null }
								];
								// End
								this.singleIntegerArray = [
									{ id: '0' },
									{ id: '1' },
									{ id: '2' },
									{ id: '3' },
									{ id: '4' },
									{ id: '5' },
									{ id: '6' },
									{ id: '7' },
									{ id: '8' },
									{ id: '9' }
								];
							}
						} else if (Number(this.currentQA.qus_qst_id) === 15) {
							this.studentDobleInputAnswer = result.data;
							if (this.studentDobleInputAnswer[0].evd_qus_answer) {
								this.upperRowValue = this.studentDobleInputAnswer[0].evd_qus_answer.charAt(
									0
								);
								this.lowerRowValue = this.studentDobleInputAnswer[0].evd_qus_answer.charAt(
									1
								);
								this.upperRowFlag = true;
								this.lowerRowFlag = true;
							} else {
								this.upperRowValue = '-';
								this.lowerRowValue = '-';
								this.upperRowFlag = false;
								this.lowerRowFlag = false;
								// Reset Value
								this.doubleIntegerArray1 = [
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null }
								];
								this.doubleIntegerArray2 = [
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null },
									{ id: null }
								];
								// End
								this.doubleIntegerArray1 = [
									{ id: '0' },
									{ id: '1' },
									{ id: '2' },
									{ id: '3' },
									{ id: '4' },
									{ id: '5' },
									{ id: '6' },
									{ id: '7' },
									{ id: '8' },
									{ id: '9' }
								];
								this.doubleIntegerArray2 = [
									{ id: '0' },
									{ id: '1' },
									{ id: '2' },
									{ id: '3' },
									{ id: '4' },
									{ id: '5' },
									{ id: '6' },
									{ id: '7' },
									{ id: '8' },
									{ id: '9' }
								];
							}
						}
					} else {
						if (
							Number(this.currentQA.qus_qst_id) > 5 &&
							Number(this.currentQA.qus_qst_id) < 13
						) {
							this.subjectiveFlag = false;
							this.subjectiveInputAnswer = '';
							// Reset Value
							this.subjectiveAnswer.id = null;
							// End
						} else if (Number(this.currentQA.qus_qst_id) === 1) {
							this.studentMcqFlag = false;
						} else if (Number(this.currentQA.qus_qst_id) === 2) {
							this.studentMcqMrFlag = false;
						} else if (Number(this.currentQA.qus_qst_id) === 3) {
							this.tfFlag = false;
							// Reset
							this.trueFalseArray = [
								{ name: 'True', value: null },
								{ name: 'False', value: null }
							];
							// End\
							this.trueFalseArray = [
								{ name: 'True', value: '0' },
								{ name: 'False', value: '1' }
							];
						} else if (Number(this.currentQA.qus_qst_id) === 4) {
							this.matchFlag = false;
							// Resets the value
							this.matchArray = [
								{ name: 'A', value: [null, null, null, null] },
								{ name: 'B', value: [null, null, null, null] },
								{ name: 'C', value: [null, null, null, null] },
								{ name: 'D', value: [null, null, null, null] }
							];
							// Ends
							this.matchArray = [
								{ name: 'A', value: ['P', 'Q', 'R', 'S'] },
								{ name: 'B', value: ['P', 'Q', 'R', 'S'] },
								{ name: 'C', value: ['P', 'Q', 'R', 'S'] },
								{ name: 'D', value: ['P', 'Q', 'R', 'S'] }
							];
						} else if (Number(this.currentQA.qus_qst_id) === 5) {
							this.matrixMatchFlag = false;
							// Reset The value
							this.matrixMatchArray = [
								{
									name: 'A',
									value: [
										{ index: null, id: 'P' },
										{ index: null, id: 'Q' },
										{ index: null, id: 'R' },
										{ index: null, id: 'S' }
									]
								},
								{
									name: 'B',
									value: [
										{ index: null, id: 'P' },
										{ index: null, id: 'Q' },
										{ index: null, id: 'R' },
										{ index: null, id: 'S' }
									]
								},
								{
									name: 'C',
									value: [
										{ index: null, id: 'P' },
										{ index: null, id: 'Q' },
										{ index: null, id: 'R' },
										{ index: null, id: 'S' }
									]
								},
								{
									name: 'D',
									value: [
										{ index: null, id: 'P' },
										{ index: null, id: 'Q' },
										{ index: null, id: 'R' },
										{ index: null, id: 'S' }
									]
								}
							];
							// End
							this.matrixMatchArray = [
								{
									name: 'A',
									value: [
										{ index: 0, id: 'P' },
										{ index: 1, id: 'Q' },
										{ index: 2, id: 'R' },
										{ index: 3, id: 'S' }
									]
								},
								{
									name: 'B',
									value: [
										{ index: 4, id: 'P' },
										{ index: 5, id: 'Q' },
										{ index: 6, id: 'R' },
										{ index: 7, id: 'S' }
									]
								},
								{
									name: 'C',
									value: [
										{ index: 8, id: 'P' },
										{ index: 9, id: 'Q' },
										{ index: 10, id: 'R' },
										{ index: 11, id: 'S' }
									]
								},
								{
									name: 'D',
									value: [
										{ index: 12, id: 'P' },
										{ index: 13, id: 'Q' },
										{ index: 14, id: 'R' },
										{ index: 15, id: 'S' }
									]
								}
							];
						} else if (Number(this.currentQA.qus_qst_id) === 13) {
							this.matrixMatch45Flag = false;
							// Reset Value
							this.matrixMatch45Array = [
								{
									name: 'A',
									value: [
										{ index: null, id: 'P' },
										{ index: null, id: 'Q' },
										{ index: null, id: 'R' },
										{ index: null, id: 'S' },
										{ index: null, id: 'T' }
									]
								},
								{
									name: 'B',
									value: [
										{ index: null, id: 'P' },
										{ index: null, id: 'Q' },
										{ index: null, id: 'R' },
										{ index: null, id: 'S' },
										{ index: null, id: 'T' }
									]
								},
								{
									name: 'C',
									value: [
										{ index: null, id: 'P' },
										{ index: null, id: 'Q' },
										{ index: null, id: 'R' },
										{ index: null, id: 'S' },
										{ index: null, id: 'T' }
									]
								},
								{
									name: 'D',
									value: [
										{ index: null, id: 'P' },
										{ index: null, id: 'Q' },
										{ index: null, id: 'R' },
										{ index: null, id: 'S' },
										{ index: null, id: 'T' }
									]
								}
							];
							// End
							this.matrixMatch45Array = [
								{
									name: 'A',
									value: [
										{ index: 0, id: 'P' },
										{ index: 1, id: 'Q' },
										{ index: 2, id: 'R' },
										{ index: 3, id: 'S' },
										{ index: 4, id: 'T' }
									]
								},
								{
									name: 'B',
									value: [
										{ index: 5, id: 'P' },
										{ index: 6, id: 'Q' },
										{ index: 7, id: 'R' },
										{ index: 8, id: 'S' },
										{ index: 9, id: 'T' }
									]
								},
								{
									name: 'C',
									value: [
										{ index: 10, id: 'P' },
										{ index: 11, id: 'Q' },
										{ index: 12, id: 'R' },
										{ index: 13, id: 'S' },
										{ index: 14, id: 'T' }
									]
								},
								{
									name: 'D',
									value: [
										{ index: 15, id: 'P' },
										{ index: 16, id: 'Q' },
										{ index: 17, id: 'R' },
										{ index: 18, id: 'S' },
										{ index: 19, id: 'T' }
									]
								}
							];
						} else if (Number(this.currentQA.qus_qst_id) === 14) {
							this.studentSingleFlag = false;
							this.digitValue = '-';
							// Reset Value
							this.singleIntegerArray = [
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null }
							];
							// End
							this.singleIntegerArray = [
								{ id: '0' },
								{ id: '1' },
								{ id: '2' },
								{ id: '3' },
								{ id: '4' },
								{ id: '5' },
								{ id: '6' },
								{ id: '7' },
								{ id: '8' },
								{ id: '9' }
							];
						} else if (Number(this.currentQA.qus_qst_id) === 15) {
							this.upperRowFlag = false;
							this.lowerRowFlag = false;
							this.upperRowValue = '-';
							this.lowerRowValue = '-';
							// Reset
							this.doubleIntegerArray1 = [
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null }
							];
							this.doubleIntegerArray2 = [
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null },
								{ id: null }
							];
							// Value
							this.doubleIntegerArray1 = [
								{ id: '0' },
								{ id: '1' },
								{ id: '2' },
								{ id: '3' },
								{ id: '4' },
								{ id: '5' },
								{ id: '6' },
								{ id: '7' },
								{ id: '8' },
								{ id: '9' }
							];
							this.doubleIntegerArray2 = [
								{ id: '0' },
								{ id: '1' },
								{ id: '2' },
								{ id: '3' },
								{ id: '4' },
								{ id: '5' },
								{ id: '6' },
								{ id: '7' },
								{ id: '8' },
								{ id: '9' }
							];
						}
					}

					// End
				} else {
					if (this.currentQA.qus_qst_id > 5 && this.currentQA.qus_qst_id < 13) {
						this.subjectiveFlag = false;
						this.subjectiveInputAnswer = '';
						// Reset Value
						this.subjectiveAnswer.id = null;
						// End
					} else if (this.currentQA.qus_qst_id === 1) {
						this.studentMcqFlag = false;
					} else if (this.currentQA.qus_qst_id === 2) {
						this.studentMcqMrFlag = false;
					} else if (this.currentQA.qus_qst_id === 3) {
						this.tfFlag = false;
						// Reset
						this.trueFalseArray = [
							{ name: 'True', value: null },
							{ name: 'False', value: null }
						];
						// End\
						this.trueFalseArray = [
							{ name: 'True', value: '0' },
							{ name: 'False', value: '1' }
						];
					} else if (this.currentQA.qus_qst_id === 4) {
						this.matchFlag = false;
						// Resets the value
						this.matchArray = [
							{ name: 'A', value: [null, null, null, null] },
							{ name: 'B', value: [null, null, null, null] },
							{ name: 'C', value: [null, null, null, null] },
							{ name: 'D', value: [null, null, null, null] }
						];
						// Ends
						this.matchArray = [
							{ name: 'A', value: ['P', 'Q', 'R', 'S'] },
							{ name: 'B', value: ['P', 'Q', 'R', 'S'] },
							{ name: 'C', value: ['P', 'Q', 'R', 'S'] },
							{ name: 'D', value: ['P', 'Q', 'R', 'S'] }
						];
					} else if (this.currentQA.qus_qst_id === 5) {
						this.matrixMatchFlag = false;
						// Reset The value
						this.matrixMatchArray = [
							{
								name: 'A',
								value: [
									{ index: null, id: 'P' },
									{ index: null, id: 'Q' },
									{ index: null, id: 'R' },
									{ index: null, id: 'S' }
								]
							},
							{
								name: 'B',
								value: [
									{ index: null, id: 'P' },
									{ index: null, id: 'Q' },
									{ index: null, id: 'R' },
									{ index: null, id: 'S' }
								]
							},
							{
								name: 'C',
								value: [
									{ index: null, id: 'P' },
									{ index: null, id: 'Q' },
									{ index: null, id: 'R' },
									{ index: null, id: 'S' }
								]
							},
							{
								name: 'D',
								value: [
									{ index: null, id: 'P' },
									{ index: null, id: 'Q' },
									{ index: null, id: 'R' },
									{ index: null, id: 'S' }
								]
							}
						];
						// End
						this.matrixMatchArray = [
							{
								name: 'A',
								value: [
									{ index: 0, id: 'P' },
									{ index: 1, id: 'Q' },
									{ index: 2, id: 'R' },
									{ index: 3, id: 'S' }
								]
							},
							{
								name: 'B',
								value: [
									{ index: 4, id: 'P' },
									{ index: 5, id: 'Q' },
									{ index: 6, id: 'R' },
									{ index: 7, id: 'S' }
								]
							},
							{
								name: 'C',
								value: [
									{ index: 8, id: 'P' },
									{ index: 9, id: 'Q' },
									{ index: 10, id: 'R' },
									{ index: 11, id: 'S' }
								]
							},
							{
								name: 'D',
								value: [
									{ index: 12, id: 'P' },
									{ index: 13, id: 'Q' },
									{ index: 14, id: 'R' },
									{ index: 15, id: 'S' }
								]
							}
						];
					} else if (this.currentQA.qus_qst_id === 13) {
						this.matrixMatch45Flag = false;
						// Reset Value
						this.matrixMatch45Array = [
							{
								name: 'A',
								value: [
									{ index: null, id: 'P' },
									{ index: null, id: 'Q' },
									{ index: null, id: 'R' },
									{ index: null, id: 'S' },
									{ index: null, id: 'T' }
								]
							},
							{
								name: 'B',
								value: [
									{ index: null, id: 'P' },
									{ index: null, id: 'Q' },
									{ index: null, id: 'R' },
									{ index: null, id: 'S' },
									{ index: null, id: 'T' }
								]
							},
							{
								name: 'C',
								value: [
									{ index: null, id: 'P' },
									{ index: null, id: 'Q' },
									{ index: null, id: 'R' },
									{ index: null, id: 'S' },
									{ index: null, id: 'T' }
								]
							},
							{
								name: 'D',
								value: [
									{ index: null, id: 'P' },
									{ index: null, id: 'Q' },
									{ index: null, id: 'R' },
									{ index: null, id: 'S' },
									{ index: null, id: 'T' }
								]
							}
						];
						// End
						this.matrixMatch45Array = [
							{
								name: 'A',
								value: [
									{ index: 0, id: 'P' },
									{ index: 1, id: 'Q' },
									{ index: 2, id: 'R' },
									{ index: 3, id: 'S' },
									{ index: 4, id: 'T' }
								]
							},
							{
								name: 'B',
								value: [
									{ index: 5, id: 'P' },
									{ index: 6, id: 'Q' },
									{ index: 7, id: 'R' },
									{ index: 8, id: 'S' },
									{ index: 9, id: 'T' }
								]
							},
							{
								name: 'C',
								value: [
									{ index: 10, id: 'P' },
									{ index: 11, id: 'Q' },
									{ index: 12, id: 'R' },
									{ index: 13, id: 'S' },
									{ index: 14, id: 'T' }
								]
							},
							{
								name: 'D',
								value: [
									{ index: 15, id: 'P' },
									{ index: 16, id: 'Q' },
									{ index: 17, id: 'R' },
									{ index: 18, id: 'S' },
									{ index: 19, id: 'T' }
								]
							}
						];
					} else if (Number(this.currentQA.qus_qst_id) === 14) {
						this.studentSingleFlag = false;
						this.digitValue = '-';
						// Reset Value
						this.singleIntegerArray = [
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null }
						];
						// End
						this.singleIntegerArray = [
							{ id: '0' },
							{ id: '1' },
							{ id: '2' },
							{ id: '3' },
							{ id: '4' },
							{ id: '5' },
							{ id: '6' },
							{ id: '7' },
							{ id: '8' },
							{ id: '9' }
						];
					} else if (this.currentQA.qus_qst_id === 15) {
						this.upperRowFlag = false;
						this.lowerRowFlag = false;
						this.upperRowValue = '-';
						this.lowerRowValue = '-';
						// Reset Value
						this.doubleIntegerArray1 = [
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null }
						];
						this.doubleIntegerArray2 = [
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null },
							{ id: null }
						];
						// End
						this.doubleIntegerArray1 = [
							{ id: '0' },
							{ id: '1' },
							{ id: '2' },
							{ id: '3' },
							{ id: '4' },
							{ id: '5' },
							{ id: '6' },
							{ id: '7' },
							{ id: '8' },
							{ id: '9' }
						];
						this.doubleIntegerArray2 = [
							{ id: '0' },
							{ id: '1' },
							{ id: '2' },
							{ id: '3' },
							{ id: '4' },
							{ id: '5' },
							{ id: '6' },
							{ id: '7' },
							{ id: '8' },
							{ id: '9' }
						];
					}
				}

				// End
			});
		// End
	}
	getTabChangedEvent($event) {
		if (Number($event.index) === 2) {
			this.loadCurrentQ(0);
		}
	}
	previousQ() {
		this.loadCurrentQ(this.currentQAIndex - 1);
	}
	nextQ() {
		if (this.currentQAIndex < this.questionsArray.length - 1) {
			this.loadCurrentQ(this.currentQAIndex + 1);
		}
	}
	htmlToText(html) {
		return this.htt.htmlToText(html);
	}

	getExamAttendence() {
		this.qelementService
			.getExamAttendance({ es_id: this.es_id })
			.subscribe((result: any) => {
				if (result) {
					this.presentStudentArray = result.data;
					this.getExamAttendenceFlag = true;
				} else {
					this.presentStudentArray = [];
					this.getExamAttendenceFlag = true;
				}
			});
	}

	viewMarkObtained() {
		this.reportService
			.viewMarkObtained({ es_id: this.es_id })
			.subscribe((result: any) => {
				if (result) {
					this.marksDetailsArray = result.data;
					this.highestMarks = 0;
					this.classAverage = 0;
					let totalStu = 0;
					for (const marks of this.marksDetailsArray) {
						totalStu++;
						this.classAverage += Number(marks.total_mark);
						if (Number(marks.total_mark) >= this.highestMarks) {
							this.highestMarks = Number(marks.total_mark);
							this.gaugeOptions.series[0].data[0].y = [this.highestMarks];
						}
						if (marks.eva_id === this.eva_id) {
							this.marksDetails = marks;
						}
					}
					this.gaugeValue1 = this.marksDetails.total_mark;
					this.gaugeValue2 = this.classAverage / totalStu;
					if (this.gaugeValue1) {
						this.gaugeOptions.series[1].data[0].y = [
							// tslint:disable-next-line:radix
							parseInt(this.gaugeValue1)
						];
					} else {
						// tslint:disable-next-line:radix
						this.gaugeOptions.series[1].data[0].y = [parseInt('0')];
					}
					// tslint:disable-next-line:radix
					this.gaugeOptions.series[2].data[0].y = [parseInt(this.gaugeValue2)];
					this.firstGauge = true;
					this.secondGauge = true;
				}
			});
	}

	// viewRankObtained() {
	//   this.reportService.viewRankObtained({ es_id: this.es_id }).subscribe(
	//     (result: any) => {
	//       if (result) {
	//         for (const item of result.data) {
	//           if (this.eva_id == item.eva_id) {
	//             this.rankDetails = item;
	//             break;
	//           }
	//           else{
	//             this.rankDetails.rank=this.presentStudentArray.length;
	//           }
	//         }
	//       }
	//       this.viewRankObtainedFlag = true;
	//     }
	//   );
	// }
	viewReportTopicSubtopic() {
		this.stArray = [];
		this.testQuestionArray = [];
		this.etopicArray = [];
		this.estArray = [];
		this.subtopicNameArray = [];
		this.topicMarkArray = [];
		this.highestMarkArray = [];
		this.subtopicHighestArray = [];
		this.subtopicAverageArray = [];
		this.averageMarkArray = [];
		this.topicSubtopicArray = [];
		this.TopicSubtopicArray = [];
		this.topicSubtopicArrayTemp = [];
		this.totalMarksSubtopics = 0;

		this.reportService
			.viewReportTopicSubtopic({ es_id: this.es_id, login_id: this.login_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.TopicSubtopicArray = result.data;
					const topSubstopicSubjetWiseArray: any[] = [];
					for (const item of this.TopicSubtopicArray) {
						topSubstopicSubjetWiseArray.push(item);
					}

					for (const item of this.subjectWiseTopicArray) {
						for (const titem of topSubstopicSubjetWiseArray) {
							if (Number(item.st_id) === Number(titem.st_id)) {
								this.subtopicNameArray.push(item.st_name);
								this.topicMarkArray.push(Number(titem.mark_scored));
								break;
							}
						}
					}
					for (const item of this.topicMarkArray) {
						this.totalMarksSubtopics = this.totalMarksSubtopics + item;
					}
					this.totalMarksSubtopics = this.totalMarksSubtopics.toFixed(2);
					this.lineChart.xAxis.categories = this.subtopicNameArray;
					this.lineChart.series[0].data = this.topicMarkArray;
					this.reportService
						.classHighest({ es_id: this.es_id })
						.subscribe((response: any) => {
							if (response && response.status === 'ok') {
								this.highestMarkArray = response.data;
								for (const item of this.subjectWiseTopicArray) {
									for (const titem of this.highestMarkArray) {
										if (Number(item.st_id) === Number(titem.st_id)) {
											this.subtopicHighestArray.push(Number(titem.highest));
											break;
										}
									}
								}
								this.lineChart.series[2].data = this.subtopicHighestArray;
								this.reportService
									.classAverage({ es_id: this.es_id })
									.subscribe((res: any) => {
										if (res && res.status === 'ok') {
											this.averageMarkArray = res.data;
											for (const item of this.subjectWiseTopicArray) {
												for (const titem of this.averageMarkArray) {
													if (Number(item.st_id) === Number(titem.st_id)) {
														this.subtopicAverageArray.push(
															Number(this.convertFloat(titem.average_score))
														);
														break;
													}
												}
											}
											this.lineChart.series[1].data = this.subtopicAverageArray;
										}
										this.lineChartFlag = true;
									});
							}
						});
					let curTopic_id = 0;
					let curTopic_name = '';
					for (const item of this.TopicSubtopicArray) {
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
					for (const item of this.TopicSubtopicArray) {
						if (curst_id !== item.st_id) {
							curst_id = item.st_id;
							curst_name = item.st_name;
							curTopic_id = item.topic_id;
							this.maxMarks = item.max_mark;
							this.markScored = item.mark_scored;
							const percentage = (this.markScored / this.maxMarks) * 100;
							const str = percentage.toString();
							this.trimmedPercentageVal = str.slice(0, 4);
							this.estArray.push({
								topic_id: curTopic_id,
								st_id: curst_id,
								st_name: curst_name,
								max_mark: this.maxMarks,
								mark_scored: this.markScored,
								percentage: this.trimmedPercentageVal
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
						let cntRowSpan = 0;
						jitem.row_span = jitem.stArray.length.toString();
						cntRowSpan += jitem.stArray.length;
						jitem.row_span = cntRowSpan.toString();
						this.tableCollection = true;
					}
					for (const item of this.subjectWiseTopicArray) {
						for (const titem of this.topicSubtopicArray) {
							for (const st of titem.stArray) {
								if (Number(item.st_id) === Number(st.st_id)) {
									const findex = this.topicSubtopicArrayTemp.findIndex(
										f => Number(f.topic_id) === Number(titem.topic_id)
									);
									if (findex === -1) {
										this.topicSubtopicArrayTemp.push({
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
				}
			});
	}

	getTopicDetails() {
		this.stArray = [];
		this.testQuestionArray = [];
		this.etopicArray = [];
		this.estArray = [];
		this.subtopicNameArray = [];
		this.topicMarkArray = [];
		this.highestMarkArray = [];
		this.subtopicHighestArray = [];
		this.subtopicAverageArray = [];
		this.averageMarkArray = [];
		this.topicSubtopicArray = [];
		this.TopicSubtopicArray = [];
		this.topicSubtopicArrayTemp = [];
		this.totalMarksSubtopics = 0;

		this.reportService
			.viewReportTopicSubtopic({ es_id: this.es_id, login_id: this.login_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.TopicSubtopicArray = result.data;
					const topSubstopicSubjetWiseArray: any[] = [];
					for (const item of this.TopicSubtopicArray) {
						topSubstopicSubjetWiseArray.push(item);
					}

					for (const item of this.subjectWiseTopicArray) {
						for (const titem of topSubstopicSubjetWiseArray) {
							if (Number(item.st_id) === Number(titem.st_id)) {
								this.subtopicNameArray.push(item.st_name);
								this.topicMarkArray.push(Number(titem.mark_scored));
								break;
							}
						}
					}
					for (const item of this.topicMarkArray) {
						this.totalMarksSubtopics = this.totalMarksSubtopics + item;
					}
					this.totalMarksSubtopics = this.totalMarksSubtopics.toFixed(2);
					this.lineChart.xAxis.categories = this.subtopicNameArray;
					this.lineChart.series[0].data = this.topicMarkArray;

					this.reportService
						.classHighest({ es_id: this.es_id })
						.subscribe((response: any) => {
							if (response && response.status === 'ok') {
								this.highestMarkArray = response.data;
								for (const item of this.subjectWiseTopicArray) {
									for (const titem of this.highestMarkArray) {
										if (Number(item.st_id) === Number(titem.st_id)) {
											this.subtopicHighestArray.push(Number(titem.highest));
											break;
										}
									}
								}
								this.lineChart.series[2].data = this.subtopicHighestArray;
								this.reportService
									.classAverage({ es_id: this.es_id })
									.subscribe((res: any) => {
										if (res && res.status === 'ok') {
											this.averageMarkArray = res.data;
											for (const item of this.subjectWiseTopicArray) {
												for (const titem of this.averageMarkArray) {
													if (Number(item.st_id) === Number(titem.st_id)) {
														this.subtopicAverageArray.push(
															Number(this.convertFloat(titem.average_score))
														);
														break;
													}
												}
											}
											this.lineChart.series[1].data = this.subtopicAverageArray;
										}
										// this.lineChartFlag = true
									});
							}
						});
					let curTopic_id = 0;
					let curTopic_name = '';
					for (const item of this.TopicSubtopicArray) {
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
					for (const item of this.TopicSubtopicArray) {
						if (curst_id !== item.st_id) {
							curst_id = item.st_id;
							curst_name = item.st_name;
							curTopic_id = item.topic_id;
							this.maxMarks = item.max_mark;
							this.markScored = item.mark_scored;
							const percentage = (this.markScored / this.maxMarks) * 100;
							const str = percentage.toString();
							this.trimmedPercentageVal = str.slice(0, 4);
							this.estArray.push({
								topic_id: curTopic_id,
								st_id: curst_id,
								st_name: curst_name,
								max_mark: this.maxMarks,
								mark_scored: this.markScored,
								percentage: this.trimmedPercentageVal
							});
						}
					}
					let jitem: any = {};
					this.topicSubtopicArray = [];
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
						let cntRowSpan = 0;
						jitem.row_span = jitem.stArray.length.toString();
						cntRowSpan += jitem.stArray.length;
						jitem.row_span = cntRowSpan.toString();
						this.tableCollection = true;
					}
					for (const item of this.subjectWiseTopicArray) {
						for (const titem of this.topicSubtopicArray) {
							for (const st of titem.stArray) {
								if (Number(item.st_id) === Number(st.st_id)) {
									const findex = this.topicSubtopicArrayTemp.findIndex(
										f => Number(f.topic_id) === Number(titem.topic_id)
									);
									if (findex === -1) {
										this.topicSubtopicArrayTemp.push({
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
				}
			});
	}

	viewReportTopic() {
		this.reportService
			.viewReportTopic({ es_id: this.es_id, login_id: this.login_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.repostTopicArray = result.data;
				}
			});
	}
	correctQuestion() {
		this.correctQArray = [];
		this.reportService
			.correctQuestion({ es_id: this.es_id, login_id: this.login_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.correctQArray = result.data;
				} else {
					this.correctQArray = [];
				}
				this.incorrectQuestion();
				this.correctQuestioFlag = true;
			});
	}
	incorrectQuestion() {
		this.incorrectQArray = [];
		this.reportService
			.incorrectQuestion({ es_id: this.es_id, login_id: this.login_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.incorrectQArray = result.data;
				} else {
					this.incorrectQArray = [];
				}
				this.accuracy = Number(
					(this.correctQArray.length * 100) /
						(this.correctQArray.length + this.incorrectQArray.length)
				).toFixed(0);
				if (this.accuracy === 'NaN') {
					this.accuracy = '0';
				} else {
					this.accuracy = this.accuracy;
				}
				this.skipQuestion();
			});
	}
	skipQuestion() {
		this.reportService
			.skipQuestion({ es_id: this.es_id, login_id: this.login_id })
			.subscribe((result: any) => {
				this.skipQArray = [];
				if (result && result.status === 'ok') {
					this.skipQArray = result.data;
					this.skipQuestionFlag = true;
				} else {
					this.skipQArray = [];
					this.skipQuestionFlag = true;
				}
				this.pieChartData = [
					this.correctQArray.length,
					this.incorrectQArray.length,
					this.skipQArray.length
				];
				if (this.correctQArray.length) {
					this.pieOptions.series[0].data[0].y = this.correctQArray.length;
				} else {
					this.pieOptions.series[0].data[0].y = 0;
				}
				if (this.incorrectQArray.length) {
					this.pieOptions.series[0].data[1].y = this.incorrectQArray.length;
				} else {
					this.pieOptions.series[0].data[1].y = 0;
				}
				if (this.skipQArray.length) {
					this.pieOptions.series[0].data[2].y = this.skipQArray.length;
				} else {
					this.pieOptions.series[0].data[2].y = 0;
				}

				this.pieOptionsFlag = true;
				this.skipQuestionFlag = true;
			});
	}
	viewReportTimeTaken() {
		this.reportService
			.viewReportTimeTaken({ es_id: this.es_id, login_id: this.login_id })
			.subscribe((result: any) => {
				this.timeTakenDetail = [];
				if (result && result.status === 'ok') {
					this.timeTakenDetail = result.data[0];
				} else {
					this.timeTakenDetail = [];
				}
				if (this.timeTakenDetail.time_taken) {
					const a = this.timeTakenDetail.time_taken.split(':');
					const minutes = +a[0] * 60 + +a[1];
					this.timeTakenDetail.time_taken = minutes;
				} else {
					this.timeTakenDetail.time_taken = 0;
				}
				this.viewReportTimeTakenFlag = true;
			});
	}

	getColor(value) {
		if (value >= 60) {
			return '<i class="far fa-flag teacher-score-flag-green"></i>';
		} else if (value > 40) {
			return '<i class="far fa-flag teacher-score-flag-yellow"></i>';
		} else {
			return '<i class="far fa-flag teacher-score-flag-red"></i>';
		}
	}

	viewReport() {
		this.reportService
			.viewReport({ login_id: this.login_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					for (const item of result.data) {
						if (this.login_id === item.login_id) {
							this.viewReports = item;
							break;
						}
					}
				}
			});
	}

	getStudents() {
		this.qelementService
			.getUser({
				class_id: this.examDetail.es_class_id,
				sec_id: this.examDetail.es_sec_id,
				role_id: '4',
				status: '1'
			})
			.subscribe((result: any) => {
				this.studentArray = [];
				if (result && result.status === 'ok') {
					this.studentArray = result.data;
				}
			});
	}

	showPerformanceGraph() {
		this.viewReportTopicSubtopic();
	}
	reloadData() {
		this.ngOnInit();
	}

	checkSingleIntegerStatus(item) {
		if (
			this.studentSingleInputAnswer[0].evd_qus_answer &&
			Number(item) === Number(this.studentSingleInputAnswer[0].evd_qus_answer)
		) {
			return true;
		} else {
			return false;
		}
	}

	checkUpperRowStatus(item) {
		if (
			this.studentDobleInputAnswer[0].evd_qus_answer &&
			Number(item) ===
				Number(this.studentDobleInputAnswer[0].evd_qus_answer.charAt(0))
		) {
			return true;
		} else {
			return false;
		}
	}

	checkLowerRowStatus(item) {
		if (
			this.studentDobleInputAnswer[0].evd_qus_answer &&
			Number(item) ===
				Number(this.studentDobleInputAnswer[0].evd_qus_answer.charAt(1))
		) {
			return true;
		} else {
			return false;
		}
	}
	checkMcqAnswerStatus(index) {
		if (
			this.studentMcqAnswer[index] &&
			this.studentMcqAnswer[index].evd_qus_answer &&
			Number(this.studentMcqAnswer[index].evd_qus_answer) === 1
		) {
			return true;
		} else {
			return false;
		}
	}
	checkMcqMrAnswerStatus(index) {
		if (
			this.studentMcqmrAnswer[index] &&
			this.studentMcqmrAnswer[index].evd_qus_answer &&
			Number(this.studentMcqmrAnswer[index].evd_qus_answer) === 1
		) {
			return true;
		} else {
			return false;
		}
	}

	checkTfStatus(index) {
		if (
			this.studentTfAnswer[index] &&
			this.studentTfAnswer[index].evd_qus_answer &&
			Number(this.studentTfAnswer[index].evd_qus_answer) === 1
		) {
			return true;
		} else {
			return false;
		}
	}
	checkMtfStatus(value, index) {
		if (
			this.studentMtfAnswer[index] &&
			this.studentMtfAnswer[index].evd_qus_answer &&
			this.studentMtfAnswer[index].evd_qus_answer === value
		) {
			return true;
		} else {
			return false;
		}
	}

	checkMatrixMatchstatus(index) {
		if (
			this.studentMatrixAnswer[index] &&
			this.studentMatrixAnswer[index].evd_qus_answer &&
			Number(this.studentMatrixAnswer[index].evd_qus_answer) === 1
		) {
			return true;
		} else {
			return false;
		}
	}

	checkMatrixMatch45status(index) {
		if (
			this.studentMatrix45Answer[index] &&
			this.studentMatrix45Answer[index].evd_qus_answer &&
			Number(this.studentMatrix45Answer[index].evd_qus_answer) === 1
		) {
			return true;
		} else {
			return false;
		}
	}
	// End
	viewCorrectAnswer() {
		this.showCorrect = true;
		const showdiv = document.getElementById('correct-answer');
		if (showdiv.style.display === 'none') {
			showdiv.style.display = 'block';
		} else {
			showdiv.style.display = 'none';
		}
	}
	convertFloat(value) {
		const parseValue = Math.round(value * 100) / 100;
		return parseValue;
	}
	getMarksScoredSubtopicPerSubject(sub_id) {
		let sum = 0;
		for (const item of this.topicSubtopicArrayTemp) {
			if (Number(item.sub_id) === Number(sub_id)) {
				for (const titem of item.stArray) {
					sum = sum + Number(titem.mark_scored);
				}
			}
		}
		return sum.toFixed(2);
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
}

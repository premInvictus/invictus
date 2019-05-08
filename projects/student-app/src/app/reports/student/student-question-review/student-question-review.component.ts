import {
	Component,
	OnInit,
	AfterViewInit
} from '@angular/core';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { ReportService } from 'projects/axiom/src/app/reports/service/report.service';
import { ActivatedRoute } from '@angular/router';
import { chart } from 'highcharts';
import { HtmlToTextService } from 'projects/axiom/src/app/_services/htmltotext.service';
import {
	BreadCrumbService,
	NotificationService
} from 'projects/axiom/src/app/_services/index';

@Component({
	selector: 'app-student-question-review',
	templateUrl: './student-question-review.component.html',
	styleUrls: ['./student-question-review.component.css']
})
export class StudentQuestionReviewComponent implements OnInit, AfterViewInit {
	percentageValue: (value: number) => string;
	homeUrl: string;
	gaugeValue1;
	gaugeValue2;
	es_id: number;
	eva_id: number;
	login_id: string;
	viewReports: any = {};
	examDetail: any = {};
	currentQP: any = {};
	currentEssay: any = {};
	currentQAHasEssay = false;
	questionIdArray: any[] = [];
	subjectArrayOfQP: any[] = [];
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
	getCurrentQp: any;
	marksDetails: any = {};
	marksDetailsArray: any[] = [];
	rankDetails: any = {};
	TopicSubtopicArray: any[] = [];
	repostTopicArray: any[] = [];
	subtopicNameArray: any[] = [];
	topicMarkArray: any[] = [];
	correctQArray: any[] = [];
	incorrectQArray: any[] = [];
	skipQArray: any[] = [];
	stArray: any[] = [];
	etopicArray: any[] = [];
	estArray: any[] = [];
	topicSubtopicArray: any[] = [];
	testQuestionArray: any[] = [];
	tableCollection = false;
	studentArray: any[] = [];
	highestMarkArray: any[] = [];
	subtopicHighestArray: any[] = [];
	subtopicAverageArray: any[] = [];
	averageMarkArray: any[] = [];
	studentAnswerMatrix: any[] = [];
	getScheduledExamFlag = false;
	getExamAttendenceFlag = false;
	viewReportTimeTakenFlag = false;
	viewRankObtainedFlag = false;
	correctQuestioFlag = false;
	skipQuestionFlag = false;
	questionReviewFlag = false;
	maxMarks: any;
	markScored: any;
	reportOverviewStudentTable = false;
	getInfoScoreCard = true;
	trimmedPercentageVal: any;
	bookmarkedQuestionArray: any[] = [];
	bookqusidarray: any = [];
	userDetail: any = {};
	class_id: any = {};
	currentUser1: any;
	showBookMarkStatus = false;
	public pieChartLabels: string[] = ['Correct', 'Incorrect', 'Skipped'];
	public pieChartData: number[];
	public pieChartType = 'pie';
	public chartColors: any[] = [
		{
			backgroundColor: ['#00b197', '#ff5872', '#fed000']
		}
	];
	accuracy: String;
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

	constructor(
		private qelementService: QelementService,
		private route: ActivatedRoute,
		private notif: NotificationService,
		private htt: HtmlToTextService,
		private reportService: ReportService,
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
		this.es_id = this.route.snapshot.params['id'];
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.currentUser1 = JSON.parse(localStorage.getItem('currentUser'));
		this.qelementService
			.getUser({
				login_id: this.currentUser1.login_id,
				role_id: this.currentUser1.role_id
			})
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.userDetail = result.data[0];
					this.class_id = this.userDetail.au_class_id;
				}
			});
		this.login_id = currentUser.login_id;
		this.getScheduledExam();
		this.getExamAttendence();
		this.viewReportTimeTaken();
		this.viewRankObtained();
		this.correctQuestion();
		this.skipQuestion();
		this.viewReportTopicSubtopic();

		this.qelementService
			.getExamAttendance({ es_id: this.es_id, login_id: currentUser.login_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.evalutionDetail = result.data[0];
					this.eva_id = this.evalutionDetail.eva_id;
					this.viewMarkObtained();

					this.qelementService
						.examQuestionStatus({ evd_eva_id: this.evalutionDetail.eva_id })
						.subscribe((result1: any) => {
							if (result1 && result1.status === 'ok') {
								this.examQuestionStatusArray = result.data;
							}
						});
				}
			});
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
								const subIdArray = this.currentQP.qp_sub_id
									.replace(/\s/g, '')
									.split(',');
								const subNameArray = this.currentQP.sub_name
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
											this.loadCurrentQ(0);
											this.questionReviewFlag = true;
										}
									});
							}
						});
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

	viewStudentTable() {
		this.reportOverviewStudentTable = true;
		this.getInfoScoreCard = false;
	}

	gobackScorecard() {
		this.reportOverviewStudentTable = false;
		this.getInfoScoreCard = true;
	}

	getScheduledExam() {
		this.qelementService
			.getScheduledExam({ es_id: this.es_id, es_status: '2' })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.examDetail = result.data[0];
					this.getStudents();
					this.qelementService
						.getQuestionPaper({ qp_id: this.examDetail.es_qp_id })
						.subscribe((result1: any) => {
							if (result1 && result1.status === 'ok') {
								this.questionpaperDetail = result1.data[0];
								this.getScheduledExamFlag = true;
							} else {
								this.getScheduledExamFlag = true;
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

	getbmid(bmarray, bm_qus_id) {
		for (const bmitem of bmarray) {
			if (bmitem.bm_qus_id === bm_qus_id) {
				return bmitem.bm_id;
			}
		}
	}
	isStudentAnswer(index) {
		if (this.studentAnswerMatrix[index].evd_qus_answer === '1') {
			return 'checked';
		} else {
			return '';
		}
	}
	loadCurrentQ(cqai) {
		this.showBookMarkStatus = false;
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
								item.qpq_qus_id ===
								this.questionsArray[this.currentQAIndex].qus_id
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
		this.reportService
			.getBookmark({
				login_id: this.currentUser1.login_id,
				class_id: this.class_id,
				sub_id: this.examDetail.es_sub_id
			})
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.bookqusidarray = result.data;
					const qusidArray = [];
					for (const item of this.bookqusidarray) {
						qusidArray.push(item.bm_qus_id);
					}
					if (qusidArray.length > 0) {
						this.qelementService
							.getQuestionsInTemplate({ qus_id: qusidArray })
							.subscribe((result2: any) => {
								if (result2 && result2.status === 'ok') {
									this.bookmarkedQuestionArray = result2.data;
									for (const bmqus of this.bookmarkedQuestionArray) {
										const bm_id = this.getbmid(
											this.bookqusidarray,
											bmqus.qus_id
										);
										bmqus.bm_id = bm_id;
									}
									for (const bmitem of this.bookmarkedQuestionArray) {
										if (bmitem.qus_id === this.currentQA.qus_id) {
											this.showBookMarkStatus = true;
											break;
										} else {
											continue;
										}
									}
								}
							});
					}
				}
			});
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
				if (result && result.status === 'ok') {
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
						} else if (Number(this.currentQA.qus_qst_id) === 4) {
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
					if (Number(this.currentQA.qus_qst_id) > 5 &&
					Number(this.currentQA.qus_qst_id < 13)) {
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

	previousQ() {
		this.loadCurrentQ(this.currentQAIndex - 1);
	}

	nextQ() {
		if (this.currentQAIndex < this.questionsArray.length - 1) {
			this.loadCurrentQ(this.currentQAIndex + 1);
		}
	}
	bookmarkQ() {
		this.reportService
			.insertBookmark({
				login_id: this.login_id,
				qus_id: this.currentQA.qus_id,
				sub_id: this.currentQA.qus_sub_id,
				class_id: this.currentQA.qus_class_id
			})
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage(
						'Bookmarked Submitted Successfully',
						'success'
					);
				}
			});
	}

	htmlToText(html) {
		return this.htt.htmlToText(html);
	}

	getExamAttendence() {
		this.qelementService
			.getExamAttendance({ es_id: this.es_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.presentStudentArray = result.data;
					this.getExamAttendenceFlag = true;
				} else {
					this.getExamAttendenceFlag = true;
				}
			});
	}

	viewMarkObtained() {
		this.reportService
			.viewMarkObtained({ es_id: this.es_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.marksDetailsArray = result.data;
					this.highestMarks = 0;
					this.classAverage = 0;
					let totalStu = 0;
					for (const marks of this.marksDetailsArray) {
						totalStu++;
						this.classAverage += Number(marks.total_mark);
						if (Number(marks.total_mark) > this.highestMarks) {
							this.highestMarks = Number(marks.total_mark);
						}
						if (marks.eva_id === this.eva_id) {
							this.marksDetails = marks;
						}
						this.gaugeValue1 = this.marksDetails.total_mark;
						this.gaugeValue2 = this.classAverage / totalStu;
					}
				}
			});
	}

	viewRankObtained() {
		this.reportService
			.viewRankObtained({ es_id: this.es_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					for (const item of result.data) {
						if (this.eva_id === item.eva_id) {
							this.rankDetails = item;
							break;
						}
					}
					this.viewRankObtainedFlag = true;
				} else {
					this.viewRankObtainedFlag = true;
				}
			});
	}

	viewReportTopicSubtopic() {
		this.stArray = [];
		this.testQuestionArray = [];

		this.reportService
			.viewReportTopicSubtopic({ es_id: this.es_id, login_id: this.login_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.TopicSubtopicArray = result.data;

					for (const item of this.TopicSubtopicArray) {
						this.subtopicNameArray.push(item.st_name);
						this.topicMarkArray.push(Number(item.mark_scored));
					}
					this.reportService
						.classHighest({ es_id: this.es_id })
						.subscribe((result1: any) => {
							if (result1 && result1.status === 'ok') {
								this.highestMarkArray = result1.data;
								for (const item of this.highestMarkArray) {
									this.subtopicHighestArray.push(Number(item.highest));
								}
								this.reportService
									.classAverage({ es_id: this.es_id })
									.subscribe((result2: any) => {
										if (result2 && result2.status === 'ok') {
											this.averageMarkArray = result2.data;

											for (const item of this.averageMarkArray) {
												this.subtopicAverageArray.push(
													Number(item.average_score)
												);
											}
											chart('container', {
												title: {
													text: 'Subtopicwise Exam Report'
												},
												xAxis: {
													categories: this.subtopicNameArray
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
															html: 'Subtopicwise Exam Report',
															style: {
																left: '50px',
																top: '18px'
															}
														}
													]
												},
												series: [
													{
														type: 'column',
														name: 'Marks',
														data: this.topicMarkArray
													},
													{
														type: 'spline',
														name: 'Class Average',
														data: this.subtopicAverageArray
													},
													{
														type: 'spline',
														name: 'Highest Marks',
														data: this.subtopicHighestArray
													}
												]
											});
										}
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
				}
			});
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
		this.reportService
			.correctQuestion({ es_id: this.es_id, login_id: this.login_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.correctQArray = result.data;
					this.incorrectQuestion();
					this.correctQuestioFlag = true;
				} else {
					this.correctQArray = [];
					this.incorrectQuestion();
					this.correctQuestioFlag = true;
				}
			});
	}

	incorrectQuestion() {
		this.reportService
			.incorrectQuestion({ es_id: this.es_id, login_id: this.login_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.incorrectQArray = result.data;
					this.accuracy = Number(
						(this.correctQArray.length * 100) /
							(this.correctQArray.length + this.incorrectQArray.length)
					).toFixed(0);
					this.skipQuestion();
				} else {
					this.incorrectQArray = [];
					this.accuracy = '0';
					this.skipQuestion();
				}
			});
	}

	skipQuestion() {
		this.reportService
			.skipQuestion({ es_id: this.es_id, login_id: this.login_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.skipQArray = result.data;
					this.pieChartData = [
						this.correctQArray.length,
						this.incorrectQArray.length,
						this.skipQArray.length
					];
					this.skipQuestionFlag = true;
				} else {
					this.skipQArray = [];
					this.pieChartData = [
						this.correctQArray.length,
						this.incorrectQArray.length,
						this.skipQArray.length
					];
					this.skipQuestionFlag = true;
				}
			});
	}

	viewReportTimeTaken() {
		this.reportService
			.viewReportTimeTaken({ es_id: this.es_id, login_id: this.login_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.timeTakenDetail = result.data[0];
					const timeMin = this.timeTakenDetail.time_taken;
					const a = timeMin.split(':'); // split it at the colons
					// Hours are worth 60 minutes.
					const minutes = +a[0] * 60 + +a[1];
					this.timeTakenDetail.time_taken = minutes;
					this.viewReportTimeTakenFlag = true;
				}
			});
	}

	getFlag(value) {
		if (value >= 60) {
			return 'Achievement';
		} else if (value > 40) {
			return 'Needs Improvement';
		} else {
			return 'Critical';
		}
	}

	getColor(value) {
		if (value >= 60) {
			return '<i class="fa fa-flag text-success"></i>';
		} else if (value > 40) {
			return '<i class="fa fa-flag text-warning"></i>';
		} else {
			return '<i class="fa fa-flag  text-danger"></i>';
		}
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
				if (result && result.status === 'ok') {
					this.studentArray = result.data;
				}
			});
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
}

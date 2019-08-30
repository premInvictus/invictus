import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { QelementService } from '../../questionbank/service/qelement.service';
import { ReportService } from '../../_services/report.service';
import { ActivatedRoute } from '@angular/router';
import { HtmlToTextService } from '../../_services/htmltotext.service';
import * as $ from 'jquery';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-view-student-test-report',
	templateUrl: './view-student-test-report.component.html',
	styleUrls: ['./view-student-test-report.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class ViewStudentTestReportComponent implements OnInit {

	es_id: number;
	login_id: string;
	eva_id: number;
	examDetail: any = {};
	currentQP: any = {};
	questionIdArray: any[] = [];
	questionsArray: any[] = [];
	currentEssay: any = {};
	currentQAHasEssay = false;
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
	marksArray: any[];
	tp_marks: number;
	highestMarks: number;
	classAverage: number;
	marksDetails: any = {};
	marksDetailsArray: any[] = [];
	rankDetails: any = {};
	correctQArray: any[] = [];
	incorrectQArray: any[] = [];
	skipQArray: any[] = [];
	getScheduledExamFlag = false;
	getExamAttendenceFlag = false;
	correctQuestioFlag = false;
	skipQuestionFlag = false;
	accuracy: String;
	getCurrentQp: any;
	singleIntegerArray: any[] = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' },
		{ id: '7' }, { id: '8' }, { id: '9' }];
	doubleIntegerArray1: any[] = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' },
		{ id: '7' }, { id: '8' }, { id: '9' }];
	doubleIntegerArray2: any[] = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' },
		{ id: '7' }, { id: '8' }, { id: '9' }];
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
		{ name: 'False', value: '1' }];
	mcqmrArray: any[] = [];
	tfFlag = false;
	tfValue: any;
	matchArray: any[] = [{ name: 'A', value: ['P', 'Q', 'R', 'S'] },
	{ name: 'B', value: ['P', 'Q', 'R', 'S'] },
	{ name: 'C', value: ['P', 'Q', 'R', 'S'] },
	{ name: 'D', value: ['P', 'Q', 'R', 'S'] }];

	matrixMatchArray: any[] = [{
		name: 'A',
		value: [{ index: 0, id: 'P' }, { index: 1, id: 'Q' }, { index: 2, id: 'R' }, { index: 3, id: 'S' }]
	},
	{
		name: 'B',
		value: [{ index: 4, id: 'P' }, { index: 5, id: 'Q' }, { index: 6, id: 'R' }, { index: 7, id: 'S' }]
	},
	{
		name: 'C',
		value: [{ index: 8, id: 'P' }, { index: 9, id: 'Q' }, { index: 10, id: 'R' }, { index: 11, id: 'S' }]
	},
	{
		name: 'D',
		value: [{ index: 12, id: 'P' }, { index: 13, id: 'Q' }, { index: 14, id: 'R' }, { index: 15, id: 'S' }]
	}];

	matrixMatch45Array: any[] = [{
		name: 'A',
		value: [{ index: 0, id: 'P' }, { index: 1, id: 'Q' }, { index: 2, id: 'R' }, { index: 3, id: 'S' }, { index: 4, id: 'T' }]
	},
	{
		name: 'B',
		value: [{ index: 5, id: 'P' }, { index: 6, id: 'Q' }, { index: 7, id: 'R' }, { index: 8, id: 'S' }, { index: 9, id: 'T' }]
	},
	{
		name: 'C',
		value: [{ index: 10, id: 'P' }, { index: 11, id: 'Q' }, { index: 12, id: 'R' }, { index: 13, id: 'S' }, { index: 14, id: 'T' }]
	},
	{
		name: 'D',
		value: [{ index: 15, id: 'P' }, { index: 16, id: 'Q' }, { index: 17, id: 'R' }, { index: 18, id: 'S' }, { index: 19, id: 'T' }]
	}];
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
	subjectArrayOfQP: any[] = [];

	constructor(
		private qelementService: QelementService,
		private route: ActivatedRoute,
		private htt: HtmlToTextService,
		private reportService: ReportService,
		public sanitizer: DomSanitizer
	) {
	}

	ngOnInit() {
		this.es_id = this.route.snapshot.params['id1'];
		this.login_id = this.route.snapshot.params['id2'];
		this.getScheduledExam();
		this.getExamAttendence();
		this.correctQuestion();
		this.skipQuestion();
		this.qelementService.getExamAttendance({ es_id: this.es_id, login_id: this.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.evalutionDetail = result.data[0];
					this.eva_id = this.evalutionDetail.eva_id;
					this.viewMarkObtained();
					this.qelementService.examQuestionStatus({ evd_eva_id: this.evalutionDetail.eva_id }).subscribe(
						(res: any) => {
							if (res) {
								this.examQuestionStatusArray = res.data;
							}
						}
					);
				}
			}
		);
		this.qelementService.getScheduledExam({ es_id: this.es_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.examDetail = result.data[0];
					this.qelementService.getQuestionPaper({ qp_id: this.examDetail.es_qp_id, qp_status: 1 }).subscribe(
						(res: any) => {
							if (res) {
								this.currentQP = res.data[0];
								let subIdArray = [];
								subIdArray = this.currentQP.qp_sub_id.replace(/\s/g, '').split(',');
								let subNameArray = [];
								subNameArray = this.currentQP.sub_name.replace(/\s/g, '').split(',');
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
								this.qelementService.getQuestionsInTemplate({ qus_id: this.questionIdArray }).subscribe(
									(response: any) => {
										if (response) {
											this.questionsArrayResult = response.data;
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
												for (let item = 0; item < this.questionIdArray.length; item++) {
													if (this.questionIdArray[item] === qus.qus_id) {
														qusIndex = item;
														break;
													}
												}
												this.questionsArray[qusIndex] = qus;
											}
											const groupedArray = this.groupBy(this.questionsArray, (item) => {
												return [item.qus_ess_id];
											});
											this.questionsArray = [];
											for (const group of groupedArray) {
												for (const qus of group) {
													this.questionsArray.push(qus);
												}
											}
											if (subIdArray.length > 0) {
												const groupOnSubArray = this.groupBy(this.questionsArray, (item) => {
													return [item.qus_sub_id];
												});
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
										}
									}
								);
							}
						}
					);
				}
			}
		);
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

	getScheduledExam() {
		this.qelementService.getScheduledExam({ es_id: this.es_id, es_status: '2' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.examDetail = result.data[0];
					this.qelementService.getQuestionPaper({ qp_id: this.examDetail.es_qp_id }).subscribe(
						(res: any) => {
							if (res) {
								this.questionpaperDetail = res.data[0];
								this.getScheduledExamFlag = true;
							}
						}
					);
				}
			}
		);
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
		if (Number(this.currentQA.qopt_answer.charAt(0)) === index || Number(this.currentQA.qopt_answer.charAt(1)) === index) {
			return '#00b197';
		} else {
			return '';
		}
	}
	getBoldDouble(index) {
		if (Number(this.currentQA.qopt_answer.charAt(0)) === index || Number(this.currentQA.qopt_answer.charAt(1)) === index) {
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

	loadCurrentQ(cqai) {
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
		this.matchArray = [{ name: 'A', value: ['P', 'Q', 'R', 'S'] },
		{ name: 'B', value: ['P', 'Q', 'R', 'S'] },
		{ name: 'C', value: ['P', 'Q', 'R', 'S'] },
		{ name: 'D', value: ['P', 'Q', 'R', 'S'] }];
		this.matrixMatchArray = [{
			name: 'A',
			value: [{ index: 0, id: 'P' }, { index: 1, id: 'Q' }, { index: 2, id: 'R' }, { index: 3, id: 'S' }]
		},
		{
			name: 'B',
			value: [{ index: 4, id: 'P' }, { index: 5, id: 'Q' }, { index: 6, id: 'R' }, { index: 7, id: 'S' }]
		},
		{
			name: 'C',
			value: [{ index: 8, id: 'P' }, { index: 9, id: 'Q' }, { index: 10, id: 'R' }, { index: 11, id: 'S' }]
		},
		{
			name: 'D',
			value: [{ index: 12, id: 'P' }, { index: 13, id: 'Q' }, { index: 14, id: 'R' }, { index: 15, id: 'S' }]
		}];
		this.matrixMatch45Array = [{
			name: 'A',
			value: [{ index: 0, id: 'P' }, { index: 1, id: 'Q' }, { index: 2, id: 'R' }, { index: 3, id: 'S' }, { index: 4, id: 'T' }]
		},
		{
			name: 'B',
			value: [{ index: 5, id: 'P' }, { index: 6, id: 'Q' }, { index: 7, id: 'R' }, { index: 8, id: 'S' }, { index: 9, id: 'T' }]
		},
		{
			name: 'C',
			value: [{ index: 10, id: 'P' }, { index: 11, id: 'Q' }, { index: 12, id: 'R' }, { index: 13, id: 'S' }, { index: 14, id: 'T' }]
		},
		{
			name: 'D',
			value: [{ index: 15, id: 'P' }, { index: 16, id: 'Q' }, { index: 17, id: 'R' }, { index: 18, id: 'S' }, { index: 19, id: 'T' }]
		}];
		this.trueFalseArray = [
			{ name: 'True', value: '0' },
			{ name: 'False', value: '1' }];
		this.singleIntegerArray = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' },
			{ id: '7' }, { id: '8' }, { id: '9' }];
		this.doubleIntegerArray1 = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' },
			{ id: '7' }, { id: '8' }, { id: '9' }];
		this.doubleIntegerArray2 = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' },
			{ id: '7' }, { id: '8' }, { id: '9' }];
		this.subjectiveInputAnswer = '';
		this.subjectiveAnswer.id = null;
		this.qelementService.getQuestionPaper({ qp_id: this.examDetail.es_qp_id, qp_status: 1 }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getCurrentQp = result.data[0];

					if (this.getCurrentQp.qlist) {
						for (const item of this.getCurrentQp.qlist) {
							if (item.qpq_qus_id === this.questionsArray[this.currentQAIndex].qus_id) {
								this.questionsArray[this.currentQAIndex].qus_marks = item.qpq_marks;
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
			this.qelementService.getEssay({ ess_id: this.currentQA.qus_ess_id }).subscribe(
				(resulte: any) => {
					if (resulte && resulte.status === 'ok') {
						this.currentEssay = resulte.data[0];
						this.currentQAHasEssay = true;
					}
				}
			);
		}
		this.qelementService.studentWiseAnswerReview1({ evd_eva_id: this.eva_id, evd_qt_id: this.currentQA.qus_qt_id,
				evd_qus_id: this.currentQA.qus_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					if (result.data.length > 0) {
						if (Number(this.currentQA.qus_qst_id) > 5 && Number(this.currentQA.qus_qst_id) < 13) {
							const studentAnswer = result.data[0];
							if (studentAnswer.evd_qus_answer !== '' && studentAnswer.evd_qus_answer) {
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
									if (Number(this.studentMatrixAnswer[ctr].evd_qus_answer) === 1) {
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
								for (let j = 0; j < (this.studentMatrix45Answer.length / 4); j++) {
									if (Number(this.studentMatrix45Answer[ctr].evd_qus_answer) === 1) {
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
								this.digitValue = Number(this.studentSingleInputAnswer[0].evd_qus_answer);
								this.studentSingleFlag = true;
							} else {
								this.digitValue = '-';
								this.studentSingleFlag = false;
								// Reset Value
								this.singleIntegerArray = [{ id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null },
										{ id: null }, { id: null }, { id: null }];
								// End
								this.singleIntegerArray = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' },
									{ id: '7' }, { id: '8' }, { id: '9' }];
							}
						} else if (Number(this.currentQA.qus_qst_id) === 15) {
							this.studentDobleInputAnswer = result.data;
							if (this.studentDobleInputAnswer[0].evd_qus_answer) {
								this.upperRowValue = this.studentDobleInputAnswer[0].evd_qus_answer.charAt(0);
								this.lowerRowValue = this.studentDobleInputAnswer[0].evd_qus_answer.charAt(1);
								this.upperRowFlag = true;
								this.lowerRowFlag = true;
							} else {
								this.upperRowValue = '-';
								this.lowerRowValue = '-';
								this.upperRowFlag = false;
								this.lowerRowFlag = false;
								// Reset Value
								this.doubleIntegerArray1 = [{ id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null },
										{ id: null }, { id: null }, { id: null }];
								this.doubleIntegerArray2 = [{ id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null },
										{ id: null }, { id: null }, { id: null }];
								// End
								this.doubleIntegerArray1 = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' },
									{ id: '7' }, { id: '8' }, { id: '9' }];
								this.doubleIntegerArray2 = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' },
									{ id: '7' }, { id: '8' }, { id: '9' }];
							}
						}
					} else {
						if (Number(this.currentQA.qus_qst_id) > 5 && Number(this.currentQA.qus_qst_id < 13)) {
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
								{ name: 'False', value: null }];
							// End\
							this.trueFalseArray = [
								{ name: 'True', value: '0' },
								{ name: 'False', value: '1' }];
						} else if (Number(this.currentQA.qus_qst_id) === 4) {
							this.matchFlag = false;
							// Resets the value
							this.matchArray = [{ name: 'A', value: [null, null, null, null] },
							{ name: 'B', value: [null, null, null, null] },
							{ name: 'C', value: [null, null, null, null] },
							{ name: 'D', value: [null, null, null, null] }];
							// Ends
							this.matchArray = [{ name: 'A', value: ['P', 'Q', 'R', 'S'] },
							{ name: 'B', value: ['P', 'Q', 'R', 'S'] },
							{ name: 'C', value: ['P', 'Q', 'R', 'S'] },
							{ name: 'D', value: ['P', 'Q', 'R', 'S'] }];
						} else if (Number(this.currentQA.qus_qst_id) === 5) {
							this.matrixMatchFlag = false;
							// Reset The value
							this.matrixMatchArray = [{
								name: 'A',
								value: [{ index: null, id: 'P' }, { index: null, id: 'Q' }, { index: null, id: 'R' }, { index: null, id: 'S' }]
							},
							{
								name: 'B',
								value: [{ index: null, id: 'P' }, { index: null, id: 'Q' }, { index: null, id: 'R' }, { index: null, id: 'S' }]
							},
							{
								name: 'C',
								value: [{ index: null, id: 'P' }, { index: null, id: 'Q' }, { index: null, id: 'R' }, { index: null, id: 'S' }]
							},
							{
								name: 'D',
								value: [{ index: null, id: 'P' }, { index: null, id: 'Q' }, { index: null, id: 'R' }, { index: null, id: 'S' }]
							}];
							// End
							this.matrixMatchArray = [{
								name: 'A',
								value: [{ index: 0, id: 'P' }, { index: 1, id: 'Q' }, { index: 2, id: 'R' }, { index: 3, id: 'S' }]
							},
							{
								name: 'B',
								value: [{ index: 4, id: 'P' }, { index: 5, id: 'Q' }, { index: 6, id: 'R' }, { index: 7, id: 'S' }]
							},
							{
								name: 'C',
								value: [{ index: 8, id: 'P' }, { index: 9, id: 'Q' }, { index: 10, id: 'R' }, { index: 11, id: 'S' }]
							},
							{
								name: 'D',
								value: [{ index: 12, id: 'P' }, { index: 13, id: 'Q' }, { index: 14, id: 'R' }, { index: 15, id: 'S' }]
							}];
						} else if (Number(this.currentQA.qus_qst_id) === 13) {
							this.matrixMatch45Flag = false;
							// Reset Value
							this.matrixMatch45Array = [{
								name: 'A',
								value: [{ index: null, id: 'P' }, { index: null, id: 'Q' }, { index: null, id: 'R' }, { index: null, id: 'S' },
									{ index: null, id: 'T' }]
							},
							{
								name: 'B',
								value: [{ index: null, id: 'P' }, { index: null, id: 'Q' }, { index: null, id: 'R' }, { index: null, id: 'S' },
									{ index: null, id: 'T' }]
							},
							{
								name: 'C',
								value: [{ index: null, id: 'P' }, { index: null, id: 'Q' }, { index: null, id: 'R' }, { index: null, id: 'S' },
									{ index: null, id: 'T' }]
							},
							{
								name: 'D',
								value: [{ index: null, id: 'P' }, { index: null, id: 'Q' }, { index: null, id: 'R' }, { index: null, id: 'S' },
									{ index: null, id: 'T' }]
							}];
							// End
							this.matrixMatch45Array = [{
								name: 'A',
								value: [{ index: 0, id: 'P' }, { index: 1, id: 'Q' }, { index: 2, id: 'R' }, { index: 3, id: 'S' }, { index: 4, id: 'T' }]
							},
							{
								name: 'B',
								value: [{ index: 5, id: 'P' }, { index: 6, id: 'Q' }, { index: 7, id: 'R' }, { index: 8, id: 'S' }, { index: 9, id: 'T' }]
							},
							{
								name: 'C',
								value: [{ index: 10, id: 'P' }, { index: 11, id: 'Q' }, { index: 12, id: 'R' }, { index: 13, id: 'S' }, { index: 14, id: 'T' }]
							},
							{
								name: 'D',
								value: [{ index: 15, id: 'P' }, { index: 16, id: 'Q' }, { index: 17, id: 'R' }, { index: 18, id: 'S' }, { index: 19, id: 'T' }]
							}];
						} else if (Number(this.currentQA.qus_qst_id) === 14) {
							this.studentSingleFlag = false;
							this.digitValue = '-';
							// Reset Value
							this.singleIntegerArray = [{ id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null },
									{ id: null }, { id: null }, { id: null }, { id: null }];
							// End
							this.singleIntegerArray = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' },
								{ id: '7' }, { id: '8' }, { id: '9' }];

						} else if (Number(this.currentQA.qus_qst_id) === 15) {
							this.upperRowFlag = false;
							this.lowerRowFlag = false;
							this.upperRowValue = '-';
							this.lowerRowValue = '-';
							// Reset
							this.doubleIntegerArray1 = [{ id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null },
									{ id: null }, { id: null }, { id: null }];
							this.doubleIntegerArray2 = [{ id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null },
									{ id: null }, { id: null }, { id: null }];
							// Value
							this.doubleIntegerArray1 = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' },
								{ id: '7' }, { id: '8' }, { id: '9' }];
							this.doubleIntegerArray2 = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' },
								{ id: '7' }, { id: '8' }, { id: '9' }];
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
							{ name: 'False', value: null }];
						// End\
						this.trueFalseArray = [
							{ name: 'True', value: '0' },
							{ name: 'False', value: '1' }];
					} else if (this.currentQA.qus_qst_id === 4) {
						this.matchFlag = false;
						// Resets the value
						this.matchArray = [{ name: 'A', value: [null, null, null, null] },
						{ name: 'B', value: [null, null, null, null] },
						{ name: 'C', value: [null, null, null, null] },
						{ name: 'D', value: [null, null, null, null] }];
						// Ends
						this.matchArray = [{ name: 'A', value: ['P', 'Q', 'R', 'S'] },
						{ name: 'B', value: ['P', 'Q', 'R', 'S'] },
						{ name: 'C', value: ['P', 'Q', 'R', 'S'] },
						{ name: 'D', value: ['P', 'Q', 'R', 'S'] }];
					} else if (this.currentQA.qus_qst_id === 5) {
						this.matrixMatchFlag = false;
						// Reset The value
						this.matrixMatchArray = [{
							name: 'A',
							value: [{ index: null, id: 'P' }, { index: null, id: 'Q' }, { index: null, id: 'R' }, { index: null, id: 'S' }]
						},
						{
							name: 'B',
							value: [{ index: null, id: 'P' }, { index: null, id: 'Q' }, { index: null, id: 'R' }, { index: null, id: 'S' }]
						},
						{
							name: 'C',
							value: [{ index: null, id: 'P' }, { index: null, id: 'Q' }, { index: null, id: 'R' }, { index: null, id: 'S' }]
						},
						{
							name: 'D',
							value: [{ index: null, id: 'P' }, { index: null, id: 'Q' }, { index: null, id: 'R' }, { index: null, id: 'S' }]
						}];
						// End
						this.matrixMatchArray = [{
							name: 'A',
							value: [{ index: 0, id: 'P' }, { index: 1, id: 'Q' }, { index: 2, id: 'R' }, { index: 3, id: 'S' }]
						},
						{
							name: 'B',
							value: [{ index: 4, id: 'P' }, { index: 5, id: 'Q' }, { index: 6, id: 'R' }, { index: 7, id: 'S' }]
						},
						{
							name: 'C',
							value: [{ index: 8, id: 'P' }, { index: 9, id: 'Q' }, { index: 10, id: 'R' }, { index: 11, id: 'S' }]
						},
						{
							name: 'D',
							value: [{ index: 12, id: 'P' }, { index: 13, id: 'Q' }, { index: 14, id: 'R' }, { index: 15, id: 'S' }]
						}];
					} else if (this.currentQA.qus_qst_id === 13) {
						this.matrixMatch45Flag = false;
						// Reset Value
						this.matrixMatch45Array = [{
							name: 'A',
							value: [{ index: null, id: 'P' }, { index: null, id: 'Q' }, { index: null, id: 'R' }, { index: null, id: 'S' },
								{ index: null, id: 'T' }]
						},
						{
							name: 'B',
							value: [{ index: null, id: 'P' }, { index: null, id: 'Q' }, { index: null, id: 'R' }, { index: null, id: 'S' },
								{ index: null, id: 'T' }]
						},
						{
							name: 'C',
							value: [{ index: null, id: 'P' }, { index: null, id: 'Q' }, { index: null, id: 'R' }, { index: null, id: 'S' },
								{ index: null, id: 'T' }]
						},
						{
							name: 'D',
							value: [{ index: null, id: 'P' }, { index: null, id: 'Q' }, { index: null, id: 'R' }, { index: null, id: 'S' },
								{ index: null, id: 'T' }]
						}];
						// End
						this.matrixMatch45Array = [{
							name: 'A',
							value: [{ index: 0, id: 'P' }, { index: 1, id: 'Q' }, { index: 2, id: 'R' }, { index: 3, id: 'S' }, { index: 4, id: 'T' }]
						},
						{
							name: 'B',
							value: [{ index: 5, id: 'P' }, { index: 6, id: 'Q' }, { index: 7, id: 'R' }, { index: 8, id: 'S' }, { index: 9, id: 'T' }]
						},
						{
							name: 'C',
							value: [{ index: 10, id: 'P' }, { index: 11, id: 'Q' }, { index: 12, id: 'R' }, { index: 13, id: 'S' }, { index: 14, id: 'T' }]
						},
						{
							name: 'D',
							value: [{ index: 15, id: 'P' }, { index: 16, id: 'Q' }, { index: 17, id: 'R' }, { index: 18, id: 'S' }, { index: 19, id: 'T' }]
						}];
					} else if (Number(this.currentQA.qus_qst_id) === 14) {
						this.studentSingleFlag = false;
						this.digitValue = '-';
						// Reset Value
						this.singleIntegerArray = [{ id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null },
								{ id: null }, { id: null }, { id: null }, { id: null }];
						// End
						this.singleIntegerArray = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' },
							{ id: '7' }, { id: '8' }, { id: '9' }];
					} else if (this.currentQA.qus_qst_id === 15) {
						this.upperRowFlag = false;
						this.lowerRowFlag = false;
						this.upperRowValue = '-';
						this.lowerRowValue = '-';
						// Reset Value
						this.doubleIntegerArray1 = [{ id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null },
								{ id: null }, { id: null }, { id: null }, { id: null }];
						this.doubleIntegerArray2 = [{ id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null },
								{ id: null }, { id: null }, { id: null }, { id: null }];
						// End
						this.doubleIntegerArray1 = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' },
							{ id: '7' }, { id: '8' }, { id: '9' }];
						this.doubleIntegerArray2 = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' },
							{ id: '7' }, { id: '8' }, { id: '9' }];
					}

				}

				// End
			}
		);
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

	htmlToText(html) {
		return this.htt.htmlToText(html);
	}

	getExamAttendence() {
		this.qelementService.getExamAttendance({ es_id: this.es_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.presentStudentArray = result.data;
					this.getExamAttendenceFlag = true;
				}
			}
		);
	}

	viewMarkObtained() {
		this.reportService.viewMarkObtained({ es_id: this.es_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.marksDetailsArray = result.data;
					this.highestMarks = 0;
					this.classAverage = 0;
					for (const marks of this.marksDetailsArray) {
						this.classAverage += Number(marks.total_mark);
						if (Number(marks.total_mark) > this.highestMarks) {
							this.highestMarks = Number(marks.total_mark);
						}
						if (marks.eva_id === this.eva_id) {
							this.marksDetails = marks;
						}
					}
				}
			}
		);
	}

	correctQuestion() {
		this.reportService.correctQuestion({ es_id: this.es_id, login_id: this.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.correctQArray = result.data;
					this.incorrectQuestion();
					this.correctQuestioFlag = true;
				}
			}
		);
	}

	incorrectQuestion() {
		this.reportService.incorrectQuestion({ es_id: this.es_id, login_id: this.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.incorrectQArray = result.data;
					this.accuracy = Number((this.correctQArray.length * 100) / (this.correctQArray.length + this.incorrectQArray.length)).toFixed(0);
					this.skipQuestion();
				}
			}
		);
	}

	skipQuestion() {
		this.reportService.skipQuestion({ es_id: this.es_id, login_id: this.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.skipQArray = result.data;
					this.skipQuestionFlag = true;
				}
			}
		);
	}
	checkSingleIntegerStatus(item) {
		if (this.studentSingleInputAnswer[0].evd_qus_answer && Number(item) === Number(this.studentSingleInputAnswer[0].evd_qus_answer)) {
			return true;
		} else {
			return false;
		}
	}

	checkUpperRowStatus(item) {
		if (this.studentDobleInputAnswer[0].evd_qus_answer && Number(item) === Number(this.studentDobleInputAnswer[0].evd_qus_answer.charAt(0))) {
			return true;
		} else {
			return false;
		}
	}

	checkLowerRowStatus(item) {
		if (this.studentDobleInputAnswer[0].evd_qus_answer && Number(item) === Number(this.studentDobleInputAnswer[0].evd_qus_answer.charAt(1))) {
			return true;
		} else {
			return false;
		}
	}
	checkMcqAnswerStatus(index) {
		if (this.studentMcqAnswer[index] && this.studentMcqAnswer[index].evd_qus_answer &&
				Number(this.studentMcqAnswer[index].evd_qus_answer) === 1) {
			return true;
		} else {
			return false;
		}
	}
	checkMcqMrAnswerStatus(index) {
		if (this.studentMcqmrAnswer[index] && this.studentMcqmrAnswer[index].evd_qus_answer &&
				Number(this.studentMcqmrAnswer[index].evd_qus_answer) === 1) {
			return true;
		} else {
			return false;
		}
	}

	checkTfStatus(index) {
		if (this.studentTfAnswer[index] && this.studentTfAnswer[index].evd_qus_answer &&
				Number(this.studentTfAnswer[index].evd_qus_answer) === 1) {
			return true;
		} else {
			return false;
		}
	}
	checkMtfStatus(value, index) {
		if (this.studentMtfAnswer[index] && this.studentMtfAnswer[index].evd_qus_answer &&
			this.studentMtfAnswer[index].evd_qus_answer === value) {
			return true;
		} else {
			return false;
		}
	}

	checkMatrixMatchstatus(index) {
		if (this.studentMatrixAnswer[index] && this.studentMatrixAnswer[index].evd_qus_answer &&
			Number(this.studentMatrixAnswer[index].evd_qus_answer) === 1) {
			return true;
		} else {
			return false;
		}
	}

	checkMatrixMatch45status(index) {
		if (this.studentMatrix45Answer[index] && this.studentMatrix45Answer[index].evd_qus_answer &&
				Number(this.studentMatrix45Answer[index].evd_qus_answer) === 1) {
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

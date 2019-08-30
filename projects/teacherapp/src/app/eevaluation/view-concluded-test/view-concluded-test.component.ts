import { Component, OnInit } from '@angular/core';
import { QelementService } from '../../questionbank/service/qelement.service';
import { ReportService } from '../../_services/report.service';
import { ActivatedRoute } from '@angular/router';
import { HtmlToTextService } from '../../_services/htmltotext.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-view-concluded-test',
	templateUrl: './view-concluded-test.component.html',
	styleUrls: ['./view-concluded-test.component.css']
})
export class ViewConcludedTestComponent implements OnInit {

	qp_id: number;
	es_id: number;
	examDetail: any = {};
	questionIdArray: any[] = [];
	questionsArray: any[] = [];
	currentEssay: any = {};
	currentQAHasEssay = false;
	questionsArrayResult: any[] = [];
	testQuestionArray: any[] = [];
	testQuestionArrayResult: any[] = [];
	estArray: any[] = [];
	disPriority: any = { critical: [], recommended: [], optional: [] };
	currentQA: any = {};
	currentQAIndex = 0;
	public optionHA = ['A', 'B', 'C', 'D', 'E'];
	public optionmatchHA = ['P', 'Q', 'R', 'S', 'T'];
	questionpaperDetail: any = {};
	questionreviewDiv = false;
	getCurrentQp: any;
	singleIntegerArray: any[] = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }, { id: '7' },
		{ id: '8' }, { id: '9' }];
	doubleIntegerArray1: any[] = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }, { id: '7' },
		{ id: '8' }, { id: '9' }];
	doubleIntegerArray2: any[] = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }, { id: '7' },
		{ id: '8' }, { id: '9' }];
	upperRowValue: any;
	lowerRowValue: any;
	digitValue: any;
	studentSingleFlag = false;
	upperRowFlag = false;
	lowerRowFlag = false;
	checkClass: any;
	subjectArrayOfQP: any[] = [];
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
	constructor(
		private qelementService: QelementService,
		private route: ActivatedRoute,
		private htt: HtmlToTextService,
		private reportService: ReportService,
		public sanitizer: DomSanitizer
	) { }

	ngOnInit() {
		this.es_id = this.route.snapshot.params['id'];
		this.getTestQuestions();
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

	getTestQuestions(): void {
		this.testQuestionArray = [];
		this.reportService.testQuestionAnalysis({ es_id: this.es_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.testQuestionArrayResult = result.data;
					let priPercentage = 0;
					this.qelementService.getScheduledExam({ es_id: this.es_id, es_status: '2' }).subscribe(
						// tslint:disable-next-line:no-shadowed-variable
						(result: any) => {
							if (result && result.status === 'ok') {
								this.examDetail = result.data[0];
								this.qelementService.getQuestionPaper({ qp_id: this.examDetail.es_qp_id }).subscribe(
									// tslint:disable-next-line:no-shadowed-variable
									(result: any) => {
										if (result && result.status === 'ok') {
											this.questionpaperDetail = result.data[0];

											const subIdArray = this.questionpaperDetail.qp_sub_id.replace(/\s/g, '').split(',');
											const subNameArray = this.questionpaperDetail.sub_name.replace(/\s/g, '').split(',');
											if (subIdArray.length === subNameArray.length) {
												for (let i = 0; i < subIdArray.length; i++) {
													const subIdName = {
														subId: subIdArray[i],
														subName: subNameArray[i]
													};
													this.subjectArrayOfQP.push(subIdName);
												}
											}
											for (const qitem of this.questionpaperDetail.qlist) {
												this.questionIdArray.push(qitem.qpq_qus_id);
											}
											this.qelementService.getQuestionsInTemplate({ qus_id: this.questionIdArray }).subscribe(
												// tslint:disable-next-line:no-shadowed-variable
												(result: any) => {
													if (result && result.status === 'ok') {
														this.questionsArrayResult = result.data;
														for (const qus of this.testQuestionArrayResult) {
															// tslint:disable-next-line:max-line-length
															priPercentage = Math.round((Number(qus.correct) / (Number(qus.correct) + Number(qus.incorrect) + Number(qus.skip))) * 100);
															if (priPercentage > 60) {
																qus.reviewStatus = '2';
															} else if (priPercentage > 32) {
																qus.reviewStatus = '1';
															} else {
																qus.reviewStatus = '0';
															}
															for (const qus1 of this.questionsArrayResult) {
																if (qus.qus_id === qus1.qus_id) {
																	qus1.reviewStatus = qus.reviewStatus;
																	this.questionsArray.push(qus1);
																}
															}
															const groupedArray = this.groupBy(this.questionsArray, (item) => {
																return [item.qus_ess_id];
															});
															this.questionsArray = [];
															for (const group of groupedArray) {
																for (const qust of group) {
																	this.questionsArray.push(qust);
																}
															}
															if (subIdArray.length > 0) {
																const groupOnSubArray = this.groupBy(this.questionsArray, (item) => {
																	return [item.qus_sub_id];
																});
																this.questionsArray = [];
																for (const group of groupOnSubArray) {
																	for (const qust of group) {
																		this.questionsArray.push(qust);
																	}
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
														this.questionreviewDiv = true;
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
				}
			}
		);
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

	getReviewColor(reviewStatus) {
		if (reviewStatus === '2') {
			return '#6610f2';
		} else if (reviewStatus === '1') {
			return '#04cde4';
		} else {
			return '#fe756d';
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
					this.currentEssay = resulte.data[0];
					this.currentQAHasEssay = true;
				}
			);
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

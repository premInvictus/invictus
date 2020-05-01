import { Component, OnInit, HostListener, Inject, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { JeeAdvancedInstructionscreenComponent } from './jee-advanced-instructionscreen/jee-advanced-instructionscreen.component';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { SocketService, HtmlToTextService } from 'projects/axiom/src/app/_services/index';
import { appConfig } from 'projects/axiom/src/app/../app/app.config';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { Event } from 'projects/axiom/src/app/_models/event';
export class PendingRequest {
	url: string;
	data: any;
	constructor(url: string, data: any) {
		this.url = url;
		this.data = data;
	}
}
@Component({
	selector: 'app-jee-advanced',
	templateUrl: './jee-advanced.component.html',
	styleUrls: ['./jee-advanced.component.css']
})
export class JeeAdvancedComponent implements OnInit {
	@ViewChild('questionModal') questionModal;
	networkErrorCount = 0;
	networkErrorCounter = 0;
	reviewForm: FormGroup;
	es_id: number;
	eva_id: number;
	examDetail: any = {};
	userprofileimage;
	currentQP: any = {};
	subjectArray: any[] = [];
	subjectArrayOfQP: any[] = [];
	questionIdArray: any[] = [];
	questionsArray: any[] = [];
	questionsArrayResult: any[] = [];
	currentQA: any = {};
	currentEssay: any = {};
	currentQAHasEssay = false;
	sectionDetails: any = {};
	currentQAIndex = 0;
	evalutionDetail: any = {};
	examQuestionStatusArray: any[] = [];
	public optionHA = ['A', 'B', 'C', 'D', 'E'];
	public optionmatchHA = ['P', 'Q', 'R', 'S', 'T'];
	ongoingDiv = false;
	testSummaryDiv = false;
	chechConFlag = true;
	loading = false;
	restrictedKeys = [9, 17, 18, 27, 91, 93];
	restrictedKeysCount = 0;
	screenfull: any;
	schoolinfoArray: any = {};
	hosturl = appConfig.apiUrl;
	getRandom: any;
	getCurrentQp: any;
	userDetails: any = {};
	currentUser: any = {};
	userDetailsFlag = false;
	questionListArray: any[] = [];
	singleIntegerArray: any[] = [
		{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }];
	doubleIntegerArray1: any[] = [
		{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }];
	doubleIntegerArray2: any[] = [
		{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }];
	upperRowValue: any = '';
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
	studentMcqAnswer: any[] = [];
	studentMcqmrAnswer: any[] = [];
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
	tabIndex: any;
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
	bookMarkFlag = false;
	bookMarkTitle: any;
	subjectGroupSectionArray: any[] = [];
	finalSectionArray: any[] = [];
	dialogRef: MatDialogRef<JeeAdvancedInstructionscreenComponent>;
	questionDetail: any = {};
	localQuestions: any[] = [];
	localQuestionStatus: any[] = [];
	isCollapsed: any;
	questionAnswerArray: any = {};
	qAnswerArray: any[] = [];
	timers: any;
	timeLeft = 0;
	firstQuestionFlag = false;
	previousIndex: any = 0;
	stime = new Date().getTime();
	submitFlag = false;
	nextFlag = false;
	socketExtendTime = 0;
	private queue: PendingRequest[] = [];
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private qelementService: QelementService,
		private htt: HtmlToTextService,
		private fb: FormBuilder,
		private notif: NotificationsService,
		private dialog: MatDialog,
		private socketService: SocketService
	) { }

	openQuesDialog() {
		this.questionModal.openModal(this.subjectArrayOfQP);
	}

	ngOnInit() {
		document.addEventListener('contextmenu', (e) => {
			e.preventDefault();
		}, false);
		this.es_id = this.route.snapshot.params['id'];
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		if (localStorage.getItem('currentExam')) {
			this.localQuestions = (JSON.parse(localStorage.getItem('currentExam')).questions);
		}
		if (localStorage.getItem('qStatus')) {
			this.localQuestionStatus = (JSON.parse(localStorage.getItem('qStatus')).qStatus);
		}
		if (localStorage.getItem('qAnswer')) {
			this.qAnswerArray = (JSON.parse(localStorage.getItem('qAnswer')).qAnswer);
		}
		this.checkConnection();
		this.buildForm();
		this.getUser();
		this.getSchool();
		this.processQueue();
		this.examQuestionStatusArray = [];
		this.questionsArrayResult = [];
		this.qelementService.getExamAttendance({ es_id: this.es_id, login_id: this.currentUser.login_id }).subscribe(
			(resultExam: any) => {
				if (resultExam) {
					this.evalutionDetail = resultExam.data[0];
					this.eva_id = this.evalutionDetail.eva_id;
					this.qelementService.examQuestionStatus({ evd_eva_id: this.evalutionDetail.eva_id }).subscribe(
						(resultQStat: any) => {
							if (resultQStat) {
								this.examQuestionStatusArray = resultQStat.data;
								this.qelementService.getScheduledExam({ es_id: this.es_id }).subscribe(
									(result: any) => {
										if (result) {
											this.examDetail = result.data[0];
											if ((this.evalutionDetail.time_left * 1000) > 0) {
												this.ongoingDiv = true;
												this.sendTestOngoingConfirmation();
											} else {
												this.ongoingDiv = false;
											}
											this.qelementService.getQuestionPaper({ qp_id: this.examDetail.es_qp_id, qp_status: 1 }).subscribe(
												(result3: any) => {
													if (result3) {
														this.currentQP = result3.data[0];
														const subIdArray = this.currentQP.qp_sub_id.replace(/\s/g, '').split(',');
														const subNameArray = this.currentQP.sub_name.replace(/\s/g, '').split(',');
														if (subIdArray.length === subNameArray.length) {
															for (let i = 0; i < subIdArray.length; i++) {
																const subIdName = {
																	subId: subIdArray[i],
																	subName: subNameArray[i]
																};
																this.subjectArrayOfQP.push(subIdName);
															}
														}
														if (this.localQuestions.length === 0) {
															this.qelementService.getJeeQuestionPaper({ es_id: this.es_id }).subscribe(
																(result2: any) => {
																	if (result2) {
																		this.questionsArray = [];
																		this.finalSectionArray = [];
																		this.questionAnswerArray = [];
																		this.sectionDetails = {};
																		this.questionDetail = result2.data[0];
																		localStorage.setItem('currentExam', JSON.stringify({
																			eva_id: this.eva_id,
																			questions: this.questionDetail.Allquestions
																		}));
																		let i = 0;
																		for (const sub of this.subjectArrayOfQP) {
																			for (const item of this.questionDetail.Allquestions) {
																				if (sub.subId === item.sub_id) {
																					let n = 0;
																					for (let j = 1; j <= 15; j++) {
																						const sectionArray: any = [];
																						for (const qus of item.questions) {
																							qus.answerStatus = '';
																							qus.timespent = 0;
																							if (Number(qus.qus_qst_id) === j) {
																								sectionArray.push(qus);
																								this.questionsArray.push(qus);
																								const findex = this.finalSectionArray.findIndex(f => f.sub_id === sub.subId && f.qst_id === j);
																								if (findex === -1) {
																									this.finalSectionArray.push({
																										index: n,
																										subName: sub.subName,
																										sub_id: sub.subId,
																										qst_id: j,
																										secArray: sectionArray
																									});
																									n++;
																								}
																							}
																						}
																					}
																				}
																			}
																			i++;
																		}
																		for (const item of this.examQuestionStatusArray) {
																			for (const titem of this.questionsArray) {
																				if (item.evd_qus_id === titem.qus_id) {
																					titem.answerStatus = item.evd_status;
																				}
																			}
																		}
																		localStorage.setItem('qStatus', JSON.stringify({
																			qStatus: this.questionsArray
																		}));
																		for (const item of this.questionsArray) {
																			this.questionAnswerArray.push({
																				qst_id: item.qus_qst_id,
																				qus_id: item.qus_id,
																				answer: [],
																				qus_submit_flag: ''
																			});
																		}
																		for (const item of this.examQuestionStatusArray) {
																			for (const titem of this.questionAnswerArray) {
																				if (item.evd_qus_id === titem.qus_id) {
																					const answerJSON: any = [];
																					for (const ans of item.answer) {
																						answerJSON.push({
																							evd_qst_id: titem.qst_id,
																							evd_qus_id: titem.qus_id,
																							evd_qus_answer: ans.evd_qus_answer
																						});
																					}
																					titem.answer = answerJSON;
																					titem.qus_submit_flag = true;
																				}
																			}
																		}
																		localStorage.setItem('qAnswer', JSON.stringify({
																			qAnswer: this.questionAnswerArray
																		}));
																		this.getQuestionArray(this.finalSectionArray[0]);
																		this.sectionDetails = this.finalSectionArray[0];
																		this.tabIndex = this.sectionDetails.index;
																		this.currentQA = this.questionsArray[0];
																	}
																}
															);
														} else {
															this.getLocallyStoredQuestions();
														}
													}
												}
											);
											this.timer();
										}
									}
								);
							} else {
								this.qelementService.getScheduledExam({ es_id: this.es_id }).subscribe(
									(result: any) => {
										if (result) {
											this.examDetail = result.data[0];
											if ((this.evalutionDetail.time_left * 1000) > 0) {
												this.ongoingDiv = true;
												this.sendTestOngoingConfirmation();
											} else {
												this.ongoingDiv = false;
											}
											this.qelementService.getQuestionPaper({ qp_id: this.examDetail.es_qp_id, qp_status: 1 }).subscribe(
												(result3: any) => {
													if (result3) {
														this.currentQP = result3.data[0];
														const subIdArray = this.currentQP.qp_sub_id.replace(/\s/g, '').split(',');
														const subNameArray = this.currentQP.sub_name.replace(/\s/g, '').split(',');
														if (subIdArray.length === subNameArray.length) {
															for (let i = 0; i < subIdArray.length; i++) {
																const subIdName = {
																	subId: subIdArray[i],
																	subName: subNameArray[i]
																};
																this.subjectArrayOfQP.push(subIdName);
															}
														}
														if (this.localQuestions.length === 0) {
															this.qelementService.getJeeQuestionPaper({ es_id: this.es_id }).subscribe(
																(result2: any) => {
																	if (result2) {
																		this.questionsArray = [];
																		this.finalSectionArray = [];
																		this.questionAnswerArray = [];
																		this.sectionDetails = {};
																		this.questionDetail = result2.data[0];
																		localStorage.setItem('currentExam', JSON.stringify({
																			eva_id: this.eva_id,
																			questions: this.questionDetail.Allquestions
																		}));
																		let i = 0;
																		for (const sub of this.subjectArrayOfQP) {
																			for (const item of this.questionDetail.Allquestions) {
																				if (sub.subId === item.sub_id) {
																					let n = 0;
																					for (let j = 1; j <= 15; j++) {
																						const sectionArray: any = [];
																						for (const qus of item.questions) {
																							qus.answerStatus = '';
																							qus.timespent = 0;
																							if (Number(qus.qus_qst_id) === j) {
																								sectionArray.push(qus);
																								this.questionsArray.push(qus);
																								const findex = this.finalSectionArray.findIndex(f => f.sub_id === sub.subId && f.qst_id === j);
																								if (findex === -1) {
																									this.finalSectionArray.push({
																										index: n,
																										subName: sub.subName,
																										sub_id: sub.subId,
																										qst_id: j,
																										secArray: sectionArray
																									});
																									n++;
																								}
																							}
																						}
																					}
																				}
																			}
																			i++;
																		}
																		for (const item of this.examQuestionStatusArray) {
																			for (const titem of this.questionsArray) {
																				if (item.evd_qus_id === titem.qus_id) {
																					titem.answerStatus = item.evd_status;
																				}
																			}
																		}
																		localStorage.setItem('qStatus', JSON.stringify({
																			qStatus: this.questionsArray
																		}));
																		for (const item of this.questionsArray) {
																			this.questionAnswerArray.push({
																				qst_id: item.qus_qst_id,
																				qus_id: item.qus_id,
																				answer: [],
																				qus_submit_flag: ''
																			});
																		}
																		for (const item of this.examQuestionStatusArray) {
																			for (const titem of this.questionAnswerArray) {
																				if (item.evd_qus_id === titem.qus_id) {
																					const answerJSON: any = [];
																					for (const ans of item.answer) {
																						answerJSON.push({
																							evd_qst_id: titem.qst_id,
																							evd_qus_id: titem.qus_id,
																							evd_qus_answer: ans.evd_qus_answer
																						});
																					}
																					titem.answer = answerJSON;
																					titem.qus_submit_flag = true;
																				}
																			}
																		}
																		localStorage.setItem('qAnswer', JSON.stringify({
																			qAnswer: this.questionAnswerArray
																		}));
																		this.getQuestionArray(this.finalSectionArray[0]);
																		this.sectionDetails = this.finalSectionArray[0];
																		this.tabIndex = this.sectionDetails.index;
																		this.currentQA = this.questionsArray[0];
																	}
																}
															);
														} else {
															this.getLocallyStoredQuestions();
														}
													}
												}
											);
											this.timer();
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
		this.studentMcqAnswer = [];
		this.studentMcqmrAnswer = [];
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
	openConfirmBox() {
		this.nextFlag = true;
	}
	submit() {
		this.submitFlag = true;
		this.ongoingDiv = false;
		this.questionsArray[this.currentQAIndex].timespent =
			this.questionsArray[this.currentQAIndex].timespent + (new Date().getTime() - this.stime);

		if (this.queue.length > 0) {
			this.queue.forEach(element => {
				this.execute(element);
			});
		}
		this.saveAndNext('save');
	}
	cancelTest() {
		this.submitFlag = false;
		this.ongoingDiv = true;
		this.nextFlag = false;
	}
	addRequestToQueue(url, data) {
		const request = new PendingRequest(url, data);
		this.queue.push(request);
		if (navigator.onLine) {
			if (this.queue.length > 0) {
				this.startNextRequest();
			}
		}
	}
	startNextRequest() {
		// get next request, if any.
		if (this.queue.length > 0) {
			this.execute(this.queue[0]);
		}
	}
	execute(request: PendingRequest) {
		this.queue.shift();
		this.qelementService.studentInputAnswer(request.data).subscribe((result: any) => {
			if (result) {
			} else {
				if (result === null || (result && result.status === 'error')) {
					this.addRequestToQueue(request.url, request.data);
				}
			}
		});
	}
	processQueue() {
		setInterval(() => {
			if (navigator.onLine) {
				if (this.queue.length > 0) {
					this.execute(this.queue[0]);
				}
			}
		}, 10000);
	}
	getLocallyStoredQuestions() {
		this.questionsArray = [];
		this.finalSectionArray = [];
		this.questionAnswerArray = [];
		this.sectionDetails = {};
		if (this.localQuestionStatus.length > 0) {
			this.questionsArray = this.localQuestionStatus;
		}
		if (this.qAnswerArray.length > 0) {
			this.questionAnswerArray = this.qAnswerArray;
		}
		let i = 0;
		for (const sub of this.subjectArrayOfQP) {
			for (const item of this.localQuestions) {
				if (sub.subId === item.sub_id) {
					let n = 0;
					for (let j = 1; j <= 15; j++) {
						const sectionArray: any = [];
						for (const qus of item.questions) {
							const findex2 = this.questionsArray.findIndex(f => f.qus_id === qus.qus_id);
							if (findex2 !== -1) {
								qus.answerStatus = this.questionsArray[findex2].answerStatus;
							}
							if (Number(qus.qus_qst_id) === j) {
								sectionArray.push(qus);
								const findex = this.finalSectionArray.findIndex(f => f.sub_id === sub.subId && f.qst_id === j);
								if (findex === -1) {
									this.finalSectionArray.push({
										index: n,
										subName: sub.subName,
										sub_id: sub.subId,
										qst_id: j,
										secArray: sectionArray
									});
									n++;
								}
							}
						}
					}
				}
			}
			i++;
		}
		this.getQuestionArray(this.finalSectionArray[0]);
		this.sectionDetails = this.finalSectionArray[0];
		this.tabIndex = this.sectionDetails.index;
		this.currentQA = this.questionsArray[0];
	}
	getSubjectName(sub_id) {
		for (const element of this.subjectArray) {
			if (Number(element.sub_id) === Number(sub_id)) {
				return element.sub_name;
			}
		}
		return sub_id;
	}
	getUser() {
		const param: any = {};
		param.role_id = this.currentUser.role_id;
		param.login_id = this.currentUser.login_id;
		this.qelementService.getUser(param).subscribe(
			(result: any) => {
				if (result.data.length > 0) {
					this.userDetails = result.data[0];
					this.userprofileimage = this.userDetails.au_profileimage;
					this.userDetailsFlag = true;
				}
			}
		);
	}
	errorNotification(msg) {
		this.notif.error(
			'Error',
			msg,
			{
				timeOut: 2000,
				showProgressBar: true,
				pauseOnHover: false,
				clickToClose: true,
				maxLength: 50
			}
		);
	}

	successNotification(msg) {
		this.notif.success(
			'Success',
			msg,
			{
				timeOut: 2000,
				showProgressBar: true,
				pauseOnHover: false,
				clickToClose: true,
				maxLength: 50
			}
		);
	}

	/* Calling hostlistener on keyup event to capture user input */
	@HostListener('window:keyup', ['$event'])
	keyEvent(event: KeyboardEvent) {
		let keyFlag = false;
		for (const key of this.restrictedKeys) {
			if (key === event.keyCode) {
				keyFlag = true;
				this.restrictedKeysCount++;
				if (this.socketService.checkSocketConnection()) {
					if (this.currentUser) {
						const userDetail = {
							examId: this.examDetail.es_id,
							userId: this.currentUser.login_id,
							paperId: this.examDetail.es_qp_id,
							schoolId: this.currentUser.Prefix,
							userType: this.currentUser.role_id
						};
						userDetail['action'] = appConfig.testSuspiciousErrorCode;
						userDetail['suspiciousCount'] = this.restrictedKeysCount;
						this.socketService.sendUserTestActionDetail(userDetail);
					}
				}
				break;
			}
		}
		if (keyFlag) {
			if (this.restrictedKeysCount < 4) {
				if (confirm('Are you sure you want to exit test') === true) {
					this.router.navigate(['/login']);
				} else {
					if (this.socketService.checkSocketConnection()) {
						if (this.currentUser) {
							const userDetail = {
								examId: this.examDetail.es_id,
								userId: this.currentUser.login_id,
								paperId: this.examDetail.es_qp_id,
								schoolId: this.currentUser.Prefix,
								userType: this.currentUser.role_id
							};
							userDetail['action'] = appConfig.testOngoingCode;
							this.socketService.sendUserTestActionDetail(userDetail);
						}
					}
				}
			} else {
				this.router.navigate(['/login']);
			}
		}
	}
	sendSuspiciousOrNetworkError(testStatusCode) {
		if (this.networkErrorCounter === 0 && this.socketService.checkSocketConnection()) {
			if (this.currentUser) {
				const userDetail = {
					examId: this.examDetail.es_id,
					userId: this.currentUser.login_id,
					paperId: this.examDetail.es_qp_id,
					schoolId: this.currentUser.Prefix,
					userType: this.currentUser.role_id
				};
				userDetail['action'] = testStatusCode;
				userDetail['networkErrorCount'] = this.networkErrorCount;
				this.socketService.sendUserTestActionDetail(userDetail);
			}
		}
		this.networkErrorCounter++;
	}

	checkConnection() {
		setInterval(() => {
			if (navigator.onLine) {
				if (this.chechConFlag === false) {
					this.loading = false;
					this.chechConFlag = true;
					this.sendSuspiciousOrNetworkError(appConfig.testOngoingCode);
				}
			} else {
				this.chechConFlag = false;
				this.loading = true;
				this.errorNotification('No Internet Connection.Please contact your Teacher or System Administrator');
				this.sendSuspiciousOrNetworkError(appConfig.testInternetErrorCode);
			}
		}, 5000);
	}

	buildForm() {
		this.reviewForm = this.fb.group({
			reviewS: ''
		});
	}
	getSchool() {
		this.qelementService.getSchool().subscribe(
			(result: any) => {
				if (result) {
					this.schoolinfoArray = result.data[0];
				}
			},
			error => { }
		);
	}

	getQusColor(answerStatus) {
		if (answerStatus === '') {
			return '#fe756d';
		} else if (answerStatus === '0') {
			return '#6610f2';
		} else if (answerStatus === '1') {
			return '#04CDE4';
		}
	}
	getQusStatuSrc(qus_id) {
		const findex = this.questionsArray.findIndex(f => f.qus_id === qus_id);
		if (findex !== -1) {
			if (this.questionsArray[findex].answerStatus === '') {
				return '/assets/default-ques-btn.svg';
			} else if (this.questionsArray[findex].answerStatus === '2') {
				return '/assets/notanswered.svg';
			} else if (this.questionsArray[findex].answerStatus === '1') {
				return '/assets/answered.svg';
			} else if (this.questionsArray[findex].answerStatus === '0') {
				return '/assets/saveforreview.svg';
			} else if (this.questionsArray[findex].answerStatus === '3') {
				return '/assets/ansmarkreview.svg';
			}
		}
	}

	loadCurrentQ(cqai) {
		this.currentQAHasEssay = false;
		// this.reviewForm.controls.reviewS.setValue(false);
		this.bookMarkTitle = 'Bookmark';
		this.bookMarkFlag = false;
		const currenttime = new Date().getTime();
		this.previousIndex = this.currentQAIndex;
		this.questionsArray[this.previousIndex].timespent = this.questionsArray[this.previousIndex].timespent + (currenttime - this.stime);
		this.stime = currenttime;
		this.currentQAIndex = cqai;
		this.mcqValue = '';
		this.tfValue = '';
		this.matchRowFirstValue = '';
		this.matchRowSecondValue = '';
		this.matchRowThirdValue = '';
		this.matchRowFourthValue = '';
		this.upperRowValue = '';
		this.digitValue = '';
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
		this.singleIntegerArray = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' },
		{ id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }];
		this.doubleIntegerArray1 = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' },
		{ id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }];
		this.doubleIntegerArray2 = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' },
		{ id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }];
		this.subjectiveInputAnswer = '';
		this.subjectiveAnswer.id = null;
		this.currentQA = this.questionsArray[this.currentQAIndex];
		localStorage.setItem('qStatus', JSON.stringify({
			qStatus: this.questionsArray
		}));
		if (this.currentQA.answerStatus === '') {
			this.currentQA.answerStatus = '2';
		}
		this.tabIndex = this.returnIndexForTab(this.currentQA.qus_id);
		if (this.currentQA.qus_ess_id !== '' && this.currentQA.qus_ess_id != null) {
			this.qelementService.getEssay({ ess_id: this.currentQA.qus_ess_id }).subscribe(
				(resulte: any) => {
					if (resulte) {
						this.currentEssay = resulte.data[0];
						this.currentQAHasEssay = true;
					}
				}
			);
		}
		let answerData: any = [];
		answerData = (JSON.parse(localStorage.getItem('qAnswer')).qAnswer);
		if (answerData[this.currentQAIndex].answer.length > 0) {
			if (Number(this.currentQA.qus_qst_id) === 1) {
				// New MCQ
				this.studentMcqAnswer = answerData[this.currentQAIndex].answer;
				let i = 0;
				for (const item of this.studentMcqAnswer) {
					if (item.evd_qus_answer && Number(item.evd_qus_answer) === 1) {
						this.mcqValue = i;
					} else {
						i++;
					}
				}
				this.studentMcqFlag = true;
				// End
			} if (Number(this.currentQA.qus_qst_id) === 2) {
				// New MCQ MR
				this.studentMcqmrAnswer = answerData[this.currentQAIndex].answer;
				for (let i = 0; i < this.studentMcqmrAnswer.length; i++) {
					if (Number(this.studentMcqmrAnswer[i].evd_qus_answer) === 1) {
						this.mcqmrArray.push({
							value: i
						});
					}
				}
				this.studentMcqMrFlag = true;
				// End
			} if (Number(this.currentQA.qus_qst_id) === 3) {
				// New TF
				this.studentTfAnswer = answerData[this.currentQAIndex].answer;
				let i = 0;
				for (const item of this.studentTfAnswer) {
					if (item.evd_qus_answer && Number(item.evd_qus_answer) === 1) {
						this.tfValue = i;
					} else {
						i++;
					}
				}
				this.tfFlag = true;
				// End
			} if (Number(this.currentQA.qus_qst_id) === 4) {
				this.studentMtfAnswer = answerData[this.currentQAIndex].answer;
				this.matchRowFirstValue = this.studentMtfAnswer[0].evd_qus_answer;
				this.matchRowSecondValue = this.studentMtfAnswer[1].evd_qus_answer;
				this.matchRowThirdValue = this.studentMtfAnswer[2].evd_qus_answer;
				this.matchRowFourthValue = this.studentMtfAnswer[3].evd_qus_answer;
				this.matchFlag = true;
				// End
			} if (Number(this.currentQA.qus_qst_id) === 5) {
				this.studentMatrixAnswer = answerData[this.currentQAIndex].answer;
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
			} if (Number(this.currentQA.qus_qst_id) === 13) {
				// New Matrix 4 *5
				this.studentMatrix45Answer = answerData[this.currentQAIndex].answer;
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
			} if (Number(this.currentQA.qus_qst_id) === 14) {
				this.studentSingleInputAnswer = answerData[this.currentQAIndex].answer;
				if (this.studentSingleInputAnswer[0].evd_qus_answer) {
					this.digitValue = Number(this.studentSingleInputAnswer[0].evd_qus_answer);
					this.studentSingleFlag = true;
				} else {
					this.digitValue = '-';
					this.studentSingleFlag = false;
					// Reset Value
					this.singleIntegerArray = [{ id: null }, { id: null }, { id: null }, { id: null }, { id: null },
					{ id: null }, { id: null }, { id: null }, { id: null }, { id: null }];
					// End
					this.singleIntegerArray = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' },
					{ id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }];
				}
			} if (Number(this.currentQA.qus_qst_id) === 15) {
				this.studentDobleInputAnswer = answerData[this.currentQAIndex].answer;
				if (this.studentDobleInputAnswer[0].evd_qus_answer) {
					this.upperRowValue = this.studentDobleInputAnswer[0].evd_qus_answer.charAt(0) +
						this.studentDobleInputAnswer[0].evd_qus_answer.charAt(1);
					this.lowerRowValue = this.studentDobleInputAnswer[0].evd_qus_answer.charAt(1);
					this.upperRowFlag = true;
					this.lowerRowFlag = true;
				} else {
					this.upperRowValue = '';
					this.lowerRowValue = '-';
					this.upperRowFlag = false;
					this.lowerRowFlag = false;
					// Reset Value
					this.doubleIntegerArray1 = [{ id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null },
					{ id: null }, { id: null }, { id: null }, { id: null }];
					this.doubleIntegerArray2 = [{ id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null },
					{ id: null }, { id: null }, { id: null }, { id: null }];
					// End
					this.doubleIntegerArray1 = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' },
					{ id: '5' }, { id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }];
					this.doubleIntegerArray2 = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' },
					{ id: '5' }, { id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }];
				}
			}
		} else {
			if (Number(this.currentQA.qus_qst_id) === 1) {
				this.studentMcqFlag = false;
			} if (Number(this.currentQA.qus_qst_id) === 2) {
				this.studentMcqMrFlag = false;
			} if (Number(this.currentQA.qus_qst_id) === 3) {
				this.tfFlag = false;
				// Reset
				this.trueFalseArray = [
					{ name: 'True', value: null },
					{ name: 'False', value: null }];
				// End\
				this.trueFalseArray = [
					{ name: 'True', value: '0' },
					{ name: 'False', value: '1' }];
			} if (Number(this.currentQA.qus_qst_id) === 4) {
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
			} if (Number(this.currentQA.qus_qst_id) === 5) {
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
			} if (Number(this.currentQA.qus_qst_id) === 13) {
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
					value: [{ index: 0, id: 'P' },
					{ index: 1, id: 'Q' }, { index: 2, id: 'R' }, { index: 3, id: 'S' }, { index: 4, id: 'T' }]
				},
				{
					name: 'B',
					value: [{ index: 5, id: 'P' }, { index: 6, id: 'Q' },
					{ index: 7, id: 'R' }, { index: 8, id: 'S' }, { index: 9, id: 'T' }]
				},
				{
					name: 'C',
					value: [{ index: 10, id: 'P' }, { index: 11, id: 'Q' }, { index: 12, id: 'R' },
					{ index: 13, id: 'S' }, { index: 14, id: 'T' }]
				},
				{
					name: 'D',
					value: [{ index: 15, id: 'P' }, { index: 16, id: 'Q' },
					{ index: 17, id: 'R' }, { index: 18, id: 'S' }, { index: 19, id: 'T' }]
				}];
			} if (Number(this.currentQA.qus_qst_id) === 14) {
				this.studentSingleFlag = false;
				this.digitValue = '-';
				// Reset Value
				this.singleIntegerArray = [{ id: null }, { id: null }, { id: null }, { id: null }, { id: null },
				{ id: null }, { id: null }, { id: null }, { id: null }, { id: null }];
				// End
				this.singleIntegerArray = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' },
				{ id: '5' }, { id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }];

			} if (Number(this.currentQA.qus_qst_id) === 15) {
				this.upperRowFlag = false;
				this.lowerRowFlag = false;
				this.upperRowValue = '';
				this.lowerRowValue = '-';
				// Reset
				this.doubleIntegerArray1 = [{ id: null }, { id: null }, { id: null }, { id: null }, { id: null },
				{ id: null }, { id: null }, { id: null }, { id: null }, { id: null }];
				this.doubleIntegerArray2 = [{ id: null }, { id: null }, { id: null }, { id: null },
				{ id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null }];
				// Value
				this.doubleIntegerArray1 = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' },
				{ id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }];
				this.doubleIntegerArray2 = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' },
				{ id: '5' }, { id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }];
			}

		}
	}
	returnIndexForTab(qus_id) {
		let i = 0;
		this.questionListArray = [];
		for (const item of this.finalSectionArray) {
			for (const titem of item.secArray) {
				if (titem.qus_id === qus_id) {
					for (const qus of item.secArray) {
						this.questionListArray.push(qus);
					}
					return i;
				}
			}
			i++;
		}
	}
	saveAndNext(status) {
		const answer: any[] = [];
		if (Number(this.currentQA.qus_qst_id) === 1) {
			if (this.mcqValue) {
				for (let ansi = 0; ansi < this.currentQA.options.length; ansi++) {
					if (ansi === Number(this.mcqValue)) {
						answer[ansi] = { 'evd_qus_answer': '1' };
					} else {
						answer[ansi] = { 'evd_qus_answer': '0' };
					}
				}
			}
			// End
		} if (Number(this.currentQA.qus_qst_id) === 2) {
			// New MCQ MR
			if (this.mcqmrArray.length > 0) {
				for (let ansi = 0; ansi < this.currentQA.options.length; ansi++) {
					for (const item of this.mcqmrArray) {
						if (ansi === Number(item.value)) {
							answer[ansi] = { 'evd_qus_answer': '1' };
							break;
						} else {
							answer[ansi] = { 'evd_qus_answer': '0' };
						}
					}
				}
			}
			// End
		} if (Number(this.currentQA.qus_qst_id) === 3) {
			// New  TF
			if (this.tfValue !== '') {
				for (let ansi = 0; ansi < this.currentQA.options.length; ansi++) {
					if (ansi === Number(this.tfValue)) {
						answer[ansi] = { 'evd_qus_answer': '1' };
					} else {
						answer[ansi] = { 'evd_qus_answer': '0' };
					}
				}
			}
			// End
		} if (Number(this.currentQA.qus_qst_id) === 4) {
			// New MTF
			if (this.matchRowFirstValue !== '' &&
				this.matchRowSecondValue !== '' && this.matchRowThirdValue !== '' && this.matchRowFourthValue !== '') {
				for (let i = 0; i < this.matchArray.length; i++) {
					for (let j = 0; j < this.matchArray[i].value.length; j++) {
						if (this.matchArray[i].value[j] === this.matchRowFirstValue && i === 0) {
							answer[i] = { 'evd_qus_answer': this.matchRowFirstValue };
							break;
						} else {
							answer[i] = { 'evd_qus_answer': '' };
						}
						if (this.matchArray[i].value[j] === this.matchRowSecondValue && i === 1) {
							answer[i] = { 'evd_qus_answer': this.matchRowSecondValue };
							break;
						} else {
							answer[i] = { 'evd_qus_answer': '' };
						}
						if (this.matchArray[i].value[j] === this.matchRowThirdValue && i === 2) {
							answer[i] = { 'evd_qus_answer': this.matchRowThirdValue };
							break;
						} else {
							answer[i] = { 'evd_qus_answer': '' };
						}
						if (this.matchArray[i].value[j] === this.matchRowFourthValue && i === 3) {
							answer[i] = { 'evd_qus_answer': this.matchRowFourthValue };
							break;
						} else {
							answer[i] = { 'evd_qus_answer': '' };
						}
					}
				}
			}
			// End
		} if (Number(this.currentQA.qus_qst_id) === 5) {
			// New Matric Match 4 * 4
			if (this.matrixStoreArray.length > 0) {
				for (let ansi = 0; ansi < this.currentQA.options.length * this.currentQA.options.length; ansi++) {
					for (const item of this.matrixStoreArray) {
						if (Number(item.value) === ansi) {
							answer[ansi] = { 'evd_qus_answer': '1' };
							break;
						} else {
							answer[ansi] = { 'evd_qus_answer': '0' };
						}
					}
				}
			}
			// End
		} if (Number(this.currentQA.qus_qst_id) === 13) {
			// New Matric Match 4 * 5
			if (this.matrixStore45Array.length > 0) {
				for (let ansi = 0; ansi < this.currentQA.options.length * this.currentQA.options_match.length; ansi++) {
					for (const item of this.matrixStore45Array) {
						if (Number(item.value) === ansi) {
							answer[ansi] = { 'evd_qus_answer': '1' };
							break;
						} else {
							answer[ansi] = { 'evd_qus_answer': '0' };
						}
					}
				}
			}
			// End
		} if (Number(this.currentQA.qus_qst_id) === 14) {
			if (this.digitValue !== '-') {
				answer.push({ evd_qus_answer: this.digitValue });
			}
		} if (Number(this.currentQA.qus_qst_id) === 15) {
			if (this.upperRowValue !== '') {
				answer.push({ evd_qus_answer: this.upperRowValue.charAt(0) + this.upperRowValue.charAt(1) });
			}
		}
		if (answer.length > 0 && status === 'save') {
			this.questionsArray[this.currentQAIndex].answerStatus = '1';
			for (const item of this.finalSectionArray) {
				for (const titem of item.secArray) {
					if (titem.qus_id === this.questionsArray[this.currentQAIndex].qus_id) {
						titem.answerStatus = this.questionsArray[this.currentQAIndex].answerStatus;
						break;
					}
				}
			}
			const answerJSON: any = [];
			for (const item of answer) {
				answerJSON.push({
					evd_qst_id: this.currentQA.qus_qst_id,
					evd_qus_id: this.currentQA.qus_id,
					evd_qus_answer: item.evd_qus_answer
				});
			}
			this.questionAnswerArray[this.currentQAIndex].answer = answerJSON;
			localStorage.setItem('qStatus', JSON.stringify({
				qStatus: this.questionsArray
			}));
			localStorage.setItem('qAnswer', JSON.stringify({
				qAnswer: this.questionAnswerArray
			}));
			if (navigator.onLine) {
				this.qelementService.studentInputAnswer(
					{
						evd_eva_id: this.eva_id, evd_qus_id: this.currentQA.qus_id,
						es_id: this.es_id,
						evd_qt_id: this.currentQA.qus_qt_id,
						evd_qst_id: this.currentQA.qus_qst_id, answer: answer, evd_status: '1'
					}).subscribe(
						(result: any) => {
							if (result) {
								this.getServerTime(result.data.time_left);
								this.questionAnswerArray[this.currentQAIndex].qus_submit_flag = true;
								localStorage.setItem('qAnswer', JSON.stringify({
									qAnswer: this.questionAnswerArray
								}));
							} else {
								if (result === null || (result && result.status === 'error')) {
									this.addRequestToQueue('/evaluation/studentInputAnswer', {
										evd_eva_id: this.eva_id, evd_qus_id: this.currentQA.qus_id,
										es_id: this.es_id,
										evd_qt_id: this.currentQA.qus_qt_id,
										evd_qst_id: this.currentQA.qus_qst_id, answer: answer, evd_status: '1'
									});
									this.questionAnswerArray[this.currentQAIndex].qus_submit_flag = false;
									localStorage.setItem('qAnswer', JSON.stringify({
										qAnswer: this.questionAnswerArray
									}));
								}
							}
						}
					);
			} else {
				this.addRequestToQueue('/evaluation/studentInputAnswer', {
					evd_eva_id: this.eva_id, evd_qus_id: this.currentQA.qus_id,
					es_id: this.es_id,
					evd_qt_id: this.currentQA.qus_qt_id,
					evd_qst_id: this.currentQA.qus_qst_id, answer: answer, evd_status: '1'
				});
			}
		} else if (answer.length > 0 && status === 'review') {
			if (navigator.onLine) {
				this.questionsArray[this.currentQAIndex].answerStatus = '3';
				for (const item of this.finalSectionArray) {
					for (const titem of item.secArray) {
						if (titem.qus_id === this.questionsArray[this.currentQAIndex].qus_id) {
							titem.answerStatus = this.questionsArray[this.currentQAIndex].answerStatus;
							break;
						}
					}
				}
				const answerJSON: any = [];
				for (const item of answer) {
					answerJSON.push({
						evd_qst_id: this.currentQA.qus_qst_id,
						evd_qus_id: this.currentQA.qus_id,
						evd_qus_answer: item.evd_qus_answer
					});
				}
				this.questionAnswerArray[this.currentQAIndex].answer = answerJSON;
				localStorage.setItem('qStatus', JSON.stringify({
					qStatus: this.questionsArray
				}));
				localStorage.setItem('qAnswer', JSON.stringify({
					qAnswer: this.questionAnswerArray
				}));
				this.qelementService.studentInputAnswer(
					{
						evd_eva_id: this.eva_id, evd_qus_id: this.currentQA.qus_id,
						es_id: this.es_id,
						evd_qt_id: this.currentQA.qus_qt_id,
						evd_qst_id: this.currentQA.qus_qst_id, answer: answer, evd_status: '1'
					}).subscribe(
						(result: any) => {
							if (result) {
								this.getServerTime(result.data.time_left);
								this.questionAnswerArray[this.currentQAIndex].qus_submit_flag = true;
								localStorage.setItem('qAnswer', JSON.stringify({
									qAnswer: this.questionAnswerArray
								}));
							} else {
								if (result === null || (result && result.status === 'error')) {
									this.addRequestToQueue('/evaluation/studentInputAnswer', {
										evd_eva_id: this.eva_id, evd_qus_id: this.currentQA.qus_id,
										es_id: this.es_id,
										evd_qt_id: this.currentQA.qus_qt_id,
										evd_qst_id: this.currentQA.qus_qst_id, answer: answer, evd_status: '1'
									});
									this.questionAnswerArray[this.currentQAIndex].qus_submit_flag = false;
									localStorage.setItem('qAnswer', JSON.stringify({
										qAnswer: this.questionAnswerArray
									}));
								}
							}
						}
					);
			} else {
				this.addRequestToQueue('/evaluation/studentInputAnswer', {
					evd_eva_id: this.eva_id, evd_qus_id: this.currentQA.qus_id,
					es_id: this.es_id,
					evd_qt_id: this.currentQA.qus_qt_id,
					evd_qst_id: this.currentQA.qus_qst_id, answer: answer, evd_status: '1'
				});
			}
		} else if (answer.length === 0 && status === 'review') {
			if (navigator.onLine) {
				this.questionsArray[this.currentQAIndex].answerStatus = '0';
				for (const item of this.finalSectionArray) {
					for (const titem of item.secArray) {
						if (titem.qus_id === this.questionsArray[this.currentQAIndex].qus_id) {
							titem.answerStatus = this.questionsArray[this.currentQAIndex].answerStatus;
							break;
						}
					}
				}
				const answerJSON: any = [];
				this.questionAnswerArray[this.currentQAIndex].answer = answerJSON;
				localStorage.setItem('qStatus', JSON.stringify({
					qStatus: this.questionsArray
				}));
				localStorage.setItem('qAnswer', JSON.stringify({
					qAnswer: this.questionAnswerArray
				}));
				this.qelementService.studentInputAnswer(
					{
						evd_eva_id: this.eva_id, evd_qus_id: this.currentQA.qus_id,
						es_id: this.es_id,
						evd_qt_id: this.currentQA.qus_qt_id,
						evd_qst_id: this.currentQA.qus_qst_id, answer: answer, evd_status: '0'
					}).subscribe(
						(result: any) => {
							if (result) {
								this.getServerTime(result.data.time_left);
								this.questionAnswerArray[this.currentQAIndex].qus_submit_flag = true;
								localStorage.setItem('qAnswer', JSON.stringify({
									qAnswer: this.questionAnswerArray
								}));
							} else {
								if (result === null || (result && result.status === 'error')) {
									this.addRequestToQueue('/evaluation/studentInputAnswer', {
										evd_eva_id: this.eva_id, evd_qus_id: this.currentQA.qus_id,
										es_id: this.es_id,
										evd_qt_id: this.currentQA.qus_qt_id,
										evd_qst_id: this.currentQA.qus_qst_id, answer: answer, evd_status: '0'
									});
									this.questionAnswerArray[this.currentQAIndex].qus_submit_flag = false;
									localStorage.setItem('qAnswer', JSON.stringify({
										qAnswer: this.questionAnswerArray
									}));
								}
							}
						}
					);
			} else {
				this.addRequestToQueue('/evaluation/studentInputAnswer', {
					evd_eva_id: this.eva_id, evd_qus_id: this.currentQA.qus_id,
					es_id: this.es_id,
					evd_qt_id: this.currentQA.qus_qt_id,
					evd_qst_id: this.currentQA.qus_qst_id, answer: answer, evd_status: '0'
				});
			}
		}
		if (this.currentQAIndex + 1 === this.questionsArray.length) {
			this.loadCurrentQ(this.currentQAIndex);
		} else {
			this.loadCurrentQ(this.currentQAIndex + 1);
		}
	}
	clearResponse() {
		const emptyAnswer: any[] = [];
		for (const item of this.finalSectionArray) {
			for (const titem of item.secArray) {
				if (titem.qus_id === this.currentQA.qus_id) {
					titem.answerStatus = '2';
					break;
				}
			}
		}
		this.questionsArray[this.currentQAIndex].answerStatus = '2';
		this.questionAnswerArray[this.currentQAIndex].answer = emptyAnswer;
		localStorage.setItem('qStatus', JSON.stringify({
			qStatus: this.questionsArray
		}));
		localStorage.setItem('qAnswer', JSON.stringify({
			qAnswer: this.questionAnswerArray
		}));
		this.setQuestionId(this.currentQA.qus_id);
		this.studentSingleFlag = false;
		this.upperRowFlag = false;
		this.lowerRowFlag = false;
		this.studentMcqFlag = false;
		this.studentMcqMrFlag = false;
		this.tfFlag = false;
		this.matchFlag = false;
		this.matrixMatchFlag = false;
		this.matrixMatch45Flag = false;
		this.subjectiveFlag = false;
		this.subjectiveAnswer.id = null;
	}
	midButtonClick() {
		const x = document.getElementById('right-ques-container');
		if (x.style.display === 'block') {
			x.style.display = 'none';
			document.getElementById('left-ques-container').setAttribute('class', 'custom-mid-col-8');
			document.getElementById('midnavbutton').setAttribute('class', 'midnavbtn');
			document.getElementById('midnavarrowbtn').setAttribute('class', 'fa-chevron-left');
			document.getElementById('midnavarrowbtn').classList.add('fas');
		} else {
			x.style.display = 'block';
			document.getElementById('left-ques-container').setAttribute('class', 'custom-mid-left-ques-container');
			document.getElementById('right-ques-container').setAttribute('class', 'custom-mid-right-ques-container');
			document.getElementById('midnavbutton').setAttribute('class', 'mid-nav-button');
			document.getElementById('midnavarrowbtn').setAttribute('class', 'fa-chevron-right');
			document.getElementById('midnavarrowbtn').classList.add('fas');
		}
	}

	tabClick(tab) {
		document.getElementById('mat-tab-label-0-0').classList.add('dropdown');
	}
	openInstructionDialog() {
		this.dialogRef = this.dialog.open(JeeAdvancedInstructionscreenComponent, {
			data: {
				flag: true
			},
			height: '85vh',
			width: '250vh',
			hasBackdrop: false
		});
	}
	htmlToText(html) {
		return this.htt.htmlToText(html);
	}

	timer() {
		// Set the date we"re counting down to
		const this_ = this;
		const onDay = this.examDetail.es_start_date;
		const onTime = this.examDetail.es_end_time;

		const startTime = this.examDetail.es_start_time;

		let entDatetime = new Date(onDay + ' ' + onTime).getTime();
		const startDateTime = new Date(onDay + ' ' + startTime).getTime();

		// const now = new Date().getTime();  // Get todays date and time



		if (this.examDetail.es_exam_type === '2') {
			const examtime = Number(this.examDetail.tp_time_alloted);
			const examdatetime = new Date().getTime();
			entDatetime = examdatetime + examtime * 60000;
		}

		this.timeLeft = (this.evalutionDetail.time_left * 1000); // Find the distance between now an the count down date

		// Update the count down every 1 second
		const x = setInterval(() => {
			if (this.socketExtendTime > 0) {
				this.timeLeft += (this.socketExtendTime * 60000);
				this.socketExtendTime = 0;
			}
			// Time calculations for days, hours, minutes and seconds
			const hours = Math.floor((this.timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			let minutes = Math.floor((this.timeLeft % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((this.timeLeft % (1000 * 60)) / 1000);
			if (this_.ongoingDiv === true && hours === 0 && minutes === 5 && seconds === 0) {
				alert('5 Minutes Remaining');
			}
			// Display the result in the element with id="demo"
			if (this.examDetail.es_clock_format === 0) {
				this.timers = hours + 'h' + minutes + 'm ' + seconds + 's ';
			} else {
				minutes = hours * 60 + minutes;
				this.timers = + minutes + 'm' + seconds + 's';
			}
			// If the count down is finished, write some text
			if (this.timeLeft < 0) {
				clearInterval(x);
				this.studentFinalSubmit();
				this.timers = 'EXPIRED';
			}
			this.timeLeft = this.timeLeft - 3600 / 4;

		}, 1000);
	}
	sendTestOngoingConfirmation() {

		this.socketService.initSocket();

		this.socketService.onEvent(Event.CONNECT)
			.subscribe(() => {
				const userDetail = {
					examId: this.examDetail.es_id,
					userId: this.currentUser.login_id,
					paperId: this.examDetail.es_qp_id,
					schoolId: this.currentUser.Prefix,
					userType: this.currentUser.role_id
				};
				this.socketService.sendUserInformation(userDetail);
				userDetail['action'] = appConfig.testOngoingCode;
				this.socketService.sendUserTestActionDetail(userDetail);
			}
			);

		this.socketService.getUserTestInformation();

		this.socketService.userTestInformation.subscribe((userTestData) => {
			if (userTestData['action'] === appConfig.testExtendCode) {
				this.socketExtendTime = userTestData['extTime'] * 60000;
			}
			if (userTestData['action'] === appConfig.testEndCode) {
				this.studentFinalSubmit();
			}
		});

		this.socketService.onEvent(Event.DISCONNECT)
			.subscribe(() => {
				console.log('Disconnected');
			});
	}
	getServerTime(time: any) {
		// Find the distance between now an the count down date
		// Time calculations for days, hours, minutes and second
		this.timeLeft = Number(time) * 1000;
	}
	testSummary() {
		this.testSummaryDiv = true;
		this.ongoingDiv = false;
	}
	getSubjectSplice(item) {
		if (item && item.subName) {
			return item.subName.slice(0, 3);
		}
	}

	reviewCurrentQ(rcqi) {
		this.testSummaryDiv = false;
		this.ongoingDiv = true;
		this.loadCurrentQ(rcqi);
	}

	getAttemptedQus() {
		let counter = 0;
		for (const qus of this.questionsArray) {
			if (qus.answerStatus === '1') {
				counter++;
			}
		}
		return counter;
	}

	getBookmarkedQus() {
		let counter = 0;
		for (const qus of this.questionsArray) {
			if (qus.answerStatus === '0') {
				counter++;
			}
		}
		return counter;
	}

	getSkippedQus() {
		let counter = 0;
		for (const qus of this.questionsArray) {
			if (qus.answerStatus === '') {
				counter++;
			}
		}
		return counter;
	}
	studentFinalSubmit(endByTeacher = false) {
		let eva_status: string;
		if (this.examDetail.es_qt_status === '2') {
			eva_status = '2';
		} else {
			eva_status = '1';
		}
		const questions: any[] = [];
		let i = 0;
		for (const qus of this.questionsArray) {
			qus.answer = this.questionAnswerArray[i].answer;
			questions.push(qus);
			i++;
		}
		if (this.examDetail.es_exam_type === '2') {
			this.qelementService.studentFinalSubmit({
				eva_id: this.eva_id, eva_status: eva_status, es_exam_type: this.examDetail.es_exam_type,
				es_id: this.es_id, allresponses: questions
			}).subscribe(
				(result: any) => {
					if (result) {
						localStorage.removeItem('currentExam');
						localStorage.removeItem('qStatus');
						localStorage.removeItem('qAnswer');
						this.sendTestEndConfirmation();
						//this.router.navigate(['../../test-confirmation', this.es_id], { relativeTo: this.route });
						close();
					}
				}
			);
		} else {
			this.qelementService.studentFinalSubmit({
				eva_id: this.eva_id, eva_status: eva_status,
				es_exam_type: this.examDetail.es_exam_type, allresponses: questions
			}).subscribe(
				(result: any) => {
					if (result) {
						localStorage.removeItem('currentExam');
						localStorage.removeItem('qStatus');
						localStorage.removeItem('qAnswer');
						this.sendTestEndConfirmation();
						if (endByTeacher) {
							this.router.navigate(['../../test-summary', this.es_id], { relativeTo: this.route });
						} else {
							this.router.navigate(['../../test-confirmation', this.es_id], { relativeTo: this.route });
						}
					}
				}
			);
		}
	}

	sendTestEndConfirmation() {
		if (this.socketService.checkSocketConnection()) {
			if (this.currentUser) {
				const userDetail = {
					examId: this.examDetail.es_id,
					userId: this.currentUser.login_id,
					paperId: this.examDetail.es_qp_id,
					schoolId: this.currentUser.Prefix,
					userType: this.currentUser.role_id
				};
				this.socketService.sendUserInformation(userDetail);
				userDetail['action'] = appConfig.testSubmitCode;
				this.socketService.sendUserTestActionDetail(userDetail);
			}
		}
	}

	// New Changes All
	getSubjectiveInputValue(value) {
		this.subjectiveInputAnswer = value;
	}
	getValue($event) {
		this.digitValue = $event.srcElement.value;
	}
	setValue(num) {
		this.digitValue = num;
	}
	onPressBackspaceSingle() {
		this.digitValue = this.digitValue = '';
	}
	onPressClearSingle() {
		this.digitValue = '';
	}
	onPressClearDouble() {
		this.upperRowValue = '';
	}
	onPressBackspaceDouble() {
		this.upperRowValue = this.upperRowValue.substring(0, this.upperRowValue.length - 1);
	}
	getUpperRowValue($event) {
		this.upperRowValue = $event.srcElement.value.charAt(0) + $event.srcElement.value.charAt(1);
	}
	setNum(value) {
		if (value) {
			const previousValue = this.upperRowValue;
			this.upperRowValue = value.toString();
			this.upperRowValue = previousValue.toString() + value.toString();
			if (this.upperRowValue && this.upperRowValue.length > 2) {
				this.upperRowValue = this.upperRowValue.slice(0, 2);
			}
		}
	}
	getMcqChangeEvent($event) {
		this.mcqValue = $event.srcElement.value;
	}
	checkSingleIntegerStatus(item) {
		if (this.studentSingleInputAnswer[0].evd_qus_answer
			&& Number(item) === Number(this.studentSingleInputAnswer[0].evd_qus_answer)) {
			return true;
		} else {
			return false;
		}
	}

	checkUpperRowStatus(item) {
		if (this.studentDobleInputAnswer[0].evd_qus_answer
			&& Number(item) === Number(this.studentDobleInputAnswer[0].evd_qus_answer.charAt(0))) {
			return true;
		} else {
			return false;
		}
	}

	checkLowerRowStatus(item) {
		if (this.studentDobleInputAnswer[0].evd_qus_answer
			&& Number(item) === Number(this.studentDobleInputAnswer[0].evd_qus_answer.charAt(1))) {
			return true;
		} else {
			return false;
		}
	}
	checkMcqAnswerStatus(index) {
		if (this.studentMcqAnswer[index]
			&& this.studentMcqAnswer[index].evd_qus_answer && Number(this.studentMcqAnswer[index].evd_qus_answer) === 1) {
			return 'checked';
		}
	}
	checkMcqMrAnswerStatus(index) {
		if (this.studentMcqmrAnswer[index]
			&& this.studentMcqmrAnswer[index].evd_qus_answer && Number(this.studentMcqmrAnswer[index].evd_qus_answer) === 1) {
			return 'checked';
		}
	}
	changeOptionsMcqMr($event) {
		const findex = this.mcqmrArray.findIndex((f) => Number(f.value) === Number($event.srcElement.value));
		if (findex === -1) {
			this.mcqmrArray.push({
				value: Number($event.srcElement.value)
			});
		} else {
			this.mcqmrArray.splice(findex, 1);
		}
	}

	getTfValue($event) {
		this.tfValue = Number($event.srcElement.value);
	}
	checkTfStatus(index) {
		if (this.studentTfAnswer[index]
			&& this.studentTfAnswer[index].evd_qus_answer && Number(this.studentTfAnswer[index].evd_qus_answer) === 1) {
			return 'checked';
		}
	}
	getMtfChange($event, index) {
		if (index === 0) {
			this.matchRowFirstValue = $event.srcElement.value;
		}
		if (index === 1) {
			this.matchRowSecondValue = $event.srcElement.value;
		}
		if (index === 2) {
			this.matchRowThirdValue = $event.srcElement.value;
		}
		if (index === 3) {
			this.matchRowFourthValue = $event.srcElement.value;
		}
	}
	checkMtfStatus(value, index) {
		if (this.studentMtfAnswer[index]
			&& this.studentMtfAnswer[index].evd_qus_answer && this.studentMtfAnswer[index].evd_qus_answer === value) {
			return 'checked';
		}
	}
	getMatrixChange($event, index) {
		const findex = this.matrixStoreArray.findIndex(f => f.id === index && Number(f.value) === Number($event.srcElement.value));
		if (findex === -1) {
			this.matrixStoreArray.push({
				id: index,
				value: Number($event.srcElement.value)
			});
		} else {
			this.matrixStoreArray.splice(findex, 1);
		}
		for (let i = 0; i < this.matrixStoreArray.length - 1; i++) {
			for (let j = 0; j < this.matrixStoreArray.length - i - 1; j++) {
				if (
					this.matrixStoreArray[j].id > this.matrixStoreArray[j + 1].id) {
					const temp = this.matrixStoreArray[j];
					this.matrixStoreArray[j] = this.matrixStoreArray[j + 1];
					this.matrixStoreArray[j + 1] = temp;
				}
			}
		}
	}

	getMatrix45Change($event, index) {
		const findex = this.matrixStore45Array.findIndex(f => f.id === index && Number(f.value) === Number($event.srcElement.value));
		if (findex === -1) {
			this.matrixStore45Array.push({
				id: index,
				value: Number($event.srcElement.value)
			});
		} else {
			this.matrixStore45Array.splice(findex, 1);
		}
		for (let i = 0; i < this.matrixStore45Array.length - 1; i++) {
			for (let j = 0; j < this.matrixStore45Array.length - i - 1; j++) {
				if (
					this.matrixStore45Array[j].id > this.matrixStore45Array[j + 1].id) {
					const temp = this.matrixStore45Array[j];
					this.matrixStore45Array[j] = this.matrixStore45Array[j + 1];
					this.matrixStore45Array[j + 1] = temp;
				}
			}
		}
	}

	checkMatrixMatchstatus(index) {
		if (this.studentMatrixAnswer[index]
			&& this.studentMatrixAnswer[index].evd_qus_answer && Number(this.studentMatrixAnswer[index].evd_qus_answer) === 1) {
			return 'checked';
		}
	}

	checkMatrixMatch45status(index) {
		if (this.studentMatrix45Answer[index] &&
			this.studentMatrix45Answer[index].evd_qus_answer && Number(this.studentMatrix45Answer[index].evd_qus_answer) === 1) {
			return 'checked';
		}
	}
	getBookMark($event) {
		this.bookMarkFlag = $event.checked;
	}
	getBookMarkStatus() {
		if (this.currentQA.answerStatus === '0') {
			this.bookMarkTitle = 'Bookmarked';
			return true;
		} else {
			this.bookMarkTitle = 'Bookmark';
			return false;
		}
	}
	getQuestionArray(section: any) {
		this.sectionDetails = {};
		this.sectionDetails = section;
		this.tabIndex = this.sectionDetails.index;
		this.questionListArray = [];
		for (const item of section.secArray) {
			this.questionListArray.push(item);
		}
		this.setQuestionId(section.secArray[0].qus_id);
	}
	setQuestionId(qus_id) {
		const findex = this.questionsArray.findIndex(f => f.qus_id === qus_id);
		if (findex !== -1) {
			if (this.questionsArray[findex].answerStatus === '') {
				this.questionsArray[findex].answerStatus = '2';
				for (const item of this.finalSectionArray) {
					let i = 0;
					for (const titem of item.secArray) {
						if (titem.qus_id === qus_id) {
							titem.answerStatus = this.questionsArray[findex].answerStatus;
							break;
						} else {
							i++;
						}
					}
				}
				this.currentQA = this.questionsArray[findex];
				this.loadCurrentQ(findex);
			} else {
				for (const item of this.finalSectionArray) {
					let i = 0;
					for (const titem of item.secArray) {
						if (titem.qus_id === qus_id) {
							titem.answerStatus = this.questionsArray[findex].answerStatus;
							break;
						} else {
							i++;
						}
					}
				}
				this.currentQA = this.questionsArray[findex];
				this.loadCurrentQ(findex);
			}
		}
	}
	getSectionWiseAnswerStatus(section: any, answerStatus) {
		let sum = 0;
		if (section && section.secArray) {
			for (const item of section.secArray) {
				if (item.answerStatus === answerStatus) {
					sum++;
				}
			}
			return sum;
		}
	}
	getAnswerStatus(answerStatus) {
		let sum = 0;
		for (const item of this.questionsArray) {
			if (item.answerStatus === answerStatus) {
				sum++;
			}
		}
		return sum;
	}
}

@Component({
	selector: 'question-no-adv-modal',
	templateUrl: 'question-no-adv-modal.html',
})

export class QuestionNoAdvModalComponent implements OnInit {
	@ViewChild('quesModal') quesModal;
	dialogRef: MatDialogRef<QuestionNoAdvModalComponent>;
	@Output() loadQ = new EventEmitter();
	@Input() questionsArray: any[] = [];
	@Input() questionListArray: any[] = [];
	@Input() sectionDetails: any = {};
	@Input() finalSectionArray: any[] = [];
	@Input() questionAnswerArray: any[] = [];
	constructor(private dialog: MatDialog) { }
	ngOnInit() {
	}
	openModal(data) {
		this.dialogRef = this.dialog.open(this.quesModal, {
			data: {
				subjectArrayOfQP: data
			},
			width: '380px',
		});
	}
	closeModal() {
		this.dialogRef.close();
	}
	getQusStatuSrc(qus_id) {
		const findex = this.questionsArray.findIndex(f => f.qus_id === qus_id);
		if (findex !== -1) {
			if (this.questionsArray[findex].answerStatus === '') {
				return '/assets/default-ques-btn.svg';
			} else if (this.questionsArray[findex].answerStatus === '2') {
				return '/assets/notanswered.svg';
			} else if (this.questionsArray[findex].answerStatus === '1') {
				return '/assets/answered.svg';
			} else if (this.questionsArray[findex].answerStatus === '0') {
				return '/assets/saveforreview.svg';
			} else if (this.questionsArray[findex].answerStatus === '3') {
				return '/assets/ansmarkreview.svg';
			}
		}
	}
	getSectionWiseAnswerStatus(section: any, answerStatus) {
		let sum = 0;
		if (section && section.secArray) {
			for (const item of section.secArray) {
				if (item.answerStatus === answerStatus) {
					sum++;
				}
			}
			return sum;
		}
	}
	setQuestionId(qus_id) {
		this.loadQ.emit(qus_id);
		this.closeModal();
	}
}

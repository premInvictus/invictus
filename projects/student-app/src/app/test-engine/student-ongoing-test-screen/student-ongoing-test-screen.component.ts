import { Component, OnInit, HostListener, OnDestroy, Input, Inject, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { HtmlToTextService } from 'projects/axiom/src/app/_services/htmltotext.service';
import { appConfig } from 'projects/axiom/src/app/app.config';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OngoingTestInstructionComponent } from '../../shared-module/ongoing-test-instruction/ongoing-test-instruction.component';
import { NotificationService, SocketService } from 'projects/axiom/src/app/_services/index';
import { Event } from 'projects/axiom/src/app/_models/event';

import { PreviewDocumentComponent } from '../../shared-module/preview-document/preview-document.component';
import { SisService} from 'projects/sis/src/app/_services';

export class PendingRequest {
	url: string;
	data: any;

	constructor(url: string, data: any) {
		this.url = url;
		this.data = data;
	}
}

@Component({
	selector: 'app-student-ongoing-test-screen',
	templateUrl: './student-ongoing-test-screen.component.html',
	styleUrls: ['./student-ongoing-test-screen.component.css']
})
export class StudentOngoingTestScreenComponent implements OnInit, OnDestroy {

	private queue: PendingRequest[] = [];
	timers: any;
	timeLeft: any;
	previousQAIndex = 0;
	stime = new Date().getTime();
	reviewForm: FormGroup;
	es_id: number;
	eva_id: number;
	examDetail: any = {};
	currentQP: any = {};
	subjectArray: any[] = [];
	subjectArrayOfQP: any[] = [];
	questionIdArray: any[] = [];
	questionsArray: any[] = [];
	questionsArrayResult: any[] = [];
	currentQA: any = {};
	currentEssay: any = {};
	currentQAHasEssay = false;
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
	networkErrorCount = 0;
	screenfull: any;
	schoolinfoArray: any = {};
	hosturl = appConfig.apiUrl;
	getRandom: any;
	getCurrentQp: any;
	userDetails: any = {};
	userprofileimage = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
	currentUser: any = {};
	userDetailsFlag = false;
	singleIntegerArray: any[] = [{ id: '0' },
	{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }];
	doubleIntegerArray1: any[] = [{ id: '0' },
	{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }];
	doubleIntegerArray2: any[] = [{ id: '0' },
	{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }];
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
	dialogRef: MatDialogRef<OngoingTestInstructionComponent>;
	networkErrorCounter = 0;
	socketExtendTime = 0;


	//upload attachemnt
	multipleFileArray: any[] = [];
	imageArray: any[] = [];
	finalDocumentArray: any[] = [];
	counter: any = 0;
	currentFileChangeEvent: any;
	currentImage: any;
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private qelementService: QelementService,
		private htt: HtmlToTextService,
		private fb: FormBuilder,
		private notif: NotificationService,
		private dialog: MatDialog,
		private socketService: SocketService,
		private sisService:SisService,
	) { }

	ngOnDestroy() {
		this.ongoingDiv = false;
	}

	openQuesDialog(): void {
		const dialogRef = this.dialog.open(QuestionNoOnGoingModalComponent, {
			width: '380px',
			data: {
				eva_id: this.eva_id
			}
		});

		dialogRef.componentInstance.loadQus.subscribe(qusInd => {
			this.loadCurrentQ(qusInd);
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
		});
	}

	ngOnInit() {
		document.addEventListener('contextmenu', (e) => {
			e.preventDefault();
		}, false);
		this.es_id = this.route.snapshot.params['id'];
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.checkConnection();
		this.processQueue();
		this.buildForm();
		this.getUser();
		this.getSchool();

		this.examQuestionStatusArray = [];
		this.questionsArrayResult = [];
		this.qelementService.getExamAttendance({ es_id: this.es_id, login_id: this.currentUser.login_id }).subscribe(
			(result1: any) => {
				if (result1 && result1.status === 'ok') {
					this.evalutionDetail = result1.data[0];
					this.timeLeft = (Number(this.evalutionDetail.time_left) * 1000);
					if (this.timeLeft > 0) {
						this.ongoingDiv = true;
						this.sendTestOngoingConfirmation();
					} else {
						this.ongoingDiv = false;
					}
					this.timer();
					this.eva_id = this.evalutionDetail.eva_id;
					this.qelementService.examQuestionStatus({ evd_eva_id: this.evalutionDetail.eva_id }).toPromise().then(
						(result2: any) => {
							if (result2.status === 'ok') {
								this.examQuestionStatusArray = result2.data;
							}
							this.getQusFromLS(this.eva_id).then(questions => {
								if (questions.length > 0) {
									this.questionsArray = questions;
									this.getSubFromLS(this.eva_id).then(subs => {
										if (subs.length > 0) {
											this.subjectArrayOfQP = subs;
										}
									});
									this.loadCurrentQ(0);
								} else {
									this.qelementService.getQuestionPaper({ qp_id: this.examDetail.es_qp_id, qp_status: 1 }).subscribe(
										(result3: any) => {
											if (result3 && result3.status === 'ok') {
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
												for (const qitem of this.currentQP.qlist) {
													this.questionIdArray.push(qitem.qpq_qus_id);
												}
												this.qelementService.getQuestionsInTemplate({ qus_id: this.questionIdArray, exam_flag: '1' }).subscribe(
													(result: any) => {
														if (result && result.status === 'ok') {
															this.questionsArrayResult = result.data;
															if (this.currentQP.qlist) {
																for (const item of this.currentQP.qlist) {
																	for (const titem of this.questionsArrayResult) {
																		if (Number(item.qpq_qus_id) === Number(titem.qus_id)) {
																			titem.qus_marks = item.qpq_marks;
																			titem.qus_negative_marks = item.qpq_negative_marks;
																		}
																	}
																}
															}
															for (const qus of this.questionsArrayResult) {
																qus.answerStatus = '';
																qus.answer = '';
																qus.response = '';
																qus.timespent = 0;
																if (this.examQuestionStatusArray.length > 0) {
																	for (const eqs of this.examQuestionStatusArray) {
																		if (eqs.evd_qus_id === qus.qus_id) {
																			qus.answerStatus = eqs.evd_status;
																			qus.answer = eqs.answer;
																			break;
																		}
																	}
																}
																this.questionsArray.push(qus);
															}
															if (this.examDetail.es_shuffle_question === '1') {
																let i, j, temp;
																for (i = this.questionsArray.length - 1; i > 0; i--) {
																	j = Math.floor(Math.random() * (i + 1));
																	temp = this.questionsArray[i];
																	this.questionsArray[i] = this.questionsArray[j];
																	this.questionsArray[j] = temp;
																}
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
															// load the 1st question as soon as the exam starts
															this.currentQA = this.questionsArray[this.currentQAIndex];
															localStorage.setItem('currentExamQus',
																JSON.stringify({ eva_id: this.eva_id, eva_id_qus: this.questionsArray }));
															localStorage.setItem('currentExamSub',
																JSON.stringify({ eva_id: this.eva_id, eva_id_sub: this.subjectArrayOfQP }));
															this.loadCurrentQ(0);
														}
													}
												);
											}
										}
									);
								}
							});
						});
				}
			}
		);
		this.qelementService.getScheduledExam({ es_id: this.es_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.examDetail = result.data[0];
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
	getSubFromLS(eva_id): Promise<any> {
		return new Promise(resolve => {
			if (localStorage.getItem('currentExamSub')) {
				const currentExamSub = JSON.parse(localStorage.getItem('currentExamSub'));
				if (currentExamSub.eva_id === eva_id) {
					if (currentExamSub.eva_id_sub) {
						resolve(currentExamSub.eva_id_sub);
					}
					resolve([]);
				}
			}
			resolve([]);
		});
	}
	getQusFromLS(eva_id): Promise<any> {
		return new Promise(resolve => {
			if (localStorage.getItem('currentExamQus')) {
				const currentExamQus = JSON.parse(localStorage.getItem('currentExamQus'));
				if (currentExamQus.eva_id === eva_id) {
					if (currentExamQus.eva_id_qus) {
						resolve(currentExamQus.eva_id_qus);
					}
					resolve([]);
				}
			}
			resolve([]);
		});
	}
	setQusToLS() {
		return new Promise(resolve => {
			localStorage.setItem('currentExamQus', JSON.stringify({ eva_id: this.eva_id, eva_id_qus: this.questionsArray }));
			resolve();
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
			if (result && result.status === 'ok') {
			} else {
				if (result === null || (result && result.status === 'error')) {
					this.addRequestToQueue(request.url, request.data);
				}
			}
		});
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
				if (result.status === 'ok' && result.data.length > 0) {
					this.userDetails = result.data[0];
					console.log(this.userDetails);
					this.userprofileimage = this.userDetails.au_profileimage ? this.userDetails.au_profileimage : this.userprofileimage;
					this.userDetailsFlag = true;
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
			// if (this.restrictedKeysCount < 4) {
			// 	if (confirm('Are you sure you want to exit test') === true) {
			// 		this.router.navigate(['/login']);
			// 	} else {
			// 		if (this.socketService.checkSocketConnection()) {
			// 			if (this.currentUser) {
			// 				const userDetail = {
			// 					examId: this.examDetail.es_id,
			// 					userId: this.currentUser.login_id,
			// 					paperId: this.examDetail.es_qp_id,
			// 					schoolId: this.currentUser.Prefix,
			// 					userType: this.currentUser.role_id
			// 				};
			// 				userDetail['action'] = appConfig.testOngoingCode;
			// 				this.socketService.sendUserTestActionDetail(userDetail);
			// 			}
			// 		}
			// 	}
			// } else {
			// 	if(this.examDetail.es_stop_examination == 1){
			// 		this.router.navigate(['/login']);
			// 	} else {
			// 		if (confirm('Are you sure you want to exit test') === true) {
			// 			this.router.navigate(['/login']);
			// 		}
			// 	}
				
			// }
			if (this.restrictedKeysCount < 4) {				
				alert("You have entered restricted key");
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
			} else {
				if(this.examDetail.es_stop_examination == 1){
					this.router.navigate(['/login']);
				} else {
					alert("You have entered restricted key");
				}				
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
		this.networkErrorCounter = 0;
		setInterval(() => {
			if (navigator.onLine) {
				if (this.chechConFlag === false) {
					this.loading = false;
					this.chechConFlag = true;
				}
				this.sendSuspiciousOrNetworkError(appConfig.testOngoingCode);
			} else {
				this.chechConFlag = false;
				this.loading = true;
				this.networkErrorCount++;
				this.notif.showSuccessErrorMessage('No Internet Connection.Please contact your Teacher or System Administrator', 'error');
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
				if (result && result.status === 'ok') {
					this.schoolinfoArray = result.data[0];
				}
			},
			error => { }
		);
	}
	getCount(value) {
		let nvcount = 0;
		if (this.questionsArray.length > 0) {
			for (const item of this.questionsArray) {
				if (item.answerStatus === value) {
					nvcount++;
				}
			}
		}
		return nvcount;
	}

	getQusColor(answerStatus) {
		if (answerStatus === '') {
			return '#070707';
		} else if (answerStatus === '0') {
			return '#6610f2';
		} else if (answerStatus === '1') {
			return '#1ec40b';
		} else if (answerStatus === '2') {
			return '#fe756d';
		} else if (answerStatus === '3') {
			return '#06b7e8';
		}
	}

	loadCurrentQ(cqai) {
		
		const curenttime = new Date().getTime();
		this.previousQAIndex = this.currentQAIndex;
		this.questionsArray[this.previousQAIndex].timespent = this.questionsArray[this.previousQAIndex].timespent + (curenttime - this.stime);
		this.currentQAIndex = cqai;
		this.stime = curenttime;
		this.currentQAHasEssay = false;
		// this.reviewForm.controls.reviewS.setValue(false);
		this.bookMarkTitle = 'Bookmark';
		this.bookMarkFlag = false;
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
		this.currentQA = this.questionsArray[this.currentQAIndex];
		//console.log(this.currentQA);
		console.log('loadCurrentQ',this.questionsArray[this.currentQAIndex])
		if (this.currentQA.answerStatus === '') {
			this.currentQA.answerStatus = '2';
		}
		if(this.currentQA.qus_qt_id == 1){
			console.log('subjective question, call saveSubjectiveWithoutAnswer');
			this.saveSubjectiveWithoutAnswer();
		}
		this.getBookMarkStatus();
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

		if (this.currentQA.answer) {
			if (this.currentQA.answer.length > 0) {
				if (Number(this.currentQA.qus_qst_id) > 5 && Number(this.currentQA.qus_qst_id) < 13) {
					const studentAnswer = this.currentQA.answer[0];
					if (studentAnswer.evd_qus_answer !== '' && studentAnswer.evd_qus_answer) {
						this.subjectiveAnswer.id = studentAnswer.evd_qus_answer;
						this.subjectiveInputAnswer = studentAnswer.evd_qus_answer;
						this.subjectiveFlag = true;
					} else {
						this.subjectiveFlag = false;
						this.subjectiveInputAnswer = '';
						this.subjectiveAnswer.id = null;
					}
				} else if (Number(this.currentQA.qus_qst_id) === 1) {
					this.studentMcqAnswer = this.currentQA.answer;
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
				} else if (Number(this.currentQA.qus_qst_id) === 2) {
					this.studentMcqmrAnswer = this.currentQA.answer;
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
					this.studentTfAnswer = this.currentQA.answer;
					let i = 0;
					for (const item of this.studentTfAnswer) {
						if (item.evd_qus_answer && Number(item.evd_qus_answer) === 1) {
							this.tfValue = i;
						} else {
							i++;
						}
					}
					this.tfFlag = true;
				} else if (Number(this.currentQA.qus_qst_id) === 4) {
					this.studentMtfAnswer = this.currentQA.answer;
					this.matchRowFirstValue = this.studentMtfAnswer[0].evd_qus_answer;
					this.matchRowSecondValue = this.studentMtfAnswer[1].evd_qus_answer;
					this.matchRowThirdValue = this.studentMtfAnswer[2].evd_qus_answer;
					this.matchRowFourthValue = this.studentMtfAnswer[3].evd_qus_answer;
					this.matchFlag = true;
				} else if (Number(this.currentQA.qus_qst_id) === 5) {
					this.studentMatrixAnswer = this.currentQA.answer;
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
				} else if (Number(this.currentQA.qus_qst_id) === 13) {
					// New Matrix 4 *5
					this.studentMatrix45Answer = this.currentQA.answer;
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
				} else if (Number(this.currentQA.qus_qst_id) === 14) {
					this.studentSingleInputAnswer = this.currentQA.answer;
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
					this.studentDobleInputAnswer = this.currentQA.answer;
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
			} else {
				if (Number(this.currentQA.qus_qst_id) > 5 && Number(this.currentQA.qus_qst_id) < 13) {
					this.subjectiveFlag = false;
					this.subjectiveInputAnswer = '';
					this.subjectiveAnswer.id = null;
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
					this.doubleIntegerArray1 = [{ id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null },
					{ id: null }, { id: null }, { id: null }, { id: null }];
					this.doubleIntegerArray2 = [{ id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null },
					{ id: null }, { id: null }, { id: null }, { id: null }];
					// Value
					this.doubleIntegerArray1 = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' },
					{ id: '7' }, { id: '8' }, { id: '9' }];
					this.doubleIntegerArray2 = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' },
					{ id: '7' }, { id: '8' }, { id: '9' }];
				}

			}

			// End

		} else {
			if (Number(this.currentQA.qus_qst_id) > 5 && Number(this.currentQA.qus_qst_id) < 13) {
				this.subjectiveFlag = false;
				this.subjectiveInputAnswer = '';
				this.subjectiveAnswer.id = null;
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
				// Reset Value
				this.doubleIntegerArray1 = [{ id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null },
				{ id: null }, { id: null }, { id: null }, { id: null }];
				this.doubleIntegerArray2 = [{ id: null }, { id: null }, { id: null }, { id: null }, { id: null }, { id: null },
				{ id: null }, { id: null }, { id: null }, { id: null }];
				// End
				this.doubleIntegerArray1 = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' },
				{ id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }];
				this.doubleIntegerArray2 = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' },
				{ id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }];
			}

		}
		this.setQusToLS();
	}

	saveSubjectiveWithoutAnswer(){
		const answer: any[] = [];
		if (Number(this.currentQA.qus_qst_id) > 5 && Number(this.currentQA.qus_qst_id) < 13) {
			const subjectivePA = { evd_qus_answer: '' };
			answer.push(subjectivePA);
		}
		this.qelementService.studentInputAnswer({
			evd_eva_id: this.eva_id, evd_qus_id: this.currentQA.qus_id, es_id: this.es_id,
			evd_qst_id: this.currentQA.qus_qst_id, evd_qt_id: this.currentQA.qus_qt_id, answer: answer, evd_status: '1'
		}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
			}
		});
	}

	saveAndNext(back = false) {
		const answer: any[] = [];
		if (Number(this.currentQA.qus_qst_id) > 5 && Number(this.currentQA.qus_qst_id) < 13) {
			const subjectivePA = { evd_qus_answer: this.subjectiveInputAnswer };
			if (subjectivePA.evd_qus_answer !== '' && subjectivePA.evd_qus_answer) {
				answer.push(subjectivePA);
			}
		} else if (Number(this.currentQA.qus_qst_id) === 1) {

			if (this.mcqValue !== '') {
				for (let ansi = 0; ansi < this.currentQA.options.length; ansi++) {
					if (ansi === this.mcqValue) {
						answer[ansi] = { 'evd_qus_answer': '1' };
					} else {
						answer[ansi] = { 'evd_qus_answer': '0' };
					}
				}
			}
		} else if (Number(this.currentQA.qus_qst_id) === 2) {
			if (this.mcqmrArray.length > 0) {
				for (let ansi = 0; ansi < this.currentQA.options.length; ansi++) {
					for (const item of this.mcqmrArray) {
						if (ansi === item.value) {
							answer[ansi] = { 'evd_qus_answer': '1' };
							break;
						} else {
							answer[ansi] = { 'evd_qus_answer': '0' };
						}
					}
				}
			}
		} else if (Number(this.currentQA.qus_qst_id) === 3) {
			if (this.tfValue !== '') {
				for (let ansi = 0; ansi < this.currentQA.options.length; ansi++) {
					if (ansi === Number(this.tfValue)) {
						answer[ansi] = { 'evd_qus_answer': '1' };
					} else {
						answer[ansi] = { 'evd_qus_answer': '0' };
					}
				}
			}
		} else if (Number(this.currentQA.qus_qst_id) === 4) {
			if (this.matchRowFirstValue !== '' && this.matchRowSecondValue !== '' &&
				this.matchRowThirdValue !== '' && this.matchRowFourthValue !== '') {
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
		} else if (Number(this.currentQA.qus_qst_id) === 5) {
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
		} else if (Number(this.currentQA.qus_qst_id) === 13) {
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
		} else if (Number(this.currentQA.qus_qst_id) === 14) {
			if (this.digitValue !== '-') {
				answer.push({ evd_qus_answer: this.digitValue });
			}
		} else if (Number(this.currentQA.qus_qst_id) === 15) {
			if (this.upperRowValue !== '-' && this.lowerRowValue !== '-') {
				answer.push({ evd_qus_answer: this.upperRowValue + this.lowerRowValue });
			}
		}

		const currentAnswerStatusIndex = this.currentQAIndex;
		this.currentQA.answer = answer;
		if (answer.length > 0) {
			let evd_status = '1';
			this.currentQA.answerStatus = '1';
			// if (this.reviewForm.value.reviewS == true) {
			//   evd_status = "0";
			// }
			if (this.bookMarkFlag) {
				evd_status = '0';
				this.currentQA.answerStatus = '3';
			}
			if (navigator.onLine) {
				this.qelementService.studentInputAnswer({
					evd_eva_id: this.eva_id, evd_qus_id: this.currentQA.qus_id, es_id: this.es_id,
					evd_qst_id: this.currentQA.qus_qst_id, evd_qt_id: this.currentQA.qus_qt_id, answer: answer, evd_status: evd_status
				}).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.timeLeft = Number(result.data.time_left) * 1000;
					} else {
						if (result === null || (result && result.status === 'error')) {
							this.addRequestToQueue('/evaluation/studentInputAnswer', {
								evd_eva_id: this.eva_id, evd_qus_id: this.currentQA.qus_id, es_id: this.es_id,
								evd_qst_id: this.currentQA.qus_qst_id, evd_qt_id: this.currentQA.qus_qt_id, answer: answer, evd_status: evd_status
							});
						}
					}
				});
			} else {
				this.addRequestToQueue('/evaluation/studentInputAnswer', {
					evd_eva_id: this.eva_id, evd_qus_id: this.currentQA.qus_id, es_id: this.es_id,
					evd_qst_id: this.currentQA.qus_qst_id, evd_qt_id: this.currentQA.qus_qt_id, answer: answer, evd_status: evd_status
				});
			}
		} else {
			this.currentQA.answerStatus = '2';
			if (this.bookMarkFlag) {
				const evd_status = '0';
				this.currentQA.answerStatus = '0';
			}
		}
		this.subjectiveAnswer.id = '';
		this.subjectiveInputAnswer = '';
		this.setQusToLS().then(() => {
			if (back) {
				if (this.currentQAIndex === 0) {
					this.loadCurrentQ(this.currentQAIndex);
				} else {
					this.loadCurrentQ(this.currentQAIndex - 1);
				}
			} else {
				if (this.currentQAIndex + 1 === this.questionsArray.length) {
					this.loadCurrentQ(0);
				} else {
					this.loadCurrentQ(this.currentQAIndex + 1);
				}
			}
		});
	}
	clearResponse() {
		const answer: any[] = [];
		answer.push(null);
		this.qelementService.studentClearResponse({ evd_eva_id: this.eva_id, evd_qus_id: this.currentQA.qus_id }).subscribe(
			(result: any) => {
				if (true) {
					this.questionsArray[this.currentQAIndex].answerStatus = '';
					this.questionsArray[this.currentQAIndex].answer = '';
					this.setQusToLS().then(() => {
						console.log('this.currentQAIndex', this.currentQAIndex);
						this.loadCurrentQ(this.currentQAIndex);
					});
				}
			}
		);
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

	htmlToText(html) {
		return this.htt.htmlToText(html);
	}

	timer() {
		// Set the date we"re counting down to
		const this_ = this;
		// Find the distance between now an the count down date
		this.timeLeft = (Number(this.evalutionDetail.time_left) * 1000);

		// Update the count down every 1 second
		const x = setInterval(() => {
			// Update the count down every 1 second
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
			if (this.timeLeft <= 0) {
				clearInterval(x);
				this_.studentFinalSubmit();
				this.timers = 'EXPIRED';
			}
			this.timeLeft = this.timeLeft - 3600 / 4;

		}, 1000);
	}

	testSummary() {
		this.testSummaryDiv = true;
		this.ongoingDiv = false;
		if (this.queue.length > 0) {
			this.queue.forEach(element => {
				this.execute(element);
			});
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
		this.submitAttachment();
		this.getQusFromLS(this.eva_id).then(questions => {
			if (this.examDetail.es_exam_type === '2') {
				this.qelementService.studentFinalSubmit({
					eva_id: this.eva_id, eva_status: eva_status, es_exam_type: this.examDetail.es_exam_type,
					es_id: this.es_id, allresponses: questions
				}).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							localStorage.removeItem('currentExamQus');
							localStorage.removeItem('currentExamSub');
							localStorage.removeItem('currentExam');
							this.sendTestEndConfirmation();
							close();
							//this.router.navigate(['../../test-confirmation', this.es_id], { relativeTo: this.route });
						}
					}
				);
			} else {
				this.qelementService.studentFinalSubmit({
					eva_id: this.eva_id, eva_status: eva_status,
					es_exam_type: this.examDetail.es_exam_type, allresponses: questions
				}).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							localStorage.removeItem('currentExamQus');
							localStorage.removeItem('currentExamSub');
							localStorage.removeItem('currentExam');
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
		});
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
			console.log('teacher ending listingin subject', userTestData);
			if (userTestData['action'] === appConfig.testExtendCode) {
				this.socketExtendTime = Number(userTestData['extTime']);
			}
			if (userTestData['action'] === appConfig.testEndCode) {
				this.studentFinalSubmit(true);
			}
		});

		this.socketService.onEvent(Event.DISCONNECT)
			.subscribe(() => {
			});
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
		this.digitValue = $event.value;
	}
	getUpperRowValue($event) {
		this.upperRowValue = $event.value;
	}
	getLowerRowValue($event) {
		this.lowerRowValue = $event.value;
	}
	getMcqChangeEvent($event) {
		this.mcqValue = $event.value;
	}
	checkSingleIntegerStatus(item) {
		if (this.studentSingleInputAnswer[0].evd_qus_answer && Number(item) === Number(this.studentSingleInputAnswer[0].evd_qus_answer)) {
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
		if (this.studentMcqAnswer[index] && this.studentMcqAnswer[index].evd_qus_answer
			&& Number(this.studentMcqAnswer[index].evd_qus_answer) === 1) {
			return true;
		} else {
			return false;
		}
	}
	checkMcqMrAnswerStatus(index) {
		if (this.studentMcqmrAnswer[index] && this.studentMcqmrAnswer[index].evd_qus_answer
			&& Number(this.studentMcqmrAnswer[index].evd_qus_answer) === 1) {
			return true;
		} else {
			return false;
		}
	}
	changeOptionsMcqMr($event) {
		const findex = this.mcqmrArray.findIndex((f) => f.value === $event.source.value);
		if (findex === -1) {
			this.mcqmrArray.push({
				value: $event.source.value
			});
		} else {
			this.mcqmrArray.splice(findex, 1);
		}
	}

	getTfValue($event) {
		this.tfValue = $event.value;
	}
	checkTfStatus(index) {
		if (this.studentTfAnswer[index] && this.studentTfAnswer[index].evd_qus_answer
			&& Number(this.studentTfAnswer[index].evd_qus_answer) === 1) {
			return true;
		} else {
			return false;
		}
	}
	getMtfChange($event, index) {
		if (index === 0) {
			this.matchRowFirstValue = $event.value;
		}
		if (index === 1) {
			this.matchRowSecondValue = $event.value;
		}
		if (index === 2) {
			this.matchRowThirdValue = $event.value;
		}
		if (index === 3) {
			this.matchRowFourthValue = $event.value;
		}
	}
	checkMtfStatus(value, index) {
		if (this.studentMtfAnswer[index] && this.studentMtfAnswer[index].evd_qus_answer
			&& this.studentMtfAnswer[index].evd_qus_answer === value) {
			return true;
		} else {
			return false;
		}
	}
	getMatrixChange($event, index) {
		const findex = this.matrixStoreArray.findIndex(f => f.id === index && Number(f.value) === Number($event.source.value));
		if (findex === -1) {
			this.matrixStoreArray.push({
				id: index,
				value: $event.source.value
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
		const findex = this.matrixStore45Array.findIndex(f => f.id === index && Number(f.value) === Number($event.source.value));
		if (findex === -1) {
			this.matrixStore45Array.push({
				id: index,
				value: $event.source.value
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
			&& this.studentMatrixAnswer[index].evd_qus_answer
			&& Number(this.studentMatrixAnswer[index].evd_qus_answer) === 1) {
			return true;
		} else {
			return false;
		}
	}

	checkMatrixMatch45status(index) {
		if (this.studentMatrix45Answer[index]
			&& this.studentMatrix45Answer[index].evd_qus_answer
			&& Number(this.studentMatrix45Answer[index].evd_qus_answer) === 1) {
			return true;
		} else {
			return false;
		}
	}
	// End

	// Bookmark  New Functionality
	getBookMark($event) {
		this.bookMarkFlag = $event.checked;
	}
	getBookMarkStatus() {
		if (this.currentQA.answerStatus === '0' || this.currentQA.answerStatus === '3') {
			this.bookMarkTitle = 'Bookmarked';
			this.bookMarkFlag = true;
		} else {
			this.bookMarkTitle = 'Bookmark';
			this.bookMarkFlag = false;
		}
	}
	// End

	// Open Instrucction
	openInstruction() {
		this.dialogRef = this.dialog.open(OngoingTestInstructionComponent, {
			height: '70vh',
			width: '90vh',
			data: {
				item: this.currentQA,
				examDetail: this.examDetail
			}
		});
		this.dialogRef.afterClosed();
	}
	// End

	//upload attachemnt
	fileChangeEvent(fileInput) {
		this.multipleFileArray = [];
		this.currentFileChangeEvent = fileInput;
		const files = fileInput.target.files;
		for (let i = 0; i < files.length; i++) {
			this.IterateFileLoop(files[i]);
		}
	}

	IterateFileLoop(files) {
		const reader = new FileReader();
		reader.onloadend = (e) => {
			this.currentImage = reader.result;
			const fileJson = {
				fileName: files.name,
				imagebase64: this.currentImage,
				module: 'classworkupdate'
			};
			this.multipleFileArray.push(fileJson);
			if (this.multipleFileArray.length === this.currentFileChangeEvent.target.files.length) {
				this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						for (const item of result.data) {
							console.log('item', item);
							this.imageArray.push({
								file_name: item.file_name,
								file_url: item.file_url
							});
						}
						console.log('image array', this.imageArray);
						this.notif.showSuccessErrorMessage('documents added successfully', 'success');
					}
				});
			}
		};
		reader.readAsDataURL(files);
	}
	deleteFile(index) {
		this.imageArray.splice(index, 1);
	}

	resetAttachment() {
		this.imageArray = [];
	}

	submitAttachment() {
		if(this.imageArray.length > 0){
			const docArray:any[]=[];
			this.imageArray.forEach(element => {
				docArray.push(element.file_url);
			});
			const param:any={};
			param.es_id = this.es_id;
			param.login_id =this.currentUser.login_id ;
			param.eva_documents = docArray;
			this.qelementService.uploadExamDocuments(param).subscribe((result: any) => {
				if(result && result.status == 'ok'){
					this.notif.showSuccessErrorMessage(result.data, 'success');
				} else {
					this.notif.showSuccessErrorMessage(result.data, 'error');
				}
			});
		} else {
			this.notif.showSuccessErrorMessage('Please add documents', 'error');
		}
	}
	getuploadurl(fileurl: string) {
		const filetype = fileurl.substr(fileurl.lastIndexOf('.') + 1);
		if (filetype === 'pdf') {
			return 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/exam/icon-pdf.png';
		} else if (filetype === 'doc' || filetype === 'docx') {
			return 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/exam/icon-word.png';
		} else {
			return fileurl;
		}
	}
	previewDocuments(attachmentArray) {
		const attArr: any[] = [];
		if (attachmentArray && attachmentArray.length > 0) {
			attachmentArray.forEach(element => {
				attArr.push({
					file_url: element.file_url
				});
			});
			const dialogRef = this.dialog.open(PreviewDocumentComponent, {
				height: '80%',
				width: '1000px',
				data: {
					index: '',
					images: attArr
				}
			});
		}
	}
}


@Component({
	selector: 'question-no-ongoing-modal',
	templateUrl: 'question-no-ongoing-modal.html',
})

export class QuestionNoOnGoingModalComponent implements OnInit {

	@Output() loadQus = new EventEmitter();
	subjectArrayOfQP: any[] = [];
	questionsArray: any[] = [];
	constructor(
		@Inject(MAT_DIALOG_DATA) public data,
		public dialogRef: MatDialogRef<QuestionNoOnGoingModalComponent>
	) { }
	ngOnInit() {
		console.log(this.data);
		this.getQusFromLS(this.data.eva_id).then(questions => {
			if (questions.length > 0) {
				this.questionsArray = questions;
				this.getSubFromLS(this.data.eva_id).then(subs => {
					if (subs.length > 0) {
						this.subjectArrayOfQP = subs;
					}
				});
			}
		});
	}
	getSubFromLS(eva_id): Promise<any> {
		return new Promise(resolve => {
			if (localStorage.getItem('currentExamSub')) {
				const currentExamSub = JSON.parse(localStorage.getItem('currentExamSub'));
				if (currentExamSub.eva_id === eva_id) {
					if (currentExamSub.eva_id_sub) {
						resolve(currentExamSub.eva_id_sub);
					}
					resolve([]);
				}
			}
			resolve([]);
		});
	}
	getQusFromLS(eva_id): Promise<any> {
		return new Promise(resolve => {
			if (localStorage.getItem('currentExamQus')) {
				const currentExamQus = JSON.parse(localStorage.getItem('currentExamQus'));
				if (currentExamQus.eva_id === eva_id) {
					if (currentExamQus.eva_id_qus) {
						resolve(currentExamQus.eva_id_qus);
					}
					resolve([]);
				}
			}
			resolve([]);
		});
	}
	loadCurrentQ(qusInd) {
		this.loadQus.emit(qusInd);
		this.dialogRef.close();
	}
	getQusColor(answerStatus) {
		if (answerStatus === '') {
			return '#070707';
		} else if (answerStatus === '0') {
			return '#6610f2';
		} else if (answerStatus === '1') {
			return '#1ec40b';
		} else if (answerStatus === '2') {
			return '#fe756d';
		} else if (answerStatus === '3') {
			return '#06b7e8';
		}
	}
}

import { Component, OnInit, HostListener, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import {
	NotificationService,
	SocketService
} from 'projects/axiom/src/app/_services/index';
import { appConfig } from 'projects/axiom/src/app/app.config';
import { HttpClient } from '@angular/common/http';
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
	selector: 'app-jee-mains',
	templateUrl: './jee-mains.component.html',
	styleUrls: ['./jee-mains.component.css']
})
export class JeeMainsComponent implements OnInit {
	reviewForm: FormGroup;
	es_id: number;
	eva_id: number;
	examDetail: any = {};
	examQusDetail: any = {};
	examSubArray: any[] = [];
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
	previousQAIndex = 0;
	stime = new Date().getTime();
	etime = new Date().getTime();
	evalutionDetail: any = {};
	examQuestionStatusArray: any[] = [];
	public optionMCQHA = ['1', '2', '3', '4', '5'];
	public optionHA = ['A', 'B', 'C', 'D', 'E'];
	public optionmatchHA = ['P', 'Q', 'R', 'S', 'T'];
	ongoingDiv = false;
	testSummaryDiv = false;
	finalConfirmationDiv = false;
	chechConFlag = true;
	loading = false;
	restrictedKeys = [9, 17, 18, 27, 91, 93];
	restrictedKeysCount = 0;
	screenfull: any;
	schoolinfoArray: any = {};
	hosturl = appConfig.apiUrl;
	getRandom: any;
	getCurrentQp: any;
	userprofileimage =
		'https://g21.digialm.com//OnlineAssessment/images/NewCandidateImage.jpg';
	userDetails: any = {};
	currentUser: any = {};
	userDetailsFlag = false;
	timers: any;
	timeLeft: any;
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
	studentMcqAnswer: any[] = [];
	studentMcqmrAnswer: any[] = [];
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
	bookMarkFlag = false;
	bookMarkTitle: any;
	private queue: PendingRequest[] = [];
	socketExtendTime = 0;
	networkErrorCount = 0;
	networkErrorCounter = 0;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private qelementService: QelementService,
		private fb: FormBuilder,
		private notif: NotificationService,
		private http: HttpClient,
		private socketService: SocketService,
		public dialog: MatDialog
	) { }

	openDialog(): void {
		const dialogRef = this.dialog.open(QuestionNoModalComponent, {
			width: '380px',
			data: {
				eva_id: this.evalutionDetail.eva_id,
				eva_es_id:this.evalutionDetail.eva_es_id,
				eva_login_id:this.evalutionDetail.eva_login_id
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
		/* document.addEventListener('contextmenu', e => {
      e.preventDefault();
    }, false); */
		this.es_id = this.route.snapshot.params['id'];
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.checkConnection();
		this.processQueue();
		this.buildForm();
		this.getUser();
		// this.getSchool();
		this.examQuestionStatusArray = [];
		this.questionsArrayResult = [];
		this.qelementService
			.getExamAttendance({
				es_id: this.es_id,
				login_id: this.currentUser.login_id
			})
			.subscribe((result: any) => {
				if (result) {
					this.evalutionDetail = result.data[0];
					this.timeLeft = Number(this.evalutionDetail.time_left) * 1000;
					if (this.timeLeft > 0) {
						this.ongoingDiv = true;
						this.sendTestOngoingConfirmation();
					} else {
						this.ongoingDiv = false;
					}
					this.timer();
					this.eva_id = this.evalutionDetail.eva_id;
					this.qelementService
						.examQuestionStatus({ evd_eva_id: this.evalutionDetail.eva_id })
						.toPromise()
						.then((result2: any) => {
							console.log(result2);
							if (result2.status === 'ok') {
								this.examQuestionStatusArray = result2.data;
							}
							this.getQusFromLS(this.eva_id).then(questions => {
								this.questionsArray = questions;

								if (this.questionsArray.length > 0) {
									// console.log('from local storage', this.questionsArray);
									this.getSubFromLS(this.eva_id).then(item => {
										this.examSubArray = item;
									});
									this.loadCurrentQ(0);
								} else {
									this.qelementService
										.getJeeQuestionPaper({ es_id: this.es_id })
										.subscribe((result1: any) => {
											if (result1) {
												// console.log(result1.data);
												if (result1.data.length > 0) {
													// store jee question in local stotage
													localStorage.setItem(
														'currentExam',
														JSON.stringify({
															eva_id: this.eva_id,
															eva_id_data: result1.data[0]
														})
													);
													this.examQusDetail = result1.data[0];
													if (this.examQusDetail.Allquestions.length > 0) {
														let qus_ind = 0;
														for (const item of this.examQusDetail
															.Allquestions) {
															if (item.questions.length > 0) {
																this.examSubArray.push({
																	sub_id: item.sub_id,
																	sub_name: item.sub_name,
																	sub_qus_ind: qus_ind
																});
																for (const qus of item.questions) {
																	qus.answerStatus = '';
																	qus.answer = '';
																	qus.response = '';
																	qus.timespent = 0;
																	if (this.examQuestionStatusArray.length > 0) {
																		for (const eqs of this
																			.examQuestionStatusArray) {
																			if (eqs.evd_qus_id === qus.qus_id) {
																				qus.answerStatus = eqs.evd_status;
																				qus.answer = eqs.answer;
																				break;
																			}
																		}
																	}
																	this.questionsArray[qus_ind++] = qus;
																}
																localStorage.setItem(
																	'currentExamQus',
																	JSON.stringify({
																		eva_id: this.evalutionDetail.eva_id, 
																		es_id:this.evalutionDetail.eva_es_id,
																		login_id:this.evalutionDetail.eva_login_id,
																		eva_id_qus: this.questionsArray
																	})
																);
																localStorage.setItem(
																	'currentExamSub',
																	JSON.stringify({
																		eva_id: this.evalutionDetail.eva_id, 
																		es_id:this.evalutionDetail.eva_es_id,
																		login_id:this.evalutionDetail.eva_login_id,
																		eva_id_sub: this.examSubArray
																	})
																);
															}
														}
														this.loadCurrentQ(0);
													}
												}
											}
										});
								}
							});
						});
				}
			});
		this.qelementService
			.getScheduledExam({ es_id: this.es_id })
			.subscribe((result: any) => {
				if (result) {
					this.examDetail = result.data[0];
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
		this.qelementService.getUser(param).subscribe((result: any) => {
			if (result.data.length > 0) {
				this.userDetails = result.data[0];
				if (this.userDetails.au_profileimage) {
					this.userprofileimage = this.userDetails.au_profileimage;
				}
				this.userDetailsFlag = true;
			}
		});
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
		if (
			this.networkErrorCounter === 0 &&
			this.socketService.checkSocketConnection()
		) {
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
	sendTestEndConfirmation() {
		if (this.socketService.checkSocketConnection()) {
			if (this.currentUser) {
				console.log('this.currentUser', this.currentUser);
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
	sendTestOngoingConfirmation() {
		this.socketService.initSocket();

		this.socketService.onEvent(Event.CONNECT).subscribe(() => {
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
		});

		this.socketService.getUserTestInformation();

		this.socketService.userTestInformation.subscribe(userTestData => {
			if (userTestData['action'] === appConfig.testExtendCode) {
				this.socketExtendTime = userTestData['extTime'];
			}
			if (userTestData['action'] === appConfig.testEndCode) {
				this.studentFinalSubmit(true);
			}
		});

		this.socketService.onEvent(Event.DISCONNECT).subscribe(() => {
			console.log('Disconnected');
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
				this.notif.showSuccessErrorMessage(
					'No Internet Connection.Please contact your Teacher or System Administrator',
					'error'
				);
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
	getQusStatuSrc(answerStatus) {
		// console.log(answerStatus);
		if (answerStatus === '') {
			// Not Visited
			return '/assets/default-ques-btn.svg';
		} else if (answerStatus === '0') {
			// Marked For Review
			return '/assets/saveforreview.svg';
		} else if (answerStatus === '1') {
			// Answered
			return '/assets/main-green-btn.svg';
		} else if (answerStatus === '2') {
			// Not Answered
			return '/assets/main-orange-btn.svg';
		} else if (answerStatus === '3') {
			// Answered & Marked For Review
			return '/assets/ansmarkreview.svg';
		}
	}

	getQusFromLS(eva_id): Promise<any> {
		return new Promise(resolve => {
			if (localStorage.getItem('currentExamQus')) {
				const currentExamQus = JSON.parse(
					localStorage.getItem('currentExamQus')
				);
				if (currentExamQus.eva_id == this.evalutionDetail.eva_id && currentExamQus.es_id == this.evalutionDetail.eva_es_id && currentExamQus.login_id == this.evalutionDetail.eva_login_id) {
					if (currentExamQus.eva_id_qus) {
						resolve(currentExamQus.eva_id_qus);
					}
					resolve([]);
				}
			}
			resolve([]);
		});
	}
	getSubFromLS(eva_id): Promise<any> {
		return new Promise(resolve => {
			if (localStorage.getItem('currentExamSub')) {
				const currentExamSub = JSON.parse(
					localStorage.getItem('currentExamSub')
				);
				if (currentExamSub.eva_id == this.evalutionDetail.eva_id && currentExamSub.es_id == this.evalutionDetail.eva_es_id && currentExamSub.login_id == this.evalutionDetail.eva_login_id) {
					if (currentExamSub.eva_id_sub) {
						resolve(currentExamSub.eva_id_sub);
					}
					resolve([]);
				}
			}
			resolve([]);
		});
	}
	setQusToLS() {
		return new Promise(resolve => {
			console.log('LS --- ', this.questionsArray);
			localStorage.setItem(
				'currentExamQus',
				JSON.stringify({
					eva_id: this.evalutionDetail.eva_id, 
					es_id:this.evalutionDetail.eva_es_id,
					login_id:this.evalutionDetail.eva_login_id,
					eva_id_qus: this.questionsArray 
					})
			);
			resolve();
		});
	}
	getCurrentQusFromLS(cqai) {
		if (localStorage.getItem('currentExamQus')) {
			const currentExamQus = JSON.parse(localStorage.getItem('currentExamQus'));
			if (currentExamQus.eva_id == this.evalutionDetail.eva_id && currentExamQus.es_id == this.evalutionDetail.eva_es_id && currentExamQus.login_id == this.evalutionDetail.eva_login_id) {
				const lsquestions = currentExamQus.eva_id_qus;
				return lsquestions[cqai];
			}
		}
	}
	setCurrentQusToLS(cqai, qus) {
		if (localStorage.getItem('currentExamQus')) {
			const currentExamQus = JSON.parse(localStorage.getItem('currentExamQus'));
			if (currentExamQus.eva_id == this.evalutionDetail.eva_id && currentExamQus.es_id == this.evalutionDetail.eva_es_id && currentExamQus.login_id == this.evalutionDetail.eva_login_id) {
				const lsquestions = currentExamQus.eva_id_qus;
				this.questionsArray[cqai] = qus;
				localStorage.setItem(
					'currentExamQus',
					JSON.stringify({
						eva_id: this.evalutionDetail.eva_id, 
						es_id:this.evalutionDetail.eva_es_id,
						login_id:this.evalutionDetail.eva_login_id,
						eva_id_qus: this.questionsArray
					})
				);
			}
		}
	}

	loadCurrentQ(cqai) {
		const curenttime = new Date().getTime();
		this.previousQAIndex = this.currentQAIndex;
		this.questionsArray[this.previousQAIndex].timespent =
			this.questionsArray[this.previousQAIndex].timespent +
			(curenttime - this.stime);
		this.currentQAIndex = cqai;
		this.stime = curenttime;
		this.currentQA = this.questionsArray[this.currentQAIndex];
		// this.currentQA = this.getCurrentQusFromLS(this.currentQAIndex);
		console.log(this.questionsArray);
		this.currentQAHasEssay = false;
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
		if (this.currentQA.answerStatus === '') {
			this.currentQA.answerStatus = '2';
		}
		if (this.currentQA.answerStatus === '0') {
			this.bookMarkFlag = true;
		} else {
			this.bookMarkFlag = false;
		}
		if (this.currentQA.qus_ess_id !== '' && this.currentQA.qus_ess_id != null) {
			this.qelementService
				.getEssay({ ess_id: this.currentQA.qus_ess_id })
				.subscribe((resulte: any) => {
					if (resulte) {
						this.currentEssay = resulte.data[0];
						this.currentQAHasEssay = true;
					}
				});
		}
		if (this.currentQA.answer) {
			if (this.currentQA.answer.length > 0) {
				if (Number(this.currentQA.qus_qst_id) === 1) {
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
					// New MCQ MR
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
					// New TF
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
					// End
				} else if (Number(this.currentQA.qus_qst_id) === 4) {
					// New Match
					this.studentMtfAnswer = this.currentQA.answer;
					this.matchRowFirstValue = this.studentMtfAnswer[0].evd_qus_answer;
					this.matchRowSecondValue = this.studentMtfAnswer[1].evd_qus_answer;
					this.matchRowThirdValue = this.studentMtfAnswer[2].evd_qus_answer;
					this.matchRowFourthValue = this.studentMtfAnswer[3].evd_qus_answer;
					this.matchFlag = true;
					// End
				} else if (Number(this.currentQA.qus_qst_id) === 5) {
					// New Matrix 4 *4
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
					// End
				} else if (Number(this.currentQA.qus_qst_id) === 13) {
					// New Matrix 4 *5
					this.studentMatrix45Answer = this.currentQA.answer;
					let ctr = 0;
					for (let i = 0; i < this.studentMatrix45Answer.length / 5; i++) {
						for (let j = 0; j < this.studentMatrix45Answer.length / 4; j++) {
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
					this.studentSingleInputAnswer = this.currentQA.answer;
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
					this.studentDobleInputAnswer = this.currentQA.answer;
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
				if (Number(this.currentQA.qus_qst_id) === 1) {
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
			if (Number(this.currentQA.qus_qst_id) === 1) {
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
		this.setQusToLS();
	}

	previousQ() {
		const answer: any[] = [];
		if (Number(this.currentQA.qus_qst_id) === 1) {
			// let mcqAnswer = $("[name=mcqpanswer]:checked").map(function () { return $(this).val() }).get();
			// if (mcqAnswer.length > 0) {
			//   for (let ansi = 0; ansi < this.currentQA.options.length; ansi++) {
			//     if (ansi == mcqAnswer["0"]) {
			//       answer[ansi] = { "evd_qus_answer": "1" };
			//     }
			//     else {
			//       answer[ansi] = { "evd_qus_answer": "0" };
			//     }
			//   }
			// New MCQ
			if (this.mcqValue !== '') {
				for (let ansi = 0; ansi < this.currentQA.options.length; ansi++) {
					if (ansi === this.mcqValue) {
						answer[ansi] = { evd_qus_answer: '1' };
					} else {
						answer[ansi] = { evd_qus_answer: '0' };
					}
				}
			}
			// End
		} else if (Number(this.currentQA.qus_qst_id) === 2) {
			// let mcqmrAnswer: any[] = $("[name=mcqmrpanswer]:checked").map(function () { return $(this).val()}).get();
			// if (mcqmrAnswer.length > 0) {
			//   for (let ansi = 0; ansi < this.currentQA.options.length; ansi++) {
			//     if (mcqmrAnswer.indexOf(ansi + "") != -1) {
			//       answer[ansi] = { "evd_qus_answer": "1" };
			//     }
			//     else {
			//       answer[ansi] = { "evd_qus_answer": "0" };
			//     }
			//   }
			// }
			// New MCQ MR
			if (this.mcqmrArray.length > 0) {
				for (let ansi = 0; ansi < this.currentQA.options.length; ansi++) {
					for (const item of this.mcqmrArray) {
						if (ansi === item.value) {
							answer[ansi] = { evd_qus_answer: '1' };
							break;
						} else {
							answer[ansi] = { evd_qus_answer: '0' };
						}
					}
				}
			}
			// End
		} else if (Number(this.currentQA.qus_qst_id) === 3) {
			// let tfAnswer = $("[name=tfpanswer]:checked").map(function () { return $(this).val() }).get();
			// if (tfAnswer.length > 0) {
			//   for (let ansi = 0; ansi < this.currentQA.options.length; ansi++) {
			//     if (ansi == tfAnswer["0"]) {
			//       answer[ansi] = { "evd_qus_answer": "1" };
			//     }
			//     else {
			//       answer[ansi] = { "evd_qus_answer": "0" };
			//     }
			//   }
			// }
			// New  TF
			if (this.tfValue !== '') {
				for (let ansi = 0; ansi < this.currentQA.options.length; ansi++) {
					if (ansi === Number(this.tfValue)) {
						answer[ansi] = { evd_qus_answer: '1' };
					} else {
						answer[ansi] = { evd_qus_answer: '0' };
					}
				}
			}
			// End
		} else if (Number(this.currentQA.qus_qst_id) === 4) {
			// let matchAnswera = $("[name=matchAnswera]:checked").map(function () { return $(this).val() }).get();
			// let matchAnswerb = $("[name=matchAnswerb]:checked").map(function () { return $(this).val() }).get();
			// let matchAnswerc = $("[name=matchAnswerc]:checked").map(function () { return $(this).val() }).get();
			// let matchAnswerd = $("[name=matchAnswerd]:checked").map(function () { return $(this).val() }).get();
			// if (matchAnswera) {
			//   if (matchAnswera.length === 1) {
			//     answer[0] = { 'evd_qus_answer': matchAnswera[0] };
			//   } else {
			//     answer[0] = { 'evd_qus_answer': '' };
			//   }
			// }
			// if (matchAnswerb) {
			//   if (matchAnswerb.length === 1) {
			//     answer[1] = { 'evd_qus_answer': matchAnswerb[0] };
			//   } else {
			//     answer[1] = { 'evd_qus_answer': '' };
			//   }
			// }
			// if (matchAnswerc) {
			//   if (matchAnswerc.length === 1) {
			//     answer[2] = { 'evd_qus_answer': matchAnswerc[0] };
			//   } else {
			//     answer[2] = { 'evd_qus_answer': '' };
			//   }
			// }
			// if (matchAnswerd) {
			//   if (matchAnswerd.length === 1) {
			//     answer[3] = { 'evd_qus_answer': matchAnswerd[0] };
			//   } else {
			//     answer[3] = { 'evd_qus_answer': '' };
			//   }
			// }
			// New MTF
			if (
				this.matchRowFirstValue !== '' &&
				this.matchRowSecondValue !== '' &&
				this.matchRowThirdValue !== '' &&
				this.matchRowFourthValue !== ''
			) {
				for (let i = 0; i < this.matchArray.length; i++) {
					for (let j = 0; j < this.matchArray[i].value.length; j++) {
						if (
							this.matchArray[i].value[j] === this.matchRowFirstValue &&
							i === 0
						) {
							answer[i] = { evd_qus_answer: this.matchRowFirstValue };
							break;
						} else {
							answer[i] = { evd_qus_answer: '' };
						}
						if (
							this.matchArray[i].value[j] === this.matchRowSecondValue &&
							i === 1
						) {
							answer[i] = { evd_qus_answer: this.matchRowSecondValue };
							break;
						} else {
							answer[i] = { evd_qus_answer: '' };
						}
						if (
							this.matchArray[i].value[j] === this.matchRowThirdValue &&
							i === 2
						) {
							answer[i] = { evd_qus_answer: this.matchRowThirdValue };
							break;
						} else {
							answer[i] = { evd_qus_answer: '' };
						}
						if (
							this.matchArray[i].value[j] === this.matchRowFourthValue &&
							i === 3
						) {
							answer[i] = { evd_qus_answer: this.matchRowFourthValue };
							break;
						} else {
							answer[i] = { evd_qus_answer: '' };
						}
					}
				}
			}
			// End
		} else if (Number(this.currentQA.qus_qst_id) === 5) {
			// let matrixAnswer: any[] = $("[name=matrixAnswer]:checked").map(function () { return $(this).val()}).get();
			// if (matrixAnswer.length > 0) {
			//   for (let ansi = 0; ansi < this.currentQA.options.length * this.currentQA.options_match.length; ansi++) {
			//     if (matrixAnswer.indexOf(ansi + "") != -1) {
			//       answer[ansi] = { "evd_qus_answer": "1" };
			//     }
			//     else {
			//       answer[ansi] = { "evd_qus_answer": "0" };
			//     }
			//   }
			// }
			// New Matric Match 4 * 4
			if (this.matrixStoreArray.length > 0) {
				for (
					let ansi = 0;
					ansi < this.currentQA.options.length * this.currentQA.options.length;
					ansi++
				) {
					for (const item of this.matrixStoreArray) {
						if (Number(item.value) === ansi) {
							answer[ansi] = { evd_qus_answer: '1' };
							break;
						} else {
							answer[ansi] = { evd_qus_answer: '0' };
						}
					}
				}
			}
			// End
		} else if (Number(this.currentQA.qus_qst_id) === 13) {
			// New Matric Match 4 * 5
			if (this.matrixStore45Array.length > 0) {
				for (
					let ansi = 0;
					ansi <
					this.currentQA.options.length * this.currentQA.options_match.length;
					ansi++
				) {
					for (const item of this.matrixStore45Array) {
						if (Number(item.value) === ansi) {
							answer[ansi] = { evd_qus_answer: '1' };
							break;
						} else {
							answer[ansi] = { evd_qus_answer: '0' };
						}
					}
				}
			}
			// End
		} else if (Number(this.currentQA.qus_qst_id) === 14) {
			if (this.digitValue !== '-') {
				answer.push({ evd_qus_answer: this.digitValue });
			}
		} else if (Number(this.currentQA.qus_qst_id) === 15) {
			if (this.upperRowValue !== '-' && this.lowerRowValue !== '-') {
				answer.push({
					evd_qus_answer: this.upperRowValue + this.lowerRowValue
				});
			}
		}

		const currentAnswerStatusIndex = this.currentQAIndex;
		if (answer.length > 0) {
			let evd_status = '1';
			// if (this.reviewForm.value.reviewS == true) {
			//   evd_status = "0";
			// }
			if (this.bookMarkFlag) {
				evd_status = '0';
			}
			this.qelementService
				.studentInputAnswer({
					evd_eva_id: this.eva_id,
					evd_qus_id: this.currentQA.qus_id,
					evd_qst_id: this.currentQA.qus_qst_id,
					evd_qt_id: this.currentQA.qus_qt_id,
					answer: answer,
					evd_status: evd_status
				})
				.subscribe((result: any) => {
					if (result) {
						this.questionsArray[
							currentAnswerStatusIndex
						].answerStatus = evd_status;
					}
				});
		} else {
			if (this.bookMarkFlag) {
				const evd_status = '0';
				this.qelementService
					.studentInputAnswer({
						evd_eva_id: this.eva_id,
						evd_qus_id: this.currentQA.qus_id,
						evd_qst_id: this.currentQA.qus_qst_id,
						evd_qt_id: this.currentQA.qus_qt_id,
						evd_status: evd_status
					})
					.subscribe((result: any) => {
						if (result) {
							this.questionsArray[
								currentAnswerStatusIndex
							].answerStatus = evd_status;
						}
					});
			}
			if (!this.bookMarkFlag) {
				const evd_status = '';
				this.qelementService
					.studentInputAnswer({
						evd_eva_id: this.eva_id,
						evd_qus_id: this.currentQA.qus_id,
						evd_qst_id: this.currentQA.qus_qst_id,
						evd_qt_id: this.currentQA.qus_qt_id,
						evd_status: evd_status
					})
					.subscribe((result: any) => {
						if (result) {
							this.questionsArray[
								currentAnswerStatusIndex
							].answerStatus = evd_status;
						}
					});
			}
		}
		this.subjectiveAnswer.id = '';
		this.subjectiveInputAnswer = '';
		if (this.currentQAIndex + 1 === this.questionsArray.length) {
			this.loadCurrentQ(this.currentQAIndex);
		} else {
			this.loadCurrentQ(this.currentQAIndex - 1);
		}
	}
	nextQ() { }
	saveAndNext(bookmarks = false, save = true) {
		this.currentQA.answerStatus = '1';
		if (bookmarks) {
			this.currentQA.answerStatus = '3';
		}
		if (!save) {
			this.currentQA.answerStatus = '0';
		}
		if (!save && !bookmarks) {
			this.currentQA.answerStatus = '2';
		}
		console.log(this.currentQA, this.mcqValue);
		const answer: any[] = [];
		if (Number(this.currentQA.qus_qst_id) === 1) {
			if (this.mcqValue !== '') {
				for (let ansi = 0; ansi < this.currentQA.options.length; ansi++) {
					if (ansi === this.mcqValue) {
						answer[ansi] = { evd_qus_answer: '1' };
					} else {
						answer[ansi] = { evd_qus_answer: '0' };
					}
				}
			}
			// End
		} else if (Number(this.currentQA.qus_qst_id) === 2) {
			if (this.mcqmrArray.length > 0) {
				for (let ansi = 0; ansi < this.currentQA.options.length; ansi++) {
					for (const item of this.mcqmrArray) {
						if (ansi === item.value) {
							answer[ansi] = { evd_qus_answer: '1' };
							break;
						} else {
							answer[ansi] = { evd_qus_answer: '0' };
						}
					}
				}
			}
			// End
		} else if (Number(this.currentQA.qus_qst_id) === 3) {
			// let tfAnswer = $("[name=tfpanswer]:checked").map(function () { return $(this).val() }).get();
			// if (tfAnswer.length > 0) {
			//   for (let ansi = 0; ansi < this.currentQA.options.length; ansi++) {
			//     if (ansi == tfAnswer["0"]) {
			//       answer[ansi] = { "evd_qus_answer": "1" };
			//     }
			//     else {
			//       answer[ansi] = { "evd_qus_answer": "0" };
			//     }
			//   }
			// }
			// New  TF
			if (this.tfValue !== '') {
				for (let ansi = 0; ansi < this.currentQA.options.length; ansi++) {
					if (ansi === Number(this.tfValue)) {
						answer[ansi] = { evd_qus_answer: '1' };
					} else {
						answer[ansi] = { evd_qus_answer: '0' };
					}
				}
			}
			// End
		} else if (Number(this.currentQA.qus_qst_id) === 4) {
			// New MTF
			if (
				this.matchRowFirstValue !== '' &&
				this.matchRowSecondValue !== '' &&
				this.matchRowThirdValue !== '' &&
				this.matchRowFourthValue !== ''
			) {
				for (let i = 0; i < this.matchArray.length; i++) {
					for (let j = 0; j < this.matchArray[i].value.length; j++) {
						if (
							this.matchArray[i].value[j] === this.matchRowFirstValue &&
							i === 0
						) {
							answer[i] = { evd_qus_answer: this.matchRowFirstValue };
							break;
						} else {
							answer[i] = { evd_qus_answer: '' };
						}
						if (
							this.matchArray[i].value[j] === this.matchRowSecondValue &&
							i === 1
						) {
							answer[i] = { evd_qus_answer: this.matchRowSecondValue };
							break;
						} else {
							answer[i] = { evd_qus_answer: '' };
						}
						if (
							this.matchArray[i].value[j] === this.matchRowThirdValue &&
							i === 2
						) {
							answer[i] = { evd_qus_answer: this.matchRowThirdValue };
							break;
						} else {
							answer[i] = { evd_qus_answer: '' };
						}
						if (
							this.matchArray[i].value[j] === this.matchRowFourthValue &&
							i === 3
						) {
							answer[i] = { evd_qus_answer: this.matchRowFourthValue };
							break;
						} else {
							answer[i] = { evd_qus_answer: '' };
						}
					}
				}
			}
			// End
		} else if (Number(this.currentQA.qus_qst_id) === 5) {
			// New Matric Match 4 * 4
			if (this.matrixStoreArray.length > 0) {
				for (
					let ansi = 0;
					ansi < this.currentQA.options.length * this.currentQA.options.length;
					ansi++
				) {
					for (const item of this.matrixStoreArray) {
						if (Number(item.value) === ansi) {
							answer[ansi] = { evd_qus_answer: '1' };
							break;
						} else {
							answer[ansi] = { evd_qus_answer: '0' };
						}
					}
				}
			}
			// End
		} else if (Number(this.currentQA.qus_qst_id) === 13) {
			// New Matric Match 4 * 5
			if (this.matrixStore45Array.length > 0) {
				for (
					let ansi = 0;
					ansi <
					this.currentQA.options.length * this.currentQA.options_match.length;
					ansi++
				) {
					for (const item of this.matrixStore45Array) {
						if (Number(item.value) === ansi) {
							answer[ansi] = { evd_qus_answer: '1' };
							break;
						} else {
							answer[ansi] = { evd_qus_answer: '0' };
						}
					}
				}
			}
			// End
		} else if (Number(this.currentQA.qus_qst_id) === 14) {
			if (this.digitValue !== '-') {
				answer.push({ evd_qus_answer: this.digitValue });
			}
		} else if (Number(this.currentQA.qus_qst_id) === 15) {
			if (this.upperRowValue !== '-' && this.lowerRowValue !== '-') {
				answer.push({
					evd_qus_answer: this.upperRowValue + this.lowerRowValue
				});
			}
		}

		const currentAnswerStatusIndex = this.currentQAIndex;
		this.currentQA.answer = answer;
		if (save) {
			let evd_status = '';
			if (answer.length > 0) {
				evd_status = '1';
			} else {
				this.currentQA.answerStatus = '2';
			}
			if (navigator.onLine) {
				this.qelementService
					.studentInputAnswer({
						evd_eva_id: this.eva_id,
						evd_qus_id: this.currentQA.qus_id,
						es_id: this.es_id,
						evd_qst_id: this.currentQA.qus_qst_id,
						evd_qt_id: this.currentQA.qus_qt_id,
						answer: answer,
						evd_status: evd_status
					})
					.subscribe((result: any) => {
						if (result) {
							this.getServerTime(Number(result.data.time_left));
						} else {
							if (result === null || (result && result.status === 'error')) {
								this.addRequestToQueue('/evaluation/studentInputAnswer', {
									evd_eva_id: this.eva_id,
									evd_qus_id: this.currentQA.qus_id,
									es_id: this.es_id,
									evd_qst_id: this.currentQA.qus_qst_id,
									evd_qt_id: this.currentQA.qus_qt_id,
									answer: answer,
									evd_status: evd_status
								});
							}
						}
					});
			} else {
				this.addRequestToQueue('/evaluation/studentInputAnswer', {
					evd_eva_id: this.eva_id,
					evd_qus_id: this.currentQA.qus_id,
					es_id: this.es_id,
					evd_qst_id: this.currentQA.qus_qst_id,
					evd_qt_id: this.currentQA.qus_qt_id,
					answer: answer,
					evd_status: evd_status
				});
			}
		}
		// return this._http.post('/evaluation/studentInputAnswer', value)
		this.setQusToLS().then(() => {
			if (this.currentQAIndex + 1 === this.questionsArray.length) {
				this.loadCurrentQ(0);
			} else {
				this.loadCurrentQ(this.currentQAIndex + 1);
			}
		});
	}
	addRequestToQueue(url, data) {
		const request = new PendingRequest(url, data);
		this.queue.push(request);
		console.log('addRequestToQueue', this.queue);
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
		console.log('queue -----', this.queue);
		this.queue.shift();
		this.qelementService
			.studentInputAnswer(request.data)
			.subscribe((result: any) => {
				if (result) {
					console.log(result);
				} else {
					if (result === null || (result && result.status === 'error')) {
						this.addRequestToQueue(request.url, request.data);
					}
				}
			});
	}
	clearResponse() {
		/* const answer: any[] = [];
    answer.push(null);
    this.qelementService.studentClearResponse({ evd_eva_id: this.eva_id, evd_qus_id: this.currentQA.qus_id }).subscribe(
      (result: any) => {
        if (result) {
          this.loadCurrentQ(this.currentQAIndex);
          // this.questionsArray[this.currentQAIndex].answerStatus = '';
        }
      }
    ); */
		this.currentQA.answer = '';
		this.currentQA.answerStatus = '2';
		this.studentSingleFlag = false;
		this.upperRowFlag = false;
		this.lowerRowFlag = false;
		this.studentMcqFlag = false;
		this.studentMcqMrFlag = false;
		this.tfFlag = false;
		this.matchFlag = false;
		this.matrixMatchFlag = false;
		this.matrixMatch45Flag = false;
		this.loadCurrentQ(this.currentQAIndex);
	}
	getServerTime(time: number) {
		// Find the distance between now an the count down date
		// Time calculations for days, hours, minutes and second
		this.timeLeft = time * 1000;
	}
	timer() {
		// Set the date we"re counting down to
		const this_ = this;
		// Find the distance between now an the count down date
		this.timeLeft = Number(this.evalutionDetail.time_left) * 1000;

		// Update the count down every 1 second
		const x = setInterval(() => {
			// Update the count down every 1 second
			if (this.socketExtendTime > 0) {
				this.timeLeft += this.socketExtendTime * 60000;
				this.socketExtendTime = 0;
			}
			// Time calculations for days, hours, minutes and seconds
			const hours = Math.floor(
				(this.timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			let minutes = Math.floor(
				(this.timeLeft % (1000 * 60 * 60)) / (1000 * 60)
			);
			const seconds = Math.floor((this.timeLeft % (1000 * 60)) / 1000);
			if (
				this_.ongoingDiv === true &&
				hours === 0 &&
				minutes === 5 &&
				seconds === 0
			) {
				alert('5 Minutes Remaining');
			}
			// Display the result in the element with id="demo"
			if (this.examDetail.es_clock_format === 0) {
				this.timers = hours + 'h' + minutes + 'm ' + seconds + 's ';
			} else {
				minutes = hours * 60 + minutes;
				this.timers = +minutes + 'm' + seconds + 's';
			}
			// If the count down is finished, write some text
			if (this.timeLeft <= 0) {
				clearInterval(x);
				// this_.studentFinalSubmit();
				this.timers = 'EXPIRED';
			}
			this.timeLeft = this.timeLeft - 3600 / 4;
		}, 1000);
	}

	testSummary() {
		this.questionsArray[this.currentQAIndex].timespent =
			this.questionsArray[this.currentQAIndex].timespent +
			(new Date().getTime() - this.stime);

		if (this.queue.length > 0) {
			this.queue.forEach(element => {
				this.execute(element);
			});
		}
		this.ongoingDiv = false;
		this.finalConfirmationDiv = false;
		this.testSummaryDiv = true;
	}

	reviewCurrentQ() {
		this.testSummaryDiv = false;
		this.finalConfirmationDiv = false;
		this.ongoingDiv = true;
	}
	finalConfirmaiton() {
		this.ongoingDiv = false;
		this.testSummaryDiv = false;
		this.finalConfirmationDiv = true;
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
		this.getQusFromLS(this.eva_id).then(questions => {
			console.log('studentFinalSubmit', questions);
			if (this.examDetail.es_exam_type === '2') {
				this.qelementService
					.studentFinalSubmit({
						eva_id: this.eva_id,
						eva_status: eva_status,
						es_exam_type: this.examDetail.es_exam_type,
						es_id: this.es_id,
						allresponses: questions
					})
					.subscribe((result: any) => {
						if (result) {
							localStorage.removeItem('currentExamQus');
							localStorage.removeItem('currentExamSub');
							localStorage.removeItem('currentExam');
							this.sendTestEndConfirmation();
							// this.router.navigate(['../../test-confirmation', this.es_id], {
							// 	relativeTo: this.route
							// });
							close();

						}
					});
			} else {
				this.qelementService
					.studentFinalSubmit({
						eva_id: this.eva_id,
						eva_status: eva_status,
						es_exam_type: this.examDetail.es_exam_type,
						allresponses: questions
					})
					.subscribe((result: any) => {
						if (result) {
							localStorage.removeItem('currentExamQus');
							localStorage.removeItem('currentExamSub');
							localStorage.removeItem('currentExam');
							this.sendTestEndConfirmation();
							if (endByTeacher) {
								this.router.navigate(['../../test-summary', this.es_id], {
									relativeTo: this.route
								});
							} else {
								this.router.navigate(['../../test-confirmation', this.es_id], {
									relativeTo: this.route
								});
							}
						}
					});
			}
		});
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
		console.log(this.mcqValue);
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
	changeOptionsMcqMr($event) {
		const findex = this.mcqmrArray.findIndex(
			f => f.value === $event.source.value
		);
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
	getMatrixChange($event, index) {
		const findex = this.matrixStoreArray.findIndex(
			f => f.id === index && Number(f.value) === Number($event.source.value)
		);
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
				if (this.matrixStoreArray[j].id > this.matrixStoreArray[j + 1].id) {
					const temp = this.matrixStoreArray[j];
					this.matrixStoreArray[j] = this.matrixStoreArray[j + 1];
					this.matrixStoreArray[j + 1] = temp;
				}
			}
		}
	}

	getMatrix45Change($event, index) {
		const findex = this.matrixStore45Array.findIndex(
			f => f.id === index && Number(f.value) === Number($event.source.value)
		);
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
				if (this.matrixStore45Array[j].id > this.matrixStore45Array[j + 1].id) {
					const temp = this.matrixStore45Array[j];
					this.matrixStore45Array[j] = this.matrixStore45Array[j + 1];
					this.matrixStore45Array[j + 1] = temp;
				}
			}
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

	// Bookmark  New Functionality
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

	midButtonClick() {
		const x = document.getElementById('right-ques-container');
		if (x.style.display === 'block') {
			x.style.display = 'none';
			document
				.getElementById('left-ques-container')
				.setAttribute('class', 'custom-mid-col-8');
			document
				.getElementById('midnavbutton')
				.setAttribute('class', 'midnavbtn');
			document
				.getElementById('midnavarrowbtn')
				.setAttribute('class', 'fa-chevron-left');
			document.getElementById('midnavarrowbtn').classList.add('fas');
		} else {
			x.style.display = 'block';
			document
				.getElementById('left-ques-container')
				.setAttribute('class', 'custom-mid-left-ques-container-jee-mains');
			document
				.getElementById('right-ques-container')
				.setAttribute('class', 'custom-mid-right-ques-container-jee-mains');
			document
				.getElementById('midnavbutton')
				.setAttribute('class', 'mid-nav-button-jee-mains');
			document
				.getElementById('midnavarrowbtn')
				.setAttribute('class', 'fa-chevron-right');
			document.getElementById('midnavarrowbtn').classList.add('fas');
		}
	}
	// End
}

@Component({
	selector: 'question-no-modal',
	templateUrl: 'question-no-modal.html',
})
export class QuestionNoModalComponent implements OnInit {
	@Output() loadQus = new EventEmitter();
	examSubArray: any[] = [];
	questionsArray: any[] = [];
	constructor(
		@Inject(MAT_DIALOG_DATA) public data,
		public dialogRef: MatDialogRef<QuestionNoModalComponent>
	) { }
	ngOnInit() {
		console.log(this.data);
		this.getQusFromLS(this.data.eva_id).then(questions => {
			this.questionsArray = questions;

			if (this.questionsArray.length > 0) {
				// console.log('from local storage', this.questionsArray);
				this.getSubFromLS(this.data.eva_id).then(item => {
					this.examSubArray = item;
				});
			}
		});
	}
	getSubFromLS(eva_id): Promise<any> {
		return new Promise(resolve => {
			if (localStorage.getItem('currentExamSub')) {
				const currentExamSub = JSON.parse(localStorage.getItem('currentExamSub'));
				if (currentExamSub.eva_id == this.data.eva_id && currentExamSub.es_id == this.data.eva_es_id && currentExamSub.login_id == this.data.eva_login_id) {
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
				if (currentExamQus.eva_id == this.data.eva_id && currentExamQus.es_id == this.data.eva_es_id && currentExamQus.login_id == this.data.eva_login_id) {
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
	getQusStatuSrc(answerStatus) {
		// console.log(answerStatus);
		if (answerStatus === '') {
			// Not Visited
			return '/assets/default-ques-btn.svg';
		} else if (answerStatus === '0') {
			// Marked For Review
			return '/assets/saveforreview.svg';
		} else if (answerStatus === '1') {
			// Answered
			return '/assets/main-green-btn.svg';
		} else if (answerStatus === '2') {
			// Not Answered
			return '/assets/main-orange-btn.svg';
		} else if (answerStatus === '3') {
			// Answered & Marked For Review
			return '/assets/ansmarkreview.svg';
		}
	}
}

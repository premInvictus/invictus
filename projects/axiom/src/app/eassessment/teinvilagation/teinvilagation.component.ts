import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QelementService } from '../../questionbank/service/qelement.service';
import { NotificationService, SocketService } from '../../_services/index';
import { appConfig } from '../../app.config';
import { Event } from '../../_models/event';

@Component({
	selector: 'app-teinvilagation',
	templateUrl: './teinvilagation.component.html',
	styleUrls: ['./teinvilagation.component.css']
})
export class TeinvilagationComponent implements OnInit {

	es_id: number;
	examDetail: any = {};
	presentSArray: any[] = [];
	questionIdArray: any[] = [];
	questionsArray: any[] = [];
	onlyObjectiveFlag = true;
	eva_status;
	extendCounter = 0;

	classDetails: any[];
	studentArray: any[] = [];
	absentArray: any[] = [];
	absentArrayFinal: any[] = [];
	disableAttendanceButton = false;
	// jquery dependancy exist so currently commented
	// bodyClasses = 'layout-full page-invigilation';
	connectedUserData: any;
	currentUser: any;
	showAbsentStudent = false;
	socketExtendTime = 0;
	es_clock_format: any;
	hideme: any = {};
	liveCount = [];

	ngOnInit() {
		this.es_id = this.route.snapshot.params['id'];
		this.socketService.initSocket();
		this.getExamAttendance();
		this.getScheduledExam();
		this.sendUserInformation();
		// jquery dependancy exist so currently commented
		// $('body').addClass(this.bodyClasses);

		if (localStorage.getItem('currentUser')) {
			this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		}

		this.socketService.getUserTestInformation();

		this.socketService.userTestInformation.subscribe((userTestData) => {
			if (userTestData) {
				this.setStudentCurrentAction(userTestData);
			}
		});
	}

	constructor(
		private route: ActivatedRoute,
		private qelementService: QelementService,
		private notif: NotificationService,
		private socketService: SocketService
	) { }

	checkExtendedSession() {
		if (this.extendCounter >= 2) {
			return false;
		} else {
			return true;
		}
	}

	setStudentCurrentAction(userTestData) {
		if (this.presentSArray.length > 0) {
			for (let i = 0; i < this.presentSArray.length; i++) {
				if ((userTestData && this.presentSArray)
					&& (Number(this.presentSArray[i]['eva_login_id']) === Number(userTestData['userId']))) {
					if (!(this.presentSArray[i]['studentCurrentActivity'] === 'T103')) {
						this.presentSArray[i]['studentCurrentActivity'] = userTestData['action'];
					}
					if (userTestData && userTestData['networkErrorCount']) {
						this.presentSArray[i]['networkErrorCount'] = userTestData['networkErrorCount'];
					}
					if (userTestData && userTestData['suspiciousCount']) {
						this.presentSArray[i]['suspiciousCount'] = userTestData['suspiciousCount'];
					}
					if (userTestData && userTestData['action'] === 'T102' && !(this.liveCount.includes(userTestData['userId']))) {
						this.liveCount.push(userTestData['userId']);
						console.log('in push', this.liveCount);
					}
					if (userTestData && userTestData['action'] === 'T104' && this.liveCount.length > 0) {
						const cindex = this.liveCount.indexOf(userTestData['userId']);
						console.log('before pop', this.liveCount, userTestData['userId'], cindex);
						if (cindex !== -1) {
							this.liveCount.splice(cindex, 1);
							console.log('after pop', this.liveCount, userTestData['userId'], cindex);
						}
					}
				}
			}
		}
	}



	getScheduledExam() {
		this.studentArray = [];
		this.absentArray = [];
		this.absentArrayFinal = [];
		this.qelementService.getScheduledExam({ es_id: this.es_id }).subscribe(
			(result: any) => {
				if (result && result.data && result.data.length > 0) {
					this.examDetail = result.data[0];
					this.qelementService.getUser({
						class_id: this.examDetail.es_class_id,
						sec_id: this.examDetail.es_sec_id,
						role_id: '4',
						status: '1'
					}).subscribe(
						(result1: any) => {

							if (result1 && result1.status === 'ok') {
								this.studentArray = result1.data;
								const flag = 0;
								for (const item of this.presentSArray) {
									let findex = 0;
									for (const item2 of this.studentArray) {
										if (Number(item.eva_login_id) === Number(item2.au_login_id)) {
											this.studentArray.splice(findex, 1);
											break;
										} else {
											findex++;
										}
									}
								}
								this.absentArray = this.studentArray;
								for (const item of this.absentArray) {
									this.absentArrayFinal.push({
										eva_es_id: this.route.snapshot.params['id'],
										eva_login_id: item.au_login_id,
										eva_ip_address: item.au_last_login_ip
									});
								}
							}
						}
					);
					this.classDetails = this.examDetail;
					this.qelementService.getQuestionPaper({ qp_id: this.examDetail.es_qp_id, qp_status: 1 }).subscribe(
						(res: any) => {
							if (res) {
								for (const qitem of res.data[0].qlist) {
									this.questionIdArray.push(qitem.qpq_qus_id);
								}
								this.qelementService.getQuestionsInTemplate({ qus_id: this.questionIdArray, exam_flag: '1' }).subscribe(
									(response: any) => {
										if (response) {
											this.questionsArray = response.data;
											for (const qus of this.questionsArray) {
												if (qus.qus_qst_id > 5 && qus.qus_qst_id < 13) {
													this.onlyObjectiveFlag = false;
													break;
												}
											}
											// If all questions belong to objective, set eva_status=2
											if (this.onlyObjectiveFlag === true) {
												this.eva_status = '2';
											} else {
												this.eva_status = '1';
											}
										}
									}
								);
							}
						}
					);
					this.timer();
					if (Number(this.examDetail.es_grace_time_extend) === 1) {
						this.checkGracePeriod();
					} else {
						this.disableAttendanceButton = true;
					}
				}
			}
		);
	}

	sendUserInformation() {
		console.log('in send user information');
		this.socketService.onEvent(Event.CONNECT)
			.subscribe(() => {
				console.log('send user information');
				if (this.currentUser) {
					console.log('in current user');
					const userDetail = {
						examId: this.es_id,
						userId: this.currentUser.login_id,
						paperId: this.examDetail.es_qp_id,
						schoolId: this.currentUser.Prefix,
						userType: this.currentUser.role_id
					};
					this.socketService.sendUserInformation(userDetail);
					console.log('Connected');
				}
			}
			);

		this.socketService.onEvent(Event.DISCONNECT)
			.subscribe(() => {
				console.log('Disconnected');
			});
	}

	getExamAttendance() {
		this.presentSArray = [];
		this.qelementService.getExamAttendance({ es_id: this.es_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.presentSArray = result.data;
				}
			}
		);
	}
	addNewStudentAttendance(value) {
		const findex = this.absentArrayFinal.findIndex((f) => f.eva_login_id === value);
		if (findex !== -1) {
			this.qelementService.addExamAttendance([this.absentArrayFinal[findex]]).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('Attendence marked successfully', 'success');
						this.getExamAttendance();
						this.getScheduledExam();
					}
				});
		}
	}

	extendSession() {
		if (localStorage.getItem('currentUser')) {
			const currentUser = JSON.parse(localStorage.getItem('currentUser'));

			const userDetail = {
				userId: currentUser.login_id,
				paperId: this.examDetail.es_qp_id,
				schoolId: currentUser.Prefix,
				action: appConfig.testExtendCode,
				examId: this.examDetail.es_id,
				userType: this.currentUser.role_id
			};
			this.socketService.extendSession(userDetail);
		}
		this.applyExtendSession();
	}

	applyExtendSession() {
		this.qelementService.extendSession(this.es_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.extendCounter++;
					this.notif.showSuccessErrorMessage('Session extended for 5 minutes', 'success');
					this.socketExtendTime = 300000;
				}
			},
		);
	}

	endSession() {
		if (confirm('Do you really wish to end the test') === true) {
			this.qelementService.teacherEndSession({ es_id: this.es_id, eva_status: this.eva_status }).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						close();
					}
				}
			);
			if (localStorage.getItem('currentUser')) {
				const currentUser = JSON.parse(localStorage.getItem('currentUser'));
				const userDetail = {
					userId: currentUser.login_id,
					paperId: this.examDetail.es_qp_id,
					schoolId: currentUser.Prefix,
					action: appConfig.testEndCode,
					examId: this.examDetail.es_id,
					userType: this.currentUser.role_id
				};
				this.socketService.endSession(userDetail);
			}
		}
	}
	timer() {
		// Set the date we"re counting down to
		const this_ = this;
		const clockFormat = this.examDetail.es_clock_format;
		const onDay = this.examDetail.es_start_date;
		const onTime = this.examDetail.es_end_time;
		let countDownDate = new Date(onDay + ' ' + onTime).getTime();
		if (this.examDetail.es_exam_type === '2') {
			const examtime = Number(this.examDetail.tp_time_alloted);
			const examdatetime = new Date().getTime();
			countDownDate = examdatetime + examtime * 60000;
		}
		// Update the count down every 1 second
		const x = setInterval(() => {
			if (this.socketExtendTime > 0) {
				countDownDate += this.socketExtendTime;
				this.socketExtendTime = 0;
			}
			const now = new Date().getTime();  // Get todays date and time
			const distance = countDownDate - now; // Find the distance between now an the count down date

			// Time calculations for days, hours, minutes and seconds
			const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);
			if (hours === 0 && minutes === 5 && seconds === 0) {
				alert('5 Minutes Remaining');
			}
			// Display the result in the element with id="demo"
			if (this.examDetail.es_clock_format === 0) {
				document.getElementById('examtimer').innerHTML = hours + 'h :' + minutes + 'm :' + seconds + 's ';
			} else {
				minutes = hours * 60 + minutes;
				document.getElementById('examtimer').innerHTML = + minutes + 'm :' + seconds + 's';
			}
			// If the count down is finished, write some text
			if (distance < 0) {
				clearInterval(x);
				document.getElementById('examtimer').innerHTML = 'EXPIRED';
			}
		}, 1000);
	}
	checkGracePeriod() {
		let flag = 0;
		let onEndDay = this.examDetail.es_start_date;
		if (this.examDetail.es_exam_type === '2') {
			onEndDay = this.examDetail.es_end_date;
		}
		const onEndTime = this.examDetail.es_end_time;
		const onEndDate = new Date(onEndDay + ' ' + onEndTime).getTime();
		const onStartDay = this.examDetail.es_start_date;
		const onStartTime = this.examDetail.es_start_time;
		const graceTime = this.examDetail.es_grace_extended_time;
		const totalTime = this.addTimes(onStartTime, graceTime);
		const onStartDate = new Date(onStartDay + ' ' + totalTime).getTime();
		const x = setInterval(() => {
			const now = new Date().getTime();
			// Find the difference between now an the count down date
			const difference1 = onStartDate - now;
			const difference2 = onEndDate - now;
			if (difference1 <= 0 && difference2 > 0) {
				this.disableAttendanceButton = true;
				flag = 1;
				this.qelementService.publishUnpublishScheduledExam({ es_id: this.es_id, es_status: '1' }).subscribe(
					(result1: any) => {
						if (result1 && result1.status === 'ok') {
						}
					}
				);
				clearInterval(x);
				if (flag === 1) {
					this.notif.showSuccessErrorMessage('Grace Over', 'error');
				}
			}
		}, 1000);

	}
	addTimes(startTime, endTime) {
		const times = [0, 0, 0];
		const max = times.length;

		const a = (startTime || '').split(':');
		const b = (endTime || '').split(':');

		// normalize time values
		for (let i = 0; i < max; i++) {
			a[i] = isNaN(parseInt(a[i], 10)) ? 0 : parseInt(a[i], 10);
			b[i] = isNaN(parseInt(b[i], 10)) ? 0 : parseInt(b[i], 10);
		}

		// store time values
		for (let i = 0; i < max; i++) {
			times[i] = a[i] + b[i];
		}

		let hours = times[0];
		let minutes = times[1];
		let seconds = times[2];

		if (seconds >= 60) {
			// tslint:disable-next-line:no-bitwise
			const m = (seconds / 60) << 0;
			minutes += m;
			seconds -= 60 * m;
		}

		if (minutes >= 60) {
			// tslint:disable-next-line:no-bitwise
			const h = (minutes / 60) << 0;
			hours += h;
			minutes -= 60 * h;
		}

		return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
	}

	showErrorInfo(i) {

	}
}


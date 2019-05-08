import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from './../../_models/event';
import {
	FormGroup,
	FormBuilder,
	FormControl,
	Validators
} from '@angular/forms';
import { QelementService } from '../../questionbank/service/qelement.service';
import { appConfig } from '../../app.config';
import { NotificationService, SocketService } from '../../_services/index';

@Component({
	selector: 'app-jee-mains-instruction',
	templateUrl: './jee-mains-instruction.component.html',
	styleUrls: ['./jee-mains-instruction.component.css']
})
export class JeeMainsInstructionComponent implements OnInit {
	es_id: number;
	eva_id: number;
	attendanceFlag = false;
	examDetail: any = {};
	examDetailTemp: any;
	evalutionDetail: any;
	startTestFlag = true;
	instruction_form: FormGroup;
	private xInterval;
	ins_read = false;
	currentUser: any = {};
	schoolinfoArray: any = {};
	hosturl = appConfig.apiUrl;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private qelementService: QelementService,
		private fb: FormBuilder,
		private notif: NotificationService,
		private socketService: SocketService
	) { }

	ngOnInit() {
		this.es_id = this.route.snapshot.params['id'];
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.buildForm();
		this.getSchool();
		this.markAttandance();
	}

	buildForm() {
		this.instruction_form = this.fb.group({
			ins_read: false
		});
	}

	insRead() {
		const this_ = this;
		this.ins_read = !this.ins_read;
		if (this.ins_read === true) {
			this.xInterval = setInterval(() => {
				this_.checkExamStatus();
			}, 4000);
		}
	}
	markAttandance() {
		this.qelementService
			.getScheduledExam({ es_id: this.es_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.examDetailTemp = result.data[0];
					this.socketService.initSocket();

					this.socketService.onEvent(Event.CONNECT)
						.subscribe(() => {
							if (this.currentUser) {
								const userDetail = {
									examId: this.examDetailTemp.es_id,
									userId: this.currentUser.login_id,
									paperId: this.examDetailTemp.es_qp_id,
									schoolId: this.currentUser.Prefix,
									userType: this.currentUser.role_id
								};
								this.socketService.sendUserInformation(userDetail);
								userDetail['action'] = appConfig.testInitiateCode;
								this.socketService.sendUserTestActionDetail(userDetail);
							}
						}
						);
					this.socketService.onEvent(Event.DISCONNECT)
						.subscribe(() => {
						});
					if (Number(this.examDetailTemp.es_exam_type) === 2) {
						this.attendanceFlag = true;
					}
				}
			});
	}

	getSchool() {
		this.qelementService.getSchool().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.schoolinfoArray = result.data[0];
			}
		});
	}

	/* checkExamStatus() {
		if (this.attendanceFlag === false) {
			this.qelementService
				.getExamAttendance({
					es_id: this.es_id,
					login_id: this.currentUser.login_id
				})
				.subscribe((result: any) => {
					if (result && result.status === 'ok') {
						if (result.data[0]) {
							this.attendanceFlag = true;
						}
					}
				});
		}
		if (this.attendanceFlag === true) {
			this.qelementService
				.getScheduledExam({ es_id: this.es_id })
				.subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.examDetail = result.data[0];
						console.log('this.examDetail', this.examDetail);
						if (this.examDetail.is_test_start && Number(this.examDetail.es_grace_time_extend) !== 1) {
							if (Number(this.examDetail.es_status) === 1) {
								this.qelementService
									.getExamAttendance({
										es_id: this.es_id,
										login_id: this.currentUser.login_id
									})
									.subscribe((result1: any) => {
										if (result1.status === 'ok') {
											this.evalutionDetail = result1.data[0];
											const timeLeft =
												Number(this.evalutionDetail.time_left) * 1000;
											if (timeLeft > 0) {
												this.startTestFlag = false;
												clearInterval(this.xInterval);
											} else {
												this.startTestFlag = true;
											}
										}
									});
							} else {
								this.startTestFlag = true;
							}
						} else if (this.examDetail.is_test_start && Number(this.examDetail.es_grace_time_extend) === 1) {
							if (Number(this.examDetail.es_status) === 0) {
								this.qelementService
									.getExamAttendance({
										es_id: this.es_id,
										login_id: this.currentUser.login_id
									})
									.subscribe((result1: any) => {
										if (result1.status === 'ok') {
											this.evalutionDetail = result1.data[0];
											const timeLeft =
												Number(this.evalutionDetail.time_left) * 1000;
											if (timeLeft > 0) {
												this.startTestFlag = false;
												clearInterval(this.xInterval);
											} else {
												this.startTestFlag = true;
											}
										}
									});
							} else {
								this.startTestFlag = true;
							}
						}
					}
				});
		}
	} */

	// implementation of home type with addexamattendance on start button
	checkExamStatus() {
		if (this.attendanceFlag === false) {
			this.qelementService
				.getExamAttendance({
					es_id: this.es_id,
					login_id: this.currentUser.login_id
				})
				.subscribe((result: any) => {
					if (result && result.status === 'ok') {
						if (result.data[0]) {
							this.attendanceFlag = true;
						}
					}
				});
		}
		if (this.attendanceFlag === true) {
			this.qelementService
				.getScheduledExam({ es_id: this.es_id })
				.subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.examDetail = result.data[0];
						console.log('this.examDetail', this.examDetail);
						if (this.examDetail.is_test_start && Number(this.examDetail.es_grace_time_extend) !== 1) {
							if (Number(this.examDetail.es_status) === 1 && Number(this.examDetail.es_exam_type) !== 2) {
								this.qelementService
									.getExamAttendance({
										es_id: this.es_id,
										login_id: this.currentUser.login_id
									})
									.subscribe((result1: any) => {
										if (result1 && result1.status === 'ok') {
											this.evalutionDetail = result1.data[0];
											const timeLeft =
												Number(this.evalutionDetail.time_left) * 1000;
											if (timeLeft > 0) {
												this.startTestFlag = false;
												clearInterval(this.xInterval);
											} else {
												this.startTestFlag = true;
											}
										}
									});
							} else {
								this.startTestFlag = false;
								clearInterval(this.xInterval);
							}
						} else if (this.examDetail.is_test_start && Number(this.examDetail.es_grace_time_extend) === 1) {
							if (Number(this.examDetail.es_status) === 0) {
								this.qelementService
									.getExamAttendance({
										es_id: this.es_id,
										login_id: this.currentUser.login_id
									})
									.subscribe((result1: any) => {
										if (result1.status === 'ok') {
											this.evalutionDetail = result1.data[0];
											const timeLeft =
												Number(this.evalutionDetail.time_left) * 1000;
											if (timeLeft > 0) {
												this.startTestFlag = false;
												clearInterval(this.xInterval);
											} else {
												this.startTestFlag = true;
											}
										}
									});
							} else {
								this.startTestFlag = true;
							}
						}
					}
				});
		}
	}
	addTimes(startTime, endTime) {
		const times = [0, 0, 0];
		const max = times.length;

		const a = (startTime || '').split(':');
		const b = (endTime || '').split(':');

		// normalize time values
		for (let i = 0; i < max; i++) {
			// tslint:disable-next-line:radix
			a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i]);
			// tslint:disable-next-line:radix
			b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i]);
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

		return (
			('0' + hours).slice(-2) +
			':' +
			('0' + minutes).slice(-2) +
			':' +
			('0' + seconds).slice(-2)
		);
	}

	startTest() {
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
				userDetail['action'] = appConfig.testStartCode;
				this.socketService.sendUserTestActionDetail(userDetail);
			}
		}
		if (this.examDetail.es_exam_type === '2') {
			const presentS: any = {};
			const presentSArray = [];
			presentS.eva_es_id = this.es_id;
			presentS.eva_login_id = this.currentUser.login_id;
			presentSArray.push(presentS);
			this.qelementService.addExamAttendance(presentSArray).subscribe(
				(result1: any) => {
					if (result1 && result1.status === 'ok') {
						const timeLeft = Number(result1.time_left) * 1000;
						if (timeLeft > 0) {
							this.router.navigate(['../../jee-mains', this.es_id], { relativeTo: this.route });
						} else {
							this.notif.showSuccessErrorMessage('Already Submitted', 'error');
						}
					} else {
						this.notif.showSuccessErrorMessage(result1.data, 'error');
					}
				});

		} else {
			this.router.navigate(['../../jee-mains', this.es_id], { relativeTo: this.route });
		}
	}
}

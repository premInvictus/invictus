import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { appConfig } from 'projects/axiom/src/app/app.config';
import { NotificationService, SocketService, CommonAPIService } from 'projects/axiom/src/app/_services/index';
import { Event } from 'projects/axiom/src/app/_models/event';

@Component({
	selector: 'app-student-instruction-screen',
	templateUrl: './student-instruction-screen.component.html',
	styleUrls: ['./student-instruction-screen.component.css']
})
export class StudentInstructionScreenComponent implements OnInit {

	es_id: number;
	eva_id: number;
	attendanceFlag = false;
	examDetail: any = {};
	examDetailTemp: any;
	startTestFlag = true;
	instruction_form: FormGroup;
	private xInterval;
	ins_read = false;
	currentUser: any = {};
	schoolinfoArray: any = {};
	evalutionDetail: any;
	hosturl = appConfig.apiUrl;
	verifyAdmitCodeStatus = false;
	@ViewChild('admitCodeModalRef') admitCodeModalRef;
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private qelementService: QelementService,
		private fb: FormBuilder,
		private notif: NotificationService,
		private socketService: SocketService,
		public commonAPIService: CommonAPIService
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
		this.qelementService.getScheduledExam({ es_id: this.es_id }).subscribe(
			(result: any) => {
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
		this.qelementService.getSchool().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.schoolinfoArray = result.data[0];
				}
			}
		);
	}
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
						// if (localStorage.getItem('currentExamQus')) {
						// 	const currentExamQus = JSON.parse(localStorage.getItem('currentExamQus'));
						// 	if (currentExamQus.es_id == this.examDetail.es_id && currentExamQus.login_id == this.currentUser.login_id) {
								
						// 	} else {
						// 		console.log('remove localstorage currentExamQus');
						// 		localStorage.removeItem('currentExamQus');
						// 		localStorage.removeItem('currentExamSub');
						// 		localStorage.removeItem('currentExam');
						// 	}
						// }
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
								console.log(' else  asdfa')
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

	startTest() {
		
		if (this.examDetail.es_admit_code === '1') {
			this.verifyAdmitCodeStatus = true;
		} else {
			this.verifyAdmitCodeStatus = false;
		}
		if (!this.verifyAdmitCodeStatus) {
			this.conductExam();
		} else {
			this.admitCodeModalRef.openAdmitCodeConfirmationModal({login_id:this.currentUser.login_id, admitCode:''});
			
		}

		
	}

	conductExam() {
		if (this.socketService.checkSocketConnection()) {
			if (this.currentUser) {
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
							this.router.navigate(['../../ongoing-test', this.es_id], { relativeTo: this.route });
						} else {
							this.notif.showSuccessErrorMessage('Already Submitted', 'error');
						}
					} else {
						this.notif.showSuccessErrorMessage(result1.data, 'error');
					}
				});

		} else {
			this.router.navigate(['../../ongoing-test', this.es_id], { relativeTo: this.route });
		}
	}

	verifyAdmitCode(data) {
		console.log('data--', data);
		this.commonAPIService.getAdmmitCodeVerification(data).subscribe((result:any)=>{
			if(result && result.status === 'ok') {
				this.verifyAdmitCodeStatus = false;
				this.conductExam(); 
				
			} else {
				this.verifyAdmitCodeStatus = true;
				this.notif.showSuccessErrorMessage('Invalid Admit Code, Please Choose Another One', 'error');
			}
		})
	}

	
}

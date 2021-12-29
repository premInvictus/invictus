import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, ExamService, HumanResourceService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';
import { DatePipe } from '@angular/common';


@Component({
	selector: 'app-mark-attendance',
	templateUrl: './mark-attendance.component.html',
	styleUrls: ['./mark-attendance.component.css']
})
export class MarkAttendanceComponent implements OnInit {
	@ViewChild('deleteModal') deleteModal;
	submitFlag = false;
	defaultFlag = false;
	finalDivFlag = true;
	disableApiCall = false;
	entry_date = new Date()
	firstForm: FormGroup;
	attendanceForm: FormGroup;
	classArray: any[] = [];
	sectionArray: any[] = [];
	studentArray: any[] = [];
	eventArray: any[] = [];
	currentUser: any;
	session: any;
	formgroupArray: any[] = [];
	finalArray: any[] = [];
	studentAttendanceArray: any[] = [];
	presentFlag: any[] = [];
	absentFlag: any[] = [];
	totalStudent = 0;
	presentStudent = 0;
	absentStudent = 0;
	defaultsrc: any;
	settings: any[] = [];
	attendanceTheme = '1';
	attendanceArray: any[] = [
		{ aid: 0, a_name: 'Absent' },
		{ aid: 1, a_name: 'Present' },
	];
	requiredAll = true;
	selectedUserArr: any;
	scheduleMessageData: any[] = [];
	constructor(
		public dialog: MatDialog,
		private fbuild: FormBuilder,
		private smartService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
		public examService: ExamService,
		public humanResourceService: HumanResourceService
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
		//this.getGlobalSetting();
		this.buildForm();
		this.getClass();
	}

	buildForm() {
		this.firstForm = this.fbuild.group({
			syl_class_id: '',
			syl_section_id: '',
			syl_event: '',
			cw_entry_date: this.entry_date
		});
		this.attendanceForm = this.fbuild.group({
			attendance: ''
		});
	}

	// getGlobalSetting() {
	// 	let param: any = {};
	// 	param.gs_name = ['school_attendance_theme'];
	// 	this.examService.getGlobalSetting(param).subscribe((result: any) => {
	// 		if (result && result.status === 'ok') {
	// 			this.settings = result.data;
	// 			this.settings.forEach(element => {
	// 				if (element.gs_alias === 'school_attendance_theme') {
	// 					this.attendanceTheme = element.gs_value;
	// 				}
	// 			});
	// 		}
	// 	})
	// }

	resetdata() {
		this.formgroupArray = [];
		this.studentAttendanceArray = [];
		this.studentArray = [];
		this.finalArray = [];
		this.defaultFlag = false;
		this.submitFlag = false;
		this.finalDivFlag = true;
		this.attendanceForm.patchValue({
			'attendance': ''
		});
	}
	resetForm() {
		this.formgroupArray = [];
		this.studentAttendanceArray = [];
		this.studentArray = [];
		this.finalArray = [];
		this.defaultFlag = false;
		this.finalDivFlag = true;
		this.submitFlag = false;
		this.firstForm.patchValue({
			'syl_class_id': '',
			'syl_section_id': '',
			'syl_event': ''
		});
		this.attendanceForm.patchValue({
			'attendance': ''
		});
	}
	//  Get Class List function
	getClass() {
		this.sectionArray = [];
		const classParam: any = {};
		classParam.role_id = this.currentUser.role_id;
		classParam.login_id = this.currentUser.login_id;
		this.smartService.getClassData(classParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.classArray = result.data;
					}
				}
			);
	}
	getAttendanceEvent() {
		this.eventArray = [];
		this.resetdata();
		this.firstForm.patchValue({
			'syl_event': ''
		});
		this.examService.getAttendanceEvent({})
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.eventArray = result.data;
					}
				}
			);
	}
	// get section list according to selected class
	getSectionsByClass() {
		this.resetdata();
		this.firstForm.patchValue({
			'syl_section_id': ''
		});
		const sectionParam: any = {};
		sectionParam.class_id = this.firstForm.value.syl_class_id;
		this.smartService.getSectionsByClass(sectionParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.sectionArray = result.data;
					} else {
						this.sectionArray = [];
					}
				}
			);
	}
	fetchDetails() {
		this.presentStudent = 0;
		this.absentStudent = 0;
		this.finalArray = [];
		this.formgroupArray = [];
		this.studentArray = [];
		this.studentAttendanceArray = [];
		const studentParam: any = {};
		studentParam.au_class_id = this.firstForm.value.syl_class_id;
		studentParam.au_sec_id = this.firstForm.value.syl_section_id;
		studentParam.au_event_id = this.firstForm.value.syl_event;
		studentParam.ma_created_date = this.commonService.dateConvertion(this.firstForm.value.cw_entry_date);
		studentParam.au_role_id = '4';
		studentParam.au_status = '1';
		this.examService.getUserAttendance(studentParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.finalDivFlag = false;
						this.defaultFlag = true;
						this.studentArray = result.data;
						let counter = 0;
						for (const item of this.studentArray) {
							if (item.upd_gender === 'M') {
								this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.png';
							} else if (item.upd_gender === 'F') {
								this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.png';
							} else {
								this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
							}
							this.studentAttendanceArray.push({
								sr_no: counter,
								au_profileimage: item.au_profileimage ? item.au_profileimage : this.defaultsrc,
								au_full_name: new CapitalizePipe().transform(item.au_full_name),
								au_roll_no: item.r_rollno,
								au_admission_no: item.au_admission_no
							});
							this.finalArray.push({
								class_id: this.firstForm.value.syl_class_id ? this.firstForm.value.syl_class_id : '',
								sec_id: this.firstForm.value.syl_section_id ? this.firstForm.value.syl_section_id : '',
								ma_event: this.firstForm.value.syl_event ? this.firstForm.value.syl_event : '',
								ma_created_date: this.commonService.dateConvertion(this.firstForm.value.cw_entry_date) ? this.commonService.dateConvertion(this.firstForm.value.cw_entry_date) : '',
								login_id: item.au_login_id ? item.au_login_id : '',
								roll_no: item.r_rollno ? item.r_rollno : '',
								attendance: item.ma_attendance ? Number(item.ma_attendance) : '',
								session_id: this.session.ses_id ? this.session.ses_id : '',
								created_by: this.currentUser.login_id ? this.currentUser.login_id : ''
							});
							counter++;
							this.totalStudent = counter;
							if (Number(item.ma_attendance) === 0) {
								this.absentStudent++;
							} else {
								this.presentStudent++;
							}
						}
					}
				});
	}
	markStudentAttendance() {
		this.submitFlag = true;
		if (this.attendanceForm.value.attendance === 0) {
			let counter1 = 0;
			for (const item of this.studentArray) {
				this.finalArray[counter1].attendance = 0;
				counter1++;
				this.absentStudent = counter1;
				this.presentStudent = 0;
			}
		} else {
			let counter1 = 0;
			for (const item of this.studentArray) {
				this.finalArray[counter1].attendance = 1;
				counter1++;
				this.presentStudent = counter1;
				this.absentStudent = 0;
			}
		}
	}
	changeStudentAttendanceStatus($event, i) {
		this.submitFlag = true;
		if (this.finalArray[i].attendance === 1) {
			this.finalArray[i].attendance = 0;
			this.presentStudent--;
			this.absentStudent++;
		} else {
			this.presentStudent++;
			this.absentStudent--;
			this.finalArray[i].attendance = 1;
		}
	}
	submit() {
		this.requiredAll = true;
		for (const item of this.finalArray) {
			if (item.attendance === '') {
				this.requiredAll = false;
			}
		}
		if (this.requiredAll) {
			// this.disableApiCall = true;
			const checkParam: any = {};
			checkParam.au_class_id = this.firstForm.value.syl_class_id;
			checkParam.au_sec_id = this.firstForm.value.syl_section_id;
			checkParam.au_event_id = this.firstForm.value.syl_event;
			checkParam.ma_created_date = this.commonService.dateConvertion(this.firstForm.value.cw_entry_date);
			checkParam.au_ses_id = this.session.ses_id;
			this.examService.checkAttendanceForClass(checkParam).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.examService.updateAttendance(this.finalArray).subscribe((result_u: any) => {
						if (result_u && result_u.status === 'ok') {
							this.selectedUserArr = result_u.data;
							if (result_u.data.length > 0) {
								// let message: any = {};
								// message['delTitle'] = "Information";
								// message['delMessage'] = "This will consume  SMS" + "<br/> Would you like to broadcast this message as shown";
								// this.deleteModal.openModal(message);
								this.sendPushMessage(result_u.data);
							} else {
								this.commonService.showSuccessErrorMessage('Attendance  Notification Disabled', 'error');
							}
							this.disableApiCall = false;
							this.resetForm();
							this.commonService.showSuccessErrorMessage('Attendance  Updated Successfully', 'success');
						} else {
							this.commonService.showSuccessErrorMessage('Update failed', 'error');
							this.disableApiCall = false;
						}
					});
				} else {
					this.examService.insertAttendance(this.finalArray).subscribe((result_i: any) => {
						if (result_i && result_i.status === 'ok') {
							this.selectedUserArr = result_i.data;
							if (result_i.data.length > 0) {
								this.sendPushMessage(result_i.data);
							} else {
								this.commonService.showSuccessErrorMessage('Attendance  Notification Disabled', 'error');
							}
							this.resetForm();
							this.commonService.showSuccessErrorMessage('Attendance Marked Successfully', 'success');
							this.disableApiCall = false;
						} else {
							this.commonService.showSuccessErrorMessage('Insert failed', 'error');
							this.disableApiCall = false;
						}
					});
				}
			});
		} else {
			this.commonService.showSuccessErrorMessage('Mark all student attendance', 'error');
		}

	}

	confirmNotification(e){

	}
	
	sendPushMessage(data) {
		var validationFlag = true;
		const devices: any[] = [];
		if (validationFlag) {
			console.log("user details >>>>>>", this.selectedUserArr);
			let messageBody = "";
			let msgToArr = [];
			let userJson: any = {}
			let inputJson: any = {};

			//DATA FOR PUSH NOTIFICATION
			for (var i = 0; i < this.selectedUserArr.length; i++) {
				if (this.selectedUserArr[i].user_details['device_id']) {
					devices.push(this.selectedUserArr[i].user_details['device_id']);
				}
				userJson = {
					"login_id": this.selectedUserArr[i].user_details['au_login_id'],
					"au_full_name": this.selectedUserArr[i].user_details['au_full_name'],
					"class_id": this.selectedUserArr[i].user_details['class_id'],
					"class_name": this.selectedUserArr[i].user_details['class_name'],
					"sec_id": this.selectedUserArr[i].user_details['sec_id'],
					"sec_name": this.selectedUserArr[i].user_details['sec_name'],
					"email": this.selectedUserArr[i].user_details['au_email'],
					"mobile": this.selectedUserArr[i].user_details['au_mobile'],
					"role_id": this.selectedUserArr[i].user_details['au_role_id'],
					"msg_status": [
						{ "status_name": "sent" },
						{ "status_name": "unread" }],
					"msg_sent_date_time": ""
				}
				msgToArr.push(userJson);
				messageBody = this.selectedUserArr[i].push_message;
			}

			inputJson = {
				"msg_from": this.currentUser.login_id,
				"msg_to": msgToArr,
				"msg_type": 'notification',
				"msg_template_id": '1',
				"msg_receivers": 'Student',
				"notification_type": {
					"type": "push",
					"module": "attendance"
				},
				"msg_subject": "Attendance Alert",
				"msg_description": this.commonService.htmlToText(messageBody),
				"msg_attachment": "",
				"status": [{ "status_name": "sent", "created_by": this.currentUser.full_name, "login_id": this.currentUser.login_id }],
				"msg_created_by": { "login_id": this.currentUser.login_id, "login_name": this.currentUser.full_name },
				"msg_thread": [],
				"user_type": 'Student',
				"message_title": "Attendance",
				"message_content": this.commonService.htmlToText(messageBody),
				"message_type": {
					"module": "attendance",
					"type": "push",
				},
				"message_to": devices,
				"message_image": '',
			}

			console.log("sendPushMessage >>>>>>", inputJson);
			if(this.selectedUserArr[0].frequency == "once a day"){
				var inputJsonFor = {};
				inputJsonFor['msg_type'] = 'notification';
				inputJsonFor['from_date'] = new DatePipe('en-in').transform(new Date(), 'yyyy-MM-dd');
				inputJsonFor['to_date'] = new DatePipe('en-in').transform(new Date(), 'yyyy-MM-dd');
				this.humanResourceService.getMessage(inputJsonFor).subscribe((result: any) => {
					if (result && result.data && result.data[0]) {
						const tempResult = result.data;
						tempResult.forEach(element => {
							if(!(element.msg_to.length == 0 || element.msg_from == '')){
								this.scheduleMessageData.push(element);
							}
						});
						console.log(this.scheduleMessageData);
						
						if(this.scheduleMessageData.length == 0){
		
							//PROCESS PUSH Notification
							this.selectedUserArr[0].push_status ? this.commonService.showSuccessErrorMessage('Push  Notification sent to all absent students', 'success') : this.commonService.showSuccessErrorMessage('Push  Notification Disabled', 'error');
							// if(this.selectedUserArr[0].push_status) this.sendPushNotification(inputJson);
				
							//PROCESS SMS NOTIFICATION 
							this.selectedUserArr[0].sms_status ? this.commonService.showSuccessErrorMessage('SMS  Notification sent to all absent students', 'success') : this.commonService.showSuccessErrorMessage('SMS  Notification Disabled', 'error');
							// inputJson.msg_type = 'S';
							// if(this.selectedUserArr[0].sms_status) this.sendSMS(inputJson);
		
						}
					}
				});
			}else{

				//PROCESS PUSH Notification
				this.selectedUserArr[0].push_status ? this.commonService.showSuccessErrorMessage('Push  Notification sent to all absent students', 'success') : this.commonService.showSuccessErrorMessage('Push  Notification Disabled', 'error');
				// if(this.selectedUserArr[0].push_status) this.sendPushNotification(inputJson);
	
				//PROCESS SMS NOTIFICATION 
				this.selectedUserArr[0].sms_status ? this.commonService.showSuccessErrorMessage('SMS  Notification sent to all absent students', 'success') : this.commonService.showSuccessErrorMessage('SMS  Notification Disabled', 'error');
				// inputJson.msg_type = 'S';
				// if(this.selectedUserArr[0].sms_status) this.sendSMS(inputJson);

			}
		}
	}


	getTodayAllPushNotifications(){
		var inputJson = {};
		inputJson['msg_type'] = 'notification';
		inputJson['from_date'] = new DatePipe('en-in').transform(new Date(), 'yyyy-MM-dd');
		inputJson['to_date'] = new DatePipe('en-in').transform(new Date(), 'yyyy-MM-dd');
		this.humanResourceService.getMessage(inputJson).subscribe((result: any) => {
			if (result && result.data && result.data[0]) {
				const tempresult = result.data;
				tempresult.forEach(element => {
					if(!(element.msg_to.length == 0 || element.msg_from == '')){
						this.scheduleMessageData.push(element);
					}
				});
			}
		});
	}

	sendPushNotification(inputJson) {
		this.humanResourceService.insertMessage(inputJson).subscribe((result: any) => {
			if (result) {
				this.commonService.showSuccessErrorMessage('Push Notification sent to all absent students', 'success');
				this.resetForm();
			} else {
				this.commonService.showSuccessErrorMessage('Error While Sending Message', 'error');
			}
		});
	}

	sendSMS(inputJson) {
		this.humanResourceService.insertMessage(inputJson).subscribe((result: any) => {
			if (result) {
				this.commonService.showSuccessErrorMessage('SMS sent to all absent students', 'success');
				this.resetForm();
			} else {
				this.commonService.showSuccessErrorMessage('Error While Sending Message', 'error');
			}
		});
	}
	cancelNotification(){

	}
}

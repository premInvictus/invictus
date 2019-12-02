import { Component, OnDestroy, OnInit, ViewChild, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import { ckconfig } from '../../config/ckeditorconfig';
import { PreviewDocumentComponent } from '../../misc-shared/preview-document/preview-document.component';

@Component({
	selector: 'app-compose-message',
	templateUrl: './compose-message.component.html',
	styleUrls: ['./compose-message.component.scss']
})
export class ComposeMessageComponent implements OnInit, OnChanges {
	@Input() reRenderForm: any;
	@Output() backToBroadcast = new EventEmitter();
	ckeConfig: any;
	messageForm: FormGroup;
	scheduleForm: FormGroup;
	sendForm: FormGroup;
	userListForm: FormGroup;
	templateDataArr: any[] = [];
	editTemplateFlag = false;
	userDataArr: any[] = [];
	multipleFileArray: any[] = [];
	currentFileChangeEvent: any;
	currentFile: any;
	fileCounter = 0;
	showScheduleBox = false;
	currentReceivers = '';
	attachmentArray: any[] = [];
	showUserContextMenu = false;
	classDataArr: any[] = [];
	showUser = false;
	showClass = false;
	selectedUserArr: any[] = [];
	currentScheduleId;
	not_id = 0;
	addMode = true;
	editMode = false;
	viewMode = false;
	formData = {};
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private dialog: MatDialog
	) {

	}

	ngOnInit() {
		this.buildForm();
	}

	ngOnChanges() {
		if (this.reRenderForm.editMode) {
			this.setFormData(this.reRenderForm.formData);
		} else if (this.reRenderForm.addMode) {
			//this.buildForm();
		}

	}

	buildForm() {
		this.ckeConfig = ckconfig;
		this.selectedUserArr = [];
		this.messageForm = this.fbuild.group({
			tpl_id: '',
			messageType: '',
			messageTemplate: '',
			messageTitle: '',
			messageTo: '',
			messageSubject: '',
			messageBody: ''
		});

		this.scheduleForm = this.fbuild.group({
			recievers: '1',
			class_id: '',
			sec_id: ''
		});
		this.sendForm = this.fbuild.group({
			check_schedule_status: 'sendNow',
			schedule_date: '',
			schedule_time: ''
		});

	}

	setFormData(formData) {

		this.editMode = true;
		this.formData = formData;
		this.messageForm = this.fbuild.group({
			messageType: formData && formData.messageType ? formData.messageType : '',
		});
		this.currentReceivers = formData && formData.user_type ? formData.user_type : '';
		this.currentScheduleId = formData && formData.ns_id ? formData.ns_id : '';
		this.attachmentArray = formData.attachment == '' ? [] : JSON.parse(formData.attachment);
		const inputJson = {
			tpl_type: this.messageForm.value.messageType
		};
		this.sisService.getTemplate(inputJson).subscribe((result: any) => {
			if (result && result.data && result.data[0]) {
				this.templateDataArr = result.data;
				if (this.editMode) {
					this.editTemplate({ value: this.formData && this.formData['tpl_id'] ? this.formData['tpl_id'] : '' });
				}
			}
		});

	}

	getTemplate() {
		this.resetFormValues();
		this.templateDataArr = [];
		const inputJson = {
			tpl_type: this.messageForm.value.messageType
		};
		this.sisService.getTemplate(inputJson).subscribe((result: any) => {
			if (result && result.data && result.data[0]) {
				this.templateDataArr = result.data;
			}
		});
	}

	editTemplate(event) {
		this.editTemplateFlag = true;
		const templateData = this.templateDataArr.filter((tplObj) => {
			return tplObj.tpl_id.toString() === event.value;
		});
		this.selectedUserArr = [];
		if (templateData && templateData.length > 0) {
			if (this.editMode) {
				this.messageForm.patchValue({
					tpl_id: this.formData && this.formData['tpl_id'] ? this.formData['tpl_id'] : '',
					messageTemplate: this.formData && this.formData['tpl_id'] ? this.formData['tpl_id'] : '',
					messageType: this.formData && this.formData['messageType'] ? this.formData['messageType'] : '',
					messageTitle: this.formData && this.formData['tpl_title'] ? this.formData['tpl_title'] : '',
					messageTo: '',
					messageSubject: this.formData && this.formData['subject'] ? this.formData['subject'] : '',
					messageBody: this.formData && this.formData['body'] ? this.formData['body'] : '',
				});

				if (this.formData && this.formData['user_data']) {
					for (var i = 0; i < this.formData['user_data'].length; i++) {

						var inputJson = {
							login_id: this.formData['user_data'][i]['not_receiver_login_id'],
							class_id: this.formData['user_data'][i]['not_receiver_class_id'],
							sec_id: this.formData['user_data'][i]['not_receiver_sec_id'],
							email: this.formData['user_data'][i]['not_receiver_contact'],
							au_full_name: this.formData['user_data'][i]['au_full_name'],
							mobile:this.formData['user_data'][i]['not_receiver_contact'],
						};
						this.selectedUserArr.push(inputJson);
					}
				}

			} else {
				this.messageForm.patchValue({
					tpl_id: templateData ? templateData[0]['tpl_id'] : '',
					messageTitle: templateData ? templateData[0]['tpl_title'] : '',
					messageSubject: templateData ? templateData[0]['tpl_subject'] : '',
					messageBody: templateData ? templateData[0]['tpl_body'] : '',
				});
			}

		} else if (this.editMode) {
			this.messageForm.patchValue({
				tpl_id: this.formData && this.formData['tpl_id'] ? this.formData['tpl_id'] : '',
				messageTemplate: this.formData && this.formData['tpl_id'] ? this.formData['tpl_id'] : '',
				messageType: this.formData && this.formData['messageType'] ? this.formData['messageType'] : '',
				messageTitle: this.formData && this.formData['tpl_title'] ? this.formData['tpl_title'] : '',
				messageTo: '',
				messageSubject: this.formData && this.formData['subject'] ? this.formData['subject'] : '',
				messageBody: this.formData && this.formData['body'] ? this.formData['body'] : '',
			});

			if (this.formData && this.formData['user_data']) {
				for (var i = 0; i < this.formData['user_data'].length; i++) {
					var inputJson = {
						login_id: this.formData['user_data'][i]['not_receiver_login_id'],
						class_id: this.formData['user_data'][i]['not_receiver_class_id'],
						sec_id: this.formData['user_data'][i]['not_receiver_sec_id'],
						email: this.formData['user_data'][i]['not_receiver_contact'],
						au_full_name: this.formData['user_data'][i]['au_full_name'],
						mobile:this.formData['user_data'][i]['not_receiver_contact'],
					};

					this.selectedUserArr.push(inputJson);
				}
			}
		}
	}

	saveTemplate() {
		if (this.messageForm.valid) {
			const inputJson = {
				'tpl_title': this.messageForm.value.messageTitle,
				'tpl_subject': this.messageForm.value.messageSubject,
				'tpl_body': this.messageForm.value.messageBody,
				'tpl_type': this.messageForm.value.messageType
			};
			this.sisService.saveTemplate(inputJson).subscribe((result: any) => {
				if (result) {
					var messageType = this.messageForm.value.messageType === 'E' ? 'Email' : 'SMS';
					this.commonAPIService.showSuccessErrorMessage(messageType + ' Template Saved Successfully', 'success');
					this.reset();
					this.getTemplate();
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all required fields to save Template', 'error');
		}

	}

	updateTemplate() {
		if (this.messageForm.valid) {
			const inputJson = {
				'tpl_id': this.messageForm.value.tpl_id,
				'tpl_title': this.messageForm.value.messageTitle,
				'tpl_subject': this.messageForm.value.messageSubject,
				'tpl_body': this.messageForm.value.messageBody,
				'tpl_type': this.messageForm.value.messageType
			};
			this.sisService.updateTemplate(inputJson).subscribe((result: any) => {
				if (result) {
					var messageType = this.messageForm.value.messageType === 'E' ? 'Email' : 'SMS';
					this.commonAPIService.showSuccessErrorMessage(messageType + ' Template Saved Successfully', 'success');
					this.reset();
					this.getTemplate();
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all required fields to save Template', 'error');
		}
	}

	reset() {
		this.editTemplateFlag = false;
		this.messageForm.reset();
	}

	getUser(role_id) {
		this.classDataArr = [];
		if (role_id === '2') {
			this.currentReceivers = 'Staff';
			this.generateUserList();
		} else if (role_id === '3') {
			this.currentReceivers = 'Teacher';
			this.generateUserList();
		} else if (role_id === '4') {
			this.currentReceivers = 'Student';
			this.getClass();
		}

	}

	getClass() {
		this.sisService.getClass({}).subscribe((result: any) => {
			if (result && result.data && result.data[0]) {
				var result = result.data;
				for (var i = 0; i < result.length; i++) {
					var inputJson = {
						class_id: result[i]['class_id'],
						class_name: result[i]['class_name'],
						checked: false,
					}
					this.classDataArr.push(inputJson);
				}
				this.showClass = true;
			}
		});
	}

	generateUserList() {
		var checkedClassIds = [];
		for (var i = 0; i < this.classDataArr.length; i++) {
			if (this.classDataArr[i]['checked']) {
				checkedClassIds.push(this.classDataArr[i]['class_id']);
			}
		}
		const inputJson = {};
		if (this.currentReceivers === 'Teacher') {
			inputJson['role_id'] = '3';
			this.userDataArr = [];
			this.sisService.getUser(inputJson).subscribe((result: any) => {
				if (result && result.data && result.data[0]['au_login_id']) {
					for (var i = 0; i < result.data.length; i++) {
						var inputJson = {
							au_login_id: result.data[i]['au_login_id'],
							au_full_name: result.data[i]['au_full_name'],
							au_email: result.data[i]['au_email'],
							au_mobile: result.data[i]['au_mobile'],
							au_profileimage: result.data[i]['au_profileimage'],
							checked: false,
						}
						this.userDataArr.push(inputJson);
					}
					this.showUser = true;
					this.showClass = false;
				} else {
					this.showUser = false;
					this.showClass = true;
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		} if (this.currentReceivers === 'Staff') {
			inputJson['role_id'] = '2';
			this.userDataArr = [];
			this.sisService.getUser(inputJson).subscribe((result: any) => {
				if (result && result.data && result.data[0]['au_login_id']) {
					for (var i = 0; i < result.data.length; i++) {
						var inputJson = {
							au_login_id: result.data[i]['au_login_id'],
							au_full_name: result.data[i]['au_full_name'],
							au_email: result.data[i]['au_email'],
							au_mobile: result.data[i]['au_mobile'],
							au_profileimage: result.data[i]['au_profileimage'],
							checked: false,
						}
						this.userDataArr.push(inputJson);
					}
					this.showUser = true;
					this.showClass = false;
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
					this.showUser = false;
					this.showClass = true;
				}
			});
		} else {
			inputJson['class_ids'] = checkedClassIds[0];
			inputJson['pmap_status'] = '1';
			this.userDataArr = [];
			this.sisService.getMasterStudentDetail(inputJson).subscribe((result: any) => {
				if (result && result.data && result.data[0]['au_login_id']) {
					for (var i = 0; i < result.data.length; i++) {
						var inputJson = {
							au_login_id: result.data[i]['au_login_id'],
							au_full_name: result.data[i]['au_full_name'],
							au_profileimage: result.data[i]['au_profileimage'],
							class_name: result.data[i]['class_name'],
							sec_name: result.data[i]['sec_name'],
							em_admission_no: result.data[i]['em_admission_no'],
							checked: false,
						}
						if (result.data[i]['active_parent'] === 'F') {
							inputJson['au_email'] = result.data[i]['father_email'] ? result.data[i]['father_email'] : '';
							inputJson['au_mobile'] = result.data[i]['father_contact_no'] ? result.data[i]['father_contact_no'] : '';
						}
						if (result.data[i]['active_parent'] === 'M') {
							inputJson['au_email'] = result.data[i]['mother_email'] ? result.data[i]['mother_email'] : '';
							inputJson['au_mobile'] = result.data[i]['mother_contact_no'] ? result.data[i]['mother_contact_no'] : '';
						}
						if (result.data[i]['active_parent'] === 'G') {
							inputJson['au_email'] = result.data[i]['guardian_email'] ? result.data[i]['guardian_email'] : '';
							inputJson['au_mobile'] = result.data[i]['guardian_contact_no'] ? result.data[i]['guardian_contact_no'] : '';
						}

						this.userDataArr.push(inputJson);
					}
					this.showUser = true;
					this.showClass = false;
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
					this.showUser = false;
					this.showClass = true;
				}
			});
		}

	}

	fileChangeEvent(fileInput) {
		this.multipleFileArray = [];
		this.fileCounter = 0;
		this.currentFileChangeEvent = fileInput;
		const files = fileInput.target.files;
		for (let i = 0; i < files.length; i++) {
			this.IterateFileLoop(files[i]);
		}
	}
	IterateFileLoop(files) {
		const reader = new FileReader();
		reader.onloadend = (e) => {
			this.currentFile = reader.result;
			const fileJson = {
				fileName: files.name,
				imagebase64: this.currentFile
			};
			this.multipleFileArray.push(fileJson);
			this.fileCounter++;
			if (this.fileCounter === this.currentFileChangeEvent.target.files.length) {
				this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
					if (result) {
						for (const item of result.data) {
							const findex2 = this.attachmentArray.findIndex(f => f.imgUrl === item.file_url);
							if (findex2 === -1) {
								this.attachmentArray.push({
									imgUrl: item.file_url,
									imgName: item.file_name
								});
							} else {
								this.attachmentArray.splice(findex2, 1);
							}
						}
					}
				});
			}
		};
		reader.readAsDataURL(files);
	}

	previewImage(imgArray, index) {
		this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
			data: {
				images: imgArray,
				index: index
			},
			height: '70vh',
			width: '70vh'
		});
	}

	checkThumbnail(url: any) {
		if (url.match(/jpg/) || url.match(/png/) || url.match(/bmp/) ||
			url.match(/gif/) || url.match(/jpeg/) ||
			url.match(/JPG/) || url.match(/PNG/) || url.match(/BMP/) ||
			url.match(/GIF/) || url.match(/JPEG/)) {
			return true;
		} else {
			return false;
		}
	}

	selectAllClass(event) {
		console.log('event--', event);
		if (event.checked === true) {
			this.classDataArr.map((item) => {
				item.checked = true;
			});

		} else {
			this.classDataArr.map((item) => {
				item.checked = false;
			});
		}
	}

	selectAllUser(event) {
		if (event.checked === true) {
			this.userDataArr.map((item) => {
				item.checked = true;
			});

		} else {
			this.userDataArr.map((item) => {
				item.checked = false;
			});
		}
	}

	updateClassCheck(i, event) {
		if (event.checked) {
			this.classDataArr[i]['checked'] = true;
		} else {
			this.classDataArr[i]['checked'] = false;
		}
	}

	updateUserCheck(i, event) {
		if (event.checked) {
			this.userDataArr[i]['checked'] = true;
		} else {
			this.userDataArr[i]['checked'] = false;
		}
	}

	done() {
		this.showUser = false;
		this.showClass = false;
		this.showUserContextMenu = false;
		for (let i = 0; i < this.userDataArr.length; i++) {
			if (this.userDataArr[i]['checked']) {
				var inputJson = {
					login_id: this.userDataArr[i]['au_login_id'],
					class_id: this.userDataArr[i]['class_id'],
					sec_id: this.userDataArr[i]['sec_id'],
					email: this.userDataArr[i]['au_email'],
					au_full_name: this.userDataArr[i]['au_full_name'],
					mobile: this.userDataArr[i]['au_mobile']
				};
				this.selectedUserArr.push(inputJson);

			}
		}
		console.log('this.selectedUserArr', this.selectedUserArr);
	}

	deleteUser(i) {
		this.selectedUserArr.splice(i, 1);
	}

	// generateEmailSchedule() {
	// 	if (this.scheduleForm.valid) {
	// 		if (this.messageForm.value.messageSubject === '') {
	// 			this.commonAPIService.showSuccessErrorMessage('Please Fill Email Subject to send Email', 'error');
	// 		} else {
	// 			this.sendEmailSchedule();
	// 		}
	// 	} else {
	// 		this.commonAPIService.showSuccessErrorMessage('Please Fill Required Fields to Schedule Email', 'error');
	// 	}
	// }

	sendEmailSchedule() {
		if (this.messageForm.value.messageSubject === '') {
			this.commonAPIService.showSuccessErrorMessage('Please Fill Email Subject to send Email', 'error');
		} else {
			if (this.selectedUserArr.length <= 0) {
				this.commonAPIService.showSuccessErrorMessage('Please Choose Atleast one ' + this.currentReceivers + ' to whom you want to send Email', 'error');
			} else {
				let inputJsonForSchedule = {};
				inputJsonForSchedule = {
					ns_schedule_date: this.sendForm.value.schedule_date,
					ns_schedule_time: this.sendForm.value.schedule_time,
					ns_title: this.messageForm.value.messageSubject,
					ns_schedule_status: this.showScheduleBox ? 'S' : 'I',
					ns_template_id: this.messageForm.value.tpl_id,
					ns_desc: this.messageForm.value.messageBody,
					ns_attachments: JSON.stringify(this.attachmentArray),
					ns_type: this.messageForm.value.messageType
				};
				if (this.editMode && this.currentScheduleId > 0) {
					inputJsonForSchedule['scheduleId'] = this.currentScheduleId;
				}

				if (this.editMode && this.currentScheduleId > 0) {
					inputJsonForSchedule['scheduleId'] = this.currentScheduleId;
				}

				this.sisService.insertEmailScheduler(inputJsonForSchedule).subscribe((result: any) => {
					if (result && result.data && result.data) {
						if (result.data['schedule_id'] !== '0') {
							this.currentScheduleId = result.data['schedule_id'];
						}
						this.commonAPIService.showSuccessErrorMessage('Email Data Scheduled Successfully', 'success');
						this.generateEmailData();
					}
				});


			}
		}

	}

	generateEmailData() {
		const generateEmailDataArr = [];
		if (this.messageForm.value.tpl_subject !== '') {
			if (this.selectedUserArr.length > 0) {
				if (this.messageForm.value.messageType === 'S') {
					this.sendSMSSchedule();
				} else {
					let inputJsonForEmail = {};
					const finalJsonForEmail = {};
					let currentReceiver = '';
					if (this.currentReceivers === 'Student') {
						currentReceiver = 'S';
					} else if (this.currentReceivers === 'Parent') {
						currentReceiver = 'P';
					} else if (this.currentReceivers === 'Teacher') {
						currentReceiver = 'T';
					}

					for (let i = 0; i < this.selectedUserArr.length; i++) {
						inputJsonForEmail = {
							'not_ns_id': this.currentScheduleId,
							'not_receivers': currentReceiver,
							'not_receiver_class_id': this.selectedUserArr[i]['class_id'] ? this.selectedUserArr[i]['class_id'] : 0,
							'not_receiver_sec_id': this.selectedUserArr[i]['sec_id'] ? this.selectedUserArr[i]['sec_id'] : 0,
							'not_sent_status': 'P',
							'not_receiver_email': this.selectedUserArr[i]['email'],
							'not_receiver_login_id': this.selectedUserArr[i]['login_id'],
						};

						generateEmailDataArr.push(inputJsonForEmail);
					}

					if (this.editMode && this.not_id) {
						finalJsonForEmail['not_id'] = this.not_id;
					}
					finalJsonForEmail['email_data'] = generateEmailDataArr;
					this.sisService.insertEmailData(finalJsonForEmail).subscribe((result: any) => {
						if (result) {
							if (!this.showScheduleBox) {
								this.sendEmail(this.currentScheduleId);
							} else {
								//this.router.navigate(['../../notifications/email-list'], { queryParams: {}, relativeTo: this.route });
								this.resetForm();
							}
						}
					});

				}

			} else {
				this.commonAPIService.showSuccessErrorMessage('Please Choose Atleast one ' + this.currentReceivers + ' to whom you want to send Email', 'error');
			}
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please Fill Subject to send Email', 'error');
		}
	}

	sendEmail(schedule_id) {
		this.sisService.sendEmail({ schedule_id }).subscribe((result: any) => {
			this.commonAPIService.showSuccessErrorMessage('Email has been Sent Successfully', 'success');
			this.resetForm();
			this.back();
		});
	}

	sendSMSSchedule() {
		const inputJsonForSchedule = {
			ns_schedule_date: this.messageForm.value.schedule_date,
			ns_schedule_time: this.messageForm.value.schedule_time,
			ns_title: this.messageForm.value.messageSubject,
			ns_schedule_status: this.showScheduleBox ? 'S' : 'I',
			ns_template_id: this.messageForm.value.tpl_id,
			ns_desc: this.messageForm.value.messageBody,
			ns_attachments: JSON.stringify([]),
			ns_type: 'S'
		};

		if (this.editMode && this.currentScheduleId > 0) {
			inputJsonForSchedule['scheduleId'] = this.currentScheduleId;
		}

		this.sisService.insertSMSScheduler(inputJsonForSchedule).subscribe((result: any) => {
			if (result && result.data && result.data) {
				if (result.data['schedule_id'] !== '0') {
					this.currentScheduleId = result.data['schedule_id'];
				}
				this.generateSMSData();
			}
		});


	}

	generateSMSData() {
		const generateSMSDataArr = [];
		if (this.selectedUserArr.length > 0) {

			let inputJsonForSMS = {};
			const finalJsonForSMS = {};
			let currentReceiver = '';
			if (this.currentReceivers === 'Student') {
				currentReceiver = 'S';
			} else if (this.currentReceivers === 'Parent') {
				currentReceiver = 'P';
			} else if (this.currentReceivers === 'Teacher') {
				currentReceiver = 'T';
			}

			for (let i = 0; i < this.selectedUserArr.length; i++) {
				inputJsonForSMS = {
					'not_ns_id': this.currentScheduleId,
					'not_receivers': currentReceiver,
					'not_receiver_class_id': this.selectedUserArr[i]['class_id'] ? this.selectedUserArr[i]['class_id'] : 0,
					'not_receiver_sec_id': this.selectedUserArr[i]['sec_id'] ? this.selectedUserArr[i]['sec_id'] : 0,
					'not_sent_status': 'P',
					'not_receiver_contact': this.selectedUserArr[i]['mobile'],
					'not_receiver_login_id': this.selectedUserArr[i]['login_id'],
				};
				generateSMSDataArr.push(inputJsonForSMS);
			}

			if (this.editMode && this.not_id) {
				finalJsonForSMS['not_id'] = this.not_id;
			}
			finalJsonForSMS['sms_data'] = generateSMSDataArr;
			this.sisService.insertSMSData(finalJsonForSMS).subscribe((result: any) => {
				if (result) {
					this.commonAPIService.showSuccessErrorMessage('SMS has been sent Successfully', 'success');
					if (!this.showScheduleBox) {
						this.sendSMS(this.currentScheduleId);
					} else {
						//this.router.navigate(['../../notifications/sms-list'], { queryParams: {}, relativeTo: this.route });
						this.back();
						this.resetForm();
					}

				}
			});

		} else {
			this.commonAPIService.showSuccessErrorMessage('Please Choose Atleast one ' + this.currentReceivers + ' to whom you want to send SMS', 'error');
		}
	}

	sendSMS(schedule_id) {
		this.sisService.sendSMS({ schedule_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				const xhr = new XMLHttpRequest();
				xhr.open('GET', result.sms_send_result, true);
				xhr.send();
				this.resetForm();
				this.back();
				//this.router.navigate(['../../notifications/sms-list'], { queryParams: {}, relativeTo: this.route });

			}
		});


	}

	resetForm() {
		this.messageForm.reset();
		this.selectedUserArr = [];
		this.attachmentArray = [];
		this.editTemplateFlag = false;
	}

	resetFormValues() {
		this.editMode = false;
		this.attachmentArray = [];
		this.selectedUserArr = [];
		this.editTemplateFlag = false;
		this.messageForm.patchValue({
			tpl_id: '',
			messageTemplate: '',
			messageTitle: '',
			messageTo: '',
			messageSubject: '',
			messageBody: ''
		})
	}

	back() {
		this.backToBroadcast.emit(this.messageForm.value.messageType);
	}
}

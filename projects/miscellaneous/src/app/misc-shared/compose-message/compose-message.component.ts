import { Component, OnDestroy, OnInit, ViewChild, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { ErpCommonService } from 'src/app/_services';
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
	@ViewChild('deleteModal') deleteModal;
	deleteMessage = '';
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
	tempSelectedUserArr: any[] = [];
	currentScheduleId;
	not_id = 0;
	addMode = true;
	editMode = false;
	viewMode = false;
	formData = {};
	currentUser: any;
	msgMultipleCount = 0;
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	showSearchFlag = false;
	finClassDataArr: any[] = [];
	finUserDataArr: any[] = [];
	selectedUserCount = 0;
	showSearchByUserFlag = false;
	disabledApiButton = false;
	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private erpCommonService: ErpCommonService,
		private dialog: MatDialog
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

	}

	ngOnInit() {
		this.buildForm();
	}

	ngOnChanges() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		console.log(this.reRenderForm);
		if (this.reRenderForm.editMode) {
			this.messageForm = this.fbuild.group({
				messageType: this.reRenderForm && this.reRenderForm.messageType ? this.reRenderForm.messageType : '',
			});
			this.setFormData(this.reRenderForm.formData);
		} else if (this.reRenderForm.addMode) {
			//this.buildForm();
			this.messageForm = this.fbuild.group({
				messageType: this.reRenderForm && this.reRenderForm.messageType ? this.reRenderForm.messageType : '',
			});
		}

		console.log(this.messageForm);

	}

	buildForm() {
		this.ckeConfig = ckconfig;
		this.selectedUserArr = [];
		this.messageForm = this.fbuild.group({
			tpl_id: '0',
			messageType: this.reRenderForm && this.reRenderForm.messageType ? this.reRenderForm.messageType : '',
			messageTemplate: '',
			messageTitle: '',
			messageTo: '',
			messageSubject: '',
			messageBody: ''
		});
		console.log('in');
		this.getTemplate();
	}

	setFormData(formData) {
		console.log('formData--', formData);
		this.editMode = true;
		this.formData = formData;
		// this.messageForm = this.fbuild.group({
		// 	messageType: formData && formData.messageType ? formData.messageType : '',
		// });
		this.currentReceivers = formData && formData.user_type ? formData.user_type : '';
		this.currentScheduleId = formData && formData.msg_id ? formData.msg_id : '';
		this.attachmentArray = formData.attachment == '' ? [] : formData.attachment;
		const inputJson = {
			tpl_type: this.messageForm.value.messageType
		};
		this.sisService.getTemplate(inputJson).subscribe((result: any) => {
			if (result && result.data && result.data[0]) {
				this.templateDataArr = result.data;
				if (this.editMode) {
					this.editTemplate({ value: this.formData && this.formData['tpl_id'] ? this.formData['tpl_id'] : '0' });
				}
			}
		});
	}

	getTemplate() {
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

		(event && event.value != '0') ? this.editTemplateFlag = true : this.editTemplateFlag = false;
		const templateData = this.templateDataArr.filter((tplObj) => {
			return tplObj.tpl_id.toString() === event.value.toString();
		});

		this.selectedUserArr = [];
		this.messageForm.patchValue({ tpl_id: (event && event.value != '0') ? event.value : '' });
		if (templateData && templateData.length > 0) {
			if (this.editMode) {
				this.messageForm.patchValue({
					//tpl_id: event && event.value ? event.value : '',
					messageTemplate: this.formData && this.formData['tpl_id'] ? this.formData['tpl_id'].toString() : '',
					messageType: this.formData && this.formData['messageType'] ? this.formData['messageType'] : '',
					messageTitle: templateData[0]['tpl_title'],
					messageTo: '',
					messageSubject: this.formData && this.formData['subject'] ? this.formData['subject'] : '',
					messageBody: this.formData && this.formData['body'] ? this.formData['body'] : '',
				});
				if (this.formData && this.formData['user_data']) {
					for (var i = 0; i < this.formData['user_data'].length; i++) {

						var inputJson = {
							login_id: this.formData['user_data'][i]['login_id'],
							class_id: this.formData['user_data'][i]['class_id'],
							sec_id: this.formData['user_data'][i]['sec_id'],
							email: this.formData['user_data'][i]['email'],
							au_full_name: this.formData['user_data'][i]['au_full_name'],
							mobile: this.formData['user_data'][i]['mobile'],
						};
						this.selectedUserArr.push(inputJson);
					}
				}
			} else {
				this.messageForm.patchValue({
					//tpl_id: event && event.value ? event.value : '',
					messageTitle: templateData ? templateData[0]['tpl_title'] : '',
					messageSubject: templateData ? templateData[0]['tpl_subject'] : '',
					messageBody: templateData ? templateData[0]['tpl_body'] : '',
				});
			}

		} else if (this.editMode) {
			this.messageForm.patchValue({
				//tpl_id: event && event.value ? event.value : '',
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
						login_id: this.formData['user_data'][i]['login_id'],
						class_id: this.formData['user_data'][i]['class_id'],
						sec_id: this.formData['user_data'][i]['sec_id'],
						email: this.formData['user_data'][i]['email'],
						au_full_name: this.formData['user_data'][i]['au_full_name'],
						mobile: this.formData['user_data'][i]['mobile'],
					};

					this.selectedUserArr.push(inputJson);
				}
			}
		}
	}

	saveTemplate() {
		console.log('this.messageForm.value--', this.messageForm.value);
		if (this.messageForm.valid) {
			this.disabledApiButton = true;
			const inputJson = {
				'tpl_title': this.messageForm.value.messageTitle,
				'tpl_subject': this.messageForm.value.messageSubject,
				'tpl_body': this.messageForm.value.messageBody,
				'tpl_type': this.messageForm.value.messageType
			};

			if (this.messageForm.value.tpl_id) {
				inputJson['tpl_id'] = this.messageForm.value.tpl_id;
				this.sisService.updateTemplate(inputJson).subscribe((result: any) => {
					if (result) {
						this.disabledApiButton = false;
						var messageType = this.messageForm.value.messageType === 'E' ? 'Email' : 'SMS';
						this.commonAPIService.showSuccessErrorMessage(messageType + ' Template Saved Successfully', 'success');
						this.getTemplate();
						this.editTemplateFlag = true;
					}
				});
			} else {
				this.sisService.saveTemplate(inputJson).subscribe((result: any) => {
					if (result) {
						this.disabledApiButton = false;
						var messageType = this.messageForm.value.messageType === 'E' ? 'Email' : 'SMS';
						this.commonAPIService.showSuccessErrorMessage(messageType + ' Template Saved Successfully', 'success');
						this.getTemplate();
						this.editTemplateFlag = true;
						this.messageForm.patchValue({
							tpl_id: this.templateDataArr && this.templateDataArr.length > 0 ? Number(this.templateDataArr.length) : 1
						});
					}
				});
			}

		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all required fields to save Template', 'error');
		}

	}

	// updateTemplate() {
	// 	if (this.messageForm.valid) {
	// 		const inputJson = {
	// 			'tpl_id': this.messageForm.value.tpl_id,
	// 			'tpl_title': this.messageForm.value.messageTitle,
	// 			'tpl_subject': this.messageForm.value.messageSubject,
	// 			'tpl_body': this.messageForm.value.messageBody,
	// 			'tpl_type': this.messageForm.value.messageType
	// 		};

	// 	} else {
	// 		this.commonAPIService.showSuccessErrorMessage('Please fill all required fields to save Template', 'error');
	// 	}
	// }

	reset() {
		this.editTemplateFlag = false;
		this.messageForm.reset();
	}

	getUser(role_id) {
		this.showSearchFlag = false;
		this.showSearchByUserFlag = false;
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
		this.classDataArr = [];
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
					this.finClassDataArr.push(inputJson);
				}
				this.showClass = true;
			}
		});
	}

	generateUserList() {
		var checkedClassIds = [];
		var classSectionJson = {};
		for (var i = 0; i < this.classDataArr.length; i++) {
			var classJson = {};
			var secCheckFlag = false;
			if (this.classDataArr[i]['checked']) {
				classJson['class_id'] = this.classDataArr[i]['class_id'];
				for (var j = 0; j < this.classDataArr[i]['sec_arr'].length; j++) {
					if (this.classDataArr[i]['sec_arr'][j]['checked']) {
						var classJson = {};
						secCheckFlag = true;
						classJson['class_id'] = this.classDataArr[i]['class_id'];
						classJson['sec_id'] = this.classDataArr[i]['sec_arr'][j]['sec_id'];
						checkedClassIds.push(classJson);
					}
				}
				if (!secCheckFlag) {
					checkedClassIds.push(classJson);
				}
			}
		}
		const inputJson = {};
		if (this.currentReceivers === 'Teacher') {
			inputJson['role_id'] = '3';
			inputJson['status'] = '1';
			this.userDataArr = [];
			this.finUserDataArr = [];
			this.commonAPIService.getAllEmployeeDetail({ 'emp_cat_id': 1 }).subscribe((result: any) => {
				console.log('teacher data', result);
				if (result) {
					for (var i = 0; i < result.length; i++) {
						var inputJson = {
							au_login_id: result[i].emp_login_id,
							au_full_name: result[i].emp_name,
							au_email: result[i].emp_personal_detail && result[i].emp_personal_detail.contact_detail ? result[i].emp_personal_detail.contact_detail.email_id : '',
							au_mobile: result[i].emp_personal_detail && result[i].emp_personal_detail.contact_detail ? result[i].emp_personal_detail.contact_detail.primary_mobile_no : '',
							au_profileimage: result[i].emp_profile_pic,
							au_role_id: '3',
							checked: false,
							class_name: '',
							sec_name: '',
							class_id: '',
							sec_id: '',
							au_admission_no: '',
						}
						this.userDataArr.push(inputJson);

						this.finUserDataArr.push(inputJson);
					}
					this.showUser = true;
					this.showClass = false;
				} else {
					this.showUser = false;
					this.showClass = true;
					this.commonAPIService.showSuccessErrorMessage('No Record Found', 'error');
				}
			});
		} else if (this.currentReceivers === 'Staff') {
			inputJson['role_id'] = '2';
			inputJson['status'] = '1';
			this.userDataArr = [];
			this.finUserDataArr = [];
			this.commonAPIService.getAllEmployeeDetail({ 'emp_cat_id': 2 }).subscribe((result: any) => {
				if (result) {
					for (var i = 0; i < result.length; i++) {
						var inputJson = {
							au_login_id: result[i].emp_login_id,
							au_full_name: result[i].emp_name,
							au_email: result[i].emp_personal_detail && result[i].emp_personal_detail.contact_detail ? result[i].emp_personal_detail.contact_detail.email_id : '',
							au_mobile: result[i].emp_personal_detail && result[i].emp_personal_detail.contact_detail ? result[i].emp_personal_detail.contact_detail.primary_mobile_no : '',
							au_profileimage: result[i].emp_profile_pic,
							au_role_id: '2',
							checked: false,
							class_name: '',
							sec_name: '',
							class_id: '',
							sec_id: '',
							au_admission_no: '',
						}
						this.userDataArr.push(inputJson);
						this.finUserDataArr.push(inputJson);
					}
					this.showUser = true;
					this.showClass = false;
				} else {
					this.commonAPIService.showSuccessErrorMessage('No Record Found', 'error');
					this.showUser = false;
					this.showClass = true;
				}
			});
		} else if (this.currentReceivers === 'Student') {
			inputJson['class_ids'] = checkedClassIds;
			this.userDataArr = [];
			this.finUserDataArr = [];
			this.sisService.getAllStudentsByClassSection(inputJson).subscribe((result: any) => {
				if (result && result.data && result.data[0]['au_login_id']) {
					for (var i = 0; i < result.data.length; i++) {
						var inputJson = {
							au_login_id: result.data[i]['au_login_id'],
							au_full_name: result.data[i]['au_full_name'],
							au_profileimage: result.data[i]['au_profileimage'],
							class_name: result.data[i]['class_name'],
							sec_name: result.data[i]['sec_name'],
							class_id: result.data[i]['class_id'],
							sec_id: result.data[i]['sec_id'],
							em_admission_no: result.data[i]['em_admission_no'],
							au_role_id: '4',
							checked: false,
							au_admission_no: result.data[i]['em_admission_no'],
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
						this.finUserDataArr.push(inputJson);
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
		if (event.checked === true) {
			this.classDataArr.map((item, index) => {
				item.checked = true;
				this.getSectionsByClass({ class_id: this.classDataArr[index]['class_id'] }, index, true);
			});

		} else {
			this.classDataArr.map((item, index) => {
				item.checked = false;
				this.classDataArr[index]['sec_arr'] = [];
			});
		}
		this.finClassDataArr = JSON.parse(JSON.stringify(this.classDataArr));
	}

	selectAllUser(event) {
		if (event.checked === true) {
			this.userDataArr.map((item, index) => {
				item.checked = true;
				this.setSelectedUserData(this.userDataArr[index]);
			});
			this.selectedUserCount = this.userDataArr.length;
		} else {
			this.userDataArr.map((item) => {
				item.checked = false;

			});
			this.selectedUserCount = 0;
		}
		this.finUserDataArr = JSON.parse(JSON.stringify(this.userDataArr));
	}

	updateClassCheck(i, event) {
		if (event.checked) {
			this.classDataArr[i]['checked'] = true;
			this.finClassDataArr[i]['checked'] = true;
			this.getSectionsByClass({ class_id: this.classDataArr[i]['class_id'] }, i, '');
		} else {
			this.classDataArr[i]['checked'] = false;
			this.finClassDataArr[i]['checked'] = false;
			this.classDataArr[i]['sec_arr'] = [];
		}
		//this.finClassDataArr = JSON.parse(JSON.stringify(this.classDataArr));
	}

	updateClassSectionCheck(i, j, event) {
		if (event.checked) {
			this.classDataArr[i]['checked'] = true;
			this.classDataArr[i]['sec_arr'][j]['checked'] = true;
			this.finClassDataArr[i]['checked'] = true;
			this.finClassDataArr[i]['sec_arr'][j]['checked'] = true;
		} else {
			this.classDataArr[i]['checked'] = this.classDataArr[i]['checked'] ? true : false;
			this.classDataArr[i]['sec_arr'][j]['checked'] = false;
			this.finClassDataArr[i]['checked'] = this.classDataArr[i]['checked'] ? true : false;
			this.finClassDataArr[i]['sec_arr'][j]['checked'] = false;
		}
		//this.finClassDataArr = JSON.parse(JSON.stringify(this.classDataArr));
	}

	updateUserCheck(i, event) {
		if (event.checked) {
			this.userDataArr[i]['checked'] = true;
			this.finUserDataArr[i]['checked'] = true;
			this.selectedUserCount++;
			this.setSelectedUserData(this.userDataArr[i]);
		} else {
			this.userDataArr[i]['checked'] = false;
			this.finUserDataArr[i]['checked'] = false;
			this.selectedUserCount--;
		}
	}

	setSelectedUserData(userDataArr) {
		if (userDataArr) {
			var flag = false;
			for (var i = 0; i < this.selectedUserArr.length; i++) {
				if (Number(this.selectedUserArr[i]['login_id']) === Number(userDataArr['au_login_id'])) {
					flag = true;
					break;
				}
			}
			if (!flag) {
				var inputJson = {
					login_id: userDataArr['au_login_id'],
					class_id: userDataArr['class_id'],
					sec_id: userDataArr['sec_id'],
					class_name: userDataArr['class_name'],
					sec_name: userDataArr['sec_name'],
					email: userDataArr['au_email'],
					au_full_name: userDataArr['au_full_name'],
					mobile: userDataArr['au_mobile'],
					role_id: userDataArr['au_role_id'],
				};
				this.tempSelectedUserArr.push(inputJson);
			}
		}
	}

	done() {
		this.showUser = false;
		this.showClass = false;
		this.showUserContextMenu = false;
		this.selectedUserCount = 0;
		this.selectedUserArr = JSON.parse(JSON.stringify(this.tempSelectedUserArr));
	}

	backToUserList() {
		if (this.currentReceivers === 'Staff') {
			this.showClass = false;
			this.showUser = false;
		} else if (this.currentReceivers === 'Teacher') {
			this.showClass = false;
			this.showUser = false;
		} else if (this.currentReceivers === 'Student') {
			this.showClass = true;
			this.showUser = false;
		}
	}

	backToMain() {
		this.showClass = false;
		this.showUser = false;
	}

	deleteUser(i) {
		this.selectedUserArr.splice(i, 1);
	}

	sendMessage() {
		var validationFlag = this.checkValidation();
		if (validationFlag) {
			this.disabledApiButton = true;
			var msgToArr = [];
			for (var i = 0; i < this.selectedUserArr.length; i++) {
				var userJson = {
					"login_id": this.selectedUserArr[i]['login_id'],
					"au_full_name": this.selectedUserArr[i]['au_full_name'],
					"class_id": this.selectedUserArr[i]['class_id'],
					"class_name": this.selectedUserArr[i]['class_name'],
					"sec_id": this.selectedUserArr[i]['sec_id'],
					"sec_name": this.selectedUserArr[i]['sec_name'],
					"email": this.selectedUserArr[i]['email'],
					"mobile": this.selectedUserArr[i]['mobile'],
					"role_id": this.selectedUserArr[i]['role_id'],
					"msg_status": { "status_id": "1", "status_name": "pending" },
					"msg_sent_date_time": ""
				}
				msgToArr.push(userJson);
			}

			var inputJson = {
				"msg_from": this.currentUser.login_id,
				"msg_to": msgToArr,
				"msg_type": this.messageForm.value.messageType,
				"msg_template_id": this.messageForm.value.tpl_id,
				"msg_receivers": this.currentReceivers,
				"msg_subject": this.messageForm.value.messageSubject,
				"msg_description": this.messageForm.value.messageBody,
				"msg_attachment": this.attachmentArray,
				"status": [{ "status_name": "pending", "created_by": this.currentUser.full_name, "login_id": this.currentUser.login_id }],
				"msg_created_by": { "login_id": this.currentUser.login_id, "login_name": this.currentUser.full_name },
				"msg_thread": []
			}

			if (this.editMode) {
				inputJson['msg_id'] = this.formData['msg_id'];
				this.commonAPIService.updateMessage(inputJson).subscribe((result: any) => {
					if (result) {
						this.disabledApiButton = false;
						this.commonAPIService.showSuccessErrorMessage('Message has been updated Successfully', 'success');
						this.back();
						this.resetForm();
					} else {
						this.disabledApiButton = false;
						this.commonAPIService.showSuccessErrorMessage('Error While Updating Message', 'error');
					}
				});
			} else {

				if (this.messageForm.value.messageType === 'S') {
					var consumeMessage = this.msgMultipleCount * (this.selectedUserArr.length);

					inputJson['delTitle'] = "Information";
					inputJson['delMessage'] = "This will consume " + consumeMessage + " SMS" + "<br/> Would you like to broadcast this message as shown";
					this.deleteModal.openModal(inputJson);
				} else {
					this.commonAPIService.insertMessage(inputJson).subscribe((result: any) => {
						if (result) {
							this.disabledApiButton = false;
							this.commonAPIService.showSuccessErrorMessage('Message has been sent Successfully', 'success');
							this.back();
							this.resetForm();
						} else {
							this.disabledApiButton = false;
							this.commonAPIService.showSuccessErrorMessage('Error While Sending Message', 'error');
						}
					});
				}
			}
		}
	}

	onBodyChange(event) {
		if (this.messageForm.value.messageType === 'S') {
			this.messageForm.value.messageBody = this.messageForm.value.messageBody.replace(/(&nbsp;|<([^>]+)>)/ig, " ").trim();
			this.msgMultipleCount = (this.messageForm.value.messageBody.length / 160);
			this.msgMultipleCount = Math.ceil(this.msgMultipleCount);
		}
	}

	sendSMS(inputJson) {
		this.commonAPIService.insertMessage(inputJson).subscribe((result: any) => {
			if (result) {
				this.commonAPIService.showSuccessErrorMessage('Message has been sent Successfully', 'success');
				this.back();
				this.resetForm();
			} else {
				this.commonAPIService.showSuccessErrorMessage('Error While Sending Message', 'error');
			}
		});
	}

	checkValidation() {
		// this.msgMultipleCount = 0;
		var validationStatus = false;
		if (this.messageForm.value.messageSubject === '') {
			validationStatus = false;
			this.commonAPIService.showSuccessErrorMessage('Please Fill Subject to Send Message', 'error');
		} else {
			if (this.selectedUserArr.length <= 0) {
				validationStatus = false;
				this.commonAPIService.showSuccessErrorMessage('Please Choose Atleast one ' + this.currentReceivers + ' to whom you want to send Message', 'error');
			} else if (this.messageForm.value.messageType === 'S') {
				if (this.messageForm.value.messageBody.length > 160) {
					validationStatus = true;
					this.msgMultipleCount = Math.ceil(this.msgMultipleCount);
				} else {
					validationStatus = true;
				}
			} else {
				validationStatus = true
			}
		}
		return validationStatus;
	}



	resetForm() {
		this.msgMultipleCount = 0;
		this.messageForm.reset();
		this.selectedUserArr = [];
		this.attachmentArray = [];
		this.editTemplateFlag = false;
		this.tempSelectedUserArr = [];
		this.selectedUserCount = 0;
	}

	resetFormValues() {
		this.editMode = false;
		this.attachmentArray = [];
		this.selectedUserArr = [];
		this.editTemplateFlag = false;
		this.tempSelectedUserArr = [];
		this.messageForm.patchValue({
			tpl_id: '',
			messageTemplate: '',
			messageTitle: '',
			messageTo: '',
			messageSubject: '',
			messageBody: ''
		});
		this.msgMultipleCount = 0;
		this.selectedUserCount = 0;
	}

	back() {
		this.backToBroadcast.emit(this.messageForm.value.messageType);
	}

	cancelSendSMS() {

	}

	removeAll() {
		this.selectedUserArr = [];
		this.tempSelectedUserArr = [];
		this.selectedUserCount = 0;
	}

	showSearch() {
		this.showSearchFlag = !this.showSearchFlag;
	}

	showSearchByUser() {
		this.showSearchByUserFlag = !this.showSearchByUserFlag;
	}

	searchByClass(event) {
		if (event.target.value) {
			var tempArr = [];
			for (var i = 0; i < this.classDataArr.length; i++) {
				if (this.classDataArr[i]['class_name'].toLowerCase().includes(event.target.value)) {
					tempArr.push(this.classDataArr[i]);
				}
			}
			if (tempArr.length > 0) {
				this.classDataArr = tempArr;
			}
		} else {
			this.classDataArr = this.finClassDataArr;
		}
	}

	cancelSearchByClass() {
		this.showSearchFlag = false;
		this.classDataArr = this.finClassDataArr;
	}

	cancelSearchByUser() {
		this.showSearchByUserFlag = false;
		this.userDataArr = this.finUserDataArr;
	}

	getSectionsByClass(inputJson, i, selectAllflag) {
		this.erpCommonService.getSectionsByClass(inputJson).subscribe((result: any) => {
			if (this.classDataArr && this.classDataArr[i]) {
				this.classDataArr[i]['sec_arr'] = [];
				this.finClassDataArr[i]['sec_arr'] = [];
			}

			let secDataArr = [];
			if (result && result.data) {
				for (var j = 0; j < result.data.length; j++) {
					var inputJson = {
						sec_id: result.data[j]['sec_id'],
						sec_name: result.data[j]['sec_name'],
						checked: selectAllflag ? selectAllflag : true,
					}
					secDataArr.push(inputJson);
				}
				this.classDataArr[i]['sec_arr'] = secDataArr;
				this.finClassDataArr[i]['sec_arr'] = secDataArr;
			}
		});
	}

	searchByUser(event) {
		if (event.target.value) {
			var tempArr = [];
			for (var i = 0; i < this.userDataArr.length; i++) {
				if (this.userDataArr[i]['au_full_name'].toLowerCase().includes(event.target.value)) {
					tempArr.push(this.userDataArr[i]);
				}
			}
			if (tempArr.length > 0) {
				this.userDataArr = tempArr;
			}
		} else {
			this.userDataArr = this.finUserDataArr;
		}
	}
}

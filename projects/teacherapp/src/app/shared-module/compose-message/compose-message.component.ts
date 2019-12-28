import { Component, OnDestroy, OnInit, ViewChild, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErpCommonService } from 'src/app/_services';
import { SisService, CommonAPIService, SmartService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import { ckconfig } from './../config/ckeditorconfig';
import { PreviewDocumentComponent } from '../preview-document/preview-document.component';

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
	editTemplateFlag = false;
	userDataArr: any[] = [];
	multipleFileArray: any[] = [];
	currentFileChangeEvent: any;
	currentFile: any;
	fileCounter = 0;
	currentReceivers = '';
	attachmentArray: any[] = [];
	classDataArr: any[] = [];
	showUser = false;
	showClass = false;
	selectedUserArr: any[] = [];
	tempSelectedUserArr: any[] = [];
	currentScheduleId;
	addMode = true;
	editMode = false;
	viewMode = false;
	formData = {};
	showUserContextMenu = false;
	currentUser: any;
	showSearchFlag = false;
	finClassDataArr:any[] = [];
	finUserDataArr: any[] = [];
	selectedUserCount = 0;
	showSearchByUserFlag = false;
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private smartService: SmartService,
		private dialog: MatDialog,
		private erpCommonService: ErpCommonService
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

	}

	ngOnInit() {
		this.buildForm();
	}

	ngOnChanges() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
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
			messageTo: '',
			messageSubject: '',
			messageBody: ''
		});
	}

	setFormData(formData) {
		this.messageForm = this.fbuild.group({
			messageTo: '',
			messageSubject: '',
			messageBody: ''
		});
		this.editMode = true;
		this.formData = formData;
		this.currentScheduleId = formData && formData.msg_id ? formData.msg_id : '';
		this.attachmentArray = formData.attachment == '' ? [] : formData.attachment;
		setTimeout(() => {
			if (this.formData && this.formData['user_data']) {
				for (var i = 0; i < this.formData['user_data'].length; i++) {
					var inputJson = {
						login_id: this.formData['user_data'][i]['login_id'],
						class_id: this.formData['user_data'][i]['class_id'],
						sec_id: this.formData['user_data'][i]['sec_id'],
						email: this.formData['user_data'][i]['email'],
						au_full_name: this.formData['user_data'][i]['au_full_name'],
						mobile: this.formData['user_data'][i]['mobile'],
						au_admission_no : this.formData['user_data'][i]['au_admission_no']
					};
					this.selectedUserArr.push(inputJson);
				}
			}
			this.messageForm.patchValue({
				messageTo: '',
				messageSubject: this.formData && this.formData['subject'] ? this.formData['subject'] : '',
				messageBody: this.formData && this.formData['body'] ? this.formData['body'] : '',
			});
		}, 100);
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
		this.smartService.getClassByTeacherId({ teacher_id: this.currentUser.login_id }).subscribe((result: any) => {
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
		// var checkedClassIds = [];
		// for (var i = 0; i < this.classDataArr.length; i++) {
		// 	if (this.classDataArr[i]['checked']) {
		// 		checkedClassIds.push(this.classDataArr[i]['class_id']);
		// 	}
		// }
		var checkedClassIds = [];
		var classSectionJson = {};
		console.log('this.classDataArr--', this.classDataArr);
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
			this.userDataArr = [];
			this.finUserDataArr = [];
			this.sisService.getUser(inputJson).subscribe((result: any) => {
				if (result && result.data && result.data[0]['au_login_id']) {
					for (var i = 0; i < result.data.length; i++) {
						var inputJson = {
							au_login_id: result.data[i]['au_login_id'],
							au_full_name: result.data[i]['au_full_name'],
							au_email: result.data[i]['au_email'],
							au_mobile: result.data[i]['au_mobile'],
							au_profileimage: result.data[i]['au_profileimage'],
							au_role_id: '3',
							checked: false,
							class_name: result.data[i]['class_name'],
							sec_name: result.data[i]['sec_name'],
							class_id: result.data[i]['class_id'],
							sec_id: result.data[i]['sec_id'],
							au_admission_no : result.data[i]['au_admission_no']
						}
						this.userDataArr.push(inputJson);
						this.finUserDataArr.push(inputJson);
					}
					this.showUser = true;
					this.showClass = false;
				} else {
					this.showUser = false;
					this.showClass = true;
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}else if (this.currentReceivers === 'Staff') {
			inputJson['role_id'] = '2';
			this.userDataArr = [];
			this.finUserDataArr = [];
			this.sisService.getUser(inputJson).subscribe((result: any) => {
				if (result && result.data && result.data[0]['au_login_id']) {
					for (var i = 0; i < result.data.length; i++) {
						var inputJson = {
							au_login_id: result.data[i]['au_login_id'],
							au_full_name: result.data[i]['au_full_name'],
							au_email: result.data[i]['au_email'],
							au_mobile: result.data[i]['au_mobile'],
							au_profileimage: result.data[i]['au_profileimage'],
							au_role_id: '2',
							checked: false,
							class_name: result.data[i]['class_name'],
							sec_name: result.data[i]['sec_name'],
							class_id: result.data[i]['class_id'],
							sec_id: result.data[i]['sec_id'],
							au_admission_no : result.data[i]['au_admission_no']
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
		} else {
			inputJson['class_ids'] = checkedClassIds;
			//inputJson['pmap_status'] = '1';
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
							au_admission_no: result.data[i]['em_admission_no'],
							au_role_id: '4',
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

	// selectAllClass(event) {
	// 	if (event.checked === true) {
	// 		this.classDataArr.map((item, index) => {
	// 			item.checked = true;
				
	// 		});
			
	// 	} else {
	// 		this.classDataArr.map((item) => {
	// 			item.checked = false;
	// 		});
	// 	}
	// }
	selectAllClass(event) {
		if (event.checked === true) {
			this.classDataArr.map((item, index) => {
				item.checked = true;
				this.getSectionsByClass({ class_id: this.classDataArr[index]['class_id'], teacher_id: this.currentUser.login_id }, index, true);
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

	// updateClassCheck(i, event) {
	// 	if (event.checked) {
	// 		this.classDataArr[i]['checked'] = true;
	// 	} else {
	// 		this.classDataArr[i]['checked'] = false;
	// 	}
	// }

	
	updateClassCheck(i, event) {
		if (event.checked) {
			this.classDataArr[i]['checked'] = true;
			this.finClassDataArr[i]['checked'] = true;
			this.getSectionsByClass({ class_id: this.classDataArr[i]['class_id'], teacher_id: this.currentUser.login_id }, i, '');
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
			this.classDataArr[i]['checked'] = false;
			this.classDataArr[i]['sec_arr'][j]['checked'] = false;
			this.finClassDataArr[i]['checked'] = false;
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

	getSectionsByClass(inputJson, i, selectAllflag) {
		this.erpCommonService.getSectionByTeacherIdClassId(inputJson).subscribe((result: any) => {
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
						checked: selectAllflag ? selectAllflag : false,
					}
					secDataArr.push(inputJson);
				}
				this.classDataArr[i]['sec_arr'] = secDataArr;
				this.finClassDataArr[i]['sec_arr'] = secDataArr;
			}
		});
	}

	setSelectedUserData(userDataArr) {		
		if (userDataArr) {
			var flag = false;
			for (var i=0; i<this.selectedUserArr.length;i++) {
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

	cancelSearchByClass() {
		this.showSearchFlag = false;
		this.classDataArr = this.finClassDataArr;
	}

	cancelSearchByUser() {
		this.showSearchByUserFlag = false;
		this.userDataArr = this.finUserDataArr;
	}


	// done() {
	// 	this.showUser = false;
	// 	this.showClass = false;
	// 	for (let i = 0; i < this.userDataArr.length; i++) {
	// 		if (!(this.checkAlreadyExists(this.userDataArr[i]))) {
	// 			if (this.userDataArr[i]['checked']) {
	// 				var inputJson = {
	// 					login_id: this.userDataArr[i]['au_login_id'],
	// 					class_id: this.userDataArr[i]['class_id'],
	// 					sec_id: this.userDataArr[i]['sec_id'],
	// 					class_name: this.userDataArr[i]['class_name'],
	// 					sec_name: this.userDataArr[i]['sec_name'],
	// 					email: this.userDataArr[i]['au_email'],
	// 					au_full_name: this.userDataArr[i]['au_full_name'],
	// 					mobile: this.userDataArr[i]['au_mobile'],
	// 					role_id: this.userDataArr[i]['au_role_id'],
	// 					au_admission_no : this.userDataArr[i]['au_admission_no']
	// 				};
	// 				this.selectedUserArr.push(inputJson);
	// 			}
	// 		}
			
	// 	}

	// 	this.showUserContextMenu = false;
	// }

	checkAlreadyExists(item) {
		var flag = false;
		for (var i=0; i<this.selectedUserArr.length;i++) {
			if(this.selectedUserArr[i]['login_id'] === item.au_login_id) {
				flag = true;
				break;
			}
		}
		return flag;
	}

	deleteUser(i) {
		this.selectedUserArr.splice(i, 1);
	}

	sendMessage(event) {
		var validationFlag = this.checkValidation();
		if (validationFlag) {
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
					"msg_status": { "status_id": 1, "status_name": "unread" },
					"msg_sent_date_time": new Date()
				}
				msgToArr.push(userJson);
			}

			var inputJson = {
				"msg_from": this.currentUser.login_id,
				"msg_to": msgToArr,
				"msg_type": 'C',
				"msg_template_id": '',
				"msg_receivers": this.currentReceivers,
				"msg_subject": this.messageForm.value.messageSubject,
				"msg_description": this.messageForm.value.messageBody,
				"msg_attachment": this.attachmentArray,
				"msg_status": { "status_id": 1, "status_name": "unread" },
				"status": [{ "status_name": "pending", "created_by": this.currentUser.full_name, "login_id": this.currentUser.login_id }],
				"msg_created_by": { "login_id": this.currentUser.login_id, "login_name": this.currentUser.full_name },
				"msg_thread": []
			}

			if (this.editMode) {
				inputJson['msg_id'] = this.formData['msg_id'];
				this.commonAPIService.updateMessage(inputJson).subscribe((result: any) => {
					if (result) {
						this.commonAPIService.showSuccessErrorMessage('Message has been updated Successfully', 'success');
						this.back();
						this.resetForm();
					} else {
						this.commonAPIService.showSuccessErrorMessage('Error While Updating Message', 'error');
					}
				});
			} else {
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
		}
	}

	checkValidation() {
		var validationStatus = false;
		if (this.messageForm.value.messageSubject === '') {
			validationStatus = false;
			this.commonAPIService.showSuccessErrorMessage('Please Fill Subject to Send Message', 'error');
		} else {
			if (this.selectedUserArr.length <= 0) {
				validationStatus = false;
				this.commonAPIService.showSuccessErrorMessage('Please Choose Atleast one ' + this.currentReceivers + ' to whom you want to send Message', 'error');
			} else {
				validationStatus = true
			}
		}
		return validationStatus;
	}



	resetForm() {
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
		this.messageForm.patchValue({
			tpl_id: '',
			messageTemplate: '',
			messageTitle: '',
			messageTo: '',
			messageSubject: '',
			messageBody: ''
		})
		this.tempSelectedUserArr = [];
		this.selectedUserCount = 0;
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

	viewMessage(element) {

	}

	cancelSendMessage() {

	}

	searchOk(event) {
		
	}

	back() {
		this.backToBroadcast.emit(this.messageForm.value.messageType);
	}
}

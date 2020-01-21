import { Component, OnDestroy, OnInit, ViewChild, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonAPIService, ErpCommonService } from 'src/app/_services';
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
	finUserDataArr: any[] = [];
	currentUser: any;
	selectedUserCount = 0;
	showSearchByUserFlag = false;
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private erpCommonService: ErpCommonService,
		private dialog: MatDialog
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

	}

	ngOnInit() {
		this.buildForm();
		//this.getUser();
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

	getUser() {
		this.classDataArr = [];
		this.generateUserList();
		// if (role_id === '2') {
		// 	this.currentReceivers = 'Staff';
		// 	this.generateUserList();
		// } else if (role_id === '3') {
		// 	this.currentReceivers = 'Teacher';
		// 	this.generateUserList();
		// } else if (role_id === '4') {
		// 	this.currentReceivers = 'Student';
		// 	this.getClass();
		// }

	}

	generateUserList() {
		var checkedClassIds = [];		
		const inputJson = {};
		inputJson['role_id'] = '3';
		inputJson['class_id'] = this.currentUser.class_id ? this.currentUser.class_id : '';
		this.userDataArr = [];
		this.finUserDataArr = [];
		console.log('this.showUserContextMenu--',this.showUserContextMenu);
		this.showUserContextMenu =!this.showUserContextMenu; 
		if (this.showUserContextMenu) {
			this.erpCommonService.getAllEmployeeDetail({'emp_cat_id' : 1}).subscribe((result: any) => {
				var userData = [];
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
						userData.push(inputJson);						
					}
	
					this.userDataArr = this.uniqueUserArray(userData);
					this.finUserDataArr = this.uniqueUserArray(userData);
					this.showUser = true;
					this.showClass = false;
				} else {
					this.showUser = false;
					this.showClass = true;
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
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
				this.erpCommonService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
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
				this.setSelectedUserData(this.userDataArr[index]);
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
		} else {
			this.classDataArr[i]['checked'] = false;
		}
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
		this.finUserDataArr = JSON.parse(JSON.stringify(this.tempSelectedUserArr));
		this.selectedUserArr = JSON.parse(JSON.stringify(this.tempSelectedUserArr));
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

	uniqueUserArray(userDataArr) {
		var distinctUserArr = [];
		for(var i=0; i<userDataArr.length;i++) {	
			if (!(this.checkForDuplicateUser(distinctUserArr,userDataArr[i]))) {
				distinctUserArr.push(userDataArr[i]);
			}			
		}
		return distinctUserArr;
	}

	checkForDuplicateUser(distinctArr, item) {
		var flag = false;
		for (var i=0; i< distinctArr.length;i++) {
			if (distinctArr[i]['au_login_id'] === item['au_login_id']) {
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
					"msg_status": { "status_id": "1", "status_name": "unread" },
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
				"status": [{ "status_name": "pending", "created_by": this.currentUser.full_name, "login_id": this.currentUser.login_id }],
				"msg_status": { "status_id": 1, "status_name": "unread" },
				"msg_created_by": { "login_id": this.currentUser.login_id, "login_name": this.currentUser.full_name },
				"msg_thread": []
			}

			if (this.editMode) {
				inputJson['msg_id'] = this.formData['msg_id'];
				this.erpCommonService.updateMessage(inputJson).subscribe((result: any) => {
					if (result) {
						this.commonAPIService.showSuccessErrorMessage('Message has been updated Successfully', 'success');
						this.back();
						this.resetForm();
					} else {
						this.commonAPIService.showSuccessErrorMessage('Error While Updating Message', 'error');
					}
				});
			} else {
				this.erpCommonService.insertMessage(inputJson).subscribe((result: any) => {
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
		});
		this.tempSelectedUserArr = [];
		this.selectedUserCount = 0;
	}

	backToUserList() {
		this.showUserContextMenu = !this.showUserContextMenu;
	}

	viewMessage(element) {

	}

	cancelSendMessage() {

	}

	searchOk(event) {

	}

	removeAll() {
		this.selectedUserArr = [];
		this.tempSelectedUserArr = [];
		this.selectedUserCount = 0;
	}

	
	showSearchByUser() {
		this.showSearchByUserFlag = !this.showSearchByUserFlag;
	}

	

	cancelSearchByUser() {
		this.showSearchByUserFlag = false;
		this.userDataArr = this.finUserDataArr;
	}


	back() {
		this.backToBroadcast.emit(this.messageForm.value.messageType);
	}
}

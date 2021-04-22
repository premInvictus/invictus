import { Component, OnDestroy, OnInit, ViewChild, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonAPIService, ErpCommonService } from 'src/app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import { PreviewDocumentComponent } from '../../hr-shared/preview-document/preview-document.component';
import { ckconfig } from '../../hr-shared/config/ckeditorconfig';
@Component({
	selector: 'app-view-message',
	templateUrl: './view-message.component.html',
	styleUrls: ['./view-message.component.scss']
})
export class ViewMessageComponent implements OnInit, OnChanges {
	@Input() reRenderForm: any;
	@Output() backToBroadcast = new EventEmitter();
	@ViewChild('deleteModal') deleteModal;
	deleteMessage = '';
	ckeConfig: any;
	messageForm: FormGroup;
	searchForm: FormGroup;
	editTemplateFlag = false;
	userDataArr: any[] = [];
	multipleFileArray: any[] = [];
	currentFileChangeEvent: any;
	currentFile: any;
	fileCounter = 0;
	currentReceivers = '';
	classDataArr: any[] = [];
	showUser = false;
	showClass = false;
	selectedUserArr: any[] = [];
	currentScheduleId;
	addMode = true;
	editMode = false;
	viewMode = false;
	formData = {};
	currentUser: any;
	showUserContextMenu = false;
	showComposeMessage = false;
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	messagesData: any[] = [];
	renderForm = {};
	ckconfig: any;
	showReply = false;
	attachmentArray: any[] = [];
	currentRowIndex = 0;
	filterValue = '';
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
	}

	ngOnChanges() {

		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.reRenderForm.formData.action['showReplyBox'] = false;
		this.messagesData.push(this.reRenderForm.formData.action);
		if (this.reRenderForm.formData.action.msg_thread && this.reRenderForm.formData.action.msg_thread.length > 0) {
			for (var i = 0; i < this.reRenderForm.formData.action.msg_thread.length; i++) {
				this.reRenderForm.formData.action.msg_thread[i]['showReplyBox'] = false;
				this.messagesData.push(this.reRenderForm.formData.action.msg_thread[i]);
			}
		}
	}


	buildForm() {
		this.ckeConfig = ckconfig;
		this.ckeConfig.height = 200;
		this.ckeConfig.toolbarLocation = 'bottom';
		this.selectedUserArr = [];
		this.messageForm = this.fbuild.group({
			messageTo: '',
			messageSubject: '',
			messageBody: ''
		});
		this.searchForm = this.fbuild.group({
			search: ''
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
		this.erpCommonService.getClass({}).subscribe((result: any) => {
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
			this.erpCommonService.getUser(inputJson).subscribe((result: any) => {
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
							au_admission_no: result.data[i]['au_admission_no']
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
			this.erpCommonService.getUser(inputJson).subscribe((result: any) => {
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
							au_admission_no: result.data[i]['au_admission_no']
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
			this.erpCommonService.getMasterStudentDetail(inputJson).subscribe((result: any) => {
				if (result && result.data && result.data[0]['au_login_id']) {
					console.log('getMasterStudentDetail',result);
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
		for (let i = 0; i < this.userDataArr.length; i++) {
			if (this.userDataArr[i]['checked']) {
				var inputJson = {
					login_id: this.userDataArr[i]['au_login_id'],
					class_id: this.userDataArr[i]['class_id'],
					sec_id: this.userDataArr[i]['sec_id'],
					class_name: this.userDataArr[i]['class_name'],
					sec_name: this.userDataArr[i]['sec_name'],
					email: this.userDataArr[i]['au_email'],
					au_full_name: this.userDataArr[i]['au_full_name'],
					mobile: this.userDataArr[i]['au_mobile'],
					role_id: this.userDataArr[i]['au_role_id'],
				};
				this.selectedUserArr.push(inputJson);

			}
		}
		this.showUserContextMenu = false;
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
					"msg_status": { "status_id": "1", "status_name": "pending" },
					"msg_sent_date_time": ""
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
				"status": { "status_name": "pending", "created_by": this.currentUser.full_name, "login_id": this.currentUser.login_id },
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

	viewMessage(element) {

	}

	cancelSendMessage() {

	}

	searchOk(event) {

	}

	deleteCancel() {

	}

	back() {
		var filterValue = this.filterValue ?  this.filterValue : '';
		this.backToBroadcast.emit(filterValue);
	}

	getPermission(item) {
		console.log('jitem',item);
		if (this.currentUser.role_id === '2' && item.msg_type === 'C') {
			return true;
		} else {
			return false;
		}

	}

	composeMessage() {
		this.showComposeMessage = !this.showComposeMessage;
		this.renderForm = { addMode: true, editMode: false, messageType: 'C', formData: '', viewMode: false, };
	}

	resetComposeMessage() {
		this.showComposeMessage = !this.showComposeMessage;
	}

	showReplyBox(i) {
		this.messagesData[i]['showReplyBox'] = true;
	}

	discardMessage(i) {
		this.messagesData[i]['showReplyBox'] = false;
	}

	replyMessage(item) {		
		this.erpCommonService.getLastMessageRecord({}).subscribe((result: any) => {
			if (result) {
				console.log('item--', item, result);
				if (this.reRenderForm.formData.action) {
					delete item.showReplyBox;
				}
				//var threadData = item.msg_thread.length > 0 ? item.msg_thread : [];
				var msgThreadJson = {
					"msg_id": result,
					"msg_from": this.currentUser.login_id,
					"msg_to": this.selectedUserArr,
					"msg_created_by": { "login_id": this.currentUser.login_id, "login_name": this.currentUser.full_name },
					"msg_subject": 'Rep : ' + item.msg_subject,
					"msg_description": this.messageForm.value.messageBody,
					"msg_type": "C",
					"msg_status": { "status_id": "1", "status_name": "unread" },
					"msg_attachment": this.attachmentArray,
					"status": { "status_id": "1", "status_name": "pending", "created_by": this.currentUser.login_id },
					"msg_thread": [],
					"msg_created_date": new Date(),
					"is_replied" : true
				};
				this.reRenderForm.formData.action.msg_thread.push(msgThreadJson);
				
				//item.msg_thread = threadData;
				item.msg_status = { "status_id": "1", "status_name": "unread" };
				//this.reRenderForm.formData.action.msg_thread = threadData;
				var replyJson = this.reRenderForm.formData.action;

				//console.log('replyJson--', replyJson);
				
				this.erpCommonService.updateMessage(replyJson).subscribe((result: any) => {
					if (result) {
						this.commonAPIService.showSuccessErrorMessage('Message has been Replied Successfully', 'success');
						this.back();
						this.resetForm();
					} else {
						this.commonAPIService.showSuccessErrorMessage('Error While Replying Message', 'error');
					}
				});

			}
		});
	}

	approveMessage(item) {
		item.status = { status_id: '2', status_name: 'approved' };
		if (this.reRenderForm.formData.action) {
			delete item.showReplyBox;
		}

		var replyJson = this.reRenderForm.formData.action;

		this.erpCommonService.updateMessage(replyJson).subscribe((result: any) => {
			if (result) {
				this.commonAPIService.showSuccessErrorMessage('Message has been Approved Successfully', 'success');
				this.back();
				this.resetForm();
			} else {
				this.commonAPIService.showSuccessErrorMessage('Error While Approving Message', 'error');
			}
		});
	}

	resolveMessage(item) {
		item.status = { status_id: '3', status_name: 'resolved' };
		if (this.reRenderForm.formData.action) {
			delete item.showReplyBox;
		}

		var replyJson = this.reRenderForm.formData.action;

		this.erpCommonService.updateMessage(replyJson).subscribe((result: any) => {
			if (result) {
				this.commonAPIService.showSuccessErrorMessage('Message has been Approved Successfully', 'success');
				this.back();
				this.resetForm();
			} else {
				this.commonAPIService.showSuccessErrorMessage('Error While Approving Message', 'error');
			}
		});

	}
	rejectMessage(item) {
		item.status = { status_id: '4', status_name: 'rejected' };
		if (this.reRenderForm.formData.action) {
			delete item.showReplyBox;
		}

		var replyJson = this.reRenderForm.formData.action;

		this.erpCommonService.updateMessage(replyJson).subscribe((result: any) => {
			if (result) {
				this.commonAPIService.showSuccessErrorMessage('Message has been Approved Successfully', 'success');
				this.back();
				this.resetForm();
			} else {
				this.commonAPIService.showSuccessErrorMessage('Error While Approving Message', 'error');
			}
		});
	}

	readMessage(item) {
		if (item && item.msg_status && item.msg_status && (item.msg_status['status_name'] === 'unread')) {
			item.msg_status = { status_id: '2', status_name: 'read' };
			delete this.reRenderForm.formData.action.showReplyBox;
			var replyJson = this.reRenderForm.formData.action;
			console.log('replyJson--', replyJson);
			this.erpCommonService.updateMessage(replyJson).subscribe((result: any) => {

			});
		}
	}

	searchMessage(event) {
		var filterValue = '';
		if (event && event.target && event.target.value) {
			this.filterValue = event.target.value;
		} else {
			this.filterValue = this.searchForm.value.search;
		}
		this.back();
	}
}

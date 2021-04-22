import { Component, OnInit, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SisService, AxiomService, CommonAPIService } from '../../_services/index';
import { ErpCommonService } from 'src/app/_services';
import { DatePipe } from '@angular/common';
import { FeeService } from 'projects/fee/src/app/_services';

@Component({
  selector: 'app-forward-communication',
  templateUrl: './forward-communication.component.html',
  styleUrls: ['./forward-communication.component.scss']
})
export class ForwardCommunicationComponent implements OnInit {

  currentUser: any = {};
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
	msgMultipleCount = 0;
	showSearchFlag = false;
	finClassDataArr: any[] = [];
	finUserDataArr: any[] = [];
	selectedUserCount = 0;
	showSearchByUserFlag = false;
  constructor(
    public dialogRef: MatDialogRef<ForwardCommunicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fbuild:FormBuilder,
    private common: ErpCommonService,
    private axiomService: AxiomService,
    private feeService: FeeService,
    private sisService: SisService,
    private commonAPIService: CommonAPIService
  ) { }

  ngOnInit() {
    console.log(this.data);
    if(this.data && this.data.msg_to && this.data.msg_to.length > 0) {
      this.data.msg_to.forEach(element => {
        this.selectedUserArr.push(element);
        this.tempSelectedUserArr.push(element);
      });
    }
    this.buildForm()
  }
  buildForm() {
		this.messageForm = this.fbuild.group({
			messageTo: ''
		});
	}
  closeDialog() {
		this.dialogRef.close();
  }
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
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		} else if (this.currentReceivers === 'Staff') {
			inputJson['role_id'] = '2';
			inputJson['status'] = '1';
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
							au_role_id: '2',
							checked: false,
							class_name: result.data[i]['class_name'],
							sec_name: result.data[i]['sec_name'],
							class_id: result.data[i]['class_id'],
							sec_id: result.data[i]['sec_id'],
							au_admission_no: '',
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
		} else if (this.currentReceivers === 'Student') {
			inputJson['class_ids'] = checkedClassIds;
			this.userDataArr = [];
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

	submit() {
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
		console.log('msgToArr', msgToArr);
		this.data.msg_to = msgToArr;
		console.log(this.data);
		this.dialogRef.close({status:true,data:this.data});
	}

	checkValidation() {
		// this.msgMultipleCount = 0;
		var validationStatus = true;
		if (this.selectedUserArr.length < 1) {
      validationStatus = false;
      this.commonAPIService.showSuccessErrorMessage('Please Choose Atleast one ' + this.currentReceivers + ' to whom you want to send Message', 'error');
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
			messageTo: ''
		});
		this.msgMultipleCount = 0;
		this.selectedUserCount = 0;
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
		this.common.getSectionsByClass(inputJson).subscribe((result: any) => {
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

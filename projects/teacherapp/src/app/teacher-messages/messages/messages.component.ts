import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { PreviewDocumentComponent } from '../../shared-module/preview-document/preview-document.component';
@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
	@ViewChild('paginator') paginator: MatPaginator;
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('searchModal') searchModal;
	showComposeMessage = false;
	searchForm: FormGroup;
	displayedColumns: string[] = []
	renderForm:any = {};
	scheduleMessageData: any[] = [];
	USER_ELEMENT_DATA: any[] = [];
	selectedUserArr: any[] = [];
	allUserSelectFlag = false;
	scheduleMessageDataSource = new MatTableDataSource<Element>(this.USER_ELEMENT_DATA);
	currentUser = {};
	showViewMessage = false;
	@ViewChild('deleteModal') deleteModal;
	deleteMessage = 'Are you sure, you want to Delete Message ?';
	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private router: Router,
		private dialog: MatDialog
	) { 
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}

	ngOnInit() {
		this.scheduleMessageDataSource.sort = this.sort;
		this.buildForm();
		this.getMessages();
	}

	ngAfterViewInit() {
		this.scheduleMessageDataSource.sort = this.sort;
	}

	buildForm() {
		this.searchForm = this.fbuild.group({
			search: ''
		});
	}


	openDeleteDialog = (data) => {
		this.deleteModal.openDeleteModal(data);
	}


	getMessages() {
		this.scheduleMessageData = [];
		this.USER_ELEMENT_DATA = [];
		this.displayedColumns = [
			'no',		
			'schedule_date',
			'subject',
			'attachment',
			'send_by',
			'action'
		];
		//var inputJson = {'msg_to.login_id': this.currentUser && this.currentUser['login_id']};
		var inputJson = {'$or': [ { 'msg_to.login_id': this.currentUser && this.currentUser['login_id'] }, {'msg_thread.msg_to.login_id': this.currentUser && this.currentUser['login_id']} ]};
		console.log('inputJson--', inputJson);
		this.commonAPIService.getMessage(inputJson).subscribe((result: any) => {
			if (result && result.data && result.data[0]) {
				this.scheduleMessageData = result.data;
				this.prepareDataSource();
			}
		});
	}

	prepareDataSource() {
		this.scheduleMessageDataSource = new MatTableDataSource<Element>(this.USER_ELEMENT_DATA);
		let counter = 1;
		for (let i = 0; i < this.scheduleMessageData.length; i++) {
			const tempObj = {};
			tempObj['msg_id'] = this.scheduleMessageData[i]['msg_id'];
			tempObj['no'] = counter;
			tempObj['subject'] = this.scheduleMessageData[i]['msg_subject'];
			tempObj['schedule_date'] = this.scheduleMessageData[i]['msg_created_date'];
			if (this.scheduleMessageData[i]['msg_receivers'] === 'Student') {
				tempObj['user_type'] = 'Student';
			} else if (this.scheduleMessageData[i]['msg_receivers'] === 'Parent') {
				tempObj['user_type'] = 'Parent';
			} else if (this.scheduleMessageData[i]['msg_receivers'] === 'Teacher') {
				tempObj['user_type'] = 'Teacher';
			} else if (this.scheduleMessageData[i]['msg_receivers'] === 'Staff') {
				tempObj['user_type'] = 'Staff';
			}
			tempObj['send_by'] = this.scheduleMessageData[i]['msg_created_by'] ? this.scheduleMessageData[i]['msg_created_by']['login_name'] : '';
			tempObj['attachment'] = this.scheduleMessageData[i]['msg_attachment'] ? this.scheduleMessageData[i]['msg_attachment'] : '';

			tempObj['status'] = this.scheduleMessageData[i]['not_sent_status'] === 'P' ? 'Pending' : this.scheduleMessageData[i]['not_sent_status'] === 'C' ? 'Complete' : 'Failed';
			tempObj['receiver_contact'] = this.scheduleMessageData[i]['not_receiver_contact'];
			tempObj['tpl_id'] = this.scheduleMessageData[i]['msg_template_id'];
			tempObj['tpl_title'] = this.scheduleMessageData[i]['tpl_title'];
			tempObj['body'] = this.scheduleMessageData[i]['msg_description'] ? this.scheduleMessageData[i]['msg_description'] : '';
			tempObj['user_data'] = this.scheduleMessageData[i]['msg_to'] ? this.scheduleMessageData[i]['msg_to'] : [];
			tempObj['msg_type'] = this.scheduleMessageData[i]['msg_type'] ? this.scheduleMessageData[i]['msg_type'] : '';
			tempObj['action'] =  this.scheduleMessageData[i];
			
			this.USER_ELEMENT_DATA.push(tempObj);
			counter++;
		}
		this.scheduleMessageDataSource = new MatTableDataSource(this.USER_ELEMENT_DATA);
		this.scheduleMessageDataSource.paginator = this.paginator;
		if (this.sort) {
			this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
			this.scheduleMessageDataSource.sort = this.sort;
		}
	}

	checkAllUserList($event) {
		this.selectedUserArr = [];
		if ($event.checked === true) {
			this.allUserSelectFlag = true;
			for (const item of this.USER_ELEMENT_DATA) {
				this.selectedUserArr.push({
					ns_id: item.ns_id
				});
			}
		} else {
			this.allUserSelectFlag = false;
		}
	}

	prepareSelectedRowData($event, item) {
		const findex = this.selectedUserArr.findIndex(f => f.ns_id === item);
		if (findex === -1) {
			this.selectedUserArr.push({ ns_id: item });
		} else {
			this.selectedUserArr.splice(findex, 1);
		}
	}

	


	applyFilterUser(filterValue: string) {
		this.scheduleMessageDataSource.filter = filterValue.trim().toLowerCase();
	}


	editMessage(element) {
		var messageType = element.messageType;
		element.messageType = messageType;
		this.renderForm = {addMode:false, editMode:true, formData: element, viewMode : false};
		this.showComposeMessage = true;
	}

	deleteMessageFunc(element) {
		this.commonAPIService.updateMessage({ 'msg_id': element.msg_id, 'msg_status' : {status_id : '5' , status_name : 'delete' } }).subscribe((result: any) => {
			if (result) {
				this.commonAPIService.showSuccessErrorMessage('Message has been deleted Successfully', 'success');
				this.getMessages();
			} else {
				this.commonAPIService.showSuccessErrorMessage('Error while deleting message', 'error');
			}
		});

	} 

	getMessage() {
		this.getMessages();
	}

	composeMessage() {
		this.showComposeMessage = true;
		var messageType = 'C';
		this.renderForm = {addMode:true, editMode:false, messageType: messageType, formData:'', viewMode : false,};
		
	}

	resetComposeMessage(messageType) {
		console.log('fgfj');
		this.showComposeMessage = false;
		this.showViewMessage = false;
		// }
		this.getMessages();
		
	}

	previewImage(imgArray, index) {
		var updatedImageArr = [];
		for (var i=0; i<imgArray.length;i++) {
			updatedImageArr.push({file_url : imgArray[i]['imgUrl'], file_name : imgArray[i]['imgName'] })
		}

		this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
			data: {
				images: updatedImageArr ? updatedImageArr : [],
				index: index
			},
			height: '70vh',
			width: '70vh'
		});
	}

	searchOk(event) {
	
	}

	deleteCancel() {
		
	}

	viewMessage(element) {
		this.showViewMessage = !this.showViewMessage;
		this.renderForm = {addMode:false, editMode:false, messageType: element.msg_type, formData:element, viewMode : false,};

	}
}


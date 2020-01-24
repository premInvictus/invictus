import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { PreviewDocumentComponent } from '../../misc-shared/preview-document/preview-document.component';
@Component({
	selector: 'app-broadcast',
	templateUrl: './broadcast.component.html',
	styleUrls: ['./broadcast.component.scss']
})
export class BroadcastComponent implements OnInit {
	@ViewChild('paginator') paginator: MatPaginator;
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	@ViewChild(MatSort) sort: MatSort;
	showComposeMessage = false;
	broadcastForm: FormGroup;
	displayedColumns: string[] = []
	renderForm: any = {};
	scheduleMessageData: any[] = [];
	USER_ELEMENT_DATA: any[] = [];
	selectedUserArr: any[] = [];
	allUserSelectFlag = false;
	scheduleMessageDataSource = new MatTableDataSource<Element>(this.USER_ELEMENT_DATA);
	currentTab = 0;
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('smsModal') smsModal;
	deleteMessage = 'Are you sure, you want to Delete Message ?';
	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private router: Router,
		private dialog: MatDialog
	) { }

	ngOnInit() {
		this.scheduleMessageDataSource.sort = this.sort;
		this.buildForm();
		this.getSMSScheduleData();
	}

	ngAfterViewInit() {
		this.scheduleMessageDataSource.sort = this.sort;
	}

	buildForm() {
		this.broadcastForm = this.fbuild.group({
			from_date: '',
			to_date: ''
		});
	}

	openDeleteDialog = (data) => {
		this.deleteModal.openModal(data);
	}


	getEmailScheduleData() {
		this.scheduleMessageData = [];
		this.USER_ELEMENT_DATA = [];
		this.displayedColumns = [
			'no',
			'user_type',
			'schedule_date',
			'subject',
			'attachment',
			'send_by',
			'status',
			'action'
		];
		var inputJson = {};
		inputJson['msg_type'] = 'E';
		inputJson['from_date'] = new DatePipe('en-in').transform(this.broadcastForm.value.from_date, 'yyyy-MM-dd');
		inputJson['to_date'] = new DatePipe('en-in').transform(this.broadcastForm.value.to_date, 'yyyy-MM-dd');
		this.commonAPIService.getMessage(inputJson).subscribe((result: any) => {
			if (result && result.data && result.data[0]) {
				this.scheduleMessageData = result.data;
				this.prepareDataSource();
			}
		});
	}

	getSMSScheduleData() {
		this.scheduleMessageData = [];
		this.USER_ELEMENT_DATA = [];
		this.displayedColumns = [
			'no',
			'user_type',
			'schedule_date',
			'subject',
			'send_by',
			'status',
			'action'
		];
		var inputJson = {};
		inputJson['msg_type'] = 'S';
		inputJson['from_date'] = new DatePipe('en-in').transform(this.broadcastForm.value.from_date, 'yyyy-MM-dd');
		inputJson['to_date'] = new DatePipe('en-in').transform(this.broadcastForm.value.to_date, 'yyyy-MM-dd');
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
			//tempObj['description'] = this.scheduleMessageData[i]['msg_description'];
			//tempObj['class'] = this.scheduleMessageData[i]['class_name'] + ' - ' + this.scheduleMessageData[i]['sec_name'];
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

			tempObj['status'] = this.scheduleMessageData[i]['not_sent_status'] === 'P' ? 'Pending' : this.scheduleMessageData[i]['not_sent_status'] === 'C' ? 'Complete' : 'Sent';
			tempObj['receiver_contact'] = this.scheduleMessageData[i]['not_receiver_contact'];
			tempObj['tpl_id'] = this.scheduleMessageData[i]['msg_template_id'];
			tempObj['tpl_title'] = this.scheduleMessageData[i]['tpl_title'];
			tempObj['body'] = this.scheduleMessageData[i]['msg_description'] ? this.scheduleMessageData[i]['msg_description'] : '';
			tempObj['user_data'] = this.scheduleMessageData[i]['msg_to'] ? this.scheduleMessageData[i]['msg_to'] : [];
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
		var messageType = this.currentTab == 1 ? 'E' : 'S';
		element.messageType = messageType;
		this.renderForm = { addMode: false, editMode: true, formData: element, viewMode: false };
		this.showComposeMessage = true;
	}

	// messageStatus(element) {
	// console.log(element);
	// }
	messageStatus = (data) => {
		data.user_data.msg_description = data.body;
		this.smsModal.openModal(data.user_data);
	}
	deleteMessageFunc(element) {
		this.commonAPIService.updateMessage({ 'msg_id': element.msg_id, 'msg_status': { status_id: '5', status_name: 'delete' } }).subscribe((result: any) => {
			if (result) {
				this.commonAPIService.showSuccessErrorMessage('Message has been deleted Successfully', 'success');
				if (this.currentTab) {
					this.getEmailScheduleData();
				} else {
					this.getSMSScheduleData();
				}
			} else {
				this.commonAPIService.showSuccessErrorMessage('Error while deleting message', 'error');
			}
		});

	}

	changeTab(event) {
		this.currentTab = event.index;

		if (this.currentTab) {
			this.getEmailScheduleData();
		} else {
			this.getSMSScheduleData();
		}
	}

	getMessage() {
		if (this.currentTab) {
			this.getEmailScheduleData();
		} else {
			this.getSMSScheduleData();
		}
	}

	composeMessage() {
		this.showComposeMessage = true;
		var messageType = this.currentTab == 1 ? 'E' : 'S';
		this.renderForm = { addMode: true, editMode: false, messageType: messageType, formData: '', viewMode: false, };

	}

	resetComposeMessage(messageType) {
		console.log('messageType--', messageType);
		this.showComposeMessage = false;
		if (messageType === 'S') {
			this.currentTab = 0;
			this.getSMSScheduleData();
		} else {
			this.currentTab = 1;
			this.getEmailScheduleData();
		}

	}

	previewImage(imgArray, index) {
		this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
			data: {
				images: imgArray ? imgArray : [],
				index: index
			},
			height: '70vh',
			width: '70vh'
		});
	}

	deleteCancel() {

	}
}
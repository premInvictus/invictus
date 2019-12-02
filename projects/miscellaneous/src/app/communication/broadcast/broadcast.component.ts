import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
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
	renderForm:any = {};
	scheduleMessageData: any[] = [];
	USER_ELEMENT_DATA: any[] = [];
	selectedUserArr: any[] = [];
	allUserSelectFlag = false;
	scheduleMessageDataSource = new MatTableDataSource<Element>(this.USER_ELEMENT_DATA);
	currentTab = 1;
	@ViewChild('deleteModal') deleteModal;
	deleteMessage = 'Are you sure, you want to Deactivate Email Schedule ?';
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
		this.getEmailScheduleData();
	}

	ngAfterViewInit() {
		this.scheduleMessageDataSource.sort = this.sort;
	}

	buildForm() {
		this.broadcastForm = this.fbuild.group({
			contract_from_date: '',
			contract_to_date: ''
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
		this.sisService.getNotificationEmail('').subscribe((result: any) => {
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
		this.sisService.getNotificationSMS('').subscribe((result: any) => {
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
			tempObj['ns_id'] = this.scheduleMessageData[i]['ns_id'];
			tempObj['no'] = counter;
			tempObj['subject'] = this.scheduleMessageData[i]['ns_title'];
			//tempObj['class'] = this.scheduleMessageData[i]['class_name'] + ' - ' + this.scheduleMessageData[i]['sec_name'];
			tempObj['schedule_date'] = this.scheduleMessageData[i]['ns_created_date'];
			//tempObj['schedule_time'] = this.scheduleMessageData[i]['ns_schedule_time'];
			if (this.scheduleMessageData[i]['not_receivers'] === 'S') {
				tempObj['user_type'] = 'Student';
			} else if (this.scheduleMessageData[i]['not_receivers'] === 'P') {
				tempObj['user_type'] = 'Parent';
			} else if (this.scheduleMessageData[i]['not_receivers'] === 'T') {
				tempObj['user_type'] = 'Teacher';
			}
			tempObj['send_by'] = this.scheduleMessageData[i]['created_by'];
			//tempObj['send_to'] = this.scheduleMessageData[i]['au_full_name'] + ', ' + (this.scheduleMessageData[i]['class_name'] && this.scheduleMessageData[i]['sec_name'] ? this.scheduleMessageData[i]['class_name'].toUpperCase() + ' - ' + this.scheduleMessageData[i]['sec_name'].toUpperCase() : this.scheduleMessageData[i]['class_name']).toUpperCase()
			tempObj['attachment'] = JSON.parse(this.scheduleMessageData[i]['ns_attachments']) && JSON.parse(this.scheduleMessageData[i]['ns_attachments']).length > 0 ? this.scheduleMessageData[i]['ns_attachments'] : '';

			tempObj['status'] = this.scheduleMessageData[i]['not_sent_status'] === 'P' ? 'Pending' : this.scheduleMessageData[i]['not_sent_status'] === 'C' ? 'Complete' : 'Failed';
			tempObj['receiver_contact'] = this.scheduleMessageData[i]['not_receiver_contact'];
			tempObj['tpl_id'] = this.scheduleMessageData[i]['tpl_id'];
			tempObj['tpl_title'] = this.scheduleMessageData[i]['tpl_title'];
			tempObj['body'] = this.scheduleMessageData[i]['ns_desc'] ? this.scheduleMessageData[i]['ns_desc'] : '';
			tempObj['user_data'] = this.scheduleMessageData[i]['user_data'] ? this.scheduleMessageData[i]['user_data'] : [];
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

	// editEmail(element) {
	// 	this.router.navigate(['../../notifications/email'], { queryParams: { schedule_id: element.ns_id }, relativeTo: this.route });
	// }

	// viewEmail(element) {
	// 	this.router.navigate(['../../notifications/email'], { queryParams: { view_schedule_id: element.ns_id }, relativeTo: this.route });
	// }

	editMessage(element) {
		var messageType = this.currentTab == 1 ? 'E' : 'S';
		element.messageType = messageType;
		this.renderForm = {addMode:false, editMode:true, formData: element, viewMode : false};
		this.showComposeMessage = true;
	}

	deleteEmail(element) {
		this.sisService.deleteNotificationEmail({ 'ns_id': element.ns_id }).subscribe((result: any) => {
			if (result.status = 'ok') {
				this.getEmailScheduleData();
			}
		});

	} rr

	changeTab(event) {
		this.currentTab = event.index;

		if (this.currentTab) {
			this.getEmailScheduleData();
		} else {
			this.getSMSScheduleData();
		}
	}

	composeMessage() {
		this.showComposeMessage = true;
		var messageType = this.currentTab == 1 ? 'Email' : 'SMS';
		var renderForm = {addMode:true, editMode:false, messageType: 'E', formData:'', viewMode : false,};
		
	}

	resetComposeMessage(messageType) {
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
		console.log('imgArray--', JSON.parse(imgArray));
		this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
			data: {
				images: imgArray ? JSON.parse(imgArray) : [],
				index: index
			},
			height: '70vh',
			width: '70vh'
		});
	}
}
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatDialog } from '@angular/material';

@Component({
	selector: 'app-broadcast',
	templateUrl: './broadcast.component.html',
	styleUrls: ['./broadcast.component.scss']
})
export class BroadcastComponent implements OnInit {
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	showComposeMessage = false;
	displayedColumns: string[] = [
		'no',
		'user_type',
		'send_by',
		'send_to',
		'schedule_date',
		'message',
		'attachment',
		'status',
		'action'
	];
	scheduleEmailData: any[] = [];
	USER_ELEMENT_DATA: any[] = [];
	selectedUserArr: any[] = [];
	allUserSelectFlag = false;
	scheduleEmailDataSource = new MatTableDataSource<Element>(this.USER_ELEMENT_DATA);
	currentTab = 1;
	@ViewChild('deleteModal') deleteModal;
	deleteMessage = 'Are you sure, you want to Deactivate Email Schedule ?';
	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private router: Router,
	) { }

	ngOnInit() {
		this.scheduleEmailDataSource.sort = this.sort;
		this.getEmailScheduleData();
	}

	ngAfterViewInit() {
		this.scheduleEmailDataSource.sort = this.sort;
	}

	openDeleteDialog = (data) => {
		this.deleteModal.openModal(data);
	}


	getEmailScheduleData() {
		this.scheduleEmailData = [];
		this.USER_ELEMENT_DATA = [];
		this.sisService.getNotificationEmail('').subscribe((result: any) => {
			if (result && result.data && result.data[0]) {
				this.scheduleEmailData = result.data;
				this.prepareDataSource();
			}
		});
	}

	prepareDataSource() {
		this.scheduleEmailDataSource = new MatTableDataSource<Element>(this.USER_ELEMENT_DATA);

		let counter = 1;
		for (let i = 0; i < this.scheduleEmailData.length; i++) {
			const tempObj = {};
			tempObj['ns_id'] = this.scheduleEmailData[i]['ns_id'];
			tempObj['no'] = counter;
			tempObj['message'] = this.scheduleEmailData[i]['ns_title'];
			//tempObj['class'] = this.scheduleEmailData[i]['class_name'] + ' - ' + this.scheduleEmailData[i]['sec_name'];
			tempObj['schedule_date'] = this.scheduleEmailData[i]['ns_created_date'];
			//tempObj['schedule_time'] = this.scheduleEmailData[i]['ns_schedule_time'];
			if (this.scheduleEmailData[i]['not_receivers'] === 'S') {
				tempObj['user_type'] = 'Student';
			} else if (this.scheduleEmailData[i]['not_receivers'] === 'P') {
				tempObj['user_type'] = 'Parent';
			} else if (this.scheduleEmailData[i]['not_receivers'] === 'T') {
				tempObj['user_type'] = 'Teacher';
			}
			tempObj['send_by'] = this.scheduleEmailData[i]['created_by'];
			tempObj['send_to'] = this.scheduleEmailData[i]['au_full_name'] + ', ' + (this.scheduleEmailData[i]['class_name'] && this.scheduleEmailData[i]['sec_name'] ? this.scheduleEmailData[i]['class_name'].toUpperCase() + ' - ' + this.scheduleEmailData[i]['sec_name'].toUpperCase() : this.scheduleEmailData[i]['class_name']).toUpperCase()
			tempObj['attachment'] = JSON.parse(this.scheduleEmailData[i]['ns_attachments']) && JSON.parse(this.scheduleEmailData[i]['ns_attachments']).length > 0 ? 'yes' : '-';

			tempObj['status'] = this.scheduleEmailData[i]['not_sent_status'] === 'P' ? 'Pending' : this.scheduleEmailData[i]['not_sent_status'] === 'C' ? 'Complete' : 'Failed';

			this.USER_ELEMENT_DATA.push(tempObj);
			counter++;
		}
		this.scheduleEmailDataSource = new MatTableDataSource(this.USER_ELEMENT_DATA);
		//this.scheduleEmailDataSource.sort = this.sort;
		this.scheduleEmailDataSource.paginator = this.paginator;
		if (this.sort) {
			this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
			this.scheduleEmailDataSource.sort = this.sort;
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

	scheduleEmail() {
		this.router.navigate(['../../notifications/email'], { queryParams: {}, relativeTo: this.route });
	}


	applyFilterUser(filterValue: string) {
		this.scheduleEmailDataSource.filter = filterValue.trim().toLowerCase();
	}

	editEmail(element) {
		this.router.navigate(['../../notifications/email'], { queryParams: { schedule_id: element.ns_id }, relativeTo: this.route });
	}

	viewEmail(element) {
		this.router.navigate(['../../notifications/email'], { queryParams: { view_schedule_id: element.ns_id }, relativeTo: this.route });
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
		}
	}

	composeMessage() {
		this.showComposeMessage = true;
	}
}

import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonAPIService, SisService } from '../../_services/index';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

export interface PeriodicElement {
	no: number;
	subject: string;
	class: string;
	schedule_date: string;
	schedule_time: string;
	user_type: number;
	status: string;
	action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
	{
		no: 1, subject: 'Rajesh', class: 'III', schedule_date: '8452154121', schedule_time: '14-01-2008', user_type: 25,
		status: 'approved', action: 1
	}
];

@Component({
	selector: 'app-email-notification-list',
	templateUrl: './email-notification-list.component.html',
	styleUrls: ['./email-notification-list.component.scss']
})
export class EmailNotificationListComponent implements OnInit, AfterViewInit {
	displayedColumns: string[] = [
		'no',
		'subject',
		'class',
		'schedule_date',
		'schedule_time',
		'user_type',
		'status',
		'action'
	];
	scheduleEmailData: any[] = [];
	USER_ELEMENT_DATA: any[] = [];
	selectedUserArr: any[] = [];
	allUserSelectFlag = false;
	scheduleEmailDataSource = new MatTableDataSource<Element>(this.USER_ELEMENT_DATA);

	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('deleteModal') deleteModal;
	deleteMessage = 'Are you sure, you want to Deactivate Email Schedule ?';


	constructor(private fbuild: FormBuilder, public sanitizer: DomSanitizer,
		private notif: CommonAPIService, private sisService: SisService,
		private router: Router,
		private route: ActivatedRoute) { }

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
			tempObj['subject'] = this.scheduleEmailData[i]['ns_title'];
			tempObj['class'] = this.scheduleEmailData[i]['class_name'] + ' - ' + this.scheduleEmailData[i]['sec_name'];
			tempObj['schedule_date'] = this.scheduleEmailData[i]['ns_schedule_date'];
			tempObj['schedule_time'] = this.scheduleEmailData[i]['ns_schedule_time'];
			if (this.scheduleEmailData[i]['not_receivers'] === 'S') {
				tempObj['user_type'] = 'Student';
			} else if (this.scheduleEmailData[i]['not_receivers'] === 'P') {
				tempObj['user_type'] = 'Parent';
			} else if (this.scheduleEmailData[i]['not_receivers'] === 'T') {
				tempObj['user_type'] = 'Teacher';
			}

			tempObj['status'] = this.scheduleEmailData[i]['ns_schedule_status'] === 'S' ? 'Scheduled' : 'Immediate';

			this.USER_ELEMENT_DATA.push(tempObj);
			counter++;
		}
		this.scheduleEmailDataSource = new MatTableDataSource(this.USER_ELEMENT_DATA);
		this.scheduleEmailDataSource.sort = this.sort;
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

	}
	isExistUserAccessMenu(mod_id) {
		return this.notif.isExistUserAccessMenu(mod_id);
	}
	deleteCancel() { }
}

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
	selector: 'app-sms-notification-list',
	templateUrl: './sms-notification-list.component.html',
	styleUrls: ['./sms-notification-list.component.scss']
})
export class SmsNotificationListComponent implements OnInit, AfterViewInit {
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
	scheduleSMSData: any[] = [];
	USER_ELEMENT_DATA: any[] = [];
	selectedUserArr: any[] = [];
	allUserSelectFlag = false;
	scheduleSMSDataSource = new MatTableDataSource<Element>(this.USER_ELEMENT_DATA);

	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('deleteModal') deleteModal;
	deleteMessage = 'Are you sure, you want to Deactivate SMS Schedule ?';
	constructor(private fbuild: FormBuilder, public sanitizer: DomSanitizer,
		private notif: CommonAPIService, private sisService: SisService,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		this.scheduleSMSDataSource.sort = this.sort;
		this.getSMSScheduleData();
	}

	ngAfterViewInit() {
		this.scheduleSMSDataSource.sort = this.sort;
	}

	openDeleteDialog = (data) => {
		this.deleteModal.openModal(data);
	}


	getSMSScheduleData() {
		this.scheduleSMSData = [];
		this.USER_ELEMENT_DATA = [];
		this.sisService.getNotificationSMS('').subscribe((result: any) => {
			if (result && result.data && result.data[0]) {
				this.scheduleSMSData = result.data;
				this.prepareDataSource();
			}
		});
	}

	prepareDataSource() {
		this.scheduleSMSDataSource = new MatTableDataSource<Element>(this.USER_ELEMENT_DATA);

		let counter = 1;
		for (let i = 0; i < this.scheduleSMSData.length; i++) {
			const tempObj = {};
			tempObj['ns_id'] = this.scheduleSMSData[i]['ns_id'];
			tempObj['no'] = counter;
			tempObj['subject'] = this.scheduleSMSData[i]['ns_title'];
			tempObj['class'] = this.scheduleSMSData[i]['class_name'] ? this.scheduleSMSData[i]['class_name'] : 'N/A' + ' - ' +
				this.scheduleSMSData[i]['sec_name'];
			tempObj['schedule_date'] = this.scheduleSMSData[i]['ns_schedule_date'];
			tempObj['schedule_time'] = this.scheduleSMSData[i]['ns_schedule_time'];
			if (this.scheduleSMSData[i]['not_receivers'] === 'S') {
				tempObj['user_type'] = 'Student';
			} else if (this.scheduleSMSData[i]['not_receivers'] === 'P') {
				tempObj['user_type'] = 'Parent';
			} else if (this.scheduleSMSData[i]['not_receivers'] === 'T') {
				tempObj['user_type'] = 'Teacher';
			}

			tempObj['status'] = this.scheduleSMSData[i]['ns_status'] === '1' ? 'Immediate' : 'Scheduled';

			this.USER_ELEMENT_DATA.push(tempObj);
			counter++;
		}
		this.scheduleSMSDataSource = new MatTableDataSource(this.USER_ELEMENT_DATA);
		this.scheduleSMSDataSource.sort = this.sort;
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

	scheduleSMS() {
		this.router.navigate(['../../notifications/sms'], { queryParams: {}, relativeTo: this.route });
	}


	applyFilterUser(filterValue: string) {
		this.scheduleSMSDataSource.filter = filterValue.trim().toLowerCase();
	}

	editSMS(element) {
		this.router.navigate(['../../notifications/sms'], { queryParams: { schedule_id: element.ns_id }, relativeTo: this.route });
	}

	viewSMS(element) {
		this.router.navigate(['../../notifications/sms'], { queryParams: { view_schedule_id: element.ns_id }, relativeTo: this.route });
	}

	deleteSMS(element) {
		this.sisService.deleteNotificationSMS({ 'ns_id': element.ns_id }).subscribe((result: any) => {
			if (result.status = 'ok') {
				this.getSMSScheduleData();
			}
		});

	}
	deleteCancel() { }
	isExistUserAccessMenu(mod_id) {
		return this.notif.isExistUserAccessMenu(mod_id);
	}
}

import { Component, OnInit } from '@angular/core';
import { CommonAPIService } from '../../_services/index';
import { NotificationModal } from './notification.model';
import { MatDialogRef, MatDialog, } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
	selector: 'app-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

	notficationMsg: any[] = [];
	currentUser: any;
	constructor(private commonAPIService: CommonAPIService, private dialog: MatDialog, private router: Router,
		private route: ActivatedRoute) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}

	ngOnInit() {
		this.getPushNotification();
	}
	getPushNotification() {
		this.commonAPIService.getPushNotification({ 'msg_to': this.currentUser.login_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.notficationMsg = result.data;
				console.log(this.notficationMsg);
			} else {
				this.notficationMsg = [];
			}
		});
	}
	redirectModule(event) {
		event.msg_to[0].msg_status = [
			{
				'status_name': 'send'
			}, {
				'status_name': 'read'
			}];
		this.commonAPIService.updateMessage(event).subscribe((result: any) => {
			if (result.status === 'ok') {
				// if (event.notification_type.module === 'syllabus') {
				// 	this.router.navigate(['../academics/view-classwork'], { relativeTo: this.route });
				// }
				// if (event.notification_type.module === 'assignment') {
				// 	this.router.navigate(['../academics/assignment'], { relativeTo: this.route });
				// }
				// if (event.notification_type.module === 'fees') {
				// 	this.router.navigate(['../fees/student-fee-detail'], { relativeTo: this.route });
				// }
				// if (event.notification_type.module === 'classwork') {
				// 	this.router.navigate(['../academics/view-classwork'], { relativeTo: this.route });
				// }
				// if (event.notification_type.module === 'leave') {
				// 	this.router.navigate(['../academics/leave'], { relativeTo: this.route });
				// }
				// if (event.notification_type.module === 'timetable') {
				// 	this.router.navigate(['../academics/timetable'], { relativeTo: this.route });
				// }
			} else {
				// if (event.notification_type.module === 'syllabus') {
				// 	this.router.navigate(['../academics/view-classwork'], { relativeTo: this.route });
				// }
				// if (event.notification_type.module === 'assignment') {
				// 	this.router.navigate(['../academics/assignment'], { relativeTo: this.route });
				// }
				// if (event.notification_type.module === 'fees') {
				// 	this.router.navigate(['../fees/student-fee-detail'], { relativeTo: this.route });
				// }
				// if (event.notification_type.module === 'classwork') {
				// 	this.router.navigate(['../academics/view-classwork'], { relativeTo: this.route });
				// }
				// if (event.notification_type.module === 'leave') {
				// 	this.router.navigate(['../academics/leave'], { relativeTo: this.route });
				// }
				// if (event.notification_type.module === 'timetable') {
				// 	this.router.navigate(['../academics/timetable'], { relativeTo: this.route });
				// }
			}
		});
	}
	deleteNofiy(event) {
		event.msg_to[0].msg_status = [
			{
				'status_name': 'send'
			}, {
				'status_name': 'delete'
			}];
		this.commonAPIService.updateMessage(event).subscribe((result: any) => {
			if (result) {
				this.getPushNotification();
				this.commonAPIService.showSuccessErrorMessage('Notification deleted Successfully', 'success');
			} else {
				this.commonAPIService.showSuccessErrorMessage('Some error Occur !!', 'success');
			}
		});
	}
}

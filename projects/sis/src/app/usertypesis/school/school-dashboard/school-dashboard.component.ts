import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SisService, CommonAPIService, ProcesstypeService } from '../../../_services/index';
@Component({
	selector: 'app-school-dashboard',
	templateUrl: './school-dashboard.component.html',
	styleUrls: ['./school-dashboard.component.scss']
})
export class SchoolDashboardComponent implements OnInit {
	cardData: any;
	classWiseStudentDashboard: any[] = [];
	studentBirthdayDashboard: any[] = [];
	notificationsDashboard: any[] = [];

	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(private sisService: SisService,
		private common: CommonAPIService,
		private processtypeService: ProcesstypeService) { }

	ngOnInit() {
		this.getProcessCardData();
		this.getStudentClassWiseDashboard();
		this.getStudentBirthdayDashboard();
		this.getMessageNotification();
	}

	getProcessCardData() {
		this.sisService.getCountStudentDashboard().subscribe((result: any) => {
			if (result.status === 'ok') {
				if (result.data) {
					this.cardData = result.data[0];
				}
			}
		});
	}

	parseInt(string) {
		return parseInt(string, 10);
	}

	getStudentClassWiseDashboard() {
		this.sisService.getStudentClasswiseDashboard().subscribe((result: any) => {
			if (result.status === 'ok') {
				if (result.data) {
					this.classWiseStudentDashboard = result.data;
					let counter = 1;
					let total = 0;
					let boyTotal = 0;
					let girlTotal = 0;
					let otherTotal = 0;
					for (let i = 0; i < this.classWiseStudentDashboard.length; i++) {
						const tempObj = {};
						total = total + this.classWiseStudentDashboard[i]['Total'];
						boyTotal = boyTotal + parseInt(this.classWiseStudentDashboard[i]['Boys'], 10);
						girlTotal = girlTotal + parseInt(this.classWiseStudentDashboard[i]['Girls'], 10);
						otherTotal = otherTotal + parseInt(this.classWiseStudentDashboard[i]['Other'], 10);
						counter++;
					}

					const blankTempObj = {};
					blankTempObj['class_name'] = '<b>Total</b>';
					blankTempObj['Boys'] = '<b>' + boyTotal + '</b>';
					blankTempObj['Girls'] = '<b>' + girlTotal + '</b>';
					blankTempObj['Other'] = '<b>' + otherTotal + '</b>';
					blankTempObj['Total'] = '<b>' + total + '</b>';
					this.classWiseStudentDashboard.push(blankTempObj);

				}
			}
		});
	}

	getStudentBirthdayDashboard() {
		this.sisService.getStudentBirthdayDashboard().subscribe((result: any) => {
			if (result.status === 'ok') {
				if (result.data) {
					this.studentBirthdayDashboard = result.data;
				}
			}
		});
	}

	getMessageNotification() {
		this.sisService.getNotificationsDashboard().subscribe((result: any) => {
			if (result.status === 'ok') {
				if (result.data) {
					this.notificationsDashboard = result.data;
				}
			}
		});
	}
}




import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SisService, CommonAPIService, ProcesstypeService } from '../../../_services/index';
import { BranchChangeService } from 'src/app/_services/branchChange.service';
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
	classBGChart: any = {};
	classBGChartFlag = false;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	schoolInfo: any;

	constructor(private sisService: SisService,
		private common: CommonAPIService,
		private processtypeService: ProcesstypeService,
		private branchChangeService: BranchChangeService) { }

	ngOnInit() {
		this.getSchool();
		this.getProcessCardData();
		this.getStudentClassWiseDashboard();
		this.getStudentBirthdayDashboard();
		this.getMessageNotification();
		this.branchChangeService.branchSwitchSubject.subscribe((data:any)=>{
			if(data) {
				this.getSchool();
				this.getProcessCardData();
				this.getStudentClassWiseDashboard();
				this.getStudentBirthdayDashboard();
				this.getMessageNotification();
			}
		});
	}
	classBGChartCalculation(xcategories, boy, girl) {
		this.classBGChartFlag = true;
		this.classBGChart = {
			chart: {
				type: 'column'
			},
			title: {
				text: ''
			},
			subtitle: {
				text: ''
			},
			xAxis: {
				categories: xcategories,
				crosshair: true
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Students'
				}
			},
			tooltip: {
				headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
				pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
					'<td style="padding:0"><b>{point.y} </b></td></tr>',
				footerFormat: '</table>',
				shared: true,
				useHTML: true
			},
			plotOptions: {
				column: {
					pointPadding: 0.2,
					borderWidth: 0
				}
			},
			series: [{
				name: 'Boys',
				data: boy,
				color: '#4b7aec'
			}, {
				name: 'Girls',
				data: girl,
				color: '#2cde80'

			}]
		};
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
					const boyArray: any[] = [];
					const girlArray: any[] = [];
					const xcategories: any[] = [];
					for (let i = 0; i < this.classWiseStudentDashboard.length; i++) {
						const tempObj = {};
						const boys = this.classWiseStudentDashboard[i]['Boys'] ? Number(this.classWiseStudentDashboard[i]['Boys']) : 0;
						const girls = this.classWiseStudentDashboard[i]['Girls'] ? Number(this.classWiseStudentDashboard[i]['Girls']) : 0;
						boyArray.push(boys);
						girlArray.push(girls);
						total = total + this.classWiseStudentDashboard[i]['Total'];
						boyTotal = boyTotal + boys;
						girlTotal = girlTotal + girls;
						xcategories.push(this.classWiseStudentDashboard[i]['class_name']);
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
					this.classBGChartCalculation(xcategories, boyArray, girlArray);

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
	getSchool() {
		this.common.getSchoolDetails().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.schoolInfo = result.data[0];
			}
		});
	}
}




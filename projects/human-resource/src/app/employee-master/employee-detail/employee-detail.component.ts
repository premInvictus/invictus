import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { EmployeeCommonComponent } from '../employee-common/employee-common.component';
// import { EmployeeTabOneContainerComponent } from '../employee-tab-one-container/employee-tab-one-container.component';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';

@Component({
	selector: 'app-employee-detail',
	templateUrl: './employee-detail.component.html',
	styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
	//@ViewChild(EmployeeCommonComponent) employeedetails: EmployeeCommonComponent;
	
	tabSelectedIndex = 0;
	rendorForm = false;
	formsTab: any[] = [];
	settingsArray: any[] = [];
	reRenderFormSubscription: any;
	reRenderTabSubscription: any;
	employeeRecord: any = {};
	constructor(
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService
	) { }

	ngOnInit() {
		console.log('in employee detail');
		this.getEmployeeNavigationRecords();
	}

	getEmployeeNavigationRecords() {
		console.log('in employee navigation');
		this.commonAPIService.getEmployeeNavigationRecords({}).subscribe((result: any) => {
			console.log('result', result);
			this.getEmployeeDetail(result[0].emp_id);
		});
	}

	getEmployeeDetail(emp_id) {
		console.log('in employee get navigation');
		this.commonAPIService.getEmployeeDetail({emp_id:emp_id}).subscribe((result: any) => {
			console.log('result', result);
			this.employeeRecord = result;
			this.rendorForm = true;
		});
	}

	setTabValue(value) {
		this.tabSelectedIndex = value;
		this.commonAPIService.tabChange.next({ 'currrentTab': this.tabSelectedIndex });
	}
}

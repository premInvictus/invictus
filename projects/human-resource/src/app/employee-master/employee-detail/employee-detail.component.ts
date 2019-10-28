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
	employeeDataSubscripton:any;
	employeeRecord: any = {};
	constructor(
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService
	) { }

	ngOnInit() {
		this.reRenderFormSubscription = this.commonAPIService.reRenderForm.subscribe((data: any) => {
			if (data && data.reRenderForm) {
				this.tabSelectedIndex = 0;
				this.getEmployeeNavigationRecords();
			}
			if (data && data.addMode) {
				this.tabSelectedIndex = 0;
			}
			// if (data && (data.viewMode || data.editMode)) {
			// 	for (let i = 0; i < this.formsTab.length; i++) {
			// 		this.formEnabledTwoService.setFormEnabled(i);
			// 	}
			// }

		});

		this.reRenderTabSubscription = this.commonAPIService.renderTab.subscribe((data: any) => {
			if (data && data.tabMove) {
				this.tabSelectedIndex += 1;
			}
		});

		this.employeeDataSubscripton = this.commonAPIService.employeeData.subscribe((data: any)=> {
			console.log('fdg', data);
			if (data && data.last_record) {
				this.getEmployeeDetail(data.last_record);
			}
		});

		this.getEmployeeNavigationRecords();
		
	}

	getEmployeeNavigationRecords() {
		this.commonAPIService.getEmployeeNavigationRecords({}).subscribe((result: any) => {
			console.log('employee navigation records', result);
			this.getEmployeeDetail(result.last_record);
		});
	}

	getEmployeeDetail(emp_id) {
		this.commonAPIService.getEmployeeDetail({emp_id:emp_id}).subscribe((result: any) => {
			this.employeeRecord = result;
			
			this.rendorForm = true;
		});
	}

	setTabValue(value) {
		this.tabSelectedIndex = value;
		this.commonAPIService.tabChange.next({ 'currrentTab': this.tabSelectedIndex });
	}
}

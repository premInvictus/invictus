import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { EmployeeCommonComponent } from '../employee-common/employee-common.component';
// import { EmployeeTabOneContainerComponent } from '../employee-tab-one-container/employee-tab-one-container.component';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { EmployeeCommonComponent } from '../employee-common/employee-common.component';
@Component({
	selector: 'app-employee-detail',
	templateUrl: './employee-detail.component.html',
	styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
	@ViewChild(EmployeeCommonComponent) employeeCommonDetails: EmployeeCommonComponent;

	tabSelectedIndex = 0;
	rendorForm = false;
	formsTab: any[] = [];
	settingsArray: any[] = [];
	reRenderFormSubscription: any;
	reRenderTabSubscription: any;
	employeeDataSubscripton: any;
	employeeRecord: any = {};
	rowRen = true;
	emp_code_no = 0;
	constructor(
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService
	) {

	}

	ngOnInit() {
		this.reRenderFormSubscription = this.commonAPIService.reRenderForm.subscribe((data: any) => {
			console.log('render form subs');
			if (data && data.reRenderForm) {
				this.tabSelectedIndex = 0;
				this.getEmployeeNavigationRecords();
			}
			if (data && data.addMode) {
				this.tabSelectedIndex = 0;
				this.employeeRecord = {};
			}
		});

		this.reRenderTabSubscription = this.commonAPIService.renderTab.subscribe((data: any) => {
			console.log('render tab');
			if (data && data.tabMove && data.renderForLast) {
				this.tabSelectedIndex = 0;
				this.getEmployeeNavigationRecords();
			} else if (data && data.tabMove && data.renderForAdd) {
				this.tabSelectedIndex += 1;
				this.getEmployeeNavigationRecords();
			} else if (data && data.tabMove) {
				this.tabSelectedIndex += 1;
			}
		});

		this.employeeDataSubscripton = this.commonAPIService.employeeData.subscribe((data: any) => {

			if (data && data.last_record) {
				this.emp_code_no = data.last_record;
				console.log('data last record1--', data);
				this.getEmployeeDetail(data.last_record);
			}
		});





		this.getEmployeeNavigationRecords();

	}

	getEmployeeNavigationRecords() {
		console.log('in navigation', this.rowRen, this.emp_code_no);
		var empId = this.commonAPIService.getSubscribedEmployee();
		if (empId) {
			this.getEmployeeDetail(empId);
		} else {
			this.commonAPIService.getEmployeeNavigationRecords({}).subscribe((result: any) => {
				console.log('72', this.emp_code_no);
				this.getEmployeeDetail(result.last_record);

			});
		}

	}

	getEmployeeDetail(emp_code_no) {
		if (emp_code_no) {
			this.commonAPIService.getEmployeeDetail({ emp_code_no: Number(emp_code_no) }).subscribe((result: any) => {
				var finResult = result ? result : {}
				finResult['last_record'] = emp_code_no ? emp_code_no : 0;
				this.employeeRecord = finResult;
				this.rendorForm = true;

			});
		}
	}

	setTabValue(value) {
		this.tabSelectedIndex = value;
		this.commonAPIService.tabChange.next({ 'currrentTab': this.tabSelectedIndex });
	}

	isExistUserAccessMenu(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id)
	}
}

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { EmpEnqCommonComponent } from '../emp-enq-common/emp-enq-common.component';
@Component({
	selector: 'app-emp-enq-details',
	templateUrl: './emp-enq-details.component.html',
	styleUrls: ['./emp-enq-details.component.scss']
})
export class EmpEnqDetailsComponent implements OnInit {
	@ViewChild(EmpEnqCommonComponent) employeeCommonDetails: EmpEnqCommonComponent;

	tabSelectedIndex = 0;
	rendorForm = false;
	formsTab: any[] = [];
	settingsArray: any[] = [];
	reRenderFormSubscription: any;
	reRenderTabSubscription: any;
	employeeDataSubscripton: any;
	employeeRecord: any = {};
	constructor(
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService
	) { }


	ngOnInit() {
		console.log(this.employeeCommonDetails);
		this.reRenderFormSubscription = this.commonAPIService.reRenderForm.subscribe((data: any) => {
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
				this.getEmployeeDetail(data.last_record);
			}
		});

		this.getEmployeeNavigationRecords();

	}

	getEmployeeNavigationRecords() {
		this.commonAPIService.getEmployeeNavigationRecords({}).subscribe((result: any) => {
			this.getEmployeeDetail(result.last_record);
		});
	}

	getEmployeeDetail(emp_id) {
		if (emp_id) {
			this.commonAPIService.getEmployeeDetail({ emp_id: Number(emp_id) }).subscribe((result: any) => {
				var finResult = result ? result : {}
				finResult['last_record'] = emp_id ? emp_id : 0;
				this.employeeRecord = finResult;
				this.rendorForm = true;
			});
		}
	}

	setTabValue(value) {
		this.tabSelectedIndex = value;
		this.commonAPIService.tabChange.next({ 'currrentTab': this.tabSelectedIndex });
	}
}


import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatDialog } from '@angular/material';
@Component({
	selector: 'app-employee-attendance',
	templateUrl: './employee-attendance.component.html',
	styleUrls: ['./employee-attendance.component.scss']
})
export class EmployeeAttendanceComponent implements OnInit {
	employeeForm: FormGroup;
	searchForm: FormGroup;
	formGroupArray: any[] = [];

	EMPLOYEE_ELEMENT: EmployeeElement[] = [];
	employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
	displayedEmployeeColumns: string[] = ['srno', 'emp_id', 'emp_name', 'emp_designation', 'emp_present', 'emp_leave_availed', 'emp_leave_granted', 'emp_lwp', 'emp_total_attendance', 'emp_balance_leaves', 'emp_remarks', 'emp_status'
	];


	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService
	) { }

	ngOnInit() {
		this.buildForm();
		this.getEmployeeDetail();
	}

	buildForm() {
		this.searchForm = this.fbuild.group({
			month_id: '',
			status_id: '',
			cat_id: ''
		});
	}

	getEmployeeDetail() {
		this.commonAPIService.getEmployeeDetail({}).subscribe((result: any) => {
			let element: any = {};
			let recordArray = [];
			this.EMPLOYEE_ELEMENT = [];
			this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
			if (result && result.length > 0) {
				let pos = 1;
				let recordArray = result;
				this.formGroupArray = [];
				for (const item of result) {
					this.formGroupArray.push({
						formGroup: this.fbuild.group({
							emp_id: item.emp_id,
							emp_present: item.emp_present ? item.emp_present : '',
							emp_leave_granted: item.emp_leave_granted ? item.emp_leave_granted : '',
							emp_remarks: item.emp_remarks ? item.emp_remarks : '',
						})
					});
				}
				for (const item of recordArray) {
					element = {
						srno: pos,
						emp_id: item.emp_id,
						emp_name: item.emp_name,
						emp_designation: item.emp_designation_detail.des_name,
						emp_leave_availed: '',
						emp_leave_granted: '',
						emp_lwp: '',
						emp_total_attendance: '',
						emp_balance_leaves: '',
						emp_remarks: '',
						emp_status: item.emp_status ? item.emp_status : 'Live',
					};
					this.EMPLOYEE_ELEMENT.push(element);
					pos++;

				}
				this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
			}
		});
	}

	saveEmployeeAttendance() {
		let inputJson = {
			emp_id: '',
			emp_name: '',
			emp_designation: '',
			emp_present: '',
			emp_leave_granted: '',
			emp_remarks: '',
			emp_leave_availed: '',
			emp_lwp: '',
			emp_total_attendance: '',
			emp_balance_leaves: '',
			emp_status: '',
		};
		console.log('this.EMPLOYEE_ELEMENT', this.EMPLOYEE_ELEMENT);
		for (var i = 0; i < this.EMPLOYEE_ELEMENT.length;i++) {
			console.log(this.formGroupArray[i]);
			if (this.EMPLOYEE_ELEMENT[i]['emp_id'] === this.formGroupArray[i]['value']['emp_id']) {
				inputJson.emp_id = this.EMPLOYEE_ELEMENT[i]['emp_id'];
				inputJson.emp_name = this.EMPLOYEE_ELEMENT[i]['emp_name'];
				inputJson.emp_designation = this.EMPLOYEE_ELEMENT[i]['emp_designation'];
				inputJson['emp_month_attendance_data'] = {"attendance_ses_id " : [
					{
						"month_id" : "",
						"month_name" : "",
						"attendance_detail" : {
							"emp_present" : this.formGroupArray[i]['value']['emp_present'],
							"emp_leave_granted" : this.formGroupArray[i]['value']['emp_leave_granted'],
							"emp_remarks" : this.formGroupArray[i]['value']['emp_remarks'],
							"emp_leave_availed" : '',
							"emp_lwp" : '',
							"emp_total_attendance" : '',
							"emp_balance_leaves" : '',
							"emp_status" : this.EMPLOYEE_ELEMENT[i]['emp_status'],
						}
					}
				]};
			}
		}

		
		// this.commonAPIService.getEmployeeDetail({}).subscribe((result: any) => {

		// });
	}

	confirmEmployeeAttendance() {

	}


}

export interface EmployeeElement {
	srno: number;
	emp_id: string;
	emp_name: string;
	emp_designation: string;
	emp_present: any;
	emp_leave_availed: string;
	emp_leave_granted: any;
	emp_lwp: string;
	emp_total_attendance: string;
	emp_balance_leaves: string;
	emp_remarks: any;
	emp_status: string;
}

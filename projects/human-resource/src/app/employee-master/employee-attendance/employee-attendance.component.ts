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
	@ViewChild('paginator') paginator: MatPaginator;
  	@ViewChild(MatSort) sort: MatSort;
	employeeForm: FormGroup;
	searchForm: FormGroup;
	formGroupArray: any[] = [];
	editFlag = false;
	employeeData: any[] = [];
	EMPLOYEE_ELEMENT: EmployeeElement[] = [];
	session_id;
	employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
	displayedEmployeeColumns: string[] = ['srno', 'emp_id', 'emp_name', 'emp_designation', 'emp_balance_leaves', 'emp_present', 'emp_leave_availed', 'emp_leave_granted', 'emp_lwp', 'emp_total_attendance', 'emp_remarks', 'emp_status', 'action'
	];
	currentMonthName = '';
	currentStatusName = '';
	currentCategoryName = '';
	
	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService
	) {

		this.session_id = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
		this.buildForm();
	}

	buildForm() {
		this.searchForm = this.fbuild.group({
			month_id: '',
			status_id: '',
			cat_id: '',

		});
		// this.employeeForm = this.fbuild.group({
		// 	search_id: ''

		// });
	}

	getEmployeeDetail() {
		if (this.searchForm.value.month_id) {
			let inputJson = {
				month_id: this.searchForm.value.month_id,
				emp_status: this.searchForm.value.status_id,
				emp_cat_id: this.searchForm.value.cat_id,
				session_id: this.session_id
			};
			this.commonAPIService.getAllEmployee(inputJson).subscribe((result: any) => {
				let element: any = {};
				let recordArray = [];
				this.employeeData = result;
				this.EMPLOYEE_ELEMENT = [];
				this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
				if (result && result.length > 0) {
					let pos = 1;
					let recordArray = result;
					this.formGroupArray = [];

					for (const item of result) {
						var emp_month; 
						var emp_attendance_detail ;
						if (item.emp_month_attendance_data.length > 0) {
							for (var i = 0; i < item.emp_month_attendance_data.length; i++) {
								emp_month = item.emp_month_attendance_data[i].month_id;
								emp_attendance_detail = item.emp_month_attendance_data[i];
								console.log(parseInt(this.searchForm.value.month_id, 10), parseInt(emp_month, 10));
								if (parseInt(this.searchForm.value.month_id, 10) === parseInt(emp_month, 10)) {
									this.formGroupArray.push({
										formGroup: this.fbuild.group({
											emp_id: item.emp_id,
											emp_present: emp_attendance_detail.attendance_detail.emp_present ? emp_attendance_detail.attendance_detail.emp_present : '',
											emp_leave_granted: emp_attendance_detail.attendance_detail.emp_leave_granted ? emp_attendance_detail.attendance_detail.emp_leave_granted : '',
											emp_remarks: emp_attendance_detail.attendance_detail.emp_remarks ? emp_attendance_detail.attendance_detail.emp_remarks : '',
											emp_leave_availed: emp_attendance_detail.attendance_detail.emp_leave_availed ? emp_attendance_detail.attendance_detail.emp_leave_availed : '',
											emp_total_attendance: emp_attendance_detail.attendance_detail.emp_total_attendance ? emp_attendance_detail.attendance_detail.emp_total_attendance : '',
											emp_balance_leaves: emp_attendance_detail.attendance_detail.emp_balance_leaves ? emp_attendance_detail.attendance_detail.emp_balance_leaves : '',
											emp_lwp: emp_attendance_detail.attendance_detail.emp_lwp ? emp_attendance_detail.attendance_detail.emp_lwp : '',

											editFlag: emp_attendance_detail.attendance_detail.emp_present ? false : true
										})
									});
								} else {
									this.formGroupArray.push({
										formGroup: this.fbuild.group({
											emp_id: item.emp_id,
											emp_present: item.emp_present ? item.emp_present : '',
											emp_leave_granted: item.emp_leave_granted ? item.emp_leave_granted : '',
											emp_remarks: item.emp_remarks ? item.emp_remarks : '',
											emp_leave_availed: '',
											emp_total_attendance: '',
											emp_balance_leaves: '',
											editFlag: true
										})
									});
								}
							}
						} else {
							this.formGroupArray.push({
								formGroup: this.fbuild.group({
									emp_id: item.emp_id,
									emp_present: item.emp_present ? item.emp_present : '',
									emp_leave_granted: item.emp_leave_granted ? item.emp_leave_granted : '',
									emp_remarks: item.emp_remarks ? item.emp_remarks : '',
									emp_leave_availed: '',
									emp_total_attendance: '',
									emp_balance_leaves: '',
									editFlag: true
								})
							});
						}

						element = {
							srno: pos,
							emp_id: item.emp_id,
							emp_name: item.emp_name,
							emp_designation: item.emp_designation_detail.des_name,
							emp_balance_leaves: '30',
							emp_lwp: emp_attendance_detail.attendance_detail.emp_lwp ? emp_attendance_detail.attendance_detail.emp_lwp: '',
							emp_total_attendance: emp_attendance_detail.attendance_detail.emp_total_attendance ? emp_attendance_detail.attendance_detail.emp_total_attendance: '',
							emp_status: item.emp_status ? item.emp_status : 'live',
							action: item
						};


						this.EMPLOYEE_ELEMENT.push(element);
						pos++;

						this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
						this.employeedataSource.paginator = this.paginator;
						if (this.sort) {
							this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
							this.employeedataSource.sort = this.sort;
						}
					}
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please Choose Atlease one month', 'error');
		}

	}

	saveEmployeeAttendance() {
		let inputJson = {};
		let employeeArrData = [];
		for (var i = 0; i < this.EMPLOYEE_ELEMENT.length; i++) {
			if (this.EMPLOYEE_ELEMENT[i]['emp_id'] === this.formGroupArray[i].formGroup.value.emp_id) {

				inputJson = {
					"session_id": this.session_id,
					"month_id": this.searchForm.value.month_id,
					"month_name": this.currentMonthName,
					"attendance_detail": {
						"emp_present": this.formGroupArray[i].formGroup.value.emp_present,
						"emp_leave_granted": this.formGroupArray[i].formGroup.value.emp_leave_granted,
						"emp_remarks": this.formGroupArray[i].formGroup.value.emp_remarks,
						"emp_leave_availed": this.formGroupArray[i].formGroup.value.emp_leave_availed,
						"emp_lwp": this.EMPLOYEE_ELEMENT[i]['emp_lwp'],
						"emp_total_attendance": this.EMPLOYEE_ELEMENT[i]['emp_total_attendance'],
						"emp_balance_leaves": this.EMPLOYEE_ELEMENT[i]['emp_balance_leaves'],
					}
				};
				var flag = false;
				for (var j = 0; j < this.employeeData[i]['emp_month_attendance_data'].length; j++) {
					if (parseInt(this.employeeData[i]['emp_month_attendance_data'][j].month_id, 10) === parseInt(this.searchForm.value.month_id, 10)) {
						this.employeeData[i]['emp_month_attendance_data'] = inputJson;
						flag = true;
					} else {
						flag = false;
					}
				}
				if (!flag) {
					this.employeeData[i]['emp_month_attendance_data'].push(inputJson);
				}


			}
		}
		//console.log('this.employeeData', this.employeeData);
		this.commonAPIService.updateEmployee(this.employeeData).subscribe((result: any) => {

		});
	}

	resetEmployeeAttendance() {
		this.getEmployeeDetail();
	}

	editAttendance(emp_id) {
		this.editFlag = true;
	}

	goToEmployee(emp_id) {

	}

	getLWP(element, index) {
		console.log(this.formGroupArray[index]);
		console.log(this.formGroupArray[index].formGroup.value);
		console.log(parseInt(this.formGroupArray[index].formGroup.value.emp_leave_availed, 10) - parseInt(this.formGroupArray[index].formGroup.value.emp_leave_granted, 10));

		this.EMPLOYEE_ELEMENT[index]['emp_lwp'] = (parseInt(this.formGroupArray[index].formGroup.value.emp_leave_availed, 10) - parseInt(this.formGroupArray[index].formGroup.value.emp_leave_granted, 10)).toString();
		this.EMPLOYEE_ELEMENT[index]['emp_total_attendance'] = (parseInt(this.formGroupArray[index].formGroup.value.emp_present, 10) + parseInt(this.formGroupArray[index].formGroup.value.emp_leave_availed, 10) - parseInt(this.formGroupArray[index].formGroup.value.emp_leave_granted, 10)).toString();

	}

	getMonthName(ev) {
		this.currentMonthName = ev.source.selected.viewValue;
	}
	getStatusName(ev) {
		this.currentStatusName = ev.source.selected.viewValue;
	}

	getCategoryName(ev) {
		this.currentCategoryName = ev.source.selected.viewValue;
	}

	cancelUpdate(element, index) {
		this.getEmployeeDetail();
	}

	updateAttendance(element) {
		let inputJson = {};
		let employeeArrData = [];
		for (var i = 0; i < this.EMPLOYEE_ELEMENT.length; i++) {
			if (this.EMPLOYEE_ELEMENT[i]['emp_id'] === element.emp_id) {

				inputJson = {
					"session_id": this.session_id,
					"month_id": this.searchForm.value.month_id,
					"month_name": this.currentMonthName,
					"attendance_detail": {
						"emp_present": this.formGroupArray[i].formGroup.value.emp_present,
						"emp_leave_granted": this.formGroupArray[i].formGroup.value.emp_leave_granted,
						"emp_remarks": this.formGroupArray[i].formGroup.value.emp_remarks,
						"emp_leave_availed": this.formGroupArray[i].formGroup.value.emp_leave_availed,
						"emp_lwp": this.EMPLOYEE_ELEMENT[i]['emp_lwp'],
						"emp_total_attendance": this.EMPLOYEE_ELEMENT[i]['emp_total_attendance'],
						"emp_balance_leaves": this.EMPLOYEE_ELEMENT[i]['emp_balance_leaves'],
					}
				};
				var flag = false;
				for (var j = 0; j < this.employeeData[i]['emp_month_attendance_data'].length; j++) {
					if (parseInt(this.employeeData[i]['emp_month_attendance_data'][j].month_id, 10) === parseInt(this.searchForm.value.month_id, 10)) {
						this.employeeData[i]['emp_month_attendance_data'] = inputJson;
						flag = true;
					} else {
						flag = false;
					}
				}
				if (!flag) {
					this.employeeData[i]['emp_month_attendance_data'].push(inputJson);
				}


			}
		}
		//console.log('this.employeeData', this.employeeData);
		this.commonAPIService.updateEmployee(this.employeeData).subscribe((result: any) => {

		});
	}

	applyFilter(filterValue:String) {
		console.log('filterValue', filterValue);
		this.employeedataSource.filter = filterValue.trim().toLowerCase();
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
	action: any;
}

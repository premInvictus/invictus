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
	//editFlag = false;
	employeeData: any[] = [];
	EMPLOYEE_ELEMENT: EmployeeElement[] = [];
	COPY_EMPLOYEE_ELEMENT: EmployeeElement[] = [];
	session_id;
	categoryOneArray: any[] = [];
	employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
	//'emp_present',
	displayedEmployeeColumns: string[] = ['srno', 'emp_id', 'emp_name', 'emp_designation', 'emp_balance_leaves', 'emp_leave_availed', 'emp_leave_granted', 'emp_lwp', 'emp_total_attendance', 'emp_remarks', 'emp_status', 'action'
	];
	currentMonthName = '';
	currentStatusName = '';
	currentCategoryName = '';
	editAllStatus = true;
	disabledApiButton = false;
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
		this.getCategoryOne();
	}

	getCategoryOne() {
		this.commonAPIService.getCategoryOne({}).subscribe((res: any) => {
			if (res) {
				this.categoryOneArray = [];
				this.categoryOneArray = res;
			}
		});
	}
	getCategoryOneName(cat_id) {
		const findex = this.categoryOneArray.findIndex(e => Number(e.cat_id) === Number(cat_id));
		if (findex !== -1) {
			return this.categoryOneArray[findex].cat_name;
		}
	}

	getDaysInMonth(month, year) {
		return new Date(year, month, 0).getDate();
	};

	getEmployeeDetail() {
		if (this.searchForm.value.month_id) {
			var no_of_days = this.getDaysInMonth(this.searchForm.value.month_id, new Date().getFullYear());
			let inputJson = {
				month_id: this.searchForm.value.month_id,
				emp_status: this.searchForm.value.status_id,
				emp_cat_id: this.searchForm.value.cat_id,
				session_id: this.session_id,
				from_attendance : true
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
					let j = 0;
					//console.log('result', result);
					for (const item of result) {
						var emp_month;
						var emp_leave_approved;
						var emp_attendance_detail;
						var total_leave_closing_balance = 0;
						var curr_total_leave_closing_balance = 0;
						var leave_credited_count = 0;
						if (item.emp_month_attendance_data) {
							if (item.emp_month_attendance_data && (Number(item.emp_month_attendance_data.ses_id) === Number(this.session_id.ses_id))) {
								total_leave_closing_balance += (item.emp_month_attendance_data.leave_opening_balance ? item.emp_month_attendance_data.leave_opening_balance : 0);
							}
							if (item.emp_month_attendance_data.month_data) {
								for (var i = 0; i < item.emp_month_attendance_data.month_data.length; i++) {
									emp_month = item.emp_month_attendance_data.month_data[i].month_id;
									emp_attendance_detail = item.emp_month_attendance_data.month_data[i].attendance_detail;
									if (emp_attendance_detail && (Number(item.emp_month_attendance_data.ses_id) === Number(this.session_id.ses_id))) {
										if (parseInt(this.searchForm.value.month_id, 10) > parseInt(emp_month, 10)) {
											total_leave_closing_balance = total_leave_closing_balance + (emp_attendance_detail && emp_attendance_detail.emp_leave_credited ? emp_attendance_detail.emp_leave_credited : 0) - parseFloat(emp_attendance_detail && emp_attendance_detail.emp_leave_granted ? emp_attendance_detail.emp_leave_granted : 0);
										}
										if (parseInt(this.searchForm.value.month_id, 10) === parseInt(emp_month, 10)) {
											curr_total_leave_closing_balance = (emp_attendance_detail && emp_attendance_detail.emp_leave_credited ? emp_attendance_detail.emp_leave_credited : 0) - parseFloat(emp_attendance_detail && emp_attendance_detail.emp_leave_granted ? emp_attendance_detail.emp_leave_granted : 0);

											leave_credited_count = (emp_attendance_detail && emp_attendance_detail.emp_leave_credited ? emp_attendance_detail.emp_leave_credited : 0);

											total_leave_closing_balance = Number(total_leave_closing_balance) + Number(leave_credited_count);
										}
									}
									emp_leave_approved = item.emp_month_attendance_data.month_data[i].attendance_detail && item.emp_month_attendance_data.month_data[i].attendance_detail.emp_leave_approved ? item.emp_month_attendance_data.month_data[i].attendance_detail.emp_leave_approved : ''
								}
							}

						}

						// console.log('total_leave_closing_balance', total_leave_closing_balance);
						// console.log('curr_total_leave_closing_balance', curr_total_leave_closing_balance);

						element = {
							srno: pos,
							emp_id: item.emp_id,
							emp_name: item.emp_name,
							emp_designation: item.emp_designation_detail ? item.emp_designation_detail.name : '',
							emp_bol: total_leave_closing_balance,
							emp_present: no_of_days,
							emp_balance_leaves: curr_total_leave_closing_balance,
							emp_leave_credited: leave_credited_count,
							emp_status: item.emp_status ? item.emp_status : 'live',
							viewFlag: true,
							action: item,
							emp_leave_approved: emp_leave_approved

						};
						if (item.emp_month_attendance_data && item.emp_month_attendance_data.month_data && item.emp_month_attendance_data.month_data.length > 0) {
							this.formGroupArray[j] = {
								formGroup: this.fbuild.group({
									emp_id: item.emp_id,
									//emp_present: item.emp_present ? item.emp_present : 30,
									emp_leave_granted: item.emp_leave_granted ? item.emp_leave_granted : '',
									emp_remarks: item.emp_remarks ? item.emp_remarks : '',
									emp_leave_availed: '',
									emp_total_attendance: '',
									emp_balance_leaves: '0',
									emp_lwp: '',
									emp_leave_approved: item.emp_leave_approved ? item.emp_leave_approved : '',
								})
							}
							for (var i = 0; i < item.emp_month_attendance_data.month_data.length; i++) {
								emp_month = item.emp_month_attendance_data.month_data[i].month_id;
								emp_attendance_detail = item.emp_month_attendance_data.month_data[i];
								if (emp_attendance_detail && (Number(item.emp_month_attendance_data.ses_id) === Number(this.session_id.ses_id))) {
									if (parseInt(this.searchForm.value.month_id, 10) === parseInt(emp_month, 10)) {
										var tPresent = emp_attendance_detail && emp_attendance_detail.attendance_detail ? emp_attendance_detail.attendance_detail.emp_present : 0;
								var lwpDays =  emp_attendance_detail && emp_attendance_detail.attendance_detail ? emp_attendance_detail.attendance_detail.emp_lwp : 0;
								var presentDays =Number(lwpDays) < 0  ? (Number(tPresent) + Number(lwpDays)) : tPresent;
										element.emp_lwp = emp_attendance_detail && emp_attendance_detail.attendance_detail ? emp_attendance_detail.attendance_detail.emp_lwp : '';
										if (item.emp_status === 'live') {
										element.emp_total_attendance = presentDays;
										}
										if (item.emp_status === 'left') {
											const month: any = item.emp_salary_detail.emp_organisation_relation_detail.dol ?
											new Date(item.emp_salary_detail.emp_organisation_relation_detail.dol).getMonth() : ''
											if (Number(inputJson.month_id) === Number(month) + 1) {
												element.emp_total_attendance = new Date(item.emp_salary_detail.emp_organisation_relation_detail.dol).getDate();
											} else {
												element.emp_total_attendance = presentDays;
											}
										}
										element.emp_present = emp_attendance_detail.attendance_detail.emp_present ? emp_attendance_detail.attendance_detail.emp_present : no_of_days,
											element.viewFlag = emp_attendance_detail.attendance_detail.emp_total_attendance ? false : true
										this.formGroupArray[j] = {
											formGroup: this.fbuild.group({
												emp_id: item.emp_id,
												emp_leave_granted: emp_attendance_detail.attendance_detail.emp_leave_granted ? emp_attendance_detail.attendance_detail.emp_leave_granted : '',
												emp_remarks: emp_attendance_detail.attendance_detail.emp_remarks ? emp_attendance_detail.attendance_detail.emp_remarks : '',
												emp_leave_availed: emp_attendance_detail.attendance_detail.emp_leave_availed ? emp_attendance_detail.attendance_detail.emp_leave_availed : '',
												emp_total_attendance: emp_attendance_detail.attendance_detail.emp_total_attendance ? emp_attendance_detail.attendance_detail.emp_total_attendance : '',
												emp_balance_leaves: emp_attendance_detail.attendance_detail.emp_balance_leaves ? emp_attendance_detail.attendance_detail.emp_balance_leaves : '',
												emp_lwp: emp_attendance_detail.attendance_detail.emp_lwp ? emp_attendance_detail.attendance_detail.emp_lwp : '',
												emp_leave_approved: emp_attendance_detail.attendance_detail.emp_leave_approved ? emp_attendance_detail.attendance_detail.emp_leave_approved : '',


											})
										}
									}
								}

							}
							//console.log('this.formGroupArray[j]', this.formGroupArray);
						} else {
							emp_attendance_detail = {};
							this.formGroupArray[j] = {
								formGroup: this.fbuild.group({
									emp_id: item.emp_id,
									//emp_present: '',
									emp_leave_granted: '',
									emp_remarks: '',
									emp_leave_availed: '',
									emp_total_attendance: '',
									emp_balance_leaves: 0,
									emp_lwp: '',
									emp_leave_approved: '1'
								})
							}
						}
						// this.getLWP(element, pos);
						this.EMPLOYEE_ELEMENT.push(element);
						pos++;
						j++;

					}
					this.COPY_EMPLOYEE_ELEMENT = JSON.parse(JSON.stringify(this.EMPLOYEE_ELEMENT));
					this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
					this.employeedataSource.paginator = this.paginator;
					if (this.sort) {
						this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
						this.employeedataSource.sort = this.sort;
					}
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please Choose Atlease one month', 'error');
		}

	}

	saveEmployeeAttendance() {
		this.disabledApiButton = true;
		let inputJson = {};
		let employeeArrData = [];
		for (var i = 0; i < this.EMPLOYEE_ELEMENT.length; i++) {
			var flag = false;
			if (this.employeeData[i]['emp_month_attendance_data'] && this.employeeData[i]['emp_month_attendance_data']['leave_opening_balance'] && this.employeeData[i]['emp_month_attendance_data']['leave_opening_balance'] > 0) {
				inputJson = { "ses_id": this.session_id.ses_id, 'leave_opening_balance': this.employeeData[i]['emp_month_attendance_data']['leave_opening_balance'] };
			} else {
				inputJson = { "ses_id": this.session_id.ses_id, 'leave_opening_balance': 0 };
			}

			inputJson["month_data"] = [];
			var monthJson = {
				"month_id": this.searchForm.value.month_id,
				"month_name": this.currentMonthName,
				"attendance_detail": {
					//"emp_present": this.formGroupArray[i].formGroup.value.emp_present,
					"emp_present": this.EMPLOYEE_ELEMENT[i]['emp_present'],
					"emp_leave_granted": this.formGroupArray[i].formGroup.value.emp_leave_granted,
					"emp_remarks": this.formGroupArray[i].formGroup.value.emp_remarks,
					"emp_leave_availed": this.formGroupArray[i].formGroup.value.emp_leave_availed,
					"emp_lwp": this.EMPLOYEE_ELEMENT[i]['emp_lwp'],
					"emp_total_attendance": this.EMPLOYEE_ELEMENT[i]['emp_total_attendance'],
					"emp_balance_leaves": Number(this.EMPLOYEE_ELEMENT[i]['emp_bol']) - Number(this.formGroupArray[i].formGroup.value.emp_leave_granted),
					"emp_leave_credited": this.EMPLOYEE_ELEMENT[i]['emp_leave_credited'],
					"emp_leave_approved": this.EMPLOYEE_ELEMENT[i]['emp_leave_approved'],
				}
			};

			if (Number(this.EMPLOYEE_ELEMENT[i]['emp_id']) === Number(this.formGroupArray[i].formGroup.value.emp_id)) {
				if (this.employeeData[i]['emp_month_attendance_data'] && this.employeeData[i]['emp_month_attendance_data']['month_data']) {
					for (var j = 0; j < this.employeeData[i]['emp_month_attendance_data']['month_data'].length; j++) {
						if (parseInt(this.employeeData[i]['emp_month_attendance_data']['month_data'][j].month_id, 10) === parseInt(this.searchForm.value.month_id, 10)) {
							flag = true;
						}
					}
					if (this.employeeData[i]['emp_month_attendance_data']['month_data'].length > 0 && flag) {
						for (var j = 0; j < this.employeeData[i]['emp_month_attendance_data']['month_data'].length; j++) {
							if (parseInt(this.employeeData[i]['emp_month_attendance_data']['month_data'][j].month_id, 10) === parseInt(this.searchForm.value.month_id, 10)) {
								this.employeeData[i]['emp_month_attendance_data']['month_data'][j] = monthJson;
							}
						}
					} else {
						//inputJson["session_id"]["month_data"].push(monthJson);
						this.employeeData[i]['emp_month_attendance_data']['month_data'].push(monthJson);
					}
				} else {
					inputJson["month_data"].push(monthJson);
					this.employeeData[i]['emp_month_attendance_data'] = inputJson;
				}

			}
		}
		this.commonAPIService.updateEmployee(this.employeeData).subscribe((result: any) => {
			if (result) {
				this.disabledApiButton = false;
				this.commonAPIService.showSuccessErrorMessage('Employee Attendance Updated Successfully', 'success');
			} else {
				this.disabledApiButton = false;
				this.commonAPIService.showSuccessErrorMessage('Error While Updating Employee Attendance', 'success');
			}
		});
	}

	resetEmployeeAttendance() {
		this.getEmployeeDetail();
	}

	editAttendance(element) {
		for (var i = 0; i < this.EMPLOYEE_ELEMENT.length; i++) {
			if (this.EMPLOYEE_ELEMENT[i]['emp_id'] === element.emp_id) {
				element.viewFlag = true;
				element.updateFlag = true;
			}
		}
	}

	editAll() {
		this.editAllStatus = false;
		for (var i = 0; i < this.EMPLOYEE_ELEMENT.length; i++) {
			if (!this.EMPLOYEE_ELEMENT[i]['viewFlag']) {
				this.EMPLOYEE_ELEMENT[i]['viewFlag'] = true;
				this.EMPLOYEE_ELEMENT[i]['updateFlag'] = true;
			}

		}
		//this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
	}

	resetAll() {
		this.editAllStatus = true;
		this.getEmployeeDetail();
	}
	getLWP(element, index) {
		if (parseInt(this.formGroupArray[index].formGroup.value.emp_leave_granted,10) > parseInt(this.formGroupArray[index].formGroup.value.emp_leave_availed,10)) {
			this.EMPLOYEE_ELEMENT[index]['emp_lwp'] ="0";
			this.formGroupArray[index].formGroup.patchValue({
				emp_leave_granted:0,
				emp_leave_availed:0
			});
			this.commonAPIService.showSuccessErrorMessage('You cannot grant more leave than availed','error');
		} else       {
			this.EMPLOYEE_ELEMENT[index]['emp_lwp'] = (parseInt(this.formGroupArray[index].formGroup.value.emp_leave_availed ? this.formGroupArray[index].formGroup.value.emp_leave_availed : '0', 10) - parseInt(this.formGroupArray[index].formGroup.value.emp_leave_granted ? this.formGroupArray[index].formGroup.value.emp_leave_granted : '0', 10)).toString();


		// var tPresent = element ? element.emp_present : 0;
		// var lwpDays =  element && element ? element.emp_lwp : 0;
		// var presentDays =Number(lwpDays) < 0  ? (Number(tPresent) + Number(lwpDays)) : tPresent;
		// element.emp_lwp = element && element ? element.emp_lwp : '';
		// element.emp_total_attendance = presentDays;
		 this.EMPLOYEE_ELEMENT[index]['emp_total_attendance'] = (parseInt(element.emp_present, 10) - parseInt(this.EMPLOYEE_ELEMENT[index]['emp_lwp'])).toString();
		//this.EMPLOYEE_ELEMENT[index]['emp_total_attendance'] = presentDays;

		console.log(element.emp_present, this.EMPLOYEE_ELEMENT[index]['emp_lwp']);
		}
		
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

	cancelUpdate(element) {
		// this.getEmployeeDetail();

		for (var i = 0; i < this.EMPLOYEE_ELEMENT.length; i++) {
			if (Number(this.EMPLOYEE_ELEMENT[i]['emp_id']) === Number(element.emp_id)) {
				this.EMPLOYEE_ELEMENT[i] = this.COPY_EMPLOYEE_ELEMENT[i];
			}
		}

		element.updateFlag = false;
		element.viewFlag = false;
	}

	updateAttendance(element) {
		let inputJson = {};
		let employeeArrData = [];
		for (var i = 0; i < this.EMPLOYEE_ELEMENT.length; i++) {
			if (Number(this.EMPLOYEE_ELEMENT[i]['emp_id']) === Number(element.emp_id)) {
				inputJson = {
					"month_id": this.searchForm.value.month_id,
					"month_name": this.currentMonthName,
					"attendance_detail": {
						//"emp_present": this.formGroupArray[i].formGroup.value.emp_present,
						"emp_present": this.EMPLOYEE_ELEMENT[i]['emp_present'],
						"emp_leave_granted": this.formGroupArray[i].formGroup.value.emp_leave_granted,
						"emp_remarks": this.formGroupArray[i].formGroup.value.emp_remarks,
						"emp_leave_availed": this.formGroupArray[i].formGroup.value.emp_leave_availed,
						"emp_lwp": this.EMPLOYEE_ELEMENT[i]['emp_lwp'],
						"emp_total_attendance": this.EMPLOYEE_ELEMENT[i]['emp_total_attendance'],
						"emp_balance_leaves": this.EMPLOYEE_ELEMENT[i]['emp_balance_leaves'],
						"emp_leave_approved": this.EMPLOYEE_ELEMENT[i]['emp_leave_approved'],
					}
				};
				if (this.EMPLOYEE_ELEMENT[i]['action'] && this.EMPLOYEE_ELEMENT[i]['action']['emp_month_attendance_data'] && this.EMPLOYEE_ELEMENT[i]['action']['emp_month_attendance_data']['month_data']) {
					for (var j = 0; j < this.EMPLOYEE_ELEMENT[i]['action']['emp_month_attendance_data']['month_data'].length; j++) {
						if (parseInt(this.EMPLOYEE_ELEMENT[i]['action']['emp_month_attendance_data']['month_data'][j].month_id, 10) === parseInt(this.searchForm.value.month_id, 10)) {
							this.EMPLOYEE_ELEMENT[i]['action']['emp_month_attendance_data']['month_data'][j] = inputJson;
							employeeArrData.push(this.EMPLOYEE_ELEMENT[i]['action']);
						}
					}
				}

			}
		}
		if (employeeArrData.length > 0) {
			this.commonAPIService.updateEmployee(employeeArrData).subscribe((result: any) => {
				if (result) {
					this.commonAPIService.showSuccessErrorMessage('Employee Attendance Updated Successfully', 'success');
					this.getEmployeeDetail();
				} else {
					this.commonAPIService.showSuccessErrorMessage('Error While Updating Employee Attendance', 'success');
				}

			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Error While Updating Employee Attendance', 'success');
		}

	}

	applyFilter(filterValue: String) {
		//console.log('filterValue', filterValue);
		this.employeedataSource.filter = filterValue.trim().toLowerCase();
	}

}

export interface EmployeeElement {
	srno: number;
	emp_id: string;
	emp_name: string;
	emp_designation: string;
	//emp_present: any;
	emp_leave_availed: string;
	emp_leave_granted: any;
	emp_lwp: string;
	emp_total_attendance: string;
	emp_balance_leaves: string;
	emp_remarks: any;
	emp_status: string;
	action: any;
}

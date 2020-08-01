import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl,MatDialog } from '@angular/material';
import {LeaveCreditComponent} from './leave-credit/leave-credit.component';
@Component({
	selector: 'app-employee-leave',
	templateUrl: './employee-leave.component.html',
	styleUrls: ['./employee-leave.component.scss']
})
export class EmployeeLeaveComponent implements OnInit {
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	searchForm: FormGroup;
	employeeForm: FormGroup;
	employeeData: any;
	EMPLOYEE_ELEMENT: EmployeeElement[] = [];
	session_id;
	allEmployeeData: any[] = [];
	tmpAllEmployeeData: any;
	tempEmpData: any[] = [];
	employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
	leave_opening_balance = 0;
	//'leave_opening_balance',
	displayedEmployeeColumns: string[] = ['srno', 'month_name', 'leave_credited', 'leave_availed', 'leave_granted', 'lwp', 'leave_closing_balance'];
	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private dialog: MatDialog
	) { }

	ngOnInit() {
		this.buildForm();
		this.getAllEmployee();
	}

	buildForm() {
		this.searchForm = this.fbuild.group({
			emp_id: '',
			emp_name: ''
		});
	}

	getAllEmployee() {
		this.commonAPIService.getAllEmployee({}).subscribe((result: any) => {
			this.allEmployeeData = result;
			this.tempEmpData = result;
			this.tmpAllEmployeeData = result;
			this.employeeData = {};
		});
	}

	getFilterEmployee(event) {
		var tempArr = [];
console.log(event.target.value);
		if (event.target.value.length > 2) {
			const filterVal = event.target.value;
			this.allEmployeeData = this.tempEmpData.filter(f => {
				console.log(f);
				return (f.emp_name.toLowerCase()).includes(filterVal)
			})
		} else {
			this.allEmployeeData = this.tempEmpData;
		}
	}

	getEmployeeDetail() {
		let inputJson = {};
		this.allEmployeeData = [];
		this.tempEmpData = [];
		if (this.searchForm.value && this.searchForm.value.emp_id && this.searchForm.value.emp_name) {
			inputJson = {
				emp_code_no: this.searchForm.value.emp_id
			}
		}

		this.commonAPIService.getEmployeeDetail(inputJson).subscribe((result: any) => {
			let element: any = {};
			let recordArray = [];
			this.employeeData = result;
			element = {};
			this.EMPLOYEE_ELEMENT = [];
			this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
			if (result) {
				let pos = 1;
				let recordArray = result;
				var total_leave_credited = 0;
				var total_leave_availed = 0;
				var total_leave_granted = 0;
				var total_leave_closing_balance = 0;
				var total_lwp = 0;

				this.leave_opening_balance = result.emp_month_attendance_data ? result.emp_month_attendance_data.leave_opening_balance : 0;

				if (result.emp_month_attendance_data && result.emp_month_attendance_data.month_data) {
					for (var i = 0; i < result.emp_month_attendance_data.month_data.length; i++) {
						var emp_month = result.emp_month_attendance_data.month_data[i].month_id;
						var emp_attendance_detail = result.emp_month_attendance_data.month_data[i].attendance_detail;
						let leave_credited = 0;
						if (emp_attendance_detail.emp_leave_credited && emp_attendance_detail.emp_leave_credited.length > 0) {
							for (let item of emp_attendance_detail.emp_leave_credited) {
								leave_credited = leave_credited + item.leave_credit_count;
							}
						}
						element = {
							srno: pos,
							month_name: result.emp_month_attendance_data.month_data[i].month_name,
							leave_credited: emp_attendance_detail && emp_attendance_detail.emp_leave_credited ? leave_credited.toFixed() : 0,
							leave_availed: emp_attendance_detail && emp_attendance_detail.emp_leave_availed ? emp_attendance_detail.emp_leave_availed : 0,
							leave_granted: emp_attendance_detail && emp_attendance_detail.emp_leave_granted ? emp_attendance_detail.emp_leave_granted : 0,
							lwp: emp_attendance_detail && emp_attendance_detail.emp_lwp ? emp_attendance_detail.emp_lwp : 0,
							leave_closing_balance: (emp_attendance_detail && emp_attendance_detail.emp_leave_credited ? Number(leave_credited.toFixed()) : 0) - parseFloat(emp_attendance_detail && emp_attendance_detail.emp_leave_granted ? emp_attendance_detail.emp_leave_granted : 0)
						};
						total_leave_credited = total_leave_credited + Number(leave_credited.toFixed());
						total_leave_availed = total_leave_availed + parseFloat(emp_attendance_detail.emp_leave_availed ? emp_attendance_detail.emp_leave_availed : 0);
						total_leave_granted = total_leave_granted + parseFloat(emp_attendance_detail.emp_leave_granted ? emp_attendance_detail.emp_leave_granted : 0);
						total_lwp = total_lwp + parseFloat(emp_attendance_detail && emp_attendance_detail.emp_lwp ? emp_attendance_detail.emp_lwp : 0);
						total_leave_closing_balance = total_leave_closing_balance + Number(leave_credited.toFixed()) - parseFloat(emp_attendance_detail && emp_attendance_detail.emp_leave_granted ? emp_attendance_detail.emp_leave_granted : 0)
						this.EMPLOYEE_ELEMENT.push(element);
						pos++;
					}
				}


				var total_closing_balance = Number(this.leave_opening_balance) + Number(total_leave_closing_balance);

				var lastRow = {
					srno: 'Grand Total',
					month_name: '',
					leave_opening_balance: '',
					leave_credited: '<b>' + total_leave_credited + '</b>',
					leave_availed: '<b>' + total_leave_availed + '</b>',
					leave_granted: '<b>' + total_leave_granted + '</b>',
					lwp: '<b>' + total_lwp + '</b>',
					leave_closing_balance: '<b>' + total_closing_balance + '</b>'
				}
				this.EMPLOYEE_ELEMENT.push(lastRow);
				this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
				this.employeedataSource.paginator = this.paginator;
				if (this.sort) {
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.employeedataSource.sort = this.sort;
				}
				console.log(this.tempEmpData);
			} else {
				let element: any = {};
				let recordArray = [];
				this.employeeData = {};
				this.EMPLOYEE_ELEMENT = [];
				this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
			}
		});


	}

	setEmployeeId(empDetails) {
		console.log('empDetails', empDetails);
		this.searchForm.patchValue({
			emp_id: empDetails.emp_code_no,
			emp_name: empDetails.emp_name,
		});
		this.allEmployeeData = this.tmpAllEmployeeData;
		this.getEmployeeDetail();
	}


	applyFilter(filterValue: string) {
		this.employeedataSource.filter = filterValue.trim().toLowerCase();
	}
	openLeaveCredit(){
		const dialogRef: any = this.dialog.open(LeaveCreditComponent, {
			data: this.employeeData.emp_month_attendance_data,
			height: '50%',
			width: '40%'
		})
	}

}

export interface EmployeeElement {
	srno: any;
	month_name: string;
	// leave_opening_balance: string;
	leave_credited: string;
	leave_availed: any;
	leave_granted: any;
	lwp: string;
	leave_closing_balance: string;
}
